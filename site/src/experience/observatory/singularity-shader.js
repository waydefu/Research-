// Procedural "singularity" effect: one full-screen WebGL2 fragment shader, no 3D model,
// no texture, no third-party code. Original work inspired by the *grammar* of cosmic
// rift illustrations (a luminous point with an anamorphic cross flare, plasma walls
// converging on it, drifting dark debris, hairline fractures, faint sigil rings).
// Nothing here samples or copies any reference image.
//
// This module is pure data (strings and numbers) so Node tests can inspect it without a GPU.

export const VERTEX_SOURCE=`#version 300 es
// One oversized triangle covers the viewport; no vertex buffer needed.
void main(){
  vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);
  gl_Position=vec4(p*2.0-1.0,0.0,1.0);
}`;

// Palettes are five colour stops from the void to the white-hot core.
export const THEMES=Object.freeze({
  // The site's own world: night navy, violet haze, aged gold, pale hot core.
  aurum:Object.freeze({id:0,label:'金色奇點',floor:1,stops:['#03050b','#101a4a','#5b3590','#e0a03c','#fff1cf']}),
  // Magenta and ember: the red/gold family of rift illustrations.
  ember:Object.freeze({id:1,label:'赤焰裂隙',floor:1,stops:['#07020a','#4a0a2e','#c21a5e','#ff7a2e','#fff0c8']}),
  // Blue and violet: the cold lens family.
  nebula:Object.freeze({id:2,label:'冷光透鏡',floor:0,stops:['#02030a','#0d1b5c','#4b3fd0','#a98bff','#f2f8ff']})
});
export const THEME_ORDER=Object.freeze(['aurum','ember','nebula']);

// Quality tiers trade noise octaves and debris layers for fill-rate.
export const QUALITY_TIERS=Object.freeze({
  low:Object.freeze({octaves:3,debrisLayers:1,cracks:0,scale:0.5}),
  medium:Object.freeze({octaves:4,debrisLayers:2,cracks:1,scale:0.7}),
  high:Object.freeze({octaves:5,debrisLayers:3,cracks:1,scale:1.0})
});

