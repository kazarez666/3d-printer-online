const APP_VERSION='2.2';
(async()=>{try{const d=await fetch('version.json?t='+Date.now(),{cache:'no-store'}).then(r=>r.json());if(d.version&&d.version!==APP_VERSION){const u=new URL(location.href);u.searchParams.set('v',d.version);location.replace(u)}}catch{}})();
const $=s=>document.querySelector(s);
const ui={cash:$('#cash'),pack:$('#packButton'),view:$('#viewButton'),time:$('#timeButton'),main:$('#mainButton'),buy:$('#printerButton'),bar:$('#progressBar'),small:$('#statusSmall'),big:$('#statusBig'),toast:$('#toast'),flash:$('#flash'),selector:$('#selector'),title:$('#familyTitle'),sub:$('#familySub'),value:$('#familyValue')};
const toast=t=>{ui.toast.textContent=t;ui.toast.classList.add('show');setTimeout(()=>ui.toast.classList.remove('show'),1500)};
const PRINTERS=[
{name:'Starter Mini',price:0,speed:1,accent:0x4f7fff},
{name:'Creator One',price:1500,speed:1.15,accent:0x28c9d4},
{name:'Workshop Pro',price:9000,speed:1.32,accent:0x4fdc98},
{name:'Studio XL',price:45000,speed:1.52,accent:0xff8d52},
{name:'Industrial Nova',price:180000,speed:1.78,accent:0xb56fff}
];
const PACKS=[['cats','dinos','ducks'],['dogs','balls','giraffes'],['robots','cars','sharks'],['dragons','rockets','sculptures'],['mechs','supercars','spaceships']];
const F={
cats:{label:'Cats',sub:'British • Siamese • Tabby • Maine Coon • Bengal',range:'$10–$50',h:1.88,b:[1.48,1.58]},
dinos:{label:'Dinosaurs',sub:'7 species • legendary Tyrannosaurus Rex',range:'$12–$80',h:2.28,b:[2.25,1.04]},
ducks:{label:'Ducks',sub:'Yellow Duck • ultra-rare Ugly Duckling',range:'$8–$250',h:1.58,b:[1.38,.98]},
dogs:{label:'Dogs',sub:'Small dog figures',range:'$60–$300',h:2,b:[1.7,1.1]},balls:{label:'Balls',sub:'Sports and novelty balls',range:'$50–$280',h:1.55,b:[1.5,1.5]},giraffes:{label:'Giraffes',sub:'Tall collectible figures',range:'$75–$340',h:2.5,b:[1.35,1.05]},robots:{label:'Robots',sub:'Medium collectible robots',range:'$220–$950',h:2.5,b:[1.7,1.2]},cars:{label:'Cars',sub:'Medium display cars',range:'$250–$1,100',h:1.35,b:[2,1.1]},sharks:{label:'Sharks',sub:'Different shark silhouettes',range:'$230–$1,000',h:1.4,b:[2,1.1]},dragons:{label:'Dragons',sub:'Large fantasy dragons',range:'$900–$4,500',h:2.65,b:[2.2,1.4]},rockets:{label:'Rockets',sub:'Large rockets',range:'$850–$4,200',h:2.9,b:[1.5,1.5]},sculptures:{label:'Sculptures',sub:'Large decorative pieces',range:'$1,000–$5,000',h:2.6,b:[1.8,1.35]},mechs:{label:'Mechs',sub:'XL mechanical showpieces',range:'$6,500–$35,000',h:3,b:[2.4,1.6]},supercars:{label:'Supercars',sub:'XL automotive models',range:'$7,000–$38,000',h:1.5,b:[2.65,1.45]},spaceships:{label:'Spaceships',sub:'XL sci-fi ships',range:'$7,500–$42,000',h:1.8,b:[2.7,1.75]}};
const cats=[
{id:'british',name:'British Shorthair',rar:'Common',value:10,base:0x949da9,kind:'british'},
{id:'siamese',name:'Siamese Cat',rar:'Common',value:10,base:0xe8ddc6,kind:'siamese'},
{id:'tabby',name:'Orange Tabby',rar:'Common',value:10,base:0xda8b45,kind:'tabby'},
{id:'maine',name:'Maine Coon',rar:'Rare',value:25,base:0x8a7165,kind:'maine'},
{id:'bengal',name:'Bengal Leopard Cat',rar:'Legendary',value:50,base:0xd89c45,kind:'bengal'}];
const dinos=[
{id:'para',name:'Parasaurolophus',rar:'Common',value:12,base:0x78b96b,kind:'para'},
{id:'stego',name:'Stegosaurus',rar:'Common',value:12,base:0x8bbf6c,kind:'stego'},
{id:'brachio',name:'Brachiosaurus',rar:'Common',value:12,base:0x72b0a2,kind:'brachio'},
{id:'tri',name:'Triceratops',rar:'Common',value:12,base:0x9fac63,kind:'tri'},
{id:'anky',name:'Ankylosaurus',rar:'Rare',value:30,base:0xa99368,kind:'anky'},
{id:'spino',name:'Spinosaurus',rar:'Rare',value:30,base:0x638ca4,kind:'spino'},
{id:'trex',name:'Tyrannosaurus Rex',rar:'Legendary',value:80,base:0xa36f46,kind:'trex'}];
const ducks=[{id:'yellow',name:'Yellow Duck',rar:'Common',value:8,base:0xf2c83e,kind:'yellow'},{id:'ugly',name:'Ugly Duckling',rar:'Legendary',value:250,base:0x242a31,kind:'ugly'}];
const generic=(prefix,names,vals,colors)=>names.map((n,i)=>({id:prefix+i,name:n,rar:i<3?'Common':i===3?'Rare':'Legendary',value:i<3?vals[0]:i===3?vals[1]:vals[2],base:colors[i%colors.length],kind:prefix}));
const V={cats,dinos,ducks,dogs:generic('dog',['Puppy','Corgi','Beagle','Husky','Royal Hound'],[60,140,300],[0xd8b18b,0xe6c59d,0x9b765f,0x9ec8ea,0xffcf63]),balls:generic('ball',['Soccer Ball','Basketball','Baseball','Disco Ball','Cosmic Ball'],[50,130,280],[0xe9edf2,0xe17c39,0xf3eee5,0xbce9ff,0xc273ff]),giraffes:generic('giraffe',['Young Giraffe','Curious Giraffe','Tall Giraffe','Safari Giraffe','Golden Giraffe'],[75,170,340],[0xe5b85a,0xdba84e,0xf0c96c,0xb9d477,0xffd45c]),robots:generic('robot',['Service Bot','Box Bot','Worker Bot','Sentinel Bot','Quantum Bot'],[220,500,950],[0x7da9d9,0x85c8c5,0x9aa8ba,0xe6815b,0xc07cff]),cars:generic('car',['City Car','Rally Car','Coupe','Track Car','Hypercar'],[250,600,1100],[0x5da1ff,0xef5757,0xf0c34b,0x77d68f,0xb66cff]),sharks:generic('shark',['Reef Shark','Mako Shark','Hammerhead','Great White','Ghost Shark'],[230,550,1000],[0x6fa7bd,0x6398b3,0x789ab1,0xbfc8cf,0xc48cff]),dragons:generic('dragon',['Young Dragon','Stone Dragon','Forest Dragon','Fire Dragon','Celestial Dragon'],[900,2200,4500],[0x74c779,0x9c9ca5,0x55b785,0xee7655,0xa974ff]),rockets:generic('rocket',['Explorer Rocket','Cargo Rocket','Lunar Rocket','Nova Rocket','Starfire Rocket'],[850,2100,4200],[0xe8edf5,0xc9d0db,0xb5d8ff,0xff9f5c,0xa878ff]),sculptures:generic('sculpt',['Abstract Bust','Twist Sculpture','Wave Sculpture','Gallery Piece','Masterpiece'],[1000,2500,5000],[0xe7e0d4,0xc9d0d8,0xdac0a8,0x82c8c0,0xffcf73]),mechs:generic('mech',['Utility Mech','Defense Mech','Loader Mech','Titan Mech','Apex Mech'],[6500,15000,35000],[0x738aa8,0x59758f,0x8a9b73,0xe06a53,0xb36cff]),supercars:generic('supercar',['GT Coupe','Roadster','Track Special','Prototype R','Nebula One'],[7000,17000,38000],[0x4d8dff,0xf25959,0xe8bd4f,0x54d19a,0xb96cff]),spaceships:generic('ship',['Scout Ship','Cargo Ship','Interceptor','Battlecruiser','Flagship'],[7500,19000,42000],[0x93aabd,0x788a99,0x65b5d0,0xe77d5b,0xb779ff])};
const W={cats:[55,55,55,18,7],dinos:[38,38,38,38,16,16,6],ducks:[99.1,.9]};
const KEY='printer-prototype-v13';let s={cash:0,printer:0,pack:0,family:'cats'};try{Object.assign(s,JSON.parse(localStorage.getItem(KEY)||'{}'))}catch{};s.printer=Math.max(0,Math.min(4,+s.printer||0));s.pack=Math.max(0,Math.min(s.printer,+s.pack||0));if(!PACKS[s.pack].includes(s.family))s.family=PACKS[s.pack][0];const save=()=>localStorage.setItem(KEY,JSON.stringify(s));
let state='idle',variant=null,active=null,elapsed=0,prog=0,timeScale=1,revealStart=0,autoSold=false;

