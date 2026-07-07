/**
 * SIMS-Blog-Manager Product 4.3 RC1
 * SIMS-Core Slim Edition for blog SEO improvement management.
 * End-user distribution file: paste this entire file into Code.gs/Code.js.
 */

const SBM_VERSION = '4.3.0-rc1';
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
  BRIEF: '改善ブリーフ'
});

const SBM_HEADERS = Object.freeze({
  SETTINGS: ['Key', 'Value', 'Description', 'UpdatedAt'],
  SYSTEM_LOG: ['CreatedAt', 'Action', 'Status', 'Detail'],
  QUERY_DATA: ['StartDate','EndDate','Query','URL','Clicks','Impressions','CTR','Position','CapturedAt'],
  CARDS: ['ArticleId','URL','Title','MainQuery','Clicks','Impressions','CTR','Position','Managed','ArticleStatus','OpportunityScore','Recommendation','LastImprovedAt','ImproveCount','LastAnalyzedAt'],
  DIAGNOSIS: ['URL','Title','MainQuery','ImportantQueries','BodyQueries','FAQQueries','Clicks','Impressions','CTR','Position','DiagnosisCode','Diagnosis','Recommendation','EstimatedMinutes','OpportunityScore','Reason','AnalyzedAt'],
  TODAY: ['優先','時間','記事タイトル','メインクエリ','改善内容','記事を開く','詳細','完了','Title','H1','Description','冒頭文','H2/H3','FAQ','内部リンク','本文追記','その他','メモ','Score','URL','状態','完了日'],
  LOG: ['改善日','記事タイトル','URL','メインクエリ','改善内容','修正内容','所要時間','メモ','14日測定日','30日測定日','状態','改善前CTR','改善前順位','改善前クリック','改善前表示回数'],
  EFFECT: ['記事タイトル','URL','改善日','改善内容','修正内容','改善前順位','現在順位','順位変化','改善前CTR','現在CTR','CTR変化','改善前クリック','現在クリック','クリック変化','判定','コメント'],
  BRIEF: ['BriefId','URL','記事タイトル','メインクエリ','重要クエリ','本文補強クエリ','FAQ候補','診断','推奨改善','理由','推定時間','Score','CTR','Position','Clicks','Impressions','改善依頼文','作成日時']
});

const SBM_DEFAULTS = Object.freeze({
  MANAGED_RATIO: '30%',
  DAILY_MINUTES: 30,
  QUEUE_LIMIT: 5,
  RELATED_QUERIES: 20,
  MIN_IMPRESSIONS: 50,
  MIN_CLICKS: 1,
  SEARCH_DAYS: 28,
  GSC_DELAY_DAYS: 3,
  MAX_QUERY_ROWS: 5000,
  MEASURE_DAYS: '14,30',
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
    EFFECT: SBM_SHEETS.EFFECT
  };
  Object.keys(dataMap).forEach(function(k){
    var sheet = sbmGetOrCreateSheet_(dataMap[k]);
    sbmEnsureHeaders_(sheet, SBM_HEADERS[k]);
    sbmStyleDataSheet_(sheet);
  });
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
  sbmSetSettingIfEmpty_('RelatedQueries', SBM_DEFAULTS.RELATED_QUERIES, '改善ブリーフ用クエリ件数');
  sbmSetSettingIfEmpty_('MinImpressions', SBM_DEFAULTS.MIN_IMPRESSIONS, '最低表示回数');
  sbmSetSettingIfEmpty_('MinClicks', SBM_DEFAULTS.MIN_CLICKS, '最低クリック数');
  sbmSetSettingIfEmpty_('SearchDays', SBM_DEFAULTS.SEARCH_DAYS, 'Search Console取得日数');
  sbmSetSettingIfEmpty_('OncePerDay', 'ON', '1日1回取得制限');
  sbmSetSettingIfEmpty_('LastFetchDate', '', '最終取得日');
}

