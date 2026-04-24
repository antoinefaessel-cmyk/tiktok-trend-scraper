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

// ─── Pre-generated briefs for high-fit songs ───
const BRIEFS = {
  "je veux|kamikaz":{son_energy:"trap énervé mélancolique",concepts:[{titre:"quand Emma te corrige pour la 47ème fois",text_overlay:"moi qui essaye de parler anglais couramment avant mon Erasmus 💀",idee:"Un.e étudiant.e face caméra qui essaye de répéter une phrase en anglais avec le son en fond, expression de plus en plus dépitée à chaque tentative.",emma_fait:"Emma répète la phrase parfaitement à chaque fois et à la fin elle lui met 3/10. Le créateur fixe la caméra en mode 'je vais pleurer'.",ton:"humoristique"},{titre:"j'ai demandé à une IA de m'aider à pécho",text_overlay:"je veux juste dire 'tu es belle' en italien sans avoir l'air d'un touriste 😭🇮🇹",idee:"Un mec qui veut impressionner quelqu'un en parlant italien. Il répète avec Emma mais sa prononciation est catastrophique.",emma_fait:"Emma soupire et lui fait répéter 'sei bellissima' pour la 10ème fois. Le mec abandonne et tape le message à la place.",ton:"relatable"}],hashtags:"#apprendrelanglais #languagelearning #erasmus #emmaapp #foryou",priority:"🟡 Cette semaine",deadline_jours:5,viral_score:"7"},
  "beretta|el de las r's":{son_energy:"sombre intense dramatique",concepts:[{titre:"quand tu réalises que t'as rien compris",text_overlay:"6 mois d'espagnol et je comprends toujours pas les serveurs à Madrid 💔🇪🇸",idee:"Face caméra avec une expression de trahison absolue, comme si on venait de lui annoncer une mauvaise nouvelle. En réalité c'est juste qu'il/elle comprend rien en espagnol.",emma_fait:"On voit l'écran 2 secondes avec Emma qui dit 'tu veux qu'on recommence depuis le début ?' — le créateur hoche la tête tristement.",ton:"dramatique"},{titre:"moi vs la prononciation espagnole",text_overlay:"la rr espagnole m'a personnellement attaqué 😤",idee:"Le créateur essaye de rouler les R, échoue lamentablement, regarde la caméra en mode défait.",emma_fait:"Emma roule les R parfaitement et le créateur la regarde comme si elle l'avait trahi.",ton:"humoristique"}],hashtags:"#espagnol #spanish #prononciation #languagelearning #emmaapp",priority:"🟡 Cette semaine",deadline_jours:5,viral_score:"6"},
  "jamal|werenoi":{son_energy:"rap français street",concepts:[{titre:"apprendre l'anglais pour quitter la France",text_overlay:"moi qui bosse mon anglais à 3h du mat pour aller vivre à NYC 🗽😭",idee:"Un.e jeune en chambre, la nuit, qui galère sur l'anglais avec Emma. L'ambiance est 'je vais m'en sortir coûte que coûte'.",emma_fait:"Emma lui apprend 'I'd like to order a coffee please' et le créateur le dit avec un accent français tellement épais qu'Emma lui répond 'on va retravailler ça'.",ton:"relatable"},{titre:"Emma est plus street que moi",text_overlay:"quand ton app de langue te teach du slang que tu connaissais même pas 🤯",idee:"Le créateur demande à Emma de lui apprendre de l'argot anglais et Emma sort des expressions que même lui connaît pas.",emma_fait:"Emma lui balance 'that's cap' ou 'no way fam' et le créateur est choqué que l'IA parle mieux que lui.",ton:"absurde"}],hashtags:"#apprendrelanglais #werenoi #rap #emmaapp #slang",priority:"🔴 À filmer aujourd'hui",deadline_jours:3,viral_score:"8"},
  "toké toké|yanns":{son_energy:"afro dansant festif",concepts:[{titre:"apprendre une langue pour la soirée de ce soir",text_overlay:"moi 2h avant la soirée erasmus en train de speed run l'espagnol 🏃‍♂️💨",idee:"Le créateur panique parce qu'il va à une soirée avec des espagnols ce soir et il sait rien dire. Speed learning avec Emma.",emma_fait:"Emma lui apprend 3 phrases de survie en 30 secondes : 'me llamo...', 'eres guapa', 'otra cerveza por favor'. Le créateur part confiant.",ton:"humoristique"},{titre:"quand Emma danse mieux que toi",text_overlay:"même mon app de langue a plus de flow que moi 💀",idee:"Le créateur essaye de danser sur le son pendant qu'Emma lui fait une leçon. Le contraste est comique.",emma_fait:"Emma continue calmement la leçon pendant que le créateur galère à suivre le rythme ET la prononciation.",ton:"absurde"}],hashtags:"#yanns #toketoke #erasmus #languagelearning #emmaapp",priority:"🔴 À filmer aujourd'hui",deadline_jours:2,viral_score:"8"},
  "tu le mérites|luidji":{son_energy:"romantique doux mélancolique",concepts:[{titre:"apprendre sa langue pour lui/elle",text_overlay:"j'apprends le portugais en secret pour lui faire la surprise 🥺🇧🇷",idee:"Quelqu'un qui apprend la langue de son crush en cachette. Ambiance douce et sentimentale.",emma_fait:"On voit Emma qui lui apprend 'eu te amo' et le créateur s'entraîne en murmure dans sa chambre, gros sourire timide.",ton:"sentimental"},{titre:"Emma est ma seule amie à 3h du mat",text_overlay:"insomnie + Emma qui me parle en italien = ma thérapie 😭💜",idee:"Le créateur n'arrive pas à dormir, ouvre Emma et discute en italien comme si c'était un pote.",emma_fait:"Emma lui dit 'buonanotte' (bonne nuit) et le créateur sourit tristement comme si quelqu'un tenait à lui.",ton:"relatable"}],hashtags:"#luidji #crush #languagelearning #insomnie #emmaapp",priority:"🟡 Cette semaine",deadline_jours:5,viral_score:"7"},
  "gucci|maf teeski":{son_energy:"hype confident trap",concepts:[{titre:"learning French to sound expensive",text_overlay:"me learning French so I sound boujee at restaurants 💅🇫🇷",idee:"Someone practicing fancy French phrases to flex at restaurants. Acting super confident but butchering every word.",emma_fait:"Emma teaches 'je voudrais le menu dégustation s'il vous plaît' and the creator repeats it sounding absolutely nothing like French. Emma gives a 2/10.",ton:"humoristique"},{titre:"my AI tutor is judging me hard",text_overlay:"Emma really said 'that was terrible' and kept going 💀",idee:"The creator tries to learn French but Emma is brutally honest about their pronunciation.",emma_fait:"Emma corrects every single word, the creator's confidence drops from 100 to 0 in 10 seconds.",ton:"humoristique"}],hashtags:"#learnfrench #french #boujee #languagelearning #emmaapp",priority:"🟡 Cette semaine",deadline_jours:4,viral_score:"7"},
  "evergreen|omar apollo":{son_energy:"romantic dreamy soft",concepts:[{titre:"learning Spanish for the love of my life",text_overlay:"learning Spanish so I can finally tell her how I feel 🥺🇲🇽",idee:"Someone learning Spanish to confess to their crush. Dreamy atmosphere, totally earnest and vulnerable.",emma_fait:"Emma teaches 'me gustas mucho' and the creator practices whispering it to themselves. Pure wholesome content.",ton:"sentimental"},{titre:"practicing French pickup lines at 2am",text_overlay:"3am French practice because what if I meet a French person tomorrow 🤡",idee:"Someone can't sleep and is learning French pickup lines with Emma. The absurdity of preparing for something that will never happen.",emma_fait:"Emma teaches 'tu as de beaux yeux' and the creator practices on their pillow.",ton:"relatable"}],hashtags:"#spanish #learnspanish #crush #languagelearning #emmaapp",priority:"🟡 Cette semaine",deadline_jours:5,viral_score:"7"},
  "best of both worlds|hannah montana":{son_energy:"nostalgique fun pop",concepts:[{titre:"bilingual people are living a double life",text_overlay:"me switching between English and Spanish mid-sentence and confusing everyone 😭",idee:"Someone who speaks two languages showing how they switch between identities. Hannah Montana parallel is perfect.",emma_fait:"Emma teaches a phrase and the creator realizes they already knew it — 'wait I'm already bilingual??'",ton:"humoristique"},{titre:"me pretending I don't need an app",text_overlay:"I have Duolingo AND Emma because one language app wasn't enough chaos 🫠",idee:"Someone addicted to language apps showing their screen time. They have 5 apps.",emma_fait:"Emma shows up as the one app that actually works — the creator finally has a real conversation instead of just swiping.",ton:"absurde"}],hashtags:"#bilingual #hannahmontana #languagelearning #polyglot #emmaapp",priority:"🟢 À surveiller",deadline_jours:7,viral_score:"6"},
};