const scene=new THREE.Scene();scene.fog=new THREE.Fog(0x07101d,10,22);
const camera=new THREE.PerspectiveCamera(33,innerWidth/innerHeight,.1,60);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.localClippingEnabled=true;renderer.outputEncoding=THREE.sRGBEncoding;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;$('#scene').appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xeaf2ff,0x100c0a,1.34));
const keyLight=new THREE.DirectionalLight(0xfffcf6,2.45);keyLight.position.set(4.4,7.4,5.0);keyLight.castShadow=true;keyLight.shadow.mapSize.set(1536,1536);keyLight.shadow.bias=-.00028;scene.add(keyLight);
const fillLight=new THREE.PointLight(0xaac8ff,2.5,9,2);fillLight.position.set(-2.4,3.2,4);scene.add(fillLight);
const rim=new THREE.PointLight(0x69a9ff,7.2,11,2);rim.position.set(-4,3.7,-3.6);scene.add(rim);
const warmLight=new THREE.PointLight(0xffbd73,2.9,8,2);warmLight.position.set(3.2,2.2,3.2);scene.add(warmLight);
const revealLight=new THREE.PointLight(0xffffff,0,5.5,2);revealLight.position.set(0,2.4,1.8);scene.add(revealLight);
const floor=new THREE.Mesh(new THREE.CircleGeometry(8,64),new THREE.MeshStandardMaterial({color:0x0d1726,roughness:.95,metalness:.02}));floor.rotation.x=-Math.PI/2;floor.position.y=-.04;floor.receiveShadow=true;scene.add(floor);

