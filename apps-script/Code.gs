/**
 * SIMS-Blog-Manager Product 5.0 RC8.1
 * SIMS-Core Slim Edition for blog SEO improvement management.
 * End-user distribution file: paste this entire file into Code.gs/Code.js.
 */

const SBM_VERSION = '5.0.0-url-filter-step-split-fix';
const SBM_SHEETS = Object.freeze({
  HOME: 'Home',
  TODAY: '今日の改善',
  LOG: '改善ログ',
  SETUP: 'セットアップ',
  QUERY_DATA: 'データ一覧',
  RAW_DATA: 'SearchConsole_Data',
  DIAGNOSIS: 'ブログ診断',
  EFFECT: '効果測定',
  SETTINGS: 'Settings',
  SYSTEM_LOG: 'System_Log',
  BRIEF: '改善ブリーフ',
  MEASURE_HISTORY: '測定履歴',
  PROCESS_LOG: '処理ログ',
  PROFILE_LOG: '処理プロファイル',
  IN_PROGRESS: '改善中'
});

const SBM_HEADERS = Object.freeze({
  SETTINGS: ['Key', 'Value', 'Description', 'UpdatedAt'],
  SYSTEM_LOG: ['CreatedAt', 'Action', 'Status', 'Detail'],
  QUERY_DATA: ['記事ステータス','記事タイトル','メインクエリ','クリック数','表示回数','CTR','平均順位','詳細','最終取得日時','記事URL','SEOタイトル（titleタグ）','メタディスクリプション'],
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
  SEARCH_DAYS: 28,
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
  META_FETCH_MAX_ROWS: 30,
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
      .addItem('STEP4 初回データ取得', 'sbmSetupStep4InitialFetch')
      .addItem('セットアップシートを開く', 'sbmOpenSetup'))
    .addSeparator()
    .addSubMenu(ui.createMenu('データ更新')
      .addItem('STEP A Search Consoleデータ取得だけ実行', 'sbmFetchOnlyManual')
      .addItem('STEP A-2 記事情報を補完', 'sbmSupplementArticleInfoManual')
      .addItem('STEP B 改善候補を分析', 'sbmAnalyzeOnlyManual')
      .addItem('データ一覧を開く', 'sbmOpenDataListSafe_')
      .addItem('選択行の詳細を表示', 'sbmShowSelectedDataListDetail')
      .addItem('処理ログを開く', 'sbmOpenProcessLog')
      .addItem('処理プロファイルを開く（開発用）', 'sbmOpenProfileLog'))
    .addSubMenu(ui.createMenu('今日の改善')
      .addItem('今日の改善を開く', 'sbmOpenToday')
      .addItem('選択行の改善ブリーフを開く', 'sbmShowSelectedBrief')
      .addItem('選択行の記事を開く', 'sbmOpenSelectedArticle')
      .addItem('選択行を完了にする', 'sbmCompleteSelectedImprovement')
      .addItem('改善中を開く', 'sbmOpenInProgress')
      .addSeparator()
      .addItem('おすすめ5件表示にする', 'sbmSetTodayTop5')
      .addItem('改善候補をすべて表示する', 'sbmSetTodayAll'))
    .addItem('ブログ診断を開く', 'sbmOpenDashboardSafe_')
    .addItem('処理ログを開く', 'sbmOpenProcessLog')
    .addSeparator()
    .addSubMenu(ui.createMenu('管理')
      .addItem('シートを作成・修復', 'sbmInitializeSheets')
      .addItem('システムシートを非表示', 'sbmHideSystemSheets')
      .addItem('エラー・ログを開く', 'sbmOpenSystemLog'))
    .addToUi();
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
  sbmEnsureDataSheets_();
  sbmMigrateRc3Headers_();
  sbmEnsureDefaultSettings_();
  sbmEnsureUserSheets_();
  sbmApplySheetUx_();
  sbmRemoveRetiredSheets_();
  sbmApplyProductVisibleTabs_();
  sbmRefreshHome_();
  sbmLog_('InitializeSheets','Done','Product 5.0 RC8.1 sheets initialized');
  if (showAlert) sbmAlert_('初期化完了', '必要なシートを作成・修復しました。\n次に、メニュー「SIMS-Blog-Manager」→「セットアップ」→「STEP1 ブログ情報を登録」を実行してください。');
}

