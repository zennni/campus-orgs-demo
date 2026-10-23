
const SKEY='lixin_org_demo_v1';
const LABELS={draft:'草稿',pending:'待审',live:'已过',reject:'驳回'};
const chip=s=>`<span class="chip ${s}">${LABELS[s]||s}</span>`;
const $=s=>document.querySelector(s);
const crumb=t=>$('#crumb').textContent=t||'';

function load(){
  try{return JSON.parse(localStorage.getItem(SKEY))||null}catch{return null}
}
function save(d){localStorage.setItem(SKEY,JSON.stringify(d))}
function seed(){
  const d=load();
  if(d)return d;
  const init={
    user:null,
    org:{name:'立信薄肌实验室',category:'实践',campus:'上川 / 文翔',summary:'AI·摄影·训练 · 每天交一张过程',cover:''},
    recruit:{on:true,short:'每天练/吃/AI 三选一',long:'立信 AI+摄影+薄肌协会。显示名「立信薄肌实验室」。',contact:'会长微信待填',interview:'面试下周三下午 · 教室待定 · 当场交首卡',start:'2026-10-20',end:'2026-10-28',qrExpire:'2026-10-28'},
    events:[{title:'迎新破冰',time:'面试日',campus:'上川',place:'待定',link:'',poster:''},{title:'双周合练出片',time:'隔周',campus:'上川↔文翔',place:'训练场',link:'',poster:''}],
    qr:{main:'',backup:'',expire:'2026-10-28',tag:'招新群'},
    status:'draft',rejectReason:'',note:'',updatedAt:Date.now()
  };
  save(init);return init;
}
let DB=seed();