const printer=new THREE.Group();scene.add(printer);
const dark=new THREE.MeshStandardMaterial({color:0x0f151e,metalness:.72,roughness:.28}),body=new THREE.MeshStandardMaterial({color:0x273245,metalness:.34,roughness:.38}),accent=new THREE.MeshStandardMaterial({color:0x4f7fff,emissive:0x183876,emissiveIntensity:.45,metalness:.4,roughness:.24});
const box=(g,w,h,d,m,x,y,z)=>{const q=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);q.position.set(x,y,z);q.castShadow=q.receiveShadow=true;g.add(q);return q};
box(printer,4.6,.34,4,dark,0,.24,0);box(printer,4,.17,3.42,body,0,.47,0);[-1.8,1.8].forEach(x=>[-1.46,1.46].forEach(z=>box(printer,.17,3.42,.17,dark,x,2,z)));box(printer,3.78,.17,.18,dark,0,3.66,-1.46);box(printer,3.78,.17,.18,dark,0,3.66,1.46);
const bedGroup=new THREE.Group();printer.add(bedGroup);box(bedGroup,3,.13,2.72,dark,0,.58,0);box(bedGroup,2.8,.055,2.48,new THREE.MeshStandardMaterial({color:0x172233,metalness:.18,roughness:.28}),0,.7,0);
const gantry=new THREE.Group();printer.add(gantry);box(gantry,3.42,.18,.22,dark,0,0,-.16);
const head=new THREE.Group();printer.add(head);box(head,.7,.5,.58,accent,0,0,0);const nozzle=new THREE.Mesh(new THREE.ConeGeometry(.08,.31,18),new THREE.MeshStandardMaterial({color:0xe5a462,metalness:.86,roughness:.14}));nozzle.rotation.x=Math.PI;nozzle.position.set(0,-.34,.1);head.add(nozzle);const nozzleGlow=new THREE.PointLight(0xffb15c,0,1.7,2);nozzleGlow.position.set(0,-.43,.1);head.add(nozzleGlow);
const baseY=.76,clip=new THREE.Plane(new THREE.Vector3(0,-1,0),baseY),meshCache={};

