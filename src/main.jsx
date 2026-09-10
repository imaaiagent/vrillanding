import React,{useEffect,useRef} from 'react';
import {createRoot} from 'react-dom/client';
import * as THREE from 'three';
import './style.css';

const logo='/virl-logo.png';

function VirlScene(){
 const mount=useRef(null);
 useEffect(()=>{
  const el=mount.current;
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(38,innerWidth/innerHeight,.1,100);
  camera.position.set(0,0,8.2);
  const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.8)); renderer.setSize(innerWidth,innerHeight); renderer.outputColorSpace=THREE.SRGBColorSpace; el.appendChild(renderer.domElement);
  scene.add(new THREE.AmbientLight(0xbfe9df,1.2));
  const key=new THREE.PointLight(0xffffff,20,18); key.position.set(3,4,5); scene.add(key);
  const green=new THREE.PointLight(0x55ffba,30,16); green.position.set(-4,-2,3); scene.add(green);

  const root=new THREE.Group(); scene.add(root);
  const loader=new THREE.TextureLoader(); const tex=loader.load(logo); tex.colorSpace=THREE.SRGBColorSpace;
  // Layered transparent planes create a subtle physical/extruded feel while preserving the exact VIRL mark.
  for(let i=7;i>=0;i--){
   const m=new THREE.MeshBasicMaterial({map:tex,transparent:true,opacity:i===0?1:.055,depthWrite:false,blending:THREE.AdditiveBlending});
   const mesh=new THREE.Mesh(new THREE.PlaneGeometry(4.45,2.98),m); mesh.position.z=-i*.028; root.add(mesh);
  }
  const core=new THREE.Mesh(new THREE.PlaneGeometry(4.45,2.98),new THREE.MeshPhysicalMaterial({map:tex,transparent:true,roughness:.12,metalness:.35,clearcoat:1,side:THREE.DoubleSide}));
  core.position.z=.02; root.add(core);

  // orbit rings
  const ringMat=new THREE.MeshBasicMaterial({color:0x6dffd0,transparent:true,opacity:.32});
  for(let i=0;i<3;i++){
   const r=new THREE.Mesh(new THREE.TorusGeometry(2.45+i*.3,.009,10,180),ringMat);
   r.rotation.set(.45+i*.45,.25+i*.8,i*.55); r.userData.speed=(i%2?-.22:.16); root.add(r);
  }

  // incoming attention particles — they converge toward the logo
  const n=1100, pos=new Float32Array(n*3), target=new Float32Array(n*3), phase=new Float32Array(n);
  for(let i=0;i<n;i++){
   const a=Math.random()*Math.PI*2, rad=3.2+Math.random()*3.2;
   pos[i*3]=Math.cos(a)*rad; pos[i*3+1]=(Math.random()-.5)*5.2; pos[i*3+2]=(Math.random()-.5)*4.5;
   target[i*3]=(Math.random()-.5)*2.6; target[i*3+1]=(Math.random()-.5)*1.7; target[i*3+2]=.4+(Math.random()-.5)*.8; phase[i]=Math.random();
  }
  const pg=new THREE.BufferGeometry(); pg.setAttribute('position',new THREE.BufferAttribute(pos,3));
  const pm=new THREE.PointsMaterial({color:0xcaffed,size:.018,transparent:true,opacity:.72,depthWrite:false});
  const particles=new THREE.Points(pg,pm); scene.add(particles);

  // small floating 3D blocks = markets/assets forming around attention
  const assets=new THREE.Group(); scene.add(assets);
  const assetMat=new THREE.MeshStandardMaterial({color:0x10221d,metalness:.7,roughness:.22,emissive:0x0b2d22,emissiveIntensity:.6});
  const edgeMat=new THREE.MeshBasicMaterial({color:0x6dffd0});
  for(let i=0;i<9;i++){
   const g=new THREE.Group(); const s=.16+Math.random()*.16;
   const cube=new THREE.Mesh(new THREE.BoxGeometry(s,s,s),assetMat); g.add(cube);
   const edge=new THREE.LineSegments(new THREE.EdgesGeometry(cube.geometry),edgeMat); g.add(edge);
   const a=i/9*Math.PI*2, r=3.05+Math.random()*.75;
   g.position.set(Math.cos(a)*r,Math.sin(a)*r*.52,(Math.random()-.5)*1.8); g.userData={a,r,speed:.15+Math.random()*.22,phase:Math.random()*6}; assets.add(g);
  }

  let mx=0,my=0,sy=0;
  const move=e=>{mx=e.clientX/innerWidth-.5; my=e.clientY/innerHeight-.5};
  const scroll=()=>{sy=scrollY};
  addEventListener('pointermove',move); addEventListener('scroll',scroll,{passive:true});
  const clock=new THREE.Clock();
  function tick(){
   const t=clock.getElapsedTime();
   root.rotation.y+=(mx*.24-root.rotation.y)*.035; root.rotation.x+=(-my*.14-root.rotation.x)*.035; root.position.y+=((Math.sin(t*.7)*.06)-root.position.y)*.035;
   root.position.z=Math.sin(t*.32)*.08;
   root.children.forEach((o,i)=>{if(o.isMesh&&o.geometry.type==='TorusGeometry')o.rotation.z+=o.userData.speed*.002});
   const arr=pg.attributes.position.array;
   for(let i=0;i<n;i++){
    const k=i*3, q=(phase[i]+t*.055)%1, ease=q*q*(3-2*q);
    const a=phase[i]*6.283+t*.06*(i%3?1:-1), rad=3.2+((i*17)%100)/100*3.1;
    const sx=Math.cos(a)*rad, sy0=(Math.sin(i*12.71)*.5)*5.2, sz=Math.sin(a)*rad*.55;
    arr[k]=sx*(1-ease)+target[k]*ease; arr[k+1]=sy0*(1-ease)+target[k+1]*ease; arr[k+2]=sz*(1-ease)+target[k+2]*ease;
   }
   pg.attributes.position.needsUpdate=true;
   assets.children.forEach((g,i)=>{const d=g.userData; const a=d.a+t*d.speed; g.position.x=Math.cos(a)*d.r; g.position.y=Math.sin(a)*d.r*.52; g.position.z=Math.sin(t*.7+d.phase)*.8; g.rotation.x=t*.5+d.phase; g.rotation.y=t*.7;});
   particles.rotation.y=t*.025;
   renderer.render(scene,camera); requestAnimationFrame(tick);
  } tick();
  const resize=()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)}; addEventListener('resize',resize);
  return()=>{removeEventListener('pointermove',move);removeEventListener('scroll',scroll);removeEventListener('resize',resize);renderer.dispose();el.removeChild(renderer.domElement)};
 },[]);
 return <div ref={mount} className="scene"/>;
}

