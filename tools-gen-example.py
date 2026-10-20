import json
cats=["学生会","学生发展中心","社团","艺术团","校队","其他"]
cols=["#4f7cff","#13a89e","#f08a24","#d6457a","#7a5af8","#5b6b7f"]
names={"学生会":"学生会","学生发展中心":"学生发展中心","社团":"摄影社","艺术团":"合唱团","校队":"篮球队","其他":"志愿者协会"}
def svg(path,w,h,c,t):
    open(path,"w").write(f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{c}"/><stop offset="1" stop-color="#222" stop-opacity=".55"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><text x="50%" y="50%" font-family="sans-serif" font-size="{min(w,h)//6}" fill="#fff" text-anchor="middle" dominant-baseline="middle">{t}</text></svg>')
orgs=[]
for cp,ck in (("校区A","a"),("校区B","b")):
  for i,cat in enumerate(cats):
    n=names[cat]; oid=f"{ck}-{i+1}"; c=cols[i]
    svg(f"img/{oid}-logo.svg",400,400,c,n[:2])
    svg(f"img/{oid}-cover.svg",1280,720,c,f"示例·{n}")
    ph=[]
    for k in range(3):
      p=f"img/{oid}-p{k+1}.svg"; svg(p,960,640,c,f"活动照 {k+1}"); ph.append(p)
    rec= (i+(ck=="b"))%2==0
    orgs.append(dict(id=oid,campus=cp,category=cat,name=f"示例·{cp}{n}",logo=f"img/{oid}-logo.svg",cover=f"img/{oid}-cover.svg",
      summary=f"这是一个示例{cat}，一句话简介占位。",
      description=f"示例·{n}（{cp}）的详细介绍占位文字。这里写组织的定位、日常活动、往届成果和对新成员的期待。所有内容均为演示用虚构数据。",
      recruit_status="招新中" if rec else "未招新",recruit_start="2026-09-01" if rec else "",recruit_deadline="2026-11-15" if rec else "",
      apply_url="https://example.com/apply" if i%2==0 else "",apply_qr="" if i%2==0 else f"img/{oid}-qr.svg",
      contact={"wechat":f"demo_{oid}","qq":"10000000"},video="",photos=ph,pair_id=f"pair-{i+1}" if cat in("社团","艺术团","校队") else None))
    if i%2: svg(f"img/{oid}-qr.svg",300,300,"#333","二维码示例")
json.dump({"campuses":[{"id":"校区A","name":"校区A","desc":"示例校区A简介"},{"id":"校区B","name":"校区B","desc":"示例校区B简介"}],"categories":cats,"orgs":orgs},open("orgs.json","w"),ensure_ascii=False,indent=2)
