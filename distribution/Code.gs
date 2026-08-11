/**
 * SIMS-Blog-Manager Product 5.10.0 RC8
 * SIMS-Core Slim Edition for blog SEO improvement management.
 * End-user distribution file: paste this entire file into Code.gs/Code.js.
 */

const SBM_VERSION = '5.10.0-RC8';
// Product 5.10.0-RC8: staged health check + final Doctor UI + monitoring workflow baseline.
const QUERY_ROW_LIMIT = 200;
const SBM_OFFICIAL_SCHEMA_VERSION = 'p5-daily-status-v3';
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
  FEEDBACK_HISTORY: '改善履歴',
  DOCTOR_HEALTH_SNAPSHOT: 'Doctor_Health_Snapshot',
  DOCTOR_HEALTH_RECORD: 'Doctor_Health_Record',
  DOCTOR_TREATMENT_QUEUE: 'Doctor_治療待ち',
  DOCTOR_HEALTH_RUN: 'Doctor_Health_Run',
  DOCTOR_CASES: 'Doctor_Cases',
  PLATFORM_CASES: 'Platform_Cases',
  PLATFORM_TREATMENTS: 'Platform_Treatments',
  PLATFORM_EVENTS: 'Platform_Events',
  PLATFORM_ERRORS: 'Platform_Errors'
});

const SBM_HEADERS = Object.freeze({
  SETTINGS: ['Key', 'Value', 'Description', 'UpdatedAt'],
  USER_SETTINGS: ['設定項目','値','説明'],
  SYSTEM_LOG: ['CreatedAt', 'Action', 'Status', 'Detail'],
  QUERY_DATA: ['記事ステータス','記事タイトル','メインクエリ','クリック数','表示回数','CTR','平均順位','詳細','最終取得日時','記事URL','SEOタイトル（titleタグ）','メタディスクリプション'],
  ARTICLE_DB: ['選択','記事ランク','作業状態','記事URL','メインクエリ','H1タイトル','クリック数','表示回数','CTR','掲載順位','データ更新日','記事タイトル','詳細','SEOタイトル','メタディスクリプション','最終取得日時','元URL件数','除外理由','備考','ArticleID','記事情報補完済み','補完日時','補完エラー','記事ステータス','最終確認日','連続未取得日数','管理フラグ'],
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
  DOCTOR_HEALTH_SNAPSHOT: ['健康診断ID','サイトID','記事ID','記事URL','記事タイトル','SBM作業状態','管理フラグ','Doctor診断対象','対象外理由','精密診断順位','対象期間開始','対象期間終了','対象日数','180日クリック','180日表示','180日CTR','180日平均順位','前半90日クリック','前半90日表示','前半90日CTR','前半90日平均順位','後半90日クリック','後半90日表示','後半90日CTR','後半90日平均順位','直近28日クリック','直近28日表示','直近28日CTR','直近28日平均順位','前28日クリック','前28日表示','前28日CTR','前28日平均順位','一次検査コード','一次検査結果','詳細検査','優先度','診断の根拠','データ品質','取得状態','取得日時'],
  DOCTOR_HEALTH_RECORD: ['診断記録ID','健康診断ID','診断依頼ID','サイトID','記事ID','記事URL','記事タイトル','診断日','診断種別','内部診断コード','総合診断','記事の健康度','優先度','診断の確かさ','診断の根拠','おすすめの対応','再診予定日','紹介先','原文JSON'],
  DOCTOR_TREATMENT_QUEUE: ['優先順位','記事タイトル','記事URL','総合診断','おすすめの対応','紹介先','処置状態','再診予定日','診断日','記事ID','診断記録ID','内部優先度','内部紹介先','更新日時'],
  DOCTOR_HEALTH_RUN: ['健康診断ID','状態コード','現在の工程','対象期間開始','対象期間終了','対象記事数','処理済み件数','次の処理','最終成功日時','再試行回数','最終エラー','作成日時','更新日時'],
  DOCTOR_CASES: ['CaseID','サイトID','記事ID','記事URL','記事タイトル','状態コード','状態','診断ID','診断状態','主診断コード','優先度','治療アクション','治療レベル','紹介先','許可範囲','禁止範囲','再診予定日','Doctor結果JSON','Writer依頼JSON','Writer結果JSON','確認種別','確認結果','確認詳細','確認日時','再診依頼JSON','改善履歴ID','作成日時','更新日時'],
  PLATFORM_CASES: ['CaseID','RunID','SiteID','PrimaryArticleID','RelatedArticleIDs','CaseType','Status','Priority','WorkflowLock','DiagnosisID','CreatedAt','UpdatedAt','RawJSON'],
  PLATFORM_TREATMENTS: ['TreatmentRequestID','CaseID','ReferralID','TargetProduct','TreatmentType','SequenceNumber','DependsOn','Status','UserApprovalRequired','ResultID','RetryCount','CreatedAt','StartedAt','CompletedAt','RawJSON'],
  PLATFORM_EVENTS: ['EventID','CaseID','EventType','PreviousStatus','NewStatus','Actor','SourceMessageID','OccurredAt','DetailJSON'],
  PLATFORM_ERRORS: ['CreatedAt','CaseID','MessageID','ErrorCode','Severity','Recoverable','ContractName','FailedField','Message','RecommendedAction','RawJSON'],
  FEEDBACK_HISTORY: ['選択','改善日','記事タイトル','改善概要','改善経路','使用AI','1週','2週','3週','4週','最終判定','状態','1回目測定日時','1回目SIMS寸評','2回目測定日時','2回目SIMS寸評','3回目測定日時','3回目SIMS寸評','4回目測定日時','4回目SIMS寸評','最終総括','最終改善提案','ArticleID','記事URL','変更箇所','変更後タイトル','変更後SEOタイトル','変更後メタディスクリプション','メインクエリ','改善規模','確信度','期待CTR効果','期待クリック効果','次のアクション','維持した項目','作業時間（分）','注意事項','改善前クリック','改善前表示回数','改善前CTR','改善前順位','AI改善結果JSON','改善履歴ID','改善計画JSON','公開OK変更JSON','利用者判断変更JSON','変更サマリーJSON','Feedback Format','Writer Version']
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
  TODAY_INITIAL_DISPLAY: 5,
  TODAY_MAX_DISPLAY: 10,
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
  var props = PropertiesService.getDocumentProperties();
  function pv(key, fallback) {
    var v = props.getProperty(key);
    return v === null || v === '' ? sbmGetSetting_(key, fallback) : v;
  }
  var running = String(pv('DailyUpdateRunning','NO')) === 'YES';
  var startedEpoch = Number(pv('DailyUpdateStartedEpoch',0) || 0);
  var heartbeatEpoch = Number(pv('DailyUpdateHeartbeatEpoch',0) || 0);
  var stale = running && (!heartbeatEpoch || (Date.now() - heartbeatEpoch) > 7 * 60 * 1000);
  if (stale) {
    running = false;
    sbmPersistDailyRuntime_({
      DailyUpdateRunning:'NO', DailyUpdateContinuationRequired:'YES', DailyUpdateLastError:'',
      DailyUpdateActionMessage:'処理応答が停止したため安全停止しました。保存済みの工程から再開できます。下の「続きを実行」を押してください。'
    });
  }
  var daily = sbmDailyUpdateStatus_();
  var phase = String(pv('DailyUpdatePhase', running ? 'FETCH' : '') || '');
  var progress = Number(pv('DailyUpdateProgress', running ? 5 : (daily.completedToday ? 100 : 0)) || 0);
  var message = String(pv('DailyUpdateMessage','') || '');
  var actionRequired = String(pv('DailyUpdateActionRequired','NO')) === 'YES';
  var actionMessage = String(pv('DailyUpdateActionMessage','') || '');
  var continuationRequired = String(pv('DailyUpdateContinuationRequired','NO')) === 'YES';

  // 完了済みなのに古い実行中・続行待ちが残っている場合は完了状態を優先して自己修復します。
  if (daily.completedToday && (running || continuationRequired || phase !== 'DONE')) {
    running = false;
    continuationRequired = false;
    phase = 'DONE';
    progress = 100;
    message = '日次処理が完了しました。';
    sbmPersistDailyRuntime_({
      DailyUpdateRunning:'NO', DailyUpdateContinuationRequired:'NO', DailyUpdatePhase:'DONE',
      DailyUpdateProgress:'100', DailyUpdateMessage:message, DailyUpdateLastError:'',
      DailyUpdateActionRequired:'NO', DailyUpdateActionMessage:''
    });
  }
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
    error: String(pv('DailyUpdateLastError','') || ''),
    startedEpoch: startedEpoch,
    label: running ? '実行中' : (continuationRequired ? '続行待ち' : (phase === 'ERROR' ? 'エラー' : (daily.completedToday ? '本日完了' : '未実施')))
  };
}

function sbmPersistDailyRuntime_(values) {
  values = values || {};
  var props = PropertiesService.getDocumentProperties();
  var propertyValues = {};
  Object.keys(values).forEach(function(key) { propertyValues[key] = String(values[key] == null ? '' : values[key]); });
  if (Object.keys(propertyValues).length) props.setProperties(propertyValues, false);
  Object.keys(values).forEach(function(key) {
    try { sbmSetSetting_(key, propertyValues[key], '日次処理の実行状態'); } catch(ignore) {}
  });
}

function sbmDailyPhaseLabel_(phase) {
  var map = {FETCH:'Search Consoleからデータを取得しています',MERGE:'記事管理を更新しています',RECOMMEND:'改善候補と今日の改善を更新しています',FINALIZE:'Homeと完了状態を更新しています',DONE:'日次処理が完了しました',ERROR:'日次処理を継続できません'};
  return map[String(phase || '')] || '日次処理を準備しています';
}

function sbmSetDailyProgress_(phase, progress, message) {
  sbmPersistDailyRuntime_({
    DailyUpdatePhase:String(phase || ''),
    DailyUpdateProgress:String(Number(progress || 0)),
    DailyUpdateMessage:String(message || sbmDailyPhaseLabel_(phase)),
    DailyUpdateHeartbeatEpoch:String(Date.now())
  });
}

function sbmRepairDailySettingDuplicates_() {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SBM_SHEETS.SETTINGS);
  if (!sh || sh.getLastRow() < 2) return 0;
  var dailyKeys = {
    LastSuccessfulDailyUpdateEpoch:true, DailyUpdateRunning:true, DailyUpdateStartedEpoch:true,
    DailyUpdateLastError:true, DailyUpdatePhase:true, DailyUpdateProgress:true,
    DailyUpdateMessage:true, DailyUpdateHeartbeatEpoch:true, DailyUpdateContinuationRequired:true,
    DailyUpdateActionRequired:true, DailyUpdateActionMessage:true, DailyUpdateRawRows:true,
    DailyUpdateExcluded:true, DailyUpdateMergeResult:true
  };
  var values = sh.getRange(2,1,sh.getLastRow()-1,1).getValues();
  var seen = {}, deleteRows = [];
  for (var i = 0; i < values.length; i++) {
    var key = String(values[i][0] || '');
    if (!dailyKeys[key]) continue;
    if (seen[key]) deleteRows.push(i + 2);
    else seen[key] = true;
  }
  deleteRows.sort(function(a,b){ return b-a; }).forEach(function(row){ sh.deleteRow(row); });
  if (deleteRows.length) sbmLog_('DailySettings','Repair','duplicate keys removed=' + deleteRows.length);
  return deleteRows.length;
}

function sbmDailyCompletionResult_() {
  var startedEpoch = Number(sbmGetSetting_('DailyUpdateStartedEpoch',0) || 0);
  var elapsedSec = startedEpoch > 0 ? Math.max(0, Math.round((Date.now() - startedEpoch) / 1000)) : 0;
  var rawRows = Number(sbmGetSetting_('DailyUpdateRawRows',0) || 0);
  var merge = {};
  try { merge = JSON.parse(String(sbmGetSetting_('DailyUpdateMergeResult','{}') || '{}')); } catch(ignore) {}
  var updated = Number(merge.updated || 0) + Number(merge.added || 0);
  if (!updated) updated = rawRows;
  var todayCount = Number(sbmGetSetting_('TodayWorkCount',0) || 0);
  return {
    ok:true, running:false, completedToday:true, phase:'DONE', progress:100,
    message:'日次処理が完了しました。', updatedArticles:updated,
    recommendationCount:todayCount, elapsedSeconds:elapsedSec,
    displayText:sbmJapaneseDateTimeText_(new Date())
  };
}

function sbmDailyFetchStageStatus_() {
  var epoch = Number(sbmGetSetting_('DailyFetchStageCompletedEpoch', 0) || 0);
  var d = epoch > 0 ? new Date(epoch) : null;
  var today = sbmDateText_(new Date());
  var completedToday = !!d && sbmDateText_(d) === today;
  return {
    completedToday: completedToday,
    completedAt: d,
    rawRows: Number(sbmGetSetting_('DailyFetchStageRawRows', 0) || 0),
    validRows: Number(sbmGetSetting_('DailyFetchStageValidRows', 0) || 0),
    excluded: Number(sbmGetSetting_('DailyFetchStageExcluded', 0) || 0),
    elapsedSeconds: Number(sbmGetSetting_('DailyFetchStageElapsedSeconds', 0) || 0)
  };
}

/**
 * Product 5.6.5
 * 日次処理を、利用者には一連の処理として見せながら、サーバー側では
 * STEP 1（Search Console取得）、STEP 2（分析・記事DB更新）、STEP 3（効果測定・完了確定）に分割します。
 * 定期ポーリングは使用せず、各STEPの成功後に次のSTEPを一度だけ呼び出します。
 */
function sbmOpenDailyUpdateDialog() {
  var activeHealth = sbmDoctorGetHealthRun_();
  if (activeHealth && activeHealth.healthCheckId && activeHealth.statusCode !== 'COMPLETED') {
    return sbmAlert_('日次処理を実行できません', 'ブログ健康診断が進行中です。健康診断が完了してから日次処理を実行してください。\n\n別ブログで同時に重い処理を行うことも、Google スプレッドシート側の負荷を高めるため避けてください。');
  }
  if (!sbmIsSetupComplete_() || String(sbmGetSetting_('ConnectionStatus','')) !== 'OK') {
    return sbmAlert_('日次処理を実行できません', '初回セットアップとSearch Console接続テストを完了してください。');
  }

  var state = sbmDailyUpdateStatus_();
  var initial = state.completedToday
    ? '本日の日次処理は完了しています。\n\n再実行する場合は「実行する」を押してください。'
    : '本日の日次処理は未実施です。\n\n「実行する」を押すと処理を開始します。';

  var html = '<!DOCTYPE html><html><head><base target="_top"><style>'
    + 'body{font-family:Arial,"Noto Sans JP",sans-serif;padding:18px;color:#202124}h2{color:#0b8043;margin:0 0 12px}'
    + '.box{background:#f8f9fa;border-left:5px solid #0b8043;padding:13px 15px;margin:10px 0;line-height:1.55;white-space:pre-wrap}'
    + '.note{font-size:13px;color:#5f6368;line-height:1.6}.buttons{display:flex;gap:10px;justify-content:flex-end;margin-top:20px}'
    + 'button{border:0;border-radius:6px;padding:10px 18px;font-weight:700;cursor:pointer}.run{background:#0b8043;color:white}.close{background:#f1f3f4}'
    + '.spinner{display:none;width:42px;height:42px;border:5px solid #dfe7df;border-top-color:#0b8043;border-radius:50%;animation:spin .9s linear infinite;margin:22px auto}'
    + '@keyframes spin{to{transform:rotate(360deg)}}.error{color:#b3261e;border-left-color:#b3261e}.done{color:#0b8043;border-left-color:#0b8043}'
    + '.result{margin-top:8px}.group{margin-top:10px;padding-top:8px;border-top:1px solid #e0e0e0}.group:first-child{border-top:0;margin-top:6px;padding-top:0}.groupTitle{font-size:13px;font-weight:700;color:#0b8043;margin-bottom:5px}.resultGrid{display:grid;grid-template-columns:1fr auto;gap:3px 18px;font-size:14px;line-height:1.35}.resultGrid b{text-align:right}.groupNote{margin-top:7px;font-size:11px;line-height:1.45;color:#5f6368}'
    + '.stage{font-weight:700;color:#0b8043;margin-bottom:6px}</style></head><body>'
    + '<h2>日次処理</h2>'
    + '<div id="message" class="box">' + sbmEscapeHtml_(initial) + '</div>'
    + '<div id="spinner" class="spinner"></div>'
    + '<p id="note" class="note">Search Consoleデータ取得後、分析・記事DB更新、改善の推移更新へ自動的に進みます。</p>'
    + '<div class="buttons"><button id="cancelBtn" class="close" onclick="closeDialog()">キャンセル</button><button id="runBtn" class="run" onclick="startDaily()">実行する</button></div>'
    + '<script>'
    + 'var terminal=false;function el(id){return document.getElementById(id);}function closeDialog(){terminal=true;google.script.host.close();}'
    + 'function formatTime(sec){sec=Math.max(0,Number(sec||0));var m=Math.floor(sec/60),s=Math.round(sec%60);return (m?m+"分":"")+s+"秒";}'
    + 'function showRunning(title,text){if(terminal)return;el("spinner").style.display="block";el("message").className="box";el("message").innerHTML="<div class=stage>"+title+"</div>"+text;el("note").textContent="処理中です。完了までこの画面を閉じずにお待ちください。";}'
    + 'function showFailure(prefix,e,retry){if(terminal)return;el("spinner").style.display="none";el("message").className="box error";el("message").textContent=prefix+String.fromCharCode(10,10)+((e&&e.message)?e.message:String(e));el("cancelBtn").textContent="閉じる";el("cancelBtn").style.display="inline-block";if(retry){el("runBtn").textContent="再実行する";el("runBtn").disabled=false;el("runBtn").style.display="inline-block";}}'
    + 'function startDaily(){terminal=false;el("runBtn").disabled=true;el("runBtn").style.display="none";el("cancelBtn").style.display="none";showRunning("STEP 1 / 3　Search Consoleデータ取得中","Search Consoleから最新のページデータを取得しています。");google.script.run.withFailureHandler(function(e){showFailure("Search Consoleデータの取得に失敗しました。",e,true);}).withSuccessHandler(function(fetch){if(terminal)return;showRunning("STEP 2 / 3　データ分析・記事DB更新中","取得したデータを分析し、記事DBと記事ランクを更新しています。");google.script.run.withFailureHandler(function(e){showFailure("データ分析・記事DB更新に失敗しました。",e,true);}).withSuccessHandler(function(){if(terminal)return;showRunning("STEP 3 / 3　改善の推移・完了処理中","改善後の推移を更新し、日次処理の完了状態を確定しています。");google.script.run.withFailureHandler(function(e){showFailure("改善の推移・完了処理に失敗しました。",e,true);}).withSuccessHandler(function(r){showComplete(r||{});}).sbmRunDailyFinalizeStageFromDialog();}).sbmRunDailyAnalysisStageFromDialog();}).sbmRunDailyFetchStageFromDialog();}'
    + 'function showComplete(r){if(terminal)return;terminal=true;var updated=Math.max(0,Number(r.updated||0)),added=Math.max(0,Number(r.added||0)),total=Math.max(0,Number(r.total||0)),outside=Math.max(0,total-updated-added);el("spinner").style.display="none";el("message").className="box done";el("message").innerHTML="✓ 日次処理が完了しました。<div class=result><div class=group><div class=groupTitle>Search Console</div><div class=resultGrid><span>取得行</span><b>"+Number(r.rawRows||0).toLocaleString()+"件</b><span>有効な記事URL</span><b>"+Number(r.validRows||0).toLocaleString()+"件</b></div></div><div class=group><div class=groupTitle>記事DB</div><div class=resultGrid><span>更新記事</span><b>"+updated.toLocaleString()+"件</b><span>更新対象外</span><b>"+outside.toLocaleString()+"件</b><span>新規記事</span><b>"+added.toLocaleString()+"件</b><span>総記事数</span><b>"+total.toLocaleString()+"件</b></div><div class=groupNote>※更新対象外：今回のSearch Consoleデータ取得で対象とならなかった記事です。</div></div><div class=group><div class=groupTitle>改善効果</div><div class=resultGrid><span>モニタ中</span><b>"+Number(r.monitoringCount||0).toLocaleString()+"件</b></div></div><div class=group><div class=groupTitle>処理時間</div><div class=resultGrid><span>Search Console取得</span><b>"+formatTime(r.fetchElapsedSeconds)+"</b><span>分析・処理</span><b>"+formatTime(r.analysisElapsedSeconds)+"</b><span>全体所要時間</span><b>"+formatTime(r.totalElapsedSeconds)+"</b></div></div></div>";el("note").textContent="結果を確認して「閉じる」を押してください。";el("cancelBtn").textContent="閉じる";el("cancelBtn").style.display="inline-block";}'
    + '</script></body></html>';
  SpreadsheetApp.getUi().showModalDialog(HtmlService.createHtmlOutput(html).setWidth(620).setHeight(790), '日次処理');
}

function sbmGetDailyUpdateClientStatus() {
  return sbmDailyUpdateStatus_();
}

function sbmRunDailyUpdateFromDialog() {
  return sbmRunDailyFetchStageFromDialog();
}

/** STEP 1: Search Consoleデータを取得し、非表示の作業シートへ保存します。 */
function sbmRunDailyFetchStageFromDialog() {
  var lock = LockService.getDocumentLock();
  if (!lock.tryLock(3000)) throw new Error('別の処理が実行中です。しばらく待ってから再度お試しください。');
  var started = new Date();
  var startedText = sbmNowText_();
  var profiler = sbmCreateProfiler_('日次処理 STEP1 Search Console取得');
  try {
    sbmPersistDailyRuntime_({DailyUpdateRunning:'YES',DailyUpdateContinuationRequired:'NO',DailyUpdatePhase:'FETCH',DailyUpdateProgress:'10',DailyUpdateMessage:'Search Consoleからデータを取得しています。',DailyUpdateStartedEpoch:String(started.getTime()),DailyUpdateHeartbeatEpoch:String(Date.now()),DailyUpdateLastError:''});
    try { sbmRefreshHome_(); SpreadsheetApp.flush(); } catch(ignoreHomeStart) {}
    sbmClearDailyWork_();
    sbmSetSetting_('DailyStepFlowStartedEpoch', String(started.getTime()), '日次処理STEP方式の開始日時');
    var result = sbmFetchSearchConsolePageRowsForArticleDb_(profiler);
    sbmWriteDailyWorkRows_(result.rows || []);
    var elapsed = sbmSecondsSince_(started);
    sbmSetSetting_('DailyFetchStageCompletedEpoch', String(Date.now()), '日次処理STEP1のSearch Console取得完了日時');
    sbmSetSetting_('DailyFetchStageRawRows', String(result.rawRows || 0), '日次処理STEP1のSearch Console取得行数');
    sbmSetSetting_('DailyFetchStageValidRows', String((result.rows || []).length), '日次処理STEP1の有効記事URL数');
    sbmSetSetting_('DailyFetchStageExcluded', String(result.excluded || 0), '日次処理STEP1の除外件数');
    sbmSetSetting_('DailyFetchStageElapsedSeconds', String(elapsed), '日次処理STEP1の所要時間（秒）');
    sbmProcessLog_('日次処理 STEP1 Search Console取得', '完了', result.rawRows || 0, (result.rows || []).length, elapsed,
      '除外 ' + Number(result.excluded || 0) + '件 / 作業シート保存 / ProfileRunId ' + profiler.runId, startedText, sbmNowText_());
    return {ok:true, rawRows:Number(result.rawRows || 0), validRows:Number((result.rows || []).length), excluded:Number(result.excluded || 0), elapsedSeconds:Number(elapsed || 0)};
  } catch(e) {
    var elapsedErr = sbmSecondsSince_(started);
    sbmPersistDailyRuntime_({DailyUpdateRunning:'NO',DailyUpdatePhase:'ERROR',DailyUpdateLastError:String(e),DailyUpdateMessage:'Search Consoleデータの取得に失敗しました。'});
    sbmProcessLog_('日次処理 STEP1 Search Console取得', 'エラー', '', '', elapsedErr, String(e), startedText, sbmNowText_());
    throw e;
  } finally {
    lock.releaseLock();
  }
}

/** STEP 2: 保存済みデータを分析し、記事DB・記事ランク・改善候補・今日の改善を更新します。 */
function sbmRunDailyAnalysisStageFromDialog() {
  var lock = LockService.getDocumentLock();
  if (!lock.tryLock(3000)) throw new Error('別の処理が実行中です。しばらく待ってから再度お試しください。');
  var started = new Date();
  var startedText = sbmNowText_();
  try {
    sbmSetDailyProgress_('MERGE',45,'取得したデータを分析し、記事DBと記事ランクを更新しています。');
    var rows = sbmReadDailyWorkRows_();
    if (!rows.length) throw new Error('Search Console取得データが見つかりません。日次処理を最初から再実行してください。');

    var mergeResult = sbmMergeArticleDbDaily_(rows);
    var candidates = sbmSelectTodayRecommendations_();
    var candidateCount = candidates.length;
    var displayedCount = 0;
    if (candidateCount > 0) {
      displayedCount = Math.min(sbmGetTodayDisplayCount_(), candidateCount);
      sbmSetSetting_('TodayRecommendationJson', JSON.stringify(candidates), '日次処理で作成した今日の改善候補');
      sbmSetSetting_('DisplayedImprovementCount', String(displayedCount), '今日の改善の初期表示件数');
      sbmWriteTodayRecommendations_(candidates, displayedCount);
      sbmApplyTodayWorkState_(candidates, displayedCount);
    } else {
      sbmBuildTodayImprovementSheet_();
      sbmSetSetting_('TodayRecommendationJson', '[]', '日次処理で改善候補なし');
      sbmSetSetting_('DisplayedImprovementCount', '0', '今日の改善の表示件数');
    }

    sbmSetSetting_('LastArticleDbRows', String(mergeResult.total || 0), '記事DBの直近行数');
    sbmSetSetting_('LastArticleDbExcluded', String(sbmGetSetting_('DailyFetchStageExcluded', 0) || 0), '日次処理で除外したURL数');
    sbmSetSetting_('LastArticleDbRawRows', String(sbmGetSetting_('DailyFetchStageRawRows', 0) || 0), '日次処理のSearch Console元行数');
    var analysisElapsed = sbmSecondsSince_(started);
    var flowStarted = Number(sbmGetSetting_('DailyStepFlowStartedEpoch', started.getTime()) || started.getTime());
    var totalElapsed = Math.max(0, Math.round((Date.now() - flowStarted) / 1000));
    var fetchElapsed = Number(sbmGetSetting_('DailyFetchStageElapsedSeconds', 0) || 0);
    var rawRows = Number(sbmGetSetting_('DailyFetchStageRawRows', 0) || 0);
    var validRows = Number(sbmGetSetting_('DailyFetchStageValidRows', rows.length) || rows.length);
    var excluded = Number(sbmGetSetting_('DailyFetchStageExcluded', 0) || 0);

    sbmSetSetting_('DailyAnalysisStageElapsedSeconds', String(analysisElapsed), '日次処理STEP2の所要時間（秒）');
    sbmSetSetting_('DailyTotalElapsedSeconds', String(totalElapsed), '日次処理全体の所要時間（秒）');
    sbmProcessLog_('日次処理 STEP2 分析・記事DB更新', '完了', validRows, mergeResult.total, analysisElapsed,
      '既存更新 ' + mergeResult.updated + '件 / 新規追加 ' + mergeResult.added + '件 / 改善候補 ' + candidateCount + '件 / 今日の改善 ' + displayedCount + '件 / 全体 ' + totalElapsed + '秒', startedText, sbmNowText_());
    var stage2Summary = {
      rawRows:rawRows, validRows:validRows, excluded:excluded,
      updated:Number(mergeResult.updated || 0), added:Number(mergeResult.added || 0), total:Number(mergeResult.total || 0),
      needsReview:Number(mergeResult.needsReview || 0), candidateCount:Number(candidateCount || 0), displayedCount:Number(displayedCount || 0),
      fetchElapsedSeconds:fetchElapsed, analysisElapsedSeconds:Number(analysisElapsed || 0)
    };
    sbmSetSetting_('DailyStage2SummaryJson', JSON.stringify(stage2Summary), '日次処理STEP2の集計結果');
    sbmSetDailyProgress_('FINALIZE',85,'改善の推移を更新し、完了状態を確定しています。');

    return {
      ok:true, rawRows:rawRows, validRows:validRows, excluded:excluded,
      updated:Number(mergeResult.updated || 0), added:Number(mergeResult.added || 0), total:Number(mergeResult.total || 0),
      needsReview:Number(mergeResult.needsReview || 0), candidateCount:Number(candidateCount || 0), displayedCount:Number(displayedCount || 0),
      fetchElapsedSeconds:fetchElapsed, analysisElapsedSeconds:Number(analysisElapsed || 0), totalElapsedSeconds:Number(totalElapsed || 0)
    };
  } catch(e) {
    var elapsedErr = sbmSecondsSince_(started);
    sbmPersistDailyRuntime_({DailyUpdateRunning:'NO',DailyUpdatePhase:'ERROR',DailyUpdateLastError:String(e),DailyUpdateMessage:'データ分析・記事DB更新に失敗しました。'});
    sbmProcessLog_('日次処理 STEP2 分析・記事DB更新', 'エラー', '', '', elapsedErr, String(e), startedText, sbmNowText_());
    throw e;
  } finally {
    lock.releaseLock();
  }
}


/** STEP 3: 改善の推移を更新し、全工程成功後に日次処理を完了確定します。 */
function sbmRunDailyFinalizeStageFromDialog() {
  var lock = LockService.getDocumentLock();
  if (!lock.tryLock(3000)) throw new Error('別の処理が実行中です。しばらく待ってから再度お試しください。');
  var started = new Date();
  var startedText = sbmNowText_();
  try {
    sbmSetDailyProgress_('FINALIZE',90,'改善の推移を更新し、日次処理の完了状態を確定しています。');
    var effectRows = 0;
    var measurementRecorded = 0;
    var beforeHistory = sbmRowsAsObjects_(SBM_SHEETS.FEEDBACK_HISTORY) || [];
    var beforeCount = beforeHistory.reduce(function(total,h){ return total + sbmHistoryMeasurementState_(h).count; }, 0);
    effectRows = Number(sbmUpdateEffectivenessSilent_() || 0);
    var afterHistory = sbmRowsAsObjects_(SBM_SHEETS.FEEDBACK_HISTORY) || [];
    var afterCount = afterHistory.reduce(function(total,h){ return total + sbmHistoryMeasurementState_(h).count; }, 0);
    measurementRecorded = Math.max(0, afterCount - beforeCount);
    var monitoringCount = afterHistory.reduce(function(total,h){
      return total + (sbmHistoryMeasurementState_(h).complete ? 0 : 1);
    }, 0);

    var summary = {};
    try { summary = JSON.parse(String(sbmGetSetting_('DailyStage2SummaryJson','{}') || '{}')); } catch(ignoreSummary) {}
    var completedAt = new Date();
    sbmMarkDailyUpdateCompleted_(completedAt);
    sbmPersistDailyRuntime_({DailyUpdateRunning:'NO',DailyUpdateContinuationRequired:'NO',DailyUpdatePhase:'DONE',DailyUpdateProgress:'100',DailyUpdateMessage:'日次処理が完了しました。',DailyUpdateHeartbeatEpoch:String(Date.now()),DailyUpdateLastError:''});
    try { sbmRefreshHome_(); SpreadsheetApp.flush(); } catch(eHome) { sbmLog_('DailyHomeRefresh','Warning',String(eHome)); }

    var finalizeElapsed = sbmSecondsSince_(started);
    var flowStarted = Number(sbmGetSetting_('DailyStepFlowStartedEpoch', started.getTime()) || started.getTime());
    var totalElapsed = Math.max(0, Math.round((Date.now() - flowStarted) / 1000));
    sbmSetSetting_('DailyFinalizeStageElapsedSeconds', String(finalizeElapsed), '日次処理STEP3の所要時間（秒）');
    sbmSetSetting_('DailyTotalElapsedSeconds', String(totalElapsed), '日次処理全体の所要時間（秒）');
    sbmProcessLog_('日次処理 STEP3 改善の推移・完了処理', '完了', effectRows, measurementRecorded, finalizeElapsed,
      '改善の推移 ' + effectRows + '件 / 今回測定 ' + measurementRecorded + '件 / 全体 ' + totalElapsed + '秒', startedText, sbmNowText_());
    sbmClearDailyWork_();

    summary.ok = true;
    summary.effectRows = effectRows;
    summary.measurementRecorded = measurementRecorded;
    summary.monitoringCount = Number(monitoringCount || 0);
    summary.finalizeElapsedSeconds = Number(finalizeElapsed || 0);
    summary.totalElapsedSeconds = Number(totalElapsed || 0);
    return summary;
  } catch(e) {
    var elapsedErr = sbmSecondsSince_(started);
    sbmPersistDailyRuntime_({DailyUpdateRunning:'NO',DailyUpdatePhase:'ERROR',DailyUpdateLastError:String(e),DailyUpdateMessage:'日次処理の完了処理に失敗しました。'});
    sbmProcessLog_('日次処理 STEP3 改善の推移・完了処理', 'エラー', '', '', elapsedErr, String(e), startedText, sbmNowText_());
    throw e;
  } finally {
    lock.releaseLock();
  }
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
    while (sbmSecondsSince_(started) < 215) {
      var phase = String(sbmGetSetting_('DailyUpdatePhase','FETCH') || 'FETCH');
      if (phase === 'FETCH') {
        sbmLog_('DailyPhase','Start','FETCH');
        sbmSetDailyProgress_('FETCH',10,'Search Consoleからページデータを取得しています。');
        var profiler = sbmCreateProfiler_('日次処理 Search Console取得');
        var result = sbmFetchSearchConsolePageRowsForArticleDb_(profiler);
        sbmWriteDailyWorkRows_(result.rows);
        sbmSetSetting_('DailyUpdateRawRows',String(result.rawRows),'日次処理で取得した元行数');
        sbmSetSetting_('DailyUpdateExcluded',String(result.excluded),'日次処理で除外したURL数');
        sbmLog_('DailyPhase','Done','FETCH rows=' + result.rows.length + ' raw=' + result.rawRows);
        sbmSetDailyProgress_('MERGE',45,'Search Consoleデータの取得が完了しました。記事管理を更新しています。');
        continue;
      }
      if (phase === 'MERGE') {
        sbmLog_('DailyPhase','Start','MERGE');
        var freshRows = sbmReadDailyWorkRows_();
        var mergeResult = sbmMergeArticleDbDaily_(freshRows);
        sbmSetSetting_('DailyUpdateMergeResult',JSON.stringify(mergeResult),'日次処理の差分更新結果');
        sbmLog_('DailyPhase','Done','MERGE ' + JSON.stringify(mergeResult));
        sbmSetDailyProgress_('RECOMMEND',75,'記事管理を更新しました。改善候補と今日の改善を作成しています。');
        continue;
      }
      if (phase === 'RECOMMEND') {
        sbmLog_('DailyPhase','Start','RECOMMEND');
        try { sbmEnsureTodayRecommendations_('daily'); } catch (eToday) { sbmLog_('DailyTodayDefault','Warning',String(eToday)); }
        sbmLog_('DailyPhase','Done','RECOMMEND');
        sbmSetDailyProgress_('FINALIZE',90,'改善候補を更新しました。Homeと完了状態を更新しています。');
        continue;
      }
      if (phase === 'FINALIZE') {
        sbmLog_('DailyPhase','Start','FINALIZE');
        var completedAt = new Date();
        sbmRepairDailySettingDuplicates_();
        sbmMarkDailyUpdateCompleted_(completedAt);
        var savedEpoch = Number(sbmGetSetting_('LastSuccessfulDailyUpdateEpoch',0) || 0);
        if (!savedEpoch || Math.abs(savedEpoch - completedAt.getTime()) > 1000) throw new Error('日次処理の完了日時を保存できませんでした。もう一度実行してください。');
        sbmPersistDailyRuntime_({DailyUpdateRunning:'NO',DailyUpdateContinuationRequired:'NO'});
        sbmSetSetting_('DailyUpdateActionRequired','NO','利用者操作が必要か');
        sbmSetSetting_('DailyUpdateActionMessage','','利用者へ案内する操作内容');
        sbmSetDailyProgress_('DONE',100,'日次処理が完了しました。');
        sbmClearDailyWork_();
        try { sbmRefreshHome_(); SpreadsheetApp.flush(); } catch(eHome) { sbmLog_('DailyHomeRefresh','Warning',String(eHome)); }
        return sbmDailyCompletionResult_();
      }
      if (phase === 'DONE') return sbmDailyCompletionResult_();
      throw new Error('不明な日次処理フェーズです: ' + phase);
    }
    sbmPersistDailyRuntime_({DailyUpdateRunning:'NO',DailyUpdateContinuationRequired:'YES'});
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
  return sbmShowAsyncProgressDialog_({title:'記事情報を取得しています',description:'新しく見つかった記事のタイトル・SEO情報・メインクエリを順番に確認しています。',worker:'sbmSupplementNewArticlesWorker_',steps:['対象記事を確認','記事タイトル・SEO情報を取得','メインクエリを確認','記事管理へ反映']});
}
function sbmSupplementNewArticlesWorker_() {
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
  sbmToast_('今回 ' + processed + '件を処理し、' + success + '件の情報を取得しました。','記事情報取得',6);
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
    FEEDBACK_HISTORY: SBM_SHEETS.FEEDBACK_HISTORY,
    DOCTOR_HEALTH_SNAPSHOT: SBM_SHEETS.DOCTOR_HEALTH_SNAPSHOT,
    DOCTOR_HEALTH_RECORD: SBM_SHEETS.DOCTOR_HEALTH_RECORD,
    DOCTOR_TREATMENT_QUEUE: SBM_SHEETS.DOCTOR_TREATMENT_QUEUE,
    DOCTOR_HEALTH_RUN: SBM_SHEETS.DOCTOR_HEALTH_RUN
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
  [SBM_SHEETS.HOME, SBM_SHEETS.ARTICLE_DB, SBM_SHEETS.TODAY, SBM_SHEETS.PROCESS_LOG, SBM_SHEETS.PROFILE_LOG, SBM_SHEETS.SETUP, SBM_SHEETS.LOG, SBM_SHEETS.SETTINGS, SBM_SHEETS.USER_SETTINGS, SBM_SHEETS.SYSTEM_LOG, SBM_SHEETS.DOCTOR_HEALTH_SNAPSHOT, SBM_SHEETS.DOCTOR_HEALTH_RECORD, SBM_SHEETS.DOCTOR_TREATMENT_QUEUE, SBM_SHEETS.DOCTOR_HEALTH_RUN].forEach(function(n){ keep[n] = true; });
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
  sbmSetSettingIfEmpty_('TodayDisplayCount', SBM_DEFAULTS.TODAY_INITIAL_DISPLAY, '今日の改善に表示する件数。1～10');
  sbmSetSettingIfEmpty_('TodayInitialDisplayCount', SBM_DEFAULTS.TODAY_INITIAL_DISPLAY, '旧版互換。今日の改善表示件数');
  sbmSetSettingIfEmpty_('TodayMaxDisplayCount', SBM_DEFAULTS.TODAY_MAX_DISPLAY, '旧版互換。改善候補保持上限');
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
  var todayDisplay = validInt_(previous['今日の改善表示件数'], 1, 10,
    validInt_(sbmGetSetting_('TodayDisplayCount', SBM_DEFAULTS.TODAY_INITIAL_DISPLAY), 1, 10, SBM_DEFAULTS.TODAY_INITIAL_DISPLAY));
  var candidateLimit = validInt_(previous['改善候補抽出件数'], 10, 10,
    validInt_(sbmGetSetting_('AnalysisCandidateLimit', SBM_DEFAULTS.ANALYSIS_CANDIDATE_LIMIT), 10, 10, SBM_DEFAULTS.ANALYSIS_CANDIDATE_LIMIT));
  var searchDays = validInt_(previous['Search Console取得期間（日）'], 7, 365,
    validInt_(sbmGetSetting_('SearchDays', SBM_DEFAULTS.SEARCH_DAYS), 7, 365, SBM_DEFAULTS.SEARCH_DAYS));

  sh.clear();
  sh.getRange(1,1,5,3).setValues([
    SBM_HEADERS.USER_SETTINGS,
    ['記事情報補完件数', articleBatch, '初回セットアップで1回に補完する記事数。30～100の整数（推奨50件）'],
    ['今日の改善表示件数', todayDisplay, '保持済みの改善候補10件から今日の改善に表示する件数。1～10の整数（初期値5件）'],
    ['改善候補抽出件数', candidateLimit, '記事DBから保持する改善候補数。10件固定'],
    ['Search Console取得期間（日）', searchDays, 'ページ指標を集計する期間。7～365日の整数（推奨90日）']
  ]);

  function intRule_(min, max) {
    return SpreadsheetApp.newDataValidation().requireNumberBetween(min, max).setAllowInvalid(false)
      .setHelpText(min + '～' + max + 'の整数を入力してください。').build();
  }
  sh.getRange('B2').setDataValidation(intRule_(30,100));
  sh.getRange('B3').setDataValidation(intRule_(1,10));
  sh.getRange('B4').setDataValidation(intRule_(10,10));
  sh.getRange('B5').setDataValidation(intRule_(7,365));
  sh.getRange('B2:B5').setNumberFormat('0');
  sh.setFrozenRows(1);
  sh.setColumnWidth(1, 250); sh.setColumnWidth(2, 120); sh.setColumnWidth(3, 650);
  sh.getRange('A1:C1').setBackground('#0b8043').setFontColor('#ffffff').setFontWeight('bold');
  sh.getRange('A1:C5').setBorder(true,true,true,true,true,true).setVerticalAlignment('middle').setWrap(true);
  sh.getRange('B2:B5').setBackground('#fff2cc').setFontWeight('bold').setHorizontalAlignment('center');

  sbmSetSetting_('ArticleInfoBatch', articleBatch, '記事情報補完の1回あたり件数。30～100');
  sbmSetSetting_('TodayDisplayCount', todayDisplay, '今日の改善に表示する件数。1～10');
  sbmSetSetting_('TodayInitialDisplayCount', todayDisplay, '旧版互換。今日の改善表示件数');
  sbmSetSetting_('QueueLimit', todayDisplay, '旧版互換。今日の改善表示件数');
  sbmSetSetting_('TodayMaxDisplayCount', 10, '旧版互換。改善候補保持上限');
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

function sbmGetTodayDisplayCount_() {
  var legacy = sbmGetSetting_('TodayInitialDisplayCount', SBM_DEFAULTS.TODAY_INITIAL_DISPLAY);
  var n = sbmNumber_(sbmGetSetting_('TodayDisplayCount', legacy)) || SBM_DEFAULTS.TODAY_INITIAL_DISPLAY;
  n = Math.max(1, Math.min(10, Math.floor(n)));
  sbmSetSetting_('TodayDisplayCount', String(n), '今日の改善に表示する件数。1～10');
  return n;
}

// 旧関数名は互換用に残します。
function sbmGetTodayInitialDisplayCount_() { return sbmGetTodayDisplayCount_(); }
function sbmGetTodayMaxDisplayCount_() { return SBM_DEFAULTS.TODAY_MAX_DISPLAY; }
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
  sh.getRange('E14:H14').merge().setValue('モニター中の記事｜推移');
  var left = [['今日の改善','0件'],['モニター中','0件'],['未取得記事','0件'],['改善確認完了','0件'],['','']];
  for (var i=0;i<5;i++) {
    var r=15+i;
    sh.getRange(r,1,1,2).merge().setValue(left[i][0]);
    sh.getRange(r,3,1,2).merge().setValue(left[i][1]);
  }
  var monitorLabels = [
    ['測定待ち','データ不足'],
    ['経過観察','改善傾向'],
    ['改善','大きく改善'],
    ['要確認','見直し候補'],
    ['変化小','元に戻す検討']
  ];
  for (var j=0;j<monitorLabels.length;j++) {
    var rr=15+j;
    sh.getRange(rr,5).setValue(monitorLabels[j][0]); sh.getRange(rr,6).setValue('0件');
    sh.getRange(rr,7).setValue(monitorLabels[j][1]); sh.getRange(rr,8).setValue('0件');
  }

  sh.getRange('A20:H21').merge().setValue('右側の色は「改善の推移」と同じ判定色です。緑＝改善方向、黄＝経過観察、橙＝要確認、赤＝見直し対象、紫＝データ不足を表します。短期変動だけでは失敗と断定しません。');

  sh.getRange('A22:H22').merge().setValue('今週のアドバイス');
  sh.getRange('A23:H24').merge().setValue('今週の取り組みに合わせて、次の作業を案内します。');

  sh.setFrozenRows(3);
  [120,120,120,120,120,90,120,90].forEach(function(w,i){ sh.setColumnWidth(i+1,w); });
  sh.setRowHeights(1,24,24); sh.setRowHeights(11,2,28); sh.setRowHeights(15,5,24); sh.setRowHeights(20,2,22); sh.setRowHeights(23,2,28);
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
  sh.getRange('A15:H19').setBorder(true,true,true,true,true,true,'#dadce0',SpreadsheetApp.BorderStyle.SOLID);
  sh.getRange('A15:B19').setFontWeight('bold');
  sh.getRange('C15:D19').setHorizontalAlignment('center').setFontWeight('bold').setFontSize(14);
  sh.getRange('E15:H19').setHorizontalAlignment('center').setFontSize(10);
  sh.getRange('E15:E19').setFontWeight('bold'); sh.getRange('G15:G19').setFontWeight('bold');
  sh.getRange('F15:F19').setFontWeight('bold'); sh.getRange('H15:H19').setFontWeight('bold');
  sh.getRange('A20:H21').setFontSize(9).setFontColor('#5f6368').setBackground('#fffdf5').setFontWeight('normal').setHorizontalAlignment('left').setBorder(true,true,true,true,false,false,'#eadca6',SpreadsheetApp.BorderStyle.SOLID);
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
    r['H1タイトル'] = r['H1タイトル'] || r['記事タイトル'] || sbmCleanDisplayTitle_('', r['記事URL'] || '') || 'タイトル取得待ち';
    r['記事タイトル'] = r['記事タイトル'] || r['H1タイトル'];
    return SBM_HEADERS.ARTICLE_DB.map(function(h){ return r[h] !== undefined ? r[h] : ''; });
  });
  sbmWriteArticleDb_(rows);
  // 記事DBだけでなく、履歴・推移・Doctor系も同じGSC表記へ揃える。
  // GSCで今回確認できたURLだけを更新し、非取得記事の既存URLは変更しない。
  try { sbmPropagatePreferredDisplayUrls_(preferredDisplayUrls); } catch(urlDisplayError) { sbmLog_('PreferredUrlPropagation','Warning',String(urlDisplayError)); }
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
    // ARTICLE_DB配列は [選択, 記事ランク, 作業状態, ...]。
    // RC8 Final QA: 選択列を飛ばして正しい列を数える。
    var rank = Array.isArray(r) ? String(r[1] || '') : String((r || {})['記事ランク'] || '');
    var work = Array.isArray(r) ? String(r[2] || '') : String((r || {})['作業状態'] || '');
    if (rank.indexOf('エース') >= 0) counts.ace++;
    else if (rank.indexOf('成長') >= 0) counts.growth++;
    else if (rank.indexOf('安定') >= 0) counts.stable++;
    else if (rank.indexOf('育成') >= 0) counts.nurture++;
    else if (rank.indexOf('低迷') >= 0) counts.low++;
    if (work.indexOf('今日の改善') >= 0) counts.today++;
    else if (work.indexOf('改善中') >= 0 || work.indexOf('モニター中') >= 0) counts.monitoring++;
  });
  sbmSetSetting_('TotalArticleCount', total, '記事DBの総記事数');
  sbmSetSetting_('AceArticleCount', counts.ace, '記事DBのエース記事数');
  sbmSetSetting_('GrowthArticleCount', counts.growth, '記事DBの成長記事数');
  sbmSetSetting_('StableArticleCount', counts.stable, '記事DBの安定記事数');
  sbmSetSetting_('NurtureArticleCount', counts.nurture, '記事DBの育成記事数');
  sbmSetSetting_('LowArticleCount', counts.low, '記事DBの低迷記事数');
  sbmSetSetting_('TodayWorkCount', counts.today, '今日の改善件数');
  sbmSetSetting_('InProgressArticleCount', 0, '旧改善中記事数（RC8 Finalではモニター中へ統合）');
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
    // RC8 Final: 日次処理のたびに記事一覧の欠損を少量ずつ自動修復します。
    try { sbmEnsureArticleListDisplayCompleteness_(30,60); } catch (eCompleteness) { sbmLog_('DailyArticleListCompleteness','Warning',String(eCompleteness)); }
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
    if (!map[url]) map[url] = {url:sbmGscDisplayUrl_(originalUrl) || url, clicks:0, impressions:0, weightedPositionSum:0, originalCount:0, capturedAt:capturedAt, representativeImpressions:-1};
    var m = map[url];
    var clicks = sbmNumber_(r.clicks || 0);
    var imps = sbmNumber_(r.impressions || 0);
    if (imps > Number(m.representativeImpressions || -1)) {
      m.url = sbmGscDisplayUrl_(originalUrl) || m.url || url;
      m.representativeImpressions = imps;
    }
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
    return [false, sbmLegacyStatusToRank_(status), sbmLegacyStatusToWorkState_(status), m.url || url, '', '', m.clicks, m.impressions, ctr, pos, sbmDisplayDateText_(m.capturedAt), '', '記事詳細', '', '', m.capturedAt, m.originalCount, '', '', '', '×', '', '', sbmStatusLabel_(status), sbmDisplayDateText_(m.capturedAt), 0, '正常'];
  });
  out = sbmSortArticleDbRows_(out);
  if (profiler) profiler.lap('URL正規化・記事URL抽出', rows.length, out.length, '#付きURL ' + fragmentCount + '件 / 除外 ' + excluded + '件 / サンプル ' + invalidSamples.join(' | ') + ' / ' + sbmSecondsSince_(tNormalize) + '秒');
  return {rawRows: rows.length, rows: out, excluded: excluded, fragmentCount: fragmentCount};
}


/** Product 5.6.10: Search Consoleページ行の列ずれ・異常値をDB書込み前に検知します。 */
function sbmValidateFreshArticleDbRows_(freshRows) {
  var headers = SBM_HEADERS.ARTICLE_DB;
  var idx = {};
  headers.forEach(function(h, i){ idx[h] = i; });
  var errors = [];
  (freshRows || []).forEach(function(row, n){
    if (!Array.isArray(row) || row.length !== headers.length) {
      errors.push('行' + (n + 1) + ': 列数 ' + (Array.isArray(row) ? row.length : '不正') + '（期待値 ' + headers.length + '）');
      return;
    }
    var url = String(row[idx['記事URL']] || '');
    var clicks = sbmNumber_(row[idx['クリック数']]);
    var imps = sbmNumber_(row[idx['表示回数']]);
    var ctr = sbmNumber_(row[idx['CTR']]);
    var pos = sbmNumber_(row[idx['掲載順位']]);
    if (!isFinite(clicks) || clicks < 0) errors.push('行' + (n + 1) + ': クリック数異常 ' + clicks + ' / ' + url);
    if (!isFinite(imps) || imps < 0) errors.push('行' + (n + 1) + ': 表示回数異常 ' + imps + ' / ' + url);
    if (!isFinite(ctr) || ctr < 0 || ctr > 1.000001) errors.push('行' + (n + 1) + ': CTR異常 ' + ctr + ' / ' + url);
    if (!isFinite(pos) || pos < 0 || pos > 1000) errors.push('行' + (n + 1) + ': 掲載順位異常 ' + pos + ' / ' + url);
    if (clicks > imps && imps >= 0) errors.push('行' + (n + 1) + ': クリック数が表示回数を超過 ' + clicks + '/' + imps + ' / ' + url);
    if (imps === 0 && clicks > 0) errors.push('行' + (n + 1) + ': 表示回数0でクリックあり / ' + url);
  });
  if (errors.length) {
    throw new Error('Search Consoleデータの列対応または値に異常があります。記事DBの更新を中止しました。\n' + errors.slice(0, 10).join('\n'));
  }
  return true;
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
  sbmValidateFreshArticleDbRows_(freshRows || []);
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
  var preferredDisplayUrls = {};
  var updated = 0, added = 0;
  (freshRows || []).forEach(function(row){
    var f = {};
    for (var i = 0; i < SBM_HEADERS.ARTICLE_DB.length; i++) f[SBM_HEADERS.ARTICLE_DB[i]] = row[i] !== undefined ? row[i] : '';
    var displayUrl = sbmGscDisplayUrl_(f['記事URL'] || '');
    var url = sbmNormalizeUrl_(displayUrl || '');
    if (!url) return;
    seen[url] = true;
    if (displayUrl) preferredDisplayUrls[url] = displayUrl;
    var old = map[url];
    if (old) {
      // Search Consoleで取得できた表記を利用者向けURLとして優先する。
      if (displayUrl) old['記事URL'] = displayUrl;
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
      f['記事URL'] = displayUrl || url;
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
    r['H1タイトル'] = r['H1タイトル'] || r['記事タイトル'] || sbmCleanDisplayTitle_('', r['記事URL'] || '') || 'タイトル取得待ち';
    r['記事タイトル'] = r['記事タイトル'] || r['H1タイトル'];
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
      var mainQuery = sbmRealMainQuery_(r['メインクエリ']);
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

      // 記事一覧の表示品質: H1/記事タイトルが空欄の記事はランクや表示回数に関係なく順次補完します。
      // 改善候補だけはSEOタイトル・descriptionも同時に補完します。
      var needsMeta = !articleTitle || (isImprovement && (!seoTitle || !metaDesc));
      if (canFetchMore && fetchedMeta < maxMeta && url && needsMeta) {
        var meta = sbmFetchArticleMetaInfo_(url);
        if (meta && (meta.h1 || meta.titleTag || meta.metaDescription)) {
          articleTitle = sbmCleanDataListText_(meta.h1 || articleTitle, url);
          if (isImprovement) {
            seoTitle = sbmCleanDataListText_(meta.titleTag || seoTitle, url);
            metaDesc = sbmCleanDataListText_(meta.metaDescription || metaDesc, url);
          }
          fetchedMeta++;
        }
      }
      // Search Consoleに表示実績があるのにメインクエリが空欄なら、すべての記事を順次補完します。
      if (canFetchMore && fetchedQuery < maxMeta && url && !mainQuery && imps > 0) {
        var q = sbmFetchMainQueryForUrl_(url);
        if (q) {
          mainQuery = q;
          fetchedQuery++;
        }
      }

      // 利用者向け一覧では空欄を残さない。実検索クエリがない場合は表示専用ラベルにする。
      if (!articleTitle) articleTitle = sbmCleanDisplayTitle_('', url) || 'タイトル取得待ち';
      mainQuery = sbmArticleListQueryDisplay_(mainQuery, imps);

      // Product 5.2.8: 列位置に依存せず、既存レコードを保持したまま補完結果だけを更新します。
      var preserved = {};
      SBM_HEADERS.ARTICLE_DB.forEach(function(h){ preserved[h] = r[h] !== undefined ? r[h] : ''; });
      preserved['記事ランク'] = preserved['記事ランク'] || '';
      preserved['作業状態'] = sbmNormalizeWorkState_(preserved['作業状態']);
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
      preserved['H1タイトル'] = preserved['H1タイトル'] || preserved['記事タイトル'] || '';
      out.push(SBM_HEADERS.ARTICLE_DB.map(function(h){ return preserved[h] !== undefined ? preserved[h] : ''; }));
    }

    sbmWriteArticleDb_(out);
    var sec = sbmSecondsSince_(started);
    var detail = '対象: H1/記事タイトル空欄は全記事を順次補完、メインクエリ空欄は表示実績がある記事を順次補完、改善候補はSEOタイトル・descriptionも補完 / メタ取得 ' + fetchedMeta + '件 / メインクエリ取得 ' + fetchedQuery + '件 / 最大 ' + maxMeta + 'URL / 300秒安全終了 ' + (skippedByTime ? 'あり' : 'なし');
    sbmProcessLog_('記事DBタイトル情報補完', '完了', target, fetchedMeta + fetchedQuery, sec, detail, startedText, sbmNowText_());
    if (!silent) sbmAlert_('記事DBタイトル情報補完完了', '記事DBの情報補完が完了しました。\n\nH1/記事タイトル空欄とメインクエリ空欄を優先して順次補完します。\nメタ情報取得: ' + fetchedMeta + '件\nメインクエリ取得: ' + fetchedQuery + '件\n所要時間: ' + sec + '秒\n300秒安全終了: ' + (skippedByTime ? 'あり' : 'なし'));
  } catch(e) {
    var secErr = sbmSecondsSince_(started);
    sbmProcessLog_('記事DBタイトル情報補完', 'エラー', '', '', secErr, String(e), startedText, sbmNowText_());
    sbmAlert_('記事DBタイトル情報補完エラー', String(e));
  }
}

function sbmOpenArticleDb() {
  try { sbmEnsureArticleListDisplayCompleteness_(12,20); } catch(e) { sbmLog_('ArticleListCompleteness','Warning',String(e)); }
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
    return [range.startDate, range.endDate, r.keys[0], sbmGscDisplayUrl_(originalUrl), r.clicks || 0, r.impressions || 0, r.ctr || 0, r.position || 0, capturedAt];
  }).filter(function(r){ return !!r[3] && sbmIsValidArticleUrl_(r[3]); });
  if (profiler) profiler.lap('URL正規化・記事URL抽出', rawCount, rows.length, '#付きURL ' + fragmentCount + '件 / 除外 ' + (rawCount - rows.length) + '件 / ' + sbmSecondsSince_(tNormalize) + '秒');

  var tSettings = new Date();
  sbmSetSetting_('LastFetchMode', 'QUERY_PAGE', '直近のSearch Console取得方式');
  sbmSetSetting_('LastFetchPageCount', sbmUniqueCount_(rows.map(function(r){return sbmNormalizeUrl_(r[3]);})), '直近取得記事URL数');
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
    var url = sbmGscDisplayUrl_(originalUrl);
    return {url:url, urlKey:sbmNormalizeUrl_(url), clicks:r.clicks || 0, impressions:r.impressions || 0, ctr:r.ctr || 0, position:r.position || 0};
  }).filter(function(r){ return !!r.urlKey && sbmIsValidArticleUrl_(r.url); });
  if (profiler) profiler.lap('URL正規化・記事URL抽出', rawPageRows.length, pageRows.length, '#付きURL ' + fragmentCount + '件 / 除外 ' + (rawPageRows.length - pageRows.length) + '件 / ' + sbmSecondsSince_(tNormalize) + '秒');

  var tSelect = new Date();
  var selected = pageRows.slice().sort(function(a,b){ return sbmPagePriorityScore_(b) - sbmPagePriorityScore_(a); }).slice(0, queryPageLimit);
  var selectedMap = {};
  selected.forEach(function(p){ selectedMap[p.urlKey || sbmNormalizeUrl_(p.url)] = true; });
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
        qrows.forEach(function(r){ rows.push([range.startDate, range.endDate, r.keys[0], sbmGscDisplayUrl_(r.keys[1] || p.url), r.clicks || 0, r.impressions || 0, r.ctr || 0, r.position || 0, capturedAt]); });
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
  pageRows.forEach(function(p){ if (!selectedMap[p.urlKey || sbmNormalizeUrl_(p.url)]) { rows.push([range.startDate, range.endDate, '', p.url, p.clicks, p.impressions, p.ctr, p.position, capturedAt]); appended++; } });
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
    return [range.startDate, range.endDate, r.keys[0], sbmGscDisplayUrl_(r.keys[1]), r.clicks || 0, r.impressions || 0, r.ctr || 0, r.position || 0, capturedAt];
  }).filter(function(r){ return !!r[3] && sbmIsValidArticleUrl_(r[3]); });
  sbmSetSetting_('LastFetchMode', 'QUERY_PAGE', '直近のSearch Console取得方式');
  sbmSetSetting_('LastFetchPageCount', sbmUniqueCount_(rows.map(function(r){return sbmNormalizeUrl_(r[3]);})), '直近取得記事URL数');
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
    var url = sbmGscDisplayUrl_(r.keys && r.keys[0]);
    return {url:url, urlKey:sbmNormalizeUrl_(url), clicks:r.clicks || 0, impressions:r.impressions || 0, ctr:r.ctr || 0, position:r.position || 0};
  }).filter(function(r){ return !!r.urlKey && sbmIsValidArticleUrl_(r.url); });

  var selected = pageRows.slice().sort(function(a,b){ return sbmPagePriorityScore_(b) - sbmPagePriorityScore_(a); }).slice(0, queryPageLimit);
  var selectedMap = {};
  selected.forEach(function(p){ selectedMap[p.urlKey || sbmNormalizeUrl_(p.url)] = true; });

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
        qrows.forEach(function(r){ rows.push([range.startDate, range.endDate, r.keys[0], sbmGscDisplayUrl_(r.keys[1] || p.url), r.clicks || 0, r.impressions || 0, r.ctr || 0, r.position || 0, capturedAt]); });
        detailPages++;
      } else {
        rows.push([range.startDate, range.endDate, '', p.url, p.clicks, p.impressions, p.ctr, p.position, capturedAt]);
      }
    } catch(e) {
      rows.push([range.startDate, range.endDate, '', p.url, p.clicks, p.impressions, p.ctr, p.position, capturedAt]);
    }
  });
  pageRows.forEach(function(p){ if (!selectedMap[p.urlKey || sbmNormalizeUrl_(p.url)]) rows.push([range.startDate, range.endDate, '', p.url, p.clicks, p.impressions, p.ctr, p.position, capturedAt]); });

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
  limit = Math.max(1, Math.min(QUERY_ROW_LIMIT, Number(limit || QUERY_ROW_LIMIT)));
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
        // 改善依頼文へ最大200件を渡すため、少し余裕を持って取得します。
        rowLimit: Math.max(QUERY_ROW_LIMIT, 250),
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
      return (b.imps-a.imps) || (b.clicks-a.clicks) || (a.position-b.position);
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
  var mode = 'CONFIGURED';
  var candidateCap = sbmNumber_(sbmGetSetting_('AnalysisCandidateLimit', SBM_DEFAULTS.ANALYSIS_CANDIDATE_LIMIT)) || SBM_DEFAULTS.ANALYSIS_CANDIDATE_LIMIT;
  diag = diag.slice(0, candidateCap);
  sbmSetSetting_('ImprovementCandidateCount', diag.length, '直近の改善候補数（測定中を除く）');
  var limit = Math.min(sbmGetTodayDisplayCount_(), diag.length);
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
  var raw = String(url || '').trim();
  if (!raw) return '';
  if (/^sc-domain:/i.test(raw)) return raw.toLowerCase();

  // RC8 Official: URL比較・保存の共通Canonical Key。
  // Search Console/CMSで末尾スラッシュの有無が異なっても同一記事として扱う。
  // 運用シートでは「ルート以外は末尾スラッシュなし」に統一し、GSCの生データ表現には依存しない。
  raw = raw.split('#')[0].split('?')[0].trim();
  if (!/^https?:\/\//i.test(raw)) raw = 'https://' + raw.replace(/^\/+/, '');

  var m = raw.match(/^(https?):\/\/([^\/]+)(\/.*)?$/i);
  if (!m) return raw;
  var scheme = String(m[1] || 'https').toLowerCase();
  var authority = String(m[2] || '').toLowerCase();
  if (scheme === 'https') authority = authority.replace(/:443$/, '');
  if (scheme === 'http') authority = authority.replace(/:80$/, '');
  var path = String(m[3] || '/');
  if (path !== '/') path = path.replace(/\/+$/, '');
  return scheme + '://' + authority + path;
}

function sbmGscDisplayUrl_(url) {
  // 利用者向け・保存用URL: Search Console が返した表記を尊重する。
  // 末尾スラッシュ、パスの大小文字、クエリ文字列などを勝手に変更しない。
  // 同一記事判定だけは sbmNormalizeUrl_() を通して行う。
  var raw = String(url || '').trim();
  if (!raw) return '';
  if (/^sc-domain:/i.test(raw)) return raw;
  return raw;
}

function sbmUrlEquals_(left, right) {
  var a = sbmNormalizeUrl_(left || '');
  var b = sbmNormalizeUrl_(right || '');
  return !!a && !!b && a === b;
}

function sbmEnsureCanonicalOperationalUrlsOnce_() {
  // RC8 Official URL Policy V2:
  // 保存・表示URLはSearch Consoleの表記を優先し、ここでは書き換えない。
  // 同一記事判定だけを sbmNormalizeUrl_() / sbmUrlEquals_() で吸収する。
  var props = PropertiesService.getDocumentProperties();
  var version = 'RC8_URL_DISPLAY_POLICY_V2';
  if (String(props.getProperty('SBM_CANONICAL_URL_STORAGE_VERSION') || '') !== version) {
    props.setProperty('SBM_CANONICAL_URL_STORAGE_VERSION', version);
    try { sbmLog_('CanonicalUrlPolicy','Info','保存・表示URLはSearch Console表記を優先し、比較時のみ正規化する方式へ移行しました。'); } catch(e) {}
  }
  return 0;
}

function sbmPropagatePreferredDisplayUrls_(preferredByKey) {
  // Search Consoleで確認できたURL表記を利用者向け運用シートへ反映する。
  // 比較は正規化キー、表示はGSC表記のまま。GSCに無い記事は既存表記を維持する。
  preferredByKey = preferredByKey || {};
  if (!Object.keys(preferredByKey).length) return 0;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var targets = [
    [SBM_SHEETS.ARTICLE_DB, ['記事URL']],
    [SBM_SHEETS.TODAY, ['記事URL']],
    [SBM_SHEETS.LOG, ['URL']],
    [SBM_SHEETS.EFFECT, ['URL','記事URL']],
    [SBM_SHEETS.BRIEF, ['URL']],
    [SBM_SHEETS.FEEDBACK_HISTORY, ['記事URL']],
    [SBM_SHEETS.DOCTOR_HEALTH_SNAPSHOT, ['記事URL']],
    [SBM_SHEETS.DOCTOR_HEALTH_RECORD, ['記事URL']],
    [SBM_SHEETS.DOCTOR_CASES, ['記事URL']]
  ];
  var changed = 0;
  targets.forEach(function(t){
    var sh = ss.getSheetByName(t[0]);
    if (!sh || sh.getLastRow() < 2 || sh.getLastColumn() < 1) return;
    var headers = sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0].map(function(v){return String(v||'').trim();});
    var col = 0;
    for (var i=0;i<t[1].length;i++) {
      var idx = headers.indexOf(t[1][i]);
      if (idx >= 0) { col = idx + 1; break; }
    }
    if (!col) return;
    var range = sh.getRange(2,col,sh.getLastRow()-1,1);
    var values = range.getValues();
    var dirty = false;
    values.forEach(function(r){
      var before = String(r[0] || '').trim();
      if (!before || before.charAt(0) === '=') return;
      var key = sbmNormalizeUrl_(before);
      var preferred = key ? String(preferredByKey[key] || '').trim() : '';
      if (preferred && preferred !== before) { r[0] = preferred; dirty = true; changed++; }
    });
    if (dirty) range.setValues(values);
  });
  return changed;
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


// RC8: 記事一覧では意味不明な空欄を見せない。ただし疑似値を検索クエリとして外部連携へ渡さない。
const SBM_QUERY_NO_DATA_LABEL = '検索実績なし';
const SBM_QUERY_PENDING_LABEL = '取得待ち';
function sbmIsMainQueryPlaceholder_(value) {
  var s=String(value||'').trim();
  return s===SBM_QUERY_NO_DATA_LABEL || s===SBM_QUERY_PENDING_LABEL;
}
function sbmRealMainQuery_(value) {
  var s=String(value||'').trim();
  return sbmIsMainQueryPlaceholder_(s)?'':s;
}
function sbmArticleListQueryDisplay_(value, impressions) {
  var q=sbmRealMainQuery_(value);
  if(q)return q;
  return Number(impressions||0)>0?SBM_QUERY_PENDING_LABEL:SBM_QUERY_NO_DATA_LABEL;
}
function sbmIsTitlePlaceholder_(value) {
  var s=String(value||'').trim();
  return !s || s==='タイトル取得待ち' || s==='タイトル取得失敗';
}

/**
 * RC8 Final: 利用者が見る記事一覧で H1 / 記事タイトル / メインクエリを空欄にしません。
 * H1 と記事タイトルは相互補完し、どちらも無い場合だけ外部取得を少量実行します。
 * 数字だけのURLスラッグはタイトルとして採用しません。
 */
function sbmEnsureArticleListDisplayCompleteness_(maxFetch, maxSeconds) {
  var sh=SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SBM_SHEETS.ARTICLE_DB);
  if(!sh||sh.getLastRow()<2)return {changed:0,fetchedTitle:0,fetchedQuery:0,pendingTitle:0,pendingQuery:0};
  var hm=sbmHeaderMap_(sh); if(!hm['記事URL'])return {changed:0,fetchedTitle:0,fetchedQuery:0,pendingTitle:0,pendingQuery:0};
  maxFetch=Math.max(0,Math.min(100,Number(maxFetch===undefined?12:maxFetch)||0));
  maxSeconds=Math.max(1,Math.min(120,Number(maxSeconds===undefined?20:maxSeconds)||20));
  var started=Date.now(),n=sh.getLastRow()-1,vals=sh.getRange(2,1,n,sh.getLastColumn()).getValues();
  var changed=0,fetchedTitle=0,fetchedQuery=0,pendingTitle=0,pendingQuery=0;
  vals.forEach(function(row){
    var url=String(row[hm['記事URL']-1]||'').trim();
    var h1=hm['H1タイトル']?sbmCleanDataListText_(row[hm['H1タイトル']-1]||'',url):'';
    var article=hm['記事タイトル']?sbmCleanDataListText_(row[hm['記事タイトル']-1]||'',url):'';
    if(sbmIsTitlePlaceholder_(h1))h1='';
    if(sbmIsTitlePlaceholder_(article))article='';
    var best=h1||article;
    var within=(Date.now()-started)<maxSeconds*1000;
    if(!best && url && within && fetchedTitle<maxFetch){
      try{
        var meta=sbmFetchArticleMetaInfo_(url);
        best=sbmCleanDataListText_((meta&&meta.h1)||(meta&&meta.titleTag)||'',url);
        if(best)fetchedTitle++;
      }catch(eTitle){}
    }
    if(!best){
      var pathTitle=sbmCleanDataListText_(sbmCleanDisplayTitle_('',url),url);
      best=pathTitle||'タイトル取得待ち';
      if(best==='タイトル取得待ち')pendingTitle++;
    }
    if(hm['H1タイトル'] && String(row[hm['H1タイトル']-1]||'').trim()!==best){row[hm['H1タイトル']-1]=best;changed++;}
    if(hm['記事タイトル'] && String(row[hm['記事タイトル']-1]||'').trim()!==best){row[hm['記事タイトル']-1]=best;changed++;}

    if(hm['メインクエリ']){
      var imps=hm['表示回数']?sbmNumber_(row[hm['表示回数']-1]):0;
      var real=sbmRealMainQuery_(row[hm['メインクエリ']-1]);
      within=(Date.now()-started)<maxSeconds*1000;
      if(!real && imps>0 && url && within && fetchedQuery<maxFetch){
        try{var q=sbmFetchMainQueryForUrl_(url);if(q){real=q;fetchedQuery++;}}catch(eQuery){}
      }
      var shown=sbmArticleListQueryDisplay_(real,imps);
      if(shown===SBM_QUERY_PENDING_LABEL)pendingQuery++;
      if(String(row[hm['メインクエリ']-1]||'').trim()!==shown){row[hm['メインクエリ']-1]=shown;changed++;}
    }
  });
  if(changed)sh.getRange(2,1,n,sh.getLastColumn()).setValues(vals);
  sbmSetSetting_('ArticleListPendingTitleCount',pendingTitle,'記事一覧でタイトル再取得待ちの件数');
  sbmSetSetting_('ArticleListPendingQueryCount',pendingQuery,'記事一覧でメインクエリ取得待ちの件数');
  return {changed:changed,fetchedTitle:fetchedTitle,fetchedQuery:fetchedQuery,pendingTitle:pendingTitle,pendingQuery:pendingQuery};
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

function sbmSetTodayTop5() { sbmSetSetting_('TodayDisplayCount','5','今日の改善表示件数'); sbmBuildTodayQueue_(); sbmRefreshHome_(); sbmAlert_('表示を変更しました','今日の改善を5件表示にしました。'); }
function sbmSetTodayAll() { sbmSetSetting_('TodayDisplayCount','10','今日の改善表示件数'); sbmBuildTodayQueue_(); sbmRefreshHome_(); sbmAlert_('表示を変更しました','今日の改善を最大10件表示にしました。'); }


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
    if (sheetName === SBM_SHEETS.USER_SETTINGS && col === 2 && row >= 2 && row <= 5) {
      var rules = {
        2: {key:'ArticleInfoBatch', min:30, max:100, label:'記事情報補完件数'},
        3: {key:'TodayDisplayCount', min:1, max:10, label:'今日の改善表示件数'},
        4: {key:'AnalysisCandidateLimit', min:10, max:10, label:'改善候補抽出件数'},
        5: {key:'SearchDays', min:7, max:365, label:'Search Console取得期間（日）'}
      };
      var rule = rules[row];
      if (!rule) return;
      var n = sbmNumber_(e.value || 0);
      var valid = Number.isFinite(n) && Math.floor(n) === n && n >= rule.min && n <= rule.max;
      if (!valid) {
        sbmAlert_('設定値を確認してください', rule.label + 'は' + rule.min + '～' + rule.max + 'の整数で入力してください。');
        sbmBuildUserSettingsSheet_();
        return;
      }
      sbmSetSetting_(rule.key, n, rule.label + '（設定シート）');
      if (row === 3) {
        sbmSetSetting_('TodayInitialDisplayCount', n, '旧版互換。今日の改善表示件数');
        sbmSetSetting_('QueueLimit', n, '旧版互換。今日の改善表示件数');
        var candidates = sbmGetTodayCandidates_();
        if (candidates.length) {
          var shown = Math.min(n, candidates.length);
          sbmWriteTodayRecommendations_(candidates, shown);
          sbmApplyTodayWorkState_(candidates, shown);
          sbmRefreshHome_();
        }
      }
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
function sbmFindBriefByUrl_(url) { var rows = sbmRowsAsObjects_(SBM_SHEETS.BRIEF); for (var i=0;i<rows.length;i++){ if(sbmUrlEquals_(rows[i].URL||'', url||'')) return rows[i]; } return null; }
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


/** RC8 Final: 記事ランクとは独立した利用者向け作業状態を正規化します。 */
function sbmNormalizeWorkState_(value) {
  var s=String(value||'').trim();
  if(!s)return '未着手';
  if(s.indexOf('モニター')>=0)return '👀 モニター中';
  if(s.indexOf('完了')>=0)return '✔️ 完了';
  if(s.indexOf('公開待ち')>=0)return '📤 公開待ち';
  if(s.indexOf('改善中')>=0 || s.indexOf('今日の改善')>=0 || s.indexOf('治療中')>=0 || s.indexOf('診療中')>=0)return '✏️ 改善中';
  if(s==='未着手')return '未着手';
  return s;
}

function sbmPercentileRankSorted_(sortedValues, value) {
  var a = sortedValues || [];
  if (!a.length) return 0;
  value = sbmNumber_(value);
  var lo = 0, hi = a.length;
  while (lo < hi) { var mid = (lo + hi) >> 1; if (a[mid] < value) lo = mid + 1; else hi = mid; }
  var first = lo;
  lo = 0; hi = a.length;
  while (lo < hi) { var mid2 = (lo + hi) >> 1; if (a[mid2] <= value) lo = mid2 + 1; else hi = mid2; }
  var last = lo;
  return Math.max(0, Math.min(1, (first + (last - first) * 0.5) / a.length));
}

function sbmPercentileRank_(sortedValues, value) {
  var a = (sortedValues || []).map(function(v){ return sbmNumber_(v); }).filter(function(v){ return isFinite(v); });
  a.sort(function(x,y){ return x-y; });
  return sbmPercentileRankSorted_(a, value);
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
    var clickPct = sbmPercentileRankSorted_(clickVals, clicks);
    var impPct = sbmPercentileRankSorted_(impVals, imps);
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
      r['H1タイトル'] = r['H1タイトル'] || r['記事タイトル'] || sbmCleanDisplayTitle_('', r['記事URL'] || '') || 'タイトル取得待ち';
    r['記事タイトル'] = r['記事タイトル'] || r['H1タイトル'];
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
  var url = sbmNormalizeUrl_(rec['記事URL'] || '');
  if (!url) return sbmAlert_('改善完了', '記事URLを取得できませんでした。');
  var db = ss.getSheetByName(SBM_SHEETS.ARTICLE_DB);
  if (!db || db.getLastRow() < 2) return sbmAlert_('改善完了', '記事DBがありません。');
  var headers = db.getRange(1,1,1,db.getLastColumn()).getValues()[0].map(function(v){return String(v||'').trim();});
  var urlCol = headers.indexOf('記事URL') + 1;
  var workCol = headers.indexOf('作業状態') + 1;
  if (!urlCol || !workCol) return sbmAlert_('改善完了', '記事DBの必要列がありません。');
  var urls = db.getRange(2,urlCol,db.getLastRow()-1,1).getValues();
  for (var i=0;i<urls.length;i++) {
    if (sbmUrlEquals_(urls[i][0]||'', url||'')) {
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
 * 記事DBから改善候補を最大10件保持し、利用者設定の1～10件を表示します。
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
  // シート上の候補が0件なら、記事DBの保存済みデータから設定件数を補充します。
  if (sbmGetTodayDisplayedRowCount_() === 0) {
    try { sbmEnsureTodayRecommendations_('open'); } catch(e) { sbmLog_('TodayOpenAutoFill','Warning',String(e)); }
    sh = ss.getSheetByName(SBM_SHEETS.TODAY) || sh;
  }
  // RC8 Final Hotfix 1: 既存の「今日の改善」行にも記事DBと同じメインクエリ表示を強制適用します。
  // 保存済み候補がある場合はシート再構築を省略するため、開くたびに空欄を自己修復します。
  try { sbmRepairTodayMainQueryDisplay_(); } catch(eRepairQuery) { sbmLog_('TodayQueryRepair','Warning',String(eRepairQuery)); }
  sh.showSheet(); ss.setActiveSheet(sh); sh.activate();
}

/**
 * RC8 Final Hotfix 1: 「今日の改善」のメインクエリ空欄を自己修復します。
 * 記事DBの実クエリを正本とし、実クエリが無い場合だけ利用者向けラベルを表示します。
 * 「取得待ち」「検索実績なし」は表示専用で、Doctor/Writerへ実クエリとして渡しません。
 */
function sbmRepairTodayMainQueryDisplay_() {
  var ss=SpreadsheetApp.getActiveSpreadsheet();
  var sh=ss.getSheetByName(SBM_SHEETS.TODAY), db=ss.getSheetByName(SBM_SHEETS.ARTICLE_DB);
  if(!sh||!db||sh.getLastRow()<2||db.getLastRow()<2)return 0;
  var th=sbmHeaderMap_(sh), dh=sbmHeaderMap_(db);
  if(!th['メインクエリ']||!th['記事URL']||!dh['記事URL'])return 0;
  var dbVals=db.getRange(2,1,db.getLastRow()-1,db.getLastColumn()).getValues(), byUrl={};
  dbVals.forEach(function(r){
    var url=sbmNormalizeUrl_(r[dh['記事URL']-1]||''); if(!url)return;
    byUrl[url]={
      query:dh['メインクエリ']?sbmRealMainQuery_(r[dh['メインクエリ']-1]):'',
      impressions:dh['表示回数']?sbmNumber_(r[dh['表示回数']-1])||0:0
    };
  });
  var n=sh.getLastRow()-1, vals=sh.getRange(2,1,n,sh.getLastColumn()).getValues(), changed=0;
  vals.forEach(function(r){
    var url=sbmNormalizeUrl_(r[th['記事URL']-1]||''); if(!url)return;
    var info=byUrl[url]||{}, shown=info.query||((Number(info.impressions||0)>0)?'取得待ち':'検索実績なし');
    var idx=th['メインクエリ']-1;
    if(String(r[idx]||'').trim()!==shown){r[idx]=shown;changed++;}
  });
  if(changed)sh.getRange(2,1,n,sh.getLastColumn()).setValues(vals);
  sbmSetSetting_('TodayPendingQueryCount',String(vals.filter(function(r){return String(r[th['メインクエリ']-1]||'')==='取得待ち';}).length),'今日の改善でメインクエリ取得待ちの件数');
  return changed;
}

/**
 * 起動時用の軽量処理。記事DB内の保存済み数値だけを使い、
 * 「今日の改善」に設定件数（初期5件）を表示します。外部取得やダイアログ表示は行いません。
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

  var initial = Math.min(sbmGetTodayDisplayCount_(), candidates.length);
  sbmSetSetting_('TodayRecommendationJson', JSON.stringify(candidates), '今日の改善候補10件（' + String(source || 'auto') + '）');
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
    var initial = Math.min(sbmGetTodayDisplayCount_(), candidates.length);
    sbmSetSetting_('TodayRecommendationJson', JSON.stringify(candidates), '今日の改善候補10件');
    sbmSetSetting_('DisplayedImprovementCount', String(initial), '今日の改善に表示している件数');
    sbmWriteTodayRecommendations_(candidates, initial);
    sbmApplyTodayWorkState_(candidates, initial);
    sbmRefreshHome_();
    sbmOpenTodayImprovement();
    sbmAlert_('今日の改善を作成しました', '改善候補10件から、設定された' + initial + '件を表示しました。表示件数は「記事改善スタート」メニューから1～10件で変更できます。');
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
    var query = sbmRealMainQuery_(r['メインクエリ']);
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
        url:url,title:title,query:sbmRealMainQuery_(r['メインクエリ']),clicks:clicks,
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

function sbmSetTodayDisplayCount() {
  var ui = SpreadsheetApp.getUi();
  var current = sbmGetTodayDisplayCount_();
  var res = ui.prompt('今日の改善 表示件数', '1～10の整数を入力してください。現在は' + current + '件です。', ui.ButtonSet.OK_CANCEL);
  if (res.getSelectedButton() !== ui.Button.OK) return;
  var text = String(res.getResponseText() || '').trim();
  var n = Number(text);
  if (!/^\d+$/.test(text) || !isFinite(n) || n < 1 || n > 10) {
    return sbmAlert_('表示件数を変更できません', '1～10の整数を入力してください。');
  }
  n = Math.floor(n);
  sbmSetSetting_('TodayDisplayCount', String(n), '今日の改善に表示する件数。1～10');
  sbmSetSetting_('TodayInitialDisplayCount', String(n), '旧版互換。今日の改善表示件数');
  sbmSetSetting_('QueueLimit', String(n), '旧版互換。今日の改善表示件数');
  var candidates = sbmGetTodayCandidates_();
  if (!candidates.length) candidates = sbmSelectTodayRecommendations_();
  sbmSetSetting_('TodayRecommendationJson', JSON.stringify(candidates), '今日の改善候補10件');
  var shown = Math.min(n, candidates.length);
  sbmWriteTodayRecommendations_(candidates, shown);
  sbmApplyTodayWorkState_(candidates, shown);
  sbmRefreshHome_();
  sbmOpenTodayImprovement();
  sbmAlert_('表示件数を変更しました', '今日の改善は' + shown + '件表示です。候補が不足する場合は取得済み件数まで表示します。');
}

// 旧メニュー・旧呼び出しとの互換用。
function sbmShowMoreTodayRecommendations() { return sbmSetTodayDisplayCount(); }
function sbmResetTodayRecommendations() {
  sbmSetSetting_('TodayDisplayCount', String(SBM_DEFAULTS.TODAY_INITIAL_DISPLAY), '今日の改善表示件数を初期値へ戻す');
  return sbmSetTodayDisplayCount();
}

function sbmApplyTodayWorkState_(candidates, count) {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SBM_SHEETS.ARTICLE_DB);
  if (!sh || sh.getLastRow()<2) return;
  var headers = sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0].map(function(v){return String(v||'').trim();});
  var urlCol=headers.indexOf('記事URL')+1, workCol=headers.indexOf('作業状態')+1;
  if (!urlCol || !workCol) return;
  var vals=sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).getValues();
  var shown={}; candidates.slice(0,count).forEach(function(c){var k=sbmNormalizeUrl_(c.url||'');if(k)shown[k]=true;});
  for(var i=0;i<vals.length;i++){
    var url=sbmNormalizeUrl_(vals[i][urlCol-1]||'');
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
  for(var i=0;i<rows.length;i++) if(sbmUrlEquals_(rows[i]['記事URL']||'', url||'')) return rows[i];
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

function sbmExtractArticleLinksFromHtml_(html,baseUrl){
  html=String(html||'');var out=[],seen={};var re=/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi,m;
  while((m=re.exec(html))!==null){var href=String(m[1]||'').trim();if(!href||/^(#|javascript:|mailto:|tel:)/i.test(href))continue;
    try{if(/^\//.test(href)){var bm=String(baseUrl||'').match(/^(https?:)\/\/([^\/]+)/i);if(bm)href=bm[1]+'//'+bm[2]+href;}else if(/^\//.test(href)===false&&!/^https?:\/\//i.test(href)){var base=String(baseUrl||'').replace(/[#?].*$/,'');href=base.replace(/\/[^\/]*$/,'/')+href;}}catch(e){}
    href=sbmNormalizeUrl_(href);if(!/^https?:\/\//i.test(href)||seen[href])continue;seen[href]=true;
    var anchor=sbmDecodeHtmlEntities_(String(m[2]||'').replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim();out.push({url:href,anchor_text:anchor});
  }return out;
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
    var html = res.getContentText() || '';
    var text = sbmArticleTextFromHtml_(html);
    if (text.length < 200) return {ok:false, message:'本文として十分な文章を抽出できませんでした。'};
    var structured=sbmStructureArticleText_(text, 'url');
    if(structured.ok) structured.data.outbound_links=sbmExtractArticleLinksFromHtml_(html,url);
    return structured;
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
  var stop={'について':1,'とは':1,'方法':1,'やり方':1,'使い方':1,'原因':1,'対処法':1,'解決':1,'おすすめ':1,'まとめ':1,'最新版':1,'完全版':1,'記事':1,'ブログ':1,'できない':1,'する':1,'した':1,'して':1,'から':1,'まで':1,'ため':1,'場合':1,'how':1,'what':1,'the':1,'and':1,'for':1,'with':1,'インスタ':1,'インスタグラム':1,'instagram':1,'2025':1,'2026':1,'最新':1};
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
  var targetUrl=sbmNormalizeUrl_(targetArticle['記事URL']||targetArticle.URL||''),targetTitle=String(targetArticle['記事タイトル']||''),targetMain=sbmRealMainQuery_(targetArticle['メインクエリ']);
  var targetQueries=(freshTargetQueries&&freshTargetQueries.length?freshTargetQueries:(queryMap[targetUrl]||[])).map(function(q){return typeof q==='string'?q:String(q&&q.query||'');}).filter(Boolean);
  var targetAll=[targetTitle,targetMain].concat(targetQueries).join(' '),targetCategory=sbmInternalLinkCategory_(targetUrl),ranked=[];
  articles.forEach(function(a){
    var url=sbmNormalizeUrl_(a['記事URL']||'');if(!url||url===targetUrl)return;
    var flags=String(a['管理フラグ']||'')+' '+String(a['記事ステータス']||'');if(/管理対象外|削除|要確認|データ未取得/.test(flags))return;
    var title=String(a['記事タイトル']||'').trim();if(!title)return;
    var main=sbmRealMainQuery_(a['メインクエリ']),queries=queryMap[url]||[],candidateAll=[title,main].concat(queries).join(' ');
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
function sbmDetailedQueryDataPromptText_(queries,status,totalImpressions){
  queries=(queries||[]).slice(0,QUERY_ROW_LIMIT);
  var capturedImpressions=queries.reduce(function(sum,q){return sum+sbmNumber_(q.imps||0);},0);
  var total=sbmNumber_(totalImpressions||0);
  var coverage=total>0?(capturedImpressions/total*100):0;
  var fetchedAt=status&&status.fetchedAt?String(status.fetchedAt):sbmNowText_();
  var text='\n==================================================\nSearch Console Query Data\n(Max '+QUERY_ROW_LIMIT+' rows)\n\n';
  text+='DataTimestamp : '+fetchedAt+' JST\n\n';
  text+='Query Coverage\n';
  text+='QueryRows      : '+queries.length+'\n';
  text+='CapturedImp    : '+capturedImpressions+'\n';
  text+='TotalImp       : '+total+'\n';
  text+='Coverage       : '+coverage.toFixed(2)+'%\n\n';
  text+='Format:\nQuery|Clicks|Impressions|CTR|Position\n\n--------------------------------------------------\n\n';
  if(!queries.length){
    text+=(status&&status.ok===false?'取得失敗：'+String(status.message||'Search Consoleからクエリを取得できませんでした。'):'対象期間にクエリデータはありません。')+'\n';
  }else{
    queries.forEach(function(q){
      text+=String(q.query||'')+'|'+sbmNumber_(q.clicks||0)+'|'+sbmNumber_(q.imps||0)+'|'+(sbmNormalizeCtrNumber_(q.ctr||0)*100).toFixed(2)+'|'+sbmNumber_(q.position||0).toFixed(1)+'\n';
    });
  }
  return text+'\n==================================================\n';
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
  return prompt+'\n【SIMSへのフィードバック出力ルール】\n回答の最後に、SIMS Writer Contract v4.2準拠のJSONをコードブロックで必ず1つ出力してください。公開OKの修正はpublication_result.public_ok_changes、利用者判断が必要な修正はpublication_result.user_decision_changesへ分けてください。\n'+
    '{\n  "format": "SIMS_FEEDBACK_V2",\n  "contract_version": "4.2",\n  "site_id": "'+siteId+'",\n  "site_name": "'+siteName+'",\n  "site_url": "'+siteUrl+'",\n  "article_id": "'+articleId+'",\n  "article_url": "'+url+'",\n  "completed_at": "YYYY-MM-DD",\n  "publication_result": {\n    "public_ok_changes": [],\n    "user_decision_changes": [],\n    "change_summary": "実施した改善の要約"\n  },\n  "new_values": {\n    "article_title": "", "seo_title": "", "description": "", "main_query": "'+query+'"\n  },\n  "improvement_type": "normal",\n  "confidence": "high",\n  "expected_effect": {"ctr": "", "clicks": ""},\n  "next_action": "monitor",\n  "warnings": [],\n  "estimated_minutes": 20,\n  "recommended_review_days": 14\n}\n'+
    'public_ok_changesとuser_decision_changesは配列形式で出力し、各変更にはtarget・before・after・reasonを含めてください。変更がない場合は空配列にしてください。recommended_review_daysは7・14・30のいずれか、improvement_typeはminor・normal・major、confidenceはhigh・medium・low、next_actionはmonitor・remeasure・rewrite・noneのいずれかにしてください。'+
    sbmDetailedQueryDataPromptText_(topQueries,meta.topQueryStatus,meta.imps);
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
  var query=sbmRealMainQuery_(a['メインクエリ']);
  var rank=String(a['記事ランク']||'');
  var work=String(a['作業状態']||'未着手');
  var clicks=sbmNumber_(a['クリック数'])||0, imps=sbmNumber_(a['表示回数'])||0, ctr=sbmNormalizeCtrNumber_(a['CTR']), pos=sbmNumber_(a['掲載順位'])||0;
  var target=sbmExpectedCtrTarget_(pos), expected=Math.max(0,Math.round(imps*Math.max(0,target-ctr)));
  var advice= kind.indexOf('CTR')>=0 ? ['P0：SEOタイトルを検索意図に合わせる','P1：導入文で結論と対象読者を明確にする','P2：検索クエリに対応するFAQを追加する'] : ['P0：タイトル・見出しを主検索意図に合わせる','P1：導入文を短くし、結論を先に提示する','P2：不足する説明を1～2項目追加する'];
  try { SpreadsheetApp.getActiveSpreadsheet().toast('対象記事の最新クエリをSearch Consoleから取得しています。通常は数秒で完了します。','改善ナビ',10); } catch(e) {}
  var freshQueryResult=sbmFetchTopQueriesForUrlNow_(url,QUERY_ROW_LIMIT);
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
    // 結果登録を唯一の確定ポイントにし、記事管理・改善履歴・改善の推移を同じトランザクションで同期します。
    try{sbmStyleArticleDbSheet_(sh);}catch(eArticleStyle){}
    try{sbmUpdateEffectivenessCore_(false);}catch(eEffectSync){sbmLog_('FeedbackEffectSync','Warning',String(eEffectSync));}
    try{sbmRefreshHome_();}catch(e){}
    return {ok:true,message:'改善結果を登録しました。\n・記事管理を「モニター中」に更新しました\n・改善履歴を作成しました\n・改善の推移へ反映しました\n・今日の改善を完了表示にしました\n・'+data.recommended_review_days+'日後を効果確認予定に設定しました'};
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
  '選択','改善日','記事タイトル','改善概要','改善経路','使用AI',
  '1週','2週','3週','4週','最終判定','状態',
  '1回目測定日時','1回目SIMS寸評','2回目測定日時','2回目SIMS寸評','3回目測定日時','3回目SIMS寸評','4回目測定日時','4回目SIMS寸評',
  '最終総括','最終改善提案',
  'ArticleID','記事URL','変更箇所','変更後タイトル','変更後SEOタイトル','変更後メタディスクリプション','メインクエリ',
  '改善規模','確信度','期待CTR効果','期待クリック効果','次のアクション','維持した項目','作業時間（分）',
  '注意事項','改善前クリック','改善前表示回数','改善前CTR','改善前順位','AI改善結果JSON','改善履歴ID','改善計画JSON','公開OK変更JSON','利用者判断変更JSON','変更サマリーJSON','Feedback Format','Writer Version'
];

const SBM_EFFECT_HEADERS_V2 = [
  '選択','改善実施日','経過日数','次回測定予定日','測定回数','記事タイトル','改善経路','改善前クリック','現在クリック','改善前表示回数','現在表示回数','判定','ArticleID',
  '記事URL','改善概要','変更箇所','クリック変化','表示回数変化','改善前CTR','現在CTR','CTR変化',
  '改善前順位','現在順位','順位変化','期待CTR効果','期待クリック効果',
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
    '選択':['選択'], '改善日':['改善日','登録日時'], '記事タイトル':['記事タイトル'], '改善概要':['改善概要'], '改善経路':['改善経路','改善方法'], '使用AI':['使用AI'],
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
    '公開OK変更JSON':['公開OK変更JSON'], '利用者判断変更JSON':['利用者判断変更JSON'], '変更サマリーJSON':['変更サマリーJSON'],
    'Feedback Format':['Feedback Format','フィードバック形式'], 'Writer Version':['Writer Version','SIMS Writer Version','Writerバージョン']
  });
  sbmMigrateSheetByHeaderNames_(SBM_SHEETS.EFFECT, SBM_EFFECT_HEADERS_V2, {
    '改善実施日':['改善実施日','改善日','登録日時'],
    '経過日数':['経過日数'],
    '改善経路':['改善経路','改善方法'],
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
  var publicationResult = (obj.publication_result && typeof obj.publication_result === 'object' && !Array.isArray(obj.publication_result)) ? obj.publication_result : {};
  var hasPublicOkChanges = Object.prototype.hasOwnProperty.call(publicationResult, 'public_ok_changes') &&
    publicationResult.public_ok_changes !== null && typeof publicationResult.public_ok_changes === 'object';
  var hasLegacyChanges = Object.prototype.hasOwnProperty.call(obj, 'changes') &&
    obj.changes !== null && typeof obj.changes === 'object';
  if (!hasPublicOkChanges && !hasLegacyChanges) {
    throw new Error('改善結果登録に必要な publication_result.public_ok_changes または changes がありません。');
  }

  var primaryChanges = hasPublicOkChanges ? publicationResult.public_ok_changes : obj.changes;
  var normalizedResult = sbmNormalizeFeedbackChanges_(primaryChanges, obj.change_flags);
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
  var userDecisionChanges = Object.prototype.hasOwnProperty.call(publicationResult, 'user_decision_changes') ? publicationResult.user_decision_changes : [];
  var changeSummary = Object.prototype.hasOwnProperty.call(publicationResult, 'change_summary') ? publicationResult.change_summary : '';
  function flexibleText(value) {
    if (value === undefined || value === null) return '';
    if (typeof value === 'string') return value.trim();
    try { return JSON.stringify(value); } catch (e) { return String(value); }
  }
  var summaryText = String(obj.summary || '').trim() || flexibleText(changeSummary) || '改善内容の登録';

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
    publication_result_source: hasPublicOkChanges ? 'v4.2' : 'legacy',
    public_ok_changes: primaryChanges,
    user_decision_changes: userDecisionChanges,
    change_summary: changeSummary,
    new_values: {
      article_title: String(nv.article_title || nv.title || ''),
      seo_title: String(nv.seo_title || ''),
      description: String(nv.description || nv.meta_description || ''),
      main_query: String(nv.main_query || '')
    },
    improvement_type: String(obj.improvement_type || 'normal'),
    improvement_method: String(obj.improvement_method || obj.workflow_method || ''),
    confidence: String(obj.confidence || ''),
    expected_effect: (obj.expected_effect && typeof obj.expected_effect === 'object') ? obj.expected_effect : {},
    next_action: String(obj.next_action || 'monitor'),
    kept_sections: Array.isArray(obj.kept_sections) ? obj.kept_sections.map(String) : (Array.isArray(obj.protected_elements) ? obj.protected_elements.map(String) : []),
    summary: summaryText,
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
    '選択':false,'改善日':data.completed_at||sbmNowText_(),'記事タイトル':articleTitle,'改善概要':data.summary,'改善経路':data.improvement_method||'通常改善','使用AI':data.ai_name||'',
    '1週':'測定待ち','2週':'測定待ち','3週':'測定待ち','4週':'測定待ち','最終判定':'測定待ち','状態':'測定待ち',
    'ArticleID':data.article_id,'記事URL':data.article_url,'変更箇所':changed,'変更後タイトル':data.new_values.article_title,
    '変更後SEOタイトル':data.new_values.seo_title,'変更後メタディスクリプション':data.new_values.description,'メインクエリ':data.new_values.main_query,
    '改善規模':data.improvement_type,'確信度':data.confidence,'期待CTR効果':String((data.expected_effect||{}).ctr||''),
    '期待クリック効果':String((data.expected_effect||{}).clicks||''),'次のアクション':data.next_action,
    '維持した項目':(data.kept_sections||[]).join(' / '),'作業時間（分）':data.estimated_minutes,'注意事項':data.warnings.join(' / '),
    '改善前クリック':before.clicks,'改善前表示回数':before.impressions,'改善前CTR':before.ctr,'改善前順位':before.position,
    'AI改善結果JSON':data.raw_json||'','改善履歴ID':historyId,'改善計画JSON':JSON.stringify(planSnapshot||{}),
    '公開OK変更JSON':JSON.stringify(data.public_ok_changes===undefined?{}:data.public_ok_changes),
    '利用者判断変更JSON':JSON.stringify(data.user_decision_changes===undefined?[]:data.user_decision_changes),
    '変更サマリーJSON':typeof data.change_summary==='string'?data.change_summary:JSON.stringify(data.change_summary===undefined?'':data.change_summary),
    'Feedback Format':data.format||'','Writer Version':data.writer_version||''
  };
  sh.appendRow(SBM_HISTORY_HEADERS_V2.map(function(h){return record[h]!==undefined?record[h]:'';}));
  sbmStyleHistorySheetV2_();
  try{sbmUpdateEffectivenessCore_(false);}catch(e){}
}


function sbmUpdateEffectivenessSilent_(){ return sbmUpdateEffectivenessCore_(false); }


function sbmJudgeEffectV2_(ctrDelta,posDelta,clickDelta,impDelta,elapsed,beforeClicks,beforeImp,currentImp){
  elapsed = Math.max(0, Number(elapsed || 0));
  beforeClicks = Math.max(0, Number(beforeClicks || 0));
  beforeImp = Math.max(0, Number(beforeImp || 0));
  currentImp = Math.max(0, Number(currentImp || 0));
  if (elapsed < 7) return '測定待ち';
  if (Math.max(beforeImp, currentImp) < 50) return 'データ不足';
  var clickRate = clickDelta / Math.max(beforeClicks, 1);
  var impRate = impDelta / Math.max(beforeImp, 1);
  var score = 0;
  if (clickDelta >= 10 || clickRate >= 0.20) score += 3;
  else if (clickDelta > 0 || clickRate >= 0.05) score += 2;
  else if (clickDelta <= -3 && clickRate <= -0.20) score -= 3;
  else if (clickDelta < 0) score -= 2;
  if (ctrDelta >= 0.005) score += 2; else if (ctrDelta >= 0.001) score += 1;
  else if (ctrDelta <= -0.005) score -= 2; else if (ctrDelta < -0.001) score -= 1;
  if (posDelta >= 2) score += 1; else if (posDelta <= -3) score -= 1;
  if (impRate >= 0.15) score += 1; else if (impRate <= -0.20) score -= 1;
  if (elapsed < 14) return score >= 3 ? '改善傾向' : score <= -3 ? '要確認' : '経過観察';
  if (elapsed < 21) return score >= 4 ? '改善' : score >= 2 ? '改善傾向' : score <= -4 ? '要確認' : '経過観察';
  if (elapsed < 28) return score >= 5 ? '大きく改善' : score >= 3 ? '改善' : score >= 1 ? '改善傾向' : score <= -4 ? '見直し候補' : score <= -2 ? '要確認' : '経過観察';
  if (score >= 5) return '大きく改善';
  if (score >= 3) return '改善';
  if (score >= 1) return '改善傾向';
  if (score <= -6 && clickRate <= -0.20 && ctrDelta <= -0.003) return '元に戻す検討';
  if (score <= -3) return '見直し候補';
  return '変化小';
}
function sbmSuggestEffectNextActionV2_(judgment,h,a){
  if(judgment==='大きく改善')return '改善効果が明確です。現状を維持してください。';
  if(judgment==='改善')return 'クリックを中心に改善が確認できます。測定を継続してください。';
  if(judgment==='改善傾向')return '良い方向へ動いています。次回測定まで経過を観察してください。';
  if(judgment==='要確認')return '初期の下振れの可能性があります。すぐに戻さず、次回測定で再確認してください。';
  if(judgment==='見直し候補')return '十分な期間を経ても主要指標が弱いため、改善内容の再確認をおすすめします。';
  if(judgment==='元に戻す検討')return 'クリックとCTRが明確に低下しています。実施した改善内容を確認し、必要なら再修正を検討してください。';
  if(judgment==='データ不足')return '表示回数が少なく断定できません。測定を継続してください。';
  return '次回の週次測定日までモニターを続けてください。';
}

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
  }else if(judgment==='見直し候補'||judgment==='元に戻す検討'){
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



function sbmPolishImprovementHistoryView_(){
  var sh=SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SBM_SHEETS.FEEDBACK_HISTORY); if(!sh)return;
  var hm=sbmHeaderMap_(sh);
  try{ if(hm['使用AI']) sh.hideColumns(hm['使用AI']); }catch(ignore){}
  try{ if(hm['改善経路']) sh.showColumns(hm['改善経路']); }catch(ignore2){}
}

function sbmApplySelectionUiAll_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  [SBM_SHEETS.TODAY, SBM_SHEETS.EFFECT, SBM_SHEETS.ARTICLE_DB, SBM_SHEETS.FEEDBACK_HISTORY].forEach(function(n){
    var sh=ss.getSheetByName(n); if(sh) sbmApplySelectionUi_(sh);
  });
  sbmPolishImprovementHistoryView_();
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
  var row=sbmGetCheckedRow_(sh);if(!row)return;var o=sbmRowRecord_(sh,row),id=String(o['ArticleID']||''),url=String(o['記事URL']||'');try{var hmSel=sbmHeaderMap_(sh);if(hmSel['選択'])sh.getRange(row,hmSel['選択']).setValue(false);}catch(eSel){}
  var rows=sbmRowsAsObjects_(SBM_SHEETS.FEEDBACK_HISTORY).filter(function(r){return(id&&String(r['ArticleID']||'')===id)||sbmNormalizeUrl_(r['記事URL']||'')===sbmNormalizeUrl_(url);});
  if(!rows.length)return sbmAlert_('改善履歴','履歴がありません。');
  var e=sbmEscapeHtml_,cards=rows.slice().reverse().map(function(r){
    var measurements='';for(var i=1;i<=4;i++){var dt=r[i+'回目測定日時'],j=String(r[i+'週']||'').trim(),measured=!!j&&j!=='未測定'&&j!=='未判定',planned=sbmWeeklyPlannedDate_(r,i),plannedText=planned?Utilities.formatDate(planned,SBM_DEFAULTS.TIMEZONE,'yyyy/M/d'):'日付不明';measurements+='<br>'+i+'週目：'+(measured?e(sbmHistoryDateOnlyText_(dt))+' / '+e(j):'測定待ち（予定：'+e(plannedText)+'）');}
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
  // Doctor処置と改善履歴IDの紐付けから改善経路を毎回復元し、推移からDoctor→Writer等が消える退化を防ぎます。
  try{sbmDoctorSyncImprovementRoutesFromCases_();}catch(eRouteSync){sbmLog_('DoctorRouteSync','Warning',String(eRouteSync));}
  var history=sbmRowsAsObjects_(SBM_SHEETS.FEEDBACK_HISTORY)||[],articles=sbmRowsAsObjects_(SBM_SHEETS.ARTICLE_DB)||[],byId={},byUrl={};
  articles.forEach(function(a){if(a['ArticleID'])byId[String(a['ArticleID'])]=a;if(a['記事URL'])byUrl[sbmNormalizeUrl_(a['記事URL'])]=a;});
  var rows=[], now=new Date(), recordedCount=0;
  history.forEach(function(h){
    var a=byId[String(h['ArticleID']||'')]||byUrl[sbmNormalizeUrl_(h['記事URL']||'')];if(!a)return;
    var improveDate=sbmParseDate_(h['改善日'])||new Date(),elapsed=sbmElapsedDaysFromImprovementDate_(h['改善日']);
    var beforeCtr=sbmNormalizeCtrNumber_(h['改善前CTR']),currentCtr=sbmNormalizeCtrNumber_(a['CTR']),beforePos=sbmNumber_(h['改善前順位']),currentPos=sbmNumber_(a['掲載順位']),beforeClicks=sbmNumber_(h['改善前クリック']),currentClicks=sbmNumber_(a['クリック数']),beforeImp=sbmNumber_(h['改善前表示回数']),currentImp=sbmNumber_(a['表示回数']);
    var ctrDelta=currentCtr-beforeCtr,posDelta=beforePos-currentPos,clickDelta=currentClicks-beforeClicks,impDelta=currentImp-beforeImp;
    var state=sbmHistoryMeasurementState_(h), due=sbmNextWeeklyDueDate_(h), dueReached=!!due&&now>=due;
    var currentJudgment=sbmJudgeEffectV2_(ctrDelta,posDelta,clickDelta,impDelta,elapsed,beforeClicks,beforeImp,currentImp);
    if(dueReached&&!state.complete){
      var rec=sbmRecordWeeklyMeasurement_(h,currentJudgment,now,{ctrDelta:ctrDelta,posDelta:posDelta,clickDelta:clickDelta,impDelta:impDelta});
      if(rec.recorded){recordedCount++;h[(rec.count)+'回目測定日時']=now;h[(rec.count)+'週']=currentJudgment;h[(rec.count)+'回目SIMS寸評']=rec.observation;h['最終判定']=rec.complete?currentJudgment:'測定中';h['状態']=rec.complete?'完了':'測定中';}
      state=sbmHistoryMeasurementState_(h);due=sbmNextWeeklyDueDate_(h);
    }
    var judgment=state.count>0?state.latestJudgment:'測定待ち';
    var rating=sbmEvaluateEffectResult_((judgment==='大きく改善'||judgment==='改善')?'成功':judgment==='改善傾向'?'改善傾向':(judgment==='見直し候補'||judgment==='元に戻す検討')?'要再改善':judgment,posDelta,ctrDelta,clickDelta);
    var next=state.complete?String(h['最終改善提案']||'4回の週次測定が完了しました。最終判定を確認してください。'):'次回測定日まで経過を観察します。';
    var comment=state.complete?'改善後28日間の測定が完了しました。':(state.count+'回測定済み。次回は改善後'+((state.count+1)*7)+'日目です。');
    rows.push([false,improveDate,elapsed,due||'【測定完了】',state.count+'回／4回',h['記事タイトル'],h['改善経路']||h['改善方法']||'通常改善',beforeClicks,currentClicks,beforeImp,currentImp,judgment,h['ArticleID'],h['記事URL'],h['改善概要'],h['変更箇所'],clickDelta,impDelta,beforeCtr,currentCtr,ctrDelta,beforePos,currentPos,posDelta,h['期待CTR効果'],h['期待クリック効果'],rating,next,comment,state.latestDate||'',state.complete?'測定完了':'モニター中',h['改善履歴ID']||'']);
    if(state.complete)sbmMarkArticleMeasurementComplete_(h['ArticleID']);
  });
  var sh=sbmGetOrCreateSheet_(SBM_SHEETS.EFFECT);sh.clear();sh.getRange(1,1,1,SBM_EFFECT_HEADERS_V2.length).setValues([SBM_EFFECT_HEADERS_V2]);
  if(rows.length)sh.getRange(2,1,rows.length,SBM_EFFECT_HEADERS_V2.length).setValues(rows);
  try{if(rows.length)sh.getRange(2,1,rows.length,SBM_EFFECT_HEADERS_V2.length).sort([{column:3,ascending:false},{column:2,ascending:true},{column:6,ascending:true}]);}catch(e){}
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
  if(cur){
    var heads=cur.getRange(1,1,1,Math.max(1,cur.getLastColumn())).getDisplayValues()[0].map(String);
    var expected=SBM_HEADERS.ARTICLE_DB;
    var mismatch=heads.length<expected.length || expected.some(function(h,i){return heads[i]!==h;});
    if(mismatch){
      sbmMigrateSheetByHeaderNames_(SBM_SHEETS.ARTICLE_DB,expected,{'H1タイトル':['H1タイトル','記事タイトル']});
      sbmStyleArticleDbSheet_(sbmGetOrCreateSheet_(SBM_SHEETS.ARTICLE_DB));
    }
  }
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

function sbmOpenEffectiveness(){sbmMigrateEffectSheetName_();try{sbmEnsureHistoryAndEffectSchemas_();sbmRepairImprovementHistoryData_();sbmUpdateEffectivenessCore_(false);}catch(eRepair){sbmLog_('EffectRouteRepair','Warning',String(eRepair));}var sh=sbmGetOrCreateSheet_(SBM_SHEETS.EFFECT);try{sbmStyleEffectSheetV2_();}catch(e){}SpreadsheetApp.getActiveSpreadsheet().setActiveSheet(sh);sh.activate();}
function sbmUpdateEffectiveness(){return sbmShowAsyncProgressDialog_({title:'改善の推移を更新しています',description:'最新の検索データを確認し、モニター中の記事の変化と判定を更新しています。',worker:'sbmUpdateEffectivenessWorker_',steps:['最新データを確認','記事ごとの変化を計算','判定を更新','改善の推移へ反映']});}
function sbmUpdateEffectivenessWorker_(){sbmMigrateEffectSheetName_();return sbmUpdateEffectivenessCore_(false);}


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
      '改善概要':o['改善内容']||'','改善経路':'通常改善','使用AI':'','1回目測定日時':reviewDate,
      '1週':o['状態']==='完了'?'完了':'測定待ち','2週':'測定待ち','3週':'測定待ち','4週':'測定待ち','最終判定':o['状態']==='完了'?'完了':'測定待ち','状態':o['状態']==='完了'?'完了':'測定待ち','ArticleID':a['ArticleID']||'','記事URL':url,
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

/** RC8 Final Hotfix 1: 既存履歴の空欄「改善経路」を安全に補完します。 */
function sbmInferImprovementRoute_(o){
  o=o||{};
  var direct=String(o['改善経路']||o['改善方法']||'').trim(); if(direct)return direct;
  var raw=String(o['AI改善結果JSON']||'').trim(), parsed=null;
  if(raw){try{parsed=JSON.parse(raw);}catch(ignore){}}
  if(parsed){
    var m=String(parsed.improvement_method||parsed.workflow_method||'').trim(); if(m)return m;
    var mode=String(parsed.request_mode||((parsed.workflow||{}).request_mode)||'').toUpperCase();
    var target=String(parsed.target_system||parsed.ai_name||'').toUpperCase();
    if(mode.indexOf('DOCTOR')>=0||raw.indexOf('DOCTOR_REFERRAL')>=0){
      if(target.indexOf('CREATOR')>=0)return 'Doctor→Creator';
      if(target.indexOf('MERGE')>=0)return 'Doctor→Merge';
      return 'Doctor→Writer';
    }
  }
  if(/Doctor→Creator|DOCTOR.*CREATOR/i.test(raw))return 'Doctor→Creator';
  if(/Doctor→Merge|DOCTOR.*MERGE/i.test(raw))return 'Doctor→Merge';
  if(/Doctor→Writer|DOCTOR_REFERRAL/i.test(raw))return 'Doctor→Writer';
  // 既存の通常改善は当時「改善経路」を保存していなかったため、証拠が無い履歴は通常改善として移行します。
  return '通常改善';
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
    if(!String(o['改善経路']||o['改善方法']||'').trim()) o['改善経路']=sbmInferImprovementRoute_(o);
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
    for(var wj=1;wj<=4;wj++){if(!o[wj+'週'])o[wj+'週']='測定待ち';}
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
  sh.getRange(1,1,1,SBM_HISTORY_HEADERS_V2.length).setBackground('#0b8043').setFontColor('#fff').setFontWeight('bold').setWrap(false).setVerticalAlignment('middle').setHorizontalAlignment('center');
  sh.setRowHeight(1,34);
  var hm=sbmHeaderMap_(sh);
  var widths={'選択':52,'改善日':105,'記事タイトル':330,'改善概要':430,'改善経路':120,'使用AI':100,'1週':80};
  Object.keys(widths).forEach(function(h){if(hm[h])sh.setColumnWidth(hm[h],widths[h]);});
  // 利用者が使わない「使用AI」は内部保持したまま常時非表示にします。
  if(hm['使用AI']){try{sh.hideColumns(hm['使用AI']);}catch(eAi){}}
  // 週次詳細の2週以降と内部列は詳細ダイアログから参照するため、一覧では非表示にします。
  if(hm['2週']){try{sh.hideColumns(hm['2週'],Math.max(1,sh.getMaxColumns()-hm['2週']+1));}catch(eHide){}}
  if(sh.getLastRow()>1){
    var n=sh.getLastRow()-1;
    sh.getRange(2,1,n,Math.min(sh.getLastColumn(),7)).setVerticalAlignment('middle');
    if(hm['記事タイトル'])sh.getRange(2,hm['記事タイトル'],n,1).setWrap(true).setVerticalAlignment('top');
    if(hm['改善概要'])sh.getRange(2,hm['改善概要'],n,1).setWrap(true).setVerticalAlignment('top');
    if(hm['改善経路'])sh.getRange(2,hm['改善経路'],n,1).setHorizontalAlignment('center').setWrap(false);
    try{sh.autoResizeRows(2,n);}catch(eRows){}
  }
  // 初期表示時からFALSE/TRUEではなく実チェックボックスに固定します。
  try{sbmApplySelectionUi_(sh);}catch(eSelection){}
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

// RC8 Final: 「修正前を確認」はSBMの役割と重複するため廃止しました。

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
      statusHtml = '<div class="field"><span class="label">状態：</span>測定待ち</div>'
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
  // 詳細表示はシート装飾を変更しません。選択チェックだけ戻して一覧の見た目を固定します。
  try { var hm=sbmHeaderMap_(sh); if(hm['選択']) sh.getRange(row,hm['選択']).setValue(false); } catch(eSelection) {}
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
  else if (sh.getName() === SBM_SHEETS.FEEDBACK_HISTORY) keyHeader = '記事タイトル';

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
    '選択':48,'記事ランク':110,'作業状態':115,'記事URL':285,'メインクエリ':210,'H1タイトル':430,
    'クリック数':90,'表示回数':95,'CTR':72,'掲載順位':88,'データ更新日':105,'記事タイトル':430
  };
  Object.keys(widths).forEach(function(h){
    if (hm[h]) sh.setColumnWidth(hm[h], widths[h]);
  });

  try { sh.showColumns(1, Math.min(11, sh.getMaxColumns())); } catch (e) {}

  [
    '記事タイトル','SEOタイトル','メタディスクリプション','最終取得日時','元URL件数','除外理由','備考',
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

    ['H1タイトル','メインクエリ','記事URL'].forEach(function(h){
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
  try { sbmDoctorEnsureMedicalSheets_(); } catch(e) { sbmLog_('DoctorMedicalSheets','Warning',String(e)); }
  try { sbmPlatformEnsureSheets_(); } catch(e) { sbmLog_('PlatformSheets','Warning',String(e)); }
  sbmMigrateRc3Headers_();
  sbmEnsureDefaultSettings_();
  try { sbmRepairFalseMassMissingFlags_(); } catch(e) {}
  sbmEnsureUserSheets_();
  sbmApplySheetUx_();

  // Product 5.1 Official: 改善履歴を4回測定形式へ強制移行
  sbmApplyProduct5OfficialMeasurementSchema_();
  sbmSetSetting_('OfficialSchemaVersion', SBM_OFFICIAL_SCHEMA_VERSION, 'Product 5.6.11の改善推移判定・表示構造バージョン');

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
    var shown = sbmGetTodayDisplayCount_();
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
  var visibleHeaders = ['選択','改善日','記事タイトル','改善概要','改善経路','1週','2週','3週','4週','最終判定','状態'];

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
    '改善概要': 420,
    '改善経路': 145,
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
function sbmHomeMonitorJudgmentCounts_() {
  var labels = ['測定待ち','データ不足','経過観察','改善傾向','改善','大きく改善','要確認','見直し候補','変化小','元に戻す検討'];
  var counts = {};
  labels.forEach(function(label){ counts[label] = 0; });
  var rows = [];
  try { rows = sbmRowsAsObjects_(SBM_SHEETS.EFFECT) || []; } catch(e) {}
  rows.forEach(function(r) {
    var state = String(r['測定状態'] || '');
    if (state && state.indexOf('モニター中') < 0 && state.indexOf('測定') < 0) return;
    var judgment = String(r['判定'] || '測定待ち').trim() || '測定待ち';
    if (Object.prototype.hasOwnProperty.call(counts, judgment)) counts[judgment]++;
    else counts['経過観察']++;
  });
  return counts;
}

function sbmHomeJudgmentStyle_(label) {
  var value = String(label || '').trim();
  var style = {bg:'#f1f3f4',fg:'#5f6368',weight:'normal'};
  if (value === '大きく改善') style = {bg:'#0b8043',fg:'#ffffff',weight:'bold'};
  else if (value === '改善') style = {bg:'#b7e1cd',fg:'#0d652d',weight:'bold'};
  else if (value === '改善傾向') style = {bg:'#d9ead3',fg:'#274e13',weight:'bold'};
  else if (value === '経過観察' || value === '変化小') style = {bg:'#fce8b2',fg:'#7a4f01',weight:'bold'};
  else if (value === '要確認') style = {bg:'#f9cb9c',fg:'#7f6000',weight:'bold'};
  else if (value === '見直し候補') style = {bg:'#f4c7c3',fg:'#b31412',weight:'bold'};
  else if (value === '元に戻す検討') style = {bg:'#b31412',fg:'#ffffff',weight:'bold'};
  else if (value === 'データ不足') style = {bg:'#d9d2e9',fg:'#351c75',weight:'bold'};
  else if (value === '測定待ち' || value === '未測定' || value === '未判定') style = {bg:'#e8eaed',fg:'#5f6368',weight:'normal'};
  return style;
}

function sbmMigrateLegacyMonitoringLabels_(){
  var ss=SpreadsheetApp.getActiveSpreadsheet();
  try{
    var db=ss.getSheetByName(SBM_SHEETS.ARTICLE_DB);
    if(db&&db.getLastRow()>1){
      var hm=sbmHeaderMap_(db), c=hm['作業状態'];
      if(c){
        var rg=db.getRange(2,c,db.getLastRow()-1,1), vals=rg.getValues(), changed=false;
        vals.forEach(function(r){var v=String(r[0]||'');if(v.indexOf('改善中')>=0){r[0]='👀 モニター中';changed=true;}});
        if(changed)rg.setValues(vals);
      }
    }
  }catch(eDb){try{sbmLog_('LegacyMonitoringMigration','Warning',String(eDb));}catch(ignoreDb){}}
  try{
    var hs=ss.getSheetByName(SBM_SHEETS.FEEDBACK_HISTORY);
    if(hs&&hs.getLastRow()>1){
      var hh=sbmHeaderMap_(hs), names=['1週','2週','3週','4週','最終判定','状態'];
      names.forEach(function(name){var c=hh[name];if(!c)return;var rg=hs.getRange(2,c,hs.getLastRow()-1,1),vals=rg.getValues(),changed=false;vals.forEach(function(r){if(String(r[0]||'').trim()==='未測定'){r[0]='測定待ち';changed=true;}});if(changed)rg.setValues(vals);});
    }
  }catch(eHist){try{sbmLog_('LegacyMeasurementLabelMigration','Warning',String(eHist));}catch(ignoreHist){}}
}

function sbmRefreshHome_() {
  try{sbmMigrateLegacyMonitoringLabels_();}catch(eLegacyLabels){}
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
    else if (w.indexOf('改善中') >= 0 || w.indexOf('モニター中') >= 0) work.monitor++;
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
  var statusText = runtimeState.running ? '▶ 実行中' : (runtimeState.completedToday ? '○ 本日完了' : (runtimeState.continuationRequired ? '◇ 続行待ち' : (runtimeState.label === 'エラー' ? '▲ エラー' : '● 未実施')));
  sh.getRange('B4:H4').setValue(statusText);
  sh.getRange('A4:H4').setBackground(runtimeState.running ? '#dbeafe' : (runtimeState.completedToday ? '#e6f4ea' : (runtimeState.continuationRequired ? '#fef7e0' : (runtimeState.label === 'エラー' ? '#fce8e6' : '#fff2cc'))));
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
  // Product 5.9.10 Final: 旧レイアウトのHomeでも複数セルへの文章複製を防ぐ。
  try { sh.getRange('A11:H12').breakApart().merge(); } catch (e) {}
  sh.getRange('A11:H12').setValue(sbmHomeOverallMessage_(blogName, snapshot)).setFontWeight('normal').setWrap(true);
  sh.getRange('C15:D15').setValue(work.today + '件');
  sh.getRange('C16:D16').setValue(work.monitor + '件');
  sh.getRange('C17:D17').setValue(missingCount + '件');

  var weekly = sbmHomeWeeklyActivity_();
  sh.getRange('C18:D18').setValue(weekly.completed + '件');
  sh.getRange('C19:D19').setValue('');
  var monitorCounts = sbmHomeMonitorJudgmentCounts_();
  var monitorCells = [
    ['F15','測定待ち'],['H15','データ不足'],
    ['F16','経過観察'],['H16','改善傾向'],
    ['F17','改善'],['H17','大きく改善'],
    ['F18','要確認'],['H18','見直し候補'],
    ['F19','変化小'],['H19','元に戻す検討']
  ];
  monitorCells.forEach(function(pair){
    var cell = sh.getRange(pair[0]);
    var style = sbmHomeJudgmentStyle_(pair[1]);
    cell.setValue((monitorCounts[pair[1]] || 0) + '件').setBackground(style.bg).setFontColor(style.fg).setFontWeight(style.weight);
    var labelCell = sh.getRange(cell.getRow(), cell.getColumn()-1);
    labelCell.setBackground(style.bg).setFontColor(style.fg).setFontWeight(style.weight);
  });
  var candidateCount = Math.max(0, Math.min(SBM_DEFAULTS.ANALYSIS_CANDIDATE_LIMIT, work.unstarted));
  try { sh.getRange('A23:H24').breakApart().merge(); } catch (e) {}
  sh.getRange('A23:H24').setValue(sbmHomeWeeklyAdvice_(weekly, work, candidateCount, missingCount)).setFontWeight('normal').setWrap(true);
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
  if (work.today === 0 && work.monitor === 0) return '今日は急いで直す記事がありません。これまで丁寧に整えてきた成果です。新しい記事づくりや、よく読まれている記事の強みを確認する時間にしてもよさそうです。';
  if (work.today >= 5) return '改善候補は多めですが、すべてを今日終える必要はありません。伸びる余地の大きい記事から1本ずつ進めれば、十分に成果へつながります。';
  if (work.monitor >= 3) return '改善した記事が結果を待っています。検索での評価は少し遅れて動くこともあります。今は種を育てる気持ちで、次の一歩を続けましょう。';
  if (work.done >= 10) return '改善を終えた記事が着実に増えています。その積み重ねが、読者に選ばれるブログの強さにつながっています。今日は無理なく進められる1記事に集中しましょう。';
  if (work.today > 0 && s && s.rising > 0) return '今日は、もう一歩で伸びそうな記事に取り組めます。良い部分を残しながらタイトルや導入文を整えると、読者へ届く力がさらに高まりそうです。';
  if (work.today > 0) return '今日は取り組める改善候補があります。まず1記事を選び、読者が知りたい答えが伝わりやすいかを丁寧に見直してみましょう。';
  return 'モニター中の記事があります。追加修正を急がず、測定結果が揃うまで推移を見守りましょう。';
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
  try{sbmDoctorReconcileCompletedTreatments_();}catch(eReconcile){}
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var history = ss.getSheetByName(SBM_SHEETS.FEEDBACK_HISTORY);
  // RC8 Final: 内部列の再構築・非表示処理を利用者に見せない。
  // 改善履歴が現在表示中なら、一度だけHomeへ退避してから裏側で整形します。
  try {
    if (history && ss.getActiveSheet() && ss.getActiveSheet().getSheetId() === history.getSheetId()) {
      var home = ss.getSheetByName(SBM_SHEETS.HOME);
      if (home) ss.setActiveSheet(home);
    }
    if (history) history.hideSheet();
  } catch (eHideHistory) {}
  var sh = sbmRefreshImprovementHistorySheet_(false);
  sh.showSheet();
  ss.setActiveSheet(sh);
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
    '選択':52,'改善実施日':120,'経過日数':80,'次回測定予定日':185,'測定回数':90,'記事タイトル':330,'改善経路':145,
    '改善前クリック':110,'現在クリック':110,'改善前表示回数':120,'現在表示回数':120,'判定':110
  };
  Object.keys(widths).forEach(function(h) {
    if (hm[h]) sh.setColumnWidth(hm[h], widths[h]);
  });

  // 旧版や利用者操作で非表示になった列も、一覧表示時に必ず復元します。
  try { sh.showColumns(1, Math.min(12, sh.getMaxColumns())); } catch (e) {}
  if (sh.getMaxColumns() >= 13) {
    try { sh.hideColumns(13, sh.getMaxColumns() - 12); } catch (e) {}
  }

  var n = Math.max(0, sh.getLastRow() - 1);
  if (n) {
    sh.getRange(2, 1, n, Math.min(12, sh.getLastColumn())).setVerticalAlignment('top');

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
    ['改善前クリック','現在クリック','改善前表示回数','現在表示回数'].forEach(function(h) {
      if (!hm[h]) return;
      var metricRange = sh.getRange(2, hm[h], n, 1);
      metricRange.setValues(metricRange.getValues().map(function(r){
        var v = r[0];
        if (v === '' || v === null) return [''];
        var num = Number(String(v).replace(/,/g, '').trim());
        return [isFinite(num) ? num : v];
      })).setNumberFormat('#,##0').setHorizontalAlignment('right');
    });

    if (hm['判定']) {
      var judgmentRange = sh.getRange(2, hm['判定'], n, 1);
      var judgmentValues = judgmentRange.getDisplayValues();
      var backgrounds = [], fontColors = [], fontWeights = [];
      judgmentValues.forEach(function(r) {
        var value = String(r[0] || '').trim();
        var bg = '#f1f3f4', fg = '#5f6368', weight = 'normal';
        if (value === '大きく改善') { bg = '#0b8043'; fg = '#ffffff'; weight = 'bold'; }
        else if (value === '改善') { bg = '#b7e1cd'; fg = '#0d652d'; weight = 'bold'; }
        else if (value === '改善傾向') { bg = '#d9ead3'; fg = '#274e13'; weight = 'bold'; }
        else if (value === '経過観察' || value === '変化小') { bg = '#fce8b2'; fg = '#7a4f01'; weight = 'bold'; }
        else if (value === '要確認') { bg = '#f9cb9c'; fg = '#7f6000'; weight = 'bold'; }
        else if (value === '見直し候補') { bg = '#f4c7c3'; fg = '#b31412'; weight = 'bold'; }
        else if (value === '元に戻す検討') { bg = '#b31412'; fg = '#ffffff'; weight = 'bold'; }
        else if (value === 'データ不足') { bg = '#d9d2e9'; fg = '#351c75'; weight = 'bold'; }
        else if (value === '測定中') { bg = '#d2e3fc'; fg = '#174ea6'; weight = 'bold'; }
        else if (value === '測定待ち' || value === '未測定' || value === '未判定') { bg = '#e8eaed'; fg = '#5f6368'; }
        backgrounds.push([bg]); fontColors.push([fg]); fontWeights.push([weight]);
      });
      judgmentRange.setBackgrounds(backgrounds).setFontColors(fontColors).setFontWeights(fontWeights).setHorizontalAlignment('center');
    }

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
        (c.query || (Number(c.impressions||0)>0 ? '取得待ち' : '検索実績なし')),
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
    '表示件数は上部メニュー「記事改善スタート → 表示件数を設定」で1～10件に変更できます。'
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
  var shown = sbmGetTodayDisplayCount_();
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
  sbmSetSetting_('OfficialSchemaVersion', SBM_OFFICIAL_SCHEMA_VERSION, 'Product 5.6.11の改善推移判定・表示構造バージョン');
  return true;
}


function sbmOpenImprovementStatus() {
  try{sbmDoctorReconcileCompletedTreatments_();}catch(eReconcile){}
  sbmUpdateEffectivenessSilent_();
  return sbmOpenEffectiveness();
}


function sbmOpenAllBlogArticles() {
  try{sbmDoctorReconcileCompletedTreatments_();}catch(eReconcile){}
  return sbmOpenArticleDb();
}

function sbmOpenImprovementTrend() {
  try{sbmDoctorReconcileCompletedTreatments_();}catch(eReconcile){}
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
  try { sbmSetSetting_('Version', SBM_VERSION, 'システムバージョン'); } catch (eVersion) {}
  try {
    sbmEnsureOfficialSchemaOnce_();
  } catch (e) {
    try { sbmLog_('OnOpenOfficialSchema', 'Warning', String(e)); } catch (ignore) {}
  }
  try {
    sbmEnsureCanonicalOperationalUrlsOnce_();
  } catch (eUrl) {
    try { sbmLog_('OnOpenCanonicalUrl', 'Warning', String(eUrl)); } catch (ignoreUrl) {}
  }
  // RC8 UI guard: old Doctor tabs are migrated before the user can open them.
  try { sbmDoctorEnsureLatestUserViews_(); } catch (eDoctorUi) { try { sbmLog_('OnOpenDoctorUiGuard','Warning',String(eDoctorUi)); } catch(ignoreDoctorUi) {} }

  var ui = SpreadsheetApp.getUi();

  // 製品管理メニューを最左翼に配置します。
  ui.createMenu('SIMS-Blog-Manager')
    .addItem('1．Homeを確認する','sbmOpenHome')
    .addItem('2．日次処理を実行','sbmRunDailyUpdateManual')
    .addSeparator()
    .addItem('初回セットアップ','sbmStartInitialSetup')
    .addItem('ブログ情報を変更','sbmOpenBlogInfoChange')
    .addItem('記事情報を取得','sbmSupplementNewArticlesManual')
    .addItem('シートの作成・修復','sbmInitializeSheets')
    .addItem('設定を開く','sbmOpenUserSettings')
    .addSeparator()
    .addItem('セットアップ画面を開く','sbmOpenSetup')
    .addItem('Editorial Platformの状態','sbmPlatformShowStatus')
    .addItem('バージョン情報','sbmShowVersionInfo')
    .addToUi();

  // 毎日の作業入口であることが伝わる名称にします。
  ui.createMenu('記事改善スタート')
    .addItem('1．今日の改善を開く','sbmOpenTodayImprovement')
    .addItem('2．選択記事の改善詳細を見る','sbmOpenSelectedImprovementNavi')
    .addItem('3．今日の改善の表示件数を設定','sbmSetTodayDisplayCount')
    .addToUi();

  // 結果登録は独立メニューにせず、今日の改善またはDoctor精密診断の作業フロー内で行います。

  // 改善中の記事と4週間の測定状況をここへ統合します。
  ui.createMenu('推移確認')
    .addItem('1．改善の推移を開く','sbmOpenImprovementStatus')
    .addItem('2．最新データで更新','sbmUpdateEffectiveness')
    .addItem('3．選択記事の詳細を見る','sbmShowSelectedEffectDetail')
    .addToUi();

  ui.createMenu('記事一覧')
    .addItem('1．記事一覧を開く','sbmOpenAllBlogArticles')
    .addItem('2．選択記事の詳細を見る','sbmOpenSelectedArticleDbDetail')
    .addItem('3．選択記事の改善案を見る','sbmOpenSelectedImprovementNavi')
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
    .addItem('1．改善履歴を開く','sbmOpenImprovementHistory')
    .addItem('2．選択した履歴の詳細を見る','sbmOpenSelectedHistoryDetail')
    .addItem('3．選択記事の全履歴を見る','sbmOpenSelectedHistoryArticleAll')
    .addToUi();


  // 正式フロー: SBM → Doctor → Writer / Creator / Merge → SBM。
  // Doctor診断結果のSBM登録は通常不要。SBMは処置結果・効果測定・再診を管理します。
  ui.createMenu('SIMS Doctor')
    .addItem('1．ブログ健康診断を実行','sbmDoctorRunHealthCheck')
    .addItem('2．健康診断書を開く','sbmDoctorOpenHealthReport')
    .addItem('3．精密診断候補を見る','sbmDoctorOpenDetailedCandidates')
    .addItem('4．チェックした記事のDoctor依頼文を作る','sbmDoctorCreateRequestFromDetailedCandidate')
    .addSeparator()
    .addItem('個別診断：記事一覧から依頼する','sbmDoctorCreateRequestFromArticleList')
    .addItem('個別診断：改善の推移から依頼する','sbmDoctorCreateRequestFromEffect')
    .addToUi();

  // 配布版では開発者用メニューを生成しません。
  try { sbmRetireDoctorWorklistSheets_(); } catch(e) {}

  // 改善履歴・改善の推移は、利用者が開く前から装飾・チェックボックス・非表示列を完成させます。
  try { sbmStyleHistorySheetV2_(); sbmApplyHistoryFinalStyle_(); } catch(eHistoryStyle) { try { sbmLog_('OnOpenHistoryStyle','Warning',String(eHistoryStyle)); } catch(ignoreHistoryStyle) {} }
  try { sbmStyleEffectSheetV2_(); } catch(eEffectStyle) { try { sbmLog_('OnOpenEffectStyle','Warning',String(eEffectStyle)); } catch(ignoreEffectStyle) {} }

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




/* ========================================================================== *
 * Product 5.10.0 RC8: SIMS Doctor ブログ健康診断 基盤
 * ========================================================================== */

const SBM_DOCTOR_HEALTH_DAYS = 180;
const SBM_DOCTOR_HEALTH_PAGE_LIMIT = 25000;

function sbmDoctorEnsureMedicalSheets_() {
  var names = [
    ['DOCTOR_HEALTH_SNAPSHOT', SBM_SHEETS.DOCTOR_HEALTH_SNAPSHOT],
    ['DOCTOR_HEALTH_RECORD', SBM_SHEETS.DOCTOR_HEALTH_RECORD],
    ['DOCTOR_TREATMENT_QUEUE', SBM_SHEETS.DOCTOR_TREATMENT_QUEUE],
    ['DOCTOR_HEALTH_RUN', SBM_SHEETS.DOCTOR_HEALTH_RUN],
    ['DOCTOR_CASES', SBM_SHEETS.DOCTOR_CASES]
  ];
  names.forEach(function(pair){
    var sh = sbmGetOrCreateSheet_(pair[1]);
    if (pair[0] === 'DOCTOR_HEALTH_SNAPSHOT' && sh.getLastRow() > 1) {
      var oldHeads = sh.getRange(1,1,1,Math.max(1,sh.getLastColumn())).getDisplayValues()[0].map(String);
      if (oldHeads.indexOf('Doctor診断対象') < 0) sh.clearContents();
    }
    sbmEnsureHeaders_(sh, SBM_HEADERS[pair[0]]);
    sbmStyleDataSheet_(sh);
    try { sh.hideSheet(); } catch(e) {}
  });
}

/** RC8 UI guard: legacy Doctor user views are migrated to the latest RC8 layout on open. */
function sbmDoctorEnsureLatestUserViews_(){
  var ss=SpreadsheetApp.getActiveSpreadsheet();
  try{
    var legacy=ss.getSheetByName('Doctor_精密診断紹介状');
    var current=ss.getSheetByName('Doctor_精密診断候補');
    var stale=false;
    if(legacy) stale=true;
    if(current){
      var heads=[];
      try{heads=current.getRange(6,1,1,Math.max(1,current.getLastColumn())).getDisplayValues()[0].map(function(v){return String(v||'').trim();});}catch(eHeads){}
      var expected=['選択','重症度','記事タイトル','傾向','クリック','表示','順位','CTR'];
      for(var i=0;i<expected.length;i++){if(heads[i]!==expected[i]){stale=true;break;}}
      if(heads.indexOf('状態')>=0||heads.indexOf('診断理由')>=0||heads.indexOf('優先')>=0)stale=true;
    }
    var snap=ss.getSheetByName(SBM_SHEETS.DOCTOR_HEALTH_SNAPSHOT);
    if(stale && snap && snap.getLastRow()>1){
      sbmDoctorRebuildCandidateViewFromSnapshot_();
    }else if(legacy && !snap){
      try{legacy.hideSheet();}catch(eHideLegacy){}
    }
  }catch(e){try{sbmLog_('DoctorLatestUserViews','Warning',String(e));}catch(ignore){}}
}

function sbmDoctorPrepareHealthCheckScreen_(){
  // RC8 final: health-check execution must never move the user's active sheet.
  // The staged runner works in the modal dialog and opens Doctor_健康診断書 only after completion.
  return true;
}

function sbmDoctorRunHealthCheck() {
  try {
    sbmDoctorPrepareHealthCheckScreen_();
    var dailyState = sbmGetDailyRuntimeState_();
    if (dailyState && dailyState.running) return sbmAlert_('ブログ健康診断を始められません','日次処理が実行中です。日次処理が完了してからブログ健康診断を開始してください。');
    // RC8 Final QA UAT7: 開始操作では重い事前処理を実行しない。
    // 先に確認・Runner UIを表示し、重い整合性確認は最初の分割STEP内で行う。
    if (!sbmIsSetupComplete_() || sbmGetSetting_('ConnectionStatus','') !== 'OK') return sbmAlert_('ブログ健康診断を始められません','初回セットアップとSearch Console接続を完了してください。');

    var run=sbmDoctorGetHealthRun_();
    if(run&&run.healthCheckId&&run.statusCode!=='COMPLETED'&&sbmDoctorSnapshotCountForRun_(run.healthCheckId)===0){
      run.statusCode='PREPARING'; run.phase='準備中'; run.processedCount=0; run.nextStep='180日集計'; run.lastError=''; run.updatedAt=sbmNowText_(); sbmDoctorSaveHealthRun_(run);
    }

    if(!run||!run.healthCheckId||run.statusCode==='COMPLETED'){
      var period=sbmDoctorHealthPeriod_(), articleCount=sbmRowsAsObjects_(SBM_SHEETS.ARTICLE_DB).length, ui=SpreadsheetApp.getUi();
      var answer=ui.alert('ブログ健康診断を開始します','過去180日の検索データ取得から期間比較、記事ごとの健康状態分析、精密診断候補の選定まで、8つのステップを順番に自動で進めます。\n\n対象期間：'+period.full.startDate+' ～ '+period.full.endDate+'\n登録記事数：'+articleCount+'件\n\n処理中は画面を切り替えず、完了後に健康診断書を表示します。',ui.ButtonSet.OK_CANCEL);
      if(answer!==ui.Button.OK)return;
      var id='HC-'+Utilities.formatDate(new Date(),SBM_DEFAULTS.TIMEZONE,'yyyyMMdd-HHmmss');
      run={healthCheckId:id,statusCode:'PREPARING',phase:'準備中',startDate:period.full.startDate,endDate:period.full.endDate,targetCount:articleCount,processedCount:0,nextStep:'180日集計',lastSuccessAt:'',retryCount:0,lastError:'',createdAt:sbmNowText_(),updatedAt:sbmNowText_()};
      sbmDoctorSaveHealthRun_(run); sbmDoctorClearSnapshotForRun_(id);
    }
    sbmDoctorShowHealthCheckRunnerDialog_();
  } catch(e) {
    sbmAlert_('ブログ健康診断を開始できません', String(e&&e.message?e.message:e));
  }
}

/**
 * RC8: 健康診断は利用者の1回の操作で完了させる。
 * google.script.run をSTEPごとに呼び分けることで、Apps Script 1実行の時間上限を跨がない。
 */
function sbmDoctorShowHealthCheckRunnerDialog_(){
  var html='<!doctype html><html><head><base target="_top"><style>'+ 
    'body{font-family:Arial,"Noto Sans JP",sans-serif;margin:0;padding:22px;color:#202124}.title{font-size:22px;font-weight:700;margin-bottom:8px}.sub{color:#5f6368;margin-bottom:16px;line-height:1.6}.bar{height:14px;background:#e8eaed;border-radius:8px;overflow:hidden}.fill{height:100%;width:0;background:#0b8043;transition:width .25s}.pct{font-weight:700;margin:10px 0;display:flex;align-items:center;gap:10px}.spinner{width:18px;height:18px;border:3px solid #dfe7df;border-top-color:#0b8043;border-radius:50%;animation:spin .85s linear infinite;flex:none}@keyframes spin{to{transform:rotate(360deg)}}.box{background:#f6f9f7;border:1px solid #dfe7e1;border-radius:8px;padding:14px;margin-top:14px;line-height:1.65}.step{font-weight:700}.small{font-size:12px;color:#5f6368;margin-top:10px;line-height:1.55}.done{background:#e6f4ea;border-color:#b7dfc4}.err{background:#fce8e6;border-color:#f3b7b1}.btn{margin-top:16px;padding:9px 18px;border:0;border-radius:6px;background:#0b8043;color:white;cursor:pointer}.btn.secondary{background:#5f6368;margin-left:8px}.meta{font-size:12px;color:#5f6368;margin-top:8px}</style></head><body>'+ 
    '<div class="title">ブログ健康診断</div><div class="sub">過去180日の検索データ取得から期間比較、記事ごとの健康状態分析、精密診断候補の選定まで、8つのステップを順番に自動で進めます。</div>'+ 
    '<div class="bar"><div id="fill" class="fill"></div></div><div class="pct"><span id="spinner" class="spinner"></span><span id="pct">準備中…</span></div>'+ 
    '<div id="box" class="box"><div id="step" class="step">STEP 1 / 8　開始準備</div><div id="detail">処理を開始しています。</div><div id="meta" class="meta">最終更新：--</div></div>'+ 
    '<div id="note" class="small">処理中はこのダイアログを閉じないでください。別ブログの日次処理など、重い処理の同時実行も避けてください。</div><button id="retry" class="btn" style="display:none">続きから再開</button><button id="close" class="btn secondary" style="display:none">閉じる</button>'+ 
    '<script>var retryCount=0,terminal=false,waiting=false,watch=null;function el(i){return document.getElementById(i)}function paint(r){var p=Math.max(0,Math.min(100,Number(r.progress||0)));el("fill").style.width=p+"%";el("pct").textContent="進捗 "+p+"%";el("step").textContent=(r.stepLabel||r.stage||"処理中");el("detail").textContent=r.message||"";el("meta").textContent="最終更新："+(r.lastSuccessAt||"処理開始直後");}function setWaiting(v){waiting=v;if(v){clearTimeout(watch);watch=setTimeout(function(){if(waiting&&!terminal){el("meta").textContent="サーバーからの応答を待っています。処理は継続中です。";}},90000);}}function next(){if(terminal)return;setWaiting(true);google.script.run.withSuccessHandler(function(r){setWaiting(false);paint(r||{});if(r&&r.done){terminal=true;el("spinner").style.display="none";el("box").className="box done";el("note").textContent="健康診断が完了しました。健康診断書を表示します。";setTimeout(function(){google.script.run.withSuccessHandler(function(){google.script.host.close();}).sbmDoctorOpenHealthReport();},300);return;}retryCount=0;setTimeout(next,350);}).withFailureHandler(function(e){setWaiting(false);var msg=(e&&e.message)?e.message:String(e||"処理が停止しました");el("spinner").style.display="none";el("box").className="box err";el("step").textContent="処理を一時停止しました";el("detail").textContent=msg;el("note").textContent="保存済みの工程から再開できます。";if(retryCount<1 && /時間|timeout|maximum execution|exceeded|停止/i.test(msg)){retryCount++;setTimeout(function(){el("spinner").style.display="inline-block";next();},1500);return;}el("retry").style.display="inline-block";el("close").style.display="inline-block";}).sbmDoctorRunHealthStageFromDialog();}el("retry").onclick=function(){el("retry").style.display="none";el("close").style.display="none";el("spinner").style.display="inline-block";el("box").className="box";retryCount=0;next();};el("close").onclick=function(){google.script.host.close();};next();</script></body></html>';
  SpreadsheetApp.getUi().showModalDialog(HtmlService.createHtmlOutput(html).setWidth(660).setHeight(470),'ブログ健康診断');
}

function sbmDoctorRecoverHealthRunForStage_(run){
  var code=String(run.statusCode||'');
  // RC8 Final QA UAT8:
  // SCREENING is a normal resumable state. Do NOT roll it back between dialog calls.
  // Rolling SCREENING back to PREVIOUS_DONE reset the saved cursor and repeatedly
  // processed the first batch (40 articles) forever.
  var back={FETCHING_FULL:'PREFLIGHT_DONE',FETCHING_FIRST:'FULL_DONE',FETCHING_SECOND:'FIRST_DONE',FETCHING_RECENT:'SECOND_DONE',FETCHING_PREVIOUS:'RECENT_DONE'};
  if(code==='SCREENING') return run;
  if(back[code]){
    run.statusCode=back[code]; run.phase=sbmDoctorHealthStatusJa_(back[code]); run.nextStep='保存済みの工程から再開'; run.updatedAt=sbmNowText_(); sbmDoctorSaveHealthRun_(run);
  } else if(code==='RETRYABLE_ERROR'){
    var phase=String(run.phase||'')+' '+String(run.lastError||'');
    if(phase.indexOf('前半')>=0) run.statusCode='FULL_DONE';
    else if(phase.indexOf('後半')>=0) run.statusCode='FIRST_DONE';
    else if(phase.indexOf('直近')>=0) run.statusCode='SECOND_DONE';
    else if(phase.indexOf('その前')>=0||phase.indexOf('比較')>=0) run.statusCode='RECENT_DONE';
    else if(phase.indexOf('判定')>=0||phase.indexOf('診断')>=0) {
      // Resume from the saved screening cursor instead of restarting batch 1.
      var saved=sbmDoctorLoadHealthScreenState_(run.healthCheckId);
      run.statusCode=saved?'SCREENING':'PREVIOUS_DONE';
    }
    else run.statusCode='PREPARING';
    run.phase=sbmDoctorHealthStatusJa_(run.statusCode); run.lastError=''; run.updatedAt=sbmNowText_(); sbmDoctorSaveHealthRun_(run);
  }
  return run;
}

function sbmDoctorRunHealthStageFromDialog(){
  var run=sbmDoctorGetHealthRun_();
  if(!run||!run.healthCheckId) throw new Error('健康診断の実行情報がありません。');
  run=sbmDoctorRecoverHealthRunForStage_(run);
  if(run.statusCode==='COMPLETED') return sbmDoctorHealthDialogResult_(run,true,'健康診断が完了しました。');
  try{
    if(run.statusCode==='PREPARING'){
      // Runner UI表示後の独立STEP。重い事前確認と180日API取得を同一実行に詰め込まない。
      try { sbmEnsureArticleListDisplayCompleteness_(20,40); } catch(eCompleteness) { sbmLog_('DoctorPreflightArticleListCompleteness','Warning',String(eCompleteness)); }
      sbmDoctorAssertSafeToExport_();
      sbmDoctorEnsureMedicalSheets_();
      run.statusCode='PREFLIGHT_DONE'; run.phase='事前確認完了'; run.nextStep='180日集計'; run.lastSuccessAt=sbmNowText_(); run.updatedAt=sbmNowText_(); sbmDoctorSaveHealthRun_(run);
      return sbmDoctorHealthDialogResult_(run,false,'開始準備が完了しました。180日集計へ進みます。');
    }
    if(run.statusCode==='PREVIOUS_DONE' || run.statusCode==='SCREENING'){
      var screening=sbmDoctorRunScreeningBatch_(true);
      run=sbmDoctorGetHealthRun_();
      return sbmDoctorHealthDialogResult_(run,!!screening.done,screening.message);
    }
    var period=sbmDoctorHealthPeriodFromRun_(run), step=sbmDoctorNextHealthStep_(run.statusCode);
    if(!step) throw new Error('現在の工程を判定できません：'+sbmDoctorHealthStatusJa_(run.statusCode));
    run.statusCode=step.runningCode; run.phase=step.runningLabel; run.nextStep=step.label; run.updatedAt=sbmNowText_(); sbmDoctorSaveHealthRun_(run);
    var rows=sbmDoctorFetchPageMetrics_(period[step.periodKey]);
    sbmDoctorMergeSnapshotMetrics_(run.healthCheckId,period,step.metricPrefix,rows);
    run.statusCode=step.doneCode; run.phase=step.doneLabel; run.nextStep=step.nextLabel; run.processedCount=sbmDoctorSnapshotCountForRun_(run.healthCheckId); run.lastSuccessAt=sbmNowText_(); run.lastError=''; run.updatedAt=sbmNowText_(); sbmDoctorSaveHealthRun_(run);
    return sbmDoctorHealthDialogResult_(run,false,step.doneLabel+'。次の工程へ進みます。');
  }catch(e){
    run=sbmDoctorGetHealthRun_()||run; run.statusCode='RETRYABLE_ERROR'; run.retryCount=Number(run.retryCount||0)+1; run.lastError=String(e&&e.message?e.message:e); run.updatedAt=sbmNowText_(); sbmDoctorSaveHealthRun_(run); throw e;
  }
}

function sbmDoctorHealthDialogResult_(run,done,message){
  return {ok:true,done:!!done,healthCheckId:String(run.healthCheckId||''),statusCode:String(run.statusCode||''),stage:sbmDoctorHealthStatusJa_(run.statusCode),progress:Number(sbmDoctorHealthProgress_(run.statusCode,run.processedCount,run.targetCount,run.phase)||0),processed:Number(run.processedCount||0),total:Number(run.targetCount||0),stepLabel:sbmDoctorHealthStepLabel_(run),lastSuccessAt:String(run.lastSuccessAt||''),message:String(message||run.nextStep||'')};
}

// 旧版との互換用。手動再開要求は不要になり、1STEPだけ安全に進めます。
function sbmDoctorContinueHealthCheckTrigger(){return sbmDoctorRunHealthStageFromDialog();}
function sbmDoctorProcessOneHealthStep_(silent){return sbmDoctorRunHealthStageFromDialog();}
function sbmDoctorScheduleContinuation_(){return false;}
function sbmDoctorDeleteContinuationTriggers_(){return false;}
function sbmDoctorStartHealthCheck() { return sbmDoctorRunHealthCheck(); }
function sbmDoctorResumeHealthCheck() { return sbmDoctorRunHealthCheck(); }

// 互換用。新UIでは呼ばないが、旧参照からでも段階的に処理できるよう残す。
function sbmDoctorExecuteHealthCheckToCompletion_(){
  var guard=0, result=null;
  while(guard++<7){result=sbmDoctorRunHealthStageFromDialog(); if(result&&result.done) return result;}
  return result;
}

function sbmDoctorSnapshotCountForRun_(healthCheckId) {
  var sh = sbmGetOrCreateSheet_(SBM_SHEETS.DOCTOR_HEALTH_SNAPSHOT);
  if (sh.getLastRow() < 2) return 0;
  var hm = sbmHeaderMap_(sh);
  var vals = sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).getValues();
  var n = 0;
  vals.forEach(function(row){ if (String(row[hm['健康診断ID']-1]) === healthCheckId) n++; });
  return n;
}

function sbmDoctorNextHealthStep_(status) {
  var map = {
    'PREFLIGHT_DONE': {periodKey:'full', metricPrefix:'full', runningCode:'FETCHING_FULL', runningLabel:'180日集計を取得中', doneCode:'FULL_DONE', doneLabel:'180日集計完了', label:'180日集計', nextLabel:'前半90日集計を取得'},
    'FULL_DONE': {periodKey:'first', metricPrefix:'first', runningCode:'FETCHING_FIRST', runningLabel:'前半90日集計を取得中', doneCode:'FIRST_DONE', doneLabel:'前半90日集計完了', label:'前半90日集計', nextLabel:'後半90日集計を取得'},
    'FIRST_DONE': {periodKey:'second', metricPrefix:'second', runningCode:'FETCHING_SECOND', runningLabel:'後半90日集計を取得中', doneCode:'SECOND_DONE', doneLabel:'後半90日集計完了', label:'後半90日集計', nextLabel:'直近28日集計を取得'},
    'SECOND_DONE': {periodKey:'recent', metricPrefix:'recent', runningCode:'FETCHING_RECENT', runningLabel:'直近28日集計を取得中', doneCode:'RECENT_DONE', doneLabel:'直近28日集計完了', label:'直近28日集計', nextLabel:'その前28日集計を取得'},
    'RECENT_DONE': {periodKey:'previous', metricPrefix:'previous', runningCode:'FETCHING_PREVIOUS', runningLabel:'その前28日集計を取得中', doneCode:'PREVIOUS_DONE', doneLabel:'比較データ取得完了', label:'その前28日集計', nextLabel:'健康状態を判定'},
    'PREVIOUS_DONE': {periodKey:'none', metricPrefix:'screen', runningCode:'SCREENING', runningLabel:'健康状態を判定中', doneCode:'COMPLETED', doneLabel:'健康診断完了', label:'健康状態の判定', nextLabel:'健康診断完了'}
  };
  if (status === 'RETRYABLE_ERROR') {
    var run = sbmDoctorGetHealthRun_();
    var phase = String(run.phase || '');
    if (phase.indexOf('前半') >= 0) return map.FULL_DONE;
    if (phase.indexOf('後半') >= 0) return map.FIRST_DONE;
    if (phase.indexOf('直近') >= 0) return map.SECOND_DONE;
    if (phase.indexOf('その前') >= 0) return map.RECENT_DONE;
    if (phase.indexOf('一次') >= 0) return map.PREVIOUS_DONE;
    return map.PREPARING;
  }
  if (status === 'PREVIOUS_DONE') {
    sbmDoctorRunScreening_();
    return null;
  }
  return map[status] || null;
}

function sbmDoctorHealthScreenStateKey_(healthCheckId){return 'SBM_DOCTOR_HEALTH_SCREEN_'+String(healthCheckId||'');}
function sbmDoctorLoadHealthScreenState_(healthCheckId){
  try{
    var raw=PropertiesService.getDocumentProperties().getProperty(sbmDoctorHealthScreenStateKey_(healthCheckId));
    return raw?JSON.parse(raw):null;
  }catch(e){return null;}
}
function sbmDoctorSaveHealthScreenState_(healthCheckId,state){
  PropertiesService.getDocumentProperties().setProperty(sbmDoctorHealthScreenStateKey_(healthCheckId),JSON.stringify(state||{}));
}
function sbmDoctorClearHealthScreenState_(healthCheckId){
  try{PropertiesService.getDocumentProperties().deleteProperty(sbmDoctorHealthScreenStateKey_(healthCheckId));}catch(e){}
}

/**
 * RC8 Final QA UAT7: 健康状態判定を分割し、Spreadsheet負荷を抑える。
 * 以前は367記事等を1回で判定・帳票生成していたため、最後のSTEPだけApps Script上限を超え得た。
 */
function sbmDoctorRunScreeningBatch_(silent) {
  var run=sbmDoctorGetHealthRun_();
  if(!run||!run.healthCheckId) throw new Error('健康診断の実行情報がありません。');
  var sh=sbmGetOrCreateSheet_(SBM_SHEETS.DOCTOR_HEALTH_SNAPSHOT);
  var hm=sbmHeaderMap_(sh), last=sh.getLastRow();
  if(last<2) throw new Error('健康診断の対象データがありません。');
  var vals=sh.getRange(2,1,last-1,sh.getLastColumn()).getValues();
  var current=[];
  vals.forEach(function(row,idx){if(String(row[hm['健康診断ID']-1])===run.healthCheckId)current.push({row:row,idx:idx});});
  if(!current.length) throw new Error('健康診断の対象データがありません。');

  var state=sbmDoctorLoadHealthScreenState_(run.healthCheckId);
  if(!state || run.statusCode!=='SCREENING'){
    state={cursor:0,excluded:0,eligible:0,healthy:0,lowSample:0};
    run.statusCode='SCREENING'; run.phase='健康状態を判定中'; run.nextStep='記事を分割判定'; run.updatedAt=sbmNowText_(); sbmDoctorSaveHealthRun_(run);
    sbmDoctorSaveHealthScreenState_(run.healthCheckId,state);
  }

  var context=sbmDoctorSelectionContextLite_();
  var batchSize=Math.max(20,Math.min(60,Number(sbmGetSetting_('DoctorHealthScreenBatchSize','40')||40)));
  var start=Number(state.cursor||0);
  // 全記事判定済みなら、次のgoogle.script.run呼び出しで帳票生成だけを行う。
  if(start>=current.length) return sbmDoctorFinalizeScreening_(silent,state);
  var finish=Math.min(current.length,start+batchSize);
  for(var i=start;i<finish;i++){
    var item=current[i], row=item.row;
    var url=sbmNormalizeUrl_(row[hm['記事URL']-1]);
    var a=context.articleByUrl[url]||{};
    var work=String(a['作業状態']||'未着手');
    var flag=String(a['管理フラグ']||'');
    row[hm['SBM作業状態']-1]=work;
    row[hm['管理フラグ']-1]=flag;
    var exclusion=sbmDoctorSelectionExclusion_(url,a,context);
    if(exclusion){
      row[hm['Doctor診断対象']-1]='対象外';
      row[hm['対象外理由']-1]=exclusion;
      row[hm['精密診断順位']-1]='';
      row[hm['一次検査コード']-1]='SBM_MANAGED';
      row[hm['一次検査結果']-1]='SBMで対応中のため、今回の健康診断では対象外です';
      row[hm['詳細検査']-1]='対象外';
      row[hm['優先度']-1]='－';
      row[hm['診断の根拠']-1]=exclusion;
      row[hm['データ品質']-1]='確認不要';
      row[hm['取得状態']-1]='健康診断完了';
      state.excluded++;
    }else{
      state.eligible++;
      row[hm['Doctor診断対象']-1]='対象'; row[hm['対象外理由']-1]='';
      var m={
        full:{c:Number(row[hm['180日クリック']-1]||0),i:Number(row[hm['180日表示']-1]||0),ctr:Number(row[hm['180日CTR']-1]||0),p:Number(row[hm['180日平均順位']-1]||0)},
        first:{c:Number(row[hm['前半90日クリック']-1]||0),i:Number(row[hm['前半90日表示']-1]||0),ctr:Number(row[hm['前半90日CTR']-1]||0),p:Number(row[hm['前半90日平均順位']-1]||0)},
        second:{c:Number(row[hm['後半90日クリック']-1]||0),i:Number(row[hm['後半90日表示']-1]||0),ctr:Number(row[hm['後半90日CTR']-1]||0),p:Number(row[hm['後半90日平均順位']-1]||0)},
        recent:{c:Number(row[hm['直近28日クリック']-1]||0),i:Number(row[hm['直近28日表示']-1]||0),ctr:Number(row[hm['直近28日CTR']-1]||0),p:Number(row[hm['直近28日平均順位']-1]||0)},
        previous:{c:Number(row[hm['前28日クリック']-1]||0),i:Number(row[hm['前28日表示']-1]||0),ctr:Number(row[hm['前28日CTR']-1]||0),p:Number(row[hm['前28日平均順位']-1]||0)}
      };
      var sc=sbmDoctorScreenMetrics_(m);
      row[hm['一次検査コード']-1]=sc.code; row[hm['一次検査結果']-1]=sc.label;
      row[hm['詳細検査']-1]=sc.needsDetail?'候補':'不要'; row[hm['優先度']-1]=sc.priorityJa;
      row[hm['診断の根拠']-1]=sc.reasons.join('／'); row[hm['データ品質']-1]=sc.quality;
      row[hm['取得状態']-1]='健康診断完了'; row[hm['精密診断順位']-1]='';
      if(sc.code==='LOW_SAMPLE')state.lowSample++; else if(!sc.needsDetail)state.healthy++;
    }
    vals[item.idx]=row;
  }
  // current health-check rows are contiguous in snapshot; write one rectangular batch only.
  if(finish>start){
    var firstAbs=current[start].idx+2;
    var batchRows=[]; for(var j=start;j<finish;j++)batchRows.push(current[j].row);
    sh.getRange(firstAbs,1,batchRows.length,batchRows[0].length).setValues(batchRows);
  }
  state.cursor=finish;
  sbmDoctorSaveHealthScreenState_(run.healthCheckId,state);
  run.processedCount=finish; run.phase='健康状態を判定中 '+finish+' / '+current.length+'件'; run.nextStep=finish<current.length?'残りの記事を判定':'候補順位と診断書を作成'; run.lastSuccessAt=sbmNowText_(); run.updatedAt=sbmNowText_(); sbmDoctorSaveHealthRun_(run);
  if(finish<current.length) return {done:false,message:'健康状態を '+finish+' / '+current.length+'件 判定しました。次の分割処理へ進みます。'};

  // 判定完了と帳票生成を分離し、最後のバッチが実行上限を超えないようにする。
  run.phase='健康状態の判定完了'; run.nextStep='健康診断書を作成'; run.updatedAt=sbmNowText_(); sbmDoctorSaveHealthRun_(run);
  return {done:false,message:'全記事の判定が完了しました。次のSTEPで健康診断書を作成します。'};
}

function sbmDoctorFinalizeScreening_(silent,state){
  var run=sbmDoctorGetHealthRun_();
  var sh=sbmGetOrCreateSheet_(SBM_SHEETS.DOCTOR_HEALTH_SNAPSHOT), hm=sbmHeaderMap_(sh), last=sh.getLastRow();
  var vals=sh.getRange(2,1,last-1,sh.getLastColumn()).getValues(), candidates=[];
  vals.forEach(function(row,idx){
    if(String(row[hm['健康診断ID']-1])!==run.healthCheckId)return;
    var code=String(row[hm['一次検査コード']-1]||'');
    if(!/^(RECENT_DROP|LONG_TERM_DECLINE|CTR_OPPORTUNITY|POSITION_OPPORTUNITY|LONG_TERM_STAGNATION)$/.test(code))return;
    var m={full:{i:Number(row[hm['180日表示']-1]||0),c:Number(row[hm['180日クリック']-1]||0)}};
    candidates.push({idx:idx,score:sbmDoctorCandidateScore_({priorityJa:String(row[hm['優先度']-1]||''),code:code},m),impressions:m.full.i,clicks:m.full.c});
  });
  candidates.sort(function(a,b){return b.score-a.score||b.impressions-a.impressions||b.clicks-a.clicks;});
  var limit=Math.max(1,Math.min(20,Number(sbmGetSetting_('DoctorDetailedDiagnosisLimit','10')||10))), selected=Math.min(limit,candidates.length);
  candidates.forEach(function(c,i){
    var row=vals[c.idx];
    if(i<limit){row[hm['詳細検査']-1]='精密診断候補';row[hm['精密診断順位']-1]=i+1;}
    else{row[hm['詳細検査']-1]='今回は見送り';row[hm['診断の根拠']-1]=String(row[hm['診断の根拠']-1]||'')+'／優先順位上位'+limit+'件を先に診断します';}
  });
  sh.getRange(2,1,vals.length,vals[0].length).setValues(vals);
  run.statusCode='COMPLETED'; run.phase='完了'; run.nextStep='健康診断書を確認し、必要な記事だけ精密診断'; run.processedCount=Number(state.eligible||0); run.lastSuccessAt=sbmNowText_(); run.updatedAt=sbmNowText_(); sbmDoctorSaveHealthRun_(run);
  sbmDoctorBuildHealthReportSheets_(run.healthCheckId,run,{excluded:Number(state.excluded||0),eligible:Number(state.eligible||0),selected:selected,candidateTotal:candidates.length,lowSample:Number(state.lowSample||0),healthy:Number(state.healthy||0)});
  sbmDoctorClearHealthScreenState_(run.healthCheckId);
  sbmDoctorDeleteContinuationTriggers_();
  if(!silent){sbmAlert_('ブログ健康診断が完了しました','登録記事：'+run.targetCount+'件\n詳しい診断が必要な記事：'+selected+'件\n経過を見る記事：'+Number(state.lowSample||0)+'件\n大きな問題が見つからなかった記事：'+Number(state.healthy||0)+'件\n\nまず健康診断書を確認してください。');sbmDoctorOpenHealthReport();}
  return {done:true,message:'健康状態の判定と診断書作成が完了しました。'};
}

// 旧参照互換。新Runnerでは分割版を使用する。
function sbmDoctorRunScreening_(silent){return sbmDoctorRunScreeningBatch_(silent);}

function sbmDoctorSelectionContextLite_(){
  var sh=sbmGetOrCreateSheet_(SBM_SHEETS.ARTICLE_DB), byUrl={};
  if(sh.getLastRow()>1){
    var hm=sbmHeaderMap_(sh), n=sh.getLastRow()-1;
    var urls=sh.getRange(2,hm['記事URL'],n,1).getDisplayValues();
    var works=sh.getRange(2,hm['作業状態'],n,1).getDisplayValues();
    var flags=sh.getRange(2,hm['管理フラグ'],n,1).getDisplayValues();
    for(var i=0;i<n;i++){var u=sbmNormalizeUrl_(urls[i][0]);if(u)byUrl[u]={'記事URL':urls[i][0],'作業状態':works[i][0],'管理フラグ':flags[i][0]};}
  }
  var candidateUrls={};
  try{var saved=JSON.parse(String(sbmGetSetting_('TodayRecommendationJson','[]')||'[]'));(saved||[]).forEach(function(x){var u=sbmNormalizeUrl_(x.url||x['記事URL']||'');if(u)candidateUrls[u]=true;});}catch(e){}
  return {articleByUrl:byUrl,candidateUrls:candidateUrls};
}

function sbmDoctorSelectionContext_(){
  var rows=sbmRowsAsObjects_(SBM_SHEETS.ARTICLE_DB), byUrl={};
  rows.forEach(function(a){var u=sbmNormalizeUrl_(a['記事URL']); if(u)byUrl[u]=a;});
  var candidateUrls={};
  try{
    var saved=JSON.parse(String(sbmGetSetting_('TodayRecommendationJson','[]')||'[]'));
    (saved||[]).forEach(function(x){var u=sbmNormalizeUrl_(x.url||x['記事URL']||''); if(u)candidateUrls[u]=true;});
  }catch(e){}
  return {articleByUrl:byUrl,candidateUrls:candidateUrls};
}

function sbmDoctorSelectionExclusion_(url,a,ctx){
  if(!a || !Object.keys(a).length) return '記事管理に登録されていないURLです';
  var work=String(a['作業状態']||'');
  var flag=String(a['管理フラグ']||'');
  if(work.indexOf('モニター中')>=0) return '改善後の効果をモニター中です';
  if(work.indexOf('今日の改善')>=0) return '今日の改善対象として対応予定です';
  if(work.indexOf('改善中')>=0) return '現在改善作業中です';
  if(work.indexOf('改善候補')>=0 || ctx.candidateUrls[url]) return 'SBMの改善候補として管理中です';
  if(flag==='要確認') return 'SBMで利用者確認待ちです';
  if(/管理対象外|削除済み|URL変更|データ未取得/.test(flag)) return 'SBMの管理対象外またはデータ未取得です';
  return '';
}

function sbmDoctorCandidateScore_(s,m){
  var p={'高':300,'中':200,'低':100}[s.priorityJa]||0;
  var code={'RECENT_DROP':80,'LONG_TERM_DECLINE':70,'CTR_OPPORTUNITY':60,'POSITION_OPPORTUNITY':50,'LONG_TERM_STAGNATION':40}[s.code]||0;
  var volume=Math.min(99,Math.log(Math.max(1,m.full.i))*10);
  return p+code+volume;
}

function sbmDoctorScreenMetrics_(m) {
  var reasons=[], code='HEALTHY', label='現在の状態はおおむね良好です', priority='低', detail=false;
  var quality = m.full.i >= 100 ? '十分' : (m.full.i >= 20 ? '限定的' : '不足');
  if (m.full.i < 20) return {code:'LOW_SAMPLE',label:'データが少ないため、もう少し様子を見る必要があります',needsDetail:false,priorityJa:'低',reasons:['表示回数が少なく確定判断できません'],quality:quality};
  var impDrop = m.first.i>0 ? (m.second.i-m.first.i)/m.first.i : 0;
  var clickDrop = m.first.c>0 ? (m.second.c-m.first.c)/m.first.c : 0;
  var recentImpDrop = m.previous.i>0 ? (m.recent.i-m.previous.i)/m.previous.i : 0;
  if (impDrop <= -0.35 || clickDrop <= -0.35) { code='LONG_TERM_DECLINE'; label='半年の後半にかけて低下傾向があります'; priority='高'; detail=true; reasons.push('前半90日と比べて後半90日の表示またはクリックが35%以上減少しています'); }
  else if (recentImpDrop <= -0.40) { code='RECENT_DROP'; label='直近で急な低下が見られます'; priority='高'; detail=true; reasons.push('直近28日の表示回数がその前28日より40%以上減少しています'); }
  else if (m.full.i >= 100 && m.full.p >= 10 && m.full.p <= 20) { code='POSITION_OPPORTUNITY'; label='検索順位を少し上げると成果が期待できます'; priority='中'; detail=true; reasons.push('半年平均順位が10位から20位の範囲です'); }
  else if (m.full.i >= 200 && m.full.ctr < 0.015 && m.full.p <= 10) { code='CTR_OPPORTUNITY'; label='クリック率を改善できる可能性があります'; priority='中'; detail=true; reasons.push('表示回数が多い一方でクリック率が低めです'); }
  else if (Math.abs(impDrop) < 0.10 && Math.abs(clickDrop) < 0.10 && m.full.p > 10) { code='LONG_TERM_STAGNATION'; label='長期間ほぼ横ばいで、改善余地を確認する必要があります'; priority='中'; detail=true; reasons.push('前半90日と後半90日の変化が小さく、順位も10位より下です'); }
  if (!reasons.length) reasons.push('半年間の主要指標に大きな異常はありません');
  return {code:code,label:label,needsDetail:detail,priorityJa:priority,reasons:reasons,quality:quality};
}

function sbmDoctorFetchPageMetrics_(range) {
  if (!range || !range.startDate) return [];
  var property=sbmGetSetting_('SearchConsoleProperty','');
  var data=sbmSearchConsoleApiRequest_(property,{startDate:range.startDate,endDate:range.endDate,dimensions:['page'],rowLimit:SBM_DOCTOR_HEALTH_PAGE_LIMIT,startRow:0});
  var map={};
  (data.rows||[]).forEach(function(r){
    var raw=String(r.keys&&r.keys[0]?r.keys[0]:'').trim();
    // RC8 Final QA UAT5: 健康診断は記事のCanonical URL本体だけを集計する。
    // ?utm= / preview / tracking 等のURLバリアントを正規化後に合算すると、
    // クリックはほぼ同じまま表示回数だけ数倍になる SUMMARY_ROWS_MISMATCH を起こす。
    if(!raw || raw.indexOf('?')>=0 || raw.indexOf('#')>=0) return;
    var url=sbmNormalizeUrl_(raw);
    if(!url || !sbmIsValidArticleUrl_(url)) return;
    var imps=Number(r.impressions||0), clicks=Number(r.clicks||0), pos=Number(r.position||0);
    var candidate={url:url,source_url:raw,clicks:clicks,impressions:imps,ctr:imps?clicks/imps:0,position:pos};
    // 末尾スラッシュ等で同一Canonical Keyが複数返った場合も合算しない。
    // canonical代表として実績の大きい1行だけを採用する。
    var prev=map[url];
    if(!prev || candidate.clicks>prev.clicks || (candidate.clicks===prev.clicks && candidate.impressions>prev.impressions)) map[url]=candidate;
  });
  return Object.keys(map).map(function(url){return map[url];});
}

function sbmDoctorMergeSnapshotMetrics_(healthCheckId, period, prefix, metrics) {
  var sh=sbmGetOrCreateSheet_(SBM_SHEETS.DOCTOR_HEALTH_SNAPSHOT); sbmEnsureHeaders_(sh,SBM_HEADERS.DOCTOR_HEALTH_SNAPSHOT);
  var hm=sbmHeaderMap_(sh), articles=sbmRowsAsObjects_(SBM_SHEETS.ARTICLE_DB), artByUrl={};
  articles.forEach(function(a){var u=sbmNormalizeUrl_(a['記事URL']); if(u) artByUrl[u]=a;});
  var existing=sh.getLastRow()>1?sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).getValues():[];
  if(prefix==='full') {
    existing=existing.filter(function(row){return String(row[hm['健康診断ID']-1])!==healthCheckId;});
    var mm={}; metrics.forEach(function(m){mm[sbmNormalizeUrl_(m.url)]=m;});
    Object.keys(artByUrl).forEach(function(url){
      var a=artByUrl[url]||{}, m=mm[url]||{url:url,clicks:0,impressions:0,ctr:0,position:0};
      var row=new Array(SBM_HEADERS.DOCTOR_HEALTH_SNAPSHOT.length).fill('');
      row[hm['健康診断ID']-1]=healthCheckId; row[hm['サイトID']-1]=sbmGetSetting_('SiteID',''); row[hm['記事ID']-1]=a['ArticleID']||'';
      row[hm['記事URL']-1]=url; row[hm['記事タイトル']-1]=a['H1タイトル']||a['記事タイトル']||'';
      row[hm['SBM作業状態']-1]=a['作業状態']||'未着手'; row[hm['管理フラグ']-1]=a['管理フラグ']||'';
      row[hm['対象期間開始']-1]=period.full.startDate; row[hm['対象期間終了']-1]=period.full.endDate; row[hm['対象日数']-1]=SBM_DOCTOR_HEALTH_DAYS;
      sbmDoctorPutMetric_(row,hm,'180日',m); row[hm['取得状態']-1]='180日集計完了'; row[hm['取得日時']-1]=sbmNowText_(); existing.push(row);
    });
  } else {
    var mm2={}; metrics.forEach(function(m){mm2[sbmNormalizeUrl_(m.url)]=m;});
    existing.forEach(function(row){if(String(row[hm['健康診断ID']-1])!==healthCheckId)return; var u=sbmNormalizeUrl_(row[hm['記事URL']-1]); sbmDoctorPutMetric_(row,hm,prefix==='first'?'前半90日':prefix==='second'?'後半90日':prefix==='recent'?'直近28日':'前28日',mm2[u]||{clicks:0,impressions:0,ctr:0,position:0}); row[hm['取得状態']-1]=(prefix==='first'?'前半90日':prefix==='second'?'後半90日':prefix==='recent'?'直近28日':'比較期間')+'集計完了'; row[hm['取得日時']-1]=sbmNowText_();});
  }
  sh.clearContents(); sh.getRange(1,1,1,SBM_HEADERS.DOCTOR_HEALTH_SNAPSHOT.length).setValues([SBM_HEADERS.DOCTOR_HEALTH_SNAPSHOT]);
  if(existing.length) sh.getRange(2,1,existing.length,SBM_HEADERS.DOCTOR_HEALTH_SNAPSHOT.length).setValues(existing);
  try{sh.hideSheet();}catch(e){}
}

function sbmDoctorPutMetric_(row,hm,label,m) {
  row[hm[label+'クリック']-1]=Number(m.clicks||0); row[hm[label+'表示']-1]=Number(m.impressions||0); row[hm[label+'CTR']-1]=Number(m.ctr||0); row[hm[label+'平均順位']-1]=Number(m.position||0);
}

function sbmDoctorHealthPeriod_() {
  var end=new Date(); end.setDate(end.getDate()-SBM_DEFAULTS.GSC_DELAY_DAYS);
  var fullStart=new Date(end); fullStart.setDate(fullStart.getDate()-SBM_DOCTOR_HEALTH_DAYS+1);
  var firstEnd=new Date(fullStart); firstEnd.setDate(firstEnd.getDate()+89);
  var secondStart=new Date(firstEnd); secondStart.setDate(secondStart.getDate()+1);
  var recentStart=new Date(end); recentStart.setDate(recentStart.getDate()-27);
  var previousEnd=new Date(recentStart); previousEnd.setDate(previousEnd.getDate()-1);
  var previousStart=new Date(previousEnd); previousStart.setDate(previousStart.getDate()-27);
  function r(a,b){return {startDate:sbmDateText_(a),endDate:sbmDateText_(b)};}
  return {full:r(fullStart,end),first:r(fullStart,firstEnd),second:r(secondStart,end),recent:r(recentStart,end),previous:r(previousStart,previousEnd)};
}
function sbmDoctorDateValue_(value) {
  if (Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value.getTime())) return new Date(value.getTime());
  var text = String(value || '').trim();
  var m = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (m) return new Date(Number(m[1]), Number(m[2])-1, Number(m[3]));
  var parsed = new Date(text);
  if (!isNaN(parsed.getTime())) return parsed;
  throw new Error('健康診断の対象日付を読み取れません：' + text);
}
function sbmDoctorDateTextFromValue_(value) {
  return Utilities.formatDate(sbmDoctorDateValue_(value), SBM_DEFAULTS.TIMEZONE, 'yyyy-MM-dd');
}
function sbmDoctorHealthPeriodFromRun_(run){
  var start=sbmDoctorDateValue_(run.startDate), end=sbmDoctorDateValue_(run.endDate);
  var firstEnd=new Date(start); firstEnd.setDate(firstEnd.getDate()+89); var secondStart=new Date(firstEnd); secondStart.setDate(secondStart.getDate()+1);
  var recentStart=new Date(end); recentStart.setDate(recentStart.getDate()-27); var previousEnd=new Date(recentStart); previousEnd.setDate(previousEnd.getDate()-1); var previousStart=new Date(previousEnd); previousStart.setDate(previousStart.getDate()-27);
  function r(a,b){return {startDate:sbmDateText_(a),endDate:sbmDateText_(b)};}
  return {full:r(start,end),first:r(start,firstEnd),second:r(secondStart,end),recent:r(recentStart,end),previous:r(previousStart,previousEnd)};
}

function sbmDoctorSaveHealthRun_(run) {
  sbmDoctorEnsureMedicalSheets_(); var sh=sbmGetOrCreateSheet_(SBM_SHEETS.DOCTOR_HEALTH_RUN); var h=SBM_HEADERS.DOCTOR_HEALTH_RUN;
  var row=[run.healthCheckId,run.statusCode,run.phase,run.startDate,run.endDate,run.targetCount||0,run.processedCount||0,run.nextStep||'',run.lastSuccessAt||'',run.retryCount||0,run.lastError||'',run.createdAt||sbmNowText_(),run.updatedAt||sbmNowText_()];
  var last=sh.getLastRow(), found=0;
  if(last>1){var ids=sh.getRange(2,1,last-1,1).getDisplayValues(); for(var i=ids.length-1;i>=0;i--){if(ids[i][0]===run.healthCheckId){found=i+2;break;}}}
  if(found) sh.getRange(found,1,1,h.length).setValues([row]); else sh.appendRow(row);
  try{sh.hideSheet();}catch(e){}
  sbmSetSetting_('DoctorActiveHealthCheckId',run.healthCheckId,'現在のDoctorブログ健康診断ID');
}
function sbmDoctorGetHealthRun_() {
  var id=String(sbmGetSetting_('DoctorActiveHealthCheckId','')||''); if(!id)return null;
  var sh=sbmGetOrCreateSheet_(SBM_SHEETS.DOCTOR_HEALTH_RUN);
  if (sh.getLastRow() < 2) return null;
  var hm=sbmHeaderMap_(sh), vals=sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).getValues();
  for(var i=vals.length-1;i>=0;i--){
    var r=vals[i]; if(String(r[hm['健康診断ID']-1])!==id) continue;
    return {
      healthCheckId:id,
      statusCode:String(r[hm['状態コード']-1]||''),
      phase:String(r[hm['現在の工程']-1]||''),
      startDate:sbmDoctorDateTextFromValue_(r[hm['対象期間開始']-1]),
      endDate:sbmDoctorDateTextFromValue_(r[hm['対象期間終了']-1]),
      targetCount:Number(r[hm['対象記事数']-1]||0), processedCount:Number(r[hm['処理済み件数']-1]||0),
      nextStep:String(r[hm['次の処理']-1]||''), lastSuccessAt:String(r[hm['最終成功日時']-1]||''),
      retryCount:Number(r[hm['再試行回数']-1]||0), lastError:String(r[hm['最終エラー']-1]||''),
      createdAt:String(r[hm['作成日時']-1]||''), updatedAt:String(r[hm['更新日時']-1]||'')
    };
  }
  return null;
}

function sbmDoctorClearSnapshotForRun_(id){var sh=sbmGetOrCreateSheet_(SBM_SHEETS.DOCTOR_HEALTH_SNAPSHOT); sbmEnsureHeaders_(sh,SBM_HEADERS.DOCTOR_HEALTH_SNAPSHOT); if(sh.getLastRow()<2)return; var vals=sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).getValues(), hm=sbmHeaderMap_(sh), keep=vals.filter(function(r){return String(r[hm['健康診断ID']-1])!==id;}); sh.clearContents(); sh.getRange(1,1,1,SBM_HEADERS.DOCTOR_HEALTH_SNAPSHOT.length).setValues([SBM_HEADERS.DOCTOR_HEALTH_SNAPSHOT]); if(keep.length)sh.getRange(2,1,keep.length,keep[0].length).setValues(keep);}
function sbmDoctorHealthStatusJa_(code){var m={PREPARING:'準備中',PREFLIGHT_DONE:'開始準備完了',FETCHING_FULL:'180日集計を取得中',FULL_DONE:'180日集計完了',FETCHING_FIRST:'前半90日集計を取得中',FIRST_DONE:'前半90日集計完了',FETCHING_SECOND:'後半90日集計を取得中',SECOND_DONE:'後半90日集計完了',FETCHING_RECENT:'直近28日集計を取得中',RECENT_DONE:'直近28日集計完了',FETCHING_PREVIOUS:'比較期間を取得中',PREVIOUS_DONE:'比較データ取得完了',SCREENING:'健康状態を分割判定中',COMPLETED:'完了',RETRYABLE_ERROR:'停止（再開できます）'};return m[code]||code||'未開始';}
function sbmDoctorHealthProgress_(code,processed,total,phase){
  var m={PREPARING:2,PREFLIGHT_DONE:8,FETCHING_FULL:10,FULL_DONE:24,FETCHING_FIRST:26,FIRST_DONE:38,FETCHING_SECOND:40,SECOND_DONE:52,FETCHING_RECENT:54,RECENT_DONE:66,FETCHING_PREVIOUS:68,PREVIOUS_DONE:80,COMPLETED:100,RETRYABLE_ERROR:null};
  if(code==='SCREENING'){
    if(String(phase||'').indexOf('判定完了')>=0) return 98;
    var t=Math.max(1,Number(total||0)), p=Math.max(0,Math.min(t,Number(processed||0)));
    return Math.min(97,Math.round(82+(p/t)*15));
  }
  return m.hasOwnProperty(code)?m[code]:0;
}
function sbmDoctorHealthStepLabel_(run){
  var c=String(run.statusCode||''), phase=String(run.phase||'');
  if(c==='PREPARING'||c==='PREFLIGHT_DONE')return 'STEP 1 / 8　開始準備';
  if(c==='FETCHING_FULL'||c==='FULL_DONE')return 'STEP 2 / 8　過去180日の検索データ取得';
  if(c==='FETCHING_FIRST'||c==='FIRST_DONE')return 'STEP 3 / 8　前半90日のデータ取得';
  if(c==='FETCHING_SECOND'||c==='SECOND_DONE')return 'STEP 4 / 8　後半90日のデータ取得';
  if(c==='FETCHING_RECENT'||c==='RECENT_DONE')return 'STEP 5 / 8　直近28日のデータ取得';
  if(c==='FETCHING_PREVIOUS'||c==='PREVIOUS_DONE')return 'STEP 6 / 8　比較期間のデータ取得';
  if(c==='SCREENING'&&phase.indexOf('判定完了')<0)return 'STEP 7 / 8　記事ごとの健康状態を分析';
  if(c==='SCREENING'||c==='COMPLETED')return 'STEP 8 / 8　精密診断候補と健康診断書を作成';
  return sbmDoctorHealthStatusJa_(c);
}
function sbmDoctorHealthStageLine_(code){
  var order=['PREPARING','PREFLIGHT_DONE','FETCHING_FULL','FULL_DONE','FETCHING_FIRST','FIRST_DONE','FETCHING_SECOND','SECOND_DONE','FETCHING_RECENT','RECENT_DONE','FETCHING_PREVIOUS','PREVIOUS_DONE','SCREENING','COMPLETED'];
  var idx=order.indexOf(code);
  if(code==='RETRYABLE_ERROR') return '①データ取得  ②比較データ  ③健康状態判定  ⚠停止';
  var dataDone=idx>=9, compareDone=idx>=11, screeningDone=idx>=12;
  return '①データ取得 '+(dataDone?'✓':idx>=1?'…':'・')+'   ②比較データ '+(compareDone?'✓':idx>=9?'…':'・')+'   ③健康状態判定 '+(screeningDone?'✓':idx>=11?'…':'・');
}
function sbmDoctorFriendlyHealthError_(message){
  var s=String(message||'');
  if(!s)return '';
  if(/権限|permission|authorization|ScriptApp|getProjectTriggers/i.test(s))return 'Google Apps Script の権限確認が必要です。';
  if(/時間|timeout|maximum execution|exceeded/i.test(s))return '処理時間の上限で一時停止しました。保存済みの続きから再開できます。';
  return '処理が途中で停止しました。保存済みの続きから再開できます。';
}
function sbmDoctorShowHealthCheckStatus(){
  sbmDoctorEnsureMedicalSheets_();
  var r=sbmDoctorGetHealthRun_();
  if(!r)return sbmAlert_('健康診断の進み具合','まだ健康診断は開始されていません。');
  var pct=sbmDoctorHealthProgress_(r.statusCode,r.processedCount,r.targetCount,r.phase), isError=r.statusCode==='RETRYABLE_ERROR';
  var progressText=pct===null?'停止中':('進捗：'+pct+'%');
  var articleText=(Number(r.targetCount||0)>0)?('記事：'+Number(r.processedCount||0)+' / '+Number(r.targetCount||0)+'件'):'';
  var next=isError?'「1．ブログ健康診断を実行」を選ぶと、続きから再開します。':(r.statusCode==='COMPLETED'?'健康診断書を確認し、必要な記事だけ精密診断します。':String(r.nextStep||'処理を続けます。'));
  var body=[
    progressText+'　'+sbmDoctorHealthStatusJa_(r.statusCode),
    articleText,
    sbmDoctorHealthStageLine_(r.statusCode),
    '',
    '現在：'+String(r.phase||sbmDoctorHealthStatusJa_(r.statusCode)),
    '次に行うこと：'+next
  ];
  if(isError&&r.lastError)body.push('','⚠ '+sbmDoctorFriendlyHealthError_(r.lastError));
  sbmAlert_('健康診断の進み具合',body.filter(function(v,i){return !(v===''&&body[i-1]==='');}).join('\n'));
}

/**
 * Product 5.7.0 RC2: SIMS Doctor 外来診療 Sprint 1
 *
 * 安全境界:
 * - 日次処理、記事ランク、改善候補、改善履歴を変更しません。
 * - 利用者がメニューを実行した時だけJSONを生成します。
 * - Doctor、Writer、時間主導トリガーを自動起動しません。
 */
const SBM_DOCTOR_SINGLE_CASE_FORMAT = 'SIMS_DOCTOR_SINGLE_CASE_REQUEST_V2';
const SBM_DOCTOR_CONTRACT_VERSION = '2.0';
const SBM_DOCTOR_SCHEMA_VERSION = '2.0.0';
const SBM_DOCTOR_EVIDENCE_DAYS = 180;
const SBM_DOCTOR_QUERY_LIMIT = 200;

function sbmDoctorCreateRequestFromArticleList() {
  var sh = SpreadsheetApp.getActiveSheet();
  if (!sh || sh.getName() !== SBM_SHEETS.ARTICLE_DB) {
    return sbmAlert_('SIMS Doctor', '記事一覧（記事管理）を開き、対象記事を1件選択してください。');
  }
  var row = sbmGetCheckedRow_(sh);
  if (!row) return;
  return sbmDoctorCreateAndSaveRequest_('ARTICLE_LIST', sh, row);
}

function sbmDoctorCreateRequestFromEffect() {
  var sh = SpreadsheetApp.getActiveSheet();
  if (!sh || sh.getName() !== SBM_SHEETS.EFFECT) {
    return sbmAlert_('SIMS Doctor', '改善の推移を開き、診断する記事の行を1行選択してください。');
  }
  var range = sh.getActiveRange();
  if (!range || range.getRow() < 2 || range.getNumRows() !== 1) {
    return sbmAlert_('SIMS Doctor', '見出し以外の対象行を1行だけ選択してください。');
  }
  return sbmDoctorCreateAndSaveRequest_('IMPROVEMENT_EFFECT', sh, range.getRow());
}

function sbmDoctorCreateAndSaveRequest_(sourceType, sourceSheet, sourceRow) {
  try {
    sbmDoctorAssertSafeToExport_();
    var context = sbmDoctorResolveContext_(sourceType, sourceSheet, sourceRow);
    return sbmDoctorCreateAndSaveResolvedRequest_(context);
  } catch (e) {
    try { sbmLog_('DoctorSingleCaseRequest', 'Error', String(e)); } catch (ignore) {}
    sbmAlert_('SIMS Doctor 外来診療依頼を作成できません', String(e && e.message ? e.message : e));
    return {ok:false, error:String(e)};
  }
}

function sbmDoctorAssertSafeToExport_() {
  var runtime = sbmGetDailyRuntimeState_();
  if (runtime && runtime.running) {
    throw new Error('日次処理の実行中はDoctor依頼を作成できません。日次処理の完了後に実行してください。');
  }
  var siteId = String(sbmGetSetting_('SiteID','') || '').trim();
  var siteName = String(sbmGetSetting_('SiteName','') || sbmGetSetting_('BlogName','') || '').trim();
  var blogUrl = String(sbmGetSetting_('BlogUrl','') || '').trim();
  var property = String(sbmGetSetting_('SearchConsoleProperty','') || '').trim();
  var missing=[];
  if (!siteId) missing.push('SiteID');
  if (!siteName) missing.push('SiteName');
  if (!blogUrl) missing.push('BlogUrl');
  if (!property) missing.push('SearchConsoleProperty');
  if (missing.length) throw new Error('Doctor連携に必要な設定がありません：' + missing.join(', '));
}

function sbmDoctorResolveContext_(sourceType, sourceSheet, sourceRow) {
  var sourceRecord = sbmRowRecord_(sourceSheet, sourceRow);
  var url = String(sourceRecord['記事URL'] || sourceRecord['URL'] || '').trim();
  if (!url) throw new Error('選択行から記事URLを取得できません。');
  var article = sourceType === 'ARTICLE_LIST' ? sourceRecord : sbmFindArticleDbByUrl_(url);
  if (!article) throw new Error('記事管理に対応する記事が見つかりません。');
  var articleId = String(article['ArticleID'] || '').trim();
  if (!articleId) throw new Error('対象記事にArticleIDがありません。先に記事情報を取得してください。');
  var effect = sourceType === 'IMPROVEMENT_EFFECT' ? sourceRecord : sbmDoctorFindEffectByUrl_(url);
  var history = sbmDoctorFindLatestHistory_(articleId, url);
  return {sourceType:sourceType, article:article, effect:effect, history:history, sourceSheet:sourceSheet.getName(), sourceRow:sourceRow};
}

function sbmDoctorFindEffectByUrl_(url) {
  var rows = sbmRowsAsObjects_(SBM_SHEETS.EFFECT) || [];
  var normalized = sbmNormalizeUrl_(url);
  for (var i=0;i<rows.length;i++) {
    if (sbmNormalizeUrl_(rows[i]['URL'] || '') === normalized) return rows[i];
  }
  return null;
}

function sbmDoctorFindLatestHistory_(articleId, url) {
  var rows = sbmRowsAsObjects_(SBM_SHEETS.FEEDBACK_HISTORY) || [];
  var normalized = sbmNormalizeUrl_(url);
  var matches = rows.filter(function(r){
    return (articleId && String(r['ArticleID'] || '').trim() === articleId) ||
      sbmNormalizeUrl_(r['記事URL'] || '') === normalized;
  });
  if (!matches.length) return null;
  return matches[matches.length-1];
}

function sbmDoctorBuildSingleCaseRequest_(ctx) {
  var article=ctx.article, effect=ctx.effect || {}, history=ctx.history || {};
  var now=new Date();
  var articleId=String(article['ArticleID']||'').trim();
  var url=String(article['記事URL']||'').trim();
  var judgement=String(effect['判定']||'').trim();
  var improvementDate=effect['改善日'] || history['改善日'] || null;
  var elapsed=sbmDoctorNumberOrNull_(effect['経過日数']);
  var hasImprovement=!!(improvementDate || history['改善履歴ID']);
  var before={
    clicks:sbmDoctorNumberOrNull_(effect['改善前クリック'] !== undefined ? effect['改善前クリック'] : history['改善前クリック']),
    impressions:sbmDoctorNumberOrNull_(history['改善前表示回数']),
    ctr:sbmDoctorCtrValue_(effect['改善前CTR'] !== undefined ? effect['改善前CTR'] : history['改善前CTR']),
    position:sbmDoctorNumberOrNull_(effect['改善前順位'] !== undefined ? effect['改善前順位'] : history['改善前順位'])
  };
  var current={
    clicks:sbmDoctorNumberOrNull_(article['クリック数']),
    impressions:sbmDoctorNumberOrNull_(article['表示回数']),
    ctr:sbmDoctorCtrValue_(article['CTR']),
    position:sbmDoctorNumberOrNull_(article['掲載順位'])
  };
  var work=String(article['作業状態']||'未着手').trim();
  var workflow=sbmDoctorWorkflowCode_(work);
  var monitoring=workflow==='SBM_MONITORING';
  var caseId=sbmDoctorGenerateCaseId_(articleId);
  var requestId='REQ-'+Utilities.formatDate(now,SBM_DEFAULTS.TIMEZONE,'yyyyMMdd-HHmmss')+'-'+articleId;
  var messageId='MSG-'+Utilities.formatDate(now,SBM_DEFAULTS.TIMEZONE,'yyyyMMdd-HHmmss')+'-'+Utilities.getUuid().substring(0,8);
  var trigger=sbmDoctorTriggerCode_(ctx.sourceType, judgement);
  var payload={
    format:SBM_DOCTOR_SINGLE_CASE_FORMAT,
    contract_version:SBM_DOCTOR_CONTRACT_VERSION,
    schema_version:SBM_DOCTOR_SCHEMA_VERSION,
    source_system:'SIMS_BLOG_MANAGER',
    target_system:'SIMS_DOCTOR',
    message_id:messageId,
    case_id:caseId,
    generated_at:sbmDoctorIso_(now),
    timezone:SBM_DEFAULTS.TIMEZONE,
    site:{
      site_id:String(sbmGetSetting_('SiteID','')).trim(),
      site_name:String(sbmGetSetting_('SiteName','')||sbmGetSetting_('BlogName','')).trim(),
      blog_url:String(sbmGetSetting_('BlogUrl','')).trim(),
      search_console_property:String(sbmGetSetting_('SearchConsoleProperty','')).trim()
    },
    request:{
      request_id:requestId,
      case_id:caseId,
      consultation_mode:'SINGLE_ARTICLE_CLINIC',
      requested_by:'USER',
      requested_at:sbmDoctorIso_(now),
      trigger:trigger,
      chief_complaint:sbmDoctorChiefComplaint_(ctx.sourceType, judgement),
      urgency:ctx.candidateUrgency|| (judgement.indexOf('悪化')>=0?'HIGH':'NORMAL'),
      health_screening_severity:ctx.candidateSeverity||null,
      health_check_id:ctx.healthCheckId||null,
      source_sheet:ctx.sourceSheet,
      source_row:ctx.sourceRow
    },
    article:{
      article_id:articleId,
      url:url,
      canonical_url:url,
      title:String(article['H1タイトル']||article['記事タイトル']||'').trim(),
      h1:String(article['H1タイトル']||'').trim(),
      seo_title:String(article['SEOタイトル']||'').trim(),
      meta_description:String(article['メタディスクリプション']||'').trim(),
      main_query:sbmRealMainQuery_(article['メインクエリ']),
      published_at:null,
      updated_at:sbmDoctorDateOrNull_(article['補完日時']||article['最終確認日']),
      article_rank:sbmDoctorRankCode_(article['記事ランク']),
      article_status:String(article['記事ステータス']||'ACTIVE').trim()||'ACTIVE'
    },
    current_performance:{
      period_days:Number(sbmGetSetting_('SearchDays',SBM_DEFAULTS.SEARCH_DAYS)||SBM_DEFAULTS.SEARCH_DAYS),
      clicks:current.clicks,
      impressions:current.impressions,
      ctr:current.ctr,
      position:current.position,
      data_updated_at:sbmDoctorDateOrNull_(article['データ更新日']||article['最終取得日時']),
      data_quality:sbmDoctorDataQuality_(current.impressions)
    },
    improvement_context:{
      has_active_improvement:hasImprovement,
      improvement_history_id:String(history['改善履歴ID']||'').trim()||null,
      improvement_date:sbmDoctorDateOnlyOrNull_(improvementDate),
      elapsed_days:elapsed,
      before:before,
      current:current,
      changes:{
        clicks_change:sbmDoctorSubtract_(current.clicks,before.clicks),
        impressions_change:sbmDoctorSubtract_(current.impressions,before.impressions),
        ctr_change:sbmDoctorSubtract_(current.ctr,before.ctr),
        position_change:sbmDoctorSubtract_(current.position,before.position)
      },
      sbm_judgement:sbmDoctorJudgementCode_(judgement),
      writer_result_format:String(history['Feedback Format']||'').trim()||null,
      writer_version:String(history['Writer Version']||'').trim()||null,
      changed_sections:sbmDoctorChangedSections_(history)
    },
    workflow:{
      workflow_status:workflow,
      active_improvement_id:String(history['改善履歴ID']||'').trim()||null,
      active_case_id:caseId,
      manual_hold:workflow==='MANUAL_HOLD',
      lock:{
        locked:workflow!=='AVAILABLE',
        lock_owner:workflow.indexOf('SBM_')===0?'SIMS_BLOG_MANAGER':null,
        lock_type:monitoring?'MONITORING':(workflow!=='AVAILABLE'?'WORKFLOW':null),
        lock_reference_id:String(history['改善履歴ID']||'').trim()||null
      },
      doctor_diagnosis_allowed:true,
      doctor_treatment_allowed:workflow==='AVAILABLE'
    },
    diagnosis_scope:{
      requested_examinations:hasImprovement?
        ['LONG_TERM_PERFORMANCE','POST_IMPROVEMENT_REVIEW','QUERY_ANALYSIS','SERP_COMPARISON','CANNIBALIZATION_CHECK']:
        ['LONG_TERM_PERFORMANCE','QUERY_ANALYSIS','SERP_COMPARISON','CANNIBALIZATION_CHECK'],
      optional_examinations:['INTERNAL_LINK_REVIEW','CONTENT_FRESHNESS_REVIEW','INDEX_STATUS_REVIEW'],
      excluded_examinations:[],
      allow_doctor_to_expand_scope:true,
      maximum_data_period_days:365
    },
    attachments:{
      article_body_included:false,
      article_body:null,
      writer_result_included:false,
      writer_result:null,
      writer_result_reference:{
        improvement_history_id:String(history['改善履歴ID']||'').trim()||null,
        feedback_format:String(history['Feedback Format']||'').trim()||null,
        writer_version:String(history['Writer Version']||'').trim()||null
      },
      sbm_history_included:hasImprovement,
      sbm_history_reference:{improvement_history_id:String(history['改善履歴ID']||'').trim()||null}
    },
    return_contract:{
      format:'SIMS_DOCTOR_SINGLE_CASE_RESULT_V1',
      contract_version:'1.0',
      return_to:'SIMS_BLOG_MANAGER'
    }
  };
  payload.evidence_package = sbmDoctorBuildEvidencePackage_(ctx, payload);
  // RC8 Final QA UAT10: Doctor依頼内の「直近28日」はEvidenceの日別集計を唯一の正本にする。
  try {
    var evRecent = payload.evidence_package && payload.evidence_package.search_console && payload.evidence_package.search_console.daily_performance && payload.evidence_package.search_console.daily_performance.summary && payload.evidence_package.search_console.daily_performance.summary.recent_28_days;
    if (evRecent) {
      payload.current_performance.period_days = 28;
      payload.current_performance.clicks = Number(evRecent.clicks || 0);
      payload.current_performance.impressions = Number(evRecent.impressions || 0);
      payload.current_performance.ctr = Number(evRecent.ctr || 0);
      payload.current_performance.position = Number(evRecent.position || 0);
      payload.current_performance.data_quality = sbmDoctorDataQuality_(payload.current_performance.impressions);
      if (payload.improvement_context && payload.improvement_context.current) {
        payload.improvement_context.current.clicks = payload.current_performance.clicks;
        payload.improvement_context.current.impressions = payload.current_performance.impressions;
        payload.improvement_context.current.ctr = payload.current_performance.ctr;
        payload.improvement_context.current.position = payload.current_performance.position;
      }
    }
  } catch(ePerfSync) { try { sbmLog_('DoctorCurrentPerformanceSync','Warning',String(ePerfSync)); } catch(ignorePerfSync) {} }
  payload.attachments.article_body_included = !!(payload.evidence_package.article_source && payload.evidence_package.article_source.available);
  payload.attachments.article_body = payload.evidence_package.article_source && payload.evidence_package.article_source.available ? payload.evidence_package.article_source.data : null;
  payload.attachments.sbm_history_included = !!(payload.evidence_package.sbm_history && payload.evidence_package.sbm_history.records && payload.evidence_package.sbm_history.records.length);
  return payload;
}

function sbmDoctorValidateSingleCaseRequest_(p) {
  var errors=[];
  if (!p || typeof p!=='object') errors.push('JSONオブジェクトを生成できませんでした。');
  if (!p || p.format!==SBM_DOCTOR_SINGLE_CASE_FORMAT) errors.push('formatが不正です。');
  if (!p || !p.site || !p.site.site_id) errors.push('site.site_idがありません。');
  if (!p || !p.article || !p.article.article_id) errors.push('article.article_idがありません。');
  if (!p || !p.article || !p.article.url) errors.push('article.urlがありません。');
  if (!p || !p.request || !p.request.request_id) errors.push('request.request_idがありません。');
  if (!p || !p.evidence_package || !Array.isArray(p.evidence_package.evidence_index)) errors.push('evidence_package.evidence_indexがありません。');
  return {valid:errors.length===0,errors:errors};
}

function sbmDoctorShowCopyDialog_(payload, jsonText) {
  var title = sbmDoctorEscapeHtml_(payload.article.title || '選択記事');
  var articleId = sbmDoctorEscapeHtml_(payload.article.article_id || '');
  var requestId = sbmDoctorEscapeHtml_(payload.request.request_id || '');
  var articleUrlRaw = String(payload.article && payload.article.url || '').trim();
  var articleUrl = sbmDoctorEscapeHtml_(articleUrlRaw);
  var encodedJson = Utilities.base64EncodeWebSafe(jsonText, Utilities.Charset.UTF_8);
  var html = '<!doctype html><html><head><base target="_top"><meta charset="UTF-8">' +
    '<style>body{font-family:Arial,"Noto Sans JP",sans-serif;margin:0;padding:18px;color:#202124;background:#f8f9fa}' +
    'h2{font-size:19px;margin:0 0 8px}.meta{font-size:13px;line-height:1.6;margin-bottom:12px}.step{background:#fff;border:1px solid #dadce0;border-radius:10px;padding:14px;margin:12px 0}' +
    '.step h3{font-size:15px;margin:0 0 8px}.hint{font-size:12px;color:#5f6368;line-height:1.6;margin:6px 0 10px}.ok{color:#137333}.error{color:#b3261e}.hidden{display:none}' +
    'textarea{box-sizing:border-box;width:100%;padding:10px;font:12px/1.45 monospace;white-space:pre;resize:vertical;border:1px solid #bdc1c6;border-radius:6px;background:#fff}' +
    '#doctorRequest{height:190px}#doctorResult{height:150px}#nextRequest{height:240px}#confirmationRaw{height:110px}#followUpRequest{height:230px}#followUpResult{height:150px}#writerResult{height:170px}.progress{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 14px}.pill{padding:6px 10px;border-radius:16px;background:#eef1f3;color:#5f6368;font-size:12px;font-weight:700}.pill.active{background:#dbeafe;color:#174ea6}.pill.done{background:#e6f4ea;color:#137333}.choice{display:block;margin:8px 0;font-size:13px}' +
    '.actions{display:flex;gap:8px;justify-content:flex-end;align-items:center;margin-top:10px;flex-wrap:wrap}' +
    'button,.link-button{display:inline-block;box-sizing:border-box;border:1px solid #dadce0;border-radius:18px;padding:8px 16px;background:#fff;cursor:pointer;font-weight:600;color:#202124;text-decoration:none}button.primary{background:#1a73e8;color:#fff;border-color:#1a73e8}button:disabled{opacity:.55;cursor:default}' +
    '.status{font-size:13px;min-height:20px;margin-top:8px;white-space:pre-wrap}.next-title{font-size:16px;font-weight:700;color:#137333;margin-bottom:8px}' +
    '</style></head><body><h2>精密診断から次の処置まで</h2>' +
    '<div class="meta"><b>記事：</b>' + title + '<br><b>ArticleID：</b>' + articleId + '<br><b>RequestID：</b>' + requestId + '</div>' +
    (articleUrlRaw ? '<div class="actions" style="justify-content:flex-start;margin:0 0 10px"><a class="link-button" href="' + articleUrl + '" target="_blank" rel="noopener noreferrer">この記事を開く</a></div>' : '') +
    '<div class="progress"><span id="p1" class="pill active">1 Doctorへ依頼</span><span id="p2" class="pill">2 Doctor回答を登録</span><span id="p3" class="pill">3 確認・再診</span><span id="p4" class="pill">4 Writerへ依頼</span><span id="p5" class="pill">5 Writer結果を登録</span></div>' +
    '<section class="step"><h3>① Doctorへ精密診断を依頼する</h3><div class="hint">下のJSONをすべてコピーし、SIMS Doctorへ貼り付けてください。</div>' +
    '<textarea id="doctorRequest" readonly></textarea><div id="copyStatus" class="status ok"></div><div class="actions"><button class="primary" onclick="copyArea(\'doctorRequest\',\'copyStatus\',\'Doctor依頼JSONをコピーしました。SIMS Doctorへ貼り付けてください。\')">Doctor依頼JSONをコピー</button></div></section>' +
    '<section class="step"><h3>② Doctorの診断結果を受け取る</h3><div class="hint">Doctorの回答を最初から最後まで、そのまま貼り付けてください。SBMが回答内の診断結果JSONを自動抽出します。JSON部分だけを貼り付けても登録できます。</div>' +
    '<textarea id="doctorResult" placeholder="ここへDoctorの回答全文をそのまま貼り付けます"></textarea><div id="registerStatus" class="status"></div>' +
    '<div class="actions"><button id="registerButton" class="primary" onclick="registerResult()">診断結果を登録して次へ進む</button></div></section>' +
    '<section id="nextSection" class="step hidden"><div id="nextTitle" class="next-title"></div><div id="nextMessage" class="hint"></div><textarea id="nextRequest" readonly></textarea><div id="nextStatus" class="status ok"></div>' +
    '<div class="actions"><button class="primary" id="copyNextButton" onclick="copyArea(\'nextRequest\',\'nextStatus\',\'紹介状をコピーしました。次の担当へそのまま貼り付けてください。\')">紹介状をコピー</button></div></section>' +
    '<section id="confirmationSection" class="step hidden"><h3>④ 確認結果をSBMへ返す</h3><div id="confirmationInstruction" class="hint"></div><div id="confirmationChoices"></div>' +
    '<div class="hint">Search Consoleなどに表示された内容を、そのまま貼り付けても構いません。判断に迷う場合は「どれに当てはまるか分からない」を選び、表示内容を貼り付けてください。</div>' +
    '<textarea id="confirmationRaw" placeholder="確認画面の表示内容・メモを貼り付けます（任意。判断に迷う場合は推奨）"></textarea><div id="confirmationStatus" class="status"></div>' +
    '<div class="actions"><button id="confirmationRegisterButton" class="primary" onclick="registerConfirmation()">確認結果を登録して再診依頼を作る</button></div></section>' +
    '<section id="followUpSection" class="step hidden"><h3>⑤ Doctorへ再診を依頼する</h3><div class="hint">確認結果をEvidenceとして追加した再診依頼です。下のJSONをすべてコピーし、SIMS Doctorへ貼り付けてください。</div>' +
    '<textarea id="followUpRequest" readonly></textarea><div id="followUpStatus" class="status ok"></div><div class="actions"><button class="primary" onclick="copyArea(\'followUpRequest\',\'followUpStatus\',\'Doctor再診依頼JSONをコピーしました。SIMS Doctorへ貼り付けてください。\')">Doctor再診依頼JSONをコピー</button></div></section>' +
    '<section id="followUpResultSection" class="step hidden"><h3>⑥ Doctorの再診結果をSBMへ返す</h3><div class="hint">Doctorの再診回答を最初から最後まで、そのまま貼り付けてください。SBMが回答内のJSONを自動抽出し、Writer・再確認・経過観察など次の工程へ自動分岐します。</div>' +
    '<textarea id="followUpResult" placeholder="ここへDoctorの再診回答全文をそのまま貼り付けます"></textarea><div id="followUpResultStatus" class="status"></div><div class="actions"><button id="followUpResultButton" class="primary" onclick="registerFollowUpResult()">再診結果を登録して次へ進む</button></div></section>' +
    '<section id="writerSection" class="step hidden"><h3>④ Writer処置結果をSBMへ返す</h3><div class="hint">SIMS Writerで処置が完了したら、Writerの回答を最初から最後まで、そのまま貼り付けてください。SBMがSIMS_WRITER_TREATMENT_RESULT_V1を自動抽出します。JSON部分だけを貼り付けても登録できます。</div>' +
    '<textarea id="writerResult" placeholder="ここへWriterの回答全文をそのまま貼り付けます"></textarea><div id="writerStatus" class="status"></div>' +
    '<div class="actions"><button id="writerRegisterButton" class="primary" onclick="registerWriterResult()">Writer処置結果を登録</button></div></section>' +
    '<div class="actions"><button onclick="google.script.host.close()">閉じる</button></div>' +
    '<script>const encoded=' + JSON.stringify(encodedJson) + ';' +
    'function decodeBase64Url(v){v=v.replace(/-/g,"+").replace(/_/g,"/");while(v.length%4)v+="=";const b=atob(v);const a=Uint8Array.from(b,c=>c.charCodeAt(0));return new TextDecoder("utf-8").decode(a)}' +
    'const requestText=decodeBase64Url(encoded);document.getElementById("doctorRequest").value=requestText;let activeRequestText=requestText;function progress(step){for(let i=1;i<=5;i++){const p=document.getElementById("p"+i);if(!p)continue;p.className="pill "+(i<step?"done":i===step?"active":"")}}progress(1);' +
    'async function copyArea(id,statusId,message){const t=document.getElementById(id);let ok=false;try{await navigator.clipboard.writeText(t.value);ok=true}catch(e){t.focus();t.select();ok=document.execCommand("copy")}const st=document.getElementById(statusId);st.className="status "+(ok?"ok":"error");st.textContent=ok?message:"コピーできませんでした。テキスト欄を選択して手動でコピーしてください。"}' +
    'function registerResult(){const result=document.getElementById("doctorResult").value.trim();const st=document.getElementById("registerStatus");if(!result){st.className="status error";st.textContent="Doctorの回答全文、または診断結果JSONを貼り付けてください。";return}const b=document.getElementById("registerButton");b.disabled=true;st.className="status";st.textContent="診断結果を確認し、次の紹介状を作成しています…";' +
    'google.script.run.withSuccessHandler(function(r){b.disabled=false;if(!r||!r.ok){st.className="status error";st.textContent=r&&r.message?r.message:"処理に失敗しました。";return}st.className="status ok";st.textContent=r.message||"診断結果を登録しました。";progress(4);document.getElementById("writerSection").classList.add("hidden");document.getElementById("confirmationSection").classList.add("hidden");document.getElementById("followUpSection").classList.add("hidden");const sec=document.getElementById("nextSection");sec.classList.remove("hidden");document.getElementById("nextTitle").textContent=r.nextTitle||"次の処置";document.getElementById("nextMessage").textContent=r.nextMessage||"";const ta=document.getElementById("nextRequest");ta.value=r.nextRequest||"";const cb=document.getElementById("copyNextButton");if(r.nextRequest){ta.classList.remove("hidden");cb.classList.remove("hidden")}else{ta.classList.add("hidden");cb.classList.add("hidden")}if(r.route==="WRITER"){document.getElementById("writerSection").classList.remove("hidden")}if(r.route==="USER_CONFIRMATION"&&r.confirmation){progress(3);showConfirmation(r.confirmation)}if(r.route==="WRITER"){progress(4)}sec.scrollIntoView({behavior:"smooth",block:"start"})}).withFailureHandler(function(e){b.disabled=false;st.className="status error";st.textContent=e&&e.message?e.message:String(e)}).sbmDoctorRegisterResultAndBuildNext(activeRequestText,result)}' +
    'let activeConfirmationCaseId="";function showConfirmation(c){activeConfirmationCaseId=c.case_id||"";const sec=document.getElementById("confirmationSection");sec.classList.remove("hidden");document.getElementById("confirmationInstruction").textContent=c.instruction||"Doctorが指定した確認を行い、結果を選択してください。";const box=document.getElementById("confirmationChoices");box.innerHTML="";(c.choices||[]).forEach(function(x,i){const label=document.createElement("label");label.className="choice";const radio=document.createElement("input");radio.type="radio";radio.name="confirmationChoice";radio.value=x.code;radio.checked=i===0;label.appendChild(radio);label.appendChild(document.createTextNode(" "+x.label));box.appendChild(label)});sec.scrollIntoView({behavior:"smooth",block:"start"})}' +
    'function registerConfirmation(){const picked=document.querySelector("input[name=confirmationChoice]:checked");const raw=document.getElementById("confirmationRaw").value.trim();const st=document.getElementById("confirmationStatus");if(!picked){st.className="status error";st.textContent="確認結果を1つ選んでください。";return}const b=document.getElementById("confirmationRegisterButton");b.disabled=true;st.className="status";st.textContent="確認結果を保存し、Doctor再診依頼を作成しています…";google.script.run.withSuccessHandler(function(r){b.disabled=false;if(!r||!r.ok){st.className="status error";st.textContent=r&&r.message?r.message:"処理に失敗しました。";return}st.className="status ok";st.textContent=r.message||"確認結果を登録しました。";document.getElementById("followUpRequest").value=r.followUpRequest||"";activeRequestText=r.followUpRequest||activeRequestText;progress(3);const sec=document.getElementById("followUpSection");sec.classList.remove("hidden");document.getElementById("followUpResultSection").classList.remove("hidden");sec.scrollIntoView({behavior:"smooth",block:"start"})}).withFailureHandler(function(e){b.disabled=false;st.className="status error";st.textContent=e&&e.message?e.message:String(e)}).sbmDoctorRegisterUserConfirmationAndBuildFollowUp(activeConfirmationCaseId,picked.value,raw)}' +
    'function registerFollowUpResult(){const result=document.getElementById("followUpResult").value.trim();const st=document.getElementById("followUpResultStatus");if(!result){st.className="status error";st.textContent="Doctorの再診回答全文、または診断結果JSONを貼り付けてください。";return}const b=document.getElementById("followUpResultButton");b.disabled=true;st.className="status";st.textContent="再診結果を確認し、次の工程を判定しています…";google.script.run.withSuccessHandler(function(r){b.disabled=false;if(!r||!r.ok){st.className="status error";st.textContent=r&&r.message?r.message:"処理に失敗しました。";return}st.className="status ok";st.textContent=r.message||"再診結果を登録しました。";document.getElementById("writerSection").classList.add("hidden");document.getElementById("confirmationSection").classList.add("hidden");const sec=document.getElementById("nextSection");sec.classList.remove("hidden");document.getElementById("nextTitle").textContent=r.nextTitle||"次の処置";document.getElementById("nextMessage").textContent=r.nextMessage||"";const ta=document.getElementById("nextRequest");ta.value=r.nextRequest||"";const cb=document.getElementById("copyNextButton");if(r.nextRequest){ta.classList.remove("hidden");cb.classList.remove("hidden")}else{ta.classList.add("hidden");cb.classList.add("hidden")}if(r.route==="WRITER"){document.getElementById("writerSection").classList.remove("hidden");progress(4)}else if(r.route==="USER_CONFIRMATION"&&r.confirmation){showConfirmation(r.confirmation);progress(3)}else{progress(4)}sec.scrollIntoView({behavior:"smooth",block:"start"})}).withFailureHandler(function(e){b.disabled=false;st.className="status error";st.textContent=e&&e.message?e.message:String(e)}).sbmDoctorRegisterResultAndBuildNext(activeRequestText,result)}' +
    'function registerWriterResult(){const result=document.getElementById("writerResult").value.trim();const st=document.getElementById("writerStatus");if(!result){st.className="status error";st.textContent="Writerの回答全文、または処置結果JSONを貼り付けてください。";return}const b=document.getElementById("writerRegisterButton");b.disabled=true;st.className="status";st.textContent="Writer処置結果を登録しています…";google.script.run.withSuccessHandler(function(r){b.disabled=false;if(!r||!r.ok){st.className="status error";st.textContent=r&&r.message?r.message:"処理に失敗しました。";return}st.className="status ok";st.textContent=r.message||"Writer処置結果を登録しました。"}).withFailureHandler(function(e){b.disabled=false;st.className="status error";st.textContent=e&&e.message?e.message:String(e)}).sbmDoctorRegisterWriterTreatmentResultFromDialog(result)}' +
    '</script></body></html>';
  SpreadsheetApp.getUi().showModalDialog(HtmlService.createHtmlOutput(html).setWidth(820).setHeight(720), 'SIMS Doctor 精密診断');
}

function sbmDoctorEscapeHtml_(value) {
  return String(value == null ? '' : value)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function sbmDoctorRememberLastRequest_(payload) {
  sbmSetSetting_('DoctorLastRequestId',payload.request.request_id,'最後に生成したDoctor外来診療RequestID');
  sbmSetSetting_('DoctorLastRequestArticleId',payload.article.article_id,'最後にDoctor診断を依頼したArticleID');
  sbmSetSetting_('DoctorLastRequestAt',payload.generated_at,'最後にDoctor外来診療依頼を生成した日時');
}

function sbmDoctorCaseNextAction_(code){
  var m={
    'DOCTOR_DIAGNOSIS_PENDING':'Doctorの診断結果を登録',
    'WRITER_REQUEST_READY':'Writer紹介状を作成・送付',
    'WRITER_IN_PROGRESS':'Writerの処置完了を待つ',
    'USER_ACTION_REQUIRED':'Doctor指定の確認を実施',
    'FOLLOW_UP_REQUEST_READY':'Doctorへ再診依頼を送る',
    'USER_DECISION_REQUIRED':'診断内容を確認して利用者判断',
    'PUBLICATION_PENDING':'記事へ修正を反映し、結果を登録',
    'MONITORING':'再診予定日まで経過観察',
    'DOCTOR_DIAGNOSED':'Doctor診断内容を確認',
    'TREATMENT_FAILED':'エラー内容を確認して再実行',
    'WORKFLOW_LOCKED':'既存の改善モニタリング完了を待つ'
  };
  return m[String(code||'')]||'状態を確認';
}
function sbmDoctorCompactDateTime_(value){
  if(value===null||value===undefined||value==='')return '';
  try{
    var d=value instanceof Date?value:new Date(String(value).replace(/\s*\([^)]*\)\s*$/,''));
    if(!isNaN(d.getTime()))return Utilities.formatDate(d,Session.getScriptTimeZone()||'Asia/Tokyo','yyyy/MM/dd HH:mm');
  }catch(ignore){}
  return String(value||'').replace(/\s*\([^)]*\)\s*$/,'').trim();
}
function sbmDoctorOpenDiagnosisStatus(){
  // RC8: Doctor診断〜処置は一連のダイアログで完結するため、専用の対応一覧は廃止。
  // 完了後は通常改善と同じ「改善履歴」「改善の推移」で一元管理します。
  try { sbmRetireDoctorWorklistSheets_(); } catch(e) {}
  sbmOpenImprovementHistory();
  try { SpreadsheetApp.getActiveSpreadsheet().toast('Doctor経由の処置も「改善経路」で区別して改善履歴へ統合しました。','SIMS Doctor',6); } catch(e2) {}
}
function sbmRetireDoctorWorklistSheets_(){
  var ss=SpreadsheetApp.getActiveSpreadsheet();
  ['Doctor_対応一覧','Doctor_診断状況'].forEach(function(name){
    var sh=ss.getSheetByName(name); if(sh){try{sh.hideSheet();}catch(e){}}
  });
}
// 後方互換：旧メニュー名からも新しい診断状況画面を開きます。
function sbmDoctorShowIntegrationStatus(){return sbmDoctorOpenDiagnosisStatus();}

function sbmDoctorRankCode_(value) {
  var s=String(value||'');
  if (s.indexOf('エース')>=0) return 'ACE';
  if (s.indexOf('安定')>=0) return 'STABLE';
  if (s.indexOf('成長')>=0) return 'GROWTH';
  if (s.indexOf('育成')>=0) return 'NURTURE';
  if (s.indexOf('低迷')>=0) return 'LOW';
  return 'UNMEASURED';
}
function sbmDoctorWorkflowCode_(value) {
  var s=String(value||'').trim();
  if (s.indexOf('モニター')>=0) return 'SBM_MONITORING';
  if (s.indexOf('改善中')>=0 || s.indexOf('今日の改善')>=0) return 'SBM_IMPROVEMENT_IN_PROGRESS';
  if (s.indexOf('保留')>=0) return 'MANUAL_HOLD';
  if (s.indexOf('削除')>=0) return 'DELETED';
  if (s.indexOf('アーカイブ')>=0) return 'ARCHIVED';
  return 'AVAILABLE';
}
function sbmDoctorTriggerCode_(sourceType,judgement) {
  var s=String(judgement||'');
  if (sourceType==='DETAILED_CANDIDATE') return 'SBM_HEALTH_DETAILED_DIAGNOSIS';
  if (sourceType!=='IMPROVEMENT_EFFECT') return 'SBM_MANUAL_REQUEST';
  if (s.indexOf('悪化')>=0) return 'SBM_WORSENING_DETECTED';
  if (s.indexOf('変化')>=0 || s.indexOf('維持')>=0) return 'SBM_NO_CHANGE_DETECTED';
  return 'SBM_MONITORING_REVIEW';
}
function sbmDoctorChiefComplaint_(sourceType,judgement) {
  if (sourceType==='DETAILED_CANDIDATE') return 'ブログ健康診断で精密診断候補となったため、現在の状態・原因・必要な処置を詳しく診断したい。';
  if (sourceType==='IMPROVEMENT_EFFECT') return judgement?('改善の推移が「'+judgement+'」のため、原因と次の対応を診断したい。'):'改善後の推移について原因と次の対応を診断したい。';
  return 'この記事の現在の状態、低迷・重複・検索意図・今後の処置を個別診断したい。';
}
function sbmDoctorJudgementCode_(value) {
  var s=String(value||'');
  if (s.indexOf('大幅')>=0 || s.indexOf('顕著')>=0) return 'SIGNIFICANTLY_IMPROVED';
  if (s.indexOf('改善')>=0) return 'IMPROVING';
  if (s.indexOf('悪化')>=0) return 'WORSENED';
  if (s.indexOf('変化')>=0 || s.indexOf('維持')>=0) return 'NO_MEANINGFUL_CHANGE';
  if (s.indexOf('待')>=0 || s.indexOf('測定')>=0) return 'MEASUREMENT_WAITING';
  return 'UNKNOWN';
}
function sbmDoctorChangedSections_(history) {
  var raw=history?history['変更箇所']:'';
  if (Array.isArray(raw)) return raw;
  return String(raw||'').split(/[、,\/]/).map(function(v){return String(v||'').trim();}).filter(function(v){return !!v;});
}
function sbmDoctorDataQuality_(impressions) {
  if (impressions===null) return 'MISSING';
  if (Number(impressions)<50) return 'LOW_SAMPLE';
  return 'SUFFICIENT';
}
function sbmDoctorNumberOrNull_(value) {
  if (value===null || value===undefined || value==='') return null;
  if (typeof value==='string') value=value.replace(/,/g,'').replace(/%/g,'').trim();
  var n=Number(value); return isFinite(n)?n:null;
}
function sbmDoctorCtrValue_(value) {
  if (value===null || value===undefined || value==='') return null;
  if (typeof value==='string' && value.indexOf('%')>=0) {
    var p=Number(value.replace(/%/g,'').replace(/,/g,'').trim()); return isFinite(p)?p/100:null;
  }
  var n=Number(value); return isFinite(n)?n:null;
}
function sbmDoctorSubtract_(a,b) { return (a===null || b===null)?null:Number((a-b).toFixed(6)); }
function sbmDoctorIso_(date) { return Utilities.formatDate(date,SBM_DEFAULTS.TIMEZONE,"yyyy-MM-dd'T'HH:mm:ssXXX"); }
function sbmDoctorDateOrNull_(value) {
  if (!value) return null;
  var d=value instanceof Date?value:new Date(value);
  return isNaN(d.getTime())?null:sbmDoctorIso_(d);
}
function sbmDoctorDateOnlyOrNull_(value) {
  if (!value) return null;
  var d=value instanceof Date?value:new Date(value);
  return isNaN(d.getTime())?null:Utilities.formatDate(d,SBM_DEFAULTS.TIMEZONE,'yyyy-MM-dd');
}




/**
 * Product 5.10.0 RC1: Doctor Evidence Package v2.3
 * 個別診断時だけ対象記事の証拠を可能な限り収集します。
 */
function sbmDoctorBuildEvidencePackage_(ctx, payload) {
  var url = payload.article.url;
  var articleId = payload.article.article_id;
  var collectedAt = sbmDoctorIso_(new Date());
  var source = sbmFetchArticleSource_(url);
  var queries = sbmDoctorFetchLongTermQueries_(url, SBM_DOCTOR_EVIDENCE_DAYS, SBM_DOCTOR_QUERY_LIMIT);
  var preferredDailyUrl = queries && queries.matched_urls ? queries.matched_urls.full_180_days : null;
  var performance = sbmDoctorFetchLongTermPerformance_(url, SBM_DOCTOR_EVIDENCE_DAYS, preferredDailyUrl);
  var pageSummary = sbmDoctorFetchLongTermPageSummary_(url, SBM_DOCTOR_EVIDENCE_DAYS, performance&&performance.matched_url||preferredDailyUrl);
  var health = sbmDoctorLatestHealthSnapshot_(articleId, url);
  var sbmHistory = sbmDoctorAllImprovementHistory_(articleId, url);
  var doctorHistory = sbmDoctorExistingMedicalHistory_(articleId, url);
  var internalLinks = sbmDoctorInternalLinkEvidence_(ctx.article, queries.rows || [], source);
  var cannibalization = sbmDoctorFetchCannibalizationEvidence_(queries.rows || [], SBM_DOCTOR_EVIDENCE_DAYS, url);
  var siteImpact = sbmDoctorFetchSiteImpactSummary_();
  var comparison = sbmDoctorComparisonWindow_(payload.improvement_context, performance);

  var quality = sbmDoctorValidateEvidencePackage_({
    article_source:source,
    daily_performance:performance,
    page_summary:pageSummary,
    query_performance:queries,
    health_snapshot:health,
    improvement_history:sbmHistory,
    doctor_history:doctorHistory,
    internal_links:internalLinks,
    cannibalization:cannibalization,
    site_impact:siteImpact,
    main_query:payload.article&&payload.article.main_query||null,
    article_title:payload.article&&payload.article.title||null
  });
  var evidenceIndex = quality.evidence_index;

  return {
    package_format:'SIMS_DOCTOR_EVIDENCE_PACKAGE_V2',
    package_version:'2.3.0',
    compatible_with:['SIMS_DOCTOR_EVIDENCE_PACKAGE_V1'],
    collected_at:collectedAt,
    request_id:payload.request&&payload.request.request_id||null,
    site_id:payload.site&&payload.site.site_id||null,
    site_name:payload.site&&payload.site.site_name||null,
    blog_url:payload.site&&payload.site.blog_url||null,
    search_console_property:payload.site&&payload.site.search_console_property||null,
    article_id:articleId,
    article_url:url,
    article_title:payload.article&&payload.article.title||null,
    main_query:payload.article&&payload.article.main_query||null,
    evidence_index:evidenceIndex,
    evidence_validation:quality.validation_report,
    doctor_readiness:quality.doctor_readiness,
    article_source:{available:!!source.ok, status:source.ok?'取得済み':'取得できませんでした', message:source.message||null, data:source.ok?source.data:null},
    search_console:{
      period_days:SBM_DOCTOR_EVIDENCE_DAYS,
      daily_performance:performance,
      page_summary:pageSummary,
      query_performance:queries,
      comparison_window:comparison
    },
    health_snapshot:health,
    improvement_history:{count:sbmHistory.length,records:sbmHistory},
    sbm_history:{count:sbmHistory.length,records:sbmHistory},
    doctor_history:{count:doctorHistory.length,records:doctorHistory},
    internal_links:internalLinks,
    cannibalization:cannibalization,
    site_impact:siteImpact,
    missing_evidence:evidenceIndex.filter(function(e){return e.quality==='MISSING'||e.quality==='ERROR';}).map(function(e){return e.label;}),
    diagnostic_instruction:'最初にevidence_validationとdoctor_readinessを確認してください。再取得が必要な場合は確定診断を行わず、利用者には分かりやすい日本語で再取得を案内してください。個別診断では有効な証拠をすべて確認し、証拠不足の検査は未評価と明記してください。英語の内部コードは利用者向け本文に表示しないでください。'
  };
}

function sbmDoctorEvidenceItem_(id,label,quality,note,details) {
  var labels={VALID:'正常',WARNING:'注意',ERROR:'取得エラー',EMPTY:'データなし',NOT_SUPPORTED:'SBMでは未対応',MISSING:'未取得'};
  return {evidence_id:id,label:label,available:quality==='VALID'||quality==='WARNING'||quality==='EMPTY',quality:quality,status:labels[quality]||quality,note:String(note||''),details:details||null};
}

function sbmDoctorMetricDifference_(a,b) {
  a=a||{}; b=b||{};
  return {clicks:Math.abs(Number(a.clicks||0)-Number(b.clicks||0)),impressions:Math.abs(Number(a.impressions||0)-Number(b.impressions||0)),ctr:Math.abs(Number(a.ctr||0)-Number(b.ctr||0)),position:Math.abs(Number(a.position||0)-Number(b.position||0))};
}

function sbmDoctorValidateEvidencePackage_(e) {
  var healthFull=e.health_snapshot&&e.health_snapshot.metrics?e.health_snapshot.metrics.full_180_days:null;
  var pageFull=e.page_summary&&e.page_summary.summary?e.page_summary.summary:null;
  var dailyFull=e.daily_performance&&e.daily_performance.summary?e.daily_performance.summary.full_180_days:null;
  var healthImp=healthFull?Number(healthFull.impressions||0):0;
  var pageImp=pageFull?Number(pageFull.impressions||0):0;
  var dailyImp=dailyFull?Number(dailyFull.impressions||0):0;
  var items=[];

  var bodyChars=e.article_source&&e.article_source.data?Number(e.article_source.data.character_count||0):0;
  if(!e.article_source||!e.article_source.ok) items.push(sbmDoctorEvidenceItem_('E001','記事本文','ERROR',e.article_source&&e.article_source.message||'記事本文を取得できませんでした。'));
  else if(bodyChars<300) items.push(sbmDoctorEvidenceItem_('E001','記事本文','WARNING','本文は取得できましたが、文字数が少ないため内容確認が必要です。',{character_count:bodyChars}));
  else items.push(sbmDoctorEvidenceItem_('E001','記事本文','VALID','記事本文を正常に取得しました。',{character_count:bodyChars}));

  if(!e.daily_performance||!e.daily_performance.ok) {
    items.push(sbmDoctorEvidenceItem_('E002','180日の日別推移','ERROR',e.daily_performance&&e.daily_performance.message||'180日の日別推移を取得できませんでした。'));
  } else if(pageImp>0 && dailyImp===0) {
    items.push(sbmDoctorEvidenceItem_('E002','180日の日別推移','ERROR','同じ条件で取得した180日ページ合計には実績がありますが、日別推移が全て0です。Search Consoleデータの再取得が必要です。',{code:'PAGE_DAILY_MISMATCH',page_summary:pageFull,daily_summary:dailyFull,health_snapshot_reference:healthFull}));
  } else if(pageFull&&dailyFull) {
    var diff=sbmDoctorMetricDifference_(pageFull,dailyFull);
    var allowedImpressions=Math.max(2,Math.round(pageImp*0.05));
    var pageClicks=Number(pageFull.clicks||0);
    var allowedClicks=Math.max(1,Math.round(pageClicks*0.05));
    var positionMismatch=diff.position>1.0;
    var mismatch=diff.impressions>allowedImpressions||diff.clicks>allowedClicks||positionMismatch;
    var severe=diff.impressions>allowedImpressions*2||diff.clicks>allowedClicks*2||diff.position>2.0;
    if(mismatch) items.push(sbmDoctorEvidenceItem_('E002','180日の日別推移','WARNING',severe?'同じ条件で取得した180日ページ合計と日別合計に大きな差があります。半年全体の絶対値は参考扱いとし、限定診断にしてください。':'同じ条件で取得した180日ページ合計と日別合計に差があります。期間・URL・取得条件を確認してください。',{code:severe?'PAGE_DAILY_LARGE_DIFFERENCE':'PAGE_DAILY_DIFFERENCE',severity:severe?'LARGE':'MODERATE',difference:diff,tolerance:{clicks:allowedClicks,impressions:allowedImpressions,position:1.0},page_summary:pageFull,daily_summary:dailyFull,health_snapshot_reference:healthFull}));
    else if(dailyImp===0) items.push(sbmDoctorEvidenceItem_('E002','180日の日別推移','EMPTY','対象期間にSearch Consoleの表示実績がありません。',{row_count:e.daily_performance.row_count||0}));
    else items.push(sbmDoctorEvidenceItem_('E002','180日の日別推移','VALID','同じ条件で取得した180日ページ合計と日別合計は整合しています。',{row_count:e.daily_performance.row_count||0,page_summary:pageFull,daily_summary:dailyFull,health_snapshot_reference:healthFull}));
  } else if(dailyImp===0) items.push(sbmDoctorEvidenceItem_('E002','180日の日別推移','EMPTY','対象期間にSearch Consoleの表示実績がありません。',{row_count:e.daily_performance.row_count||0}));
  else items.push(sbmDoctorEvidenceItem_('E002','180日の日別推移','VALID','180日の日別推移を取得しました。',{row_count:e.daily_performance.row_count||0,summary:dailyFull}));

  var queryCount=e.query_performance&&Array.isArray(e.query_performance.rows)?e.query_performance.rows.length:0;
  if(!e.query_performance||!e.query_performance.ok) items.push(sbmDoctorEvidenceItem_('E003','180日の上位クエリ','ERROR',e.query_performance&&e.query_performance.message||'クエリデータを取得できませんでした。'));
  else if(queryCount===0&&healthImp>0) items.push(sbmDoctorEvidenceItem_('E003','180日の上位クエリ','WARNING','記事には表示実績がありますが、クエリ明細が0件です。匿名化制限またはURL一致の問題が考えられます。',{code:'QUERY_EMPTY_WITH_IMPRESSIONS',health_impressions:healthImp}));
  else if(queryCount===0) items.push(sbmDoctorEvidenceItem_('E003','180日の上位クエリ','EMPTY','対象期間に取得できるクエリ明細がありません。'));
  else items.push(sbmDoctorEvidenceItem_('E003','180日の上位クエリ','VALID',queryCount+'件のクエリ推移を取得しました。',{row_count:queryCount}));

  items.push(e.health_snapshot?sbmDoctorEvidenceItem_('E004','半年健康診断結果','VALID','最新の半年健康診断結果を添付しました。'):sbmDoctorEvidenceItem_('E004','半年健康診断結果','EMPTY','半年健康診断結果はまだありません。'));
  items.push((e.improvement_history||[]).length?sbmDoctorEvidenceItem_('E005','改善・モニタリング履歴','VALID',(e.improvement_history||[]).length+'件の履歴を添付しました。'):sbmDoctorEvidenceItem_('E005','改善・モニタリング履歴','EMPTY','改善・モニタリング履歴はありません。'));
  items.push((e.doctor_history||[]).length?sbmDoctorEvidenceItem_('E006','過去のDoctor診断','VALID',(e.doctor_history||[]).length+'件の診断履歴を添付しました。'):sbmDoctorEvidenceItem_('E006','過去のDoctor診断','EMPTY','過去のDoctor診断はありません。'));
  if(!e.internal_links||e.internal_links.available===false) items.push(sbmDoctorEvidenceItem_('E007','内部リンク候補','ERROR',e.internal_links&&e.internal_links.message||'内部リンク候補を取得できませんでした。'));
  else if((e.internal_links.candidates||[]).length===0) items.push(sbmDoctorEvidenceItem_('E007','内部リンク候補','EMPTY','適合する内部リンク候補はありません。'));
  else items.push(sbmDoctorEvidenceItem_('E007','内部リンク候補','VALID',(e.internal_links.candidates||[]).length+'件の候補と、本文内の実リンク照合結果を添付しました。',{candidate_count:(e.internal_links.candidates||[]).length,existing_link_count:(e.internal_links.existing_links||[]).length,unlinked_candidate_count:(e.internal_links.unlinked_candidates||[]).length}));
  items.push(sbmDoctorEvidenceItem_('E008','SERP比較','NOT_SUPPORTED','SBMでは自動取得していません。Claude版Doctorで必要に応じて確認してください。'));
  var cann=e.cannibalization;
  if(cann&&cann.available&&Number(cann.queries_checked||0)>0){
    if(Number(cann.queries_with_competition||0)>0) items.push(sbmDoctorEvidenceItem_('E009','カニバリ候補','VALID',cann.queries_with_competition+'件のクエリで、対象記事以外の自サイトURLにも表示実績を確認しました。Doctorが検索意図と評価分散を判定できます。',{queries_checked:cann.queries_checked,queries_with_competition:cann.queries_with_competition,competing_url_count:cann.competing_url_count}));
    else if((cann.errors||[]).length) items.push(sbmDoctorEvidenceItem_('E009','カニバリ候補','WARNING','サイト横断データを取得しましたが、一部クエリの取得に失敗しました。取得できた範囲では競合URLは確認されませんでした。',{queries_checked:cann.queries_checked,error_count:(cann.errors||[]).length}));
    else items.push(sbmDoctorEvidenceItem_('E009','カニバリ候補','VALID',cann.queries_checked+'件の主要クエリをサイト横断で確認し、対象記事以外の自サイトURLに表示実績は確認されませんでした。',{queries_checked:cann.queries_checked,queries_with_competition:0}));
  } else if(queryCount>0) items.push(sbmDoctorEvidenceItem_('E009','カニバリ候補','WARNING','対象記事のクエリは取得できましたが、他記事URLとのサイト横断比較を取得できませんでした。'));
  else if(healthImp>0) items.push(sbmDoctorEvidenceItem_('E009','カニバリ候補','WARNING','クエリ明細がないため、カニバリ候補を十分に判定できません。'));
  else items.push(sbmDoctorEvidenceItem_('E009','カニバリ候補','EMPTY','表示実績がないため、カニバリ判定の対象データがありません。'));

  var stale=sbmDoctorMainQueryFreshness_(e.main_query,e.article_title);
  if(stale.warning) items.push(sbmDoctorEvidenceItem_('E010','メインクエリの鮮度','WARNING',stale.message,{code:'MAIN_QUERY_STALE',query_year:stale.query_year,current_year:stale.current_year}));
  else items.push(sbmDoctorEvidenceItem_('E010','メインクエリの鮮度','VALID','メインクエリに明確な古い年号はありません。'));

  var site=e.site_impact;
  if(!site||site.available===false) items.push(sbmDoctorEvidenceItem_('E011','サイト全体の28日比較','WARNING',site&&site.message||'サイト全体の比較データを取得できませんでした。Algorithm影響の判定ではこの項目を未評価として扱ってください。',{code:'SITE_IMPACT_UNAVAILABLE'}));
  else if(Number(site.article_population&&site.article_population.articles_with_data||0)<5) items.push(sbmDoctorEvidenceItem_('E011','サイト全体の28日比較','WARNING','比較可能な記事数が少ないため、サイト全体傾向は参考値として扱ってください。',{code:'SITE_IMPACT_LOW_SAMPLE',articles_with_data:Number(site.article_population&&site.article_population.articles_with_data||0),confidence:site.confidence||'LOW'}));
  else items.push(sbmDoctorEvidenceItem_('E011','サイト全体の28日比較','VALID','直近28日と前28日のサイト全体推移を記事単位で集計しました。Googleアップデートとの関連はDoctorが他のEvidenceと統合して判断してください。',{articles_with_data:Number(site.article_population&&site.article_population.articles_with_data||0),declined_ratio:Number(site.article_population&&site.article_population.declined_ratio||0),improved_ratio:Number(site.article_population&&site.article_population.improved_ratio||0),confidence:site.confidence||'MEDIUM'}));

  var counts={VALID:0,WARNING:0,ERROR:0,EMPTY:0,NOT_SUPPORTED:0,MISSING:0};
  items.forEach(function(x){counts[x.quality]=(counts[x.quality]||0)+1;});
  var score=100-counts.ERROR*30-counts.WARNING*10;
  if(score<0)score=0;
  var criticalError=items.some(function(x){return x.evidence_id==='E002'&&x.quality==='ERROR';});
  var severeMismatch=items.some(function(x){return x.evidence_id==='E002'&&x.details&&x.details.severity==='LARGE';});
  var readiness,readinessLabel,action;
  if(criticalError||score<70){readiness='REFETCH_REQUIRED';readinessLabel='再取得が必要';action='Search Consoleの180日データを再取得してから診断してください。';}
  else if(severeMismatch||counts.ERROR>0||score<85){readiness='LIMITED_DIAGNOSIS';readinessLabel='限定的な診断が可能';action='不足・不整合のある証拠を除外し、確定診断を避けてください。';}
  else {readiness='READY';readinessLabel='診断可能';action='通常の個別診断を進められます。';}
  var overall=counts.ERROR>0?'ERROR':counts.WARNING>0?'WARNING':'VALID';
  var overallLabel=overall==='ERROR'?'再取得が必要':overall==='WARNING'?'注意事項あり':'良好';
  return {
    evidence_index:items,
    validation_report:{validation_version:'2.3.0',validated_at:sbmDoctorIso_(new Date()),overall:overall,overall_label:overallLabel,evidence_score:score,counts:counts,checks:items.filter(function(x){return x.quality==='ERROR'||x.quality==='WARNING';}).map(function(x){return {evidence_id:x.evidence_id,result:x.quality,code:x.details&&x.details.code||null,message:x.note};})},
    doctor_readiness:{status:readiness,label:readinessLabel,recommended_action:action,diagnosis_allowed:readiness!=='REFETCH_REQUIRED'}
  };
}

function sbmDoctorEvidenceRange_(days){
  var end=new Date(); end.setDate(end.getDate()-SBM_DEFAULTS.GSC_DELAY_DAYS);
  var start=new Date(end); start.setDate(start.getDate()-Number(days||180)+1);
  return {startDate:sbmDateText_(start),endDate:sbmDateText_(end)};
}
function sbmDoctorUrlCandidates_(url){
  var s=String(url||'').trim(), out=[];
  function add(v){if(v&&out.indexOf(v)<0)out.push(v);}
  add(s);
  if(s.slice(-1)==='/')add(s.slice(0,-1));else add(s+'/');
  return out;
}
function sbmDoctorSearchConsoleForUrl_(property,baseBody,url,preferredUrl){
  var candidates=[], trace=[], last={};
  function add(v){v=String(v||'').trim();if(v&&candidates.indexOf(v)<0)candidates.push(v);}
  add(preferredUrl);
  sbmDoctorUrlCandidates_(url).forEach(add);
  for(var i=0;i<candidates.length;i++){
    var body=JSON.parse(JSON.stringify(baseBody||{}));
    body.dimensionFilterGroups=[{filters:[{dimension:'page',operator:'equals',expression:candidates[i]}]}];
    last=sbmSearchConsoleApiRequest_(property,body)||{};
    var rows=last.rows||[], clicks=0, impressions=0;
    rows.forEach(function(r){clicks+=Number(r.clicks||0);impressions+=Number(r.impressions||0);});
    trace.push({url:candidates[i],row_count:rows.length,clicks:clicks,impressions:impressions,has_metrics:(clicks>0||impressions>0)});
    // Search Console may return zero-filled date rows. Do not treat them as a successful match.
    if(rows.length&&(clicks>0||impressions>0)){
      last.matched_url=candidates[i];last.candidate_trace=trace;return last;
    }
  }
  last.matched_url=null;last.candidate_trace=trace;
  return last;
}
function sbmDoctorFetchLongTermPageSummary_(url,days,preferredUrl){
  var range=sbmDoctorEvidenceRange_(days), property=sbmGetSetting_('SearchConsoleProperty','');
  try{
    var data=sbmDoctorSearchConsoleForUrl_(property,{startDate:range.startDate,endDate:range.endDate,rowLimit:10},url,preferredUrl);
    var rows=data.rows||[], clicks=0, impressions=0, posNum=0, posDen=0;
    rows.forEach(function(r){var imp=Number(r.impressions||0);clicks+=Number(r.clicks||0);impressions+=imp;posNum+=Number(r.position||0)*imp;posDen+=imp;});
    var summary={clicks:clicks,impressions:impressions,ctr:impressions?clicks/impressions:0,position:posDen?posNum/posDen:0};
    return {ok:(clicks>0||impressions>0),message:(clicks>0||impressions>0)?'同一条件の180日ページ合計を取得しました。':'180日ページ合計に実績がありません。',start_date:range.startDate,end_date:range.endDate,matched_url:data.matched_url||null,candidate_trace:data.candidate_trace||[],summary:summary};
  }catch(e){return {ok:false,message:'180日ページ合計を取得できませんでした：'+String(e&&e.message||e),start_date:range.startDate,end_date:range.endDate,matched_url:null,candidate_trace:[],summary:null};}
}

function sbmDoctorFetchLongTermPerformance_(url,days,preferredUrl){
  var range=sbmDoctorEvidenceRange_(days), property=sbmGetSetting_('SearchConsoleProperty','');
  try{
    var data=sbmDoctorSearchConsoleForUrl_(property,{startDate:range.startDate,endDate:range.endDate,dimensions:['date'],rowLimit:25000},url,preferredUrl);
    var rows=(data.rows||[]).map(function(r){return {date:String(r.keys&&r.keys[0]||''),clicks:Number(r.clicks||0),impressions:Number(r.impressions||0),ctr:Number(r.ctr||0),position:Number(r.position||0)};});
    var summary=sbmDoctorSummarizeDailyMetrics_(rows,range);
    var hasMetrics=summary&&summary.full_180_days&&(Number(summary.full_180_days.clicks||0)>0||Number(summary.full_180_days.impressions||0)>0);
    return {ok:!!hasMetrics,message:hasMetrics?(rows.length+'日分のデータを取得しました。'):'URL候補を確認しましたが、180日の日別実績を取得できませんでした。',start_date:range.startDate,end_date:range.endDate,row_count:rows.length,matched_url:data.matched_url||null,candidate_trace:data.candidate_trace||[],summary:summary,period_sample_notes:sbmDoctorPeriodSampleNotes_(summary),rows:rows};
  }catch(e){return {ok:false,message:'180日の日別推移を取得できませんでした：'+String(e&&e.message||e),start_date:range.startDate,end_date:range.endDate,row_count:0,matched_url:null,candidate_trace:[],summary:null,rows:[]};}
}
function sbmDoctorPeriodSampleNotes_(summary){
  var out={};Object.keys(summary||{}).forEach(function(k){var m=summary[k]||{},imp=Number(m.impressions||0),clicks=Number(m.clicks||0);out[k]={impressions:imp,clicks:clicks,sample_quality:imp<50?'VERY_LOW':imp<200?'LOW':'SUFFICIENT',interpretation_note:imp<200?'母数が小さいためCTRや順位の比較は参考値として扱ってください。':'通常比較が可能です。'};});return out;
}

function sbmDoctorSummarizeDailyMetrics_(rows,range){
  function aggregate(list){var c=0,i=0,posNum=0,posDen=0;list.forEach(function(r){c+=Number(r.clicks||0);i+=Number(r.impressions||0);posNum+=Number(r.position||0)*Number(r.impressions||0);posDen+=Number(r.impressions||0);});return {clicks:c,impressions:i,ctr:i?c/i:0,position:posDen?posNum/posDen:0};}
  function addDays(text,n){var d=new Date(text+'T00:00:00+09:00');d.setDate(d.getDate()+n);return Utilities.formatDate(d,SBM_DEFAULTS.TIMEZONE,'yyyy-MM-dd');}
  function between(a,b){return rows.filter(function(r){var d=String(r.date||'');return d>=a&&d<=b;});}
  var firstEnd=addDays(range.startDate,89), lastStart=addDays(firstEnd,1), recentStart=addDays(range.endDate,-27), previousEnd=addDays(recentStart,-1), previousStart=addDays(previousEnd,-27);
  return {full_180_days:aggregate(between(range.startDate,range.endDate)),first_90_days:aggregate(between(range.startDate,firstEnd)),last_90_days:aggregate(between(lastStart,range.endDate)),recent_28_days:aggregate(between(recentStart,range.endDate)),previous_28_days:aggregate(between(previousStart,previousEnd))};
}
function sbmDoctorFetchLongTermQueries_(url,days,limit){
  var full=sbmDoctorEvidenceRange_(days), property=sbmGetSetting_('SearchConsoleProperty','');
  function addDays(text,n){var d=new Date(text+'T00:00:00+09:00');d.setDate(d.getDate()+n);return Utilities.formatDate(d,SBM_DEFAULTS.TIMEZONE,'yyyy-MM-dd');}
  var firstEnd=addDays(full.startDate,89), lastStart=addDays(firstEnd,1), recentStart=addDays(full.endDate,-27), previousEnd=addDays(recentStart,-1), previousStart=addDays(previousEnd,-27);
  var periods={full_180_days:full,first_90_days:{startDate:full.startDate,endDate:firstEnd},last_90_days:{startDate:lastStart,endDate:full.endDate},recent_28_days:{startDate:recentStart,endDate:full.endDate},previous_28_days:{startDate:previousStart,endDate:previousEnd}};
  try{
    var merged={},matchedUrls={};
    Object.keys(periods).forEach(function(key){
      var pr=periods[key], data=sbmDoctorSearchConsoleForUrl_(property,{startDate:pr.startDate,endDate:pr.endDate,dimensions:['query'],rowLimit:Number(limit||200)},url);
      matchedUrls[key]=data.matched_url||url;
      (data.rows||[]).forEach(function(r){var q=String(r.keys&&r.keys[0]||'');if(!q)return;var item=merged[q]||(merged[q]={query:q});item[key]={clicks:Number(r.clicks||0),impressions:Number(r.impressions||0),ctr:Number(r.ctr||0),position:Number(r.position||0)};});
    });
    var rows=Object.keys(merged).map(function(q){var item=merged[q];Object.keys(periods).forEach(function(k){if(!item[k])item[k]={clicks:0,impressions:0,ctr:0,position:0};});return item;}).sort(function(a,b){return (b.full_180_days.clicks-a.full_180_days.clicks)||(b.full_180_days.impressions-a.full_180_days.impressions);}).slice(0,Number(limit||200));
    return {ok:true,message:rows.length+'件のクエリと期間別推移を取得しました。',start_date:full.startDate,end_date:full.endDate,row_count:rows.length,limit:Number(limit||200),matched_urls:matchedUrls,periods:periods,rows:rows};
  }catch(e){return {ok:false,message:'180日のクエリ推移を取得できませんでした：'+String(e&&e.message||e),start_date:full.startDate,end_date:full.endDate,row_count:0,limit:Number(limit||200),matched_urls:{},periods:periods,rows:[]};}
}
/**
 * Product 5.10.0 RC1: Doctor v1.2用サイト全体Impact Summary。
 * 直近28日と前28日のpageデータを2回だけ取得し、記事単位の方向性を集計します。
 * Googleアップデートの因果判定は行わず、DoctorへSite Evidenceとして渡します。
 */
function sbmDoctorDateAdd_(text,n){
  var d=new Date(String(text||'')+'T00:00:00+09:00');
  if(isNaN(d.getTime()))return null;
  d.setDate(d.getDate()+Number(n||0));
  return Utilities.formatDate(d,SBM_DEFAULTS.TIMEZONE,'yyyy-MM-dd');
}
function sbmDoctorSitePeriodRows_(property,startDate,endDate){
  var limit=25000;
  var data=sbmSearchConsoleApiRequest_(property,{startDate:startDate,endDate:endDate,dimensions:['page'],rowLimit:limit})||{};
  var rows=(data.rows||[]).map(function(r){
    var url=String(r.keys&&r.keys[0]||'');
    return {url:url,normalized_url:sbmNormalizeUrl_(url),clicks:Number(r.clicks||0),impressions:Number(r.impressions||0),ctr:Number(r.ctr||0),position:Number(r.position||0)};
  }).filter(function(r){return !!r.normalized_url&&sbmIsValidArticleUrl_(r.normalized_url);});
  return {rows:rows,row_count:rows.length,row_limit:limit,truncated:rows.length>=limit};
}
function sbmDoctorAggregateSiteRows_(rows){
  var clicks=0,impressions=0,posNum=0;
  (rows||[]).forEach(function(r){var imp=Number(r.impressions||0);clicks+=Number(r.clicks||0);impressions+=imp;posNum+=Number(r.position||0)*imp;});
  return {clicks:clicks,impressions:impressions,ctr:impressions?clicks/impressions:0,position:impressions?posNum/impressions:0};
}
function sbmDoctorRateChange_(current,previous){
  current=Number(current||0);previous=Number(previous||0);
  if(previous===0)return current===0?0:null;
  return Number(((current-previous)/previous).toFixed(6));
}
function sbmDoctorClassifySiteArticleShift_(current,previous){
  current=current||{clicks:0,impressions:0,position:0};previous=previous||{clicks:0,impressions:0,position:0};
  var ci=Number(current.impressions||0),pi=Number(previous.impressions||0),cc=Number(current.clicks||0),pc=Number(previous.clicks||0);
  if(ci+pi<20)return 'LOW_SAMPLE';
  if(pi===0&&ci>=20)return 'IMPROVED';
  if(ci===0&&pi>=20)return 'DECLINED';
  var impRate=sbmDoctorRateChange_(ci,pi),clickRate=sbmDoctorRateChange_(cc,pc),posDelta=(ci>0&&pi>0)?Number(current.position||0)-Number(previous.position||0):0;
  var up=0,down=0;
  if(clickRate!==null&&clickRate>=0.20&&cc-pc>=2)up++;
  if(clickRate!==null&&clickRate<=-0.20&&pc-cc>=2)down++;
  if(impRate!==null&&impRate>=0.20&&ci-pi>=20)up++;
  if(impRate!==null&&impRate<=-0.20&&pi-ci>=20)down++;
  if(ci>=50&&pi>=50&&posDelta<=-1.5)up++;
  if(ci>=50&&pi>=50&&posDelta>=1.5)down++;
  if(up>down)return 'IMPROVED';
  if(down>up)return 'DECLINED';
  return 'STABLE';
}
function sbmDoctorFetchSiteImpactSummary_(){
  var property=sbmGetSetting_('SearchConsoleProperty','');
  var full=sbmDoctorEvidenceRange_(180),recentEnd=full.endDate,recentStart=sbmDoctorDateAdd_(recentEnd,-27),previousEnd=sbmDoctorDateAdd_(recentStart,-1),previousStart=sbmDoctorDateAdd_(previousEnd,-27);
  try{
    var recent=sbmDoctorSitePeriodRows_(property,recentStart,recentEnd),previous=sbmDoctorSitePeriodRows_(property,previousStart,previousEnd);
    var map={};
    function put(period,row){var k=row.normalized_url;if(!map[k])map[k]={url:row.url,recent:null,previous:null};map[k][period]=row;}
    recent.rows.forEach(function(r){put('recent',r);});previous.rows.forEach(function(r){put('previous',r);});
    var counts={IMPROVED:0,STABLE:0,DECLINED:0,LOW_SAMPLE:0};
    Object.keys(map).forEach(function(k){counts[sbmDoctorClassifySiteArticleShift_(map[k].recent,map[k].previous)]++;});
    var comparable=counts.IMPROVED+counts.STABLE+counts.DECLINED,total=Object.keys(map).length;
    var rm=sbmDoctorAggregateSiteRows_(recent.rows),pm=sbmDoctorAggregateSiteRows_(previous.rows);
    var truncated=!!(recent.truncated||previous.truncated),confidence=truncated?'MEDIUM':comparable>=20?'HIGH':comparable>=5?'MEDIUM':'LOW';
    return {
      available:true,
      evidence_role:'SITE_WIDE_CONTEXT_ONLY',
      diagnostic_rule:'サイト全体の同時変動を示す補助Evidenceです。Googleアップデートとの時期一致だけで因果関係を確定せず、対象記事・SERP・本文・公式Update情報と統合してDoctorが判断してください。',
      periods:{recent_28_days:{start_date:recentStart,end_date:recentEnd},previous_28_days:{start_date:previousStart,end_date:previousEnd}},
      metrics:{recent_28_days:rm,previous_28_days:pm,change:{clicks_rate:sbmDoctorRateChange_(rm.clicks,pm.clicks),impressions_rate:sbmDoctorRateChange_(rm.impressions,pm.impressions),ctr_delta:Number((rm.ctr-pm.ctr).toFixed(6)),position_delta:Number((rm.position-pm.position).toFixed(6))}},
      article_population:{total_articles_with_any_data:total,articles_with_data:comparable,improved:counts.IMPROVED,stable:counts.STABLE,declined:counts.DECLINED,low_sample:counts.LOW_SAMPLE,improved_ratio:comparable?Number((counts.IMPROVED/comparable).toFixed(6)):0,stable_ratio:comparable?Number((counts.STABLE/comparable).toFixed(6)):0,declined_ratio:comparable?Number((counts.DECLINED/comparable).toFixed(6)):0},
      collection:{recent_rows:recent.row_count,previous_rows:previous.row_count,row_limit:recent.row_limit,truncated:truncated},
      confidence:confidence
    };
  }catch(e){return {available:false,message:'サイト全体の28日比較を取得できませんでした：'+String(e&&e.message||e),evidence_role:'SITE_WIDE_CONTEXT_ONLY',confidence:'LOW'};}
}

/**
 * Product 5.10.0 RC1: カニバリ判定用のサイト横断クエリ×URL証拠。
 * 対象記事の上位クエリから最大15件を抽出し、同じクエリで表示された自サイト内URLを取得します。
 */
function sbmDoctorFetchCannibalizationEvidence_(queryRows,days,targetUrl){
  var full=sbmDoctorEvidenceRange_(days),property=sbmGetSetting_('SearchConsoleProperty',''),target=sbmNormalizeUrl_(targetUrl),maxQueries=15,pageLimit=50;
  var ranked=(queryRows||[]).slice().sort(function(a,b){var aa=a.full_180_days||{},bb=b.full_180_days||{};return (Number(bb.clicks||0)-Number(aa.clicks||0))||(Number(bb.impressions||0)-Number(aa.impressions||0));}).slice(0,maxQueries);
  var rows=[],errors=[];
  ranked.forEach(function(item){
    var q=String(item.query||'').trim();if(!q)return;
    try{
      var data=sbmSearchConsoleApiRequest_(property,{startDate:full.startDate,endDate:full.endDate,dimensions:['page'],rowLimit:pageLimit,dimensionFilterGroups:[{filters:[{dimension:'query',operator:'equals',expression:q}]}]});
      var pages=(data.rows||[]).map(function(r){var u=String(r.keys&&r.keys[0]||'');return {url:u,normalized_url:sbmNormalizeUrl_(u),clicks:Number(r.clicks||0),impressions:Number(r.impressions||0),ctr:Number(r.ctr||0),position:Number(r.position||0)};}).filter(function(p){return !!p.normalized_url&&sbmIsValidArticleUrl_(p.normalized_url);});
      var targetRows=pages.filter(function(p){return p.normalized_url===target;});
      var competitors=pages.filter(function(p){return p.normalized_url!==target&&Number(p.impressions||0)>0;}).sort(function(a,b){return (b.clicks-a.clicks)||(b.impressions-a.impressions);});
      if(competitors.length){rows.push({query:q,target:{url:targetUrl,clicks:targetRows.reduce(function(n,p){return n+p.clicks;},0),impressions:targetRows.reduce(function(n,p){return n+p.impressions;},0),position:(item.full_180_days||{}).position||0},competing_urls:competitors.slice(0,10)});}
    }catch(e){errors.push({query:q,message:String(e&&e.message||e)});}
  });
  var competitorUrlSet={};rows.forEach(function(r){(r.competing_urls||[]).forEach(function(p){competitorUrlSet[p.normalized_url]=1;});});
  return {available:true,period_days:days,start_date:full.startDate,end_date:full.endDate,queries_checked:ranked.length,queries_with_competition:rows.length,competing_url_count:Object.keys(competitorUrlSet).length,rows:rows,errors:errors,diagnostic_rule:'同じ検索クエリで対象記事以外の自サイトURLにも表示実績がある場合のみカニバリ候補とします。候補があるだけでカニバリ確定とはせず、検索意図・順位・クリック分散をDoctorが総合評価してください。'};
}

function sbmDoctorLatestHealthSnapshot_(articleId,url){
  var rows=sbmRowsAsObjects_(SBM_SHEETS.DOCTOR_HEALTH_SNAPSHOT)||[], normalized=sbmNormalizeUrl_(url), found=null;
  rows.forEach(function(r){if((articleId&&String(r['記事ID']||'')===articleId)||sbmNormalizeUrl_(r['記事URL']||'')===normalized)found=r;});
  if(!found)return null;
  return {health_check_id:String(found['健康診断ID']||''),screening_result:String(found['一次検査結果']||''),screening_code:String(found['一次検査コード']||''),priority:String(found['優先度']||''),reason:String(found['診断の根拠']||''),detailed_examination:String(found['詳細検査']||''),rank:sbmDoctorNumberOrNull_(found['精密診断順位']),period:{start:sbmDoctorDateOnlyOrNull_(found['対象期間開始']),end:sbmDoctorDateOnlyOrNull_(found['対象期間終了']),days:sbmDoctorNumberOrNull_(found['対象日数'])},metrics:{full_180_days:sbmDoctorMetricFromSnapshot_(found,'180日'),first_90_days:sbmDoctorMetricFromSnapshot_(found,'前半90日'),last_90_days:sbmDoctorMetricFromSnapshot_(found,'後半90日'),recent_28_days:sbmDoctorMetricFromSnapshot_(found,'直近28日'),previous_28_days:sbmDoctorMetricFromSnapshot_(found,'前28日')}};
}
function sbmDoctorMetricFromSnapshot_(r,prefix){return {clicks:sbmDoctorNumberOrNull_(r[prefix+'クリック']),impressions:sbmDoctorNumberOrNull_(r[prefix+'表示']),ctr:sbmDoctorCtrValue_(r[prefix+'CTR']),position:sbmDoctorNumberOrNull_(r[prefix+'平均順位'])};}
function sbmDoctorAllImprovementHistory_(articleId,url){
  var normalized=sbmNormalizeUrl_(url), rows=sbmRowsAsObjects_(SBM_SHEETS.FEEDBACK_HISTORY)||[];
  return rows.filter(function(r){return (articleId&&String(r['ArticleID']||'').trim()===articleId)||sbmNormalizeUrl_(r['記事URL']||'')===normalized;}).map(function(r){return sbmDoctorPlainRecord_(r);});
}
function sbmDoctorExistingMedicalHistory_(articleId,url){
  var normalized=sbmNormalizeUrl_(url), rows=sbmRowsAsObjects_(SBM_SHEETS.DOCTOR_HEALTH_RECORD)||[];
  return rows.filter(function(r){return (articleId&&String(r['記事ID']||'').trim()===articleId)||sbmNormalizeUrl_(r['記事URL']||'')===normalized;}).map(function(r){return sbmDoctorPlainRecord_(r);});
}
function sbmDoctorPlainRecord_(record){var out={};Object.keys(record||{}).forEach(function(k){var v=record[k];if(v instanceof Date)out[k]=sbmDoctorIso_(v);else out[k]=v;});return out;}
function sbmDoctorInternalLinkEvidence_(article,queryRows,source){
  try{
    var candidates=sbmFindInternalLinkCandidates_(article,3,8,(queryRows||[]).map(function(q){return q.query;}))||[];
    var existing=(source&&source.ok&&source.data&&source.data.outbound_links)||[],existingSet={};
    existing.forEach(function(x){existingSet[sbmNormalizeUrl_(x.url||'')]=true;});
    candidates=candidates.map(function(c){var linked=!!existingSet[sbmNormalizeUrl_(c.url||'')];var out={};Object.keys(c).forEach(function(k){out[k]=c[k];});out.already_linked=linked;out.link_status=linked?'LINKED':'NOT_LINKED';return out;});
    return {available:true,existing_links:existing,candidates:candidates,linked_candidates:candidates.filter(function(c){return c.already_linked;}),unlinked_candidates:candidates.filter(function(c){return !c.already_linked;}),diagnostic_rule:'本文の実リンクURLと候補URLが一致する場合のみリンク済みと判定します。URLが取得できない場合は未設置と断定しないでください。'};
  }catch(e){return {available:false,message:String(e&&e.message||e),existing_links:[],candidates:[],linked_candidates:[],unlinked_candidates:[]};}
}
function sbmDoctorMainQueryFreshness_(mainQuery,title){
  var current=Number(Utilities.formatDate(new Date(),SBM_DEFAULTS.TIMEZONE,'yyyy')),q=String(mainQuery||''),years=q.match(/20\d{2}/g)||[];
  var old=years.map(Number).filter(function(y){return y<current;}).sort()[0]||null;
  return old?{warning:true,query_year:old,current_year:current,message:'メインクエリに古い年号「'+old+'」が残っています。記事の現在の役割と検索実績を確認し、必要ならメインクエリを見直してください。'}:{warning:false,query_year:null,current_year:current};
}
function sbmDoctorComparisonWindow_(improvement,performance){
  var elapsed=improvement&&improvement.elapsed_days!==null?Number(improvement.elapsed_days):null;
  var period=28, complete=elapsed===null?null:elapsed>=period;
  var nextDate=null;
  if(improvement&&improvement.improvement_date){var d=new Date(improvement.improvement_date+'T00:00:00+09:00');if(!isNaN(d.getTime())){d.setDate(d.getDate()+period);nextDate=Utilities.formatDate(d,SBM_DEFAULTS.TIMEZONE,'yyyy-MM-dd');}}
  return {comparison_period_days:period,post_change_days:elapsed,comparison_window_complete:complete,comparison_period_valid:elapsed===null?null:complete===true,next_measurement_date:nextDate,note:elapsed===null?'改善履歴がないため、改善前後比較は対象外です。':complete===false?'改善後28日に達していないため、直近28日値には改善前データが混在する可能性があります。正式な改善前後判定を保留してください。':'同じ長さの比較期間として評価できます。'};
}

/**
 * Product 5.10.0 RC8: Doctor健康診断書レイアウト
 * 利用者にはブログ全体の状態、Doctor所見、精密診断の目的を日本語で表示します。
 */
function sbmDoctorBuildHealthReportSheets_(healthCheckId, run, counts) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var snap = sbmGetOrCreateSheet_(SBM_SHEETS.DOCTOR_HEALTH_SNAPSHOT);
  var hm = sbmHeaderMap_(snap);
  var rows = snap.getLastRow() > 1 ? snap.getRange(2,1,snap.getLastRow()-1,snap.getLastColumn()).getValues() : [];
  var current = rows.filter(function(r){ return String(r[hm['健康診断ID']-1]) === healthCheckId; });

  var scoreTotal = 0, scoreCount = 0;
  var issueCounts = {LONG_TERM_DECLINE:0,RECENT_DROP:0,POSITION_OPPORTUNITY:0,CTR_OPPORTUNITY:0,LONG_TERM_STAGNATION:0};
  current.forEach(function(r){
    if (String(r[hm['Doctor診断対象']-1]) !== '対象') return;
    var code=String(r[hm['一次検査コード']-1]||''), pri=String(r[hm['優先度']-1]||'低');
    if (issueCounts.hasOwnProperty(code)) issueCounts[code]++;
    var score = code === 'HEALTHY' ? 100 : code === 'LOW_SAMPLE' ? 72 : pri === '高' ? 42 : pri === '中' ? 62 : 78;
    scoreTotal += score; scoreCount++;
  });
  var healthScore = scoreCount ? Math.round(scoreTotal / scoreCount) : 0;
  var candidateTotal = Number(counts.candidateTotal||counts.selected||0);
  var observationCount = Number(counts.lowSample||0) + Math.max(0,candidateTotal-Number(counts.selected||0));
  var overall = sbmDoctorOverallComment_(healthScore, issueCounts, Number(counts.selected||0));
  var trends=sbmDoctorTrendMessages_(issueCounts);

  // RC8 hotfix: 健康診断書は A列=項目 / B列=内容 の2列主体に統一。
  var reportName='Doctor_健康診断書';
  var report=ss.getSheetByName(reportName)||ss.insertSheet(reportName);
  report.setFrozenRows(0); report.setFrozenColumns(0);
  try { report.getRange(1,1,Math.min(report.getMaxRows(),100),Math.min(report.getMaxColumns(),20)).breakApart(); } catch(e) {}
  report.clear(); report.showSheet(); report.setHiddenGridlines(true);
  try { report.showColumns(1, Math.min(report.getMaxColumns(), 20)); } catch(eShow) {}

  report.getRange('A1:B1').setBackground('#0b5d3b').setFontColor('#ffffff');
  report.getRange('A1').setValue('SIMS Doctor').setFontSize(19).setFontWeight('bold');
  report.getRange('A2:B2').setBackground('#0b5d3b').setFontColor('#ffffff');
  report.getRange('A2').setValue('ブログ健康診断書').setFontSize(15).setFontWeight('bold');

  var healthLabel = healthScore >= 85 ? '良好' : healthScore >= 70 ? '概ね安定' : healthScore >= 55 ? '要改善' : '要精密診断';
  var healthBg = healthScore >= 85 ? '#b7e1cd' : healthScore >= 70 ? '#d9ead3' : healthScore >= 55 ? '#fce8b2' : '#f4c7c3';
  var healthFg = healthScore < 55 ? '#b31412' : '#274e13';
  var trendBase=Math.max(1,scoreCount);
  var trendItems=[
    ['長期流入低下',Number(issueCounts.LONG_TERM_DECLINE||0)],
    ['直近流入急減',Number(issueCounts.RECENT_DROP||0)],
    ['順位改善余地',Number(issueCounts.POSITION_OPPORTUNITY||0)],
    ['CTR低下・改善余地',Number(issueCounts.CTR_OPPORTUNITY||0)],
    ['長期停滞',Number(issueCounts.LONG_TERM_STAGNATION||0)]
  ].filter(function(x){return x[1]>0;}).sort(function(a,b){return b[1]-a[1];});
  var trendText=(trendItems.length?trendItems.slice(0,5).map(function(x){return '・'+x[0]+' '+x[1]+'件（'+Math.round(x[1]/trendBase*100)+'%）';}).join('\n'):'・健康診断で数値化できる共通傾向は見つかりませんでした。')+'\n※鮮度・競合強化・カニバリ等は精密診断で追加判定します。';
  var resultText='大きな問題なし '+Number(counts.healthy||0)+'件 / 経過観察 '+observationCount+'件 / 改善管理中 '+Number(counts.excluded||0)+'件 / データ不足 '+Number(counts.lowSample||0)+'件 / 精密診断 '+Number(counts.selected||0)+'件';
  var nextText=Number(counts.selected||0)>0 ? '「精密診断候補を見る」を開き、1件選択してDoctor依頼文を作成します。' : '通常のSBM運用を続け、次回の健康診断で推移を確認します。';

  var healthRows=[
    ['ブログ名',sbmGetSetting_('SiteName','')],
    ['診断日',Utilities.formatDate(new Date(),SBM_DEFAULTS.TIMEZONE,'yyyy年M月d日')],
    ['対象期間',run.startDate+' ～ '+run.endDate],
    ['健康度',healthScore+'点 '+healthLabel],
    ['登録記事',Number(run.targetCount||0)+'件'],
    ['健康診断ID',healthCheckId],
    ['Doctor所見',overall],
    ['多く見られた傾向',trendText],
    ['検査結果',resultText],
    ['次に行うこと',nextText]
  ];
  report.getRange(4,1,healthRows.length,2).setValues(healthRows);
  report.getRange(4,1,healthRows.length,1).setFontWeight('bold').setBackground('#eef3ef');
  report.getRange(4,2,healthRows.length,1).setBackground('#ffffff');
  report.getRange(7,2).setFontWeight('bold').setBackground(healthBg).setFontColor(healthFg);
  report.getRange(10,2,4,1).setWrap(true).setVerticalAlignment('middle');
  report.getRange(13,1,1,2).setBackground('#eef5ee');
  report.getRange(13,2).setFontWeight('bold');
  report.getRange(4,1,healthRows.length,2).setBorder(true,true,true,true,true,true,'#d8e4d8',SpreadsheetApp.BorderStyle.SOLID);
  report.setColumnWidth(1,170); report.setColumnWidth(2,760);
  report.setRowHeights(1,2,30); report.setRowHeights(4,6,28); report.setRowHeight(10,64); report.setRowHeight(11,72); report.setRowHeight(12,42); report.setRowHeight(13,44);
  report.getRange('A1:B13').setFontFamily('Arial').setVerticalAlignment('middle');

  // RC8 Final QA: 健康診断完了時は健康診断書だけを表示します。
  // 精密診断候補はメニュー「3．精密診断候補を見る」を開いた時点で最新スナップショットから再生成します。
  // これにより候補シート→Home→候補シートという途中画面のちらつきを防ぎます。
}

function sbmDoctorSelectionReason_(code,row,hm){
  function n(k){return hm[k]?Number(row[hm[k]-1]||0):0;}
  function drop(before,after){if(before<=0)return null;return Math.round((before-after)/before*100);}
  function pct(v){return (Number(v||0)*100).toFixed(1)+'%';}
  function pos(v){return Number(v||0)>0?Number(v).toFixed(1)+'位':'―';}
  function join(parts){return parts.filter(function(x){return !!x;}).join(' ／ ');}
  var firstC=n('前半90日クリック'), secondC=n('後半90日クリック'), firstI=n('前半90日表示'), secondI=n('後半90日表示');
  var firstCtr=n('前半90日CTR'), secondCtr=n('後半90日CTR'), firstP=n('前半90日平均順位'), secondP=n('後半90日平均順位');
  var recentC=n('直近28日クリック'), prevC=n('前28日クリック'), recentI=n('直近28日表示'), prevI=n('前28日表示');
  var recentCtr=n('直近28日CTR'), prevCtr=n('前28日CTR'), recentP=n('直近28日平均順位'), prevP=n('前28日平均順位');
  if(code==='RECENT_DROP'){
    var rd=drop(prevC,recentC), ri=drop(prevI,recentI), parts=[];
    if(rd!==null&&rd>0)parts.push('クリック '+prevC+'→'+recentC+'（'+rd+'%減）');
    if(ri!==null&&ri>0)parts.push('表示 '+prevI+'→'+recentI+'（'+ri+'%減）');
    if(prevP>0&&recentP>prevP+0.5)parts.push('順位 '+pos(prevP)+'→'+pos(recentP));
    if(prevCtr>0&&recentCtr>=0&&recentCtr<prevCtr)parts.push('CTR '+pct(prevCtr)+'→'+pct(recentCtr));
    return '直近流入急減｜'+(join(parts)||'直近28日で検索流入が急減');
  }
  if(code==='LONG_TERM_DECLINE'){
    var cd=drop(firstC,secondC), id=drop(firstI,secondI), parts2=[];
    if(cd!==null&&cd>0)parts2.push('クリック '+firstC+'→'+secondC+'（'+cd+'%減）');
    if(id!==null&&id>0)parts2.push('表示 '+firstI+'→'+secondI+'（'+id+'%減）');
    if(firstP>0&&secondP>firstP+0.5)parts2.push('順位 '+pos(firstP)+'→'+pos(secondP));
    if(firstCtr>0&&secondCtr>=0&&secondCtr<firstCtr)parts2.push('CTR '+pct(firstCtr)+'→'+pct(secondCtr));
    return '長期流入低下｜'+(join(parts2)||'半年後半で検索流入が低下');
  }
  if(code==='CTR_OPPORTUNITY'){
    var cparts=['180日CTR '+pct(n('180日CTR'))];
    if(firstCtr>0||secondCtr>0)cparts.push('前半→後半 '+pct(firstCtr)+'→'+pct(secondCtr));
    if(n('180日表示')>0)cparts.push('表示 '+n('180日表示')+'回');
    return 'CTR低下・改善余地｜'+join(cparts);
  }
  if(code==='POSITION_OPPORTUNITY'){
    var pparts=['180日平均 '+pos(n('180日平均順位'))];
    if(firstP>0||secondP>0)pparts.push('前半→後半 '+pos(firstP)+'→'+pos(secondP));
    if(n('180日表示')>0)pparts.push('表示 '+n('180日表示')+'回');
    return '順位改善余地｜'+join(pparts);
  }
  if(code==='LONG_TERM_STAGNATION'){
    return '長期停滞｜クリック '+n('180日クリック')+'回 ／ 表示 '+n('180日表示')+'回 ／ 平均 '+pos(n('180日平均順位'));
  }
  if(firstCtr>0&&secondCtr>0&&secondCtr<firstCtr)return 'CTR低下｜'+pct(firstCtr)+'→'+pct(secondCtr)+' ／ 表示 '+firstI+'→'+secondI;
  return '詳しい確認が必要｜一次データだけでは主因を特定できません';
}


/** RC8 Official: 精密診断候補の選定根拠を横比較用の構造化データにします。 */
function sbmDoctorCandidateMetrics_(code,row,hm){
  function n(k){return hm[k]?Number(row[hm[k]-1]||0):0;}
  function fmtInt(v){return Number(v||0).toLocaleString('ja-JP');}
  function fmtPct(v){return (Number(v||0)*100).toFixed(1)+'%';}
  function fmtPos(v){return Number(v||0)>0?Number(v).toFixed(1)+'位':'―';}
  function drop(before,after){return before>0?Math.round((before-after)/before*100):null;}
  function arrowInt(before,after){var d=drop(before,after);return fmtInt(before)+'→'+fmtInt(after)+(d!==null&&d>0?' (-'+d+'%)':'');}
  function arrowPct(before,after){return fmtPct(before)+'→'+fmtPct(after);}
  function arrowPos(before,after){return fmtPos(before)+'→'+fmtPos(after);}
  var firstC=n('前半90日クリック'), secondC=n('後半90日クリック'), firstI=n('前半90日表示'), secondI=n('後半90日表示');
  var firstCtr=n('前半90日CTR'), secondCtr=n('後半90日CTR'), firstP=n('前半90日平均順位'), secondP=n('後半90日平均順位');
  var recentC=n('直近28日クリック'), prevC=n('前28日クリック'), recentI=n('直近28日表示'), prevI=n('前28日表示');
  var recentCtr=n('直近28日CTR'), prevCtr=n('前28日CTR'), recentP=n('直近28日平均順位'), prevP=n('前28日平均順位');
  var fullC=n('180日クリック'), fullI=n('180日表示'), fullCtr=n('180日CTR'), fullP=n('180日平均順位');
  if(code==='RECENT_DROP') return {trend:'直近流入急減',clicks:arrowInt(prevC,recentC),impressions:arrowInt(prevI,recentI),position:arrowPos(prevP,recentP),ctr:arrowPct(prevCtr,recentCtr)};
  if(code==='LONG_TERM_DECLINE') return {trend:'長期流入低下',clicks:arrowInt(firstC,secondC),impressions:arrowInt(firstI,secondI),position:arrowPos(firstP,secondP),ctr:arrowPct(firstCtr,secondCtr)};
  if(code==='CTR_OPPORTUNITY') return {trend:'CTR低下・改善余地',clicks:fmtInt(fullC),impressions:fmtInt(fullI),position:fmtPos(fullP),ctr:fmtPct(fullCtr)};
  if(code==='POSITION_OPPORTUNITY') return {trend:'順位改善余地',clicks:fmtInt(fullC),impressions:fmtInt(fullI),position:fmtPos(fullP),ctr:fmtPct(fullCtr)};
  if(code==='LONG_TERM_STAGNATION') return {trend:'長期停滞',clicks:fmtInt(fullC),impressions:fmtInt(fullI),position:fmtPos(fullP),ctr:fmtPct(fullCtr)};
  return {trend:'詳しい確認が必要',clicks:fmtInt(fullC),impressions:fmtInt(fullI),position:fmtPos(fullP),ctr:fmtPct(fullCtr)};
}

function sbmDoctorSelectionReasonFromLatestSnapshot_(articleId,url,fallback){
  try{
    var sh=SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SBM_SHEETS.DOCTOR_HEALTH_SNAPSHOT);if(!sh||sh.getLastRow()<2)return fallback||'詳しい確認が必要';
    var hm=sbmHeaderMap_(sh),vals=sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).getValues(),norm=sbmNormalizeUrl_(url||''),best=null;
    vals.forEach(function(r){var match=(articleId&&String(r[hm['記事ID']-1]||'')===String(articleId))||(norm&&sbmNormalizeUrl_(r[hm['記事URL']-1]||'')===norm);if(match)best=r;});
    if(best)return sbmDoctorSelectionReason_(String(best[hm['一次検査コード']-1]||''),best,hm);
  }catch(ignore){}
  return fallback||'詳しい確認が必要';
}

function sbmDoctorSeverityFromLatestSnapshot_(articleId,url,fallback){
  try{
    var sh=SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SBM_SHEETS.DOCTOR_HEALTH_SNAPSHOT);if(!sh||sh.getLastRow()<2)return fallback||'🟡 中等症';
    var hm=sbmHeaderMap_(sh),vals=sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).getValues(),norm=sbmNormalizeUrl_(url||''),best=null;
    vals.forEach(function(r){var match=(articleId&&String(r[hm['記事ID']-1]||'')===String(articleId))||(norm&&sbmNormalizeUrl_(r[hm['記事URL']-1]||'')===norm);if(match)best=r;});
    if(best)return sbmDoctorSeverity_(String(best[hm['一次検査コード']-1]||''),String(best[hm['優先度']-1]||''));
  }catch(ignore){}
  return fallback||'🟡 中等症';
}

function sbmDoctorOverallComment_(score, issues, selected) {
  var intro=score>=85?'ブログ全体はおおむね良好です。':score>=70?'ブログ全体は概ね安定していますが、一部の記事は継続確認が必要です。':score>=55?'ブログ全体に改善余地が見られます。':'検索流入が弱くなっている記事が複数あり、優先的な確認が必要です。';
  var trends=sbmDoctorTrendMessages_(issues);
  var middle=trends.length?' 特に、'+trends.slice(0,2).join('また、')+'。':'';
  var end=selected>0?' 今回は'+selected+'記事を優先して詳しく診断します。':' 今回は精密診断を優先する記事はありません。';
  return intro+middle+end;
}
function sbmDoctorTrendMessages_(issues){
  var a=[];
  if(Number(issues.RECENT_DROP||0)>0)a.push('直近で検索される機会が急に減った記事があります');
  if(Number(issues.LONG_TERM_DECLINE||0)>0)a.push('半年の後半に検索流入が弱くなった記事があります');
  if(Number(issues.POSITION_OPPORTUNITY||0)>0)a.push('検索順位を少し上げると成果が期待できる記事があります');
  if(Number(issues.CTR_OPPORTUNITY||0)>0)a.push('表示されているのにクリックされにくい記事があります');
  if(Number(issues.LONG_TERM_STAGNATION||0)>0)a.push('長期間ほぼ横ばいの記事があります');
  return a;
}
function sbmDoctorSeverity_(code,priority){
  if(code==='RECENT_DROP') return '🔴 緊急';
  if(code==='LONG_TERM_DECLINE' && priority==='高') return '🟠 重症';
  if(code==='CTR_OPPORTUNITY' || code==='POSITION_OPPORTUNITY' || code==='LONG_TERM_STAGNATION') return '🟡 中等症';
  return priority==='高' ? '🟠 重症' : '🟢 軽症';
}
/** RC8 Final Hotfix 3: 変化率だけでなく母数・絶対量も加味した重症度。 */
function sbmDoctorSeverityForRow_(code,priority,row,hm){
  function n(k){return hm[k]?Number(row[hm[k]-1]||0):0;}
  function decline(before,after){return before>0?Math.max(0,(before-after)/before):0;}
  var firstC=n('前半90日クリック'),secondC=n('後半90日クリック'),firstI=n('前半90日表示'),secondI=n('後半90日表示');
  var prevC=n('前28日クリック'),recentC=n('直近28日クリック'),prevI=n('前28日表示'),recentI=n('直近28日表示');
  var fullC=n('180日クリック'),fullI=n('180日表示');
  if(code==='RECENT_DROP'){
    var c28=decline(prevC,recentC),i28=decline(prevI,recentI);
    if((prevC>=20&&c28>=0.60)||(prevI>=500&&i28>=0.60))return '🔴 緊急';
    if((prevC>=5&&c28>=0.50)||(prevI>=150&&i28>=0.50))return '🟠 重症';
    return '🟡 中等症';
  }
  if(code==='LONG_TERM_DECLINE'){
    var c90=decline(firstC,secondC),i90=decline(firstI,secondI);
    if((firstC>=20&&c90>=0.60)||(firstI>=500&&i90>=0.60))return '🟠 重症';
    if((firstC>=5&&c90>=0.40)||(firstI>=100&&i90>=0.40))return '🟡 中等症';
    return '🟢 軽症';
  }
  if(code==='CTR_OPPORTUNITY'||code==='POSITION_OPPORTUNITY'||code==='LONG_TERM_STAGNATION')return (fullC>=5||fullI>=200||priority==='高')?'🟡 中等症':'🟢 軽症';
  return priority==='高'?'🟠 重症':priority==='中'?'🟡 中等症':'🟢 軽症';
}
function sbmDoctorLatestHealthCheckIdFromRows_(rows,hm){
  var bestId='',bestTime=-1;
  (rows||[]).forEach(function(r){
    var id=hm['健康診断ID']?String(r[hm['健康診断ID']-1]||''):'';if(!id)return;
    var raw=hm['取得日時']?r[hm['取得日時']-1]:'';var t=raw instanceof Date?raw.getTime():Date.parse(String(raw||''));
    if(!isNaN(t)&&t>=bestTime){bestTime=t;bestId=id;}else if(bestTime<0){bestId=id;}
  });
  if(!bestId){for(var i=(rows||[]).length-1;i>=0;i--){var x=hm['健康診断ID']?String(rows[i][hm['健康診断ID']-1]||''):'';if(x){bestId=x;break;}}}
  return bestId;
}
function sbmDoctorDedupeCandidateRows_(rows,hm){
  var seen={},out=[];
  (rows||[]).forEach(function(r){
    var id=hm['記事ID']?String(r[hm['記事ID']-1]||'').trim():'';
    var url=hm['記事URL']?sbmNormalizeUrl_(r[hm['記事URL']-1]||''):'';
    var title=hm['記事タイトル']?String(r[hm['記事タイトル']-1]||'').trim():'';
    var key=id?'id:'+id:(url?'url:'+url:(title?'title:'+title:''));
    if(!key||seen[key])return;seen[key]=true;out.push(r);
  });
  return out;
}
function sbmDoctorPriorityDisplay_(priority){
  if(priority==='高')return '最優先';
  if(priority==='中')return '優先';
  if(priority==='低')return '通常';
  return '確認';
}
function sbmDoctorPlannedExamination_(code){
  var map={
    'RECENT_DROP':'直近の流入減少を確認',
    'LONG_TERM_DECLINE':'長期的な低下原因を確認',
    'POSITION_OPPORTUNITY':'順位停滞と改善余地を確認',
    'CTR_OPPORTUNITY':'クリック率と検索意図を確認',
    'LONG_TERM_STAGNATION':'長期停滞の原因を確認',
    'LOW_SAMPLE':'データが増えるまで経過観察'
  };
  return map[code]||'記事の状態と今後の対応を確認';
}
function sbmDoctorReasonForUser_(code, reason){
  var map={
    'RECENT_DROP':'検索される機会が直近で急に減っています。季節変動、検索需要、順位変化などを詳しく確認します。',
    'LONG_TERM_DECLINE':'半年の前半より後半の検索流入が大きく減っています。長期的な低下の原因を確認します。',
    'POSITION_OPPORTUNITY':'検索結果の2ページ目前後にあり、内容を整えることで順位上昇が期待できます。',
    'CTR_OPPORTUNITY':'検索結果には表示されていますが、クリックされる割合が低めです。タイトルと検索意図の一致を確認します。',
    'LONG_TERM_STAGNATION':'長期間ほぼ同じ状態が続いています。記事の役割や改善余地を確認します。'
  };
  return map[code]||reason||'詳しい診断が必要と判断されました。';
}

function sbmDoctorLatestCaseForArticle_(articleId,url){
  var rows=sbmRowsAsObjects_(SBM_SHEETS.DOCTOR_CASES)||[], best=null, bestStamp='';
  var normalized=sbmNormalizeUrl_(url||'');
  rows.forEach(function(r){
    var match=(articleId&&String(r['記事ID']||'')===String(articleId))||(normalized&&sbmNormalizeUrl_(r['記事URL']||'')===normalized);
    if(!match)return;
    var stamp=String(r['更新日時']||r['作成日時']||'');
    if(!best||stamp>=bestStamp){best=r;bestStamp=stamp;}
  });
  return best;
}
/** RC8 Final Hotfix 5: 現在の健康診断より後に作られたDoctorケースだけを、現在候補の処理済みケースとして扱います。 */
function sbmDoctorCaseIsAfterCurrentHealthCheck_(caseRow){
  if(!caseRow)return false;
  var run=sbmDoctorGetHealthRun_(), caseDate=sbmParseDate_(caseRow['作成日時']||caseRow['更新日時']||'');
  if(!run||!run.createdAt)return true;
  var runDate=sbmParseDate_(run.createdAt);
  if(!caseDate||!runDate)return true;
  return caseDate.getTime()>=runDate.getTime();
}

/** 現在の精密診断候補に残してよい記事か。候補は未処理（Doctor未送信）だけです。 */
function sbmDoctorIsUntreatedCurrentCandidate_(articleId,url){
  var article=sbmFindArticleDbByIdentity_(articleId,url)||{}, work=String(article['作業状態']||'');
  if(work.indexOf('モニター中')>=0||work.indexOf('改善中')>=0)return false;
  var c=sbmDoctorLatestCaseForArticle_(articleId,url);
  if(!c)return true;
  var code=String(c['状態コード']||''),writerResult=String(c['Writer結果JSON']||'').trim();
  // Writer結果が保存済み、またはDoctor案件が進行中なら「新規候補」ではありません。
  if(writerResult)return false;
  if(['DOCTOR_DIAGNOSIS_PENDING','DOCTOR_DIAGNOSED','WRITER_REQUEST_READY','WRITER_IN_PROGRESS','PUBLICATION_PENDING','USER_ACTION_REQUIRED','USER_DECISION_REQUIRED','FOLLOW_UP_REQUEST_READY','MONITORING'].indexOf(code)>=0)return false;
  if(sbmDoctorCaseIsAfterCurrentHealthCheck_(c))return false;
  return true;
}

/** 候補ビューから指定記事を即時除外します。正本は健康診断スナップショットなのでデータは失いません。 */
function sbmDoctorRemoveCandidateArticle_(articleId,url){
  var ss=SpreadsheetApp.getActiveSpreadsheet(),sh=ss.getSheetByName('Doctor_精密診断候補');
  if(!sh||sh.getLastRow()<7)return;
  var hm=sbmDoctorReferralHeaderMapNoRepair_(sh),idCol=hm['記事ID'],urlCol=hm['記事URL'],norm=sbmNormalizeUrl_(url||'');
  for(var r=sh.getLastRow();r>=7;r--){
    var id=idCol?String(sh.getRange(r,idCol).getDisplayValue()||''):'',u=urlCol?sbmNormalizeUrl_(sh.getRange(r,urlCol).getDisplayValue()||''):'';
    if((articleId&&id===String(articleId))||(norm&&u===norm))sh.deleteRow(r);
  }
}

function sbmDoctorReferralHumanStatus_(articleId,url){
  var article=sbmFindArticleDbByIdentity_(articleId,url)||{}, work=String(article['作業状態']||'');
  var c=sbmDoctorLatestCaseForArticle_(articleId,url), code=c?String(c['状態コード']||''):'';
  // 精密診断候補は「新しくDoctorへ送る記事を選ぶ場所」。
  // すでにDoctor案件として進行した記事は、重複診断防止のため再選択不可にします。
  if(work.indexOf('モニター中')>=0||code==='MONITORING')return {label:'⚪ モニター中',completed:true,code:'MONITORING'};
  if(code==='WRITER_IN_PROGRESS')return {label:'🟠 Writer処置中',completed:true,code:code};
  if(code==='PUBLICATION_PENDING')return {label:'🟠 修正済み・結果登録待ち',completed:true,code:code};
  if(code==='USER_ACTION_REQUIRED')return {label:'🔵 利用者確認待ち',completed:true,code:code};
  if(code==='FOLLOW_UP_REQUEST_READY')return {label:'🔵 Doctor再診待ち',completed:true,code:code};
  if(code==='DOCTOR_DIAGNOSIS_PENDING')return {label:'🔵 Doctor診断待ち',completed:true,code:code};
  if(code==='USER_DECISION_REQUIRED')return {label:'🟡 利用者判断待ち',completed:true,code:code};
  if(code==='TREATMENT_FAILED')return {label:'🔴 要確認',completed:true,code:code};
  if(code==='DOCTOR_DIAGNOSED'||code==='WRITER_REQUEST_READY')return {label:'🔵 処置準備中',completed:true,code:code};
  return {label:'🔴 要精密診断',completed:false,code:code||'READY'};
}
function sbmDoctorApplyReferralRowStates_(sh,startRow,count){
  if(!sh||!count)return;
  var hm=sbmDoctorReferralHeaderMapNoRepair_(sh), idCol=hm['記事ID'],urlCol=hm['記事URL'],statusCol=hm['状態'];
  if(!idCol&&!urlCol)return;
  for(var i=0;i<count;i++){
    var row=startRow+i, id=idCol?String(sh.getRange(row,idCol).getDisplayValue()||''):'',url=urlCol?String(sh.getRange(row,urlCol).getDisplayValue()||''):'';
    var st=sbmDoctorReferralHumanStatus_(id,url);
    if(statusCol)sh.getRange(row,statusCol).setValue(st.label);
    var range=sh.getRange(row,1,1,Math.min(5,sh.getLastColumn()));
    if(st.completed){
      // RC8 Final Hotfix 2: 入力規則だけ外して false を残すとセルに FALSE と表示される。
      // 完了・モニター中は選択不可の空欄セルとして扱う。
      sh.getRange(row,1).clearDataValidations().clearContent().setBackground('#eeeeee');
      range.setBackground('#eeeeee').setFontColor('#777777');
    }else{
      var selectCell=sh.getRange(row,1);
      var current=selectCell.getValue()===true;
      selectCell.insertCheckboxes().setValue(current);
      var bg='#ffffff';
      if(st.code==='WRITER_IN_PROGRESS'||st.code==='PUBLICATION_PENDING') bg='#fff2cc';
      else if(st.code==='DOCTOR_DIAGNOSIS_PENDING'||st.code==='TREATMENT_FAILED'||st.code==='READY') bg='#fce8e6';
      else if(st.code==='USER_DECISION_REQUIRED') bg='#fff2cc';
      else if(st.code.indexOf('USER_')===0||st.code==='FOLLOW_UP_REQUEST_READY') bg='#e8f0fe';
      range.setBackground(bg).setFontColor('#202124');
    }
  }
}
function sbmDoctorReferralHeaderMapNoRepair_(sh){
  var lastCol=Math.max(1,sh.getLastColumn()),headers=sh.getRange(6,1,1,lastCol).getDisplayValues()[0],map={};
  headers.forEach(function(v,i){v=String(v||'').trim();if(v)map[v]=i+1;});return map;
}

function sbmDoctorPolishHealthReportView_(sh){
  if(!sh)return;
  try{
    sh.setHiddenGridlines(true);
    sh.setColumnWidth(1,170);sh.setColumnWidth(2,760);
    if(sh.getLastRow()>=4)sh.getRange(4,1,Math.min(sh.getLastRow()-3,20),2).setWrap(true).setVerticalAlignment('middle');
  }catch(ignore){}
}
function sbmDoctorUpgradeReferralHumanView_(sh){
  // RC8 Official: 候補シートは8列比較ビューが正本。旧レイアウトは再生成して移行します。
  try{return sbmDoctorRebuildCandidateViewFromSnapshot_()||sh;}catch(e){sbmLog_('DoctorCandidateUpgrade','Warning',String(e));return sh;}
}
function sbmDoctorOpenHealthReport(){
  var sh=SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Doctor_健康診断書');
  if(!sh) return sbmAlert_('ブログ健康診断書','まだ健康診断書は作成されていません。先にブログ健康診断を実行してください。');
  sbmDoctorPolishHealthReportView_(sh);
  sh.showSheet(); SpreadsheetApp.getActiveSpreadsheet().setActiveSheet(sh); sh.activate();
}

function sbmDoctorEnsureReferralSelectionColumn_(sh){
  if(!sh) return null;
  var lastCol=Math.max(1,sh.getLastColumn());
  var headers=sh.getRange(6,1,1,lastCol).getDisplayValues()[0].map(function(v){return String(v||'').trim();});
  var selectionIndex=headers.indexOf('選択');
  if(selectionIndex<0){
    sh.insertColumnBefore(1);
    sh.getRange(6,1).setValue('選択').setFontWeight('bold').setBackground('#0b5d3b').setFontColor('#ffffff');
    sh.setColumnWidth(1,60);
    var lastRow=sh.getLastRow();
    if(lastRow>=7) sh.getRange(7,1,lastRow-6,1).insertCheckboxes().setValue(false);
    lastCol=sh.getLastColumn();
    headers=sh.getRange(6,1,1,lastCol).getDisplayValues()[0].map(function(v){return String(v||'').trim();});
  }else if(selectionIndex!==0){
    sh.moveColumns(sh.getRange(1,selectionIndex+1,sh.getMaxRows(),1),1);
    lastCol=sh.getLastColumn();
    headers=sh.getRange(6,1,1,lastCol).getDisplayValues()[0].map(function(v){return String(v||'').trim();});
  }
  var last=sh.getLastRow();
  if(last>=7){
    var rng=sh.getRange(7,1,last-6,1);
    rng.insertCheckboxes();
    var vals=rng.getValues();
    for(var i=0;i<vals.length;i++) if(vals[i][0]!==true) vals[i][0]=false;
    rng.setValues(vals);
  }
  sh.setColumnWidth(1,60);
  try { if(last>=7 && headers.indexOf('状態')>=0) sbmDoctorApplyReferralRowStates_(sh,7,last-6); } catch(eState) {}
  return headers;
}

function sbmDoctorReferralHeaderMap_(sh){
  var headers=sbmDoctorEnsureReferralSelectionColumn_(sh)||[];
  var map={};
  headers.forEach(function(v,i){if(v)map[v]=i+1;});
  return map;
}

/**
 * RC8 Final Hotfix 1: 最新の健康診断スナップショットから精密診断候補ビューだけを再生成します。
 * 候補シートは派生ビューなので、旧テーブル型情報を捨てても診断データは失われません。
 */
/**
 * RC8 Final QA UAT2: 精密診断候補の色は「傾向名」ではなく各指標の実データで判定します。
 * 悪化=赤系、改善=緑系、注意=黄系、中立=無色/薄灰。悪化色の強さは重症度も加味します。
 */
function sbmDoctorApplyCandidateStatusColors_(sheet,startRow,rows,hm){
  if(!sheet||!rows||!rows.length)return;
  function n(row,k){return hm[k]?Number(row[hm[k]-1]||0):0;}
  function ratio(before,after){return before>0?(after-before)/before:null;}
  function severityRank(text){text=String(text||'');if(text.indexOf('緊急')>=0)return 3;if(text.indexOf('重症')>=0)return 2;if(text.indexOf('中等症')>=0)return 1;return 0;}
  function palette(kind,level){
    if(kind==='good')return level>=2?['#d2e3fc','#174ea6']:['#e8f0fe','#1967d2'];
    if(kind==='bad')return level>=3?['#f4c7c3','#b31412']:level===2?['#fce8e6','#a50e0e']:['#fef0e7','#b06000'];
    if(kind==='warn')return ['#fff4d6','#6b4f00'];
    if(kind==='info')return ['#e8f0fe','#174ea6'];
    return ['#ffffff','#3c4043'];
  }
  function apply(cell,kind,level){var p=palette(kind,level);cell.setBackground(p[0]).setFontColor(p[1]);}
  function classifyDelta(delta,badWhenPositive,sev){
    if(delta===null||!isFinite(delta)||Math.abs(delta)<0.03)return ['neutral',0];
    var bad=badWhenPositive?delta>0:delta<0,mag=Math.abs(delta),level=mag>=0.50?Math.max(sev,3):mag>=0.25?Math.max(sev,2):mag>=0.10?Math.max(sev,1):1;
    return [bad?'bad':'good',level];
  }
  rows.forEach(function(row,i){
    var r=startRow+i,code=String(row[hm['一次検査コード']-1]||''),sevText=sheet.getRange(r,2).getDisplayValue(),sev=severityRank(sevText);
    var trendCell=sheet.getRange(r,4),clickCell=sheet.getRange(r,5),impCell=sheet.getRange(r,6),posCell=sheet.getRange(r,7),ctrCell=sheet.getRange(r,8);
    // 傾向セルは記事全体の重症度を示す。
    apply(trendCell,sev>=2?'bad':sev===1?'warn':'neutral',sev);
    if(code==='RECENT_DROP'||code==='LONG_TERM_DECLINE'){
      var recent=code==='RECENT_DROP';
      var bC=n(row,recent?'前28日クリック':'前半90日クリック'),aC=n(row,recent?'直近28日クリック':'後半90日クリック');
      var bI=n(row,recent?'前28日表示':'前半90日表示'),aI=n(row,recent?'直近28日表示':'後半90日表示');
      var bP=n(row,recent?'前28日平均順位':'前半90日平均順位'),aP=n(row,recent?'直近28日平均順位':'後半90日平均順位');
      var bR=n(row,recent?'前28日CTR':'前半90日CTR'),aR=n(row,recent?'直近28日CTR':'後半90日CTR');
      var c=classifyDelta(ratio(bC,aC),false,sev),im=classifyDelta(ratio(bI,aI),false,sev),po=classifyDelta(bP>0&&aP>0?(aP-bP)/bP:null,true,sev),ct=classifyDelta(ratio(bR,aR),false,sev);
      apply(clickCell,c[0],c[1]);apply(impCell,im[0],im[1]);apply(posCell,po[0],po[1]);apply(ctrCell,ct[0],ct[1]);
    }else if(code==='CTR_OPPORTUNITY'){
      apply(clickCell,'neutral',0);apply(impCell,'neutral',0);apply(posCell,'neutral',0);apply(ctrCell,sev>=2?'bad':'warn',sev);
    }else if(code==='POSITION_OPPORTUNITY'){
      apply(clickCell,'neutral',0);apply(impCell,'neutral',0);apply(posCell,sev>=2?'bad':'warn',sev);apply(ctrCell,'neutral',0);
    }else if(code==='LONG_TERM_STAGNATION'){
      apply(clickCell,'warn',sev);apply(impCell,'warn',sev);apply(posCell,'warn',sev);apply(ctrCell,'warn',sev);
    }else{
      apply(clickCell,'neutral',0);apply(impCell,'neutral',0);apply(posCell,'neutral',0);apply(ctrCell,'neutral',0);
    }
  });
}

function sbmDoctorRebuildCandidateViewFromSnapshot_(candidateContext){
  var ss=SpreadsheetApp.getActiveSpreadsheet(), snap=ss.getSheetByName(SBM_SHEETS.DOCTOR_HEALTH_SNAPSHOT);
  if(!snap||snap.getLastRow()<2)return null;
  var hm=sbmHeaderMap_(snap), allRows=snap.getRange(2,1,snap.getLastRow()-1,snap.getLastColumn()).getValues();
  if(!hm['詳細検査'])return null;
  var latestHealthCheckId=sbmDoctorLatestHealthCheckIdFromRows_(allRows,hm);
  var current=latestHealthCheckId?allRows.filter(function(r){return String(r[hm['健康診断ID']-1]||'')===latestHealthCheckId;}):allRows;
  // RC8 Final QA UAT5: 健康診断時の上位10件だけを固定在庫にしない。
  // 処理済み・改善中・モニター中を除外した後、精密診断が必要な全記事から再順位付けして最大N件を補充する。
  var detailCodes={'RECENT_DROP':1,'LONG_TERM_DECLINE':1,'CTR_OPPORTUNITY':1,'POSITION_OPPORTUNITY':1,'LONG_TERM_STAGNATION':1};
  var pool=sbmDoctorDedupeCandidateRows_(current.filter(function(r){
    var code=String(r[hm['一次検査コード']-1]||'');
    if(!detailCodes[code])return false;
    if(hm['Doctor診断対象']&&String(r[hm['Doctor診断対象']-1]||'')==='対象外')return false;
    var id=String(r[hm['記事ID']-1]||''),url=String(r[hm['記事URL']-1]||'');
    return sbmDoctorIsUntreatedCurrentCandidateCached_(candidateContext,id,url);
  }),hm);
  pool.sort(function(a,b){
    var sa=sbmDoctorCandidateScore_({priorityJa:String(a[hm['優先度']-1]||''),code:String(a[hm['一次検査コード']-1]||'')},{full:{i:Number(a[hm['180日表示']-1]||0),c:Number(a[hm['180日クリック']-1]||0)}});
    var sb=sbmDoctorCandidateScore_({priorityJa:String(b[hm['優先度']-1]||''),code:String(b[hm['一次検査コード']-1]||'')},{full:{i:Number(b[hm['180日表示']-1]||0),c:Number(b[hm['180日クリック']-1]||0)}});
    return sb-sa || Number(b[hm['180日表示']-1]||0)-Number(a[hm['180日表示']-1]||0) || Number(b[hm['180日クリック']-1]||0)-Number(a[hm['180日クリック']-1]||0);
  });
  var candidateLimit=Math.max(1,Math.min(20,Number(sbmGetSetting_('DoctorDetailedDiagnosisLimit','10')||10)));
  var selectedRows=pool.slice(0,candidateLimit);
  var candName='Doctor_精密診断候補', old1=ss.getSheetByName(candName), old2=ss.getSheetByName('Doctor_精密診断紹介状');
  try{if(old1){var h=ss.getSheetByName(SBM_SHEETS.HOME);if(ss.getActiveSheet()&&ss.getActiveSheet().getSheetId()===old1.getSheetId()&&h)ss.setActiveSheet(h);ss.deleteSheet(old1);}if(old2){var h2=ss.getSheetByName(SBM_SHEETS.HOME);if(ss.getActiveSheet()&&ss.getActiveSheet().getSheetId()===old2.getSheetId()&&h2)ss.setActiveSheet(h2);ss.deleteSheet(old2);}}catch(eDel){sbmLog_('DoctorCandidateRebuildDelete','Warning',String(eDel));}
  var cand=ss.insertSheet(candName);
  var headers=['選択','重症度','記事タイトル','傾向','クリック','表示','順位','CTR','記事ID','記事URL','候補キー'];
  cand.setHiddenGridlines(true);
  cand.getRange('A1:H1').merge().setValue('SIMS Doctor　精密診断候補').setBackground('#0b5d3b').setFontColor('#ffffff').setFontSize(16).setFontWeight('bold').setVerticalAlignment('middle');
  cand.getRange('A2:H2').merge().setValue('詳しい診断が必要な未処理記事だけを表示しています。1件選び、SIMS Doctorメニューの「4．チェックした記事のDoctor依頼文を作る」を実行してください。').setBackground('#eef5ee').setWrap(true).setVerticalAlignment('middle');
  cand.getRange(6,1,1,headers.length).setValues([headers]).setFontWeight('bold').setBackground('#0b5d3b').setFontColor('#ffffff');
  var out=selectedRows.map(function(r){var code=String(r[hm['一次検査コード']-1]||''),id=String(r[hm['記事ID']-1]||''),url=String(r[hm['記事URL']-1]||''),m=sbmDoctorCandidateMetrics_(code,r,hm);var title=String(r[hm['記事タイトル']-1]||'');var sev=sbmDoctorSeverityForRow_(code,String(r[hm['優先度']-1]||''),r,hm);var key=String(id)+'|'+sbmNormalizeUrl_(url)+'|'+title;return [false,sev,title,m.trend,m.clicks,m.impressions,m.position,m.ctr,id,url,key];});
  if(out.length)cand.getRange(7,1,out.length,out[0].length).setValues(out);else cand.getRange('A7').setValue('今回、精密診断を優先する未処理記事はありません。');
  cand.setFrozenRows(6);[62,92,300,145,125,135,120,115].forEach(function(w,i){cand.setColumnWidth(i+1,w);});cand.setColumnWidth(9,110);cand.setColumnWidth(10,220);cand.setColumnWidth(11,260);try{cand.hideColumns(9,3);}catch(eHide){}
  cand.setRowHeight(1,36);cand.setRowHeight(2,44);cand.setRowHeight(3,6);cand.setRowHeight(4,6);cand.setRowHeight(5,6);cand.setRowHeight(6,28);cand.getDataRange().setWrap(true).setVerticalAlignment('middle').setFontFamily('Arial');
  if(out.length){cand.getRange(7,1,out.length,1).insertCheckboxes().setValue(false);cand.getRange(7,2,out.length,1).setNumberFormat('@');var sevVals=cand.getRange(7,2,out.length,1).getDisplayValues();sevVals.forEach(function(v,i){var t=String(v[0]||''),cell=cand.getRange(7+i,2).setFontWeight('bold').setHorizontalAlignment('left');if(t.indexOf('緊急')>=0)cell.setBackground('#f4c7c3').setFontColor('#b31412');else if(t.indexOf('重症')>=0)cell.setBackground('#fce8b2').setFontColor('#7a3e00');else if(t.indexOf('中等症')>=0)cell.setBackground('#fff2cc').setFontColor('#5f4b00');else cell.setBackground('#e8f0fe').setFontColor('#174ea6');});sbmDoctorApplyCandidateStatusColors_(cand,7,selectedRows,hm);try{cand.autoResizeRows(7,out.length);}catch(eResize){cand.setRowHeights(7,out.length,46);}}
  return cand;
}

function sbmShowAsyncProgressDialog_(opt){
  opt=opt||{};
  var title=String(opt.title||'処理しています'), desc=String(opt.description||'必要なデータを確認しています。');
  var steps=Array.isArray(opt.steps)&&opt.steps.length?opt.steps:['処理を実行'];
  var workers=Array.isArray(opt.workers)&&opt.workers.length?opt.workers:[String(opt.worker||'')];
  workers=workers.filter(function(w){return /^[A-Za-z0-9_]+$/.test(String(w||''));});
  if(!workers.length)throw new Error('進捗ダイアログの処理先が設定されていません。');
  var realSteps=workers.length===steps.length&&workers.length>1;
  var stepHtml=steps.map(function(x,i){return '<div id="s'+i+'" style="padding:6px 0;color:#5f6368">'+(realSteps?'STEP '+(i+1)+' / '+steps.length+'　':'・')+sbmDoctorEscapeHtml_(x)+'</div>';}).join('');
  var workerJson=JSON.stringify(workers), realJson=realSteps?'true':'false';
  var html='<!DOCTYPE html><html><head><base target="_top"><style>body{font-family:Arial,"Noto Sans JP",sans-serif;padding:22px;color:#202124}.row{display:flex;align-items:center;gap:14px}.spin{width:26px;height:26px;border:4px solid #d2e3fc;border-top-color:#1a73e8;border-radius:50%;animation:r 1s linear infinite}@keyframes r{to{transform:rotate(360deg)}}h2{margin:0 0 8px;color:#174ea6}.sub{line-height:1.65;margin-bottom:14px}.active{font-weight:700;color:#174ea6!important}.done{color:#188038!important}</style></head><body><div class="row"><div class="spin"></div><div><h2>'+sbmDoctorEscapeHtml_(title)+'</h2><div class="sub">'+sbmDoctorEscapeHtml_(desc)+'</div></div></div>'+stepHtml+'<div id="msg" style="margin-top:12px;color:#5f6368">処理を開始しています…</div><script>var ws='+workerJson+',real='+realJson+',idx=0;function paint(){for(var i=0;i<'+steps.length+';i++){var e=document.getElementById("s"+i);if(!real)e.className="";else e.className=i<idx?"done":(i===idx?"active":"");}document.getElementById("msg").textContent=real?("現在 STEP "+(idx+1)+" / "+ws.length+" を処理しています。画面はそのままでお待ちください。"):"処理中です。画面はそのままでお待ちください。";}function fail(e){document.querySelector(".spin").style.display="none";document.getElementById("msg").style.color="#b31412";document.getElementById("msg").textContent=(e&&e.message)?e.message:String(e);}function run(){paint();var runner=google.script.run.withFailureHandler(fail).withSuccessHandler(function(){idx++;if(idx<ws.length){run();}else{for(var i=0;i<'+steps.length+';i++)document.getElementById("s"+i).className="done";document.getElementById("msg").textContent="完了しました。";setTimeout(function(){google.script.host.close();},300);}});runner.sbmRunProgressWorker(ws[idx]);}run();</script></body></html>';
  SpreadsheetApp.getUi().showModalDialog(sbmEnsureCloseButton_(HtmlService.createHtmlOutput(html).setWidth(600).setHeight(Math.min(440,240+steps.length*34))),title);
}

function sbmRunProgressWorker(workerName){
  var name=String(workerName||'');
  switch(name){
    case 'sbmDoctorCandidateProgressStep1_': return sbmDoctorCandidateProgressStep1_();
    case 'sbmDoctorCandidateProgressStep2_': return sbmDoctorCandidateProgressStep2_();
    case 'sbmDoctorCandidateProgressStep3_': return sbmDoctorCandidateProgressStep3_();
    case 'sbmSupplementNewArticlesWorker_': return sbmSupplementNewArticlesWorker_();
    case 'sbmUpdateEffectivenessWorker_': return sbmUpdateEffectivenessWorker_();
    default: throw new Error('進捗処理の実行先を確認できません: '+name);
  }
}

function sbmDoctorOpenDetailedCandidates(){
  return sbmShowAsyncProgressDialog_({title:'精密診断候補を準備しています',description:'最新の健康診断結果を確認し、処理済みの記事を除外して、優先度の高い記事を最大10件まで選んでいます。',workers:['sbmDoctorCandidateProgressStep1_','sbmDoctorCandidateProgressStep2_','sbmDoctorCandidateProgressStep3_'],steps:['最新の健康診断結果を確認','診断済み・モニター中の記事を除外','優先順位を整理して候補シートを作成']});
}
function sbmDoctorCandidateProgressStep1_(){
  var ss=SpreadsheetApp.getActiveSpreadsheet(),snap=ss.getSheetByName(SBM_SHEETS.DOCTOR_HEALTH_SNAPSHOT);
  if(!snap||snap.getLastRow()<2)throw new Error('健康診断結果がありません。先にブログ健康診断を実行してください。');
  return true;
}
var SBM_DOCTOR_CANDIDATE_CONTEXT_KEY='SBM_DOCTOR_CANDIDATE_CONTEXT_V1';
function sbmDoctorCandidateCaseStamp_(row){
  var d=sbmParseDate_(row&& (row['更新日時']||row['作成日時']) ||'');
  return d?d.getTime():0;
}
function sbmDoctorCandidateCompactCase_(row){
  if(!row)return null;
  return {stamp:sbmDoctorCandidateCaseStamp_(row),code:String(row['状態コード']||''),writerResult:!!String(row['Writer結果JSON']||'').trim()};
}
function sbmDoctorCandidateProgressStep2_(){
  // RC8 Final QA UAT13: 候補表示では旧案件の自己修復や「改善の推移」再計算を行わない。
  // 必要な3シートを各1回だけ読み、最新健康診断に対する除外ID/URLだけを作る。
  var ss=SpreadsheetApp.getActiveSpreadsheet(),db=ss.getSheetByName(SBM_SHEETS.ARTICLE_DB),cases=ss.getSheetByName(SBM_SHEETS.DOCTOR_CASES),snap=ss.getSheetByName(SBM_SHEETS.DOCTOR_HEALTH_SNAPSHOT);
  var workById={},workByUrl={},caseById={},caseByUrl={},healthCreatedAt=0;
  if(db&&db.getLastRow()>1){
    var dh=sbmHeaderMap_(db),idc=dh['ArticleID']||dh['記事ID'],uc=dh['記事URL']||dh['URL'],wc=dh['作業状態'];
    var width=Math.max(idc||0,uc||0,wc||0),vals=width?db.getRange(2,1,db.getLastRow()-1,width).getValues():[];
    vals.forEach(function(r){var id=idc?String(r[idc-1]||'').trim():'',u=uc?sbmNormalizeUrl_(r[uc-1]||''):'',w=wc?String(r[wc-1]||''):'';if(id)workById[id]=w;if(u)workByUrl[u]=w;});
  }
  if(cases&&cases.getLastRow()>1){
    var ch=sbmHeaderMap_(cases),cvals=cases.getRange(2,1,cases.getLastRow()-1,cases.getLastColumn()).getValues();
    cvals.forEach(function(r){var id=ch['記事ID']?String(r[ch['記事ID']-1]||'').trim():'',u=ch['記事URL']?sbmNormalizeUrl_(r[ch['記事URL']-1]||''):'',stamp=0,raw=ch['更新日時']?r[ch['更新日時']-1]:(ch['作成日時']?r[ch['作成日時']-1]:'');var d=sbmParseDate_(raw||'');stamp=d?d.getTime():0;var c={stamp:stamp,code:ch['状態コード']?String(r[ch['状態コード']-1]||''):'',writerResult:ch['Writer結果JSON']?!!String(r[ch['Writer結果JSON']-1]||'').trim():false};if(id&&(!caseById[id]||stamp>=caseById[id].stamp))caseById[id]=c;if(u&&(!caseByUrl[u]||stamp>=caseByUrl[u].stamp))caseByUrl[u]=c;});
  }
  try{var run=sbmDoctorGetHealthRun_(),rd=run&&run.createdAt?sbmParseDate_(run.createdAt):null;healthCreatedAt=rd?rd.getTime():0;}catch(ignoreRun){}
  var excludeIds={},excludeUrls={};
  if(snap&&snap.getLastRow()>1){
    var sh=sbmHeaderMap_(snap),rows=snap.getRange(2,1,snap.getLastRow()-1,snap.getLastColumn()).getValues(),latest=sbmDoctorLatestHealthCheckIdFromRows_(rows,sh);
    rows.forEach(function(r){
      if(latest&&sh['健康診断ID']&&String(r[sh['健康診断ID']-1]||'')!==latest)return;
      var id=sh['記事ID']?String(r[sh['記事ID']-1]||'').trim():'',u=sh['記事URL']?sbmNormalizeUrl_(r[sh['記事URL']-1]||''):'';
      var work=(id&&workById[id])||(u&&workByUrl[u])||'',a=id?caseById[id]:null,b=u?caseByUrl[u]:null,c=!a?b:(!b?a:(Number(b.stamp||0)>Number(a.stamp||0)?b:a));
      var ex=String(work).indexOf('モニター中')>=0||String(work).indexOf('改善中')>=0;
      if(!ex&&c){if(c.writerResult)ex=true;else if(['DOCTOR_DIAGNOSIS_PENDING','DOCTOR_DIAGNOSED','WRITER_REQUEST_READY','WRITER_IN_PROGRESS','PUBLICATION_PENDING','USER_ACTION_REQUIRED','USER_DECISION_REQUIRED','FOLLOW_UP_REQUEST_READY','MONITORING'].indexOf(String(c.code||''))>=0)ex=true;else if(healthCreatedAt>0&&Number(c.stamp||0)>=healthCreatedAt)ex=true;}
      if(ex){if(id)excludeIds[id]=1;if(u)excludeUrls[u]=1;}
    });
  }
  var compact={ids:Object.keys(excludeIds),urls:Object.keys(excludeUrls)};
  CacheService.getDocumentCache().put(SBM_DOCTOR_CANDIDATE_CONTEXT_KEY,JSON.stringify(compact),600);
  return {excluded:compact.ids.length};
}
function sbmDoctorCandidateLoadContext_(){
  try{var raw=CacheService.getDocumentCache().get(SBM_DOCTOR_CANDIDATE_CONTEXT_KEY),o=raw?JSON.parse(raw):null;if(!o)return null;var ids={},urls={};(o.ids||[]).forEach(function(x){ids[x]=1;});(o.urls||[]).forEach(function(x){urls[x]=1;});return {ids:ids,urls:urls};}catch(e){return null;}
}
function sbmDoctorIsUntreatedCurrentCandidateCached_(ctx,articleId,url){
  if(!ctx)return sbmDoctorIsUntreatedCurrentCandidate_(articleId,url);
  return !((articleId&&ctx.ids&&ctx.ids[String(articleId)])||(ctx.urls&&ctx.urls[sbmNormalizeUrl_(url||'')]));
}
function sbmDoctorCandidateProgressStep3_(){
  var ss=SpreadsheetApp.getActiveSpreadsheet(),sh=null,ctx=sbmDoctorCandidateLoadContext_();
  // Always render from the latest health snapshot first. Never expose a legacy 5-column sheet.
  try{sh=sbmDoctorRebuildCandidateViewFromSnapshot_(ctx);}catch(eRebuild){sbmLog_('DoctorCandidateOpenRebuild','Warning',String(eRebuild));}
  if(!sh) sh=ss.getSheetByName('Doctor_精密診断候補');
  if(!sh) return sbmAlert_('精密診断候補','まだ精密診断候補は作成されていません。先にブログ健康診断を実行してください。');
  sbmDoctorEnsureReferralSelectionColumn_(sh);
  sh.showSheet(); ss.setActiveSheet(sh); sh.activate();
}

function sbmDoctorUrgencyFromCandidateSeverity_(severity){
  var s=String(severity||'');
  if(s.indexOf('緊急')>=0)return 'CRITICAL';
  if(s.indexOf('重症')>=0)return 'HIGH';
  if(s.indexOf('中等症')>=0)return 'NORMAL';
  return 'LOW';
}
function sbmDoctorValidateCandidateAgainstHealthSnapshot_(articleId,url,title,severity){
  var ss=SpreadsheetApp.getActiveSpreadsheet(),snap=ss.getSheetByName(SBM_SHEETS.DOCTOR_HEALTH_SNAPSHOT);
  if(!snap||snap.getLastRow()<2)throw new Error('最新の健康診断スナップショットを確認できません。健康診断を再実行してください。');
  var hm=sbmHeaderMap_(snap), rows=snap.getRange(2,1,snap.getLastRow()-1,snap.getLastColumn()).getValues();
  var latestId=sbmDoctorLatestHealthCheckIdFromRows_(rows,hm), norm=sbmNormalizeUrl_(url||''), match=null;
  for(var i=0;i<rows.length;i++){
    var r=rows[i];
    if(latestId&&String(r[hm['健康診断ID']-1]||'')!==latestId)continue;
    var rid=String(r[hm['記事ID']-1]||'').trim(), ru=sbmNormalizeUrl_(r[hm['記事URL']-1]||''), rt=String(r[hm['記事タイトル']-1]||'').trim();
    if(rid===String(articleId||'').trim() && ru===norm && rt===String(title||'').trim()){match=r;break;}
  }
  if(!match)throw new Error('選択した候補の表示内容と最新健康診断スナップショットが一致しません。誤診断防止のため停止しました。候補シートを開き直してください。');
  var code=String(match[hm['一次検査コード']-1]||''), expected=sbmDoctorSeverityForRow_(code,String(match[hm['優先度']-1]||''),match,hm);
  if(String(expected)!==String(severity||''))throw new Error('候補の重症度が最新健康診断と一致しません。誤診断防止のため停止しました。候補シートを開き直してください。');
  return {row:match,code:code,severity:expected,healthCheckId:latestId};
}
function sbmDoctorCreateAndSaveResolvedRequest_(context){
  var payload=sbmDoctorBuildSingleCaseRequest_(context);
  var validation=sbmDoctorValidateSingleCaseRequest_(payload);
  if(!validation.valid)throw new Error(validation.errors.join('\n'));
  var jsonText=JSON.stringify(payload,null,2);
  sbmDoctorRememberLastRequest_(payload);
  sbmDoctorUpsertCaseFromRequest_(payload);
  sbmDoctorShowCopyDialog_(payload,jsonText);
  return {ok:true,requestId:payload.request.request_id,caseId:payload.case_id,articleId:payload.article.article_id};
}

function sbmDoctorCreateRequestFromDetailedCandidate(){
  try{
    sbmDoctorAssertSafeToExport_();
    var ss=SpreadsheetApp.getActiveSpreadsheet(),sh=ss.getSheetByName('Doctor_精密診断候補');
    if(!sh)throw new Error('精密診断候補がありません。先にブログ健康診断を完了してください。');
    var col=sbmDoctorReferralHeaderMap_(sh),last=sh.getLastRow();
    if(last<7)throw new Error('診断対象の記事がありません。');
    if(!col['選択'])throw new Error('候補一覧の選択欄を準備できませんでした。シートを閉じてもう一度開いてください。');
    var checks=sh.getRange(7,col['選択'],last-6,1).getValues(),selected=[];
    checks.forEach(function(v,i){if(v[0]===true)selected.push(i+7);});
    if(selected.length===0)throw new Error('A列の「選択」にチェックを入れてください。');
    if(selected.length>1)throw new Error('一度に依頼できるのは1記事です。チェックを1件だけ残してください。');
    var row=selected[0], rowValues=sh.getRange(row,1,1,sh.getLastColumn()).getDisplayValues()[0];
    function val(name){return col[name]?String(rowValues[col[name]-1]||'').trim():'';}
    var articleId=val('記事ID')||val('ArticleID'), articleUrl=val('記事URL')||val('URL'), visibleTitle=val('記事タイトル'), severity=val('重症度'), candidateKey=val('候補キー');
    if(!articleId||!articleUrl||!visibleTitle)throw new Error('選択行の記事ID・URL・タイトルを取得できません。候補シートを開き直してください。');
    var expectedKey=String(articleId)+'|'+sbmNormalizeUrl_(articleUrl)+'|'+visibleTitle;
    if(candidateKey&&candidateKey!==expectedKey)throw new Error('選択行の候補識別情報が一致しません。誤診断防止のため停止しました。候補シートを開き直してください。');
    var health=sbmDoctorValidateCandidateAgainstHealthSnapshot_(articleId,articleUrl,visibleTitle,severity);
    var db=ss.getSheetByName(SBM_SHEETS.ARTICLE_DB);if(!db)throw new Error('記事管理シートがありません。');
    var hm=sbmHeaderMap_(db), vals=db.getLastRow()>1?db.getRange(2,1,db.getLastRow()-1,db.getLastColumn()).getValues():[], dbRow=0;
    var dbIdCol=hm['ArticleID']||hm['記事ID'],dbUrlCol=hm['記事URL']||hm['URL'],dbTitleCol=hm['記事タイトル']||hm['H1タイトル'],targetNorm=sbmNormalizeUrl_(articleUrl);
    for(var i=0;i<vals.length;i++){
      var id=dbIdCol?String(vals[i][dbIdCol-1]||'').trim():'',url=dbUrlCol?sbmNormalizeUrl_(vals[i][dbUrlCol-1]||''):'';
      if(id===articleId&&url===targetNorm){dbRow=i+2;break;}
    }
    if(!dbRow)throw new Error('選択した候補と記事管理のArticleID＋URLが一致しません。誤診断防止のため依頼を作成しません。');
    var dbTitle=dbTitleCol?String(db.getRange(dbRow,dbTitleCol).getDisplayValue()||'').trim():'';
    if(dbTitle&&dbTitle!==visibleTitle)throw new Error('選択した候補の記事タイトルと記事管理のタイトルが一致しません。誤診断防止のため停止しました。');
    var context=sbmDoctorResolveContext_('ARTICLE_LIST',db,dbRow);
    context.sourceType='DETAILED_CANDIDATE';context.sourceSheet=sh.getName();context.sourceRow=row;context.candidateSeverity=severity;context.candidateUrgency=sbmDoctorUrgencyFromCandidateSeverity_(severity);context.healthCheckId=health.healthCheckId;
    var result=sbmDoctorCreateAndSaveResolvedRequest_(context);
    if(result&&result.ok){
      // 作成した依頼のArticleIDが選択行と一致することを最後に確認してから、選択した行だけを候補から外す。
      if(String(result.articleId||'')!==articleId)throw new Error('生成されたDoctor依頼の記事IDが選択行と一致しません。候補は変更していません。');
      sh.deleteRow(row);
    }
    return result;
  }catch(e){sbmAlert_('Doctor診断依頼を作成できません',String(e.message||e));}
}

function sbmDoctorOpenTreatmentGuide(){
  sbmDoctorEnsureMedicalSheets_();
  var ss=SpreadsheetApp.getActiveSpreadsheet(), src=sbmDoctorEnsureCaseSheet_(), hm=sbmHeaderMap_(src);
  var vals=src.getLastRow()>1?src.getRange(2,1,src.getLastRow()-1,src.getLastColumn()).getValues():[];
  var name='Doctor_治療案内', sh=ss.getSheetByName(name)||ss.insertSheet(name); sh.clear(); sh.showSheet(); sh.setHiddenGridlines(true);
  sh.getRange('A1:H2').setBackground('#0b5d3b').setFontColor('#ffffff').setHorizontalAlignment('center');
  sh.getRange('A1').setValue('SIMS Doctor').setFontSize(18).setFontWeight('bold'); sh.getRange('A2').setValue('治療が必要な記事').setFontSize(15).setFontWeight('bold');
  sh.getRange('A4').setValue('このシートは旧ワークフローの記録用です。現在はDoctor回答内の依頼文を直接Writerへ渡し、Writerの処置結果だけをSBMへ登録してください。').setWrap(true);
  var headers=['選択','記事ID','記事タイトル','現在の状態','優先度','紹介先','次に行うこと','CaseID']; sh.getRange(6,1,1,headers.length).setValues([headers]).setFontWeight('bold').setBackground('#0b5d3b').setFontColor('#ffffff');
  var out=[]; vals.forEach(function(r){var code=String(r[hm['状態コード']-1]||''); if(['WRITER_REQUEST_READY','USER_DECISION_REQUIRED','USER_ACTION_REQUIRED','MONITORING','PUBLICATION_PENDING','WRITER_IN_PROGRESS'].indexOf(code)<0)return; var next=code==='WRITER_REQUEST_READY'?'Writer治療依頼を作成':code==='USER_ACTION_REQUIRED'?'Doctor指示に従って手動確認':code==='USER_DECISION_REQUIRED'?'診断詳細を確認して判断':code==='MONITORING'?'再診予定日まで経過観察':code==='PUBLICATION_PENDING'?'修正内容を確認して公開':'Writerの処置完了を待つ'; out.push([false,r[hm['記事ID']-1],r[hm['記事タイトル']-1],r[hm['状態']-1],r[hm['優先度']-1],r[hm['紹介先']-1],next,r[hm['CaseID']-1]]);});
  if(out.length)sh.getRange(7,1,out.length,out[0].length).setValues(out);else sh.getRange('A7').setValue('現在、治療が必要な記事はありません。');
  if(out.length)sh.getRange(7,1,out.length,1).insertCheckboxes(); sh.setFrozenRows(6); [60,100,360,150,90,130,240,220].forEach(function(w,i){sh.setColumnWidth(i+1,w);}); sh.getDataRange().setWrap(true).setVerticalAlignment('middle').setFontFamily('Arial'); ss.setActiveSheet(sh);sh.activate();
}
function sbmDoctorCreateWriterTreatmentRequestFromGuide(){
  try{var ss=SpreadsheetApp.getActiveSpreadsheet(),sh=ss.getSheetByName('Doctor_治療案内');if(!sh)throw new Error('「Doctor_治療案内」がありません。先に「7．治療が必要な記事を確認する」を実行してください。');var last=sh.getLastRow();if(last<7)throw new Error('現在、Writerへ依頼する記事はありません。');var checks=sh.getRange(7,1,last-6,1).getValues(),selected=[];checks.forEach(function(v,i){if(v[0]===true)selected.push(i+7);});if(selected.length===0)throw new Error('Writerへ渡す記事の「選択」にチェックを入れてください。');if(selected.length>1)throw new Error('一度に依頼できるのは1記事です。チェックを1件だけ残してください。');var row=selected[0],caseId=String(sh.getRange(row,8).getDisplayValue()||''),rec=sbmDoctorFindCaseRow_(caseId);if(!rec)throw new Error('対応するDoctorケースが見つかりません。');var c={};Object.keys(rec.hm).forEach(function(k){c[k]=rec.values[rec.hm[k]-1];});var result=sbmDoctorCreateWriterTreatmentRequestForCase_(c);sh.getRange(row,1).setValue(false);return result;}catch(e){sbmAlert_('Writer治療依頼を作成できません',String(e.message||e));}
}



/* ========================================================================== *
 * Product 5.8.0 RC4: Doctor Case Workflow Integration
 * ========================================================================== */
function sbmDoctorGenerateCaseId_(articleId) {
  var base='CASE-'+Utilities.formatDate(new Date(),SBM_DEFAULTS.TIMEZONE,'yyyyMMdd')+'-'+String(articleId||'ARTICLE').replace(/[^A-Za-z0-9_-]/g,'');
  var rows=sbmRowsAsObjects_(SBM_SHEETS.DOCTOR_CASES)||[], n=1;
  rows.forEach(function(r){var id=String(r['CaseID']||'');if(id.indexOf(base+'-')===0){var m=id.match(/-(\d{3})$/);if(m)n=Math.max(n,Number(m[1])+1);}});
  return base+'-'+('000'+n).slice(-3);
}
function sbmDoctorEnsureCaseSheet_(){sbmDoctorEnsureMedicalSheets_();return sbmGetOrCreateSheet_(SBM_SHEETS.DOCTOR_CASES);}
function sbmDoctorUpsertCaseFromRequest_(payload){
  var sh=sbmDoctorEnsureCaseSheet_(), h=SBM_HEADERS.DOCTOR_CASES, hm=sbmHeaderMap_(sh), id=String(payload.case_id||payload.request&&payload.request.case_id||'');
  if(!id)return; var rowNo=0, vals=sh.getLastRow()>1?sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).getValues():[];
  vals.forEach(function(r,i){if(String(r[hm['CaseID']-1])===id)rowNo=i+2;});
  var row=new Array(h.length).fill(''); if(rowNo)row=sh.getRange(rowNo,1,1,h.length).getValues()[0];
  function put(k,v){row[hm[k]-1]=v===undefined||v===null?'':v;}
  put('CaseID',id);put('サイトID',payload.site&&payload.site.site_id);put('記事ID',payload.article&&payload.article.article_id);put('記事URL',payload.article&&payload.article.url);put('記事タイトル',payload.article&&payload.article.title);put('状態コード','DOCTOR_DIAGNOSIS_PENDING');put('状態','Doctor診断待ち');
  if(!row[hm['作成日時']-1])put('作成日時',sbmNowText_());put('更新日時',sbmNowText_());
  if(rowNo)sh.getRange(rowNo,1,1,h.length).setValues([row]);else sh.appendRow(row);
}
function sbmDoctorExtractJsonText_(text){
  var t=String(text||'').trim();
  if(!t)return '';
  var fence=t.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if(fence&&fence[1])t=String(fence[1]).trim();
  try{JSON.parse(t);return t;}catch(ignore){}
  var start=t.indexOf('{');
  if(start<0)return t;
  var depth=0,inString=false,escape=false;
  for(var i=start;i<t.length;i++){
    var ch=t.charAt(i);
    if(inString){
      if(escape){escape=false;continue;}
      if(ch==='\\'){escape=true;continue;}
      if(ch==='"')inString=false;
      continue;
    }
    if(ch==='"'){inString=true;continue;}
    if(ch==='{')depth++;
    else if(ch==='}'){
      depth--;
      if(depth===0)return t.substring(start,i+1);
    }
  }
  return t;
}
function sbmDoctorPromptJson_(title,message){
  var ui=SpreadsheetApp.getUi(),res=ui.prompt(title,message+'\n\nDoctor回答の全文、またはJSON部分だけを貼り付けてください。',ui.ButtonSet.OK_CANCEL);
  if(res.getSelectedButton()!==ui.Button.OK)return null;
  var t=sbmDoctorExtractJsonText_(res.getResponseText());
  if(!t)return null;
  try{return JSON.parse(t);}catch(e){throw new Error('JSONを読み取れませんでした。Doctor回答の「JSON contract」部分を含めて貼り付けてください。詳細：'+e.message);}
}
function sbmDoctorFindCaseRow_(caseId){var sh=sbmDoctorEnsureCaseSheet_(),hm=sbmHeaderMap_(sh),vals=sh.getLastRow()>1?sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).getValues():[];for(var i=0;i<vals.length;i++)if(String(vals[i][hm['CaseID']-1])===String(caseId))return {sheet:sh,row:i+2,values:vals[i],hm:hm};return null;}
function sbmDoctorNormalizeCaseResult_(o){
  var format=String(o&&o.format||'');
  if(format==='SIMS_DOCTOR_CASE_RESULT_V2'){
    var d=o.diagnosis||{},t=o.treatment_plan||{},ref=o.referral||{},re=o.reexamination||{};
    var explicitNextActionV2=String(o.workflow_handoff&&o.workflow_handoff.next_action||'').toUpperCase();
    var writerReadyV2=explicitNextActionV2==='WRITER'||!!(ref.required&&ref.destination==='SIMS_WRITER');
    var manualReviewV2=explicitNextActionV2==='USER_CONFIRMATION'||t.action==='MANUAL_REVIEW';
    var monitorV2=explicitNextActionV2==='MONITOR'||(!writerReadyV2&&!manualReviewV2&&(t.action==='MONITOR'||t.action==='NO_TREATMENT'));
    return {format:format,caseId:String(o.case_id||''),diagnosisId:o.diagnosis_id||'',diagnosisStatus:d.status||'',primaryCode:d.primary_code||'',priority:d.priority||t.priority||'',action:writerReadyV2?'TREATMENT_RECOMMENDED':(manualReviewV2?'MANUAL_REVIEW':(monitorV2?'MONITOR':t.action||'')),treatmentLevel:t.treatment_level||'',destination:writerReadyV2?'SIMS_WRITER':ref.destination||'',allowed:(ref.allowed_scope||[]),blocked:(ref.blocked_scope||[]),reviewDate:re.recommended_date||'',locked:!!(o.workflow&&o.workflow.workflow_locked),nextAction:explicitNextActionV2||(writerReadyV2?'WRITER':manualReviewV2?'USER_CONFIRMATION':monitorV2?'MONITOR':''),writerReady:writerReadyV2,manualReview:manualReviewV2,monitor:monitorV2,writerReferrals:[]};
  }
  if(format==='SIMS_DOCTOR_SINGLE_CASE_RESULT_V1'){
    var refs=Array.isArray(o.referrals)?o.referrals:[],activeWriter=[],deferredWriter=[],sbmRequired=[];
    refs.forEach(function(x){
      var target=String(x.target_product||''),action=String(x.action||'');
      var deferred=action==='DEFERRED'||String(x.status||'')==='DEFERRED';
      if(target==='WRITER'&&!deferred&&(action===''||action==='REQUIRE'||action==='RECOMMENDED'||action==='EXECUTE'))activeWriter.push(x);
      if(target==='WRITER'&&deferred)deferredWriter.push(x);
      if(target==='SBM'&&(action===''||action==='REQUIRE'||action==='RECOMMENDED'))sbmRequired.push(x);
    });
    function uniq(items){var seen={},out=[];items.forEach(function(v){String(v||'').split(',').forEach(function(s){s=s.trim();if(s&&!seen[s]){seen[s]=1;out.push(s);}});});return out;}
    var allowed=[],blocked=[];activeWriter.forEach(function(x){allowed=allowed.concat(x.allowed_scope||[]);blocked=blocked.concat(x.blocked_scope||[]);});
    var priorities=refs.map(function(x){return String(x.priority||'');}),priority=priorities.indexOf('HIGH')>=0?'HIGH':priorities.indexOf('MEDIUM')>=0?'MEDIUM':priorities.indexOf('LOW')>=0?'LOW':'';
    var explicitNextAction=String(o.workflow_handoff&&o.workflow_handoff.next_action||'').toUpperCase();
    var handoffWriter=!!(o.workflow_handoff&&o.workflow_handoff.writer_request_text);
    var writerReady=explicitNextAction==='WRITER'||activeWriter.length>0||handoffWriter;
    var diagnosisStatus=o.overall_verdict||o.diagnosis&&o.diagnosis.overall_status||o.diagnosis&&o.diagnosis.overall_status_label_ja||'';
    var primaryCode=o.overall_verdict||o.diagnosis&&o.diagnosis.overall_status||'';
    var reviewDate=o.next_review&&o.next_review.recommended_date||o.workflow&&o.workflow.next_review_recommended||'';
    var manualReview=explicitNextAction==='USER_CONFIRMATION'||(!writerReady&&sbmRequired.length>0);
    var monitor=explicitNextAction==='MONITOR'||(!writerReady&&!manualReview&&explicitNextAction==='');
    return {format:format,caseId:String(o.case_id||''),diagnosisId:o.diagnosis_id||o.case_id||'',diagnosisStatus:diagnosisStatus,primaryCode:primaryCode,priority:priority,action:writerReady?'TREATMENT_RECOMMENDED':(manualReview?'MANUAL_REVIEW':'MONITOR'),treatmentLevel:writerReady?'LIMITED':'',destination:writerReady?'SIMS_WRITER':(manualReview?'SBM':''),allowed:uniq(allowed),blocked:uniq(blocked),reviewDate:reviewDate,locked:!!(o.workflow&&o.workflow.lock_at_diagnosis_time),nextAction:explicitNextAction||(writerReady?'WRITER':manualReview?'USER_CONFIRMATION':'MONITOR'),writerReady:writerReady,manualReview:manualReview,monitor:monitor,writerReferrals:activeWriter,deferredWriterReferrals:deferredWriter,sbmReferrals:sbmRequired};
  }
  throw new Error('未対応のDoctor結果形式です：'+format+'。Doctor回答内のJSON contractを貼り付けてください。');
}
function sbmDoctorStoreCaseResult_(o,n){
  var id=n.caseId;
  if(!id)throw new Error('case_id がありません。');
  var rec=sbmDoctorFindCaseRow_(id);if(!rec)throw new Error('対応するCaseIDがSBMにありません：'+id);
  var r=rec.values,hm=rec.hm;function put(k,v){if(!hm[k])return;r[hm[k]-1]=v===undefined||v===null?'':v;}
  put('診断ID',n.diagnosisId);put('診断状態',n.diagnosisStatus);put('主診断コード',n.primaryCode);put('優先度',n.priority);put('治療アクション',n.action);put('治療レベル',n.treatmentLevel);put('紹介先',n.destination);put('許可範囲',(n.allowed||[]).join(','));put('禁止範囲',(n.blocked||[]).join(','));put('再診予定日',n.reviewDate);
  var compact=JSON.stringify(o);if(compact.length>49000)throw new Error('Doctor診断結果JSONが大きすぎるため保存できません。Doctor側の診断結果JSON自体を簡潔にしてください。');
  put('Doctor結果JSON',compact);
  var code,label;if(n.locked){code='WORKFLOW_LOCKED';label='既存改善の測定中';}else if(n.writerReady){code='WRITER_REQUEST_READY';label='Writer依頼作成可能';}else if(n.manualReview){code='USER_ACTION_REQUIRED';label='利用者作業待ち';}else if(n.monitor){code='MONITORING';label='経過観察';}else{code='DOCTOR_DIAGNOSED';label='Doctor診断済み';}
  put('状態コード',code);put('状態',label);put('更新日時',sbmNowText_());rec.sheet.getRange(rec.row,1,1,r.length).setValues([r]);
  return {record:rec,code:code,label:label};
}
function sbmDoctorReferralDetails_(doctor,n,evidence){
  var refs=n.writerReferrals||[],allowed=[],blocked=[],instructions=[],candidates=[],tasks=[],linkRecs=[];
  refs.forEach(function(x){
    allowed=allowed.concat(x.allowed_scope||[]);blocked=blocked.concat(x.blocked_scope||[]);
    if(x.instructions)instructions=instructions.concat(Array.isArray(x.instructions)?x.instructions:[x.instructions]);
    if(x.candidate_urls)candidates=candidates.concat(x.candidate_urls);
    if(x.internal_link_recommendations)linkRecs=linkRecs.concat(x.internal_link_recommendations);
  });
  if(!refs.length&&doctor.referral){
    allowed=allowed.concat(doctor.referral.allowed_scope||[]);
    blocked=blocked.concat(doctor.referral.blocked_scope||[]);
    instructions=instructions.concat(doctor.referral.instructions||[]);
    candidates=candidates.concat(doctor.referral.candidate_urls||[]);
    linkRecs=linkRecs.concat(doctor.referral.internal_link_recommendations||[]);
  }

  // Product 5.10.0 RC3: normalize every supported Doctor v1.2 referral shape.
  // Doctor may express treatment through actions_permitted (RC2-compatible),
  // immediate_action_scope (WAIT + LIGHT_FIX), or workflow_handoff. All must
  // produce the same complete Writer referral.
  var tp=doctor&&doctor.treatment_plan||{},permitted=Array.isArray(tp.actions_permitted)?tp.actions_permitted:[],prohibited=Array.isArray(tp.actions_prohibited)?tp.actions_prohibited:[];
  permitted.forEach(function(a){
    if(!a)return;
    var type=String(a.type||a.action||'').trim();
    if(type)allowed.push(type);
    var urls=[];
    if(Array.isArray(a.target_urls))urls=urls.concat(a.target_urls);
    if(a.target_url)urls.push(a.target_url);
    candidates=candidates.concat(urls);
    var note=String(a.scope_note||a.instruction||a.reason||'').trim();
    if(note)instructions.push(note);
    tasks.push({type:type||'TREATMENT',location:a.location||a.target||a.section||'',target_urls:urls,instruction:note,reason:a.reason||'',expected_effect:a.expected_effect||''});
  });
  prohibited.forEach(function(a){var code=typeof a==='string'?a:String(a&&a.type||a&&a.action||'').trim();if(code)blocked.push(code);});

  var immediate=tp.immediate_action_scope||{};
  if(tp.immediate_action_allowed&&immediate&&typeof immediate==='object'){
    var itype=String(immediate.type||'').trim();
    var maxLinks=Number(immediate.max_links||0);
    var scopeCode=itype;
    if(itype==='INTERNAL_LINK_ADDITION'&&maxLinks>0)scopeCode='INTERNAL_LINK_ADDITION_MAX_'+maxLinks;
    if(scopeCode)allowed.push(scopeCode);
    var iurls=Array.isArray(immediate.candidate_urls)?immediate.candidate_urls:[];
    candidates=candidates.concat(iurls);
    blocked=blocked.concat(immediate.prohibited||[]);
    tasks.push({type:itype||'TREATMENT',max_links:maxLinks||null,target_urls:iurls,instruction:immediate.scope_note||'',reason:immediate.reason||'',expected_effect:immediate.expected_effect||''});
  }

  var handoff=doctor&&doctor.workflow_handoff||{};
  allowed=allowed.concat(handoff.allowed_scope||[]);
  blocked=blocked.concat(handoff.blocked_scope||[]);
  if(handoff.instructions)instructions=instructions.concat(Array.isArray(handoff.instructions)?handoff.instructions:[handoff.instructions]);
  if(handoff.candidate_urls)candidates=candidates.concat(handoff.candidate_urls);
  linkRecs=linkRecs.concat(handoff.internal_link_recommendations||[]);
  if(handoff.writer_request_text)instructions.push(handoff.writer_request_text);

  linkRecs=linkRecs.concat(tp.internal_link_recommendations||[]);
  if(doctor.internal_link_recommendations)linkRecs=linkRecs.concat(doctor.internal_link_recommendations);

  // Enrich selected URLs from SBM Evidence Package. This is metadata only;
  // Writer still decides final placement, surrounding copy and anchor wording.
  var evidenceCandidates=evidence&&evidence.internal_links&&Array.isArray(evidence.internal_links.candidates)?evidence.internal_links.candidates:[];
  var byUrl={}; evidenceCandidates.forEach(function(c){if(c&&c.url)byUrl[String(c.url).replace(/\/$/,'')]=c;});
  function hasRec(url){var k=String(url||'').replace(/\/$/,'');return linkRecs.some(function(r){return r&&String(r.url||r.target_url||'').replace(/\/$/,'')===k;});}
  candidates.forEach(function(url){
    if(hasRec(url))return;
    var c=byUrl[String(url||'').replace(/\/$/,'')];
    linkRecs.push({
      url:url,
      title:c&&c.title||'',
      reason:'Doctorが内部リンク候補として選定。Writerは本文との関連性を再確認して自然な文脈で配置する。',
      relationship:c&&c.relatedQuery||'',
      suggested_context:'関連する症状・操作の説明箇所。記事末尾への機械的なタイトル列挙は避ける。',
      suggested_anchor_hint:c&&c.anchor||'',
      writer_must_finalize_anchor:true,
      source:'SBM_EVIDENCE_ENRICHMENT'
    });
  });

  function uniq(a){var seen={},out=[];(a||[]).forEach(function(v){var k=typeof v==='string'?v:JSON.stringify(v);if(k&&!seen[k]){seen[k]=1;out.push(v);}});return out;}
  // Deduplicate recommendations by normalized URL, preferring richer Doctor metadata.
  var recMap={},recOut=[]; linkRecs.forEach(function(r){if(!r)return;var url=String(r.url||r.target_url||'').trim();if(!url)return;var k=url.replace(/\/$/,'');if(!recMap[k]){var x=JSON.parse(JSON.stringify(r));x.url=url;if(x.writer_must_finalize_anchor===undefined)x.writer_must_finalize_anchor=true;recMap[k]=x;recOut.push(x);}else{var dst=recMap[k];['title','reason','relationship','suggested_context','suggested_anchor_hint'].forEach(function(f){if(!dst[f]&&r[f])dst[f]=r[f];});}});
  return {allowed_scope:uniq(allowed),blocked_scope:uniq(blocked),instructions:uniq(instructions),candidate_urls:uniq(candidates),treatment_tasks:uniq(tasks),internal_link_recommendations:recOut,presentation:doctor&&doctor.presentation||null};
}
function sbmDoctorBuildWriterTreatmentRequest_(sourceRequest,doctor,n){
  var article=sourceRequest.article||{},attachments=sourceRequest.attachments||{},evidence=sourceRequest.evidence_package||{},detail=sbmDoctorReferralDetails_(doctor,n,evidence);
  return {format:'SIMS_WRITER_TREATMENT_REQUEST_V1',contract_version:'1.0',source_system:'SIMS_BLOG_MANAGER',target_system:'SIMS_WRITER',generated_at:sbmDoctorIso_(new Date()),case_id:n.caseId,request_id:sourceRequest.request&&sourceRequest.request.request_id||'',article_id:article.article_id||'',site_id:sourceRequest.site&&sourceRequest.site.site_id||'',request_mode:'DOCTOR_REFERRAL_TREATMENT',article:{url:article.url||'',canonical_url:article.canonical_url||'',title:article.title||'',h1:article.h1||'',seo_title:article.seo_title||'',meta_description:article.meta_description||'',main_query:article.main_query||'',source_content:attachments.article_body||evidence.article_source&&evidence.article_source.data||null},doctor_referral:{diagnosis_id:n.diagnosisId||'',diagnosis_status:n.diagnosisStatus||'',diagnosis_codes:[n.primaryCode].filter(Boolean),priority:n.priority||'',treatment_action:n.action||'',treatment_level:n.treatmentLevel||'',allowed_scope:detail.allowed_scope,blocked_scope:detail.blocked_scope,instructions:detail.instructions,candidate_urls:detail.candidate_urls,treatment_tasks:detail.treatment_tasks,internal_link_recommendations:detail.internal_link_recommendations,presentation:detail.presentation,doctor_result:doctor},evidence_package:evidence,workflow:{locked:!!n.locked,treatment_allowed:!n.locked},return_contract:{format:'SIMS_WRITER_TREATMENT_RESULT_V1',contract_version:'1.0',return_to:'SIMS_BLOG_MANAGER'}};
}
function sbmSetArticleWorkStateByIdentity_(articleId,url,state){
  var sh=SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SBM_SHEETS.ARTICLE_DB);if(!sh||sh.getLastRow()<2)return false;
  var hm=sbmHeaderMap_(sh);if(!hm['作業状態'])return false;var id=String(articleId||''),norm=sbmNormalizeUrl_(url||'');
  for(var r=2;r<=sh.getLastRow();r++){
    var idv=hm['ArticleID']?String(sh.getRange(r,hm['ArticleID']).getDisplayValue()||''):'', uv=hm['記事URL']?sbmNormalizeUrl_(sh.getRange(r,hm['記事URL']).getDisplayValue()||''):'';
    if((id&&idv===id)||(norm&&uv===norm)){sh.getRange(r,hm['作業状態']).setValue(state);return true;}
  }
  return false;
}
function sbmDoctorSaveGeneratedWriterRequest_(caseId,req){
  var rec=sbmDoctorFindCaseRow_(caseId);if(!rec)return;
  var json=JSON.stringify(req),stored=json.length<=49000?json:JSON.stringify({format:req.format,case_id:req.case_id,article_id:req.article_id,note:'紹介状はダイアログへ表示済み。本文・証拠を含むためセル保存上限を超えました。'});
  if(rec.hm['Writer依頼JSON'])rec.values[rec.hm['Writer依頼JSON']-1]=stored;
  if(rec.hm['状態コード'])rec.values[rec.hm['状態コード']-1]='WRITER_IN_PROGRESS';
  if(rec.hm['状態'])rec.values[rec.hm['状態']-1]='Writer治療中';
  if(rec.hm['更新日時'])rec.values[rec.hm['更新日時']-1]=sbmNowText_();
  rec.sheet.getRange(rec.row,1,1,rec.values.length).setValues([rec.values]);
  // 利用者向け作業状態は通常改善と共通化。Doctor専用の短命な「診療中」は持たない。
  try{sbmSetArticleWorkStateByIdentity_(req.article_id,req.article&&req.article.url||'','🛠️ 処置中');}catch(eState){}
}
function sbmDoctorRegisterResultAndBuildNext(requestJsonText,doctorResultText){
  try{
    var sourceText=sbmDoctorExtractJsonText_(requestJsonText),resultText=sbmDoctorExtractJsonText_(doctorResultText),source,doctor;
    try{source=JSON.parse(sourceText);}catch(e){throw new Error('元のDoctor依頼JSONを読み取れませんでした。ダイアログを閉じて、紹介状を作り直してください。');}
    try{doctor=JSON.parse(resultText);}catch(e2){throw new Error('Doctor診断結果JSONを読み取れませんでした。Doctorの回答全文、またはSBM登録用JSONをそのまま貼り付けてください。');}
    if(String(source.format||'')!==SBM_DOCTOR_SINGLE_CASE_FORMAT)throw new Error('このダイアログのDoctor依頼形式を確認できません。');
    var f=String(doctor.format||'');if(f.indexOf('SIMS_WRITER_')===0)throw new Error('これはWriterの結果JSONです。ここにはDoctorの診断結果JSONを貼り付けてください。');
    if(f.indexOf('SIMS_DOCTOR_')!==0)throw new Error('Doctor診断結果ではありません。formatが SIMS_DOCTOR_ で始まるJSONを貼り付けてください。');
    var n=sbmDoctorNormalizeCaseResult_(doctor);
    var sourceCase=String(source.case_id||source.request&&source.request.case_id||''),sourceArticle=String(source.article&&source.article.article_id||'');
    if(String(n.caseId)!==sourceCase)throw new Error('CaseIDが一致しません。別の記事の診断結果が貼り付けられています。\n依頼：'+sourceCase+'\n結果：'+n.caseId);
    var resultArticle=String(doctor.article_id||doctor.article&&doctor.article.article_id||'');if(resultArticle&&sourceArticle&&resultArticle!==sourceArticle)throw new Error('ArticleIDが一致しません。別の記事の診断結果です。');
    var saved=sbmDoctorStoreCaseResult_(doctor,n);
    if(n.locked)return {ok:true,message:'Doctor診断結果を登録しました。',nextTitle:'現在は処置を開始しません',nextMessage:'既存の改善効果を測定中です。測定完了後に再診してください。',nextRequest:''};
    if(n.writerReady){var req=sbmDoctorBuildWriterTreatmentRequest_(source,doctor,n),text=JSON.stringify(req,null,2);sbmDoctorSaveGeneratedWriterRequest_(n.caseId,req);return {ok:true,message:'Doctor診断結果を登録し、Writer紹介状を作成しました。',route:'WRITER',nextTitle:'③ 次はSIMS Writerです',nextMessage:'下の紹介状をすべてコピーし、SIMS Writerへそのまま貼り付けてください。記事本文・クエリ・内部リンク候補・Doctorの治療方針を含んでいます。',nextRequest:text};}
    if(n.manualReview){var conf=sbmDoctorUserConfirmationSpec_(doctor,n);return {ok:true,message:'Doctor診断結果を登録しました。',route:'USER_CONFIRMATION',nextTitle:'③ 利用者による確認が必要です',nextMessage:conf.summary,nextRequest:'',confirmation:conf};}
    if(n.monitor)return {ok:true,message:'Doctor診断結果を登録しました。',nextTitle:'③ 今回は経過観察です',nextMessage:'Writerによる修正は行いません。Doctorが指定した時期までSBMで推移を観察してください。',nextRequest:''};
    return {ok:true,message:'Doctor診断結果を登録しました。',nextTitle:'③ 診断結果を確認してください',nextMessage:'今回の結果には自動生成できるWriter紹介状がありません。Doctorの治療方針に従ってください。',nextRequest:''};
  }catch(e){return {ok:false,message:String(e&&e.message?e.message:e)};}
}


function sbmDoctorUserConfirmationSpec_(doctor,n){
  var req=doctor&&doctor.user_confirmation_request||doctor&&doctor.confirmation_request||{};
  var action=String(req.action_for_sbm||req.action||'').trim();
  var reason=String(req.reason||'').trim();
  var target=String(req.target_url||doctor&&doctor.article_url||'').trim();
  var isUrlInspection=/URL_INSPECTION|URL検査|正規URL|canonical|インデックス/i.test(action+' '+reason+ ' '+String(req.type||''));
  var instruction='Doctorが指定した確認を行い、結果を選択してください。';
  var choices=[
    {code:'NORMAL',label:'問題なし・正常だった'},
    {code:'ISSUE_FOUND',label:'問題が見つかった'},
    {code:'UNCLEAR',label:'どれに当てはまるか分からない'}
  ];
  if(isUrlInspection){
    instruction='Search Consoleの「URL検査」で対象URLを確認してください。'+(target?' 対象：'+target:'')+' 末尾スラッシュ違いが疑われる場合は両方を確認し、Googleが選択した正規URLとインデックス状況を見ます。';
    choices=[
      {code:'INDEX_AND_CANONICAL_OK',label:'Googleに登録済みで、正規URLも問題なし'},
      {code:'CANONICAL_MISMATCH',label:'Googleが別の正規URLを選択している／canonicalに食い違いがある'},
      {code:'INDEXING_ISSUE',label:'インデックス未登録・noindex・クロール関連などの問題がある'},
      {code:'OTHER_OR_UNCLEAR',label:'どれに当てはまるか分からない／その他'}
    ];
  }
  return {case_id:n.caseId,type:isUrlInspection?'SEARCH_CONSOLE_URL_INSPECTION':String(req.type||'USER_CONFIRMATION'),summary:'確認結果をSBMへ登録すると、SBMが結果をEvidenceとして追加したDoctor再診依頼JSONを自動生成します。利用者が次の治療方針を判断する必要はありません。',instruction:instruction,choices:choices,doctor_request:req};
}

function sbmDoctorConfirmationLabel_(code){
  var m={INDEX_AND_CANONICAL_OK:'Google登録・正規URLとも正常',CANONICAL_MISMATCH:'正規URL/canonicalの不一致',INDEXING_ISSUE:'インデックス・クロール関連の問題',OTHER_OR_UNCLEAR:'その他・判断できない',NORMAL:'問題なし',ISSUE_FOUND:'問題あり',UNCLEAR:'判断できない'};
  return m[String(code||'')]||String(code||'');
}

function sbmDoctorFollowUpChainMeta_(previousCaseId, doctor) {
  var rootCaseId = String(previousCaseId || '');
  var depth = 0;
  var history = [];
  var prior = doctor && doctor.follow_up_context || null;
  if (!prior && doctor && doctor.previous_case_id) {
    var parent = sbmDoctorFindCaseRow_(String(doctor.previous_case_id));
    if (parent && parent.hm['再診依頼JSON']) {
      try {
        var parentReq = JSON.parse(String(parent.values[parent.hm['再診依頼JSON']-1] || '{}'));
        prior = parentReq.follow_up_context || null;
      } catch(ignorePrior) {}
    }
  }
  if (prior) {
    rootCaseId = String(prior.root_case_id || prior.previous_case_id || rootCaseId);
    depth = Number(prior.follow_up_depth || 0);
    if (Array.isArray(prior.confirmation_history)) history = prior.confirmation_history.slice();
    else if (prior.confirmation) history = [prior.confirmation];
  }
  return {root_case_id:rootCaseId,follow_up_depth:depth,confirmation_history:history};
}

function sbmDoctorBuildFollowUpRequest_(previousCaseId,resultCode,rawText){
  var rec=sbmDoctorFindCaseRow_(previousCaseId);if(!rec)throw new Error('元のDoctorケースが見つかりません：'+previousCaseId);
  var c={};Object.keys(rec.hm).forEach(function(k){c[k]=rec.values[rec.hm[k]-1];});
  var doctor={};try{doctor=JSON.parse(String(c['Doctor結果JSON']||'{}'));}catch(e){throw new Error('前回Doctor診断結果を読み取れません。');}
  var article=sbmDoctorFindArticleByIdOrUrl_(c['記事ID'],c['記事URL']);if(!article)throw new Error('記事管理に対象記事が見つかりません。');
  var effect=sbmDoctorFindEffectByUrl_(c['記事URL'])||{};
  var history=sbmDoctorFindLatestHistory_(c['記事ID'],c['記事URL'])||{};
  var ctx={sourceType:'USER_CONFIRMATION_FOLLOW_UP',article:article,effect:effect,history:history,sourceSheet:SBM_SHEETS.DOCTOR_CASES,sourceRow:rec.row};
  var p=sbmDoctorBuildSingleCaseRequest_(ctx);
  p.request.requested_by='SBM';p.request.trigger='SBM_USER_CONFIRMATION_FOLLOW_UP';p.request.chief_complaint='前回Doctor診断で求められた利用者確認が完了しました。追加Evidenceを踏まえて再診し、次の処置を決定してください。';
  var chain=sbmDoctorFollowUpChainMeta_(previousCaseId,doctor),confirmation={type:sbmDoctorUserConfirmationSpec_(doctor,sbmDoctorNormalizeCaseResult_(doctor)).type,status:'COMPLETED',result_code:String(resultCode||''),result_label:sbmDoctorConfirmationLabel_(resultCode),raw_text:String(rawText||''),completed_at:sbmDoctorIso_(new Date())};
  var nextDepth=Number(chain.follow_up_depth||0)+1,history=(chain.confirmation_history||[]).concat([confirmation]);
  var guardActive=nextDepth>=3;
  p.follow_up_context={format:'SIMS_DOCTOR_FOLLOW_UP_CONTEXT_V1',root_case_id:chain.root_case_id||previousCaseId,previous_case_id:previousCaseId,previous_request_id:String(doctor.request_id||''),follow_up_depth:nextDepth,previous_diagnosis_summary:doctor.presentation&&doctor.presentation.summary||doctor.diagnosis&&doctor.diagnosis.summary||'',confirmation:confirmation,confirmation_history:history,doctor_confirmation_request:doctor.user_confirmation_request||null,loop_guard:{active:guardActive,threshold:3,instruction:guardActive?'追加確認が3回以上続いています。既に確認済みの事項を再要求せず、現時点のEvidenceだけで治療方針を確定できるか再評価してください。どうしても追加確認が必要な場合は、過去と重複しない理由を明示してください。':''},requested_reassessment:'確認結果を追加Evidenceとして、技術的問題・経過観察・Writer治療のどれへ進むべきか再判定してください。'};
  p.workflow.active_case_id=p.case_id;
  p.diagnosis_scope.allow_doctor_to_expand_scope=true;
  sbmDoctorUpsertCaseFromRequest_(p);
  return p;
}

function sbmDoctorRegisterUserConfirmationAndBuildFollowUp(caseId,resultCode,rawText){
  try{
    caseId=String(caseId||'').trim();resultCode=String(resultCode||'').trim();if(!caseId)throw new Error('CaseIDがありません。');if(!resultCode)throw new Error('確認結果を選択してください。');
    var rec=sbmDoctorFindCaseRow_(caseId);if(!rec)throw new Error('Doctorケースが見つかりません：'+caseId);
    var doctor=JSON.parse(String(rec.values[rec.hm['Doctor結果JSON']-1]||'{}')),n=sbmDoctorNormalizeCaseResult_(doctor);if(!n.manualReview)throw new Error('このケースは利用者確認待ちではありません。');
    function put(k,v){if(rec.hm[k])rec.values[rec.hm[k]-1]=v===undefined||v===null?'':v;}
    var spec=sbmDoctorUserConfirmationSpec_(doctor,n),now=sbmNowText_();
    put('確認種別',spec.type);put('確認結果',sbmDoctorConfirmationLabel_(resultCode));put('確認詳細',String(rawText||'').substring(0,45000));put('確認日時',now);put('状態コード','FOLLOW_UP_REQUEST_READY');put('状態','Doctor再診依頼作成済み');put('更新日時',now);
    var follow=sbmDoctorBuildFollowUpRequest_(caseId,resultCode,rawText),text=JSON.stringify(follow,null,2),compact=JSON.stringify(follow);
    put('再診依頼JSON',compact.length<=49000?compact:JSON.stringify({format:follow.format,case_id:follow.case_id,follow_up_context:follow.follow_up_context,note:'再診依頼はダイアログへ表示済み。Evidenceを含むためセル保存上限を超えました。'}));
    rec.sheet.getRange(rec.row,1,1,rec.values.length).setValues([rec.values]);
    return {ok:true,message:'確認結果を登録し、Doctor再診依頼を作成しました。\n結果：'+sbmDoctorConfirmationLabel_(resultCode)+'\n新CaseID：'+follow.case_id,followUpRequest:text,followUpCaseId:follow.case_id};
  }catch(e){return {ok:false,message:String(e&&e.message?e.message:e)};}
}

function sbmDoctorRegisterCaseResult(){
  try{
    var o=sbmDoctorPromptJson_('Doctor診断結果を登録','通常は精密診断ダイアログ下段へ貼り付けてください。このメニューは診断記録だけを保存する予備機能です。');
    if(!o)return;
    var n=sbmDoctorNormalizeCaseResult_(o),saved=sbmDoctorStoreCaseResult_(o,n);
    sbmAlert_('Doctor診断結果を登録しました','CaseID：'+n.caseId+'\n状態：'+saved.label+'\n\nWriter紹介状は、Doctor診断結果からWriter処置へ進む場合に自動生成されます。');
  }catch(e){sbmAlert_('Doctor診断結果を登録できません',String(e.message||e));}
}
function sbmDoctorOpenCases(){var sh=sbmDoctorEnsureCaseSheet_();sh.showSheet();SpreadsheetApp.getActive().setActiveSheet(sh);}
function sbmDoctorSelectedCase_(){var sh=SpreadsheetApp.getActiveSheet();if(!sh||sh.getName()!==SBM_SHEETS.DOCTOR_CASES)throw new Error('Doctor_Casesシートで対象ケースの行を選択してください。');var row=sh.getActiveRange().getRow();if(row<2)throw new Error('対象ケースの行を選択してください。');var hm=sbmHeaderMap_(sh),vals=sh.getRange(row,1,1,sh.getLastColumn()).getValues()[0],o={};Object.keys(hm).forEach(function(k){o[k]=vals[hm[k]-1];});return o;}
function sbmDoctorCreateWriterTreatmentRequest(){
  try{
    var c=sbmDoctorSelectedCase_();
    if(String(c['状態コード'])!=='WRITER_REQUEST_READY')throw new Error('このケースはWriter依頼を作成できる状態ではありません。');
    return sbmDoctorCreateWriterTreatmentRequestForCase_(c);
  }catch(e){sbmAlert_('Writer治療依頼を作成できません',String(e.message||e));}
}
function sbmDoctorCreateWriterTreatmentRequestForCase_(c){
  if(String(c['状態コード'])!=='WRITER_REQUEST_READY')throw new Error('このケースはWriter依頼を作成できる状態ではありません。');
  var doctor=JSON.parse(String(c['Doctor結果JSON']||'{}')),article=sbmDoctorFindArticleByIdOrUrl_(c['記事ID'],c['記事URL'])||{},n=sbmDoctorNormalizeCaseResult_(doctor),detail=sbmDoctorReferralDetails_(doctor,n,null);
  var req={format:'SIMS_WRITER_TREATMENT_REQUEST_V1',contract_version:'1.0',source_system:'SIMS_BLOG_MANAGER',target_system:'SIMS_WRITER',generated_at:sbmDoctorIso_(new Date()),case_id:c['CaseID'],article_id:c['記事ID'],site_id:c['サイトID'],request_mode:'DOCTOR_REFERRAL_TREATMENT',article:{url:c['記事URL'],title:c['記事タイトル'],seo_title:article['SEOタイトル']||'',meta_description:article['メタディスクリプション']||'',main_query:sbmRealMainQuery_(article['メインクエリ'])},doctor_referral:{diagnosis_id:n.diagnosisId||'',diagnosis_status:n.diagnosisStatus||'',diagnosis_codes:[n.primaryCode].filter(Boolean),priority:n.priority||'',treatment_action:n.action||'',treatment_level:n.treatmentLevel||'',allowed_scope:detail.allowed_scope,blocked_scope:detail.blocked_scope,instructions:detail.instructions,candidate_urls:detail.candidate_urls,treatment_tasks:detail.treatment_tasks,internal_link_recommendations:detail.internal_link_recommendations,presentation:detail.presentation,doctor_result:doctor},workflow:{locked:false,treatment_allowed:true},return_contract:{format:'SIMS_WRITER_TREATMENT_RESULT_V1',contract_version:'1.0',return_to:'SIMS_BLOG_MANAGER'}};
  var rec=sbmDoctorFindCaseRow_(c['CaseID']);rec.values[rec.hm['Writer依頼JSON']-1]=JSON.stringify(req);rec.values[rec.hm['状態コード']-1]='WRITER_IN_PROGRESS';rec.values[rec.hm['状態']-1]='Writer治療中';rec.values[rec.hm['更新日時']-1]=sbmNowText_();rec.sheet.getRange(rec.row,1,1,rec.values.length).setValues([rec.values]);sbmDoctorShowCopyDialog_(req,JSON.stringify(req,null,2));return req;
}
function sbmDoctorFindArticleByIdOrUrl_(articleId,url){var rows=sbmRowsAsObjects_(SBM_SHEETS.ARTICLE_DB)||[],nu=sbmNormalizeUrl_(url);for(var i=0;i<rows.length;i++)if((articleId&&String(rows[i]['ArticleID']||'')===String(articleId))||sbmNormalizeUrl_(rows[i]['記事URL']||'')===nu)return rows[i];return null;}

function sbmDoctorPromptWriterResultJson_(){
  var ui=SpreadsheetApp.getUi();
  var message='SIMS Writerが処置を完了した後の回答を、最初から最後までそのまま貼り付けてください。SBMがSIMS_WRITER_TREATMENT_RESULT_V1を自動抽出します。JSON部分だけを貼り付けても登録できます。';
  var res=ui.prompt('Writer処置完了後の結果JSONを登録',message,ui.ButtonSet.OK_CANCEL);
  if(res.getSelectedButton()!==ui.Button.OK)return null;
  var raw=String(res.getResponseText()||'').trim();
  if(!raw)return null;
  var text=sbmDoctorExtractJsonText_(raw),obj;
  try{obj=JSON.parse(text);}catch(e){throw new Error('JSONを読み取れませんでした。Writerの回答全文、または結果JSONをそのまま貼り付けてください。');}
  var f=String(obj&&obj.format||'');
  if(f.indexOf('SIMS_DOCTOR_')===0)throw new Error('これはDoctorの診断JSONです。ここには登録しません。Doctor回答のコピー用依頼文をWriterへ渡してください。');
  return obj;
}
function sbmDoctorTreatmentComponentKey_(component){
  var c=String(component||'').toLowerCase();
  if(c.indexOf('internal_link')>=0)return 'internal_link';
  if(c.indexOf('meta_description')>=0||c==='description')return 'meta_description';
  if(c.indexOf('introduction')>=0||c.indexOf('lead')>=0)return 'introduction';
  if(c.indexOf('title')>=0&&c.indexOf('seo')>=0)return 'seo_title';
  if(c==='article_title'||c==='title')return 'article_title';
  if(c.indexOf('faq')>=0)return 'faq';
  if(c.indexOf('heading')>=0||c.indexOf('h1')>=0)return 'headings';
  if(c.indexOf('body')>=0||c.indexOf('section')>=0)return 'body';
  return 'body';
}
/** Doctorケースの改善履歴IDを正本として改善経路を復元します。Hotfix途中の退化で「通常改善」へ戻った履歴も修復します。 */
function sbmDoctorRouteFromCase_(c){
  c=c||{};
  var destination=String(c['紹介先']||'').toUpperCase();
  var writer=String(c['Writer結果JSON']||'').trim();
  if(destination.indexOf('CREATOR')>=0)return 'Doctor→Creator';
  if(destination.indexOf('MERGE')>=0)return 'Doctor→Merge';
  if(writer||destination.indexOf('WRITER')>=0)return 'Doctor→Writer';
  return '';
}
function sbmDoctorSyncImprovementRoutesFromCases_(){
  var ss=SpreadsheetApp.getActiveSpreadsheet(),hist=ss.getSheetByName(SBM_SHEETS.FEEDBACK_HISTORY);
  if(!hist||hist.getLastRow()<2)return 0;
  var cases=sbmRowsAsObjects_(SBM_SHEETS.DOCTOR_CASES)||[],routeByHistory={},routeByArticle={};
  cases.forEach(function(c){
    var hid=String(c['改善履歴ID']||'').trim(),route=sbmDoctorRouteFromCase_(c),writerResult=String(c['Writer結果JSON']||'').trim();
    if(!route)return;
    if(hid)routeByHistory[hid]=route;
    // 旧RCで改善履歴IDがCaseへ保存されなかったDoctor処置も復元できるよう、
    // Writer結果が実在するケースだけArticleID/URLを補助キーにします。
    if(writerResult){
      var aid=String(c['記事ID']||'').trim(),url=sbmNormalizeUrl_(c['記事URL']||'');
      if(aid)routeByArticle['ID:'+aid]=route;
      if(url)routeByArticle['URL:'+url]=route;
    }
  });
  var hm=sbmHeaderMap_(hist),hidCol=hm['改善履歴ID'],routeCol=hm['改善経路']||hm['改善方法'],aidCol=hm['ArticleID'],urlCol=hm['記事URL'];
  if(!routeCol)return 0;
  var vals=hist.getRange(2,1,hist.getLastRow()-1,hist.getLastColumn()).getValues(),changed=0;
  vals.forEach(function(row){
    var hid=hidCol?String(row[hidCol-1]||'').trim():'',route=hid?routeByHistory[hid]:'';
    if(!route&&aidCol){var aid=String(row[aidCol-1]||'').trim();if(aid)route=routeByArticle['ID:'+aid]||'';}
    if(!route&&urlCol){var url=sbmNormalizeUrl_(row[urlCol-1]||'');if(url)route=routeByArticle['URL:'+url]||'';}
    var current=String(row[routeCol-1]||'').trim();
    if(route&&current!==route){row[routeCol-1]=route;changed++;}
  });
  if(changed)hist.getRange(2,1,vals.length,vals[0].length).setValues(vals);
  return changed;
}

function sbmDoctorTreatmentResultAsFeedback_(o){
  var performed=Array.isArray(o.performed_changes)?o.performed_changes:[], pub=o.publication_result||{};
  var publicChanges=performed.map(function(x){return {
    target:sbmDoctorTreatmentComponentKey_(x.component||x.target),
    before:x.before||'',after:x.after||'',reason:x.reason||'',expected_effect:x.expected_effect||''
  };});
  if(!publicChanges.length&&Array.isArray(pub.public_ok_changes)){
    publicChanges=pub.public_ok_changes.map(function(x){return {
      target:sbmDoctorTreatmentComponentKey_(x.target||x.component),before:x.before||'',after:x.after||'',reason:x.reason||'',expected_effect:x.expected_effect||''
    };});
  }
  var summary=Array.isArray(pub.change_summary)?pub.change_summary.join(' / '):String(pub.change_summary||'Doctor紹介による処置を登録');
  return {
    format:'SIMS_FEEDBACK_V2',contract_version:'4.2',article_id:o.article_id||'',article_url:o.article_url||'',completed_at:o.completed_at||sbmNowText_(),ai_name:'SIMS Writer',improvement_method:'Doctor→Writer',
    summary:summary,publication_result:{change_summary:pub.change_summary||summary,public_ok_changes:publicChanges,user_decision_changes:pub.user_decision_changes||[]},
    recommended_review_days:Number(o.recommended_review_days||28)||28,next_action:'remeasure',warnings:[]
  };
}
function sbmDoctorLatestHistoryIdForArticle_(articleId,url){
  var rows=sbmRowsAsObjects_(SBM_SHEETS.FEEDBACK_HISTORY)||[],norm=sbmNormalizeUrl_(url||''),best='';
  rows.forEach(function(r){if((articleId&&String(r['ArticleID']||'')===String(articleId))||(norm&&sbmNormalizeUrl_(r['記事URL']||'')===norm))best=String(r['改善履歴ID']||best);});return best;
}

/** RC8 Final: Doctor経由の処置完了をSBMの共通モニタリング基盤へ確実に同期します。 */
/**
 * Doctor処置済み記事がGSC非取得・インデックス外などで記事管理から消えていても、
 * 改善履歴/Doctor Caseを正本として記事管理へ復元し、管理対象から落としません。
 */
function sbmDoctorEnsureArticleDbRowForMonitoring_(articleId,url,titleHint){
  var ss=SpreadsheetApp.getActiveSpreadsheet(),sh=sbmGetOrCreateSheet_(SBM_SHEETS.ARTICLE_DB);
  sbmEnsureHeaders_(sh,SBM_HEADERS.ARTICLE_DB);
  var hm=sbmHeaderMap_(sh),norm=sbmNormalizeUrl_(url||''),existingRow=0;
  if(sh.getLastRow()>=2){
    var vals=sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).getValues();
    for(var i=0;i<vals.length;i++){
      var sameId=articleId&&hm['ArticleID']&&String(vals[i][hm['ArticleID']-1]||'')===String(articleId);
      var sameUrl=norm&&hm['記事URL']&&sbmNormalizeUrl_(vals[i][hm['記事URL']-1]||'')===norm;
      if(sameId||sameUrl){existingRow=i+2;break;}
    }
  }
  if(existingRow)return existingRow;

  var historyRows=sbmRowsAsObjects_(SBM_SHEETS.FEEDBACK_HISTORY)||[],history={};
  for(var h=historyRows.length-1;h>=0;h--){
    var r=historyRows[h],sameHid=articleId&&String(r['ArticleID']||'')===String(articleId),sameHurl=norm&&sbmNormalizeUrl_(r['記事URL']||'')===norm;
    if(sameHid||sameHurl){history=r;break;}
  }
  var caseRows=sbmRowsAsObjects_(SBM_SHEETS.DOCTOR_CASES)||[],doctorCase={};
  for(var c=caseRows.length-1;c>=0;c--){
    var cr=caseRows[c],sameCid=articleId&&String(cr['記事ID']||'')===String(articleId),sameCurl=norm&&sbmNormalizeUrl_(cr['記事URL']||'')===norm;
    if(sameCid||sameCurl){doctorCase=cr;break;}
  }
  var title=String(titleHint||history['記事タイトル']||doctorCase['記事タイトル']||'').trim();
  var query=String(history['メインクエリ']||'').trim();
  var obj={};SBM_HEADERS.ARTICLE_DB.forEach(function(k){obj[k]='';});
  obj['選択']=false;
  obj['記事ランク']='—'; // GSC非取得中は推測でランクを作らない。再取得時に通常ロジックで更新します。
  obj['作業状態']='👀 モニター中';
  obj['記事URL']=url||history['記事URL']||doctorCase['記事URL']||'';
  obj['メインクエリ']=query;
  obj['H1タイトル']=title||'タイトル取得待ち';
  obj['クリック数']=0;obj['表示回数']=0;obj['CTR']=0;obj['掲載順位']=0;
  obj['データ更新日']=new Date();
  obj['記事タイトル']=title||'タイトル取得待ち';
  obj['詳細']='記事詳細';
  obj['備考']='Doctor処置済み。GSC非取得でも記事管理を継続します。';
  obj['ArticleID']=articleId||history['ArticleID']||doctorCase['記事ID']||'';
  obj['記事ステータス']='検索露出なし';
  obj['管理フラグ']='管理中';
  var row=SBM_HEADERS.ARTICLE_DB.map(function(k){return obj[k]!==undefined?obj[k]:'';});
  sh.appendRow(row);
  var newRow=sh.getLastRow();
  try{sbmStyleArticleDbSheet_(sh);}catch(eStyle){}
  try{sbmLog_('DoctorArticleDbRestore','Done','ArticleID='+String(obj['ArticleID']||'')+', URL='+String(obj['記事URL']||''));}catch(eLog){}
  return newRow;
}

function sbmDoctorEnsureMonitoringSync_(articleId,url){
  var ss=SpreadsheetApp.getActiveSpreadsheet();
  try{sbmDoctorEnsureArticleDbRowForMonitoring_(articleId,url,'');}catch(eRestore){sbmLog_('DoctorArticleDbRestore','Warning',String(eRestore));}
  var sh=ss.getSheetByName(SBM_SHEETS.ARTICLE_DB),updated=false;
  if(sh&&sh.getLastRow()>=2){
    var hm=sbmHeaderMap_(sh),idCol=hm['ArticleID'],urlCol=hm['記事URL'],workCol=hm['作業状態'];
    if(workCol&&(idCol||urlCol)){
      var vals=sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).getValues(),norm=sbmNormalizeUrl_(url||'');
      for(var i=0;i<vals.length;i++){
        var match=(articleId&&idCol&&String(vals[i][idCol-1]||'')===String(articleId))||(norm&&urlCol&&sbmNormalizeUrl_(vals[i][urlCol-1]||'')===norm);
        if(match){sh.getRange(i+2,workCol).setValue('👀 モニター中');updated=true;break;}
      }
    }
    if(updated){try{sbmStyleArticleDbSheet_(sh);}catch(eStyleArticle){}}
  }
  // 改善履歴を正本として改善の推移を即時再生成。日次処理を待たせません。
  try{sbmDoctorSyncImprovementRoutesFromCases_();}catch(eRoute){}
  try{sbmUpdateEffectivenessCore_(false);}catch(eEffect){sbmLog_('DoctorMonitoringSync','Warning','改善の推移更新: '+String(eEffect));}
  try{sbmRefreshHome_();}catch(eHome){}
  return updated;
}


/**
 * RC8 Official blocker repair:
 * 過去RCでWriter結果までは保存されたのに、改善履歴・モニター同期が途中で止まったCaseを自己修復します。
 * Writer結果JSONがCOMPLETEDであることを確認できるCaseだけを対象にするため、未処置記事を誤って完了扱いしません。
 */
function sbmDoctorReconcileCompletedTreatments_(){
  var ss=SpreadsheetApp.getActiveSpreadsheet(),caseSh=ss.getSheetByName(SBM_SHEETS.DOCTOR_CASES);
  if(!caseSh||caseSh.getLastRow()<2)return 0;
  var hm=sbmHeaderMap_(caseSh),vals=caseSh.getRange(2,1,caseSh.getLastRow()-1,caseSh.getLastColumn()).getValues(),repaired=0;
  for(var i=0;i<vals.length;i++){
    var row=vals[i],raw=hm['Writer結果JSON']?String(row[hm['Writer結果JSON']-1]||'').trim():'',o=null;
    if(!raw)continue;
    try{o=JSON.parse(raw);}catch(eParse){continue;}
    if(String(o.treatment_status||'').toUpperCase()!=='COMPLETED')continue;
    var articleId=String(o.article_id|| (hm['記事ID']?row[hm['記事ID']-1]:'') ||'').trim();
    var articleUrl=String(o.article_url|| (hm['記事URL']?row[hm['記事URL']-1]:'') ||'').trim();
    var hid=hm['改善履歴ID']?String(row[hm['改善履歴ID']-1]||'').trim():'';
    if(!hid)hid=sbmDoctorLatestHistoryIdForArticle_(articleId,articleUrl);
    if(!hid){
      // 履歴自体が無い旧Caseだけ、保存済みWriter結果から一度だけ再登録します。
      try{
        var feedback=sbmDoctorTreatmentResultAsFeedback_(o),normalized=sbmNormalizeImprovementFeedback_(JSON.stringify(feedback)),registered=sbmRegisterImprovementFeedback(normalized);
        if(registered&&registered.ok!==false)hid=sbmDoctorLatestHistoryIdForArticle_(articleId,articleUrl);
      }catch(eRegister){sbmLog_('DoctorReconcileRegister','Warning',String(eRegister));}
    }
    if(hid&&hm['改善履歴ID'])row[hm['改善履歴ID']-1]=hid;
    if(hm['状態コード'])row[hm['状態コード']-1]='MONITORING';
    if(hm['状態'])row[hm['状態']-1]='モニター中';
    if(hm['更新日時'])row[hm['更新日時']-1]=sbmNowText_();
    vals[i]=row;
    if(hid||sbmDoctorLatestHistoryIdForArticle_(articleId,articleUrl)){
      sbmDoctorEnsureMonitoringSync_(articleId,articleUrl);
      try{sbmDoctorRemoveCandidateArticle_(articleId,articleUrl);}catch(eRemove){}
      repaired++;
    }
  }
  if(repaired)caseSh.getRange(2,1,vals.length,vals[0].length).setValues(vals);

  // 旧RCでCase側のWriter結果JSONや改善履歴IDが欠落していても、改善履歴にDoctor経路が残っていれば
  // その履歴を正本として記事管理をモニター中へ復元します。
  try{
    var historyRows=sbmRowsAsObjects_(SBM_SHEETS.FEEDBACK_HISTORY)||[];
    historyRows.forEach(function(h){
      var route=String(h['改善経路']||h['改善方法']||'').trim();
      if(route.indexOf('Doctor→')!==0)return;
      var aid=String(h['ArticleID']||'').trim(),u=String(h['記事URL']||'').trim();
      if(sbmDoctorEnsureMonitoringSync_(aid,u))repaired++;
      try{sbmDoctorRemoveCandidateArticle_(aid,u);}catch(eRemoveHistory){}
    });
  }catch(eHistoryRepair){sbmLog_('DoctorHistoryMonitoringRepair','Warning',String(eHistoryRepair));}

  try{sbmDoctorSyncImprovementRoutesFromCases_();}catch(eRoute2){}
  try{sbmUpdateEffectivenessCore_(false);}catch(eEffect2){}
  return repaired;
}

function sbmDoctorStoreWriterTreatmentResult_(o){
  var format=String(o&&o.format||'');
  if(format.indexOf('SIMS_DOCTOR_')===0)throw new Error('これはDoctorの診断JSONです。Writer結果登録には使いません。精密診断ダイアログでDoctor診断結果を登録し、そこで自動生成されたWriter紹介状をWriterへ渡してください。');
  if(format!=='SIMS_WRITER_TREATMENT_RESULT_V1')throw new Error('Writer処置結果ではありません。必要なformatは SIMS_WRITER_TREATMENT_RESULT_V1 です。現在のformat：'+(format||'未記載'));
  var rec=sbmDoctorFindCaseRow_(o.case_id);if(!rec)throw new Error('対応するCaseIDがありません。');
  if(String(rec.values[rec.hm['記事ID']-1])!==String(o.article_id||''))throw new Error('ArticleIDがCaseと一致しません。');
  var status=String(o.treatment_status||''),compliance=o.referral_compliance||{},existing=String(rec.values[rec.hm['Writer結果JSON']-1]||'');
  if(existing&&existing===JSON.stringify(o)&&String(rec.values[rec.hm['状態コード']-1])==='MONITORING')return {caseId:String(o.case_id||''),status:'モニター中',alreadyRegistered:true};

  rec.values[rec.hm['Writer結果JSON']-1]=JSON.stringify(o);
  if(compliance.compliant===false||(compliance.scope_violations||[]).length){
    rec.values[rec.hm['状態コード']-1]='USER_DECISION_REQUIRED';rec.values[rec.hm['状態']-1]='利用者判断待ち';
  }else if(status==='COMPLETED'){
    // Doctor紹介で完了した処置も通常改善と同じ履歴・モニタリング基盤へ接続します。記事ランクは変更しません。
    // GSC非取得で記事管理行が消えていても、結果登録前に管理行を復元します。
    try{sbmDoctorEnsureArticleDbRowForMonitoring_(o.article_id,o.article_url||rec.values[rec.hm['記事URL']-1],rec.hm['記事タイトル']?rec.values[rec.hm['記事タイトル']-1]:'');}catch(eRestoreBeforeRegister){sbmLog_('DoctorArticleDbRestoreBeforeRegister','Warning',String(eRestoreBeforeRegister));}
    var feedback=sbmDoctorTreatmentResultAsFeedback_(o), normalized=sbmNormalizeImprovementFeedback_(JSON.stringify(feedback));
    var registered=sbmRegisterImprovementFeedback(normalized);if(!registered||registered.ok===false)throw new Error('処置結果は受け取りましたが、モニタリング登録に失敗しました：'+(registered&&registered.message?registered.message:'不明なエラー'));
    sbmDoctorEnsureMonitoringSync_(o.article_id,o.article_url||rec.values[rec.hm['記事URL']-1]);
    rec.values[rec.hm['状態コード']-1]='MONITORING';rec.values[rec.hm['状態']-1]='モニター中';
    if(rec.hm['改善履歴ID'])rec.values[rec.hm['改善履歴ID']-1]=sbmDoctorLatestHistoryIdForArticle_(o.article_id,o.article_url||rec.values[rec.hm['記事URL']-1]);
    if(rec.hm['再診予定日'])rec.values[rec.hm['再診予定日']-1]=sbmDateAfterDaysText_(Number(o.recommended_review_days||28)||28);
  }else if(status==='USER_DECISION_REQUIRED'||status==='PARTIAL'){
    rec.values[rec.hm['状態コード']-1]='USER_DECISION_REQUIRED';rec.values[rec.hm['状態']-1]='利用者判断待ち';
  }else{
    rec.values[rec.hm['状態コード']-1]='TREATMENT_FAILED';rec.values[rec.hm['状態']-1]='治療結果受付失敗';
  }
  rec.values[rec.hm['更新日時']-1]=sbmNowText_();rec.sheet.getRange(rec.row,1,1,rec.values.length).setValues([rec.values]);
  if(String(rec.values[rec.hm['状態コード']-1]||'')==='MONITORING'){
    try{sbmDoctorRemoveCandidateArticle_(o.article_id,o.article_url||rec.values[rec.hm['記事URL']-1]);}catch(eRemoveDone){}
    // Caseへ改善履歴IDを書いた後に再同期し、改善の推移へDoctor経路を確実に反映します。
    try{sbmDoctorSyncImprovementRoutesFromCases_();sbmUpdateEffectivenessCore_(false);}catch(eFinalEffect){sbmLog_('DoctorFinalMonitoringSync','Warning',String(eFinalEffect));}
  }
  return {caseId:String(o.case_id||''),status:String(rec.values[rec.hm['状態']-1]||'')};
}
function sbmDoctorRegisterWriterTreatmentResultFromDialog(raw){
  try{
    var text=sbmDoctorExtractJsonText_(String(raw||'').trim()),o;
    if(!text)throw new Error('Writerの処置結果JSONを貼り付けてください。');
    try{o=JSON.parse(text);}catch(e){throw new Error('JSONを読み取れませんでした。Writer回答の最後にある結果JSONだけを貼り付けてください。');}
    var saved=sbmDoctorStoreWriterTreatmentResult_(o);
    return {ok:true,message:'Writer処置結果を登録しました。\nCaseID：'+saved.caseId+'\n状態：'+saved.status};
  }catch(e2){return {ok:false,message:String(e2&&e2.message?e2.message:e2)};}
}
function sbmDoctorRegisterWriterTreatmentResult(){
  try{var o=sbmDoctorPromptWriterResultJson_();if(!o)return;var saved=sbmDoctorStoreWriterTreatmentResult_(o);sbmAlert_('Writer治療結果を登録しました','CaseID：'+saved.caseId+'\n状態：'+saved.status);}catch(e){sbmAlert_('Writer治療結果を登録できません',String(e.message||e));}
}


/* ========================================================================== *
 * Product 5.9.0 RC1: SIMS Editorial Platform control-plane foundation
 * Shared Editorial Knowledge 3.4.0 / Platform Contract major 1
 * ========================================================================== */

const SBM_PLATFORM_VERSION = '1.0.0-RC1';
const SBM_SHARED_VERSION = '3.5.0';
const SBM_PLATFORM_CONTRACT_MAJOR = 1;

function sbmPlatformEnsureSheets_() {
  var definitions = [
    ['PLATFORM_CASES', SBM_SHEETS.PLATFORM_CASES],
    ['PLATFORM_TREATMENTS', SBM_SHEETS.PLATFORM_TREATMENTS],
    ['PLATFORM_EVENTS', SBM_SHEETS.PLATFORM_EVENTS],
    ['PLATFORM_ERRORS', SBM_SHEETS.PLATFORM_ERRORS]
  ];
  definitions.forEach(function(pair) {
    var sh = sbmGetOrCreateSheet_(pair[1]);
    sbmEnsureHeaders_(sh, SBM_HEADERS[pair[0]]);
    sbmStyleDataSheet_(sh);
    try { sh.hideSheet(); } catch (e) {}
  });
  sbmSetSetting_('PlatformVersion', SBM_PLATFORM_VERSION, 'SIMS Editorial Platform互換バージョン');
  sbmSetSetting_('SharedVersion', SBM_SHARED_VERSION, 'SIMS Shared Editorial Knowledge参照バージョン');
  sbmSetSetting_('PlatformContractMajor', String(SBM_PLATFORM_CONTRACT_MAJOR), 'Platform ContractのMajor Version');
}

function sbmPlatformShowStatus() {
  try { sbmPlatformEnsureSheets_(); } catch (e) {}
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var names = [SBM_SHEETS.PLATFORM_CASES, SBM_SHEETS.PLATFORM_TREATMENTS, SBM_SHEETS.PLATFORM_EVENTS, SBM_SHEETS.PLATFORM_ERRORS];
  var counts = {};
  names.forEach(function(name) {
    var sh = ss.getSheetByName(name);
    counts[name] = sh ? Math.max(0, sh.getLastRow() - 1) : 0;
  });
  var message = [
    'SIMS Editorial Platform ' + SBM_PLATFORM_VERSION,
    'SBM: ' + SBM_VERSION,
    'Shared: ' + SBM_SHARED_VERSION,
    'Contract Major: ' + SBM_PLATFORM_CONTRACT_MAJOR,
    '',
    'Cases: ' + counts[SBM_SHEETS.PLATFORM_CASES],
    'Treatments: ' + counts[SBM_SHEETS.PLATFORM_TREATMENTS],
    'Events: ' + counts[SBM_SHEETS.PLATFORM_EVENTS],
    'Errors: ' + counts[SBM_SHEETS.PLATFORM_ERRORS],
    '',
    '既存の日次改善・Doctor・Writer連携は従来どおり利用できます。'
  ].join('\n');
  SpreadsheetApp.getUi().alert('Editorial Platformの状態', message, SpreadsheetApp.getUi().ButtonSet.OK);
}

function sbmPlatformAppendEvent_(event) {
  event = event || {};
  var sh = sbmGetOrCreateSheet_(SBM_SHEETS.PLATFORM_EVENTS);
  sbmEnsureHeaders_(sh, SBM_HEADERS.PLATFORM_EVENTS);
  var now = new Date();
  var eventId = String(event.event_id || ('EVT-' + Utilities.formatDate(now, 'Asia/Tokyo', 'yyyyMMdd-HHmmss') + '-' + Utilities.getUuid().slice(0, 8)));
  sh.appendRow([
    eventId,
    String(event.case_id || ''),
    String(event.event_type || ''),
    String(event.previous_status || ''),
    String(event.new_status || ''),
    String(event.actor || 'SBM'),
    String(event.source_message_id || ''),
    event.occurred_at ? new Date(event.occurred_at) : now,
    JSON.stringify(event.details || {})
  ]);
  return eventId;
}

function sbmPlatformNormalizeLegacyWriterResult_(input) {
  var obj = typeof input === 'string' ? JSON.parse(input) : input;
  if (!obj || typeof obj !== 'object') throw new Error('Writer結果JSONを解析できません。');
  if (obj.envelope && obj.payload && obj.envelope.contract_name === 'SIMS_WRITER_TREATMENT_RESULT_V1') return obj;
  var publication = obj.publication_result || {};
  var publicOk = publication.public_ok_changes || [];
  var userDecision = publication.user_decision_changes || [];
  if (!publicOk.length && Array.isArray(obj.changes)) publicOk = obj.changes;
  return {
    envelope: {
      platform: 'SIMS_EDITORIAL_PLATFORM',
      platform_version: SBM_PLATFORM_VERSION,
      contract_name: 'SIMS_WRITER_TREATMENT_RESULT_V1',
      contract_version: '1.0',
      message_type: 'RESULT',
      message_id: String(obj.message_id || ('LEGACY-' + Utilities.getUuid())),
      correlation_id: String(obj.case_id || ''),
      created_at: String(obj.completed_at || new Date().toISOString()),
      source_product: {product_code: 'WRITER', product_version: String(obj.writer_version || obj.version || '')},
      target_product: {product_code: 'SBM'},
      shared_version: String(obj.shared_version || SBM_SHARED_VERSION),
      legacy_contract: {format: String(obj.format || 'SIMS_FEEDBACK_V2'), contract_version: String(obj.contract_version || '')}
    },
    payload: {
      case_id: String(obj.case_id || ''),
      treatment_request_id: String(obj.treatment_request_id || ''),
      treatment_result_id: String(obj.treatment_result_id || ''),
      result_status: 'SUCCESS',
      summary: String(obj.summary || publication.change_summary || ''),
      public_ok_changes: publicOk,
      user_decision_changes: userDecision,
      preservation_report: obj.preservation_report || {},
      publication_result: publication,
      legacy_source: obj
    }
  };
}
