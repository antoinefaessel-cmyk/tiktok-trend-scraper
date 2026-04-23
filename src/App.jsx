import { useState, useEffect } from "react";

const STORAGE_KEY = "emma-radar-data";

// ─── Initial seed data from TikTok Creative Center (scraped April 22, 2026) ───
const SEED = {
  FR: [
    { rank:1, title:"Threat Level", artist:"Sam Roth & Rex Logan", change:"+31", approved:true, trend:[0,0,0,0,0,0.01,1], topCountries:["Greece","Hungary","Italy"], topInterests:["Transportation","Beauty","Social News"], ages:null, cat:"popular" },
    { rank:2, title:"体温層", artist:"yasuhiro soda", change:"+6", approved:false, trend:[0.01,0.01,0.01,0.01,0.01,0.06,1], topCountries:["Italy","Germany","France"], topInterests:["Business & Finance","DIY"], ages:null, cat:"popular" },
    { rank:3, title:"Je veux", artist:"Kamikaz", change:"NEW", approved:false, trend:[0.43,0.40,0.64,0.92,0.57,0.58,1], topCountries:["France","Belgium","Switzerland"], topInterests:["Pranks","Comedy","Recreation","Beauty","Nail Art"], ages:[{pct:88,range:"18-24"},{pct:6,range:"25-34"},{pct:6,range:"35-44"}], cat:"popular" },
    { rank:4, title:"A New Avar", artist:"Grushkov", change:"+11", approved:false, trend:[0,0,0,0,0.02,0.13,1], topCountries:["Greece","Italy","Netherlands"], topInterests:["Cars & Motorcycles","Music","Lip-sync"], ages:null, cat:"popular" },
    { rank:5, title:"Beretta", artist:"El De Las R's", change:null, approved:false, trend:[0.06,0.06,0.13,0.23,0.50,1,0.94], topCountries:["Italy","Spain","France"], topInterests:["Hilarious Fails","Music","Lip-sync"], ages:[{pct:86,range:"18-24"}], cat:"popular" },
    { rank:6, title:"Pull up Proper", artist:"Drift Kingston", change:"+1", approved:false, trend:[0,0,0,0.01,0.04,0.23,1], topCountries:["Latvia","Germany","France"], topInterests:["DIY","Advertisement"], ages:null, cat:"popular" },
    { rank:7, title:"Mystery Girl", artist:"Housecall", change:"+5", approved:false, trend:[0,0,0,0.01,0.05,0.30,1], topCountries:["Greece","Italy","France"], topInterests:["Music","Beauty"], ages:null, cat:"popular" },
    { rank:8, title:"睡眠用BGM", artist:"Sleeping Forest", change:"+5", approved:false, trend:[0,0,0,0,0.01,0.08,1], topCountries:["Japan","France"], topInterests:["Relaxation","Sleep"], ages:null, cat:"popular" },
    { rank:9, title:"No Save Point", artist:"edivieira", change:"+5", approved:true, trend:[0,0,0,0,0.02,0.31,1], topCountries:["Slovakia","Bulgaria"], topInterests:["Traditional Sports","Comics & Anime"], ages:null, cat:"popular" },
    { rank:10, title:"Crystal Bowl Healing", artist:"Pure Noise Lab", change:"+13", approved:false, trend:[0,0,0,0,0.01,0.21,1], topCountries:["Bulgaria","Spain"], topInterests:["Wellness","Meditation"], ages:null, cat:"popular" },
    { rank:11, title:"CIRO", artist:"Lagui", change:null, approved:false, trend:[0,0,0.02,0.08,0.25,0.18,1], topCountries:["France","Belgium"], topInterests:["Recreation","Drama"], ages:null, cat:"popular" },
    { rank:12, title:"Sans toi", artist:"Naps", change:"+2", approved:false, trend:[0.10,0.15,0.30,0.55,0.80,1,0.86], topCountries:["France","Belgium"], topInterests:["Nail Art","Beauty"], ages:null, cat:"popular" },
    { rank:13, title:"OULOULOU", artist:"2ZG", change:null, approved:false, trend:[0,0.05,0.10,0.20,0.35,0.43,1], topCountries:["France","Belgium"], topInterests:["Recreation","Beauty"], ages:null, cat:"popular" },
    { rank:14, title:"Good Morning", artist:"Vozes da Natureza", change:null, approved:true, trend:[0,0,0,0,0.01,0.21,1], topCountries:["Croatia","Switzerland"], topInterests:["Advertisement","Theatre"], ages:null, cat:"popular" },
    { rank:15, title:"I love you", artist:"Sai Sai Kham Leng", change:"+11", approved:true, trend:[0,0,0,0,0.02,0.30,1], topCountries:["Croatia","Norway"], topInterests:["Theatre","DIY"], ages:null, cat:"popular" },
    { rank:16, title:"Meditations Burn", artist:"Saymon Cleiton", change:"+13", approved:false, trend:[0,0,0,0,0.01,0.29,1], topCountries:["Sweden","France"], topInterests:["DIY","Sports News"], ages:null, cat:"popular" },
    { rank:17, title:"Sons da Natureza", artist:"Dy Kamylle", change:null, approved:true, trend:[0,0,0,0,0.01,0.15,1], topCountries:["Latvia","Romania"], topInterests:["Magic","Business"], ages:null, cat:"popular" },
    { rank:18, title:"What do You See?", artist:"not available & Undoing", change:"+10", approved:true, trend:[0,0,0,0.05,0.15,0.40,1], topCountries:["Germany","France"], topInterests:[], ages:null, cat:"popular" },
    { rank:19, title:"Tristesse", artist:"DeLange", change:null, approved:false, trend:[0,0,0,0.02,0.10,0.27,1], topCountries:["France","Belgium"], topInterests:["DIY","Talent"], ages:null, cat:"popular" },
    { rank:20, title:"滑走する雫", artist:"yasuhiro soda", change:null, approved:false, trend:[0,0,0,0,0.01,0.05,1], topCountries:["Japan","France"], topInterests:["Music"], ages:null, cat:"popular" },
    // Breakout-only (not in Popular)
    { rank:1, title:"心跳", artist:"BCD Studio", change:null, approved:true, trend:[0,0,0,0,0,0.1,1], topCountries:["France","Belgium"], topInterests:["Music","Dance"], ages:null, cat:"breakout" },
    { rank:2, title:"True (feelings for you)", artist:"Model Man", change:null, approved:true, trend:[0,0,0,0,0.05,0.2,1], topCountries:["France","UK"], topInterests:["Emotional","Romance"], ages:null, cat:"breakout" },
    { rank:3, title:"Jamal", artist:"Werenoi", change:null, approved:false, trend:[0,0,0,0.1,0.3,0.6,1], topCountries:["France","Belgium","Switzerland"], topInterests:["Hip-hop","Dance","Lip-sync"], ages:[{pct:82,range:"18-24"}], cat:"breakout" },
    { rank:7, title:"Tu le mérites", artist:"Luidji", change:null, approved:false, trend:[0,0,0,0.05,0.2,0.5,1], topCountries:["France","Belgium"], topInterests:["Romance","Emotional","Beauty"], ages:null, cat:"breakout" },
    { rank:8, title:"TOKÉ TOKÉ", artist:"Yanns", change:null, approved:false, trend:[0,0,0.1,0.25,0.45,0.7,1], topCountries:["France","Belgium","Switzerland"], topInterests:["Dance","Comedy","Lip-sync"], ages:[{pct:85,range:"18-24"}], cat:"breakout" },
    { rank:9, title:"Хватит, довольно", artist:"Света", change:null, approved:false, trend:[0,0,0,0,0.05,0.3,1], topCountries:["Russia","France"], topInterests:["Dance","Music"], ages:null, cat:"breakout" },
    { rank:10, title:"Borderline", artist:"Tame Impala", change:null, approved:false, trend:[0,0,0,0.08,0.2,0.5,1], topCountries:["France","US","UK"], topInterests:["Music","Lifestyle","Aesthetics"], ages:null, cat:"breakout" },
    { rank:12, title:"Cryptside Doo-Wop", artist:"Zombie Jazz", change:null, approved:false, trend:[0,0,0,0,0.1,0.35,1], topCountries:["France","Belgium"], topInterests:["Music","Dance"], ages:null, cat:"breakout" },
    { rank:14, title:"The Eerie Etude", artist:"Perfect, so dystopian", change:null, approved:false, trend:[0,0,0,0,0.05,0.25,1], topCountries:["Germany","France"], topInterests:["Aesthetics","Dark aesthetics"], ages:null, cat:"breakout" },
    { rank:16, title:"Beso", artist:"Majeur Mineur & Sean", change:null, approved:false, trend:[0,0,0,0.1,0.3,0.55,1], topCountries:["France","Belgium","Luxembourg"], topInterests:["Romance","Dance","Couple"], ages:null, cat:"breakout" },
  ],
  US: [
    { rank:1, title:"Classic classical gymnopedie", artist:"Lyrebirds music", change:"+1", approved:true, trend:[0.36,0.36,0.35,0.34,0.46,0.77,1], topCountries:["US","UK","Canada"], topInterests:["Relaxation","Study"], ages:null, cat:"popular" },
    { rank:2, title:"Gucci", artist:"MAF Teeski", change:"+2", approved:false, trend:[0.17,0.22,0.40,0.66,0.94,1,0.97], topCountries:["US","Nigeria","UK"], topInterests:["Hip-hop","Dance","Fashion"], ages:null, cat:"popular" },
    { rank:3, title:"Snowfall (Slowed)", artist:"dunsky & 777Muzic", change:"+3", approved:true, trend:[0,0,0,0,0,0,1], topCountries:["US","Germany","UK"], topInterests:["Aesthetics","Edits"], ages:null, cat:"popular" },
    { rank:4, title:"silence", artist:"moartea regelui.", change:"+2", approved:false, trend:[0,0,0,0.05,0.15,0.50,1], topCountries:["US","Romania","Germany"], topInterests:["Dark aesthetics","Edits"], ages:null, cat:"popular" },
    { rank:5, title:"A Dream", artist:"Flatsound", change:"+5", approved:false, trend:[0,0,0,0.02,0.10,0.35,1], topCountries:["US","Philippines","Brazil"], topInterests:["Emotional","Storytelling"], ages:null, cat:"popular" },
    { rank:6, title:"voices", artist:"Øneheart", change:"+7", approved:true, trend:[0,0,0,0.01,0.08,0.30,1], topCountries:["US","UK","Germany"], topInterests:["Aesthetics","Chill"], ages:null, cat:"popular" },
    { rank:7, title:"Bright Open Sky", artist:"Ah2", change:"+16", approved:false, trend:[0,0,0,0,0.03,0.15,1], topCountries:["US","UK"], topInterests:["Lifestyle","Travel"], ages:null, cat:"popular" },
    { rank:8, title:"Monkeyshine NO PERC", artist:"Lt FitzGibbons Men", change:"+10", approved:false, trend:[0,0,0,0.02,0.10,0.30,1], topCountries:["US","UK","Nigeria"], topInterests:["Dance","Hip-hop"], ages:null, cat:"popular" },
    { rank:9, title:"Evergreen", artist:"Omar Apollo", change:null, approved:false, trend:[0.20,0.25,0.30,0.40,0.55,0.80,1], topCountries:["US","Mexico","UK"], topInterests:["Romance","Couple"], ages:null, cat:"popular" },
    { rank:10, title:"Kitchen Flowers", artist:"—", change:null, approved:false, trend:[0,0,0,0.05,0.20,0.50,1], topCountries:["US","UK"], topInterests:["Cooking","Lifestyle"], ages:null, cat:"popular" },
    { rank:11, title:"realization", artist:"—", change:null, approved:false, trend:[0.10,0.15,0.20,0.30,0.50,0.75,1], topCountries:["US","UK","Australia"], topInterests:["POV","Storytelling"], ages:null, cat:"popular" },
    { rank:12, title:"Best of Both Worlds", artist:"Hannah Montana", change:null, approved:false, trend:[0.05,0.10,0.15,0.25,0.40,0.70,1], topCountries:["US","UK","Canada"], topInterests:["Nostalgia","Dance"], ages:null, cat:"popular" },
    { rank:13, title:"Loop record noise", artist:"—", change:null, approved:false, trend:[0,0,0,0,0.05,0.30,1], topCountries:["US","Germany"], topInterests:["Aesthetics","ASMR"], ages:null, cat:"popular" },
    { rank:14, title:"Relaxing Music", artist:"—", change:null, approved:false, trend:[0,0,0,0.02,0.10,0.35,1], topCountries:["US","Brazil"], topInterests:["Relaxation","Sleep"], ages:null, cat:"popular" },
    { rank:15, title:"Warmth of Life", artist:"—", change:null, approved:false, trend:[0,0,0,0.01,0.08,0.25,1], topCountries:["US","UK"], topInterests:["Lifestyle","Motivation"], ages:null, cat:"popular" },
    { rank:16, title:"Birthday Girl", artist:"—", change:null, approved:false, trend:[0,0,0.05,0.15,0.30,0.60,1], topCountries:["US","Nigeria","UK"], topInterests:["Celebration","Dance"], ages:null, cat:"popular" },
    { rank:17, title:"I'm Not Them", artist:"—", change:null, approved:false, trend:[0.05,0.10,0.15,0.25,0.45,0.75,1], topCountries:["US","UK","Nigeria"], topInterests:["Confidence","Motivation"], ages:null, cat:"popular" },
    { rank:18, title:"実体不明", artist:"—", change:null, approved:false, trend:[0,0,0,0,0.02,0.15,1], topCountries:["Japan","US"], topInterests:["Anime","Edits"], ages:null, cat:"popular" },
    { rank:19, title:"500 Miles", artist:"—", change:null, approved:false, trend:[0.10,0.12,0.15,0.20,0.35,0.60,1], topCountries:["US","UK","Ireland"], topInterests:["Nostalgia","Travel"], ages:null, cat:"popular" },
    { rank:20, title:"Sincerely Letting Go", artist:"—", change:null, approved:false, trend:[0,0,0.05,0.10,0.25,0.50,1], topCountries:["US","Philippines","UK"], topInterests:["Emotional","Storytelling"], ages:null, cat:"popular" },
  ],
  lastUpdated: "2026-04-22T23:00:00Z",
};

