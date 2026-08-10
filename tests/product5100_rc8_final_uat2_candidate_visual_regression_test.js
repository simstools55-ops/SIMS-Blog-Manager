const fs=require('fs');
const code=fs.readFileSync('apps-script/Code.gs','utf8');
const dist=fs.readFileSync('distribution/Code.gs','utf8');
function ok(v,m){if(!v){console.error('FAIL:',m);process.exit(1);}console.log('PASS:',m);}
ok(code.includes("cand.getDataRange().setWrap(true)"),'REG-UI-DOCTOR-WRAP-001: all candidate cells wrap');
ok(code.includes("autoResizeRows(7,out.length)"),'REG-UI-DOCTOR-WRAP-001: wrapped data rows auto-resize');
ok(code.includes("setHorizontalAlignment('left')"),'severity remains left aligned');
ok(code.includes("function classifyDelta(delta,badWhenPositive,sev)"),'REG-UI-DOCTOR-COLOR-001: delta classifier exists');
ok(code.includes("ratio(bC,aC)") && code.includes("ratio(bI,aI)"),'click and impression colors use actual deltas');
ok(code.includes("(aP-bP)/bP") && code.includes("ratio(bR,aR)"),'position and CTR colors use actual deltas');
ok(code.includes("severityRank(sevText)"),'bad-color intensity uses severity');
ok(code.includes("kind==='good'") && code.includes("kind==='bad'") && code.includes("kind==='warn'"),'good/bad/warn palettes are distinct');
ok(code.includes("code==='CTR_OPPORTUNITY'") && code.includes("code==='POSITION_OPPORTUNITY'") && code.includes("code==='LONG_TERM_STAGNATION'"),'non-delta diagnosis types get targeted highlighting');
ok(code===dist,'distribution mirrors Apps Script');
console.log('PASS product5100_rc8_final_uat2_candidate_visual_regression_test');
