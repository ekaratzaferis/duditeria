import{W as q,S as J,h as K,i as Q,P as Y,j as Z,k as U,c as z,a as $,l as ee,U as te,m as ne,I as oe,O as ie,n as g,G as se,o as k,B as ae,p as C}from"./three.module.DKYXaUbZ.js";function re(x){const l=new q({canvas:x,antialias:!0});l.setPixelRatio(Math.min(window.devicePixelRatio,2)),l.setSize(window.innerWidth,window.innerHeight);const d=new J;d.background=new K(15790312),d.fog=new Q(15262940,4,28);const f=new Y(65,window.innerWidth/window.innerHeight,.1,100);f.position.set(0,1.4,10),f.lookAt(0,1.2,0);const b=new Z({color:0,side:U}),A=new z(new $(60,60),b);A.rotation.x=-Math.PI/2,A.position.y=0,d.add(A);let S=42;function n(){return S=(S*16807+0)%2147483647,(S-1)/2147483646}function t(o,v,e=1){const s=new se,u=new z(new k(.25*e,7*e,.3*e),b);u.position.y=3.5*e,s.add(u);const L=[{y:4.5,w:4,h:2.8},{y:6.2,w:3.4,h:2.4},{y:7.6,w:2.8,h:2},{y:8.7,w:2,h:1.8},{y:9.5,w:1.3,h:1.4}];for(const{y:w,w:i,h:a}of L)for(let M=0;M<3;M++){const P=i*e*(.65+n()*.45),O=a*e*(.45+n()*.35),V=.9*e*(.5+n()*.7),E=new z(new k(P,O,V),b);E.position.set((n()-.5)*.6*e,w*e+(n()-.5)*.5*e,(n()-.5)*.3*e),E.rotation.z=(n()-.5)*.25,s.add(E)}s.position.set(o,0,v),d.add(s)}t(-5.5,7.5,1.15),t(5.8,6.8,1.05),t(-2.8,4.5,.9),t(2.5,3.8,.85),t(-7,3.2,.8),t(7.5,4,.88),t(.4,2.5,.78),t(-4,-1,.72),t(3.5,-2.5,.68),t(-1.2,-4,.65),t(6,-3.5,.6),t(-7.5,-5,.58),t(1.8,-7,.55),t(-3.5,-9,.52),t(5,-11,.5);const N=`
    #include <fog_pars_vertex>

    attribute float aPhase;
    attribute float aSpeed;
    attribute float aAmplitude;
    attribute float aWorldX;
    uniform float uTime;

    void main() {
      float t = uv.y; // 0 = base, 1 = tip

      vec3 pos = position;

      // Natural forward lean at tip
      pos.z += t * t * 0.09;

      // Wind: traveling wave across x + per-blade variation
      // Primary sway + subtle secondary wobble for organic feel
      float wave  = sin(uTime * aSpeed       + aWorldX * 0.55 + aPhase);
      float wave2 = sin(uTime * aSpeed * 2.3 + aPhase  * 1.7) * 0.22;
      float sway  = (wave + wave2) * aAmplitude * t * t;

      pos.x += sway;
      pos.z += sway * 0.25; // slight depth component makes it feel 3-D

      #ifdef USE_INSTANCING
        vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(pos, 1.0);
      #else
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      #endif

      gl_Position = projectionMatrix * mvPosition;

      #include <fog_vertex>
    }
  `,j=`
    #include <fog_pars_fragment>

    void main() {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      #include <fog_fragment>
    }
  `;function H(){const e=[],s=[],u=[];for(let i=0;i<=5;i++){const a=i/5,p=.055*(1-a*a*.96);e.push(-p/2,a,0,p/2,a,0),s.push(0,a,1,a)}e.push(0,1.08,0),s.push(.5,1.08);for(let i=0;i<5;i++){const a=i*2,p=i*2+1,M=(i+1)*2,P=(i+1)*2+1;u.push(a,p,M,p,P,M)}u.push(10,11,12);const w=new ae;return w.setAttribute("position",new C(e,3)),w.setAttribute("uv",new C(s,2)),w.setIndex(u),w}const c=600,h=H(),_=new Float32Array(c),I=new Float32Array(c),W=new Float32Array(c),B=new Float32Array(c),F=new ee({uniforms:te.merge([ne.fog,{uTime:{value:0}}]),vertexShader:N,fragmentShader:j,side:U,fog:!0}),y=new oe(h,F,c),m=new ie,X=[{z:9.2,count:150,spread:12,hMin:.3,hMax:.6},{z:7.8,count:130,spread:14,hMin:.35,hMax:.7},{z:6.3,count:110,spread:16,hMin:.25,hMax:.55},{z:4.8,count:100,spread:18,hMin:.3,hMax:.65},{z:3.2,count:110,spread:20,hMin:.25,hMax:.5}];let r=0;for(const o of X)for(let v=0;v<o.count&&r<c;v++,r++){const e=o.hMin+n()*(o.hMax-o.hMin),s=(n()-.5)*o.spread;m.position.set(s,0,o.z+(n()-.5)*1.2),m.rotation.set(0,n()*Math.PI,0),m.scale.set(1,e,1),m.updateMatrix(),y.setMatrixAt(r,m.matrix),_[r]=n()*Math.PI*2,I[r]=.65+n()*.9,W[r]=.13+n()*.22,B[r]=s}h.setAttribute("aPhase",new g(_,1)),h.setAttribute("aSpeed",new g(I,1)),h.setAttribute("aAmplitude",new g(W,1)),h.setAttribute("aWorldX",new g(B,1)),y.instanceMatrix.needsUpdate=!0,d.add(y);let G;function T(o){G=requestAnimationFrame(T),F.uniforms.uTime.value=o*.001,l.render(d,f)}G=requestAnimationFrame(T);function R(){f.aspect=window.innerWidth/window.innerHeight,f.updateProjectionMatrix(),l.setSize(window.innerWidth,window.innerHeight)}return window.addEventListener("resize",R),function(){cancelAnimationFrame(G),window.removeEventListener("resize",R),l.dispose()}}const D=document.getElementById("limbo-canvas");if(D){const x=re(D);window.addEventListener("beforeunload",x,{once:!0})}
