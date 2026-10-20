# 生成示例数据与彩色 SVG 占位图（全部虚构，仅演示）
import json,math
cats=["学生会","学生发展中心","社团","艺术团","校队","其他"]
pal=[("#4f7cff","#8f6bff"),("#13a89e","#5ad1b0"),("#f08a24","#ffc05a"),("#d6457a","#ff8fb1"),("#7a5af8","#4fb3ff"),("#5b6b7f","#9fb4c8")]
names={"学生会":"学生会","学生发展中心":"学生发展中心","社团":"摄影社","艺术团":"合唱团","校队":"篮球队","其他":"志愿者协会"}
# 每个分类一个简单图形（白色线描）
ico={
"学生会":'<path d="M-60 40h120M-50 40V-5M-20 40V-5M20 40V-5M50 40V-5M-65 -10L0 -50 65 -10Z" />',
"学生发展中心":'<circle r="50"/><path d="M0 -35L14 0 0 35-14 0Z"/>',
"社团":'<rect x="-55" y="-35" width="110" height="75" rx="12"/><circle cy="3" r="22"/><path d="M-25 -35l10-15h30l10 15"/>',
"艺术团":'<path d="M-30 35V-35l60-12v70"/><circle cx="-40" cy="35" r="12"/><circle cx="20" cy="23" r="12"/>',
"校队":'<circle r="50"/><path d="M-50 0h100M0 -50v100M-35 -35c25 20 25 50 0 70M35 -35c-25 20-25 50 0 70"/>',
"其他":'<path d="M0 40C-60 0-40-50 0-20 40-50 60 0 0 40Z"/>'}
def bg(w,h,a,b,seed):
    s=f'<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{a}"/><stop offset="1" stop-color="{b}"/></linearGradient></defs><rect width="{w}" height="{h}" fill="url(#g)"/>'
    for k in range(5):
        x=(seed*97+k*233)%w; y=(seed*53+k*151)%h; r=min(w,h)*(.12+.08*((seed+k)%4))
        s+=f'<circle cx="{x}" cy="{y}" r="{r:.0f}" fill="#fff" opacity="{.06+.03*(k%3):.2f}"/>'
    return s
def save(p,w,h,body): open(p,"w").write(f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">{body}</svg>')
def icon(cat,cx,cy,sc): return f'<g transform="translate({cx} {cy}) scale({sc})" fill="none" stroke="#fff" stroke-width="{6/sc*1.2:.1f}" stroke-linecap="round" stroke-linejoin="round" opacity=".95">{ico[cat]}</g>'
T='font-family="PingFang SC,Noto Sans CJK SC,sans-serif" fill="#fff"'
orgs=[]
for cp,ck in (("校区A","a"),("校区B","b")):
  for i,cat in enumerate(cats):
    n=names[cat]; oid=f"{ck}-{i+1}"; a,b=pal[i]; sd=i*7+(ck=="b")*3
    save(f"img/{oid}-logo.svg",400,400,bg(400,400,a,b,sd)+icon(cat,200,185,1.6)+f'<text x="200" y="335" {T} font-size="44" font-weight="700" text-anchor="middle">{n[:2]}</text>')
    save(f"img/{oid}-cover.svg",1280,720,bg(1280,720,a,b,sd)+icon(cat,1010,330,3.2)+f'<text x="90" y="170" {T} font-size="84" font-weight="700">{n}</text><text x="92" y="235" {T} font-size="34" opacity=".8">示例数据 · {cp}</text>')
    ph=[]
    for k in range(3):
      p=f"img/{oid}-p{k+1}.svg"; a2,b2=pal[(i+k)%6]
      save(p,960,640,bg(960,640,a2,b2,sd+k*5)+icon(cat,480,290,2.2)+f'<text x="480" y="560" {T} font-size="36" text-anchor="middle" opacity=".9">活动照 {k+1}（示例）</text>'); ph.append(p)
    rec=(i+(ck=="b"))%2==0
    orgs.append(dict(id=oid,campus=cp,category=cat,name=f"示例·{cp}{n}",logo=f"img/{oid}-logo.svg",cover=f"img/{oid}-cover.svg",
      summary=f"这是一个示例{cat}，一句话简介占位。",
      description=f"示例·{n}（{cp}）的详细介绍占位文字。这里写组织的定位、日常活动、往届成果和对新成员的期待。所有内容均为演示用虚构数据。",
      recruit_status="招新中" if rec else "未招新",recruit_start="2026-09-01" if rec else "",recruit_deadline="2026-11-15" if rec else "",
      apply_url="https://example.com/apply" if i%2==0 else "",apply_qr="" if i%2==0 else f"img/{oid}-qr.svg",
      contact={"wechat":f"demo_{oid}","qq":"10000000"},video="",photos=ph,pair_id=f"pair-{i+1}" if cat in("社团","艺术团","校队") else None))
    if i%2:
      cells=''.join(f'<rect x="{30+(x*12)}" y="{30+(y*12)}" width="12" height="12"/>' for x in range(20) for y in range(20) if (x*7+y*13+x*y+i)%3==0 or (x<6 and y<6) or (x>13 and y<6) or (x<6 and y>13))
      save(f"img/{oid}-qr.svg",300,300,f'<rect width="300" height="300" fill="#fff"/><g fill="#222">{cells}</g><rect x="100" y="125" width="100" height="50" rx="8" fill="#fff"/><text x="150" y="157" font-size="18" text-anchor="middle" font-family="sans-serif" fill="#2f6bff">示例二维码</text>')
json.dump({"campuses":[{"id":"校区A","name":"校区A","desc":"示例校区A简介"},{"id":"校区B","name":"校区B","desc":"示例校区B简介"}],"categories":cats,"orgs":orgs},open("orgs.json","w"),ensure_ascii=False,indent=2)
