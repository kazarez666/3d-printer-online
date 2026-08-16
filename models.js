function buildCat(v){
 const g=new THREE.Group();const siam=v.kind==='siamese',bengal=v.kind==='bengal',maine=v.kind==='maine',brit=v.kind==='british';
 const fur=mkMat(v.base,{map:bengal?bengalTex:v.kind==='tabby'?tabbyTex:null,roughness:.42});const point=mkMat(0x4b3933,{roughness:.45}),cream=mkMat(0xeee3d2,{roughness:.44}),pink=mkMat(0xd58b91,{roughness:.4}),white=mkMat(0xf5f0e8,{roughness:.45}),iris=mkMat(bengal?0x77c85a:siam?0x67baff:0xa6bd74,{roughness:.12});
 const slim=siam||bengal,wide=brit?.04:maine?.025:0;
 loft(g,fur,[{p:-.66,cy:.71,rx:.27+wide,ry:.31},{p:-.45,cy:.73,rx:.31+wide,ry:.35},{p:-.16,cy:.75,rx:.30+wide,ry:.36},{p:.12,cy:.79,rx:.27+wide,ry:.34},{p:.35,cy:.84,rx:.235+wide,ry:.31},{p:.52,cy:.91,rx:.21+wide,ry:.28}], 'z',32);
 loft(g,siam?point:fur,[{p:.45,cy:.94,rx:.19,ry:.22},{p:.59,cy:1.08,rx:.21,ry:.23},{p:.72,cy:1.2,rx:slim?.245:.285,ry:slim?.26:.29},{p:.86,cy:1.23,rx:slim?.25:.295,ry:slim?.26:.3},{p:.98,cy:1.19,rx:.20,ry:.22}], 'z',30);
 organic(g,siam?point:cream,[-.105,1.14,.98],[.105,.07,.06],26);organic(g,siam?point:cream,[.105,1.14,.98],[.105,.07,.06],26);organic(g,pink,[0,1.12,1.045],[.033,.023,.025],20);organic(g,cream,[0,1.055,.985],[.085,.038,.055],22);
 const ear=siam?point:fur;part(g,new THREE.ConeGeometry(.13,maine?.36:.31,5),ear,[-.18,1.49,.73],[1,1,.7],[0,0,.08]);part(g,new THREE.ConeGeometry(.13,maine?.36:.31,5),ear,[.18,1.49,.73],[1,1,.7],[0,0,-.08]);
 organic(g,iris,[-.11,1.25,.955],[.054,.034,.022]);organic(g,iris,[.11,1.25,.955],[.054,.034,.022]);eye(g,[-.11,1.25,.974],0x07090b,.019);eye(g,[.11,1.25,.974],0x07090b,.019);
 const legMat=siam?point:fur,fr=slim?.045:.055,hr=slim?.052:.063;
 [-.16,.16].forEach(x=>{limb(g,legMat,[x,.68,.36],[x,.10,.42],fr);organic(g,legMat,[x,.07,.48],[.08,.042,.12],22)});[-.20,.20].forEach(x=>{organic(g,fur,[x,.57,-.42],[.15,.19,.17],24);limb(g,legMat,[x,.5,-.4],[x,.10,-.34],hr);organic(g,legMat,[x,.065,-.27],[.09,.045,.13],22)});
 const tailR=maine?.075:slim?.04:.052;tube(g,siam?point:fur,[[.22,.7,-.62],[.48,.76,-.84],[.62,1.02,-.8],[.55,1.27,-.58],[.42,1.38,-.42]],tailR);
 if(maine){organic(g,fur,[0,.91,.36],[.3,.28,.23],28);organic(g,fur,[-.27,1.22,.7],[.08,.13,.08],20);organic(g,fur,[.27,1.22,.7],[.08,.13,.08],20)}
 if(brit)organic(g,white,[0,.94,.48],[.18,.08,.06],22);
 if(bengal){const spot=mkMat(0x352319,{roughness:.5});[[-.24,.77,.35],[-.24,.86,.08],[-.22,.68,-.2],[.22,.79,.3],[.23,.88,.02],[.2,.7,-.32],[-.18,.95,.5],[.18,.96,.5]].forEach((p,i)=>organic(g,spot,p,[.044+(i%2)*.008,.017,.03],18))}
 g.position.y=baseY;g.visible=false;return g
}