function score(s, c) {
  let sc = 0;
  const tc = s.topCountries || [];
  const ti = s.topInterests || [];
  if (c==="FR") { if (tc.includes("France")) sc+=30; else if (tc.some(x=>["Belgium","Switzerland","Luxembourg"].includes(x))) sc+=20; else sc+=5; }
  else { if (tc.includes("US")) sc+=30; else if (tc.some(x=>["UK","Canada"].includes(x))) sc+=20; else sc+=5; }
  const ugc=["Dance","Comedy","Pranks","Beauty","Lip-sync","Fashion","POV","Storytelling","Couple","Romance","Confidence","Motivation","Celebration","Recreation","Lifestyle","Travel","Cooking","Nail Art","Talent","Hilarious Fails","Music","Hip-hop","Nostalgia","Emotional","Drama"];
  const ed=["Aesthetics","Edits","Dark aesthetics","Anime","ASMR","Sleep","Relaxation","Meditation","Wellness","Study"];
  if (ti.some(i=>ugc.some(u=>i.includes(u)))) sc+=25;
  if (!ti.some(i=>ed.some(e=>i.includes(e)))) sc+=15;
  const t=s.trend||[];
  if (t.length>=2&&t[t.length-1]>t[t.length-2]) sc+=15;
  if (t.length&&t[t.length-1]>=0.8) sc+=10;
  if (s.ages?.[0]?.pct>60) sc+=10;
  if (s.rank<=5) sc+=10; else if (s.rank<=10) sc+=5;
  return Math.min(100,sc);
}
function fitCat(sc){return sc>=70?{l:"High fit",c:"#16a34a",bg:"#f0fdf4"}:sc>=45?{l:"Medium",c:"#ca8a04",bg:"#fefce8"}:{l:"Low fit",c:"#9ca3af",bg:"#f9fafb"};}