function route(){
  const h=(location.hash||'#/').replace(/^#\/?/,'').split('/');
  const p=h[0]||'';
  if(!DB.user && p!=='login'){location.hash='#/login';return}
  if(p==='login')return viewLogin();
  if(p==='recruit')return viewRecruit();
  if(p==='events')return viewEvents();
  if(p==='qr')return viewQr();
  if(p==='status')return viewStatus();
  return viewHome();
}

function viewLogin(){
  crumb('/ 登录');
  $('#app').innerHTML=`<div class="kicker">ORG LOGIN</div><h1 style="font-size:28px;margin:8px 0 4px">社团登录</h1>
  <p class="sub">演示站：账号密码任意即可进</p>
  <label class="field"><span>账号</span><input id="u" placeholder="社团账号 / 学号" value="bm-lab"></label>
  <label class="field"><span>密码</span><input id="p" type="password" placeholder="任意" value="demo"></label>
  <button class="btn" id="go">登录</button>
  <a class="btn ghost" href="../triad.html">返回三端入口</a>`;
  $('#go').onclick=()=>{DB.user=$('#u').value||'demo';save(DB);location.hash='#/'};
}

function viewHome(){
  crumb('/ 我的协会');
  $('#app').innerHTML=`<div class="kicker">MY ORG</div>
  <div style="display:flex;align-items:center;gap:10px;margin-top:8px"><h1 style="font-size:26px;flex:1">${esc(DB.org.name)}</h1>${chip(DB.status)}</div>
  <p class="sub">${esc(DB.org.category)} · ${esc(DB.org.campus)}</p>
  <div class="card"><div class="sub">封面位</div><p style="margin:8px 0 0">${esc(DB.org.summary)}</p></div>
  <div class="list">
    <a href="#/recruit">改招新<div class="meta">开关 · 简介 · 面试 · 起止</div></a>
    <a href="#/events">改活动日历<div class="meta">${DB.events.length} 条</div></a>
    <a href="#/qr">改扫码<div class="meta">主备码 · 过期 · 用途</div></a>
    <a href="#/status">提交 / 审核状态<div class="meta">${LABELS[DB.status]}</div></a>
  </div>
  <a class="btn ghost" href="../#/org/sh-01" target="_blank" rel="noopener">预览浏览端样式（示意）</a>
  <button class="btn ghost" id="out" style="margin-top:10px">退出登录</button>`;
  $('#out').onclick=()=>{DB.user=null;save(DB);location.hash='#/login'};
}

function viewRecruit(){
  crumb('/ 改招新');const r=DB.recruit;
  $('#app').innerHTML=`<div class="kicker">RECRUIT</div><h1 style="font-size:24px;margin:8px 0">招新</h1>
  <label class="field"><span>招新开关</span><select id="on"><option value="1"${r.on?' selected':''}>招新中</option><option value="0"${!r.on?' selected':''}>未招新</option></select></label>
  <label class="field"><span>短简介</span><textarea id="short">${esc(r.short)}</textarea></label>
  <label class="field"><span>长简介</span><textarea id="long">${esc(r.long)}</textarea></label>
  <label class="field"><span>联系人</span><input id="contact" value="${esc(r.contact)}"></label>
  <label class="field"><span>面试说明</span><textarea id="iv">${esc(r.interview)}</textarea></label>
  <div class="row"><label class="field"><span>开始</span><input id="st" type="date" value="${esc(r.start)}"></label>
  <label class="field"><span>截止</span><input id="ed" type="date" value="${esc(r.end)}"></label></div>
  <div class="abar"><div class="inner"><button class="btn" id="sv">保存草稿</button></div></div>`;
  $('#sv').onclick=()=>{
    DB.recruit={on:$('#on').value==='1',short:$('#short').value,long:$('#long').value,contact:$('#contact').value,interview:$('#iv').value,start:$('#st').value,end:$('#ed').value,qrExpire:r.qrExpire};
    if(DB.status==='live'||DB.status==='reject')DB.status='draft';
    DB.updatedAt=Date.now();save(DB);toast('已保存草稿');location.hash='#/';
  };
}

function viewEvents(){
  crumb('/ 改活动');
  const rows=DB.events.map((e,i)=>`<div class="card" data-i="${i}">
    <label class="field"><span>活动名</span><input data-k="title" value="${esc(e.title)}"></label>
    <div class="row"><label class="field"><span>时间</span><input data-k="time" value="${esc(e.time)}"></label>
    <label class="field"><span>校区</span><input data-k="campus" value="${esc(e.campus)}"></label></div>
    <label class="field"><span>地点</span><input data-k="place" value="${esc(e.place)}"></label>
    <label class="field"><span>报名链</span><input data-k="link" value="${esc(e.link)}"></label>
    <button class="btn ghost rm" type="button">删除</button></div>`).join('');
  $('#app').innerHTML=`<div class="kicker">EVENTS</div><h1 style="font-size:24px;margin:8px 0">活动日历</h1>${rows||'<p class="note">暂无活动</p>'}
  <button class="btn ghost" id="add">+ 添加活动</button>
  <div class="abar"><div class="inner"><button class="btn" id="sv">保存草稿</button></div></div>`;
  $('#add').onclick=()=>{DB.events.push({title:'新活动',time:'',campus:'',place:'',link:'',poster:''});save(DB);viewEvents()};
  $('#app').querySelectorAll('.rm').forEach(b=>b.onclick=()=>{DB.events.splice(+b.closest('.card').dataset.i,1);save(DB);viewEvents()});
  $('#sv').onclick=()=>{
    $('#app').querySelectorAll('.card[data-i]').forEach(c=>{
      const i=+c.dataset.i;const o=DB.events[i];if(!o)return;
      c.querySelectorAll('[data-k]').forEach(inp=>{o[inp.dataset.k]=inp.value});
    });
    if(DB.status==='live'||DB.status==='reject')DB.status='draft';
    DB.updatedAt=Date.now();save(DB);toast('已保存草稿');location.hash='#/';
  };
}

function viewQr(){
  crumb('/ 改扫码');const q=DB.qr;
  $('#app').innerHTML=`<div class="kicker">QR</div><h1 style="font-size:24px;margin:8px 0">扫码</h1>
  <label class="field"><span>主码说明 / 占位 URL</span><input id="main" placeholder="上传后填图床地址" value="${esc(q.main)}"></label>
  <label class="field"><span>备用码</span><input id="backup" value="${esc(q.backup)}"></label>
  <label class="field"><span>过期日</span><input id="ex" type="date" value="${esc(q.expire)}"></label>
  <label class="field"><span>用途标签</span><select id="tag"><option>招新群</option><option>面试</option><option>其他</option></select></label>
  <div class="abar"><div class="inner"><button class="btn" id="sv">保存草稿</button></div></div>`;
  $('#tag').value=q.tag||'招新群';
  $('#sv').onclick=()=>{DB.qr={main:$('#main').value,backup:$('#backup').value,expire:$('#ex').value,tag:$('#tag').value};
    if(DB.status==='live'||DB.status==='reject')DB.status='draft';DB.updatedAt=Date.now();save(DB);toast('已保存草稿');location.hash='#/'};
}

function viewStatus(){
  crumb('/ 提交审核');
  $('#app').innerHTML=`<div class="kicker">REVIEW</div><h1 style="font-size:24px;margin:8px 0">审核状态 ${chip(DB.status)}</h1>
  ${DB.status==='reject'&&DB.rejectReason?`<div class="warn">驳回原因：${esc(DB.rejectReason)}</div>`:''}
  <label class="field"><span>提交备注（可选）</span><textarea id="note">${esc(DB.note||'')}</textarea></label>
  <p class="note">提交后进入后台待审队列；通过后状态变「已过」（演示不改浏览端 orgs.json）。</p>
  <button class="btn" id="sub" ${DB.status==='pending'?'disabled':''}>${DB.status==='pending'?'已在待审':'提交审核'}</button>
  <button class="btn ghost" id="back">返回</button>`;
  $('#back').onclick=()=>location.hash='#/';
  $('#sub').onclick=()=>{
    DB.note=$('#note').value;DB.status='pending';DB.rejectReason='';DB.updatedAt=Date.now();save(DB);
    // push to admin queue
    const q=JSON.parse(localStorage.getItem('lixin_admin_queue_v1')||'[]');
    q.unshift({id:'bm-lab',name:DB.org.name,who:DB.user||'org',at:Date.now(),summary:'改招新/活动/扫码',payload:JSON.parse(JSON.stringify(DB))});
    localStorage.setItem('lixin_admin_queue_v1',JSON.stringify(q.slice(0,20)));
    toast('已提交，等待后台审核');location.hash='#/';
  };
}

function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function toast(t){let e=document.getElementById('t');if(!e){e=document.createElement('div');e.id='t';e.style.cssText='position:fixed;left:50%;bottom:100px;transform:translateX(-50%);background:#12100E;color:#fff;padding:8px 14px;font-size:13px;z-index:50;opacity:0;transition:.25s';document.body.appendChild(e)}e.textContent=t;e.style.opacity=1;clearTimeout(toast._);toast._=setTimeout(()=>e.style.opacity=0,1600)}
addEventListener('hashchange',route);route();
