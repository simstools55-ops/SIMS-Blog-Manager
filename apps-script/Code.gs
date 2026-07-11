/**
 * SIMS-Blog-Manager Product 5.0 RC8.1
 * SIMS-Core Slim Edition for blog SEO improvement management.
 * End-user distribution file: paste this entire file into Code.gs/Code.js.
 */

const SBM_VERSION = '5.0.0-operation-refactoring-stage2-ui-fix';
const SBM_SHEETS = Object.freeze({
  HOME: 'Home',
  TODAY: '今日の改善',
  LOG: '改善ログ',
  SETUP: 'セットアップ',
  QUERY_DATA: 'データ一覧',
  ARTICLE_DB: '記事DB',
  RAW_DATA: 'SearchConsole_Data',
  DIAGNOSIS: 'ブログ診断',
  EFFECT: '効果測定',
  SETTINGS: 'Settings',
  USER_SETTINGS: '設定',
  SYSTEM_LOG: 'System_Log',
  BRIEF: '改善ブリーフ',
  MEASURE_HISTORY: '測定履歴',
  PROCESS_LOG: '処理ログ',
  PROFILE_LOG: '処理プロファイル',
  IN_PROGRESS: '改善中'
});

const SBM_HEADERS = Object.freeze({
  SETTINGS: ['Key', 'Value', 'Description', 'UpdatedAt'],
  USER_SETTINGS: ['設定項目','値','説明'],
  SYSTEM_LOG: ['CreatedAt', 'Action', 'Status', 'Detail'],
  QUERY_DATA: ['記事ステータス','記事タイトル','メインクエリ','クリック数','表示回数','CTR','平均順位','詳細','最終取得日時','記事URL','SEOタイトル（titleタグ）','メタディスクリプション'],
  ARTICLE_DB: ['記事ランク','作業状態','記事URL','メインクエリ','クリック数','表示回数','CTR','掲載順位','記事タイトル','詳細','SEOタイトル','メタディスクリプション','最終取得日時','元URL件数','除外理由','備考','ArticleID','記事情報補完済み','補完日時','補完エラー','記事ステータス','最終確認日','連続未取得日数','管理フラグ'],
  RAW_DATA: ['StartDate','EndDate','Query','URL','Clicks','Impressions','CTR','Position','CapturedAt'],
  DIAGNOSIS: ['URL','Title','MainQuery','SubQueries','FAQQueries','SeparateArticleQueries','NoiseQueries','QuerySummary','Clicks','Impressions','CTR','Position','DiagnosisCode','Diagnosis','Recommendation','EstimatedMinutes','OpportunityScore','Reason','AnalyzedAt'],
  TODAY: ['優先','時間','記事タイトル','メインクエリ','改善内容','記事を開く','詳細','完了','Title','H1','Description','冒頭文','H2/H3','FAQ','内部リンク','本文追記','その他','メモ','Score','URL','状態','完了日'],
  LOG: ['改善日','記事タイトル','URL','メインクエリ','改善内容','修正内容','所要時間','メモ','初回測定日','7日測定完了日','状態','改善前CTR','改善前順位','改善前クリック','改善前表示回数'],
  EFFECT: ['記事タイトル','改善日','改善内容','判定','SIMS評価','次のアクション','詳細','URL','修正内容','経過日数','改善前順位','現在順位','順位変化','改善前CTR','現在CTR','CTR変化','改善前クリック','現在クリック','クリック変化','次の確認','コメント'],
  BRIEF: ['BriefId','URL','記事タイトル','メインクエリ','サブクエリ','FAQ候補','別記事候補','除外クエリ','クエリ分析','診断','推奨改善','理由','推定時間','Score','CTR','Position','Clicks','Impressions','改善依頼文','作成日時'],
  MEASURE_HISTORY: ['記事タイトル','改善日','記録日','経過日数','現在順位','現在CTR','現在クリック','現在表示回数','判定メモ','URL'],
  PROCESS_LOG: ['日時','処理','状態','対象件数','処理件数','所要秒','詳細'],
  PROFILE_LOG: ['日時','RunId','処理','工程','開始','終了','所要秒','対象件数','処理件数','詳細'],
  IN_PROGRESS: ['改善日','記事タイトル','経過日数','状態','SIMS評価','次のアクション','詳細','URL','修正内容','改善内容']
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
  MEASURE_DAYS: '14,30',
  TEST_DAILY_DAYS: 7,
  MEASUREMENT_MODE: 'TEST_DAILY_7D',
  ANALYSIS_CANDIDATE_LIMIT: 50,
  ANALYSIS_ARTICLE_LIMIT: 120,
  TITLE_FETCH_DEFAULT: 'ON',
  META_FETCH_MAX_ROWS: 50,
  ARTICLE_DB_BUILD_BATCH: 100,
  ARTICLE_INFO_BATCH: 50,
  TODAY_INITIAL_DISPLAY: 2,
  TODAY_MAX_DISPLAY: 6,
  TIMEZONE: 'Asia/Tokyo'
});

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('SIMS-Blog-Manager')
    .addItem('ホームを開く', 'sbmOpenHome')
    .addSeparator()
    .addSubMenu(ui.createMenu('セットアップ')
      .addItem('STEP1 ブログ情報を登録', 'sbmSetupStep1BlogInfo')
      .addItem('STEP2 Google Cloud APIガイドを開く', 'sbmSetupStep2ApiGuide')
      .addItem('STEP3 Search Console接続テスト', 'sbmSetupStep3ConnectionTest')
      .addSeparator()
      .addItem('STEP4 記事DBを一括作成（初回）', 'sbmSetupArticleDbContinueManual')
      .addItem('STEP5 記事情報補完を進める', 'sbmSetupArticleInfoContinueManual')
      .addItem('セットアップ進捗を確認', 'sbmShowArticleDbSetupStatus')
      .addItem('セットアップシートを開く', 'sbmOpenSetup'))
    .addSeparator()
    .addSubMenu(ui.createMenu('データ更新')
      .addItem('記事DBを更新（日次）', 'sbmCollectPageDataToArticleDbManual')
      .addItem('記事ランクを再判定', 'sbmUpdateArticleRankManual')
      .addItem('記事DBのタイトル情報を補完', 'sbmSupplementArticleDbMetaManual')
      .addSeparator()
      .addItem('処理ログを開く', 'sbmOpenProcessLog')
      .addItem('処理プロファイルを開く（開発用）', 'sbmOpenProfileLog'))
    .addSubMenu(ui.createMenu('記事DB')
      .addItem('記事DBを開く', 'sbmOpenArticleDb')
      .addItem('選択記事の詳細を開く', 'sbmOpenSelectedArticleDbDetail'))
    .addSubMenu(ui.createMenu('改善機能')
      .addItem('記事DB直結版の準備状況', 'sbmShowImprovementRefactorStatus_')
      .addItem('改善中を開く', 'sbmOpenInProgress'))
    .addItem('処理ログを開く', 'sbmOpenProcessLog')
    .addSeparator()
    .addSubMenu(ui.createMenu('管理')
      .addItem('設定を開く', 'sbmOpenUserSettings')
      .addItem('シートを作成・修復', 'sbmInitializeSheets')
      .addItem('システムシートを非表示', 'sbmHideSystemSheets')
      .addItem('エラー・ログを開く', 'sbmOpenSystemLog'))
    .addToUi();
  try { sbmMaybePromptDailyUpdate_(); } catch (e) { console.error(e); }
}

function sbmShowImprovementRefactorStatus_() {
  sbmAlert_('改善機能の再構築状況', '旧「今日の改善」「改善ブリーフ」「ブログ診断」は停止・削除しました。\n現在は記事DBだけを唯一の参照元として、今日の改善と改善ブリーフを再構築する準備段階です。\n別ブログの旧データやサンプル情報は表示しません。');
}

