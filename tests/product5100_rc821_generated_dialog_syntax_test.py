from pathlib import Path
import re, subprocess, json, tempfile, sys
root=Path(__file__).resolve().parents[1]
c=(root/"apps-script/Code.gs").read_text(encoding="utf-8")
s=c.find("function sbmDoctorRegisterSiteDiagnosisResult(){")
e=c.find("function sbmDoctorSiteWideRepresentativeArticle_",s)
fn=c[s:e]
m=re.search(r"var html=(.*?);\s*SpreadsheetApp\.getUi\(\)\.showModalDialog",fn,re.S)
if not m:
    raise SystemExit("FAIL: dialog html expression not found")
expr=m.group(1)
with tempfile.TemporaryDirectory() as td:
    td=Path(td); html=td/"dialog.html"; ev=td/"eval.js"; js=td/"dialog.js"
    ev.write_text("const fs=require('fs');const html="+expr+";fs.writeFileSync("+json.dumps(str(html))+",html,'utf8');",encoding="utf-8")
    r=subprocess.run(["node",str(ev)],capture_output=True,text=True)
    if r.returncode: raise SystemExit("FAIL: HTML evaluation\n"+r.stderr)
    text=html.read_text(encoding="utf-8")
    sm=re.search(r"<script>([\s\S]*?)</script>",text)
    if not sm: raise SystemExit("FAIL: script tag not found")
    js.write_text(sm.group(1),encoding="utf-8")
    r=subprocess.run(["node","--check",str(js)],capture_output=True,text=True)
    if r.returncode: raise SystemExit("FAIL: generated dialog JS syntax\n"+r.stderr)
print("PASS: generated Site Diagnosis dialog JavaScript syntax")
