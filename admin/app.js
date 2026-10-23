
const QKEY='lixin_admin_queue_v1';
const OKEY='lixin_admin_orgs_v1';
const $=s=>document.querySelector(s);
const crumb=t=>$('#crumb').textContent=t||'';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let user=sessionStorage.getItem('lixin_admin_user');

function queue(){try{return JSON.parse(localStorage.getItem(QKEY)||'[]')}catch{return[]}}
function setQueue(q){localStorage.setItem(QKEY,JSON.stringify(q))}
function orgs(){
  try{return JSON.parse(localStorage.getItem(OKEY)||'null')}catch{return null}
}
function seedOrgs(){
  let o=orgs();
  if(o)return o;
  o=[
    {id:'bm-lab',name:'立信薄肌实验室',category:'实践',on:true,auth:true},
    {id:'sh-01',name:'青年马克思主义研究会',category:'学术',on:true,auth:true},
  ];
  localStorage.setItem(OKEY,JSON.stringify(o));return o;
}

function route(){
  const h=(location.hash||'#/').replace(/^#\/?/,'').split('/');
  const p=h[0]||'';
  if(!user && p!=='login'){location.hash='#/login';return}
  if(p==='login')return viewLogin();
  if(p==='review'&&h[1])return viewReview(+h[1]);
  if(p==='library')return viewLibrary();
  return viewQueue();
}

function viewLogin(){
  crumb('/ 登录');
  $('#app').innerHTML=`<div class="kicker">ADMIN</div><h1 style="font-size:28px;margin:8px 0">校方后台</h1>
  <p class="sub">演示：任意账号密码</p>
  <label class="field"><span>账号</span><input id="u" value="tuanwei"></label>
  <label class="field"><span>密码</span><input id="p" type="password" value="demo"></label>
  <button class="btn" id="go">登录</button>
  <a class="btn ghost" href="../triad.html">返回三端入口</a>`;
  $('#go').onclick=()=>{user=$('#u').value||'admin';sessionStorage.setItem('lixin_admin_user',user);location.hash='#/'};
}

function viewQueue(){
  crumb('/ 待审队列');
  const q=queue();
  const rows=q.length?q.map((x,i)=>`<a href="#/review/${i}"><b>${esc(x.name)}</b>
    <div class="meta">${esc(x.who)} · ${new Date(x.at).toLocaleString('zh-CN',{hour12:false})} · ${esc(x.summary)}</div></a>`).join('')
    :`<p class="note">暂无待审。去 <a href="../org/#/login" style="border-bottom:1px solid var(--line)">组织端</a> 提交一条。</p>`;
  $('#app').innerHTML=`<div class="kicker">QUEUE</div><h1 style="font-size:26px;margin:8px 0">待审 <span class="chip pending">${q.length}</span></h1>
  <div class="list">${rows}</div>
  <a class="btn ghost" href="#/library">组织库</a>
  <button class="btn ghost" id="out">退出</button>`;
  $('#out').onclick=()=>{sessionStorage.removeItem('lixin_admin_user');user=null;location.hash='#/login'};
}

function viewReview(i){
  const q=queue();const item=q[i];
  if(!item){location.hash='#/';return}
  crumb('/ 审详情');
  const p=item.payload||{};
  $('#app').innerHTML=`<div class="kicker">REVIEW</div><h1 style="font-size:24px;margin:8px 0">${esc(item.name)}</h1>
  <p class="sub">${esc(item.summary)} · ${esc(item.who)}</p>
  <div class="card"><b>招新</b><div class="meta">${p.recruit?.on?'招新中':'未招新'} · 截止 ${esc(p.recruit?.end||'—')}</div>
  <div class="meta">${esc(p.recruit?.short||'')}</div></div>
  <div class="card"><b>活动 ${p.events?.length||0}</b><div class="meta">${(p.events||[]).map(e=>esc(e.title)).join(' · ')||'无'}</div></div>
  <div class="card"><b>扫码</b><div class="meta">${esc(p.qr?.tag||'—')} · 过期 ${esc(p.qr?.expire||'—')}</div></div>
  <label class="field"><span>驳回原因（驳时必填）</span><textarea id="reason" placeholder="写清要改什么"></textarea></label>
  <div class="row"><button class="btn ghost" id="rej">驳回</button><button class="btn" id="ok">通过</button></div>
  <button class="btn ghost" id="back">返回队列</button>`;
  $('#back').onclick=()=>location.hash='#/';
  $('#ok').onclick=()=>{
    // mark org live
    const od=JSON.parse(localStorage.getItem('lixin_org_demo_v1')||'{}');
    if(od){od.status='live';od.rejectReason='';localStorage.setItem('lixin_org_demo_v1',JSON.stringify(od))}
    q.splice(i,1);setQueue(q);
    const lib=seedOrgs();const hit=lib.find(x=>x.id===item.id);if(hit){hit.on=true}else lib.unshift({id:item.id,name:item.name,category:p.org?.category||'实践',on:true,auth:true});
    localStorage.setItem(OKEY,JSON.stringify(lib));
    toast('已通过');location.hash='#/';
  };
  $('#rej').onclick=()=>{
    const r=$('#reason').value.trim();if(!r){toast('请填写驳回原因');return}
    const od=JSON.parse(localStorage.getItem('lixin_org_demo_v1')||'{}');
    if(od){od.status='reject';od.rejectReason=r;localStorage.setItem('lixin_org_demo_v1',JSON.stringify(od))}
    q.splice(i,1);setQueue(q);toast('已驳回');location.hash='#/';
  };
}

function viewLibrary(){
  crumb('/ 组织库');
  const lib=seedOrgs();
  const cats=['全部','学术','体育','文艺','实践','公益'];
  $('#app').innerHTML=`<div class="kicker">LIBRARY</div><h1 style="font-size:26px;margin:8px 0">组织库</h1>
  <div class="row" style="flex-wrap:wrap;margin-bottom:8px" id="chips">${cats.map((c,i)=>`<button type="button" class="chip${i?'':' pending'}" data-c="${c}" style="cursor:pointer;background:none">${c}</button>`).join('')}</div>
  <div class="list" id="list"></div>
  <a class="btn ghost" href="#/">回待审</a>`;
  const draw=(cat='全部')=>{
    const rows=lib.filter(x=>cat==='全部'||x.category===cat);
    $('#list').innerHTML=rows.map((x,i)=>`<div class="card" style="display:flex;gap:10px;align-items:center">
      <div style="flex:1"><b>${esc(x.name)}</b><div class="meta">${esc(x.category)} · ${x.auth?'已授权':'未授权'}</div></div>
      <button class="chip ${x.on?'live':'reject'}" data-i="${i}" data-act="tog" style="cursor:pointer;background:none">${x.on?'上架':'下架'}</button>
    </div>`).join('')||'<p class="note">空</p>';
    $('#list').querySelectorAll('[data-act=tog]').forEach(b=>b.onclick=()=>{lib[+b.dataset.i].on=!lib[+b.dataset.i].on;localStorage.setItem(OKEY,JSON.stringify(lib));draw(cat)});
  };
  draw();
  $('#chips').querySelectorAll('button').forEach(b=>b.onclick=()=>{
    $('#chips').querySelectorAll('button').forEach(x=>x.classList.remove('pending'));b.classList.add('pending');draw(b.dataset.c);
  });
}

function toast(t){let e=document.getElementById('t');if(!e){e=document.createElement('div');e.id='t';e.style.cssText='position:fixed;left:50%;bottom:100px;transform:translateX(-50%);background:#12100E;color:#fff;padding:8px 14px;font-size:13px;z-index:50;opacity:0;transition:.25s';document.body.appendChild(e)}e.textContent=t;e.style.opacity=1;clearTimeout(toast._);toast._=setTimeout(()=>e.style.opacity=0,1600)}
addEventListener('hashchange',route);route();