function dinoLeg(g,m,x,z,heavy=false){organic(g,m,[x,.49,z],[heavy?.16:.135,.23,heavy?.135:.115],28);limb(g,m,[x,.43,z],[x-.035,.08,z],heavy?.075:.058);organic(g,m,[x+.08,.035,z],[heavy?.17:.14,.04,.075],22)}
function buildDino(v){
 const g=new THREE.Group();const skin=mkMat(v.base,{map:v.kind==='trex'?rexTex:null,roughness:.49}),belly=mkMat(0xbca977,{roughness:.54}),horn=mkMat(0xddd1b8,{roughness:.42}),darkm=mkMat(0x35402b,{roughness:.52}),mouth=mkMat(0x713d38,{roughness:.56}),tooth=mkMat(0xf3ead7,{roughness:.33}),eyeMat=mkMat(0xe0b74d,{roughness:.1});
 if(v.kind==='trex'){
  loft(g,skin,[{p:-.7,cy:.9,ry:.31,rz:.26},{p:-.45,cy:.94,ry:.39,rz:.30},{p:-.1,cy:.97,ry:.42,rz:.31},{p:.24,cy:1.04,ry:.36,rz:.28},{p:.5,cy:1.15,ry:.27,rz:.24}], 'x',32);
  loft(g,skin,[{p:.4,cy:1.16,ry:.23,rz:.22},{p:.62,cy:1.3,ry:.27,rz:.25},{p:.84,cy:1.42,ry:.29,rz:.27},{p:1.08,cy:1.43,ry:.25,rz:.25},{p:1.3,cy:1.38,ry:.18,rz:.2}], 'x',30);
  loft(g,mouth,[{p:.78,cy:1.29,ry:.075,rz:.22},{p:1.02,cy:1.26,ry:.07,rz:.22},{p:1.28,cy:1.25,ry:.055,rz:.17}], 'x',24);
  for(let i=0;i<6;i++){const xx=.85+i*.07;part(g,new THREE.ConeGeometry(.018,.085,6),tooth,[xx,1.25,.19],[1,1,1],[Math.PI,0,0]);part(g,new THREE.ConeGeometry(.018,.08,6),tooth,[xx,1.25,-.19],[1,1,1],[Math.PI,0,0])}
  organic(g,eyeMat,[.91,1.53,.25],[.043,.032,.022]);organic(g,eyeMat,[.91,1.53,-.25],[.043,.032,.022]);eye(g,[.92,1.53,.268],0x050505,.015);eye(g,[.92,1.53,-.268],0x050505,.015);
  dinoLeg(g,skin,-.32,.21,true);dinoLeg(g,skin,.14,-.21,true);limb(g,skin,[.45,1.03,.22],[.64,.86,.25],.045);limb(g,skin,[.45,1.03,-.22],[.64,.86,-.25],.045);limb(g,skin,[.64,.86,.25],[.73,.81,.27],.026);limb(g,skin,[.64,.86,-.25],[.73,.81,-.27],.026);
  tube(g,skin,[[-.62,.91,0],[-1.08,.96,0],[-1.55,.87,0],[-2.02,.68,0],[-2.38,.49,0]],.105);organic(g,belly,[.06,.73,.27],[.34,.22,.035]);
 } else if(v.kind==='brachio'){
  loft(g,skin,[{p:-.7,cy:.72,ry:.27,rz:.26},{p:-.2,cy:.77,ry:.34,rz:.3},{p:.38,cy:.8,ry:.28,rz:.25}], 'x');tube(g,skin,[[.35,.83,0],[.52,1.35,0],[.66,1.83,0],[.82,2.13,0]],.095);organic(g,skin,[.95,2.17,0],[.2,.14,.14]);[-.4,.3].forEach(x=>[.18,-.18].forEach(z=>dinoLeg(g,skin,x,z)));tube(g,skin,[[-.62,.77,0],[-1.08,.88,0],[-1.52,.72,0]],.065)
 } else if(v.kind==='stego'){
  loft(g,skin,[{p:-.72,cy:.7,ry:.24,rz:.29},{p:-.25,cy:.78,ry:.31,rz:.31},{p:.35,cy:.8,ry:.27,rz:.28},{p:.72,cy:.8,ry:.18,rz:.2}], 'x');[-.48,-.24,0,.24,.48].forEach((x,i)=>part(g,new THREE.ConeGeometry(.11,.38+(.16-Math.abs(i-2)*.035),4),darkm,[x,1.15,0],[1,1,.8],[Math.PI/2,0,0]));[-.36,.28].forEach(x=>[.18,-.18].forEach(z=>dinoLeg(g,skin,x,z)));tube(g,skin,[[-.68,.7,0],[-1.08,.7,0],[-1.45,.58,0]],.062)
 } else if(v.kind==='tri'){
  loft(g,skin,[{p:-.72,cy:.7,ry:.25,rz:.3},{p:-.18,cy:.76,ry:.32,rz:.31},{p:.42,cy:.8,ry:.25,rz:.27}], 'x');organic(g,skin,[.68,.92,0],[.31,.21,.24]);part(g,new THREE.CylinderGeometry(.34,.25,.13,28),skin,[.48,1.16,0],[1,1,1],[0,0,Math.PI/2]);[.16,-.16].forEach(z=>part(g,new THREE.ConeGeometry(.05,.4,10),horn,[.93,1.02,z],[1,1,1],[0,0,-Math.PI/2]));part(g,new THREE.ConeGeometry(.04,.24,10),horn,[.96,.89,0],[1,1,1],[0,0,-Math.PI/2]);[-.35,.27].forEach(x=>[.19,-.19].forEach(z=>dinoLeg(g,skin,x,z)));tube(g,skin,[[-.68,.7,0],[-1.02,.66,0],[-1.32,.54,0]],.055)
 } else if(v.kind==='anky'){
  loft(g,skin,[{p:-.72,cy:.66,ry:.22,rz:.32},{p:-.15,cy:.72,ry:.28,rz:.35},{p:.44,cy:.72,ry:.22,rz:.29}], 'x');for(let x=-.48;x<=.48;x+=.24)for(const z of[-.27,.27])organic(g,darkm,[x,.98,z],[.065,.055,.065],18);[-.36,.28].forEach(x=>[.2,-.2].forEach(z=>dinoLeg(g,skin,x,z)));tube(g,skin,[[-.68,.66,0],[-1.04,.6,0],[-1.34,.5,0]],.075);organic(g,darkm,[-1.52,.47,0],[.2,.14,.18]);organic(g,skin,[.72,.74,0],[.18,.14,.17])
 } else if(v.kind==='spino'){
  loft(g,skin,[{p:-.7,cy:.78,ry:.26,rz:.27},{p:-.15,cy:.84,ry:.31,rz:.29},{p:.48,cy:.87,ry:.23,rz:.23}], 'x');for(let i=0;i<7;i++){const x=-.5+i*.17;part(g,new THREE.ConeGeometry(.035,.44+Math.sin(i/6*Math.PI)*.31,5),darkm,[x,1.28,0],[1,1,.8],[Math.PI/2,0,0])}organic(g,skin,[.62,1.06,0],[.3,.17,.17]);organic(g,skin,[.96,1.04,0],[.31,.09,.13]);dinoLeg(g,skin,-.33,.17);dinoLeg(g,skin,.24,-.17);tube(g,skin,[[-.64,.8,0],[-1.05,.81,0],[-1.48,.67,0]],.08)
 } else {
  loft(g,skin,[{p:-.68,cy:.72,ry:.24,rz:.27},{p:-.1,cy:.78,ry:.3,rz:.28},{p:.48,cy:.84,ry:.22,rz:.21}], 'x');organic(g,skin,[.62,1.02,0],[.25,.18,.19]);if(v.kind==='para')tube(g,darkm,[[.56,1.19,0],[.31,1.5,0],[-.02,1.58,0]],.055);dinoLeg(g,skin,-.34,.16);dinoLeg(g,skin,.27,-.16);tube(g,skin,[[-.64,.74,0],[-1.02,.75,0],[-1.38,.63,0]],.065)
 }
 g.position.y=baseY;g.visible=false;return g
}

