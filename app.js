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
grid.innerHTML=r.length?r.map(o=>`<a class="card2 tap" href="#/org/${encodeURIComponent(o.id)}"><div class="c2-cov"><img src="${esc(o.cover)}" alt="" loading="lazy"><img class="c2-logo" src="${esc(o.logo)}" alt=""></div><div class="c2-b"><h3>${esc(o.name)}</h3><p>${esc(o.summary)}</p><div class="c2-m"><span class="tag${o.recruit_status==='招新中'?'':' off'}">${esc(o.recruit_status)}</span><span class="meta">${esc(o.category)}</span>${o.recruit_status==='招新中'?cd(o.recruit_deadline):''}</div></div></a>`).join(''):`<div class="empty2">${EMPTY}<b>没有找到匹配的组织</b><span>换个关键词或分类试试</span></div>`};
app.querySelectorAll('.chip').forEach(b=>b.onclick=()=>{st.cat=b.dataset.c;app.querySelectorAll('.chip').forEach(x=>x.classList.toggle('on',x===b));draw()});
app.querySelector('.search').oninput=e=>{st.q=e.target.value;draw()};draw()}
const EMPTY='<svg viewBox="0 0 160 120" width="150" aria-hidden="true"><ellipse cx="80" cy="108" rx="52" ry="7" fill="#e3e8f3"/><rect x="38" y="26" width="64" height="76" rx="10" fill="#fff" stroke="#c9d5f5" stroke-width="3"/><path d="M52 48h36M52 62h28M52 76h20" stroke="#dbe3f7" stroke-width="5" stroke-linecap="round"/><circle cx="104" cy="70" r="20" fill="#eef3ff" stroke="#2f6bff" stroke-width="5"/><path d="M118 84l16 16" stroke="#2f6bff" stroke-width="7" stroke-linecap="round"/></svg>';
const SKEL='<div class="skel"><div class="sk h"></div><div class="sk l"></div><div class="sk l s"></div><div class="sk c"></div><div class="sk c"></div></div>';
const DAY=864e5,today=()=>{const d=new Date();d.setHours(0,0,0,0);return d};
const days=s=>s?Math.round((new Date(s+'T00:00:00')-today())/DAY):null;
function cd(s){const n=days(s);if(n===null)return'';return n<0?'<span class="cd off">已截止</span>':`<span class="cd${n<=7?' hot':''}">${n===0?'今天截止':'还剩 '+n+' 天'}</span>`}
function toast(t){let e=document.getElementById('toast');if(!e){e=document.createElement('div');e.id='toast';document.body.appendChild(e)}e.textContent=t;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('on'),1800)}
function sheet(html){closeSheet();const m=document.createElement('div');m.className='sheet-m';m.innerHTML=`<div class="sheet" role="dialog" aria-modal="true"><i class="grab"></i>${html}<button class="sbtn" data-x>关闭</button></div>`;m.onclick=e=>{if(e.target===m||e.target.hasAttribute('data-x'))closeSheet()};document.body.appendChild(m);requestAnimationFrame(()=>m.classList.add('on'))}
function closeSheet(){document.querySelectorAll('.sheet-m,.lb').forEach(x=>x.remove());document.body.classList.remove('has-bar')}
function lightbox(ps,i){const m=document.createElement('div');m.className='lb';const draw=()=>{m.innerHTML=`<img src="${esc(ps[i])}" alt=""><div class="lb-n">${i+1} / ${ps.length}</div><button class="lb-x" aria-label="关闭">×</button>`};draw();
let x0=null;m.ontouchstart=e=>x0=e.touches[0].clientX;m.ontouchend=e=>{if(x0===null)return;const dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)>40){i=(i+(dx<0?1:ps.length-1))%ps.length;draw()}};
m.onclick=e=>{if(e.target.tagName==='IMG'&&ps.length>1){i=(i+1)%ps.length;draw()}else m.remove()};document.body.appendChild(m)}
async function share(o){const url=location.href;try{if(navigator.share){await navigator.share({title:o.name,url});return}await navigator.clipboard.writeText(url);toast('链接已复制')}catch(e){if(e&&e.name==='AbortError')return;const t=document.createElement('textarea');t.value=url;document.body.appendChild(t);t.select();try{document.execCommand('copy');toast('链接已复制')}catch(_){toast(url)}t.remove()}}
function detail(id){const o=DB.orgs.find(x=>x.id===id);if(!o){app.innerHTML='<div class="empty">组织不存在 · <a href="#/">返回首页</a></div>';return}
crumb.innerHTML=`/ <a href="#/list/${encodeURIComponent(o.campus)}">${esc(o.campus)}</a>`;const on=o.recruit_status==='招新中';
const st0=o.recruit_start,dl=o.recruit_deadline,t=today(),past=s=>s&&new Date(s+'T00:00:00')<=t;
const steps=[['开放报名',st0],['报名截止',dl],['面试 / 结果通知','截止后另行通知']];
const tl=st0||dl?`<ol class="tl">${steps.map((x,k)=>`<li class="${(k<2&&past(x[1]))?'done':''}"><b>${x[0]}</b><span>${esc(x[1]||'待定')}</span></li>`).join('')}</ol>${on?`<div class="tl-cd">${cd(dl)}</div>`:''}`:'<div class="none">暂无招新计划，可先关注联系方式</div>';
app.innerHTML=`<div class="dhero"><img class="cover" src="${esc(o.cover)}" alt=""><button class="share tap" aria-label="分享">${'<svg viewBox="0 0 24 24" width="18"><path d="M12 3v12M7 8l5-5 5 5M5 14v5h14v-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'}</button><div class="dh-in"><img class="dlogo" src="${esc(o.logo)}" alt=""><div><h1>${esc(o.name)}</h1><div class="dm">${esc(o.campus)} · ${esc(o.category)}</div></div></div></div>
<div class="dsum"><span class="tag${on?'':' off'}">${esc(o.recruit_status)}</span>${on?' '+cd(dl):''}<p>${esc(o.summary)}</p></div>
<div class="tabs" role="tablist"><button class="on" data-t="i">介绍</button><button data-t="r">招新</button><button data-t="p">相册${o.photos?.length?` ${o.photos.length}`:''}</button><i class="ink"></i></div>
<div class="pane" data-p="i"><div class="sec"><h2>详细介绍</h2>${esc(o.description)}</div>${o.video?`<div class="sec"><h2>介绍视频</h2><video src="${esc(o.video)}" controls playsinline preload="metadata"></video></div>`:''}
<div class="sec"><h2>联系方式</h2>${o.contact?.wechat?`<div class="kv"><span>微信</span><b>${esc(o.contact.wechat)}</b></div>`:''}${o.contact?.qq?`<div class="kv"><span>QQ</span><b>${esc(o.contact.qq)}</b></div>`:''}</div></div>
<div class="pane" data-p="r" hidden><div class="sec"><h2>招新时间线</h2>${tl}</div></div>
<div class="pane" data-p="p" hidden><div class="sec">${o.photos?.length?`<div class="gal">${o.photos.map((p,k)=>`<img class="tap" data-k="${k}" src="${esc(p)}" alt="" loading="lazy">`).join('')}</div><div class="hint">点击图片查看大图</div>`:'<div class="none">暂无照片</div>'}</div></div>
<div class="abar">${!on?'<div class="btn-off" aria-disabled="true">暂未招新</div>':o.apply_url?`<a class="btn tap" href="${esc(o.apply_url)}" target="_blank" rel="noopener">去报名</a>`:o.apply_qr?`<button class="btn tap" id="qb">扫码报名</button>`:'<div class="btn-off">报名方式待公布</div>'}</div>`;
document.body.classList.add('has-bar');
const tb=app.querySelectorAll('.tabs button'),ink=app.querySelector('.ink');tb.forEach((b,k)=>b.onclick=()=>{tb.forEach(x=>x.classList.toggle('on',x===b));ink.style.transform=`translateX(${k*100}%)`;app.querySelectorAll('.pane').forEach(p=>p.hidden=p.dataset.p!==b.dataset.t)});
app.querySelectorAll('.gal img').forEach(i=>i.onclick=()=>lightbox(o.photos,+i.dataset.k));
app.querySelector('.share').onclick=()=>share(o);
const qb=document.getElementById('qb');if(qb)qb.onclick=()=>sheet(`<h3>扫码报名</h3><img class="qr2" src="${esc(o.apply_qr)}" alt="报名二维码"><p>微信长按或截图识别二维码</p>`)}

function route(){const pv=route.p||0,pn=/^#\/org/.test(location.hash)?2:/^#\/list/.test(location.hash)?1:0;route.p=pn;app.classList.remove('in-f','in-b');void app.offsetWidth;app.classList.add(pn>=pv?'in-f':'in-b');closeSheet();const h=location.hash.replace(/^#\/?/,'').split('/').map(decodeURIComponent);window.scrollTo(0,0);
if(h[0]==='list'&&h[1]){if(route.c!==h[1]){st.cat='全部';st.q=''}route.c=h[1];list(h[1])}else if(h[0]==='org'&&h[1])detail(h[1]);else home()}
app.innerHTML=SKEL;fetch('orgs.json').then(r=>r.json()).then(d=>{DB=d;addEventListener('hashchange',route);route()}).catch(()=>app.textContent='数据加载失败，请通过 HTTP 访问（不要直接双击打开文件）');