export const FRAGMENT_SOURCE=`#version 300 es
precision highp float;
out vec4 outColor;

uniform vec2  uRes;       // drawing-buffer size in pixels
uniform float uTime;      // seconds of animation (frozen by the caller when paused)
uniform vec2  uPointer;   // -1..1, eased by the caller
uniform float uPhase;     // 0..1 narrative: slit -> tear -> fracture -> eruption (scroll or intro)
uniform int   uTheme;     // 0 aurum, 1 ember, 2 nebula
uniform int   uOctaves;   // 3..5
uniform int   uDebris;    // 1..3 layers
uniform int   uCracks;    // 0/1
uniform int   uFloor;     // 0/1 reflective cracked ground

const float TAU=6.2831853;

float hash11(float p){p=fract(p*.1031);p*=p+33.33;p*=p+p;return fract(p);}
float hash21(vec2 p){vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}
vec2  hash22(vec2 p){vec3 q=fract(vec3(p.xyx)*vec3(.1031,.1030,.0973));q+=dot(q,q.yzx+33.33);return fract((q.xx+q.yz)*q.zy);}

float vnoise(vec2 p){
  vec2 i=floor(p),f=fract(p);
  vec2 u=f*f*(3.0-2.0*f);
  return mix(mix(hash21(i),hash21(i+vec2(1,0)),u.x),
             mix(hash21(i+vec2(0,1)),hash21(i+vec2(1,1)),u.x),u.y);
}
float fbm(vec2 p,int oct){
  float a=.5,s=0.;
  for(int i=0;i<5;i++){
    if(i>=oct)break;
    s+=a*vnoise(p);
    p=p*2.03+vec2(17.1,9.2);
    a*=.5;
  }
  return s;
}

// --- palettes (display-referred colour stops) ------------------------------
vec3 stop(int theme,int i){
  if(theme==1){
    if(i==0)return vec3(.027,.008,.039);
    if(i==1)return vec3(.290,.039,.180);
    if(i==2)return vec3(.760,.102,.370);
    if(i==3)return vec3(1.0,.478,.180);
    return vec3(1.0,.940,.784);
  }
  if(theme==2){
    if(i==0)return vec3(.008,.012,.039);
    if(i==1)return vec3(.051,.106,.360);
    if(i==2)return vec3(.294,.247,.816);
    if(i==3)return vec3(.663,.545,1.0);
    return vec3(.949,.973,1.0);
  }
  if(i==0)return vec3(.012,.020,.043);
  if(i==1)return vec3(.063,.102,.290);
  if(i==2)return vec3(.357,.208,.565);
  if(i==3)return vec3(.878,.627,.235);
  return vec3(1.0,.945,.812);
}
vec3 ramp(float t,int theme){
  t=clamp(t,0.,1.)*4.0;
  int i=int(min(floor(t),3.0));
  return mix(stop(theme,i),stop(theme,i+1),smoothstep(0.,1.,t-float(i)));
}

// --- debris: dark shards and sparks in log-polar cells ----------------------
vec2 debris(vec2 p,float k,float seed,float speed,float t){
  float r=length(p)+1e-4;
  vec2 lp=vec2(atan(p.y,p.x)/TAU*k*5.0,log(r)*k*.9-t*speed);
  vec2 id=floor(lp),f=fract(lp)-.5;
  float h=hash21(id+seed);
  if(h>.17)return vec2(0.);
  vec2 off=(hash22(id+seed*1.7)-.5)*.5;
  float size=mix(.10,.30,hash21(id*1.3+seed));
  vec2 d=(f-off)*vec2(1.0,.38);
  float shard=smoothstep(size,size*.55,abs(d.x)*1.5+abs(d.y)*.9);
  float spark=smoothstep(.07,.0,length(f-off))*step(.78,hash21(id+seed*3.1));
  float fade=smoothstep(.02,.18,r)*smoothstep(1.4,.5,r);
  return vec2(shard*fade,spark*fade);
}

// --- voronoi edges: distance to the nearest cell border ---------------------
float voroEdge(vec2 q){
  vec2 ip=floor(q),fp=fract(q);
  float d1=8.,d2=8.;
  for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){
    vec2 g=vec2(float(x),float(y));
    vec2 o=hash22(ip+g);
    float d=length(g+o-fp);
    if(d<d1){d2=d1;d1=d;}else if(d<d2){d2=d;}
  }
  return d2-d1;
}
float cracks(vec2 p,float reach){
  float edge=voroEdge(abs(p)*5.2);
  float line=smoothstep(.030,.0,edge)+smoothstep(.11,.0,edge)*.07;
  return line*smoothstep(reach,reach*.35,length(p));
}

void main(){
  vec2 uv=(gl_FragCoord.xy-.5*uRes)/uRes.y;      // height spans -0.5..0.5
  float aspect=uRes.x/uRes.y;
  float t=uTime;
  float phase=clamp(uPhase,0.,1.);
  // Narrative beats, each a smooth ramp over a slice of the phase.
  float open =smoothstep(.00,.42,phase);        // the slit widens into a tear
  float split=smoothstep(.18,.62,phase);        // plasma walls fill in
  float frac =smoothstep(.45,.80,phase);        // fractures and sigils spread
  float burst=smoothstep(.70,1.00,phase);       // eruption: flare and shock

  vec2 c=uPointer*vec2(.035,.025);
  vec2 p=uv-c;
  p.x/=max(1.0,.55/aspect)*0.9+0.1;              // keep the walls on narrow screens
  float r=length(p);
  float horizon=-.24;

  // 1. Plasma walls: log-polar flow converging on the point, lens-stretched in y.
  float side=p.x<0.?1.:0.;
  vec2 q=vec2(abs(p.x),p.y*.50);                 // fold: atan() never wraps, so no seam
  float ang=atan(q.y,q.x);
  float rad=length(q)+.012;
  vec2 w=vec2(ang*2.4+side*7.3+t*.020,log(rad)*.80-t*.055);
  float warp=fbm(w*vec2(1.4,2.2)+vec2(3.1,t*.03),uOctaves);
  float n=fbm(w*vec2(1.0,1.6)+vec2(warp*1.3,warp*.6),uOctaves);
  float fil=vnoise(vec2(w.x*9.0+warp*4.0,w.y*1.3));
  n*=.55+.9*fil;
  float gapW=(.016+.30*pow(abs(p.y),1.15))*mix(.15,1.,open);
  float slit=smoothstep(gapW,gapW*2.6,abs(p.x));
  float wallFade=smoothstep(1.25,.12,length(vec2(p.x*.75,p.y)));
  float wall=n*slit*wallFade*split;
  float heat=smoothstep(.17,.90,wall*1.45);
  heat=pow(heat,1.6)*(.32+.58*smoothstep(.6,.04,r));

  vec3 col=ramp(0.,uTheme)*(.55+.9*smoothstep(1.,0.,r));
  col+=ramp(heat*.95,uTheme)*heat*1.15;

  // 2. Haze: a soft body under the filaments so the walls have mass, not just edges.
  col+=ramp(.26+.34*n,uTheme)*n*n*slit*wallFade*split*.9;

  // 3. Sigil rings: thin dashed orbits (the armillary, redrawn as light).
  for(int i=0;i<3;i++){
    float R=.17+float(i)*.115;
    float a=atan(p.y,p.x*.9)/TAU;
    float dash=step(.52,fract(a*(6.+float(i)*4.)+t*(.012+float(i)*.006)*(i==1?-1.:1.)));
    float band=smoothstep(.0035,.0,abs(length(vec2(p.x*.9,p.y*1.08))-R*frac));
    col+=ramp(.80,uTheme)*band*(.28+.55*dash)*.45*smoothstep(0.,.3,frac);
  }

  // A ray/sphere intersection supplies actual depth for a rotating wire globe.
  // It is procedural geometry (no mesh or texture), composited beneath the core.
  vec3 rayOrigin=vec3(0.,0.,2.5);
  vec3 rayDirection=normalize(vec3(p*1.65,-1.8));
  float b=dot(rayOrigin,rayDirection);
  float discriminant=b*b-dot(rayOrigin,rayOrigin)+.40*.40;
  if(discriminant>0.){
    float nearHit=-b-sqrt(discriminant);
    vec3 normal=normalize(rayOrigin+rayDirection*nearHit);
    float longitude=atan(normal.z,normal.x)+t*.075;
    float latitude=asin(clamp(normal.y,-1.,1.));
    float meridian=abs(sin(longitude*7.));
    float parallel=abs(sin(latitude*8.));
    float grid=1.-smoothstep(.015,.075,min(meridian,parallel));
    float rim=pow(1.-max(normal.z,0.),2.5);
    float light=.25+.75*max(dot(normal,normalize(vec3(-.4,.65,1.))),0.);
    vec3 contour=mix(ramp(.72,uTheme),vec3(.25,.83,.87),.30);
    col+=contour*(grid*light*.13+rim*.10)*smoothstep(.04,.45,frac);
  }

  // 4. Fractures in the air: gold hairlines growing out of the core into four plates.
  if(uCracks==1){
    float cr=cracks(p,.34*frac+.001)*frac;
    col+=ramp(.80,uTheme)*cr*.38;
  }

  // 5. Reflective cracked ground: perspective tiles lit from the core.
  if(uFloor==1&&p.y<horizon){
    float dy=horizon-p.y;
    float z=.30/(dy+.004);
    vec2 fp=vec2(p.x*z,z+t*.06);
    float edge=voroEdge(fp*1.15);
    float tile=hash21(floor(fp*1.15));
    float lit=exp(-abs(p.x)*3.2)*exp(-dy*1.8);
    // Seams thin out with distance: far tiles alias into sparkle otherwise.
    float seam=smoothstep(.07,.0,edge)*smoothstep(.015,.16,dy);
    vec3 warm=ramp(.78,uTheme);
    vec3 ground=ramp(.06+.18*tile,uTheme)*(.25+.9*lit);
    ground+=warm*seam*(.12+1.6*lit)*(.35+.65*frac);
    // Mirror image of the beam on the ground, softened by the tile texture.
    float refl=exp(-abs(p.x)*mix(60.,16.,open))*exp(-dy*3.0);
    ground+=warm*refl*(.65+.45*tile)*(.4+.6*burst);
    float fm=smoothstep(0.,.012,dy);
    col=mix(col,ground,fm);
    // Horizon haze: the world glows where the sky meets the floor.
    col+=ramp(.55,uTheme)*exp(-abs(p.y-horizon)*34.)*exp(-abs(p.x)*1.6)*.35*(.4+.6*open);
  }

  // 6. Core glow and the anamorphic cross flare.
  float core=exp(-r*20.)*1.4+.010/(r+.025);
  float shimmer=1.+.12*sin(t*2.7+p.y*18.)+.06*sin(t*6.1);
  float vflare=exp(-abs(p.x)*mix(520.,150.,open))*exp(-abs(p.y)*mix(9.,1.55,open))*shimmer*(1.+.6*burst);
  float hflare=exp(-abs(p.y)*mix(520.,190.,open))*exp(-abs(p.x)*mix(9.,2.3,open))*.5*(1.+.9*burst);
  float diag=exp(-abs(p.x-p.y)*90.)*exp(-r*5.)*.18+exp(-abs(p.x+p.y)*90.)*exp(-r*5.)*.18;
  vec3 hot=ramp(1.,uTheme),warm2=ramp(.78,uTheme);
  float ignite=smoothstep(0.,.12,phase);         // nothing glows at phase 0
  col+=(hot*core*(1.+.7*burst)+warm2*(vflare+hflare)*1.35+warm2*diag)*ignite;

  // 7. Shock rings: a faint pulse leaves the core every few seconds during the eruption.
  float sr=fract(t*.16);
  col+=ramp(.85,uTheme)*smoothstep(.014,.0,abs(r-sr*1.1))*(1.-sr)*(1.-sr)*.55*burst;

  // 8. Debris: dark shards in front of the glow, bright sparks on top.
  float shardMask=0.,sparks=0.;
  for(int L=0;L<3;L++){
    if(L>=uDebris)break;
    float fl=float(L);
    vec2 d=debris(p,1.5+fl*1.1,fl*7.3,.16+fl*.07+.25*burst,t+fl*3.7);
    shardMask=max(shardMask,d.x);
    sparks+=d.y;
  }
  float debrisOn=smoothstep(.25,.6,phase);
  col*=1.-shardMask*.86*debrisOn;
  col+=ramp(1.,uTheme)*sparks*1.1*debrisOn;

  // 9. Finish: soft shoulder tone-map, vignette, a little grain against banding.
  col=1.-exp(-col*1.25);
  col*=1.-.55*smoothstep(.55,1.15,length(uv*vec2(.8,1.)));
  col+=(hash21(gl_FragCoord.xy+fract(t)*91.)-.5)*.012;
  col=pow(max(col,0.),vec3(1./1.12));
  outColor=vec4(col,1.);
}`;
