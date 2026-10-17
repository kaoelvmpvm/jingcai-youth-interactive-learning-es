const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const path=require("node:path");
const root=path.join(__dirname,"..");
const source=fs.readFileSync(path.join(root,"data","scenes.js"),"utf8");
const context={window:{}};
vm.runInNewContext(source,context);
const d=context.window.JINGCAI_DATA;

test("22頁劇本由封面、21個內頁構成，另有通關畫面",()=>{
  assert.equal(d.pages.length,21);
  assert.deepEqual(Array.from(d.pages,x=>x.page),Array.from({length:21},(_,i)=>i+2));
  assert.equal(d.pages.filter(p=>p.kind==="story").length,1);
  assert.equal(d.pages.filter(p=>p.kind==="quiz").length,10);
  assert.equal(d.pages.filter(p=>p.kind==="reward").length,10);
  assert.ok(d.intro);
  assert.ok(d.ending.text);
});
test("10題ABC完整且正確選項位於範圍內",()=>{
  const questions=d.pages.filter(p=>p.kind==="quiz");
  assert.deepEqual(Array.from(questions,p=>p.qid),[1,2,3,4,5,6,7,8,9,10]);
  assert.deepEqual(Array.from(questions,p=>p.correct),[1,2,0,1,2,2,1,0,1,2]);
  for(const q of questions){
    assert.ok(q.question && q.question.length>=8);
    assert.equal(q.options.length,3);
    for(const option of q.options)assert.ok(option.length>1);
    assert.ok(q.correct>=0 && q.correct<3);
  }
});
test("每題後緊接知識徽章，且每頁都有閱讀內容",()=>{
  for(let i=1;i<d.pages.length;i+=2){
    const q=d.pages[i],r=d.pages[i+1];
    assert.equal(q.kind,"quiz");
    assert.equal(r.kind,"reward");
    assert.equal(q.qid,r.qid);
    assert.ok(r.title);
  }
  for(const p of d.pages){
    assert.ok(Array.isArray(p.lines) && p.lines.length>0);
    for(const line of p.lines)assert.ok(line.speaker && line.text);
  }
});
test("四個角色、完成密碼、界面依賴檔案存在",()=>{
  assert.deepEqual(Array.from(d.characters,c=>c.speaker),["樂樂","小琪","大明","護理師"]);
  assert.equal(d.ending.code,"0451");
  assert.equal(d.ending.meaning,"你是唯一");
  for(const file of ["index.html","assets/style.css","assets/app.js","data/scenes.js"]){
    assert.ok(fs.statSync(path.join(root,file)).size>0);
  }
  assert.doesNotThrow(()=>new vm.Script(fs.readFileSync(path.join(root,"assets","app.js"),"utf8")));
});

test("調整版的清潔題、班會課與最後的月經友善題完全對應劇本",()=>{
  const p=n=>d.pages.find(x=>x.page===n);
  assert.equal(p(17).options[1],"徹底洗香香，用清潔劑沖洗私密處");
  assert.equal(p(17).correct,0);
  assert.ok(p(18).lines[0].text.includes("不需用力刷和以清潔劑沖洗"));
  assert.ok(p(18).lines[0].text.includes("私密處(陰道)"));
  assert.ok(p(21).lines[0].text.includes("功力等級大增！回到教室"));
  assert.deepEqual(Array.from(p(21).options),[
    "覺得經血很可怕，像個怪物遠躲開",
    "提到月經很丟臉，多開玩笑不尷尬",
    "月經是自然的事，互相關懷跟尊重"
  ]);
  assert.equal(p(21).correct,2);
  assert.equal(p(22).lines.length,1);
  assert.equal(p(22).lines[0].text,"月經專屬女孩的「成長鬧鐘」，不管是男生還是女生，只要大家多一點體貼、多一點了解，彼此都是同理神隊友，一起健康喜悅地迎接青春期的到來！");
});

