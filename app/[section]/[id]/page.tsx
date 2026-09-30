import index from '@/public/data/route-index.json';
import {notFound} from 'next/navigation';
import DetailPage from '@/components/detail-page';
export const dynamicParams=false;
const read=()=>index;
export function generateStaticParams(){const d=read();return [...new Set<string>(d.players.map((p:any)=>p.player_id))].map(id=>({section:'players',id})).concat([...new Set<string>(d.teams.map((t:any)=>t.team_id))].map(id=>({section:'teams',id})),d.matches.map((m:any)=>({section:'matches',id:String(m.match_id)})),d.seasons.map((s:any)=>({section:'seasons',id:s.season_id})))}
export async function generateMetadata({params}:{params:Promise<{section:string,id:string}>}){const{section,id}=await params;const d=read();const name=section==='players'?d.players.find((p:any)=>p.player_id===id)?.canonical_name:section==='teams'?d.teams.find((t:any)=>t.team_id===id)?.team:section==='seasons'?d.seasons.find((s:any)=>s.season_id===id)?.display_name:'Match '+id;return {title:`${name||'Record'} | Nepal Premier League Analysis`,description:'Performance, acquisition evidence, sample sizes and research context.'}}
export default async function Page({params}:{params:Promise<{section:string,id:string}>}){const{section,id}=await params;if(!generateStaticParams().some(p=>p.section===section&&p.id===id))notFound();return <DetailPage kind={section} id={id}/>}
