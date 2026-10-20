let DB=null;const app=document.getElementById('app'),crumb=document.getElementById('crumb');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const st={cat:'全部',q:''};
const ICON={'学生会':'🏛️','学生发展中心':'🧭','社团':'🎯','艺术团':'🎭','校队':'🏀','其他':'✨'};
function home(){crumb.textContent='';const cid=st.hc||DB.campuses[0].id;const os=DB.orgs.filter(o=>o.campus===cid);const rec=os.filter(o=>o.recruit_status==='招新中');
app.innerHTML=`<section class="hero2"><div class="h-kicker">新生必看 · 校园组织导航</div><h1>找到你想加入的组织</h1><p>两个校区的学生会、社团、艺术团、校队，一页看全</p>
<div class="h-stats"><div><b>${DB.orgs.length}</b>个组织</div><div><b>${DB.orgs.filter(o=>o.recruit_status==='招新中').length}</b>正在招新</div><div><b>${DB.campuses.length}</b>个校区</div></div></section>
<div class="seg2">${DB.campuses.map(c=>`<button data-h="${esc(c.id)}" class="${c.id===cid?'on':''}">${esc(c.name)}</button>`).join('')}</div>
<h2 class="h2">按类别逛逛</h2><div class="cats">${DB.categories.map(k=>{const n=os.filter(o=>o.category===k).length;return `<a href="#/list/${encodeURIComponent(cid)}" data-k="${esc(k)}"><i>${ICON[k]||'📌'}</i><span>${esc(k)}</span><em>${n} 个</em></a>`}).join('')}</div>
<h2 class="h2">正在招新 <small>${rec.length}</small></h2><div class="rail">${rec.map(o=>`<a class="rc" href="#/org/${encodeURIComponent(o.id)}"><img src="${esc(o.cover)}" alt=""><div><b>${esc(o.name)}</b><span>截止 ${esc(o.recruit_deadline||'待定')}</span></div></a>`).join('')||'<div class="empty">暂无</div>'}</div>
<a class="all" href="#/list/${encodeURIComponent(cid)}">查看${esc(cid)}全部组织 →</a>`;
app.querySelectorAll('.seg2 button').forEach(b=>b.onclick=()=>{st.hc=b.dataset.h;home()});
app.querySelectorAll('.cats a').forEach(a=>a.onclick=()=>{st.cat=a.dataset.k;st.q='';route.c=cid})}
function list(campus){crumb.textContent='/ '+campus;const cats=['全部',...DB.categories];
app.innerHTML=`<div class="chips">${cats.map(c=>`<button class="chip${c===st.cat?' on':''}" data-c="${esc(c)}">${esc(c)}</button>`).join('')}</div>
<input class="search" type="search" placeholder="搜索组织名称或简介" value="${esc(st.q)}"><div class="grid"></div>`;
const grid=app.querySelector('.grid');
const draw=()=>{const q=st.q.trim().toLowerCase();const r=DB.orgs.filter(o=>o.campus===campus&&(st.cat==='全部'||o.category===st.cat)&&(!q||(o.name+o.summary).toLowerCase().includes(q)));
grid.innerHTML=r.length?r.map(o=>`<a class="card" href="#/org/${encodeURIComponent(o.id)}"><img src="${esc(o.logo)}" alt=""><div><h3>${esc(o.name)}</h3><p>${esc(o.summary)}</p><span class="tag${o.recruit_status==='招新中'?'':' off'}">${esc(o.recruit_status)}</span> <span class="meta">${esc(o.category)}</span></div></a>`).join(''):'<div class="empty">没有找到匹配的组织</div>'};
app.querySelectorAll('.chip').forEach(b=>b.onclick=()=>{st.cat=b.dataset.c;app.querySelectorAll('.chip').forEach(x=>x.classList.toggle('on',x===b));draw()});
app.querySelector('.search').oninput=e=>{st.q=e.target.value;draw()};draw()}
function detail(id){const o=DB.orgs.find(x=>x.id===id);if(!o){app.innerHTML='<div class="empty">组织不存在 · <a href="#/">返回首页</a></div>';return}
crumb.innerHTML=`/ <a href="#/list/${encodeURIComponent(o.campus)}">${esc(o.campus)}</a>`;const on=o.recruit_status==='招新中';
app.innerHTML=`<div class="dhero"><img class="cover" src="${esc(o.cover)}" alt=""><div class="dh-in"><img class="dlogo" src="${esc(o.logo)}" alt=""><div><h1>${esc(o.name)}</h1><div class="dm">${esc(o.campus)} · ${esc(o.category)}</div></div></div></div>
<div class="dsum"><span class="tag${on?'':' off'}">${esc(o.recruit_status)}</span>${on&&o.recruit_deadline?` <span class="meta">截止 ${esc(o.recruit_deadline)}</span>`:''}<p>${esc(o.summary)}</p></div>
<div class="sec"><h2>详细介绍</h2>${esc(o.description)}</div>
<div class="sec"><h2>招新时间</h2>${o.recruit_start||o.recruit_deadline?`开始：${esc(o.recruit_start||'待定')}<br>截止：${esc(o.recruit_deadline||'待定')}`:'暂无招新计划'}</div>
<div class="sec"><h2>联系方式</h2><div class="cta">${o.contact?.wechat?'微信：'+esc(o.contact.wechat)+'<br>':''}${o.contact?.qq?'QQ：'+esc(o.contact.qq):''}
${!on?'<div class="btn-off" aria-disabled="true">暂未招新</div>':o.apply_url?`<a class="btn" href="${esc(o.apply_url)}" target="_blank" rel="noopener">去报名</a>`:o.apply_qr?`<button class="btn" id="qb">扫码报名</button><img class="qr" id="qi" src="${esc(o.apply_qr)}" alt="报名二维码" hidden>`:''}</div></div>
${o.video?`<div class="sec"><h2>介绍视频</h2><video src="${esc(o.video)}" controls playsinline preload="metadata"></video></div>`:''}
${o.photos?.length?`<div class="sec"><h2>活动照片</h2><div class="photos">${o.photos.map(p=>`<img src="${esc(p)}" alt="" loading="lazy">`).join('')}</div></div>`:''}`;
const qb=document.getElementById('qb');if(qb)qb.onclick=()=>{const i=document.getElementById('qi');i.hidden=!i.hidden}}
function route(){const h=location.hash.replace(/^#\/?/,'').split('/').map(decodeURIComponent);window.scrollTo(0,0);
if(h[0]==='list'&&h[1]){if(route.c!==h[1]){st.cat='全部';st.q=''}route.c=h[1];list(h[1])}else if(h[0]==='org'&&h[1])detail(h[1]);else home()}
fetch('orgs.json').then(r=>r.json()).then(d=>{DB=d;addEventListener('hashchange',route);route()}).catch(()=>app.textContent='数据加载失败，请通过 HTTP 访问（不要直接双击打开文件）');