function buildDuck(v){const g=new THREE.Group(),feather=mkMat(v.base,{roughness:.4}),beak=mkMat(v.kind==='ugly'?0x84694e:0xef8a31,{roughness:.36}),wing=mkMat(v.kind==='ugly'?0x313942:0xe9b92d,{roughness:.42}),white=mkMat(0xe7edf2);
 loft(g,feather,[{p:-.52,cy:.58,rx:.29,ry:.31},{p:-.22,cy:.62,rx:.38,ry:.36},{p:.15,cy:.66,rx:.41,ry:.36},{p:.45,cy:.78,rx:.32,ry:.29}], 'z',32);organic(g,feather,[0,1.08,.48],[.31,.29,.29],34);organic(g,wing,[-.32,.7,.02],[.09,.26,.32],28);organic(g,wing,[.32,.7,.02],[.09,.26,.32],28);part(g,new THREE.CylinderGeometry(.12,.09,.34,22),beak,[0,1.02,.78],[1,.48,1],[Math.PI/2,0,0]);eye(g,[-.12,1.17,.69],v.kind==='ugly'?0xe9eef5:0x111316,.031);eye(g,[.12,1.17,.69],v.kind==='ugly'?0xe9eef5:0x111316,.031);limb(g,beak,[-.13,.35,.1],[-.14,.09,.14],.033);limb(g,beak,[.13,.35,.1],[.14,.09,.14],.033);organic(g,beak,[-.14,.06,.2],[.14,.035,.08],20);organic(g,beak,[.14,.06,.2],[.14,.035,.08],20);if(v.kind==='ugly'){organic(g,white,[-.12,1.04,.72],[.08,.05,.025]);organic(g,white,[.12,1.04,.72],[.08,.05,.025])}g.position.y=baseY;g.visible=false;return g}

