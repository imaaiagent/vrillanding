import React,{useEffect,useRef} from 'react';
import {createRoot} from 'react-dom/client';
import * as THREE from 'three';
import './style.css';

const logo='/virl-logo.png';
const socials=[
  {key:'github',label:'GITHUB',sub:'BUILDERS'},
  {key:'x',label:'X',sub:'TRENDS',href:'https://x.com/virlfamily'},
  {key:'tiktok',label:'TIKTOK',sub:'CREATORS'},
  {key:'instagram',label:'INSTAGRAM',sub:'COMMUNITY'},
  {key:'robinhood',label:'ROBINHOOD',sub:'MARKETS'}
];

function makeCardTexture(){
  const c=document.createElement('canvas'); c.width=256;c.height=256;
  const x=c.getContext('2d');
  x.clearRect(0,0,256,256);
  const r=34; const g=x.createLinearGradient(0,0,256,256);g.addColorStop(0,'rgba(15,39,34,.95)');g.addColorStop(1,'rgba(4,16,14,.88)');
  x.fillStyle=g;x.beginPath();x.roundRect(12,12,232,232,r);x.fill();
  x.strokeStyle='rgba(120,255,210,.55)';x.lineWidth=3;x.stroke();
  x.strokeStyle='rgba(255,255,255,.12)';x.lineWidth=1;x.stroke();
  return new THREE.CanvasTexture(c);
}