function sbmEnsureUserSheets_() {
  sbmBuildHomeSheet_();
  sbmBuildSetupSheet_();
  sbmBuildTodaySheetView_();
  sbmBuildLogSheetView_();
  sbmBuildBriefSheetView_();
  sbmBuildEffectSheetView_();
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
    var related = rows.slice(1, 21).map(function(r){return r.Query;});
    var important = related.slice(0,5).join('\n');
    var body = related.slice(5,15).join('\n');
    var faq = related.slice(15,20).join('\n');
    cardRows.push([sbmId_('ART'), url, '', main.Query, totalClicks, totalImpressions, ctr, weightedPosition, managed ? '○' : '×', managed ? diag.status : '管理対象外', score, diag.recommendation, '', 0, sbmNowText_()]);
    if (managed && totalImpressions >= sbmNumber_(sbmGetSetting_('MinImpressions', SBM_DEFAULTS.MIN_IMPRESSIONS))) {
      diagnosisRows.push([url, '', main.Query, important, body, faq, totalClicks, totalImpressions, ctr, weightedPosition, diag.code, diag.diagnosis, diag.recommendation, diag.minutes, score, diag.reason, sbmNowText_()]);
    }
  });
  sbmRewriteSheet_(SBM_SHEETS.CARDS, SBM_HEADERS.CARDS, cardRows);
  sbmRewriteSheet_(SBM_SHEETS.DIAGNOSIS, SBM_HEADERS.DIAGNOSIS, diagnosisRows.sort(function(a,b){return b[14]-a[14];}));
}

function sbmBuildTodayQueue_() {
  var diag = sbmRowsAsObjects_(SBM_SHEETS.DIAGNOSIS).sort(function(a,b){return sbmNumber_(b.OpportunityScore)-sbmNumber_(a.OpportunityScore);});
  var mode = String(sbmGetSetting_('TodayDisplayMode','TOP5'));
  var limit = mode === 'ALL' ? Math.min(200, diag.length) : (sbmNumber_(sbmGetSetting_('QueueLimit', SBM_DEFAULTS.QUEUE_LIMIT)) || 5);
  var out = [];
  var briefRows = [];
  for (var i=0; i<diag.length && out.length<limit; i++) {
    var d = diag[i];
    var m = sbmNumber_(d.EstimatedMinutes) || 10;
    var title = d.Title || sbmTitleFromUrl_(d.URL);
    var score = sbmNumber_(d.OpportunityScore);
    var openFormula = '=HYPERLINK("' + String(d.URL).replace(/"/g,'""') + '","記事を開く")';
    var requestText = sbmImprovementRequestText_(title, d.URL, d.MainQuery, d.ImportantQueries, d.BodyQueries, d.FAQQueries, d.Reason, d.Recommendation);
    out.push([sbmStars_(score), m + '分', title, d.MainQuery, d.Recommendation, openFormula, false, false, false, false, false, false, false, false, false, false, false, '', score, d.URL, '未着手', '']);
    briefRows.push([sbmId_('BRF'), d.URL, title, d.MainQuery, d.ImportantQueries || '', d.BodyQueries || '', d.FAQQueries || '', d.Diagnosis || '', d.Recommendation || '', d.Reason || '', m, score, d.CTR || '', d.Position || '', d.Clicks || '', d.Impressions || '', requestText, sbmNowText_()]);
  }
  sbmRewriteSheet_(SBM_SHEETS.TODAY, SBM_HEADERS.TODAY, out);
  sbmRewriteSheet_(SBM_SHEETS.BRIEF, SBM_HEADERS.BRIEF, briefRows);
  sbmStyleTodaySheet_(sbmGetOrCreateSheet_(SBM_SHEETS.TODAY));
  sbmStyleBriefSheet_(sbmGetOrCreateSheet_(SBM_SHEETS.BRIEF));
  sbmOpenToday();
}

