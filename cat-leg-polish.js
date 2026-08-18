// 3D Printer Online — direct GitHub Pages cat-leg hotfix
// Keeps the 4.1 runtime/version contract intact while improving the current unified cat meshes.
(function(){
  const originalPrepare = window.prepareModel;
  if(typeof originalPrepare !== 'function') return;

  const CAT_IDS = new Set(['british','siamese','tabby','maine','bengal']);
  const CONFIG = {
    british:{compress:.70, influence:.235, ankle:.94, upper:1.34, pawX:.90, pawZ:1.16, bend:.045},
    siamese:{compress:.74, influence:.205, ankle:.88, upper:1.22, pawX:.82, pawZ:1.14, bend:.052},
    tabby:{compress:.72, influence:.220, ankle:.91, upper:1.28, pawX:.86, pawZ:1.15, bend:.048},
    maine:{compress:.72, influence:.245, ankle:.96, upper:1.38, pawX:.94, pawZ:1.20, bend:.045},
    bengal:{compress:.75, influence:.210, ankle:.89, upper:1.24, pawX:.83, pawZ:1.16, bend:.055}
  };

  function median(a){
    const b=a.slice().sort((x,y)=>x-y), n=b.length;
    return n%2?b[(n-1)/2]:(b[n/2-1]+b[n/2])/2;
  }

  function polishGeometry(mesh, cfg){
    if(!mesh.geometry || !mesh.geometry.attributes || !mesh.geometry.attributes.position) return;
    mesh.geometry = mesh.geometry.clone();
    const pos = mesh.geometry.attributes.position;
    mesh.geometry.computeBoundingBox();
    const bb = mesh.geometry.boundingBox;
    const minY=bb.min.y, maxY=bb.max.y, height=Math.max(.001,maxY-minY);
    const lowCut=minY+height*.145;
    const topCut=minY+height*.545;

    const groups={nw:[],ne:[],sw:[],se:[]};
    for(let i=0;i<pos.count;i++){
      const x=pos.getX(i), y=pos.getY(i), z=pos.getZ(i);
      if(y>lowCut || Math.abs(x)<.045) continue;
      const k=(x<0?'w':'e')+(z<0?'s':'n');
      groups[k].push([x,z]);
    }

    const centers={};
    for(const k of Object.keys(groups)){
      const pts=groups[k];
      if(pts.length<3) continue;
      centers[k]=[median(pts.map(p=>p[0])),median(pts.map(p=>p[1]))];
    }
    if(Object.keys(centers).length<4) return;

    const anchor=minY+height*.515;
    for(let i=0;i<pos.count;i++){
      let x=pos.getX(i), y=pos.getY(i), z=pos.getZ(i);
      if(y>topCut || Math.abs(x)<.035) continue;
      const k=(x<0?'w':'e')+(z<0?'s':'n');
      const c=centers[k];
      if(!c) continue;
      const cx=c[0], cz=c[1], dx=x-cx, dz=z-cz;
      const dist=Math.hypot(dx,dz);
      if(dist>cfg.influence) continue;

      // Main screenshot fix: shorten the straight "stilts" while keeping the hip/shoulder anchored.
      if(y<anchor) y = anchor - (anchor-y)*cfg.compress;

      const legT=Math.max(0,Math.min(1,(y-(minY+height*.12))/(height*.40)));
      let sx,sz;
      if(legT<.20){
        // Small flattened feline paw, not a separate block.
        const t=legT/.20;
        sx=cfg.pawX+(cfg.ankle-cfg.pawX)*t;
        sz=cfg.pawZ+(.98-cfg.pawZ)*t;
        y=minY+height*.115+(y-(minY+height*.115))*.70;
      }else if(legT<.58){
        // Slim ankle with a little taper.
        const t=(legT-.20)/.38;
        sx=cfg.ankle+(.99-cfg.ankle)*t;
        sz=(cfg.ankle+.03)+(1.01-(cfg.ankle+.03))*t;
      }else{
        // Stronger shoulder/hip transition so the leg grows from the torso.
        const t=(legT-.58)/.42;
        sx=.99+(cfg.upper-.99)*t;
        sz=1.01+(cfg.upper-1.01)*t;
      }

      x=cx+dx*sx;
      z=cz+dz*sz;

      // Add a readable feline bend instead of a perfectly vertical post.
      const direction=cz>=0?1:-1;
      const bendBand=Math.exp(-Math.pow((legT-.42)/.23,2));
      const pawBand=Math.max(0,1-legT/.42);
      z += direction*(cfg.bend*bendBand + cfg.bend*.45*pawBand);

      // Slight natural outward stance only at the foot.
      if(legT<.28) x += (x>=0?1:-1)*.010*(1-legT/.28);

      pos.setXYZ(i,x,y,z);
    }
    pos.needsUpdate=true;
    mesh.geometry.computeVertexNormals();
    mesh.geometry.computeBoundingBox();
    mesh.geometry.computeBoundingSphere();
  }

  window.prepareModel = function(raw,v){
    if(v && CAT_IDS.has(v.id)){
      const cfg=CONFIG[v.id]||CONFIG.tabby;
      raw.traverse(o=>{
        if(!o.isMesh) return;
        const name=(o.name||'').toLowerCase();
        if(name.includes('cat_unified_body') || name==='body') polishGeometry(o,cfg);
      });
      raw.updateMatrixWorld(true);
    }
    return originalPrepare(raw,v);
  };
})();
