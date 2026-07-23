/**
 * SIMS-Blog-Manager Product 5.4.3
 * SIMS-Core Slim Edition for blog SEO improvement management.
 * End-user distribution file: paste this entire file into Code.gs/Code.js.
 */

const SBM_VERSION = '5.4.3';
const SBM_OFFICIAL_SCHEMA_VERSION = 'p5-daily-status-v2';
const SBM_SHEETS = Object.freeze({
  HOME: 'Home',
  TODAY: '今日の改善',
  LOG: '改善ログ',
  SETUP: 'セットアップ',
  QUERY_DATA: 'データ一覧',
  ARTICLE_DB: '記事管理',
  RAW_DATA: 'SearchConsole_Data',
  DIAGNOSIS: 'ブログ診断',
  EFFECT: '改善の推移',
  SETTINGS: 'Settings',
  USER_SETTINGS: '設定',
  SYSTEM_LOG: 'System_Log',
  BRIEF: '改善ブリーフ',
  MEASURE_HISTORY: '測定履歴',
  PROCESS_LOG: '処理ログ',
  PROFILE_LOG: '処理プロファイル',
  IN_PROGRESS: '改善中',
  FEEDBACK_HISTORY: '改善履歴'
});

const SBM_HEADERS = Object.freeze({
  SETTINGS: ['Key', 'Value', 'Description', 'UpdatedAt'],
  USER_SETTINGS: ['設定項目','値','説明'],
  SYSTEM_LOG: ['CreatedAt', 'Action', 'Status', 'Detail'],
  QUERY_DATA: ['記事ステータス','記事タイトル','メインクエリ','クリック数','表示回数','CTR','平均順位','詳細','最終取得日時','記事URL','SEOタイトル（titleタグ）','メタディスクリプション'],
  ARTICLE_DB: ['選択','記事ランク','作業状態','記事URL','メインクエリ','クリック数','表示回数','CTR','掲載順位','データ更新日','記事タイトル','詳細','SEOタイトル','メタディスクリプション','最終取得日時','元URL件数','除外理由','備考','ArticleID','記事情報補完済み','補完日時','補完エラー','記事ステータス','最終確認日','連続未取得日数','管理フラグ'],
  RAW_DATA: ['StartDate','EndDate','Query','URL','Clicks','Impressions','CTR','Position','CapturedAt'],
  DIAGNOSIS: ['URL','Title','MainQuery','SubQueries','FAQQueries','SeparateArticleQueries','NoiseQueries','QuerySummary','Clicks','Impressions','CTR','Position','DiagnosisCode','Diagnosis','Recommendation','EstimatedMinutes','OpportunityScore','Reason','AnalyzedAt'],
  TODAY: ['選択','区分','記事タイトル','改善理由・期待効果','予想時間','記事ランク','メインクエリ','クリック数','表示回数','CTR','掲載順位','記事URL','候補ID'],
  LOG: ['改善日','記事タイトル','URL','メインクエリ','改善内容','修正内容','所要時間','メモ','初回測定日','7日測定完了日','状態','改善前CTR','改善前順位','改善前クリック','改善前表示回数'],
  EFFECT: ['記事タイトル','改善日','改善内容','判定','SIMS評価','次のアクション','詳細','URL','修正内容','経過日数','改善前順位','現在順位','順位変化','改善前CTR','現在CTR','CTR変化','改善前クリック','現在クリック','クリック変化','次の確認','コメント'],
  BRIEF: ['BriefId','URL','記事タイトル','メインクエリ','サブクエリ','FAQ候補','別記事候補','除外クエリ','クエリ分析','診断','推奨改善','理由','推定時間','Score','CTR','Position','Clicks','Impressions','改善依頼文','作成日時'],
  MEASURE_HISTORY: ['記事タイトル','改善日','記録日','経過日数','現在順位','現在CTR','現在クリック','現在表示回数','判定メモ','URL'],
  PROCESS_LOG: ['日時','処理','状態','対象件数','処理件数','所要秒','詳細'],
  PROFILE_LOG: ['日時','RunId','処理','工程','開始','終了','所要秒','対象件数','処理件数','詳細'],
  IN_PROGRESS: ['改善日','記事タイトル','経過日数','状態','SIMS評価','次のアクション','詳細','URL','修正内容','改善内容'],
  FEEDBACK_HISTORY: ['選択','改善日','記事タイトル','改善概要','使用AI','1週','2週','3週','4週','最終判定','状態','1回目測定日時','1回目SIMS寸評','2回目測定日時','2回目SIMS寸評','3回目測定日時','3回目SIMS寸評','4回目測定日時','4回目SIMS寸評','最終総括','最終改善提案','ArticleID','記事URL','変更箇所','変更後タイトル','変更後SEOタイトル','変更後メタディスクリプション','メインクエリ','改善規模','確信度','期待CTR効果','期待クリック効果','次のアクション','維持した項目','作業時間（分）','注意事項','改善前クリック','改善前表示回数','改善前CTR','改善前順位','AI改善結果JSON','改善履歴ID','改善計画JSON','Feedback Format','Writer Version']
});

const SBM_DEFAULTS = Object.freeze({
  MANAGED_RATIO: '30%',
  DAILY_MINUTES: 30,
  QUEUE_LIMIT: 5,
  RELATED_QUERIES: 50,
  MIN_IMPRESSIONS: 50,
  MIN_CLICKS: 1,
  SEARCH_DAYS: 90,
  GSC_DELAY_DAYS: 3,
  MAX_QUERY_ROWS: 5000,
  DAILY_FETCH_MAX_ROWS: 1500,
  PAGE_FETCH_MAX_ROWS: 5000,
  QUERY_FETCH_PAGE_LIMIT: 50,
  ANALYSIS_CANDIDATE_LIMIT: 10,
  ANALYSIS_ARTICLE_LIMIT: 120,
  TITLE_FETCH_DEFAULT: 'ON',
  META_FETCH_MAX_ROWS: 50,
  ARTICLE_DB_BUILD_BATCH: 100,
  ARTICLE_INFO_BATCH: 50,
  TODAY_INITIAL_DISPLAY: 2,
  TODAY_MAX_DISPLAY: 6,
  TIMEZONE: 'Asia/Tokyo'
});


function sbmShowImprovementRefactorStatus_() {
  sbmAlert_('改善機能の再構築状況', '今日の改善は記事DBだけを参照して作成します。\n改善ナビは選択した記事の保存済みデータから表示します。\n旧改善ブリーフ・旧ブログ診断・別ブログのサンプル情報は参照しません。');
}

/**
 * 日次処理の唯一の完了基準。
 * LastSuccessfulDailyUpdateEpoch は日次処理が最後まで正常終了した時だけ更新します。
 * Homeの表示と起動時判定は必ずこの値を共用します。
 */
function sbmGetLastSuccessfulDailyUpdateDate_() {
  var epoch = Number(sbmGetSetting_('LastSuccessfulDailyUpdateEpoch', 0) || 0);
  if (isFinite(epoch) && epoch > 0) return new Date(epoch);

  // Product 5.3.0以前からの移行時だけ旧値を日本時間として安全に読み取ります。
  var legacy = String(sbmGetSetting_('LastArticleDbFetchAt', '') || '').trim();
  var m = legacy.match(/^(\d{4})[-\/]?(\d{1,2})[-\/]?(\d{1,2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);
  if (!m) return null;
  var utcMillis = Date.UTC(Number(m[1]), Number(m[2])-1, Number(m[3]), Number(m[4]||0)-9, Number(m[5]||0), Number(m[6]||0));
  var d = new Date(utcMillis);
  if (isNaN(d.getTime())) return null;
  return d;
}

function sbmDailyUpdateStatus_() {
  var last = sbmGetLastSuccessfulDailyUpdateDate_();
  var todayKey = sbmDateText_(new Date());
  var lastKey = last ? sbmDateText_(last) : '';
  return {
    lastDate: last,
    todayKey: todayKey,
    lastKey: lastKey,
    completedToday: !!lastKey && lastKey === todayKey,
    displayText: last ? sbmJapaneseDateTimeText_(last) : '未更新'
  };
}

function sbmMarkDailyUpdateCompleted_(completedAt) {
  var d = completedAt instanceof Date ? completedAt : new Date();
  var epoch = d.getTime();
  sbmSetSetting_('LastSuccessfulDailyUpdateEpoch', String(epoch), '日次処理が最後まで正常終了した日時（Unixミリ秒）。Home表示と未実行判定の共通値');
  // 旧バージョンとの互換用。判定には使用しません。
  sbmSetSetting_('LastFetchDate', sbmDateText_(d), '最終取得日（互換用）');
  sbmSetSetting_('LastArticleDbFetchAt', Utilities.formatDate(d, SBM_DEFAULTS.TIMEZONE, 'yyyy-MM-dd HH:mm:ss'), '記事DBの最終取得日時（表示互換用）');
}

function sbmGetDailyRuntimeState_() {
  var running = String(sbmGetSetting_('DailyUpdateRunning','NO')) === 'YES';
  var startedEpoch = Number(sbmGetSetting_('DailyUpdateStartedEpoch',0) || 0);
  var heartbeatEpoch = Number(sbmGetSetting_('DailyUpdateHeartbeatEpoch',0) || 0);
  var stale = running && (!heartbeatEpoch || (Date.now() - heartbeatEpoch) > 45 * 60 * 1000);
  if (stale) {
    sbmSetSetting_('DailyUpdateRunning','NO','日次処理の実行状態');
    sbmSetSetting_('DailyUpdatePhase','ERROR','日次処理の現在フェーズ');
    sbmSetSetting_('DailyUpdateLastError','日次処理が長時間更新されなかったため停止状態にしました。再度「日次処理を実行」してください。','直近の日次処理エラー');
    running = false;
  }
  var daily = sbmDailyUpdateStatus_();
  var phase = String(sbmGetSetting_('DailyUpdatePhase', running ? 'FETCH' : '') || '');
  var progress = Number(sbmGetSetting_('DailyUpdateProgress', running ? 5 : (daily.completedToday ? 100 : 0)) || 0);
  var message = String(sbmGetSetting_('DailyUpdateMessage','') || '');
  var actionRequired = String(sbmGetSetting_('DailyUpdateActionRequired','NO')) === 'YES';
  var actionMessage = String(sbmGetSetting_('DailyUpdateActionMessage','') || '');
  var continuationRequired = String(sbmGetSetting_('DailyUpdateContinuationRequired','NO')) === 'YES';
  return {
    running: running,
    completedToday: daily.completedToday,
    lastDate: daily.lastDate,
    displayText: daily.displayText,
    phase: phase,
    progress: progress,
    message: message,
    actionRequired: actionRequired,
    actionMessage: actionMessage,
    continuationRequired: continuationRequired,
    error: String(sbmGetSetting_('DailyUpdateLastError','') || ''),
    startedEpoch: startedEpoch,
    label: running ? '実行中' : (continuationRequired ? '続行待ち' : (phase === 'ERROR' ? 'エラー' : (daily.completedToday ? '本日完了' : '未実施')))
  };
}

function sbmDailyPhaseLabel_(phase) {
  var map = {FETCH:'Search Consoleからデータを取得しています',MERGE:'記事管理を更新しています',RECOMMEND:'改善候補と今日の改善を更新しています',FINALIZE:'Homeと完了状態を更新しています',DONE:'日次処理が完了しました',ERROR:'日次処理を継続できません'};
  return map[String(phase || '')] || '日次処理を準備しています';
}

function sbmSetDailyProgress_(phase, progress, message) {
  sbmSetSetting_('DailyUpdatePhase', String(phase || ''), '日次処理の現在フェーズ');
  sbmSetSetting_('DailyUpdateProgress', String(Number(progress || 0)), '日次処理の進捗率');
  sbmSetSetting_('DailyUpdateMessage', String(message || sbmDailyPhaseLabel_(phase)), '日次処理の進捗メッセージ');
  sbmSetSetting_('DailyUpdateHeartbeatEpoch', String(Date.now()), '日次処理の最終進捗更新日時（Unixミリ秒）');
}

function sbmOpenDailyUpdateDialog() {
  if (!sbmIsSetupComplete_() || String(sbmGetSetting_('ConnectionStatus','')) !== 'OK') {
    return sbmAlert_('日次処理を実行できません', '初回セットアップとSearch Console接続テストを完了してください。');
  }
  var state = sbmGetDailyRuntimeState_();
  var initial = state.running ? '日次処理は実行中です。進捗を確認しています。' :
    (state.continuationRequired ? '安全な実行時間に達したため一時停止しました。「続きを実行」を押してください。' :
    (state.completedToday ? '本日の日次処理は完了しています。再実行する場合は「実行する」を押してください。' : '本日の日次処理はまだ実行されていません。'));
  var html = '<!DOCTYPE html><html><head><base target="_top"><style>'
    + 'body{font-family:Arial,"Noto Sans JP",sans-serif;padding:22px;color:#202124}h2{color:#0b8043;margin:0 0 12px}'
    + '.box{background:#f8f9fa;border-left:5px solid #0b8043;padding:12px;margin:12px 0;line-height:1.7;white-space:pre-wrap}.note{font-size:13px;color:#5f6368;line-height:1.6}'
    + '.buttons{display:flex;gap:10px;justify-content:flex-end;margin-top:20px}button{border:0;border-radius:6px;padding:10px 18px;font-weight:700;cursor:pointer}'
    + '.run{background:#0b8043;color:white}.close{background:#f1f3f4}.spinner{display:none;width:32px;height:32px;border:5px solid #dfe7df;border-top-color:#0b8043;border-radius:50%;animation:spin .9s linear infinite;margin:18px auto}'
    + '.bar{height:10px;background:#e8eaed;border-radius:6px;overflow:hidden;margin:14px 0}.bar>div{height:100%;width:0;background:#0b8043;transition:width .4s}.percent{text-align:center;font-size:12px;color:#5f6368}'
    + '@keyframes spin{to{transform:rotate(360deg)}}.error{color:#b3261e;border-left-color:#b3261e}.done{color:#0b8043;font-weight:700}.action{background:#fef7e0;border-left-color:#b06000;color:#8a4b08}</style></head><body>'
    + '<h2>日次処理</h2><div id="message" class="box">' + sbmEscapeHtml_(initial) + '</div>'
    + '<div id="spinner" class="spinner"></div><div id="progressWrap" style="display:none"><div class="bar"><div id="bar"></div></div><div id="percent" class="percent"></div></div>'
    + '<p class="note">処理が安全な実行時間内に終わらない場合は途中状態を保存します。その場合は、この画面に「続きを実行」と具体的な操作方法を表示します。</p>'
    + '<div class="buttons"><button id="closeBtn" class="close" onclick="google.script.host.close()">閉じる</button><button id="runBtn" class="run" onclick="runDaily()"' + (state.running ? ' style="display:none"' : '') + '>' + (state.continuationRequired ? '続きを実行' : '実行する') + '</button></div>'
    + '<script>var timer=null;function uiRunning(){document.getElementById("runBtn").style.display="none";document.getElementById("spinner").style.display="block";document.getElementById("progressWrap").style.display="block";}function render(s){var m=document.getElementById("message"),sp=document.getElementById("spinner"),pw=document.getElementById("progressWrap"),b=document.getElementById("bar"),pc=document.getElementById("percent"),r=document.getElementById("runBtn");if(s.running){uiRunning();m.className="box";m.textContent=s.message||"日次処理を実行しています。";b.style.width=(s.progress||0)+"%";pc.textContent=(s.progress||0)+"%";return;}sp.style.display="none";pw.style.display="none";if(s.continuationRequired){m.className="box action";m.textContent=s.actionMessage||"安全な実行時間に達したため一時停止しました。処理位置は保存されています。下の「続きを実行」を押してください。";r.style.display="inline-block";r.textContent="続きを実行";clearInterval(timer);timer=null;return;}if(s.actionRequired){m.className="box action";m.textContent=(s.actionMessage||"利用者の操作が必要です。");r.style.display="inline-block";r.textContent="再実行する";clearInterval(timer);timer=null;return;}if(s.error){m.className="box error";m.textContent=s.error;r.style.display="inline-block";r.textContent="再実行する";clearInterval(timer);timer=null;return;}if(s.completedToday){m.className="box done";m.textContent="日次処理が完了しました。記事管理、改善候補、今日の改善、Homeを更新しました。";r.style.display="none";clearInterval(timer);timer=null;return;}m.className="box";m.textContent=s.message||"未実施です。";r.style.display="inline-block";r.textContent="実行する";}function poll(){google.script.run.withSuccessHandler(render).withFailureHandler(function(){}).sbmGetDailyUpdateClientStatus();}function runDaily(){uiRunning();document.getElementById("message").textContent="日次処理を開始しています。";google.script.run.withFailureHandler(function(e){render({running:false,error:(e&&e.message)?e.message:String(e)});}).withSuccessHandler(function(){poll();}).sbmRunDailyUpdateFromDialog();if(!timer)timer=setInterval(poll,2500);}if(' + (state.running ? 'true' : 'false') + '){uiRunning();timer=setInterval(poll,2500);poll();}</script></body></html>';
  SpreadsheetApp.getUi().showModalDialog(sbmEnsureCloseButton_(HtmlService.createHtmlOutput(html).setWidth(590).setHeight(500)), '日次処理');
}

function sbmGetDailyUpdateClientStatus() {
  return sbmGetDailyRuntimeState_();
}

function sbmRunDailyUpdateFromDialog() {
  var lock = LockService.getDocumentLock();
  if (!lock.tryLock(2000)) throw new Error('日次処理はすでに実行中です。完了までお待ちください。');
  try {
    var state = sbmGetDailyRuntimeState_();
    if (!state.running) {
      var resume = !!state.continuationRequired;
      sbmSetSetting_('DailyUpdateRunning','YES','日次処理の実行状態');
      sbmSetSetting_('DailyUpdateContinuationRequired','NO','日次処理の続行操作が必要か');
      sbmSetSetting_('DailyUpdateStartedEpoch',String(Date.now()),'今回の日次処理実行の開始日時（Unixミリ秒）');
      sbmSetSetting_('DailyUpdateLastError','','直近の日次処理エラー');
      sbmSetSetting_('DailyUpdateActionRequired','NO','利用者操作が必要か');
      sbmSetSetting_('DailyUpdateActionMessage','','利用者へ案内する操作内容');
      if (resume) {
        var resumePhase = String(sbmGetSetting_('DailyUpdatePhase','FETCH') || 'FETCH');
        sbmSetDailyProgress_(resumePhase, Number(sbmGetSetting_('DailyUpdateProgress',5) || 5), '保存済みの処理位置から再開しています。' + sbmDailyPhaseLabel_(resumePhase));
      } else {
        sbmClearDailyWork_();
        sbmSetDailyProgress_('FETCH',5,'Search Consoleからデータを取得しています。');
      }
      try { sbmRefreshHome_(); SpreadsheetApp.flush(); } catch(ignore) {}
    }
  } finally {
    lock.releaseLock();
  }
  return sbmContinueDailyUpdate_();
}

// Product 5.4.2との互換用。時間主導トリガーは作成しません。
function sbmDailyUpdateContinuationTrigger() {
  return {ok:false,continuing:false,message:'自動継続トリガーは使用しません。日次処理ダイアログの「続きを実行」を押してください。'};
}

function sbmContinueDailyUpdate_() {
  var lock = LockService.getDocumentLock();
  if (!lock.tryLock(5000)) return {ok:true,continuing:true,message:'別の実行が処理を継続しています。'};
  var started = new Date();
  try {
    if (String(sbmGetSetting_('DailyUpdateRunning','NO')) !== 'YES') return {ok:true,continuing:false,message:'日次処理は実行されていません。'};
    while (sbmSecondsSince_(started) < 250) {
      var phase = String(sbmGetSetting_('DailyUpdatePhase','FETCH') || 'FETCH');
      if (phase === 'FETCH') {
        sbmSetDailyProgress_('FETCH',10,'Search Consoleからページデータを取得しています。');
        var profiler = sbmCreateProfiler_('日次処理 Search Console取得');
        var result = sbmFetchSearchConsolePageRowsForArticleDb_(profiler);
        sbmWriteDailyWorkRows_(result.rows);
        sbmSetSetting_('DailyUpdateRawRows',String(result.rawRows),'日次処理で取得した元行数');
        sbmSetSetting_('DailyUpdateExcluded',String(result.excluded),'日次処理で除外したURL数');
        sbmSetDailyProgress_('MERGE',45,'Search Consoleデータの取得が完了しました。記事管理を更新しています。');
        continue;
      }
      if (phase === 'MERGE') {
        var freshRows = sbmReadDailyWorkRows_();
        var mergeResult = sbmMergeArticleDbDaily_(freshRows);
        sbmSetSetting_('DailyUpdateMergeResult',JSON.stringify(mergeResult),'日次処理の差分更新結果');
        sbmSetDailyProgress_('RECOMMEND',75,'記事管理を更新しました。改善候補と今日の改善を作成しています。');
        continue;
      }
      if (phase === 'RECOMMEND') {
        try { sbmEnsureTodayRecommendations_('daily'); } catch (eToday) { sbmLog_('DailyTodayDefault','Warning',String(eToday)); }
        sbmSetDailyProgress_('FINALIZE',90,'改善候補を更新しました。Homeと完了状態を更新しています。');
        continue;
      }
      if (phase === 'FINALIZE') {
        var completedAt = new Date();
        sbmMarkDailyUpdateCompleted_(completedAt);
        sbmSetSetting_('DailyUpdateRunning','NO','日次処理の実行状態');
        sbmSetSetting_('DailyUpdateContinuationRequired','NO','日次処理の続行操作が必要か');
        sbmSetSetting_('DailyUpdateActionRequired','NO','利用者操作が必要か');
        sbmSetSetting_('DailyUpdateActionMessage','','利用者へ案内する操作内容');
        sbmSetDailyProgress_('DONE',100,'日次処理が完了しました。');
        sbmClearDailyWork_();
        try { sbmRefreshHome_(); SpreadsheetApp.flush(); } catch(eHome) { sbmLog_('DailyHomeRefresh','Warning',String(eHome)); }
        return {ok:true,continuing:false,message:'日次処理が完了しました。'};
      }
      if (phase === 'DONE') return {ok:true,continuing:false,message:'日次処理が完了しました。'};
      throw new Error('不明な日次処理フェーズです: ' + phase);
    }
    sbmSetSetting_('DailyUpdateRunning','NO','日次処理の実行状態');
    sbmSetSetting_('DailyUpdateContinuationRequired','YES','日次処理の続行操作が必要か');
    sbmSetSetting_('DailyUpdateActionRequired','NO','利用者操作が必要か');
    sbmSetSetting_('DailyUpdateActionMessage','安全な実行時間に達したため一時停止しました。処理位置は保存されています。日次処理ダイアログの「続きを実行」を押してください。','利用者へ案内する操作内容');
    sbmSetDailyProgress_(String(sbmGetSetting_('DailyUpdatePhase','FETCH')), Number(sbmGetSetting_('DailyUpdateProgress',0)), '安全な実行時間に達したため一時停止しました。「続きを実行」を押してください。');
    try { sbmRefreshHome_(); SpreadsheetApp.flush(); } catch(ignorePause) {}
    return {ok:true,continuing:false,requiresContinuation:true,message:'「続きを実行」を押してください。'};
  } catch(e) {
    sbmHandleDailyUpdateError_(e);
    throw e;
  } finally {
    lock.releaseLock();
  }
}

function sbmWriteDailyWorkRows_(rows) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var name = '__Daily_Update_Work';
  var sh = ss.getSheetByName(name) || ss.insertSheet(name);
  sh.clearContents();
  var normalized = sbmNormalizeRowsToWidth_(rows || [], SBM_HEADERS.ARTICLE_DB.length);
  sh.getRange(1,1,1,SBM_HEADERS.ARTICLE_DB.length).setValues([SBM_HEADERS.ARTICLE_DB]);
  if (normalized.length) sh.getRange(2,1,normalized.length,SBM_HEADERS.ARTICLE_DB.length).setValues(normalized);
  try { sh.hideSheet(); } catch(ignore) {}
}

function sbmReadDailyWorkRows_() {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('__Daily_Update_Work');
  if (!sh || sh.getLastRow() < 2) return [];
  return sh.getRange(2,1,sh.getLastRow()-1,SBM_HEADERS.ARTICLE_DB.length).getValues();
}

function sbmClearDailyWork_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName('__Daily_Update_Work');
  if (sh) ss.deleteSheet(sh);
}

function sbmHandleDailyUpdateError_(e) {
  var text = String(e && e.message ? e.message : e);
  var action = /authorization|authorize|permission|権限|認証|Search Console|property|プロパティ|access denied|not have access/i.test(text);
  sbmSetSetting_('DailyUpdateRunning','NO','日次処理の実行状態');
  sbmSetSetting_('DailyUpdateContinuationRequired','NO','日次処理の続行操作が必要か');
  sbmSetSetting_('DailyUpdateLastError',text,'直近の日次処理エラー');
  sbmSetSetting_('DailyUpdateActionRequired',action ? 'YES' : 'NO','利用者操作が必要か');
  sbmSetSetting_('DailyUpdateActionMessage',action ? 'Search Consoleへの接続または認証を確認してください。管理メニューの「接続テスト」を実行し、完了後に日次処理を再実行してください。' : '','利用者へ案内する操作内容');
  sbmSetDailyProgress_('ERROR',0,action ? '利用者の確認が必要です。' : '日次処理でエラーが発生しました。');
  try { sbmRefreshHome_(); SpreadsheetApp.flush(); } catch(ignore) {}
  try { sbmLog_('DailyUpdate','Error',text); } catch(ignore2) {}
}

function sbmRunDailyUpdateManual() { return sbmOpenDailyUpdateDialog(); }
function sbmMaybePromptDailyUpdate_() { return false; }
function sbmSkipDailyUpdateToday() { return true; }
function sbmRunDailyUpdateFromStartup() { return sbmOpenDailyUpdateDialog(); }
function sbmRunArticleDbUpdateFromStartup() { return sbmOpenDailyUpdateDialog(); }

function sbmShowNewArticleInfoPrompt_(count) {
  count = Number(count || 0);
  if (!count) return;
  var html = '<!DOCTYPE html><html><head><base target="_top"><style>body{font-family:Arial,"Noto Sans JP",sans-serif;padding:22px;color:#202124}h2{color:#0b8043;margin-top:0}.buttons{display:flex;gap:10px;justify-content:flex-end;margin-top:20px}button{border:0;border-radius:6px;padding:10px 16px;font-weight:700;cursor:pointer}.run{background:#1a73e8;color:#fff}.later{background:#f1f3f4;color:#3c4043}</style></head><body><h2>新規記事が ' + count + '件見つかりました</h2><p>記事タイトル・SEOタイトル・メタディスクリプション・メインクエリを取得しますか？</p><div class="buttons"><button class="later" onclick="google.script.host.close()">あとで</button><button class="run" onclick="runNow()">記事情報を取得</button></div><script>function runNow(){document.querySelectorAll("button").forEach(function(b){b.disabled=true});google.script.run.withFailureHandler(function(e){alert((e&&e.message)?e.message:String(e))}).withSuccessHandler(function(){google.script.host.close()}).sbmSupplementNewArticlesManual()}</script></body></html>';
  SpreadsheetApp.getUi().showModalDialog(sbmEnsureCloseButton_(HtmlService.createHtmlOutput(html).setWidth(520).setHeight(250)), '新規記事の記事情報取得');
}

function sbmSupplementNewArticlesManual() {
  var sh = sbmGetOrCreateSheet_(SBM_SHEETS.ARTICLE_DB);
  var rows = sbmRowsAsObjects_(SBM_SHEETS.ARTICLE_DB);
  var batch = sbmGetArticleInfoBatch_();
  var started = new Date();
  var processed = 0, success = 0;
  for (var i=0; i<rows.length; i++) {
    if (processed >= batch || sbmSecondsSince_(started) >= 280) break;
    var r = rows[i];
    if (String(r['管理フラグ'] || '') !== '新規記事') continue;
    var url = sbmNormalizeUrl_(r['記事URL'] || '');
    if (!url) continue;
    processed++;
    var meta = sbmFetchArticleMetaInfo_(url) || {};
    var query = sbmFetchMainQueryForUrl_(url) || '';
    var title = sbmCleanDataListText_(meta.h1 || meta.titleTag || '',url);
    var seo = sbmCleanDataListText_(meta.titleTag || '',url);
    var desc = sbmCleanDataListText_(meta.metaDescription || '',url);
    var ok = !!(title || seo || desc || query);
    sbmSetObjectValues_(sh,r._rowNumber,{'記事タイトル':title,'SEOタイトル':seo,'メタディスクリプション':desc,'メインクエリ':query,'記事情報補完済み':ok?'○':'エラー','補完日時':sbmNowText_(),'補完エラー':ok?'':'記事情報を取得できませんでした','管理フラグ':ok?'正常':'新規記事'});
    if (ok) success++;
  }
  sbmRefreshHome_();
  sbmAlert_('新規記事の情報取得','今回 ' + processed + '件を処理し、' + success + '件の情報を取得しました。');
  return {processed:processed,success:success};
}

function sbmLightStartup_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss.getSheetByName(SBM_SHEETS.HOME)) {
    sbmInitializeSheets(false);
    return;
  }
  sbmRefreshHome_();
  if (sbmIsSetupComplete_() && sbmGetSetting_('ConnectionStatus','') === 'OK') {
    var today = sbmDateText_(new Date());
    var last = String(sbmGetSetting_('LastFetchDate',''));
    var once = String(sbmGetSetting_('OncePerDay','ON'));
    if (once === 'ON' && last !== today) {
      var ui = SpreadsheetApp.getUi();
      var res = ui.alert('本日のデータ取得', '本日はまだSearch Consoleデータを取得していません。\nデータ取得だけ実行しますか？', ui.ButtonSet.YES_NO);
      if (res === ui.Button.YES) sbmFetchOnlyManual();
    }
  }
}


function sbmIsSetupComplete_() {
  return String(sbmGetSetting_('SetupBlogInfo','NO')) === 'YES';
}



/** シート作成・修復後の案内画面。実施内容と次の操作を一画面で案内します。 */

/** 修復完了画面で選ばれた次の操作を実行します。 */

// 旧呼び出し名との互換性を維持します。
function sbmHandleRepairNextAction_(action) { return sbmHandleRepairNextAction(action); }

/** 日常画面へ移動した際、必要時だけ開く管理シートを再び隠します。 */
function sbmHideOptionalAdminSheets_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  [SBM_SHEETS.USER_SETTINGS, SBM_SHEETS.PROCESS_LOG].forEach(function(name){
    var sh = ss.getSheetByName(name);
    if (sh && ss.getActiveSheet().getName() !== name) { try { sh.hideSheet(); } catch(e) {} }
  });
}

function sbmEnsureDataSheets_() {
  // Product 5.1 Official: 現行運用に必要なシートだけを作成・修復します。
  sbmMigrateVisibleSheetNames_();
  sbmMigrateArticleDbRankWorkState_();
  var dataMap = {
    SETTINGS: SBM_SHEETS.SETTINGS,
    SYSTEM_LOG: SBM_SHEETS.SYSTEM_LOG,
    ARTICLE_DB: SBM_SHEETS.ARTICLE_DB,
    TODAY: SBM_SHEETS.TODAY,
    LOG: SBM_SHEETS.LOG,
    PROCESS_LOG: SBM_SHEETS.PROCESS_LOG,
    FEEDBACK_HISTORY: SBM_SHEETS.FEEDBACK_HISTORY
  };
  Object.keys(dataMap).forEach(function(k){
    var sheet = sbmGetOrCreateSheet_(dataMap[k]);
    sbmEnsureHeaders_(sheet, SBM_HEADERS[k]);
    sbmStyleDataSheet_(sheet);
  });
  sbmRemoveRetiredSheets_();
}


/**
 * 旧「記事ステータス」中心の記事DBを、記事ランク＋作業状態へ安全に移行します。
 * 既存のタイトル・クエリ・補完情報・ArticleIDは保持します。
 */
function sbmMigrateArticleDbRankWorkState_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SBM_SHEETS.ARTICLE_DB);
  if (!sh || sh.getLastRow() < 1) return;
  var oldHeaders = sh.getRange(1,1,1,Math.max(1,sh.getLastColumn())).getValues()[0].map(function(v){return String(v||'').trim();});
  if (!oldHeaders.length) return;
  var expected = SBM_HEADERS.ARTICLE_DB.slice();
  var same = oldHeaders.length >= expected.length && expected.every(function(h,i){ return oldHeaders[i] === h; });
  if (same) return;
  var values = sh.getLastRow() > 1 ? sh.getRange(2,1,sh.getLastRow()-1,oldHeaders.length).getValues() : [];
  var objects = values.map(function(row){
    var o = {};
    oldHeaders.forEach(function(h,i){ if (h) o[h] = row[i]; });
    var legacy = o['記事ステータス'] || o['状態'] || '';
    if (!o['記事ランク']) o['記事ランク'] = sbmLegacyStatusToRank_(legacy);
    if (!o['作業状態']) o['作業状態'] = sbmLegacyStatusToWorkState_(legacy);
    if (!o['詳細']) o['詳細'] = '記事詳細';
    o['記事ステータス'] = legacy;
    return o;
  });
  sh.clear();
  sh.getRange(1,1,1,expected.length).setValues([expected]);
  if (objects.length) {
    var out = objects.map(function(o){ return expected.map(function(h){ return o[h] !== undefined ? o[h] : ''; }); });
    sh.getRange(2,1,out.length,expected.length).setValues(out);
  }
  sbmStyleArticleDbSheet_(sh);
}

function sbmMigrateVisibleSheetNames_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var pairs = [['ホーム', SBM_SHEETS.HOME], ['クエリデータ', SBM_SHEETS.QUERY_DATA], ['記事診断', SBM_SHEETS.DIAGNOSIS]];
  pairs.forEach(function(pair){
    var oldSh = ss.getSheetByName(pair[0]);
    var newSh = ss.getSheetByName(pair[1]);
    if (oldSh && !newSh) { try { oldSh.setName(pair[1]); } catch(e) {} }
  });
}

function sbmRemoveRetiredSheets_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var keep = {};
  [SBM_SHEETS.HOME, SBM_SHEETS.ARTICLE_DB, SBM_SHEETS.TODAY, SBM_SHEETS.PROCESS_LOG, SBM_SHEETS.PROFILE_LOG, SBM_SHEETS.SETUP, SBM_SHEETS.LOG, SBM_SHEETS.SETTINGS, SBM_SHEETS.USER_SETTINGS, SBM_SHEETS.SYSTEM_LOG].forEach(function(n){ keep[n] = true; });
  var retired = ['上位ページ診断','カニバリ診断','記事ネタ候補','記事カルテ','ホーム','クエリデータ','記事診断','データ一覧','SearchConsole_Data','改善ブリーフ','ブログ診断','改善中'];
  retired.forEach(function(n){
    var sh = ss.getSheetByName(n);
    if (sh && !keep[n] && ss.getSheets().length > 1) { try { ss.deleteSheet(sh); } catch(e) {} }
  });
}


function sbmMigrateRc3Headers_() {
  // 既存シートを作り直さずに、測定日カラム名だけRC3仕様へ寄せます。
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SBM_SHEETS.LOG);
  if (sh && sh.getLastRow() >= 1) {
    var map = sbmHeaderMap_(sh);
    if (map['14日測定日']) sh.getRange(1, map['14日測定日']).setValue('初回測定日');
    if (map['30日測定日']) sh.getRange(1, map['30日測定日']).setValue('7日測定完了日');
  }
}

function sbmEnsureDefaultSettings_() {
  sbmSetSettingIfEmpty_('Version', SBM_VERSION, 'システムバージョン');
  sbmSetSettingIfEmpty_('BlogName', '', '管理するブログ名');
  sbmSetSettingIfEmpty_('BlogUrl', '', 'ブログのトップページURL');
  sbmSetSettingIfEmpty_('SiteID', '', 'SIMS製品間でサイトを識別するID');
  sbmSetSettingIfEmpty_('SiteName', '', 'SIMS製品間で表示するサイト名');
  sbmSetSettingIfEmpty_('BlogTotalArticleCount', '', 'ブログ総記事数。Search Consoleでは取得できない記事を含めたい場合は手入力');
  sbmSetSettingIfEmpty_('SearchConsoleProperty', '', 'URLプレフィックス例: https://example.com/ または sc-domain:example.com');
  sbmSetSettingIfEmpty_('SetupBlogInfo', 'NO', 'STEP1完了状態');
  sbmSetSettingIfEmpty_('SetupApiGuide', 'NO', 'STEP2完了状態');
  sbmSetSettingIfEmpty_('ConnectionStatus', '未確認', 'STEP3接続状態');
  sbmSetSettingIfEmpty_('SetupInitialFetch', 'NO', 'STEP4完了状態');
  sbmSetSettingIfEmpty_('ManagedRatio', SBM_DEFAULTS.MANAGED_RATIO, '管理対象割合');
  sbmSetSettingIfEmpty_('DailyMinutes', SBM_DEFAULTS.DAILY_MINUTES, '今日の改善時間');
  sbmSetSettingIfEmpty_('QueueLimit', SBM_DEFAULTS.TODAY_INITIAL_DISPLAY, '今日の改善の初期表示件数');
  sbmSetSettingIfEmpty_('TodayInitialDisplayCount', SBM_DEFAULTS.TODAY_INITIAL_DISPLAY, '今日の改善の初期表示件数');
  sbmSetSettingIfEmpty_('TodayMaxDisplayCount', SBM_DEFAULTS.TODAY_MAX_DISPLAY, '今日の改善の最大表示件数');
  sbmSetSettingIfEmpty_('TodayDisplayMode', 'TOP5', '今日の改善表示モード。TOP5 または ALL');
  sbmSetSettingIfEmpty_('RelatedQueries', SBM_DEFAULTS.RELATED_QUERIES, '改善ブリーフ用クエリ件数。Product 5.0では最大50件を分類');
  sbmSetSettingIfEmpty_('MinImpressions', SBM_DEFAULTS.MIN_IMPRESSIONS, '最低表示回数');
  sbmSetSettingIfEmpty_('MinClicks', SBM_DEFAULTS.MIN_CLICKS, '最低クリック数');
  sbmSetSettingIfEmpty_('SearchDays', SBM_DEFAULTS.SEARCH_DAYS, 'Search Console取得日数');
  sbmSetSettingIfEmpty_('OncePerDay', 'ON', '1日1回取得制限');
  sbmSetSettingIfEmpty_('LastFetchDate', '', '最終取得日（互換用）');
  sbmSetSettingIfEmpty_('LastSuccessfulDailyUpdateEpoch', '', '日次処理が最後まで正常終了した日時（Unixミリ秒）');
  sbmSetSettingIfEmpty_('DailyUpdateRunning', 'NO', '日次処理の実行状態');
  sbmSetSettingIfEmpty_('DailyUpdateStartedEpoch', '', '日次処理の開始日時（Unixミリ秒）');
  sbmSetSettingIfEmpty_('DailyUpdateLastError', '', '直近の日次処理エラー');
  sbmSetSettingIfEmpty_('DailyUpdatePhase', '', '日次処理の現在フェーズ');
  sbmSetSettingIfEmpty_('DailyUpdateProgress', '0', '日次処理の進捗率');
  sbmSetSettingIfEmpty_('DailyUpdateMessage', '', '日次処理の進捗メッセージ');
  sbmSetSettingIfEmpty_('DailyUpdateHeartbeatEpoch', '', '日次処理の最終進捗更新日時（Unixミリ秒）');
  sbmSetSettingIfEmpty_('DailyUpdateActionRequired', 'NO', '利用者操作が必要か');
  sbmSetSettingIfEmpty_('DailyUpdateActionMessage', '', '利用者へ案内する操作内容');
  sbmSetSettingIfEmpty_('AnalysisCandidateLimit', SBM_DEFAULTS.ANALYSIS_CANDIDATE_LIMIT, '分析後に保存する改善候補数。Product 5.1 Officialでは10件で打ち切り');
  if ((sbmNumber_(sbmGetSetting_('AnalysisCandidateLimit','0')) || 0) !== SBM_DEFAULTS.ANALYSIS_CANDIDATE_LIMIT) sbmSetSetting_('AnalysisCandidateLimit', SBM_DEFAULTS.ANALYSIS_CANDIDATE_LIMIT, 'Product 5.1 Official: STEP Bは改善候補10件で打ち切り');
  sbmSetSettingIfEmpty_('AnalysisArticleLimit', SBM_DEFAULTS.ANALYSIS_ARTICLE_LIMIT, 'STEP Bで実際に重い分析を行う最大記事数。タイムアウト対策用');
  sbmSetSettingIfEmpty_('FetchArticleTitles', SBM_DEFAULTS.TITLE_FETCH_DEFAULT, '記事タイトル取得を外部アクセスで行うか。データ一覧のH1/titleタグ表示に使用');
  sbmSetSettingIfEmpty_('DataListTitleFetch', 'OFF', 'STEP Bでは外部取得しない。タイトル補完はSTEP Aで行う');
  sbmSetSettingIfEmpty_('MetaFetchMaxRows', SBM_DEFAULTS.META_FETCH_MAX_ROWS, 'STEP A-2で記事タイトル/SEOタイトル/meta descriptionを補完する最大URL数。標準30URL');
  sbmSetSettingIfEmpty_('LastFetchRows', '0', '直近のSearch Console取得行数');
  sbmSetSettingIfEmpty_('DailyFetchMaxRows', SBM_DEFAULTS.DAILY_FETCH_MAX_ROWS, '従来方式のSTEP A取得上限。通常1500件');
  sbmSetSettingIfEmpty_('FetchMode', 'PAGE_FIRST', 'Search Console取得方式。PAGE_FIRST=ページ一覧優先、QUERY_PAGE=従来方式');
  sbmSetSettingIfEmpty_('PageFetchMaxRows', SBM_DEFAULTS.PAGE_FETCH_MAX_ROWS, 'STEP Aでページ一覧を取得する最大行数。大規模サイト向け');
  sbmSetSettingIfEmpty_('PageDataMaxRows', SBM_DEFAULTS.PAGE_FETCH_MAX_ROWS, 'ページデータ収集（記事DB）でSearch Consoleから取得する最大page行数');
  sbmSetSettingIfEmpty_('QueryFetchPageLimit', SBM_DEFAULTS.QUERY_FETCH_PAGE_LIMIT, 'クエリ詳細を取得するページ数。標準50記事');
  sbmSetSettingIfEmpty_('ManagedArticleCount', '0', '直近の管理対象記事数');
  sbmSetSettingIfEmpty_('ImprovementCandidateCount', '0', '直近の改善候補数');
  sbmSetSettingIfEmpty_('DisplayedImprovementCount', '0', '今日の改善に表示している件数');
  sbmSetSettingIfEmpty_('ArticleDbBuildBatch', SBM_DEFAULTS.ARTICLE_DB_BUILD_BATCH, '初回記事DB構築の1回あたり取得件数');
  sbmSetSettingIfEmpty_('ArticleDbBuildStartRow', '0', '初回記事DB構築のSearch Console取得開始位置');
  sbmSetSettingIfEmpty_('ArticleDbUrlBuildStatus', '未開始', '記事URL収集の状態');
  sbmSetSettingIfEmpty_('ArticleDbUrlBuildComplete', 'NO', '記事URL収集完了フラグ');
  sbmSetSettingIfEmpty_('ArticleInfoBatch', SBM_DEFAULTS.ARTICLE_INFO_BATCH, '記事情報補完の1回あたり件数。設定シートで30～100件の範囲で指定');
  sbmSetSettingIfEmpty_('ArticleInfoBuildStatus', '未開始', '記事情報補完の状態');
  sbmSetSettingIfEmpty_('ArticleInfoBuildComplete', 'NO', '記事情報補完完了フラグ');
}

function sbmEnsureUserSheets_() {
  // 記事DB直結版で使用する現行シートだけを作成します。
  // 今日の改善は記事DB直結版。旧改善ブリーフと旧ブログ診断は生成しません。
  sbmBuildHomeSheet_();
  sbmBuildUserSettingsSheet_();
  sbmBuildSetupSheet_();
  sbmBuildTodayImprovementSheet_();
  sbmBuildInProgressSheet_();
  sbmStyleProcessLogSheet_(sbmGetOrCreateSheet_(SBM_SHEETS.PROCESS_LOG));
  sbmApplyProductVisibleTabs_();
}


function sbmBuildUserSettingsSheet_() {
  var sh = sbmGetOrCreateSheet_(SBM_SHEETS.USER_SETTINGS);
  var previous = {};
  try {
    var oldValues = sh.getLastRow() >= 2 ? sh.getRange(2,1,sh.getLastRow()-1,2).getValues() : [];
    oldValues.forEach(function(r){ if (r[0] !== '') previous[String(r[0])] = r[1]; });
  } catch(e) {}

  function validInt_(value, min, max, fallback) {
    var n = sbmNumber_(value);
    return Number.isFinite(n) && Math.floor(n) === n && n >= min && n <= max ? n : fallback;
  }

  var articleBatch = validInt_(previous['記事情報補完件数'], 30, 100,
    validInt_(sbmGetSetting_('ArticleInfoBatch', SBM_DEFAULTS.ARTICLE_INFO_BATCH), 30, 100, SBM_DEFAULTS.ARTICLE_INFO_BATCH));
  var todayInitial = validInt_(previous['今日の改善初期表示件数'], 1, 6,
    validInt_(sbmGetSetting_('TodayInitialDisplayCount', SBM_DEFAULTS.TODAY_INITIAL_DISPLAY), 1, 6, SBM_DEFAULTS.TODAY_INITIAL_DISPLAY));
  var todayMax = validInt_(previous['今日の改善最大表示件数'], 2, 6,
    validInt_(sbmGetSetting_('TodayMaxDisplayCount', SBM_DEFAULTS.TODAY_MAX_DISPLAY), 2, 6, SBM_DEFAULTS.TODAY_MAX_DISPLAY));
  if (todayMax < todayInitial) todayMax = Math.max(todayInitial, SBM_DEFAULTS.TODAY_MAX_DISPLAY);
  var candidateLimit = validInt_(previous['改善候補抽出件数'], 10, 10,
    validInt_(sbmGetSetting_('AnalysisCandidateLimit', SBM_DEFAULTS.ANALYSIS_CANDIDATE_LIMIT), 10, 10, SBM_DEFAULTS.ANALYSIS_CANDIDATE_LIMIT));
  var searchDays = validInt_(previous['Search Console取得期間（日）'], 7, 365,
    validInt_(sbmGetSetting_('SearchDays', SBM_DEFAULTS.SEARCH_DAYS), 7, 365, SBM_DEFAULTS.SEARCH_DAYS));

  sh.clear();
  sh.getRange(1,1,6,3).setValues([
    SBM_HEADERS.USER_SETTINGS,
    ['記事情報補完件数', articleBatch, '初回セットアップで1回に補完する記事数。30～100の整数（推奨50件）'],
    ['今日の改善初期表示件数', todayInitial, '今日の改善を開いたときに最初に表示する件数。1～6の整数（推奨2件）'],
    ['今日の改善最大表示件数', todayMax, '「次のおすすめ」で追加表示できる上限。2～6の整数（正式上限6件）'],
    ['改善候補抽出件数', candidateLimit, '記事DBから保持する改善候補数。Product 5.1 Officialでは10件固定'],
    ['Search Console取得期間（日）', searchDays, 'ページ指標を集計する期間。7～365日の整数（推奨90日）']
  ]);

  function intRule_(min, max) {
    return SpreadsheetApp.newDataValidation()
      .requireNumberBetween(min, max)
      .setAllowInvalid(false)
      .setHelpText(min + '～' + max + 'の整数を入力してください。')
      .build();
  }
  sh.getRange('B2').setDataValidation(intRule_(30,100));
  sh.getRange('B3').setDataValidation(intRule_(1,6));
  sh.getRange('B4').setDataValidation(intRule_(2,20));
  sh.getRange('B5').setDataValidation(intRule_(10,200));
  sh.getRange('B6').setDataValidation(intRule_(7,365));
  sh.getRange('B2:B6').setNumberFormat('0');
  sh.setFrozenRows(1);
  sh.setColumnWidth(1, 250);
  sh.setColumnWidth(2, 120);
  sh.setColumnWidth(3, 650);
  sh.getRange('A1:C1').setBackground('#0b8043').setFontColor('#ffffff').setFontWeight('bold');
  sh.getRange('A1:C6').setBorder(true,true,true,true,true,true).setVerticalAlignment('middle').setWrap(true);
  sh.getRange('B2:B6').setBackground('#fff2cc').setFontWeight('bold').setHorizontalAlignment('center');

  sbmSetSetting_('ArticleInfoBatch', articleBatch, '記事情報補完の1回あたり件数。30～100');
  sbmSetSetting_('TodayInitialDisplayCount', todayInitial, '今日の改善の初期表示件数');
  sbmSetSetting_('QueueLimit', todayInitial, '既存の今日の改善表示件数と同期');
  sbmSetSetting_('TodayMaxDisplayCount', todayMax, '今日の改善の最大表示件数');
  sbmSetSetting_('AnalysisCandidateLimit', candidateLimit, '改善候補抽出件数');
  sbmSetSetting_('SearchDays', searchDays, 'Search Console取得期間（日）');
}
function sbmOpenUserSettings() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SBM_SHEETS.USER_SETTINGS);
  if (!sh) { sbmBuildUserSettingsSheet_(); sh = ss.getSheetByName(SBM_SHEETS.USER_SETTINGS); }
  if (sh) { sh.showSheet(); ss.setActiveSheet(sh); sh.activate(); }
}

function sbmGetArticleInfoBatch_() {
  var n = 0;
  try {
    var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SBM_SHEETS.USER_SETTINGS);
    if (sh) n = sbmNumber_(sh.getRange('B2').getValue()) || 0;
  } catch(e) {}
  if (!Number.isFinite(n) || Math.floor(n) !== n || n < 30 || n > 100) {
    n = sbmNumber_(sbmGetSetting_('ArticleInfoBatch', SBM_DEFAULTS.ARTICLE_INFO_BATCH)) || SBM_DEFAULTS.ARTICLE_INFO_BATCH;
  }
  if (!Number.isFinite(n) || Math.floor(n) !== n || n < 30 || n > 100) n = SBM_DEFAULTS.ARTICLE_INFO_BATCH;
  sbmSetSetting_('ArticleInfoBatch', n, '記事情報補完の1回あたり件数。30～100');
  return n;
}

function sbmGetTodayInitialDisplayCount_() {
  var n = sbmNumber_(sbmGetSetting_('TodayInitialDisplayCount', SBM_DEFAULTS.TODAY_INITIAL_DISPLAY)) || SBM_DEFAULTS.TODAY_INITIAL_DISPLAY;
  return Math.max(1, Math.min(6, Math.floor(n)));
}

function sbmGetTodayMaxDisplayCount_() {
  var initial = sbmGetTodayInitialDisplayCount_();
  var n = sbmNumber_(sbmGetSetting_('TodayMaxDisplayCount', SBM_DEFAULTS.TODAY_MAX_DISPLAY)) || SBM_DEFAULTS.TODAY_MAX_DISPLAY;
  return Math.max(initial, Math.min(6, Math.floor(n)));
}
function sbmBuildHomeSheet_() {
  var sh = sbmGetOrCreateSheet_(SBM_SHEETS.HOME);
  sh.clear();
  if (sh.getMaxRows() < 24) sh.insertRowsAfter(sh.getMaxRows(), 24 - sh.getMaxRows());

  sh.getRange('A1:G1').merge().setValue('SIMS-Blog-Manager  Home');
  sh.getRange('H1').setValue('v' + SBM_VERSION);
  sh.getRange('A2').setValue('ブログ名'); sh.getRange('B2:D2').merge();
  sh.getRange('E2').setValue('最終更新'); sh.getRange('F2:H2').merge();
  sh.getRange('A3').setValue('総記事数'); sh.getRange('B3').setValue('0件');
  sh.getRange('C3').setValue('ブログURL'); sh.getRange('D3:H3').merge();
  sh.getRange('A4').setValue('日次処理'); sh.getRange('B4:H4').merge().setValue('未実施');

  sh.getRange('A5:H5').merge().setValue('記事ランクのまとめ');
  sh.getRange('A6:B6').merge().setValue('🏆 エース'); sh.getRange('C6:D6').merge().setValue('0件 →');
  sh.getRange('E6:F6').merge().setValue('🌱 育成'); sh.getRange('G6:H6').merge().setValue('0件 →');
  sh.getRange('A7:B7').merge().setValue('✅ 安定'); sh.getRange('C7:D7').merge().setValue('0件 →');
  sh.getRange('E7:F7').merge().setValue('⚠️ 迷走'); sh.getRange('G7:H7').merge().setValue('0件 →');
  sh.getRange('A8:B8').merge().setValue('📈 成長'); sh.getRange('C8:D8').merge().setValue('0件 →');
  sh.getRange('E8:F8').merge().setValue('❓ 未取得'); sh.getRange('G8:H8').merge().setValue('0件 →');

  sh.getRange('A10:H10').merge().setValue('今日のメッセージ');
  sh.getRange('A11:H12').merge().setValue('記事の育ち方と改善状況に合わせて表示します。');

  sh.getRange('A14:D14').merge().setValue('改善状況');
  sh.getRange('E14:H14').merge().setValue('今週の取り組み');
  var left = [['今日の改善','0件'],['改善中','0件'],['改善推移確認中','0件'],['未取得記事','0件']];
  var right = [['今週改善した記事','0件'],['改善推移確認中','0件'],['改善確認完了','0件'],['改善候補','0件']];
  for (var i=0;i<4;i++) {
    var r=15+i;
    sh.getRange(r,1,1,2).merge().setValue(left[i][0]); sh.getRange(r,3,1,2).merge().setValue(left[i][1]);
    sh.getRange(r,5,1,2).merge().setValue(right[i][0]); sh.getRange(r,7,1,2).merge().setValue(right[i][1]);
  }

  sh.getRange('A19:H20').merge().setValue('※未取得記事：Search Consoleから一時的にデータを取得できなかった記事などです。記事が削除されたことを意味するものではありません。');

  sh.getRange('A22:H22').merge().setValue('今週のアドバイス');
  sh.getRange('A23:H24').merge().setValue('今週の取り組みに合わせて、次の作業を案内します。');

  sh.setFrozenRows(3);
  [120,120,120,120,120,120,120,120].forEach(function(w,i){ sh.setColumnWidth(i+1,w); });
  sh.setRowHeights(1,24,24); sh.setRowHeights(11,2,28); sh.setRowHeights(19,2,22); sh.setRowHeights(23,2,28);
  sh.getRange('A1:H24').setFontFamily('Arial').setVerticalAlignment('middle').setWrap(true);
  sh.getRange('A1:G1').setBackground('#0b8043').setFontColor('#ffffff').setFontWeight('bold').setFontSize(16);
  sh.getRange('H1').setBackground('#0b8043').setFontColor('#d9ead3').setHorizontalAlignment('right');
  sh.getRange('A2:H4').setBackground('#f8f9fa').setBorder(true,true,true,true,true,true,'#dadce0',SpreadsheetApp.BorderStyle.SOLID);
  sh.getRange('A4').setFontWeight('bold'); sh.getRange('B4:H4').setFontWeight('bold');
  sh.getRange('A5:H5').setBackground('#e6f4ea').setFontWeight('bold');
  sh.getRange('A6:H8').setBorder(true,true,true,true,true,true,'#dadce0',SpreadsheetApp.BorderStyle.SOLID).setHorizontalAlignment('center').setFontWeight('bold');
  sh.getRange('A6:D8').setBackground('#f3f8f3'); sh.getRange('E6:H8').setBackground('#fff8e8');
  sh.getRange('A10:H10').setBackground('#dbeafe').setFontWeight('bold');
  sh.getRange('A11:H12').setBackground('#f8fbff').setBorder(true,true,true,true,false,false,'#cbdcf0',SpreadsheetApp.BorderStyle.SOLID).setFontSize(12).setFontWeight('normal');
  sh.getRange('A14:D14').setBackground('#f1f3f4').setFontWeight('bold');
  sh.getRange('E14:H14').setBackground('#e6f4ea').setFontWeight('bold');
  sh.getRange('A15:H18').setBorder(true,true,true,true,true,true,'#dadce0',SpreadsheetApp.BorderStyle.SOLID);
  sh.getRange('A15:B18').setFontWeight('bold'); sh.getRange('E15:F18').setFontWeight('bold');
  sh.getRange('C15:D18').setHorizontalAlignment('center').setFontWeight('bold').setFontSize(15);
  sh.getRange('G15:H18').setHorizontalAlignment('center').setFontWeight('bold').setFontSize(15);
  sh.getRange('A19:H20').setFontSize(9).setFontColor('#5f6368').setBackground('#ffffff').setFontWeight('normal').setHorizontalAlignment('right');
  sh.getRange('A22:H22').setBackground('#fce8b2').setFontWeight('bold');
  sh.getRange('A23:H24').setBackground('#fffaf0').setBorder(true,true,true,true,false,false,'#e6cf8b',SpreadsheetApp.BorderStyle.SOLID).setFontSize(12).setFontWeight('normal');
  sh.getRangeList(['A2','A3']).setFontWeight('bold');
  try { sh.getRange('J:M').clearContent(); sh.showColumns(10,4); } catch(e) {}
}

function sbmBuildSetupSheet_() {
  var sh = sbmGetOrCreateSheet_(SBM_SHEETS.SETUP);
  sh.clear();
  var rows = [
    ['セットアップ', 'この順番で進めてください'],
    ['STEP1', 'ブログ名・ブログURL・Search Consoleプロパティをポップアップで登録します。'],
    ['STEP2', 'Google CloudでSearch Console APIを有効化します。ガイド画面のリンクをクリックします。'],
    ['STEP3', 'Search Console接続テストを行います。成功すると日次取得が有効になります。'],
    ['STEP4', 'Search Consoleからページ単位で最大25,000件を一括取得し、URL正規化後に記事DBを作成します。'],
    ['STEP5', '設定シートで指定した件数ずつ記事情報を補完します。完了画面から続けて処理するか、ここで終了するか選べます。'],
    ['', ''],
    ['初回認証', 'Googleの承認画面が表示されたら許可してください。承認後、同じSTEPをもう一度実行します。'],
    ['注意', '外部URLを開いた後は処理がそこで止まります。Google Cloudで設定後、スプレッドシートに戻って次のSTEPを実行してください。']
  ];
  sh.getRange(1,1,rows.length,2).setValues(rows);
  sh.setColumnWidths(1,1,160);
  sh.setColumnWidths(2,1,760);
  sbmStyleUserSheet_(sh, '#fbbc04');
}

function sbmBuildTodaySheetView_() { sbmBuildTodayImprovementSheet_(); }
function sbmBuildBriefSheetView_() { sbmStyleBriefSheet_(sbmGetOrCreateSheet_(SBM_SHEETS.BRIEF)); }
function sbmBuildLogSheetView_() { sbmStyleLogSheet_(sbmGetOrCreateSheet_(SBM_SHEETS.LOG)); }
function sbmBuildEffectSheetView_() { sbmStyleEffectSheet_(sbmGetOrCreateSheet_(SBM_SHEETS.EFFECT)); }
function sbmBuildInProgressSheetView_() { sbmBuildInProgressSheet_(); }
function sbmBuildCannibalSheetView_() { sbmRemoveRetiredSheets_(); }

function sbmSiteIdFromUrl_(url) {
  var text = String(url || '').trim();
  try {
    var host = new URL(text).hostname.toLowerCase().replace(/^www\./, '');
    var first = host.split('.')[0] || 'site';
    var id = first.replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
    return id || 'site';
  } catch (e) {
    return text.toLowerCase().replace(/^https?:\/\//,'').split('/')[0].split('.')[0].replace(/[^a-z0-9-]+/g,'-').replace(/^-+|-+$/g,'') || 'site';
  }
}

function sbmEnsureSiteIdentity_() {
  var blogUrl = String(sbmGetSetting_('BlogUrl','') || '').trim();
  var blogName = String(sbmGetSetting_('BlogName','') || '').trim();
  var siteId = String(sbmGetSetting_('SiteID','') || '').trim();
  var siteName = String(sbmGetSetting_('SiteName','') || '').trim();
  if (!siteId && blogUrl) {
    siteId = sbmSiteIdFromUrl_(blogUrl);
    sbmSetSetting_('SiteID', siteId, 'SIMS製品間でサイトを識別するID');
  }
  if (!siteName && blogName) {
    siteName = blogName;
    sbmSetSetting_('SiteName', siteName, 'SIMS製品間で表示するサイト名');
  }
  return {siteId:siteId, siteName:siteName, siteUrl:blogUrl, blogUrl:blogUrl};
}

function sbmSetupStep1BlogInfo() {
  sbmInitializeSheets(false);
  var ui = SpreadsheetApp.getUi();
  sbmAlert_('STEP1 ブログ情報', 'ブログ名、ブログURL、Search Consoleプロパティを登録します。\n\n初回のみGoogleの承認画面が出ることがあります。承認後に止まった場合は、このSTEP1をもう一度実行してください。');

  var blogName = sbmPromptRequired_('ブログ名を入力', '管理するブログ名を入力してください。\n例：人生いろいろ', sbmGetSetting_('BlogName',''));
  if (blogName === null) return;
  var blogUrl = sbmPromptRequired_('ブログURLを入力', 'ブログのトップページURLを入力してください。\n例：https://example.com/', sbmGetSetting_('BlogUrl',''));
  if (blogUrl === null) return;
  var propertyDefault = sbmGetSetting_('SearchConsoleProperty','') || blogUrl;
  var property = sbmPromptRequired_('Search Consoleプロパティを入力', 'Search Consoleのプロパティを入力してください。\nURLプレフィックス例：https://example.com/\nドメイン例：sc-domain:example.com', propertyDefault);
  if (property === null) return;

  sbmSetSetting_('BlogName', blogName, '管理するブログ名');
  sbmSetSetting_('BlogUrl', blogUrl, 'ブログURL');
  sbmSetSetting_('SiteID', sbmGetSetting_('SiteID','') || sbmSiteIdFromUrl_(blogUrl), 'SIMS製品間でサイトを識別するID');
  sbmSetSetting_('SiteName', blogName, 'SIMS製品間で表示するサイト名');
  sbmSetSetting_('SearchConsoleProperty', property, 'Search Console property');
  sbmSetSetting_('SetupBlogInfo', 'YES', 'STEP1完了状態');
  sbmLog_('SetupStep1BlogInfo','Done',blogName + ' / ' + property);
  sbmRefreshHome_();
  sbmAlert_('STEP1完了', 'ブログ情報を登録しました。\n\n次は「STEP2 Google Cloud APIガイドを開く」を実行してください。');
}

function sbmSetupStep2ApiGuide() {
  sbmInitializeSheets(false);
  if (sbmGetSetting_('SetupBlogInfo','NO') !== 'YES') return sbmAlert_('STEP1が未完了です', '先にSTEP1でブログ情報を登録してください。');
  var ui = SpreadsheetApp.getUi();
  try {
    var html = HtmlService.createHtmlOutput(sbmApiGuideHtml_()).setWidth(700).setHeight(540);
    ui.showModalDialog(sbmEnsureCloseButton_(html), 'STEP2 Google Cloud API有効化ガイド');
    sbmSetSetting_('SetupApiGuide', 'YES', 'STEP2ガイド表示済み');
    sbmLog_('SetupStep2ApiGuide','Shown','Google Cloud API guide displayed');
  } catch (e) {
    sbmSetSetting_('SetupApiGuide', 'NO', 'STEP2ガイド再実行が必要');
    sbmLog_('SetupStep2ApiGuide','NeedsAuthorization', String(e));
    ui.alert(
      'STEP2 Google Cloud API有効化ガイド',
      'Googleの再承認が必要です。\n\n' +
      '1. このメッセージを閉じます。\n' +
      '2. もう一度「STEP2 Google Cloud APIガイドを開く」を実行します。\n' +
      '3. Googleの承認画面が出たら許可します。\n\n' +
      '承認後も開けない場合は、次のURLをブラウザに貼り付けてください。\n\n' +
      sbmSearchConsoleApiUrl_(),
      ui.ButtonSet.OK
    );
  }
  sbmRefreshHome_();
}

function sbmSearchConsoleApiUrl_() {
  return 'https://console.cloud.google.com/apis/library/searchconsole.googleapis.com';
}

function sbmApiGuideHtml_() {
  return '<div style="font-family:Arial,sans-serif;line-height:1.7;padding:12px">'
    + '<h2>STEP2 Google Cloud APIを有効化します</h2>'
    + '<p>下のボタンからGoogle Cloud Consoleを開き、<b>Google Search Console API</b>を有効化してください。</p>'
    + '<p><a href="' + sbmSearchConsoleApiUrl_() + '" target="_blank" style="display:inline-block;background:#1a73e8;color:white;padding:10px 16px;border-radius:6px;text-decoration:none">Google Search Console APIを開く</a></p>'
    + '<ol>'
    + '<li>Google Cloud Consoleが開きます。</li>'
    + '<li>「有効にする」ボタンがあればクリックします。</li>'
    + '<li>有効化後、数分待つことがあります。</li>'
    + '<li>このスプレッドシートに戻り、メニューから <b>STEP3 Search Console接続テスト</b> を実行します。</li>'
    + '</ol>'
    + '<p style="background:#fff8e1;padding:10px;border-left:4px solid #fbbc04">外部URLを開いた後、Apps Scriptの処理はここで終了します。これは正常です。</p>'
    + '</div>';
}

function sbmSetupStep3ConnectionTest() {
  sbmInitializeSheets(false);
  if (sbmGetSetting_('SetupBlogInfo','NO') !== 'YES') return sbmAlert_('STEP1が未完了です', '先にブログ情報を登録してください。');
  var property = sbmGetSetting_('SearchConsoleProperty','');
  if (!property) return sbmAlert_('プロパティ未登録', 'STEP1でSearch Consoleプロパティを登録してください。');
  var result = sbmTestSearchConsoleConnection_();
  if (result.ok) {
    sbmSetSetting_('ConnectionStatus','OK','Search Console接続成功');
    sbmSetSetting_('LastConnectionTestAt', sbmNowText_(), '最終接続テスト日時');
    sbmLog_('SearchConsoleConnectionTest','Done',property);
    sbmRefreshHome_();
    sbmAlert_('接続OK', 'Search Consoleに接続できました。\n\n次はSTEP4 初回データ取得を実行してください。');
  } else {
    sbmSetSetting_('ConnectionStatus','ERROR','Search Console接続失敗');
    sbmLog_('SearchConsoleConnectionTest','Error',result.message);
    sbmRefreshHome_();
    sbmAlert_('接続エラー', sbmFriendlyGscError_(result.message));
  }
}

function sbmSetupStep4InitialFetch() {
  if (sbmGetSetting_('ConnectionStatus','') !== 'OK') return sbmAlert_('接続テスト未完了', '先にSTEP3 Search Console接続テストを成功させてください。');
  sbmDailyUpdateManual();
  sbmSetSetting_('SetupInitialFetch','YES','STEP4初回取得完了');
  sbmRefreshHome_();
}

function sbmDailyUpdateManual() {
  return sbmCollectPageDataToArticleDbManual(false);
}



/**
 * Product 5.0 ArticleDB Foundation setup.
 * 1回の実行で「URL収集100件」または「記事情報補完50件」のどちらか1チャンクだけ進めます。
 * 途中位置・完了状態はSettingsへ保存し、次回は続きから再開します。
 */
function sbmSetupArticleDbContinueManual() {
  if (!sbmIsSetupComplete_() || sbmGetSetting_('ConnectionStatus','') !== 'OK') {
    return sbmAlert_('記事DB初期構築はまだできません', 'STEP1〜STEP3を完了してください。');
  }
  var ui = SpreadsheetApp.getUi();
  var res = ui.alert(
    '記事DBを一括作成',
    'Search Consoleからページ単位のデータを最大25,000件取得し、URL正規化・ノイズ除外後に記事DBを作成します。\n\n既存の記事タイトル等は同じURLなら保持します。',
    ui.ButtonSet.OK_CANCEL
  );
  if (res !== ui.Button.OK) return;
  sbmBuildArticleDbOnePass_(false);
}

function sbmBuildArticleDbOnePass_(silent) {
  var started = new Date();
  var startedText = sbmNowText_();
  silent = silent === true;
  var rowLimit = 25000;
  try {
    sbmSetSetting_('ArticleDbUrlBuildStatus','処理中','記事URL収集の状態');
    sbmSetSetting_('ArticleDbUrlBuildComplete','NO','記事URL収集完了フラグ');
    var range = sbmSearchConsoleDateRange_();
    var property = sbmGetSetting_('SearchConsoleProperty','');
    var data = sbmSearchConsoleApiRequest_(property, {
      startDate: range.startDate,
      endDate: range.endDate,
      dimensions: ['page'],
      rowLimit: rowLimit,
      startRow: 0
    });
    var raw = data.rows || [];
    var oldMap = sbmArticleDbRowsByUrl_();
    var freshMap = {};
    var nextArticleNo = 1;
    Object.keys(oldMap || {}).forEach(function(k){
      var m = String((oldMap[k] || {})['ArticleID'] || '').match(/A(\d+)/i);
      if (m) nextArticleNo = Math.max(nextArticleNo, Number(m[1]) + 1);
    });
    var excluded = 0;
    var fragments = 0;
    var capturedAt = sbmNowText_();

    raw.forEach(function(r){
      var original = r.keys && r.keys[0] ? String(r.keys[0]) : '';
      if (original.indexOf('#') >= 0) fragments++;
      var url = sbmNormalizeUrl_(original);
      if (!url || !sbmIsValidArticleUrl_(url)) { excluded++; return; }

      var clicks = sbmNumber_(r.clicks || 0);
      var imps = sbmNumber_(r.impressions || 0);
      var ctr = imps ? clicks / imps : 0;
      var pos = sbmNumber_(r.position || 0);
      var old = oldMap[url] || {};
      var obj = freshMap[url];

      if (!obj) {
        obj = {
          '記事ランク': old['記事ランク'] || sbmLegacyStatusToRank_(old['記事ステータス'] || sbmClassifyArticleDbStatus_(url, clicks, imps, ctr, pos, {})),
          '作業状態': old['作業状態'] || sbmLegacyStatusToWorkState_(old['記事ステータス'] || ''),
          '記事ステータス': old['記事ステータス'] || sbmClassifyArticleDbStatus_(url, clicks, imps, ctr, pos, {}),
          '記事URL': url,
          'メインクエリ': old['メインクエリ'] || '',
          'クリック数': clicks,
          '表示回数': imps,
          'CTR': ctr,
          '掲載順位': pos,
          'データ更新日': sbmDisplayDateText_(capturedAt),
          '記事タイトル': old['記事タイトル'] || '',
          'SEOタイトル': old['SEOタイトル'] || '',
          'メタディスクリプション': old['メタディスクリプション'] || '',
          '最終取得日時': capturedAt,
          '元URL件数': 1,
          '除外理由': '',
          '備考': old['備考'] || '',
          'ArticleID': old['ArticleID'] || ('A' + String(nextArticleNo++).padStart(6,'0')),
          '記事情報補完済み': old['記事情報補完済み'] || '×',
          '補完日時': old['補完日時'] || '',
          '補完エラー': old['補完エラー'] || ''
        };
        freshMap[url] = obj;
      } else {
        var oldClicks = sbmNumber_(obj['クリック数'] || 0);
        var oldImps = sbmNumber_(obj['表示回数'] || 0);
        var oldPos = sbmNumber_(obj['掲載順位'] || 0);
        var totalImps = oldImps + imps;
        obj['クリック数'] = oldClicks + clicks;
        obj['表示回数'] = totalImps;
        obj['CTR'] = totalImps ? (oldClicks + clicks) / totalImps : 0;
        obj['掲載順位'] = totalImps ? ((oldPos * oldImps) + (pos * imps)) / totalImps : pos;
        obj['元URL件数'] = sbmNumber_(obj['元URL件数'] || 0) + 1;
      }
    });

    sbmWriteArticleDbObjects_(freshMap);
    var total = Object.keys(freshMap).length;
    var finished = raw.length < rowLimit;
    sbmSetSetting_('ArticleDbBuildStartRow', String(raw.length), '初回記事DB構築のSearch Console取得位置');
    sbmSetSetting_('ArticleDbUrlBuildComplete', finished ? 'YES' : 'NO', '記事URL収集完了フラグ');
    sbmSetSetting_('ArticleDbUrlBuildStatus', finished ? '完了' : '上限25,000件到達・追加確認が必要', '記事URL収集の状態');
    sbmSetSetting_('ArticleInfoBuildStatus', finished ? '未開始' : sbmGetSetting_('ArticleInfoBuildStatus','未開始'), '記事情報補完の状態');
    sbmRefreshHome_();

    var sec = sbmSecondsSince_(started);
    var detail = 'page行 ' + raw.length + ' / 記事URL ' + total + ' / #付き ' + fragments + ' / 除外 ' + excluded + ' / 上限到達 ' + (finished ? 'NO' : 'YES');
    sbmProcessLog_('記事DB一括作成','完了',raw.length,total,sec,detail,startedText,sbmNowText_());
    if (!silent) {
      if (finished) {
        sbmAlert_('記事DB作成完了','Search Consoleページ行: ' + raw.length + '件\n正規化後の記事DB: ' + total + '件\n除外: ' + excluded + '件\n\n次はSTEP5 記事情報補完を実行してください。');
      } else {
        sbmAlert_('25,000件上限に到達しました','Search Consoleページ行が25,000件に達したため、記事DB作成を完了扱いにしていません。大規模サイト向けの追加取得が必要です。');
      }
    }
  } catch(e) {
    sbmSetSetting_('ArticleDbUrlBuildStatus','エラー','記事URL収集の状態');
    sbmProcessLog_('記事DB一括作成','エラー','','',sbmSecondsSince_(started),String(e),startedText,sbmNowText_());
    sbmAlert_('記事DB一括作成エラー',String(e));
  }
}

function sbmSetupArticleInfoContinueManual() {
  if (String(sbmGetSetting_('ArticleDbUrlBuildComplete','NO')) !== 'YES') {
    return sbmAlert_('記事情報補完はまだ開始できません','先にSTEP4の記事URL収集を最後まで完了してください。');
  }
  var batch = sbmGetArticleInfoBatch_();
  var ui = SpreadsheetApp.getUi();
  var counts = sbmArticleDbInfoCompletionCounts_();
  if (!counts.remaining) {
    sbmSetSetting_('ArticleInfoBuildComplete','YES','記事情報補完完了フラグ');
    sbmSetSetting_('ArticleInfoBuildStatus','完了','記事情報補完の状態');
    sbmRefreshHome_();
    return sbmAlert_('記事情報補完は完了しています','全' + counts.total + '件の記事情報が補完済みです。');
  }
  var res = ui.alert('記事情報補完','未補完 ' + counts.remaining + '件のうち最大' + batch + '件を処理します。\nH1・SEOタイトル・メタディスクリプション・メインクエリを取得します。',ui.ButtonSet.OK_CANCEL);
  if (res !== ui.Button.OK) return;
  sbmSupplementArticleDbSetupChunk_(batch,false);
}

function sbmSupplementArticleDbSetupChunk_(batch, silent) {
  var started = new Date();
  var startedText = sbmNowText_();
  var safeSeconds = 280;
  silent = silent === true;
  try {
    var sh = sbmGetOrCreateSheet_(SBM_SHEETS.ARTICLE_DB);
    sbmEnsureHeaders_(sh, SBM_HEADERS.ARTICLE_DB);
    var rows = sbmRowsAsObjects_(SBM_SHEETS.ARTICLE_DB);
    var processed = 0, success = 0, errors = 0;
    sbmSetSetting_('ArticleInfoBuildStatus','処理中','記事情報補完の状態');
    for (var i=0; i<rows.length; i++) {
      if (processed >= batch || sbmSecondsSince_(started) >= safeSeconds) break;
      var r = rows[i];
      if (String(r['記事情報補完済み'] || '') === '○') continue;
      var url = sbmNormalizeUrl_(r['記事URL'] || '');
      if (!url) continue;
      processed++;
      var meta = sbmFetchArticleMetaInfo_(url) || {};
      var query = sbmFetchMainQueryForUrl_(url) || '';
      var title = sbmCleanDataListText_(meta.h1 || meta.titleTag || '',url);
      var seo = sbmCleanDataListText_(meta.titleTag || '',url);
      var desc = sbmCleanDataListText_(meta.metaDescription || '',url);
      var ok = !!(title || seo || desc || query);
      sbmSetObjectValues_(sh,r._rowNumber,{
        '記事タイトル': title,
        'SEOタイトル': seo,
        'メタディスクリプション': desc,
        'メインクエリ': query,
        '記事情報補完済み': ok ? '○' : 'エラー',
        '補完日時': sbmNowText_(),
        '補完エラー': ok ? '' : '記事情報を取得できませんでした',
        '管理フラグ': ok ? '正常' : (r['管理フラグ'] || '記事情報未取得')
      });
      if (ok) success++; else errors++;
    }
    var counts = sbmArticleDbInfoCompletionCounts_();
    var finished = counts.remaining === 0;
    sbmSetSetting_('ArticleInfoBuildComplete',finished ? 'YES' : 'NO','記事情報補完完了フラグ');
    sbmSetSetting_('ArticleInfoBuildStatus',finished ? '完了' : ('続きあり（残り ' + counts.remaining + '件）'),'記事情報補完の状態');
    sbmRefreshHome_();
    var sec = sbmSecondsSince_(started);
    sbmProcessLog_('記事情報補完（初回セットアップ）','完了',counts.total,processed,sec,'成功 ' + success + ' / エラー ' + errors + ' / 残り ' + counts.remaining + ' / 280秒安全終了',startedText,sbmNowText_());
    var summary = {
      processed: processed,
      success: success,
      errors: errors,
      completed: counts.completed,
      total: counts.total,
      remaining: counts.remaining,
      finished: finished,
      batch: sbmGetArticleInfoBatch_()
    };
    if (!silent) {
      if (finished) {
        sbmAlert_('記事情報補完完了','今回処理: ' + processed + '件\n成功: ' + success + '件\n取得エラー: ' + errors + '件\n補完済み: ' + counts.completed + ' / ' + counts.total + '件\n\n初回記事DBセットアップが完了しました。');
      } else {
        sbmShowArticleInfoContinuationDialog_(summary);
      }
    }
    return summary;
  } catch(e) {
    sbmSetSetting_('ArticleInfoBuildStatus','エラー','記事情報補完の状態');
    sbmProcessLog_('記事情報補完（初回セットアップ）','エラー','','',sbmSecondsSince_(started),String(e),startedText,sbmNowText_());
    if (silent) throw e;
    sbmAlert_('記事情報補完エラー',String(e));
    return {error:String(e), processed:0, success:0, errors:1, completed:0, total:0, remaining:0, finished:false, batch:sbmGetArticleInfoBatch_()};
  }
}


function sbmShowArticleInfoContinuationDialog_(summary) {
  summary = summary || {};
  var batch = Number(summary.batch || sbmGetArticleInfoBatch_());
  var payload = JSON.stringify(summary).replace(/</g, '\\u003c');
  var html = '<!DOCTYPE html><html><head><base target="_top"><style>' +
    'body{font-family:Arial,"Noto Sans JP",sans-serif;padding:18px;color:#202124;background:#f8fbf8}' +
    'h2{margin:0 0 14px;color:#0b8043;font-size:20px}.card{background:#fff;border:1px solid #dfe5df;border-radius:10px;padding:14px;margin-bottom:14px}' +
    '.grid{display:grid;grid-template-columns:1fr 1fr;gap:8px 16px}.label{color:#5f6368}.value{font-weight:700;text-align:right}' +
    '.buttons{display:flex;gap:10px;justify-content:flex-end}.continue{background:#0b8043;color:#fff;border:none;border-radius:6px;padding:10px 16px;font-weight:700;cursor:pointer}' +
    '.continue:disabled{opacity:.55;cursor:default}.stop{background:#fff;color:#3c4043;border:1px solid #dadce0;border-radius:6px;padding:10px 16px;cursor:pointer}' +
    '.note{font-size:12px;color:#5f6368;margin-top:10px}.done{color:#0b8043;font-weight:700;margin-top:10px}.error{color:#b3261e;font-weight:700;margin-top:10px}</style></head><body>' +
    '<h2 id="title">記事情報補完を保存しました</h2><div class="card"><div class="grid">' +
    '<div class="label">今回処理</div><div class="value" id="processed"></div>' +
    '<div class="label">成功</div><div class="value" id="success"></div>' +
    '<div class="label">取得エラー</div><div class="value" id="errors"></div>' +
    '<div class="label">補完済み</div><div class="value" id="completed"></div>' +
    '<div class="label">残り</div><div class="value" id="remaining"></div>' +
    '</div><div id="message"></div></div><div class="buttons">' +
    '<button class="stop" onclick="google.script.host.close()">ここで終了</button>' +
    '<button id="continueBtn" class="continue" onclick="continueRun()">続けて' + batch + '件処理</button></div>' +
    '<div class="note">続けるたびに新しいApps Script実行として処理します。処理中は他のメニューを実行しないでください。</div>' +
    '<script>var state=' + payload + ';var batch=' + batch + ';function render(s){state=s||{};document.getElementById("processed").textContent=(Number(state.processed||0))+"件";document.getElementById("success").textContent=(Number(state.success||0))+"件";document.getElementById("errors").textContent=(Number(state.errors||0))+"件";document.getElementById("completed").textContent=(Number(state.completed||0))+" / "+(Number(state.total||0))+"件";document.getElementById("remaining").textContent=(Number(state.remaining||0))+"件";var btn=document.getElementById("continueBtn");var msg=document.getElementById("message");if(state.finished||Number(state.remaining||0)===0){document.getElementById("title").textContent="記事情報補完が完了しました";btn.style.display="none";msg.className="done";msg.textContent="初回記事DBセットアップが完了しました。";}else{btn.style.display="inline-block";btn.disabled=false;btn.textContent="続けて"+batch+"件処理";msg.className="";msg.textContent="";}}function continueRun(){var btn=document.getElementById("continueBtn");var msg=document.getElementById("message");btn.disabled=true;btn.textContent="処理中…";msg.className="";msg.textContent="この画面を閉じずに完了までお待ちください。";google.script.run.withFailureHandler(function(e){btn.disabled=false;btn.textContent="続けて"+batch+"件処理";msg.className="error";msg.textContent=(e&&e.message)?e.message:String(e);}).withSuccessHandler(function(res){render(res||{});}).sbmContinueArticleInfoFromDialog();}render(state);</script>' +
    '</body></html>';
  SpreadsheetApp.getUi().showModalDialog(sbmEnsureCloseButton_(HtmlService.createHtmlOutput(html).setWidth(520).setHeight(420)), '記事情報補完');
}

function sbmContinueArticleInfoFromDialog() {
  if (String(sbmGetSetting_('ArticleDbUrlBuildComplete','NO')) !== 'YES') {
    throw new Error('先にSTEP4の記事DB作成を完了してください。');
  }
  var batch = sbmGetArticleInfoBatch_();
  return sbmSupplementArticleDbSetupChunk_(batch, true);
}

function sbmArticleDbRowsByUrl_() {
  var map = {};
  sbmRowsAsObjects_(SBM_SHEETS.ARTICLE_DB).forEach(function(r){
    var url = sbmNormalizeUrl_(r['記事URL'] || '');
    if (url) map[url] = r;
  });
  return map;
}

function sbmNextArticleId_(map) {
  var max = 0;
  Object.keys(map || {}).forEach(function(k){
    var v = String(map[k]['ArticleID'] || '');
    var m = v.match(/A(\d+)/i);
    if (m) max = Math.max(max, Number(m[1]));
  });
  return 'A' + String(max + 1).padStart(6,'0');
}

function sbmWriteArticleDbObjects_(map) {
  var rows = Object.keys(map || {}).map(function(url){
    var r = map[url];
    return SBM_HEADERS.ARTICLE_DB.map(function(h){ return r[h] !== undefined ? r[h] : ''; });
  });
  sbmWriteArticleDb_(rows);
  sbmUpdateHomeArticleDbCounts_(rows);
}

/**
 * 記事DBの件数をHome用設定へ反映します。
 * rowsは配列行／オブジェクト行のどちらでも受け付けます。
 */
function sbmUpdateHomeArticleDbCounts_(rows) {
  rows = rows || [];
  var total = rows.length;
  var counts = {ace:0,growth:0,stable:0,nurture:0,low:0,today:0,inProgress:0,monitoring:0};
  rows.forEach(function(r){
    var rank = Array.isArray(r) ? String(r[0] || '') : String((r || {})['記事ランク'] || '');
    var work = Array.isArray(r) ? String(r[1] || '') : String((r || {})['作業状態'] || '');
    if (rank.indexOf('エース') >= 0) counts.ace++;
    else if (rank.indexOf('成長') >= 0) counts.growth++;
    else if (rank.indexOf('安定') >= 0) counts.stable++;
    else if (rank.indexOf('育成') >= 0) counts.nurture++;
    else if (rank.indexOf('低迷') >= 0) counts.low++;
    if (work.indexOf('今日の改善') >= 0) counts.today++;
    else if (work.indexOf('改善中') >= 0) counts.inProgress++;
    else if (work.indexOf('モニター中') >= 0) counts.monitoring++;
  });
  sbmSetSetting_('TotalArticleCount', total, '記事DBの総記事数');
  sbmSetSetting_('AceArticleCount', counts.ace, '記事DBのエース記事数');
  sbmSetSetting_('GrowthArticleCount', counts.growth, '記事DBの成長記事数');
  sbmSetSetting_('StableArticleCount', counts.stable, '記事DBの安定記事数');
  sbmSetSetting_('NurtureArticleCount', counts.nurture, '記事DBの育成記事数');
  sbmSetSetting_('LowArticleCount', counts.low, '記事DBの低迷記事数');
  sbmSetSetting_('TodayWorkCount', counts.today, '今日の改善件数');
  sbmSetSetting_('InProgressArticleCount', counts.inProgress, '改善中記事数');
  sbmSetSetting_('MonitoringArticleCount', counts.monitoring, 'モニター中記事数');
  sbmSetSetting_('LastArticleDbRows', total, '記事DBの直近行数');
  sbmRefreshHome_();
}

function sbmArticleDbInfoCompletionCounts_() {
  var rows = [];
  try { rows = sbmRowsAsObjects_(SBM_SHEETS.ARTICLE_DB); } catch(e) {}
  var completed = 0;
  rows.forEach(function(r){ if (String(r['記事情報補完済み'] || '') === '○') completed++; });
  return {total:rows.length, completed:completed, remaining:Math.max(0,rows.length-completed)};
}

function sbmShowArticleDbSetupStatus() {
  var c = sbmArticleDbInfoCompletionCounts_();
  var urlStatus = String(sbmGetSetting_('ArticleDbUrlBuildStatus','未開始'));
  var infoStatus = String(sbmGetSetting_('ArticleInfoBuildStatus','未開始'));
  sbmAlert_('セットアップ結果','記事URL収集: ' + urlStatus + '\n記事DB件数: ' + c.total + '件\n\n記事情報補完: ' + infoStatus + '\n補完済み: ' + c.completed + '件\n残り: ' + c.remaining + '件');
}

/**
 * Product 5.0: 新方式の第一段階。
 * Search Consoleから page 単位のデータだけを取得し、URL正規化・ノイズ除去後に「記事DB」へ保存します。
 * ここではタイトル取得・改善分析・改善ブリーフ作成は行いません。
 */
function sbmCollectPageDataToArticleDbManual(silent) {
  silent = silent === true;
  if (!sbmIsSetupComplete_() || sbmGetSetting_('ConnectionStatus','') !== 'OK') {
    return sbmAlert_('記事管理を更新できません', 'STEP1〜STEP3を完了してから実行してください。');
  }
  var ui = SpreadsheetApp.getUi();
  if (!silent) {
    var res = ui.alert('記事管理を更新します', 'Search Consoleから最新のページデータを取得し、記事DBのクリック数・表示回数・CTR・掲載順位・記事ランクを更新します。\n\n記事タイトル、SEOタイトル、メタディスクリプション、メインクエリ、作業状態は変更しません。新規記事が見つかった場合だけ、更新後に記事情報補完をご案内します。', ui.ButtonSet.OK_CANCEL);
    if (res !== ui.Button.OK) return;
  }
  var startedText = sbmNowText_();
  var started = new Date();
  var profiler = sbmCreateProfiler_('ページデータ収集（記事DB）');
  var runId = profiler.runId;
  try {
    var tApi = new Date();
    var result = sbmFetchSearchConsolePageRowsForArticleDb_(profiler);
    var apiSec = sbmSecondsSince_(tApi);
    var tWrite = new Date();
    var mergeResult = sbmMergeArticleDbDaily_(result.rows);
    try { sbmEnsureTodayRecommendations_('daily'); } catch (eToday) { sbmLog_('DailyTodayDefault','Warning',String(eToday)); }
    var writeSec = sbmSecondsSince_(tWrite);

    var completedAt = new Date();
    sbmMarkDailyUpdateCompleted_(completedAt);
    try { sbmRefreshHome_(); } catch (eHomeRefresh) { sbmLog_('DailyHomeRefresh','Warning',String(eHomeRefresh)); }
    sbmSetSetting_('LastArticleDbRows', mergeResult.total, '記事DBの直近行数');
    sbmSetSetting_('LastArticleDbExcluded', result.excluded, 'ページデータ収集で除外したURL数');
    sbmSetSetting_('LastArticleDbRawRows', result.rawRows, 'ページデータ収集のSearch Console元行数');

    var sec = sbmSecondsSince_(started);
    sbmProcessLog_('ページデータ収集（記事DB）', '完了', result.rawRows, result.rows.length, sec,
      'API取得 ' + apiSec + '秒 / 差分更新 ' + writeSec + '秒 / 既存更新 ' + mergeResult.updated + '件 / 新規追加 ' + mergeResult.added + '件 / 記事DB合計 ' + mergeResult.total + '件 / 除外 ' + result.excluded + '件 / 固定情報保護 / ProfileRunId ' + runId,
      startedText, sbmNowText_());
    if (!silent) sbmAlert_('記事DBの日次更新完了', '固定情報を保持したまま数値データを更新しました。\n\nSearch Console取得行: ' + result.rawRows + '件\n既存記事更新: ' + mergeResult.updated + '件\n新規記事追加: ' + mergeResult.added + '件\n記事DB合計: ' + mergeResult.total + '件\n要確認記事: ' + mergeResult.needsReview + '件\n除外: ' + result.excluded + '件\n所要時間: ' + sec + '秒\n\n処理プロファイル: ' + runId);
    if (mergeResult.added > 0) sbmShowNewArticleInfoPrompt_(mergeResult.added);
    return mergeResult;
  } catch(e) {
    var secErr = sbmSecondsSince_(started);
    sbmProcessLog_('ページデータ収集（記事DB）', 'エラー', '', '', secErr, String(e) + ' / ProfileRunId ' + runId, startedText, sbmNowText_());
    if (silent) throw e;
    sbmAlert_('ページデータ収集エラー', String(e));
  }
}

function sbmFetchSearchConsolePageRowsForArticleDb_(profiler) {
  var tPrep = new Date();
  var range = sbmSearchConsoleDateRange_();
  var property = sbmGetSetting_('SearchConsoleProperty','');
  var capturedAt = sbmNowText_();
  var limit = sbmNumber_(sbmGetSetting_('PageDataMaxRows', SBM_DEFAULTS.PAGE_FETCH_MAX_ROWS)) || SBM_DEFAULTS.PAGE_FETCH_MAX_ROWS;
  limit = Math.max(100, Math.min(25000, limit));
  if (profiler) profiler.lap('取得条件準備', limit, '', '期間 ' + range.startDate + '〜' + range.endDate + ' / page rowLimit=' + limit + ' / ' + sbmSecondsSince_(tPrep) + '秒');

  var tApi = new Date();
  var data = sbmSearchConsoleApiRequest_(property, {startDate: range.startDate, endDate: range.endDate, dimensions: ['page'], rowLimit: limit});
  var rows = data.rows || [];
  if (profiler) profiler.lap('Search Console API page取得', limit, rows.length, 'API取得 ' + sbmSecondsSince_(tApi) + '秒');

  var tNormalize = new Date();
  var map = {};
  var excluded = 0;
  var fragmentCount = 0;
  var invalidSamples = [];
  rows.forEach(function(r){
    var originalUrl = r.keys && r.keys[0] ? String(r.keys[0]) : '';
    if (originalUrl.indexOf('#') >= 0) fragmentCount++;
    var url = sbmNormalizeUrl_(originalUrl);
    if (!url || !sbmIsValidArticleUrl_(url)) {
      excluded++;
      if (invalidSamples.length < 5) invalidSamples.push(originalUrl);
      return;
    }
    if (!map[url]) map[url] = {url:url, clicks:0, impressions:0, weightedPositionSum:0, originalCount:0, capturedAt:capturedAt};
    var m = map[url];
    var clicks = sbmNumber_(r.clicks || 0);
    var imps = sbmNumber_(r.impressions || 0);
    var pos = sbmNumber_(r.position || 0);
    m.clicks += clicks;
    m.impressions += imps;
    m.weightedPositionSum += pos * imps;
    m.originalCount++;
  });
  var statusMap = sbmBuildArticleStatusReferenceMap_();
  var out = Object.keys(map).map(function(url){
    var m = map[url];
    var ctr = m.impressions ? m.clicks / m.impressions : 0;
    var pos = m.impressions ? m.weightedPositionSum / m.impressions : 0;
    var status = sbmClassifyArticleDbStatus_(url, m.clicks, m.impressions, ctr, pos, statusMap);
    return [false, sbmLegacyStatusToRank_(status), sbmLegacyStatusToWorkState_(status), url, '', m.clicks, m.impressions, ctr, pos, sbmDisplayDateText_(m.capturedAt), '', '記事詳細', '', '', m.capturedAt, m.originalCount, '', '', '', '×', '', '', sbmStatusLabel_(status), sbmDisplayDateText_(m.capturedAt), 0, '正常'];
  });
  out = sbmSortArticleDbRows_(out);
  if (profiler) profiler.lap('URL正規化・記事URL抽出', rows.length, out.length, '#付きURL ' + fragmentCount + '件 / 除外 ' + excluded + '件 / サンプル ' + invalidSamples.join(' | ') + ' / ' + sbmSecondsSince_(tNormalize) + '秒');
  return {rawRows: rows.length, rows: out, excluded: excluded, fragmentCount: fragmentCount};
}


function sbmBuildArticleStatusReferenceMap_() {
  var map = {};
  // 既存のデータ一覧・記事DB・改善中にある状態を引き継ぐ。
  // ここでは外部取得やタイトル取得は行わない。
  try {
    var articleRows = sbmRowsAsObjects_(SBM_SHEETS.ARTICLE_DB);
    articleRows.forEach(function(r){
      var url = sbmNormalizeUrl_(r['記事URL'] || r.URL || '');
      if (!url) return;
      var st = sbmNormalizeStatus_(r['記事ステータス'] || r['状態'] || '');
      if (st && st !== '未分析') map[url] = st;
    });
  } catch(e) {}
  return map;
}

function sbmClassifyArticleDbStatus_(url, clicks, impressions, ctr, position, statusMap) {
  url = sbmNormalizeUrl_(url || '');
  var preserved = statusMap && statusMap[url] ? sbmNormalizeStatus_(statusMap[url]) : '';
  // 利用者が明示的に管理から外したもの、現在改善中のものは維持する。
  if (preserved === '管理対象外' || preserved === '改善中') return preserved;

  var minImps = sbmNumber_(sbmGetSetting_('MinImpressions', SBM_DEFAULTS.MIN_IMPRESSIONS)) || SBM_DEFAULTS.MIN_IMPRESSIONS;
  clicks = sbmNumber_(clicks || 0);
  impressions = sbmNumber_(impressions || 0);
  ctr = sbmNumber_(ctr || 0);
  position = sbmNumber_(position || 0);

  if (!url || !sbmIsValidArticleUrl_(url)) return '管理対象外';
  if (impressions < minImps) return '様子見';

  var ctrPct = ctr * 100;
  if (position > 0 && position <= 5 && ctrPct < 3) return '改善候補';
  if (position > 0 && position <= 10 && ctrPct < 2.5) return '改善候補';
  if (position > 10 && position <= 40) return '改善候補';

  // 以前に改善候補として残っているものでも、今回のページ指標上で改善候補条件を満たさなければ良好へ戻す。
  return '良好';
}


function sbmSortArticleDbInternal_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SBM_SHEETS.ARTICLE_DB);
  if (!sh || sh.getLastRow() <= 1) return 0;
  var width = SBM_HEADERS.ARTICLE_DB.length;
  var rows = sh.getRange(2, 1, sh.getLastRow() - 1, width).getValues();
  rows = sbmSortArticleDbRows_(rows);
  sh.getRange(2, 1, sh.getLastRow() - 1, width).clearContent();
  if (rows.length) sh.getRange(2, 1, rows.length, width).setValues(rows);
  sbmStyleArticleDbSheet_(sh);
  return rows.length;
}

function sbmSortArticleDbManual() {
  var count = sbmSortArticleDbInternal_();
  sbmRefreshHome_();
  sbmAlert_('記事DBを並べ替えました', 'モニター中、改善中、今日の改善を優先し、その後は記事ランク順に ' + count + '件を並べ替えました。');
}



/**
 * Product 5.0 日次更新。
 * 正規化URLをキーに既存記事DBへ差分マージし、固定情報を保護します。
 * 更新する列: 記事ステータス、クリック数、表示回数、CTR、掲載順位、最終取得日時、元URL件数。
 * 新規URLだけ新しいArticleIDで追加し、記事情報は未補完として保持します。
 */
function sbmMergeArticleDbDaily_(freshRows) {
  var existingRows = [];
  try { existingRows = sbmRowsAsObjects_(SBM_SHEETS.ARTICLE_DB); } catch(e) {}
  var map = {};
  var nextNo = 1;
  existingRows.forEach(function(r){
    var url = sbmNormalizeUrl_(r['記事URL'] || '');
    if (!url) return;
    map[url] = r;
    var m = String(r['ArticleID'] || '').match(/A(\d+)/i);
    if (m) nextNo = Math.max(nextNo, Number(m[1]) + 1);
  });
  var today = sbmDateText_(new Date());
  var seen = {};
  var updated = 0, added = 0;
  (freshRows || []).forEach(function(row){
    var f = {};
    for (var i = 0; i < SBM_HEADERS.ARTICLE_DB.length; i++) f[SBM_HEADERS.ARTICLE_DB[i]] = row[i] !== undefined ? row[i] : '';
    var url = sbmNormalizeUrl_(f['記事URL'] || '');
    if (!url) return;
    seen[url] = true;
    var old = map[url];
    if (old) {
      old['クリック数'] = f['クリック数'];
      old['表示回数'] = f['表示回数'];
      old['CTR'] = f['CTR'];
      old['掲載順位'] = f['掲載順位'];
      old['データ更新日'] = today;
      old['最終取得日時'] = f['最終取得日時'];
      old['最終確認日'] = today;
      old['連続未取得日数'] = 0;
      old['管理フラグ'] = '正常';
      updated++;
    } else {
      f['記事URL'] = url;
      f['ArticleID'] = 'A' + String(nextNo++).padStart(6, '0');
      f['記事情報補完済み'] = '×';
      f['補完日時'] = '';
      f['補完エラー'] = '';
      f['記事ランク'] = '';
      f['作業状態'] = '未着手';
      f['記事ステータス'] = '';
      f['データ更新日'] = today;
      f['最終確認日'] = today;
      f['連続未取得日数'] = 0;
      f['管理フラグ'] = '新規記事';
      map[url] = f;
      added++;
    }
  });
  var stale30 = 0;
  var needsReview = 0;
  var existingCount = existingRows.length;
  var seenCount = Object.keys(seen).length;
  // Search Console取得が空、または既存DBの20%未満しか照合できない異常時は、全記事を未取得扱いにしません。
  var reliableCoverage = existingCount === 0 || seenCount >= Math.max(1, Math.floor(existingCount * 0.20));
  if (!reliableCoverage) {
    sbmLog_('DailyMissingGuard', 'Warning', '既存 ' + existingCount + '件に対し照合 ' + seenCount + '件のため未取得判定を保留');
  }
  Object.keys(map).forEach(function(url){
    if (!reliableCoverage) return;
    if (seen[url]) return;
    var r = map[url];
    var missing = Number(r['連続未取得日数'] || 0) + 1;
    r['連続未取得日数'] = missing;
    var lastSeen = String(r['最終確認日'] || '');
    var missingDays = lastSeen ? Math.floor((new Date(today).getTime() - new Date(lastSeen).getTime()) / 86400000) : missing;
    if (missing >= 3 || missingDays >= 14) {
      r['管理フラグ'] = '要確認';
      needsReview++;
      if (missingDays >= 30) stale30++;
    } else if (String(r['管理フラグ'] || '') !== '新規記事') {
      r['管理フラグ'] = 'データ未取得';
    }
  });
  sbmStorePreviousRankCounts_(existingRows);
  sbmApplyArticleRanksToObjectMap_(map);
  var rows = Object.keys(map).map(function(url){
    var r = map[url];
    return SBM_HEADERS.ARTICLE_DB.map(function(h){ return r[h] !== undefined ? r[h] : ''; });
  });
  sbmWriteArticleDb_(rows);
  sbmUpdateHomeArticleDbCounts_(rows);
  sbmSetSetting_('LastDailyUpdatedCount', updated, '日次更新で数値を更新した既存記事数');
  sbmSetSetting_('LastDailyAddedCount', added, '日次更新で追加した新規記事数');
  sbmSetSetting_('LastDailyStale30Count', stale30, '30日以上データ未取得の記事数');
  sbmSetSetting_('LastDailyNeedsReviewCount', needsReview, '要確認記事数');
  return {updated:updated, added:added, total:rows.length, stale30:stale30, needsReview:needsReview};
}


/**
 * 旧版の照合不良で記事DBの大半が未取得になった状態を安全に解除します。
 * 80%以上が未取得系、かつ直近日次更新の既存更新件数が全体の20%未満の場合だけ補正します。
 */
function sbmRepairFalseMassMissingFlags_() {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SBM_SHEETS.ARTICLE_DB);
  if (!sh || sh.getLastRow() < 2) return 0;
  var hm = sbmHeaderMap_(sh);
  if (!hm['管理フラグ']) return 0;
  var rows = sbmRowsAsObjects_(SBM_SHEETS.ARTICLE_DB) || [];
  var flagged = rows.filter(function(r){ var f=String(r['管理フラグ']||''); return f==='データ未取得'||f==='要確認'; });
  var lastUpdated = Number(sbmGetSetting_('LastDailyUpdatedCount', 0) || 0);
  if (!rows.length || flagged.length < Math.ceil(rows.length * 0.80) || lastUpdated >= Math.ceil(rows.length * 0.20)) return 0;
  flagged.forEach(function(r){
    sh.getRange(r._rowNumber, hm['管理フラグ']).setValue('正常');
    if (hm['連続未取得日数']) sh.getRange(r._rowNumber, hm['連続未取得日数']).setValue(0);
  });
  sbmSetSetting_('LastDailyNeedsReviewCount', 0, '誤った一括未取得判定を修復');
  sbmLog_('RepairFalseMassMissing', 'Done', flagged.length + '件を正常へ戻しました');
  return flagged.length;
}


function sbmWriteArticleDb_(rows) {
  var sh = sbmGetOrCreateSheet_(SBM_SHEETS.ARTICLE_DB);
  // 日次更新では書式・列幅を壊さず、値だけを書き換える。
  var clearRows = Math.max(sh.getLastRow(), 1);
  var clearCols = Math.max(sh.getLastColumn(), SBM_HEADERS.ARTICLE_DB.length);
  sh.getRange(1, 1, clearRows, clearCols).clearContent();
  sbmEnsureHeaders_(sh, SBM_HEADERS.ARTICLE_DB);
  var normalized = sbmNormalizeRowsToWidth_(sbmSortArticleDbRows_(rows || []), SBM_HEADERS.ARTICLE_DB.length);
  if (normalized.length) sh.getRange(2, 1, normalized.length, SBM_HEADERS.ARTICLE_DB.length).setValues(normalized);
  sbmStyleArticleDbSheet_(sh);
}


function sbmSupplementArticleDbMetaManual(silent) {
  silent = silent === true;
  var started = new Date();
  var startedText = sbmNowText_();
  var maxSeconds = 300;
  try {
    var sh = sbmGetOrCreateSheet_(SBM_SHEETS.ARTICLE_DB);
    sbmEnsureHeaders_(sh, SBM_HEADERS.ARTICLE_DB);
    var rows = sbmRowsAsObjects_(SBM_SHEETS.ARTICLE_DB);
    if (!rows.length) return sbmAlert_('記事DBのタイトル情報を補完できません', '先に「ページデータ収集（記事DB）」を実行してください。');
    var maxMeta = sbmNumber_(sbmGetSetting_('MetaFetchMaxRows', SBM_DEFAULTS.META_FETCH_MAX_ROWS)) || SBM_DEFAULTS.META_FETCH_MAX_ROWS;
    maxMeta = Math.max(1, Math.min(100, maxMeta));
    var out = [];
    var fetchedMeta = 0;
    var fetchedQuery = 0;
    var target = 0;
    var skippedByTime = 0;
    var now = sbmNowText_();

    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      var status = sbmNormalizeStatus_(r['記事ステータス'] || '');
      var url = sbmNormalizeUrl_(r['記事URL'] || r.URL || '');
      var mainQuery = String(r['メインクエリ'] || '').trim();
      var clicks = sbmNumber_(r['クリック数'] || 0);
      var imps = sbmNumber_(r['表示回数'] || 0);
      var ctr = sbmNumber_(r['CTR'] || 0);
      var pos = sbmNumber_(r['掲載順位'] || r['平均順位'] || 0);
      var articleTitle = sbmCleanDataListText_(r['記事タイトル'] || r['H1タイトル'] || '', url);
      var seoTitle = sbmCleanDataListText_(r['SEOタイトル'] || r['SEOタイトル（titleタグ）'] || r['titleタグ'] || '', url);
      var metaDesc = sbmCleanDataListText_(r['メタディスクリプション'] || r['meta description'] || '', url);

      var isImprovement = (status === '改善候補');
      var isGood = (status === '良好');
      if (isImprovement || isGood || status === '様子見') target++;

      // タイムアウト回避。Apps Scriptの上限より前の300秒を超えたら外部取得を止め、保存だけして終了する。
      var canFetchMore = sbmSecondsSince_(started) < maxSeconds;
      if (!canFetchMore) skippedByTime++;

      // 改善候補：記事タイトル・SEOタイトル・メタディスクリプション・メインクエリを補完。
      if (canFetchMore && isImprovement && fetchedMeta < maxMeta && url && (!articleTitle || !seoTitle || !metaDesc)) {
        var meta = sbmFetchArticleMetaInfo_(url);
        if (meta && (meta.h1 || meta.titleTag || meta.metaDescription)) {
          articleTitle = sbmCleanDataListText_(meta.h1 || articleTitle, url);
          seoTitle = sbmCleanDataListText_(meta.titleTag || seoTitle, url);
          metaDesc = sbmCleanDataListText_(meta.metaDescription || metaDesc, url);
          fetchedMeta++;
        }
      }
      if (canFetchMore && isImprovement && fetchedQuery < maxMeta && url && !mainQuery) {
        var q = sbmFetchMainQueryForUrl_(url);
        if (q) {
          mainQuery = q;
          fetchedQuery++;
        }
      }

      // 良好：記事タイトルだけ補完。SEOタイトル・description・メインクエリはこの処理では取りに行かない。
      if (canFetchMore && isGood && fetchedMeta < maxMeta && url && !articleTitle) {
        var metaGood = sbmFetchArticleMetaInfo_(url);
        if (metaGood && metaGood.h1) {
          articleTitle = sbmCleanDataListText_(metaGood.h1, url);
          fetchedMeta++;
        }
      }

      // 様子見：取得しない。既存値だけ保持する。
      // Product 5.2.8: 列位置に依存せず、既存レコードを保持したまま補完結果だけを更新します。
      var preserved = {};
      SBM_HEADERS.ARTICLE_DB.forEach(function(h){ preserved[h] = r[h] !== undefined ? r[h] : ''; });
      preserved['記事ランク'] = preserved['記事ランク'] || '';
      preserved['作業状態'] = preserved['作業状態'] || '未着手';
      preserved['記事URL'] = url;
      preserved['メインクエリ'] = mainQuery;
      preserved['クリック数'] = clicks;
      preserved['表示回数'] = imps;
      preserved['CTR'] = ctr;
      preserved['掲載順位'] = pos;
      preserved['記事タイトル'] = articleTitle;
      preserved['SEOタイトル'] = seoTitle;
      preserved['メタディスクリプション'] = metaDesc;
      preserved['最終取得日時'] = r['最終取得日時'] || now;
      preserved['元URL件数'] = sbmNumber_(r['元URL件数'] || 0);
      preserved['除外理由'] = r['除外理由'] || '';
      preserved['備考'] = r['備考'] || '';
      if (articleTitle || seoTitle || metaDesc || mainQuery) {
        preserved['記事情報補完済み'] = '○';
        preserved['補完日時'] = now;
        preserved['補完エラー'] = '';
      }
      out.push(SBM_HEADERS.ARTICLE_DB.map(function(h){ return preserved[h] !== undefined ? preserved[h] : ''; }));
    }

    sbmWriteArticleDb_(out);
    var sec = sbmSecondsSince_(started);
    var detail = '並び順: 改善候補→良好→様子見 / 対象: 改善候補はタイトル・SEOタイトル・メタディスクリプション・メインクエリ、良好は記事タイトルのみ / メタ取得 ' + fetchedMeta + '件 / メインクエリ取得 ' + fetchedQuery + '件 / 最大 ' + maxMeta + 'URL / 300秒安全終了 ' + (skippedByTime ? 'あり' : 'なし');
    sbmProcessLog_('記事DBタイトル情報補完', '完了', target, fetchedMeta + fetchedQuery, sec, detail, startedText, sbmNowText_());
    if (!silent) sbmAlert_('記事DBタイトル情報補完完了', '記事DBの情報補完が完了しました。\n\n並び順: 改善候補 → 良好 → 様子見\nメタ情報取得: ' + fetchedMeta + '件\nメインクエリ取得: ' + fetchedQuery + '件\n所要時間: ' + sec + '秒\n300秒安全終了: ' + (skippedByTime ? 'あり' : 'なし'));
  } catch(e) {
    var secErr = sbmSecondsSince_(started);
    sbmProcessLog_('記事DBタイトル情報補完', 'エラー', '', '', secErr, String(e), startedText, sbmNowText_());
    sbmAlert_('記事DBタイトル情報補完エラー', String(e));
  }
}

function sbmOpenArticleDb() {
  sbmHideOptionalAdminSheets_();
  sbmOpenSheet_(SBM_SHEETS.ARTICLE_DB);
  try { SpreadsheetApp.getActiveSpreadsheet().toast('記事行を選択し、右側の「記事DBツールバー」または上部メニューから操作してください。', '記事DBの操作', 8); } catch(e) {}
}

/**
 * 記事DBの共通操作をまとめた常設サイドバーです。
 * セルクリックの選択イベントに依存せず、選択中の行に対して確実に操作します。
 */
function sbmOpenArticleDbToolbar() {
  var html = '<!DOCTYPE html><html><head><base target="_top"><style>'
    + 'body{font-family:Arial,"Noto Sans JP",sans-serif;padding:16px;color:#202124;background:#fff}'
    + 'h2{font-size:18px;color:#0b8043;margin:0 0 8px}.help{font-size:12px;color:#5f6368;line-height:1.6;margin-bottom:14px}'
    + '.card{background:#f6f9f7;border:1px solid #d7e7dc;border-radius:8px;padding:11px;margin-bottom:12px;line-height:1.55}'
    + '.title{font-weight:700}.meta{font-size:12px;color:#5f6368;margin-top:5px}.grid{display:grid;gap:9px}'
    + 'button{width:100%;border:0;border-radius:7px;padding:11px 10px;font-weight:700;cursor:pointer;text-align:left}'
    + '.primary{background:#0b8043;color:white}.secondary{background:#e8f0fe;color:#174ea6}.plain{background:#f1f3f4;color:#3c4043}'
    + '.disabled{background:#f8f9fa;color:#9aa0a6;cursor:not-allowed}.msg{font-size:12px;color:#5f6368;margin-top:12px;min-height:18px}'
    + '</style></head><body>'
    + '<h2>記事DBツールバー</h2><div class="help">記事DBで対象記事の行を選択してから操作してください。選択を変えた場合は「選択記事を更新」を押します。</div>'
    + '<div id="card" class="card">選択記事を確認しています…</div>'
    + '<div class="grid">'
    + '<button class="plain" onclick="refreshSelection()">↻ 選択記事を更新</button>'
    + '<button class="primary" onclick="openDetail()">🔍 記事詳細</button>'
    + '<button class="secondary" onclick="openArticle()">🌐 記事を開く</button>'
    + '<button class="disabled" disabled>✏️ 改善ブリーフ（準備中）</button>'
    + '<button class="disabled" disabled>📈 効果測定（準備中）</button>'
    + '<button class="primary" onclick="registerFeedback()">✅ 改善結果を登録（JSON）</button>'
    + '</div><div id="msg" class="msg"></div>'
    + '<script>'
    + 'var selected=null;function setMsg(t){document.getElementById("msg").textContent=t||"";}'
    + 'function render(d){selected=d||null;var c=document.getElementById("card");if(!d||!d.ok){c.innerHTML="<b>記事が選択されていません。</b><br><span class=meta>記事DBの見出し以外の行を選択してください。</span>";return;}c.innerHTML="<div class=title>"+esc(d.title||"（タイトル未取得）")+"</div><div class=meta>"+esc((d.rank||"")+" / "+(d.work||""))+"</div>";}'
    + 'function esc(v){return String(v||"").replace(/[&<>\"]/g,function(ch){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[ch];});}'
    + 'function refreshSelection(){setMsg("選択記事を確認しています…");google.script.run.withFailureHandler(function(e){setMsg((e&&e.message)||String(e));}).withSuccessHandler(function(d){render(d);setMsg("");}).sbmGetSelectedArticleDbSummary();}'
    + 'function openDetail(){setMsg("記事詳細を開いています…");google.script.run.withFailureHandler(function(e){setMsg((e&&e.message)||String(e));}).withSuccessHandler(function(){setMsg("");refreshSelection();}).sbmOpenSelectedArticleDbDetail();}'
    + 'function openArticle(){setMsg("記事URLを確認しています…");google.script.run.withFailureHandler(function(e){setMsg((e&&e.message)||String(e));}).withSuccessHandler(function(d){if(d&&d.url){window.open(d.url,"_blank");setMsg("");}else{setMsg("記事URLを取得できませんでした。");}}).sbmGetSelectedArticleDbSummary();}'
    + 'function registerFeedback(){setMsg("改善結果登録画面を開いています…");google.script.run.withFailureHandler(function(e){setMsg((e&&e.message)||String(e));}).withSuccessHandler(function(){setMsg("");}).sbmOpenImprovementFeedbackDialog();}'
    + 'refreshSelection();</script></body></html>';
  SpreadsheetApp.getUi().showSidebar(HtmlService.createHtmlOutput(html).setTitle('記事DBツールバー'));
}


function sbmOpenSelectedArticleUrl() {
  var d = sbmGetSelectedArticleDbSummary();
  if (!d || !d.ok || !d.url) return sbmAlert_('記事を開けません', '記事DBで対象記事の行を選択してください。');
  var e = sbmEscapeHtml_;
  var html = '<div style="font-family:Arial,sans-serif;padding:20px;line-height:1.7"><h2 style="color:#0b8043;margin-top:0">記事を開く</h2><p><b>' + e(d.title || '選択記事') + '</b></p><p><a href="' + e(d.url) + '" target="_blank" style="display:inline-block;background:#1a73e8;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;font-weight:700">ブラウザで記事を開く</a></p></div>';
  SpreadsheetApp.getUi().showModalDialog(sbmEnsureCloseButton_(HtmlService.createHtmlOutput(html).setWidth(460).setHeight(240)), '記事を開く');
}

function sbmFetchOnlyManual(silent) {
  silent = silent === true;
  if (!sbmIsSetupComplete_() || sbmGetSetting_('ConnectionStatus','') !== 'OK') {
    return sbmAlert_('データ取得はまだできません', 'STEP1〜STEP3を完了してから実行してください。');
  }
  var ui = SpreadsheetApp.getUi();
  if (!silent) {
    var res = ui.alert('本日のデータ収集をスタートします！', 'Search Consoleから最新データを取得します。\n\n処理中は他のメニューを実行しないでください。\nシートの閲覧は可能ですが、編集はしないでください。', ui.ButtonSet.OK_CANCEL);
    if (res !== ui.Button.OK) return;
  }
  var started = new Date();
  var startedText = sbmNowText_();
  var profiler = sbmCreateProfiler_('STEP A Search Consoleデータ取得');
  try {
    profiler.lap('開始前チェック', '', '', 'セットアップ完了・接続OKを確認');
    var fetchStarted = new Date();
    var rows = sbmFetchSearchConsoleQueriesProfiled_(profiler);
    var apiSec = sbmSecondsSince_(fetchStarted);
    profiler.lap('Search Console取得合計', '', rows.length, '取得合計 ' + apiSec + '秒 / 取得方式 ' + sbmGetSetting_('LastFetchMode','') + ' / URL数 ' + sbmGetSetting_('LastFetchPageCount','') + '件 / クエリ詳細 ' + sbmGetSetting_('LastFetchQueryDetailPages','') + '件 / 上限到達 ' + sbmGetSetting_('LastFetchHitLimit',''));

    var writeStarted = new Date();
    sbmWriteRawQueryDataLight_(rows);
    var writeSec = sbmSecondsSince_(writeStarted);
    profiler.lap('SearchConsole_Data書込', rows.length, rows.length, 'シート書込 ' + writeSec + '秒');
    var metaStarted = new Date();
    var metaResult = sbmUpdateDataListAfterFetch_(rows, false);
    var metaSec = sbmSecondsSince_(metaStarted);
    profiler.lap('データ一覧反映', rows.length, (metaResult && metaResult.total) || 0, 'データ一覧反映 ' + metaSec + '秒 / 記事情報補完 0件（STEP A-2へ分離）');

    var settingsStarted = new Date();
    var sec = sbmSecondsSince_(started);
    sbmSetSetting_('LastFetchDate', sbmDateText_(new Date()), '最終取得日');
    sbmSetSetting_('LastFetchRows', rows.length, '直近のSearch Console取得行数');
    sbmSetSetting_('LastFetchSeconds', sec, '直近のSearch Console取得秒数');
    sbmSetSetting_('LastFetchAt', sbmNowText_(), '直近のSearch Console取得日時');
    profiler.lap('設定保存', '', '', 'LastFetch系設定を保存 / ' + sbmSecondsSince_(settingsStarted) + '秒');

    sbmProcessLog_('STEP A Search Consoleデータ取得', '完了', rows.length, rows.length, sec, 'API取得 ' + apiSec + '秒 / シート書込 ' + writeSec + '秒 / データ一覧反映 ' + metaSec + '秒 / 記事情報補完 0件（STEP A-2へ分離） / 取得方式 ' + sbmGetSetting_('LastFetchMode','') + ' / URL数 ' + sbmGetSetting_('LastFetchPageCount','') + '件 / クエリ詳細 ' + sbmGetSetting_('LastFetchQueryDetailPages','') + '件 / 上限到達 ' + sbmGetSetting_('LastFetchHitLimit',''), startedText, sbmNowText_());
    profiler.lap('処理ログ記録', rows.length, rows.length, '処理ログへ完了記録');

    sbmLog_('FetchOnly','Done', rows.length + ' rows / ' + sec + ' sec');
    profiler.lap('Home完了表示', '', '', '完了表示をHomeへ反映');
    var runId = profiler.finish('完了', '総所要 ' + sec + '秒 / 取得 ' + rows.length + '行 / データ一覧 ' + ((metaResult && metaResult.total)||0) + '件');

    if (!silent) sbmAlert_('データ取得完了', 'Search Consoleデータの取得が完了しました。\n取得件数: ' + rows.length + '件\n所要時間: ' + sec + '秒\n処理プロファイル: ' + runId + '\n\n必要に応じて「STEP A-2 記事情報を補完」を実行してから、STEP Bへ進んでください。');
  } catch (e) {
    var secErr = sbmSecondsSince_(started);
    profiler.lap('エラー発生', '', '', String(e));
    var runErr = profiler.finish('エラー', String(e));
    sbmProcessLog_('STEP A Search Consoleデータ取得', 'エラー', '', '', secErr, String(e) + ' / 処理プロファイル ' + runErr, startedText, sbmNowText_());
    sbmLog_('FetchOnly','Error',String(e));
    sbmAlert_('データ取得エラー', sbmFriendlyGscError_(String(e)) + '\n\n処理プロファイル: ' + runErr);
  }
}

function sbmGetDailyFetchLimit_() {
  var n = Number(sbmGetSetting_('DailyFetchMaxRows', SBM_DEFAULTS.DAILY_FETCH_MAX_ROWS));
  if (!n || n < 100) n = SBM_DEFAULTS.DAILY_FETCH_MAX_ROWS;
  return Math.min(n, 5000);
}

function sbmAnalyzeOnlyManual(silent) {
  silent = silent === true;
  sbmEnsureStepBMinimalSheets_();
  var started = new Date();
  var startedText = sbmNowText_();
  var profiler = sbmCreateProfiler_('STEP B 改善候補分析');
  var qRows = sbmGetRawQueryRows_();
  profiler.lap('取得済みデータ読込', qRows.length, qRows.length, 'SearchConsole_Dataから読み込み');
  if (!qRows.length) return sbmAlert_('分析できません', '先に「STEP A Search Consoleデータ取得だけ実行」を実行してください。');
  try {
    var tDiagnosis = new Date();
    var result = sbmBuildDiagnosis_();
    profiler.lap('改善候補抽出', (result && result.targetCount) || '', (result && result.analyzedCount) || '', '候補 ' + ((result && result.diagnosisCount) || 0) + '件 / ' + sbmSecondsSince_(tDiagnosis) + '秒');
    var tToday = new Date();
    sbmBuildTodayQueue_();
    profiler.lap('今日の改善・改善ブリーフ作成', '', sbmGetSetting_('DisplayedImprovementCount',''), sbmSecondsSince_(tToday) + '秒');
    var tProgress = new Date();
    sbmBuildInProgressSheet_();
    profiler.lap('改善中シート更新', '', '', sbmSecondsSince_(tProgress) + '秒');

    // Product 5.0 timeout fix:
    // STEP Bではデータ一覧の全再構築・タイトル補正・外部取得を行わない。
    // データ一覧はSTEP Aで作成済みの共通マスターを参照し、STEP Bは改善候補作成に専念する。
    var dataListCount = sbmRowsAsObjects_(SBM_SHEETS.QUERY_DATA).length;
    profiler.lap('データ一覧更新スキップ', dataListCount, 0, 'STEP B軽量化のため再構築しません。データ一覧更新はSTEP Aまたは専用メニューで実施。');

    var tCleanup = new Date();
    sbmRemoveRetiredSheets_();
    sbmApplyProductVisibleTabs_();
    profiler.lap('不要シート整理', '', '', sbmSecondsSince_(tCleanup) + '秒');

    var tHome = new Date();
    sbmRefreshHome_();
    profiler.lap('Home集計更新', '', '', sbmSecondsSince_(tHome) + '秒');

    var sec = sbmSecondsSince_(started);
    sbmSetSetting_('LastAnalysisDate', sbmDateText_(new Date()), '最終分析日');
    sbmSetSetting_('LastProcessSummary', 'STEP B 改善候補分析 / 完了 / ' + sec + '秒', '直近処理');
    var managed = (result && result.managedCount) || sbmGetSetting_('ManagedArticleCount','');
    var total = sbmGetSetting_('ImprovementCandidateCount','0');
    var shown = sbmGetSetting_('DisplayedImprovementCount','0');
    var runId = profiler.finish('完了', '総所要 ' + sec + '秒 / 管理対象 ' + managed + '件 / 分析 ' + ((result && result.analyzedCount)||'') + '件 / 改善候補 ' + total + '件 / データ一覧再構築なし');
    sbmProcessLog_('STEP B 改善候補分析', '完了', (result && result.targetCount) || '', (result && result.analyzedCount) || '', sec, '改善候補 ' + total + '件 / 表示 ' + shown + '件 / データ一覧再構築なし / ProfileRunId ' + runId, startedText, sbmNowText_());
    sbmLog_('AnalyzeOnly','Done','managed=' + managed + ', candidates=' + total + ', shown=' + shown + ', sec=' + sec + ', profile=' + runId + ', datalist=skip');
    sbmRefreshHome_();
    if (!silent) sbmAlert_('改善分析完了', '改善候補を作成しました。\n管理対象記事: ' + managed + '件\n分析記事: ' + ((result && result.analyzedCount)||'') + '件\n改善候補: ' + total + '件\n表示中: ' + shown + '件\nデータ一覧: STEP Aの結果を使用\n所要時間: ' + sec + '秒\n\n開発用プロファイル: ' + runId);
  } catch(e) {
    var secErr = sbmSecondsSince_(started);
    var runErr = profiler.finish('エラー', String(e));
    sbmProcessLog_('STEP B 改善候補分析', 'エラー', qRows.length, '途中', secErr, String(e) + ' / ProfileRunId ' + runErr, startedText, sbmNowText_());
    sbmLog_('AnalyzeOnly','Error',String(e));
    sbmAlert_('改善分析エラー', String(e));
  }
}

function sbmTestSearchConsoleConnection_() {
  try {
    var range = sbmSearchConsoleDateRange_();
    var property = sbmGetSetting_('SearchConsoleProperty','');
    var data = sbmSearchConsoleApiRequest_(property, {startDate: range.startDate, endDate: range.endDate, dimensions: ['page'], rowLimit: 1});
    return {ok:true, rows:(data.rows||[]).length};
  } catch(e) {
    return {ok:false, message:String(e)};
  }
}

function sbmFetchSearchConsoleQueries_() {
  var mode = String(sbmGetSetting_('FetchMode', 'PAGE_FIRST')).toUpperCase();
  if (mode === 'PAGE_FIRST') return sbmFetchSearchConsolePageFirst_();
  return sbmFetchSearchConsoleQueryPage_();
}

function sbmFetchSearchConsoleQueriesProfiled_(profiler) {
  var mode = String(sbmGetSetting_('FetchMode', 'PAGE_FIRST')).toUpperCase();
  if (profiler) profiler.lap('取得方式判定', '', '', 'FetchMode=' + mode);
  if (mode === 'PAGE_FIRST') return sbmFetchSearchConsolePageFirstProfiled_(profiler);
  return sbmFetchSearchConsoleQueryPageProfiled_(profiler);
}

function sbmFetchSearchConsoleQueryPageProfiled_(profiler) {
  var tRange = new Date();
  var range = sbmSearchConsoleDateRange_();
  var property = sbmGetSetting_('SearchConsoleProperty','');
  if (profiler) profiler.lap('取得条件準備', '', '', '期間 ' + range.startDate + '〜' + range.endDate + ' / ' + sbmSecondsSince_(tRange) + '秒');

  var limit = sbmGetDailyFetchLimit_();
  var tApi = new Date();
  var data = sbmSearchConsoleApiRequest_(property, {startDate: range.startDate, endDate: range.endDate, dimensions: ['query','page'], rowLimit: limit});
  var rawCount = (data.rows || []).length;
  if (profiler) profiler.lap('API取得 query×page', limit, rawCount, 'rowLimit=' + limit + ' / ' + sbmSecondsSince_(tApi) + '秒');

  var capturedAt = sbmNowText_();
  var tNormalize = new Date();
  var fragmentCount = 0;
  var rows = (data.rows || []).map(function(r){
    var originalUrl = r.keys && r.keys[1] ? String(r.keys[1]) : '';
    if (originalUrl.indexOf('#') >= 0) fragmentCount++;
    return [range.startDate, range.endDate, r.keys[0], sbmNormalizeUrl_(originalUrl), r.clicks || 0, r.impressions || 0, r.ctr || 0, r.position || 0, capturedAt];
  }).filter(function(r){ return !!r[3] && sbmIsValidArticleUrl_(r[3]); });
  if (profiler) profiler.lap('URL正規化・記事URL抽出', rawCount, rows.length, '#付きURL ' + fragmentCount + '件 / 除外 ' + (rawCount - rows.length) + '件 / ' + sbmSecondsSince_(tNormalize) + '秒');

  var tSettings = new Date();
  sbmSetSetting_('LastFetchMode', 'QUERY_PAGE', '直近のSearch Console取得方式');
  sbmSetSetting_('LastFetchPageCount', sbmUniqueCount_(rows.map(function(r){return r[3];})), '直近取得記事URL数');
  sbmSetSetting_('LastFetchQueryDetailPages', '', '直近でクエリ詳細を取得したページ数');
  sbmSetSetting_('LastFetchHitLimit', rows.length >= limit ? 'YES' : 'NO', '取得件数がDailyFetchMaxRowsに到達したか');
  if (profiler) profiler.lap('取得結果設定保存', '', '', sbmSecondsSince_(tSettings) + '秒');
  return rows;
}

function sbmFetchSearchConsolePageFirstProfiled_(profiler) {
  var tRange = new Date();
  var range = sbmSearchConsoleDateRange_();
  var property = sbmGetSetting_('SearchConsoleProperty','');
  var capturedAt = sbmNowText_();
  var pageLimit = sbmNumber_(sbmGetSetting_('PageFetchMaxRows', SBM_DEFAULTS.PAGE_FETCH_MAX_ROWS)) || SBM_DEFAULTS.PAGE_FETCH_MAX_ROWS;
  pageLimit = Math.max(100, Math.min(25000, pageLimit));
  var queryPageLimit = sbmNumber_(sbmGetSetting_('QueryFetchPageLimit', SBM_DEFAULTS.QUERY_FETCH_PAGE_LIMIT)) || SBM_DEFAULTS.QUERY_FETCH_PAGE_LIMIT;
  queryPageLimit = Math.max(0, Math.min(200, queryPageLimit));
  if (profiler) profiler.lap('取得条件準備', '', '', '期間 ' + range.startDate + '〜' + range.endDate + ' / pageLimit=' + pageLimit + ' / queryPageLimit=' + queryPageLimit + ' / ' + sbmSecondsSince_(tRange) + '秒');

  var tPageApi = new Date();
  var pageData = sbmSearchConsoleApiRequest_(property, {startDate: range.startDate, endDate: range.endDate, dimensions: ['page'], rowLimit: pageLimit});
  var rawPageRows = pageData.rows || [];
  if (profiler) profiler.lap('API取得 page一覧', pageLimit, rawPageRows.length, 'page rowLimit=' + pageLimit + ' / ' + sbmSecondsSince_(tPageApi) + '秒');

  var tNormalize = new Date();
  var fragmentCount = 0;
  var pageRows = rawPageRows.map(function(r){
    var originalUrl = r.keys && r.keys[0] ? String(r.keys[0]) : '';
    if (originalUrl.indexOf('#') >= 0) fragmentCount++;
    var url = sbmNormalizeUrl_(originalUrl);
    return {url:url, clicks:r.clicks || 0, impressions:r.impressions || 0, ctr:r.ctr || 0, position:r.position || 0};
  }).filter(function(r){ return !!r.url && sbmIsValidArticleUrl_(r.url); });
  if (profiler) profiler.lap('URL正規化・記事URL抽出', rawPageRows.length, pageRows.length, '#付きURL ' + fragmentCount + '件 / 除外 ' + (rawPageRows.length - pageRows.length) + '件 / ' + sbmSecondsSince_(tNormalize) + '秒');

  var tSelect = new Date();
  var selected = pageRows.slice().sort(function(a,b){ return sbmPagePriorityScore_(b) - sbmPagePriorityScore_(a); }).slice(0, queryPageLimit);
  var selectedMap = {};
  selected.forEach(function(p){ selectedMap[p.url] = true; });
  if (profiler) profiler.lap('クエリ詳細対象選定', pageRows.length, selected.length, '優先度上位ページを選定 / ' + sbmSecondsSince_(tSelect) + '秒');

  var rows = [];
  var detailPages = 0;
  var detailRows = 0;
  var detailErrors = 0;
  var tDetailAll = new Date();
  selected.forEach(function(p, idx){
    var tOne = new Date();
    try {
      var qdata = sbmSearchConsoleApiRequest_(property, {
        startDate: range.startDate,
        endDate: range.endDate,
        dimensions: ['query','page'],
        rowLimit: Math.max(10, Math.min(100, Number(sbmGetSetting_('RelatedQueries', SBM_DEFAULTS.RELATED_QUERIES)) || 50)),
        dimensionFilterGroups: [{filters:[{dimension:'page', operator:'equals', expression:p.url}]}]
      });
      var qrows = qdata.rows || [];
      if (qrows.length) {
        qrows.forEach(function(r){ rows.push([range.startDate, range.endDate, r.keys[0], sbmNormalizeUrl_(r.keys[1] || p.url), r.clicks || 0, r.impressions || 0, r.ctr || 0, r.position || 0, capturedAt]); });
        detailPages++;
        detailRows += qrows.length;
      } else {
        rows.push([range.startDate, range.endDate, '', p.url, p.clicks, p.impressions, p.ctr, p.position, capturedAt]);
      }
    } catch(e) {
      detailErrors++;
      rows.push([range.startDate, range.endDate, '', p.url, p.clicks, p.impressions, p.ctr, p.position, capturedAt]);
    }
    if (profiler && ((idx + 1) % 10 === 0 || idx + 1 === selected.length)) {
      profiler.lap('クエリ詳細取得進捗', selected.length, idx + 1, '詳細取得済み ' + (idx + 1) + '/' + selected.length + ' / 累計クエリ行 ' + detailRows + ' / エラー ' + detailErrors + '件 / 直近 ' + sbmSecondsSince_(tOne) + '秒');
    }
  });
  if (profiler) profiler.lap('API取得 query詳細合計', selected.length, detailRows, '詳細取得ページ ' + detailPages + '件 / エラー ' + detailErrors + '件 / ' + sbmSecondsSince_(tDetailAll) + '秒');

  var tAppend = new Date();
  var appended = 0;
  pageRows.forEach(function(p){ if (!selectedMap[p.url]) { rows.push([range.startDate, range.endDate, '', p.url, p.clicks, p.impressions, p.ctr, p.position, capturedAt]); appended++; } });
  if (profiler) profiler.lap('page一覧行の追加', pageRows.length, appended, 'クエリ詳細対象外をpage行として追加 / ' + sbmSecondsSince_(tAppend) + '秒');

  var tSettings = new Date();
  sbmSetSetting_('LastFetchMode', 'PAGE_FIRST', '直近のSearch Console取得方式');
  sbmSetSetting_('LastFetchPageCount', pageRows.length, '直近取得記事URL数');
  sbmSetSetting_('LastFetchQueryDetailPages', detailPages, '直近でクエリ詳細を取得したページ数');
  sbmSetSetting_('LastFetchHitLimit', pageRows.length >= pageLimit ? 'YES' : 'NO', 'ページ取得件数がPageFetchMaxRowsに到達したか');
  if (profiler) profiler.lap('取得結果設定保存', '', '', sbmSecondsSince_(tSettings) + '秒');
  return rows;
}

function sbmFetchSearchConsoleQueryPage_() {
  var range = sbmSearchConsoleDateRange_();
  var property = sbmGetSetting_('SearchConsoleProperty','');
  var data = sbmSearchConsoleApiRequest_(property, {startDate: range.startDate, endDate: range.endDate, dimensions: ['query','page'], rowLimit: sbmGetDailyFetchLimit_()});
  var capturedAt = sbmNowText_();
  var rows = (data.rows || []).map(function(r){
    return [range.startDate, range.endDate, r.keys[0], sbmNormalizeUrl_(r.keys[1]), r.clicks || 0, r.impressions || 0, r.ctr || 0, r.position || 0, capturedAt];
  }).filter(function(r){ return !!r[3] && sbmIsValidArticleUrl_(r[3]); });
  sbmSetSetting_('LastFetchMode', 'QUERY_PAGE', '直近のSearch Console取得方式');
  sbmSetSetting_('LastFetchPageCount', sbmUniqueCount_(rows.map(function(r){return r[3];})), '直近取得記事URL数');
  sbmSetSetting_('LastFetchQueryDetailPages', '', '直近でクエリ詳細を取得したページ数');
  sbmSetSetting_('LastFetchHitLimit', rows.length >= sbmGetDailyFetchLimit_() ? 'YES' : 'NO', '取得件数がDailyFetchMaxRowsに到達したか');
  return rows;
}

function sbmFetchSearchConsolePageFirst_() {
  var range = sbmSearchConsoleDateRange_();
  var property = sbmGetSetting_('SearchConsoleProperty','');
  var capturedAt = sbmNowText_();
  var pageLimit = sbmNumber_(sbmGetSetting_('PageFetchMaxRows', SBM_DEFAULTS.PAGE_FETCH_MAX_ROWS)) || SBM_DEFAULTS.PAGE_FETCH_MAX_ROWS;
  pageLimit = Math.max(100, Math.min(25000, pageLimit));
  var queryPageLimit = sbmNumber_(sbmGetSetting_('QueryFetchPageLimit', SBM_DEFAULTS.QUERY_FETCH_PAGE_LIMIT)) || SBM_DEFAULTS.QUERY_FETCH_PAGE_LIMIT;
  queryPageLimit = Math.max(0, Math.min(200, queryPageLimit));

  var pageData = sbmSearchConsoleApiRequest_(property, {startDate: range.startDate, endDate: range.endDate, dimensions: ['page'], rowLimit: pageLimit});
  var pageRows = (pageData.rows || []).map(function(r){
    var url = sbmNormalizeUrl_(r.keys && r.keys[0]);
    return {url:url, clicks:r.clicks || 0, impressions:r.impressions || 0, ctr:r.ctr || 0, position:r.position || 0};
  }).filter(function(r){ return !!r.url && sbmIsValidArticleUrl_(r.url); });

  var selected = pageRows.slice().sort(function(a,b){ return sbmPagePriorityScore_(b) - sbmPagePriorityScore_(a); }).slice(0, queryPageLimit);
  var selectedMap = {};
  selected.forEach(function(p){ selectedMap[p.url] = true; });

  var rows = [];
  var detailPages = 0;
  selected.forEach(function(p){
    try {
      var qdata = sbmSearchConsoleApiRequest_(property, {
        startDate: range.startDate,
        endDate: range.endDate,
        dimensions: ['query','page'],
        rowLimit: Math.max(10, Math.min(100, Number(sbmGetSetting_('RelatedQueries', SBM_DEFAULTS.RELATED_QUERIES)) || 50)),
        dimensionFilterGroups: [{filters:[{dimension:'page', operator:'equals', expression:p.url}]}]
      });
      var qrows = qdata.rows || [];
      if (qrows.length) {
        qrows.forEach(function(r){ rows.push([range.startDate, range.endDate, r.keys[0], sbmNormalizeUrl_(r.keys[1] || p.url), r.clicks || 0, r.impressions || 0, r.ctr || 0, r.position || 0, capturedAt]); });
        detailPages++;
      } else {
        rows.push([range.startDate, range.endDate, '', p.url, p.clicks, p.impressions, p.ctr, p.position, capturedAt]);
      }
    } catch(e) {
      rows.push([range.startDate, range.endDate, '', p.url, p.clicks, p.impressions, p.ctr, p.position, capturedAt]);
    }
  });
  pageRows.forEach(function(p){ if (!selectedMap[p.url]) rows.push([range.startDate, range.endDate, '', p.url, p.clicks, p.impressions, p.ctr, p.position, capturedAt]); });

  sbmSetSetting_('LastFetchMode', 'PAGE_FIRST', '直近のSearch Console取得方式');
  sbmSetSetting_('LastFetchPageCount', pageRows.length, '直近取得記事URL数');
  sbmSetSetting_('LastFetchQueryDetailPages', detailPages, '直近でクエリ詳細を取得したページ数');
  sbmSetSetting_('LastFetchHitLimit', pageRows.length >= pageLimit ? 'YES' : 'NO', 'ページ取得件数がPageFetchMaxRowsに到達したか');
  return rows;
}

function sbmPagePriorityScore_(p) {
  var impressions = sbmNumber_(p.impressions);
  var clicks = sbmNumber_(p.clicks);
  var ctr = sbmNumber_(p.ctr);
  var pos = sbmNumber_(p.position);
  var posBonus = 0;
  if (pos >= 4 && pos <= 10) posBonus = 120;
  else if (pos > 10 && pos <= 20) posBonus = 90;
  else if (pos > 20 && pos <= 30) posBonus = 60;
  else if (pos > 30 && pos <= 50) posBonus = 20;
  var lowCtrBonus = ctr < 0.03 ? 80 : (ctr < 0.06 ? 40 : 0);
  return Math.log(impressions + 1) * 30 + posBonus + lowCtrBonus + Math.log(clicks + 1) * 5;
}

function sbmUniqueCount_(arr) {
  var m = {};
  (arr || []).forEach(function(v){ if (v) m[v] = true; });
  return Object.keys(m).length;
}



/**
 * Product 5.2.5: 改善ナビ起動時に対象URLの最新クエリを毎回取得します。
 * 取得結果はSearchConsole_Dataへ保存し、依頼文と内部リンク候補の両方に利用します。
 */
function sbmFetchTopQueriesForUrlNow_(url, limit) {
  var originalUrl = String(url || '').trim().split('#')[0].split('?')[0];
  var normalizedUrl = sbmNormalizeUrl_(originalUrl);
  limit = Math.max(1, Math.min(100, Number(limit || 20)));
  if (!normalizedUrl) return {ok:false, queries:[], message:'記事URLが正しくありません。'};
  var property = sbmGetSetting_('SearchConsoleProperty','');
  if (!property) return {ok:false, queries:[], message:'Search Consoleプロパティが設定されていません。'};
  try {
    var range = sbmSearchConsoleDateRange_();
    var variants = [];
    function addVariant(v){ v=String(v||'').trim(); if(v && variants.indexOf(v)<0) variants.push(v); }
    addVariant(originalUrl);
    addVariant(normalizedUrl);
    addVariant(normalizedUrl.replace(/\/$/,''));
    addVariant(normalizedUrl + (normalizedUrl.slice(-1)==='/'?'':'/'));

    var apiRows = [];
    var matchedUrl = '';
    for (var vi=0; vi<variants.length && !apiRows.length; vi++) {
      var data = sbmSearchConsoleApiRequest_(property, {
        startDate: range.startDate,
        endDate: range.endDate,
        dimensions: ['query'],
        // 上位20件の判断に25,000行は不要。API応答と実行時間を優先します。
        rowLimit: 250,
        dimensionFilterGroups: [{filters:[{dimension:'page', operator:'equals', expression:variants[vi]}]}]
      });
      apiRows = data.rows || [];
      if (apiRows.length) matchedUrl = variants[vi];
    }

    // Canonical URLや末尾スラッシュ差でequalsが0件の場合は、query×pageを取得して正規化照合します。
    if (!apiRows.length) {
      var pathMatch = normalizedUrl.match(/^https?:\/\/[^/]+(\/.*)$/i);
      var pathExpr = pathMatch ? pathMatch[1].replace(/\/$/,'') : '';
      if (pathExpr) {
        var fallback = sbmSearchConsoleApiRequest_(property, {
          startDate: range.startDate,
          endDate: range.endDate,
          dimensions: ['query','page'],
          // フォールバックは候補確認用に限定し、大量取得によるタイムアウトを防ぎます。
          rowLimit: 1000,
          dimensionFilterGroups: [{filters:[{dimension:'page', operator:'contains', expression:pathExpr}]}]
        });
        apiRows = (fallback.rows || []).filter(function(r){
          return r.keys && r.keys.length > 1 && sbmNormalizeUrl_(r.keys[1]) === normalizedUrl;
        }).map(function(r){
          return {keys:[r.keys[0]], clicks:r.clicks, impressions:r.impressions, ctr:r.ctr, position:r.position};
        });
        if (apiRows.length) matchedUrl = normalizedUrl;
      }
    }

    var capturedAt = sbmNowText_();
    var queries = apiRows.map(function(r){
      return {
        query: r.keys && r.keys[0] ? String(r.keys[0]) : '',
        clicks: sbmNumber_(r.clicks || 0),
        imps: sbmNumber_(r.impressions || 0),
        ctr: sbmNormalizeCtrNumber_(r.ctr || 0),
        position: sbmNumber_(r.position || 0)
      };
    }).filter(function(r){ return r.query; });
    queries.sort(function(a,b){
      return (b.clicks-a.clicks) || (b.imps-a.imps) || (a.position-b.position);
    });
    // 改善ナビでは取得結果をそのまま利用します。
    // SearchConsole_Data全体の読み直し・全件書き換えは行わず、タイムアウトと画面遷移を防ぎます。
    return {
      ok:true,
      queries:queries.slice(0, limit),
      total:queries.length,
      fetchedAt:capturedAt,
      startDate:range.startDate,
      endDate:range.endDate,
      matchedUrl:matchedUrl,
      message:queries.length ? ('最新クエリを'+queries.length+'件取得しました。') : '対象URLに一致するクエリは取得できませんでした。'
    };
  } catch(e) {
    return {ok:false, queries:[], message:'最新クエリの取得に失敗しました。'+String(e && e.message || e)};
  }
}

function sbmReplaceRawQueriesForUrl_(url, range, capturedAt, queries) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var originalSheet = ss.getActiveSheet();
  var sh = ss.getSheetByName(SBM_SHEETS.RAW_DATA) || sbmGetOrCreateSheet_(SBM_SHEETS.RAW_DATA);
  sbmEnsureHeaders_(sh, SBM_HEADERS.RAW_DATA);
  var values = sh.getLastRow() >= 2 ? sh.getRange(2,1,sh.getLastRow()-1,SBM_HEADERS.RAW_DATA.length).getValues() : [];
  var normalized = sbmNormalizeUrl_(url);
  values = values.filter(function(row){
    var rowUrl = sbmNormalizeUrl_(row[3] || '');
    var query = String(row[2] || '').trim();
    return !(rowUrl === normalized && query);
  });
  (queries || []).forEach(function(q){
    values.push([range.startDate, range.endDate, q.query, normalized, q.clicks, q.imps, q.ctr, q.position, capturedAt]);
  });
  if (sh.getLastRow() > 1) sh.getRange(2,1,sh.getLastRow()-1,SBM_HEADERS.RAW_DATA.length).clearContent();
  if (values.length) sh.getRange(2,1,values.length,SBM_HEADERS.RAW_DATA.length).setValues(values);
  SpreadsheetApp.flush();
  // Product 5.2.5: 内部保存用シートを利用者画面に残さない。
  try {
    if (originalSheet && originalSheet.getSheetId() !== sh.getSheetId()) {
      ss.setActiveSheet(originalSheet);
      originalSheet.activate();
      sh.hideSheet();
    }
  } catch (restoreError) {
    sbmLog_('QuerySheetRestore', 'Warning', String(restoreError));
  }
}

function sbmFetchMainQueryForUrl_(url) {
  try {
    url = sbmNormalizeUrl_(url || '');
    if (!url) return '';
    var range = sbmSearchConsoleDateRange_();
    var property = sbmGetSetting_('SearchConsoleProperty','');
    if (!property) return '';
    var data = sbmSearchConsoleApiRequest_(property, {
      startDate: range.startDate,
      endDate: range.endDate,
      dimensions: ['query'],
      rowLimit: 10,
      dimensionFilterGroups: [{filters:[{dimension:'page', operator:'equals', expression:url}]}]
    });
    var rows = data.rows || [];
    if (!rows.length) return '';
    rows.sort(function(a,b){
      var as = sbmNumber_(a.clicks || 0) * 1000 + sbmNumber_(a.impressions || 0);
      var bs = sbmNumber_(b.clicks || 0) * 1000 + sbmNumber_(b.impressions || 0);
      return bs - as;
    });
    return rows[0].keys && rows[0].keys[0] ? String(rows[0].keys[0]) : '';
  } catch(e) {
    return '';
  }
}

function sbmSearchConsoleDateRange_() {
  var days = Number(sbmGetSetting_('SearchDays', SBM_DEFAULTS.SEARCH_DAYS)) || SBM_DEFAULTS.SEARCH_DAYS;
  var end = new Date();
  end.setDate(end.getDate() - SBM_DEFAULTS.GSC_DELAY_DAYS);
  var start = new Date(end);
  start.setDate(start.getDate() - days + 1);
  return {startDate: sbmDateText_(start), endDate: sbmDateText_(end)};
}

function sbmSearchConsoleApiRequest_(property, body) {
  var endpoint = 'https://www.googleapis.com/webmasters/v3/sites/' + encodeURIComponent(property) + '/searchAnalytics/query';
  var response = UrlFetchApp.fetch(endpoint, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(body),
    headers: {Authorization: 'Bearer ' + ScriptApp.getOAuthToken()},
    muteHttpExceptions: true
  });
  var code = response.getResponseCode();
  var text = response.getContentText();
  if (code < 200 || code >= 300) throw new Error('Search Console API error ' + code + ': ' + text);
  return JSON.parse(text || '{}');
}

function sbmWriteQueryData_(rows) {
  sbmWriteRawQueryDataLight_(rows);
}

function sbmWriteRawQueryDataLight_(rows) {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SBM_SHEETS.RAW_DATA) || sbmGetOrCreateSheet_(SBM_SHEETS.RAW_DATA);
  sh.clearContents();
  sbmEnsureHeaders_(sh, SBM_HEADERS.RAW_DATA);
  if (rows.length) sh.getRange(2,1,rows.length,SBM_HEADERS.RAW_DATA.length).setValues(rows);
  try { sh.hideSheet(); } catch(e) {}
}

function sbmGetRawQueryRows_() {
  var raw = sbmRowsAsObjects_(SBM_SHEETS.RAW_DATA);
  if (raw.length) return raw;
  var visible = sbmRowsAsObjects_(SBM_SHEETS.QUERY_DATA);
  if (visible.length && Object.prototype.hasOwnProperty.call(visible[0], 'Query') && Object.prototype.hasOwnProperty.call(visible[0], 'URL')) {
    return visible;
  }
  return [];
}

function sbmEnsureStepBMinimalSheets_() {
  sbmEnsureHeaders_(sbmGetOrCreateSheet_(SBM_SHEETS.RAW_DATA), SBM_HEADERS.RAW_DATA);
  sbmEnsureHeaders_(sbmGetOrCreateSheet_(SBM_SHEETS.QUERY_DATA), SBM_HEADERS.QUERY_DATA);
  sbmEnsureHeaders_(sbmGetOrCreateSheet_(SBM_SHEETS.DIAGNOSIS), SBM_HEADERS.DIAGNOSIS);
  sbmEnsureHeaders_(sbmGetOrCreateSheet_(SBM_SHEETS.TODAY), SBM_HEADERS.TODAY);
  sbmEnsureHeaders_(sbmGetOrCreateSheet_(SBM_SHEETS.BRIEF), SBM_HEADERS.BRIEF);
  // 改善中は記事DBの作業状態で管理するため、専用シートは作成しません。
  sbmEnsureHeaders_(sbmGetOrCreateSheet_(SBM_SHEETS.PROCESS_LOG), SBM_HEADERS.PROCESS_LOG);
  sbmEnsureHeaders_(sbmGetOrCreateSheet_(SBM_SHEETS.PROFILE_LOG), SBM_HEADERS.PROFILE_LOG);
  sbmRemoveRetiredSheets_();
  sbmApplyProductVisibleTabs_();
}

function sbmBuildDiagnosis_() {
  var queryRows = sbmGetRawQueryRows_();
  var byUrl = {};
  queryRows.forEach(function(q){
    var url = sbmNormalizeUrl_(String(q.URL || ''));
    if (!url || !sbmIsValidArticleUrl_(url)) return;
    if (!byUrl[url]) byUrl[url] = [];
    byUrl[url].push(q);
  });
  var urls = Object.keys(byUrl);
  var articleStats = urls.map(function(url){
    var rows = byUrl[url];
    var impressions = rows.reduce(function(sum,row){return sum + sbmNumber_(row.Impressions);},0);
    return {url:url, impressions:impressions};
  }).sort(function(a,b){return b.impressions-a.impressions;});
  var ratio = sbmRatioNumber_(sbmGetSetting_('ManagedRatio', SBM_DEFAULTS.MANAGED_RATIO));
  var managedCount = Math.max(1, Math.ceil(articleStats.length * ratio));
  var analysisLimit = sbmNumber_(sbmGetSetting_('AnalysisArticleLimit', SBM_DEFAULTS.ANALYSIS_ARTICLE_LIMIT)) || SBM_DEFAULTS.ANALYSIS_ARTICLE_LIMIT;
  var targetStats = articleStats.slice(0, Math.min(managedCount, analysisLimit));
  var managedMap = {};
  articleStats.slice(0, managedCount).forEach(function(a){managedMap[a.url] = true;});
  var targetMap = {};
  targetStats.forEach(function(a){targetMap[a.url] = true;});
  sbmSetSetting_('TotalArticleCount', articleStats.length, '直近の総記事数');
  sbmSetSetting_('ManagedArticleCount', managedCount, '直近の管理対象記事数');
  sbmSetSetting_('AnalyzedArticleCount', targetStats.length, '直近で実際に分析した記事数');

  var candidateLimit = sbmNumber_(sbmGetSetting_('AnalysisCandidateLimit', SBM_DEFAULTS.ANALYSIS_CANDIDATE_LIMIT)) || SBM_DEFAULTS.ANALYSIS_CANDIDATE_LIMIT;
  candidateLimit = Math.max(1, Math.min(200, candidateLimit));
  var diagnosisRows = [];
  var analyzed = 0;
  var foundCandidates = 0;
  urls.forEach(function(url){
    var rows = byUrl[url].sort(function(a,b){return sbmQueryScore_(b)-sbmQueryScore_(a);});
    var main = rows[0];
    if (!main) return;
    var totalClicks = rows.reduce(function(sum,row){return sum + sbmNumber_(row.Clicks);},0);
    var totalImpressions = rows.reduce(function(sum,row){return sum + sbmNumber_(row.Impressions);},0);
    var weightedPosition = totalImpressions ? rows.reduce(function(sum,row){return sum + sbmNumber_(row.Position)*sbmNumber_(row.Impressions);},0) / totalImpressions : sbmNumber_(main.Position);
    var ctr = totalImpressions ? totalClicks / totalImpressions : 0;
    var managed = !!managedMap[url];
    var targeted = !!targetMap[url];
    var shouldAnalyze = targeted && foundCandidates < candidateLimit;
    var diag = sbmDiagnose_(totalClicks,totalImpressions,ctr,weightedPosition,rows);
    var score = managed ? sbmOpportunityScore_(totalImpressions, ctr, weightedPosition, diag.minutes) : 0;
    var masterInfo = sbmGetMasterInfoByUrl_(url);
    var title = sbmCleanDisplayTitle_(masterInfo.h1 || masterInfo.titleTag || '', url) || String(main.Query || '') || sbmTitleFromPath_(url);
    if (!shouldAnalyze) return;
    analyzed++;
    if (totalImpressions < sbmNumber_(sbmGetSetting_('MinImpressions', SBM_DEFAULTS.MIN_IMPRESSIONS))) return;
    if (diag.status !== '改善候補') return;
    var classified = sbmClassifyQueries_(main.Query, rows.slice(1, Number(sbmGetSetting_('RelatedQueries', SBM_DEFAULTS.RELATED_QUERIES)) + 1));
    var important = classified.support.join('\n');
    var faq = classified.faq.join('\n');
    var separate = classified.separate.join('\n');
    var noise = classified.noise.join('\n');
    var qSummary = classified.summary;
    diagnosisRows.push([url, title, main.Query, important, faq, separate, noise, qSummary, totalClicks, totalImpressions, ctr, weightedPosition, diag.code, diag.diagnosis, diag.recommendation, diag.minutes, score, diag.reason, sbmNowText_()]);
    foundCandidates++;
  });
  diagnosisRows = diagnosisRows.sort(function(a,b){return b[16]-a[16];}).slice(0, candidateLimit);
  sbmRewriteSheet_(SBM_SHEETS.DIAGNOSIS, SBM_HEADERS.DIAGNOSIS, diagnosisRows);
  sbmSetSetting_('AnalysisCandidateLimit', candidateLimit, 'STEP Bは改善候補がこの件数に達したら終了');
  sbmSetSetting_('ImprovementCandidateCount', diagnosisRows.length, '直近の改善候補数');
  return {totalCount: articleStats.length, managedCount: managedCount, targetCount: targetStats.length, analyzedCount: analyzed, diagnosisCount: diagnosisRows.length};
}

function sbmBuildTodayQueue_() {
  var diag = sbmRowsAsObjects_(SBM_SHEETS.DIAGNOSIS).sort(function(a,b){return sbmNumber_(b.OpportunityScore)-sbmNumber_(a.OpportunityScore);});
  var active = sbmActiveMeasurementUrlMap_();
  diag = diag.filter(function(d){ return !active[sbmNormalizeUrl_(d.URL || '')]; });
  var mode = String(sbmGetSetting_('TodayDisplayMode','TOP5'));
  var candidateCap = sbmNumber_(sbmGetSetting_('AnalysisCandidateLimit', SBM_DEFAULTS.ANALYSIS_CANDIDATE_LIMIT)) || SBM_DEFAULTS.ANALYSIS_CANDIDATE_LIMIT;
  diag = diag.slice(0, candidateCap);
  sbmSetSetting_('ImprovementCandidateCount', diag.length, '直近の改善候補数（測定中を除く）');
  var limit = mode === 'ALL' ? Math.min(sbmGetTodayMaxDisplayCount_(), diag.length) : Math.min(sbmGetTodayInitialDisplayCount_(), diag.length);
  var out = [];
  var briefRows = [];
  for (var i=0; i<diag.length && out.length<limit; i++) {
    var d = diag[i];
    var url = sbmNormalizeUrl_(String(d.URL || ''));
    var m = sbmNumber_(d.EstimatedMinutes) || 10;
    var todayInfo = sbmGetMasterInfoByUrl_(url);
    var title = sbmCleanDisplayTitle_(todayInfo.h1 || todayInfo.titleTag || d.Title || '', url) || String(d.MainQuery || '') || sbmTitleFromPath_(url);
    var score = sbmNumber_(d.OpportunityScore);
    var openFormula = '=HYPERLINK("' + String(url).replace(/"/g,'""') + '","記事を開く")';
    var requestText = sbmImprovementRequestText_(title, url, d.MainQuery, d.SubQueries, d.FAQQueries, d.SeparateArticleQueries, d.NoiseQueries, d.QuerySummary, d.Reason, d.Recommendation);
    out.push([sbmStars_(score), m + '分', title, d.MainQuery, d.Recommendation, openFormula, false, false, false, false, false, false, false, false, false, false, false, '', score, url, '未着手', '']);
    briefRows.push([sbmId_('BRF'), url, title, d.MainQuery, d.SubQueries || '', d.FAQQueries || '', d.SeparateArticleQueries || '', d.NoiseQueries || '', d.QuerySummary || '', d.Diagnosis || '', d.Recommendation || '', d.Reason || '', m, score, d.CTR || '', d.Position || '', d.Clicks || '', d.Impressions || '', requestText, sbmNowText_()]);
  }
  sbmSetSetting_('DisplayedImprovementCount', out.length, '今日の改善に表示している件数');
  sbmRewriteSheet_(SBM_SHEETS.TODAY, SBM_HEADERS.TODAY, out);
  sbmRewriteSheet_(SBM_SHEETS.BRIEF, SBM_HEADERS.BRIEF, briefRows);
  sbmStyleTodaySheet_(sbmGetOrCreateSheet_(SBM_SHEETS.TODAY));
  sbmStyleBriefSheet_(sbmGetOrCreateSheet_(SBM_SHEETS.BRIEF));
  sbmOpenToday();
}

function sbmActiveMeasurementUrlMap_() {
  var map = {};
  sbmRowsAsObjects_(SBM_SHEETS.LOG).forEach(function(l){
    var st = String(l['状態'] || '');
    var url = sbmNormalizeUrl_(l.URL || '');
    if (!url) return;
    if (st === '測定待ち' || st === '測定中' || st === '改善中' || st === '様子見' || st === '改善傾向') map[url] = true;
  });
  return map;
}



function sbmNormalizeUrl_(url) {
  url = String(url || '').trim();
  if (!url) return '';
  if (/^sc-domain:/i.test(url)) return url;
  // Search Consoleには #見出し 付きURLやクエリ付きURLが混ざることがある。
  // Product 5.0では記事単位で管理するため、#以降と通常の?以降は削除して同一記事へ統合する。
  url = url.split('#')[0].split('?')[0];
  if (/^https?:\/\//i.test(url)) return url.replace(/\/+$/, function(m){ return url.match(/^https?:\/\/[^\/]+\/?$/i) ? '/' : ''; });
  return 'https://' + url.replace(/^\/+/, '');
}

function sbmIsValidArticleUrl_(url) {
  url = sbmNormalizeUrl_(url || '');
  if (!/^https?:\/\//i.test(url)) return false;
  var m = url.match(/^https?:\/\/([^\/]+)(\/.*)?$/i);
  var host = (m && m[1]) ? String(m[1]).toLowerCase() : '';
  var path = (m && m[2]) ? m[2] : '/';
  if (!path || path === '/' || path.length < 3) return false;

  // 共通除外：管理・一覧・検索・カテゴリ・メディア・フィードは改善対象外。
  if (/\/(archive|archives|about|search|category|categories|tag|tags|feed|feeds|rss|sitemap|privacy|contact|profile)(\/|$)/i.test(path)) return false;
  if (/\/(author|wp-admin|wp-json|wp-content|wp-includes)(\/|$)/i.test(path)) return false;
  if (/\/(page|pages)\/\d+(\/|$)/i.test(path)) return false;
  if (/\.(jpg|jpeg|png|gif|webp|svg|css|js|pdf|zip|mp4|mp3|ico)(\?|$)/i.test(path)) return false;

  // はてなブログは記事URLが /entry/ 配下に出るため、ここを厳格に残す。
  if (/hatenablog\.com$/i.test(host) || /hatenadiary\.com$/i.test(host)) {
    return /^\/entry\//i.test(path);
  }

  // WordPress等は固定ページもあり得るため広めに残すが、明らかな一覧系は除外済み。
  return true;
}

function sbmTitleFromPath_(url) {
  var s = String(url || '').replace(/^https?:\/\//i,'').replace(/\?.*$/,'').replace(/\/$/,'');
  var parts = s.split('/').filter(Boolean);
  var last = parts.length ? parts[parts.length-1] : s;
  try { last = decodeURIComponent(last); } catch(e) {}
  last = last.replace(/[-_]+/g, ' ').trim();
  return last || s;
}



function sbmSafeArticleTitleCell_(value, url) {
  value = String(value || '').trim();
  url = sbmNormalizeUrl_(url || '');
  if (!value || value === url || /^https?:\/\//i.test(value)) return '';
  if (/^\d+(\.\d+)?$/.test(value)) return '';
  if (/^\d{4}[-\/]\d{1,2}[-\/]\d{1,2}/.test(value)) return '';
  if (/^1900[-\/]0?1[-\/]0?\d/.test(value)) return '';
  return value;
}


function sbmCleanDataListText_(value, url) {
  // データ一覧用: 取得できなかったタイトル・descriptionにURL/数値/日付などを入れない。
  value = String(value || '').trim();
  url = sbmNormalizeUrl_(url || '');
  if (!value) return '';
  var blogName = String(sbmGetSetting_('BlogName','') || '').trim();
  if (blogName && value === blogName) return '';
  if (url && value === url) return '';
  if (/^https?:\/\//i.test(value)) return '';
  if (/^\d+(\.\d+)?$/.test(value)) return '';
  if (/^\d{4}[-\/]\d{1,2}[-\/]\d{1,2}/.test(value)) return '';
  if (/^1900[-\/]0?1[-\/]0?\d/.test(value)) return '';
  return value;
}

function sbmCleanDisplayTitle_(title, url) {
  title = String(title || '').trim();
  url = sbmNormalizeUrl_(url || '');
  if (!title || title === url || /^https?:\/\//i.test(title) || /^\d+(\.\d+)?$/.test(title) || /^\d{4}[-\/]\d{1,2}[-\/]\d{1,2}$/.test(title)) {
    return sbmTitleFromPath_(url);
  }
  return title;
}

function sbmResolveArticleTitle_(url, fallback, allowFetch) {
  fallback = String(fallback || '').trim();
  if (fallback && fallback !== url && fallback.indexOf('http') !== 0) return fallback;
  url = sbmNormalizeUrl_(url);
  allowFetch = allowFetch === true && String(sbmGetSetting_('FetchArticleTitles','ON')).toUpperCase() === 'ON';
  if (!allowFetch) return sbmTitleFromPath_(url);
  var info = sbmResolveArticleTitleInfo_(url, fallback, true);
  return info.h1 || info.titleTag || sbmTitleFromPath_(url);
}

function sbmResolveArticleTitleInfo_(url, fallback, allowFetch) {
  url = sbmNormalizeUrl_(url);
  fallback = sbmCleanDisplayTitle_(fallback || '', url);
  var base = {h1: fallback || sbmTitleFromPath_(url), titleTag: fallback || sbmTitleFromPath_(url)};
  var enabled = String(sbmGetSetting_('DataListTitleFetch','ON')).toUpperCase() !== 'OFF';
  allowFetch = allowFetch === true && enabled;
  if (!allowFetch || !/^https?:\/\//i.test(url)) return base;
  var cache = CacheService.getScriptCache();
  var key = 'titleinfo:' + Utilities.base64EncodeWebSafe(url).slice(0,170);
  var cached = cache.get(key);
  if (cached) {
    try {
      var obj = JSON.parse(cached);
      obj.h1 = sbmCleanDisplayTitle_(obj.h1 || base.h1, url);
      obj.titleTag = sbmCleanHtmlText_(obj.titleTag || base.titleTag);
      return obj;
    } catch(e) {}
  }
  var info = {h1: base.h1, titleTag: base.titleTag};
  try {
    var res = UrlFetchApp.fetch(url, {muteHttpExceptions:true, followRedirects:true, headers:{'User-Agent':'SIMS-Blog-Manager'}});
    var html = res.getContentText() || '';
    var t = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    var h = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (t && t[1]) info.titleTag = sbmCleanHtmlText_(t[1]);
    if (h && h[1]) info.h1 = sbmCleanDisplayTitle_(sbmCleanHtmlText_(h[1]), url);
    if (!info.h1) info.h1 = info.titleTag || base.h1;
    if (!info.titleTag) info.titleTag = info.h1 || base.titleTag;
  } catch(e) {}
  if (String(info.h1 || '').length > 120) info.h1 = String(info.h1).substring(0,120) + '…';
  if (String(info.titleTag || '').length > 160) info.titleTag = String(info.titleTag).substring(0,160) + '…';
  try { cache.put(key, JSON.stringify(info), 21600); } catch(e) {}
  return info;
}

function sbmCleanHtmlText_(s) {
  s = String(s || '').replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'').replace(/<[^>]+>/g,' ');
  s = s.replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&#124;/g,'|');
  s = s.replace(/&#(\d+);/g, function(_, n){ try { return String.fromCharCode(Number(n)); } catch(e) { return _; } });
  s = s.replace(/&#x([0-9a-fA-F]+);/g, function(_, n){ try { return String.fromCharCode(parseInt(n,16)); } catch(e) { return _; } });
  return s.replace(/\s+/g,' ').trim();
}

function sbmBuildBriefText_(d) {
  return '診断: ' + d.Diagnosis + '\n'
    + '推奨: ' + d.Recommendation + '\n'
    + '理由: ' + d.Reason + '\n\n'
    + '重要クエリ:\n' + (d.ImportantQueries || '-') + '\n\n'
    + '本文補強クエリ:\n' + (d.BodyQueries || '-') + '\n\n'
    + 'FAQ候補:\n' + (d.FAQQueries || '-');
}


function sbmClassifyQueries_(mainQuery, queryRows) {
  var main = sbmNormalizeQueryText_(mainQuery);
  var mainTokens = sbmQueryTokens_(main);
  var mainIntent = sbmIntentLabel_(mainQuery, mainQuery);
  var support = [], faq = [], separate = [], noise = [];
  var supportIntents = {}, separateIntents = {}, noiseReasons = [];
  queryRows.forEach(function(r){
    var q = String(r.Query || '').trim();
    if (!q) return;
    var n = sbmNormalizeQueryText_(q);
    var qTokens = sbmQueryTokens_(n);
    var sim = sbmTokenOverlap_(mainTokens, qTokens);
    var intent = sbmIntentLabel_(q, mainQuery);
    var score = sbmQueryScore_(r);
    var isFaq = /とは|意味|なぜ|できない|方法|使い方|読み方|発音|違い|料金|評判|口コミ|いつ|どこ|どれ|FAQ/i.test(q);
    var looksNoise = sbmLooksNoiseQuery_(q, mainTokens, sim);
    if (looksNoise) { noise.push(q); noiseReasons.push(q + '（関連度が低い）'); return; }

    var sharesCore = sim >= 0.45 || n.indexOf(main) !== -1 || main.indexOf(n) !== -1;
    var nearIntent = (intent === mainIntent) || (sim >= 0.25);
    var isSeparateSignal = sbmLooksSeparateArticleQuery_(q, mainQuery, sim, intent, mainIntent);

    if (sharesCore || (nearIntent && !isSeparateSignal)) {
      support.push(q);
      supportIntents[intent] = true;
      if (isFaq && faq.length < 10) faq.push(q);
    } else if (isSeparateSignal || score >= 20) {
      separate.push(q);
      separateIntents[intent] = true;
    } else {
      noise.push(q);
    }
  });
  support = sbmUniqueLimit_(support, 30);
  faq = sbmUniqueLimit_(faq, 10);
  separate = sbmUniqueLimit_(separate, 20);
  noise = sbmUniqueLimit_(noise, 20);
  var supportLabels = Object.keys(supportIntents).join(' / ') || '未分類';
  var separateLabels = Object.keys(separateIntents).join(' / ') || 'なし';
  return {
    support: support,
    faq: faq,
    separate: separate,
    noise: noise,
    summary: 'メイン検索意図: ' + mainIntent + '\n'
      + '本文に使うサブクエリ: ' + support.length + '件（' + supportLabels + '）\n'
      + 'FAQ候補: ' + faq.length + '件\n'
      + '別記事候補: ' + separate.length + '件（' + separateLabels + '）\n'
      + '除外クエリ: ' + noise.length + '件\n'
      + '方針: サブクエリは本文・FAQに活用し、別記事候補はこの記事に無理に入れず、新記事候補として扱ってください。'
  };
}

function sbmLooksSeparateArticleQuery_(q, mainQuery, sim, intent, mainIntent) {
  var s = sbmNormalizeQueryText_(q);
  var m = sbmNormalizeQueryText_(mainQuery);
  if (/web clipper|clipper|拡張機能|extension|download|ダウンロード|インストール/.test(s) && sim < 0.55) return true;
  if (/料金|価格|無料|有料|評判|口コミ|レビュー/.test(s) && intent !== mainIntent) return true;
  if (/使い方|設定|方法|できない|エラー|トラブル/.test(s) && intent !== mainIntent && sim < 0.35) return true;
  if (/意味|語源|英語|日本語|とは/.test(s) && /読み|読み方|発音|pronunciation|pronounce/.test(m) && sim < 0.25) return true;
  return false;
}


function sbmNormalizeQueryText_(s) { return String(s || '').toLowerCase().replace(/[　\s]+/g,' ').trim(); }
function sbmQueryTokens_(s) {
  s = sbmNormalizeQueryText_(s).replace(/[｜|・,、。/／:：()（）「」\[\]【】]/g,' ');
  var words = s.split(/\s+/).filter(function(x){return x && x.length > 1;});
  if (words.length) return words;
  var chars = [];
  for (var i=0; i<s.length-1; i++) chars.push(s.substring(i,i+2));
  return chars;
}
function sbmTokenOverlap_(a,b) {
  if (!a.length || !b.length) return 0;
  var set = {}; a.forEach(function(t){set[t]=true;});
  var hit = 0; b.forEach(function(t){ if(set[t]) hit++; });
  return hit / Math.max(1, Math.min(a.length, b.length));
}
function sbmLooksNoiseQuery_(q, mainTokens, sim) {
  var s = sbmNormalizeQueryText_(q);
  if (/^[a-z]+$/.test(s) && mainTokens.length > 1 && sim < 0.2) return true;
  if (/发音|下载|download|web clipper|拡張機能|extension/i.test(q) && sim < 0.35) return false; // 別記事候補として残す
  if (sim < 0.08 && s.length < 3) return true;
  return false;
}
function sbmIntentLabel_(q, mainQuery) {
  var s = sbmNormalizeQueryText_(q);
  if (/読み|読み方|発音|pronunciation|pronounce|カタカナ|アクセント/.test(s)) return '読み方・発音';
  if (/意味|語源|英語|日本語|とは/.test(s)) return '意味・語源';
  if (/使い方|設定|方法|やり方|できない|エラー/.test(s)) return '使い方・トラブル';
  if (/料金|価格|無料|有料/.test(s)) return '料金';
  if (/評判|口コミ|レビュー/.test(s)) return '評判';
  return '関連語';
}
function sbmUniqueLimit_(arr, n) { var seen={}, out=[]; arr.forEach(function(x){ var k=String(x); if(!seen[k] && out.length<n){ seen[k]=true; out.push(x);} }); return out; }



function sbmDiagnose_(clicks, impressions, ctr, position, rows) {
  var ctrPct = ctr * 100;
  if (position <= 5 && ctrPct < 3) return {code:'D01', status:'改善候補', diagnosis:'上位表示だがCTRが低い', recommendation:'タイトル・ディスクリプション・導入文を優先確認', minutes:10, reason:'順位は高い一方でクリック率に改善余地があります。'};
  if (position <= 10 && ctrPct < 2.5) return {code:'D02', status:'改善候補', diagnosis:'1ページ目でCTR改善余地あり', recommendation:'タイトル・導入文・検索意図の一致確認', minutes:15, reason:'表示回数があるため、クリック率改善で成果が見込めます。'};
  if (position > 10 && position <= 20) return {code:'D03', status:'改善候補', diagnosis:'2ページ目上位で伸びしろあり', recommendation:'H2追加・本文補強・FAQ追加', minutes:30, reason:'少しの補強で1ページ目入りを狙える可能性があります。'};
  if (position > 20 && position <= 40) return {code:'D04', status:'改善候補', diagnosis:'順位改善余地あり', recommendation:'本文補強・構成見直し', minutes:40, reason:'検索意図を補強すると順位改善が期待できます。'};
  if (rows.length >= 15) return {code:'D05', status:'改善候補', diagnosis:'関連クエリが多い', recommendation:'FAQ追加・見出し補強', minutes:20, reason:'関連クエリが多く、本文やFAQで拾える余地があります。'};
  return {code:'D00', status:(impressions < sbmNumber_(sbmGetSetting_('MinImpressions', SBM_DEFAULTS.MIN_IMPRESSIONS)) ? '様子見' : '良好'), diagnosis:'大きな改善シグナルなし', recommendation:'様子見', minutes:10, reason:'現時点では優先度が高くありません。'};
}

function sbmOpportunityScore_(impressions, ctr, position, minutes) {
  var impScore = Math.min(40, Math.log(Math.max(1, impressions)) / Math.log(10000) * 40);
  var posScore = 0;
  if (position <= 3) posScore = 12;
  else if (position <= 10) posScore = 26;
  else if (position <= 20) posScore = 30;
  else if (position <= 40) posScore = 18;
  else posScore = 6;
  var ctrScore = Math.min(20, Math.max(0, (0.08 - ctr) / 0.08 * 20));
  var raw = impScore + posScore + ctrScore + 5;
  var cost = minutes <= 10 ? 1 : minutes <= 20 ? 1.15 : minutes <= 30 ? 1.35 : 1.7;
  return Math.round(Math.min(100, raw / cost));
}

function sbmQueryScore_(q) { return sbmNumber_(q.Impressions) * 0.6 + sbmNumber_(q.Clicks) * 10 + Math.max(0, 30 - sbmNumber_(q.Position)) * 3; }
function sbmStars_(score) { score = sbmNumber_(score); if (score>=90) return '★★★★★'; if (score>=75) return '★★★★☆'; if (score>=60) return '★★★☆☆'; if (score>=40) return '★★☆☆☆'; return '★☆☆☆☆'; }
function sbmRatioNumber_(v) { var n = sbmNumber_(v); if (n > 1) return n/100; return n || 0.3; }

function sbmSetTodayTop5() { var n = sbmGetTodayInitialDisplayCount_(); sbmSetSetting_('TodayDisplayMode','TOP5','今日の改善は初期表示件数を表示'); sbmBuildTodayQueue_(); sbmRefreshHome_(); sbmAlert_('表示を変更しました','今日の改善をおすすめ' + n + '件表示にしました。'); }
function sbmSetTodayAll() { var n = sbmGetTodayMaxDisplayCount_(); sbmSetSetting_('TodayDisplayMode','ALL','今日の改善を最大表示件数まで表示'); sbmBuildTodayQueue_(); sbmRefreshHome_(); sbmAlert_('表示を変更しました','今日の改善を最大' + n + '件まで表示しました。'); }


function sbmBuildDataListFromAnalysis_() {
  var rawRows = sbmGetRawQueryRows_();
  var byUrl = sbmAggregateRawRowsByUrl_(rawRows);
  var diag = sbmRowsAsObjects_(SBM_SHEETS.DIAGNOSIS);
  var inProg = []; // 改善中は記事DBの作業状態で管理
  var master = sbmExistingDataListMap_();
  var diagByUrl = {};
  diag.forEach(function(d){ diagByUrl[sbmNormalizeUrl_(d.URL || '')] = d; });
  var inProgMap = {};
  inProg.forEach(function(r){ var u = sbmNormalizeUrl_(r.URL || ''); if (u) inProgMap[u] = true; });
  var out = [];
  Object.keys(byUrl).forEach(function(url){
    var a = byUrl[url] || {};
    var d = diagByUrl[url] || {};
    var m = master[url] || {};
    var status = inProgMap[url] ? '改善中' : (d.URL ? '改善候補' : (m.status || '未分析'));
    if (!d.URL && status === '未分析') {
      if (sbmNumber_(a.impressions) < sbmNumber_(sbmGetSetting_('MinImpressions', SBM_DEFAULTS.MIN_IMPRESSIONS))) status = '様子見';
      else status = '良好';
    }
    var titleTag = sbmCleanDataListText_(m.titleTag || '', url);
    var displayTitle = sbmCleanDataListText_(m.h1 || '', url) || sbmStripSiteNameFromTitle_(titleTag, url) || sbmTitleFromPath_(url);
    var main = d.MainQuery || a.mainQuery || m.mainQuery || '';
    var clicks = sbmNumber_(d.Clicks || a.clicks || m.clicks);
    var imps = sbmNumber_(d.Impressions || a.impressions || m.impressions);
    var ctr = d.CTR !== '' && d.CTR !== undefined ? d.CTR : (a.ctr !== undefined ? a.ctr : m.ctr);
    var pos = d.Position !== '' && d.Position !== undefined ? d.Position : (a.position !== undefined ? a.position : m.position);
    out.push([sbmStatusLabel_(status), displayTitle, main, clicks, imps, ctr, pos, '▶ 記事詳細', m.fetchedAt || sbmNowText_(), url, titleTag, sbmCleanDataListText_(m.metaDescription || '', url)]);
  });
  sbmSortAndWriteDataList_(out);
  return out.length;
}

function sbmSortAndWriteDataList_(out) {
  out = out || [];
  out.sort(function(a,b){
    var order = {'良好':1,'改善中':2,'改善候補':3,'様子見':4,'管理対象外':5,'未分析':6};
    var ao = order[sbmNormalizeStatus_(a[0])] || 99, bo = order[sbmNormalizeStatus_(b[0])] || 99;
    if (ao !== bo) return ao - bo;
    return sbmNumber_(b[4]) - sbmNumber_(a[4]);
  });
  sbmRewriteSheet_(SBM_SHEETS.QUERY_DATA, SBM_HEADERS.QUERY_DATA, out);
  var sh = sbmGetOrCreateSheet_(SBM_SHEETS.QUERY_DATA);
  sbmStyleDataListSheet_(sh);
}

function sbmExistingDataListMap_() {
  var map = {};
  sbmRowsAsObjects_(SBM_SHEETS.QUERY_DATA).forEach(function(r){
    var url = sbmNormalizeUrl_(r['記事URL'] || r.URL || '');
    if (!url) return;
    var articleTitle = sbmCleanDataListText_(r['記事タイトル'] || r['H1タイトル'] || '', url);
    var seoTitle = sbmCleanDataListText_(r['SEOタイトル（titleタグ）'] || r['titleタグ'] || '', url);
    map[url] = {
      status: sbmNormalizeStatus_(r['記事ステータス'] || ''),
      h1: articleTitle,
      titleTag: seoTitle,
      metaDescription: sbmCleanDataListText_(r['メタディスクリプション'] || r['meta description'] || '', url),
      mainQuery: r['メインクエリ'] || '',
      clicks: r['クリック数'] || '',
      impressions: r['表示回数'] || '',
      ctr: r['CTR'] || '',
      position: r['平均順位'] || '',
      fetchedAt: r['最終取得日時'] || ''
    };
  });
  return map;
}

function sbmGetMasterInfoByUrl_(url) {
  url = sbmNormalizeUrl_(url || '');
  if (!url) return {};
  return sbmExistingDataListMap_()[url] || {};
}


function sbmSupplementArticleInfoManual(silent) {
  silent = silent === true;
  var started = new Date();
  var startedText = sbmNowText_();
  try {
    var rows = sbmGetRawQueryRows_();
    if (!rows.length) return sbmAlert_('記事情報を補完できません', '先にSTEP AでSearch Consoleデータを取得してください。');
    var result = sbmUpdateDataListAfterFetch_(rows, true);
    var sec = sbmSecondsSince_(started);
    sbmProcessLog_('STEP A-2 記事情報補完', '完了', result.total || '', result.fetched || 0, sec, '最大補完 ' + sbmGetSetting_('MetaFetchMaxRows', SBM_DEFAULTS.META_FETCH_MAX_ROWS) + 'URL / 取得済みURLは再利用', startedText, sbmNowText_());
    if (!silent) sbmAlert_('記事情報補完完了', '記事情報の補完が完了しました。\n対象記事: ' + (result.total || 0) + '件\n補完件数: ' + (result.fetched || 0) + '件\n所要時間: ' + sec + '秒');
  } catch (e) {
    var secErr = sbmSecondsSince_(started);
    sbmProcessLog_('STEP A-2 記事情報補完', 'エラー', '', '', secErr, String(e), startedText, sbmNowText_());
    sbmAlert_('記事情報補完エラー', String(e));
  }
}

function sbmUpdateDataListAfterFetch_(rawRows, fetchMeta) {
  var existing = sbmExistingDataListMap_();
  var stats = sbmAggregateRawRowsByUrl_(rawRows || []);
  var urls = Object.keys(stats).filter(function(u){ return !!u; });
  urls.sort(function(a,b){ return sbmNumber_(stats[b].impressions) - sbmNumber_(stats[a].impressions); });
  var maxMeta = (fetchMeta === false) ? 0 : (sbmNumber_(sbmGetSetting_('MetaFetchMaxRows', SBM_DEFAULTS.META_FETCH_MAX_ROWS)) || SBM_DEFAULTS.META_FETCH_MAX_ROWS);
  var fetched = 0;
  var now = sbmNowText_();
  var out = [];
  urls.forEach(function(url){
    var st = stats[url];
    var old = existing[url] || {};
    var h1 = sbmCleanDataListText_(old.h1 || '', url);
    var titleTag = sbmCleanDataListText_(old.titleTag || '', url);
    var metaDesc = sbmCleanDataListText_(old.metaDescription || '', url);
    if (fetched < maxMeta && (!h1 || !titleTag || !metaDesc)) {
      var meta = sbmFetchArticleMetaInfo_(url);
      if (meta && (meta.h1 || meta.titleTag || meta.metaDescription)) {
        h1 = sbmCleanDataListText_(meta.h1 || h1, url);
        titleTag = sbmCleanDataListText_(meta.titleTag || titleTag, url);
        metaDesc = sbmCleanDataListText_(meta.metaDescription || metaDesc, url);
        fetched++;
      }
    }
    var displayTitle = h1 || sbmStripSiteNameFromTitle_(titleTag, url) || sbmTitleFromPath_(url);
    out.push([sbmStatusLabel_(old.status || '未分析'), displayTitle, st.mainQuery, st.clicks, st.impressions, st.ctr, st.position, '▶ 記事詳細', now, url, titleTag, metaDesc]);
  });
  sbmSortAndWriteDataList_(out);
  return {total: out.length, fetched: fetched};
}

function sbmAggregateRawRowsByUrl_(rawRows) {
  var map = {};
  (rawRows || []).forEach(function(r){
    var query, url, clicks, imps, ctr, pos;
    if (Array.isArray(r)) {
      query = r[2]; url = r[3]; clicks = r[4]; imps = r[5]; ctr = r[6]; pos = r[7];
    } else {
      query = r.Query || r['Query'] || r['クエリ'] || '';
      url = r.URL || r['URL'] || r['記事URL'] || '';
      clicks = r.Clicks || r['Clicks'] || r['クリック数'] || 0;
      imps = r.Impressions || r['Impressions'] || r['表示回数'] || 0;
      ctr = r.CTR || r['CTR'] || 0;
      pos = r.Position || r['Position'] || r['平均順位'] || 0;
    }
    url = sbmNormalizeUrl_(url || '');
    if (!url || !sbmIsValidArticleUrl_(url)) return;
    if (!map[url]) map[url] = {url:url, mainQuery:'', clicks:0, impressions:0, weightedPositionSum:0, position:0, ctr:0, bestScore:-1};
    var m = map[url];
    clicks = sbmNumber_(clicks); imps = sbmNumber_(imps); pos = sbmNumber_(pos);
    m.clicks += clicks;
    m.impressions += imps;
    m.weightedPositionSum += pos * imps;
    var score = clicks * 1000 + imps;
    if (score > m.bestScore) { m.bestScore = score; m.mainQuery = query || m.mainQuery; }
  });
  Object.keys(map).forEach(function(url){
    var m = map[url];
    m.ctr = m.impressions ? m.clicks / m.impressions : 0;
    m.position = m.impressions ? m.weightedPositionSum / m.impressions : 0;
  });
  return map;
}

function sbmFetchArticleMetaInfo_(url) {
  try {
    url = sbmNormalizeUrl_(url);
    if (!/^https?:\/\//i.test(url)) return {h1:'', titleTag:'', metaDescription:''};
    var key = 'meta:' + Utilities.base64EncodeWebSafe(url).slice(0, 180);
    var cache = CacheService.getDocumentCache();
    var cached = cache.get(key);
    if (cached) return JSON.parse(cached);
    var res = UrlFetchApp.fetch(url, {
      muteHttpExceptions:true,
      followRedirects:true,
      headers:{'User-Agent':'Mozilla/5.0 SIMS-Blog-Manager'}
    });
    var code = res.getResponseCode();
    if (code < 200 || code >= 400) return {h1:'', titleTag:'', metaDescription:''};
    var html = res.getContentText() || '';
    var titleTag = sbmExtractTitleTag_(html);
    var articleTitle = sbmPickArticleTitle_(html, titleTag, url);
    var metaDescription = sbmExtractDescription_(html);
    var obj = {
      h1: sbmCleanDataListText_(articleTitle || '', url),
      titleTag: sbmCleanDataListText_(titleTag || '', url),
      metaDescription: sbmCleanDataListText_(metaDescription || '', url)
    };
    try { cache.put(key, JSON.stringify(obj), 21600); } catch(e) {}
    return obj;
  } catch(e) {
    return {h1:'', titleTag:'', metaDescription:''};
  }
}

function sbmExtractTitleTag_(html) {
  var t = String(html || '').match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return t && t[1] ? sbmCleanHtmlText_(t[1]) : '';
}

function sbmExtractDescription_(html) {
  html = String(html || '');
  var md = sbmExtractMetaContent_(html, 'name', 'description')
    || sbmExtractMetaContent_(html, 'property', 'og:description')
    || sbmExtractMetaContent_(html, 'name', 'twitter:description');
  return md ? sbmCleanHtmlText_(md) : '';
}

function sbmPickArticleTitle_(html, titleTag, url) {
  html = String(html || '');
  titleTag = sbmCleanHtmlText_(titleTag || '');
  var candidates = [];
  candidates.push(sbmExtractTitleBySelector_(html, 'h1', 'entry-title'));
  candidates.push(sbmExtractTitleBySelector_(html, 'h1', 'post-title'));
  candidates.push(sbmExtractTitleBySelector_(html, 'h1', 'article-title'));
  candidates.push(sbmExtractMetaContent_(html, 'property', 'og:title'));
  candidates.push(sbmExtractMetaContent_(html, 'name', 'twitter:title'));
  candidates.push(sbmExtractTitleByClass_(html, 'entry-title'));
  candidates.push(sbmExtractTitleByClass_(html, 'post-title'));
  candidates.push(sbmExtractTitleByClass_(html, 'article-title'));
  candidates.push(sbmExtractArticleH1_(html));
  candidates.push(sbmStripSiteNameFromTitle_(titleTag, url));
  candidates.push(sbmExtractFirstH1_(html));
  for (var i=0; i<candidates.length; i++) {
    var c = sbmCleanDataListText_(sbmCleanHtmlText_(candidates[i] || ''), url);
    if (c && !sbmLooksLikeSiteName_(c, titleTag, url)) return c;
  }
  return '';
}

function sbmExtractMetaContent_(html, attrName, attrValue) {
  html = String(html || '');
  var q = "[\\\"']";
  var val = sbmRegexEscape_(attrValue);
  var re1 = new RegExp("<meta[^>]+(?:" + attrName + ")=" + q + val + q + "[^>]+content=" + q + "([\\s\\S]*?)" + q + "[^>]*>", "i");
  var re2 = new RegExp("<meta[^>]+content=" + q + "([\\s\\S]*?)" + q + "[^>]+(?:" + attrName + ")=" + q + val + q + "[^>]*>", "i");
  var m = html.match(re1) || html.match(re2);
  return m && m[1] ? m[1] : '';
}



function sbmExtractTitleBySelector_(html, tagName, className) {
  var tag = sbmRegexEscape_(tagName || 'h1');
  var cls = sbmRegexEscape_(className || '');
  var q = "[\"']";
  var re = new RegExp("<" + tag + "[^>]+class=" + q + "[^>]*" + cls + "[^>]*" + q + "[^>]*>([\s\S]*?)<\/" + tag + ">", "i");
  var m = String(html || '').match(re);
  return m && m[1] ? m[1] : '';
}

function sbmExtractTitleByClass_(html, className) {
  var cls = sbmRegexEscape_(className);
  var q = "[\\\"']";
  var re = new RegExp("<(?:h1|h2|a|span|div)[^>]+class=" + q + "[^>]*" + cls + "[^>]*" + q + "[^>]*>([\\s\\S]*?)<\\/(?:h1|h2|a|span|div)>", "i");
  var m = String(html || '').match(re);
  return m && m[1] ? m[1] : '';
}


function sbmExtractArticleH1_(html) {
  var m = String(html || '').match(/<article[\s\S]*?<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return m && m[1] ? m[1] : '';
}

function sbmExtractFirstH1_(html) {
  var m = String(html || '').match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return m && m[1] ? m[1] : '';
}

function sbmStripSiteNameFromTitle_(title, url) {
  title = sbmCleanHtmlText_(title || '');
  if (!title) return '';
  var seps = ['｜','|',' - ',' – ',' — ', ' :: ', ' » ', ' « '];
  for (var i=0; i<seps.length; i++) {
    var sep = seps[i];
    if (title.indexOf(sep) !== -1) {
      var parts = title.split(sep).map(function(x){ return String(x || '').trim(); }).filter(Boolean);
      if (parts.length >= 2) {
        // 多くのCMSは「記事タイトル - サイト名」。逆順テーマにも少し対応する。
        var first = parts[0], last = parts[parts.length - 1];
        if (first.length >= 8) return first;
        if (last.length >= 8) return last;
      }
    }
  }
  return title;
}

function sbmLooksLikeSiteName_(candidate, titleTag, url) {
  candidate = String(candidate || '').trim();
  titleTag = String(titleTag || '').trim();
  if (!candidate) return true;
  if (candidate.length <= 3) return true;
  var stripped = sbmStripSiteNameFromTitle_(titleTag, url);
  // はてなブログ等では最初のh1がサイト名になることがある。
  // SEOタイトル（titleタグ）から抽出した記事タイトルと違い、かつ短い場合はサイト名候補として扱う。
  if (stripped && candidate !== stripped && titleTag.indexOf(candidate) !== -1 && candidate.length <= 20) return true;
  return false;
}

function sbmRegexEscape_(s) {
  return String(s || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


function sbmNormalizeStatus_(status) {
  var s = String(status || '').replace(/[🟢🟡🔵⚪⚫●★☆✅❌]/g, '').trim();
  if (s.indexOf('良好') >= 0) return '良好';
  if (s.indexOf('改善中') >= 0) return '改善中';
  if (s.indexOf('改善候補') >= 0) return '改善候補';
  if (s.indexOf('様子見') >= 0) return '様子見';
  if (s.indexOf('管理対象外') >= 0) return '管理対象外';
  if (s.indexOf('未分析') >= 0) return '未分析';
  return s || '未分析';
}

function sbmStatusLabel_(status) {
  var s = sbmNormalizeStatus_(status);
  var icon = {
    '良好':'🟢',
    '改善中':'🔵',
    '改善候補':'🟡',
    '様子見':'⚪',
    '管理対象外':'⚫',
    '未分析':'⚪'
  }[s] || '⚪';
  return icon + ' ' + s;
}

function sbmSetStatusStyle_(range, status) {
  var s = sbmNormalizeStatus_(status);
  var bg = '#f1f3f4';
  if (s === '良好') bg = '#d9ead3';
  else if (s === '改善中') bg = '#d9eaf7';
  else if (s === '改善候補') bg = '#fff2cc';
  else if (s === '様子見') bg = '#f3f3f3';
  else if (s === '管理対象外') bg = '#d9d9d9';
  try { range.setBackground(bg).setFontWeight('bold'); } catch(e) {}
}

function sbmDataListStatus_(row, diag) {
  if (diag && diag.URL) return '改善候補';
  var managed = String(row.Managed || row['管理対象'] || '').trim();
  var articleStatus = String(row.ArticleStatus || row['記事ステータス'] || row['状態'] || '').trim();
  if (articleStatus) {
    if (articleStatus.indexOf('改善候補') >= 0) return '改善候補';
    if (articleStatus.indexOf('改善中') >= 0) return '改善中';
    if (articleStatus.indexOf('様子見') >= 0) return '様子見';
    if (articleStatus.indexOf('管理対象外') >= 0) return '管理対象外';
    if (articleStatus.indexOf('良好') >= 0) return '良好';
  }
  if (managed === '×' || managed === 'NO') return '管理対象外';
  return '良好';
}

function sbmStyleDataListSheet_(sh) {
  if (!sh) return;
  sbmEnsureHeaders_(sh, SBM_HEADERS.QUERY_DATA);
  sh.setFrozenRows(1);
  // 利用者が日常確認する列だけを左側に集約。詳細情報は右側に保持して非表示。
  sh.setColumnWidth(1, 120);   // 記事ステータス
  sh.setColumnWidth(2, 360);   // 記事タイトル
  sh.setColumnWidth(3, 220);   // メインクエリ
  sh.setColumnWidth(4, 90);    // クリック数
  sh.setColumnWidth(5, 100);   // 表示回数
  sh.setColumnWidth(6, 80);    // CTR
  sh.setColumnWidth(7, 90);    // 平均順位
  sh.setColumnWidth(8, 80);    // 詳細
  sh.setColumnWidth(9, 150);   // 最終取得日時
  sh.setColumnWidth(10, 280);  // 記事URL（詳細用）
  sh.setColumnWidth(11, 360);  // SEOタイトル（詳細用）
  sh.setColumnWidth(12, 420);  // メタディスクリプション（詳細用）
  sh.getRange(1,1,1,SBM_HEADERS.QUERY_DATA.length).setBackground('#0b8043').setFontColor('#ffffff').setFontWeight('bold');
  var lr = Math.max(2, sh.getLastRow());
  sh.getDataRange().setWrap(true).setVerticalAlignment('middle');
  if (lr > 1) {
    sh.getRange(2,4,lr-1,1).setNumberFormat('#,##0');     // クリック数
    sh.getRange(2,5,lr-1,1).setNumberFormat('#,##0');     // 表示回数
    sh.getRange(2,6,lr-1,1).setNumberFormat('0.0%');      // CTR
    sh.getRange(2,7,lr-1,1).setNumberFormat('0.0');       // 平均順位
    sh.getRange(2,9,lr-1,1).setNumberFormat('yyyy-mm-dd hh:mm');
    var detailRange = sh.getRange(2,8,lr-1,1);
    detailRange.setValue('記事詳細');
    detailRange.setHorizontalAlignment('center').setBackground('#1155cc').setFontColor('#ffffff').setFontWeight('bold').setFontLine('underline');
    sh.getRange(1,8).setValue('詳細').setBackground('#1155cc').setFontColor('#ffffff').setFontWeight('bold');
    // ステータスは先頭マークと背景色で一目で判断できるようにする。
    var statuses = sh.getRange(2,1,lr-1,1).getValues();
    for (var i = 0; i < statuses.length; i++) {
      sbmSetStatusStyle_(sh.getRange(i + 2, 1), statuses[i][0]);
    }
  }
  // 横長化を避けるため、詳細ポップアップ用の列は非表示にする。
  try { sh.hideColumns(10, 3); } catch(e) {}
}

function sbmShowSelectedDataListDetail() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getActiveSheet();
  if (!sh || sh.getName() !== SBM_SHEETS.QUERY_DATA) {
    sbmAlert_('データ一覧詳細', 'データ一覧シートで詳細を見たい行を選択してから実行してください。');
    return;
  }
  var row = sh.getActiveRange() ? sh.getActiveRange().getRow() : 0;
  if (row <= 1) {
    sbmAlert_('データ一覧詳細', '詳細を見たい記事の行を選択してください。');
    return;
  }
  var headers = sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0];
  var vals = sh.getRange(row,1,1,sh.getLastColumn()).getValues()[0];
  var obj = {};
  headers.forEach(function(h,i){ obj[String(h||'')] = vals[i]; });
  var html = HtmlService.createHtmlOutput(sbmDataListDetailHtml_(obj)).setWidth(760).setHeight(620);
  SpreadsheetApp.getUi().showModalDialog(sbmEnsureCloseButton_(html), 'データ一覧 詳細');
}

function sbmDataListDetailHtml_(o) {
  function esc(v) { return sbmEscapeHtml_(v == null ? '' : String(v)); }
  function row(label, value) {
    return '<tr><th style="text-align:left;width:180px;padding:8px;border-bottom:1px solid #eee;color:#555">' + esc(label) + '</th>'
      + '<td style="padding:8px;border-bottom:1px solid #eee;white-space:pre-wrap">' + esc(value) + '</td></tr>';
  }
  var url = o['記事URL'] || '';
  return '<div style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Noto Sans JP,sans-serif;padding:20px;line-height:1.6;color:#202124">'
    + '<h2 style="margin:0 0 12px;font-size:22px">データ一覧 詳細</h2>'
    + '<div style="margin-bottom:14px;padding:10px 12px;background:#f1f8f4;border-left:5px solid #0b8043">この記事のSEOタイトル、メタディスクリプション、URLなどを確認できます。</div>'
    + '<table style="border-collapse:collapse;width:100%;font-size:14px">'
    + row('記事ステータス', o['記事ステータス'])
    + row('記事タイトル', o['記事タイトル'])
    + row('SEOタイトル（titleタグ）', o['SEOタイトル（titleタグ）'])
    + row('メタディスクリプション', o['メタディスクリプション'])
    + row('メインクエリ', o['メインクエリ'])
    + row('クリック数', o['クリック数'])
    + row('表示回数', o['表示回数'])
    + row('CTR', o['CTR'])
    + row('平均順位', o['平均順位'])
    + row('最終取得日時', o['最終取得日時'])
    + row('記事URL', url)
    + '</table>'
    + (url ? '<p style="margin-top:16px"><a href="' + esc(url) + '" target="_blank" style="display:inline-block;background:#0b8043;color:white;text-decoration:none;padding:10px 16px;border-radius:6px;font-weight:bold">記事を開く</a></p>' : '')
    + '</div>';
}


function sbmOpenSheetByName_(name) { return sbmOpenSheet_(name); }
function sbmOpenDataListSafe_() { sbmOpenSheetByName_(SBM_SHEETS.QUERY_DATA); }
function sbmOpenDashboardSafe_() { sbmOpenSheetByName_(SBM_SHEETS.DIAGNOSIS); }
function sbmRankCountsFromRows_(rows) {
  var c = {'🏆 エース':0,'✅ 安定':0,'📈 成長':0,'🌱 育成':0,'⚠️ 低迷':0};
  (rows || []).forEach(function(r){ var rank = String((r || {})['記事ランク'] || '').trim(); if (c.hasOwnProperty(rank)) c[rank]++; });
  return c;
}

function sbmStorePreviousRankCounts_(rows) {
  var c = sbmRankCountsFromRows_(rows || []);
  sbmSetSetting_('PrevAceCount', c['🏆 エース'], '前回日次更新時のエース件数');
  sbmSetSetting_('PrevStableCount', c['✅ 安定'], '前回日次更新時の安定件数');
  sbmSetSetting_('PrevGrowthCount', c['📈 成長'], '前回日次更新時の成長件数');
  sbmSetSetting_('PrevNurtureCount', c['🌱 育成'], '前回日次更新時の育成件数');
  sbmSetSetting_('PrevLowCount', c['⚠️ 低迷'], '前回日次更新時の低迷件数');
}

function sbmSignedDelta_(n) { n = Number(n || 0); return n > 0 ? '+' + n : String(n); }

function sbmBlogHealthComment_(counts, total) {
  total = Number(total || 0);
  if (!total) return '記事DBにデータがありません。日次更新を実行してください。';
  var strong = counts['🏆 エース'] + counts['✅ 安定'];
  var growth = counts['📈 成長'];
  var nurture = counts['🌱 育成'];
  var low = counts['⚠️ 低迷'];
  var strongRate = strong / total;
  var lowRate = low / total;
  var prevAce = Number(sbmGetSetting_('PrevAceCount', counts['🏆 エース'])) || 0;
  var prevGrowth = Number(sbmGetSetting_('PrevGrowthCount', growth)) || 0;
  var dAce = counts['🏆 エース'] - prevAce;
  var dGrowth = growth - prevGrowth;
  var title = '育成中';
  var body = '育成記事を積み上げながら、成長記事を増やす段階です。';
  if (strongRate >= 0.45 && lowRate <= 0.10) { title = '安定成長中'; body = 'エースと安定記事が全体の' + Math.round(strongRate*100) + '%を占め、ブログの土台は良好です。'; }
  else if (strongRate >= 0.30) { title = '成長基調'; body = '安定記事が増えつつあります。成長記事の改善が次の伸びにつながります。'; }
  else if (lowRate >= 0.25) { title = '立て直し優先'; body = '低迷記事の割合が高めです。表示回数のある記事から優先的に見直しましょう。'; }
  if (dAce < 0) body += ' エースが前回より' + Math.abs(dAce) + '件減っているため、順位低下の確認をおすすめします。';
  else if (dGrowth > 0) body += ' 成長記事が前回より' + dGrowth + '件増えています。';
  return '【' + title + '】' + body;
}


function sbmArticleRankComment_(rank) {
  var map = {
    '🏆 エース':'ブログを支える主力記事です。大きな変更より、順位低下やCTR悪化がないかを見守ります。',
    '✅ 安定':'検索流入が安定している記事です。急いで直す必要はなく、現状維持を基本にします。',
    '📈 成長':'表示や順位に伸びしろがある記事です。タイトルや検索意図の調整で成果が伸びる可能性があります。',
    '🌱 育成':'まだ評価材料が少ない記事です。データが蓄積するまで様子を見ながら育てます。',
    '⚠️ 低迷':'検索流入が弱い記事です。需要・検索意図・内容の見直し対象として検討します。'
  };
  return map[String(rank || '').trim()] || '記事DBの最新データを基に判定しています。';
}

function sbmWorkStateComment_(state) {
  var map = {
    '未着手':'現在は改善作業を行っていません。',
    '🔥 今日の改善':'本日の改善対象として選ばれています。',
    '✏️ 改善中':'現在、記事の修正作業を進めています。',
    '👀 モニター中':'改善後の順位・CTR・クリック数の変化を観察しています。',
    '✔️ 完了':'改善と確認が完了しています。',
    '🗑️ 削除候補':'長期間データがなく、削除・統合・管理対象外を確認する候補です。'
  };
  return map[String(state || '').trim()] || '作業状態はまだ設定されていません。';
}


function sbmRankWorkRecommendation_(rank, state) {
  rank = String(rank || '').trim();
  state = String(state || '').trim() || '未着手';
  if (state === '🔥 今日の改善') return '本日の改善対象です。記事ランクにかかわらず、改善ブリーフに沿って着手してください。';
  if (state === '✏️ 改善中') return '現在修正中です。作業を完了したらモニター中へ移し、数値変化を確認してください。';
  if (state === '👀 モニター中') return '改善後の経過観察中です。追加修正は急がず、CTR・順位・クリック数の推移を確認してください。';
  if (state === '✔️ 完了') return '改善と確認は完了しています。大きな変化がない限り、通常運用で問題ありません。';
  if (state === '🗑️ 削除候補') return '削除・統合・管理対象外の判断が必要です。Search Console未取得だけで自動削除はしないでください。';
  var map = {
    '🏆 エース':'未着手のままで問題ありません。主力記事なので大幅な変更は避け、順位やCTRの低下時だけ点検してください。',
    '✅ 安定':'未着手で問題ありません。現状維持を基本とし、成長記事や低迷記事を先に改善してください。',
    '📈 成長':'優先的に着手する価値があります。タイトル・検索意図・導入文の改善で成果が伸びる可能性があります。',
    '🌱 育成':'現時点では未着手で構いません。データが増えるまで様子を見て、表示回数が伸びたら改善候補にします。',
    '⚠️ 低迷':'需要と表示回数を確認してください。表示機会があるなら改善、ほとんどないなら優先度を下げて構いません。'
  };
  return map[rank] || '現在は未着手です。記事ランクと検索データを確認して、着手の優先度を判断してください。';
}

function sbmArticleDbBriefComingSoon() {
  return sbmOpenSelectedImprovementNavi();
}

function sbmArticleDbEffectComingSoon() {
  sbmAlert_('効果測定', '効果測定は準備中です。実装後は、記事DBで対象行を選択してこのメニューから開けるようになります。');
}

function sbmArticleDbCompleteComingSoon() {
  sbmAlert_('改善完了', '改善完了処理は準備中です。実装後は、記事DBで対象行を選択してこのメニューから実行できるようになります。');
}


function sbmShowArticleDbOpenLinkForRow_(sh, row) {
  var hm = sbmHeaderMap_(sh);
  var url = hm['記事URL'] ? sh.getRange(row, hm['記事URL']).getDisplayValue() : '';
  var title = hm['記事タイトル'] ? sh.getRange(row, hm['記事タイトル']).getDisplayValue() : '';
  if (!url) return sbmAlert_('記事を開けません', '記事URLがありません。');
  var e = sbmEscapeHtml_;
  var html = '<div style="font-family:Arial,sans-serif;padding:20px;line-height:1.7"><h2 style="color:#0b8043;margin-top:0">記事を開く</h2><p><b>' + e(title || '選択記事') + '</b></p><p><a href="' + e(url) + '" target="_blank" style="display:inline-block;background:#1a73e8;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;font-weight:700">ブラウザで記事を開く</a></p></div>';
  SpreadsheetApp.getUi().showModalDialog(sbmEnsureCloseButton_(HtmlService.createHtmlOutput(html).setWidth(500).setHeight(250)), '記事を開く');
}


function sbmArticleDbWorkAdvice_(rank, work) {
  rank = String(rank || '');
  work = String(work || '未着手');
  if (work.indexOf('改善中') >= 0) return '現在改善作業中です。変更内容を記録し、完了後はモニターへ移してください。';
  if (work.indexOf('モニター') >= 0) return '改善後の経過観察中です。クリック数・CTR・順位の変化を確認してください。';
  if (work.indexOf('今日の改善') >= 0) return '今日の作業対象です。改善ブリーフを確認して着手してください。';
  if (rank.indexOf('エース') >= 0) return '未着手のままで問題ありません。主力記事なので大幅な変更は避け、順位やCTRの低下時だけ点検してください。';
  if (rank.indexOf('成長') >= 0) return '優先的に着手する価値があります。検索意図・タイトル・導入文を見直すと伸びる可能性があります。';
  if (rank.indexOf('安定') >= 0) return '現状維持で問題ありません。ほかの成長記事を先に改善するのがおすすめです。';
  if (rank.indexOf('育成') >= 0) return 'まだ判断材料が少ない記事です。すぐに大きく直さず、表示回数と順位の推移を見てください。';
  if (rank.indexOf('低迷') >= 0) return '改善余地はありますが、表示回数が少ない場合は優先度を下げても構いません。検索意図のずれを確認してください。';
  return '現在の数値と記事ランクを確認し、ほかの記事との優先順位を比較してください。';
}

function sbmLegacyOnEdit_(e) {
  try {
    if (!e || !e.range) return;
    var sh = e.range.getSheet();
    var sheetName = sh.getName();
    var row = e.range.getRow();
    var col = e.range.getColumn();
    if (sheetName === SBM_SHEETS.USER_SETTINGS && col === 2 && row >= 2 && row <= 6) {
      var rules = {
        2: {key:'ArticleInfoBatch', min:30, max:100, label:'記事情報補完件数'},
        3: {key:'TodayInitialDisplayCount', min:1, max:6, label:'今日の改善初期表示件数'},
        4: {key:'TodayMaxDisplayCount', min:2, max:6, label:'今日の改善最大表示件数'},
        5: {key:'AnalysisCandidateLimit', min:10, max:10, label:'改善候補抽出件数'},
        6: {key:'SearchDays', min:7, max:365, label:'Search Console取得期間（日）'}
      };
      var rule = rules[row];
      var n = sbmNumber_(e.value || 0);
      var valid = Number.isFinite(n) && Math.floor(n) === n && n >= rule.min && n <= rule.max;
      if (valid && row === 4) {
        var initialCount = sbmNumber_(sh.getRange('B3').getValue()) || SBM_DEFAULTS.TODAY_INITIAL_DISPLAY;
        valid = n >= initialCount;
      }
      if (valid && row === 3) {
        var maxCount = sbmNumber_(sh.getRange('B4').getValue()) || SBM_DEFAULTS.TODAY_MAX_DISPLAY;
        valid = n <= maxCount;
      }
      if (!valid) {
        var extra = row === 3 || row === 4 ? '\n初期表示件数は最大表示件数以下にしてください。' : '';
        sbmAlert_('設定値を確認してください', rule.label + 'は' + rule.min + '～' + rule.max + 'の整数で入力してください。' + extra);
        sbmBuildUserSettingsSheet_();
        return;
      }
      sbmSetSetting_(rule.key, n, rule.label + '（設定シート）');
      if (row === 3) sbmSetSetting_('QueueLimit', n, '既存の今日の改善表示件数と同期');
      return;
    }
    if (row <= 1) return;
    var map = sbmHeaderMap_(sh);
    if (sheetName === SBM_SHEETS.EFFECT && map['詳細'] && col === map['詳細'] && String(e.value).toUpperCase() === 'TRUE') {
      sh.getRange(row, col).setValue(false);
      sh.setActiveRange(sh.getRange(row, 1));
      sbmShowEffectDetailForRow_(row);
      return;
    }
    if (sheetName === SBM_SHEETS.IN_PROGRESS && map['詳細'] && col === map['詳細'] && String(e.value).toUpperCase() === 'TRUE') {
      sh.getRange(row, col).setValue(false);
      sh.setActiveRange(sh.getRange(row, 1));
      sbmShowInProgressDetailForRow_(row);
      return;
    }
    if (sheetName === SBM_SHEETS.QUERY_DATA && map['詳細表示'] && col === map['詳細表示'] && String(e.value).toUpperCase() === 'TRUE') {
      sh.getRange(row, col).setValue(false);
      sh.setActiveRange(sh.getRange(row, 1));
      sbmShowSelectedDataListDetail();
      return;
    }
    if (sheetName === SBM_SHEETS.QUERY_DATA && map['詳細'] && col === map['詳細'] && String(e.value).toUpperCase() === 'TRUE') {
      sh.getRange(row, col).setValue(false);
      sh.setActiveRange(sh.getRange(row, 1));
      sbmShowSelectedDataListDetail();
      return;
    }
    if (sheetName !== SBM_SHEETS.TODAY) return;
    if (map['詳細'] && col === map['詳細'] && String(e.value).toUpperCase() === 'TRUE') {
      sh.getRange(row, col).setValue(false);
      sh.setActiveRange(sh.getRange(row, 1));
      sbmShowBriefForRow_(row);
      return;
    }
    if (map['完了'] && col === map['完了'] && String(e.value).toUpperCase() === 'TRUE') {
      sbmCompleteImprovementRow_(row, true);
      return;
    }
  } catch (err) {
    sbmLog_('onEdit','Error',String(err));
  }
}



function sbmShowSystemSheets() { [SBM_SHEETS.SETTINGS, SBM_SHEETS.SYSTEM_LOG, SBM_SHEETS.QUERY_DATA, SBM_SHEETS.DIAGNOSIS, SBM_SHEETS.BRIEF].forEach(function(n){ var s=SpreadsheetApp.getActiveSpreadsheet().getSheetByName(n); if(s) s.showSheet(); }); }
function sbmHideSystemSheets() { sbmRemoveRetiredSheets_(); sbmApplyProductVisibleTabs_(); sbmOpenHome(); }

function sbmProjectNumberNote_() { return 'Apps Scriptの設定画面で、使用中のGoogle Cloudプロジェクト番号と、Search Console APIを有効化したプロジェクト番号が一致しているか確認してください。'; }

function sbmFriendlyGscError_(message) {
  var m = String(message || '');
  if (m.indexOf('SERVICE_DISABLED') !== -1 || m.indexOf('has not been used') !== -1) return 'Google Cloud側でSearch Console APIがまだ有効化されていません。\n\nSTEP2を実行し、Google Search Console APIを有効化してください。\n有効化直後は数分待ってからSTEP3を再実行してください。\n\n重要: APIを有効化したGoogle Cloudプロジェクト番号と、Apps Scriptに設定されているプロジェクト番号が違うと、何分待っても接続できません。\n' + sbmProjectNumberNote_() + '\n\n詳細:\n' + m;
  if (m.indexOf('ACCESS_TOKEN_SCOPE_INSUFFICIENT') !== -1 || m.indexOf('insufficient authentication scopes') !== -1) return 'Apps Scriptの承認スコープが不足しています。\n\nappsscript.jsonに webmasters.readonly が含まれているか確認し、承認をやり直してください。\n\n詳細:\n' + m;
  if (m.indexOf('403') !== -1) return 'Search Consoleへアクセスできません。\n\n確認してください。\n・プロパティ表記が正しいか\n・このGoogleアカウントがSearch Consoleに登録されているか\n・Google Cloud APIが有効か\n\n詳細:\n' + m;
  return m;
}

function sbmPromptRequired_(title, message, defaultValue) {
  var promptText = message + (defaultValue ? '\n\n現在値: ' + defaultValue : '');
  var res = SpreadsheetApp.getUi().prompt(title, promptText, SpreadsheetApp.getUi().ButtonSet.OK_CANCEL);
  if (res.getSelectedButton() !== SpreadsheetApp.getUi().Button.OK) return null;
  var value = sbmSafeText_(res.getResponseText());
  if (!value && defaultValue) value = defaultValue;
  if (!value) { sbmAlert_('入力が必要です', '空欄では登録できません。もう一度実行してください。'); return null; }
  return value;
}


function sbmCreateProfiler_(processName) {
  var runId = 'PRF-' + Utilities.formatDate(new Date(), Session.getScriptTimeZone() || SBM_DEFAULTS.TIMEZONE, 'yyyyMMdd-HHmmss') + '-' + Math.floor(Math.random()*10000);
  var entries = [];
  var last = new Date();
  function nowText_(d){ return Utilities.formatDate(d || new Date(), Session.getScriptTimeZone() || SBM_DEFAULTS.TIMEZONE, 'yyyy-MM-dd HH:mm:ss'); }
  return {
    runId: runId,
    lap: function(step, targetCount, processedCount, detail) {
      var now = new Date();
      var sec = Math.round((now.getTime() - last.getTime()) / 100) / 10;
      entries.push([nowText_(now), runId, processName || '', step || '', nowText_(last), nowText_(now), sec, targetCount === undefined ? '' : targetCount, processedCount === undefined ? '' : processedCount, detail || '']);
      last = now;
    },
    finish: function(status, detail) {
      this.lap('終了: ' + (status || ''), '', '', detail || '');
      sbmAppendProfileRows_(entries);
      return runId;
    }
  };
}

function sbmAppendProfileRows_(rows) {
  try {
    if (!rows || !rows.length) return;
    var sh = sbmGetOrCreateSheet_(SBM_SHEETS.PROFILE_LOG);
    var wasEmpty = sh.getLastRow() < 1;
    sbmEnsureHeaders_(sh, SBM_HEADERS.PROFILE_LOG);
    var startRow = sh.getLastRow() + 1;
    sh.getRange(startRow, 1, rows.length, SBM_HEADERS.PROFILE_LOG.length).setValues(rows);
    sh.getRange(startRow, 7, rows.length, 1).setNumberFormat('0.0');
    if (wasEmpty) sbmStyleProfileLogSheet_(sh);
  } catch(e) { console.error(e); }
}

function sbmOpenProfileLog() { sbmOpenSheet_(SBM_SHEETS.PROFILE_LOG); }

function sbmStyleProfileLogSheet_(sh) {
  if (!sh) return;
  sbmEnsureHeaders_(sh, SBM_HEADERS.PROFILE_LOG);
  sh.setFrozenRows(1);
  sh.getRange(1,1,1,SBM_HEADERS.PROFILE_LOG.length).setFontWeight('bold').setBackground('#0b8043').setFontColor('#ffffff');
  if (sh.getLastRow() > 1) sh.getRange(2,7,sh.getLastRow()-1,1).setNumberFormat('0.0');
  try { sh.autoResizeColumns(1, Math.min(SBM_HEADERS.PROFILE_LOG.length, sh.getMaxColumns())); } catch(e) {}
}

function sbmSecondsSince_(started) {
  return Math.round((new Date().getTime() - started.getTime()) / 1000);
}

function sbmProcessLog_(name, status, targetCount, processedCount, seconds, detail, startedAt, endedAt) {
  try {
    var endText = endedAt || sbmNowText_();
    sbmAppendObject_(SBM_SHEETS.PROCESS_LOG, SBM_HEADERS.PROCESS_LOG, {
      '日時': endText,
      '処理': name || '',
      '状態': status || '',
      '対象件数': targetCount === undefined ? '' : targetCount,
      '処理件数': processedCount === undefined ? '' : processedCount,
      '所要秒': seconds === undefined ? '' : seconds,
      '開始時刻': startedAt || '',
      '終了時刻': endText,
      '詳細': detail || ''
    });
    sbmStyleProcessLogSheet_(sbmGetOrCreateSheet_(SBM_SHEETS.PROCESS_LOG));
  } catch(e) {}
}

function sbmBuildInProgressSheet_() {
  var ss=SpreadsheetApp.getActiveSpreadsheet();
  var sh=ss.getSheetByName(SBM_SHEETS.IN_PROGRESS);
  if(sh && ss.getSheets().length>1){try{ss.deleteSheet(sh);}catch(e){}}
  return 0;
}

function sbmRewriteSheet_(sheetName, headers, rows) {
  var sh = sbmGetOrCreateSheet_(sheetName);
  sh.clear();
  sbmEnsureHeaders_(sh, headers);
  var normalized = sbmNormalizeRowsToWidth_(rows || [], headers.length);
  if (normalized.length) sh.getRange(2, 1, normalized.length, headers.length).setValues(normalized);
  sbmStyleDataSheet_(sh);
}

function sbmNormalizeRowsToWidth_(rows, width) {
  return (rows || []).map(function(row){
    var r = Array.isArray(row) ? row.slice(0, width) : [];
    while (r.length < width) r.push('');
    return r;
  });
}
function sbmGetOrCreateSheet_(name) { var ss=SpreadsheetApp.getActiveSpreadsheet(); return ss.getSheetByName(name) || ss.insertSheet(name); }
function sbmOpenSheet_(name) { var sh=sbmGetOrCreateSheet_(name); sh.showSheet(); SpreadsheetApp.getActiveSpreadsheet().setActiveSheet(sh); return sh; }
function sbmEnsureHeaders_(sh, headers) {
  if (!sh || !headers || !headers.length) return;
  if (sh.getMaxColumns() < headers.length) sh.insertColumnsAfter(sh.getMaxColumns(), headers.length - sh.getMaxColumns());
  sh.getRange(1, 1, 1, headers.length).setValues([headers]);
  sh.setFrozenRows(1);
}
function sbmRowsAsObjects_(sheetName) { var sh=SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName); if(!sh || sh.getLastRow()<2) return []; var vals=sh.getDataRange().getValues(); var heads=vals.shift().map(String); return vals.map(function(row,idx){ var o={_rowNumber:idx+2}; heads.forEach(function(h,i){o[h]=row[i];}); return o; }); }
function sbmHeaderMap_(sh) { var heads=sh.getRange(1,1,1,Math.max(1,sh.getLastColumn())).getValues()[0]; var map={}; heads.forEach(function(h,i){ if(String(h)) map[String(h)] = i+1; }); return map; }
function sbmFindRowByValue_(sheetName, headerName, value) { var sh=SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName); if(!sh || sh.getLastRow()<2) return null; var col=sbmHeaderMap_(sh)[headerName]; if(!col) return null; var vals=sh.getRange(2,col,sh.getLastRow()-1,1).getValues(); for(var i=0;i<vals.length;i++){ if(String(vals[i][0])===String(value)) return i+2; } return null; }
function sbmSetObjectValues_(sh,row,updates) { var map=sbmHeaderMap_(sh); Object.keys(updates).forEach(function(k){ if(map[k]) sh.getRange(row,map[k]).setValue(updates[k]); }); }
function sbmAppendObject_(sheetName, headers, obj) { var sh=sbmGetOrCreateSheet_(sheetName); sbmEnsureHeaders_(sh, headers); var map=sbmHeaderMap_(sh); var row=new Array(Math.max(headers.length,sh.getLastColumn())).fill(''); headers.forEach(function(h){ var c=map[h]; if(c) row[c-1]= obj[h] !== undefined ? obj[h] : ''; }); sh.appendRow(row); return sh.getLastRow(); }
function sbmGetSetting_(key, def) { var rows=sbmRowsAsObjects_(SBM_SHEETS.SETTINGS); for(var i=0;i<rows.length;i++){ if(String(rows[i].Key)===String(key)) return rows[i].Value; } return def; }
function sbmSetSettingIfEmpty_(key, value, desc) { var current=sbmGetSetting_(key, null); if(current === null || current === '') sbmSetSetting_(key,value,desc); }
function sbmSetSetting_(key,value,desc) { var sh=sbmGetOrCreateSheet_(SBM_SHEETS.SETTINGS); sbmEnsureHeaders_(sh, SBM_HEADERS.SETTINGS); var row=sbmFindRowByValue_(SBM_SHEETS.SETTINGS,'Key',key); if(row) sbmSetObjectValues_(sh,row,{Value:value,Description:desc||'',UpdatedAt:sbmNowText_()}); else sbmAppendObject_(SBM_SHEETS.SETTINGS, SBM_HEADERS.SETTINGS, {Key:key,Value:value,Description:desc||'',UpdatedAt:sbmNowText_()}); }
function sbmFindBriefByUrl_(url) { var rows = sbmRowsAsObjects_(SBM_SHEETS.BRIEF); for (var i=0;i<rows.length;i++){ if(String(rows[i].URL) === String(url)) return rows[i]; } return null; }
function sbmImprovementRequestText_(title, url, mainQuery, subQueries, faqQueries, separateQueries, noiseQueries, querySummary, reason, recommendation) {
  return '次の記事を改善してください。\n\n'
    + '記事タイトル: ' + (title || '') + '\n'
    + 'URL: ' + (url || '') + '\n'
    + 'メインクエリ: ' + (mainQuery || '') + '\n\n'
    + '改善理由:\n' + (reason || '') + '\n\n'
    + '推奨改善:\n' + (recommendation || '') + '\n\n'
    + 'Search Consoleクエリ分析:\n' + (querySummary || '-') + '\n\n'
    + '本文・見出しに使うサブクエリ:\n' + (subQueries || '-') + '\n\n'
    + 'FAQ候補:\n' + (faqQueries || '-') + '\n\n'
    + '別記事候補クエリ（この記事には無理に入れない）:\n' + (separateQueries || '-') + '\n\n'
    + '改善に使わない除外クエリ:\n' + (noiseQueries || '-') + '\n\n'
    + '依頼:\nメインクエリを軸に、サブクエリだけを本文・見出し・FAQへ自然に反映して改善してください。別記事候補や除外クエリはこの記事に無理に入れないでください。必要なら最後に「別記事として作るべきテーマ」を提案してください。';
}

function sbmBriefHtml_(b) {
  function esc(v){ return String(v || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>'); }
  var request = b['改善依頼文'] || sbmImprovementRequestText_(b['記事タイトル'], b.URL, b['メインクエリ'], b['サブクエリ'], b['FAQ候補'], b['別記事候補'], b['除外クエリ'], b['クエリ分析'], '', b['理由'], b['推奨改善']);
  return '<div style="font-family:Arial,sans-serif;line-height:1.65;padding:18px;color:#202124">'
    + '<h2 style="margin-top:0">改善ブリーフ</h2>'
    + '<div style="background:#e8f0fe;padding:12px;border-radius:8px;margin-bottom:14px"><b>' + esc(b['記事タイトル']) + '</b><br><a href="' + esc(b.URL) + '" target="_blank">記事を開く</a></div>'
    + '<p><b>メインクエリ:</b> ' + esc(b['メインクエリ']) + '</p>'
    + '<p><b>現在値:</b> CTR ' + esc(b.CTR) + ' / 順位 ' + esc(b.Position) + ' / クリック ' + esc(b.Clicks) + ' / 表示回数 ' + esc(b.Impressions) + '</p>'
    + '<h3>改善理由</h3><p>' + esc(b['理由']) + '</p>'
    + '<h3>推奨改善</h3><p>' + esc(b['推奨改善']) + '</p>'
    + '<h3>Search Consoleクエリ分析</h3><p>' + esc(b['クエリ分析']) + '</p>'
    + '<h3>本文・見出しに使うサブクエリ</h3><p>' + esc(b['サブクエリ']) + '</p>'
    + '<h3>FAQ候補</h3><p>' + esc(b['FAQ候補']) + '</p>'
    + '<h3>別記事候補</h3><p>' + esc(b['別記事候補']) + '</p>'
    + '<h3>改善に使わない除外クエリ</h3><p>' + esc(b['除外クエリ']) + '</p>'
    + '<h3>AIでリライトするための依頼文</h3>'
    + '<textarea style="width:100%;height:230px;font-family:monospace;font-size:12px;white-space:pre-wrap">' + String(request || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</textarea>'
    + '<hr><p>推定時間: ' + esc(b['推定時間']) + '分 / Score: ' + esc(b.Score) + '</p>'
    + '</div>';
}



function sbmShowEffectDetailForRow_(row) {
  var sh = sbmGetOrCreateSheet_(SBM_SHEETS.EFFECT);
  var heads = sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0].map(String);
  var vals = sh.getRange(row,1,1,sh.getLastColumn()).getValues()[0];
  var o = {}; heads.forEach(function(h,i){ o[h]=vals[i]; });
  var html = HtmlService.createHtmlOutput(sbmEffectDetailHtml_(o)).setWidth(820).setHeight(680);
  SpreadsheetApp.getUi().showModalDialog(sbmEnsureCloseButton_(html), '改善の推移の詳細');
}

function sbmEffectDetailHtml_(o) {
  function esc(v){ return String(v || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>'); }
  return '<div style="font-family:Arial,sans-serif;line-height:1.65;padding:18px;color:#202124">'
    + '<h2 style="margin-top:0">改善の推移の詳細</h2>'
    + '<div style="background:#e8f0fe;padding:12px;border-radius:8px;margin-bottom:14px"><b>' + esc(o['記事タイトル']) + '</b><br><a href="' + esc(o.URL) + '" target="_blank">記事を開く</a></div>'
    + '<h3>概要</h3><p><b>改善日:</b> ' + esc(o['改善日']) + '　<b>判定:</b> ' + esc(o['判定']) + '</p>'
    + '<p><b>改善内容:</b> ' + esc(o['改善内容']) + '</p><p><b>修正内容:</b> ' + esc(o['修正内容']) + '</p>'
    + '<h3>数値の変化</h3>'
    + '<table style="border-collapse:collapse;width:100%"><tr><th style="border:1px solid #ddd;padding:8px">項目</th><th style="border:1px solid #ddd;padding:8px">改善前</th><th style="border:1px solid #ddd;padding:8px">現在</th><th style="border:1px solid #ddd;padding:8px">変化</th></tr>'
    + '<tr><td style="border:1px solid #ddd;padding:8px">順位</td><td style="border:1px solid #ddd;padding:8px">' + esc(o['改善前順位']) + '</td><td style="border:1px solid #ddd;padding:8px">' + esc(o['現在順位']) + '</td><td style="border:1px solid #ddd;padding:8px">' + esc(o['順位変化']) + '</td></tr>'
    + '<tr><td style="border:1px solid #ddd;padding:8px">CTR</td><td style="border:1px solid #ddd;padding:8px">' + esc(o['改善前CTR']) + '</td><td style="border:1px solid #ddd;padding:8px">' + esc(o['現在CTR']) + '</td><td style="border:1px solid #ddd;padding:8px">' + esc(o['CTR変化']) + '</td></tr>'
    + '<tr><td style="border:1px solid #ddd;padding:8px">クリック</td><td style="border:1px solid #ddd;padding:8px">' + esc(o['改善前クリック']) + '</td><td style="border:1px solid #ddd;padding:8px">' + esc(o['現在クリック']) + '</td><td style="border:1px solid #ddd;padding:8px">' + esc(o['クリック変化']) + '</td></tr></table>'
    + '<h3>SIMS評価</h3><p>' + esc(o['SIMS評価']) + '</p>'
    + '<h3>次のアクション</h3><p>' + esc(o['次のアクション']) + '</p>'
    + '<h3>コメント</h3><p>' + esc(o['コメント']) + '</p></div>';
}


function sbmShowInProgressDetailForRow_(row) {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SBM_SHEETS.IN_PROGRESS);
  var map = sbmHeaderMap_(sh);
  var obj = {}; Object.keys(map).forEach(function(k){ obj[k] = sh.getRange(row,map[k]).getValue(); });
  var html = HtmlService.createHtmlOutput(sbmInProgressDetailHtml_(obj)).setWidth(760).setHeight(620);
  SpreadsheetApp.getUi().showModalDialog(sbmEnsureCloseButton_(html), '改善中の詳細');
}

function sbmInProgressDetailHtml_(o) {
  var esc = sbmEscHtml_;
  return '<div style="font-family:Arial,sans-serif;padding:20px;line-height:1.7">'
    + '<h2 style="margin-top:0">改善中の詳細</h2>'
    + '<h3>記事</h3><p><b>' + esc(o['記事タイトル']) + '</b></p>'
    + '<p><a target="_blank" href="' + esc(o.URL) + '">記事を開く</a></p>'
    + '<h3>状態</h3><p>' + esc(o['状態']) + ' / 経過日数: ' + esc(o['経過日数']) + '日</p>'
    + '<h3>SIMS評価</h3><p>' + esc(o['SIMS評価']) + '</p>'
    + '<h3>次のアクション</h3><p>' + esc(o['次のアクション']) + '</p>'
    + '<h3>修正内容</h3><p>' + esc(o['修正内容']) + '</p>'
    + '</div>';
}


function sbmEvaluateEffectResult_(outcome, posDelta, ctrDelta, clickDelta) {
  if (outcome === '成功' || outcome === '改善傾向') {
    if ((posDelta && posDelta >= 3) || ctrDelta >= 0.01 || clickDelta >= 20) return '★★★★★ 改善成功。順位・CTR・クリックのいずれかに明確な改善が見られます。';
    return '★★★★☆ 改善傾向。しばらく測定を続けてください。';
  }
  if (outcome === '要再改善' || outcome === '要確認') return '★★☆☆☆ 要確認。改善後に数値が悪化、または伸びが弱い可能性があります。';
  if (outcome === '横ばい') return '★★★☆☆ 横ばい。追加改善または測定継続を検討してください。';
  return '★★★☆☆ 測定待ち。十分なデータがたまるまで様子を見ます。';
}

function sbmSuggestNextAction_(outcome, improvement, actions, posDelta, ctrDelta, clickDelta) {
  var text = String(improvement || '') + ' ' + String(actions || '');
  if (outcome === '成功' || outcome === '改善傾向') return 'このまま測定継続。追加改善は急がず、7日分の推移を確認してください。';
  if (outcome === '要再改善' || outcome === '要確認') {
    if (text.indexOf('タイトル') === -1 && text.indexOf('Title') === -1) return 'タイトル・ディスクリプション・導入文を再確認してください。';
    if (text.indexOf('FAQ') === -1) return 'FAQ追加、本文補強、検索意図に合うH2追加を検討してください。';
    return '改善内容を見直し、検索意図に合う修正方針を確認してください。';
  }
  if (outcome === '横ばい') return '測定継続。動きが弱い場合はFAQ追加または内部リンク追加を検討してください。';
  return 'まだ判断しません。RCテストでは毎日測定し、7日分の推移を確認してください。';
}

function sbmAppendMeasurementHistoryUnique_(rows) {
  if (!rows.length) return;
  var sh = sbmGetOrCreateSheet_(SBM_SHEETS.MEASURE_HISTORY);
  sbmEnsureHeaders_(sh, SBM_HEADERS.MEASURE_HISTORY);
  var existing = sbmRowsAsObjects_(SBM_SHEETS.MEASURE_HISTORY);
  var seen = {};
  existing.forEach(function(r){ seen[String(r['記録日']) + '|' + String(r.URL) + '|' + String(r['改善日'])] = true; });
  var add = [];
  rows.forEach(function(r){ var key = String(r[2]) + '|' + String(r[9]) + '|' + String(r[1]); if (!seen[key]) { seen[key] = true; add.push(r); } });
  if (add.length) sh.getRange(sh.getLastRow()+1,1,add.length,SBM_HEADERS.MEASURE_HISTORY.length).setValues(add);
  try { if (sh.getLastRow() > 2) sh.getRange(2,1,sh.getLastRow()-1,SBM_HEADERS.MEASURE_HISTORY.length).sort([{column:1, ascending:true},{column:3, ascending:true}]); } catch(e) {}
}



function sbmDateAfterText_(days) { var d = new Date(); d.setDate(d.getDate()+days); return sbmDateText_(d); }

function sbmLog_(action,status,detail) { try { sbmAppendObject_(SBM_SHEETS.SYSTEM_LOG, SBM_HEADERS.SYSTEM_LOG, {CreatedAt:sbmNowText_(),Action:action,Status:status,Detail:detail||''}); } catch(e) { console.error(e); } }
function sbmDateText_(d) { return Utilities.formatDate(d, Session.getScriptTimeZone() || SBM_DEFAULTS.TIMEZONE, 'yyyy-MM-dd'); }
function sbmDisplayDateText_(value) { var d=sbmParseDate_(value); return d ? Utilities.formatDate(d, Session.getScriptTimeZone() || SBM_DEFAULTS.TIMEZONE, 'yyyy/M/d') : ''; }
function sbmNowText_() { return Utilities.formatDate(new Date(), Session.getScriptTimeZone() || SBM_DEFAULTS.TIMEZONE, 'yyyy-MM-dd HH:mm:ss'); }
function sbmId_(p) { return p + '-' + Utilities.formatDate(new Date(), Session.getScriptTimeZone() || SBM_DEFAULTS.TIMEZONE, 'yyyyMMdd-HHmmss') + '-' + Math.floor(Math.random()*10000); }
function sbmSafeText_(v) { return v === null || v === undefined ? '' : String(v).trim(); }
function sbmNumber_(v) { if(typeof v === 'number') return v; var n=Number(String(v||'').replace('%','').replace(/,/g,'').trim()); return isNaN(n)?0:n; }

function sbmToast_(message, title, seconds) {
  try { SpreadsheetApp.getActiveSpreadsheet().toast(String(message || ''), String(title || 'SIMS-Blog-Manager'), seconds || 5); } catch(e) {}
}

function sbmAlert_(title,msg) { SpreadsheetApp.getUi().alert(title, msg, SpreadsheetApp.getUi().ButtonSet.OK); }

function sbmApplyCommonNumberFormats_(sh) {
  var map = sbmHeaderMap_(sh);
  var lr = Math.max(sh.getLastRow(), 2);
  ['順位','現在順位','改善前順位','Position','現在平均順位'].forEach(function(h){ if(map[h]) sh.getRange(2,map[h],lr-1,1).setNumberFormat('0.0'); });
  ['CTR','現在CTR','改善前CTR','現在CTR','CTR変化'].forEach(function(h){ if(map[h]) sh.getRange(2,map[h],lr-1,1).setNumberFormat('0.00%'); });
  ['Clicks','Impressions','クリック','表示回数','現在クリック','現在表示回数','改善前クリック','改善前表示回数','クリック変化','現在クリック','現在表示回数','記事Aクリック','記事Bクリック'].forEach(function(h){ if(map[h]) sh.getRange(2,map[h],lr-1,1).setNumberFormat('#,##0'); });
  ['Score','OpportunityScore'].forEach(function(h){ if(map[h]) sh.getRange(2,map[h],lr-1,1).setNumberFormat('0'); });
}

function sbmStyleDataSheet_(sh) { var lc=Math.max(sh.getLastColumn(),1); var lr=Math.max(sh.getLastRow(),1); sh.setFrozenRows(1); sh.getRange(1,1,1,lc).setFontWeight('bold').setBackground('#e8f0fe').setWrap(true); sh.getRange(1,1,lr,lc).setVerticalAlignment('top').setWrap(true); try{ sh.autoResizeColumns(1, Math.min(lc,12)); }catch(e){} try{ sbmApplyCommonNumberFormats_(sh); }catch(e){} }
function sbmStyleTodaySheet_(sh) {
  sbmStyleDataSheet_(sh);
  var widths = [70,70,260,190,230,110,70,70,55,55,85,65,65,55,85,75,65,180,60,1,80,120];
  widths.forEach(function(w,i){ try{ sh.setColumnWidth(i+1,w); }catch(e){} });
  try { sh.hideColumns(20); } catch(e) {}
  var lr = Math.max(sh.getLastRow(),2);
  if (lr > 1) {
    sh.setRowHeights(2, lr-1, 42);
    try { sh.getRange(2,7,lr-1,1).insertCheckboxes(); } catch(e) {}
    try { sh.getRange(2,8,lr-1,1).insertCheckboxes(); } catch(e) {}
    try { sh.getRange(2,9,lr-1,9).insertCheckboxes(); } catch(e) {}
  }
  sh.getRange(1,1,1,Math.max(sh.getLastColumn(),1)).setBackground('#0b8043').setFontColor('#ffffff').setFontWeight('bold');
}
function sbmStyleLogSheet_(sh) {
  sbmStyleDataSheet_(sh);
  try {
    sh.setFrozenRows(1);
    sh.setColumnWidth(1,140); // 改善日
    sh.setColumnWidth(2,300); // 記事タイトル
    sh.setColumnWidth(3,1);
    sh.hideColumns(3);
    sh.setColumnWidth(4,170); // メインクエリ
    sh.setColumnWidth(5,220); // 改善内容
    sh.setColumnWidth(6,220); // 修正内容
    sh.setColumnWidth(7,90);
    sh.setColumnWidth(8,220);
    if (sh.getLastColumn() >= 9) { sh.setColumnWidths(9, Math.min(7, sh.getLastColumn()-8), 1); sh.hideColumns(9, Math.min(7, sh.getLastColumn()-8)); }
    sh.setRowHeights(2, Math.max(1, sh.getLastRow()-1), 46);
  } catch(e) {}
}
function sbmStyleEffectSheet_(sh) {
  sbmStyleDataSheet_(sh);
  try {
    sh.setFrozenRows(1);
    sh.setColumnWidth(1,300);  // 記事タイトル
    sh.setColumnWidth(2,120);  // 改善日
    sh.setColumnWidth(3,170);  // 改善内容
    sh.setColumnWidth(4,90);   // 判定
    sh.setColumnWidth(5,260);  // SIMS評価
    sh.setColumnWidth(6,300);  // 次のアクション
    sh.setColumnWidth(7,70);   // 詳細
    if (sh.getLastColumn() >= 8) { sh.setColumnWidths(8, sh.getLastColumn()-7, 1); sh.hideColumns(8, sh.getLastColumn()-7); }
    if (sh.getLastRow() > 1) sh.getRange(2,7,sh.getLastRow()-1,1).insertCheckboxes();
    sh.setRowHeights(2, Math.max(1, sh.getLastRow()-1), 52);
  } catch(e) {}
}

function sbmStyleInProgressSheet_(sh) {
  sbmStyleDataSheet_(sh);
  try {
    sh.setFrozenRows(1);
    sh.setColumnWidth(1,140);
    sh.setColumnWidth(2,320);
    sh.setColumnWidth(3,80);
    sh.setColumnWidth(4,100);
    sh.setColumnWidth(5,260);
    sh.setColumnWidth(6,280);
    sh.setColumnWidth(7,70);
    if (sh.getLastColumn() >= 8) { sh.setColumnWidths(8, sh.getLastColumn()-7, 1); sh.hideColumns(8, sh.getLastColumn()-7); }
    if (sh.getLastRow() > 1) sh.getRange(2,7,sh.getLastRow()-1,1).insertCheckboxes();
    sh.setRowHeights(2, Math.max(1, sh.getLastRow()-1), 52);
  } catch(e) {}
}

function sbmStyleProcessLogSheet_(sh) {
  sbmStyleDataSheet_(sh);
  try {
    sh.setFrozenRows(1);
    sh.setColumnWidth(1,150);
    sh.setColumnWidth(2,220);
    sh.setColumnWidth(3,90);
    sh.setColumnWidth(4,90);
    sh.setColumnWidth(5,90);
    sh.setColumnWidth(6,80);
    sh.setColumnWidth(7,420);
    sh.setRowHeights(2, Math.max(1, sh.getLastRow()-1), 38);
  } catch(e) {}
}

function sbmStyleMeasureHistorySheet_(sh) {
  sbmStyleDataSheet_(sh);
  try {
    sh.setFrozenRows(1);
    sh.setColumnWidth(1,300); // 記事タイトル
    sh.setColumnWidth(2,120); // 改善日
    sh.setColumnWidth(3,110); // 記録日
    sh.setColumnWidth(4,80);  // 経過日数
    sh.setColumnWidths(5,5,95);
    sh.setColumnWidth(10,1);
    sh.hideColumns(10);
    sh.setRowHeights(2, Math.max(1, sh.getLastRow()-1), 36);
  } catch(e) {}
}


function sbmStyleBriefSheet_(sh) {
  sbmStyleDataSheet_(sh);
  try { sh.hideSheet(); } catch(e) {}
}
function sbmStyleUserSheet_(sh, color) { var lc=Math.max(sh.getLastColumn(),2); var lr=Math.max(sh.getLastRow(),1); sh.setFrozenRows(1); sh.getRange(1,1,1,lc).setFontWeight('bold').setFontSize(15).setBackground(color).setFontColor('#ffffff'); sh.getRange(1,1,lr,lc).setVerticalAlignment('top').setWrap(true); sh.getRange(1,1,lr,lc).setBorder(true,true,true,true,true,true); }
function sbmApplySheetUx_() { var ss=SpreadsheetApp.getActiveSpreadsheet(); [SBM_SHEETS.HOME, SBM_SHEETS.ARTICLE_DB, SBM_SHEETS.SETUP, SBM_SHEETS.LOG].forEach(function(n){ var s=ss.getSheetByName(n); if(s) s.showSheet(); }); sbmHideSystemSheets(); }


function sbmFormatInt_(v) {
  var n = Math.round(sbmNumber_(v));
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}


/** Product 5.0: 旧ステータスから記事ランクへ移行する互換処理。 */
function sbmLegacyStatusToRank_(status) {
  status = sbmNormalizeStatus_(status || '');
  if (status === '良好') return '✅ 安定';
  if (status === '改善候補') return '📈 成長';
  if (status === '様子見') return '🌱 育成';
  if (status === '管理対象外') return '—';
  return '';
}

/** Product 5.0: 旧ステータスから作業状態へ移行する互換処理。 */
function sbmLegacyStatusToWorkState_(status) {
  status = sbmNormalizeStatus_(status || '');
  if (status === '改善中') return '✏️ 改善中';
  return '未着手';
}

function sbmPercentileRank_(sortedValues, value) {
  var a = (sortedValues || []).map(function(v){ return sbmNumber_(v); }).filter(function(v){ return isFinite(v); });
  if (!a.length) return 0;
  a.sort(function(x,y){ return x-y; });
  value = sbmNumber_(value);
  var less = 0, equal = 0;
  for (var i=0; i<a.length; i++) {
    if (a[i] < value) less++;
    else if (a[i] === value) equal++;
    else break;
  }
  return Math.max(0, Math.min(1, (less + equal * 0.5) / a.length));
}

function sbmApplyArticleRanksToObjectMap_(map) {
  var keys = Object.keys(map || {});
  var rows = keys.map(function(k){ return map[k]; }).filter(function(r){ return r && r['記事URL']; });
  var clickVals = rows.map(function(r){ return sbmNumber_(r['クリック数'] || 0); }).sort(function(a,b){return a-b;});
  var impVals = rows.map(function(r){ return sbmNumber_(r['表示回数'] || 0); }).sort(function(a,b){return a-b;});
  var minImps = sbmNumber_(sbmGetSetting_('MinImpressions', SBM_DEFAULTS.MIN_IMPRESSIONS)) || SBM_DEFAULTS.MIN_IMPRESSIONS;
  rows.forEach(function(r){
    if (!r['作業状態']) r['作業状態'] = sbmLegacyStatusToWorkState_(r['記事ステータス'] || '');
    var clicks = sbmNumber_(r['クリック数'] || 0);
    var imps = sbmNumber_(r['表示回数'] || 0);
    var ctr = sbmNumber_(r['CTR'] || 0);
    var pos = sbmNumber_(r['掲載順位'] || 0);
    if (imps < minImps) { r['記事ランク'] = '🌱 育成'; return; }
    var clickPct = sbmPercentileRank_(clickVals, clicks);
    var impPct = sbmPercentileRank_(impVals, imps);
    var ctrScore = Math.max(0, Math.min(1, ctr / 0.08));
    var posScore = pos > 0 ? Math.max(0, Math.min(1, (40 - Math.min(pos,40)) / 39)) : 0;
    var score = clickPct * 50 + impPct * 20 + ctrScore * 15 + posScore * 15;
    if (score >= 82 && clickPct >= 0.85 && pos > 0 && pos <= 10) r['記事ランク'] = '🏆 エース';
    else if (score >= 62) r['記事ランク'] = '📈 成長';
    else if (score >= 42) r['記事ランク'] = '✅ 安定';
    else r['記事ランク'] = '⚠️ 低迷';
  });
}

function sbmUpdateArticleRankManual() {
  var started = new Date();
  var startedText = sbmNowText_();
  try {
    var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SBM_SHEETS.ARTICLE_DB);
    if (!sh || sh.getLastRow() < 2) throw new Error('記事DBにデータがありません。');
    var rows = sbmRowsAsObjects_(SBM_SHEETS.ARTICLE_DB);
    var map = {};
    rows.forEach(function(r){
      var url = sbmNormalizeUrl_(r['記事URL'] || '');
      if (!url) return;
      if (!r['作業状態']) r['作業状態'] = sbmLegacyStatusToWorkState_(r['記事ステータス'] || '');
      map[url] = r;
    });
    sbmApplyArticleRanksToObjectMap_(map);
    var out = Object.keys(map).map(function(url){
      var r = map[url];
      return SBM_HEADERS.ARTICLE_DB.map(function(h){ return r[h] !== undefined ? r[h] : ''; });
    });
    sbmWriteArticleDb_(out);
    sbmUpdateHomeArticleDbCounts_(out);
    var sec = sbmSecondsSince_(started);
    sbmProcessLog_('記事ランク再判定', '完了', out.length, out.length, sec, '外部アクセスなし。作業状態は維持。', startedText, sbmNowText_());
    sbmAlert_('記事ランク再判定完了', out.length + '件の記事ランクを更新しました。\n作業状態は変更していません。');
  } catch(e) {
    sbmAlert_('記事ランク再判定エラー', String(e));
  }
}



/**
 * Product 5.0 RC10 Reset Base compatibility core.
 * メニューと現行機能の呼び出し先を一元化し、リファクタリング途中の未定義参照を防ぎます。
 */
function sbmOpenHome() {
  sbmHideOptionalAdminSheets_();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SBM_SHEETS.HOME);
  if (!sh) {
    sbmInitializeSheets();
    sh = ss.getSheetByName(SBM_SHEETS.HOME);
  }
  try { sbmRefreshHome_(); } catch (e) { sbmLog_('sbmOpenHome', 'Warning', String(e)); }
  if (sh) { sh.showSheet(); ss.setActiveSheet(sh); sh.activate(); }
}

function sbmOpenToday() {
  return sbmOpenTodayImprovement();
}

function sbmShowBriefForRow_(row) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SBM_SHEETS.TODAY);
  if (!sh || row <= 1 || row > sh.getLastRow()) {
    return sbmAlert_('改善ナビ', '対象記事を確認できませんでした。');
  }
  ss.setActiveSheet(sh);
  sh.setActiveRange(sh.getRange(row, 1));
  return sbmOpenSelectedImprovementNavi();
}

function sbmCompleteImprovementRow_(row, fromEdit) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var today = ss.getSheetByName(SBM_SHEETS.TODAY);
  if (!today || row <= 1 || row > today.getLastRow()) {
    return sbmAlert_('改善完了', '対象記事を確認できませんでした。');
  }
  var rec = sbmRowRecord_(today, row);
  var url = String(rec['記事URL'] || '').trim();
  if (!url) return sbmAlert_('改善完了', '記事URLを取得できませんでした。');
  var db = ss.getSheetByName(SBM_SHEETS.ARTICLE_DB);
  if (!db || db.getLastRow() < 2) return sbmAlert_('改善完了', '記事DBがありません。');
  var headers = db.getRange(1,1,1,db.getLastColumn()).getValues()[0].map(function(v){return String(v||'').trim();});
  var urlCol = headers.indexOf('記事URL') + 1;
  var workCol = headers.indexOf('作業状態') + 1;
  if (!urlCol || !workCol) return sbmAlert_('改善完了', '記事DBの必要列がありません。');
  var urls = db.getRange(2,urlCol,db.getLastRow()-1,1).getValues();
  for (var i=0;i<urls.length;i++) {
    if (String(urls[i][0]||'').trim() === url) {
      db.getRange(i+2,workCol).setValue('👀 モニター中');
      try { sbmRefreshHome_(); } catch(e) {}
      if (!fromEdit) sbmAlert_('改善完了', '作業状態を「モニター中」に変更しました。');
      return;
    }
  }
  sbmAlert_('改善完了', '記事DBに対象記事が見つかりませんでした。');
}

/**
 * Product 5.0: 記事DB直結「今日の改善」Ver.1
 * 即効性3件＋CTR改善3件を準備し、初期2件・最大6件を段階表示します。
 */
function sbmBuildTodayImprovementSheet_() {
  var sh = sbmGetOrCreateSheet_(SBM_SHEETS.TODAY);
  sh.clear();
  sh.getRange(1,1,1,SBM_HEADERS.TODAY.length).setValues([SBM_HEADERS.TODAY]);
  sh.setFrozenRows(1);
  sh.getRange(1,1,1,SBM_HEADERS.TODAY.length)
    .setBackground('#0b8043').setFontColor('#ffffff').setFontWeight('bold')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  var widths = [48,110,360,520,95,105,190,80,90,70,75,220,95];
  widths.forEach(function(w,i){ sh.setColumnWidth(i+1,w); });
  sh.getRange(1,1,Math.max(2,sh.getMaxRows()),SBM_HEADERS.TODAY.length).setVerticalAlignment('middle');
  sh.getRange('C:C').setWrap(true);
  sh.getRange('D:D').setWrap(true);
  sh.getRange('G:G').setWrap(true);
  sh.hideColumns(12,2); // URL・候補IDは内部利用
}

function sbmOpenTodayImprovement() {
  sbmHideOptionalAdminSheets_();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SBM_SHEETS.TODAY);
  if (!sh) { sbmBuildTodayImprovementSheet_(); sh = ss.getSheetByName(SBM_SHEETS.TODAY); }
  // シート上の候補が0件なら、記事DBの保存済みデータから初期2件を補充します。
  if (sbmGetTodayDisplayedRowCount_() === 0) {
    try { sbmEnsureTodayRecommendations_('open'); } catch(e) { sbmLog_('TodayOpenAutoFill','Warning',String(e)); }
    sh = ss.getSheetByName(SBM_SHEETS.TODAY) || sh;
  }
  sh.showSheet(); ss.setActiveSheet(sh); sh.activate();
}

/**
 * 起動時用の軽量処理。記事DB内の保存済み数値だけを使い、
 * 「今日の改善」に初期2件を表示します。外部取得やダイアログ表示は行いません。
 */
function sbmEnsureTodayRecommendations_(source) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var db = ss.getSheetByName(SBM_SHEETS.ARTICLE_DB);
  if (!db || db.getLastRow() < 2) return false;

  // 起動時は保存済み候補があり、今日の改善シートも存在すれば再計算しません。
  if (String(source || '') === 'open') {
    var saved = String(sbmGetSetting_('TodayRecommendationJson', '') || '');
    var today = ss.getSheetByName(SBM_SHEETS.TODAY);
    if (saved && today && today.getLastRow() > 1) return true;
  }

  var candidates = sbmSelectTodayRecommendations_();
  if (!candidates.length) {
    sbmBuildTodayImprovementSheet_();
    return false;
  }

  var initial = Math.min(2, candidates.length);
  sbmSetSetting_('TodayRecommendationJson', JSON.stringify(candidates), '今日の改善候補6件（' + String(source || 'auto') + '）');
  sbmSetSetting_('DisplayedImprovementCount', String(initial), '今日の改善の初期表示件数');
  sbmWriteTodayRecommendations_(candidates, initial);
  sbmApplyTodayWorkState_(candidates, initial);
  try { sbmRefreshHome_(); } catch (e) { sbmLog_('TodayDefaultHome','Warning',String(e)); }
  return true;
}

// 旧呼び出し名との互換性を維持します。
function sbmRefreshTodayRecommendationsOnOpen_() {
  return sbmEnsureTodayRecommendations_('open');
}

function sbmBuildTodayRecommendationsManual() {
  try {
    var candidates = sbmSelectTodayRecommendations_();
    if (!candidates.length) return sbmAlert_('今日の改善を作成できません', '記事DBに改善候補として選べる記事がありません。日次更新と記事情報補完を確認してください。');
    var initial = Math.min(2, candidates.length);
    sbmSetSetting_('TodayRecommendationJson', JSON.stringify(candidates), '今日の改善候補6件');
    sbmSetSetting_('DisplayedImprovementCount', String(initial), '今日の改善に表示している件数');
    sbmWriteTodayRecommendations_(candidates, initial);
    sbmApplyTodayWorkState_(candidates, initial);
    sbmRefreshHome_();
    sbmOpenTodayImprovement();
    sbmAlert_('今日の改善を作成しました', '即効性とCTR改善の推移から、最初の' + initial + '記事を表示しました。\n「記事改善スタート」メニューから2件ずつ、最大6件まで追加できます。');
  } catch (e) {
    sbmAlert_('今日の改善作成エラー', String(e));
  }
}

function sbmSelectTodayRecommendations_() {
  var rows = sbmRowsAsObjects_(SBM_SHEETS.ARTICLE_DB) || [];
  var minImps = Math.max(20, sbmNumber_(sbmGetSetting_('MinImpressions', 50)) || 50);
  var pool = rows.map(function(r){
    var url = String(r['記事URL'] || '').trim();
    var title = String(r['記事タイトル'] || '').trim();
    var query = String(r['メインクエリ'] || '').trim();
    var clicks = sbmNumber_(r['クリック数']) || 0;
    var imps = sbmNumber_(r['表示回数']) || 0;
    var ctr = sbmNormalizeCtrNumber_(r['CTR']);
    var pos = sbmNumber_(r['掲載順位']) || 0;
    var rank = String(r['記事ランク'] || '').trim();
    var work = String(r['作業状態'] || '未着手').trim();
    var flag = String(r['管理フラグ'] || '').trim();
    if (!url || !title || imps < minImps || pos <= 0) return null;
    if (flag === 'データ未取得' || flag === '要確認' || flag === '管理対象外' || flag === '削除済み' || flag === 'URL変更') return null;
    if (work.indexOf('改善中') >= 0 || work.indexOf('モニター中') >= 0) return null;
    var target = sbmExpectedCtrTarget_(pos);
    var gap = Math.max(0, target - ctr);
    var expected = Math.max(0, Math.round(imps * gap));
    var posFit = (pos >= 4 && pos <= 15) ? (16 - pos) / 12 : (pos > 15 && pos <= 30 ? (31 - pos) / 32 : 0.05);
    var impPower = Math.log10(imps + 10);
    var instantScore = (posFit * 50) + (Math.min(3.5,impPower) * 12) + (Math.min(0.08,gap) * 420) + (rank.indexOf('成長')>=0 ? 8 : 0);
    var ctrScore = expected * 1.8 + impPower * 18 + (gap * 500);
    return {url:url,title:title,query:query,clicks:clicks,impressions:imps,ctr:ctr,position:pos,rank:rank,work:work,targetCtr:target,expectedClicks:expected,instantScore:instantScore,ctrScore:ctrScore};
  }).filter(Boolean);

  // 厳格条件で2件未満の場合も、記事DBに有効な記事があれば候補を補います。
  // モニター中・改善中は除外し、表示回数と順位を基準に軽量に並べます。
  if (pool.length < 2) {
    var existing = {};
    pool.forEach(function(c){ existing[c.url] = true; });
    rows.forEach(function(r){
      var url = String(r['記事URL'] || '').trim();
      var title = String(r['記事タイトル'] || '').trim();
      var work = String(r['作業状態'] || '未着手').trim();
      var flag = String(r['管理フラグ'] || '').trim();
      if (!url || !title || existing[url]) return;
      if (flag === 'データ未取得' || flag === '要確認' || flag === '管理対象外' || flag === '削除済み' || flag === 'URL変更') return;
      if (work.indexOf('改善中') >= 0 || work.indexOf('モニター中') >= 0) return;
      var clicks = sbmNumber_(r['クリック数']) || 0;
      var imps = sbmNumber_(r['表示回数']) || 0;
      var ctr = sbmNormalizeCtrNumber_(r['CTR']);
      var pos = sbmNumber_(r['掲載順位']) || 0;
      if (imps <= 0 || pos <= 0) return;
      var target = sbmExpectedCtrTarget_(pos);
      var gap = Math.max(0, target - ctr);
      var expected = Math.max(0, Math.round(imps * gap));
      var impPower = Math.log10(imps + 10);
      pool.push({
        url:url,title:title,query:String(r['メインクエリ'] || '').trim(),clicks:clicks,
        impressions:imps,ctr:ctr,position:pos,rank:String(r['記事ランク'] || '').trim(),work:work,
        targetCtr:target,expectedClicks:expected,
        instantScore:(Math.max(0,31-pos) * 1.2) + impPower * 10 + gap * 250,
        ctrScore:expected * 1.5 + impPower * 15 + gap * 350
      });
      existing[url] = true;
    });
  }
  var used = {};
  function take(sorted, kind, max) {
    var out=[];
    for (var i=0;i<sorted.length && out.length<max;i++) {
      var c=sorted[i];
      if (used[c.url]) continue;
      used[c.url]=true;
      c.kind=kind;
      c.candidateId=kind + '-' + (out.length+1);
      c.reason=sbmTodayReason_(c,kind);
      c.estimate=sbmTodayEstimate_(c,kind);
      out.push(c);
    }
    return out;
  }
  var instant = pool.slice().sort(function(a,b){ return b.instantScore-a.instantScore; });
  var ctr = pool.slice().sort(function(a,b){ return b.ctrScore-a.ctrScore; });
  var a = take(instant,'⚡ 即効性',3);
  var b = take(ctr,'📈 CTR改善',3);
  var merged=[];
  for (var i=0;i<3;i++){ if(a[i]) merged.push(a[i]); if(b[i]) merged.push(b[i]); }
  return merged.slice(0,6);
}

function sbmExpectedCtrTarget_(pos) {
  pos = Number(pos || 0);
  if (pos <= 3) return 0.10;
  if (pos <= 5) return 0.065;
  if (pos <= 10) return 0.04;
  if (pos <= 15) return 0.025;
  if (pos <= 20) return 0.018;
  return 0.012;
}

function sbmNormalizeCtrNumber_(v) {
  var n = sbmNumber_(v) || 0;
  if (n > 1) n = n / 100;
  return Math.max(0,n);
}

function sbmTodayReason_(c, kind) {
  var pct = (c.ctr*100).toFixed(1);
  if (kind.indexOf('即効性') >= 0) {
    return '順位' + c.position.toFixed(1) + '位・CTR' + pct + '%で、少ない修正でも伸びる余地があります。\n期待効果：タイトルや導入文の改善で約' + Math.max(1,c.expectedClicks) + 'クリック増が見込めます。';
  }
  return '表示回数' + Math.round(c.impressions).toLocaleString() + '回に対してCTR' + pct + '%です。\n期待効果：CTRが目安値まで改善すると約' + Math.max(1,c.expectedClicks) + 'クリック増が見込めます。';
}

function sbmTodayEstimate_(c, kind) {
  if (kind.indexOf('即効性') >= 0) return c.position <= 10 ? '約15分' : '約20分';
  return c.impressions >= 5000 ? '約20分' : '約15分';
}


function sbmGetTodayCandidates_() {
  try { return JSON.parse(String(sbmGetSetting_('TodayRecommendationJson','[]')) || '[]'); } catch(e) { return []; }
}

/** 今日の改善シートに実際に表示されている記事行数を返します。 */
function sbmGetTodayDisplayedRowCount_() {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SBM_SHEETS.TODAY);
  if (!sh || sh.getLastRow() < 2) return 0;
  var hm = sbmHeaderMap_(sh);
  var titleCol = hm['記事タイトル'];
  if (!titleCol) return 0;
  var values = sh.getRange(2, titleCol, sh.getLastRow() - 1, 1).getDisplayValues();
  var count = 0;
  for (var i = 0; i < values.length; i++) {
    if (String(values[i][0] || '').trim()) count++;
  }
  return count;
}

function sbmShowMoreTodayRecommendations() {
  var candidates = sbmGetTodayCandidates_();
  if (!candidates.length) return sbmBuildTodayRecommendationsManual();

  // 設定値ではなく、シート上の実表示件数を正本として扱います。
  var current = sbmGetTodayDisplayedRowCount_();
  if (current < 0) current = 0;
  sbmSetSetting_('DisplayedImprovementCount', String(current), '今日の改善の実表示件数と同期');

  var configuredMax = Math.min(6, sbmGetTodayMaxDisplayCount_());
  var max = Math.min(configuredMax, candidates.length);
  if (current >= max) {
    var limitMessage = candidates.length < configuredMax
      ? '現在利用できる改善候補は' + max + '件です。\nすべて表示しています。'
      : '今日の改善は最大' + configuredMax + '件まで表示できます。\n現在、最大' + configuredMax + '件を表示しています。';
    sbmAlert_('表示件数の上限です', limitMessage);
    return;
  }

  var next = Math.min(max, current + 2);
  try {
    sbmWriteTodayRecommendations_(candidates, next);
    sbmApplyTodayWorkState_(candidates, next);
    sbmRefreshHome_();
    sbmOpenTodayImprovement();
    var msg = next >= max
      ? (max >= configuredMax ? '最大' + configuredMax + '件を表示しています。' : '利用可能な' + max + '件をすべて表示しています。')
      : next + '件を表示しています。';
    sbmAlert_('表示を追加しました', msg);
  } catch (e) {
    throw e;
  }
}

function sbmResetTodayRecommendations() {
  var candidates = sbmGetTodayCandidates_();
  if (!candidates.length) return sbmBuildTodayRecommendationsManual();
  var initial = Math.max(1, Math.min(sbmGetTodayInitialDisplayCount_(), candidates.length));

  // 先に設定値を初期件数へ戻し、再描画後も実表示件数で同期します。
  sbmSetSetting_('DisplayedImprovementCount', String(initial), '今日の改善を初期表示件数へ戻す');
  sbmWriteTodayRecommendations_(candidates, initial);
  sbmApplyTodayWorkState_(candidates, initial);
  sbmRefreshHome_();
  sbmOpenTodayImprovement();
  sbmAlert_('初期表示に戻しました', '今日の改善を初期' + initial + '件表示に戻しました。');
}

function sbmApplyTodayWorkState_(candidates, count) {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SBM_SHEETS.ARTICLE_DB);
  if (!sh || sh.getLastRow()<2) return;
  var headers = sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0].map(function(v){return String(v||'').trim();});
  var urlCol=headers.indexOf('記事URL')+1, workCol=headers.indexOf('作業状態')+1;
  if (!urlCol || !workCol) return;
  var vals=sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).getValues();
  var shown={}; candidates.slice(0,count).forEach(function(c){shown[c.url]=true;});
  for(var i=0;i<vals.length;i++){
    var url=String(vals[i][urlCol-1]||'').trim();
    var work=String(vals[i][workCol-1]||'').trim();
    if(shown[url] && (!work || work==='未着手' || work.indexOf('今日の改善')>=0)) vals[i][workCol-1]='🔥 今日の改善';
    else if(!shown[url] && work.indexOf('今日の改善')>=0) vals[i][workCol-1]='未着手';
  }
  sh.getRange(2,1,vals.length,sh.getLastColumn()).setValues(vals);
}


function sbmRowRecord_(sh,row){
  var headers=sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0];
  var vals=sh.getRange(row,1,1,sh.getLastColumn()).getValues()[0];
  var o={}; headers.forEach(function(h,i){o[String(h||'').trim()]=vals[i];}); return o;
}

function sbmFindArticleDbByUrl_(url){
  var rows=sbmRowsAsObjects_(SBM_SHEETS.ARTICLE_DB)||[];
  for(var i=0;i<rows.length;i++) if(String(rows[i]['記事URL']||'').trim()===url) return rows[i];
  return null;
}

function sbmDecodeHtmlEntities_(s) {
  return String(s || '')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, function(_, n){ try { return String.fromCharCode(Number(n)); } catch(e) { return _; } })
    .replace(/&#x([0-9a-f]+);/gi, function(_, n){ try { return String.fromCharCode(parseInt(n,16)); } catch(e) { return _; } });
}

function sbmArticleTextFromHtml_(html) {
  html = String(html || '');
  if (!html) return '';
  html = html.replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<(script|style|noscript|svg|canvas|iframe|form)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<(nav|header|footer|aside)[^>]*>[\s\S]*?<\/\1>/gi, ' ');

  var candidates = [];
  var patterns = [
    /<article\b[^>]*>([\s\S]*?)<\/article>/gi,
    /<(?:div|main)\b[^>]*(?:class|id)=["'][^"']*(?:entry-content|post-content|article-body|article-content|post-body|main-content|hatena-body|hentry)[^"']*["'][^>]*>([\s\S]*?)<\/(?:div|main)>/gi,
    /<main\b[^>]*>([\s\S]*?)<\/main>/gi
  ];
  patterns.forEach(function(re){ var m; while ((m = re.exec(html)) !== null) candidates.push(m[1] || ''); });
  var source = candidates.length ? candidates.sort(function(a,b){return b.length-a.length;})[0] : html;
  source = source
    .replace(/<(div|section|aside)\b[^>]*(?:class|id)=["'][^"']*(?:share|social|related|recommend|ranking|profile|author|comment|breadcrumb|advert|adsense|widget|sidebar|toc)[^"']*["'][^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<br\s*\/?\s*>/gi, '\n')
    .replace(/<h1\b[^>]*>/gi, '\n# ').replace(/<h2\b[^>]*>/gi, '\n## ').replace(/<h3\b[^>]*>/gi, '\n### ')
    .replace(/<h4\b[^>]*>/gi, '\n#### ')
    .replace(/<li\b[^>]*>/gi, '\n- ')
    .replace(/<(p|blockquote|tr|table|ul|ol)\b[^>]*>/gi, '\n')
    .replace(/<\/(h1|h2|h3|h4|p|blockquote|li|tr|table|ul|ol|div|section)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ');
  source = sbmDecodeHtmlEntities_(source)
    .replace(/[ \t]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return source;
}

function sbmStructureArticleText_(text, sourceType) {
  text = String(text || '').replace(/\r\n?/g, '\n').trim();
  if (!text) return {ok:false, message:'本文を確認できませんでした。'};
  var maxChars = 50000;
  var truncated = text.length > maxChars;
  if (truncated) text = text.substring(0, maxChars);
  var lines = text.split('\n');
  var intro = [], sections = [], current = null;
  lines.forEach(function(line){
    line = String(line || '').trim();
    if (!line) return;
    var m = line.match(/^(#{1,4})\s+(.+)$/);
    if (m) {
      current = {level:m[1].length, heading:m[2].trim(), text:''};
      sections.push(current);
    } else if (current) {
      current.text += (current.text ? '\n' : '') + line;
    } else {
      intro.push(line);
    }
  });
  if (!sections.length) sections.push({level:2, heading:'本文', text:text});
  sections = sections.filter(function(x){ return x.heading || x.text; }).map(function(x){
    return {level:x.level, heading:x.heading, characters:String(x.text || '').length, text:String(x.text || '')};
  });
  return {
    ok:true,
    data:{
      format:'SIMS_ARTICLE_SOURCE_V1', version:'1.0', source_type:String(sourceType || 'unknown'),
      extracted_at:sbmDateText_(new Date()), truncated:truncated,
      character_count:text.length, introduction:intro.join('\n'), sections:sections
    }
  };
}

function sbmFetchArticleSource_(url) {
  url = sbmNormalizeUrl_(url || '');
  if (!/^https?:\/\//i.test(url)) return {ok:false, message:'記事URLが正しくありません。'};
  try {
    var res = UrlFetchApp.fetch(url, {
      muteHttpExceptions:true, followRedirects:true,
      headers:{'User-Agent':'Mozilla/5.0 (compatible; SIMS-Blog-Manager/5.2; +article-source)'}
    });
    var code = res.getResponseCode();
    if (code < 200 || code >= 400) return {ok:false, message:'URLから本文を取得できませんでした（HTTP '+code+'）。'};
    var headers = res.getAllHeaders ? res.getAllHeaders() : {};
    var contentType = String(headers['Content-Type'] || headers['content-type'] || '');
    if (contentType && contentType.toLowerCase().indexOf('text/html') < 0) return {ok:false, message:'HTML記事ではないため本文を取得できませんでした。'};
    var text = sbmArticleTextFromHtml_(res.getContentText() || '');
    if (text.length < 200) return {ok:false, message:'本文として十分な文章を抽出できませんでした。'};
    return sbmStructureArticleText_(text, 'url');
  } catch(e) {
    return {ok:false, message:'URLから本文を取得できませんでした。\n'+String(e && e.message || e)};
  }
}

function sbmAnalyzePastedArticleSource(text, meta) {
  text = String(text || '').trim();
  if (!text) return {ok:false, message:'切り抜いた記事本文を貼り付けてください。'};
  if (/<(?:article|main|h1|h2|p)\b/i.test(text)) text = sbmArticleTextFromHtml_(text);
  var result = sbmStructureArticleText_(text, 'manual_clip');
  if (!result.ok) return result;
  return {ok:true, prompt:sbmBuildImprovementPrompt_(meta || {}, result.data), characterCount:result.data.character_count, sectionCount:result.data.sections.length};
}

/** Product 5.2.1: SIMS-Core向け依頼文と内部リンク候補を生成します。 */
function sbmInternalLinkNormalizeText_(value) {
  return String(value || '').toLowerCase().replace(/https?:\/\/[^\s]+/g, ' ').replace(/[\u3000\s]+/g, ' ').replace(/[\-–—_|｜/\\:：,，.。!！?？()（）\[\]「」『』【】<>＜＞]+/g, ' ').trim();
}
function sbmInternalLinkTokens_(value) {
  var text=sbmInternalLinkNormalizeText_(value), out={}; if(!text)return [];
  var stop={'について':1,'とは':1,'方法':1,'やり方':1,'使い方':1,'原因':1,'対処法':1,'解決':1,'おすすめ':1,'まとめ':1,'最新版':1,'完全版':1,'記事':1,'ブログ':1,'できない':1,'する':1,'した':1,'して':1,'から':1,'まで':1,'ため':1,'場合':1,'how':1,'what':1,'the':1,'and':1,'for':1,'with':1};
  (text.match(/[a-z0-9][a-z0-9+._-]*|[ぁ-んァ-ヶー一-龠々]{2,}/g)||[]).forEach(function(word){
    word=word.replace(/^[-_.]+|[-_.]+$/g,''); if(!word||stop[word])return;
    if(/^[ぁ-んァ-ヶー一-龠々]+$/.test(word)&&word.length>=4){for(var n=2;n<=Math.min(4,word.length);n++){for(var i=0;i<=word.length-n;i++){var gram=word.substring(i,i+n);if(!stop[gram])out[gram]=true;}}}
    out[word]=true;
  }); return Object.keys(out);
}
function sbmInternalLinkTokenSet_(value){var set={};sbmInternalLinkTokens_(value).forEach(function(t){set[t]=true;});return set;}
function sbmInternalLinkOverlap_(left,right){var a=sbmInternalLinkTokenSet_(left),b=sbmInternalLinkTokenSet_(right),common=[];Object.keys(a).forEach(function(t){if(b[t])common.push(t);});common.sort(function(x,y){return y.length-x.length;});return common;}

/** URLごとのSearch Console上位クエリを、指標付きで最大20件返します。 */
function sbmTopQueriesByUrl_(){
  var rows=sbmRowsAsObjects_(SBM_SHEETS.RAW_DATA)||[],grouped={};
  rows.forEach(function(r){
    var url=sbmNormalizeUrl_(r.URL||r['記事URL']||''),q=String(r.Query||r['クエリ']||'').trim();
    if(!url||!q)return;
    (grouped[url]||(grouped[url]=[])).push({
      query:q,
      clicks:sbmNumber_(r.Clicks||r['クリック数'])||0,
      imps:sbmNumber_(r.Impressions||r['表示回数'])||0,
      ctr:sbmNormalizeCtrNumber_(r.CTR||r['CTR']),
      position:sbmNumber_(r.Position||r['掲載順位'])||0
    });
  });
  Object.keys(grouped).forEach(function(url){
    grouped[url].sort(function(a,b){return(b.clicks-a.clicks)||(b.imps-a.imps)||(a.position-b.position);});
    grouped[url]=grouped[url].slice(0,20);
  });
  return grouped;
}
function sbmInternalLinkQueriesByUrl_(){
  var detailed=sbmTopQueriesByUrl_(),simple={};
  Object.keys(detailed).forEach(function(url){simple[url]=detailed[url].map(function(x){return x.query;});});
  return simple;
}
function sbmInternalLinkCategory_(url){try{var path=String(url||'').replace(/^https?:\/\/[^/]+/i,'').split(/[?#]/)[0],parts=path.split('/').filter(Boolean);if(parts.length>=2&&!/^\d{4}$/.test(parts[0]))return parts[0];}catch(e){}return '';}
function sbmInternalLinkStars_(score){return score>=75?'★★★★★':score>=55?'★★★★☆':score>=38?'★★★☆☆':score>=25?'★★☆☆☆':'★☆☆☆☆';}
function sbmInternalLinkAnchor_(title,mainQuery){
  var anchor=String(mainQuery||'').trim()||String(title||'').trim();
  if(!anchor)return '';
  anchor=anchor.replace(/[【\[].*?[】\]]/g,' ').replace(/[｜|].*$/,' ').replace(/完全ガイド|徹底解説|保存版|最新版|まとめ|おすすめ\d*選|とは$/g,' ').replace(/\s+/g,' ').trim();
  if(anchor.length>32)anchor=anchor.substring(0,32).trim();
  return anchor||String(title||'').trim();
}
function sbmInternalLinkRelatedQuery_(targetMain,targetQueries,candidateMain,candidateQueries){
  var target=[targetMain].concat(targetQueries||[]).join(' '),candidate=[candidateMain].concat(candidateQueries||[]).join(' '),common=sbmInternalLinkOverlap_(target,candidate);
  if(common.length)return common.slice(0,3).join('・');
  return String(candidateMain||((candidateQueries||[])[0])||'').trim();
}
function sbmFindInternalLinkCandidates_(targetArticle,minCount,maxCount,freshTargetQueries){
  minCount=Math.max(0,Number(minCount||3));maxCount=Math.max(minCount,Math.min(8,Number(maxCount||8)));
  var articles=sbmRowsAsObjects_(SBM_SHEETS.ARTICLE_DB)||[],queryMap=sbmInternalLinkQueriesByUrl_();
  var targetUrl=sbmNormalizeUrl_(targetArticle['記事URL']||targetArticle.URL||''),targetTitle=String(targetArticle['記事タイトル']||''),targetMain=String(targetArticle['メインクエリ']||'');
  var targetQueries=(freshTargetQueries&&freshTargetQueries.length?freshTargetQueries:(queryMap[targetUrl]||[])).map(function(q){return typeof q==='string'?q:String(q&&q.query||'');}).filter(Boolean);
  var targetAll=[targetTitle,targetMain].concat(targetQueries).join(' '),targetCategory=sbmInternalLinkCategory_(targetUrl),ranked=[];
  articles.forEach(function(a){
    var url=sbmNormalizeUrl_(a['記事URL']||'');if(!url||url===targetUrl)return;
    var flags=String(a['管理フラグ']||'')+' '+String(a['記事ステータス']||'');if(/管理対象外|削除|要確認|データ未取得/.test(flags))return;
    var title=String(a['記事タイトル']||'').trim();if(!title)return;
    var main=String(a['メインクエリ']||'').trim(),queries=queryMap[url]||[],candidateAll=[title,main].concat(queries).join(' ');
    var mainCommon=sbmInternalLinkOverlap_(targetMain,main),titleCommon=sbmInternalLinkOverlap_(targetTitle,title),allCommon=sbmInternalLinkOverlap_(targetAll,candidateAll),score=0;
    if(targetMain&&main&&sbmInternalLinkNormalizeText_(targetMain)===sbmInternalLinkNormalizeText_(main))score+=40;
    score+=Math.min(30,mainCommon.reduce(function(n,t){return n+(t.length>=4?10:4);},0));
    score+=Math.min(30,allCommon.reduce(function(n,t){return n+(t.length>=4?5:2);},0));
    score+=Math.min(15,titleCommon.reduce(function(n,t){return n+(t.length>=4?6:2);},0));
    if(targetCategory&&targetCategory===sbmInternalLinkCategory_(url))score+=10;
    var rank=String(a['記事ランク']||'');if(/エース|安定/.test(rank))score+=5;else if(/成長/.test(rank))score+=3;
    if(score<20)return;
    ranked.push({
      title:title,url:url,mainQuery:main,rank:rank,score:score,
      anchor:sbmInternalLinkAnchor_(title,main),
      relatedQuery:sbmInternalLinkRelatedQuery_(targetMain,targetQueries,main,queries),
      stars:sbmInternalLinkStars_(score)
    });
  });
  ranked.sort(function(a,b){return(b.score-a.score)||a.title.localeCompare(b.title,'ja');});
  var strong=ranked.filter(function(x){return x.score>=30;}).slice(0,maxCount);
  if(strong.length>=minCount||ranked.length<=strong.length)return strong;
  return ranked.slice(0,Math.min(maxCount,Math.max(strong.length,minCount)));
}
function sbmTopQueriesPromptText_(queries,status){
  queries=queries||[];var text='\n【Search Console 上位クエリ】\n';
  if(!queries.length){
    if(status&&status.ok===false)return text+'取得状態：取得失敗\n'+String(status.message||'Search Consoleからクエリを取得できませんでした。')+'\n';
    return text+'取得件数：0件\n※対象期間にSearch Consoleのクエリデータがありませんでした。\n';
  }
  text+='取得件数：'+queries.length+'件\n';
  queries.slice(0,20).forEach(function(q,i){
    text+=(i+1)+'. '+q.query+'\n   クリック：'+q.clicks+'\n   表示回数：'+q.imps+'\n   CTR：'+(q.ctr*100).toFixed(2)+'%\n   平均順位：'+q.position.toFixed(1)+'\n\n';
  });
  return text;
}
function sbmCoreRankText_(rank){
  rank=String(rank||'');
  if(/エース|^S/.test(rank))return 'S（エース）';
  if(/安定|^A/.test(rank))return 'A（安定）';
  if(/成長|^B/.test(rank))return 'B（成長）';
  if(/育成|^C/.test(rank))return 'C（育成）';
  if(/迷走|低迷|^D/.test(rank))return 'D（迷走）';
  return '未判定';
}
function sbmImprovementPriorityText_(){
  return '\n【改善優先順位】\n1. SEOタイトル\n2. 導入文\n3. H2見出し\n4. FAQ\n5. 本文\n6. 画像\n';
}
function sbmChangePolicyText_(){
  return '\n【変更方針】\n・既存本文は可能な限り維持してください。\n・SEOタイトル・導入文・H2見出し・FAQを優先して改善してください。\n・広告コードは変更しないでください。\n・商品リンク、アフィリエイトリンクは変更しないでください。\n・既存の良い説明や独自情報は削除しないでください。\n';
}
function sbmInternalLinkPromptText_(candidates){
  candidates=candidates||[];var text='\n【内部リンク候補】\n';
  if(!candidates.length)return text+'十分な関連性を持つ候補記事は見つかりませんでした。無理に内部リンクを追加しないでください。\n';
  candidates.forEach(function(c,i){
    text+=(i+1)+'. '+c.title+'\nURL：'+c.url+'\n推奨アンカーテキスト：'+c.anchor+'\n関連クエリ：'+(c.relatedQuery||'－')+'\n関連度：'+c.stars+'\n\n';
  });
  return text;
}
function sbmInternalLinkRulesText_(){
  return '\n【内部リンク利用ルール】\n・内部リンク候補は参考情報です。\n・本文の流れに自然に組み込める場合のみ採用してください。\n・無理に全件使用する必要はありません。\n・検索意図に合わない候補は採用しないでください。\n・アンカーテキストは本文に合わせて自然に変更して構いません。\n・テキストリンクを採用する場合、アフター本文にはHTMLリンクを埋め込んだコピペ可能な完成形を出力してください。\n・ブログカードが適切な場合は、挿入位置・URL・記事タイトル・採用理由を示してください。\n・候補を採用・保留・不採用に分類し、内部リンク評価レポートを付けてください。\n';
}
function sbmInternalLinkCandidatesHtml_(candidates){
  candidates=candidates||[];if(!candidates.length)return '<div class="source-ng">十分な関連性を持つ内部リンク候補は見つかりませんでした。無理に追加する必要はありません。</div>';
  return candidates.map(function(c,i){return '<div class="link-candidate"><b>'+(i+1)+'. '+sbmEscapeHtml_(c.title)+'</b><br><a href="'+sbmEscapeHtml_(c.url)+'" target="_blank">'+sbmEscapeHtml_(c.url)+'</a><br><span>推奨アンカー：'+sbmEscapeHtml_(c.anchor)+'</span><br><span>関連クエリ：'+sbmEscapeHtml_(c.relatedQuery||'－')+'</span><br><span>関連度：'+sbmEscapeHtml_(c.stars)+'</span></div>';}).join('');
}

function sbmBuildImprovementPrompt_(meta, articleData) {
  var articleId=String(meta.articleId||''), url=String(meta.url||''), title=String(meta.title||''), seoTitle=String(meta.seoTitle||''), description=String(meta.description||''), query=String(meta.query||'');
  var site = sbmEnsureSiteIdentity_(), siteId=String(site.siteId||''), siteName=String(site.siteName||''), siteUrl=String(site.siteUrl||site.blogUrl||'');
  var internalLinkCandidates=Array.isArray(meta.internalLinkCandidates)?meta.internalLinkCandidates:[],topQueries=Array.isArray(meta.topQueries)?meta.topQueries:[];
  var prompt='【サイト情報】\nSiteID：'+siteId+'\nSiteName：'+siteName+'\nSiteURL：'+siteUrl+'\n' +
    '\n【記事基本情報】\nArticleID：'+articleId+'\nURL：'+url+'\n記事タイトル：'+title+'\nSEOタイトル：'+seoTitle+'\nメタディスクリプション：'+description+'\nメインクエリ：'+query+'\n' +
    '\n【Search Console 概要】\nクリック：'+meta.clicks+'\n表示回数：'+meta.imps+'\nCTR：'+meta.ctrText+'\n平均順位：'+meta.posText+'\n' +
    sbmTopQueriesPromptText_(topQueries,meta.topQueryStatus) +
    '\n【改善目的】\n'+meta.kind+'。検索意図を優先し、既存記事の良い部分を残したまま改善してください。\n' +
    sbmImprovementPriorityText_() +
    '\n【記事ランク】\n'+sbmCoreRankText_(meta.rank)+'\n' +
    sbmChangePolicyText_();
  if(articleData)prompt+='\n【現在の記事本文データ（JSON）】\n```json\n'+JSON.stringify(articleData,null,2)+'\n```\n本文データを根拠に、修正箇所が明確なビフォー・アフター形式と簡潔な修正理由を示してください。アフターはそのままコピーして記事へ貼り付けられる完成形にしてください。\n';
  else prompt+='\n【現在の記事本文】\n本文を取得できていません。改善ナビで本文を貼り付けてから依頼文をコピーしてください。\n';
  prompt+=sbmInternalLinkPromptText_(internalLinkCandidates)+sbmInternalLinkRulesText_();
  return prompt+'\n【SIMSへのフィードバック出力ルール】\n回答の最後に、下記仕様のJSONをコードブロックで必ず1つ出力してください。内部リンク候補を評価しただけの場合はchanges.internal_linksをfalseとし、実際に追加・置換・削除した場合のみtrueにしてください。\n'+
    '{\n  "format": "SIMS_FEEDBACK_V2",\n  "version": "1.1",\n  "site_id": "'+siteId+'",\n  "site_name": "'+siteName+'",\n  "site_url": "'+siteUrl+'",\n  "article_id": "'+articleId+'",\n  "article_url": "'+url+'",\n  "completed_at": "YYYY-MM-DD",\n  "changes": {\n    "article_title": false, "seo_title": false, "description": false,\n    "introduction": false, "headings": false, "faq": false,\n    "internal_links": false, "body": false, "images": false\n  },\n  "new_values": {\n    "article_title": "", "seo_title": "", "description": "", "main_query": "'+query+'"\n  },\n  "improvement_type": "normal",\n  "confidence": "high",\n  "expected_effect": {"ctr": "", "clicks": ""},\n  "next_action": "monitor",\n  "summary": "実施した改善の要約",\n  "warnings": [],\n  "estimated_minutes": 20,\n  "recommended_review_days": 14\n}\n'+
    '変更していない項目はfalse、変更後の値がない項目は空文字にしてください。recommended_review_daysは7・14・30のいずれか、improvement_typeはminor・normal・major、confidenceはhigh・medium・low、next_actionはmonitor・remeasure・rewrite・noneのいずれかにしてください。';
}

function sbmSaveMainQueryForArticle_(url, mainQuery) {
  url = sbmNormalizeUrl_(url || '');
  mainQuery = String(mainQuery || '').trim();
  if (!url || !mainQuery) return false;
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SBM_SHEETS.ARTICLE_DB);
  if (!sh || sh.getLastRow() < 2) return false;
  var hm = sbmHeaderMap_(sh);
  if (!hm['記事URL'] || !hm['メインクエリ']) return false;
  var urls = sh.getRange(2, hm['記事URL'], sh.getLastRow()-1, 1).getValues();
  for (var i=0;i<urls.length;i++) {
    if (sbmNormalizeUrl_(urls[i][0]) === url) {
      sh.getRange(i+2, hm['メインクエリ']).setValue(mainQuery);
      return true;
    }
  }
  return false;
}

function sbmShowImprovementNaviDialog_(a, kind, reason) {
  var ss=SpreadsheetApp.getActiveSpreadsheet();
  var originalSheet=ss.getActiveSheet();
  var title=String(a['記事タイトル']||'（タイトル未取得）');
  var url=String(a['記事URL']||'');
  var query=String(a['メインクエリ']||'');
  var rank=String(a['記事ランク']||'');
  var work=String(a['作業状態']||'未着手');
  var clicks=sbmNumber_(a['クリック数'])||0, imps=sbmNumber_(a['表示回数'])||0, ctr=sbmNormalizeCtrNumber_(a['CTR']), pos=sbmNumber_(a['掲載順位'])||0;
  var target=sbmExpectedCtrTarget_(pos), expected=Math.max(0,Math.round(imps*Math.max(0,target-ctr)));
  var advice= kind.indexOf('CTR')>=0 ? ['P0：SEOタイトルを検索意図に合わせる','P1：導入文で結論と対象読者を明確にする','P2：検索クエリに対応するFAQを追加する'] : ['P0：タイトル・見出しを主検索意図に合わせる','P1：導入文を短くし、結論を先に提示する','P2：不足する説明を1～2項目追加する'];
  try { SpreadsheetApp.getActiveSpreadsheet().toast('対象記事の最新クエリをSearch Consoleから取得しています。通常は数秒で完了します。','改善ナビ',10); } catch(e) {}
  var freshQueryResult=sbmFetchTopQueriesForUrlNow_(url,20);
  if (!query && freshQueryResult && freshQueryResult.queries && freshQueryResult.queries.length) {
    query = String(freshQueryResult.queries[0].query || '').trim();
    if (query) { a['メインクエリ'] = query; try { sbmSaveMainQueryForArticle_(url, query); } catch(e) {} }
  }
  var topQueryMap=sbmTopQueriesByUrl_();
  var normalizedUrl=sbmNormalizeUrl_(url);
  var topQueries=freshQueryResult.ok ? freshQueryResult.queries : (topQueryMap[normalizedUrl]||[]);
  var internalLinkCandidates=sbmFindInternalLinkCandidates_(a,3,8,topQueries);
  var meta={articleId:String(a['ArticleID']||'').trim(),url:url,title:title,seoTitle:String(a['SEOタイトル']||'').trim(),description:String(a['メタディスクリプション']||'').trim(),query:query,rank:rank,clicks:clicks,imps:imps,ctrText:(ctr*100).toFixed(1)+'%',posText:pos.toFixed(1),kind:kind,topQueries:topQueries,topQueryStatus:freshQueryResult,internalLinkCandidates:internalLinkCandidates};
  var fetched=sbmFetchArticleSource_(url);
  var prompt=sbmBuildImprovementPrompt_(meta, fetched.ok ? fetched.data : null);
  function esc(x){return String(x||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  var statusHtml=fetched.ok ? '<div class="source-ok">✅ URLから記事本文を取得しました（'+fetched.data.character_count.toLocaleString()+'文字・'+fetched.data.sections.length+'セクション）</div>' : '<div class="source-ng">⚠️ '+esc(fetched.message)+'<br>下欄へWebクリッパー等で切り抜いた本文を貼り付けてください。</div>';
  var normalizedMainQuery=sbmNormalizeQueryText_(query);
  var mainQueryFound=topQueries.some(function(q){return sbmNormalizeQueryText_(q.query)===normalizedMainQuery;});
  var mainQueryNote=query
    ? '<br>メインクエリ：<b>'+esc(query)+'</b>'+(mainQueryFound?'（取得クエリ内に一致あり）':'<br><span style="color:#5f6368">※今回取得した上位クエリには完全一致で含まれていません。</span>')
    : '<br>メインクエリ：<b>未設定</b>';
  var queryStatusHtml=(freshQueryResult.ok && Number(freshQueryResult.total||0)>0)
    ? '<div class="source-ok">✅ 最新クエリを取得しました。'+mainQueryNote+'<br>取得件数：<b>'+Number(freshQueryResult.total||0).toLocaleString()+'件</b> ／ 依頼文へ使用：<b>'+topQueries.length+'件</b><br>取得日時：'+esc(freshQueryResult.fetchedAt||'－')+'<br>対象期間：'+esc(freshQueryResult.startDate||'－')+' ～ '+esc(freshQueryResult.endDate||'－')+'</div>'
    : (freshQueryResult.ok
      ? '<div class="source-ng">⚠️ '+esc(freshQueryResult.message)+mainQueryNote+'<br>取得件数：<b>0件</b><br>取得日時：'+esc(freshQueryResult.fetchedAt||'－')+'<br>対象期間：'+esc(freshQueryResult.startDate||'－')+' ～ '+esc(freshQueryResult.endDate||'－')+'</div>'
      : '<div class="source-ng">⚠️ '+esc(freshQueryResult.message)+mainQueryNote+'<br>保存済みクエリがある場合は代替利用します。<br>依頼文へ使用：<b>'+topQueries.length+'件</b></div>');
  var queryListHtml=topQueries.length
    ? '<details class="query-details"><summary>取得したクエリを見る（依頼文使用 '+topQueries.length+'件）</summary><div class="query-table-wrap"><table class="query-table"><thead><tr><th>クエリ</th><th>クリック</th><th>表示回数</th><th>CTR</th><th>順位</th></tr></thead><tbody>'+topQueries.map(function(q){return '<tr><td>'+((query&&sbmNormalizeQueryText_(q.query)===normalizedMainQuery)?'★ ':'')+esc(q.query)+'</td><td>'+Number(q.clicks||0).toLocaleString()+'</td><td>'+Number(q.imps||0).toLocaleString()+'</td><td>'+((Number(q.ctr||0))*100).toFixed(2)+'%</td><td>'+Number(q.position||0).toFixed(1)+'</td></tr>';}).join('')+'</tbody></table></div></details>'
    : '<div style="margin-top:8px;color:#5f6368">表示できるクエリはありません。</div>';
  var html='<!doctype html><html><head><base target="_top"><style>body{font-family:Arial,"Noto Sans JP",sans-serif;padding:22px;color:#202124;line-height:1.65}h2{margin:0 0 8px;color:#0b8043}.tag{display:inline-block;padding:4px 10px;border-radius:14px;background:#e6f4ea;color:#137333;font-weight:700}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:14px 0}.card{background:#f8f9fa;border:1px solid #dadce0;border-radius:8px;padding:10px;text-align:center}.sec{margin-top:16px;border-top:1px solid #dadce0;padding-top:12px}.p{background:#fff8e1;border-left:4px solid #fbbc04;padding:10px;margin:7px 0}.reason{white-space:pre-wrap;background:#eef5ff;padding:12px;border-radius:8px}.prompt{white-space:pre-wrap;background:#f1f3f4;padding:12px;border-radius:8px;font-size:12px;max-height:300px;overflow:auto}.btn{display:inline-block;background:#1a73e8;color:#fff;text-decoration:none;padding:9px 14px;border-radius:6px;font-weight:700;margin-right:8px;border:0;cursor:pointer}.source-ok{background:#e6f4ea;color:#137333;padding:10px;border-radius:8px}.source-ng{background:#fef7e0;color:#7a4d00;padding:10px;border-radius:8px}.link-candidate{background:#f8f9fa;border:1px solid #dadce0;border-radius:8px;padding:10px;margin:8px 0;font-size:13px}.link-candidate a{color:#1a73e8;word-break:break-all}.query-details{margin-top:10px;border:1px solid #dadce0;border-radius:8px;background:#fff}.query-details summary{cursor:pointer;padding:10px 12px;font-weight:700;color:#1a73e8}.query-table-wrap{max-height:260px;overflow:auto;border-top:1px solid #dadce0}.query-table{width:100%;border-collapse:collapse;font-size:12px}.query-table th,.query-table td{padding:7px 8px;border-bottom:1px solid #eee;text-align:right;white-space:nowrap}.query-table th:first-child,.query-table td:first-child{text-align:left;white-space:normal;min-width:220px}.query-table thead th{position:sticky;top:0;background:#f8f9fa}textarea{width:100%;height:150px;box-sizing:border-box;padding:10px;margin-top:8px;font-family:monospace}</style></head><body>'+ 
    '<h2>改善ナビ</h2><span class="tag">'+esc(kind)+'</span><h3>'+esc(title)+'</h3><div>'+esc(rank)+' ／ '+esc(work)+'</div>'+ 
    '<div class="grid"><div class="card"><b>クリック</b><br>'+clicks.toLocaleString()+'</div><div class="card"><b>表示回数</b><br>'+imps.toLocaleString()+'</div><div class="card"><b>CTR</b><br>'+(ctr*100).toFixed(1)+'%</div><div class="card"><b>順位</b><br>'+pos.toFixed(1)+'</div></div>'+ 
    '<div class="sec"><b>Search Console最新クエリ</b>'+queryStatusHtml+queryListHtml+'</div>'+ 
    '<div class="sec"><b>記事本文データ</b>'+statusHtml+(fetched.ok?'':'<textarea id="pasted" placeholder="記事タイトル、見出し、本文を貼り付けてください。広告や関連記事が混ざっていても解析時に可能な範囲で除外します。"></textarea><br><button class="btn" onclick="analyzePasted()">貼り付け本文を解析</button><span id="analyzeMsg"></span>')+'</div>'+ 
    '<div class="sec"><b>なぜ今改善するのか</b><div class="reason">'+esc(reason||('表示回数とCTR・順位から改善余地がある記事です。期待効果：約'+expected+'クリック増。'))+'</div></div>'+ 
    '<div class="sec"><b>今やる価値</b><p>'+(expected>=30?'★★★★★ 非常に高い':expected>=10?'★★★★☆ 高い':'★★★☆☆ 検討価値あり')+'</p></div>'+ 
    '<div class="sec"><b>改善ポイント</b>'+advice.map(function(x){return '<div class="p">'+esc(x)+'</div>';}).join('')+'</div>'+ 
    '<div class="sec"><b>内部リンク候補（'+internalLinkCandidates.length+'件）</b><p style="color:#5f6368;font-size:13px">記事DBとSearch Console上位クエリから抽出しています。推奨アンカー・関連クエリ・関連度を確認してからAIへ送信します。</p>'+sbmInternalLinkCandidatesHtml_(internalLinkCandidates)+'</div>'+ 
    '<div class="sec"><b>作業時間の目安</b><p>'+(kind.indexOf('即効性')>=0?'約15～20分':'約20分')+'</p></div>'+ 
    '<div class="sec"><b>AIでリライトするための依頼文</b><div class="prompt" id="prompt">'+esc(prompt)+'</div><button class="btn" onclick="copyPrompt()">依頼文をコピー</button></div>'+ 
    '<div class="sec"><a class="btn" href="'+esc(url)+'" target="_blank">記事を開く</a></div>'+ 
    '<div class="sec" style="background:#e6f4ea;border:1px solid #b7dfc2;border-radius:8px;padding:14px"><b>記事の修正が完了したら、改善結果を登録してください。</b><p style="margin:6px 0 10px;color:#5f6368">Claudeの回答末尾にあるSIMS向けJSONを貼り付けて登録します。</p><button class="btn" style="background:#0b8043" onclick="registerFeedback()">✅ 改善完了を登録</button></div>'+ 
    '<script>var meta='+JSON.stringify(meta).replace(/</g,'\\u003c')+';function copyPrompt(){var t=document.getElementById("prompt").innerText;navigator.clipboard.writeText(t).then(function(){alert("コピーしました")})}function analyzePasted(){var el=document.getElementById("pasted"),msg=document.getElementById("analyzeMsg");msg.textContent="解析中…";google.script.run.withFailureHandler(function(e){msg.textContent=(e&&e.message)||String(e)}).withSuccessHandler(function(r){if(!r.ok){msg.textContent=r.message;return;}document.getElementById("prompt").innerText=r.prompt;msg.textContent="解析完了（"+r.characterCount+"文字・"+r.sectionCount+"セクション）";}).sbmAnalyzePastedArticleSource(el.value,meta)}function registerFeedback(){google.script.run.withFailureHandler(function(e){alert((e&&e.message)||String(e));}).withSuccessHandler(function(){google.script.host.close();}).sbmOpenImprovementFeedbackDialog();}</script></body></html>';
  try {
    var rawSheet = ss.getSheetByName(SBM_SHEETS.RAW_DATA);
    if (originalSheet) {
      ss.setActiveSheet(originalSheet);
      originalSheet.activate();
    }
    if (rawSheet && (!originalSheet || rawSheet.getSheetId() !== originalSheet.getSheetId())) {
      rawSheet.hideSheet();
    }
    SpreadsheetApp.flush();
  } catch (restoreError) {
    sbmLog_('ImprovementNaviSheetRestore', 'Warning', String(restoreError));
  }
  SpreadsheetApp.getUi().showModalDialog(sbmEnsureCloseButton_(HtmlService.createHtmlOutput(html).setWidth(820).setHeight(760)),'改善ナビ');
}

/** Homeを記事DBと設定だけから更新する現行版。 */


/**
 * SIMS Feedback Protocol (Forward Compatible)
 * Claude等が返したJSONを貼り付け、記事DB・改善履歴・モニター状態へ反映します。
 */
function sbmOpenImprovementFeedbackDialog() {
  var context = sbmSelectedArticleContext_();
  var selected = context ? ('選択中：' + (context.articleTitle || context.articleUrl || '記事')) : '記事を選択していない場合も、JSON内のArticleIDまたはURLから照合します。';
  var html = '<!doctype html><html><head><base target="_top"><style>'+
    'body{font-family:Arial,"Noto Sans JP",sans-serif;padding:20px;color:#202124;line-height:1.55}h2{color:#0b8043;margin:0 0 8px}'+
    'textarea{width:100%;height:260px;box-sizing:border-box;font-family:monospace;font-size:12px;padding:10px;border:1px solid #dadce0;border-radius:6px}'+
    '.note{background:#eef5ff;border-radius:8px;padding:10px;margin:10px 0}.error{color:#b3261e;white-space:pre-wrap}.preview{display:none;background:#f8f9fa;border:1px solid #dadce0;border-radius:8px;padding:12px;margin-top:12px;white-space:pre-wrap}'+
    'button{border:0;border-radius:6px;padding:9px 14px;margin:10px 6px 0 0;font-weight:700;cursor:pointer}.primary{background:#1a73e8;color:white}.success{background:#0b8043;color:white}.secondary{background:#f1f3f4;color:#202124}</style></head><body>'+
    '<h2>改善結果を登録</h2><div class="note">'+sbmEscapeHtml_(selected)+'<br>AIの回答末尾にある <b>SIMS_FEEDBACK_V1以降のJSON</b>を、そのまま貼り付けてください。未知の追加項目が含まれていても登録できます。</div>'+
    '<textarea id="json" placeholder="ここへSIMS改善結果のJSONを貼り付けます"></textarea><br>'+
    '<button class="primary" onclick="analyze()">内容を解析</button><button class="secondary" onclick="google.script.host.close()">キャンセル</button>'+
    '<div id="error" class="error"></div><div id="preview" class="preview"></div><button id="register" class="success" style="display:none" onclick="registerData()">この内容で登録</button>'+
    '<script>var normalized=null;function analyze(){document.getElementById("error").textContent="";document.getElementById("preview").style.display="none";document.getElementById("register").style.display="none";google.script.run.withSuccessHandler(function(r){if(!r.ok){document.getElementById("error").textContent=r.message;return;}normalized=r.data;document.getElementById("preview").textContent=r.preview;document.getElementById("preview").style.display="block";document.getElementById("register").style.display="inline-block";}).withFailureHandler(function(e){document.getElementById("error").textContent=e.message||String(e);}).sbmAnalyzeImprovementFeedback(document.getElementById("json").value);}function registerData(){if(!normalized)return;document.getElementById("register").disabled=true;google.script.run.withSuccessHandler(function(r){if(!r.ok){document.getElementById("error").textContent=r.message;document.getElementById("register").disabled=false;return;}alert(r.message);google.script.host.close();}).withFailureHandler(function(e){document.getElementById("error").textContent=e.message||String(e);document.getElementById("register").disabled=false;}).sbmRegisterImprovementFeedback(normalized);}</script></body></html>';
  SpreadsheetApp.getUi().showModalDialog(sbmEnsureCloseButton_(HtmlService.createHtmlOutput(html).setWidth(760).setHeight(650)), '改善結果を登録');
}

function sbmAnalyzeImprovementFeedback(raw) {
  try {
    var data = sbmNormalizeImprovementFeedback_(raw);
    var article = sbmFindArticleDbByIdentity_(data.article_id, data.article_url);
    if (!article) return {ok:false,message:'記事DBに対象記事が見つかりません。ArticleIDまたはURLを確認してください。'};
    var selected = sbmSelectedArticleContext_();
    if (selected && selected.articleId && data.article_id && selected.articleId !== data.article_id) {
      return {ok:false,message:'選択中の記事とJSONのArticleIDが一致しません。誤登録防止のため処理を中止しました。'};
    }
    data.article_id = String(article['ArticleID'] || data.article_id || '');
    data.article_url = String(article['記事URL'] || data.article_url || '');
    data.article_title_before = String(article['記事タイトル'] || '');
    var changed = sbmFeedbackChangedLabels_(data.changes);
    var reviewDate = sbmDateAfterDaysText_(data.recommended_review_days);
    var preview = '対象記事：' + (article['記事タイトル'] || data.article_url) + '\n' +
      'ArticleID：' + (data.article_id || 'なし') + '\n' +
      '変更箇所：' + (changed.length ? changed.join('、') : '変更なし') + '\n' +
      '改善概要：' + data.summary + '\n' +
      '作業時間：' + data.estimated_minutes + '分\n' +
      '作業状態：👀 モニター中へ変更\n' +
      '効果確認予定：' + data.recommended_review_days + '日後（' + reviewDate + '）';
    if (data.warnings.length) preview += '\n注意事項：' + data.warnings.join(' / ');
    return {ok:true,data:data,preview:preview};
  } catch (e) {
    return {ok:false,message:String(e.message || e)};
  }
}

function sbmRegisterImprovementFeedback(data) {
  try {
    data = sbmNormalizeImprovementFeedback_(JSON.stringify(data));
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName(SBM_SHEETS.ARTICLE_DB);
    if (!sh || sh.getLastRow() < 2) throw new Error('記事DBがありません。');
    var headers = sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0].map(function(v){return String(v||'').trim();});
    var values = sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).getValues();
    var idCol = headers.indexOf('ArticleID');
    var urlCol = headers.indexOf('記事URL');
    var rowIndex = -1;
    for (var i=0;i<values.length;i++) {
      if ((data.article_id && idCol>=0 && String(values[i][idCol]||'')===data.article_id) ||
          (data.article_url && urlCol>=0 && sbmNormalizeUrl_(values[i][urlCol])===sbmNormalizeUrl_(data.article_url))) { rowIndex=i; break; }
    }
    if (rowIndex<0) throw new Error('対象記事が記事DBに見つかりません。');
    var row = values[rowIndex];
    function get(name){var c=headers.indexOf(name);return c>=0?row[c]:'';}
    function set(name,val){var c=headers.indexOf(name);if(c>=0 && val!==undefined && val!==null && val!=='') row[c]=val;}
    var before = {clicks:sbmNumber_(get('クリック数'))||0,impressions:sbmNumber_(get('表示回数'))||0,ctr:sbmNormalizeCtrNumber_(get('CTR')),position:sbmNumber_(get('掲載順位'))||0,title:String(get('記事タイトル')||'')};
    var nv=data.new_values||{};
    if(data.changes.article_title) set('記事タイトル',nv.article_title);
    if(data.changes.seo_title) set('SEOタイトル',nv.seo_title);
    if(data.changes.description) set('メタディスクリプション',nv.description);
    if(nv.main_query) set('メインクエリ',nv.main_query);
    set('作業状態','👀 モニター中');
    var oldNote=String(get('備考')||'').trim();
    var note='改善結果登録 '+sbmNowText_()+'：'+data.summary;
    set('備考',oldNote?oldNote+'\n'+note:note);
    sh.getRange(rowIndex+2,1,1,headers.length).setValues([row]);
    sbmAppendImprovementHistory_(data,row,before);
    sbmAppendLegacyImprovementLog_(data,row,before);
    sbmSetSetting_('LastImprovementRegisteredAt',sbmNowText_(),'最後に改善結果を登録した日時');
    try { sbmMarkTodayImprovementCompleted_(data.article_id, data.article_url); } catch (e) {}
    try{sbmRefreshHome_();}catch(e){}
    return {ok:true,message:'改善結果を登録しました。\n・記事管理を更新しました\n・改善履歴を作成しました\n・今日の改善を完了表示にしました\n・作業状態を「モニター中」に変更しました\n・'+data.recommended_review_days+'日後を効果確認予定に設定しました'};
  } catch(e) { return {ok:false,message:String(e.message||e)}; }
}


function sbmFindArticleDbByIdentity_(articleId,url) {
  var rows=sbmRowsAsObjects_(SBM_SHEETS.ARTICLE_DB)||[];
  var normalizedUrl=sbmNormalizeUrl_(url||'');
  for(var i=0;i<rows.length;i++){
    if(articleId && String(rows[i]['ArticleID']||'')===String(articleId))return rows[i];
    if(normalizedUrl && sbmNormalizeUrl_(rows[i]['記事URL']||'')===normalizedUrl)return rows[i];
  }
  return null;
}


function sbmFeedbackChangedLabels_(changes) {
  var labels={article_title:'記事タイトル',seo_title:'SEOタイトル',description:'メタディスクリプション',introduction:'導入文',headings:'見出し',faq:'FAQ',internal_links:'内部リンク',body:'本文',images:'画像'};
  return Object.keys(labels).filter(function(k){return changes&&changes[k];}).map(function(k){return labels[k];});
}

function sbmEscapeHtml_(x){return String(x||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}

function sbmNextImprovementHistoryId_() {
  var props = PropertiesService.getDocumentProperties();
  var current = parseInt(props.getProperty('SBM_HISTORY_ID_SEQ') || '0', 10);
  if (!isFinite(current) || current < 0) current = 0;
  if (current === 0) {
    try {
      var rows = sbmRowsAsObjects_(SBM_SHEETS.FEEDBACK_HISTORY) || [];
      rows.forEach(function(r){
        var m = String(r['改善履歴ID'] || '').match(/^H(\d+)$/);
        if (m) current = Math.max(current, parseInt(m[1],10) || 0);
      });
    } catch(e) {}
  }
  current += 1;
  props.setProperty('SBM_HISTORY_ID_SEQ', String(current));
  return 'H' + ('000000' + current).slice(-6);
}


function sbmAppendLegacyImprovementLog_(data,row,before) {
  var sh=sbmGetOrCreateSheet_(SBM_SHEETS.LOG);
  if(sh.getLastRow()===0 || String(sh.getRange(1,1).getValue())!=='改善日'){
    sh.clear();sh.getRange(1,1,1,SBM_HEADERS.LOG.length).setValues([SBM_HEADERS.LOG]).setFontWeight('bold');
  }
  var title=String(row[SBM_HEADERS.ARTICLE_DB.indexOf('記事タイトル')]||before.title);
  var query=String(row[SBM_HEADERS.ARTICLE_DB.indexOf('メインクエリ')]||data.new_values.main_query||'');
  var changed=sbmFeedbackChangedLabels_(data.changes).join('、');
  sh.appendRow([data.completed_at,title,data.article_url,query,data.summary,changed,data.estimated_minutes,data.warnings.join(' / '),sbmDateAfterDaysText_(data.recommended_review_days),'','モニター中',before.ctr,before.position,before.clicks,before.impressions]);
}



// RC11 compatibility aliases for menu actions.
function sbmOpenProcessLog(){ var sh=sbmGetOrCreateSheet_(SBM_SHEETS.PROCESS_LOG); sh.showSheet(); SpreadsheetApp.getActiveSpreadsheet().setActiveSheet(sh); }
function sbmOpenSystemLog(){ var sh=sbmGetOrCreateSheet_(SBM_SHEETS.SYSTEM_LOG); sh.showSheet(); SpreadsheetApp.getActiveSpreadsheet().setActiveSheet(sh); }

/* ========================================================================== *
 * Product 5.0 RC11 Baseline Extension: 改善履歴・効果測定 V1
 * 一覧は必要最低限、詳細は選択行＋上部メニューからポップアップ表示。
 * ========================================================================== */

const SBM_HISTORY_HEADERS_V2 = [
  '選択','改善日','記事タイトル','改善概要','使用AI',
  '1週','2週','3週','4週','最終判定','状態',
  '1回目測定日時','1回目SIMS寸評','2回目測定日時','2回目SIMS寸評','3回目測定日時','3回目SIMS寸評','4回目測定日時','4回目SIMS寸評',
  '最終総括','最終改善提案',
  'ArticleID','記事URL','変更箇所','変更後タイトル','変更後SEOタイトル','変更後メタディスクリプション','メインクエリ',
  '改善規模','確信度','期待CTR効果','期待クリック効果','次のアクション','維持した項目','作業時間（分）',
  '注意事項','改善前クリック','改善前表示回数','改善前CTR','改善前順位','AI改善結果JSON','改善履歴ID','改善計画JSON','Feedback Format','Writer Version'
];

const SBM_EFFECT_HEADERS_V2 = [
  '選択','改善実施日','経過日数','次回測定予定日','測定回数','記事タイトル','改善前CTR','現在CTR','改善前順位','現在順位','判定','ArticleID',
  '記事URL','改善概要','変更箇所','改善前クリック','現在クリック','クリック変化',
  '改善前表示回数','現在表示回数','表示回数変化','CTR変化','順位変化','期待CTR効果','期待クリック効果',
  'SIMS評価','次のアクション','測定コメント','最新測定日時','測定状態','改善履歴ID'
];


function sbmApplyProductVisibleTabs_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var visible = {};
  [SBM_SHEETS.HOME, SBM_SHEETS.TODAY, SBM_SHEETS.EFFECT, SBM_SHEETS.ARTICLE_DB, SBM_SHEETS.FEEDBACK_HISTORY].forEach(function(n){ visible[n] = true; });
  ss.getSheets().forEach(function(sh){
    try { if (visible[sh.getName()]) sh.showSheet(); else sh.hideSheet(); } catch(e) {}
  });
  var home = ss.getSheetByName(SBM_SHEETS.HOME);
  if (home) ss.setActiveSheet(home);
}

/**
 * Product 5.1 Official の効果測定スキーマを強制適用します。
 * 古い「測定予定日」列や旧メニューに依存せず、改善履歴を4回測定形式へ移行します。
 */
function sbmApplyProduct5OfficialMeasurementSchema_() {
  sbmEnsureHistoryAndEffectSchemas_();
  var history = sbmGetOrCreateSheet_(SBM_SHEETS.FEEDBACK_HISTORY);
  var effect = sbmGetOrCreateSheet_(SBM_SHEETS.EFFECT);
  try { sbmStyleHistorySheetV2_(); } catch (e) {}
  try { sbmStyleEffectSheetV2_(); } catch (e) {}
  SpreadsheetApp.flush();
  return {
    version: SBM_VERSION,
    historyHeaders: history.getRange(1, 1, 1, SBM_HISTORY_HEADERS_V2.length).getDisplayValues()[0],
    effectHeaders: effect.getRange(1, 1, 1, SBM_EFFECT_HEADERS_V2.length).getDisplayValues()[0]
  };
}

function sbmShowVersionInfo() {
  SpreadsheetApp.getUi().alert(
    'SIMS-Blog-Manager バージョン',
    '現在のコード：' + SBM_VERSION + '\n効果測定：7日・14日・21日・28日の4回測定',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

function sbmEnsureHistoryAndEffectSchemas_() {
  sbmMigrateSheetByHeaderNames_(SBM_SHEETS.FEEDBACK_HISTORY, SBM_HISTORY_HEADERS_V2, {
    '選択':['選択'], '改善日':['改善日','登録日時'], '記事タイトル':['記事タイトル'], '改善概要':['改善概要'], '使用AI':['使用AI'],
    '1週':['1週','1回目判定'], '2週':['2週','2回目判定'], '3週':['3週','3回目判定'], '4週':['4週','4回目判定'],
    '最終判定':['最終判定','最新判定','効果判定'], '状態':['状態'],
    '1回目測定日時':['1回目測定日時'], '1回目SIMS寸評':['1回目SIMS寸評'],
    '2回目測定日時':['2回目測定日時'], '2回目SIMS寸評':['2回目SIMS寸評'],
    '3回目測定日時':['3回目測定日時'], '3回目SIMS寸評':['3回目SIMS寸評'],
    '4回目測定日時':['4回目測定日時'], '4回目SIMS寸評':['4回目SIMS寸評'],
    '最終総括':['最終総括'], '最終改善提案':['最終改善提案'],
    'ArticleID':['ArticleID'], '記事URL':['記事URL'], '変更箇所':['変更箇所'],
    '変更後タイトル':['変更後タイトル'], '変更後SEOタイトル':['変更後SEOタイトル'],
    '変更後メタディスクリプション':['変更後メタディスクリプション'], 'メインクエリ':['メインクエリ'],
    '改善規模':['改善規模'], '確信度':['確信度'], '期待CTR効果':['期待CTR効果'], '期待クリック効果':['期待クリック効果'],
    '次のアクション':['次のアクション'], '維持した項目':['維持した項目'], '作業時間（分）':['作業時間（分）'],
    '注意事項':['注意事項'], '改善前クリック':['改善前クリック'], '改善前表示回数':['改善前表示回数'],
    '改善前CTR':['改善前CTR'], '改善前順位':['改善前順位'], 'AI改善結果JSON':['AI改善結果JSON'],
    '改善履歴ID':['改善履歴ID'], '改善計画JSON':['改善計画JSON'],
    'Feedback Format':['Feedback Format','フィードバック形式'], 'Writer Version':['Writer Version','SIMS Writer Version','Writerバージョン']
  });
  sbmMigrateSheetByHeaderNames_(SBM_SHEETS.EFFECT, SBM_EFFECT_HEADERS_V2, {
    '改善実施日':['改善実施日','改善日','登録日時'],
    '経過日数':['経過日数'],
    '次回測定予定日':['次回測定予定日','測定予定日'],
    '最新測定日時':['最新測定日時','測定日時']
  });
}

function sbmMigrateSheetByHeaderNames_(sheetName, newHeaders, aliases) {
  var sh = sbmGetOrCreateSheet_(sheetName);
  var oldRows = [];
  if (sh.getLastRow() >= 1 && sh.getLastColumn() >= 1) {
    var vals = sh.getDataRange().getValues();
    var oldHeaders = vals.shift().map(function(v){return String(v||'').trim();});
    vals.forEach(function(row){
      if (row.every(function(v){return v==='' || v===null;})) return;
      var obj={}; oldHeaders.forEach(function(h,i){ if(h) obj[h]=row[i]; }); oldRows.push(obj);
    });
  }
  sh.clear();
  if (sh.getMaxColumns() < newHeaders.length) sh.insertColumnsAfter(sh.getMaxColumns(), newHeaders.length-sh.getMaxColumns());
  sh.getRange(1,1,1,newHeaders.length).setValues([newHeaders]);
  if (oldRows.length) {
    var out=oldRows.map(function(o){
      return newHeaders.map(function(h){
        var candidates=(aliases&&aliases[h])||[h];
        for(var i=0;i<candidates.length;i++){ if(o[candidates[i]]!==undefined) return o[candidates[i]]; }
        return '';
      });
    });
    sh.getRange(2,1,out.length,newHeaders.length).setValues(out);
  }
  sh.setFrozenRows(1);
}



function sbmEnsureHistoryAndEffectSchemasIfEmpty_(sh,headers){ if(sh.getLastRow()===0 || String(sh.getRange(1,1).getValue())!==headers[0]){sh.clear();sh.getRange(1,1,1,headers.length).setValues([headers]);} }

function sbmIsSupportedFeedbackFormat_(format) {
  return /^SIMS_FEEDBACK_V[1-9]\d*$/.test(String(format || '').trim());
}

function sbmFeedbackProtocolVersion_(format) {
  var m = String(format || '').trim().match(/^SIMS_FEEDBACK_V([1-9]\d*)$/);
  return m ? parseInt(m[1], 10) : 0;
}

function sbmExtractWriterVersion_(obj) {
  obj = obj || {};
  var candidates = [
    obj.writer_version,
    obj.sims_writer_version,
    obj.version_candidate,
    obj.writer && obj.writer.version,
    obj.generator && obj.generator.version,
    obj.producer && obj.producer.version,
    obj.product && /SIMS\s*Writer/i.test(String(obj.product.name || '')) ? obj.product.version : '',
    obj.swls && obj.swls.writer_version,
    obj.diagnostics && obj.diagnostics.writer_version
  ];
  for (var i = 0; i < candidates.length; i++) {
    var value = String(candidates[i] === undefined || candidates[i] === null ? '' : candidates[i]).trim();
    if (value) return value;
  }
  return '';
}

function sbmFeedbackChangeKey_(target) {
  var key = String(target || '').trim().toLowerCase().replace(/[\s\-]+/g, '_');
  var aliases = {
    article_title:'article_title', title:'article_title', post_title:'article_title',
    seo_title:'seo_title', seo:'seo_title',
    description:'description', meta_description:'description', meta:'description',
    introduction:'introduction', intro:'introduction', lead:'introduction',
    heading:'headings', headings:'headings', outline:'headings',
    faq:'faq',
    internal_link:'internal_links', internal_links:'internal_links',
    body:'body', content:'body', conclusion:'body',
    image:'images', images:'images'
  };
  return aliases[key] || '';
}

function sbmNormalizeFeedbackChanges_(changes, changeFlags) {
  var boolKeys = ['article_title','seo_title','description','introduction','headings','faq','internal_links','body','images'];
  var flags = {}, details = [];
  boolKeys.forEach(function(k){ flags[k] = false; });

  function mark(target, value) {
    var key = sbmFeedbackChangeKey_(target);
    if (key && value !== false && value !== null && value !== undefined) flags[key] = true;
    return key;
  }

  if (Array.isArray(changes)) {
    changes.forEach(function(item){
      if (!item || typeof item !== 'object') return;
      var targets = Array.isArray(item.target) ? item.target : [item.target || item.type || item.field || item.section];
      var normalizedTargets = [];
      targets.forEach(function(target){ var key = mark(target, true); if (key) normalizedTargets.push(key); });
      details.push({
        targets: normalizedTargets,
        target: String(item.target || item.type || item.field || item.section || ''),
        before: item.before === undefined || item.before === null ? '' : String(item.before),
        after: item.after === undefined || item.after === null ? '' : String(item.after),
        reason: item.reason === undefined || item.reason === null ? '' : String(item.reason),
        expected_effect: item.expected_effect === undefined || item.expected_effect === null ? '' : String(item.expected_effect)
      });
    });
  } else {
    Object.keys(changes || {}).forEach(function(rawKey){
      var value = changes[rawKey];
      var key = sbmFeedbackChangeKey_(rawKey);
      if (!key) return;
      if (typeof value === 'boolean') flags[key] = value;
      else if (value && typeof value === 'object') {
        flags[key] = true;
        details.push({
          targets:[key], target:rawKey,
          before:value.before === undefined || value.before === null ? '' : String(value.before),
          after:value.after === undefined || value.after === null ? '' : String(value.after),
          reason:value.reason === undefined || value.reason === null ? '' : String(value.reason),
          expected_effect:value.expected_effect === undefined || value.expected_effect === null ? '' : String(value.expected_effect)
        });
      } else if (value) flags[key] = true;
    });
  }

  if (changeFlags && typeof changeFlags === 'object' && !Array.isArray(changeFlags)) {
    Object.keys(changeFlags).forEach(function(rawKey){
      var key = sbmFeedbackChangeKey_(rawKey);
      if (key && changeFlags[rawKey] === true) flags[key] = true;
    });
  }
  return {flags:flags, details:details};
}

function sbmApplyChangeDetailsToNewValues_(newValues, details) {
  if (!newValues || typeof newValues !== 'object') return;
  (details || []).forEach(function(detail){
    if (!detail || !detail.after) return;
    (detail.targets || []).forEach(function(key){
      if (key === 'article_title' && !newValues.article_title && !newValues.title) newValues.article_title = detail.after;
      if (key === 'seo_title' && !newValues.seo_title) newValues.seo_title = detail.after;
      if (key === 'description' && !newValues.description && !newValues.meta_description) newValues.description = detail.after;
    });
  });
}

function sbmNormalizeImprovementFeedback_(raw) {
  var text = String(raw || '').trim(), first = text.indexOf('{'), last = text.lastIndexOf('}');
  if (first < 0 || last <= first) throw new Error('JSONを見つけられません。AIの回答末尾にある { から } までを貼り付けてください。');
  var obj;
  try { obj = JSON.parse(text.substring(first, last + 1)); }
  catch (e) { throw new Error('JSON形式を読み取れません。内容を編集せず、そのままコピーしてください。\n' + e.message); }

  var format = String(obj.format || '').trim();
  if (!sbmIsSupportedFeedbackFormat_(format)) {
    throw new Error('format は SIMS_FEEDBACK_V1、SIMS_FEEDBACK_V2 など SIMS_FEEDBACK_V数字 の形式で指定してください。');
  }

  var articleId = String(obj.article_id || obj.articleId || '').trim();
  var articleUrl = String(obj.article_url || obj.url || obj.articleUrl || '').trim();
  if (!articleId && !articleUrl) throw new Error('改善結果登録には article_id または article_url が必要です。');
  var hasChanges = Object.prototype.hasOwnProperty.call(obj, 'changes');
  if (!hasChanges || !obj.changes || typeof obj.changes !== 'object') {
    throw new Error('改善結果登録に必要な changes がありません。changes はオブジェクト形式または配列形式で指定してください。');
  }

  var normalizedResult = sbmNormalizeFeedbackChanges_(obj.changes, obj.change_flags);
  var normalizedChanges = normalizedResult.flags;
  var changeDetails = normalizedResult.details;
  var nv = (obj.new_values && typeof obj.new_values === 'object') ? obj.new_values :
    ((obj.new_data && typeof obj.new_data === 'object') ? obj.new_data : {});
  sbmApplyChangeDetailsToNewValues_(nv, changeDetails);

  var days = 28; // Product 5.1 Official: 7・14・21・28日の4回測定で固定
  var minutes = parseInt(obj.estimated_minutes !== undefined ? obj.estimated_minutes : obj.minutes, 10);
  if (!isFinite(minutes) || minutes < 0) minutes = 0;
  var warnings = Array.isArray(obj.warnings) ? obj.warnings.map(String) : [];
  var completedAt = String(obj.completed_at || obj.completedAt || sbmDateText_(new Date()));

  return {
    format: format,
    protocol_version: sbmFeedbackProtocolVersion_(format),
    version: String(obj.version || ''),
    writer_version: sbmExtractWriterVersion_(obj),
    article_id: articleId,
    article_url: articleUrl,
    completed_at: completedAt,
    ai_name: String(obj.ai_name || obj.ai || obj.model || (obj.writer && obj.writer.name) || ''),
    changes: normalizedChanges,
    change_details: changeDetails,
    new_values: {
      article_title: String(nv.article_title || nv.title || ''),
      seo_title: String(nv.seo_title || ''),
      description: String(nv.description || nv.meta_description || ''),
      main_query: String(nv.main_query || '')
    },
    improvement_type: String(obj.improvement_type || 'normal'),
    confidence: String(obj.confidence || ''),
    expected_effect: (obj.expected_effect && typeof obj.expected_effect === 'object') ? obj.expected_effect : {},
    next_action: String(obj.next_action || 'monitor'),
    kept_sections: Array.isArray(obj.kept_sections) ? obj.kept_sections.map(String) : (Array.isArray(obj.protected_elements) ? obj.protected_elements.map(String) : []),
    summary: String(obj.summary || '').trim() || '改善内容の登録',
    warnings: warnings,
    estimated_minutes: minutes,
    recommended_review_days: days,
    raw_json: (typeof obj.raw_json === 'string' && obj.raw_json.trim()) ? obj.raw_json : JSON.stringify(obj)
  };
}

function sbmAppendImprovementHistory_(data,row,before) {
  sbmEnsureHistoryAndEffectSchemas_();
  var identityId=String(data.article_id||'').trim(), identityUrl=String(data.article_url||'').trim();
  if(!identityId && !identityUrl){
    sbmLog_('AppendImprovementHistory','Error','ArticleID and article URL are both missing. History registration was stopped.');
    throw new Error('改善履歴を登録できません。ArticleIDまたは記事URLが必要です。');
  }
  var sh=sbmGetOrCreateSheet_(SBM_SHEETS.FEEDBACK_HISTORY), changed=sbmFeedbackChangedLabels_(data.changes).join('、');
  var historyId = sbmNextImprovementHistoryId_();
  var articleTitle=String(row[SBM_HEADERS.ARTICLE_DB.indexOf('記事タイトル')]||data.new_values.article_title||before.title);
  var planSnapshot = sbmBuildImprovementPlanSnapshot_(data.article_url, data.article_id);
  var record={
    '選択':false,'改善日':data.completed_at||sbmNowText_(),'記事タイトル':articleTitle,'改善概要':data.summary,'使用AI':data.ai_name||'',
    '1週':'未測定','2週':'未測定','3週':'未測定','4週':'未測定','最終判定':'測定待ち','状態':'測定待ち',
    'ArticleID':data.article_id,'記事URL':data.article_url,'変更箇所':changed,'変更後タイトル':data.new_values.article_title,
    '変更後SEOタイトル':data.new_values.seo_title,'変更後メタディスクリプション':data.new_values.description,'メインクエリ':data.new_values.main_query,
    '改善規模':data.improvement_type,'確信度':data.confidence,'期待CTR効果':String((data.expected_effect||{}).ctr||''),
    '期待クリック効果':String((data.expected_effect||{}).clicks||''),'次のアクション':data.next_action,
    '維持した項目':(data.kept_sections||[]).join(' / '),'作業時間（分）':data.estimated_minutes,'注意事項':data.warnings.join(' / '),
    '改善前クリック':before.clicks,'改善前表示回数':before.impressions,'改善前CTR':before.ctr,'改善前順位':before.position,
    'AI改善結果JSON':data.raw_json||'','改善履歴ID':historyId,'改善計画JSON':JSON.stringify(planSnapshot||{}),
    'Feedback Format':data.format||'','Writer Version':data.writer_version||''
  };
  sh.appendRow(SBM_HISTORY_HEADERS_V2.map(function(h){return record[h]!==undefined?record[h]:'';}));
  sbmStyleHistorySheetV2_();
  try{sbmUpdateEffectivenessCore_(false);}catch(e){}
}


function sbmUpdateEffectivenessSilent_(){ return sbmUpdateEffectivenessCore_(false); }


function sbmJudgeEffectV2_(ctrDelta,posDelta,clickDelta){ if((ctrDelta>=0.005&&posDelta>=1)||(clickDelta>=20&&ctrDelta>0))return '大きく改善'; if(ctrDelta>=0.002||posDelta>=1||clickDelta>0)return '改善'; if(ctrDelta<=-0.003||posDelta<=-2||clickDelta<0)return '悪化'; return '横ばい'; }
function sbmSuggestEffectNextActionV2_(judgment,h,a){ if(judgment==='大きく改善')return '改善成功。モニターを完了し、現状維持をおすすめします。'; if(judgment==='改善')return '改善傾向です。28日目まで週次測定を継続してください。'; if(judgment==='悪化')return '改善内容を再確認し、タイトル・検索意図・導入文の再改善を検討してください。'; if(judgment==='横ばい')return '28日目まで週次測定を続け、最終判定後に再改善を検討してください。'; return '次回の週次測定日までモニターを続けてください。'; }

function sbmHistoryMeasurementState_(h) {
  var count=0, latestDate='', latestJudgment='測定待ち';
  for(var i=1;i<=4;i++){
    var dt=h[i+'回目測定日時'];
    var judge=String(h[i+'週']||h[i+'回目判定']||'').trim();
    if(dt!==''&&dt!==null&&dt!==undefined){ count=i; latestDate=dt; latestJudgment=judge||latestJudgment; }
  }
  return {count:count,latestDate:latestDate,latestJudgment:latestJudgment,complete:count>=4};
}

function sbmNextWeeklyDueDate_(historyRow) {
  var state=sbmHistoryMeasurementState_(historyRow);
  if(state.complete)return null;
  var improveDate=sbmParseDate_(historyRow['改善日'])||new Date();
  var due=new Date(improveDate.getTime());
  due.setDate(due.getDate()+((state.count+1)*7));
  due.setHours(9,0,0,0);
  return due;
}

function sbmBuildWeeklyObservation_(week, ctrDelta, posDelta, clickDelta, impDelta) {
  var parts=['改善後'+week+'週目の測定です。'];
  parts.push(ctrDelta>0.001?'CTRは改善前より上昇しています。':ctrDelta<-0.001?'CTRは改善前より低下しています。':'CTRは改善前とほぼ同水準です。');
  parts.push(posDelta>0.5?'掲載順位は改善前より上昇しています。':posDelta<-0.5?'掲載順位は改善前より低下しています。':'掲載順位に大きな変化はありません。');
  parts.push(clickDelta>0?'クリック数は改善前より増加しています。':clickDelta<0?'クリック数は改善前より減少しています。':'クリック数は改善前と同水準です。');
  if(impDelta>0) parts.push('表示回数は改善前より増えています。');
  return parts.join('');
}

function sbmBuildFinalAssessment_(judgment, ctrDelta, posDelta, clickDelta) {
  var summary='4週間の測定が完了しました。';
  var proposal='';
  if(judgment==='大きく改善'||judgment==='改善'){
    summary+='改善前と比べて効果が確認でき、今回の改善は成功または改善傾向と判断します。';
    proposal='現在の内容を維持し、同じ改善方法を類似記事へ展開できるか検討してください。';
  }else if(judgment==='悪化'){
    summary+='改善前より数値が低下しており、今回の改善の推移は十分ではありませんでした。';
    proposal='検索意図、タイトル、導入文、見出し構成を改めて確認し、再改善の対象として検討してください。';
  }else{
    summary+='大きな変化は確認できず、改善の推移は限定的と判断します。';
    proposal='表示回数・CTR・順位のうち伸びていない要素を確認し、次回の改善対象を絞り込んでください。';
  }
  return {summary:summary,proposal:proposal};
}

function sbmRecordWeeklyMeasurement_(historyRow,judgment,measuredAt,metrics) {
  var sh=sbmGetOrCreateSheet_(SBM_SHEETS.FEEDBACK_HISTORY), hm=sbmHeaderMap_(sh);
  var historyId=String(historyRow['改善履歴ID']||'').trim(), articleId=String(historyRow['ArticleID']||'').trim();
  var values=sh.getDataRange().getValues(), heads=values.shift().map(String), target=0;
  var idIdx=heads.indexOf('改善履歴ID'), articleIdx=heads.indexOf('ArticleID'), dateIdx=heads.indexOf('改善日');
  for(var i=0;i<values.length;i++){
    var id= idIdx>=0 ? String(values[i][idIdx]||'').trim() : '';
    if(historyId && id===historyId){target=i+2;break;}
    if(!historyId && articleIdx>=0 && String(values[i][articleIdx]||'').trim()===articleId && dateIdx>=0 && String(values[i][dateIdx]||'')===String(historyRow['改善日']||'')){target=i+2;break;}
  }
  if(!target)return {recorded:false,count:0};
  var current=sbmRowRecord_(sh,target), state=sbmHistoryMeasurementState_(current);
  if(state.complete)return {recorded:false,count:4,complete:true};
  var n=state.count+1, dateCol=hm[n+'回目測定日時'], judgeCol=hm[n+'週'], commentCol=hm[n+'回目SIMS寸評'];
  if(!dateCol||!judgeCol||!commentCol)return {recorded:false,count:state.count};
  var when=new Date(measuredAt.getTime());
  var observation=sbmBuildWeeklyObservation_(n,metrics.ctrDelta,metrics.posDelta,metrics.clickDelta,metrics.impDelta);
  sh.getRange(target,dateCol).setValue(when).setNumberFormat('yyyy/M/d');
  sh.getRange(target,judgeCol).setValue(judgment);
  sh.getRange(target,commentCol).setValue(observation);
  if(hm['状態'])sh.getRange(target,hm['状態']).setValue(n>=4?'完了':'測定中');
  if(n>=4){
    var final=sbmBuildFinalAssessment_(judgment,metrics.ctrDelta,metrics.posDelta,metrics.clickDelta);
    if(hm['最終判定'])sh.getRange(target,hm['最終判定']).setValue(judgment);
    if(hm['最終総括'])sh.getRange(target,hm['最終総括']).setValue(final.summary);
    if(hm['最終改善提案'])sh.getRange(target,hm['最終改善提案']).setValue(final.proposal);
  }else if(hm['最終判定']){
    sh.getRange(target,hm['最終判定']).setValue('測定中');
  }
  SpreadsheetApp.flush();
  return {recorded:true,count:n,complete:n>=4,observation:observation};
}


function sbmOpenSelectedArticleHistory(){
  var ctx=sbmSelectedArticleContext_();
  if(!ctx)return sbmAlert_('改善履歴','記事DBまたは今日の改善で対象記事の行を選択してください。');
  sbmEnsureHistoryAndEffectSchemas_();
  var rows=sbmRowsAsObjects_(SBM_SHEETS.FEEDBACK_HISTORY)||[];
  var items=rows.filter(function(r){return (ctx.articleId&&String(r['ArticleID']||'')===ctx.articleId)||sbmNormalizeUrl_(r['記事URL']||'')===sbmNormalizeUrl_(ctx.articleUrl||'');});
  if(!items.length)return sbmAlert_('改善履歴','選択記事の改善履歴はまだありません。');
  var e=sbmEscapeHtml_,cards=items.slice().reverse().map(function(r){
    var measurements='';
    for(var i=1;i<=4;i++){
      var dt=r[i+'回目測定日時'], judge=r[i+'週'];
      if(dt||judge)measurements+='<br>'+i+'回目：'+e(dt||'未測定')+' / '+e(judge||'未判定');
    }
    return '<div style="border:1px solid #dadce0;border-radius:8px;padding:12px;margin:10px 0"><b>'+e(r['改善日'])+'</b>　'+e(r['最終判定']||r['状態']||'測定待ち')+'<br>AI：'+e(r['使用AI']||'未記録')+'<br>変更：'+e(r['変更箇所'])+'<br>概要：'+e(r['改善概要'])+measurements+'</div>';
  }).join('');
  SpreadsheetApp.getUi().showModalDialog(HtmlService.createHtmlOutput('<div style="font-family:Arial,Noto Sans JP,sans-serif;padding:20px"><h2>記事の改善履歴</h2><h3>'+e(ctx.articleTitle)+'</h3>'+cards+'<div style="text-align:right;margin-top:18px"><button onclick="google.script.host.close()" style="padding:9px 18px">閉じる</button></div></div>').setWidth(720).setHeight(650),'記事の改善履歴');
}

// 表示形式の補強（V1）



/* ========================================================================== *
 * RC11 Selection Workflow / Article Management UI
 * ========================================================================== */

function sbmArrangeUserSheets_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  [SBM_SHEETS.HOME, SBM_SHEETS.TODAY, SBM_SHEETS.EFFECT, SBM_SHEETS.ARTICLE_DB, SBM_SHEETS.FEEDBACK_HISTORY].forEach(function(name, i){
    var sh = ss.getSheetByName(name);
    if (!sh) return;
    try { sh.showSheet(); ss.setActiveSheet(sh); ss.moveActiveSheet(i + 1); } catch(e) {}
  });
  var home = ss.getSheetByName(SBM_SHEETS.HOME);
  if (home) ss.setActiveSheet(home);
}


function sbmApplySelectionUiAll_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  [SBM_SHEETS.TODAY, SBM_SHEETS.EFFECT, SBM_SHEETS.ARTICLE_DB, SBM_SHEETS.FEEDBACK_HISTORY].forEach(function(n){
    var sh=ss.getSheetByName(n); if(sh) sbmApplySelectionUi_(sh);
  });
}

function sbmGetCheckedRow_(sh, silent) {
  if (!sh || sh.getLastRow() < 2) { if(!silent) sbmAlert_('対象を選択してください','一覧に対象データがありません。'); return 0; }
  var hm=sbmHeaderMap_(sh), col=hm['選択'];
  if (!col) { var ar=sh.getActiveRange(); return ar && ar.getRow()>1 ? ar.getRow() : 0; }
  var vals=sh.getRange(2,col,sh.getLastRow()-1,1).getValues(), found=[];
  vals.forEach(function(v,i){ if(v[0]===true) found.push(i+2); });
  if(found.length!==1){ if(!silent) sbmAlert_('対象を1件選択してください', found.length>1?'チェックは1件だけにしてください。':'左端のチェックボックスで対象を1件選択してください。'); return 0; }
  return found[0];
}


function sbmStyleTodaySheetSelection_(){
  var sh=SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SBM_SHEETS.TODAY); if(!sh)return;
  var hm=sbmHeaderMap_(sh); if(hm['メインクエリ']&&sh.getLastRow()>1)sh.getRange(2,hm['メインクエリ'],sh.getLastRow()-1,1).setWrap(true);
  sbmApplySelectionUi_(sh);
}



function sbmOpenSelectedHistoryArticleAll(){
  var sh=SpreadsheetApp.getActiveSheet();if(!sh||sh.getName()!==SBM_SHEETS.FEEDBACK_HISTORY)return sbmAlert_('改善履歴','改善履歴を開いてください。');
  var row=sbmGetCheckedRow_(sh);if(!row)return;var o=sbmRowRecord_(sh,row),id=String(o['ArticleID']||''),url=String(o['記事URL']||'');
  var rows=sbmRowsAsObjects_(SBM_SHEETS.FEEDBACK_HISTORY).filter(function(r){return(id&&String(r['ArticleID']||'')===id)||sbmNormalizeUrl_(r['記事URL']||'')===sbmNormalizeUrl_(url);});
  if(!rows.length)return sbmAlert_('改善履歴','履歴がありません。');
  var e=sbmEscapeHtml_,cards=rows.slice().reverse().map(function(r){
    var measurements='';for(var i=1;i<=4;i++){var dt=r[i+'回目測定日時'],j=String(r[i+'週']||'').trim(),measured=!!j&&j!=='未測定'&&j!=='未判定',planned=sbmWeeklyPlannedDate_(r,i),plannedText=planned?Utilities.formatDate(planned,SBM_DEFAULTS.TIMEZONE,'yyyy/M/d'):'日付不明';measurements+='<br>'+i+'週目：'+(measured?e(sbmHistoryDateOnlyText_(dt))+' / '+e(j):'未測定（予定：'+e(plannedText)+'）');}
    return '<div style="border:1px solid #dadce0;border-radius:8px;padding:12px;margin:10px 0"><b>'+e(r['改善日'])+'</b>　'+e(r['最終判定']||r['状態']||'測定待ち')+'<br>'+e(r['改善概要'])+'<br>変更：'+e(r['変更箇所'])+measurements+'</div>';
  }).join('');
  SpreadsheetApp.getUi().showModalDialog(HtmlService.createHtmlOutput('<div style="font-family:Arial,Noto Sans JP,sans-serif;padding:20px"><h2>記事の全改善履歴</h2><h3>'+e(o['記事タイトル'])+'</h3>'+cards+'<div style="text-align:right;margin-top:18px"><button onclick="google.script.host.close()" style="padding:9px 18px;border:1px solid #9aa0a6;border-radius:6px;background:#fff;font-weight:700;cursor:pointer">閉じる</button></div></div>').setWidth(720).setHeight(650),'記事の全改善履歴');
}

function sbmOpenSelectedImprovementNavi(){var sh=SpreadsheetApp.getActiveSheet();if(!sh||(sh.getName()!==SBM_SHEETS.TODAY&&sh.getName()!==SBM_SHEETS.ARTICLE_DB))return sbmAlert_('改善ナビ','今日の改善または記事管理を開いてください。');var row=sbmGetCheckedRow_(sh);if(!row)return;var record=sbmRowRecord_(sh,row),url=String(record['記事URL']||'').trim();if(!url)return sbmAlert_('改善ナビ','記事URLを取得できません。');var article=sbmFindArticleDbByUrl_(url)||record;sbmShowImprovementNaviDialog_(article,record['区分']||'改善候補',record['改善理由・期待効果']||'');}

/** 改善実施日と今日を日本時間の日付単位で比較し、時刻差による1日ずれを防ぎます。 */
function sbmElapsedDaysFromImprovementDate_(value) {
  var d = sbmParseDate_(value);
  if (!d) return 0;
  var tz = SBM_DEFAULTS.TIMEZONE || 'Asia/Tokyo';
  var startText = Utilities.formatDate(d, tz, 'yyyy-MM-dd');
  var todayText = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
  var start = new Date(startText + 'T00:00:00+09:00');
  var today = new Date(todayText + 'T00:00:00+09:00');
  return Math.max(0, Math.floor((today.getTime() - start.getTime()) / 86400000));
}

function sbmUpdateEffectivenessCore_(showAlert){
  sbmEnsureHistoryAndEffectSchemas_();
  var history=sbmRowsAsObjects_(SBM_SHEETS.FEEDBACK_HISTORY)||[],articles=sbmRowsAsObjects_(SBM_SHEETS.ARTICLE_DB)||[],byId={},byUrl={};
  articles.forEach(function(a){if(a['ArticleID'])byId[String(a['ArticleID'])]=a;if(a['記事URL'])byUrl[sbmNormalizeUrl_(a['記事URL'])]=a;});
  var rows=[], now=new Date(), recordedCount=0;
  history.forEach(function(h){
    var a=byId[String(h['ArticleID']||'')]||byUrl[sbmNormalizeUrl_(h['記事URL']||'')];if(!a)return;
    var improveDate=sbmParseDate_(h['改善日'])||new Date(),elapsed=sbmElapsedDaysFromImprovementDate_(h['改善日']);
    var beforeCtr=sbmNormalizeCtrNumber_(h['改善前CTR']),currentCtr=sbmNormalizeCtrNumber_(a['CTR']),beforePos=sbmNumber_(h['改善前順位']),currentPos=sbmNumber_(a['掲載順位']),beforeClicks=sbmNumber_(h['改善前クリック']),currentClicks=sbmNumber_(a['クリック数']),beforeImp=sbmNumber_(h['改善前表示回数']),currentImp=sbmNumber_(a['表示回数']);
    var ctrDelta=currentCtr-beforeCtr,posDelta=beforePos-currentPos,clickDelta=currentClicks-beforeClicks,impDelta=currentImp-beforeImp;
    var state=sbmHistoryMeasurementState_(h), due=sbmNextWeeklyDueDate_(h), dueReached=!!due&&now>=due;
    var currentJudgment=sbmJudgeEffectV2_(ctrDelta,posDelta,clickDelta);
    if(dueReached&&!state.complete){
      var rec=sbmRecordWeeklyMeasurement_(h,currentJudgment,now,{ctrDelta:ctrDelta,posDelta:posDelta,clickDelta:clickDelta,impDelta:impDelta});
      if(rec.recorded){recordedCount++;h[(rec.count)+'回目測定日時']=now;h[(rec.count)+'週']=currentJudgment;h[(rec.count)+'回目SIMS寸評']=rec.observation;h['最終判定']=rec.complete?currentJudgment:'測定中';h['状態']=rec.complete?'完了':'測定中';}
      state=sbmHistoryMeasurementState_(h);due=sbmNextWeeklyDueDate_(h);
    }
    var judgment=state.count>0?state.latestJudgment:'測定待ち';
    var rating=sbmEvaluateEffectResult_(judgment==='大きく改善'?'成功':judgment==='改善'?'改善傾向':judgment==='悪化'?'要再改善':judgment,posDelta,ctrDelta,clickDelta);
    var next=state.complete?String(h['最終改善提案']||'4回の週次測定が完了しました。最終判定を確認してください。'):'次回測定日まで経過を観察します。';
    var comment=state.complete?'改善後28日間の測定が完了しました。':(state.count+'回測定済み。次回は改善後'+((state.count+1)*7)+'日目です。');
    rows.push([false,improveDate,elapsed,due||'【測定完了】',state.count+'回／4回',h['記事タイトル'],beforeCtr,currentCtr,beforePos,currentPos,judgment,h['ArticleID'],h['記事URL'],h['改善概要'],h['変更箇所'],beforeClicks,currentClicks,clickDelta,beforeImp,currentImp,impDelta,ctrDelta,posDelta,h['期待CTR効果'],h['期待クリック効果'],rating,next,comment,state.latestDate||'',state.complete?'測定完了':'モニター中',h['改善履歴ID']||'']);
    if(state.complete)sbmMarkArticleMeasurementComplete_(h['ArticleID']);
  });
  var sh=sbmGetOrCreateSheet_(SBM_SHEETS.EFFECT);sh.clear();sh.getRange(1,1,1,SBM_EFFECT_HEADERS_V2.length).setValues([SBM_EFFECT_HEADERS_V2]);
  if(rows.length)sh.getRange(2,1,rows.length,SBM_EFFECT_HEADERS_V2.length).setValues(rows);
  try{if(rows.length)sh.getRange(2,1,rows.length,SBM_EFFECT_HEADERS_V2.length).sort([{column:4,ascending:true},{column:6,ascending:true}]);}catch(e){}
  sbmStyleEffectSheetV2_();
  if(showAlert)sbmAlert_('改善の推移','改善の推移を更新しました。対象 '+rows.length+'件'+(recordedCount?'\n今回の測定記録 '+recordedCount+'件':'') );
  return rows.length;
}

function sbmMarkArticleMeasurementComplete_(articleId){
  if(!articleId)return;var sh=sbmGetOrCreateSheet_(SBM_SHEETS.ARTICLE_DB),hm=sbmHeaderMap_(sh);if(!hm['ArticleID']||!hm['作業状態']||sh.getLastRow()<2)return;
  var ids=sh.getRange(2,hm['ArticleID'],sh.getLastRow()-1,1).getDisplayValues();for(var i=0;i<ids.length;i++){if(String(ids[i][0]||'')===String(articleId)){sh.getRange(i+2,hm['作業状態']).setValue('✔️ 完了');break;}}
}


function sbmSortArticleDbRows_(rows){rows=rows||[];rows.sort(function(a,b){var workOrder={'👀 モニター中':1,'✏️ 改善中':2,'🔥 今日の改善':3,'未着手':4,'✔️ 完了':5,'':9},rankOrder={'🏆 エース':1,'✅ 安定':2,'📈 成長':3,'🌱 育成':4,'⚠️ 低迷':5,'—':9,'':9};var aNew=String(a[a.length-1]||'')==='新規記事',bNew=String(b[b.length-1]||'')==='新規記事';if(aNew!==bNew)return aNew?-1:1;var aw=workOrder[String(a[2]||'').trim()]||99,bw=workOrder[String(b[2]||'').trim()]||99;if(aw!==bw)return aw-bw;var ar=rankOrder[String(a[1]||'').trim()]||99,br=rankOrder[String(b[1]||'').trim()]||99;if(ar!==br)return ar-br;return sbmNumber_(b[6])-sbmNumber_(a[6]);});return rows;}


function sbmMigrateArticleManagementSheet_() {
  var ss=SpreadsheetApp.getActiveSpreadsheet(), old=ss.getSheetByName('記事DB'), cur=ss.getSheetByName(SBM_SHEETS.ARTICLE_DB);
  if(old&&!cur){old.setName(SBM_SHEETS.ARTICLE_DB);cur=old;}
  if(cur){var heads=cur.getRange(1,1,1,Math.max(1,cur.getLastColumn())).getDisplayValues()[0].map(String);if(heads.indexOf('選択')<0)sbmMigrateSheetByHeaderNames_(SBM_SHEETS.ARTICLE_DB,SBM_HEADERS.ARTICLE_DB,{});}
}
function sbmSelectedArticleContext_(){try{var sh=SpreadsheetApp.getActiveSheet();if(!sh||[SBM_SHEETS.ARTICLE_DB,SBM_SHEETS.TODAY].indexOf(sh.getName())<0)return null;var row=sbmGetCheckedRow_(sh,true)||((sh.getActiveRange()&&sh.getActiveRange().getRow()>1)?sh.getActiveRange().getRow():0);if(!row)return null;var rec=sbmRowRecord_(sh,row),url=String(rec['記事URL']||''),a=sbmFindArticleDbByUrl_(url)||rec;return{articleId:String(a['ArticleID']||''),articleUrl:String(a['記事URL']||url),articleTitle:String(a['記事タイトル']||rec['記事タイトル']||'')};}catch(e){return null;}}
function sbmGetSelectedArticleDbSummary(){var sh=SpreadsheetApp.getActiveSheet();if(!sh||sh.getName()!==SBM_SHEETS.ARTICLE_DB)return{ok:false};var row=sbmGetCheckedRow_(sh,true)||((sh.getActiveRange()&&sh.getActiveRange().getRow()>1)?sh.getActiveRange().getRow():0);if(!row)return{ok:false};var hm=sbmHeaderMap_(sh);function val(n){return hm[n]?sh.getRange(row,hm[n]).getDisplayValue():'';}return{ok:true,row:row,title:val('記事タイトル'),url:val('記事URL'),rank:val('記事ランク'),work:val('作業状態')};}
function sbmOpenSelectedArticleDbDetail(){var sh=SpreadsheetApp.getActiveSheet();if(!sh||sh.getName()!==SBM_SHEETS.ARTICLE_DB)return sbmAlert_('記事管理詳細','記事管理を開いてください。');var row=sbmGetCheckedRow_(sh);if(!row)return;sbmShowArticleDbDetailForRow_(sh,row);}


/* ========================================================================== *
 * Product 5.0 RC11 History / Effectiveness Reliability Fix
 * - 改善履歴を非破壊で修復
 * - 改善の推移をモニター中の記事から再生成
 * - 一択チェックボックスを即時解除
 * - 利用者向け名称を「改善の推移」に統一
 * ========================================================================== */

function sbmMigrateEffectSheetName_(){
  var ss=SpreadsheetApp.getActiveSpreadsheet();
  var cur=ss.getSheetByName(SBM_SHEETS.EFFECT);
  ['改善の推移','効果測定'].some(function(name){
    var old=ss.getSheetByName(name);
    if(old&&!cur){try{old.setName(SBM_SHEETS.EFFECT);cur=old;}catch(e){}}
    return !!cur;
  });
  return cur||ss.getSheetByName(SBM_SHEETS.EFFECT);
}

function sbmCanonicalHistoryHeaders_(){ return SBM_HISTORY_HEADERS_V2.slice(); }


function onEdit(e){
  try{sbmLegacyOnEdit_(e);}catch(err){}
  try{
    if(!e||!e.range)return;
    var sh=e.range.getSheet(), hm=sbmHeaderMap_(sh), sel=hm['選択'];
    if(!sel||e.range.getColumn()!==sel||e.range.getRow()<=1)return;
    if(e.value!=='TRUE')return;
    var props=PropertiesService.getDocumentProperties(), key='SBM_LAST_CHECKED_'+sh.getSheetId(), row=e.range.getRow();
    var previous=parseInt(props.getProperty(key)||'0',10);
    if(previous>1&&previous!==row&&previous<=sh.getLastRow())sh.getRange(previous,sel).setValue(false);
    props.setProperty(key,String(row));
  }catch(err2){console.error(err2);}
}

function sbmOpenEffectiveness(){sbmMigrateEffectSheetName_();var sh=sbmGetOrCreateSheet_(SBM_SHEETS.EFFECT);SpreadsheetApp.getActiveSpreadsheet().setActiveSheet(sh);sh.activate();}
function sbmUpdateEffectiveness(){sbmMigrateEffectSheetName_();return sbmUpdateEffectivenessCore_(true);}


/* ========================================================================== *
 * Product 5.0 RC11 History Display / Menu Clarity Fix
 * - 改善履歴の列ずれを旧改善ログ・JSON・記事管理から復元
 * - 記事タイトル／改善概要を折り返し表示
 * - 上部メニュー内の項目名を簡潔化
 * ========================================================================== */

function sbmLooksLikeHistoryDate_(v){
  if(v instanceof Date && !isNaN(v.getTime())) return true;
  var s=String(v||'').trim();
  return /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}/.test(s);
}
function sbmLooksLikeArticleId_(v){ return /^A\d{4,}$/i.test(String(v||'').trim()); }
function sbmLooksLikeUrl_(v){ return /^https?:\/\//i.test(String(v||'').trim()); }
function sbmLooksLikeBrokenHistoryObject_(o){
  var d=o['改善日'], t=String(o['記事タイトル']||'').trim(), u=String(o['記事URL']||'').trim(), id=String(o['ArticleID']||'').trim();
  var historyId=String(o['改善履歴ID']||'').trim(), summary=String(o['改善概要']||'').trim(), changed=String(o['変更箇所']||'').trim();
  if(String(d).toUpperCase()==='FALSE' || d===false) return true;
  if(!sbmLooksLikeHistoryDate_(d)) return true;
  if(!t || /^(true|false)$/i.test(t) || /^\d{1,3}$/.test(t)) return true;
  if(u && !sbmLooksLikeUrl_(u)) return true;
  if(id && !sbmLooksLikeArticleId_(id)) return true;
  // Product 5.2.8: 列ずれで作られた「UI」等の孤立行を除外します。
  if(!u && !id && !historyId && !summary && !changed && t.length <= 3) return true;
  return false;
}
function sbmLegacyHistoryObjects_(){
  var ss=SpreadsheetApp.getActiveSpreadsheet(), sh=ss.getSheetByName(SBM_SHEETS.LOG), out=[];
  if(!sh || sh.getLastRow()<2) return out;
  var vals=sh.getDataRange().getValues(), heads=vals.shift().map(function(v){return String(v||'').trim();});
  var articles=sbmRowsAsObjects_(SBM_SHEETS.ARTICLE_DB)||[], byUrl={};
  articles.forEach(function(a){var k=sbmNormalizeUrl_(a['記事URL']||''); if(k) byUrl[k]=a;});
  vals.forEach(function(r){
    if(r.every(function(v){return v===''||v===null;})) return;
    var o={}; heads.forEach(function(h,i){if(h)o[h]=r[i];});
    var url=String(o['URL']||''), normalizedUrl=sbmNormalizeUrl_(url), a=byUrl[normalizedUrl]||{};
    // Product 5.2.10: URLも記事照合もできない旧ログ行は再取り込みしません。
    // 「UI」などの孤立行が改善履歴へ復活する経路を遮断します。
    if(!normalizedUrl || !sbmLooksLikeUrl_(url) || !a['ArticleID']) return;
    var improveDate=o['改善日']||'', reviewDate=o['初回測定日']||'';
    out.push({
      '選択':false,'改善日':improveDate,'記事タイトル':o['記事タイトル']||a['記事タイトル']||'',
      '改善概要':o['改善内容']||'','使用AI':'','1回目測定日時':reviewDate,
      '1週':o['状態']==='完了'?'完了':'未測定','2週':'未測定','3週':'未測定','4週':'未測定','最終判定':o['状態']==='完了'?'完了':'測定待ち','状態':o['状態']==='完了'?'完了':'測定待ち','ArticleID':a['ArticleID']||'','記事URL':url,
      '変更箇所':o['修正内容']||'','変更後タイトル':'','変更後SEOタイトル':'','変更後メタディスクリプション':'',
      'メインクエリ':o['メインクエリ']||a['メインクエリ']||'','改善規模':'','確信度':'','期待CTR効果':'',
      '期待クリック効果':'','次のアクション':'monitor','維持した項目':'','作業時間（分）':o['所要時間']||'',
      '注意事項':o['メモ']||'','改善前クリック':o['改善前クリック']||0,
      '改善前表示回数':o['改善前表示回数']||0,'改善前CTR':o['改善前CTR']||0,'改善前順位':o['改善前順位']||0,
      'AI改善結果JSON':''
    });
  });
  return out;
}
function sbmHistoryKey_(o){
  return [String(o['ArticleID']||''),sbmNormalizeUrl_(o['記事URL']||''),String(o['改善日']||''),String(o['改善概要']||'').slice(0,40)].join('|');
}

function sbmHistoryCompletenessScore_(o){
  var fields=['改善履歴ID','ArticleID','記事URL','記事タイトル','改善概要','変更箇所','AI改善結果JSON','改善計画JSON','メインクエリ'];
  var score=0;
  fields.forEach(function(k){
    var v=String(o[k]===undefined||o[k]===null?'':o[k]).trim();
    if(v) score += (k==='改善履歴ID'||k==='ArticleID'||k==='記事URL') ? 3 : 1;
  });
  for(var i=1;i<=4;i++){
    if(String(o[i+'回目測定日時']||'').trim()) score++;
    if(String(o[i+'週']||'').trim() && String(o[i+'週']||'').trim()!=='未測定') score++;
  }
  return score;
}

function sbmIsUnrecoverableHistoryObject_(o){
  var historyId=String(o['改善履歴ID']||'').trim();
  var articleId=String(o['ArticleID']||'').trim();
  var url=String(o['記事URL']||'').trim();
  var rawJson=String(o['AI改善結果JSON']||'').trim();
  var planJson=String(o['改善計画JSON']||'').trim();
  return !historyId && !articleId && !url && !rawJson && !planJson;
}

function sbmBackupRemovedHistoryRows_(items){
  if(!items || !items.length) return;
  var ss=SpreadsheetApp.getActiveSpreadsheet();
  var name='改善履歴_除外バックアップ';
  var sh=ss.getSheetByName(name);
  var headers=['除外日時','除外理由'].concat(SBM_HISTORY_HEADERS_V2);
  if(!sh){
    sh=ss.insertSheet(name);
    sh.getRange(1,1,1,headers.length).setValues([headers]);
    sh.setFrozenRows(1);
    sh.getRange(1,1,1,headers.length).setBackground('#5f6368').setFontColor('#ffffff').setFontWeight('bold');
  }else if(sh.getLastRow()===0){
    sh.getRange(1,1,1,headers.length).setValues([headers]);
  }
  var now=sbmNowText_();
  var rows=items.map(function(item){
    var o=item.object||{};
    return [now,item.reason||'復元不能'].concat(SBM_HISTORY_HEADERS_V2.map(function(h){return o[h]!==undefined?o[h]:'';}));
  });
  sh.getRange(sh.getLastRow()+1,1,rows.length,headers.length).setValues(rows);
  try{sh.hideSheet();}catch(e){}
}

function sbmRepairImprovementHistoryData_(){
  var ss=SpreadsheetApp.getActiveSpreadsheet(), sh=sbmGetOrCreateSheet_(SBM_SHEETS.FEEDBACK_HISTORY), headers=SBM_HISTORY_HEADERS_V2.slice();
  var current=[], removed=[];
  if(sh.getLastRow()>1){
    var vals=sh.getDataRange().getValues(), oldHeads=vals.shift().map(function(v){return String(v||'').trim();});
    vals.forEach(function(r){
      if(r.every(function(v){return v===''||v===null;})) return;
      var o={}; oldHeads.forEach(function(h,i){if(h)o[h]=r[i];});
      if(sbmLooksLikeBrokenHistoryObject_(o)){
        removed.push({reason:'列ずれ・形式不正',object:o});
      }else{
        current.push(o);
      }
    });
  }

  var articles=sbmRowsAsObjects_(SBM_SHEETS.ARTICLE_DB)||[], byArticleId={}, byUrl={};
  articles.forEach(function(a){
    var aid=String(a['ArticleID']||'').trim(), au=sbmNormalizeUrl_(a['記事URL']||'');
    if(aid) byArticleId[aid]=a;
    if(au) byUrl[au]=a;
  });

  function enrichHistory(o){
    var article=byArticleId[String(o['ArticleID']||'').trim()] || byUrl[sbmNormalizeUrl_(o['記事URL']||'')] || {};
    var nv=sbmHistoryJsonNewValues_(o);
    if(!String(o['記事タイトル']||'').trim() || String(o['記事タイトル']||'').trim().length<=3)
      o['記事タイトル']=nv.article_title||article['記事タイトル']||article['SEOタイトル']||o['記事タイトル']||'';
    if(!String(o['記事URL']||'').trim()) o['記事URL']=article['記事URL']||'';
    if(!String(o['ArticleID']||'').trim()) o['ArticleID']=article['ArticleID']||'';
    if(!String(o['メインクエリ']||'').trim()) o['メインクエリ']=nv.main_query||article['メインクエリ']||'';
    if(!String(o['変更後タイトル']||'').trim()) o['変更後タイトル']=nv.article_title||'';
    if(!String(o['変更後SEOタイトル']||'').trim()) o['変更後SEOタイトル']=nv.seo_title||'';
    if(!String(o['変更後メタディスクリプション']||'').trim()) o['変更後メタディスクリプション']=nv.description||'';
    return o;
  }

  current=current.map(enrichHistory);
  var legacy=sbmLegacyHistoryObjects_().map(enrichHistory);

  // Product 5.2.10: 記事DBと照合できず、改善内容も持たない短いタイトル行は孤立データとして除外します。
  function isOrphanAfterEnrich(o){
    var aid=String(o['ArticleID']||'').trim();
    var url=sbmNormalizeUrl_(o['記事URL']||'');
    var articleMatched=!!(aid&&byArticleId[aid]) || !!(url&&byUrl[url]);
    var title=String(o['記事タイトル']||'').trim();
    var summary=String(o['改善概要']||'').trim();
    var changed=String(o['変更箇所']||'').trim();
    var rawJson=String(o['AI改善結果JSON']||'').trim();
    var planJson=String(o['改善計画JSON']||'').trim();
    return !articleMatched && title.length<=3 && !summary && !changed && !rawJson && !planJson;
  }

  current=current.filter(function(o){
    if(isOrphanAfterEnrich(o)){
      removed.push({reason:'記事照合不能の孤立行',object:o});
      return false;
    }
    return true;
  });
  legacy=legacy.filter(function(o){
    if(isOrphanAfterEnrich(o)){
      removed.push({reason:'旧ログ由来の孤立行',object:o});
      return false;
    }
    return true;
  });

  var candidates=current.concat(legacy), byHistoryId={}, withoutHistoryId=[];

  candidates.forEach(function(o){
    if(sbmIsUnrecoverableHistoryObject_(o)){
      removed.push({reason:'識別情報がなく復元不能',object:o});
      return;
    }
    var hid=String(o['改善履歴ID']||'').trim();
    if(!hid){
      withoutHistoryId.push(o);
      return;
    }
    if(!byHistoryId[hid]){
      byHistoryId[hid]=o;
    }else{
      var oldScore=sbmHistoryCompletenessScore_(byHistoryId[hid]);
      var newScore=sbmHistoryCompletenessScore_(o);
      if(newScore>oldScore){
        removed.push({reason:'改善履歴ID重複（情報量の少ない行）',object:byHistoryId[hid]});
        byHistoryId[hid]=o;
      }else{
        removed.push({reason:'改善履歴ID重複（情報量の少ない行）',object:o});
      }
    }
  });

  var merged=Object.keys(byHistoryId).map(function(k){return byHistoryId[k];}).concat(withoutHistoryId);
  var seen={};
  merged=merged.filter(function(o){
    var k=sbmHistoryKey_(o);
    if(seen[k]){
      removed.push({reason:'同一履歴の重複',object:o});
      return false;
    }
    seen[k]=true;
    return true;
  });

  var articleCounts={};
  merged.forEach(function(o){
    var aid=String(o['ArticleID']||'').trim();
    if(aid) articleCounts[aid]=(articleCounts[aid]||0)+1;
    var measured=0; for(var wi=1;wi<=4;wi++){if(o[wi+'回目測定日時'])measured=wi;}
    if(!o['状態'])o['状態']=measured>=4?'完了':measured>0?'測定中':'測定待ち';
    if(!o['最終判定'])o['最終判定']=measured>=4?(o['4週']||'完了'):(measured>0?'測定中':'測定待ち');
    for(var wj=1;wj<=4;wj++){if(!o[wj+'週'])o[wj+'週']='未測定';}
  });

  Object.keys(articleCounts).forEach(function(aid){
    if(articleCounts[aid]>1){
      sbmLog_('HistoryIntegrityArticleRepeat','Info','ArticleID '+aid+' has '+articleCounts[aid]+' history records.');
    }
  });

  var aliases={'改善日':['改善日','登録日時'],'1週':['1週','1回目判定'],'2週':['2週','2回目判定'],'3週':['3週','3回目判定'],'4週':['4週','4回目判定'],'1回目測定日時':['1回目測定日時'],'最終判定':['最終判定','最新判定','効果判定'],'記事URL':['記事URL','URL'],'改善概要':['改善概要','改善内容'],'変更箇所':['変更箇所','修正内容']};
  var rows=merged.map(function(o){return headers.map(function(h){var names=aliases[h]||[h];for(var i=0;i<names.length;i++){if(o[names[i]]!==undefined)return o[names[i]];}return h==='選択'?false:'';});});

  if(removed.length){
    try{sbmBackupRemovedHistoryRows_(removed);}catch(e){sbmLog_('HistoryCleanupBackup','Warning',String(e));}
  }

  sh.clear();
  if(sh.getMaxColumns()<headers.length) sh.insertColumnsAfter(sh.getMaxColumns(),headers.length-sh.getMaxColumns());
  sh.getRange(1,1,1,headers.length).setValues([headers]);
  if(rows.length) sh.getRange(2,1,rows.length,headers.length).setValues(rows);
  sbmStyleHistorySheetV2_();

  sbmLog_('HistoryIntegrityCleanup','Done','kept='+rows.length+', removed='+removed.length);
  return {kept:rows.length,removed:removed.length};
}


/* ========================================================================== *
 * Product 5.0 RC11 History Detail Readability Fix
 * - 変更後データをAI改善結果JSONから補完
 * - 欠損値は「ー」表示
 * - 改善前指標を項目別カード＋適切な数値書式で表示
 * - 改善履歴一覧のタイトル・概要を折り返し表示
 * ========================================================================== */

/**
 * RC11 Japanese date/time display and common dialog close button.
 * Date example: 2026年7月25日（土）朝9:00
 */
function sbmJapaneseDateTimeText_(value) {
  if (value === null || value === undefined || String(value).trim() === '') return 'ー';

  var isDateObject = Object.prototype.toString.call(value) === '[object Date]';
  var raw = String(value).trim();
  var hasTime = isDateObject ||
    /T\d{1,2}:\d{2}/.test(raw) ||
    /\d{1,2}:\d{2}/.test(raw) ||
    /GMT[+-]\d{4}/.test(raw);

  var d = isDateObject ? value : new Date(raw);
  if (!(d instanceof Date) || isNaN(d.getTime())) return raw;

  var tz = (typeof SBM_DEFAULTS !== 'undefined' && SBM_DEFAULTS.TIMEZONE)
    ? SBM_DEFAULTS.TIMEZONE
    : (Session.getScriptTimeZone() || 'Asia/Tokyo');

  var y = Utilities.formatDate(d, tz, 'yyyy');
  var m = Number(Utilities.formatDate(d, tz, 'M'));
  var day = Number(Utilities.formatDate(d, tz, 'd'));
  var weekdayIndex = Number(Utilities.formatDate(d, tz, 'u')) - 1;
  var weekdays = ['月','火','水','木','金','土','日'];
  var dateText = y + '年' + m + '月' + day + '日（' + weekdays[weekdayIndex] + '）';

  if (!hasTime) return dateText;

  var hour = Number(Utilities.formatDate(d, tz, 'H'));
  var minute = Utilities.formatDate(d, tz, 'mm');
  var label;
  if (hour >= 5 && hour <= 10) {
    label = '朝' + hour + ':' + minute;
  } else if (hour >= 11 && hour < 12) {
    label = '午前' + hour + ':' + minute;
  } else if (hour >= 12 && hour <= 17) {
    label = '午後' + (hour === 12 ? 12 : hour - 12) + ':' + minute;
  } else if (hour >= 18 && hour <= 23) {
    label = '夜' + (hour - 12) + ':' + minute;
  } else {
    label = '深夜' + hour + ':' + minute;
  }
  return dateText + label;
}

function sbmLooksLikeDateValue_(v) {
  if (Object.prototype.toString.call(v) === '[object Date]') return true;
  if (v === null || v === undefined) return false;
  var s = String(v).trim();
  return /^(?:[A-Z][a-z]{2}\s[A-Z][a-z]{2}\s\d{1,2}\s\d{4}.*GMT|20\d{2}[-\/]\d{1,2}[-\/]\d{1,2}(?:[ T]\d{1,2}:\d{2}(?::\d{2})?)?)/.test(s);
}

function sbmDisplayValueJa_(v) {
  if (v === null || v === undefined || String(v).trim() === '') return 'ー';
  return sbmLooksLikeDateValue_(v) ? sbmJapaneseDateTimeText_(v) : String(v);
}

function sbmEnsureCloseButton_(output) {
  var htmlOutput = output;
  if (typeof output === 'string') htmlOutput = HtmlService.createHtmlOutput(output);
  if (!htmlOutput || typeof htmlOutput.getContent !== 'function') return output;

  var content = htmlOutput.getContent();
  if (content.indexOf('data-sbm-common-close') !== -1) return htmlOutput;

  var footer = '<div data-sbm-common-close="1" style="display:flex;justify-content:flex-end;gap:10px;margin:22px 0 4px;padding-top:14px;border-top:1px solid #e5e7eb">'
    + '<button type="button" onclick="google.script.host.close()" style="border:1px solid #9aa0a6;background:#fff;color:#3c4043;padding:9px 18px;border-radius:6px;font-weight:700;cursor:pointer">閉じる</button>'
    + '</div>';

  if (/<\/body>/i.test(content)) {
    content = content.replace(/<\/body>/i, footer + '</body>');
  } else if (/<\/div>\s*$/i.test(content)) {
    content = content.replace(/<\/div>\s*$/i, footer + '</div>');
  } else {
    content += footer;
  }
  return HtmlService.createHtmlOutput(content)
    .setWidth(typeof htmlOutput.getWidth === 'function' ? htmlOutput.getWidth() : 600)
    .setHeight(typeof htmlOutput.getHeight === 'function' ? htmlOutput.getHeight() : 500);
}

function sbmHistoryDisplayValue_(v) {
  return sbmDisplayValueJa_(v);
}
function sbmHistoryDateOnlyText_(v) {
  if (v === null || v === undefined || String(v).trim() === '') return 'ー';
  var d = sbmParseDate_(v);
  if (!d) return String(v);
  return Utilities.formatDate(d, SBM_DEFAULTS.TIMEZONE, 'yyyy/M/d');
}
function sbmHistoryNumberText_(v) {
  var n = Number(String(v === null || v === undefined ? '' : v).replace(/,/g,''));
  if (!isFinite(n)) return 'ー';
  return Math.round(n).toLocaleString('ja-JP');
}
function sbmHistoryDecimalText_(v) {
  var n = Number(String(v === null || v === undefined ? '' : v).replace(/,/g,''));
  if (!isFinite(n)) return 'ー';
  return n.toFixed(1);
}
function sbmHistoryPercentText_(v) {
  if (v === null || v === undefined || String(v).trim() === '') return 'ー';
  var n;
  try { n = sbmNormalizeCtrNumber_(v); } catch (e) { n = Number(String(v).replace('%','').replace(/,/g,'')); if (isFinite(n) && n > 1) n /= 100; }
  if (!isFinite(n)) return 'ー';
  return (n * 100).toFixed(1) + '%';
}
function sbmHistoryJsonNewValues_(o) {
  var out = {article_title:'', seo_title:'', description:'', main_query:''};
  var raw = o && o['AI改善結果JSON'];
  if (!raw) return out;
  try {
    var obj = typeof raw === 'string' ? JSON.parse(raw) : raw;
    var nv = obj.new_values || obj.new_data || {};
    out.article_title = nv.article_title || nv.title || '';
    out.seo_title = nv.seo_title || '';
    out.description = nv.description || '';
    out.main_query = nv.main_query || obj.main_query || '';
  } catch (e) {}
  return out;
}

function sbmOpenEffectFromHistoryId(historyId) {
  historyId = String(historyId || '').trim();
  if (!historyId) {
    sbmAlert_('改善の推移', '対応する改善の推移データはありません。');
    return;
  }
  try { sbmUpdateEffectivenessCore_(false); } catch(e) {}
  var rows = sbmRowsAsObjects_(SBM_SHEETS.EFFECT) || [];
  var found = null;
  for (var i=0; i<rows.length; i++) {
    if (String(rows[i]['改善履歴ID'] || '').trim() === historyId) { found = rows[i]; break; }
  }
  if (!found) {
    sbmAlert_('改善の推移', '対応する改善の推移データはありません。');
    return;
  }
  var html = HtmlService.createHtmlOutput(sbmEffectDetailHtmlV2_(found)).setWidth(820).setHeight(700);
  SpreadsheetApp.getUi().showModalDialog(sbmEnsureCloseButton_(html), '改善の推移の詳細');
}

function sbmHistoryEffectButtonHtml_(historyId) {
  historyId = String(historyId || '').trim();
  if (!historyId) return '<button type="button" onclick="google.script.run.sbmOpenEffectFromHistoryId(\'\')" style="border:0;background:#1a73e8;color:#fff;padding:9px 16px;border-radius:6px;font-weight:700;cursor:pointer">改善の推移の詳細を開く</button>';
  var safe = historyId.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
  return '<button type="button" onclick="google.script.host.close();google.script.run.sbmOpenEffectFromHistoryId(\''+safe+'\')" style="border:0;background:#1a73e8;color:#fff;padding:9px 16px;border-radius:6px;font-weight:700;cursor:pointer">改善の推移の詳細を開く</button>';
}

function sbmStyleHistorySheetV2_(){
  var sh=sbmGetOrCreateSheet_(SBM_SHEETS.FEEDBACK_HISTORY); sbmEnsureHistoryAndEffectSchemasIfEmpty_(sh,SBM_HISTORY_HEADERS_V2);
  sh.showSheet(); sh.setFrozenRows(1);
  sh.getRange(1,1,1,SBM_HISTORY_HEADERS_V2.length).setBackground('#0b8043').setFontColor('#fff').setFontWeight('bold').setWrap(false).setVerticalAlignment('middle');
  var widths=[60,105,330,430,90,115,100]; widths.forEach(function(w,i){sh.setColumnWidth(i+1,w);});
  if(sh.getMaxColumns()>=8){try{sh.hideColumns(8,sh.getMaxColumns()-7);}catch(e){}}
  if(sh.getLastRow()>1){
    var n=sh.getLastRow()-1;
    sh.getRange(2,1,n,7).setVerticalAlignment('top');
    sh.getRange(2,3,n,2).setWrap(true); // 記事タイトル・改善概要
    sh.getRange(2,1,n,2).setWrap(false);
    sh.autoResizeRows(2,n);
  }
}

/**
 * Product 5.0 RC11: Detail popup naming and metric formatting fix
 * - 効果測定の詳細 -> 改善の推移の詳細
 * - 数値は小数第1位、CTRはパーセント表示
 * - 記事DB詳細 -> 選択記事の詳細
 * - 記事詳細から改善ナビへ遷移
 */
function sbmDetailDash_(v) {
  return sbmDisplayValueJa_(v);
}

function sbmDetailNumber1_(v) {
  if (v === null || v === undefined || String(v).trim() === '') return 'ー';
  var n = Number(String(v).replace(/,/g, '').replace('%', '').trim());
  return isNaN(n) ? 'ー' : n.toLocaleString('ja-JP', {minimumFractionDigits:1, maximumFractionDigits:1});
}

function sbmDetailCtr1_(v) {
  if (v === null || v === undefined || String(v).trim() === '') return 'ー';
  var n = Number(String(v).replace(/,/g, '').replace('%', '').trim());
  if (isNaN(n)) return 'ー';
  if (n <= 1) n = n * 100;
  return n.toFixed(1) + '%';
}

function sbmFormatEffectDateLabel_(value) {
  var d = sbmParseDate_(value);
  if (!d) return '日付不明';
  return Utilities.formatDate(d, SBM_DEFAULTS.TIMEZONE, 'yyyy/M/d');
}

function sbmEffectDetailHtmlV2_(o) {
  var e = sbmEscapeHtml_;
  function cell(v) { return e(sbmDisplayValueJa_(v)); }
  function num(v) { return e(sbmDetailNumber1_(v)); }
  function ctr(v) { return e(sbmDetailCtr1_(v)); }
  function tr(label, before, current, delta, kind) {
    var f = kind === 'ctr' ? ctr : num;
    return '<tr>'
      + '<td style="border:1px solid #ddd;padding:8px;font-weight:700">' + e(label) + '</td>'
      + '<td style="border:1px solid #ddd;padding:8px;text-align:right">' + f(before) + '</td>'
      + '<td style="border:1px solid #ddd;padding:8px;text-align:right">' + f(current) + '</td>'
      + '<td style="border:1px solid #ddd;padding:8px;text-align:right">' + f(delta) + '</td>'
      + '</tr>';
  }
  var historyRows=sbmRowsAsObjects_(SBM_SHEETS.FEEDBACK_HISTORY)||[];
  var history=historyRows.filter(function(h){return String(h['改善履歴ID']||'')===String(o['改善履歴ID']||'');})[0]||{};
  var weeklyHtml=sbmWeeklyHistoryHtml_(history);
  var beforeDate = sbmFormatEffectDateLabel_(o['改善日']);
  var currentDate = sbmFormatEffectDateLabel_(o['最終更新'] || o['更新日時'] || new Date());
  return '<div style="font-family:Arial,Noto Sans JP,sans-serif;padding:20px;line-height:1.65;color:#202124">'
    + '<h2 style="margin-top:0;color:#0b8043">改善の推移の詳細</h2>'
    + '<h3>' + cell(o['記事タイトル']) + '</h3>'
    + '<p><b>判定：</b>' + cell(o['判定'])
    + '　<b>経過日数：</b>' + num(o['経過日数']) + '日'
    + '　<b>測定回数：</b>' + cell(o['測定回数']) + '　<b>次回予定：</b>' + cell(o['次回測定予定日']) + '</p>'
    + '<h3>改善内容</h3><p>' + cell(o['改善概要']) + '</p><p><b>変更：</b>' + cell(o['変更箇所']) + '</p>'
    + '<h3>改善前・現在の比較</h3>'
    + '<table style="border-collapse:collapse;width:100%">'
    + '<tr><th style="border:1px solid #ddd;padding:8px">指標</th><th style="border:1px solid #ddd;padding:8px">改善前（' + beforeDate + '）</th><th style="border:1px solid #ddd;padding:8px">現在（' + currentDate + '）</th><th style="border:1px solid #ddd;padding:8px">変化</th></tr>'
    + tr('クリック数', o['改善前クリック'], o['現在クリック'], o['クリック変化'], 'num')
    + tr('表示回数', o['改善前表示回数'], o['現在表示回数'], o['表示回数変化'], 'num')
    + tr('CTR', o['改善前CTR'], o['現在CTR'], o['CTR変化'], 'ctr')
    + tr('掲載順位', o['改善前順位'], o['現在順位'], o['順位変化'], 'num')
    + '</table>'
    + '<h3>4週間の測定履歴</h3>' + weeklyHtml
    + '<h3>SIMS評価</h3><p>' + cell(o['SIMS評価']) + '</p>'
    + '<h3>次のアクション</h3><p>' + cell(o['次のアクション']) + '</p><p>' + cell(o['測定コメント']) + '</p>'
    + '</div>';
}

function sbmShowSelectedEffectDetail() {
  var sh = SpreadsheetApp.getActiveSheet();
  if (!sh || sh.getName() !== SBM_SHEETS.EFFECT) return sbmAlert_('改善の推移', '改善の推移シートで対象行を選択してください。');
  var row = (typeof sbmGetCheckedRow_ === 'function') ? sbmGetCheckedRow_(sh) : sh.getActiveRange().getRow();
  if (!row || row <= 1) return;
  var o = sbmRowRecord_(sh, row);
  SpreadsheetApp.getUi().showModalDialog(sbmEnsureCloseButton_(HtmlService.createHtmlOutput(sbmEffectDetailHtmlV2_(o)).setWidth(820).setHeight(700)),
    '改善の推移の詳細'
  );
}

function sbmOpenImprovementNaviFromArticleDetail(articleUrl) {
  var url = String(articleUrl || '').trim();
  if (!url) return sbmAlert_('改善ナビ', '記事URLを取得できません。');
  var article = sbmFindArticleDbByUrl_(url);
  if (!article) return sbmAlert_('改善ナビ', '記事管理から対象記事を確認できません。');
  sbmShowImprovementNaviDialog_(article, '記事管理から選択', '選択記事の改善方針を確認します。');
}

function sbmShowArticleDbDetailForRow_(sh, row) {
  var hm = sbmHeaderMap_(sh);
  function raw(name) { return hm[name] ? sh.getRange(row, hm[name]).getValue() : ''; }
  function display(name) { return hm[name] ? sh.getRange(row, hm[name]).getDisplayValue() : ''; }
  var obj = {};
  SBM_HEADERS.ARTICLE_DB.forEach(function(h) { obj[h] = raw(h); });
  obj['クリック数表示'] = display('クリック数');
  obj['表示回数表示'] = display('表示回数');
  obj['CTR表示'] = display('CTR');
  obj['掲載順位表示'] = display('掲載順位');
  var html = HtmlService.createHtmlOutput(sbmArticleDbDetailHtml_(obj)).setWidth(780).setHeight(720);
  SpreadsheetApp.getUi().showModalDialog(sbmEnsureCloseButton_(html), '選択記事の詳細');
}



/* ========================================================================== *
 * Product 5.0 RC11: Improvement Plan / Result / Effect Unified History Detail
 * ========================================================================== */

function sbmBuildImprovementPlanSnapshot_(articleUrl, articleId) {
  var url = sbmNormalizeUrl_(articleUrl || '');
  var candidates = [];
  try { candidates = JSON.parse(String(sbmGetSetting_('TodayRecommendationJson','[]')) || '[]'); } catch(e) { candidates = []; }
  var c = null;
  for (var i=0; i<candidates.length; i++) {
    if (sbmNormalizeUrl_(candidates[i].url || '') === url) { c = candidates[i]; break; }
  }

  var article = null;
  try { article = sbmFindArticleDbByIdentity_(articleId || '', articleUrl || ''); } catch(e) {}
  article = article || {};

  var kind = c ? String(c.kind || '改善候補') : '記事管理から選択';
  var reason = c ? String(c.reason || '') : '';
  var estimate = c ? String(c.estimate || '') : '';
  var query = String((c && c.query) || article['メインクエリ'] || '');
  var expectedClicks = c ? Number(c.expectedClicks || 0) : 0;
  var priorities = kind.indexOf('CTR') >= 0
    ? ['P0：SEOタイトルを検索意図に合わせる','P1：導入文で結論と対象読者を明確にする','P2：検索クエリに対応するFAQを追加する']
    : ['P0：タイトル・見出しを主検索意図に合わせる','P1：導入文を短くし、結論を先に提示する','P2：不足する説明を1～2項目追加する'];

  if (!reason && article && article['記事URL']) {
    var imps = sbmNumber_(article['表示回数']) || 0;
    var ctr = sbmNormalizeCtrNumber_(article['CTR']);
    var pos = sbmNumber_(article['掲載順位']) || 0;
    var target = sbmExpectedCtrTarget_(pos);
    expectedClicks = Math.max(0, Math.round(imps * Math.max(0, target - ctr)));
    reason = '保存済みのSearch Console指標から改善余地を確認しました。'
      + ' 順位' + pos.toFixed(1) + '位、CTR' + (ctr * 100).toFixed(1) + '%。'
      + (expectedClicks > 0 ? '目安CTRまで改善すると約' + expectedClicks + 'クリック増が期待できます。' : '');
    estimate = '約20分';
  }

  return {
    version: '1.0',
    source: c ? '今日の改善' : '記事管理',
    category: kind || 'ー',
    reason: reason || '',
    expected_effect: expectedClicks > 0 ? ('約' + expectedClicks + 'クリック増') : '',
    priorities: priorities,
    main_query: query,
    estimated_time: estimate || '',
    ai_request_summary: '記事URL・ArticleID・現在のSearch Console指標・改善優先項目をAIへ渡し、完成記事とSIMS_FEEDBACK_V2以降の出力を依頼。'
  };
}

function sbmParseJsonObjectSafe_(raw) {
  if (!raw) return {};
  try { return typeof raw === 'string' ? JSON.parse(raw) : raw; } catch(e) { return {}; }
}

function sbmFindEffectByHistoryId_(historyId, refreshFirst) {
  historyId = String(historyId || '').trim();
  if (!historyId) return null;
  if (refreshFirst !== false) {
    try { sbmUpdateEffectivenessCore_(false); } catch(e) {}
  }
  var rows = sbmRowsAsObjects_(SBM_SHEETS.EFFECT) || [];
  for (var i=0; i<rows.length; i++) {
    if (String(rows[i]['改善履歴ID'] || '').trim() === historyId) return rows[i];
  }
  return null;
}

function sbmUnifiedHistorySectionEmpty_(message) {
  return '<div class="empty">' + sbmEscapeHtml_(message || '対応するデータはありません。') + '</div>';
}

function sbmUnifiedHistoryMetricCard_(name, before, current, formatter) {
  formatter = formatter || sbmHistoryDecimalText_;
  return '<div class="metric">'
    + '<div class="name">' + sbmEscapeHtml_(name) + '</div>'
    + '<div class="pair"><span>改善前</span><b>' + sbmEscapeHtml_(formatter(before)) + '</b></div>'
    + '<div class="pair"><span>現在</span><b>' + sbmEscapeHtml_(formatter(current)) + '</b></div>'
    + '</div>';
}

function sbmWeeklyPlannedDate_(o, week) {
  var base = sbmParseDate_(o && o['改善日']);
  if (!base) return null;
  var due = new Date(base.getTime());
  due.setDate(due.getDate() + (Number(week) * 7));
  return due;
}

function sbmWeeklyHistoryHtml_(o) {
  o = o || {};
  var e = sbmEscapeHtml_, html = '';
  for (var i = 1; i <= 4; i++) {
    var dt = o[i + '回目測定日時'];
    var judge = String(o[i + '週'] || '').trim();
    var comment = String(o[i + '回目SIMS寸評'] || '').trim();
    var measured = !!judge && judge !== '未測定' && judge !== '未判定';
    var planned = sbmWeeklyPlannedDate_(o, i);
    var plannedText = planned ? Utilities.formatDate(planned, SBM_DEFAULTS.TIMEZONE, 'yyyy/M/d') : '日付不明';
    var statusHtml;
    if (measured) {
      statusHtml = '<div class="field"><span class="label">測定日時：</span>' + e(sbmHistoryDateOnlyText_(dt)) + '</div>'
        + '<div class="field"><span class="label">判定：</span>' + e(judge) + '</div>'
        + '<div class="field"><span class="label">SIMS寸評</span><div class="box">' + e(comment || '測定結果を記録しました。') + '</div></div>';
    } else {
      statusHtml = '<div class="field"><span class="label">状態：</span>未測定</div>'
        + '<div class="field"><span class="label">測定予定：</span>' + e(plannedText) + '</div>';
    }
    html += '<div class="week-card"><div class="week-title">' + i + '週目</div>' + statusHtml + '</div>';
  }
  return html;
}

function sbmFinalEvaluationHtml_(o) {
  o = o || {};
  var e = sbmEscapeHtml_;
  if (String(o['状態'] || '') === '完了') {
    return '<div class="box"><b>最終判定：' + e(sbmHistoryDisplayValue_(o['最終判定'])) + '</b><br>'
      + e(sbmHistoryDisplayValue_(o['最終総括'])) + '</div>'
      + '<div class="box"><b>次の改善提案</b><br>' + e(sbmHistoryDisplayValue_(o['最終改善提案'])) + '</div>';
  }
  return '<div class="empty">4週目の測定完了後に、最終判定・SIMS総括・次の改善提案を表示します。</div>';
}

function sbmHistoryDetailHtmlV2_(o) {
  o = o || {};
  var e = sbmEscapeHtml_;
  var nv = sbmHistoryJsonNewValues_(o);
  var plan = sbmParseJsonObjectSafe_(o['改善計画JSON']);
  var effect = sbmFindEffectByHistoryId_(o['改善履歴ID'], true);
  var articleTitle = sbmHistoryDisplayValue_(o['変更後タイトル'] || nv.article_title);
  var seoTitle = sbmHistoryDisplayValue_(o['変更後SEOタイトル'] || nv.seo_title);
  var description = sbmHistoryDisplayValue_(o['変更後メタディスクリプション'] || nv.description);
  var mainQuery = sbmHistoryDisplayValue_(o['メインクエリ'] || nv.main_query);

  var css = '<style>'
    + 'body{font-family:Arial,"Noto Sans JP",sans-serif;padding:20px;line-height:1.65;color:#202124}'
    + 'h2{margin:0 0 8px;color:#0b8043}h3{margin:22px 0 8px}'
    + '.meta{background:#f8f9fa;border-radius:8px;padding:12px}'
    + '.section{border:1px solid #dadce0;border-radius:10px;padding:16px;margin:16px 0}'
    + '.section h3{margin-top:0;color:#174ea6}.field{margin:8px 0}.label{font-weight:700}'
    + '.box{border:1px solid #dadce0;border-radius:8px;padding:12px;margin:8px 0;white-space:pre-wrap;overflow-wrap:anywhere;background:#fff}'
    + '.subsection{border-top:1px solid #e0e0e0;margin-top:18px;padding-top:6px}.subsection h4{color:#174ea6;font-size:16px;margin:14px 0 8px}'
    + '.week-card{border:1px solid #dadce0;border-radius:9px;padding:13px;margin:10px 0;background:#fff}.week-title{font-size:16px;font-weight:700;color:#0b8043;margin-bottom:6px}'
    + '.empty{background:#f8f9fa;border:1px dashed #bdc1c6;border-radius:8px;padding:16px;color:#5f6368}'
    + '.metrics{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}'
    + '.metric{border:1px solid #dadce0;border-radius:8px;padding:12px;background:#fff}.metric .name{font-weight:700;margin-bottom:8px}'
    + '.pair{display:flex;justify-content:space-between;padding:3px 0}.pair span{color:#5f6368}'
    + '@media(max-width:620px){.metrics{grid-template-columns:1fr}}'
    + '</style>';

  var planHtml;
  if (plan && (plan.reason || plan.category || (plan.priorities && plan.priorities.length))) {
    var priorities = Array.isArray(plan.priorities) && plan.priorities.length
      ? plan.priorities.map(function(x){ return '<div class="box">'+e(x)+'</div>'; }).join('')
      : 'ー';
    planHtml = '<div class="field"><span class="label">区分：</span>'+e(sbmHistoryDisplayValue_(plan.category))+'</div>'
      + '<div class="field"><span class="label">メインクエリ：</span>'+e(sbmHistoryDisplayValue_(plan.main_query))+'</div>'
      + '<div class="field"><span class="label">選定理由・期待効果</span><div class="box">'+e(sbmHistoryDisplayValue_(plan.reason))+'</div></div>'
      + '<div class="field"><span class="label">改善優先項目</span>'+priorities+'</div>'
      + '<div class="field"><span class="label">作業時間の目安：</span>'+e(sbmHistoryDisplayValue_(plan.estimated_time))+'</div>'
      + '<div class="field"><span class="label">AI依頼概要</span><div class="box">'+e(sbmHistoryDisplayValue_(plan.ai_request_summary))+'</div></div>';
  } else {
    planHtml = sbmUnifiedHistorySectionEmpty_('対応する改善計画データはありません。旧バージョンの改善履歴では改善ナビの内容を保存していません。');
  }

  var resultHtml = '<div class="field"><span class="label">使用AI：</span>'+e(sbmHistoryDisplayValue_(o['使用AI']))+'</div>'
    + '<div class="field"><span class="label">Feedback Format：</span>'+e(sbmHistoryDisplayValue_(o['Feedback Format']))
    + '　<span class="label">Writer Version：</span>'+e(sbmHistoryDisplayValue_(o['Writer Version']))+'</div>'
    + '<div class="field"><span class="label">変更箇所：</span>'+e(sbmHistoryDisplayValue_(o['変更箇所']))+'</div>'
    + '<div class="field"><span class="label">改善規模：</span>'+e(sbmHistoryDisplayValue_(o['改善規模']))
    + '　<span class="label">確信度：</span>'+e(sbmHistoryDisplayValue_(o['確信度']))
    + '　<span class="label">作業時間：</span>'+e(sbmHistoryDisplayValue_(o['作業時間（分）']))+(sbmHistoryDisplayValue_(o['作業時間（分）'])==='ー'?'':'分')+'</div>'
    + '<div class="field"><span class="label">改善概要</span><div class="box">'+e(sbmHistoryDisplayValue_(o['改善概要']))+'</div></div>'
    + '<div class="field"><span class="label">記事タイトル</span><div class="box">'+e(articleTitle)+'</div></div>'
    + '<div class="field"><span class="label">SEOタイトル</span><div class="box">'+e(seoTitle)+'</div></div>'
    + '<div class="field"><span class="label">メタディスクリプション</span><div class="box">'+e(description)+'</div></div>'
    + '<div class="field"><span class="label">メインクエリ</span><div class="box">'+e(mainQuery)+'</div></div>'
    + '<div class="field"><span class="label">注意事項</span><div class="box">'+e(sbmHistoryDisplayValue_(o['注意事項']))+'</div></div>';

  var weeklyHtml = sbmWeeklyHistoryHtml_(o);
  var finalHtml = sbmFinalEvaluationHtml_(o);
  var comparisonHtml;
  if (effect) {
    comparisonHtml = '<div class="field"><span class="label">現在の判定：</span>'+e(sbmHistoryDisplayValue_(effect['判定']))
      + '　<span class="label">測定回数：</span>'+e(sbmHistoryDisplayValue_(effect['測定回数']))
      + '　<span class="label">次回予定：</span>'+e(sbmHistoryDisplayValue_(effect['次回測定予定日']))
      + '　<span class="label">経過日数：</span>'+e(sbmHistoryDecimalText_(effect['経過日数']))+'日</div>'
      + '<div class="metrics">'
      + sbmUnifiedHistoryMetricCard_('クリック数', effect['改善前クリック'], effect['現在クリック'], sbmHistoryNumberText_)
      + sbmUnifiedHistoryMetricCard_('表示回数', effect['改善前表示回数'], effect['現在表示回数'], sbmHistoryNumberText_)
      + sbmUnifiedHistoryMetricCard_('CTR', effect['改善前CTR'], effect['現在CTR'], sbmHistoryPercentText_)
      + sbmUnifiedHistoryMetricCard_('掲載順位', effect['改善前順位'], effect['現在順位'], sbmHistoryDecimalText_)
      + '</div>'
      + '<div class="field"><span class="label">現在までの観察</span><div class="box">'+e(sbmHistoryDisplayValue_(effect['測定コメント'] || effect['SIMS評価']))+'</div></div>';
  } else {
    comparisonHtml = sbmUnifiedHistorySectionEmpty_('現在の比較データはまだ作成されていません。改善の推移の「更新」を実行すると表示されます。');
  }
  var effectHtml = '<div class="subsection"><h4>3-1. 改善前と現在の比較</h4>'+comparisonHtml+'</div>'
    + '<div class="subsection"><h4>3-2. 4週間の効果測定</h4>'+weeklyHtml+'</div>'
    + '<div class="subsection"><h4>3-3. 最終判定</h4>'+finalHtml+'</div>';

  return '<!doctype html><html><head><base target="_top">'+css+'</head><body>'
    + '<h2>改善履歴の詳細</h2><h3>'+e(sbmHistoryDisplayValue_(o['記事タイトル']))+'</h3>'
    + '<div class="meta"><div class="field"><span class="label">改善履歴ID：</span>'+e(sbmHistoryDisplayValue_(o['改善履歴ID']))+'</div>'
    + '<div class="field"><span class="label">改善日：</span>'+e(sbmHistoryDateOnlyText_(o['改善日']))+'</div></div>'
    + '<div class="section"><h3>1. 改善計画</h3>'+planHtml+'</div>'
    + '<div class="section"><h3>2. 実施した改善</h3>'+resultHtml+'</div>'
    + '<div class="section"><h3>3. 改善の推移</h3>'+effectHtml+'</div>'
    + '<div style="display:flex;justify-content:flex-end;margin-top:18px"><button type="button" onclick="google.script.host.close()" style="border:1px solid #9aa0a6;background:#fff;color:#3c4043;padding:9px 18px;border-radius:6px;font-weight:700;cursor:pointer">閉じる</button></div>'
    + '</body></html>';
}

function sbmOpenSelectedHistoryDetail() {
  var sh = SpreadsheetApp.getActiveSheet();
  if (!sh || sh.getName() !== SBM_SHEETS.FEEDBACK_HISTORY) return sbmAlert_('改善履歴','改善履歴を開いてください。');
  var row = sbmGetCheckedRow_(sh);
  if (!row) return;
  var o = sbmRowRecord_(sh,row);
  var html = HtmlService.createHtmlOutput(sbmHistoryDetailHtmlV2_(o)).setWidth(860).setHeight(760);
  SpreadsheetApp.getUi().showModalDialog(html,'改善履歴の詳細');
}


/* ========================================================================== *
 * Product 5.0 RC11: Today checkbox / Article header / History repair refresh
 * ========================================================================== */

/**
 * 一覧シートで実データが入っている最終行を返します。
 * 書式や案内文だけがある行にはチェックボックスを置きません。
 */
function sbmSelectionDataLastRow_(sh) {
  if (!sh || sh.getLastRow() < 2) return 1;
  var hm = sbmHeaderMap_(sh);
  var keyHeader = '';
  if (sh.getName() === SBM_SHEETS.TODAY) keyHeader = hm['記事URL'] ? '記事URL' : '記事タイトル';
  else if (sh.getName() === SBM_SHEETS.EFFECT) keyHeader = '記事タイトル';
  else if (sh.getName() === SBM_SHEETS.ARTICLE_DB) keyHeader = '記事URL';
  else if (sh.getName() === SBM_SHEETS.FEEDBACK_HISTORY) keyHeader = hm['改善日'] ? '改善日' : '記事タイトル';

  var keyCol = hm[keyHeader] || 0;
  if (!keyCol) return sh.getLastRow();

  var n = sh.getLastRow() - 1;
  var vals = sh.getRange(2, keyCol, n, 1).getDisplayValues();
  var last = 1;
  for (var i = 0; i < vals.length; i++) {
    if (String(vals[i][0] || '').trim() !== '') last = i + 2;
  }
  return last;
}

/**
 * 選択チェックボックスは実データ行だけに設定します。
 * 余った空行に残った古いチェックボックスは削除します。
 */

/**
 * 記事管理の見出しを紺色背景・白文字に統一します。
 */
function sbmStyleArticleDbSheet_(sh) {
  var lc = Math.max(sh.getLastColumn(), SBM_HEADERS.ARTICLE_DB.length);
  var lr = Math.max(sh.getLastRow(), 1);
  var hm = sbmHeaderMap_(sh);

  sh.setFrozenRows(1);
  sh.getRange(1, 1, 1, lc)
    .setFontWeight('bold')
    .setBackground('#1f4e78')
    .setFontColor('#ffffff')
    .setVerticalAlignment('middle')
    .setHorizontalAlignment('center')
    .setWrap(false);
  sh.setRowHeight(1, 34);

  var widths = {
    '選択':48,'記事ランク':110,'作業状態':115,'記事URL':285,'メインクエリ':210,
    'クリック数':90,'表示回数':95,'CTR':72,'掲載順位':88,'データ更新日':105,'記事タイトル':430
  };
  Object.keys(widths).forEach(function(h){
    if (hm[h]) sh.setColumnWidth(hm[h], widths[h]);
  });

  [
    'SEOタイトル','メタディスクリプション','最終取得日時','元URL件数','除外理由','備考',
    'ArticleID','記事情報補完済み','補完日時','補完エラー','記事ステータス',
    '最終確認日','連続未取得日数','管理フラグ','詳細'
  ].forEach(function(h){
    if (hm[h]) {
      try { sh.hideColumns(hm[h]); } catch(e) {}
    }
  });

  if (lr > 1) {
    var n = lr - 1;
    sh.getRange(2, 1, n, lc).setVerticalAlignment('middle');
    sh.setRowHeights(2, n, 54);

    ['記事タイトル','メインクエリ','記事URL'].forEach(function(h){
      if (hm[h]) sh.getRange(2, hm[h], n, 1).setWrap(true).setVerticalAlignment('top');
    });

    if (hm['クリック数']) sh.getRange(2, hm['クリック数'], n, 1).setNumberFormat('#,##0');
    if (hm['表示回数']) sh.getRange(2, hm['表示回数'], n, 1).setNumberFormat('#,##0');
    if (hm['CTR']) sh.getRange(2, hm['CTR'], n, 1).setNumberFormat('0.0%');
    if (hm['掲載順位']) sh.getRange(2, hm['掲載順位'], n, 1).setNumberFormat('0.0');
    if (hm['データ更新日']) sh.getRange(2, hm['データ更新日'], n, 1).setNumberFormat('yyyy/M/d').setHorizontalAlignment('center');

    sbmApplyArticleDbRowColors_(sh);
  }
  sbmApplySelectionUi_(sh);
}

/**
 * 最終有効版のシート作成・修復。
 * 改善履歴・改善の推移の再構築関数を明示的に呼び、画面へ反映します。
 */
function sbmInitializeSheets(showAlert) {
  showAlert = showAlert !== false;

  try { sbmMigrateArticleManagementSheet_(); } catch(e) {}
  try { sbmMigrateEffectSheetName_(); } catch(e) {}
  sbmRemoveRetiredSheets_();
  sbmEnsureDataSheets_();
  sbmMigrateRc3Headers_();
  sbmEnsureDefaultSettings_();
  try { sbmRepairFalseMassMissingFlags_(); } catch(e) {}
  sbmEnsureUserSheets_();
  sbmApplySheetUx_();

  // Product 5.1 Official: 改善履歴を4回測定形式へ強制移行
  sbmApplyProduct5OfficialMeasurementSchema_();
  sbmSetSetting_('OfficialSchemaVersion', SBM_OFFICIAL_SCHEMA_VERSION, 'Product 5.4.1のシート構造バージョン');

  // 改善履歴と改善の推移を非破壊で再構築・再表示
  try {
    sbmRefreshHistoryAndEffectAfterRepair_();
  } catch(e) {
    sbmLog_('RepairHistoryEffectRefresh', 'Warning', String(e));
    try { sbmRepairImprovementHistoryData_(); } catch(e2) {}
    try { sbmUpdateEffectivenessCore_(false); } catch(e3) {}
  }

  sbmRemoveRetiredSheets_();
  sbmApplyProductVisibleTabs_();

  try { sbmSortArticleDbInternal_(); } catch(e) {}
  try { sbmEnsureTodayRecommendations_('repair'); } catch(e) {}

  // 今日の改善を再描画してから、実データ行だけにチェックボックスを設定
  try {
    var todayCandidates = sbmGetTodayCandidates_();
    var shown = parseInt(sbmGetSetting_('DisplayedImprovementCount', '2'), 10) || 2;
    if (todayCandidates && todayCandidates.length) {
      sbmWriteTodayRecommendations_(todayCandidates, shown);
    }
  } catch(e) {
    sbmLog_('RepairTodayDisplay', 'Warning', String(e));
  }

  sbmApplySelectionUiAll_();
  sbmArrangeUserSheets_();
  sbmActivateHomeAfterRepair_();

  sbmLog_('InitializeSheets', 'Done', 'Product 5.4.1 sheet repair completed and Home refreshed');
  if (showAlert) sbmShowRepairCompletionNavigator_();
}

/**
 * シートの作成・修復の最終処理。
 * Homeを最新状態へ再描画し、表示シートをHomeへ戻してから終了します。
 */
function sbmActivateHomeAfterRepair_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  sbmRefreshHome_();
  SpreadsheetApp.flush();
  var home = ss.getSheetByName(SBM_SHEETS.HOME);
  if (!home) throw new Error('Homeシートを表示できませんでした。');
  home.showSheet();
  ss.setActiveSheet(home);
  home.activate();
  try { home.getRange('A1').activate(); } catch (e) {}
  SpreadsheetApp.flush();
}


/* ========================================================================== *
 * Product 5.0 RC11: Improvement History List Rebuild After Repair
 * ========================================================================== */

/**
 * 改善履歴一覧を、保存済みデータを維持したまま再構築します。
 * シート作成・修復後と改善履歴を開いたときに共通利用します。
 */
function sbmRebuildImprovementHistoryList_() {
  var sh = sbmGetOrCreateSheet_(SBM_SHEETS.FEEDBACK_HISTORY);

  // 既存データを非破壊で正規化します。
  try { sbmEnsureHistoryAndEffectSchemas_(); } catch (e) {}
  try { sbmRepairImprovementHistoryData_(); } catch (e) {
    sbmLog_('HistoryRebuildRepair', 'Warning', String(e));
  }

  sh = sbmGetOrCreateSheet_(SBM_SHEETS.FEEDBACK_HISTORY);
  if (sh.getLastRow() < 1) {
    sh.getRange(1, 1, 1, SBM_HISTORY_HEADERS_V2.length).setValues([SBM_HISTORY_HEADERS_V2]);
  }

  var hm = sbmHeaderMap_(sh);
  var lastRow = sh.getLastRow();
  var lastCol = Math.max(sh.getLastColumn(), SBM_HISTORY_HEADERS_V2.length);

  // 改善の推移の判定を改善履歴IDで反映します。
  var effectByHistoryId = {};
  try {
    var effectRows = sbmRowsAsObjects_(SBM_SHEETS.EFFECT) || [];
    effectRows.forEach(function(o) {
      var id = String(o['改善履歴ID'] || '').trim();
      if (id) effectByHistoryId[id] = String(o['判定'] || '測定待ち');
    });
  } catch (e) {}

  if (lastRow > 1) {
    var values = sh.getRange(2, 1, lastRow - 1, lastCol).getValues();

    values.forEach(function(row) {
      if (hm['選択']) row[hm['選択'] - 1] = false;

      if (hm['改善日']) {
        var v = row[hm['改善日'] - 1];
        if (v !== '' && v !== null) row[hm['改善日'] - 1] = sbmDisplayDateText_(v);
      }


      if (hm['最終判定'] && hm['改善履歴ID']) {
        var historyId = String(row[hm['改善履歴ID'] - 1] || '').trim();
        if (historyId && effectByHistoryId[historyId]) {
          if (String(row[hm['状態'] - 1] || '') === '完了') row[hm['最終判定'] - 1] = effectByHistoryId[historyId];
        } else if (!String(row[hm['最終判定'] - 1] || '').trim()) {
          row[hm['最終判定'] - 1] = '測定待ち';
        }
      }
    });

    // 改善日の新しい順。解析不能な旧データは末尾へ。
    var dateIndex = hm['改善日'] ? hm['改善日'] - 1 : -1;
    values.sort(function(a, b) {
      if (dateIndex < 0) return 0;
      var da = new Date(String(a[dateIndex] || '').replace(/年|月/g, '/').replace(/日.*$/, ''));
      var db = new Date(String(b[dateIndex] || '').replace(/年|月/g, '/').replace(/日.*$/, ''));
      var ta = isNaN(da.getTime()) ? 0 : da.getTime();
      var tb = isNaN(db.getTime()) ? 0 : db.getTime();
      return tb - ta;
    });

    sh.getRange(2, 1, values.length, lastCol).setValues(values);
  }

  // 利用者向けの一覧列だけを表示します。
  var visibleHeaders = ['選択','改善日','記事タイトル','改善概要','使用AI','1週','2週','3週','4週','最終判定','状態'];

  sh.showSheet();
  sh.setFrozenRows(1);
  sh.getRange(1, 1, 1, lastCol)
    .setBackground('#0b8043')
    .setFontColor('#ffffff')
    .setFontWeight('bold')
    .setVerticalAlignment('middle')
    .setHorizontalAlignment('center')
    .setWrap(false);
  sh.setRowHeight(1, 34);

  // いったん全列を表示し、内部列だけ隠します。
  try { sh.showColumns(1, sh.getMaxColumns()); } catch (e) {}
  for (var col = 1; col <= sh.getLastColumn(); col++) {
    var header = String(sh.getRange(1, col).getValue() || '').trim();
    if (visibleHeaders.indexOf(header) < 0) {
      try { sh.hideColumns(col); } catch (e) {}
    }
  }

  var widths = {
    '選択': 52,
    '改善日': 105,
    '記事タイトル': 360,
    '改善概要': 470,
    '使用AI': 100,
    '1週':80,'2週':80,'3週':80,'4週':80,'最終判定':110,'状態':90
  };
  Object.keys(widths).forEach(function(header) {
    if (hm[header]) sh.setColumnWidth(hm[header], widths[header]);
  });

  if (sh.getLastRow() > 1) {
    var n = sh.getLastRow() - 1;
    sh.getRange(2, 1, n, lastCol).setVerticalAlignment('top');

    if (hm['記事タイトル']) {
      sh.getRange(2, hm['記事タイトル'], n, 1).setWrap(true);
    }
    if (hm['改善概要']) {
      sh.getRange(2, hm['改善概要'], n, 1).setWrap(true);
    }
    if (hm['改善日']) {
      sh.getRange(2, hm['改善日'], n, 1).setWrap(false);
    }

    sh.setRowHeights(2, n, 58);
    try { sh.autoResizeRows(2, n); } catch (e) {}
  }

  // 実データ行だけにチェックボックスを設定します。
  try { sbmApplySelectionUi_(sh); } catch (e) {}

  SpreadsheetApp.flush();
  return Math.max(0, sh.getLastRow() - 1);
}

/**
 * シート作成・修復から呼ばれる最終版。
 * 改善履歴と改善の推移を再生成した後、改善履歴一覧を再描画します。
 */

/**
 * 改善履歴を開く操作でも、最新の一覧と表示書式を反映します。
 */


/* ========================================================================== *
 * Product 5.0 RC11: UI / Effect / Article navigation reliability fix
 * ========================================================================== */

/**
 * 記事管理の作業状態に応じた行背景色。
 * 参照先が未定義だった不具合を解消します。
 */
function sbmApplyArticleDbRowColors_(sh) {
  if (!sh || sh.getLastRow() < 2) return;
  var hm = sbmHeaderMap_(sh);
  var stateCol = hm['作業状態'];
  if (!stateCol) return;

  var lastRow = sh.getLastRow();
  var lastCol = sh.getLastColumn();
  var states = sh.getRange(2, stateCol, lastRow - 1, 1).getDisplayValues();
  var backgrounds = states.map(function(row) {
    var state = String(row[0] || '');
    var bg = '#ffffff';
    if (state.indexOf('モニター中') >= 0) bg = '#e8f0fe';
    else if (state.indexOf('今日の改善') >= 0) bg = '#fff2cc';
    else if (state.indexOf('改善中') >= 0) bg = '#fce8e6';
    return Array(lastCol).fill(bg);
  });
  sh.getRange(2, 1, backgrounds.length, lastCol).setBackgrounds(backgrounds);
}

/**
 * 日本語日時も再解析できる共通日付パーサー。
 */
function sbmParseDate_(value) {
  if (value === null || value === undefined || String(value).trim() === '') return null;
  if (Object.prototype.toString.call(value) === '[object Date]') {
    return isNaN(value.getTime()) ? null : value;
  }

  var s = String(value).trim();
  var jp = s.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日(?:（.）)?(?:(朝|午前|午後|夜|深夜)(\d{1,2}):(\d{2}))?/);
  if (jp) {
    var y = Number(jp[1]), m = Number(jp[2]) - 1, d = Number(jp[3]);
    var h = Number(jp[5] || 0), min = Number(jp[6] || 0);
    if (jp[4] === '午後' && h < 12) h += 12;
    if (jp[4] === '夜' && h < 12) h += 12;
    return new Date(y, m, d, h, min, 0);
  }

  var normalized = s.replace(/\./g, '/').replace(/-/g, '/');
  var d2 = new Date(normalized);
  return isNaN(d2.getTime()) ? null : d2;
}


/**
 * 履歴・設定値の日付を柔軟に解釈する互換パーサー。
 * Product 5.2.1: Homeの週間集計からも利用します。
 */
function sbmParseDateFlexible_(value) {
  return sbmParseDate_(value);
}

/**
 * 改善履歴一覧の最終表示書式。
 * 改善日・週次測定日時は折り返して、日本語表記を見切れなくします。
 */
function sbmApplyHistoryFinalStyle_() {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SBM_SHEETS.FEEDBACK_HISTORY);
  if (!sh) return;
  var hm = sbmHeaderMap_(sh);
  var n = Math.max(0, sh.getLastRow() - 1);

  if (hm['改善日']) {
    sh.setColumnWidth(hm['改善日'], 105);
    if (n) sh.getRange(2, hm['改善日'], n, 1).setNumberFormat('yyyy/M/d').setWrap(false).setHorizontalAlignment('center').setVerticalAlignment('middle');
  }
  for(var mi=1;mi<=4;mi++){var jc=hm[mi+'週'];if(jc){sh.setColumnWidth(jc,80);if(n)sh.getRange(2,jc,n,1).setHorizontalAlignment('center');}}
  if (hm['記事タイトル'] && n) sh.getRange(2, hm['記事タイトル'], n, 1).setWrap(true);
  if (hm['改善概要'] && n) sh.getRange(2, hm['改善概要'], n, 1).setWrap(true);
  if (n) {
    sh.setRowHeights(2, n, 64);
    try { sh.autoResizeRows(2, n); } catch (e) {}
  }
}

/**
 * 改善の推移シートの最終表示書式。
 */

/**
 * HOMEの最終更新表示を利用者向けに統一します。
 */
function sbmRefreshHome_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SBM_SHEETS.HOME);
  if (!sh || String(sh.getRange('H1').getValue()) !== ('v' + SBM_VERSION)) { sbmBuildHomeSheet_(); sh = ss.getSheetByName(SBM_SHEETS.HOME); }

  var rows = [];
  try { rows = sbmRowsAsObjects_(SBM_SHEETS.ARTICLE_DB) || []; } catch(e) {}
  var counts = sbmRankCountsFromRows_(rows);
  var work = {unstarted:0,today:0,progress:0,monitor:0,done:0,newArticles:0,unfilled:0,needsReview:0};
  rows.forEach(function(r) {
    var w = String(r['作業状態'] || '未着手');
    if (w.indexOf('今日の改善') >= 0) work.today++;
    else if (w.indexOf('改善中') >= 0) work.progress++;
    else if (w.indexOf('モニター中') >= 0) work.monitor++;
    else if (w.indexOf('完了') >= 0) work.done++;
    else work.unstarted++;
    if (String(r['管理フラグ'] || '').indexOf('新規記事') >= 0) work.newArticles++;
    if (String(r['記事情報補完済み'] || '') !== '○') work.unfilled++;
    if (String(r['管理フラグ'] || '') === '要確認') work.needsReview++;
  });

  var blogName = String(sbmGetSetting_('BlogName', ''));
  var blogUrl = String(sbmGetSetting_('BlogUrl', ''));
  sh.getRange('B2:D2').setValue(blogName || '未設定');
  var dailyStatus = sbmDailyUpdateStatus_();
  sh.getRange('F2:H2').setValue(dailyStatus.displayText === '未更新' ? 'ー' : dailyStatus.displayText);
  sh.getRange('B3').setValue(rows.length + '件');
  if (blogUrl) sh.getRange('D3:H3').setFormula('=HYPERLINK("' + blogUrl.replace(/"/g,'""') + '","' + blogUrl.replace(/"/g,'""') + '")');
  else sh.getRange('D3:H3').clearContent();
  var runtimeState = sbmGetDailyRuntimeState_();
  var statusText = runtimeState.running ? '▶ 実行中 ' + runtimeState.progress + '%　' + (runtimeState.message || '完了までお待ちください') : (runtimeState.completedToday ? '○ 本日完了　最終実行：' + runtimeState.displayText : (runtimeState.label === 'エラー' ? '▲ エラー　メニューから日次処理を開いて内容を確認してください。' : '● 未実施　メニュー「SIMS-Blog-Manager」→「日次処理を実行」から開始してください。'));
  sh.getRange('B4:H4').setValue(statusText);
  sh.getRange('A4:H4').setBackground(runtimeState.running ? '#dbeafe' : (runtimeState.completedToday ? '#e6f4ea' : (runtimeState.label === 'エラー' ? '#fce8e6' : '#fff2cc')));
  sh.getRange('B4:H4').setFontColor(runtimeState.running ? '#174ea6' : (runtimeState.completedToday ? '#0b8043' : '#b3261e')).setFontWeight(runtimeState.completedToday ? 'normal' : 'bold');

  function arrow(current, key) {
    var prev = Number(sbmGetSetting_(key, current));
    if (current > prev) return '↗';
    if (current < prev) return '↘';
    return '→';
  }
  sh.getRange('C6:D6').setValue(counts['🏆 エース'] + '件 ' + arrow(counts['🏆 エース'],'PrevAceCount'));
  sh.getRange('G6:H6').setValue(counts['🌱 育成'] + '件 ' + arrow(counts['🌱 育成'],'PrevNurtureCount'));
  sh.getRange('C7:D7').setValue(counts['✅ 安定'] + '件 ' + arrow(counts['✅ 安定'],'PrevStableCount'));
  sh.getRange('G7:H7').setValue(counts['⚠️ 低迷'] + '件 ' + arrow(counts['⚠️ 低迷'],'PrevLowCount'));
  sh.getRange('C8:D8').setValue(counts['📈 成長'] + '件 ' + arrow(counts['📈 成長'],'PrevGrowthCount'));
  var missingCount = rows.filter(function(r){ return String(r['管理フラグ']||'') === '要確認'; }).length;
  sh.getRange('G8:H8').setValue(missingCount + '件 ' + arrow(missingCount,'PrevMissingCount'));

  var snapshot = sbmHomeRankSnapshot_(rows, counts, work);
  sh.getRange('A11:H12').setValue(sbmHomeOverallMessage_(blogName, snapshot)).setFontWeight('normal');
  sh.getRange('C15:D15').setValue(work.today + '件');
  sh.getRange('C16:D16').setValue(work.progress + '件');
  sh.getRange('C17:D17').setValue(work.monitor + '件');
  sh.getRange('C18:D18').setValue(missingCount + '件');

  var weekly = sbmHomeWeeklyActivity_();
  var candidateCount = Math.max(0, Math.min(SBM_DEFAULTS.ANALYSIS_CANDIDATE_LIMIT, work.unstarted));
  sh.getRange('G15:H15').setValue(weekly.improved + '件');
  sh.getRange('G16:H16').setValue(work.monitor + '件');
  sh.getRange('G17:H17').setValue(weekly.completed + '件');
  sh.getRange('G18:H18').setValue(candidateCount + '件');
  sh.getRange('A23:H24').setValue(sbmHomeWeeklyAdvice_(weekly, work, candidateCount, missingCount)).setFontWeight('normal');
}

function sbmHomeWeeklyActivity_() {
  var rows = [];
  try { rows = sbmRowsAsObjects_(SBM_SHEETS.FEEDBACK_HISTORY) || []; } catch(e) {}
  var now = new Date(), since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  var improved = 0, completed = 0;
  rows.forEach(function(r) {
    var improvedAt = sbmParseDateFlexible_(r['改善日']);
    if (improvedAt && improvedAt >= since && improvedAt <= now) improved++;
    var completedAt = sbmParseDateFlexible_(r['4回目測定日時']) || sbmParseDateFlexible_(r['最新測定日時']);
    var state = String(r['状態'] || r['最終判定'] || '');
    if (completedAt && completedAt >= since && completedAt <= now && (state.indexOf('完了') >= 0 || String(r['4週']||'').trim())) completed++;
  });
  return {improved:improved, completed:completed};
}

function sbmHomeWeeklyAdvice_(weekly, work, candidateCount, missingCount) {
  weekly = weekly || {improved:0,completed:0}; work = work || {};
  if (missingCount > 0) return '未取得記事があります。記事が削除されたとは限りません。次回の日次処理でも未取得が続く場合は、Search ConsoleのURL検査や公開状態を確認しましょう。';
  if (Number(work.monitor||0) >= 5 && weekly.completed === 0) return '改善推移確認中の記事が増えています。新しい改善を増やしすぎず、7日・14日・21日・28日の結果確認を優先しましょう。';
  if (weekly.improved >= 4) return '今週は' + weekly.improved + '件を改善しており、良いペースです。推移を確認しながら、効果が高かった方法を次の記事にも活用しましょう。';
  if (weekly.improved > 0) return '今週は' + weekly.improved + '件を改善しました。無理に件数を増やさず、今日の改善から優先度の高い記事を続けましょう。';
  if (candidateCount > 0) return '今週はまだ改善結果が登録されていません。今日の改善から1件選び、改善後は結果登録まで完了させましょう。';
  return '改善候補が少なくなっています。管理メニューの日次処理を実行し、最新のSearch Consoleデータから候補を更新しましょう。';
}

function sbmHomeRankSnapshot_(rows, counts, work) {
  rows = rows || [];
  counts = counts || sbmRankCountsFromRows_(rows);
  work = work || {};
  var total = rows.length;
  var leading = Number(counts['🏆 エース'] || 0);
  var steady = Number(counts['✅ 安定'] || 0);
  var rising = Number(counts['📈 成長'] || 0);
  var early = Number(counts['🌱 育成'] || 0);
  var weak = Number(counts['⚠️ 低迷'] || 0);
  var clicks = 0, impressions = 0;
  rows.forEach(function(r){ clicks += sbmNumber_(r['クリック数']) || 0; impressions += sbmNumber_(r['表示回数']) || 0; });
  var trusted = leading + steady;
  return {
    total:total, leading:leading, steady:steady, rising:rising, early:early, weak:weak,
    trusted:trusted, trustedRate:total ? trusted/total : 0, risingRate:total ? rising/total : 0,
    earlyRate:total ? early/total : 0, weakRate:total ? weak/total : 0,
    clicks:clicks, impressions:impressions, work:work
  };
}

function sbmHomeStage_(s) {
  if (!s || !s.total) return 'empty';
  if (s.trustedRate >= 0.50 && s.leading >= Math.max(3, Math.round(s.total*0.08))) return 'strong';
  if (s.trustedRate >= 0.35 || s.leading >= 3) return 'steady';
  if ((s.trustedRate + s.risingRate) >= 0.55 || s.risingRate >= 0.30) return 'growing';
  if (s.weakRate >= 0.35 && s.trustedRate < 0.20) return 'rebuild';
  if (s.earlyRate >= 0.55 && s.impressions < 10000) return 'early';
  return 'developing';
}

function sbmHomeLocationText_(s) {
  var stage = sbmHomeStage_(s);
  if (stage === 'empty') return '🌱 これからブログの歩みを見つけます';
  if (stage === 'strong') return '🏆 検索から安定して読者を集めています';
  if (stage === 'steady') return '🌳 読者に選ばれる記事がしっかり育っています';
  if (stage === 'growing') return '🌿 伸びる記事が増え、成長の流れができています';
  if (stage === 'rebuild') return '🔧 伸ばす記事を選び直すと成果が見えそうです';
  if (stage === 'early') return '🌱 検索で見つかる記事が少しずつ増えています';
  return '📈 読まれる記事が増える一歩手前です';
}

function sbmHomeNextText_(s) {
  var stage = sbmHomeStage_(s);
  var w = s.work || {};
  if (stage === 'empty') return '🎯 まずは記事データをそろえましょう';
  if (w.today > 0) return '🎯 今日の候補から、伸びそうな1記事を育てましょう';
  if (s.rising > 0) return '🎯 あと一歩の記事を、読者に選ばれる記事へ';
  if (s.weakRate >= 0.25) return '🎯 表示機会のある記事から立て直しましょう';
  if (s.leading > 0 && s.steady > 0) return '🎯 よく読まれる記事を、次の主力へ育てましょう';
  if (w.monitor > 0) return '🎯 改善した記事の成長を落ち着いて見守りましょう';
  return '🎯 今の強みを保ちながら、次の伸びを作りましょう';
}

function sbmHomeOverallMessage_(blogName, s) {
  if (!s.total) return '記事データがそろうと、ここにブログの今と次の一歩が表示されます。まずは日次更新から始めましょう。';
  var stage = sbmHomeStage_(s);
  var subject = blogName ? blogName + 'では' : 'このブログでは';
  var first, second, last;
  if (stage === 'strong') {
    first = subject + '、検索から継続して読まれる記事がそろい、ブログ全体に安定した集客力があります。';
    second = '今は記事数を増やすことより、すでに読者を集めている記事の強みを守り、伸び始めた記事を次の柱へ育てる段階です。';
  } else if (stage === 'steady') {
    first = subject + '、読者に選ばれる記事が着実に増え、検索からの流れに安定感が出ています。';
    second = 'もう一歩で大きく伸びそうな記事を丁寧に磨くことで、ブログ全体の集客力をさらに底上げできそうです。';
  } else if (stage === 'growing') {
    first = subject + '、検索で評価が高まりつつある記事が増え、成長の流れが見えています。';
    second = '読者の期待に応えられている部分を残しながら、タイトルや導入文を整えると、次の成果につながりやすいでしょう。';
  } else if (stage === 'rebuild') {
    first = subject + '、伸び悩む記事もありますが、すべてを直す必要はありません。';
    second = '検索で見られている記事や、あと少しで上位を狙えそうな記事を選んで手を入れると、効率よく流れを変えられます。';
  } else if (stage === 'early') {
    first = subject + '、検索で見つけてもらえる記事が少しずつ増えています。';
    second = '今は数字を急いで追うより、読者の疑問にしっかり答える記事を一つずつ育てることが、次の安定につながります。';
  } else {
    first = subject + '、読まれる記事の芽がいくつも見え始めています。';
    second = '伸び始めた記事を選んで丁寧に整えることで、検索から訪れる読者をさらに増やせそうです。';
  }
  if ((s.work || {}).today > 0) last = '今日は候補の中から1記事だけ選び、無理のない改善を積み重ねていきましょう。';
  else if ((s.work || {}).monitor > 0) last = '手を入れた記事の変化を見守りながら、次の一歩を焦らず選んでいきましょう。';
  else last = '今日できる小さな改善を一つ見つけ、明日の伸びにつなげていきましょう。';
  return first + '\n' + second + '\n' + last;
}

function sbmHomeImprovementMessage_(work, total, s) {
  if (!total) return '記事データを取得すると、改善の進み具合に合わせたメッセージが表示されます。';
  if (work.today === 0 && work.progress === 0 && work.monitor === 0) return '今日は急いで直す記事がありません。これまで丁寧に整えてきた成果です。新しい記事づくりや、よく読まれている記事の強みを確認する時間にしてもよさそうです。';
  if (work.today >= 5) return '改善候補は多めですが、すべてを今日終える必要はありません。伸びる余地の大きい記事から1本ずつ進めれば、十分に成果へつながります。';
  if (work.monitor >= 3) return '改善した記事が結果を待っています。検索での評価は少し遅れて動くこともあります。今は種を育てる気持ちで、次の一歩を続けましょう。';
  if (work.done >= 10) return '改善を終えた記事が着実に増えています。その積み重ねが、読者に選ばれるブログの強さにつながっています。今日は無理なく進められる1記事に集中しましょう。';
  if (work.today > 0 && s && s.rising > 0) return '今日は、もう一歩で伸びそうな記事に取り組めます。良い部分を残しながらタイトルや導入文を整えると、読者へ届く力がさらに高まりそうです。';
  if (work.today > 0) return '今日は取り組める改善候補があります。まず1記事を選び、読者が知りたい答えが伝わりやすいかを丁寧に見直してみましょう。';
  return '改善中の記事があります。一つずつ仕上げながら、成果が表れるまで焦らず育てていきましょう。';
}

/**
 * 記事詳細から改善ナビを開くボタンのHTML。
 * サーバー処理成功後に元ダイアログを閉じます。
 */
function sbmArticleDetailNaviButtonHtml_(url) {
  url = String(url || '');
  if (!url) return '';
  var arg = JSON.stringify(url);
  return '<button type="button" onclick="this.disabled=true;google.script.run'
    + '.withSuccessHandler(function(){google.script.host.close();})'
    + '.withFailureHandler(function(e){this.disabled=false;alert(e.message||String(e));}.bind(this))'
    + '.sbmOpenImprovementNaviFromArticleDetail(' + arg + ')"'
    + ' style="border:0;background:#0b8043;color:#fff;padding:9px 16px;border-radius:6px;font-weight:700;cursor:pointer">'
    + '改善詳細（改善ナビ）を開く</button>';
}

/**
 * 記事管理詳細の最終版。
 */

/**
 * シート作成・修復後の最終更新。
 */
/**
 * 改善履歴の再構築・書式・チェックボックス設定を一つにまとめます。
 * シートの作成・修復と「改善履歴を開く」の両方から利用します。
 *
 * @param {boolean} updateEffect 改善の推移も最新化する場合はtrue
 * @return {GoogleAppsScript.Spreadsheet.Sheet} 改善履歴シート
 */
function sbmRefreshImprovementHistorySheet_(updateEffect) {
  try { sbmEnsureHistoryAndEffectSchemas_(); } catch (e) {}
  try { sbmRepairImprovementHistoryData_(); } catch (e) {
    sbmLog_('RefreshImprovementHistoryRepair', 'Warning', String(e));
  }
  if (updateEffect) {
    try { sbmUpdateEffectivenessCore_(false); } catch (e) {
      sbmLog_('RefreshImprovementEffect', 'Warning', String(e));
    }
  }
  try { sbmRebuildImprovementHistoryList_(); } catch (e) {
    sbmLog_('RefreshImprovementHistoryRebuild', 'Warning', String(e));
  }

  var sh = sbmGetOrCreateSheet_(SBM_SHEETS.FEEDBACK_HISTORY);
  try { sbmApplyHistoryFinalStyle_(); } catch (e) {
    sbmLog_('RefreshImprovementHistoryStyle', 'Warning', String(e));
  }
  try { sbmApplySelectionUi_(sh); } catch (e) {
    sbmLog_('RefreshImprovementHistorySelection', 'Warning', String(e));
  }
  sh.showSheet();
  SpreadsheetApp.flush();
  return sh;
}

function sbmRefreshHistoryAndEffectAfterRepair_() {
  sbmRefreshImprovementHistorySheet_(true);
  try { sbmStyleEffectSheetV2_(); } catch (e) {}
  SpreadsheetApp.flush();
}

/**
 * 改善履歴を開く際に一覧・書式・チェックボックスを必ず再反映します。
 */
function sbmOpenImprovementHistory() {
  var sh = sbmRefreshImprovementHistorySheet_(false);
  SpreadsheetApp.getActiveSpreadsheet().setActiveSheet(sh);
  sh.activate();
  SpreadsheetApp.flush();
}

/**
 * 利用者向けメニューの最終構成。
 * 記事操作から「並べ替え」「ブラウザで開く」「全履歴」を削除します。
 */


/* ========================================================================== *
 * Product 5.0 RC11: Article detail HTML / Repair navigator time fix
 * ========================================================================== */

/**
 * 記事管理詳細のHTMLを、完全なHTML文書として安全に生成します。
 * URLをonclick属性へ直接埋め込まず、script内の定数として渡すことで
 * 「形式が正しくないHTMLコンテンツ」エラーを防止します。
 */
function sbmArticleDbDetailHtml_(o) {
  o = o || {};
  var e = sbmEscapeHtml_;
  function value(v) { return sbmDetailDash_(v); }
  function row(label, v) {
    return '<tr>'
      + '<th style="text-align:left;width:180px;padding:8px;border-bottom:1px solid #e5e7eb;color:#5f6368;vertical-align:top">'
      + e(label)
      + '</th>'
      + '<td style="padding:8px;border-bottom:1px solid #e5e7eb;white-space:pre-wrap;overflow-wrap:anywhere">'
      + e(value(v))
      + '</td></tr>';
  }

  var rank = String(o['記事ランク'] || '');
  var workState = String(o['作業状態'] || '');
  var displayTitle = String(o['記事タイトル'] || o['SEOタイトル'] || o['メインクエリ'] || o['記事URL'] || '').trim();
  var advice = sbmArticleDbWorkAdvice_(rank, workState);
  var url = String(o['記事URL'] || '');
  var safeJsUrl = JSON.stringify(url).replace(/</g, '\\u003c');

  var actionButton = url
    ? '<button id="naviBtn" type="button" onclick="openNavi()" '
      + 'style="border:0;background:#0b8043;color:#fff;padding:9px 16px;border-radius:6px;font-weight:700;cursor:pointer">'
      + '改善詳細（改善ナビ）を開く</button>'
    : '';

  return '<!doctype html><html><head><base target="_top">'
    + '<meta charset="UTF-8">'
    + '<style>'
    + 'body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans JP",sans-serif;padding:20px;line-height:1.65;color:#202124}'
    + 'h2{margin:0 0 12px;color:#0b8043}h3{margin:0 0 14px}'
    + 'table{width:100%;border-collapse:collapse;font-size:14px}'
    + '.summary{background:#f1f8f4;border-left:5px solid #0b8043;padding:12px;margin-bottom:16px}'
    + '.actions{display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end;margin-top:18px;padding-top:14px;border-top:1px solid #e5e7eb}'
    + '.close{border:1px solid #9aa0a6;background:#fff;color:#3c4043;padding:9px 16px;border-radius:6px;font-weight:700;cursor:pointer}'
    + '#msg{font-size:12px;color:#5f6368;margin-top:8px;text-align:right}'
    + '</style></head><body>'
    + '<h2>選択記事の詳細</h2>'
    + '<h3>' + e(value(displayTitle)) + '</h3>'
    + '<div class="summary"><b>' + e(value(rank)) + ' × ' + e(value(workState)) + '</b><br>' + e(value(advice)) + '</div>'
    + '<table>'
    + row('記事ランク', rank)
    + row('作業状態', workState)
    + row('記事URL', url)
    + row('メインクエリ', o['メインクエリ'])
    + row('クリック数', o['クリック数表示'] || o['クリック数'])
    + row('表示回数', o['表示回数表示'] || o['表示回数'])
    + row('CTR', o['CTR表示'] || o['CTR'])
    + row('掲載順位', o['掲載順位表示'] || o['掲載順位'])
    + row('データ更新日', sbmHistoryDateOnlyText_(o['データ更新日']))
    + row('記事タイトル', o['記事タイトル'])
    + row('SEOタイトル', o['SEOタイトル'])
    + row('メタディスクリプション', o['メタディスクリプション'])
    + row('最終取得日時', o['最終取得日時'])
    + row('ArticleID', o['ArticleID'])
    + row('記事情報補完済み', o['記事情報補完済み'])
    + row('補完日時', o['補完日時'])
    + row('備考', o['備考'])
    + '</table>'
    + '<div data-sbm-common-close="1" class="actions">'
    + actionButton
    + '<button type="button" class="close" onclick="google.script.host.close()">閉じる</button>'
    + '</div><div id="msg"></div>'
    + '<script>'
    + 'var articleUrl=' + safeJsUrl + ';'
    + 'function openNavi(){'
    + 'var b=document.getElementById("naviBtn");'
    + 'if(b)b.disabled=true;'
    + 'document.getElementById("msg").textContent="改善詳細を開いています…";'
    + 'google.script.run'
    + '.withFailureHandler(function(err){if(b)b.disabled=false;document.getElementById("msg").textContent=(err&&err.message)?err.message:String(err);})'
    + '.withSuccessHandler(function(){google.script.host.close();})'
    + '.sbmOpenImprovementNaviFromArticleDetail(articleUrl);'
    + '}'
    + '</script></body></html>';
}

/**
 * シート作成・修復完了ナビゲーターの日時を、
 * 改善履歴と同じ日本語表記へ統一します。
 */


/* ========================================================================== *
 * Product 5.0 RC11: Improvement Effect checkbox / Repair close button fix
 * ========================================================================== */

/**
 * 一覧シートの「選択」列を標準チェックボックスへ統一します。
 * 文字列 "TRUE" / "FALSE" や旧入力規則を残さず、無効表示を防ぎます。
 */

/**
 * 改善の推移の書式適用時に、チェックボックスを標準形式で再設定します。
 */

/**
 * シート作成・修復完了ナビゲーター。
 * 3つの遷移ボタンに加えて、明示的な「閉じる」を追加します。
 */


/* ========================================================================== *
 * Product 5.0 RC11: Repair navigator immediate close / Measurement time fix
 * ========================================================================== */

/**
 * 次回測定予定日は日本時間の朝9:00で固定します。
 * 日付だけの値を午前0時として解釈した際のタイムゾーンずれを防ぎます。
 */
function sbmDateAfterDaysText_(days) {
  var tz = 'Asia/Tokyo';
  var base = new Date();
  var y = Number(Utilities.formatDate(base, tz, 'yyyy'));
  var m = Number(Utilities.formatDate(base, tz, 'M'));
  var d = Number(Utilities.formatDate(base, tz, 'd'));

  var target = new Date(
    String(y) + '-' +
    ('0' + m).slice(-2) + '-' +
    ('0' + d).slice(-2) +
    'T09:00:00+09:00'
  );
  target.setTime(target.getTime() + Number(days || 0) * 86400000);
  return sbmJapaneseDateTimeText_(target);
}

/**
 * 次回測定予定日専用の表示形式。
 * 既存の「日付だけ」の値も日本時間の朝9:00として表示します。
 */
function sbmMeasurementDateTimeText_(value) {
  if (value === null || value === undefined || String(value).trim() === '') return 'ー';
  var d = sbmParseDate_(value);
  return d ? Utilities.formatDate(d, 'Asia/Tokyo', 'yyyy/M/d') : 'ー';
}

/**
 * シート作成・修復完了ナビゲーター。
 * 選択ボタンを押した時点でダイアログを閉じ、その後に処理を継続します。
 */

/**
 * 改善の推移の次回測定予定日を朝9:00表示へ統一します。
 */
function sbmStyleEffectSheetV2_() {
  var sh = sbmGetOrCreateSheet_(SBM_SHEETS.EFFECT);
  sbmEnsureHistoryAndEffectSchemasIfEmpty_(sh, SBM_EFFECT_HEADERS_V2);

  sh.showSheet();
  sh.setFrozenRows(1);

  var lc = Math.max(sh.getLastColumn(), SBM_EFFECT_HEADERS_V2.length);
  sh.getRange(1, 1, 1, lc)
    .setBackground('#1f4e78')
    .setFontColor('#ffffff')
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle')
    .setWrap(false);
  sh.setRowHeight(1, 34);

  var hm = sbmHeaderMap_(sh);
  var widths = {
    '選択':52,'改善実施日':120,'経過日数':80,'次回測定予定日':185,'測定回数':90,'記事タイトル':360,
    '改善前CTR':100,'現在CTR':100,'改善前順位':100,'現在順位':100,'判定':110
  };
  Object.keys(widths).forEach(function(h) {
    if (hm[h]) sh.setColumnWidth(hm[h], widths[h]);
  });

  if (sh.getMaxColumns() >= 12) {
    try { sh.hideColumns(12, sh.getMaxColumns() - 11); } catch (e) {}
  }

  var n = Math.max(0, sh.getLastRow() - 1);
  if (n) {
    sh.getRange(2, 1, n, Math.min(11, sh.getLastColumn())).setVerticalAlignment('top');

    if (hm['改善実施日']) {
      sh.getRange(2, hm['改善実施日'], n, 1).setNumberFormat('yyyy/M/d').setHorizontalAlignment('center');
    }

    if (hm['次回測定予定日']) {
      var range = sh.getRange(2, hm['次回測定予定日'], n, 1);
      var vals = range.getValues();
      for (var i = 0; i < vals.length; i++) {
        if (vals[i][0] !== '' && vals[i][0] !== null) {
          vals[i][0] = sbmMeasurementDateTimeText_(vals[i][0]);
        }
      }
      range.setValues(vals).setWrap(true).setHorizontalAlignment('center');
    }

    if (hm['記事タイトル']) sh.getRange(2, hm['記事タイトル'], n, 1).setWrap(true);
    if (hm['経過日数']) sh.getRange(2, hm['経過日数'], n, 1).setNumberFormat('0');
    if (hm['改善前CTR']) sh.getRange(2, hm['改善前CTR'], n, 1).setNumberFormat('0.0%');
    if (hm['現在CTR']) sh.getRange(2, hm['現在CTR'], n, 1).setNumberFormat('0.0%');
    if (hm['改善前順位']) sh.getRange(2, hm['改善前順位'], n, 1).setNumberFormat('0.0');
    if (hm['現在順位']) sh.getRange(2, hm['現在順位'], n, 1).setNumberFormat('0.0');

    sh.setRowHeights(2, n, 58);
    try { sh.autoResizeRows(2, n); } catch (e) {}
  }

  sbmApplySelectionUi_(sh);
  SpreadsheetApp.flush();
}



/**
 * 改善結果を登録した記事を「今日の改善」で完了表示にします。
 * チェックボックスを削除し、行をグレーアウトして再選択を防止します。
 */
function sbmMarkTodayImprovementCompleted_(articleId, articleUrl) {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SBM_SHEETS.TODAY);
  if (!sh || sh.getLastRow() < 2) return false;
  var hm = sbmHeaderMap_(sh);
  var urlCol = hm['記事URL'];
  var selectCol = hm['選択'];
  var titleCol = hm['記事タイトル'];
  if (!urlCol || !selectCol) return false;
  var normalized = sbmNormalizeUrl_(articleUrl || '');
  var urls = sh.getRange(2, urlCol, sh.getLastRow() - 1, 1).getValues();
  var matched = false;
  for (var i = 0; i < urls.length; i++) {
    if (normalized && sbmNormalizeUrl_(urls[i][0] || '') === normalized) {
      var row = i + 2;
      var cell = sh.getRange(row, selectCol);
      cell.clearDataValidations().setValue('完了').setHorizontalAlignment('center').setFontWeight('bold');
      sh.getRange(row, 1, 1, Math.max(sh.getLastColumn(), SBM_HEADERS.TODAY.length))
        .setBackground('#eeeeee').setFontColor('#777777');
      if (titleCol) sh.getRange(row, titleCol).setFontLine('line-through');
      matched = true;
    }
  }
  if (matched) SpreadsheetApp.flush();
  return matched;
}

/** 記事管理の状態から、今日の改善で完了扱いにするURLを取得します。 */
function sbmTodayCompletedUrlMap_() {
  var map = {};
  var rows = sbmRowsAsObjects_(SBM_SHEETS.ARTICLE_DB) || [];
  rows.forEach(function(r) {
    var state = String(r['作業状態'] || '');
    if (state.indexOf('モニター中') >= 0 || state.indexOf('完了') >= 0) {
      var u = sbmNormalizeUrl_(r['記事URL'] || '');
      if (u) map[u] = true;
    }
  });
  return map;
}

/* ========================================================================== *
 * Product 5.0 RC11: Today Improvement checkbox cleanup fix
 * ========================================================================== */

/**
 * 「今日の改善」では、記事タイトルが入っている行だけにチェックボックスを置きます。
 * 空行・残存書式行・内部列だけに値がある行には表示しません。
 */
function sbmApplySelectionUi_(sh) {
  if (!sh || sh.getLastColumn() < 1) return;

  var hm = sbmHeaderMap_(sh);
  var col = hm['選択'];
  if (!col) return;

  sh.setColumnWidth(col, 52);
  sh.getRange(1, col).setHorizontalAlignment('center').setWrap(false);

  var clearLast = Math.max(sh.getMaxRows(), sh.getLastRow(), 2);
  var fullRange = sh.getRange(2, col, clearLast - 1, 1);

  // 既存チェックボックス・入力規則・TRUE/FALSEを完全削除
  fullRange.clearDataValidations();
  fullRange.clearContent();

  if (sh.getName() === SBM_SHEETS.TODAY) {
    var titleCol = hm['記事タイトル'];
    if (!titleCol || sh.getLastRow() < 2) return;

    var n = sh.getLastRow() - 1;
    var titles = sh.getRange(2, titleCol, n, 1).getDisplayValues();
    var urlCol = hm['記事URL'];
    var urls = urlCol ? sh.getRange(2, urlCol, n, 1).getValues() : [];
    var completed = sbmTodayCompletedUrlMap_();

    for (var i = 0; i < titles.length; i++) {
      if (String(titles[i][0] || '').trim() === '') continue;
      var row = i + 2;
      var url = urlCol ? sbmNormalizeUrl_(urls[i][0] || '') : '';
      if (url && completed[url]) {
        sh.getRange(row, col).clearDataValidations().setValue('完了')
          .setHorizontalAlignment('center').setFontWeight('bold');
        sh.getRange(row, 1, 1, Math.max(sh.getLastColumn(), SBM_HEADERS.TODAY.length))
          .setBackground('#eeeeee').setFontColor('#777777');
        sh.getRange(row, titleCol).setFontLine('line-through');
      } else {
        sh.getRange(row, col).insertCheckboxes().setValue(false).setHorizontalAlignment('center');
      }
    }
    return;
  }

  // その他の一覧は従来どおり、実データ最終行まで標準チェックボックス
  var dataLast = sbmSelectionDataLastRow_(sh);
  if (dataLast >= 2) {
    var target = sh.getRange(2, col, dataLast - 1, 1);
    target.insertCheckboxes();
    target.setValues(Array.from({length: dataLast - 1}, function(){ return [false]; }));
    target.setHorizontalAlignment('center');
  }
}

/**
 * 今日の改善を再描画した後、選択列を必ず掃除します。
 */


/* ========================================================================== *
 * Product 5.0 RC11: Today Improvement strict rebuild fix
 * ========================================================================== */

/**
 * 「今日の改善」は毎回、見出し以外を完全に消してから再構築します。
 * これにより空行へ残るチェックボックス・入力規則・旧データを防止します。
 */
function sbmWriteTodayRecommendations_(candidates, count) {
  sbmBuildTodayImprovementSheet_();
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SBM_SHEETS.TODAY);
  if (!sh) return;

  var lastCol = Math.max(sh.getLastColumn(), SBM_HEADERS.TODAY.length);
  var maxRows = Math.max(sh.getMaxRows(), 2);

  // 見出し以外を完全に初期化
  var body = sh.getRange(2, 1, maxRows - 1, lastCol);
  body.clearContent();
  body.clearDataValidations();
  body.clearFormat();

  var shown = (candidates || []).slice(0, Math.min(Number(count || 0), (candidates || []).length));

  if (shown.length) {
    var values = shown.map(function(c) {
      return [
        false,
        c.kind,
        c.title,
        c.reason,
        c.estimate,
        c.rank,
        c.query,
        c.clicks,
        c.impressions,
        c.ctr,
        c.position,
        c.url,
        c.candidateId
      ];
    });

    sh.getRange(2, 1, values.length, SBM_HEADERS.TODAY.length).setValues(values);
    sh.getRange(2, 1, values.length, 1).insertCheckboxes().setValue(false).setHorizontalAlignment('center');
    sh.getRange(2, 8, values.length, 2).setNumberFormat('#,##0');
    sh.getRange(2, 10, values.length, 1).setNumberFormat('0.0%');
    sh.getRange(2, 11, values.length, 1).setNumberFormat('0.0');
    sh.getRange(2, 1, values.length, SBM_HEADERS.TODAY.length)
      .setBorder(true, true, true, true, true, true)
      .setVerticalAlignment('middle');

    sh.getRange(2, 2, values.length, 1).setFontWeight('bold').setHorizontalAlignment('center');
    sh.getRange(2, 3, values.length, 2).setWrap(true);
    sh.getRange(2, 5, values.length, 1).setHorizontalAlignment('center');
    sh.getRange(2, 7, values.length, 1).setWrap(true);

    for (var i = 0; i < values.length; i++) {
      sh.setRowHeight(i + 2, 76);
    }
  }

  var guideRow = shown.length + 3;
  sh.getRange(guideRow, 1).setValue(
    shown.length < (candidates || []).length
      ? '上部メニュー「記事改善スタート → 次の2件を表示」で追加できます。'
      : '最大6件を表示しています。'
  ).setFontColor('#5f6368');

  // 念のため選択列を最終正規化
  sbmApplySelectionUi_(sh);

  sbmSetSetting_(
    'DisplayedImprovementCount',
    String(shown.length),
    '今日の改善に表示している件数'
  );

  SpreadsheetApp.flush();
}

/**
 * 起動・修復・日次更新後に「今日の改善」を再描画する最終処理。
 */
function sbmFinalizeTodayImprovementSelection_() {
  var candidates = sbmGetTodayCandidates_();
  var shown = parseInt(sbmGetSetting_('DisplayedImprovementCount', '2'), 10) || 2;
  if (candidates && candidates.length) {
    sbmWriteTodayRecommendations_(candidates, Math.min(shown, candidates.length));
  } else {
    var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SBM_SHEETS.TODAY);
    if (sh) sbmApplySelectionUi_(sh);
  }
  SpreadsheetApp.flush();
}


/* ========================================================================== *
 * Product 5.0 RC11: Setup wizard restore fix
 * ========================================================================== */

/**
 * セットアップ画面を開くだけでなく、STEP1〜STEP5を実行できる
 * セットアップナビゲーターを表示します。
 */
function sbmOpenSetup() {
  sbmStartSetupWizard();
}

function sbmStartSetupWizard() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var setupSheet = ss.getSheetByName(SBM_SHEETS.SETUP);
  if (setupSheet) {
    try { setupSheet.showSheet(); } catch (e) {}
    ss.setActiveSheet(setupSheet);
  }

  var statuses = {
    step1: String(sbmGetSetting_('SetupBlogInfo', 'NO')) === 'YES',
    step2: String(sbmGetSetting_('SetupApiGuide', 'NO')) === 'YES',
    step3: String(sbmGetSetting_('ConnectionStatus', '')) === 'OK',
    step4: String(sbmGetSetting_('ArticleDbUrlBuildComplete', 'NO')) === 'YES',
    step5: String(sbmGetSetting_('ArticleInfoBuildComplete', 'NO')) === 'YES'
  };

  function mark(done) {
    return done ? '<span class="done">完了</span>' : '<span class="todo">未完了</span>';
  }

  var html = '<!doctype html><html><head><base target="_top"><meta charset="UTF-8">'
    + '<style>'
    + 'body{font-family:Arial,"Noto Sans JP",sans-serif;padding:20px;color:#202124;line-height:1.55}'
    + 'h2{margin:0 0 8px;color:#0b8043}.lead{color:#5f6368;margin-bottom:14px}'
    + '.step{border:1px solid #dadce0;border-radius:10px;padding:12px;margin:9px 0;background:#fff}'
    + '.row{display:flex;align-items:center;justify-content:space-between;gap:12px}'
    + '.title{font-weight:700}.desc{font-size:12px;color:#5f6368;margin-top:4px}'
    + '.done{color:#0b8043;font-weight:700}.todo{color:#b06000;font-weight:700}'
    + 'button{border:0;border-radius:7px;padding:9px 13px;font-weight:700;cursor:pointer;white-space:nowrap}'
    + '.run{background:#1a73e8;color:#fff}.close{background:#fff;color:#3c4043;border:1px solid #9aa0a6}'
    + '.footer{display:flex;justify-content:flex-end;margin-top:16px;padding-top:12px;border-top:1px solid #e5e7eb}'
    + '</style></head><body>'
    + '<h2>ブログのセットアップ</h2>'
    + '<div class="lead">未完了のSTEPから順番に実行してください。ボタンを押すと、この画面を閉じて各処理を開始します。</div>'

    + '<div class="step"><div class="row"><div><div class="title">STEP1　ブログ情報を登録　' + mark(statuses.step1) + '</div>'
    + '<div class="desc">ブログ名、ブログURL、Search Consoleプロパティを登録します。</div></div>'
    + '<button class="run" onclick="runStep(1)">実行</button></div></div>'

    + '<div class="step"><div class="row"><div><div class="title">STEP2　Google Cloud APIガイド　' + mark(statuses.step2) + '</div>'
    + '<div class="desc">必要なAPI設定と認証手順を確認します。</div></div>'
    + '<button class="run" onclick="runStep(2)">実行</button></div></div>'

    + '<div class="step"><div class="row"><div><div class="title">STEP3　Search Console接続テスト　' + mark(statuses.step3) + '</div>'
    + '<div class="desc">登録したプロパティへ接続できるか確認します。</div></div>'
    + '<button class="run" onclick="runStep(3)">実行</button></div></div>'

    + '<div class="step"><div class="row"><div><div class="title">STEP4　記事管理を初回作成　' + mark(statuses.step4) + '</div>'
    + '<div class="desc">Search ConsoleからURLと指標を取得し、記事管理を作成します。</div></div>'
    + '<button class="run" onclick="runStep(4)">実行</button></div></div>'

    + '<div class="step"><div class="row"><div><div class="title">STEP5　記事情報を補完　' + mark(statuses.step5) + '</div>'
    + '<div class="desc">記事タイトル、SEOタイトル、ディスクリプションなどを補完します。</div></div>'
    + '<button class="run" onclick="runStep(5)">実行</button></div></div>'

    + '<div class="step"><div class="row"><div><div class="title">セットアップ結果を確認</div>'
    + '<div class="desc">記事管理の登録件数、補完済み件数、残り件数を確認します。新しいデータ取得処理は行いません。</div></div>'
    + '<button class="run" onclick="runStep(6)">確認</button></div></div>'

    + '<div class="footer"><button class="close" onclick="google.script.host.close()">閉じる</button></div>'
    + '<script>'
    + 'function runStep(step){'
    + 'google.script.run.sbmRunSetupWizardStep(step);'
    + 'window.setTimeout(function(){google.script.host.close();},50);'
    + '}'
    + '</script></body></html>';

  SpreadsheetApp.getUi().showModalDialog(
    HtmlService.createHtmlOutput(html).setWidth(620).setHeight(720),
    'ブログのセットアップ'
  );
}

/**
 * セットアップナビゲーターの各STEPを実行します。
 */
function sbmRunSetupWizardStep(step) {
  step = Number(step || 0);
  if (step === 1) return sbmSetupStep1BlogInfo();
  if (step === 2) return sbmSetupStep2ApiGuide();
  if (step === 3) return sbmSetupStep3ConnectionTest();
  if (step === 4) return sbmSetupArticleDbContinueManual();
  if (step === 5) return sbmSetupArticleInfoContinueManual();
  if (step === 6) return sbmShowArticleDbSetupStatus();
  return sbmAlert_('セットアップ', '実行するSTEPを選択してください。');
}

/**
 * シート作成・修復完了画面の「ブログのセットアップ」も
 * セットアップナビゲーターへ直接進めます。
 */
function sbmHandleRepairNextAction(action) {
  action = String(action || 'home');
  if (action === 'setup') {
    sbmStartSetupWizard();
    return true;
  }
  if (action === 'update') {
    sbmCollectPageDataToArticleDbManual();
    return true;
  }
  sbmOpenHome();
  return true;
}

/**
 * 上部メニューの最終構成。
 * 「ブログをセットアップ」はシート表示ではなくナビゲーターを起動します。
 */


/* ========================================================================== *
 * SIMS-Blog-Manager Product 5.0 Release 1 Sprint 1
 * Clean setup wizard / menu cleanup / developer diagnostics
 * ========================================================================== */

var SBM_RELEASE_NAME = 'Product 5.4.1';

/* ---------- 共通：ウィザード ---------- */

function sbmRelease1SetupStatus_() {
  var counts = {total:0, completed:0, remaining:0};
  try { counts = sbmArticleDbInfoCompletionCounts_(); } catch (e) {}
  return {
    blogName: String(sbmGetSetting_('BlogName','')),
    blogUrl: String(sbmGetSetting_('BlogUrl','')),
    siteId: String(sbmGetSetting_('SiteID','')),
    siteName: String(sbmGetSetting_('SiteName','')),
    property: String(sbmGetSetting_('SearchConsoleProperty','')),
    step1: String(sbmGetSetting_('SetupBlogInfo','NO')) === 'YES',
    step2: String(sbmGetSetting_('SetupApiGuide','NO')) === 'YES',
    step3: String(sbmGetSetting_('ConnectionStatus','')) === 'OK',
    step4: String(sbmGetSetting_('ArticleDbUrlBuildComplete','NO')) === 'YES',
    step5: String(sbmGetSetting_('ArticleInfoBuildComplete','NO')) === 'YES',
    total: Number(counts.total || 0),
    completed: Number(counts.completed || 0),
    remaining: Number(counts.remaining || 0)
  };
}

function sbmRelease1WizardBaseCss_() {
  return '<style>'
    + 'body{font-family:Arial,"Noto Sans JP",sans-serif;padding:22px;color:#202124;line-height:1.6}'
    + 'h2{margin:0 0 8px;color:#0b8043}.stepno{font-size:13px;color:#5f6368}'
    + '.box{background:#f8f9fa;border:1px solid #dadce0;border-radius:10px;padding:14px;margin:14px 0}'
    + '.field{margin:12px 0}.field label{display:block;font-weight:700;margin-bottom:5px}'
    + 'input{box-sizing:border-box;width:100%;padding:9px;border:1px solid #bdc1c6;border-radius:6px;font-size:14px}'
    + '.status{display:inline-block;border-radius:14px;padding:3px 9px;font-size:12px;font-weight:700}'
    + '.done{background:#e6f4ea;color:#137333}.todo{background:#fef7e0;color:#b06000}'
    + '.actions{display:flex;gap:9px;justify-content:flex-end;flex-wrap:wrap;margin-top:18px;padding-top:14px;border-top:1px solid #e5e7eb}'
    + 'button{border:0;border-radius:7px;padding:10px 16px;font-weight:700;cursor:pointer}'
    + '.run{background:#0b8043;color:#fff}.skip{background:#e8f0fe;color:#174ea6}.end{background:#fff;color:#3c4043;border:1px solid #9aa0a6}'
    + '#msg{font-size:12px;color:#5f6368;margin-top:10px;white-space:pre-wrap}'
    + '</style>';
}

function sbmStartInitialSetup() {
  sbmShowRelease1SetupStep_(1);
}

function sbmShowRelease1SetupStep_(step) {
  step = Number(step || 1);
  if (step < 1) step = 1;
  if (step > 6) step = 6;

  var s = sbmRelease1SetupStatus_();
  var titles = {
    1:'ブログ情報の登録',
    2:'Google Cloud API設定',
    3:'Search Console接続テスト',
    4:'記事管理の初回作成',
    5:'記事情報の補完',
    6:'セットアップ結果の確認'
  };
  var descriptions = {
    1:'ブログ名、ブログURL、Search Consoleプロパティを登録します。',
    2:'Google Search Console APIの有効化と認証手順だけを確認します。',
    3:'登録済みプロパティへの接続だけを確認します。',
    4:'Search ConsoleからページURLと指標を取得し、記事管理を作成します。',
    5:'未補完記事のタイトル、SEOタイトル、ディスクリプション等を取得します。',
    6:'記事管理の登録件数と記事情報の補完状況を確認し、Homeへ移動します。'
  };
  var done = [false,s.step1,s.step2,s.step3,s.step4,s.step5,true][step];
  var body = '';

  if (step === 1) {
    body = '<div class="field"><label>ブログ名</label><input id="blogName" value="'+sbmEscapeHtml_(s.blogName)+'"></div>'
      + '<div class="field"><label>ブログURL</label><input id="blogUrl" value="'+sbmEscapeHtml_(s.blogUrl)+'"></div>'
      + '<div class="field"><label>Search Consoleプロパティ</label><input id="property" value="'+sbmEscapeHtml_(s.property)+'"></div>';
  } else if (step === 2) {
    body = '<div class="box">'
      + '1. Google Cloudで使用するプロジェクトを選択します。<br>'
      + '2. Google Search Console APIを有効にします。<br>'
      + '3. 初回認証画面が表示された場合は許可します。<br><br>'
      + '<a href="'+sbmSearchConsoleApiUrl_()+'" target="_blank" style="color:#1a73e8;font-weight:700">Google Search Console APIを開く</a>'
      + '</div>';
  } else if (step === 3) {
    body = '<div class="box">接続先：<b>'+sbmEscapeHtml_(s.property || '未登録')+'</b></div>';
  } else if (step === 4) {
    body = '<div class="box">記事管理：<b>'+s.total+'件</b><br>このSTEPではURLとSearch Console指標だけを取得します。</div>';
  } else if (step === 5) {
    body = '<div class="box">補完済み：<b>'+s.completed+'件</b><br>未補完：<b>'+s.remaining+'件</b><br>1回につき設定済み件数を処理します。残りがある場合は同じSTEPを再実行します。</div>';
  } else {
    body = '<div class="box">'
      + 'ブログ名：<b>'+sbmEscapeHtml_(s.blogName || '未登録')+'</b><br>'
      + '接続テスト：<b>'+(s.step3?'完了':'未完了')+'</b><br>'
      + '記事管理：<b>'+s.total+'件</b><br>'
      + '記事情報補完：<b>'+s.completed+'件 / '+s.total+'件</b><br><br>' + (s.step3 && s.total > 0 && s.remaining === 0 ? '<b style="color:#137333">初回セットアップが完了しました。Homeから日々の改善作業を開始できます。</b>' : '<b style="color:#b06000">未完了のSTEPを確認してください。</b>')
      + '</div>';
  }

  var html = '<!doctype html><html><head><base target="_top"><meta charset="UTF-8">'
    + sbmRelease1WizardBaseCss_()
    + '</head><body>'
    + '<div class="stepno">初回セットアップ　STEP '+step+' / 6</div>'
    + '<h2>'+sbmEscapeHtml_(titles[step])+'</h2>'
    + '<span class="status '+(done?'done':'todo')+'">'+(done?'完了済み':'未完了')+'</span>'
    + '<p>'+sbmEscapeHtml_(descriptions[step])+'</p>'
    + body
    + '<div id="msg"></div>'
    + '<div class="actions">'
    + '<button class="run" onclick="executeStep()">実行</button>'
    + '<button class="skip" onclick="skipStep()">スキップ</button>'
    + '<button class="end" onclick="finishWizard()">終了</button>'
    + '</div>'
    + '<script>'
    + 'var step='+step+';'
    + 'function disableAll(){document.querySelectorAll("button").forEach(function(b){b.disabled=true});}'
    + 'function payload(){if(step!==1)return {};return {blogName:document.getElementById("blogName").value,blogUrl:document.getElementById("blogUrl").value,property:document.getElementById("property").value};}'
    + 'function executeStep(){disableAll();document.getElementById("msg").textContent="処理しています…";'
    + 'google.script.run.withFailureHandler(function(e){document.getElementById("msg").textContent=(e&&e.message)?e.message:String(e);document.querySelectorAll("button").forEach(function(b){b.disabled=false});})'
    + '.withSuccessHandler(function(r){google.script.host.close();}).sbmExecuteRelease1SetupStep(step,payload());}'
    + 'function skipStep(){disableAll();google.script.run.withSuccessHandler(function(){google.script.host.close();}).sbmSkipRelease1SetupStep(step);}'
    + 'function finishWizard(){google.script.run.sbmOpenHome();google.script.host.close();}'
    + '</script></body></html>';

  SpreadsheetApp.getUi().showModalDialog(
    HtmlService.createHtmlOutput(html).setWidth(620).setHeight(step === 1 ? 620 : 520),
    '初回セットアップ'
  );
}

function sbmExecuteRelease1SetupStep(step, payload) {
  step = Number(step || 0);
  payload = payload || {};

  if (step === 1) {
    var blogName = String(payload.blogName || '').trim();
    var blogUrl = String(payload.blogUrl || '').trim();
    var existingSiteId = String(sbmGetSetting_('SiteID','') || '').trim();
    var siteId = existingSiteId || sbmSiteIdFromUrl_(blogUrl);
    var siteName = blogName;
    var property = String(payload.property || '').trim();
    if (!blogName || !blogUrl || !property) throw new Error('ブログ名、ブログURL、Search Consoleプロパティをすべて入力してください。');
    sbmSetSetting_('BlogName',blogName,'管理するブログ名');
    sbmSetSetting_('BlogUrl',blogUrl,'ブログURL');
    sbmSetSetting_('SiteID',siteId,'SIMS製品間でサイトを識別するID');
    sbmSetSetting_('SiteName',siteName,'SIMS製品間で表示するサイト名');
    sbmSetSetting_('SearchConsoleProperty',property,'Search Console property');
    sbmSetSetting_('SetupBlogInfo','YES','STEP1完了状態');
    sbmLog_('Release1SetupStep1','Done',blogName+' / '+property);
    sbmShowRelease1SetupStep_(2);
    return true;
  }

  if (step === 2) {
    sbmSetSetting_('SetupApiGuide','YES','STEP2ガイド確認済み');
    sbmLog_('Release1SetupStep2','Done','API guide confirmed');
    sbmShowRelease1SetupStep_(3);
    return true;
  }

  if (step === 3) {
    if (sbmGetSetting_('SetupBlogInfo','NO') !== 'YES') throw new Error('先にSTEP1を実行してください。');
    var result = sbmTestSearchConsoleConnection_();
    if (!result.ok) {
      sbmSetSetting_('ConnectionStatus','ERROR','Search Console接続失敗');
      sbmLog_('Release1SetupStep3','Error',result.message);
      throw new Error(sbmFriendlyGscError_(result.message));
    }
    sbmSetSetting_('ConnectionStatus','OK','Search Console接続成功');
    sbmSetSetting_('LastConnectionTestAt',sbmNowText_(),'最終接続テスト日時');
    sbmLog_('Release1SetupStep3','Done',sbmGetSetting_('SearchConsoleProperty',''));
    sbmShowRelease1SetupStep_(4);
    return true;
  }

  if (step === 4) {
    if (sbmGetSetting_('ConnectionStatus','') !== 'OK') throw new Error('先にSTEP3の接続テストを完了してください。');
    sbmBuildArticleDbOnePass_(true);
    sbmShowRelease1SetupStep_(5);
    return true;
  }

  if (step === 5) {
    if (String(sbmGetSetting_('ArticleDbUrlBuildComplete','NO')) !== 'YES') throw new Error('先にSTEP4の記事管理作成を完了してください。');
    var counts = sbmArticleDbInfoCompletionCounts_();
    if (counts.remaining > 0) {
      sbmSupplementArticleDbSetupChunk_(sbmGetArticleInfoBatch_(),true);
    }
    counts = sbmArticleDbInfoCompletionCounts_();
    if (counts.remaining > 0) {
      sbmShowRelease1SetupStep_(5);
    } else {
      sbmSetSetting_('ArticleInfoBuildComplete','YES','記事情報補完完了フラグ');
      sbmSetSetting_('ArticleInfoBuildStatus','完了','記事情報補完の状態');
      sbmShowRelease1SetupStep_(6);
    }
    return true;
  }

  if (step === 6) {
    sbmRefreshHome_();
    sbmOpenHome();
    return true;
  }

  throw new Error('不正なSTEPです。');
}

function sbmSkipRelease1SetupStep(step) {
  step = Number(step || 0);
  if (step >= 1 && step < 6) {
    sbmShowRelease1SetupStep_(step + 1);
  } else {
    sbmRefreshHome_();
    sbmOpenHome();
  }
  return true;
}

/* ---------- ブログ情報の変更 ---------- */

function sbmOpenBlogInfoChange() {
  var s = sbmRelease1SetupStatus_();
  var html = '<!doctype html><html><head><base target="_top"><meta charset="UTF-8">'
    + sbmRelease1WizardBaseCss_()
    + '</head><body><h2>ブログ情報の変更</h2>'
    + '<p>ブログ名だけの変更では記事管理や履歴を保持します。URLまたはSearch Consoleプロパティを変更した場合は、記事更新前に内容を確認してください。</p>'
    + '<div class="field"><label>ブログ名</label><input id="blogName" value="'+sbmEscapeHtml_(s.blogName)+'"></div>'
    + '<div class="field"><label>ブログURL</label><input id="blogUrl" value="'+sbmEscapeHtml_(s.blogUrl)+'"></div>'
    + '<div class="field"><label>Search Consoleプロパティ</label><input id="property" value="'+sbmEscapeHtml_(s.property)+'"></div>'
    + '<div id="msg"></div><div class="actions">'
    + '<button class="run" onclick="save()">保存</button><button class="end" onclick="google.script.host.close()">閉じる</button>'
    + '</div><script>'
    + 'function save(){document.querySelectorAll("button").forEach(function(b){b.disabled=true});'
    + 'google.script.run.withFailureHandler(function(e){document.getElementById("msg").textContent=(e&&e.message)?e.message:String(e);document.querySelectorAll("button").forEach(function(b){b.disabled=false});})'
    + '.withSuccessHandler(function(){google.script.host.close();}).sbmSaveBlogInfoChange({blogName:document.getElementById("blogName").value,blogUrl:document.getElementById("blogUrl").value,property:document.getElementById("property").value});}'
    + '</script></body></html>';
  SpreadsheetApp.getUi().showModalDialog(HtmlService.createHtmlOutput(html).setWidth(620).setHeight(570),'ブログ情報の変更');
}

function sbmSaveBlogInfoChange(payload) {
  payload = payload || {};
  var blogName = String(payload.blogName || '').trim();
  var blogUrl = String(payload.blogUrl || '').trim();
  var siteId = String(sbmGetSetting_('SiteID','') || '').trim() || sbmSiteIdFromUrl_(blogUrl);
  var siteName = blogName;
  var property = String(payload.property || '').trim();
  if (!blogName || !blogUrl || !property) throw new Error('すべての項目を入力してください。');
  sbmSetSetting_('BlogName',blogName,'管理するブログ名');
  sbmSetSetting_('BlogUrl',blogUrl,'ブログURL');
  sbmSetSetting_('SiteID',siteId,'SIMS製品間でサイトを識別するID');
  sbmSetSetting_('SiteName',siteName,'SIMS製品間で表示するサイト名');
  sbmSetSetting_('SearchConsoleProperty',property,'Search Console property');
  sbmSetSetting_('SetupBlogInfo','YES','ブログ情報登録済み');
  sbmRefreshHome_();
  return true;
}

/* ---------- 修復完了画面 ---------- */

function sbmShowRepairCompletionNavigator_() {
  var status = sbmDailyUpdateStatus_();
  var lastText = status.displayText === '未更新' ? '未実行' : status.displayText;
  var html = '<!doctype html><html><head><base target="_top"><meta charset="UTF-8">'
    + sbmRelease1WizardBaseCss_()
    + '</head><body><h2>シートの作成・修復が完了しました</h2>'
    + '<div class="box">✓ 必要なシート・見出し・表示書式を確認しました。<br>'
    + '✓ 今日の改善、改善の推移、記事管理、改善履歴を再表示しました。<br>'
    + '✓ Homeを最新状態へ更新し、Homeへ戻りました。<br>'
    + '最終更新日時：<b>'+sbmEscapeHtml_(lastText)+'</b></div>'
    + '<p>次の操作を選択してください。</p><div class="actions">'
    + '<button class="run" onclick="setup()">初回セットアップを開始</button>'
    + '<button class="skip" onclick="home()">そのまま使う</button>'
    + '<button class="end" onclick="google.script.host.close()">閉じる</button>'
    + '</div><script>'
    + 'function setup(){google.script.host.close();google.script.run.sbmStartInitialSetup();}'
    + 'function home(){google.script.host.close();google.script.run.sbmOpenHome();}'
    + '</script></body></html>';
  SpreadsheetApp.getUi().showModalDialog(HtmlService.createHtmlOutput(html).setWidth(540).setHeight(390),'シートの作成・修復');
}


/* ---------- Release 1 最終メニュー ---------- */

function sbmEnsureOfficialSchemaOnce_() {
  sbmEnsureSiteIdentity_();
  var legacyDaily = sbmGetLastSuccessfulDailyUpdateDate_();
  if (!sbmGetSetting_('LastSuccessfulDailyUpdateEpoch','') && legacyDaily) sbmSetSetting_('LastSuccessfulDailyUpdateEpoch', String(legacyDaily.getTime()), '旧版の最終更新日時から移行');
  var applied = String(sbmGetSetting_('OfficialSchemaVersion', '') || '');
  if (applied === SBM_OFFICIAL_SCHEMA_VERSION) return false;
  sbmMigrateArticleManagementSheet_();
  sbmMigrateEffectSheetName_();
  sbmApplyProduct5OfficialMeasurementSchema_();
  sbmSetSetting_('OfficialSchemaVersion', SBM_OFFICIAL_SCHEMA_VERSION, 'Product 5.4.1のシート構造バージョン');
  return true;
}


function sbmOpenImprovementStatus() {
  sbmUpdateEffectivenessSilent_();
  return sbmOpenEffectiveness();
}


function sbmOpenAllBlogArticles() {
  return sbmOpenArticleDb();
}

function sbmOpenImprovementTrend() {
  return sbmOpenImprovementHistory();
}

function sbmSortArticleDbBy_(key, label) {
  var sh = sbmGetOrCreateSheet_(SBM_SHEETS.ARTICLE_DB);
  if (sh.getLastRow() < 3) return sbmAlert_('記事一覧の並び替え', '並び替える記事がありません。');
  var heads = sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0];
  var values = sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).getValues();
  var idx = {};
  heads.forEach(function(h,i){ idx[String(h)] = i; });
  function num(v){ var n=Number(v); return isFinite(n)?n:0; }
  function text(v){ return String(v||''); }
  var rankOrder={'🏆 エース':1,'✅ 安定':2,'📈 成長':3,'🌱 育成':4,'⚠️ 低迷':5,'—':9,'':9};
  var workOrder={'🔥 今日の改善':1,'✏️ 改善中':2,'👀 モニター中':3,'未着手':4,'✔️ 完了':5,'':9};
  values.sort(function(a,b){
    if (key==='rank') return (rankOrder[text(a[idx['記事ランク']])]||99)-(rankOrder[text(b[idx['記事ランク']])]||99);
    if (key==='work') return (workOrder[text(a[idx['作業状態']])]||99)-(workOrder[text(b[idx['作業状態']])]||99);
    if (key==='clicks') return num(b[idx['クリック数']])-num(a[idx['クリック数']]);
    if (key==='impressions') return num(b[idx['表示回数']])-num(a[idx['表示回数']]);
    if (key==='ctr') return num(b[idx['CTR']])-num(a[idx['CTR']]);
    if (key==='position') { var av=num(a[idx['掲載順位']])||9999,bv=num(b[idx['掲載順位']])||9999; return av-bv; }
    if (key==='updated') return text(b[idx['最終取得日時']]).localeCompare(text(a[idx['最終取得日時']]));
    return 0;
  });
  sh.getRange(2,1,values.length,values[0].length).setValues(values);
  sh.showSheet();
  SpreadsheetApp.getActiveSpreadsheet().setActiveSheet(sh);
  sbmAlert_('記事一覧の並び替え', label + 'で並び替えました。');
}
function sbmSortArticlesByRank(){ return sbmSortArticleDbBy_('rank','記事ランク順'); }
function sbmSortArticlesByWork(){ return sbmSortArticleDbBy_('work','改善状態順'); }
function sbmSortArticlesByClicks(){ return sbmSortArticleDbBy_('clicks','クリック数の多い順'); }
function sbmSortArticlesByImpressions(){ return sbmSortArticleDbBy_('impressions','表示回数の多い順'); }
function sbmSortArticlesByCtr(){ return sbmSortArticleDbBy_('ctr','CTRの高い順'); }
function sbmSortArticlesByPosition(){ return sbmSortArticleDbBy_('position','掲載順位の高い順'); }
function sbmSortArticlesByUpdated(){ return sbmSortArticleDbBy_('updated','最終取得日時の新しい順'); }

function onOpen() {
  try {
    sbmEnsureOfficialSchemaOnce_();
  } catch (e) {
    try { sbmLog_('OnOpenOfficialSchema', 'Warning', String(e)); } catch (ignore) {}
  }

  var ui = SpreadsheetApp.getUi();

  // 製品管理メニューを最左翼に配置します。
  ui.createMenu('SIMS-Blog-Manager')
    .addItem('Homeを確認する','sbmOpenHome')
    .addSeparator()
    .addItem('日次処理を実行','sbmRunDailyUpdateManual')
    .addSeparator()
    .addItem('初回セットアップ','sbmStartInitialSetup')
    .addItem('ブログ情報を変更','sbmOpenBlogInfoChange')
    .addItem('記事情報を取得','sbmSupplementNewArticlesManual')
    .addItem('シートの作成・修復','sbmInitializeSheets')
    .addItem('設定を開く','sbmOpenUserSettings')
    .addSeparator()
    .addItem('セットアップ画面を開く','sbmOpenSetup')
    .addItem('バージョン情報','sbmShowVersionInfo')
    .addToUi();

  // 毎日の作業入口であることが伝わる名称にします。
  ui.createMenu('記事改善スタート')
    .addItem('今日の改善を開く','sbmOpenTodayImprovement')
    .addItem('選択記事の改善詳細を見る','sbmOpenSelectedImprovementNavi')
    .addSeparator()
    .addItem('次の2件を表示','sbmShowMoreTodayRecommendations')
    .addItem('初期2件に戻す','sbmResetTodayRecommendations')
    .addToUi();

  ui.createMenu('結果登録')
    .addItem('選択記事の改善結果を登録','sbmOpenImprovementFeedbackDialog')
    .addToUi();

  // 改善中の記事と4週間の測定状況をここへ統合します。
  ui.createMenu('推移確認')
    .addItem('改善の推移を開く','sbmOpenImprovementStatus')
    .addItem('最新データで更新','sbmUpdateEffectiveness')
    .addItem('選択記事の詳細を見る','sbmShowSelectedEffectDetail')
    .addToUi();

  ui.createMenu('記事一覧')
    .addItem('記事一覧を開く','sbmOpenAllBlogArticles')
    .addItem('選択記事の詳細を見る','sbmOpenSelectedArticleDbDetail')
    .addItem('選択記事の改善案を見る','sbmOpenSelectedImprovementNavi')
    .addSeparator()
    .addItem('記事ランク順','sbmSortArticlesByRank')
    .addItem('改善状態順','sbmSortArticlesByWork')
    .addItem('クリック数の多い順','sbmSortArticlesByClicks')
    .addItem('表示回数の多い順','sbmSortArticlesByImpressions')
    .addItem('CTRの高い順','sbmSortArticlesByCtr')
    .addItem('掲載順位の高い順','sbmSortArticlesByPosition')
    .addItem('最終取得日時の新しい順','sbmSortArticlesByUpdated')
    .addToUi();

  ui.createMenu('改善履歴')
    .addItem('改善履歴を開く','sbmOpenImprovementHistory')
    .addItem('選択した履歴の詳細を見る','sbmOpenSelectedHistoryDetail')
    .addItem('選択記事の全履歴を見る','sbmOpenSelectedHistoryArticleAll')
    .addToUi();

  // 配布版では開発者用メニューを生成しません。

  // Homeを描画・表示します。日次処理のダイアログは利用者がメニューから実行した場合だけ表示します。
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var home = ss.getSheetByName(SBM_SHEETS.HOME);
    if (home) {
      sbmRefreshHome_();
      home.showSheet();
      ss.setActiveSheet(home);
      home.activate();
      SpreadsheetApp.flush();
    }
  } catch (eHome) { try { sbmLog_('OnOpenHomeDisplay','Warning',String(eHome)); } catch(ignoreHome) {} sbmToast_('Homeの表示更新に失敗しました。System_Logを確認してください。','起動時エラー',8); }
  try { sbmEnsureTodayRecommendations_('open'); } catch (eToday) {}
}

