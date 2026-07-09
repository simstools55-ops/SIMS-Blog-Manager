/**
 * SIMS-Blog-Manager Product 5.0 RC8.1
 * SIMS-Core Slim Edition for blog SEO improvement management.
 * End-user distribution file: paste this entire file into Code.gs/Code.js.
 */

const SBM_VERSION = '5.0.0-stepb-fast-datalist-title-fix';
const SBM_SHEETS = Object.freeze({
  HOME: 'Home',
  TODAY: '今日の改善',
  LOG: '改善ログ',
  SETUP: 'セットアップ',
  CARDS: '記事カルテ',
  QUERY_DATA: 'データ一覧',
  RAW_DATA: 'SearchConsole_Data',
  DIAGNOSIS: 'ブログ診断',
  EFFECT: '効果測定',
  SETTINGS: 'Settings',
  SYSTEM_LOG: 'System_Log',
  BRIEF: '改善ブリーフ',
  MEASURE_HISTORY: '測定履歴',
  CANNIBAL: 'カニバリ診断',
  TOPICS: '記事ネタ候補',
  PROCESS_LOG: '処理ログ',
  IN_PROGRESS: '改善中',
  TOP_PAGES: '上位ページ診断'
});

const SBM_HEADERS = Object.freeze({
  SETTINGS: ['Key', 'Value', 'Description', 'UpdatedAt'],
  SYSTEM_LOG: ['CreatedAt', 'Action', 'Status', 'Detail'],
  QUERY_DATA: ['記事ステータス','記事URL','H1タイトル','titleタグ','メインクエリ','クリック数','表示回数','CTR','平均順位'],
  RAW_DATA: ['StartDate','EndDate','Query','URL','Clicks','Impressions','CTR','Position','CapturedAt'],
  CARDS: ['ArticleId','URL','Title','MainQuery','Clicks','Impressions','CTR','Position','Managed','ArticleStatus','OpportunityScore','Recommendation','LastImprovedAt','ImproveCount','LastAnalyzedAt'],
  DIAGNOSIS: ['URL','Title','MainQuery','SubQueries','FAQQueries','SeparateArticleQueries','NoiseQueries','QuerySummary','Clicks','Impressions','CTR','Position','DiagnosisCode','Diagnosis','Recommendation','EstimatedMinutes','OpportunityScore','Reason','AnalyzedAt'],
  TODAY: ['優先','時間','記事タイトル','メインクエリ','改善内容','記事を開く','詳細','完了','Title','H1','Description','冒頭文','H2/H3','FAQ','内部リンク','本文追記','その他','メモ','Score','URL','状態','完了日'],
  LOG: ['改善日','記事タイトル','URL','メインクエリ','改善内容','修正内容','所要時間','メモ','初回測定日','7日測定完了日','状態','改善前CTR','改善前順位','改善前クリック','改善前表示回数'],
  EFFECT: ['記事タイトル','改善日','改善内容','判定','SIMS評価','次のアクション','詳細','URL','修正内容','経過日数','改善前順位','現在順位','順位変化','改善前CTR','現在CTR','CTR変化','改善前クリック','現在クリック','クリック変化','次の確認','コメント'],
  BRIEF: ['BriefId','URL','記事タイトル','メインクエリ','サブクエリ','FAQ候補','別記事候補','除外クエリ','クエリ分析','診断','推奨改善','理由','推定時間','Score','CTR','Position','Clicks','Impressions','改善依頼文','作成日時'],
  MEASURE_HISTORY: ['記事タイトル','改善日','記録日','経過日数','現在順位','現在CTR','現在クリック','現在表示回数','判定メモ','URL'],
  CANNIBAL: ['判定','共通クエリ','記事Aタイトル','記事Bタイトル','推奨対応','詳細','記事A URL','記事Aクリック','記事A順位','記事B URL','記事Bクリック','記事B順位','理由','確認日'],
  TOPICS: ['候補日','候補クエリ','元記事タイトル','元記事URL','理由','優先度','Claude用メモ','状態'],
  PROCESS_LOG: ['日時','処理','状態','対象件数','処理件数','所要秒','詳細'],
  IN_PROGRESS: ['改善日','記事タイトル','経過日数','状態','SIMS評価','次のアクション','詳細','URL','修正内容','改善内容'],
  TOP_PAGES: ['記事タイトル','メインクエリ','状態','優先度','詳細','URL','クリック','表示回数','CTR','平均順位','現状パターン','主な課題','改善アプローチ','診断理由','診断日']
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
  MEASURE_DAYS: '14,30',
  TEST_DAILY_DAYS: 7,
  MEASUREMENT_MODE: 'TEST_DAILY_7D',
  ANALYSIS_CANDIDATE_LIMIT: 30,
  ANALYSIS_ARTICLE_LIMIT: 120,
  TITLE_FETCH_DEFAULT: 'ON',
  TOP_PAGE_LIMIT: 20,
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
      .addItem('STEP B 改善候補を分析', 'sbmAnalyzeOnlyManual')
      .addItem('データ一覧を開く', 'sbmOpenDataListSafe_')
      .addItem('処理ログを開く', 'sbmOpenProcessLog'))
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
  [SBM_SHEETS.HOME, SBM_SHEETS.TODAY, SBM_SHEETS.BRIEF, SBM_SHEETS.QUERY_DATA, SBM_SHEETS.IN_PROGRESS, SBM_SHEETS.DIAGNOSIS, SBM_SHEETS.PROCESS_LOG, SBM_SHEETS.SETUP, SBM_SHEETS.LOG, SBM_SHEETS.SETTINGS, SBM_SHEETS.SYSTEM_LOG, SBM_SHEETS.RAW_DATA].forEach(function(n){ keep[n] = true; });
  var retired = ['上位ページ診断','カニバリ診断','記事ネタ候補','効果測定','測定履歴','記事カルテ','ホーム','クエリデータ','記事診断'];
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
  sbmSetSettingIfEmpty_('AnalysisCandidateLimit', SBM_DEFAULTS.ANALYSIS_CANDIDATE_LIMIT, '分析後に保存する改善候補数');
  sbmSetSettingIfEmpty_('AnalysisArticleLimit', SBM_DEFAULTS.ANALYSIS_ARTICLE_LIMIT, 'STEP Bで実際に重い分析を行う最大記事数。タイムアウト対策用');
  sbmSetSettingIfEmpty_('FetchArticleTitles', SBM_DEFAULTS.TITLE_FETCH_DEFAULT, '記事タイトル取得を外部アクセスで行うか。データ一覧のH1/titleタグ表示に使用');
  sbmSetSettingIfEmpty_('DataListTitleFetch', 'OFF', 'STEP Bでは外部取得しない。タイトル補完は別処理で行う');
  sbmSetSettingIfEmpty_('LastFetchRows', '0', '直近のSearch Console取得行数');
  sbmSetSettingIfEmpty_('DailyFetchMaxRows', SBM_DEFAULTS.DAILY_FETCH_MAX_ROWS, 'STEP Aの日次取得上限。高速化のため通常1500件');
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
    ['STEP4', '初回データ取得を行い、記事カルテ・記事診断・今日の改善を作成します。'],
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
  try {
    sbmSetHomeProcessing_('● 処理中', 'Search Consoleデータ取得開始', startedText, '', 'Search Console APIから最新データを取得しています。', true);
    var fetchStarted = new Date();
    var rows = sbmFetchSearchConsoleQueries_();
    var apiSec = sbmSecondsSince_(fetchStarted);
    var writeStarted = new Date();
    sbmWriteRawQueryDataLight_(rows);
    var writeSec = sbmSecondsSince_(writeStarted);
    var sec = sbmSecondsSince_(started);
    sbmSetSetting_('LastFetchDate', sbmDateText_(new Date()), '最終取得日');
    sbmSetSetting_('LastFetchRows', rows.length, '直近のSearch Console取得行数');
    sbmSetSetting_('LastFetchSeconds', sec, '直近のSearch Console取得秒数');
    sbmSetSetting_('LastFetchAt', sbmNowText_(), '直近のSearch Console取得日時');
    sbmProcessLog_('STEP A Search Consoleデータ取得', '完了', rows.length, rows.length, sec, 'API取得 ' + apiSec + '秒 / シート書込 ' + writeSec + '秒 / 上限 ' + sbmGetDailyFetchLimit_() + '件', startedText, sbmNowText_());
    sbmLog_('FetchOnly','Done', rows.length + ' rows / ' + sec + ' sec');
    sbmSetHomeProcessing_('完了', 'STEP A Search Consoleデータ取得', startedText, sbmNowText_(), rows.length + '件取得しました。API ' + apiSec + '秒 / 書込 ' + writeSec + '秒', false);
    if (!silent) sbmAlert_('データ取得完了', 'Search Consoleデータの取得が完了しました。\n取得件数: ' + rows.length + '件\n所要時間: ' + sec + '秒\n\n次に「STEP B 改善候補を分析」を実行してください。');
  } catch (e) {
    var secErr = sbmSecondsSince_(started);
    sbmProcessLog_('STEP A Search Consoleデータ取得', 'エラー', '', '', secErr, String(e), startedText, sbmNowText_());
    sbmLog_('FetchOnly','Error',String(e));
    sbmSetHomeProcessing_('エラー', 'STEP A Search Consoleデータ取得', startedText, sbmNowText_(), String(e), false);
    sbmAlert_('データ取得エラー', sbmFriendlyGscError_(String(e)));
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
  var qRows = sbmGetRawQueryRows_();
  if (!qRows.length) return sbmAlert_('分析できません', '先に「STEP A Search Consoleデータ取得だけ実行」を実行してください。');
  var started = new Date();
  var startedText = sbmNowText_();
  try {
    sbmSetHomeProcessing_('● 処理中', 'STEP B 改善候補分析開始', startedText, '', '取得済みデータから改善候補・今日の改善・データ一覧を作成しています。', true);
    sbmToast_('改善候補を分析中です。対象記事を絞って処理します。', 'STEP B 改善分析', 10);
    var result = sbmBuildDiagnosis_();
    sbmSetHomeProcessing_('● 処理中', 'STEP B 今日の改善作成中', startedText, '', '改善候補から今日の改善と改善ブリーフを作成しています。', true);
    sbmBuildTodayQueue_();
    sbmSetHomeProcessing_('● 処理中', 'STEP B 改善中シート更新中', startedText, '', '改善中の記事を整理しています。', true);
    sbmBuildInProgressSheet_();
    sbmSetHomeProcessing_('● 処理中', 'STEP B データ一覧更新中', startedText, '', '利用者向けのデータ一覧を作成しています。', true);
    var dataListCount = sbmBuildDataListFromAnalysis_();
    sbmRemoveRetiredSheets_();
    sbmApplyProductVisibleTabs_();
    var sec = sbmSecondsSince_(started);
    sbmSetSetting_('LastAnalyzeSeconds', sec, '直近の改善分析秒数');
    sbmProcessLog_('STEP B 改善候補分析', '完了', (result && result.targetCount) || '', (result && result.analyzedCount) || '', sec, 'データ一覧 ' + dataListCount + '件。改善候補 ' + sbmGetSetting_('ImprovementCandidateCount','0') + '件 / 表示 ' + sbmGetSetting_('DisplayedImprovementCount','0') + '件', startedText, sbmNowText_());
    sbmLog_('AnalyzeOnly','Done', 'analyzed ' + ((result && result.analyzedCount)||'') + ' / ' + sec + ' sec');
    sbmRefreshHome_();
    sbmSetHomeProcessing_('完了', 'STEP B 改善候補分析', startedText, sbmNowText_(), '改善候補とデータ一覧を更新しました。', false);
    sbmOpenToday();
    var total = sbmGetSetting_('ImprovementCandidateCount','0');
    var shown = sbmGetSetting_('DisplayedImprovementCount','0');
    var managed = sbmGetSetting_('ManagedArticleCount','0');
    if (!silent) sbmAlert_('改善分析完了', '改善候補を作成しました。\n管理対象記事: ' + managed + '件\n分析記事: ' + ((result && result.analyzedCount)||'') + '件\n改善候補: ' + total + '件\n表示中: ' + shown + '件\nデータ一覧: ' + dataListCount + '件\n所要時間: ' + sec + '秒');
  } catch (e) {
    var secErr = sbmSecondsSince_(started);
    sbmProcessLog_('STEP B 改善候補分析', 'エラー', qRows.length, '途中', secErr, String(e), startedText, sbmNowText_());
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
  var range = sbmSearchConsoleDateRange_();
  var property = sbmGetSetting_('SearchConsoleProperty','');
  var data = sbmSearchConsoleApiRequest_(property, {startDate: range.startDate, endDate: range.endDate, dimensions: ['query','page'], rowLimit: sbmGetDailyFetchLimit_()});
  var capturedAt = sbmNowText_();
  return (data.rows || []).map(function(r){
    return [range.startDate, range.endDate, r.keys[0], r.keys[1], r.clicks || 0, r.impressions || 0, r.ctr || 0, r.position || 0, capturedAt];
  });
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
  sbmRemoveRetiredSheets_();
  sbmApplyProductVisibleTabs_();
}

function sbmBuildDiagnosis_() {
  var queryRows = sbmGetRawQueryRows_();
  var byUrl = {};
  queryRows.forEach(function(q){
    var url = sbmNormalizeUrl_(String(q.URL || ''));
    if (!url) return;
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

  var cardRows = [];
  var diagnosisRows = [];
  var analyzed = 0;
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
    var diag = sbmDiagnose_(totalClicks,totalImpressions,ctr,weightedPosition,rows);
    var score = managed ? sbmOpportunityScore_(totalImpressions, ctr, weightedPosition, diag.minutes) : 0;
    var titleInfo = sbmResolveArticleTitleInfo_(url, '', false);
    var title = sbmSafeArticleTitleCell_(titleInfo.h1 || titleInfo.titleTag || '', url) || String(main.Query || '') || sbmTitleFromPath_(url);
    cardRows.push([sbmId_('ART'), url, title, main.Query, totalClicks, totalImpressions, ctr, weightedPosition, managed ? '○' : '×', managed ? (targeted ? diag.status : '管理対象・未分析') : '管理対象外', score, diag.recommendation, '', 0, sbmNowText_()]);
    if (!targeted) return;
    analyzed++;
    if (totalImpressions < sbmNumber_(sbmGetSetting_('MinImpressions', SBM_DEFAULTS.MIN_IMPRESSIONS))) return;
    var classified = sbmClassifyQueries_(main.Query, rows.slice(1, Number(sbmGetSetting_('RelatedQueries', SBM_DEFAULTS.RELATED_QUERIES)) + 1));
    var important = classified.support.join('\n');
    var faq = classified.faq.join('\n');
    var separate = classified.separate.join('\n');
    var noise = classified.noise.join('\n');
    var qSummary = classified.summary;
    diagnosisRows.push([url, title, main.Query, important, faq, separate, noise, qSummary, totalClicks, totalImpressions, ctr, weightedPosition, diag.code, diag.diagnosis, diag.recommendation, diag.minutes, score, diag.reason, sbmNowText_()]);
  });
  sbmRewriteSheet_(SBM_SHEETS.CARDS, SBM_HEADERS.CARDS, cardRows);
  sbmRewriteSheet_(SBM_SHEETS.DIAGNOSIS, SBM_HEADERS.DIAGNOSIS, diagnosisRows.sort(function(a,b){return b[16]-a[16];}));
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
    var todayTitleInfo = sbmResolveArticleTitleInfo_(url, d.Title || '', false);
    var title = sbmSafeArticleTitleCell_(todayTitleInfo.h1 || todayTitleInfo.titleTag || d.Title || '', url) || String(d.MainQuery || '') || sbmTitleFromPath_(url);
    var score = sbmNumber_(d.OpportunityScore);
    var openFormula = '=HYPERLINK("' + String(url).replace(/"/g,'""') + '","記事を開く")';
    var requestText = sbmImprovementRequestText_(title, url, d.MainQuery, d.SubQueries, d.FAQQueries, d.SeparateArticleQueries, d.NoiseQueries, d.QuerySummary, '', d.Reason, d.Recommendation);
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
  if (/^https?:\/\//i.test(url)) return url;
  if (/^sc-domain:/i.test(url)) return url;
  return 'https://' + url.replace(/^\/+/, '');
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

function sbmUniqueTopicRows_(rows) {
  var seen = {}, out = [];
  rows.forEach(function(r){
    var key = String(r[1]) + '|' + String(r[3]);
    if (!seen[key]) { seen[key] = true; out.push(r); }
  });
  return out.slice(0, 300);
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

function sbmBuildCannibalDiagnosis_() {
  // Product 5.0: カニバリ診断は未実装。シート生成もしない。
  sbmRemoveRetiredSheets_();
  return [];
}


function sbmCannibalAdviceForUrl_(url, mainQuery) {
  // Product 5.0: カニバリ診断は未実装。改善ブリーフには出さない。
  return '';
}


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
  var cards = sbmRowsAsObjects_(SBM_SHEETS.CARDS);
  var diag = sbmRowsAsObjects_(SBM_SHEETS.DIAGNOSIS);
  var inProg = sbmRowsAsObjects_(SBM_SHEETS.IN_PROGRESS);
  var diagByUrl = {};
  diag.forEach(function(d){ diagByUrl[sbmNormalizeUrl_(d.URL || '')] = d; });
  var inProgMap = {};
  inProg.forEach(function(r){ var u = sbmNormalizeUrl_(r.URL || ''); if (u) inProgMap[u] = true; });
  var out = [];
  cards.forEach(function(c){
    var url = sbmNormalizeUrl_(c.URL || '');
    if (!url) return;
    var d = diagByUrl[url] || {};
    var status = inProgMap[url] ? '改善中' : sbmDataListStatus_(c, d);
    var fallbackTitle = sbmSafeArticleTitleCell_(c.Title || d.Title || '', url);
    var titleInfo = sbmResolveArticleTitleInfo_(url, fallbackTitle, false);
    var h1 = sbmSafeArticleTitleCell_(titleInfo.h1 || fallbackTitle, url);
    var titleTag = sbmSafeArticleTitleCell_(titleInfo.titleTag || '', url);
    var main = c.MainQuery || d.MainQuery || '';
    var clicks = sbmNumber_(c.Clicks || d.Clicks);
    var imps = sbmNumber_(c.Impressions || d.Impressions);
    var ctr = c.CTR !== '' && c.CTR !== undefined ? c.CTR : d.CTR;
    var pos = c.Position !== '' && c.Position !== undefined ? c.Position : d.Position;
    out.push([status, url, h1, titleTag, main, clicks, imps, ctr, pos]);
  });
  out.sort(function(a,b){
    var order = {'良好':1,'改善中':2,'改善候補':3,'様子見':4,'管理対象外':5};
    var ao = order[a[0]] || 99, bo = order[b[0]] || 99;
    if (ao !== bo) return ao - bo;
    return sbmNumber_(b[6]) - sbmNumber_(a[6]);
  });
  sbmRewriteSheet_(SBM_SHEETS.QUERY_DATA, SBM_HEADERS.QUERY_DATA, out);
  var sh = sbmGetOrCreateSheet_(SBM_SHEETS.QUERY_DATA);
  sbmStyleDataListSheet_(sh);
  return out.length;
}

function sbmDataListStatus_(card, diag) {
  if (String(card.Managed || '') === '×') return '管理対象外';
  var st = String(diag.DiagnosisCode || diag['DiagnosisCode'] || '').trim();
  var dStatus = String(diag.Diagnosis || '');
  var cardStatus = String(card.ArticleStatus || '');
  if (cardStatus.indexOf('管理対象外') !== -1) return '管理対象外';
  if (st && st !== 'D00') return '改善候補';
  if (cardStatus.indexOf('改善候補') !== -1) return '改善候補';
  if (cardStatus.indexOf('良好') !== -1) return '良好';
  if (cardStatus.indexOf('様子見') !== -1 || !diag.URL) return '様子見';
  return '良好';
}

function sbmStyleDataListSheet_(sh) {
  if (!sh) return;
  sbmEnsureHeaders_(sh, SBM_HEADERS.QUERY_DATA);
  sh.setFrozenRows(1);
  sh.setColumnWidth(1, 120);
  sh.setColumnWidth(2, 280);
  sh.setColumnWidth(3, 320);
  sh.setColumnWidth(4, 320);
  sh.setColumnWidth(5, 220);
  sh.setColumnWidth(6, 90);
  sh.setColumnWidth(7, 90);
  sh.setColumnWidth(8, 80);
  sh.setColumnWidth(9, 90);
  sh.getRange(1,1,1,SBM_HEADERS.QUERY_DATA.length).setBackground('#0b8043').setFontColor('#ffffff').setFontWeight('bold');
  sh.getDataRange().setWrap(true).setVerticalAlignment('middle');
}

function sbmOpenDataListSafe_() { sbmOpenSheetByName_(SBM_SHEETS.QUERY_DATA); }
function sbmOpenDashboardSafe_() { sbmOpenSheetByName_(SBM_SHEETS.DIAGNOSIS); }
function sbmRefreshHome_() {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SBM_SHEETS.HOME);
  if (!sh) return;
  var rows = sbmRowsAsObjects_(SBM_SHEETS.QUERY_DATA);
  var today = sbmRowsAsObjects_(SBM_SHEETS.TODAY);
  var inProg = sbmRowsAsObjects_(SBM_SHEETS.IN_PROGRESS);
  var total = Number(sbmGetSetting_('ManagedArticleCount','0')) || sbmUniqueUrlCount_(rows) || rows.length;
  var good = Number(sbmGetSetting_('GoodArticleCount','0')) || 0;
  var candidates = Number(sbmGetSetting_('ImprovementCandidateCount','0')) || today.length || 0;
  var pct = total ? Math.round(good / total * 100) : 0;
  sh.getRange('B5').setValue(total + '件');
  sh.getRange('B6').setValue(good + '件 / ' + total + '件（' + pct + '%）');
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
function sbmOpenCannibal() { sbmAlert_('未実装', 'カニバリ診断はProduct 5.0では未実装です。'); }
function sbmOpenTopics() { sbmAlert_('未実装', '記事ネタ候補はProduct 5.0では未実装です。'); }
function sbmOpenTopPages() { sbmAlert_('未実装', '上位ページ診断はProduct 5.0では未実装です。'); }
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
    if (sheetName === SBM_SHEETS.CANNIBAL && map['詳細'] && col === map['詳細'] && String(e.value).toUpperCase() === 'TRUE') {
      sh.getRange(row, col).setValue(false);
      sh.setActiveRange(sh.getRange(row, 1));
      sbmShowCannibalDetailForRow_(row);
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



function sbmShowSystemSheets() { [SBM_SHEETS.SETTINGS, SBM_SHEETS.SYSTEM_LOG, SBM_SHEETS.QUERY_DATA, SBM_SHEETS.CARDS, SBM_SHEETS.DIAGNOSIS, SBM_SHEETS.BRIEF].forEach(function(n){ var s=SpreadsheetApp.getActiveSpreadsheet().getSheetByName(n); if(s) s.showSheet(); }); }
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
function sbmImprovementRequestText_(title, url, mainQuery, subQueries, faqQueries, separateQueries, noiseQueries, querySummary, cannibalAdvice, reason, recommendation) {
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

function sbmShowSelectedCannibalDetail() {
  sbmAlert_('未実装', 'カニバリ診断はProduct 5.0では未実装です。');
}


function sbmShowCannibalDetailForRow_(row) {
  sbmAlert_('未実装', 'カニバリ診断はProduct 5.0では未実装です。');
}


function sbmCannibalDetailHtml_(o) {
  return '<div>Product 5.0では未実装です。</div>';
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
  var logs = sbmRowsAsObjects_(SBM_SHEETS.LOG);
  var cards = sbmRowsAsObjects_(SBM_SHEETS.CARDS);
  var byUrl = {};
  cards.forEach(function(c){ byUrl[sbmNormalizeUrl_(String(c.URL))] = c; });
  var today = new Date();
  var effectRows = [];
  var historyRowsToAppend = [];
  logs.forEach(function(l){
    var url = sbmNormalizeUrl_(l.URL || '');
    var c = byUrl[url] || {};
    var displayTitle = l['記事タイトル'] || c.Title || sbmResolveArticleTitle_(url, '');
    if (!displayTitle || String(displayTitle).indexOf('http') === 0) displayTitle = sbmResolveArticleTitle_(url, displayTitle);
    var beforePos = sbmNumber_(l['改善前順位']);
    var nowPos = sbmNumber_(c.Position);
    var beforeCtr = sbmNumber_(l['改善前CTR']);
    var nowCtr = sbmNumber_(c.CTR);
    var beforeClicks = sbmNumber_(l['改善前クリック']);
    var nowClicks = sbmNumber_(c.Clicks);
    var nowImpressions = sbmNumber_(c.Impressions);
    var posDelta = beforePos && nowPos ? beforePos - nowPos : '';
    var ctrDelta = (nowCtr || 0) - (beforeCtr || 0);
    var clickDelta = (nowClicks || 0) - (beforeClicks || 0);
    var improvedAt = sbmParseDate_(l['改善日']);
    var elapsed = improvedAt ? Math.max(0, Math.floor((today - improvedAt) / 86400000)) : '';
    var outcome = '測定待ち';
    if (elapsed !== '' && elapsed <= SBM_DEFAULTS.TEST_DAILY_DAYS) {
      if ((posDelta && posDelta >= 2) || ctrDelta >= 0.005 || clickDelta >= 5) outcome = '改善傾向';
      else if ((posDelta && posDelta <= -3) || ctrDelta < -0.005) outcome = '要確認';
      else outcome = '様子見';
    } else if (elapsed !== '') {
      if ((posDelta && posDelta >= 2) || ctrDelta >= 0.005 || clickDelta >= 5) outcome = '成功';
      else if ((posDelta && posDelta <= -3) || ctrDelta < -0.005) outcome = '要再改善';
      else outcome = '横ばい';
    }
    var next = elapsed === '' ? '' : (elapsed < SBM_DEFAULTS.TEST_DAILY_DAYS ? '明日確認' : '7日テスト完了');
    var simsEval = sbmEvaluateEffectResult_(outcome, posDelta, ctrDelta, clickDelta);
    var nextAction = sbmSuggestNextAction_(outcome, l['改善内容'] || '', l['修正内容'] || '', posDelta, ctrDelta, clickDelta);
    effectRows.push([displayTitle || '', l['改善日']||'', l['改善内容']||'', outcome, simsEval, nextAction, false, url, l['修正内容']||'', elapsed, beforePos, nowPos || '', posDelta, beforeCtr, nowCtr || '', ctrDelta, beforeClicks, nowClicks || '', clickDelta, next, '']);
    if (elapsed !== '' && elapsed <= SBM_DEFAULTS.TEST_DAILY_DAYS) {
      historyRowsToAppend.push([displayTitle || '', l['改善日']||'', sbmDateText_(today), elapsed, nowPos || '', nowCtr || '', nowClicks || '', nowImpressions || '', outcome, url]);
    }
  });
  sbmRewriteSheet_(SBM_SHEETS.EFFECT, SBM_HEADERS.EFFECT, effectRows);
  sbmAppendMeasurementHistoryUnique_(historyRowsToAppend);
  sbmStyleEffectSheet_(sbmGetOrCreateSheet_(SBM_SHEETS.EFFECT));
  sbmStyleMeasureHistorySheet_(sbmGetOrCreateSheet_(SBM_SHEETS.MEASURE_HISTORY));
  sbmBuildInProgressSheet_();
  sbmRefreshHome_();
  if (showAlert) sbmAlert_('効果測定を更新しました', '改善ログをもとに効果測定を更新しました。\nRCテスト期間中は、改善後7日間だけ毎日、測定履歴に日次推移を記録できます。');
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
function sbmStyleCannibalSheet_(sh) {
  sbmStyleDataSheet_(sh);
  try {
    sh.setFrozenRows(1);
    sh.setColumnWidth(1,90);   // 判定
    sh.setColumnWidth(2,180);  // 共通クエリ
    sh.setColumnWidth(3,280);  // 記事A
    sh.setColumnWidth(4,280);  // 記事B
    sh.setColumnWidth(5,320);  // 推奨対応
    sh.setColumnWidth(6,70);   // 詳細
    sh.setColumnWidths(7,8,1);
    sh.hideColumns(7,8);
    if (sh.getLastRow() > 1) sh.getRange(2,6,sh.getLastRow()-1,1).insertCheckboxes();
    sh.setRowHeights(2, Math.max(1, sh.getLastRow()-1), 48);
  } catch(e) {}
}

function sbmStyleTopicSheet_(sh) {
  sbmStyleDataSheet_(sh);
  try {
    sh.setFrozenRows(1);
    sh.setColumnWidth(1,110);
    sh.setColumnWidth(2,240);
    sh.setColumnWidth(3,300);
    sh.setColumnWidth(4,1);
    sh.hideColumns(4);
    sh.setColumnWidth(5,320);
    sh.setColumnWidth(6,90);
    sh.setColumnWidth(7,420);
    sh.setColumnWidth(8,100);
    sh.setRowHeights(2, Math.max(1, sh.getLastRow()-1), 56);
  } catch(e) {}
}

function sbmStyleBriefSheet_(sh) {
  sbmStyleDataSheet_(sh);
  try { sh.hideSheet(); } catch(e) {}
}
function sbmStyleUserSheet_(sh, color) { var lc=Math.max(sh.getLastColumn(),2); var lr=Math.max(sh.getLastRow(),1); sh.setFrozenRows(1); sh.getRange(1,1,1,lc).setFontWeight('bold').setFontSize(15).setBackground(color).setFontColor('#ffffff'); sh.getRange(1,1,lr,lc).setVerticalAlignment('top').setWrap(true); sh.getRange(1,1,lr,lc).setBorder(true,true,true,true,true,true); }
function sbmApplySheetUx_() { var ss=SpreadsheetApp.getActiveSpreadsheet(); [SBM_SHEETS.HOME, SBM_SHEETS.TODAY, SBM_SHEETS.LOG, SBM_SHEETS.SETUP, SBM_SHEETS.EFFECT].forEach(function(n){ var s=ss.getSheetByName(n); if(s) s.showSheet(); }); sbmHideSystemSheets(); }


/**
 * Product 5.0 RC8.1: 上位ページ診断（RC7ベース再実装）
 * Search Console取得済みデータからクリック数上位ページを抽出し、ブログ全体のSEO状況を俯瞰する。
 * 重い処理を避けるため、データ取得や今日の改善分析とは分離して実行する。
 */
function sbmBuildTopPageDiagnosisManual() {
  sbmInitializeSheets(false);
  var rows = sbmRowsAsObjects_(SBM_SHEETS.QUERY_DATA);
  if (!rows.length) return sbmAlert_('上位ページ診断', '先に「STEP A Search Consoleデータ取得だけ実行」を実行してください。');
  var started = new Date();
  var startedText = sbmNowText_();
  try {
    sbmToast_('クリック数上位ページを診断中です。', 'STEP C 上位ページ診断', 8);
    var count = sbmBuildTopPageDiagnosis_();
    var sec = sbmSecondsSince_(started);
    sbmProcessLog_('STEP C 上位ページ診断', '完了', Number(sbmGetSetting_('TopPageLimit', SBM_DEFAULTS.TOP_PAGE_LIMIT)) || SBM_DEFAULTS.TOP_PAGE_LIMIT, count, sec, '利用者待ち時間を含む上位ページ診断処理全体。上位ページ診断を作成しました。', startedText, sbmNowText_());
    sbmSetSetting_('LastTopPageDiagnosisAt', sbmNowText_(), '上位ページ診断の最終実行日時');
    sbmRefreshHome_();
    sbmOpenTopPages();
    sbmAlert_('上位ページ診断完了', '上位ページ診断を作成しました。\n診断件数: ' + count + '件\n所要時間: ' + sec + '秒');
  } catch(e) {
    var secErr = sbmSecondsSince_(started);
    sbmProcessLog_('STEP C 上位ページ診断', 'エラー', '', '', secErr, String(e), startedText, sbmNowText_());
    sbmAlert_('上位ページ診断エラー', String(e));
  }
}

function sbmBuildTopPageDiagnosis_() {
  var queryRows = sbmRowsAsObjects_(SBM_SHEETS.QUERY_DATA);
  var titleByUrl = {};
  try {
    sbmRowsAsObjects_(SBM_SHEETS.CARDS).forEach(function(c){
      var u = sbmNormalizeUrl_(String(c.URL || ''));
      if (u && c.Title) titleByUrl[u] = String(c.Title);
    });
  } catch(e) {}
  var byUrl = {};
  queryRows.forEach(function(q){
    var url = sbmNormalizeUrl_(String(q.URL || ''));
    if (!url) return;
    if (!byUrl[url]) byUrl[url] = [];
    byUrl[url].push(q);
  });
  var pages = Object.keys(byUrl).map(function(url){
    var rows = byUrl[url].slice().sort(function(a,b){ return sbmQueryScore_(b) - sbmQueryScore_(a); });
    var clicks = rows.reduce(function(sum,r){ return sum + sbmNumber_(r.Clicks); }, 0);
    var impressions = rows.reduce(function(sum,r){ return sum + sbmNumber_(r.Impressions); }, 0);
    var position = impressions ? rows.reduce(function(sum,r){ return sum + sbmNumber_(r.Position) * sbmNumber_(r.Impressions); }, 0) / impressions : 0;
    var ctr = impressions ? clicks / impressions : 0;
    var main = rows[0] ? String(rows[0].Query || '') : '';
    var rawTitle = titleByUrl[url] || sbmResolveArticleTitle_(url, '', false);
    return {url:url, rows:rows, title:sbmCleanDisplayTitle_(rawTitle, url), mainQuery:main, clicks:clicks, impressions:impressions, ctr:ctr, position:position};
  }).sort(function(a,b){ return b.clicks - a.clicks; });

  var limit = Number(sbmGetSetting_('TopPageLimit', SBM_DEFAULTS.TOP_PAGE_LIMIT)) || SBM_DEFAULTS.TOP_PAGE_LIMIT;
  var targets = pages.slice(0, limit);
  var out = [];
  var now = sbmNowText_();
  targets.forEach(function(p){
    var d = sbmTopPageDiagnosisFor_(p);
    out.push([
      p.title,
      p.mainQuery,
      d.status,
      d.priority,
      '詳細を見る',
      p.url,
      p.clicks,
      p.impressions,
      p.ctr,
      p.position,
      d.pattern,
      d.issue,
      d.action,
      d.reason,
      now
    ]);
  });
  var sh = sbmGetOrCreateSheet_(SBM_SHEETS.TOP_PAGES);
  sh.clear();
  sbmEnsureHeaders_(sh, SBM_HEADERS.TOP_PAGES);
  if (out.length) sh.getRange(2,1,out.length,SBM_HEADERS.TOP_PAGES.length).setValues(sbmNormalizeRowsToWidth_(out, SBM_HEADERS.TOP_PAGES.length));
  sbmStyleTopPageSheet_(sh);
  return out.length;
}

function sbmTopPageDiagnosisFor_(p) {
  var ctrPct = p.ctr * 100;
  var status = '良好（維持）', priority = '★★☆☆☆', pattern = '順位・CTRともに良好', issue = '大きな問題は見つかりません', action = '維持・関連記事追加・内部リンク強化', reason = 'クリック数上位で安定しています。';
  if (p.position <= 5 && ctrPct < 3) {
    status = 'CTR改善'; priority = '★★★★★'; pattern = '順位は高いがCTRが低い'; issue = '検索結果でユーザーの目を引けていない可能性'; action = 'タイトル・ディスクリプション・導入文を優先改善'; reason = '平均順位は高い一方でCTRが低いため、クリック率改善の余地があります。';
  } else if (p.impressions >= 1000 && p.position > 5 && p.position <= 15) {
    status = 'リライト推奨'; priority = '★★★★☆'; pattern = '表示回数は多いが順位が伸び悩む'; issue = '需要はあるがコンテンツ競争力が不足している可能性'; action = '記事リライト・網羅性強化・検索意図の再確認'; reason = '表示回数が多く、順位改善でクリック増加が見込めます。';
  } else if (p.impressions >= 500 && p.position > 15 && p.position <= 30) {
    status = '全面改善'; priority = '★★★☆☆'; pattern = '表示回数はあるが順位が低い'; issue = '構成・情報量・検索意図の一致に課題がある可能性'; action = '構成見直し・大幅リライト・FAQ追加'; reason = '需要は確認できますが、順位改善にはやや大きな修正が必要です。';
  } else if (p.clicks < 3 && p.impressions >= 1000) {
    status = '要調査'; priority = '★★★☆☆'; pattern = '表示回数は多いがクリックが少ない'; issue = 'タイトル不一致・検索意図違い・競合の強さを確認'; action = '競合確認・タイトル改善・別記事化の検討'; reason = '表示されているのにクリックにつながっていません。';
  } else if (p.impressions < 100 && p.ctr >= 0.08) {
    status = '新記事展開'; priority = '★★★☆☆'; pattern = '表示回数は少ないがCTRが高い'; issue = 'ニッチだが刺さっているテーマ'; action = '関連記事展開・ロングテール拡張'; reason = '少ない表示でもクリックされており、関連記事展開の余地があります。';
  }
  return {status:status, priority:priority, pattern:pattern, issue:issue, action:action, reason:reason};
}

function sbmStyleTopPageSheet_(sh) {
  sbmEnsureHeaders_(sh, SBM_HEADERS.TOP_PAGES);
  sh.setFrozenRows(1);
  sh.setFrozenColumns(1);
  sh.getRange(1,1,1,SBM_HEADERS.TOP_PAGES.length).setFontWeight('bold').setBackground('#e8f0fe');
  var widths = [240,180,100,90,90,80,80,90,80,80,180,220,260,300,140];
  widths.forEach(function(w,i){ try { sh.setColumnWidth(i+1,w); } catch(e){} });
  try {
    sh.hideColumns(6, 10); // URL以降の詳細データは一覧では隠す。詳細ポップアップで確認。
  } catch(e) {}
  if (sh.getMaxRows() > 1) {
    sh.getRange(2,7,Math.max(1, sh.getMaxRows()-1),2).setNumberFormat('#,##0');
    sh.getRange(2,9,Math.max(1, sh.getMaxRows()-1),1).setNumberFormat('0.00%');
    sh.getRange(2,10,Math.max(1, sh.getMaxRows()-1),1).setNumberFormat('0.0');
  }
}

function sbmShowSelectedTopPageDetail() {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  if (sh.getName() !== SBM_SHEETS.TOP_PAGES) return sbmAlert_('上位ページ診断', '「上位ページ診断」シートで対象行を選択してから実行してください。');
  var row = sh.getActiveRange().getRow();
  if (row <= 1) return sbmAlert_('上位ページ診断', '診断行を選択してください。');
  var map = sbmHeaderMap_(sh);
  var obj = {};
  Object.keys(map).forEach(function(h){ obj[h] = sh.getRange(row, map[h]).getValue(); });
  var html = HtmlService.createHtmlOutput(sbmTopPageDetailHtml_(obj)).setWidth(760).setHeight(680);
  SpreadsheetApp.getUi().showModalDialog(html, '上位ページ診断 詳細');
}

function sbmTopPageDetailHtml_(r) {
  function e(v){ return sbmEscapeHtml_(String(v == null ? '' : v)); }
  function pct(v){ return (sbmNumber_(v)*100).toFixed(2) + '%'; }
  function pos(v){ return sbmNumber_(v).toFixed(1); }
  return '<div style="font-family:Arial,\'Noto Sans JP\',sans-serif;padding:22px;line-height:1.7;color:#202124">'
    + '<h2 style="margin-top:0">上位ページ診断</h2>'
    + '<h3>' + e(r['記事タイトル']) + '</h3>'
    + '<p><a href="' + e(r['URL']) + '" target="_blank">記事を開く</a></p>'
    + '<hr>'
    + '<p><b>メインクエリ:</b> ' + e(r['メインクエリ']) + '</p>'
    + '<p><b>状態:</b> ' + e(r['状態']) + '　<b>優先度:</b> ' + e(r['優先度']) + '</p>'
    + '<table style="border-collapse:collapse;width:100%;margin:12px 0">'
    + '<tr><th style="text-align:left;border-bottom:1px solid #ddd">クリック</th><th style="text-align:left;border-bottom:1px solid #ddd">表示回数</th><th style="text-align:left;border-bottom:1px solid #ddd">CTR</th><th style="text-align:left;border-bottom:1px solid #ddd">平均順位</th></tr>'
    + '<tr><td>' + sbmFormatInt_(r['クリック']) + '</td><td>' + sbmFormatInt_(r['表示回数']) + '</td><td>' + pct(r['CTR']) + '</td><td>' + pos(r['平均順位']) + '</td></tr>'
    + '</table>'
    + '<h3>現状パターン</h3><p>' + e(r['現状パターン']) + '</p>'
    + '<h3>主な課題</h3><p>' + e(r['主な課題']) + '</p>'
    + '<h3>改善アプローチ</h3><p>' + e(r['改善アプローチ']) + '</p>'
    + '<h3>診断理由</h3><p>' + e(r['診断理由']) + '</p>'
    + '<p style="margin-top:18px;color:#5f6368">この診断はSearch Consoleデータに基づく簡易診断です。記事改善の詳細作業は、改善ブリーフをSIMS-Core / Claudeへ渡して進めてください。</p>'
    + '</div>';
}

function sbmTopPageSummary_(rows) {
  var out = {};
  (rows || []).forEach(function(r){ var k = String(r['状態'] || '').trim(); if (!k) return; out[k] = (out[k] || 0) + 1; });
  return out;
}

function sbmFormatInt_(v) {
  var n = Math.round(sbmNumber_(v));
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