test("22頁新版舞臺介面與通關密碼一致",()=>{
  const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
  const app=fs.readFileSync(path.join(root,"assets","app.js"),"utf8");
  const presence=fs.readFileSync(path.join(root,"data","presence.js"),"utf8");
  assert.ok(html.includes('id="unlockCode">0451</strong>'));
  assert.ok(html.includes('id="unlockMeaning"'));
  assert.ok(html.includes('id="stageCast"'));
  assert.ok(html.includes('id="stageNarration"'));
  assert.ok(html.includes('id="quizPanel"'));
  assert.ok(html.includes('data/presence.js'));
  assert.ok(html.includes("下一幕"));
  assert.ok(app.includes('state.solved.size!==10'));
  assert.ok(app.includes("data.ending.meaning"));
  assert.ok(!html.includes("5200"));
  assert.ok(!app.includes("5200"));
  assert.ok(presence.includes("window.JINGCAI_STAGE"));
  assert.doesNotThrow(()=>new vm.Script(app));
  assert.doesNotThrow(()=>new vm.Script(presence));
});
test("21幕場景均有明確出場人物，焦點必須是出場角色",()=>{
  const stageSource=fs.readFileSync(path.join(root,"data","presence.js"),"utf8");
  const context={window:{}};
  vm.runInNewContext(stageSource,context);
  const s=context.window.JINGCAI_STAGE;
  assert.equal(Object.keys(s.pages).length,21);
  for(const page of d.pages){
    const p=s.pages[page.page];
    assert.ok(p,"場景缺失："+page.page);
    assert.ok(s.locations[p.location],"場景地點未定義："+page.page);
    assert.ok(p.cast.length>=1 && p.cast.length<=4);
    assert.ok(p.focus.every(name=>p.cast.includes(name)));
    assert.ok(p.cast.every(name=>s.characters[name]));
  }
  assert.deepEqual(Array.from(s.pages[7].cast),["樂樂","小琪","大明","護理師"]);
  assert.ok(s.pages[8].focus.includes("護理師"));
  assert.deepEqual(Array.from(s.pages[22].cast),["護理師"]);
});
test("角色素材留白、台詞只在舞臺依序呈現、徽章位於最上方",()=>{
  const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
  const app=fs.readFileSync(path.join(root,"assets","app.js"),"utf8");
  const css=fs.readFileSync(path.join(root,"assets","style.css"),"utf8");
  const playStart=html.indexOf('<section id="play"');
  const badge=html.indexOf('id="achievement"',playStart);
  const playHead=html.indexOf('class="play-head"',playStart);
  const theatre=html.indexOf('class="theatre"',playStart);
  assert.ok(playStart>=0&&badge>playStart&&badge<playHead&&playHead<theatre);
  assert.equal((html.match(/id="achievement"/g)||[]).length,1);
  assert.ok(html.includes('id="stageNarration" class="stage-dialogues"'));
  assert.ok(!html.includes('id="sceneLines"'));
  assert.ok(!html.includes('class="story-card"'));
  assert.ok(!html.includes('<img src="./assets/characters/'));
  assert.ok(app.includes('page.lines.forEach((line,i)=>'));
  assert.ok(app.includes('bubble-order'));
  assert.ok(app.includes('content.textContent=line.text'));
  assert.ok(app.includes('portraitFor(personName,scenePoses[personName]||poses.default[personName],"portrait-slot")'));
  assert.ok(app.includes('ui.narration.append(bubble)'));
  assert.ok(app.includes('document.createElement("img")'));
  assert.ok(!app.includes('makeLines(page)'));
  assert.ok(app.includes('showAchievement(page)'));
  assert.ok(app.includes('showAchievement(page);'));
  assert.ok(css.includes('.stage-bubble p{'));
  assert.ok(css.includes('.play>.achievement'));
  assert.ok(css.includes('.roster-slot'));
  assert.ok(css.includes('@media(max-width:650px)'));
  assert.doesNotThrow(()=>new vm.Script(app));
});
test("既有角色圖片檔保留，以供後續換成正式插圖",()=>{
  for(const slug of ["lele","xiaoqi","daming","nurse"]){
    const file=path.join(root,"assets","characters",slug+".svg");
    const image=fs.readFileSync(file,"utf8");
    assert.ok(image.startsWith("<svg"),"角色立繪缺少："+slug);
    assert.ok(image.includes("</svg>"));
  }
});

test("圖片設定具有17種固定姿勢，且未匯入時保留預留框",()=>{
  const script=fs.readFileSync(path.join(root,"data","character-poses.js"),"utf8");
  const registry=fs.readFileSync(path.join(root,"data","character-assets.js"),"utf8");
  const context={window:{}};
  vm.runInNewContext(script,context);
  vm.runInNewContext(registry,context);
  const p=context.window.JINGCAI_POSES;
  const assets=context.window.JINGCAI_ASSETS;
  assert.equal(Object.keys(p.pages).length,21);
  assert.equal(Object.keys(p.default).length,4);
  assert.ok(p.pages[7]["樂樂"]==="C01_L06");
  assert.ok(p.pages[8]["護理師"]==="C04_N02");
  const all=new Set([...Object.values(p.default),...Object.values(p.finish),...Object.values(p.pages).flatMap(Object.values)]);
  assert.equal(all.size,17);
  assert.ok(assets.ready===true||assets.ready===false);
  if(assets.ready){
    assert.equal(Object.keys(assets.files).length,17);
    for(const entry of all){
      const url=assets.files[entry];
      assert.ok(url.includes(entry+".png"),"素材對應失敗："+entry);
      assert.ok(fs.existsSync(path.join(root,"assets","characters","generated",entry+".png")));
    }
  }
  const app=fs.readFileSync(path.join(root,"assets","app.js"),"utf8");
  const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
  assert.ok(html.includes("data/character-poses.js"));
  assert.ok(html.includes("data/character-assets.js"));
  assert.ok(app.includes("if(!source)return fallback()"));
  assert.doesNotThrow(()=>new vm.Script(app));
});

test("經彩知識全由護理師單獨呈現，情境不用旁白字樣",()=>{
  const context={window:{}};
  vm.runInNewContext(fs.readFileSync(path.join(root,"data","presence.js"),"utf8"),context);
  for(const p of d.pages.filter(x=>x.kind==="reward")){
    assert.equal(p.lines.length,1);
    assert.equal(p.lines[0].speaker,"護理師");
    assert.deepEqual(Array.from(context.window.JINGCAI_STAGE.pages[p.page].cast),["護理師"]);
  }
  assert.ok(!source.includes('"speaker": "旁白"'));
});
test("介面符合新首頁文案、第一幕與依序呈現",()=>{
  const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
  const app=fs.readFileSync(path.join(root,"assets","app.js"),"utf8");
  assert.ok(html.includes("在校園裡學生們討論著月經的話題"));
  assert.ok(html.includes('class="first-scene-badge">第一幕'));
  for(const x of ["經彩青春・角色互動劇場",'id="headerStage"','id="sceneIndex"','id="chapterLabel"','id="locationLabel"',"用心觀察，聽聽大家怎麼說","場景旁白"])assert.ok(!html.includes(x),x);
  assert.ok(app.includes('page.kind==="reward" && state.solved.has(page.qid)'));
  assert.ok(app.includes('"經彩知識("+page.qid+")護理師："'));
  assert.ok(app.includes("bubble.hidden=!reduceMotion&&i>0"));
  assert.ok(app.includes("window.setTimeout"));
});