function VirlScene(){
 const mount=useRef(null);
 useEffect(()=>{
  const el=mount.current, w=()=>window.innerWidth, h=()=>window.innerHeight;
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(38,w()/h(),.1,100); camera.position.set(0,0,8.2);
  const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));renderer.setSize(w(),h());renderer.outputColorSpace=THREE.SRGBColorSpace;el.appendChild(renderer.domElement);
  scene.add(new THREE.AmbientLight(0xcfffee,1.4));
  const key=new THREE.PointLight(0xffffff,22,18);key.position.set(3,4,5);scene.add(key);
  const green=new THREE.PointLight(0x55ffba,34,18);green.position.set(-4,-2,3);scene.add(green);

  const root=new THREE.Group(); root.position.x=0.95; scene.add(root);
  const tex=new THREE.TextureLoader().load(logo);tex.colorSpace=THREE.SRGBColorSpace;
  const core=new THREE.Mesh(new THREE.PlaneGeometry(4.45,2.98),new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false}));root.add(core);
  for(let i=1;i<=7;i++){const m=new THREE.Mesh(new THREE.PlaneGeometry(4.45,2.98),new THREE.MeshBasicMaterial({map:tex,transparent:true,opacity:.035,depthWrite:false,blending:THREE.AdditiveBlending}));m.position.z=-i*.03;root.add(m)}

  const ringMat=new THREE.MeshBasicMaterial({color:0x6dffd0,transparent:true,opacity:.34});
  for(let i=0;i<3;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(2.55+i*.34,.008,8,220),ringMat);r.rotation.set(.42+i*.4,.25+i*.7,i*.6);r.userData.speed=i%2?-.18:.13;root.add(r)}

  const n=1050,pos=new Float32Array(n*3),target=new Float32Array(n*3),phase=new Float32Array(n);
  for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,rad=3.2+Math.random()*3.4;pos[i*3]=Math.cos(a)*rad;pos[i*3+1]=(Math.random()-.5)*5.4;pos[i*3+2]=(Math.random()-.5)*4.8;target[i*3]=(Math.random()-.5)*2.8;target[i*3+1]=(Math.random()-.5)*1.8;target[i*3+2]=.4+(Math.random()-.5)*.8;phase[i]=Math.random()}
  const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(pos,3));
  const particles=new THREE.Points(pg,new THREE.PointsMaterial({color:0xcaffed,size:.018,transparent:true,opacity:.72,depthWrite:false}));scene.add(particles);



  let mx=0,my=0;const move=e=>{mx=e.clientX/w()-.5;my=e.clientY/h()-.5};addEventListener('pointermove',move);
  const orbitEl=el.parentElement?.querySelector('.socialOrbit') || document.querySelector('.socialOrbit');
  const heroEl=document.querySelector('.hero');
  const heroObserver=heroEl?new IntersectionObserver(([entry])=>{if(orbitEl) orbitEl.classList.toggle('orbitHidden',!entry.isIntersecting)},{threshold:.08}):null;
  if(heroObserver) heroObserver.observe(heroEl);
  const nodes=orbitEl?[...orbitEl.querySelectorAll('.socialNode')]:[];
  // Deliberately map each social identity to the same visual positions as the art direction:
  // X = top, TikTok = upper-right, Robinhood = lower-right, Instagram = lower-left, GitHub = upper-left.
  const angles=[
    Math.PI + Math.PI/5, // GitHub
    -Math.PI/2,           // X
    -Math.PI/10,          // TikTok
    Math.PI/2 + Math.PI/5,// Instagram
    Math.PI/2 - Math.PI/5 // Robinhood
  ];
  const orbitState={phase:0};
  function layoutSocialOrbit(t){
    if(!nodes.length) return;
    const mobile=window.innerWidth<800;
    const cx=window.innerWidth*(mobile?.61:.615);
    const cy=window.innerHeight*(mobile?.50:.50);
    const rx=Math.min(window.innerWidth*(mobile?.31:.215), mobile?220:355);
    const ry=Math.min(window.innerHeight*(mobile?.29:.30), mobile?205:270);
    // Slow cinematic rotation: one full revolution roughly every 65 seconds.
    const speed=.000097;
    orbitState.phase=t*speed;
    nodes.forEach((node,i)=>{
      const a=angles[i]+orbitState.phase;
      const x=Math.cos(a)*rx;
      const y=Math.sin(a)*ry;
      // Depth is based on the orbit's vertical position. Front objects are larger/brighter.
      const depth=(Math.sin(a)+1)/2;
      const scale=.82+depth*.25;
      const z=Math.round(depth*100);
      const tilt=Math.sin(a)*4.5;
      node.style.left=`${cx}px`;
      node.style.top=`${cy}px`;
      node.style.zIndex=String(20+z);
      node.style.opacity=String(.55+depth*.45);
      node.style.transform=`translate3d(${x}px,${y}px,${depth*80}px) translate(-50%,-50%) scale(${scale}) rotateZ(${tilt}deg)`;
    });
  }
  const clock=new THREE.Clock();let raf;
  function tick(){const t=clock.getElapsedTime();layoutSocialOrbit(t*1000);root.rotation.y+=(mx*.24-root.rotation.y)*.035;root.rotation.x+=(-my*.14-root.rotation.x)*.035;root.position.y=Math.sin(t*.7)*.035;
    root.children.forEach(o=>{if(o.geometry?.type==='TorusGeometry')o.rotation.z+=o.userData.speed*.002});
    const arr=pg.attributes.position.array;for(let i=0;i<n;i++){const k=i*3,q=(phase[i]+t*.055)%1,e=q*q*(3-2*q),a=phase[i]*6.283+t*.06*(i%3?1:-1),rad=3.2+((i*17)%100)/100*3.1,sx=Math.cos(a)*rad,sy=Math.sin(i*12.71)*2.6,sz=Math.sin(a)*rad*.55;arr[k]=sx*(1-e)+target[k]*e;arr[k+1]=sy*(1-e)+target[k+1]*e;arr[k+2]=sz*(1-e)+target[k+2]*e}pg.attributes.position.needsUpdate=true;
    particles.rotation.y=t*.025;renderer.render(scene,camera);raf=requestAnimationFrame(tick)}tick();
  const resize=()=>{camera.aspect=w()/h();camera.updateProjectionMatrix();renderer.setSize(w(),h());layoutSocialOrbit(clock.getElapsedTime()*1000)};addEventListener('resize',resize);
  return()=>{cancelAnimationFrame(raf);removeEventListener('pointermove',move);removeEventListener('resize',resize);if(heroObserver) heroObserver.disconnect();renderer.dispose();el.removeChild(renderer.domElement)};
 },[]);
 return <div ref={mount} className="scene"/>;
}

