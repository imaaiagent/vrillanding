import React,{useEffect,useRef} from 'react';
import {createRoot} from 'react-dom/client';
import * as THREE from 'three';
import './style.css';

const logo='/virl-logo.png';

const ICONS={
 github:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#fff" d="M12 .7A11.3 11.3 0 0 0 8.43 22.8c.57.1.78-.25.78-.55v-2.1c-3.18.69-3.85-1.35-3.85-1.35-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.67 1.25 3.32.96.1-.74.4-1.25.72-1.54-2.54-.29-5.2-1.27-5.2-5.65 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.45.11-3.03 0 0 .96-.31 3.13 1.17a10.8 10.8 0 0 1 5.7 0c2.17-1.48 3.13-1.17 3.13-1.17.62 1.58.23 2.74.11 3.03.73.8 1.18 1.82 1.18 3.07 0 4.39-2.67 5.35-5.22 5.64.41.36.77 1.08.77 2.18v3.23c0 .3.21.65.79.55A11.3 11.3 0 0 0 12 .7Z"/></svg>`,
 x:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#fff" d="M18.9 2H22l-6.77 7.74L23.2 22h-6.25l-4.9-6.4L6.45 22H3.33l7.24-8.28L2.8 2h6.4l4.43 5.86L18.9 2Zm-1.1 17.9h1.73L8.36 3.98H6.5L17.8 19.9Z"/></svg>`,
 tiktok:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#fff" d="M16.6 2c.2 2.1 1.4 3.7 3.4 4.2v3.1c-1.3-.1-2.5-.5-3.5-1.2v6.7c0 4.3-2.9 6.9-6.7 6.9A6.3 6.3 0 0 1 3.5 15c0-3.8 3-6.5 6.6-6.5.3 0 .7 0 1 .1v3.3a4 4 0 0 0-1-.1c-1.7 0-3.1 1.3-3.1 3.2s1.4 3.2 3 3.2c2 0 3.2-1.2 3.2-3.7V2h3.4Z"/></svg>`,
 instagram:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#fff" d="M7.2 2h9.6A5.2 5.2 0 0 1 22 7.2v9.6a5.2 5.2 0 0 1-5.2 5.2H7.2A5.2 5.2 0 0 1 2 16.8V7.2A5.2 5.2 0 0 1 7.2 2Zm-.1 2A3.1 3.1 0 0 0 4 7.1v9.8A3.1 3.1 0 0 0 7.1 20h9.8a3.1 3.1 0 0 0 3.1-3.1V7.1A3.1 3.1 0 0 0 16.9 4H7.1Zm9.65 1.5a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/></svg>`,
 robinhood:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#fff" d="M12 2.1c-4.8 0-8.8 3.7-8.8 8.4 0 3.2 1.9 6 4.8 7.5-.1-.6-.1-1.7 0-2.4l1-4.2s-.3-.6-.3-1.5c0-1.4.8-2.5 1.8-2.5.9 0 1.3.7 1.3 1.5 0 .9-.6 2.2-.9 3.4-.3 1 .5 1.8 1.5 1.8 1.8 0 3.1-1.9 3.1-4.6 0-2.4-1.7-4.1-4.2-4.1-2.9 0-4.6 2.2-4.6 4.4 0 .9.3 1.9.7 2.4.1.1.1.2.1.3l-.3 1.2c-.1.4-.4.5-.8.3-1.4-.6-2.2-2.5-2.2-4 0-3.3 2.4-6.3 7-6.3 3.7 0 6.6 2.6 6.6 6 0 3.6-2.3 6.5-5.5 6.5-1.1 0-2.2-.6-2.6-1.3l-.7 2.5c-.3.9-1.1 2.1-1.6 2.8 1.2.4 2.5.6 3.8.6 4.8 0 8.8-3.7 8.8-8.4S16.8 2.1 12 2.1Z"/></svg>`
};

