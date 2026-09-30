import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import ts from 'typescript';
// Build a subdirectory-safe export, then restore editable source files.
const base=(process.env.PAGES_BASE_PATH||'').replace(/\/$/,'');
if(base&&!/^\/[a-zA-Z0-9._-]+$/.test(base))throw Error('Invalid Pages base path');
const originals=new Map();
const files=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]);
const change=(p,s)=>{originals.set(p,fs.readFileSync(p,'utf8'));fs.writeFileSync(p,s)};
try{
 if(base){
  for(const p of ['app','components','lib'].flatMap(files)){
   const source=fs.readFileSync(p,'utf8');let result=source;
   if(/\.[jt]sx?$/.test(p)){
    const ast=ts.createSourceFile(p,source,ts.ScriptTarget.Latest,true);const edits=[];
    const visit=n=>{if((ts.isStringLiteral(n)||ts.isNoSubstitutionTemplateLiteral(n)||ts.isTemplateHead(n))&&n.text.startsWith('/')&&!n.text.startsWith('//')){
     const parent=n.parent;const separator=ts.isCallExpression(parent)&&ts.isPropertyAccessExpression(parent.expression)&&['split','join'].includes(parent.expression.name.text);
     if(!separator)edits.push(n.getStart(ast)+1);
    }ts.forEachChild(n,visit)};visit(ast);
    for(const at of edits.sort((a,b)=>b-a))result=result.slice(0,at)+base+result.slice(at);
   }else if(p.endsWith('.css'))result=source.replace(/url\((['"]?)\/(?!\/)/g,(_,q)=>`url(${q}${base}/`);
   if(result!==source)change(p,result);
  }
  for(const p of files('public').filter(p=>p.endsWith('.json'))){
   const walk=v=>typeof v==='string'&&v.startsWith('/')&&!v.startsWith('//')?base+v:Array.isArray(v)?v.map(walk):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,x])=>[k,walk(x)])):v;
   const source=fs.readFileSync(p,'utf8'),result=JSON.stringify(walk(JSON.parse(source)));if(source!==result)change(p,result);
  }
 }
 const check=spawnSync(process.execPath,['scripts/validate-data.mjs'],{stdio:'inherit'});if(check.status!==0)throw Error('Data validation failed');
 const build=spawnSync(process.execPath,['node_modules/next/dist/bin/next','build','--webpack'],{stdio:'inherit',env:{...process.env,NEXT_PUBLIC_BASE_PATH:base}});if(build.status!==0)throw Error('Build failed');
 fs.writeFileSync('out/.nojekyll','');
}finally{for(const [p,source] of originals)fs.writeFileSync(p,source)}