function sbmBuildBriefText_(d) {
  return '診断: ' + d.Diagnosis + '\n'
    + '推奨: ' + d.Recommendation + '\n'
    + '理由: ' + d.Reason + '\n\n'
    + '重要クエリ:\n' + (d.ImportantQueries || '-') + '\n\n'
    + '本文補強クエリ:\n' + (d.BodyQueries || '-') + '\n\n'
    + 'FAQ候補:\n' + (d.FAQQueries || '-');
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
    'URL': obj.URL || '',
    'メインクエリ': obj['メインクエリ'] || '',
    '改善内容': obj['改善内容'] || '',
    '修正内容': actions || '未選択',
    '所要時間': obj['時間'] || '',
    'メモ': obj['メモ'] || '',
    '14日測定日': sbmDateAfterText_(14),
    '30日測定日': sbmDateAfterText_(30),
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
function sbmImprovementRequestText_(title, url, mainQuery, importantQueries, bodyQueries, faqQueries, reason, recommendation) {
  return '次の記事を改善してください。\n\n'
    + '記事タイトル: ' + (title || '') + '\n'
    + 'URL: ' + (url || '') + '\n'
    + 'メインクエリ: ' + (mainQuery || '') + '\n\n'
    + '改善理由:\n' + (reason || '') + '\n\n'
    + '推奨改善:\n' + (recommendation || '') + '\n\n'
    + '重要クエリ:\n' + (importantQueries || '-') + '\n\n'
    + '本文補強クエリ:\n' + (bodyQueries || '-') + '\n\n'
    + 'FAQ候補:\n' + (faqQueries || '-') + '\n\n'
    + '依頼:\nメインクエリの検索意図に合わせて、タイトル・導入文・見出し・FAQを優先的に見直し、自然な文章で改善してください。';
}

function sbmBriefHtml_(b) {
  function esc(v){ return String(v || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>'); }
  var request = b['改善依頼文'] || sbmImprovementRequestText_(b['記事タイトル'], b.URL, b['メインクエリ'], b['重要クエリ'], b['本文補強クエリ'], b['FAQ候補'], b['理由'], b['推奨改善']);
  return '<div style="font-family:Arial,sans-serif;line-height:1.65;padding:18px;color:#202124">'
    + '<h2 style="margin-top:0">改善ブリーフ</h2>'
    + '<div style="background:#e8f0fe;padding:12px;border-radius:8px;margin-bottom:14px"><b>' + esc(b['記事タイトル']) + '</b><br><a href="' + esc(b.URL) + '" target="_blank">記事を開く</a></div>'
    + '<p><b>メインクエリ:</b> ' + esc(b['メインクエリ']) + '</p>'
    + '<p><b>現在値:</b> CTR ' + esc(b.CTR) + ' / 順位 ' + esc(b.Position) + ' / クリック ' + esc(b.Clicks) + ' / 表示回数 ' + esc(b.Impressions) + '</p>'
    + '<h3>改善理由</h3><p>' + esc(b['理由']) + '</p>'
    + '<h3>推奨改善</h3><p>' + esc(b['推奨改善']) + '</p>'
    + '<h3>重要クエリ</h3><p>' + esc(b['重要クエリ']) + '</p>'
    + '<h3>本文補強クエリ</h3><p>' + esc(b['本文補強クエリ']) + '</p>'
    + '<h3>FAQ候補</h3><p>' + esc(b['FAQ候補']) + '</p>'
    + '<h3>Claude / ChatGPT に貼り付ける改善依頼</h3>'
    + '<textarea style="width:100%;height:230px;font-family:monospace;font-size:12px;white-space:pre-wrap">' + String(request || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</textarea>'
    + '<hr><p>推定時間: ' + esc(b['推定時間']) + '分 / Score: ' + esc(b.Score) + '</p>'
    + '</div>';
}

function sbmUpdateEffectiveness() {
  var logs = sbmRowsAsObjects_(SBM_SHEETS.LOG);
  var cards = sbmRowsAsObjects_(SBM_SHEETS.CARDS);
  var byUrl = {};
  cards.forEach(function(c){ byUrl[String(c.URL)] = c; });
  var rows = [];
  var today = new Date();
  logs.forEach(function(l){
    var c = byUrl[String(l.URL)] || {};
    var beforePos = sbmNumber_(l['改善前順位']);
    var nowPos = sbmNumber_(c.Position);
    var beforeCtr = sbmNumber_(l['改善前CTR']);
    var nowCtr = sbmNumber_(c.CTR);
    var beforeClicks = sbmNumber_(l['改善前クリック']);
    var nowClicks = sbmNumber_(c.Clicks);
    var posDelta = beforePos && nowPos ? beforePos - nowPos : '';
    var ctrDelta = (nowCtr || 0) - (beforeCtr || 0);
    var clickDelta = (nowClicks || 0) - (beforeClicks || 0);
    var due14 = l['14日測定日'] ? new Date(l['14日測定日']) : null;
    var due30 = l['30日測定日'] ? new Date(l['30日測定日']) : null;
    var outcome = '測定待ち';
    if ((due14 && today >= due14) || (due30 && today >= due30)) {
      if ((posDelta && posDelta >= 2) || ctrDelta >= 0.005 || clickDelta >= 5) outcome = '成功';
      else if ((posDelta && posDelta <= -3) || ctrDelta < -0.005) outcome = '要再改善';
      else outcome = '横ばい';
    }
    rows.push([l['記事タイトル']||'', l.URL||'', l['改善日']||'', l['改善内容']||'', l['修正内容']||'', beforePos, nowPos || '', posDelta, beforeCtr, nowCtr || '', ctrDelta, beforeClicks, nowClicks || '', clickDelta, outcome, '']);
  });
  sbmRewriteSheet_(SBM_SHEETS.EFFECT, SBM_HEADERS.EFFECT, rows);
  sbmStyleEffectSheet_(sbmGetOrCreateSheet_(SBM_SHEETS.EFFECT));
  sbmRefreshHome_();
  sbmAlert_('効果測定を更新しました', '改善ログをもとに効果測定を更新しました。');
}

function sbmTitleFromUrl_(url) { var s = String(url || '').replace(/^https?:\/\//,'').replace(/\/$/,''); return s.length > 54 ? s.substring(0,54) + '…' : s; }
function sbmUpdateEffectivenessSilent_() {
  var oldUiAlert = sbmAlert_;
  try {
    var logs = sbmRowsAsObjects_(SBM_SHEETS.LOG);
    if (!logs.length) return;
    var cards = sbmRowsAsObjects_(SBM_SHEETS.CARDS);
    var byUrl = {}; cards.forEach(function(c){ byUrl[String(c.URL)] = c; });
    var rows = [];
    logs.forEach(function(l){
      var c = byUrl[String(l.URL)] || {};
      var beforePos = sbmNumber_(l['改善前順位']); var nowPos = sbmNumber_(c.Position);
      var beforeCtr = sbmNumber_(l['改善前CTR']); var nowCtr = sbmNumber_(c.CTR);
      var beforeClicks = sbmNumber_(l['改善前クリック']); var nowClicks = sbmNumber_(c.Clicks);
      var posDelta = beforePos && nowPos ? beforePos - nowPos : '';
      var ctrDelta = (nowCtr || 0) - (beforeCtr || 0);
      var clickDelta = (nowClicks || 0) - (beforeClicks || 0);
      var outcome = '測定待ち';
      rows.push([l['記事タイトル']||'', l.URL||'', l['改善日']||'', l['改善内容']||'', l['修正内容']||'', beforePos, nowPos || '', posDelta, beforeCtr, nowCtr || '', ctrDelta, beforeClicks, nowClicks || '', clickDelta, outcome, '']);
    });
    sbmRewriteSheet_(SBM_SHEETS.EFFECT, SBM_HEADERS.EFFECT, rows);
    sbmStyleEffectSheet_(sbmGetOrCreateSheet_(SBM_SHEETS.EFFECT));
  } catch(e) { sbmLog_('EffectivenessSilent','Error',String(e)); }
}

function sbmDateAfterText_(days) { var d = new Date(); d.setDate(d.getDate()+days); return sbmDateText_(d); }

function sbmLog_(action,status,detail) { try { sbmAppendObject_(SBM_SHEETS.SYSTEM_LOG, SBM_HEADERS.SYSTEM_LOG, {CreatedAt:sbmNowText_(),Action:action,Status:status,Detail:detail||''}); } catch(e) { console.error(e); } }
function sbmDateText_(d) { return Utilities.formatDate(d, Session.getScriptTimeZone() || SBM_DEFAULTS.TIMEZONE, 'yyyy-MM-dd'); }
function sbmNowText_() { return Utilities.formatDate(new Date(), Session.getScriptTimeZone() || SBM_DEFAULTS.TIMEZONE, 'yyyy-MM-dd HH:mm:ss'); }
function sbmId_(p) { return p + '-' + Utilities.formatDate(new Date(), Session.getScriptTimeZone() || SBM_DEFAULTS.TIMEZONE, 'yyyyMMdd-HHmmss') + '-' + Math.floor(Math.random()*10000); }
function sbmSafeText_(v) { return v === null || v === undefined ? '' : String(v).trim(); }
function sbmNumber_(v) { if(typeof v === 'number') return v; var n=Number(String(v||'').replace('%','').replace(/,/g,'').trim()); return isNaN(n)?0:n; }
function sbmAlert_(title,msg) { SpreadsheetApp.getUi().alert(title, msg, SpreadsheetApp.getUi().ButtonSet.OK); }
function sbmStyleDataSheet_(sh) { var lc=Math.max(sh.getLastColumn(),1); var lr=Math.max(sh.getLastRow(),1); sh.setFrozenRows(1); sh.getRange(1,1,1,lc).setFontWeight('bold').setBackground('#e8f0fe').setWrap(true); sh.getRange(1,1,lr,lc).setVerticalAlignment('top').setWrap(true); try{ sh.autoResizeColumns(1, Math.min(lc,12)); }catch(e){} }
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
  try { sh.setColumnWidths(1,1,140); sh.setColumnWidths(2,1,260); sh.setColumnWidths(3,1,360); sh.setColumnWidths(6,1,240); sh.setColumnWidths(8,1,240); } catch(e) {}
}
function sbmStyleEffectSheet_(sh) {
  sbmStyleDataSheet_(sh);
  try { sh.setColumnWidths(1,1,260); sh.setColumnWidths(3,1,140); sh.setColumnWidths(6,10,90); } catch(e) {}
}

function sbmStyleBriefSheet_(sh) {
  sbmStyleDataSheet_(sh);
  try { sh.hideSheet(); } catch(e) {}
}
function sbmStyleUserSheet_(sh, color) { var lc=Math.max(sh.getLastColumn(),2); var lr=Math.max(sh.getLastRow(),1); sh.setFrozenRows(1); sh.getRange(1,1,1,lc).setFontWeight('bold').setFontSize(15).setBackground(color).setFontColor('#ffffff'); sh.getRange(1,1,lr,lc).setVerticalAlignment('top').setWrap(true); sh.getRange(1,1,lr,lc).setBorder(true,true,true,true,true,true); }
function sbmApplySheetUx_() { var ss=SpreadsheetApp.getActiveSpreadsheet(); [SBM_SHEETS.HOME, SBM_SHEETS.TODAY, SBM_SHEETS.LOG, SBM_SHEETS.SETUP, SBM_SHEETS.EFFECT].forEach(function(n){ var s=ss.getSheetByName(n); if(s) s.showSheet(); }); sbmHideSystemSheets(); }