function sbmEnsureDataSheets_() {
  // Product 5.0 Official: 現行運用に必要なシートだけを作成・修復します。
  sbmMigrateVisibleSheetNames_();
  var dataMap = {
    SETTINGS: SBM_SHEETS.SETTINGS,
    SYSTEM_LOG: SBM_SHEETS.SYSTEM_LOG,
    RAW_DATA: SBM_SHEETS.RAW_DATA,
    QUERY_DATA: SBM_SHEETS.QUERY_DATA,
    BRIEF: SBM_SHEETS.BRIEF,
    TODAY: SBM_SHEETS.TODAY,
    LOG: SBM_SHEETS.LOG,
    PROCESS_LOG: SBM_SHEETS.PROCESS_LOG,
    IN_PROGRESS: SBM_SHEETS.IN_PROGRESS,
    DIAGNOSIS: SBM_SHEETS.DIAGNOSIS
  };
  Object.keys(dataMap).forEach(function(k){
    var sheet = sbmGetOrCreateSheet_(dataMap[k]);
    sbmEnsureHeaders_(sheet, SBM_HEADERS[k]);
    sbmStyleDataSheet_(sheet);
  });
  sbmRemoveRetiredSheets_();
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
  [SBM_SHEETS.HOME, SBM_SHEETS.TODAY, SBM_SHEETS.BRIEF, SBM_SHEETS.QUERY_DATA, SBM_SHEETS.IN_PROGRESS, SBM_SHEETS.DIAGNOSIS, SBM_SHEETS.PROCESS_LOG, SBM_SHEETS.PROFILE_LOG, SBM_SHEETS.SETUP, SBM_SHEETS.LOG, SBM_SHEETS.SETTINGS, SBM_SHEETS.SYSTEM_LOG, SBM_SHEETS.RAW_DATA].forEach(function(n){ keep[n] = true; });
  var retired = ['上位ページ診断','カニバリ診断','記事ネタ候補','記事カルテ','ホーム','クエリデータ','記事診断'];
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
  sbmSetSettingIfEmpty_('QueueLimit', SBM_DEFAULTS.QUEUE_LIMIT, '今日の改善に表示する件数。通常は5件');
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
  sbmSetSettingIfEmpty_('QueryFetchPageLimit', SBM_DEFAULTS.QUERY_FETCH_PAGE_LIMIT, 'クエリ詳細を取得するページ数。標準50記事');
  sbmSetSettingIfEmpty_('ManagedArticleCount', '0', '直近の管理対象記事数');
  sbmSetSettingIfEmpty_('ImprovementCandidateCount', '0', '直近の改善候補数');
  sbmSetSettingIfEmpty_('DisplayedImprovementCount', '0', '今日の改善に表示している件数');
}

function sbmEnsureUserSheets_() {
  sbmBuildHomeSheet_();
  sbmBuildSetupSheet_();
  sbmBuildTodaySheetView_();
  sbmBuildBriefSheetView_();
  sbmBuildInProgressSheet_();
  sbmStyleProcessLogSheet_(sbmGetOrCreateSheet_(SBM_SHEETS.PROCESS_LOG));
  sbmStyleDataSheet_(sbmGetOrCreateSheet_(SBM_SHEETS.QUERY_DATA));
  sbmStyleDataSheet_(sbmGetOrCreateSheet_(SBM_SHEETS.DIAGNOSIS));
  sbmApplyProductVisibleTabs_();
}