function Spark({data,w=100,h=28}){
  if(!data||data.length<2)return null;
  const mx=Math.max(...data,0.01);
  const pts=data.map((v,i)=>`${(i/(data.length-1))*w},${h-(v/mx)*h}`).join(" ");
  return <svg width={w} height={h} style={{display:"block"}}><polyline points={pts} fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx={w} cy={h-(data[data.length-1]/mx)*h} r="3" fill="#ef4444"/></svg>;
}

const FL={France:"🇫🇷",US:"🇺🇸",Belgium:"🇧🇪",Switzerland:"🇨🇭",Germany:"🇩🇪",Italy:"🇮🇹",UK:"🇬🇧",Spain:"🇪🇸",Greece:"🇬🇷",Netherlands:"🇳🇱",Canada:"🇨🇦",Nigeria:"🇳🇬",Brazil:"🇧🇷",Japan:"🇯🇵",Mexico:"🇲🇽",Philippines:"🇵🇭",Australia:"🇦🇺",Ireland:"🇮🇪",Romania:"🇷🇴",Hungary:"🇭🇺",Bulgaria:"🇧🇬",Luxembourg:"🇱🇺",Norway:"🇳🇴",Sweden:"🇸🇪",Slovakia:"🇸🇰",Croatia:"🇭🇷",Latvia:"🇱🇻",Russia:"🇷🇺"};

