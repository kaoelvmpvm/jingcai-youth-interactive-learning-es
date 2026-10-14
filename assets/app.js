/* 經彩青春 SET｜國小互動教材：依據22頁調整版腳本循序閱讀、10題作答後解鎖知識回饋 */
(() => {
  "use strict";
  const data = window.JINGCAI_DATA;
  const $ = id => document.getElementById(id);
  const UI = {
    welcome:$("welcome"),play:$("play"),finish:$("finish"),
    reset:$("resetBtn"),start:$("startBtn"),again:$("againBtn"),back:$("backBtn"),next:$("nextBtn"),
    roster:$("characterRoster"),heading:$("sceneTitle"),pageCount:$("pageCount"),starCount:$("starCount"),
    progress:$("progressTrack"),bar:$("progressBar"),chapter:$("chapterLabel"),
    icon:$("illustrationIcon"),people:$("illustrationPeople"),caption:$("artCaption"),
    tag:$("contentTag"),task:$("taskCount"),lines:$("storyLines"),
    quiz:$("quizPanel"),question:$("questionText"),options:$("options"),feedback:$("quizFeedback"),
    achievement:$("achievement"),achievementTitle:$("achievementTitle"),hint:$("controlHint"),
    finishTitle:$("finishTitle"),finishText:$("finishText"),unlock:$("unlockCode"),unlockMeaning:$("unlockMeaning"),
    copy:$("copyCodeBtn"),copyMessage:$("copyMessage")
  };
  if (!data || !Array.isArray(data.pages) || data.pages.length !== 21) {
    const h=$("welcomeTitle");
    if(h) h.textContent="教材資料讀取失敗，請重新整理頁面。";
    if(UI.start) UI.start.disabled=true;
    return;
  }
  const roleStyles = {
    "樂樂":{id:"lele",initial:"樂"},
    "小琪":{id:"xiaoqi",initial:"琪"},
    "大明":{id:"daming",initial:"明"},
    "護理師":{id:"nurse",initial:"護"},
    "旁白":{id:"narrator",initial:"語"},
    "同學":{id:"classmate",initial:"同"}
  };
  const pages=data.pages;
  const finishedQuestions=new Set();
  let index=-1;
  let lastWrong=-1;

  function show(name){
    for(const section of ["welcome","play","finish"]) UI[section].hidden=section!==name;
    UI.reset.hidden=name==="welcome";
    window.scrollTo({top:0,behavior:"auto"});
  }
  function getAvatar(speaker){
    const info=roleStyles[speaker]||roleStyles["同學"];
    const el=document.createElement("span");
    el.className="story-avatar avatar-"+info.id;
    el.textContent=info.initial;
    el.setAttribute("aria-hidden","true");
    return el;
  }
  function makeRoster(){
    UI.roster.replaceChildren();
    for(const character of data.characters){
      const el=document.createElement("div");el.className="character-card";
      const info=roleStyles[character.speaker];
      const avatar=document.createElement("span");
      avatar.className="avatar avatar-"+info.id;
      avatar.textContent=info.initial;avatar.setAttribute("aria-hidden","true");
      const text=document.createElement("div");
      const name=document.createElement("strong");name.textContent=character.speaker;
      const desc=document.createElement("small");desc.textContent=character.tagline;
      text.append(name,desc);el.append(avatar,text);UI.roster.append(el);
    }
  }
  function peopleOf(page){
    let names=[...new Set(page.lines.map(l=>l.speaker).filter(r=>["樂樂","小琪","大明","護理師"].includes(r)))];
    if(names.length===0) names=["樂樂","小琪"];
    UI.people.replaceChildren();
    for(const name of names.slice(0,4)){
      const person=document.createElement("div");person.className="mini-person "+roleStyles[name].id;
      const head=document.createElement("div");head.className="mini-head";head.textContent=roleStyles[name].initial;
      const caption=document.createElement("span");caption.className="mini-name";caption.textContent=name;
      person.append(head,caption);UI.people.append(person);
    }
  }
  function makeDialogue(page){
    UI.lines.replaceChildren();
    for(const line of page.lines){
      const row=document.createElement("div");row.className="story-line"+(line.speaker==="旁白"?" narrator":"");
      const box=document.createElement("div");box.className="story-speech";
      const name=document.createElement("strong");name.textContent=line.speaker;
      const message=document.createElement("span");message.textContent=line.text;
      box.append(name,message);row.append(getAvatar(line.speaker),box);
      UI.lines.append(row);
    }
  }
  function completeQuestion(page){
    if(finishedQuestions.has(page.qid))return;
    finishedQuestions.add(page.qid);
    UI.starCount.textContent=String(finishedQuestions.size);
  }
  function feedback(message,correct){
    UI.feedback.hidden=false;
    UI.feedback.className="quiz-feedback "+(correct?"is-correct":"is-wrong");
    UI.feedback.textContent=message;
  }
  function answer(page,pick){
    if(finishedQuestions.has(page.qid))return;
    if(pick===page.correct){
      completeQuestion(page);
      lastWrong=-1;
      feedback("答對了！獲得一枚經彩星星 ✦。按「下一幕」就能解鎖這題的知識徽章。",true);
    }else{
      lastWrong=pick;
      feedback("再想一想！回到故事，找出最能照顧自己、尊重他人的做法，再選一次。",false);
    }
    renderOptions(page);
    UI.next.disabled=!finishedQuestions.has(page.qid);
    UI.hint.textContent=UI.next.disabled?"選一個更合適的答案，再繼續。":"答對了！接著讀讀這一題的知識回饋。";
  }
  function renderOptions(page){
    UI.options.replaceChildren();
    page.options.forEach((text,i)=>{
      const btn=document.createElement("button");btn.type="button";btn.className="option";
      const label=document.createElement("span");label.className="option-letter";label.textContent=["A","B","C"][i];
      const desc=document.createElement("span");desc.textContent=text;
      btn.append(label,desc);
      const solved=finishedQuestions.has(page.qid);
      if(solved && i===page.correct)btn.classList.add("correct");
      if(!solved && i===lastWrong)btn.classList.add("wrong");
      if(solved)btn.disabled=true;
      btn.setAttribute("aria-label",["A","B","C"][i]+"："+text);
      btn.addEventListener("click",()=>answer(page,i));
      UI.options.append(btn);
    });
  }
  function render(){
    if(index>=pages.length){finish();return}
    const page=pages[index];
    if(!page){reset();return}
    UI.pageCount.innerHTML=String(page.page).padStart(2,"0")+" <small>/ 22</small>";
    UI.starCount.textContent=String(finishedQuestions.size);
    UI.progress.setAttribute("aria-valuenow",String(index+1));
    UI.bar.style.width=(100*(index+1)/pages.length)+"%";
    UI.chapter.textContent=page.chapter;
    UI.icon.textContent=page.icon;
    UI.icon.style.animation="none";
    void UI.icon.offsetWidth;
    UI.icon.style.animation="";
    peopleOf(page);
    UI.caption.textContent=page.kind==="quiz"?"觀察情境，再從三個答案裡做出選擇。":page.kind==="reward"?"每一個貼心行動，都能帶來友善改變。":"一起認識樂樂與夥伴們的故事。";
    UI.tag.textContent=page.kind==="quiz"?"想一想 · 互動挑戰":page.kind==="reward"?"學一學 · 知識徽章":"看一看 · 故事情境";
    UI.task.textContent=page.qid?"第 "+String(page.qid).padStart(2,"0")+" / 10 題":"故事開始";
    UI.heading.textContent=page.title;
    makeDialogue(page);
    UI.quiz.hidden=page.kind!=="quiz";
    UI.achievement.hidden=page.kind!=="reward";
    lastWrong=-1;
    if(page.kind==="quiz"){
      UI.question.textContent=page.question;
      UI.feedback.hidden=!finishedQuestions.has(page.qid);
      if(finishedQuestions.has(page.qid))feedback("這一題已完成 ✓。你已獲得經彩星星，繼續閱讀下一幕的知識回饋吧！",true);
      renderOptions(page);
      UI.next.disabled=!finishedQuestions.has(page.qid);
      UI.hint.textContent=UI.next.disabled?"先完成這一題，才能繼續喔。":"這一題已完成，可以繼續前進。";
    }else{
      UI.next.disabled=false;
      if(page.kind==="reward"){
        UI.achievementTitle.textContent=page.title;
        UI.hint.textContent="這就是剛才題目的學習重點，讀完繼續前進！";
      }else{
        UI.hint.textContent="讀完故事，按「下一幕」挑戰第一題。";
      }
    }
    UI.back.textContent=index===0?"← 回到封面":"← 上一頁";
    UI.next.innerHTML=index===pages.length-1?'領取經彩青春 Set 密碼 <span aria-hidden="true">→</span>':'下一幕 <span aria-hidden="true">→</span>';
    show("play");
    UI.heading.focus({preventScroll:true});
  }
  function finish(){
    if(finishedQuestions.size!==10){index=Math.min(index,pages.length-1);render();return}
    index=pages.length;
    UI.finishTitle.textContent=data.ending.title;
    UI.finishText.textContent=data.ending.text;
    UI.unlock.textContent=data.ending.code;
    UI.unlockMeaning.textContent=data.ending.meaning;
    UI.copyMessage.textContent="";
    UI.progress.setAttribute("aria-valuenow",String(pages.length));
    UI.bar.style.width="100%";
    show("finish");
    UI.finishTitle.focus({preventScroll:true});
  }
  function start(){
    finishedQuestions.clear();
    UI.starCount.textContent="0";
    index=0;
    lastWrong=-1;
    render();
  }
  function reset(){
    finishedQuestions.clear();
    lastWrong=-1;
    index=-1;
    UI.starCount.textContent="0";
    UI.copyMessage.textContent="";
    show("welcome");
    UI.start.focus({preventScroll:true});
  }
  async function copyCode(){
    const code=data.ending.code;
    try{
      if(!navigator.clipboard || !navigator.clipboard.writeText)throw new Error("clipboard unavailable");
      await navigator.clipboard.writeText(code);
      UI.copyMessage.textContent="經彩青春 Set 密碼已複製： "+code;
    }catch(e){
      const area=document.createElement("textarea");area.value=code;
      area.style.cssText="position:fixed;left:-9999px;opacity:0";
      document.body.append(area);area.select();
      const ok=document.execCommand && document.execCommand("copy");
      area.remove();
      UI.copyMessage.textContent=ok?"經彩青春 Set 密碼已複製： "+code:"經彩青春 Set 密碼： "+code+"（請長按或手動複製）";
    }
  }
  makeRoster();
  UI.start.addEventListener("click",start);
  UI.reset.addEventListener("click",reset);
  UI.again.addEventListener("click",reset);
  UI.back.addEventListener("click",()=>{
    if(index===0){reset();return}
    index=Math.max(0,index-1);
    render();
  });
  UI.next.addEventListener("click",()=>{
    if(index<0 || index>=pages.length)return;
    const page=pages[index];
    if(page.kind==="quiz"&&!finishedQuestions.has(page.qid))return;
    index++;render();
  });
  UI.copy.addEventListener("click",copyCode);
  show("welcome");
})();