function sbmMaybePromptDailyUpdate_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss.getSheetByName(SBM_SHEETS.ARTICLE_DB)) return;
  if (!sbmIsSetupComplete_() || String(sbmGetSetting_('ConnectionStatus','')) !== 'OK') return;
  var key = 'SBM_DAILY_PROMPT_' + sbmDateText_(new Date());
  var props = PropertiesService.getUserProperties();
  if (props.getProperty(key)) return;
  var html = '<!DOCTYPE html><html><head><base target="_top"><style>body{font-family:Arial,"Noto Sans JP",sans-serif;padding:22px;color:#202124}h2{color:#0b8043;margin-top:0}.buttons{display:flex;gap:10px;justify-content:flex-end;margin-top:20px}button{border:0;border-radius:6px;padding:10px 16px;font-weight:700;cursor:pointer}.run{background:#0b8043;color:#fff}.skip{background:#f1f3f4;color:#3c4043}.msg{margin-top:12px;color:#5f6368}</style></head><body><h2>本日の日次更新を実行しますか？</h2><p>Search Consoleの最新データを取得し、記事DBの数値・記事ランク・Homeを更新します。</p><div class="buttons"><button class="skip" onclick="skipRun()">今日は実行しない</button><button class="run" onclick="runDaily()">日次更新を実行</button></div><div id="msg" class="msg"></div><script>function lock(t){document.querySelectorAll("button").forEach(function(b){b.disabled=true});document.getElementById("msg").textContent=t}function skipRun(){lock("本日は実行しません。");google.script.run.withSuccessHandler(function(){google.script.host.close()}).sbmSkipDailyUpdateToday()}function runDaily(){lock("日次更新を開始しています。Homeの処理状況欄で進行を確認できます。");google.script.run.withFailureHandler(function(e){document.getElementById("msg").textContent=(e&&e.message)?e.message:String(e)}).withSuccessHandler(function(){google.script.host.close()}).sbmRunDailyUpdateFromStartup()}</script></body></html>';
  SpreadsheetApp.getUi().showModalDialog(HtmlService.createHtmlOutput(html).setWidth(520).setHeight(280), '本日の日次更新');
}

function sbmSkipDailyUpdateToday() {
  PropertiesService.getUserProperties().setProperty('SBM_DAILY_PROMPT_' + sbmDateText_(new Date()), 'SKIPPED');
}

function sbmRunDailyUpdateFromStartup() {
  PropertiesService.getUserProperties().setProperty('SBM_DAILY_PROMPT_' + sbmDateText_(new Date()), 'RUN');
  return sbmCollectPageDataToArticleDbManual(true);
}

