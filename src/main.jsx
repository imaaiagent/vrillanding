import React,{useEffect,useRef} from 'react';
import {createRoot} from 'react-dom/client';
import * as THREE from 'three';
import './style.css';

const logo='/virl-logo.png';
const socials=[
  {key:'github',label:'GITHUB',sub:'BUILDERS'},
  {key:'x',label:'X',sub:'TRENDS'},
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
 const orbitRef=useRef(null);
 useEffect(()=>{
  const el=mount.current, w=()=>window.innerWidth, h=()=>window.innerHeight;
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(38,w()/h(),.1,100); camera.position.set(0,0,8.2);
  const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));renderer.setSize(w(),h());renderer.outputColorSpace=THREE.SRGBColorSpace;el.appendChild(renderer.domElement);
  scene.add(new THREE.AmbientLight(0xcfffee,1.4));
  const key=new THREE.PointLight(0xffffff,22,18);key.position.set(3,4,5);scene.add(key);
  const green=new THREE.PointLight(0x55ffba,34,18);green.position.set(-4,-2,3);scene.add(green);

  const root=new THREE.Group();scene.add(root);
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
  const clock=new THREE.Clock();let raf;
  function tick(){const t=clock.getElapsedTime();
    // Slow cinematic rotation of the central 3D VIRL emblem.
    root.rotation.y+=(mx*.24+Math.sin(t*.22)*.075-root.rotation.y)*.028;
    root.rotation.x+=(-my*.14+Math.cos(t*.19)*.035-root.rotation.x)*.028;
    root.position.y=Math.sin(t*.7)*.035;
    root.children.forEach(o=>{if(o.geometry?.type==='TorusGeometry'){o.rotation.z+=o.userData.speed*.010;o.rotation.x+=o.userData.speed*.0025}});
    const arr=pg.attributes.position.array;
    for(let i=0;i<n;i++){const k=i*3,q=(phase[i]+t*.055)%1,e=q*q*(3-2*q),a=phase[i]*6.283+t*.06*(i%3?1:-1),rad=3.2+((i*17)%100)/100*3.1,sx=Math.cos(a)*rad,sy=Math.sin(i*12.71+t*.08)*2.6,sz=Math.sin(a)*rad*.55;arr[k]=sx*(1-e)+target[k]*e;arr[k+1]=sy*(1-e)+target[k+1]*e;arr[k+2]=sz*(1-e)+target[k+2]*e}
    pg.attributes.position.needsUpdate=true;
    particles.rotation.y=t*.055;
    renderer.render(scene,camera);raf=requestAnimationFrame(tick)}tick();

  // HTML social cards orbit the real 3D scene so the logos stay crisp.
  const orbitEl=orbitRef.current;
  const nodes=[...orbitEl.querySelectorAll('.socialNode')];
  const baseAngles=[-Math.PI/2,-.42, .78, 2.32, 3.55];
  const orbitClock=new THREE.Clock();
  let orbitRaf;
  function animateSocials(){
    const t=orbitClock.getElapsedTime();
    const vw=window.innerWidth, vh=window.innerHeight;
    const cx=vw*.585, cy=vh*.505;
    const rx=Math.min(vw*.305, 455), ry=Math.min(vh*.315, 290);
    const speed=.105;
    nodes.forEach((node,i)=>{
      const a=baseAngles[i]+t*speed;
      const x=Math.cos(a)*rx;
      const y=Math.sin(a)*ry;
      const depth=Math.sin(a);
      const z=depth*170;
      const scale=.86+(depth+.35)*.14;
      const opacity=.64+(depth+.5)*.36;
      node.style.left=`${cx}px`;node.style.top=`${cy}px`;
      node.style.transform=`translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), ${z}px) scale(${scale})`;
      node.style.opacity=String(Math.max(.5,Math.min(1,opacity)));
      node.style.zIndex=String(30+Math.round(depth*20));
      node.style.setProperty('--bob', `${Math.sin(t*1.25+i*1.7)*7}px`);
      node.style.setProperty('--tilt', `${Math.sin(t*.65+i)*4}deg`);
    });
    orbitRaf=requestAnimationFrame(animateSocials);
  }
  animateSocials();
  const resize=()=>{camera.aspect=w()/h();camera.updateProjectionMatrix();renderer.setSize(w(),h())};addEventListener('resize',resize);
  return()=>{cancelAnimationFrame(raf);cancelAnimationFrame(orbitRaf);removeEventListener('pointermove',move);removeEventListener('resize',resize);renderer.dispose();el.removeChild(renderer.domElement)};
 },[]);
 return <div ref={mount} className="scene"/>;
}

