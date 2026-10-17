/* 各幕人物、發言焦點與場景：獨立於劇本，避免依發話人數誤判實際在場人物。 */
window.JINGCAI_STAGE = {
  characters:{
    "樂樂":{id:"lele",image:"./assets/characters/lele.svg",tagline:"活力滿格，超能動！"},
    "小琪":{id:"xiaoqi",image:"./assets/characters/xiaoqi.svg",tagline:"暖心助人，神隊友！"},
    "大明":{id:"daming",image:"./assets/characters/daming.svg",tagline:"好奇求知，勇敢問！"},
    "護理師":{id:"nurse",image:"./assets/characters/nurse.svg",tagline:"月經導師，秒解惑！"}
  },
  locations:{
    sports:{className:"location-sports",label:"🏐 操場"},
    classroom:{className:"location-classroom",label:"🏫 教室"},
    clinic:{className:"location-clinic",label:"🩺 健康中心"}
  },
  pages:{
    2:{location:"sports",cast:["樂樂","小琪","大明"],focus:["樂樂"],mood:{"樂樂":"unwell"}},
    3:{location:"sports",cast:["樂樂","小琪","大明"],focus:["樂樂","大明"],mood:{"樂樂":"unwell","大明":"curious"}},
    4:{location:"sports",cast:["護理師"],focus:["護理師"],mood:{"護理師":"smile"}},
    5:{location:"classroom",cast:["樂樂","小琪","大明"],focus:["樂樂"],mood:{"樂樂":"worried"}},
    6:{location:"classroom",cast:["護理師"],focus:["護理師"],mood:{"護理師":"smile"}},
    7:{location:"clinic",cast:["樂樂","小琪","大明","護理師"],focus:["小琪","大明"],mood:{"大明":"curious","樂樂":"unwell"}},
    8:{location:"clinic",cast:["護理師"],focus:["護理師"],mood:{"護理師":"smile"}},
    9:{location:"clinic",cast:["樂樂","小琪","大明","護理師"],focus:["護理師","小琪"],mood:{"小琪":"curious"}},
    10:{location:"clinic",cast:["護理師"],focus:["護理師"],mood:{"護理師":"smile"}},
    11:{location:"clinic",cast:["樂樂","小琪","大明","護理師"],focus:["樂樂"],mood:{"樂樂":"worried"}},
    12:{location:"clinic",cast:["護理師"],focus:["護理師"],mood:{"護理師":"smile"}},
    13:{location:"clinic",cast:["樂樂","小琪","大明","護理師"],focus:["樂樂","小琪"],mood:{"小琪":"curious"}},
    14:{location:"clinic",cast:["護理師"],focus:["護理師"],mood:{"護理師":"smile"}},
    15:{location:"clinic",cast:["樂樂","小琪","大明","護理師"],focus:["大明","小琪"],mood:{"大明":"curious","小琪":"smile"}},
    16:{location:"clinic",cast:["護理師"],focus:["護理師"],mood:{"護理師":"smile"}},
    17:{location:"clinic",cast:["樂樂","小琪","大明","護理師"],focus:["樂樂","大明"],mood:{"樂樂":"worried","大明":"curious"}},
    18:{location:"clinic",cast:["護理師"],focus:["護理師"],mood:{"護理師":"smile"}},
    19:{location:"clinic",cast:["樂樂","小琪","大明","護理師"],focus:["小琪","樂樂"],mood:{"樂樂":"worried"}},
    20:{location:"clinic",cast:["護理師"],focus:["護理師"],mood:{"護理師":"smile"}},
    21:{location:"classroom",cast:["樂樂","小琪","大明"],focus:["樂樂","小琪","大明"],mood:{"樂樂":"smile"}},
    22:{location:"classroom",cast:["護理師"],focus:["護理師"],mood:{"護理師":"smile"}}
  },
  moods:{unwell:"😣",worried:"😟",curious:"❔",relieved:"🙂",smile:"✨"}
};