function sbmApplyProductVisibleTabs_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var visible = {};
  [SBM_SHEETS.HOME, SBM_SHEETS.BRIEF, SBM_SHEETS.TODAY, SBM_SHEETS.QUERY_DATA, SBM_SHEETS.IN_PROGRESS, SBM_SHEETS.DIAGNOSIS, SBM_SHEETS.PROCESS_LOG].forEach(function(n){ visible[n] = true; });
  ss.getSheets().forEach(function(sh){
    try { if (visible[sh.getName()]) sh.showSheet(); else sh.hideSheet(); } catch(e) {}
  });
  var home = ss.getSheetByName(SBM_SHEETS.HOME);
  if (home) ss.setActiveSheet(home);
}


function sbmBuildHomeSheet_() {
  var sh = sbmGetOrCreateSheet_(SBM_SHEETS.HOME);
  sh.clear();
  var values = [
    ['SIMS-Blog-Manager','Product 5.0 Official','',''],
    ['毎日最初に見る画面','ブログ全体の状況・改善作業の状況・今日やることだけを表示します。','',''],
    ['','','',''],
    ['ブログ全体の状況','','改善作業の状況',''],
    ['総記事数','','今日の改善表示',''],
    ['良好記事数','','改善中記事数',''],
    ['改善候補数','','最終取得日',''],
    ['','','直近処理',''],
    ['','','',''],
    ['今日やること','','',''],
    ['次にやること','今日の改善を上から順番に実施してください。','',''],
    ['おすすめ改善','','',''],
    ['推定時間','','',''],
    ['','','',''],
    ['処理状況','','',''],
    ['現在の状態','待機中','実行中/最後の処理',''],
    ['開始時刻','','完了予定',''],
    ['経過時間','','処理結果',''],
    ['お願い','','','']
  ];
  sh.getRange(1,1,values.length,4).setValues(values);
  sh.setColumnWidths(1,1,170); sh.setColumnWidths(2,1,360); sh.setColumnWidths(3,1,170); sh.setColumnWidths(4,1,380);
  sh.setFrozenRows(1);
  sh.getRange('A1:D1').setBackground('#0b8043').setFontColor('#ffffff').setFontWeight('bold').setFontSize(14);
  sh.getRange('A4:D8').setBorder(true,true,true,true,true,true).setBackground('#f3f6f4');
  sh.getRange('A10:D13').setBorder(true,true,true,true,true,true).setBackground('#f8fbff');
  sh.getRange('A15:D19').setBorder(true,true,true,true,true,true).setBackground('#d9ead3');
  sh.getRange('A4:C4').setFontWeight('bold'); sh.getRange('A10').setFontWeight('bold'); sh.getRange('A15').setFontWeight('bold'); sh.getRange('A:A').setFontWeight('bold');
  sh.getRange('A1:D19').setVerticalAlignment('middle').setWrap(true);
}


