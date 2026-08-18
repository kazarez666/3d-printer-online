// 3D Printer Online — safe post-load cat polish
// Important: this script NEVER participates in asset loading or prepareModel.
// Models are already loaded and prepared before this code touches geometry.
(function(){
  'use strict';

  const CAT_IDS=new Set(['british','siamese','tabby','maine','bengal']);
  const CFG={
    british:{legCompress:.78,ankle:.88,pawX:.76,pawZ:1.08,upper:1.18,bend:.040,stance:.010},
    siamese:{legCompress:.80,ankle:.82,pawX:.70,pawZ:1.10,upper:1.13,bend:.050,stance:.008},
    tabby:{legCompress:.79,ankle:.85,pawX:.73,pawZ:1.09,upper:1.16,bend:.044,stance:.010},
    maine:{legCompress:.79,ankle:.90,pawX:.79,pawZ:1.12,upper:1.21,bend:.042,stance:.012},
    bengal:{legCompress:.81,ankle:.83,pawX:.71,pawZ:1.11,upper:1.14,bend:.052,stance:.009}
  };

  function median(a){
    if(!a.length)return 0;
    const b=a.slice().sort((x,y)=>x-y),n=b.length,m=n>>1;
    return n%2?b[m]:(b[m-1]+b[m])*.5;
  }

  function findLegCenters(pos,bb){
    const h=Math.max(.001,bb.max.y-bb.min.y);
    const low=bb.min.y+h*.16;
    const groups={ln:[],lf:[],rn:[],rf:[]};
    for(let i=0;i<pos.count;i++){
      const x=pos.getX(i),y=pos.getY(i),z=pos.getZ(i);
      if(y>low||Math.abs(x)<.035)continue;
      const k=(x<0?'l':'r')+(z<0?'n':'f');
      groups[k].push([x,z]);
    }
    const out={};
    for(const k in groups){
      const pts=groups[k];
      if(pts.length<3)continue;
      out[k]=[median(pts.map(p=>p[0])),median(pts.map(p=>p[1]))];
    }
    return out;
  }

  function polishStructuralMesh(mesh,id){
    const src=mesh.geometry;
    if(!src||!src.attributes||!src.attributes.position)return;

    const g=src.clone();
    const pos=g.attributes.position;
    g.computeBoundingBox();
    const bb=g.boundingBox;
    const h=Math.max(.001,bb.max.y-bb.min.y);
    const w=Math.max(.001,bb.max.x-bb.min.x);
    const cfg=CFG[id]||CFG.tabby;
    const centers=findLegCenters(pos,bb);
    if(Object.keys(centers).length!==4)return;

    const hipY=bb.min.y+h*.515;
    const topY=bb.min.y+h*.56;
    const radius=Math.max(.14,w*.22);

    for(let i=0;i<pos.count;i++){
      let x=pos.getX(i),y=pos.getY(i),z=pos.getZ(i);
      if(y>topY||Math.abs(x)<.03)continue;

      const k=(x<0?'l':'r')+(z<0?'n':'f');
      const c=centers[k];
      if(!c)continue;
      const cx=c[0],cz=c[1];
      let dx=x-cx,dz=z-cz;
      if(Math.hypot(dx,dz)>radius)continue;

      // Shorten the long straight posts while keeping the upper leg anchored.
      if(y<hipY)y=hipY-(hipY-y)*cfg.legCompress;

      const t=Math.max(0,Math.min(1,(y-(bb.min.y+h*.11))/(h*.43)));
      let sx=1,sz=1;

      if(t<.22){
        // Compact feline paw: small width, slightly longer front-to-back.
        const q=t/.22;
        sx=cfg.pawX+(cfg.ankle-cfg.pawX)*q;
        sz=cfg.pawZ+(cfg.ankle+.05-cfg.pawZ)*q;
        const sole=bb.min.y+h*.105;
        y=sole+(y-sole)*.72;
      }else if(t<.62){
        // Tapered lower leg / ankle.
        const q=(t-.22)/.40;
        sx=cfg.ankle+(1-cfg.ankle)*q;
        sz=(cfg.ankle+.05)+(1-(cfg.ankle+.05))*q;
      }else{
        // Broader shoulder / hip transition so the leg grows from the torso.
        const q=(t-.62)/.38;
        sx=1+(cfg.upper-1)*q;
        sz=1+(cfg.upper-1)*q;
      }

      x=cx+dx*sx;
      z=cz+dz*sz;

      // Gentle feline bend instead of a vertical cylinder.
      const front=cz>=0?1:-1;
      const bend=Math.exp(-Math.pow((t-.43)/.21,2));
      z+=front*cfg.bend*bend;

      // Tiny stance adjustment only around the paw.
      if(t<.28){
        const q=1-t/.28;
        x+=(x<0?-1:1)*cfg.stance*q;
        z+=front*.008*q;
      }

      pos.setXYZ(i,x,y,z);
    }

    pos.needsUpdate=true;
    g.computeVertexNormals();
    g.computeBoundingBox();
    g.computeBoundingSphere();
    mesh.geometry=g;
  }

  function polishCat(root,id){
    try{
      if(!root||!CAT_IDS.has(id))return;
      root.traverse(o=>{
        if(!o||!o.isMesh)return;
        const n=(o.name||'').toLowerCase();
        if(n.includes('cat_unified_body'))polishStructuralMesh(o,id);

        // Cleaner collectible finish without adding geometry blobs.
        const mats=Array.isArray(o.material)?o.material:[o.material];
        mats.forEach(m=>{
          if(!m)return;
          if('roughness' in m)m.roughness=Math.max(.48,Math.min(.64,m.roughness??.58));
          if('metalness' in m)m.metalness=0;
          m.flatShading=true;
          m.needsUpdate=true;
        });
      });
      root.updateMatrixWorld(true);
    }catch(err){
      console.warn('Cat polish skipped safely:',err);
    }
  }

  function install(){
    try{
      if(typeof modelRoot==='undefined'||!modelRoot||typeof modelRoot.add!=='function')return;
      if(modelRoot.__safeCatPolishInstalled)return;
      modelRoot.__safeCatPolishInstalled=true;
      const originalAdd=modelRoot.add;
      modelRoot.add=function(...objects){
        const result=originalAdd.apply(this,objects);
        try{
          const id=(typeof current!=='undefined'&&current&&current.id)||'';
          if(CAT_IDS.has(id))objects.forEach(o=>polishCat(o,id));
        }catch(err){
          console.warn('Cat polish post-load hook skipped:',err);
        }
        return result;
      };
    }catch(err){
      console.warn('Cat polish install skipped:',err);
    }
  }

  install();
})();
