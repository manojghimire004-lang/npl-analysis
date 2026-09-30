import Dashboard from '@/components/npl-dashboard';
import {destinations} from '@/lib/navigation';
import {notFound} from 'next/navigation';
export const dynamicParams=false;
export function generateStaticParams(){return destinations.filter(d=>d.path!=='season-3').map(d=>({section:d.path}))}
export async function generateMetadata({params}:{params:Promise<{section:string}>}){const {section}=await params;const d=destinations.find(x=>x.path===section);return {title:`${d?.name||'Research'} | Nepal Premier League Analysis`,description:d?.description}}
export default async function Page({params}:{params:Promise<{section:string}>}){const {section}=await params;const d=destinations.find(x=>x.path===section);if(!d)notFound();return <Dashboard initialView={d.view}/>}
