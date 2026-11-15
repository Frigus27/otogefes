import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
const dir = path.dirname(fileURLToPath(import.meta.url));
const glyphs = JSON.parse(await fs.readFile(path.join(dir,'glyphs.json'),'utf8'));
const C = { ink:'#171811', paper:'#f3f0e6', lime:'#dcff4f', muted:'#a7a998', line:'#3a3b30' };
function txt(s,x,y,size,fill=C.paper,family='cn',tracking=0){
  let out='', pos=x;
  for(const ch of s){
    if(ch===' '){pos+=size*(family==='mono' ? .602 : .32)+tracking;continue;}
    const glyph=glyphs[`${family}:${ch}`]; if(!glyph) throw new Error(`Missing ${family}:${ch}`);
    out+=`<path fill="${fill}" d="${glyph.d}" transform="translate(${pos} ${y}) scale(${size/1000} ${-size/1000})"/>`;
    pos+=glyph.advance*size/1000+tracking;
  } return out;
}
function bracket(x,y,s,closing=false,color=C.lime){
  const t=s*.047, w=s*.20, h=s*.86;
  const d=closing ? `M${x} ${y+h}h${w}v${-h}h${-t}v${h-t}h${-(w-t)}Z` : `M${x+w} ${y}h${-w}v${h}h${t}v${-(h-t)}h${w-t}Z`;
  return `<path fill="${color}" d="${d}"/>`;
}
function beat(x,baseline,s,color=C.lime){
  const y=baseline-s*.39;
  return `<path fill="${color}" d="M${x+s*.03} ${y}H${x+s*.78}L${x+s*.90} ${y-s*.10}L${x+s*1.03} ${y+s*.025}L${x+s*.90} ${y+s*.15}L${x+s*.78} ${y+s*.055}H${x+s*.03}Z"/>`;
}
function mark(x,y,size,color=C.lime){return `<g transform="translate(${x} ${y}) scale(${size/160})" fill="${color}"><path d="M10 65 80 8 150 65 137 81 80 35 23 81Z"/><path d="M29 87H123L135 75 148 88 135 101 123 94H29Z"/><path fill-rule="evenodd" d="M44 111H116V155H44ZM56 122V144H104V122Z"/></g>`;}
function horizontal(fg=C.paper,accent=C.lime){
 let o=mark(6,8,150,accent);
 o+=txt('合肥',190,91,72,fg);
 o+=bracket(345,29,70,false,accent);
 o+=txt('第',367,91,72,accent);
 o+=beat(442,91,72,accent);
 o+=bracket(524,29,70,true,accent);
 o+=txt('音游祭',555,91,72,fg);
 o+=txt('HEFEI OTOGE FES',193,134,16,fg,'mono',2.1);
 o+=`<path stroke="${fg}" stroke-width="1" opacity=".5" d="M481 122v15"/>`;
 o+=txt('VOL. 01',501,134,13,fg,'mono',1.3);
 return o;
}
function stacked(fg=C.paper,accent=C.lime){
 let o=txt('合肥',35,91,73,fg);
 o+=txt('HEFEI',219,47,20,fg,'mono',2.8);
 o+=txt('OTOGE FES',219,77,20,fg,'mono',1.4);
 o+=bracket(36,132,188,false,accent);
 o+=txt('第',94,289,188,accent);
 o+=beat(282,289,188,accent);
 o+=bracket(505,132,188,true,accent);
 o+=txt('音游祭',30,474,178,fg);
 return o;
}
function svg(w,h,body,bg=null,title='合肥「第一」音游祭 · 第一拍标识'){return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${title}"><title>${title}</title>${bg?`<path fill="${bg}" d="M0 0H${w}V${h}H0Z"/>`:''}${body}</svg>`;}
async function save(name,w,h,body,bg=null,scale=2){
 const source=svg(w,h,body,bg); await fs.writeFile(path.join(dir,`${name}.svg`),source);
 await sharp(Buffer.from(source)).resize(w*scale,h*scale).png().toFile(path.join(dir,`${name}.png`));
}
await save('logo-horizontal-dark',840,180,horizontal(),C.ink,3);
await save('logo-horizontal-transparent',840,180,horizontal(),null,3);
await save('logo-horizontal-mono',840,180,horizontal(C.ink,C.ink),null,3);
await save('logo-stacked-dark',600,520,stacked(),C.ink,3);
await save('logo-stacked-transparent',600,520,stacked(),null,3);
await save('logo-stacked-mono',600,520,stacked(C.ink,C.ink),null,3);
await save('logo-symbol',192,192,mark(16,16,160),null,4);
await save('logo-avatar',512,512,mark(96,86,320),C.ink,2);
// A presentation sheet showing the same identity at different sizes and on paper.
let b='';
b+=txt('HF / OTOGE FES',64,51,13,C.muted,'mono',1.6);
b+=txt('IDENTITY STUDY   01',982,51,12,C.muted,'mono',1.2);
b+=`<path d="M64 76H1336" stroke="${C.line}"/>`;
b+=`<g transform="translate(72 129) scale(1.02)">${stacked()}</g>`;
b+=`<path d="M762 128V672" stroke="${C.line}"/>`;
b+=mark(887,154,270);
b+=txt('FIRST BEAT.',859,491,27,C.paper,'sans',1.5);
b+=txt('ONE CITY. ONE RHYTHM.',857,524,12,C.muted,'mono',1.0);
b+=`<path d="M858 565H1200" stroke="${C.line}"/>`;
b+=`<path fill="${C.lime}" d="M858 591H886V619H858Z"/><path fill="${C.paper}" d="M900 591H928V619H900Z"/><path fill="${C.ink}" stroke="${C.line}" d="M942 591H970V619H942Z"/>`;
b+=txt('#DCFF4F / #F3F0E6 / #171811',858,647,10,C.muted,'mono',.4);
b+=`<path d="M64 706H1336" stroke="${C.line}"/>`;
b+=txt('01 / HORIZONTAL LOCKUP',64,746,11,C.muted,'mono',1.1);
b+=`<g transform="translate(110 789) scale(1.36)">${horizontal()}</g>`;
b+=`<path fill="${C.paper}" d="M0 1080H1400V1460H0Z"/>`;
b+=txt('02 / SINGLE COLOUR',64,1126,11,'#626456','mono',1.1);
b+=`<g transform="translate(110 1180) scale(1.36)">${horizontal(C.ink,C.ink)}</g>`;
b+=txt('HEFEI OTOGE FES / VOL. 01',64,1516,11,C.muted,'mono',1.1);
b+=txt('FIRST BEAT / 2026',1141,1516,10,C.muted,'mono',.6);
await save('logo-presentation',1400,1560,b,C.ink,1);
// Compact 32 px symbol preview, retaining broad strokes and open counters.
await sharp(Buffer.from(svg(192,192,mark(16,16,160),C.ink))).resize(32,32).png().toFile(path.join(dir,'symbol-32.png'));
console.log('Generated SVG sources, outlined lettering, transparent PNGs, and presentation sheet.');
