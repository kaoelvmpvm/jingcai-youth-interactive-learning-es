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

test("23頁劇本由封面、21個內頁及結尾構成",()=>{
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
  assert.equal(d.ending.code,"5200");
  for(const file of ["index.html","assets/style.css","assets/app.js","data/scenes.js"]){
    assert.ok(fs.statSync(path.join(root,file)).size>0);
  }
  assert.doesNotThrow(()=>new vm.Script(fs.readFileSync(path.join(root,"assets","app.js"),"utf8")));
});