function sbmBuildSetupSheet_() {
  var sh = sbmGetOrCreateSheet_(SBM_SHEETS.SETUP);
  sh.clear();
  var rows = [
    ['セットアップ', 'この順番で進めてください'],
    ['STEP1', 'ブログ名・ブログURL・Search Consoleプロパティをポップアップで登録します。'],
    ['STEP2', 'Google CloudでSearch Console APIを有効化します。ガイド画面のリンクをクリックします。'],
    ['STEP3', 'Search Console接続テストを行います。成功すると日次取得が有効になります。'],
    ['STEP4', '初回データ取得を行い、データ一覧・今日の改善を作成します。'],
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
  sbmAlert_('取得と分析は分けて実行します', 'タイムアウト防止のため、Product 5.0 RC7では処理を分割しました。\n\n1. STEP A Search Consoleデータ取得だけ実行\n2. STEP B 改善候補を分析\n\nこの順番で実行してください。');
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
  var limit = mode === 'ALL' ? Math.min(200, diag.length) : (sbmNumber_(sbmGetSetting_('QueueLimit', SBM_DEFAULTS.QUEUE_LIMIT)) || 5);
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

function sbmSetTodayTop5() { sbmSetSetting_('TodayDisplayMode','TOP5','今日の改善はおすすめ5件を表示'); sbmBuildTodayQueue_(); sbmRefreshHome_(); sbmAlert_('表示を変更しました','今日の改善をおすすめ5件表示にしました。'); }
function sbmSetTodayAll() { sbmSetSetting_('TodayDisplayMode','ALL','改善候補をすべて表示'); sbmBuildTodayQueue_(); sbmRefreshHome_(); sbmAlert_('表示を変更しました','改善候補をすべて表示しました。'); }


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

function sbmOpenDataListSafe_() { sbmOpenSheetByName_(SBM_SHEETS.QUERY_DATA); }
function sbmOpenDashboardSafe_() { sbmOpenSheetByName_(SBM_SHEETS.DIAGNOSIS); }
function sbmRefreshHome_() {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SBM_SHEETS.HOME);
  if (!sh) return;
  var rows = sbmRowsAsObjects_(SBM_SHEETS.QUERY_DATA);
  var today = sbmRowsAsObjects_(SBM_SHEETS.TODAY);
  var inProg = sbmRowsAsObjects_(SBM_SHEETS.IN_PROGRESS);
  var analyzedTotal = Number(sbmGetSetting_('ManagedArticleCount','0')) || sbmUniqueUrlCount_(rows) || rows.length;
  var detectedTotal = Number(sbmGetSetting_('TotalArticleCount','0')) || Number(sbmGetSetting_('LastFetchPageCount','0')) || sbmUniqueUrlCount_(rows) || rows.length;
  var manualTotal = Number(sbmGetSetting_('BlogTotalArticleCount','0')) || 0;
  var blogTotal = manualTotal || detectedTotal || analyzedTotal;
  var good = Number(sbmGetSetting_('GoodArticleCount','0')) || 0;
  var candidates = Number(sbmGetSetting_('ImprovementCandidateCount','0')) || today.length || 0;
  var pct = blogTotal ? Math.round(good / blogTotal * 100) : 0;
  sh.getRange('B5').setValue(blogTotal + '件' + (analyzedTotal && analyzedTotal !== blogTotal ? '（分析対象 ' + analyzedTotal + '件）' : ''));
  sh.getRange('B6').setValue(good + '件 / ' + blogTotal + '件（' + pct + '%）');
  sh.getRange('B7').setValue(candidates + '件');
  sh.getRange('D5').setValue(today.length + '件');
  sh.getRange('D6').setValue(inProg.length + '件');
  sh.getRange('D7').setValue(sbmGetSetting_('LastFetchDate','未取得'));
  sh.getRange('D8').setValue(sbmGetSetting_('LastProcessSummary',''));
  sh.getRange('B11').setValue('今日の改善を上から順番に実施してください。');
  sh.getRange('B12').setValue(today.length ? (today[0]['記事タイトル'] || today[0]['Title'] || today[0]['URL'] || '') + ' / ' + (today[0]['改善内容'] || '') : '未作成');
  sh.getRange('B13').setValue(today.length ? (today[0]['時間'] || today[0]['推定時間'] || '15分') : '-');
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
    if (!sh || sh.getName() !== SBM_SHEETS.QUERY_DATA) return;
    if (e.range.getRow() <= 1 || e.range.getColumn() !== 8) return;
    sbmShowSelectedDataListDetail();
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
    if (row <= 1) return;
    var map = sbmHeaderMap_(sh);
    var col = e.range.getColumn();
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
function sbmApplySheetUx_() { var ss=SpreadsheetApp.getActiveSpreadsheet(); [SBM_SHEETS.HOME, SBM_SHEETS.TODAY, SBM_SHEETS.LOG, SBM_SHEETS.SETUP, SBM_SHEETS.EFFECT].forEach(function(n){ var s=ss.getSheetByName(n); if(s) s.showSheet(); }); sbmHideSystemSheets(); }


function sbmFormatInt_(v) {
  var n = Math.round(sbmNumber_(v));
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