function svgTexture(key){
 const svg=ICONS[key];
 const url='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
 return new THREE.TextureLoader().load(url);
}

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
  for(let i=7;i>=0;i--){
   const m=new THREE.MeshBasicMaterial({map:tex,transparent:true,opacity:i===0?1:.055,depthWrite:false,blending:THREE.AdditiveBlending});
   const mesh=new THREE.Mesh(new THREE.PlaneGeometry(4.45,2.98),m); mesh.position.z=-i*.028; root.add(mesh);
  }
  const core=new THREE.Mesh(new THREE.PlaneGeometry(4.45,2.98),new THREE.MeshPhysicalMaterial({map:tex,transparent:true,roughness:.12,metalness:.35,clearcoat:1,side:THREE.DoubleSide}));
  core.position.z=.02; root.add(core);

  const ringMat=new THREE.MeshBasicMaterial({color:0x6dffd0,transparent:true,opacity:.32});
  for(let i=0;i<3;i++){
   const r=new THREE.Mesh(new THREE.TorusGeometry(2.45+i*.3,.009,10,180),ringMat);
   r.rotation.set(.45+i*.45,.25+i*.8,i*.55); r.userData.speed=(i%2?-.22:.16); root.add(r);
  }

  const n=1100, pos=new Float32Array(n*3), target=new Float32Array(n*3), phase=new Float32Array(n);
  for(let i=0;i<n;i++){
   const a=Math.random()*Math.PI*2, rad=3.2+Math.random()*3.2;
   pos[i*3]=Math.cos(a)*rad; pos[i*3+1]=(Math.random()-.5)*5.2; pos[i*3+2]=(Math.random()-.5)*4.5;
   target[i*3]=(Math.random()-.5)*2.6; target[i*3+1]=(Math.random()-.5)*1.7; target[i*3+2]=.4+(Math.random()-.5)*.8; phase[i]=Math.random();
  }
  const pg=new THREE.BufferGeometry(); pg.setAttribute('position',new THREE.BufferAttribute(pos,3));
  const pm=new THREE.PointsMaterial({color:0xcaffed,size:.018,transparent:true,opacity:.72,depthWrite:false});
  const particles=new THREE.Points(pg,pm); scene.add(particles);

  // Social identities orbit VIRL — actual floating logo marks, no empty cubes.
  const socials=new THREE.Group(); scene.add(socials);
  const socialKeys=['github','x','tiktok','instagram','robinhood'];
  const socialLabels=['GITHUB','X','TIKTOK','INSTAGRAM','ROBINHOOD'];
  const socialMats=[];
  socialKeys.forEach((key)=>{
   const svg=ICONS[key];
   const img=new Image();
   const tex=new THREE.Texture();
   img.onload=()=>{tex.image=img;tex.needsUpdate=true};
   img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
   tex.colorSpace=THREE.SRGBColorSpace;
   socialMats.push(tex);
  });
  socialKeys.forEach((key,i)=>{
   const g=new THREE.Group();
   // Soft glow behind each identity.
   const halo=new THREE.Sprite(new THREE.SpriteMaterial({color:0x5fffc7,transparent:true,opacity:.13,depthWrite:false,blending:THREE.AdditiveBlending}));
   halo.scale.set(.98,.98,1); g.add(halo);
   const icon=new THREE.Sprite(new THREE.SpriteMaterial({map:socialMats[i],transparent:true,opacity:1,depthWrite:false}));
   icon.scale.set(.72,.72,1); g.add(icon);
   const a=i/socialKeys.length*Math.PI*2+.35, r=2.85+(i%2)*.28;
   g.position.set(Math.cos(a)*r,Math.sin(a)*r*.55,(i-2)*.42);
   g.userData={a,r,speed:.12+Math.random()*.1,phase:Math.random()*6,label:socialLabels[i]};
   socials.add(g);
  });

  let mx=0,my=0;
  const move=e=>{mx=e.clientX/innerWidth-.5; my=e.clientY/innerHeight-.5};
  addEventListener('pointermove',move);
  const clock=new THREE.Clock();
  function tick(){
   const t=clock.getElapsedTime();
   root.rotation.y+=(mx*.24-root.rotation.y)*.035; root.rotation.x+=(-my*.14-root.rotation.x)*.035; root.position.y+=((Math.sin(t*.7)*.06)-root.position.y)*.035;
   root.position.z=Math.sin(t*.32)*.08;
   root.children.forEach(o=>{if(o.isMesh&&o.geometry.type==='TorusGeometry')o.rotation.z+=o.userData.speed*.002});
   const arr=pg.attributes.position.array;
   for(let i=0;i<n;i++){
    const k=i*3, q=(phase[i]+t*.055)%1, ease=q*q*(3-2*q);
    const a=phase[i]*6.283+t*.06*(i%3?1:-1), rad=3.2+((i*17)%100)/100*3.1;
    const sx=Math.cos(a)*rad, sy0=(Math.sin(i*12.71)*.5)*5.2, sz=Math.sin(a)*rad*.55;
    arr[k]=sx*(1-ease)+target[k]*ease; arr[k+1]=sy0*(1-ease)+target[k+1]*ease; arr[k+2]=sz*(1-ease)+target[k+2]*ease;
   }
   pg.attributes.position.needsUpdate=true;
   socials.children.forEach(g=>{const d=g.userData; const a=d.a+t*d.speed; g.position.x=Math.cos(a)*d.r; g.position.y=Math.sin(a)*d.r*.55; g.position.z=Math.sin(t*.7+d.phase)*.65; g.rotation.x=Math.sin(t*.55+d.phase)*.12; g.rotation.y=Math.cos(t*.65+d.phase)*.28;});
   particles.rotation.y=t*.025;
   renderer.render(scene,camera); requestAnimationFrame(tick);
  } tick();
  const resize=()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)}; addEventListener('resize',resize);
  return()=>{removeEventListener('pointermove',move);removeEventListener('resize',resize);renderer.dispose();el.removeChild(renderer.domElement)};
 },[]);
 return <div ref={mount} className="scene"/>;
}

