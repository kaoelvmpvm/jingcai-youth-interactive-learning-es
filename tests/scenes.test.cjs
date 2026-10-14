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

test("22頁介面與通關密碼、解釋一致",()=>{
  const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
  const app=fs.readFileSync(path.join(root,"assets/app.js"),"utf8");
  assert.ok(html.includes('id="unlockCode">0451</b>'));
  assert.ok(html.includes('id="unlockMeaning"'));
  assert.ok(html.includes("下一幕"));
  assert.ok(app.includes("/ 22</small>"));
  assert.ok(app.includes("data.ending.meaning"));
  assert.ok(!html.includes("5200"));
  assert.ok(!app.includes("5200"));
});