function buildGeneric(v,f){const g=new THREE.Group(),m=mkMat(v.base),d=mkMat(0x1c2229);if(f==='balls'){organic(g,m,[0,.72,0],[.72,.72,.72])}else if(f==='giraffes'){organic(g,m,[0,.63,0],[.55,.36,.32]);tube(g,m,[[.32,.78,0],[.42,1.35,0],[.46,1.9,0]],.12);organic(g,m,[.52,2,0],[.26,.2,.22]);[-.28,.22].forEach(x=>[.15,-.15].forEach(z=>limb(g,m,[x,.48,z],[x,.05,z],.07)))}else if(f==='cars'||f==='supercars'){part(g,new THREE.BoxGeometry(1.5,.38,.75),m,[0,.42,0]);part(g,new THREE.BoxGeometry(.8,.34,.66),m,[.05,.7,0]);[-.52,.48].forEach(x=>[-.36,.36].forEach(z=>part(g,new THREE.CylinderGeometry(.16,.16,.12,16),d,[x,.27,z],[1,1,1],[Math.PI/2,0,0])))}else if(f==='rockets'){part(g,new THREE.CylinderGeometry(.32,.4,1.7,20),m,[0,1,0]);part(g,new THREE.ConeGeometry(.32,.65,20),m,[0,2.15,0])}else if(f==='sharks'){organic(g,m,[0,.75,0],[1,.28,.36]);part(g,new THREE.ConeGeometry(.34,.7,3),m,[0,1.04,0]);tube(g,m,[[-.7,.74,0],[-1.1,.7,0],[-1.45,.66,0]],.08)}else{organic(g,m,[0,.8,0],[.65,.75,.5]);part(g,new THREE.BoxGeometry(.7,.55,.55),m,[0,1.55,0]);[-.28,.28].forEach(x=>limb(g,m,[x,.5,0],[x,.05,0],.1))}g.position.y=baseY;g.visible=false;return g}
function getModel(v,f){const k=f+'_'+v.id;if(meshCache[k])return meshCache[k];const g=f==='cats'?buildCat(v):f==='dinos'?buildDino(v):f==='ducks'?buildDuck(v):buildGeneric(v,f);scene.add(g);meshCache[k]=g;return g}