function sbmShowNewArticleInfoPrompt_(count) {
  count = Number(count || 0);
  if (!count) return;
  var html = '<!DOCTYPE html><html><head><base target="_top"><style>body{font-family:Arial,"Noto Sans JP",sans-serif;padding:22px;color:#202124}h2{color:#0b8043;margin-top:0}.buttons{display:flex;gap:10px;justify-content:flex-end;margin-top:20px}button{border:0;border-radius:6px;padding:10px 16px;font-weight:700;cursor:pointer}.run{background:#1a73e8;color:#fff}.later{background:#f1f3f4;color:#3c4043}</style></head><body><h2>新規記事が ' + count + '件見つかりました</h2><p>記事タイトル・SEOタイトル・メタディスクリプション・メインクエリを取得しますか？</p><div class="buttons"><button class="later" onclick="google.script.host.close()">あとで</button><button class="run" onclick="runNow()">記事情報を取得</button></div><script>function runNow(){document.querySelectorAll("button").forEach(function(b){b.disabled=true});google.script.run.withFailureHandler(function(e){alert((e&&e.message)?e.message:String(e))}).withSuccessHandler(function(){google.script.host.close()}).sbmSupplementNewArticlesManual()}</script></body></html>';
  SpreadsheetApp.getUi().showModalDialog(HtmlService.createHtmlOutput(html).setWidth(520).setHeight(250), '新規記事の記事情報取得');
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

function sbmInitializeSheets(showAlert) {
  showAlert = showAlert !== false;
  // 旧シートを先に削除し、修復中に一瞬表示される現象を防ぎます。
  sbmRemoveRetiredSheets_();
  sbmEnsureDataSheets_();
  sbmMigrateRc3Headers_();
  sbmEnsureDefaultSettings_();
  sbmEnsureUserSheets_();
  sbmApplySheetUx_();
  sbmRemoveRetiredSheets_();
  sbmApplyProductVisibleTabs_();
  sbmRefreshHome_();
  sbmLog_('InitializeSheets','Done','Product 5.0 operation refactoring stage 1 initialized');
  if (showAlert) sbmAlert_('初期化完了', '現行シートの作成・修復が完了しました。旧改善シートは作成していません。記事DBとHomeを確認してください。');
}

function sbmEnsureDataSheets_() {
  // Product 5.0 Official: 現行運用に必要なシートだけを作成・修復します。
  sbmMigrateVisibleSheetNames_();
  sbmMigrateArticleDbRankWorkState_();
  var dataMap = {
    SETTINGS: SBM_SHEETS.SETTINGS,
    SYSTEM_LOG: SBM_SHEETS.SYSTEM_LOG,
    ARTICLE_DB: SBM_SHEETS.ARTICLE_DB,
    LOG: SBM_SHEETS.LOG,
    PROCESS_LOG: SBM_SHEETS.PROCESS_LOG,
    IN_PROGRESS: SBM_SHEETS.IN_PROGRESS
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
  [SBM_SHEETS.HOME, SBM_SHEETS.ARTICLE_DB, SBM_SHEETS.IN_PROGRESS, SBM_SHEETS.PROCESS_LOG, SBM_SHEETS.PROFILE_LOG, SBM_SHEETS.SETUP, SBM_SHEETS.LOG, SBM_SHEETS.SETTINGS, SBM_SHEETS.USER_SETTINGS, SBM_SHEETS.SYSTEM_LOG].forEach(function(n){ keep[n] = true; });
  var retired = ['上位ページ診断','カニバリ診断','記事ネタ候補','記事カルテ','ホーム','クエリデータ','記事診断','データ一覧','SearchConsole_Data','今日の改善','改善ブリーフ','ブログ診断'];
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
  sbmSetSettingIfEmpty_('LastFetchDate', '', '最終取得日');
  sbmSetSettingIfEmpty_('AnalysisCandidateLimit', SBM_DEFAULTS.ANALYSIS_CANDIDATE_LIMIT, '分析後に保存する改善候補数。Product 5.0では50件で打ち切り');
  if ((sbmNumber_(sbmGetSetting_('AnalysisCandidateLimit','0')) || 0) < 50) sbmSetSetting_('AnalysisCandidateLimit', 50, 'Product 5.0: STEP Bは改善候補50件で打ち切り');
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
  // 旧「今日の改善」「改善ブリーフ」「ブログ診断」は再構築完了まで生成しません。
  sbmBuildHomeSheet_();
  sbmBuildUserSettingsSheet_();
  sbmBuildSetupSheet_();
  sbmBuildInProgressSheet_();
  sbmStyleProcessLogSheet_(sbmGetOrCreateSheet_(SBM_SHEETS.PROCESS_LOG));
  sbmApplyProductVisibleTabs_();
}

function sbmApplyProductVisibleTabs_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var visible = {};
  [SBM_SHEETS.HOME, SBM_SHEETS.USER_SETTINGS, SBM_SHEETS.ARTICLE_DB, SBM_SHEETS.IN_PROGRESS, SBM_SHEETS.PROCESS_LOG].forEach(function(n){ visible[n] = true; });
  ss.getSheets().forEach(function(sh){
    try { if (visible[sh.getName()]) sh.showSheet(); else sh.hideSheet(); } catch(e) {}
  });
  var home = ss.getSheetByName(SBM_SHEETS.HOME);
  if (home) ss.setActiveSheet(home);
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
  var todayMax = validInt_(previous['今日の改善最大表示件数'], 2, 20,
    validInt_(sbmGetSetting_('TodayMaxDisplayCount', SBM_DEFAULTS.TODAY_MAX_DISPLAY), 2, 20, SBM_DEFAULTS.TODAY_MAX_DISPLAY));
  if (todayMax < todayInitial) todayMax = Math.max(todayInitial, SBM_DEFAULTS.TODAY_MAX_DISPLAY);
  var candidateLimit = validInt_(previous['改善候補抽出件数'], 10, 200,
    validInt_(sbmGetSetting_('AnalysisCandidateLimit', SBM_DEFAULTS.ANALYSIS_CANDIDATE_LIMIT), 10, 200, SBM_DEFAULTS.ANALYSIS_CANDIDATE_LIMIT));
  var searchDays = validInt_(previous['Search Console取得期間（日）'], 7, 365,
    validInt_(sbmGetSetting_('SearchDays', SBM_DEFAULTS.SEARCH_DAYS), 7, 365, SBM_DEFAULTS.SEARCH_DAYS));

  sh.clear();
  sh.getRange(1,1,6,3).setValues([
    SBM_HEADERS.USER_SETTINGS,
    ['記事情報補完件数', articleBatch, '初回セットアップで1回に補完する記事数。30～100の整数（推奨50件）'],
    ['今日の改善初期表示件数', todayInitial, '今日の改善を開いたときに最初に表示する件数。1～6の整数（推奨2件）'],
    ['今日の改善最大表示件数', todayMax, '「次のおすすめ」で追加表示できる上限。2～20の整数（推奨6件）'],
    ['改善候補抽出件数', candidateLimit, '記事DBから保持する改善候補数。10～200の整数（推奨50件）'],
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
  return Math.max(initial, Math.min(20, Math.floor(n)));
}
function sbmBuildHomeSheet_() {
  var sh = sbmGetOrCreateSheet_(SBM_SHEETS.HOME);
  sh.clear();
  var values = [
    ['SIMS-Blog-Manager','Product 5.0 Official','',''],
    ['ブログ名','','ブログURL',''],
    ['総記事数','','最終日次更新',''],
    ['ブログ全体の状況','','改善作業の状況',''],
    ['🏆 エース','','未着手',''],
    ['✅ 安定','','🔥 今日の改善',''],
    ['📈 成長','','✏️ 改善中',''],
    ['🌱 育成','','👀 モニター中',''],
    ['⚠️ 低迷','','✔️ 完了',''],
    ['管理のお知らせ','','',''],
    ['🆕 新規記事','','📄 記事情報未取得',''],
    ['⚠️ 30日以上データ未取得','','',''],
    ['ブログの現在地','','',''],
    ['総合コメント','日次更新後に記事ランクの構成と変化を分析して表示します。','',''],
    ['処理状況','','',''],
    ['現在の状態','待機中','実行中/最後の処理',''],
    ['開始時刻','','完了予定',''],
    ['経過時間','','処理結果',''],
    ['お願い','','',''],
    ['','','',''],
    ['初回セットアップ進捗','','',''],
    ['記事URL収集','未開始','取得済み記事数','0件'],
    ['記事情報補完','未開始','補完済み記事数','0件'],
    ['セットアップ状態','未完了','残り記事数','0件']
  ];
  sh.getRange(1,1,values.length,4).setValues(values);
  sh.setColumnWidths(1,1,180); sh.setColumnWidths(2,1,320); sh.setColumnWidths(3,1,190); sh.setColumnWidths(4,1,390);
  sh.setFrozenRows(1);
  sh.getRange('A1:D1').setBackground('#0b8043').setFontColor('#ffffff').setFontWeight('bold').setFontSize(14);
  sh.getRange('A2:D3').setBorder(true,true,true,true,true,true).setBackground('#eef5ff');
  sh.getRange('A4:D9').setBorder(true,true,true,true,true,true).setBackground('#f3f6f4');
  sh.getRange('A10:D12').setBorder(true,true,true,true,true,true).setBackground('#fff8e1');
  sh.getRange('A13:D14').setBorder(true,true,true,true,true,true).setBackground('#f8fbff');
  sh.getRange('A15:D19').setBorder(true,true,true,true,true,true).setBackground('#d9ead3');
  sh.getRange('A21:D24').setBorder(true,true,true,true,true,true).setBackground('#eef5ff');
  sh.getRange('A4:C4').setFontWeight('bold'); sh.getRange('A10').setFontWeight('bold'); sh.getRange('A13').setFontWeight('bold'); sh.getRange('A15').setFontWeight('bold'); sh.getRange('A21').setFontWeight('bold'); sh.getRange('A:A').setFontWeight('bold');
  sh.getRange('A1:D24').setVerticalAlignment('middle').setWrap(true);
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

function sbmBuildTodaySheetView_() {
  var sh = sbmGetOrCreateSheet_(SBM_SHEETS.TODAY);
  if (sh.getLastRow() === 0) sbmEnsureHeaders_(sh, SBM_HEADERS.TODAY);
  sbmStyleTodaySheet_(sh);
  sh.setFrozenRows(1);
}
function sbmBuildBriefSheetView_() { sbmStyleBriefSheet_(sbmGetOrCreateSheet_(SBM_SHEETS.BRIEF)); }
function sbmBuildLogSheetView_() { sbmStyleLogSheet_(sbmGetOrCreateSheet_(SBM_SHEETS.LOG)); }
function sbmBuildEffectSheetView_() { sbmStyleEffectSheet_(sbmGetOrCreateSheet_(SBM_SHEETS.EFFECT)); }
function sbmBuildInProgressSheetView_() { sbmBuildInProgressSheet_(); }
function sbmBuildCannibalSheetView_() { sbmRemoveRetiredSheets_(); }

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
    ui.showModalDialog(html, 'STEP2 Google Cloud API有効化ガイド');
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
    sbmSetHomeProcessing_('● 処理中','記事DB一括作成',startedText,'','Search Consoleからページ単位データを取得しています。',true);

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
    sbmSetHomeProcessing_('完了','記事DB一括作成',startedText,sbmNowText_(),'記事DB ' + total + '件を作成しました。',false);

    if (!silent) {
      if (finished) {
        sbmAlert_('記事DB作成完了','Search Consoleページ行: ' + raw.length + '件\n正規化後の記事DB: ' + total + '件\n除外: ' + excluded + '件\n\n次はSTEP5 記事情報補完を実行してください。');
      } else {
        sbmAlert_('25,000件上限に到達しました','Search Consoleページ行が25,000件に達したため、記事DB作成を完了扱いにしていません。大規模サイト向けの追加取得が必要です。');
      }
    }
  } catch(e) {
    sbmSetSetting_('ArticleDbUrlBuildStatus','エラー','記事URL収集の状態');
    sbmSetHomeProcessing_('エラー','記事DB一括作成',startedText,sbmNowText_(),String(e),false);
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
    sbmSetHomeProcessing_('● 処理中','記事情報補完',startedText,'','未補完記事を最大' + batch + '件処理しています。',true);
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
    sbmSetHomeProcessing_('完了','記事情報補完',startedText,sbmNowText_(),'今回 ' + processed + '件処理。補完済み ' + counts.completed + '/' + counts.total + '件。',false);
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
    sbmSetHomeProcessing_('エラー','記事情報補完',startedText,sbmNowText_(),String(e),false);
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
    '<script>var state=' + payload + ';var batch=' + batch + ';function render(s){state=s||{};document.getElementById("processed").textContent=(Number(state.processed||0))+"件";document.getElementById("success").textContent=(Number(state.success||0))+"件";document.getElementById("errors").textContent=(Number(state.errors||0))+"件";document.getElementById("completed").textContent=(Number(state.completed||0))+" / "+(Number(state.total||0))+"件";document.getElementById("remaining").textContent=(Number(state.remaining||0))+"件";var btn=document.getElementById("continueBtn");var msg=document.getElementById("message");if(state.finished||Number(state.remaining||0)===0){document.getElementById("title").textContent="記事情報補完が完了しました";btn.style.display="none";msg.className="done";msg.textContent="初回記事DBセットアップが完了しました。";}else{btn.style.display="inline-block";btn.disabled=false;btn.textContent="続けて"+batch+"件処理";msg.className="";msg.textContent="";}}function continueRun(){var btn=document.getElementById("continueBtn");var msg=document.getElementById("message");btn.disabled=true;btn.textContent="処理中…";msg.className="";msg.textContent="Homeの処理状況欄でも進行を確認できます。";google.script.run.withFailureHandler(function(e){btn.disabled=false;btn.textContent="続けて"+batch+"件処理";msg.className="error";msg.textContent=(e&&e.message)?e.message:String(e);}).withSuccessHandler(function(res){render(res||{});}).sbmContinueArticleInfoFromDialog();}render(state);</script>' +
    '</body></html>';
  SpreadsheetApp.getUi().showModalDialog(HtmlService.createHtmlOutput(html).setWidth(520).setHeight(420), '記事情報補完');
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
  sbmAlert_('記事DBセットアップ進捗','記事URL収集: ' + urlStatus + '\n記事DB件数: ' + c.total + '件\n\n記事情報補完: ' + infoStatus + '\n補完済み: ' + c.completed + '件\n残り: ' + c.remaining + '件');
}

/**
 * Product 5.0: 新方式の第一段階。
 * Search Consoleから page 単位のデータだけを取得し、URL正規化・ノイズ除去後に「記事DB」へ保存します。
 * ここではタイトル取得・改善分析・改善ブリーフ作成は行いません。
 */
function sbmCollectPageDataToArticleDbManual(silent) {
  silent = silent === true;
  if (!sbmIsSetupComplete_() || sbmGetSetting_('ConnectionStatus','') !== 'OK') {
    return sbmAlert_('ページデータ収集はまだできません', 'STEP1〜STEP3を完了してから実行してください。');
  }
  var ui = SpreadsheetApp.getUi();
  if (!silent) {
    var res = ui.alert('ページデータ収集を開始します', 'Search Consoleから最新のページデータを取得し、記事DBのクリック数・表示回数・CTR・掲載順位・記事ランクを更新します。\n\n記事タイトル、SEOタイトル、メタディスクリプション、メインクエリ、作業状態は変更しません。新規記事が見つかった場合だけ、更新後に記事情報補完をご案内します。', ui.ButtonSet.OK_CANCEL);
    if (res !== ui.Button.OK) return;
  }
  var startedText = sbmNowText_();
  var started = new Date();
  var profiler = sbmCreateProfiler_('ページデータ収集（記事DB）');
  var runId = profiler.runId;
  try {
    sbmSetHomeProcessing_('● 処理中', 'ページデータ収集開始', startedText, '', 'Search Consoleからページ単位データを取得しています。', true);
    var tApi = new Date();
    var result = sbmFetchSearchConsolePageRowsForArticleDb_(profiler);
    var apiSec = sbmSecondsSince_(tApi);

    sbmSetHomeProcessing_('● 処理中', '記事DB更新中', startedText, '', 'URLを正規化し、ノイズを除外した記事データを保存しています。', true);
    var tWrite = new Date();
    var mergeResult = sbmMergeArticleDbDaily_(result.rows);
    var writeSec = sbmSecondsSince_(tWrite);

    sbmSetSetting_('LastArticleDbFetchAt', sbmNowText_(), '記事DBの最終取得日時');
    sbmSetSetting_('LastArticleDbRows', mergeResult.total, '記事DBの直近行数');
    sbmSetSetting_('LastArticleDbExcluded', result.excluded, 'ページデータ収集で除外したURL数');
    sbmSetSetting_('LastArticleDbRawRows', result.rawRows, 'ページデータ収集のSearch Console元行数');

    var sec = sbmSecondsSince_(started);
    sbmProcessLog_('ページデータ収集（記事DB）', '完了', result.rawRows, result.rows.length, sec,
      'API取得 ' + apiSec + '秒 / 差分更新 ' + writeSec + '秒 / 既存更新 ' + mergeResult.updated + '件 / 新規追加 ' + mergeResult.added + '件 / 記事DB合計 ' + mergeResult.total + '件 / 除外 ' + result.excluded + '件 / 固定情報保護 / ProfileRunId ' + runId,
      startedText, sbmNowText_());
    sbmSetHomeProcessing_('完了', '記事DBを更新（日次）', startedText, sbmNowText_(), '既存 ' + mergeResult.updated + '件更新、新規 ' + mergeResult.added + '件追加。記事DB合計 ' + mergeResult.total + '件。', false);
    if (!silent) sbmAlert_('記事DBの日次更新完了', '固定情報を保持したまま数値データを更新しました。\n\nSearch Console取得行: ' + result.rawRows + '件\n既存記事更新: ' + mergeResult.updated + '件\n新規記事追加: ' + mergeResult.added + '件\n記事DB合計: ' + mergeResult.total + '件\n30日以上データ未取得: ' + mergeResult.stale30 + '件\n除外: ' + result.excluded + '件\n所要時間: ' + sec + '秒\n\n処理プロファイル: ' + runId);
    if (mergeResult.added > 0) sbmShowNewArticleInfoPrompt_(mergeResult.added);
    return mergeResult;
  } catch(e) {
    var secErr = sbmSecondsSince_(started);
    sbmProcessLog_('ページデータ収集（記事DB）', 'エラー', '', '', secErr, String(e) + ' / ProfileRunId ' + runId, startedText, sbmNowText_());
    sbmSetHomeProcessing_('エラー', 'ページデータ収集（記事DB）', startedText, sbmNowText_(), String(e), false);
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
    return [sbmLegacyStatusToRank_(status), sbmLegacyStatusToWorkState_(status), url, '', m.clicks, m.impressions, ctr, pos, '', '記事詳細', '', '', m.capturedAt, m.originalCount, '', '', '', '×', '', '', sbmStatusLabel_(status)];
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
  try {
    var inRows = sbmRowsAsObjects_(SBM_SHEETS.IN_PROGRESS);
    inRows.forEach(function(r){
      var url = sbmNormalizeUrl_(r['URL'] || r['記事URL'] || '');
      if (url) map[url] = '改善中';
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

function sbmSortArticleDbRows_(rows) {
  rows = rows || [];
  rows.sort(function(a,b){
    var rankOrder = {'🏆 エース':1,'✅ 安定':2,'📈 成長':3,'🌱 育成':4,'⚠️ 低迷':5,'—':9,'':9};
    var workOrder = {'🔥 今日の改善':1,'✏️ 改善中':2,'👀 モニター中':3,'未着手':4,'✔️ 完了':5,'':9};
    var ao = rankOrder[String(a[0] || '').trim()] || 99;
    var bo = rankOrder[String(b[0] || '').trim()] || 99;
    if (ao !== bo) return ao - bo;
    var aw = workOrder[String(a[1] || '').trim()] || 99;
    var bw = workOrder[String(b[1] || '').trim()] || 99;
    if (aw !== bw) return aw - bw;
    return sbmNumber_(b[5]) - sbmNumber_(a[5]);
  });
  return rows;
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
      old['最終取得日時'] = f['最終取得日時'];
      old['最終確認日'] = today;
      old['連続未取得日数'] = 0;
      if (String(old['管理フラグ'] || '') !== '新規記事' || String(old['記事情報補完済み'] || '') === '○') old['管理フラグ'] = '正常';
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
      f['最終確認日'] = today;
      f['連続未取得日数'] = 0;
      f['管理フラグ'] = '新規記事';
      map[url] = f;
      added++;
    }
  });
  var stale30 = 0;
  Object.keys(map).forEach(function(url){
    if (seen[url]) return;
    var r = map[url];
    var missing = Number(r['連続未取得日数'] || 0) + 1;
    r['連続未取得日数'] = missing;
    if (missing >= 30) { r['管理フラグ'] = '30日以上データ未取得'; stale30++; }
    else if (String(r['管理フラグ'] || '') !== '新規記事') r['管理フラグ'] = 'データ未取得';
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
  return {updated:updated, added:added, total:rows.length, stale30:stale30};
}


function sbmWriteArticleDb_(rows) {
  var sh = sbmGetOrCreateSheet_(SBM_SHEETS.ARTICLE_DB);
  sh.clear();
  sbmEnsureHeaders_(sh, SBM_HEADERS.ARTICLE_DB);
  var normalized = sbmNormalizeRowsToWidth_(sbmSortArticleDbRows_(rows || []), SBM_HEADERS.ARTICLE_DB.length);
  if (normalized.length) sh.getRange(2, 1, normalized.length, SBM_HEADERS.ARTICLE_DB.length).setValues(normalized);
  sbmStyleArticleDbSheet_(sh);
}

function sbmStyleArticleDbSheet_(sh) {
  sbmStyleDataSheet_(sh);
  var hm = sbmHeaderMap_(sh);
  try { if (hm['クリック数']) sh.getRange(2, hm['クリック数'], Math.max(1, sh.getMaxRows()-1), 1).setNumberFormat('#,##0'); } catch(e) {}
  try { if (hm['表示回数']) sh.getRange(2, hm['表示回数'], Math.max(1, sh.getMaxRows()-1), 1).setNumberFormat('#,##0'); } catch(e) {}
  try { if (hm['CTR']) sh.getRange(2, hm['CTR'], Math.max(1, sh.getMaxRows()-1), 1).setNumberFormat('0.0%'); } catch(e) {}
  try { if (hm['掲載順位']) sh.getRange(2, hm['掲載順位'], Math.max(1, sh.getMaxRows()-1), 1).setNumberFormat('0.0'); } catch(e) {}
  try {
    var widths = {'記事ランク':105,'作業状態':110,'記事URL':255,'メインクエリ':190,'クリック数':78,'表示回数':84,'CTR':65,'掲載順位':72,'記事タイトル':380,'詳細':125};
    Object.keys(widths).forEach(function(h){ if (hm[h]) sh.setColumnWidth(hm[h], widths[h]); });
    ['SEOタイトル','メタディスクリプション','最終取得日時','元URL件数','除外理由','備考','ArticleID','記事情報補完済み','補完日時','補完エラー','記事ステータス','最終確認日','連続未取得日数','管理フラグ'].forEach(function(h){ if (hm[h]) sh.hideColumns(hm[h]); });
    var lr = sh.getLastRow();
    if (lr > 1) {
      sh.getRange(2,1,lr-1,2).setHorizontalAlignment('center');
      sh.setRowHeights(2, lr-1, 42);
      if (hm['記事タイトル']) sh.getRange(2,hm['記事タイトル'],lr-1,1).setWrap(true);
      if (hm['記事URL']) sh.getRange(2,hm['記事URL'],lr-1,1).setWrap(false);
      if (hm['メインクエリ']) sh.getRange(2,hm['メインクエリ'],lr-1,1).setWrap(true);
      if (hm['詳細']) {
        var dr = sh.getRange(2,hm['詳細'],lr-1,1);
        dr.clearDataValidations();
        dr.setValues(Array.from({length:lr-1}, function(){ return ['行を選択→メニュー']; }));
        dr.setBackground('#e8f0fe')
          .setFontColor('#174ea6')
          .setFontWeight('bold')
          .setHorizontalAlignment('center')
          .setVerticalAlignment('middle')
          .setNote('この行の任意のセルを選択し、上部メニュー「SIMS-Blog-Manager」→「記事DB」→「選択記事の詳細を開く」を実行してください。');
      }
    }
  } catch(e) {}
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
    sbmSetHomeProcessing_('● 処理中', '記事DBタイトル情報補完開始', startedText, '', '改善候補はタイトル・SEOタイトル・メタディスクリプション・メインクエリ、良好は記事タイトルのみ補完しています。300秒を超える前に安全終了します。', true);

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
      out.push([sbmStatusLabel_(status), url, mainQuery, clicks, imps, ctr, pos, articleTitle, seoTitle, metaDesc, r['最終取得日時'] || now, sbmNumber_(r['元URL件数'] || 0), r['除外理由'] || '', r['備考'] || '']);
    }

    sbmWriteArticleDb_(out);
    var sec = sbmSecondsSince_(started);
    var detail = '並び順: 改善候補→良好→様子見 / 対象: 改善候補はタイトル・SEOタイトル・メタディスクリプション・メインクエリ、良好は記事タイトルのみ / メタ取得 ' + fetchedMeta + '件 / メインクエリ取得 ' + fetchedQuery + '件 / 最大 ' + maxMeta + 'URL / 300秒安全終了 ' + (skippedByTime ? 'あり' : 'なし');
    sbmProcessLog_('記事DBタイトル情報補完', '完了', target, fetchedMeta + fetchedQuery, sec, detail, startedText, sbmNowText_());
    sbmSetHomeProcessing_('完了', '記事DBタイトル情報補完', startedText, sbmNowText_(), '記事DBの情報を補完しました。メタ ' + fetchedMeta + '件、メインクエリ ' + fetchedQuery + '件。', false);
    if (!silent) sbmAlert_('記事DBタイトル情報補完完了', '記事DBの情報補完が完了しました。\n\n並び順: 改善候補 → 良好 → 様子見\nメタ情報取得: ' + fetchedMeta + '件\nメインクエリ取得: ' + fetchedQuery + '件\n所要時間: ' + sec + '秒\n300秒安全終了: ' + (skippedByTime ? 'あり' : 'なし'));
  } catch(e) {
    var secErr = sbmSecondsSince_(started);
    sbmProcessLog_('記事DBタイトル情報補完', 'エラー', '', '', secErr, String(e), startedText, sbmNowText_());
    sbmSetHomeProcessing_('エラー', '記事DBタイトル情報補完', startedText, sbmNowText_(), String(e), false);
    sbmAlert_('記事DBタイトル情報補完エラー', String(e));
  }
}

function sbmOpenArticleDb() {
  sbmOpenSheet_(SBM_SHEETS.ARTICLE_DB);
  try { SpreadsheetApp.getActiveSpreadsheet().toast('見たい記事の行を選択し、SIMS-Blog-Manager → 記事DB → 選択記事の詳細を開く を実行してください。', '記事DBの操作', 8); } catch(e) {}
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

    sbmSetHomeProcessing_('● 処理中', 'Search Consoleデータ取得開始', startedText, '', 'Search Console APIから最新データを取得しています。', true);
    profiler.lap('Home処理状況表示', '', '', '開始表示をHomeへ反映');

    var fetchStarted = new Date();
    var rows = sbmFetchSearchConsoleQueriesProfiled_(profiler);
    var apiSec = sbmSecondsSince_(fetchStarted);
    profiler.lap('Search Console取得合計', '', rows.length, '取得合計 ' + apiSec + '秒 / 取得方式 ' + sbmGetSetting_('LastFetchMode','') + ' / URL数 ' + sbmGetSetting_('LastFetchPageCount','') + '件 / クエリ詳細 ' + sbmGetSetting_('LastFetchQueryDetailPages','') + '件 / 上限到達 ' + sbmGetSetting_('LastFetchHitLimit',''));

    var writeStarted = new Date();
    sbmWriteRawQueryDataLight_(rows);
    var writeSec = sbmSecondsSince_(writeStarted);
    profiler.lap('SearchConsole_Data書込', rows.length, rows.length, 'シート書込 ' + writeSec + '秒');

    sbmSetHomeProcessing_('● 処理中', 'STEP A データ一覧更新中', startedText, '', 'Search Consoleのページデータをデータ一覧に反映しています。記事情報補完はSTEP A-2で行います。', true);
    profiler.lap('Home処理状況更新', '', '', 'データ一覧更新中表示をHomeへ反映');

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
    sbmSetHomeProcessing_('完了', 'STEP A Search Consoleデータ取得', startedText, sbmNowText_(), rows.length + '件取得しました。記事情報補完はSTEP A-2で実行してください。データ一覧 ' + ((metaResult && metaResult.total)||0) + '件', false);
    profiler.lap('Home完了表示', '', '', '完了表示をHomeへ反映');
    var runId = profiler.finish('完了', '総所要 ' + sec + '秒 / 取得 ' + rows.length + '行 / データ一覧 ' + ((metaResult && metaResult.total)||0) + '件');

    if (!silent) sbmAlert_('データ取得完了', 'Search Consoleデータの取得が完了しました。\n取得件数: ' + rows.length + '件\n所要時間: ' + sec + '秒\n処理プロファイル: ' + runId + '\n\n必要に応じて「STEP A-2 記事情報を補完」を実行してから、STEP Bへ進んでください。');
  } catch (e) {
    var secErr = sbmSecondsSince_(started);
    profiler.lap('エラー発生', '', '', String(e));
    var runErr = profiler.finish('エラー', String(e));
    sbmProcessLog_('STEP A Search Consoleデータ取得', 'エラー', '', '', secErr, String(e) + ' / 処理プロファイル ' + runErr, startedText, sbmNowText_());
    sbmLog_('FetchOnly','Error',String(e));
    sbmSetHomeProcessing_('エラー', 'STEP A Search Consoleデータ取得', startedText, sbmNowText_(), String(e), false);
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
    sbmSetHomeProcessing_('● 処理中', 'STEP B 改善候補分析開始', startedText, '', '取得済みデータから改善候補・今日の改善を作成しています。データ一覧の補正はSTEP A側で行います。', true);
    profiler.lap('Home処理状況表示', '', '', '分析開始をHomeへ表示');

    var tDiagnosis = new Date();
    var result = sbmBuildDiagnosis_();
    profiler.lap('改善候補抽出', (result && result.targetCount) || '', (result && result.analyzedCount) || '', '候補 ' + ((result && result.diagnosisCount) || 0) + '件 / ' + sbmSecondsSince_(tDiagnosis) + '秒');

    sbmSetHomeProcessing_('● 処理中', 'STEP B 今日の改善作成中', startedText, '', '改善候補から今日の改善と改善ブリーフを作成しています。', true);
    var tToday = new Date();
    sbmBuildTodayQueue_();
    profiler.lap('今日の改善・改善ブリーフ作成', '', sbmGetSetting_('DisplayedImprovementCount',''), sbmSecondsSince_(tToday) + '秒');

    sbmSetHomeProcessing_('● 処理中', 'STEP B 改善中シート更新中', startedText, '', '改善中の記事を整理しています。', true);
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
    sbmSetHomeProcessing_('完了', 'STEP B 改善候補分析', startedText, sbmNowText_(), '改善候補と今日の改善を更新しました。データ一覧はSTEP Aの結果を参照しています。', false);
    sbmRefreshHome_();
    if (!silent) sbmAlert_('改善分析完了', '改善候補を作成しました。\n管理対象記事: ' + managed + '件\n分析記事: ' + ((result && result.analyzedCount)||'') + '件\n改善候補: ' + total + '件\n表示中: ' + shown + '件\nデータ一覧: STEP Aの結果を使用\n所要時間: ' + sec + '秒\n\n開発用プロファイル: ' + runId);
  } catch(e) {
    var secErr = sbmSecondsSince_(started);
    var runErr = profiler.finish('エラー', String(e));
    sbmProcessLog_('STEP B 改善候補分析', 'エラー', qRows.length, '途中', secErr, String(e) + ' / ProfileRunId ' + runErr, startedText, sbmNowText_());
    sbmLog_('AnalyzeOnly','Error',String(e));
    sbmSetHomeProcessing_('エラー', 'STEP B 改善候補分析', startedText, sbmNowText_(), String(e), false);
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
  sbmEnsureHeaders_(sbmGetOrCreateSheet_(SBM_SHEETS.IN_PROGRESS), SBM_HEADERS.IN_PROGRESS);
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


function sbmSetHomeProcessing_(state, processName, startedText, finishedText, resultText, isProcessing) {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SBM_SHEETS.HOME);
  if (!sh) return;
  try {
    sh.getRange('A15:D19').setBackground(isProcessing ? '#fff2cc' : '#d9ead3');
    sh.getRange('A15').setValue('処理状況');
    sh.getRange('A16').setValue('現在の状態');
    sh.getRange('B16').setValue(state || '待機中');
    sh.getRange('C16').setValue('実行中/最後の処理');
    sh.getRange('D16').setValue(processName || '');
    sh.getRange('A17').setValue('開始時刻');
    sh.getRange('B17').setValue(startedText || '');
    sh.getRange('C17').setValue(isProcessing ? '完了予定' : '完了時刻');
    sh.getRange('D17').setValue(finishedText || '');
    sh.getRange('A18').setValue('経過時間');
    sh.getRange('B18').setValue('');
    sh.getRange('C18').setValue('処理結果');
    sh.getRange('D18').setValue(resultText || '');
    sh.getRange('A19').setValue('お願い');
    sh.getRange('B19').setValue(isProcessing ? '処理中は他のメニューを実行しないでください。シートの閲覧は可能ですが、編集しないでください。' : '');
    sh.getRange('B16').setFontWeight('bold').setFontColor(isProcessing ? '#ffffff' : '#990000').setBackground(isProcessing ? '#cc0000' : (state === 'エラー' ? '#f4cccc' : '#d9ead3'));
    sh.getRange('A19:B19').setFontWeight('bold').setFontColor(isProcessing ? '#cc0000' : '#000000').setBackground(isProcessing ? '#fce5e5' : '#d9ead3');
    SpreadsheetApp.flush();
  } catch (e) {
    console.error(e);
  }
}


function sbmBuildDataListFromAnalysis_() {
  var rawRows = sbmGetRawQueryRows_();
  var byUrl = sbmAggregateRawRowsByUrl_(rawRows);
  var diag = sbmRowsAsObjects_(SBM_SHEETS.DIAGNOSIS);
  var inProg = sbmRowsAsObjects_(SBM_SHEETS.IN_PROGRESS);
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
    sbmSetHomeProcessing_('● 処理中', 'STEP A-2 記事情報補完開始', startedText, '', 'データ一覧の未取得URLから、記事タイトル・SEOタイトル・メタディスクリプションを補完しています。', true);
    var result = sbmUpdateDataListAfterFetch_(rows, true);
    var sec = sbmSecondsSince_(started);
    sbmProcessLog_('STEP A-2 記事情報補完', '完了', result.total || '', result.fetched || 0, sec, '最大補完 ' + sbmGetSetting_('MetaFetchMaxRows', SBM_DEFAULTS.META_FETCH_MAX_ROWS) + 'URL / 取得済みURLは再利用', startedText, sbmNowText_());
    sbmSetHomeProcessing_('完了', 'STEP A-2 記事情報補完', startedText, sbmNowText_(), '記事情報を' + (result.fetched || 0) + '件補完しました。', false);
    if (!silent) sbmAlert_('記事情報補完完了', '記事情報の補完が完了しました。\n対象記事: ' + (result.total || 0) + '件\n補完件数: ' + (result.fetched || 0) + '件\n所要時間: ' + sec + '秒');
  } catch (e) {
    var secErr = sbmSecondsSince_(started);
    sbmProcessLog_('STEP A-2 記事情報補完', 'エラー', '', '', secErr, String(e), startedText, sbmNowText_());
    sbmSetHomeProcessing_('エラー', 'STEP A-2 記事情報補完', startedText, sbmNowText_(), String(e), false);
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
  SpreadsheetApp.getUi().showModalDialog(html, 'データ一覧 詳細');
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

function sbmEscapeHtml_(v) {
  return String(v || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
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

function sbmOpenSelectedArticleDbDetail() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getActiveSheet();
  if (!sh || sh.getName() !== SBM_SHEETS.ARTICLE_DB) {
    return sbmAlert_('記事DB詳細', '「記事DB」シートで対象記事の行を選択してください。');
  }
  var range = sh.getActiveRange();
  var row = range ? range.getRow() : 0;
  if (row <= 1) return sbmAlert_('記事DB詳細', '見出し以外の記事行を選択してください。');
  sbmShowArticleDbDetailForRow_(row);
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

function sbmShowArticleDbDetailForRow_(row) {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SBM_SHEETS.ARTICLE_DB);
  if (!sh || row <= 1) return;
  var hm = sbmHeaderMap_(sh);
  var obj = {};
  Object.keys(hm).forEach(function(h){ obj[h] = sh.getRange(row, hm[h]).getDisplayValue(); });
  var e = sbmEscapeHtml_;
  var rank = obj['記事ランク'] || '';
  var work = obj['作業状態'] || '';
  var html = '<div style="font-family:Arial, sans-serif;padding:22px;color:#202124;line-height:1.65">'
    + '<h2 style="margin-top:0;color:#0b8043">記事DB詳細</h2>'
    + '<p><b>記事タイトル</b><br>' + e(obj['記事タイトル']) + '</p>'
    + '<p><b>記事URL</b><br><a href="' + e(obj['記事URL']) + '" target="_blank">' + e(obj['記事URL']) + '</a></p>'
    + '<table style="border-collapse:collapse;width:100%;margin:14px 0">'
    + '<tr><td style="padding:8px;border:1px solid #ddd"><b>クリック数</b></td><td style="padding:8px;border:1px solid #ddd">' + e(obj['クリック数']) + '</td><td style="padding:8px;border:1px solid #ddd"><b>表示回数</b></td><td style="padding:8px;border:1px solid #ddd">' + e(obj['表示回数']) + '</td></tr>'
    + '<tr><td style="padding:8px;border:1px solid #ddd"><b>CTR</b></td><td style="padding:8px;border:1px solid #ddd">' + e(obj['CTR']) + '</td><td style="padding:8px;border:1px solid #ddd"><b>掲載順位</b></td><td style="padding:8px;border:1px solid #ddd">' + e(obj['掲載順位']) + '</td></tr>'
    + '</table>'
    + '<div style="background:#f0f7f3;border-left:5px solid #0b8043;padding:12px 14px;margin:14px 0"><b>記事ランク：' + e(rank) + '</b><br>' + e(sbmArticleRankComment_(rank)) + '</div>'
    + '<div style="background:#f5f7fb;border-left:5px solid #1a73e8;padding:12px 14px;margin:14px 0"><b>作業状態：' + e(work) + '</b><br>' + e(sbmWorkStateComment_(work)) + '<br><b>着手判断：</b>' + e(sbmRankWorkRecommendation_(rank, work)) + '</div>'
    + '<p><b>メインクエリ</b><br>' + e(obj['メインクエリ']) + '</p>'
    + '<p><b>SEOタイトル</b><br>' + e(obj['SEOタイトル']) + '</p>'
    + '<p><b>メタディスクリプション</b><br>' + e(obj['メタディスクリプション']) + '</p>'
    + '<hr><table style="border-collapse:collapse;width:100%">'
    + '<tr><td><b>ArticleID</b></td><td>' + e(obj['ArticleID']) + '</td></tr>'
    + '<tr><td><b>最終取得日時</b></td><td>' + e(obj['最終取得日時']) + '</td></tr>'
    + '<tr><td><b>補完済み</b></td><td>' + e(obj['記事情報補完済み']) + '</td></tr>'
    + '<tr><td><b>補完日時</b></td><td>' + e(obj['補完日時']) + '</td></tr>'
    + '<tr><td><b>備考</b></td><td>' + e(obj['備考']) + '</td></tr>'
    + '</table></div>';
  SpreadsheetApp.getUi().showModalDialog(HtmlService.createHtmlOutput(html).setWidth(760).setHeight(720), '記事DB詳細');
}


function sbmRefreshHome_() {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SBM_SHEETS.HOME);
  if (!sh) return;
  var rows = [];
  try { rows = sbmRowsAsObjects_(SBM_SHEETS.ARTICLE_DB); } catch(e) {}
  var rankCounts = {'🏆 エース':0,'✅ 安定':0,'📈 成長':0,'🌱 育成':0,'⚠️ 低迷':0};
  var workCounts = {'未着手':0,'🔥 今日の改善':0,'✏️ 改善中':0,'👀 モニター中':0,'✔️ 完了':0};
  var newCount = 0, infoMissing = 0, stale30 = 0;
  rows.forEach(function(r){
    var rank = String(r['記事ランク'] || '').trim();
    var work = String(r['作業状態'] || '未着手').trim();
    if (rankCounts.hasOwnProperty(rank)) rankCounts[rank]++;
    if (workCounts.hasOwnProperty(work)) workCounts[work]++;
    var flag = String(r['管理フラグ'] || '').trim();
    if (flag === '新規記事') newCount++;
    if (String(r['記事情報補完済み'] || '') !== '○') infoMissing++;
    if (Number(r['連続未取得日数'] || 0) >= 30) stale30++;
  });
  var blogName = String(sbmGetSetting_('BlogName','') || '未登録');
  var blogUrl = String(sbmGetSetting_('BlogUrl','') || '');
  sh.getRange('B2').setValue(blogName);
  if (blogUrl) sh.getRange('D2').setFormula('=HYPERLINK("' + blogUrl.replace(/"/g,'""') + '","' + blogUrl.replace(/"/g,'""') + '")'); else sh.getRange('D2').setValue('未登録');
  sh.getRange('B3').setValue(rows.length + '件');
  sh.getRange('D3').setValue(sbmGetSetting_('LastArticleDbFetchAt', sbmGetSetting_('LastFetchDate','未取得')));
  var prevAce = Number(sbmGetSetting_('PrevAceCount', rankCounts['🏆 エース'])) || 0;
  var prevStable = Number(sbmGetSetting_('PrevStableCount', rankCounts['✅ 安定'])) || 0;
  var prevGrowth = Number(sbmGetSetting_('PrevGrowthCount', rankCounts['📈 成長'])) || 0;
  var prevNurture = Number(sbmGetSetting_('PrevNurtureCount', rankCounts['🌱 育成'])) || 0;
  var prevLow = Number(sbmGetSetting_('PrevLowCount', rankCounts['⚠️ 低迷'])) || 0;
  sh.getRange('B5').setValue(rankCounts['🏆 エース'] + '件（' + sbmSignedDelta_(rankCounts['🏆 エース']-prevAce) + '）');
  sh.getRange('B6').setValue(rankCounts['✅ 安定'] + '件（' + sbmSignedDelta_(rankCounts['✅ 安定']-prevStable) + '）');
  sh.getRange('B7').setValue(rankCounts['📈 成長'] + '件（' + sbmSignedDelta_(rankCounts['📈 成長']-prevGrowth) + '）');
  sh.getRange('B8').setValue(rankCounts['🌱 育成'] + '件（' + sbmSignedDelta_(rankCounts['🌱 育成']-prevNurture) + '）');
  sh.getRange('B9').setValue(rankCounts['⚠️ 低迷'] + '件（' + sbmSignedDelta_(rankCounts['⚠️ 低迷']-prevLow) + '）');
  sh.getRange('D5').setValue(workCounts['未着手'] + '件');
  sh.getRange('D6').setValue(workCounts['🔥 今日の改善'] + '件');
  sh.getRange('D7').setValue(workCounts['✏️ 改善中'] + '件');
  sh.getRange('D8').setValue(workCounts['👀 モニター中'] + '件');
  sh.getRange('D9').setValue(workCounts['✔️ 完了'] + '件');
  sh.getRange('B11').setValue(newCount + '件');
  sh.getRange('D11').setValue(infoMissing + '件');
  sh.getRange('B12').setValue(stale30 + '件');
  try { sh.getRange('B14:D14').breakApart(); } catch(ignore) {}
  sh.getRange('B14:D14').merge();
  sh.getRange('B14').setValue(sbmBlogHealthComment_(rankCounts, rows.length)).setWrap(true);
  var urlBuildStatus = String(sbmGetSetting_('ArticleDbUrlBuildStatus','未開始'));
  var infoBuildStatus = String(sbmGetSetting_('ArticleInfoBuildStatus','未開始'));
  var completedInfo = sbmArticleDbInfoCompletionCounts_();
  var articleDbTotal = completedInfo.total || Number(sbmGetSetting_('LastArticleDbRows','0')) || 0;
  sh.getRange('B22').setValue(urlBuildStatus);
  sh.getRange('D22').setValue(articleDbTotal + '件');
  sh.getRange('B23').setValue(infoBuildStatus);
  sh.getRange('D23').setValue(completedInfo.completed + ' / ' + completedInfo.total + '件');
  var setupDone = String(sbmGetSetting_('ArticleDbUrlBuildComplete','NO')) === 'YES' && String(sbmGetSetting_('ArticleInfoBuildComplete','NO')) === 'YES';
  sh.getRange('B24').setValue(setupDone ? '完了' : '未完了');
  sh.getRange('D24').setValue(Math.max(0, completedInfo.total - completedInfo.completed) + '件');
}


function sbmUniqueUrlCount_(rows) {
  var seen = {};
  rows.forEach(function(r){ var u = r.URL || r['記事URL'] || ''; if (u) seen[u] = true; });
  return Object.keys(seen).length;
}

function sbmOpenHome() { sbmRefreshHome_(); sbmOpenSheet_(SBM_SHEETS.HOME); }
function sbmOpenSetup() { sbmOpenSheet_(SBM_SHEETS.SETUP); }
function sbmOpenToday() { sbmOpenSheet_(SBM_SHEETS.TODAY); }
function sbmOpenLog() { sbmOpenSheet_(SBM_SHEETS.LOG); }
function sbmOpenEffect() { sbmOpenSheet_(SBM_SHEETS.EFFECT); }
function sbmOpenInProgress() { sbmBuildInProgressSheet_(); sbmOpenSheet_(SBM_SHEETS.IN_PROGRESS); }
function sbmOpenProcessLog() { sbmOpenSheet_(SBM_SHEETS.PROCESS_LOG); }
function sbmOpenMeasureHistory() { sbmOpenSheet_(SBM_SHEETS.MEASURE_HISTORY); }



function sbmOpenSystemLog() { sbmOpenSheet_(SBM_SHEETS.SYSTEM_LOG); }
function sbmOpenBrief() { sbmOpenSheet_(SBM_SHEETS.BRIEF); }

function sbmShowSelectedBrief() {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  if (sh.getName() !== SBM_SHEETS.TODAY) return sbmAlert_('改善ブリーフ', '「今日の改善」シートで対象行を選択してから実行してください。');
  var row = sh.getActiveRange().getRow();
  if (row <= 1) return sbmAlert_('改善ブリーフ', '改善タスクの行を選択してください。');
  sbmShowBriefForRow_(row);
}

function sbmShowBriefForRow_(row) {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SBM_SHEETS.TODAY);
  var map = sbmHeaderMap_(sh);
  var url = map.URL ? String(sh.getRange(row, map.URL).getValue()) : '';
  if (!url) return sbmAlert_('改善ブリーフ', 'この行のURLを確認できませんでした。');
  var brief = sbmFindBriefByUrl_(url);
  if (!brief) return sbmAlert_('改善ブリーフ', '改善ブリーフが見つかりませんでした。今日のデータを再取得してください。');
  var html = HtmlService.createHtmlOutput(sbmBriefHtml_(brief)).setWidth(820).setHeight(700);
  SpreadsheetApp.getUi().showModalDialog(html, '改善ブリーフ');
}

function sbmOpenSelectedArticle() {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  if (sh.getName() !== SBM_SHEETS.TODAY) return sbmAlert_('記事を開く', '「今日の改善」シートで対象行を選択してから実行してください。');
  var row = sh.getActiveRange().getRow();
  var map = sbmHeaderMap_(sh);
  var url = map.URL ? String(sh.getRange(row, map.URL).getValue()) : '';
  if (!url) return sbmAlert_('記事を開く', 'URLが見つかりません。');
  var html = HtmlService.createHtmlOutput('<div style="font-family:Arial,sans-serif;padding:20px;line-height:1.7"><h2>記事を開く</h2><p>下のボタンから記事を開いてください。</p><p><a target="_blank" style="display:inline-block;background:#1a73e8;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none" href="'+url+'">記事を開く</a></p></div>').setWidth(420).setHeight(220);
  SpreadsheetApp.getUi().showModalDialog(html, '記事を開く');
}

function sbmCompleteSelectedImprovement() {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  if (sh.getName() !== SBM_SHEETS.TODAY) return sbmAlert_('完了記録', '「今日の改善」シートで完了する行を選択してください。');
  var row = sh.getActiveRange().getRow();
  if (row <= 1) return sbmAlert_('完了記録', '改善タスクの行を選択してください。');
  sbmCompleteImprovementRow_(row, true);
}

function sbmCompleteImprovementRow_(row, showAlert) {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SBM_SHEETS.TODAY);
  var map = sbmHeaderMap_(sh);
  if (!map.URL || !map['記事タイトル']) return;
  if (String(sh.getRange(row, map['状態']).getValue()) === '完了') return;
  var obj = {};
  Object.keys(map).forEach(function(k){ obj[k] = sh.getRange(row, map[k]).getValue(); });
  var actions = sbmCollectActionLabels_(obj);
  var brief = sbmFindBriefByUrl_(obj.URL || '');
  var now = sbmNowText_();
  if (map['状態']) sh.getRange(row, map['状態']).setValue('完了');
  if (map['完了日']) sh.getRange(row, map['完了日']).setValue(now);
  sbmAppendObject_(SBM_SHEETS.LOG, SBM_HEADERS.LOG, {
    '改善日': now,
    '記事タイトル': obj['記事タイトル'] || '',
    'URL': sbmNormalizeUrl_(obj.URL || ''),
    'メインクエリ': obj['メインクエリ'] || '',
    '改善内容': obj['改善内容'] || '',
    '修正内容': actions || '未選択',
    '所要時間': obj['時間'] || '',
    'メモ': obj['メモ'] || '',
    '初回測定日': sbmDateAfterText_(1),
    '7日測定完了日': sbmDateAfterText_(SBM_DEFAULTS.TEST_DAILY_DAYS),
    '状態': '測定待ち',
    '改善前CTR': brief ? brief.CTR : '',
    '改善前順位': brief ? brief.Position : '',
    '改善前クリック': brief ? brief.Clicks : '',
    '改善前表示回数': brief ? brief.Impressions : ''
  });
  try { sbmBuildInProgressSheet_(); sbmBuildTodayQueue_(); } catch(e) {}
  sbmRefreshHome_();
  if (showAlert) sbmAlert_('完了しました', '改善ログへ記録しました。\nこの改善は「改善中」に移動し、今日の改善には次の候補が補充されます。\n\n修正内容: ' + (actions || '未選択'));
}

function sbmCollectActionLabels_(obj) {
  var labels = [];
  var keys = ['Title','H1','Description','冒頭文','H2/H3','FAQ','内部リンク','本文追記','その他'];
  keys.forEach(function(k){ if (obj[k] === true || String(obj[k]).toUpperCase() === 'TRUE' || String(obj[k]) === '✓') labels.push(k); });
  return labels.join('・');
}



function onSelectionChange(e) {
  try {
    if (!e || !e.range) return;
    var sh = e.range.getSheet();
    if (!sh || e.range.getRow() <= 1) return;
    if (sh.getName() === SBM_SHEETS.QUERY_DATA && e.range.getColumn() === 8) sbmShowSelectedDataListDetail();
  } catch (err) {
    // 詳細表示は補助機能。処理全体は止めない。
  }
}

function onEdit(e) {
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
        4: {key:'TodayMaxDisplayCount', min:2, max:20, label:'今日の改善最大表示件数'},
        5: {key:'AnalysisCandidateLimit', min:10, max:200, label:'改善候補抽出件数'},
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
    sbmEnsureHeaders_(sh, SBM_HEADERS.PROFILE_LOG);
    sh.getRange(sh.getLastRow() + 1, 1, rows.length, SBM_HEADERS.PROFILE_LOG.length).setValues(rows);
    sbmStyleProfileLogSheet_(sh);
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
  var logs = sbmRowsAsObjects_(SBM_SHEETS.LOG);
  var effects = sbmRowsAsObjects_(SBM_SHEETS.EFFECT);
  var effectByUrl = {};
  effects.forEach(function(e){ effectByUrl[sbmNormalizeUrl_(e.URL || '')] = e; });
  var rows = [];
  var today = new Date();
  logs.forEach(function(l){
    var url = sbmNormalizeUrl_(l.URL || '');
    if (!url) return;
    var status = String(l['状態'] || '測定待ち');
    if (status === '完了' || status === '成功') return;
    var improvedAt = sbmParseDate_(l['改善日']);
    var elapsed = improvedAt ? Math.max(0, Math.floor((today - improvedAt) / 86400000)) : '';
    var e = effectByUrl[url] || {};
    rows.push([l['改善日'] || '', l['記事タイトル'] || sbmResolveArticleTitle_(url,''), elapsed, e['判定'] || status || '測定中', e['SIMS評価'] || '測定中', e['次のアクション'] || '次回測定を確認', false, url, l['修正内容'] || '', l['改善内容'] || '']);
  });
  sbmRewriteSheet_(SBM_SHEETS.IN_PROGRESS, SBM_HEADERS.IN_PROGRESS, rows);
  sbmStyleInProgressSheet_(sbmGetOrCreateSheet_(SBM_SHEETS.IN_PROGRESS));
  return rows.length;
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
    + '<h3>Claude / ChatGPT に貼り付ける改善依頼</h3>'
    + '<textarea style="width:100%;height:230px;font-family:monospace;font-size:12px;white-space:pre-wrap">' + String(request || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</textarea>'
    + '<hr><p>推定時間: ' + esc(b['推定時間']) + '分 / Score: ' + esc(b.Score) + '</p>'
    + '</div>';
}


function sbmShowSelectedEffectDetail() {
  var sh = SpreadsheetApp.getActiveSheet();
  if (!sh || sh.getName() !== SBM_SHEETS.EFFECT) { sbmAlert_('効果測定を開いてください','効果測定シートで対象行を選択してから実行してください。'); return; }
  var row = sh.getActiveRange().getRow();
  if (row <= 1) return;
  sbmShowEffectDetailForRow_(row);
}

function sbmShowEffectDetailForRow_(row) {
  var sh = sbmGetOrCreateSheet_(SBM_SHEETS.EFFECT);
  var heads = sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0].map(String);
  var vals = sh.getRange(row,1,1,sh.getLastColumn()).getValues()[0];
  var o = {}; heads.forEach(function(h,i){ o[h]=vals[i]; });
  var html = HtmlService.createHtmlOutput(sbmEffectDetailHtml_(o)).setWidth(820).setHeight(680);
  SpreadsheetApp.getUi().showModalDialog(html, '改善効果の詳細');
}

function sbmEffectDetailHtml_(o) {
  function esc(v){ return String(v || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>'); }
  return '<div style="font-family:Arial,sans-serif;line-height:1.65;padding:18px;color:#202124">'
    + '<h2 style="margin-top:0">改善効果の詳細</h2>'
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
  SpreadsheetApp.getUi().showModalDialog(html, '改善中の詳細');
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




function sbmUpdateEffectiveness() {
  sbmUpdateEffectivenessCore_(true);
}

function sbmUpdateEffectivenessSilent_() {
  sbmUpdateEffectivenessCore_(false);
}

function sbmRecordTodayMeasurement() {
  // RCテスト用：改善後7日間は、毎日この日の測定値を履歴へ残します。
  // 同じ日・同じ記事・同じ改善日の重複記録は自動で防止します。
  sbmUpdateEffectivenessCore_(false);
  sbmAlert_('本日の測定を記録しました', '測定履歴に本日の値を記録しました。\n\nテスト期間中は、改善後7日間だけ毎日確認できます。\n通常運用では14日・30日評価へ戻す想定です。');
}

function sbmUpdateEffectivenessCore_(showAlert) {
  // Product 5.0: 効果測定・測定履歴は次フェーズで実装予定です。
  // 現在はメニューから直接実行された場合もデータを変更せず、準備中として案内します。
  if (showAlert) sbmAlert_('準備中', '効果測定と測定履歴は次フェーズで実装します。現在のProduct 5.0では改善中シートで管理してください。');
  return 0;
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


function sbmParseDate_(v) {
  if (!v) return null;
  if (Object.prototype.toString.call(v) === '[object Date]') return v;
  var s = String(v).replace(/-/g,'/');
  var d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

function sbmDateAfterText_(days) { var d = new Date(); d.setDate(d.getDate()+days); return sbmDateText_(d); }

function sbmLog_(action,status,detail) { try { sbmAppendObject_(SBM_SHEETS.SYSTEM_LOG, SBM_HEADERS.SYSTEM_LOG, {CreatedAt:sbmNowText_(),Action:action,Status:status,Detail:detail||''}); } catch(e) { console.error(e); } }
function sbmDateText_(d) { return Utilities.formatDate(d, Session.getScriptTimeZone() || SBM_DEFAULTS.TIMEZONE, 'yyyy-MM-dd'); }
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
function sbmApplySheetUx_() { var ss=SpreadsheetApp.getActiveSpreadsheet(); [SBM_SHEETS.HOME, SBM_SHEETS.ARTICLE_DB, SBM_SHEETS.SETUP, SBM_SHEETS.LOG, SBM_SHEETS.IN_PROGRESS].forEach(function(n){ var s=ss.getSheetByName(n); if(s) s.showSheet(); }); sbmHideSystemSheets(); }


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
    sbmSetHomeProcessing_('● 処理中', '記事ランク再判定', startedText, '', '記事DBの保存済み数値だけで再判定しています。', true);
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
    sbmSetHomeProcessing_('完了', '記事ランク再判定', startedText, sbmNowText_(), out.length + '件を更新しました。', false);
    sbmAlert_('記事ランク再判定完了', out.length + '件の記事ランクを更新しました。\n作業状態は変更していません。');
  } catch(e) {
    sbmSetHomeProcessing_('エラー', '記事ランク再判定', startedText, sbmNowText_(), String(e), false);
    sbmAlert_('記事ランク再判定エラー', String(e));
  }
}
