/**
 * SIMS-Blog-Manager Product 5.0 RC4
 * SIMS-Core Slim Edition for blog SEO improvement management.
 * End-user distribution file: paste this entire file into Code.gs/Code.js.
 */

const SBM_VERSION = '5.0.0-rc4';
const SBM_SHEETS = Object.freeze({
  HOME: 'ホーム',
  TODAY: '今日の改善',
  LOG: '改善ログ',
  SETUP: 'セットアップ',
  CARDS: '記事カルテ',
  QUERY_DATA: 'クエリデータ',
  DIAGNOSIS: '記事診断',
  EFFECT: '効果測定',
  SETTINGS: 'Settings',
  SYSTEM_LOG: 'System_Log',
  BRIEF: '改善ブリーフ',
  MEASURE_HISTORY: '測定履歴',
  CANNIBAL: 'カニバリ診断',
  TOPICS: '記事ネタ候補'
});

const SBM_HEADERS = Object.freeze({
  SETTINGS: ['Key', 'Value', 'Description', 'UpdatedAt'],
  SYSTEM_LOG: ['CreatedAt', 'Action', 'Status', 'Detail'],
  QUERY_DATA: ['StartDate','EndDate','Query','URL','Clicks','Impressions','CTR','Position','CapturedAt'],
  CARDS: ['ArticleId','URL','Title','MainQuery','Clicks','Impressions','CTR','Position','Managed','ArticleStatus','OpportunityScore','Recommendation','LastImprovedAt','ImproveCount','LastAnalyzedAt'],
  DIAGNOSIS: ['URL','Title','MainQuery','SubQueries','FAQQueries','SeparateArticleQueries','NoiseQueries','QuerySummary','Clicks','Impressions','CTR','Position','DiagnosisCode','Diagnosis','Recommendation','EstimatedMinutes','OpportunityScore','Reason','AnalyzedAt'],
  TODAY: ['優先','時間','記事タイトル','メインクエリ','改善内容','記事を開く','詳細','完了','Title','H1','Description','冒頭文','H2/H3','FAQ','内部リンク','本文追記','その他','メモ','Score','URL','状態','完了日'],
  LOG: ['改善日','記事タイトル','URL','メインクエリ','改善内容','修正内容','所要時間','メモ','初回測定日','7日測定完了日','状態','改善前CTR','改善前順位','改善前クリック','改善前表示回数'],
  EFFECT: ['記事タイトル','URL','改善日','改善内容','修正内容','経過日数','改善前順位','現在順位','順位変化','改善前CTR','現在CTR','CTR変化','改善前クリック','現在クリック','クリック変化','判定','SIMS評価','次のアクション','次の確認','コメント'],
  BRIEF: ['BriefId','URL','記事タイトル','メインクエリ','サブクエリ','FAQ候補','別記事候補','除外クエリ','クエリ分析','カニバリ診断','診断','推奨改善','理由','推定時間','Score','CTR','Position','Clicks','Impressions','改善依頼文','作成日時'],
  MEASURE_HISTORY: ['記録日','記事タイトル','URL','改善日','経過日数','現在順位','現在CTR','現在クリック','現在表示回数','判定メモ'],
  CANNIBAL: ['判定','共通クエリ','記事Aタイトル','記事A URL','記事Aクリック','記事A順位','記事Bタイトル','記事B URL','記事Bクリック','記事B順位','推奨対応','理由','確認日'],
  TOPICS: ['候補日','候補クエリ','元記事タイトル','元記事URL','理由','優先度','Claude用メモ','状態']
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
  MEASURE_DAYS: '14,30',
  TEST_DAILY_DAYS: 7,
  MEASUREMENT_MODE: 'TEST_DAILY_7D',
  TIMEZONE: 'Asia/Tokyo'
});

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('SIMS-Blog-Manager')
    .addItem('ホームを開く', 'sbmOpenHome')
    .addSeparator()
    .addSubMenu(SpreadsheetApp.getUi().createMenu('セットアップ')
      .addItem('STEP1 ブログ情報を登録', 'sbmSetupStep1BlogInfo')
      .addItem('STEP2 Google Cloud APIガイドを開く', 'sbmSetupStep2ApiGuide')
      .addItem('STEP3 Search Console接続テスト', 'sbmSetupStep3ConnectionTest')
      .addItem('STEP4 初回データ取得', 'sbmSetupStep4InitialFetch')
      .addItem('セットアップシートを開く', 'sbmOpenSetup'))
    .addSeparator()
    .addItem('今日のデータを取得・分析', 'sbmDailyUpdateManual')
    .addSubMenu(SpreadsheetApp.getUi().createMenu('今日の改善')
      .addItem('今日の改善を開く', 'sbmOpenToday')
      .addItem('選択行の改善ブリーフを開く', 'sbmShowSelectedBrief')
      .addItem('選択行の記事を開く', 'sbmOpenSelectedArticle')
      .addItem('選択行を完了にする', 'sbmCompleteSelectedImprovement')
      .addItem('効果測定を更新', 'sbmUpdateEffectiveness')
      .addItem('テスト用：今日の測定を記録', 'sbmRecordTodayMeasurement')
      .addItem('測定履歴を開く', 'sbmOpenMeasureHistory')
      .addItem('カニバリ診断を開く', 'sbmOpenCannibal')
      .addItem('記事ネタ候補を開く', 'sbmOpenTopics')
      .addSeparator()
      .addItem('おすすめ5件表示にする', 'sbmSetTodayTop5')
      .addItem('改善候補をすべて表示する', 'sbmSetTodayAll'))
    .addItem('改善ログを開く', 'sbmOpenLog')
    .addItem('効果測定を開く', 'sbmOpenEffect')
    .addSeparator()
    .addSubMenu(SpreadsheetApp.getUi().createMenu('管理')
      .addItem('シートを作成・修復', 'sbmInitializeSheets')
      .addItem('システムシートを表示', 'sbmShowSystemSheets')
      .addItem('システムシートを非表示', 'sbmHideSystemSheets')
      .addItem('エラー・ログを開く', 'sbmOpenSystemLog'))
    .addToUi();

  try {
    sbmLightStartup_();
  } catch (e) {
    console.error(e);
  }
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
      var res = ui.alert('本日のデータ取得', '本日はまだSearch Consoleデータを取得していません。\n取得・分析を実行しますか？', ui.ButtonSet.YES_NO);
      if (res === ui.Button.YES) sbmDailyUpdateManual();
    }
  }
}