function App(){return <div className="site"><VirlScene/><div className="grain"/><nav><a className="brand" href="#top"><img src={logo}/><span>VIRL</span></a><div className="links"><a href="#idea">WHY VIRL</a><a href="#loop">HOW IT WORKS</a><a href="#market">THE MARKET</a></div><span className="navCta">COMING SOON</span></nav><main id="top"><div className="socialOrbit" aria-hidden="true">{socials.map((s,i)=>s.href?<a className={`socialNode social-${s.key} socialAnchor`} href={s.href} target="_blank" rel="noreferrer" aria-label="VIRL on X" key={s.key}><div className="socialCard"><div className="socialIcon"><img src={`/icons/${s.key}.svg`} alt="" /></div></div><div className="socialLabel"><b>{s.label}</b><span>{s.sub}</span></div></a>:<div className={`socialNode social-${s.key}`} key={s.key}><div className="socialCard"><div className="socialIcon"><img src={`/icons/${s.key}.svg`} alt="" /></div></div><div className="socialLabel"><b>{s.label}</b><span>{s.sub}</span></div></div>)}</div>
<section className="hero"><div className="heroCopy"><div className="eyebrow"><span/> VIRL / COMING SOON</div><h1>TURN ATTENTION<br/><i>INTO VALUE.</i></h1><div className="comingSoon">COMING SOON</div><p>VIRL turns viral creators, artists, developers and internet identities into onchain assets — creating a new way for attention to generate value for the people behind it.</p><div className="buttons"><a className="primary" href="#idea">Discover VIRL <b>↓</b></a><a className="secondary" href="#loop">See the mechanism ↗</a></div></div><div className="heroHint"><span>YOUR SOCIAL IDENTITY</span><span>CAN BECOME AN ASSET</span></div><div className="scroll">SCROLL <b>↓</b></div></section>
<section id="idea" className="statement"><div className="sectionNo">01 / THE IDEA</div><div><h2>The internet has<br/><span>attention.</span><br/>VIRL gives it<br/><i>an economy.</i></h2><p>Creators, artists, developers and internet personalities already build audiences every day. VIRL gives those audiences an onchain layer — so a viral identity can become a market, and the value created around it can flow back to the people behind it.</p></div></section>
<section id="loop" className="loop"><div className="sectionNo">02 / HOW VIRL WORKS</div><div className="steps"><article><span>01</span><div><h3>FIND THE VIRAL</h3><p>Choose a creator, artist, developer, project, meme, or internet identity that already has attention.</p></div></article><article><span>02</span><div><h3>LAUNCH THE ASSET</h3><p>Turn that identity into an onchain token — giving the community a market to discover, trade, and rally around.</p></div></article><article><span>03</span><div><h3>BUILD THE MARKET</h3><p>Attention becomes activity. The token creates a new onchain community around the identity people already care about.</p></div></article><article><span>04</span><div><h3>FLOW VALUE BACK</h3><p>Fees generated by the market can flow back to the creator, artist, developer, or original identity — when enabled.</p></div></article></div></section>
<section id="market" className="market"><div className="sectionNo">03 / THE VIRL ECONOMY</div><div className="marketBig"><span>ATTENTION</span><strong>→</strong><span>ASSET</span><strong>→</strong><span>MARKET</span></div><p>VIRL connects internet attention to onchain markets — creating a path for creators, artists, developers and communities to participate in the value generated around their identity.</p><p className="marketPunch">We are not just launching tokens.<br/><i>We are onboarding the internet.</i></p></section>
<section id="launch" className="final"><div className="finalOrb"><img src={logo}/></div><div className="sectionNo">04 / THE NEXT VIRAL ASSET</div><div className="finalSoon">COMING SOON</div><h2>ONBOARD<br/><i>THE INTERNET.</i></h2><span className="primary disabled">COMING SOON</span></section>
</main><footer><span>© 2026 VIRL</span><span>TURN INTERNET ATTENTION INTO ONCHAIN VALUE.</span><span>BUILT FOR THE VIRAL.</span></footer></div>}
createRoot(document.getElementById('root')).render(<App/>);
