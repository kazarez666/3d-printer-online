// Prototype 2.5: real mesh asset layer for Tiny Pack.
const asset25Loader=(typeof THREE!=='undefined'&&THREE.GLTFLoader)?new THREE.GLTFLoader():null;
const asset25Cache={};
const asset25Pending={};
function asset25Path(v,f){if(f!=='cats'&&f!=='dinos'&&f!=='ducks')return null;return `assets/tiny/${f}_${v.id}.glb?v=${APP_VERSION}`}
function asset25BodyMaterial(v,f){
 if(f==='cats')return mkMat(v.base,{map:v.kind==='bengal'?bengalTex:v.kind==='tabby'?tabbyTex:null,roughness:(v.kind==='siamese'||v.kind==='bengal')?0.38:0.44,clearcoat:.1,clearcoatRoughness:.5});
 if(f==='dinos')return mkMat(v.base,{map:v.kind==='trex'?rexTex:null,roughness:.48,clearcoat:.025});
 return mkMat(v.base,{roughness:.4,clearcoat:.11,clearcoatRoughness:.48});
}
function asset25DecorateCat(g,v){
 const siam=v.kind==='siamese',bengal=v.kind==='bengal';
 const cream=mkMat(0xeee3d2,{roughness:.45}),point=mkMat(0x4b3933,{roughness:.44}),pink=mkMat(0xd58b91,{roughness:.4});
 const iris=mkMat(bengal?0x76c85b:siam?0x67baff:0xa3b879,{roughness:.1,clearcoat:.65,clearcoatRoughness:.08});
 organic(g,siam?point:cream,[-.11,1.58,1.13],[.11,.075,.07],26);organic(g,siam?point:cream,[.11,1.58,1.13],[.11,.075,.07],26);
 organic(g,pink,[0,1.55,1.24],[.035,.025,.027],22);
 organic(g,iris,[-.12,1.72,1.095],[.055,.036,.024],24);organic(g,iris,[.12,1.72,1.095],[.055,.036,.024],24);
 eye(g,[-.12,1.72,1.12],0x06080b,.019);eye(g,[.12,1.72,1.12],0x06080b,.019);
 if(siam)organic(g,point,[0,1.65,1.02],[.26,.2,.13],28);
}
function asset25DecorateDuck(g,v){
 const beak=mkMat(v.kind==='ugly'?0x83684c:0xef8a31,{roughness:.34,clearcoat:.05}),eyeColor=v.kind==='ugly'?0xe8edf2:0x101317;
 part(g,new THREE.CylinderGeometry(.13,.10,.34,24),beak,[0,1.49,1.38],[1,.55,1],[Math.PI/2,0,0]);organic(g,beak,[0,1.47,1.53],[.28,.11,.16],26);
 eye(g,[-.12,1.68,1.13],eyeColor,.031);eye(g,[.12,1.68,1.13],eyeColor,.031);
}
function asset25DecorateDino(g,v){
 const iris=mkMat(v.kind==='trex'?0xd9ad48:0xd4c66b,{roughness:.1,clearcoat:.7,clearcoatRoughness:.05});
 if(v.kind==='trex'){
  organic(g,iris,[1.15,1.85,.29],[.045,.032,.022],22);organic(g,iris,[1.15,1.85,-.29],[.045,.032,.022],22);eye(g,[1.16,1.85,.31],0x050505,.015);eye(g,[1.16,1.85,-.31],0x050505,.015);
  const mouth=mkMat(0x64342f,{roughness:.58}),tooth=mkMat(0xf1eadb,{roughness:.34});
  part(g,new THREE.BoxGeometry(.52,.045,.02),mouth,[1.3,1.55,.29],[1,1,1],[0,0,-.06]);part(g,new THREE.BoxGeometry(.52,.045,.02),mouth,[1.3,1.55,-.29],[1,1,1],[0,0,-.06]);
  for(let i=0;i<5;i++){const x=1.12+i*.085;part(g,new THREE.ConeGeometry(.018,.075,7),tooth,[x,1.52,.28],[1,1,1],[Math.PI,0,0]);part(g,new THREE.ConeGeometry(.018,.075,7),tooth,[x,1.52,-.28],[1,1,1],[Math.PI,0,0])}
 }else{
  const px=v.kind==='brachio'?.9:v.kind==='spino'?1.05:.85,py=v.kind==='brachio'?2.4:v.kind==='spino'?1.18:1.52;organic(g,iris,[px,py,.18],[.035,.026,.02],20);organic(g,iris,[px,py,-.18],[.035,.026,.02],20);
 }
}
function asset25Decorate(g,v,f){if(f==='cats')asset25DecorateCat(g,v);else if(f==='ducks')asset25DecorateDuck(g,v);else if(f==='dinos')asset25DecorateDino(g,v)}
async function getModelAsync(v,f){
 const path=asset25Path(v,f);if(!path||!asset25Loader)return getModel(v,f);const key=f+'_'+v.id;if(asset25Cache[key])return asset25Cache[key];if(asset25Pending[key])return asset25Pending[key];
 asset25Pending[key]=new Promise(resolve=>{asset25Loader.load(path,gltf=>{const g=gltf.scene||gltf.scenes?.[0]||new THREE.Group(),mat=asset25BodyMaterial(v,f);g.traverse(o=>{if(o.isMesh){o.material=mat;o.castShadow=true;o.receiveShadow=true}});asset25Decorate(g,v,f);g.scale.setScalar(f==='dinos'?0.65:f==='ducks'?0.80:0.82);g.position.y=baseY;g.visible=false;scene.add(g);asset25Cache[key]=g;delete asset25Pending[key];resolve(g)},undefined,()=>{const fallback=getModel(v,f);asset25Cache[key]=fallback;delete asset25Pending[key];resolve(fallback)})});
 return asset25Pending[key];
}