function sbmInitializeSheets(showAlert) {
  showAlert = showAlert !== false;
  sbmEnsureDataSheets_();
  sbmMigrateRc3Headers_();
  sbmEnsureDefaultSettings_();
  sbmEnsureUserSheets_();
  sbmApplySheetUx_();
  sbmRefreshHome_();
  sbmLog_('InitializeSheets','Done','Product 4.2 sheets initialized');
  if (showAlert) sbmAlert_('初期化完了', '必要なシートを作成・修復しました。\n次に、メニュー「SIMS-Blog-Manager」→「セットアップ」→「STEP1 ブログ情報を登録」を実行してください。');
}

function sbmEnsureDataSheets_() {
  var dataMap = {
    SETTINGS: SBM_SHEETS.SETTINGS,
    SYSTEM_LOG: SBM_SHEETS.SYSTEM_LOG,
    QUERY_DATA: SBM_SHEETS.QUERY_DATA,
    CARDS: SBM_SHEETS.CARDS,
    DIAGNOSIS: SBM_SHEETS.DIAGNOSIS,
    BRIEF: SBM_SHEETS.BRIEF,
    TODAY: SBM_SHEETS.TODAY,
    LOG: SBM_SHEETS.LOG,
    EFFECT: SBM_SHEETS.EFFECT,
    MEASURE_HISTORY: SBM_SHEETS.MEASURE_HISTORY,
    CANNIBAL: SBM_SHEETS.CANNIBAL,
    TOPICS: SBM_SHEETS.TOPICS
  };
  Object.keys(dataMap).forEach(function(k){
    var sheet = sbmGetOrCreateSheet_(dataMap[k]);
    sbmEnsureHeaders_(sheet, SBM_HEADERS[k]);
    sbmStyleDataSheet_(sheet);
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
  sbmSetSettingIfEmpty_('MeasurementMode', SBM_DEFAULTS.MEASUREMENT_MODE, '効果測定モード。TEST_DAILY_7Dはテスト用に毎日7日分を確認');
}

function sbmEnsureUserSheets_() {
  sbmBuildHomeSheet_();
  sbmBuildSetupSheet_();
  sbmBuildTodaySheetView_();
  sbmBuildLogSheetView_();
  sbmBuildBriefSheetView_();
  sbmBuildEffectSheetView_();
  sbmStyleCannibalSheet_(sbmGetOrCreateSheet_(SBM_SHEETS.CANNIBAL));
  sbmStyleTopicSheet_(sbmGetOrCreateSheet_(SBM_SHEETS.TOPICS));
}

function sbmBuildHomeSheet_() {
  var sh = sbmGetOrCreateSheet_(SBM_SHEETS.HOME);
  sh.clear();
  var values = [
    ['SIMS-Blog-Manager', 'ブログ改善で迷わない。今日やることが30秒で決まる。'],
    ['バージョン', SBM_VERSION],
    ['初回認証について', '最初にApps Scriptを実行するとGoogleの承認画面が表示されます。正常な動作です。許可後、同じSTEPをもう一度実行してください。'],
    ['', ''],
    ['現在の状態', ''],
    ['次にやること', ''],
    ['', ''],
    ['今日のおすすめ改善', '未作成'],
    ['推定時間', '-'],
    ['改善候補数', '0'],
    ['本日の改善時間', sbmGetSetting_('DailyMinutes', SBM_DEFAULTS.DAILY_MINUTES) + '分'],
    ['管理対象割合', sbmGetSetting_('ManagedRatio', SBM_DEFAULTS.MANAGED_RATIO)],
    ['', ''],
    ['セットアップ状況', '状態'],
    ['STEP1 ブログ情報', ''],
    ['STEP2 Google Cloud APIガイド', ''],
    ['STEP3 Search Console接続', ''],
    ['STEP4 初回データ取得', ''],
    ['', ''],
    ['登録ブログ名', ''],
    ['ブログURL', ''],
    ['Search Consoleプロパティ', ''],
    ['接続状態', ''],
    ['最終取得日', ''],
    ['', ''],
    ['最近の成果', ''],
    ['成功', '0件'],
    ['横ばい', '0件'],
    ['要再改善', '0件'],
    ['測定待ち', '0件'],
    ['', ''],
    ['操作', 'メニュー「SIMS-Blog-Manager」からSTEPを順番に実行してください。']
  ];
  sh.getRange(1,1,values.length,2).setValues(values);
  sh.setColumnWidths(1,1,190);
  sh.setColumnWidths(2,1,680);
  sbmStyleUserSheet_(sh, '#0b8043');
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
function sbmBuildCannibalSheetView_() { sbmStyleCannibalSheet_(sbmGetOrCreateSheet_(SBM_SHEETS.CANNIBAL)); }

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
  sbmInitializeSheets(false);
  if (!sbmIsSetupComplete_() || sbmGetSetting_('ConnectionStatus','') !== 'OK') {
    return sbmAlert_('データ取得はまだできません', 'STEP1〜STEP3を完了してから実行してください。\n日次取得も接続テスト成功までは実行されません。');
  }
  try {
    var rows = sbmFetchSearchConsoleQueries_();
    sbmWriteQueryData_(rows);
    sbmBuildDiagnosis_();
    sbmBuildCannibalDiagnosis_();
    sbmBuildTodayQueue_();
    try { sbmUpdateEffectivenessSilent_(); } catch(ignore) {}
    sbmSetSetting_('LastFetchDate', sbmDateText_(new Date()), '最終取得日');
    sbmLog_('DailyUpdate','Done', rows.length + ' rows');
    sbmRefreshHome_();
    sbmOpenToday();
    sbmAlert_('取得・分析完了', 'Search Consoleデータを取得し、今日の改善を更新しました。\n取得件数: ' + rows.length + '件');
  } catch (e) {
    sbmLog_('DailyUpdate','Error',String(e));
    sbmAlert_('取得・分析エラー', sbmFriendlyGscError_(String(e)));
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
  var data = sbmSearchConsoleApiRequest_(property, {startDate: range.startDate, endDate: range.endDate, dimensions: ['query','page'], rowLimit: Number(sbmGetSetting_('MaxQueryRows', SBM_DEFAULTS.MAX_QUERY_ROWS)) || SBM_DEFAULTS.MAX_QUERY_ROWS});
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
  var sh = sbmGetOrCreateSheet_(SBM_SHEETS.QUERY_DATA);
  sh.clear();
  sbmEnsureHeaders_(sh, SBM_HEADERS.QUERY_DATA);
  if (rows.length) sh.getRange(2,1,rows.length,SBM_HEADERS.QUERY_DATA.length).setValues(rows);
  sbmStyleDataSheet_(sh);
}

function sbmBuildDiagnosis_() {
  var queryRows = sbmRowsAsObjects_(SBM_SHEETS.QUERY_DATA);
  var byUrl = {};
  queryRows.forEach(function(q){
    var url = String(q.URL || '');
    if (!url) return;
    if (!byUrl[url]) byUrl[url] = [];
    byUrl[url].push(q);
  });
  var urls = Object.keys(byUrl);
  var articleStats = urls.map(function(url){
    var rows = byUrl[url];
    var impressions = rows.reduce(function(s,r){return s + sbmNumber_(r.Impressions);},0);
    return {url:url, impressions:impressions};
  }).sort(function(a,b){return b.impressions-a.impressions;});
  var ratio = sbmRatioNumber_(sbmGetSetting_('ManagedRatio', SBM_DEFAULTS.MANAGED_RATIO));
  var managedCount = Math.max(1, Math.ceil(articleStats.length * ratio));
  var managedMap = {};
  articleStats.slice(0, managedCount).forEach(function(a){managedMap[a.url] = true;});

  var cardRows = [];
  var diagnosisRows = [];
  var topicRows = [];
  urls.forEach(function(url){
    var rows = byUrl[url].sort(function(a,b){return sbmQueryScore_(b)-sbmQueryScore_(a);});
    var main = rows[0];
    if (!main) return;
    var totalClicks = rows.reduce(function(s,r){return s + sbmNumber_(r.Clicks);},0);
    var totalImpressions = rows.reduce(function(s,r){return s + sbmNumber_(r.Impressions);},0);
    var weightedPosition = totalImpressions ? rows.reduce(function(s,r){return s + sbmNumber_(r.Position)*sbmNumber_(r.Impressions);},0) / totalImpressions : sbmNumber_(main.Position);
    var ctr = totalImpressions ? totalClicks / totalImpressions : 0;
    var managed = !!managedMap[url];
    var diag = sbmDiagnose_(totalClicks,totalImpressions,ctr,weightedPosition,rows);
    var score = managed ? sbmOpportunityScore_(totalImpressions, ctr, weightedPosition, diag.minutes) : 0;
    var classified = sbmClassifyQueries_(main.Query, rows.slice(1, Number(sbmGetSetting_('RelatedQueries', SBM_DEFAULTS.RELATED_QUERIES)) + 1));
    var title = sbmResolveArticleTitle_(url, '');
    var important = classified.support.join('\n');
    var body = classified.support.slice(5).join('\n');
    var faq = classified.faq.join('\n');
    var separate = classified.separate.join('\n');
    var noise = classified.noise.join('\n');
    var qSummary = classified.summary;
    cardRows.push([sbmId_('ART'), url, title, main.Query, totalClicks, totalImpressions, ctr, weightedPosition, managed ? '○' : '×', managed ? diag.status : '管理対象外', score, diag.recommendation, '', 0, sbmNowText_()]);
    if (managed && totalImpressions >= sbmNumber_(sbmGetSetting_('MinImpressions', SBM_DEFAULTS.MIN_IMPRESSIONS))) {
      diagnosisRows.push([url, title, main.Query, important, faq, separate, noise, qSummary, totalClicks, totalImpressions, ctr, weightedPosition, diag.code, diag.diagnosis, diag.recommendation, diag.minutes, score, diag.reason, sbmNowText_()]);
      classified.separate.forEach(function(q){
        topicRows.push([sbmDateText_(new Date()), q, title, url, '元記事のメインクエリと検索意図が異なるため、別記事候補として保存', sbmStars_(Math.min(100, score + 10)), '次のキーワードで新記事の構成案を作ってください。\nキーワード: ' + q + '\n元記事: ' + title + '\n元記事URL: ' + url, '未着手']);
      });
    }
  });
  sbmRewriteSheet_(SBM_SHEETS.CARDS, SBM_HEADERS.CARDS, cardRows);
  sbmRewriteSheet_(SBM_SHEETS.DIAGNOSIS, SBM_HEADERS.DIAGNOSIS, diagnosisRows.sort(function(a,b){return b[16]-a[16];}));
  sbmRewriteSheet_(SBM_SHEETS.TOPICS, SBM_HEADERS.TOPICS, sbmUniqueTopicRows_(topicRows));
  sbmStyleTopicSheet_(sbmGetOrCreateSheet_(SBM_SHEETS.TOPICS));
}

function sbmBuildTodayQueue_() {
  var diag = sbmRowsAsObjects_(SBM_SHEETS.DIAGNOSIS).sort(function(a,b){return sbmNumber_(b.OpportunityScore)-sbmNumber_(a.OpportunityScore);});
  var mode = String(sbmGetSetting_('TodayDisplayMode','TOP5'));
  var limit = mode === 'ALL' ? Math.min(200, diag.length) : (sbmNumber_(sbmGetSetting_('QueueLimit', SBM_DEFAULTS.QUEUE_LIMIT)) || 5);
  var out = [];
  var briefRows = [];
  for (var i=0; i<diag.length && out.length<limit; i++) {
    var d = diag[i];
    var rawUrl = String(d.URL || '');
    var url = sbmNormalizeUrl_(rawUrl);
    var m = sbmNumber_(d.EstimatedMinutes) || 10;
    var title = sbmResolveArticleTitle_(url, d.Title || '');
    var score = sbmNumber_(d.OpportunityScore);
    var openFormula = '=HYPERLINK("' + String(url).replace(/"/g,'""') + '","記事を開く")';
    var cannibal = sbmCannibalAdviceForUrl_(url, d.MainQuery);
    var requestText = sbmImprovementRequestText_(title, url, d.MainQuery, d.SubQueries, d.FAQQueries, d.SeparateArticleQueries, d.NoiseQueries, d.QuerySummary, cannibal, d.Reason, d.Recommendation);
    out.push([sbmStars_(score), m + '分', title, d.MainQuery, d.Recommendation, openFormula, false, false, false, false, false, false, false, false, false, false, false, '', score, url, '未着手', '']);
    briefRows.push([sbmId_('BRF'), url, title, d.MainQuery, d.SubQueries || '', d.FAQQueries || '', d.SeparateArticleQueries || '', d.NoiseQueries || '', d.QuerySummary || '', cannibal || '', d.Diagnosis || '', d.Recommendation || '', d.Reason || '', m, score, d.CTR || '', d.Position || '', d.Clicks || '', d.Impressions || '', requestText, sbmNowText_()]);
  }
  sbmRewriteSheet_(SBM_SHEETS.TODAY, SBM_HEADERS.TODAY, out);
  sbmRewriteSheet_(SBM_SHEETS.BRIEF, SBM_HEADERS.BRIEF, briefRows);
  sbmStyleTodaySheet_(sbmGetOrCreateSheet_(SBM_SHEETS.TODAY));
  sbmStyleBriefSheet_(sbmGetOrCreateSheet_(SBM_SHEETS.BRIEF));
  sbmOpenToday();
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

function sbmResolveArticleTitle_(url, fallback) {
  fallback = String(fallback || '').trim();
  if (fallback && fallback !== url && fallback.indexOf('http') !== 0) return fallback;
  url = sbmNormalizeUrl_(url);
  var cache = CacheService.getScriptCache();
  var key = 'title:' + Utilities.base64EncodeWebSafe(url).slice(0,180);
  var cached = cache.get(key);
  if (cached) return cached;
  var title = '';
  try {
    var res = UrlFetchApp.fetch(url, {muteHttpExceptions:true, followRedirects:true, headers:{'User-Agent':'SIMS-Blog-Manager'}});
    var html = res.getContentText() || '';
    var m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    if (m && m[1]) {
      title = m[1].replace(/\s+/g,' ').replace(/&amp;/g,'&').replace(/&#124;/g,'|').trim();
      title = title.split(' - ')[0].split(' | ')[0].trim();
    }
  } catch(e) {}
  if (!title) title = sbmTitleFromPath_(url);
  if (title.length > 80) title = title.substring(0,80) + '…';
  cache.put(key, title, 21600);
  return title;
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
  var rows = sbmRowsAsObjects_(SBM_SHEETS.QUERY_DATA);
  var byQuery = {};
  rows.forEach(function(r){
    var q = String(r.Query || '').trim();
    var url = sbmNormalizeUrl_(r.URL || '');
    if (!q || !url) return;
    var key = sbmNormalizeQueryText_(q);
    if (!byQuery[key]) byQuery[key] = [];
    byQuery[key].push({query:q, url:url, clicks:sbmNumber_(r.Clicks), impressions:sbmNumber_(r.Impressions), position:sbmNumber_(r.Position)});
  });
  var out=[];
  Object.keys(byQuery).forEach(function(k){
    var list = byQuery[k].sort(function(a,b){ return b.clicks - a.clicks || a.position - b.position; });
    var unique = [];
    var seen = {};
    list.forEach(function(x){ if(!seen[x.url]){ seen[x.url]=true; unique.push(x);} });
    if (unique.length < 2) return;
    var a=unique[0], b=unique[1];
    var total = a.clicks + b.clicks;
    if (total < 2 && (a.impressions + b.impressions) < 100) return;
    var gap = Math.abs(a.position - b.position);
    var judgment = gap <= 3 ? '🔴 高' : gap <= 8 ? '🟡 中' : '🟢 低';
    var aTitle = sbmResolveArticleTitle_(a.url, '');
    var bTitle = sbmResolveArticleTitle_(b.url, '');
    var advice = '';
    var reason = '';
    if (judgment.indexOf('高') !== -1) {
      advice = (a.clicks >= b.clicks ? '記事Aを主記事候補。記事Bはメインクエリ変更または統合を検討。' : '記事Bを主記事候補。記事Aはメインクエリ変更または統合を検討。');
      reason = '同じクエリで複数URLが近い順位に出ており、クリックが分散している可能性があります。';
    } else if (judgment.indexOf('中') !== -1) {
      advice = '検索意図が近い場合は統合、違う場合はメインクエリを分けて維持。';
      reason = '同一クエリで複数URLが表示されています。順位差があるため、強い記事を主軸に整理してください。';
    } else {
      advice = '現時点では経過観察。別検索意図の記事として維持できる可能性があります。';
      reason = '同一クエリで複数URLがありますが、順位差があるため緊急度は低めです。';
    }
    out.push([judgment, a.query, aTitle, a.url, a.clicks, a.position, bTitle, b.url, b.clicks, b.position, advice, reason, sbmNowText_()]);
  });
  out.sort(function(x,y){ return String(x[0]).localeCompare(String(y[0])); });
  sbmRewriteSheet_(SBM_SHEETS.CANNIBAL, SBM_HEADERS.CANNIBAL, out.slice(0,200));
  sbmStyleCannibalSheet_(sbmGetOrCreateSheet_(SBM_SHEETS.CANNIBAL));
}

function sbmCannibalAdviceForUrl_(url, mainQuery) {
  var rows = sbmRowsAsObjects_(SBM_SHEETS.CANNIBAL);
  url = sbmNormalizeUrl_(url || '');
  var hits = [];
  rows.forEach(function(r){
    if (String(r['記事A URL']) === url || String(r['記事B URL']) === url || sbmNormalizeQueryText_(r['共通クエリ']) === sbmNormalizeQueryText_(mainQuery)) {
      hits.push(String(r['判定'] || '') + ' ' + String(r['共通クエリ'] || '') + ': ' + String(r['推奨対応'] || ''));
    }
  });
  return hits.length ? hits.slice(0,3).join('\n') : '現時点で強いカニバリ候補は見つかっていません。';
}

function sbmDiagnose_(clicks, impressions, ctr, position, rows) {
  var ctrPct = ctr * 100;
  if (position <= 5 && ctrPct < 3) return {code:'D01', status:'改善候補', diagnosis:'上位表示だがCTRが低い', recommendation:'タイトル・ディスクリプション・導入文を優先確認', minutes:10, reason:'順位は高い一方でクリック率に改善余地があります。'};
  if (position <= 10 && ctrPct < 2.5) return {code:'D02', status:'改善候補', diagnosis:'1ページ目でCTR改善余地あり', recommendation:'タイトル・導入文・検索意図の一致確認', minutes:15, reason:'表示回数があるため、クリック率改善で成果が見込めます。'};
  if (position > 10 && position <= 20) return {code:'D03', status:'改善候補', diagnosis:'2ページ目上位で伸びしろあり', recommendation:'H2追加・本文補強・FAQ追加', minutes:30, reason:'少しの補強で1ページ目入りを狙える可能性があります。'};
  if (position > 20 && position <= 40) return {code:'D04', status:'改善候補', diagnosis:'順位改善余地あり', recommendation:'本文補強・構成見直し', minutes:40, reason:'検索意図を補強すると順位改善が期待できます。'};
  if (rows.length >= 15) return {code:'D05', status:'改善候補', diagnosis:'関連クエリが多い', recommendation:'FAQ追加・見出し補強', minutes:20, reason:'関連クエリが多く、本文やFAQで拾える余地があります。'};
  return {code:'D00', status:'良好/様子見', diagnosis:'大きな改善シグナルなし', recommendation:'様子見', minutes:10, reason:'現時点では優先度が高くありません。'};
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

function sbmRefreshHome_() {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SBM_SHEETS.HOME);
  if (!sh) return;
  var setup1 = sbmGetSetting_('SetupBlogInfo','NO') === 'YES';
  var setup2 = sbmGetSetting_('SetupApiGuide','NO') === 'YES';
  var conn = sbmGetSetting_('ConnectionStatus','未確認');
  var setup4 = sbmGetSetting_('SetupInitialFetch','NO') === 'YES';
  var next = 'メニュー「SIMS-Blog-Manager」からSTEP1を実行してください。';
  var state = 'セットアップ未完了';
  if (setup1 && !setup2) next = 'STEP2 Google Cloud APIガイドを開いてください。';
  if (setup1 && setup2 && conn !== 'OK') next = 'STEP3 Search Console接続テストを実行してください。';
  if (setup1 && setup2 && conn === 'OK' && !setup4) next = 'STEP4 初回データ取得を実行してください。';
  if (setup1 && setup2 && conn === 'OK' && setup4) { state = '運用可能'; next = '今日のデータを取得・分析、または今日の改善を確認してください。'; }
  sh.getRange('B5').setValue(state);
  sh.getRange('B6').setValue(next);
  var today = sbmRowsAsObjects_(SBM_SHEETS.TODAY);
  sh.getRange('B8').setValue(today.length ? today[0]['記事タイトル'] + ' / ' + today[0]['改善内容'] : '未作成');
  sh.getRange('B9').setValue(today.length ? today[0]['時間'] : '-');
  sh.getRange('B10').setValue(today.length);
  sh.getRange('B11').setValue(sbmGetSetting_('DailyMinutes', SBM_DEFAULTS.DAILY_MINUTES) + '分');
  sh.getRange('B12').setValue(sbmGetSetting_('ManagedRatio', SBM_DEFAULTS.MANAGED_RATIO));
  sh.getRange('B15').setValue(setup1 ? '☑ 完了' : '□ 未完了');
  sh.getRange('B16').setValue(setup2 ? '☑ ガイド表示済み' : '□ 未完了');
  sh.getRange('B17').setValue(conn === 'OK' ? '☑ 接続OK' : '□ ' + conn);
  sh.getRange('B18').setValue(setup4 ? '☑ 完了' : '□ 未完了');
  sh.getRange('B20').setValue(sbmGetSetting_('BlogName','未入力'));
  sh.getRange('B21').setValue(sbmGetSetting_('BlogUrl','未入力'));
  sh.getRange('B22').setValue(sbmGetSetting_('SearchConsoleProperty','未入力'));
  sh.getRange('B23').setValue(conn);
  sh.getRange('B24').setValue(sbmGetSetting_('LastFetchDate','未取得'));
  var eff = sbmRowsAsObjects_(SBM_SHEETS.EFFECT);
  var ok=0, flat=0, retry=0, wait=0;
  eff.forEach(function(r){ var o=String(r['判定']||r.Outcome||''); if(o==='成功') ok++; else if(o==='横ばい') flat++; else if(o==='要再改善') retry++; else wait++; });
  sh.getRange('B27').setValue(ok + '件');
  sh.getRange('B28').setValue(flat + '件');
  sh.getRange('B29').setValue(retry + '件');
  sh.getRange('B30').setValue(wait + '件');
}


function sbmIsSetupComplete_() { return sbmGetSetting_('SetupBlogInfo','NO') === 'YES' && sbmGetSetting_('SetupApiGuide','NO') === 'YES'; }
function sbmOpenHome() { sbmRefreshHome_(); sbmOpenSheet_(SBM_SHEETS.HOME); }
function sbmOpenSetup() { sbmOpenSheet_(SBM_SHEETS.SETUP); }
function sbmOpenToday() { sbmOpenSheet_(SBM_SHEETS.TODAY); }
function sbmOpenLog() { sbmOpenSheet_(SBM_SHEETS.LOG); }
function sbmOpenEffect() { sbmOpenSheet_(SBM_SHEETS.EFFECT); }
function sbmOpenMeasureHistory() { sbmOpenSheet_(SBM_SHEETS.MEASURE_HISTORY); }
function sbmOpenCannibal() { sbmOpenSheet_(SBM_SHEETS.CANNIBAL); }
function sbmOpenTopics() { sbmOpenSheet_(SBM_SHEETS.TOPICS); }
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
  sbmRefreshHome_();
  if (showAlert) sbmAlert_('完了しました', '改善ログへ記録しました。\n\n修正内容: ' + (actions || '未選択'));
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
    if (sh.getName() !== SBM_SHEETS.TODAY) return;
    var row = e.range.getRow();
    if (row <= 1) return;
    var map = sbmHeaderMap_(sh);
    var col = e.range.getColumn();
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
function sbmHideSystemSheets() { [SBM_SHEETS.SETTINGS, SBM_SHEETS.SYSTEM_LOG, SBM_SHEETS.QUERY_DATA, SBM_SHEETS.CARDS, SBM_SHEETS.DIAGNOSIS, SBM_SHEETS.BRIEF].forEach(function(n){ var s=SpreadsheetApp.getActiveSpreadsheet().getSheetByName(n); if(s) s.hideSheet(); }); sbmOpenHome(); }

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

function sbmRewriteSheet_(sheetName, headers, rows) { var sh=sbmGetOrCreateSheet_(sheetName); sh.clear(); sbmEnsureHeaders_(sh, headers); if(rows.length) sh.getRange(2,1,rows.length,headers.length).setValues(rows); sbmStyleDataSheet_(sh); }
function sbmGetOrCreateSheet_(name) { var ss=SpreadsheetApp.getActiveSpreadsheet(); return ss.getSheetByName(name) || ss.insertSheet(name); }
function sbmOpenSheet_(name) { var sh=sbmGetOrCreateSheet_(name); sh.showSheet(); SpreadsheetApp.getActiveSpreadsheet().setActiveSheet(sh); return sh; }
function sbmEnsureHeaders_(sh, headers) { if (sh.getLastRow() < 1 || sh.getLastColumn() < headers.length || sh.getRange(1,1,1,Math.max(1,sh.getLastColumn())).getValues()[0].join('') === '') sh.getRange(1,1,1,headers.length).setValues([headers]); sh.setFrozenRows(1); }
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
    + 'カニバリ診断:\n' + (cannibalAdvice || '-') + '\n\n'
    + '依頼:\nメインクエリを軸に、サブクエリだけを本文・見出し・FAQへ自然に反映して改善してください。別記事候補や除外クエリはこの記事に無理に入れないでください。必要なら最後に「別記事として作るべきテーマ」を提案してください。カニバリ候補がある場合は、どちらを主記事にするか、統合するか、メインクエリを分けるかの方針も提案してください。';
}

function sbmBriefHtml_(b) {
  function esc(v){ return String(v || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>'); }
  var request = b['改善依頼文'] || sbmImprovementRequestText_(b['記事タイトル'], b.URL, b['メインクエリ'], b['サブクエリ'], b['FAQ候補'], b['別記事候補'], b['除外クエリ'], b['クエリ分析'], b['カニバリ診断'], b['理由'], b['推奨改善']);
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
    + '<h3>カニバリ診断</h3><p>' + esc(b['カニバリ診断']) + '</p>'
    + '<h3>Claude / ChatGPT に貼り付ける改善依頼</h3>'
    + '<textarea style="width:100%;height:230px;font-family:monospace;font-size:12px;white-space:pre-wrap">' + String(request || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</textarea>'
    + '<hr><p>推定時間: ' + esc(b['推定時間']) + '分 / Score: ' + esc(b.Score) + '</p>'
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
    effectRows.push([displayTitle || '', url, l['改善日']||'', l['改善内容']||'', l['修正内容']||'', elapsed, beforePos, nowPos || '', posDelta, beforeCtr, nowCtr || '', ctrDelta, beforeClicks, nowClicks || '', clickDelta, outcome, simsEval, nextAction, next, '']);
    if (elapsed !== '' && elapsed <= SBM_DEFAULTS.TEST_DAILY_DAYS) {
      historyRowsToAppend.push([sbmDateText_(today), displayTitle || '', url, l['改善日']||'', elapsed, nowPos || '', nowCtr || '', nowClicks || '', nowImpressions || '', outcome]);
    }
  });
  sbmRewriteSheet_(SBM_SHEETS.EFFECT, SBM_HEADERS.EFFECT, effectRows);
  sbmAppendMeasurementHistoryUnique_(historyRowsToAppend);
  sbmStyleEffectSheet_(sbmGetOrCreateSheet_(SBM_SHEETS.EFFECT));
  sbmStyleMeasureHistorySheet_(sbmGetOrCreateSheet_(SBM_SHEETS.MEASURE_HISTORY));
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
    return '改善内容を見直し、別記事候補・カニバリ候補も確認してください。';
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
  rows.forEach(function(r){ var key = String(r[0]) + '|' + String(r[2]) + '|' + String(r[3]); if (!seen[key]) { seen[key] = true; add.push(r); } });
  if (add.length) sh.getRange(sh.getLastRow()+1,1,add.length,SBM_HEADERS.MEASURE_HISTORY.length).setValues(add);
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
    sh.setColumnWidth(1,140);
    sh.setColumnWidth(2,300);
    sh.setColumnWidth(3,1);
    sh.hideColumns(3);
    sh.setColumnWidth(4,170);
    sh.setColumnWidth(5,220);
    sh.setColumnWidth(6,260);
    sh.setColumnWidth(7,90);
    sh.setColumnWidth(8,300);
    sh.setColumnWidths(9,2,110);
    sh.setColumnWidth(11,110);
    sh.setRowHeights(2, Math.max(1, sh.getLastRow()-1), 42);
  } catch(e) {}
}
function sbmStyleEffectSheet_(sh) {
  sbmStyleDataSheet_(sh);
  try {
    sh.setFrozenRows(1);
    sh.setColumnWidth(1,300);
    sh.setColumnWidth(2,1);
    sh.hideColumns(2);
    sh.setColumnWidth(3,140);
    sh.setColumnWidth(4,220);
    sh.setColumnWidth(5,220);
    sh.setColumnWidth(6,80);
    sh.setColumnWidths(7,9,90);
    sh.setColumnWidth(16,120);
    sh.setColumnWidth(17,360);
    sh.setColumnWidth(18,300);
    sh.setColumnWidth(19,120);
    sh.setColumnWidth(20,260);
    sh.setRowHeights(2, Math.max(1, sh.getLastRow()-1), 42);
  } catch(e) {}
}
function sbmStyleMeasureHistorySheet_(sh) {
  sbmStyleDataSheet_(sh);
  try { sh.setFrozenRows(1); sh.setColumnWidth(1,110); sh.setColumnWidth(2,300); sh.setColumnWidth(3,1); sh.hideColumns(3); sh.setColumnWidth(4,140); sh.setColumnWidth(5,80); sh.setColumnWidths(6,4,95); sh.setColumnWidth(10,130); } catch(e) {}
}
function sbmStyleCannibalSheet_(sh) {
  sbmStyleDataSheet_(sh);
  try {
    sh.setFrozenRows(1);
    sh.setColumnWidth(1,80); sh.setColumnWidth(2,180); sh.setColumnWidth(3,260); sh.setColumnWidth(4,1); sh.hideColumns(4);
    sh.setColumnWidth(5,90); sh.setColumnWidth(6,80); sh.setColumnWidth(7,260); sh.setColumnWidth(8,1); sh.hideColumns(8);
    sh.setColumnWidth(9,90); sh.setColumnWidth(10,80); sh.setColumnWidth(11,320); sh.setColumnWidth(12,360); sh.setColumnWidth(13,140);
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
