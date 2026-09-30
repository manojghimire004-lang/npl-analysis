import fs from 'node:fs';
import assert from 'node:assert/strict';
import Papa from 'papaparse';
const data=JSON.parse(fs.readFileSync('public/website_data.json','utf8'));
const evidence=JSON.parse(fs.readFileSync('public/data/foreign-evidence.json','utf8')).verified_foreign;
for(const e of evidence){const p=data.players.find(p=>p.player_id===e.player_id&&p.season===e.season&&p.team===e.team);assert(p,'Unmatched foreign evidence');assert(p.domestic_status!=='Domestic','Conflicting domestic evidence');p.domestic_status='Foreign';p.domestic_status_source=e.source_url;p.domestic_status_confidence=e.confidence;assert(!p.price_usable_for_roi,'Foreign record unexpectedly priced');}
data.summary.foreign_rows=data.players.filter(p=>p.domestic_status==='Foreign').length;data.summary.unknown_rows=data.players.filter(p=>p.domestic_status==='Unknown').length;data.qa.unknown_domestic=data.summary.unknown_rows;
for(const url of new Set(evidence.map(e=>e.source_url))){if(!data.sources.some(s=>s.url===url)){data.sources.push({source_id:'foreign_roster_'+data.sources.length,url,title:'Season roster evidence for overseas classification',publisher:new URL(url).hostname,publication:new URL(url).hostname,source_type:'specialist reporting',confidence:'documented roster; contextual identity mapping',accessed_date:'2026-09-27',published_date:'See source',notes:'Explicit foreign roster or overseas marker. Only matching season, team and player IDs updated. Raw classification preserved.'});}}
data.media=JSON.parse(fs.readFileSync('public/data/media-ledger.json','utf8'));
fs.writeFileSync('public/website_data.json',JSON.stringify(data)+'\n');
const parsed=Papa.parse(fs.readFileSync('public/npl_analysis_master.csv','utf8'),{header:true,skipEmptyLines:true});const fields=parsed.meta.fields;fs.writeFileSync('public/npl_analysis_master.csv',Papa.unparse({fields,data:data.players.map(p=>fields.map(k=>p[k]==null?'NA':p[k]))},{newline:'\n'})+'\n');
for(const [file,value] of [['sources.json',data.sources],['qa-report.json',data.qa]])fs.writeFileSync('public/data/'+file,JSON.stringify(value,null,2)+'\n');
console.log('Foreign records: '+data.summary.foreign_rows+'; unresolved: '+data.summary.unknown_rows);
