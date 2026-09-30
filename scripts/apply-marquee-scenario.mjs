import fs from 'node:fs';
import Papa from 'papaparse';
const path='public/website_data.json';
const data=JSON.parse(fs.readFileSync(path,'utf8'));
const note='Project-owner assumption: every marquee player receives NPR 2,000,000 in each of 2024/25 and 2025/26. Not independently verified payment evidence.';
for(const p of data.players){
 p.assumed_marquee_salary_npr=p.acquisition_type?.includes('marquee')?2000000:null;
 if(p.assumed_marquee_salary_npr){p.scenario_price_npr=2000000;p.scenario_price_basis='user_assumed_marquee_salary';p.assumption_source=note;p.scenario_cost_per_run_npr=p.runs>0?2000000/p.runs:null;p.scenario_cost_per_wicket_npr=p.wickets>0?2000000/p.wickets:null;}
}
for(const s of data.seasons)s.display_name=s.display_name.replace('Â·','·');
const parsed=Papa.parse(fs.readFileSync('public/npl_analysis_master.csv','utf8'),{header:true,skipEmptyLines:true});
const fields=[...parsed.meta.fields];if(!fields.includes('assumed_marquee_salary_npr'))fields.push('assumed_marquee_salary_npr');
fs.writeFileSync('public/npl_analysis_master.csv',Papa.unparse({fields,data:data.players.map(p=>fields.map(k=>p[k]==null?'NA':p[k]))},{newline:'\n'})+'\n');
data.meta.analysis_columns=fields.length;
data.meta.marquee_scenario={salary_per_season_npr:2000000,source:'project_owner',note,updated:'2026-09-27'};
fs.writeFileSync(path,JSON.stringify(data)+'\n');
fs.writeFileSync('public/data/seasons.json',JSON.stringify(data.seasons,null,2)+'\n');
const meta=JSON.parse(fs.readFileSync('public/data/meta.json','utf8'));meta.analysis_columns=fields.length;meta.marquee_scenario=data.meta.marquee_scenario;fs.writeFileSync('public/data/meta.json',JSON.stringify(meta,null,2)+'\n');
console.log('Updated '+data.players.filter(p=>p.assumed_marquee_salary_npr).length+' marquee season records; preserved exact-price fields.');
