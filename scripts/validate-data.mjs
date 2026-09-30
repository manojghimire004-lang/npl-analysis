import fs from 'node:fs';
import assert from 'node:assert/strict';
import Papa from 'papaparse';
const csv=Papa.parse(fs.readFileSync('public/npl_analysis_master.csv','utf8'),{header:true,skipEmptyLines:true});
assert.equal(csv.errors.length,0,'CSV parse errors');
const data=JSON.parse(fs.readFileSync('public/website_data.json','utf8'));
assert.equal(csv.data.length,data.players.length,'Rebuild research data after changing the CSV');
const keys=new Set();
for(const r of csv.data){
 const key=[r.player_id,r.season,r.team].join('|');
 assert(!keys.has(key),'Duplicate player-season-team');keys.add(key);
 const p=data.players.find(x=>x.player_id===r.player_id&&x.season===r.season&&x.team===r.team);
 assert(p,'CSV player missing from website data');
 for(const [k,v] of Object.entries(r)){
  const value=p[k];
  if(value==null){assert(v==='NA'||v==='','Missing value mismatch: '+key+' '+k);continue;}
  if(typeof value==='number')assert(Math.abs(Number(v)-value)<1e-6,'Numeric mismatch: '+key+' '+k);
  else if(typeof value==='boolean')assert.equal(String(v).toLowerCase(),String(value));
  else assert.equal(v,String(value),'Text mismatch: '+key+' '+k);
 }
 if(p.price_usable_for_roi)assert(p.price_exact_npr>0&&p.price_status==='exact_auction_price','Invalid exact price');
 if(p.acquisition_type?.includes('marquee')){assert.equal(p.scenario_price_npr,2000000);assert.equal(p.assumed_marquee_salary_npr,2000000);assert.equal(p.scenario_price_basis,'user_assumed_marquee_salary');assert.equal(p.price_usable_for_roi,false,'Marquee scenario must not become a verified auction price');}
}
assert.equal(data.matches.length,64);
assert.equal(new Set(data.matches.map(m=>m.match_id)).size,64);
assert.equal(data.teams.length,16);
for(const file of ['data/dictionary.json','data/qa-report.json','npl-logo-clean.webp'])assert(fs.existsSync('public/'+file),'Missing public artifact: '+file);
console.log(`Validated ${keys.size} player-season records, 64 matches and public research artifacts.`);
