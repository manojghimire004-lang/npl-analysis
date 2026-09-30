"use client";
import {useEffect,useState} from 'react';
import {Row} from './analysis';
let pending:Promise<Row>|undefined;
export function loadResearch():Promise<Row>{if(!pending)pending=fetch('/website_data.json').then(r=>{if(!r.ok)throw Error('Research data could not be loaded.');return r.json() as Promise<Row>}).catch(e=>{pending=undefined;throw e});return pending!}
export function useResearch(){const[data,setData]=useState<Row|null>(null),[error,setError]=useState('');useEffect(()=>{loadResearch().then(setData).catch(e=>setError(e.message))},[]);return {data,error}}
export const seasonLabel=(data:Row,season:string)=>data.seasons?.find((s:Row)=>s.source_season===season)?.display_name||season;
export const initials=(name:string)=>name.split(/\s+/).map(x=>x[0]).slice(0,2).join('');