function App(){return <div className="site"><VirlScene/><div className="grain"/><nav><a className="brand" href="#top"><img src={logo}/><span>VIRL</span></a><div className="links"><a href="#idea">WHY VIRL</a><a href="#loop">HOW IT WORKS</a><a href="#market">THE MARKET</a></div><span className="navCta">COMING SOON</span></nav><main id="top">
<section className="hero"><div className="socialOrbit" aria-hidden="true">{socials.map((s,i)=><div className={`socialNode social-${s.key}`} key={s.key}><div className="socialCard"><div className="socialIcon"><img src={`/icons/${s.key}.svg`} alt="" /></div></div><div className="socialLabel"><b>{s.label}</b><span>{s.sub}</span></div></div>)}</div><div className="heroCopy"><div className="eyebrow"><span/> VIRL / COMING SOON</div><h1>TURN ATTENTION<br/><i>INTO VALUE.</i></h1><div className="comingSoon">COMING SOON</div><p>VIRL turns viral creators, social identities, memes and internet moments into onchain assets — connecting attention with markets, communities and speculation.</p><div className="buttons"><a className="primary" href="#idea">Discover VIRL <b>↓</b></a><a className="secondary" href="#loop">See the mechanism ↗</a></div></div><div className="heroHint"><span>YOUR SOCIAL IDENTITY</span><span>CAN BECOME AN ASSET</span></div><div className="scroll">SCROLL <b>↓</b></div></section>
<section id="idea" className="statement"><div className="sectionNo">01 / THE IDEA</div><div><h2>The internet already<br/><span>creates attention.</span></h2><p>VIRL gives that attention a market. A viral moment becomes an identity, an identity becomes a token, and a token becomes a community-owned asset.</p></div></section>
<section id="loop" className="loop"><div className="sectionNo">02 / THE VIRL LOOP</div><div className="steps"><article><span>01</span><div><h3>GO VIRAL</h3><p>A creator, meme, account, trend or personality captures the internet.</p></div></article><article><span>02</span><div><h3>RECOGNISE</h3><p>VIRL identifies the social identity and maps the attention around it.</p></div></article><article><span>03</span><div><h3>LAUNCH</h3><p>Turn the identity into an onchain asset that people can discover and trade.</p></div></article><article><span>04</span><div><h3>SPREAD</h3><p>Attention drives activity. Communities form. The market grows with the moment.</p></div></article></div></section>
<section id="market" className="market"><div className="sectionNo">03 / ATTENTION → MARKET</div><div className="marketBig"><span>VIRAL</span><strong>→</strong><span>ONCHAIN</span><strong>→</strong><span>MARKET</span></div><p>VIRL is the missing layer between what the internet talks about and what the internet can own.</p></section>
<section id="launch" className="final"><div className="finalOrb"><img src={logo}/></div><div className="sectionNo">04 / THE NEXT VIRAL ASSET</div><div className="finalSoon">COMING SOON</div><h2>DON'T JUST<br/><i>GO VIRAL.</i><br/>VIRL IT.</h2><span className="primary disabled">COMING SOON</span></section>
</main><footer><span>© 2026 VIRL</span><span>TURN INTERNET ATTENTION INTO ONCHAIN VALUE.</span><span>BUILT FOR THE VIRAL.</span></footer></div>}
createRoot(document.getElementById('root')).render(<App/>);
