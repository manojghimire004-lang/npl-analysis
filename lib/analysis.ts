import registry from '@/public/data/metric-registry.json';
export type Row=Record<string,any>;
export const fmt=(v:any,d=1)=>v===null||v===undefined||v===''||!Number.isFinite(Number(v))?'NA':Number(v).toLocaleString('en',{maximumFractionDigits:d});
export const label=(s:string)=>s.replaceAll('_',' ').replace(/\b\w/g,x=>x.toUpperCase());
export const key=(p:Row)=>[p.player_id,p.season,p.team].join('|');
export const money=(v:any)=>v==null?'Unknown':`NPR ${fmt(Number(v)/100000,2)} lakh`;
export const metricRules:Record<string,{work:string,lower:boolean,minimum:number,label:string,group:string,unit:string,description:string,direction:string}>=registry;
export function percentile(value:number,values:number[],lower=false){if(!values.length)return null;const better=values.filter(v=>lower?v>value:v<value).length;const ties=values.filter(v=>v===value).length;return 100*(better+ties/2)/values.length}
export function histogram(values:number[],bins=10){if(!values.length)return [];const min=Math.min(...values),max=Math.max(...values),width=(max-min||1)/bins;return Array.from({length:bins},(_,i)=>({range:`${fmt(min+i*width)}–${fmt(min+(i+1)*width)}`,count:values.filter(v=>Math.min(bins-1,Math.floor((v-min)/width))===i).length}));}
export function valueCohort(players:Row[],season:string,role:string,metric:string,min:number,includeAssumed=false):Row[]{const rule=metricRules[metric];if(!rule)return [];const rows=players.map((p):Row=>({...p,analysis_price:p.price_usable_for_roi===true?p.price_exact_npr:includeAssumed?(p.assumed_marquee_salary_npr??p.assumed_retained_price_npr):null})).filter(p=>p.season===season&&p.domestic_status==='Domestic'&&(role==='All'||p.role===role)&&Number.isFinite(p.analysis_price)&&p.analysis_price>0&&p[metric]!=null&&Number.isFinite(Number(p[metric]))&&p[rule.work]>=min);return rows.map(p=>({...p,x:p.analysis_price/100000,y:percentile(p[metric],rows.map(r=>r[metric]),rule.lower),pricePercentile:percentile(p.analysis_price,rows.map(r=>r.analysis_price)),gap:rows.length>=5?Number(percentile(p[metric],rows.map(r=>r[metric]),rule.lower))-Number(percentile(p.analysis_price,rows.map(r=>r.analysis_price))):null}));}