function App(){return <div className="site"><VirlScene/><div className="grain"/><nav><a className="brand" href="#top"><img src={logo}/> <span>VIRL</span></a><div className="links"><a href="#idea">WHY VIRL</a><a href="#loop">HOW IT WORKS</a><a href="#market">THE MARKET</a></div><a className="navCta" href="#launch">LAUNCH ↗</a></nav>
 <main id="top">
  <section className="hero"><div className="heroCopy"><div className="eyebrow"><span/> ONCHAIN SOCIAL</div><h1>TURN ATTENTION<br/><i>INTO VALUE.</i></h1><p>VIRL turns viral creators, social identities, memes and internet moments into onchain assets — connecting attention with markets, communities and speculation.</p><div className="buttons"><a className="primary" href="#idea">Discover VIRL <b>↓</b></a><a className="secondary" href="#loop">See the mechanism ↗</a></div></div><div className="heroHint"><span>MOVE YOUR CURSOR</span><span>TO DISTORT THE MARKET</span></div><div className="scroll">SCROLL <b>↓</b></div></section>
  <section id="idea" className="statement"><div className="sectionNo">01 / THE IDEA</div><div><h2>The internet already<br/><span>creates attention.</span></h2><p>VIRL gives that attention a market. A viral moment becomes an identity, an identity becomes a token, and a token becomes a community-owned asset.</p></div></section>
  <section id="loop" className="loop"><div className="sectionNo">02 / THE VIRL LOOP</div><div className="steps"><article><span>01</span><div><h3>GO VIRAL</h3><p>A creator, meme, account, trend or personality captures the internet.</p></div></article><article><span>02</span><div><h3>RECOGNISE</h3><p>VIRL identifies the social identity and maps the attention around it.</p></div></article><article><span>03</span><div><h3>LAUNCH</h3><p>Turn the identity into an onchain asset that people can discover and trade.</p></div></article><article><span>04</span><div><h3>SPREAD</h3><p>Attention drives activity. Communities form. The market grows with the moment.</p></div></article></div></section>
  <section id="market" className="market"><div className="sectionNo">03 / ATTENTION → MARKET</div><div className="marketBig"><span>VIRAL</span><strong>→</strong><span>ONCHAIN</span><strong>→</strong><span>MARKET</span></div><p>VIRL is the missing layer between what the internet talks about and what the internet can own.</p></section>
  <section id="launch" className="final"><div className="finalOrb"><img src={logo}/></div><div className="sectionNo">04 / THE NEXT VIRAL ASSET</div><h2>DON'T JUST<br/><i>GO VIRAL.</i><br/>VIRL IT.</h2><a className="primary" href="#">ENTER VIRL ↗</a></section>
 </main><footer><span>© 2026 VIRL</span><span>TURN INTERNET ATTENTION INTO ONCHAIN VALUE.</span><span>BUILT FOR THE VIRAL.</span></footer></div>}
createRoot(document.getElementById('root')).render(<App/>);