function getBrief(title, artist) {
  const key = (title + "|" + artist).toLowerCase();
  return BRIEFS[key] || null;
}

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
  const brief = getBrief(sound.title, sound.artist);

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

          {/* Brief créatif Emma */}
          {brief&&(
            <div style={{marginTop:14}}>
              <div style={{background:"#fafafa",border:"1px solid #e5e7eb",borderRadius:10,padding:16,marginTop:4}} onClick={e=>e.stopPropagation()}>
                <div style={{fontSize:12,fontWeight:800,color:"#111",marginBottom:10,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                  💡 Brief créatif
                  {brief.priority&&<span style={{fontSize:10,fontWeight:700,padding:"2px 10px",borderRadius:6,background:brief.priority.includes("🔴")?"#fef2f2":brief.priority.includes("🟡")?"#fefce8":brief.priority.includes("🟢")?"#f0fdf4":"#f9fafb",color:brief.priority.includes("🔴")?"#dc2626":brief.priority.includes("🟡")?"#ca8a04":brief.priority.includes("🟢")?"#16a34a":"#9ca3af"}}>{brief.priority}</span>}
                  {brief.viral_score&&<span style={{fontSize:10,fontWeight:700,color:"#7c3aed",background:"#f5f3ff",padding:"2px 8px",borderRadius:6}}>Viral: {brief.viral_score}/10</span>}
                  {brief.deadline_jours&&<span style={{fontSize:10,fontWeight:700,color:"#dc2626",background:"#fef2f2",padding:"2px 8px",borderRadius:6}}>⏰ {brief.deadline_jours}j restants</span>}
                </div>
                {brief.son_energy&&<div style={{marginBottom:10,fontSize:12,color:"#6b7280"}}>Énergie du son : <strong style={{color:"#374151"}}>{brief.son_energy}</strong></div>}

                {/* Concepts */}
                {brief.concepts?.map((c,ci)=>(
                  <div key={ci} style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:10,padding:14,marginBottom:ci<brief.concepts.length-1?10:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                      <span style={{fontSize:11,fontWeight:800,color:"#fff",background:"#111",padding:"2px 8px",borderRadius:4}}>CONCEPT {ci+1}</span>
                      {c.ton&&<span style={{fontSize:10,fontWeight:600,color:"#6b7280",background:"#f3f4f6",padding:"2px 8px",borderRadius:4}}>{c.ton}</span>}
                    </div>
                    {c.titre&&<div style={{fontSize:15,fontWeight:800,color:"#111",marginBottom:6}}>"{c.titre}"</div>}
                    {c.text_overlay&&<div style={{fontSize:13,color:"#111",background:"#fefce8",padding:"6px 10px",borderRadius:6,marginBottom:8,fontWeight:600,fontStyle:"italic"}}>📱 {c.text_overlay}</div>}
                    {c.idee&&<div style={{marginBottom:6,fontSize:12,color:"#374151",lineHeight:1.5}}>{c.idee}</div>}
                    {c.emma_fait&&<div style={{fontSize:12,color:"#16a34a",fontWeight:600,background:"#f0fdf4",padding:"6px 10px",borderRadius:6}}>🤖 Emma : {c.emma_fait}</div>}
                  </div>
                ))}

                {brief.hashtags&&<div style={{marginTop:10,fontSize:12,color:"#2563eb"}}>{brief.hashtags}</div>}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function EmmaRadar(){
  const[tab,setTab]=useState("sons"); // "sons" | "idees"
  const[country,setCountry]=useState("FR");
  const[sortBy,setSortBy]=useState("emma");
  const[filterFit,setFilterFit]=useState("all");
  const[filterCat,setFilterCat]=useState("all");
  const[data,setData]=useState(null);
  const[loading,setLoading]=useState(true);
  const[lastUpdated,setLastUpdated]=useState(null);

  // Load data from SEED
  useEffect(()=>{
    setData(SEED);
    setLastUpdated(SEED.lastUpdated);
    setLoading(false);
  },[]);

  // Refresh = reload the page
  const handleRefresh=()=>{ window.location.reload(); };

  // API helper — calls /api/generate serverless function
  const callAPI = async (prompt, max_tokens=1500) => {
    const r = await fetch("/api/generate", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ prompt, max_tokens }),
    });
    const d = await r.json();
    if (!d.ok) throw new Error(d.error || "API error");
    const clean = d.text.replace(/```json\s*/g,"").replace(/```\s*/g,"").trim();
    return JSON.parse(clean);
  };

  // Idées de contenu — generated via API
  const[idees,setIdees]=useState(null);
  const[ideesLoading,setIdeesLoading]=useState(false);
  const generateIdees=async()=>{
    setIdeesLoading(true);
    try{
      const prompt=`Tu es un EXPERT en contenu viral TikTok dans la niche "language learning". Emma est une app d'apprentissage de langues avec un avatar 3D conversationnel.

Marché : ${country==="FR"?"FRANCE (contenu en français)":"USA (contenu en anglais)"}

EXEMPLES VIRAUX RÉELS :
- "why is french so hard 💔🇫🇷" → fille en larmes, autodérision
- "practicing french with my ai dad 😭💔" → framing absurde
- "je vais enfin pouvoir draguer la femme de mes rêves grâce à emma" → app = solution au vrai problème

DYNAMIQUE CRÉATEUR ↔ EMMA : Emma est un POTE, pas un prof. Duo comique. Le comique vient de la SITUATION, pas de blagues.
${country==="FR"?"HUMOUR FR : autodérision, second degré, situations quotidien, Emma sèche et cash.":"HUMOUR US : self-deprecating, hyperbole émotionnelle, Emma brutally honest."}

RÈGLES : Émotion d'abord. Personne réelle face caméra. PAS de son trending (audio natif). Situations comiques pas des blagues. Idée en 1-2 phrases. Pour emma_fait : la situation comique concrète.

Génère 6 idées de contenu UGC. Mélange : 2 humoristiques, 1 relatable, 1 absurde, 1 dramatique, 1 drague/séduction.

Réponds UNIQUEMENT en JSON valide, sans markdown ni backticks :
{"idees":[{"titre":"hook max 8 mots","text_overlay":"texte sur la vidéo","idee":"1-2 phrases","emma_fait":"situation comique 1-2 phrases","ton":"humoristique|relatable|absurde|dramatique|sentimental","viral_score":"1-10"}]}`;
      const parsed = await callAPI(prompt);
      setIdees(parsed);
    }catch(e){console.error(e);}
    setIdeesLoading(false);
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
  const cbC=(l,code)=><button onClick={()=>{setCountry(code);setIdees(null);}} style={{background:country===code?"#111":"#fff",color:country===code?"#fff":"#374151",border:"1px solid "+(country===code?"#111":"#d1d5db"),padding:"8px 16px",borderRadius:10,fontSize:13,fontWeight:700,cursor:"pointer"}}>{l}</button>;
  const tabBtn=(l,t,emoji)=><button onClick={()=>setTab(t)} style={{background:tab===t?"#111":"#fff",color:tab===t?"#fff":"#374151",border:"1px solid "+(tab===t?"#111":"#d1d5db"),padding:"10px 20px",borderRadius:12,fontSize:14,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>{emoji} {l}</button>;

  return(
    <div style={{fontFamily:"-apple-system,'Helvetica Neue',sans-serif",background:"#fafafa",color:"#111",minHeight:"100vh",padding:"28px 20px",maxWidth:900,margin:"0 auto"}}>
      {/* Header */}
      <div style={{marginBottom:16}}>
        <h1 style={{margin:0,fontSize:24,fontWeight:900,letterSpacing:-0.5}}>Emma Trend Radar</h1>
        <p style={{margin:"4px 0 0",fontSize:12,color:"#9ca3af"}}>
          {lastUpdated && `MAJ : ${new Date(lastUpdated).toLocaleString("fr-FR")} · `}{sounds.length} sons · {country==="FR"?"France":"US"}
        </p>
      </div>

      {/* Main tabs */}
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {tabBtn("Sons Trends","sons","🎵")}
        {tabBtn("Idées de contenu","idees","🎬")}
      </div>

      {/* Country selector — shared */}
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14,flexWrap:"wrap"}}>
        {cbC("🇫🇷 France","FR")}{cbC("🇺🇸 US","US")}

        {tab==="sons"&&<>
          <div style={{width:1,height:24,background:"#e5e7eb",margin:"0 4px"}}/>
          <button onClick={handleRefresh} style={{background:"#fff",color:"#374151",border:"1px solid #d1d5db",padding:"8px 14px",borderRadius:10,fontSize:12,fontWeight:600,cursor:"pointer"}}>
            🔄 Rafraîchir
          </button>
          <div style={{width:1,height:24,background:"#e5e7eb",margin:"0 4px"}}/>
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={sel}><option value="rank">Par rang</option><option value="emma">Par score Emma</option><option value="momentum">Par momentum</option></select>
          <select value={filterFit} onChange={e=>setFilterFit(e.target.value)} style={sel}><option value="all">Tous ({sounds.length})</option><option value="high">High fit ({hi})</option><option value="medium">Medium ({md})</option><option value="low">Low ({lo})</option></select>
          <select value={filterCat} onChange={e=>setFilterCat(e.target.value)} style={sel}><option value="all">Popular + Breakout</option><option value="popular">Popular ({popCount})</option><option value="breakout">🚀 Breakout ({breakCount})</option></select>
        </>}
      </div>

      {/* ═══════════ TAB 1: SONS TRENDS ═══════════ */}
      {tab==="sons"&&<>

        <div style={{display:"flex",gap:10,marginBottom:14}}>
          <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:10,padding:"8px 14px",flex:1,textAlign:"center"}}><div style={{fontSize:22,fontWeight:800,color:"#16a34a"}}>{hi}</div><div style={{fontSize:10,fontWeight:600,color:"#16a34a"}}>High fit</div></div>
          <div style={{background:"#fefce8",border:"1px solid #fde68a",borderRadius:10,padding:"8px 14px",flex:1,textAlign:"center"}}><div style={{fontSize:22,fontWeight:800,color:"#ca8a04"}}>{md}</div><div style={{fontSize:10,fontWeight:600,color:"#ca8a04"}}>Medium</div></div>
          <div style={{background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:10,padding:"8px 14px",flex:1,textAlign:"center"}}><div style={{fontSize:22,fontWeight:800,color:"#9ca3af"}}>{lo}</div><div style={{fontSize:10,fontWeight:600,color:"#9ca3af"}}>Low fit</div></div>
          <div style={{background:"#f5f3ff",border:"1px solid #ddd6fe",borderRadius:10,padding:"8px 14px",flex:1,textAlign:"center"}}><div style={{fontSize:22,fontWeight:800,color:"#7c3aed"}}>{breakCount}</div><div style={{fontSize:10,fontWeight:600,color:"#7c3aed"}}>Breakout</div></div>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {filtered.map((s,i)=><Card key={`${country}-${s.cat}-${s.rank}-${i}`} sound={s} country={country}/>)}
        </div>
        {filtered.length===0&&<div style={{textAlign:"center",padding:40,color:"#9ca3af"}}>Aucun son ne correspond aux filtres.</div>}
      </>}

      {/* ═══════════ TAB 2: IDÉES DE CONTENU ═══════════ */}
      {tab==="idees"&&<>
        <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:14,padding:20,marginBottom:16}}>
          <div style={{fontSize:14,fontWeight:800,marginBottom:4}}>🎬 Idées de contenu UGC pour Emma</div>
          <p style={{fontSize:12,color:"#6b7280",margin:"0 0 12px",lineHeight:1.5}}>
            Des concepts de vidéos sans son trending — 100% audio natif, basés sur la dynamique créateur × Emma.
          </p>
          <button onClick={generateIdees} disabled={ideesLoading} style={{background:"#111",color:"#fff",border:"none",padding:"10px 20px",borderRadius:10,fontSize:13,fontWeight:700,cursor:ideesLoading?"wait":"pointer",opacity:ideesLoading?0.7:1}}>
            {ideesLoading?"⏳ Génération en cours...":"💡 Générer 6 idées "+(country==="FR"?"🇫🇷":"🇺🇸")}
          </button>
        </div>

        {idees?.idees?.map((idea,i)=>(
          <div key={i} style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:14,padding:16,marginBottom:10}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,flexWrap:"wrap"}}>
              <span style={{fontSize:11,fontWeight:800,color:"#fff",background:"#111",padding:"2px 8px",borderRadius:4}}>#{i+1}</span>
              {idea.ton&&<span style={{fontSize:10,fontWeight:600,color:"#6b7280",background:"#f3f4f6",padding:"2px 8px",borderRadius:4}}>{idea.ton}</span>}
              {idea.viral_score&&<span style={{fontSize:10,fontWeight:700,color:"#7c3aed",background:"#f5f3ff",padding:"2px 8px",borderRadius:6}}>Viral: {idea.viral_score}/10</span>}
            </div>
            {idea.titre&&<div style={{fontSize:16,fontWeight:800,color:"#111",marginBottom:6}}>"{idea.titre}"</div>}
            {idea.text_overlay&&<div style={{fontSize:13,color:"#111",background:"#fefce8",padding:"6px 10px",borderRadius:6,marginBottom:8,fontWeight:600,fontStyle:"italic"}}>📱 {idea.text_overlay}</div>}
            {idea.idee&&<div style={{fontSize:13,color:"#374151",marginBottom:6,lineHeight:1.5}}>{idea.idee}</div>}
            {idea.emma_fait&&<div style={{fontSize:12,color:"#16a34a",fontWeight:600,background:"#f0fdf4",padding:"8px 10px",borderRadius:6}}>🤖 Emma : {idea.emma_fait}</div>}
          </div>
        ))}

      </>}

      <div style={{marginTop:20,padding:"12px 0",borderTop:"1px solid #e5e7eb",fontSize:11,color:"#9ca3af",textAlign:"center"}}>
        Emma Trend Radar · Source : TikTok Creative Center · {tab==="sons"?"Scoring Emma : pays + UGC + momentum + audience":"Idées générées par IA — à adapter par l'équipe créa"}
      </div>
    </div>
  );
}