function canvasTexture(draw){const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d');draw(x,512);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.encoding=THREE.sRGBEncoding;t.anisotropy=4;return t}
const bengalTex=canvasTexture((x,s)=>{x.fillStyle='#d99c45';x.fillRect(0,0,s,s);x.lineCap='round';for(let i=0;i<58;i++){const px=Math.random()*s,py=Math.random()*s,r=7+Math.random()*16,rot=Math.random()*Math.PI;x.strokeStyle='#342117';x.lineWidth=7;x.beginPath();x.ellipse(px,py,r*1.65,r,rot,0,Math.PI*2);x.stroke();if(i%2===0){x.fillStyle='#6b3d1f';x.beginPath();x.ellipse(px,py,r*.58,r*.34,rot,0,Math.PI*2);x.fill()}}});
const tabbyTex=canvasTexture((x,s)=>{x.fillStyle='#da8b45';x.fillRect(0,0,s,s);x.strokeStyle='#744327';x.lineWidth=16;for(let y=-30;y<s+50;y+=52){x.beginPath();x.moveTo(-10,y);x.bezierCurveTo(s*.28,y+28,s*.72,y-18,s+10,y+8);x.stroke()}});
const rexTex=canvasTexture((x,s)=>{x.fillStyle='#9f7048';x.fillRect(0,0,s,s);for(let i=0;i<760;i++){const a=.035+Math.random()*.12;x.fillStyle=`rgba(42,34,23,${a})`;const r=1+Math.random()*4;x.beginPath();x.arc(Math.random()*s,Math.random()*s,r,0,Math.PI*2);x.fill()}});
const mkMat=(color,opts={})=>new THREE.MeshPhysicalMaterial({color,map:opts.map||null,roughness:opts.roughness??.43,metalness:opts.metalness??.005,clearcoat:opts.clearcoat??.08,clearcoatRoughness:opts.clearcoatRoughness??.55,clippingPlanes:[clip],emissive:opts.emissive||0x000000,emissiveIntensity:opts.emissiveIntensity||0});
const part=(g,geo,m,pos,scale=[1,1,1],rot=[0,0,0])=>{const q=new THREE.Mesh(geo,m);q.position.set(...pos);q.scale.set(...scale);q.rotation.set(...rot);q.castShadow=q.receiveShadow=true;g.add(q);return q};
const organic=(g,m,pos,scale,seg=40)=>part(g,new THREE.SphereGeometry(1,seg,Math.max(22,seg*.68|0)),m,pos,scale);
const limb=(g,m,a,b,r=.08)=>{const A=new THREE.Vector3(...a),B=new THREE.Vector3(...b),mid=A.clone().add(B).multiplyScalar(.5),len=A.distanceTo(B),q=new THREE.Mesh(new THREE.CylinderGeometry(r*.72,r,len,20),m);q.position.copy(mid);q.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),B.clone().sub(A).normalize());q.castShadow=q.receiveShadow=true;g.add(q);return q};
const tube=(g,m,pts,r=.06,segments=48)=>{const q=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(...p))),segments,r,14,false),m);q.castShadow=q.receiveShadow=true;g.add(q);return q};
const eye=(g,pos,color=0x111318,s=.04)=>organic(g,mkMat(color,{roughness:.1,clearcoat:.7,clearcoatRoughness:.08}),pos,[s,s*.78,s*.55],24);
function loft(g,m,rings,axis='z',segments=36){const pos=[],uv=[],idx=[];const n=rings.length;for(let i=0;i<n;i++){const r=rings[i];for(let j=0;j<segments;j++){const a=j/segments*Math.PI*2,c=Math.cos(a),sn=Math.sin(a);let x,y,z;if(axis==='z'){x=(r.cx||0)+c*r.rx;y=(r.cy||0)+sn*r.ry;z=r.p}else{x=r.p;y=(r.cy||0)+sn*r.ry;z=(r.cz||0)+c*r.rz}pos.push(x,y,z);uv.push(j/segments,i/(n-1))}}for(let i=0;i<n-1;i++)for(let j=0;j<segments;j++){const a=i*segments+j,b=i*segments+(j+1)%segments,c=(i+1)*segments+j,d=(i+1)*segments+(j+1)%segments;idx.push(a,c,b,b,c,d)}const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(idx);geo.computeVertexNormals();return part(g,geo,m,[0,0,0])}
