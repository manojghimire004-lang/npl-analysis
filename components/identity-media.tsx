"use client";
import {useState} from 'react';
import media from '@/public/data/identity-media.json';
import {initials} from '@/lib/research-client';
const registry=media as Record<string,{path:string,kind:string,source:string,season:string|null}>;
export function TeamName({name,season}:{name:string,season?:string}){const[failed,setFailed]=useState(false);const m=registry[name];return <span className="team-name">{m?.kind==='logo'&&(!m.season||m.season===season)&&!failed&&<img className="team-logo" src={m.path} alt="" loading="lazy" width="28" height="28" onError={()=>setFailed(true)}/>}<span>{name}</span></span>}
export function PlayerPortrait({name,size=''}:{name:string,size?:string}){const[failed,setFailed]=useState(false);const m=registry[name];return m?.kind==='portrait'&&!failed?<img className={'initial-portrait player-photo '+size} src={m.path} alt={name} loading="lazy" width="160" height="180" onError={()=>setFailed(true)}/>:<span className={'initial-portrait '+size} aria-label={name}>{initials(name)}</span>}
