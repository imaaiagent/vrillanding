import React,{useEffect,useRef} from 'react';
import {createRoot} from 'react-dom/client';
import * as THREE from 'three';
import './style.css';

function Scene(){
 const ref=useRef(null);
 useEffect(()=>{
  const el=ref.current, scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(42,innerWidth/innerHeight,.1,100); camera.position.set(0,0,7.8);
  const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true}); renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.setSize(innerWidth,innerHeight); renderer.outputColorSpace=THREE.SRGBColorSpace; el.appendChild(renderer.domElement);
  scene.add(new THREE.AmbientLight(0xffffff,.7)); const key=new THREE.PointLight(0xffffff,16,18); key.position.set(4,3,5); scene.add(key); const rim=new THREE.PointLight(0x8aff4f,25,16); rim.position.set(-4,-2,3); scene.add(rim);
  const group=new THREE.Group(); scene.add(group);
  const geo=new THREE.IcosahedronGeometry(1.45,5); const mat=new THREE.MeshPhysicalMaterial({color:0xf3f5ef,roughness:.16,metalness:.72,clearcoat:1,clearcoatRoughness:.08}); const orb=new THREE.Mesh(geo,mat); group.add(orb);
  const ringMat=new THREE.MeshBasicMaterial({color:0xb9ff7b,transparent:true,opacity:.7});
  for(let i=0;i<3;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(1.95+i*.28,.012,12,160),ringMat); r.rotation.set(i*.7,i*.9,i*.35); group.add(r)}
  const pgeo=new THREE.BufferGeometry(), n=900, pos=new Float32Array(n*3); for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2, r=2.5+Math.random()*2.7; pos[i*3]=Math.cos(a)*r; pos[i*3+1]=(Math.random()-.5)*5.5; pos[i*3+2]=(Math.random()-.5)*4.5;} pgeo.setAttribute('position',new THREE.BufferAttribute(pos,3)); const stars=new THREE.Points(pgeo,new THREE.PointsMaterial({color:0xdfffd0,size:.012,transparent:true,opacity:.7})); scene.add(stars);
  let mx=0,my=0,scroll=0; const move=e=>{mx=(e.clientX/innerWidth-.5);my=(e.clientY/innerHeight-.5)}; const wheel=()=>scroll=scrollY; addEventListener('pointermove',move); addEventListener('scroll',wheel,{passive:true});
  const clock=new THREE.Clock(); function tick(){const t=clock.getElapsedTime(); orb.rotation.x=t*.12; orb.rotation.y=t*.24; group.rotation.x+=((my*.22-scroll*.00025)-group.rotation.x)*.035; group.rotation.y+=((mx*.35)-group.rotation.y)*.035; group.position.y=Math.sin(t*.65)*.08-scroll*.0008; stars.rotation.y=t*.012; renderer.render(scene,camera); requestAnimationFrame(tick)} tick();
  const resize=()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)}; addEventListener('resize',resize);
  return()=>{removeEventListener('pointermove',move);removeEventListener('scroll',wheel);removeEventListener('resize',resize);renderer.dispose();el.removeChild(renderer.domElement)}
 },[]); return <div className="scene" ref={ref}/>;
}
function App(){return <><Scene/><nav><div className="brand"><span className="mark">V</span> VIRL</div><div className="navlinks"><a href="#manifesto">Manifesto</a><a href="#how">How it works</a><a href="#launch">Launch</a></div><button className="pill">ENTER VIRL ↗</button></nav><main><section className="hero"><div className="eyebrow"><i/> THE VIRAL ASSET LAYER</div><h1>MAKE IT<br/><em>VIRL.</em></h1><p>Tokenize anything that goes viral. Turn internet moments into programmable, tradable digital assets.</p><div className="actions"><a className="primary" href="#manifesto">Explore VIRL <span>↓</span></a><a className="ghost" href="#how">See how it works ↗</a></div><div className="scroll">SCROLL TO DISCOVER <span>↓</span></div></section>
<section id="manifesto" className="manifesto"><div className="label">01 / THE IDEA</div><h2>The internet creates<br/><span>value at light speed.</span></h2><p>VIRL is the layer between a viral moment and its market. Capture attention, give it ownership, and let the crowd decide what comes next.</p></section>
<section id="how" className="cards"><div className="label">02 / THE LOOP</div><div className="grid"><article><b>01</b><h3>Spot</h3><p>Find the moment before everyone else does.</p></article><article><b>02</b><h3>Virl</h3><p>Package attention into a liquid on-chain asset.</p></article><article><b>03</b><h3>Run</h3><p>Trade, build, remix and send it further.</p></article></div></section>
<section id="launch" className="cta"><div className="label">03 / THE NEXT VIRAL THING</div><h2>DON'T CHASE<br/>THE VIRAL.</h2><div className="ctaLine"><strong>BECOME IT.</strong><a className="primary" href="#">ENTER VIRL ↗</a></div></section></main><footer><span>© 2026 VIRL</span><span>THE INTERNET, TOKENIZED.</span></footer></>}

createRoot(document.getElementById('root')).render(<App/>);