function Card({sound,country}){
  const[open,setOpen]=useState(false);
  const es=score(sound,country);
  const cat=fitCat(es);
  const url=`https://www.tiktok.com/search?q=${encodeURIComponent(sound.title+" "+sound.artist)}`;
  const catBadge = sound.cat === "breakout" ? { label:"🚀 Breakout", color:"#7c3aed", bg:"#f5f3ff" } : null;
  return(
    <div onClick={()=>setOpen(!open)} style={{border:"1px solid #e5e7eb",borderRadius:14,background:"#fff",overflow:"hidden",cursor:"pointer"}}>
      <div style={{padding:"14px 18px",display:"flex",gap:14,alignItems:"center"}}>
        <div style={{width:38,textAlign:"center",flexShrink:0}}>
          <div style={{fontSize:17,fontWeight:800,color:"#111"}}>#{sound.rank}</div>
          {sound.change&&<div style={{fontSize:10,fontWeight:700,color:sound.change==="NEW"?"#7c3aed":"#16a34a",marginTop:1}}>{sound.change==="NEW"?"NEW":"↑"+sound.change.replace("+","")}</div>}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
            <a href={url} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{fontSize:14,fontWeight:700,color:"#111",textDecoration:"none"}}>{sound.title}</a>
            {sound.approved&&<span style={{fontSize:9,fontWeight:600,color:"#0891b2",background:"#ecfeff",padding:"1px 6px",borderRadius:4}}>✓ Business</span>}
            {catBadge&&<span style={{fontSize:9,fontWeight:600,color:catBadge.color,background:catBadge.bg,padding:"1px 6px",borderRadius:4}}>{catBadge.label}</span>}
          </div>
          <div style={{fontSize:12,color:"#6b7280",marginTop:1}}>{sound.artist}</div>
        </div>
        <Spark data={sound.trend}/>
        <div style={{background:cat.bg,border:`1px solid ${cat.c}20`,borderRadius:8,padding:"4px 10px",textAlign:"center",flexShrink:0}}>
          <div style={{fontSize:16,fontWeight:800,color:cat.c}}>{es}</div>
          <div style={{fontSize:9,fontWeight:600,color:cat.c}}>{cat.l}</div>
        </div>
        <div style={{fontSize:16,color:"#d1d5db",transform:open?"rotate(180deg)":"",transition:"transform 0.2s"}}>▾</div>
      </div>
      {open&&(
        <div style={{padding:"0 18px 16px",borderTop:"1px solid #f3f4f6"}}>
          <div style={{display:"flex",gap:24,marginTop:12,flexWrap:"wrap"}}>
            {sound.topCountries?.length>0&&<div><div style={{fontSize:10,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",marginBottom:4}}>Top regions</div><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{sound.topCountries.map((c,i)=><span key={i} style={{fontSize:12,background:"#f3f4f6",padding:"2px 8px",borderRadius:6}}>{FL[c]||""} {c}</span>)}</div></div>}
            {sound.topInterests?.length>0&&<div><div style={{fontSize:10,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",marginBottom:4}}>Audience interests</div><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{sound.topInterests.slice(0,5).map((x,i)=><span key={i} style={{fontSize:11,background:"#eff6ff",color:"#1d4ed8",padding:"2px 8px",borderRadius:6}}>{x}</span>)}</div></div>}
            {sound.ages&&<div><div style={{fontSize:10,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",marginBottom:4}}>Age range</div><div style={{display:"flex",gap:4}}>{sound.ages.map((a,i)=><span key={i} style={{fontSize:11,background:i===0?"#f0fdf4":"#f9fafb",color:i===0?"#16a34a":"#6b7280",padding:"2px 8px",borderRadius:6,fontWeight:i===0?700:400}}>{a.range}: {a.pct}%</span>)}</div></div>}
          </div>
          <div style={{marginTop:12}}><div style={{fontSize:10,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",marginBottom:4}}>7-day trend</div><Spark data={sound.trend} w={240} h={44}/></div>
        </div>
      )}
    </div>
  );
}

export default function EmmaRadar(){
  const[country,setCountry]=useState("FR");
  const[sortBy,setSortBy]=useState("emma");
  const[filterFit,setFilterFit]=useState("all");
  const[filterCat,setFilterCat]=useState("all");
  const[data,setData]=useState(null);
  const[loading,setLoading]=useState(true);
  const[lastUpdated,setLastUpdated]=useState(null);
  const[saving,setSaving]=useState(false);

  // Load from localStorage on mount
  useEffect(()=>{
    let mounted = true;
    const load = () => {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!mounted) return;
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          setData(parsed);
          setLastUpdated(parsed.lastUpdated);
        } catch(e) { setData(SEED); setLastUpdated(SEED.lastUpdated); }
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
        setData(SEED);
        setLastUpdated(SEED.lastUpdated);
      }
      setLoading(false);
    };
    load();
    return () => { mounted = false; };
  },[]);

  // Save updated data to storage
  const saveData=(newData)=>{
    setSaving(true);
    try{
      localStorage.setItem(STORAGE_KEY,JSON.stringify(newData));
      setData(newData);
      setLastUpdated(newData.lastUpdated);
    }catch(e){console.error(e);}
    setSaving(false);
  };

  // Manual JSON update
  const[showPaste,setShowPaste]=useState(false);
  const[pasteText,setPasteText]=useState("");
  const handlePaste=async()=>{
    try{
      const parsed=JSON.parse(pasteText);
      if(parsed.FR||parsed.US){
        const newData={...data,...parsed,lastUpdated:new Date().toISOString()};
        await saveData(newData);
        setShowPaste(false);
        setPasteText("");
      }else{alert("Format invalide. Attendu: {FR:[...], US:[...]}");}
    }catch(e){alert("JSON invalide: "+e.message);}
  };

  if(loading) return (<div style={{padding:40,textAlign:"center",color:"#9ca3af"}}>Chargement...</div>);

  const sounds=(data?.[country]||[]).map(s=>({...s,emmaScore:score(s,country)}));
  const filtered=sounds
    .filter(s=>filterFit==="all"||(filterFit==="high"&&s.emmaScore>=70)||(filterFit==="medium"&&s.emmaScore>=45&&s.emmaScore<70)||(filterFit==="low"&&s.emmaScore<45))
    .filter(s=>filterCat==="all"||s.cat===filterCat)
    .sort((a,b)=>sortBy==="rank"?a.rank-b.rank:sortBy==="emma"?b.emmaScore-a.emmaScore:(b.trend?.[6]||0)-(a.trend?.[6]||0));
  
  const hi=sounds.filter(s=>s.emmaScore>=70).length;
  const md=sounds.filter(s=>s.emmaScore>=45&&s.emmaScore<70).length;
  const lo=sounds.filter(s=>s.emmaScore<45).length;
  const popCount=sounds.filter(s=>s.cat==="popular").length;
  const breakCount=sounds.filter(s=>s.cat==="breakout").length;

  const sel={border:"1px solid #e5e7eb",borderRadius:8,padding:"6px 12px",fontSize:12,color:"#374151",background:"#fff",outline:"none",cursor:"pointer",fontWeight:500};
  const cb=(l,code)=><button onClick={()=>setCountry(code)} style={{background:country===code?"#111":"#fff",color:country===code?"#fff":"#374151",border:"1px solid "+(country===code?"#111":"#d1d5db"),padding:"8px 16px",borderRadius:10,fontSize:13,fontWeight:700,cursor:"pointer"}}>{l}</button>;

  return(
    <div style={{fontFamily:"-apple-system,'Helvetica Neue',sans-serif",background:"#fafafa",color:"#111",minHeight:"100vh",padding:"28px 20px",maxWidth:900,margin:"0 auto"}}>
      {/* Header */}
      <div style={{marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4,flexWrap:"wrap"}}>
          <span style={{fontSize:26}}>🎵</span>
          <h1 style={{margin:0,fontSize:22,fontWeight:800,letterSpacing:-0.5}}>Emma Trend Radar</h1>
          <span style={{fontSize:10,fontWeight:600,color:"#ef4444",background:"#fef2f2",padding:"2px 8px",borderRadius:20}}>TikTok Creative Center</span>
        </div>
        <p style={{margin:0,fontSize:12,color:"#9ca3af"}}>
          Dernière MAJ : {lastUpdated ? new Date(lastUpdated).toLocaleString("fr-FR") : "—"} · {sounds.length} sons · Popular + Breakout · Last 7 days
        </p>
      </div>

      {/* Controls */}
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14,flexWrap:"wrap"}}>
        {cb("🇫🇷 France","FR")}{cb("🇺🇸 US","US")}
        <div style={{width:1,height:24,background:"#e5e7eb",margin:"0 4px"}}/>
        <button onClick={()=>setShowPaste(!showPaste)} style={{background:"#111",color:"#fff",border:"none",padding:"8px 16px",borderRadius:10,fontSize:13,fontWeight:700,cursor:"pointer"}}>
          🔄 Rafraîchir
        </button>
        <div style={{width:1,height:24,background:"#e5e7eb",margin:"0 4px"}}/>
        <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={sel}><option value="rank">Par rang</option><option value="emma">Par score Emma</option><option value="momentum">Par momentum</option></select>
        <select value={filterFit} onChange={e=>setFilterFit(e.target.value)} style={sel}><option value="all">Tous ({sounds.length})</option><option value="high">High fit ({hi})</option><option value="medium">Medium ({md})</option><option value="low">Low ({lo})</option></select>
        <select value={filterCat} onChange={e=>setFilterCat(e.target.value)} style={sel}><option value="all">Popular + Breakout</option><option value="popular">Popular ({popCount})</option><option value="breakout">🚀 Breakout ({breakCount})</option></select>
      </div>

      {/* Refresh panel */}
      {showPaste&&(
        <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:14,padding:16,marginBottom:14}}>
          <div style={{fontSize:13,fontWeight:700,marginBottom:6}}>🔄 Mettre à jour les données</div>
          <p style={{fontSize:12,color:"#6b7280",margin:"0 0 10px",lineHeight:1.5}}>
            Demande à Claude : <strong>"Rafraîchis le radar"</strong> → il scrapera le TikTok Creative Center et te donnera un JSON à coller ici.
          </p>
          <textarea value={pasteText} onChange={e=>setPasteText(e.target.value)} placeholder='Coller le JSON ici...' style={{width:"100%",minHeight:70,border:"1px solid #e5e7eb",borderRadius:8,padding:10,fontSize:12,fontFamily:"monospace",resize:"vertical",outline:"none",boxSizing:"border-box"}}/>
          <div style={{display:"flex",gap:8,marginTop:8}}>
            <button onClick={handlePaste} disabled={!pasteText.trim()||saving} style={{background:"#16a34a",color:"#fff",border:"none",padding:"8px 16px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer"}}>{saving?"...":"✅ Mettre à jour"}</button>
            <button onClick={()=>{setShowPaste(false);setPasteText("");}} style={{background:"#fff",color:"#374151",border:"1px solid #d1d5db",padding:"8px 16px",borderRadius:8,fontSize:12,cursor:"pointer"}}>Fermer</button>
            <button onClick={async()=>{await saveData(SEED);setShowPaste(false);}} style={{background:"#fff",color:"#9ca3af",border:"1px solid #e5e7eb",padding:"8px 16px",borderRadius:8,fontSize:12,cursor:"pointer"}}>Reset données initiales</button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{display:"flex",gap:10,marginBottom:14}}>
        <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:10,padding:"8px 14px",flex:1,textAlign:"center"}}><div style={{fontSize:22,fontWeight:800,color:"#16a34a"}}>{hi}</div><div style={{fontSize:10,fontWeight:600,color:"#16a34a"}}>High fit</div></div>
        <div style={{background:"#fefce8",border:"1px solid #fde68a",borderRadius:10,padding:"8px 14px",flex:1,textAlign:"center"}}><div style={{fontSize:22,fontWeight:800,color:"#ca8a04"}}>{md}</div><div style={{fontSize:10,fontWeight:600,color:"#ca8a04"}}>Medium</div></div>
        <div style={{background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:10,padding:"8px 14px",flex:1,textAlign:"center"}}><div style={{fontSize:22,fontWeight:800,color:"#9ca3af"}}>{lo}</div><div style={{fontSize:10,fontWeight:600,color:"#9ca3af"}}>Low fit</div></div>
        <div style={{background:"#f5f3ff",border:"1px solid #ddd6fe",borderRadius:10,padding:"8px 14px",flex:1,textAlign:"center"}}><div style={{fontSize:22,fontWeight:800,color:"#7c3aed"}}>{breakCount}</div><div style={{fontSize:10,fontWeight:600,color:"#7c3aed"}}>Breakout</div></div>
      </div>

      {/* Sound list */}
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {filtered.map((s,i)=><Card key={`${country}-${s.cat}-${s.rank}-${i}`} sound={s} country={country}/>)}
      </div>
      {filtered.length===0&&<div style={{textAlign:"center",padding:40,color:"#9ca3af"}}>Aucun son ne correspond aux filtres.</div>}

      <div style={{marginTop:20,padding:"12px 0",borderTop:"1px solid #e5e7eb",fontSize:11,color:"#9ca3af",textAlign:"center"}}>
        Source : TikTok Creative Center · Scoring : pertinence pays + UGC + momentum + audience · Cliquez sur un son pour les détails
      </div>
    </div>
  );
}
