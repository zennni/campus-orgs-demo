let DB=null;const app=document.getElementById('app'),crumb=document.getElementById('crumb');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const st={cat:'全部',q:''};
function home(){crumb.textContent='';app.innerHTML=`<section class="hero"><h1>找到你想加入的组织</h1><p>汇集两个校区的学生会、学生发展中心、社团、艺术团、校队等组织：看介绍、看招新时间、一键跳转报名。</p></section>
<div class="campus">${DB.campuses.map(c=>`<a href="#/list/${encodeURIComponent(c.id)}"><b>${esc(c.name)}</b>${DB.orgs.filter(o=>o.campus===c.id).length} 个组织 · 进入 →</a>`).join('')}</div>
<div class="steps">① 选校区 &nbsp;② 按分类或搜索浏览 &nbsp;③ 查看详情并报名</div>`}
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
app.innerHTML=`<img class="cover" src="${esc(o.cover)}" alt=""><h1 style="font-size:22px;margin:12px 0 2px">${esc(o.name)}</h1>
<div class="meta">${esc(o.campus)} · ${esc(o.category)} · <span class="tag${on?'':' off'}">${esc(o.recruit_status)}</span></div><p>${esc(o.summary)}</p>
<div class="sec"><h2>详细介绍</h2>${esc(o.description)}</div>
<div class="sec"><h2>招新时间</h2>${o.recruit_start||o.recruit_deadline?`开始：${esc(o.recruit_start||'待定')}<br>截止：${esc(o.recruit_deadline||'待定')}`:'暂无招新计划'}</div>
<div class="sec"><h2>联系方式</h2>${o.contact?.wechat?'微信：'+esc(o.contact.wechat)+'<br>':''}${o.contact?.qq?'QQ：'+esc(o.contact.qq):''}
${!on?'<div class="btn-off" aria-disabled="true">暂未招新</div>':o.apply_url?`<a class="btn" href="${esc(o.apply_url)}" target="_blank" rel="noopener">去报名</a>`:o.apply_qr?`<button class="btn" id="qb">扫码报名</button><img class="qr" id="qi" src="${esc(o.apply_qr)}" alt="报名二维码" hidden>`:''}</div>
${o.video?`<div class="sec"><h2>介绍视频</h2><video src="${esc(o.video)}" controls playsinline preload="metadata"></video></div>`:''}
${o.photos?.length?`<div class="sec"><h2>活动照片</h2><div class="photos">${o.photos.map(p=>`<img src="${esc(p)}" alt="" loading="lazy">`).join('')}</div></div>`:''}`;
const qb=document.getElementById('qb');if(qb)qb.onclick=()=>{const i=document.getElementById('qi');i.hidden=!i.hidden}}
function route(){const h=location.hash.replace(/^#\/?/,'').split('/').map(decodeURIComponent);window.scrollTo(0,0);
if(h[0]==='list'&&h[1]){if(route.c!==h[1]){st.cat='全部';st.q=''}route.c=h[1];list(h[1])}else if(h[0]==='org'&&h[1])detail(h[1]);else home()}
fetch('orgs.json').then(r=>r.json()).then(d=>{DB=d;addEventListener('hashchange',route);route()}).catch(()=>app.textContent='数据加载失败，请通过 HTTP 访问（不要直接双击打开文件）');
