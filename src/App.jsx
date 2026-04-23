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
  const[brief,setBrief]=useState(null);
  const[loadingBrief,setLoadingBrief]=useState(false);

  const generateBrief=async(e)=>{
    e.stopPropagation();
    if(brief||loadingBrief)return;
    setLoadingBrief(true);
    try{
      const prompt=`Tu es un EXPERT en contenu viral TikTok dans la niche "language learning". Tu connais parfaitement ce qui marche et ce qui ne marche pas.

CE QUI MARCHE (exemples réels de vidéos virales dans cette niche) :
- "why is french so hard 💔🇫🇷" → une fille en LARMES, autodérision totale. Des millions de vues.
- "How do you say hello in French?" → une meuf avec des bigoudis, expression de DÉSESPOIR pour une question simple. Humour par le décalage.
- "practicing french with my ai dad 😭💔" → une fille montre son iPad avec une app IA, le framing "my AI dad" rend ça absurde et attachant.
- "Bonjour Alena!" → grimace dégoûtée quand l'IA parle en français, tête encore pire quand arrivent les pronoms relatifs.
- "je vais enfin pouvoir draguer la femme de mes rêves grâce à emma" → un mec soulagé. L'app est juste la SOLUTION au VRAI problème.
- "why tf is German so hard 💔🇩🇪" → Britt qui pleure. Les larmes marchent à CHAQUE fois.

LA DYNAMIQUE CRÉATEUR ↔ EMMA :
Emma n'est PAS un prof. Emma est un POTE. Un pote IA avec de la personnalité. La dynamique créateur-Emma c'est un DUO COMIQUE :
- Le créateur galère avec une langue → Emma est le sidekick cash qui le charrie
- Emma est la confidente absurde : tu lui demandes comment draguer en italien et elle te fait répéter "sei bellissima" 15 fois
- Emma est trop honnête : elle te dit que ta prononciation est catastrophique, elle soupire, elle te met une sale note
- Emma donne des conseils douteux : elle t'apprend à dire "tu es magnifique" mais quand tu le dis c'est incompréhensible
- Le comique vient de la SITUATION entre le créateur et Emma, PAS d'une blague écrite

${country==="FR"?`HUMOUR FRANÇAIS — les codes à respecter :
- L'autodérision et le "je suis nul et j'assume"
- Le second degré, jamais premier degré
- Les situations du quotidien : la drague, les exams, les potes, la galère
- Le décalage entre l'effort et le résultat (tu bosses 3h sur une phrase et tu te fais corriger)
- Emma peut être sèche, cash, un peu moqueuse — les français adorent ça
- Pas de blagues construites, pas de punchlines forcées. C'est la SITUATION qui est drôle.`
:`HUMOUR US — les codes à respecter :
- Self-deprecating humor, "I'm literally the worst at this"
- L'hyperbole émotionnelle ("I'm going to cry", "this is the hardest thing I've ever done")
- Le framing inattendu ("my AI bestie just destroyed me", "Emma said I sound like a broken robot")
- Le relatable : "when you've been learning for 6 months and still can't order coffee"
- Emma peut être "brutally honest", "savage but helpful"
- Pas de blagues construites. C'est la SITUATION qui est drôle.`}

RÈGLES D'OR :
1. L'ÉMOTION D'ABORD, L'APP ENSUITE. La vidéo doit être divertissante MÊME sans connaître Emma.
2. PERSONNE RÉELLE face caméra. L'authenticité bat la production.
3. EXAGÉRATION ÉMOTIONNELLE sur un sujet léger = comédie pure.
4. TEXTE OVERLAY COURT : 1 phrase qui pose le contexte en 1 seconde.
5. Le SON TRENDING donne l'ambiance — le concept doit matcher l'énergie.
6. Emma est le PRÉTEXTE ou le TWIST, jamais le sujet principal.
7. NE FAIS PAS DE BLAGUES. Propose des SITUATIONS COMIQUES. La différence : une blague c'est "Emma dit un truc marrant" (90% de chances que ce soit nul). Une situation comique c'est "tu demandes à Emma de t'aider à draguer et elle te fait répéter 20 fois parce que t'es nul" (le comique est dans le contexte).

CE QUI NE MARCHE PAS :
- Contenu éducatif ennuyeux, démo produit, ton corporate
- L'avatar Emma qui parle seul face caméra
- Des blagues écrites qui sonnent "généré par IA"
- Du contenu trop produit, trop scénarisé

SON À ANALYSER :
- Titre : "${sound.title}" de ${sound.artist}
- Rang : #${sound.rank} (${sound.cat})
- Marché : ${country==="FR"?"France":"US"}
- Audience : ${sound.ages?sound.ages[0].range+" ("+sound.ages[0].pct+"%)":"18-34 ans"}
- Intérêts : ${(sound.topInterests||[]).join(", ")||"divers"}
- Top pays : ${(sound.topCountries||[]).join(", ")}

Emma est une app d'apprentissage de langues avec un avatar 3D conversationnel. Cible : 18-30 ans.

Propose 2 concepts RADICALEMENT DIFFÉRENTS. Chaque concept = une idée simple, pas un storyboard.

FORMAT DE RÉPONSE :
- "idee" = 1-2 phrases comme si tu pitchais à un pote. PAS de description scène par scène.
- "emma_fait" = ce qu'on voit/entend d'Emma concrètement. La situation comique entre le créateur et Emma. Décris ce qu'Emma dit ou fait qui rend la situation drôle (ex: "Emma lui dit que sa prononciation de 'croissant' ressemble à du russe", "Emma lui met 2/10 et le créateur fait une tête dépitée").

Réponds UNIQUEMENT en JSON valide, sans markdown ni backticks :
{
  "son_energy": "l'énergie du son en 3 mots",
  "concepts": [
    {
      "titre": "le hook, max 8 mots",
      "text_overlay": "texte EXACT sur la vidéo (court, punchy, emojis)",
      "idee": "l'idée en 1-2 phrases, comme à un pote",
      "emma_fait": "la situation comique avec Emma, ce qu'elle dit/fait, en 1-2 phrases",
      "ton": "humoristique|dramatique|relatable|absurde|sentimental"
    },
    {
      "titre": "...",
      "text_overlay": "...",
      "idee": "...",
      "emma_fait": "...",
      "ton": "..."
    }
  ],
  "hashtags": "#hashtag1 #hashtag2 #hashtag3 #hashtag4 #hashtag5",
  "priority": "🔴 À filmer aujourd'hui|🟡 Cette semaine|🟢 À surveiller|⚫ Pas pour Emma",
  "deadline_jours": 3,
  "viral_score": "1-10"
}`;
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1500,messages:[{role:"user",content:prompt}]})});
      const data=await r.json();
      const text=data.content?.filter(i=>i.type==="text")?.map(i=>i.text)?.join("")||"";
      const clean=text.replace(/```json\s*/g,"").replace(/```\s*/g,"").trim();
      const parsed=JSON.parse(clean);
      setBrief(parsed);
    }catch(err){setBrief({concepts:[{titre:"Erreur",deroulement:"Impossible de générer le brief. Réessayez."}],priority:"—"})}
    setLoadingBrief(false);
  };

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
          <div style={{marginTop:14}}>
            {!brief&&!loadingBrief&&(
              <button onClick={generateBrief} style={{background:"#111",color:"#fff",border:"none",padding:"8px 16px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
                💡 Générer un brief Emma
              </button>
            )}
            {loadingBrief&&<div style={{fontSize:12,color:"#6b7280",padding:"8px 0"}}>⏳ Génération du brief...</div>}
            {brief&&(
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
            )}
          </div>
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
  const[saving,setSaving]=useState(false);

  // Load from localStorage on mount
  useEffect(()=>{
    let mounted = true;
    const load = () => {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!mounted) return;
      if (raw) {
        try { const parsed = JSON.parse(raw); setData(parsed); setLastUpdated(parsed.lastUpdated); }
        catch(e) { setData(SEED); setLastUpdated(SEED.lastUpdated); }
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
        setData(SEED); setLastUpdated(SEED.lastUpdated);
      }
      setLoading(false);
    };
    load();
    return () => { mounted = false; };
  },[]);

  const saveData=(newData)=>{
    setSaving(true);
    try{ localStorage.setItem(STORAGE_KEY,JSON.stringify(newData)); setData(newData); setLastUpdated(newData.lastUpdated); }catch(e){console.error(e);}
    setSaving(false);
  };

  const[showPaste,setShowPaste]=useState(false);
  const[pasteText,setPasteText]=useState("");
  const handlePaste=()=>{
    try{
      const parsed=JSON.parse(pasteText);
      if(parsed.FR||parsed.US){ saveData({...data,...parsed,lastUpdated:new Date().toISOString()}); setShowPaste(false); setPasteText(""); }
      else{alert("Format invalide");}
    }catch(e){alert("JSON invalide: "+e.message);}
  };

  // Idées de contenu — generate via Claude API
  const[ideesLoading,setIdeesLoading]=useState(false);
  const[idees,setIdees]=useState(null);
  const generateIdees=async()=>{
    setIdeesLoading(true);
    try{
      const prompt=`Tu es un EXPERT en contenu viral TikTok dans la niche "language learning". Emma est une app d'apprentissage de langues avec un avatar 3D conversationnel.

Marché cible : ${country==="FR"?"FRANCE — contenu en français":"USA — contenu en anglais"}

CE QUI MARCHE (exemples réels viraux) :
- "why is french so hard 💔🇫🇷" → fille en larmes, autodérision. Millions de vues.
- "practicing french with my ai dad 😭💔" → fille avec app IA, framing absurde.
- "je vais enfin pouvoir draguer la femme de mes rêves grâce à emma" → mec soulagé, app = solution au vrai problème.
- "Bonjour Alena!" → grimace dégoûtée quand l'IA parle français.

LA DYNAMIQUE CRÉATEUR ↔ EMMA :
Emma n'est PAS un prof. Emma est un POTE IA. Un duo comique :
- Le créateur galère → Emma le charrie
- Emma est trop honnête : elle dit que ta prononciation est catastrophique
- Emma donne des conseils douteux pour draguer
- Le comique vient de la SITUATION, pas de blagues écrites

${country==="FR"?`HUMOUR FRANÇAIS : autodérision, second degré, situations du quotidien (drague, exams, potes), Emma peut être sèche et cash.`:`HUMOUR US : self-deprecating, hyperbole émotionnelle, Emma "brutally honest" et "savage but helpful".`}

RÈGLES :
1. Émotion d'abord, app ensuite
2. Personne réelle face caméra, authenticité low-fi
3. PAS de son trending — ces vidéos c'est du pur UGC avec l'audio natif
4. Propose des SITUATIONS COMIQUES pas des blagues
5. L'idée en 1-2 phrases comme à un pote, PAS de storyboard
6. Pour emma_fait : décris la situation comique concrète entre le créateur et Emma

Génère 6 idées de contenu UGC pour Emma. Chaque idée est indépendante. Mélange les tons : 2 humoristiques, 1 relatable/sentimental, 1 absurde, 1 dramatique, 1 qui joue sur la drague/séduction.

Réponds UNIQUEMENT en JSON valide, sans markdown ni backticks :
{
  "idees": [
    {
      "titre": "hook max 8 mots",
      "text_overlay": "texte EXACT sur la vidéo (court, emojis)",
      "idee": "l'idée en 1-2 phrases",
      "emma_fait": "la situation comique avec Emma en 1-2 phrases",
      "ton": "humoristique|relatable|absurde|dramatique|sentimental",
      "viral_score": "1-10"
    }
  ]
}`;
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1500,messages:[{role:"user",content:prompt}]})});
      const d=await r.json();
      const text=d.content?.filter(i=>i.type==="text")?.map(i=>i.text)?.join("")||"";
      const clean=text.replace(/```json\s*/g,"").replace(/```\s*/g,"").trim();
      setIdees(JSON.parse(clean));
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
          <button onClick={()=>setShowPaste(!showPaste)} style={{background:"#fff",color:"#374151",border:"1px solid #d1d5db",padding:"8px 14px",borderRadius:10,fontSize:12,fontWeight:600,cursor:"pointer"}}>🔄 Rafraîchir</button>
          <div style={{width:1,height:24,background:"#e5e7eb",margin:"0 4px"}}/>
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={sel}><option value="rank">Par rang</option><option value="emma">Par score Emma</option><option value="momentum">Par momentum</option></select>
          <select value={filterFit} onChange={e=>setFilterFit(e.target.value)} style={sel}><option value="all">Tous ({sounds.length})</option><option value="high">High fit ({hi})</option><option value="medium">Medium ({md})</option><option value="low">Low ({lo})</option></select>
          <select value={filterCat} onChange={e=>setFilterCat(e.target.value)} style={sel}><option value="all">Popular + Breakout</option><option value="popular">Popular ({popCount})</option><option value="breakout">🚀 Breakout ({breakCount})</option></select>
        </>}
      </div>

      {/* ═══════════ TAB 1: SONS TRENDS ═══════════ */}
      {tab==="sons"&&<>
        {showPaste&&(
          <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:14,padding:16,marginBottom:14}}>
            <div style={{fontSize:13,fontWeight:700,marginBottom:6}}>🔄 Mettre à jour les données</div>
            <p style={{fontSize:12,color:"#6b7280",margin:"0 0 10px"}}>Demande à Claude : <strong>"Rafraîchis le radar"</strong></p>
            <textarea value={pasteText} onChange={e=>setPasteText(e.target.value)} placeholder='Coller le JSON ici...' style={{width:"100%",minHeight:60,border:"1px solid #e5e7eb",borderRadius:8,padding:10,fontSize:12,fontFamily:"monospace",resize:"vertical",outline:"none",boxSizing:"border-box"}}/>
            <div style={{display:"flex",gap:8,marginTop:8}}>
              <button onClick={handlePaste} disabled={!pasteText.trim()||saving} style={{background:"#16a34a",color:"#fff",border:"none",padding:"8px 16px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer"}}>{saving?"...":"✅ Mettre à jour"}</button>
              <button onClick={()=>{setShowPaste(false);setPasteText("");}} style={{background:"#fff",color:"#374151",border:"1px solid #d1d5db",padding:"8px 16px",borderRadius:8,fontSize:12,cursor:"pointer"}}>Fermer</button>
            </div>
          </div>
        )}

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
            Des concepts de vidéos sans son trending — 100% audio natif, basés sur la dynamique créateur × Emma. L'humour vient de la situation, pas d'un son.
          </p>
          <button onClick={generateIdees} disabled={ideesLoading} style={{background:"#111",color:"#fff",border:"none",padding:"10px 20px",borderRadius:10,fontSize:13,fontWeight:700,cursor:ideesLoading?"wait":"pointer",opacity:ideesLoading?0.7:1}}>
            {ideesLoading?"⏳ Génération en cours...":"💡 Générer 6 idées de contenu "+( country==="FR"?"🇫🇷":"🇺🇸")}
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

        {!idees&&!ideesLoading&&<div style={{textAlign:"center",padding:40,color:"#9ca3af",fontSize:13}}>Clique sur "Générer" pour obtenir des idées de contenu adaptées au marché {country==="FR"?"français":"américain"}.</div>}
      </>}

      <div style={{marginTop:20,padding:"12px 0",borderTop:"1px solid #e5e7eb",fontSize:11,color:"#9ca3af",textAlign:"center"}}>
        Emma Trend Radar · Source : TikTok Creative Center · {tab==="sons"?"Scoring Emma : pays + UGC + momentum + audience":"Idées générées par IA — à adapter par l'équipe créa"}
      </div>
    </div>
  );
}