function App(){return <div className="site"><VirlScene/><div className="grain"/><nav><a className="brand" href="#top"><img src={logo}/><span>VIRL</span></a><div className="links"><a href="#idea">WHY VIRL</a><a href="#loop">HOW IT WORKS</a><a href="#market">THE MARKET</a></div><span className="navCta">COMING SOON</span></nav>
 <main id="top">
  <section className="hero"><div className="heroCopy"><div className="eyebrow"><span/> VIRL / COMING SOON</div><h1>TURN ATTENTION<br/><i>INTO VALUE.</i></h1><div className="comingSoon">COMING SOON</div><p>VIRL turns viral creators, social identities, memes and internet moments into onchain assets — connecting attention with markets, communities and speculation.</p><div className="buttons"><a className="primary" href="#idea">Discover VIRL <b>↓</b></a><a className="secondary" href="#loop">See the mechanism ↗</a></div></div><div className="heroHint"><span>YOUR SOCIAL IDENTITY</span><span>CAN BECOME AN ASSET</span></div><div className="scroll">SCROLL <b>↓</b></div></section>
  <section id="idea" className="statement"><div className="sectionNo">01 / THE IDEA</div><div><h2>The internet already<br/><span>creates attention.</span></h2><p>VIRL gives that attention a market. A viral moment becomes an identity, an identity becomes a token, and a token becomes a community-owned asset.</p></div></section>
  <section id="loop" className="loop"><div className="sectionNo">02 / THE VIRL LOOP</div><div className="steps"><article><span>01</span><div><h3>GO VIRAL</h3><p>A creator, meme, account, trend or personality captures the internet.</p></div></article><article><span>02</span><div><h3>RECOGNISE</h3><p>VIRL identifies the social identity and maps the attention around it.</p></div></article><article><span>03</span><div><h3>LAUNCH</h3><p>Turn the identity into an onchain asset that people can discover and trade.</p></div></article><article><span>04</span><div><h3>SPREAD</h3><p>Attention drives activity. Communities form. The market grows with the moment.</p></div></article></div></section>
  <section id="market" className="market"><div className="sectionNo">03 / ATTENTION → MARKET</div><div className="marketBig"><span>VIRAL</span><strong>→</strong><span>ONCHAIN</span><strong>→</strong><span>MARKET</span></div><p>VIRL is the missing layer between what the internet talks about and what the internet can own.</p></section>
  <section id="launch" className="final"><div className="finalOrb"><img src={logo}/></div><div className="sectionNo">04 / THE NEXT VIRAL ASSET</div><div className="finalSoon">COMING SOON</div><h2>DON'T JUST<br/><i>GO VIRAL.</i><br/>VIRL IT.</h2><span className="primary disabled">COMING SOON</span></section>
 </main><footer><span>© 2026 VIRL</span><span>TURN INTERNET ATTENTION INTO ONCHAIN VALUE.</span><span>BUILT FOR THE VIRAL.</span></footer></div>}
createRoot(document.getElementById('root')).render(<App/>);
