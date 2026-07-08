/**
 * SIMS-Blog-Manager Product 5.0 Official
 * SIMS-Core Slim Edition for blog SEO improvement management.
 * End-user distribution file: paste this entire file into Code.gs/Code.js.
 */

const SBM_VERSION = '5.0.0-official-progress-home';
const SBM_SHEETS = Object.freeze({
  HOME: 'Home',
  DATA_LIST: 'データ一覧',
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
  TOPICS: '記事ネタ候補',
  PROCESS_LOG: '処理ログ',
  IN_PROGRESS: '改善中'
});

const SBM_HEADERS = Object.freeze({
  SETTINGS: ['Key', 'Value', 'Description', 'UpdatedAt'],
  SYSTEM_LOG: ['CreatedAt', 'Action', 'Status', 'Detail'],
  QUERY_DATA: ['StartDate','EndDate','Query','URL','Clicks','Impressions','CTR','Position','CapturedAt'],
  DATA_LIST: ['記事ステータス','記事URL','H1タイトル','titleタグ','メインクエリ','クリック数','表示回数','CTR','平均順位'],
  CARDS: ['ArticleId','URL','Title','MainQuery','Clicks','Impressions','CTR','Position','Managed','ArticleStatus','OpportunityScore','Recommendation','LastImprovedAt','ImproveCount','LastAnalyzedAt'],
  DIAGNOSIS: ['URL','Title','MainQuery','SubQueries','FAQQueries','SeparateArticleQueries','NoiseQueries','QuerySummary','Clicks','Impressions','CTR','Position','DiagnosisCode','Diagnosis','Recommendation','EstimatedMinutes','OpportunityScore','Reason','AnalyzedAt'],
  TODAY: ['優先','時間','記事タイトル','メインクエリ','改善内容','改善ブリーフ','完了','メモ','Title','H1','Description','冒頭文','H2/H3','FAQ','内部リンク','本文追記','その他','Score','URL','状態','完了日'],
  LOG: ['改善日','記事タイトル','URL','メインクエリ','改善内容','修正内容','所要時間','メモ','初回測定日','7日測定完了日','状態','改善前CTR','改善前順位','改善前クリック','改善前表示回数'],
  EFFECT: ['記事タイトル','改善日','改善内容','判定','SIMS評価','次のアクション','詳細','URL','修正内容','経過日数','改善前順位','現在順位','順位変化','改善前CTR','現在CTR','CTR変化','改善前クリック','現在クリック','クリック変化','次の確認','コメント'],
  BRIEF: ['優先度','記事タイトル','メインキーワード','改善内容','予想時間','期待効果','改善依頼（詳細）','URL','サブクエリ','FAQ候補','別記事候補','除外クエリ','クエリ分析','改善理由','具体的な修正方法','修正例','Score','CTR','平均順位','クリック数','表示回数','Claude改善依頼文','作成日時'],
  MEASURE_HISTORY: ['記事タイトル','改善日','記録日','経過日数','現在順位','現在CTR','現在クリック','現在表示回数','判定メモ','URL'],
  CANNIBAL: ['判定','共通クエリ','記事Aタイトル','記事Bタイトル','推奨対応','詳細','記事A URL','記事Aクリック','記事A順位','記事B URL','記事Bクリック','記事B順位','理由','確認日'],
  TOPICS: ['候補日','候補クエリ','元記事タイトル','元記事URL','理由','優先度','Claude用メモ','状態'],
  PROCESS_LOG: ['開始時刻','終了時刻','利用者待ち時間','処理','状態','対象件数','処理件数','件数','詳細'],
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
  MEASURE_DAYS: '7,14,21,28,35,42,49,56',
  MEASUREMENT_WEEKS: 8,
  MEASUREMENT_DAYS: 56,
  MEASUREMENT_MODE: 'WEEKLY_2M',
  ANALYSIS_CANDIDATE_LIMIT: 30,
  ANALYSIS_ARTICLE_LIMIT: 120,
  TITLE_FETCH_DEFAULT: 'OFF',
  TIMEZONE: 'Asia/Tokyo'
});

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('SIMS-Blog-Manager')
    .addItem('ホームを開く', 'sbmOpenHome')
    .addSeparator()
    .addSubMenu(SpreadsheetApp.getUi().createMenu('セットアップ')
      .addItem('初回セットアップを開始', 'sbmStartInitialSetup')
      .addItem('登録情報を更新', 'sbmSetupStep1BlogInfo')
      .addItem('Search Console接続テスト', 'sbmSetupStep3ConnectionTest')
      .addItem('初回データ取得', 'sbmSetupStep4InitialFetch'))
    .addSeparator()
    .addSubMenu(SpreadsheetApp.getUi().createMenu('データ更新')
      .addItem('STEP A Search Consoleデータ取得だけ実行', 'sbmFetchOnlyManual')
      .addItem('STEP B 改善候補を分析', 'sbmAnalyzeOnlyManual')
      .addItem('データ一覧を更新・開く', 'sbmOpenDataList')
      .addItem('処理ログを開く', 'sbmOpenProcessLog'))
    .addSubMenu(SpreadsheetApp.getUi().createMenu('今日の改善')
      .addItem('今日の改善を開く', 'sbmOpenToday')
      .addItem('選択行の改善ブリーフを開く', 'sbmShowSelectedBrief')
      .addItem('選択行を完了にする', 'sbmCompleteSelectedImprovement')
      .addItem('改善中を開く', 'sbmOpenInProgress')
      .addSeparator()
      .addItem('おすすめ5件表示にする', 'sbmSetTodayTop5'))
    .addSubMenu(SpreadsheetApp.getUi().createMenu('管理')
      .addItem('シートを作成・修復', 'sbmInitializeSheets')
      .addItem('不要シートを削除', 'sbmDeleteDeprecatedSheets')
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
      // Product 5.0 Official: その日最初の起動時のみ、取得＋改善候補抽出を自動実行します。
      try {
        sbmToast_('Search Consoleデータ収集中', 'Product 5.0 自動日次更新', 10);
        sbmDailyUpdateManual();
      } catch (e) {
        sbmProcessLog_('自動日次更新', 'エラー', '', '', '', String(e), sbmNowText_(), sbmNowText_());
        sbmAlert_('自動日次更新を完了できませんでした', 'メニュー「データ更新」→「STEP A Search Consoleデータ取得だけ実行」→「STEP B 改善候補を分析」の順に手動で実行してください。\n\n詳細: ' + String(e));
      }
    }
  }
}

function sbmInitializeSheets(showAlert) {
  showAlert = showAlert !== false;
  sbmEnsureDataSheets_();
  sbmDeleteDeprecatedSheets_(false);
  sbmMigrateRc3Headers_();
  sbmEnsureDefaultSettings_();
  sbmEnsureUserSheets_();
  sbmApplySheetUx_();
  sbmRefreshHome_();
  sbmLog_('InitializeSheets','Done','Product 5.0 Official sheets initialized');
  if (showAlert) sbmAlert_('初期化完了', '必要なシートを作成・修復しました。\n次に、メニュー「SIMS-Blog-Manager」→「セットアップ」→「STEP1 ブログ情報を登録」を実行してください。');
}

function sbmEnsureDataSheets_() {
  var dataMap = {
    SETTINGS: SBM_SHEETS.SETTINGS,
    SYSTEM_LOG: SBM_SHEETS.SYSTEM_LOG,
    QUERY_DATA: SBM_SHEETS.QUERY_DATA,
    DATA_LIST: SBM_SHEETS.DATA_LIST,
    CARDS: SBM_SHEETS.CARDS,
    DIAGNOSIS: SBM_SHEETS.DIAGNOSIS,
    BRIEF: SBM_SHEETS.BRIEF,
    TODAY: SBM_SHEETS.TODAY,
    LOG: SBM_SHEETS.LOG,
    PROCESS_LOG: SBM_SHEETS.PROCESS_LOG,
    IN_PROGRESS: SBM_SHEETS.IN_PROGRESS
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
  sbmSetSettingIfEmpty_('MeasurementMode', SBM_DEFAULTS.MEASUREMENT_MODE, '効果測定モード。WEEKLY_2Mは週1回・最大2か月測定');
  sbmSetSettingIfEmpty_('AnalysisCandidateLimit', SBM_DEFAULTS.ANALYSIS_CANDIDATE_LIMIT, '分析後に保存する改善候補数');
  sbmSetSettingIfEmpty_('AnalysisArticleLimit', SBM_DEFAULTS.ANALYSIS_ARTICLE_LIMIT, 'STEP Bで実際に重い分析を行う最大記事数。タイムアウト対策用');
  sbmSetSettingIfEmpty_('FetchArticleTitles', SBM_DEFAULTS.TITLE_FETCH_DEFAULT, '記事タイトル取得を外部アクセスで行うか。高速化のため通常OFF');
  sbmSetSettingIfEmpty_('LastFetchRows', '0', '直近のSearch Console取得行数');
  sbmSetSettingIfEmpty_('ManagedArticleCount', '0', '直近の管理対象記事数');
  sbmSetSettingIfEmpty_('ImprovementCandidateCount', '0', '直近の改善候補数');
  sbmSetSettingIfEmpty_('DisplayedImprovementCount', '0', '今日の改善に表示している件数');
}

function sbmEnsureUserSheets_() {
  sbmBuildHomeSheet_();
  sbmBuildDataListSheet_();
  sbmBuildTodaySheetView_();
  sbmBuildInProgressSheet_();
  sbmBuildBlogDashboardSheet_();
  sbmStyleProcessLogSheet_(sbmGetOrCreateSheet_(SBM_SHEETS.PROCESS_LOG));
  sbmStyleBriefSheet_(sbmGetOrCreateSheet_(SBM_SHEETS.BRIEF));
}

function sbmBuildHomeSheet_() {
  var sh = sbmGetOrCreateSheet_(SBM_SHEETS.HOME);
  sh.clear();
  var values = [
    ['SIMS-Blog-Manager', 'Product 5.0 Official', '', ''],
    ['毎日最初に見る画面', 'ブログ全体の状況・改善作業の状況・今日やることだけを表示します。', '', ''],
    ['', '', '', ''],
    ['ブログ全体の状況', '', '改善作業の状況', ''],
    ['総記事数', '0件', '今日の改善表示', '0件'],
    ['良好記事数', '0件 / 0件（0%）', '改善中記事数', '0件'],
    ['改善候補数', '0件', '最終取得日', '未取得'],
    ['', '', '直近処理', '未実行'],
    ['', '', '', ''],
    ['今日やること', '', '', ''],
    ['次にやること', 'セットアップまたは今日の改善を確認してください。', '', ''],
    ['おすすめ改善', '未作成', '', ''],
    ['推定時間', '-', '', ''],
    ['', '', '', ''],
    ['処理状況', '', '', ''],
    ['現在の状態', '待機中', '実行中/最後の処理', '-'],
    ['開始時刻', '-', '完了時刻', '-'],
    ['経過時間', '-', '処理結果', '-'],
    ['お願い', '', '', '']
  ];
  sh.getRange(1,1,values.length,4).setValues(values);
  sh.setColumnWidths(1,1,170);
  sh.setColumnWidths(2,1,360);
  sh.setColumnWidths(3,1,170);
  sh.setColumnWidths(4,1,360);
  sbmStyleHomeSheet_(sh);
}

function sbmStyleHomeSheet_(sh) {
  try {
    sh.setFrozenRows(0);
    sh.hideGridlines();
    sh.getRange('A1:D1').merge().setBackground('#0B1324').setFontColor('#FFFFFF').setFontSize(22).setFontWeight('bold').setHorizontalAlignment('left').setVerticalAlignment('middle');
    sh.getRange('A2:D2').merge().setBackground('#111827').setFontColor('#D1D5DB').setFontSize(11).setHorizontalAlignment('left');
    sh.setRowHeight(1, 42);
    sh.setRowHeight(2, 30);
    ['A4:B8','C4:D8','A10:D13','A15:D19'].forEach(function(r){
      sh.getRange(r).setBackground('#FFFFFF').setBorder(true,true,true,true,true,true,'#E5E7EB',SpreadsheetApp.BorderStyle.SOLID);
    });
    sh.getRange('A4:B4').merge().setBackground('#0F766E').setFontColor('#FFFFFF').setFontSize(14).setFontWeight('bold').setHorizontalAlignment('center');
    sh.getRange('C4:D4').merge().setBackground('#1D4ED8').setFontColor('#FFFFFF').setFontSize(14).setFontWeight('bold').setHorizontalAlignment('center');
    sh.getRange('A10:D10').merge().setBackground('#F59E0B').setFontColor('#111827').setFontSize(14).setFontWeight('bold').setHorizontalAlignment('center');
    sh.getRange('A15:D15').merge().setBackground('#7C3AED').setFontColor('#FFFFFF').setFontSize(14).setFontWeight('bold').setHorizontalAlignment('center');
    sh.getRange('A5:A8').setFontColor('#374151').setFontWeight('bold').setBackground('#F9FAFB');
    sh.getRange('C5:C8').setFontColor('#374151').setFontWeight('bold').setBackground('#F9FAFB');
    sh.getRange('A11:A13').setFontColor('#374151').setFontWeight('bold').setBackground('#FFFBEB');
    sh.getRange('A16:A19').setFontColor('#374151').setFontWeight('bold').setBackground('#F5F3FF');
    sh.getRange('C16:C18').setFontColor('#374151').setFontWeight('bold').setBackground('#F5F3FF');
    sh.getRange('B5:B8').setFontSize(13).setFontWeight('bold').setFontColor('#111827');
    sh.getRange('D5:D8').setFontSize(13).setFontWeight('bold').setFontColor('#111827');
    sh.getRange('B11:D13').setFontSize(12).setWrap(true);
    sh.getRange('B16:D18').setFontSize(12).setWrap(true);
    sh.getRange('B19:D19').merge().setFontSize(11).setWrap(true).setFontColor('#6B21A8');
    sh.getRange('A1:D19').setVerticalAlignment('middle');
    sh.setRowHeights(4, 16, 34);
    sh.setRowHeight(19, 46);
  } catch(e) {
    sbmStyleUserSheet_(sh, '#0b8043');
  }
}

function sbmBuildBlogDashboardSheet_() {
  var sh = sbmGetOrCreateSheet_('ブログ診断');
  if (sh.getLastRow() === 0 || sh.getRange('A1').getValue() !== 'ブログ診断') {
    sh.clear();
    sh.getRange(1,1,7,3).setValues([
      ['ブログ診断', 'ブログ全体の状態を確認する画面です。', ''],
      ['総記事数', '0件', ''],
      ['良好記事数', '0件 / 0件（0%）', ''],
      ['改善中記事数', '0件', ''],
      ['改善候補数', '0件', ''],
      ['最終取得日', '未取得', ''],
      ['メモ', '詳しい作業は「今日の改善」と「改善中」を確認してください。', '']
    ]);
    sh.setColumnWidths(1,1,180);
    sh.setColumnWidths(2,1,360);
    sh.setColumnWidths(3,1,240);
  }
  sbmStyleUserSheet_(sh, '#1a73e8');
}

function sbmRefreshBlogDashboard_() {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ブログ診断');
  if (!sh) return;
  var cards = sbmRowsAsObjects_(SBM_SHEETS.CARDS);
  var total = sbmNumber_(sbmGetSetting_('TotalArticleCount','0')) || cards.length;
  var good = 0;
  cards.forEach(function(c){ var st = String(c.ArticleStatus || ''); if (st.indexOf('良好') !== -1 || st.indexOf('様子見') !== -1) good++; });
  var goodRate = total ? Math.round(good / total * 100) : 0;
  sh.getRange('B2').setValue(total + '件');
  sh.getRange('B3').setValue(good + '件 / ' + total + '件（' + goodRate + '%）');
  sh.getRange('B4').setValue(sbmRowsAsObjects_(SBM_SHEETS.IN_PROGRESS).length + '件');
  sh.getRange('B5').setValue(sbmGetSetting_('ImprovementCandidateCount','0') + '件');
  sh.getRange('B6').setValue(sbmGetSetting_('LastFetchDate','未取得'));
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
function sbmBuildCannibalSheetView_() { sbmStyleCannibalSheet_(sbmGetOrCreateSheet_(SBM_SHEETS.CANNIBAL)); }

function sbmStartInitialSetup() {
  sbmAlert_('初回セットアップを開始します', 'ブログ情報の登録から順番に進めます。外部サイトでAPIを有効化した後は、スプレッドシートに戻って「Search Console接続テスト」を実行してください。');
  sbmSetupStep1BlogInfo(true);
}

function sbmSetupStep1BlogInfo(autoNext) {
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
  if (autoNext === true) { sbmSetupStep2ApiGuide(); } else { sbmAlert_('登録情報を更新しました', 'ブログ情報を保存しました。'); }
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
  var ui = SpreadsheetApp.getUi();
  ui.alert('本日のデータ収集をスタートします！', 'Search Consoleから最新データを取得します。\n\n処理中は他のメニューを実行せず、そのままお待ちください。\nシートの閲覧は可能ですが、編集はしないでください。', ui.ButtonSet.OK);
  var started = new Date();
  var startedText = sbmNowText_();
  try {
    // Product 5.0: 日次処理はSearch Console取得のみ。Home更新は開始・終了の2回に限定する。
    sbmStartProcessStatus_('Search Consoleデータ取得', 'Search Console APIから最新データを取得しています。');
    sbmFetchOnlyManual(true);

    var sec = sbmSecondsSince_(started);
    var detail = '取得件数 ' + sbmGetSetting_('LastFetchRows','0') + '件 / API ' + sbmGetSetting_('LastFetchApiSeconds','0') + '秒 / 書込 ' + sbmGetSetting_('LastFetchWriteSeconds','0') + '秒';
    sbmProcessLog_('日次処理', '完了', sbmGetSetting_('LastFetchRows',''), '', sec, detail, startedText, sbmNowText_());
    sbmCompleteProcessStatus_('本日のデータ収集', detail, startedText, sec);
    sbmOpenHome();
    sbmAlert_('本日のデータ収集完了', 'Search Consoleデータの取得が完了しました。\n取得件数: ' + sbmGetSetting_('LastFetchRows','0') + '件\n所要時間: ' + sec + '秒\n\n次に必要に応じて「STEP B 改善候補を分析」を実行してください。');
  } catch (e) {
    var secErr = sbmSecondsSince_(started);
    var friendly = sbmFriendlyGscError_(String(e));
    sbmProcessLog_('日次処理', 'エラー', '', '', secErr, friendly, startedText, sbmNowText_());
    sbmErrorProcessStatus_('本日のデータ収集', friendly, startedText, secErr);
    sbmAlert_('本日のデータ収集エラー', friendly);
  }
}

function sbmFetchOnlyManual(silent) {
  silent = silent === true;
  // Product 5.0 lightweight fetch: daily Search Console fetch must not rebuild/repair all sheets.
  // Sheet repair is available from 管理メニュー only. This keeps daily operation fast.
  if (!sbmIsSetupComplete_() || sbmGetSetting_('ConnectionStatus','') !== 'OK') {
    return sbmAlert_('データ取得はまだできません', 'STEP1〜STEP3を完了してから実行してください。\n日次取得も接続テスト成功までは実行されません。');
  }
  var started = new Date();
  var startedText = sbmNowText_();
  var apiSec = 0;
  var writeSec = 0;
  var settingSec = 0;
  try {
    if (!silent) sbmStartProcessStatus_('Search Consoleデータ取得', 'Search Console APIからクエリとURLのデータを取得します。');
    if (!silent) sbmProgress_('Search Consoleデータ取得開始', 'Search Console APIからクエリとURLのデータを取得します。');
    if (!silent) sbmToast_('Search Consoleデータ取得を開始しました。少しお待ちください。', 'データ取得', 10);

    var apiStart = new Date();
    var rows = sbmFetchSearchConsoleQueries_();
    apiSec = sbmSecondsSince_(apiStart);

    if (!silent) sbmProgress_('取得データ書き込み開始', 'Search Console取得データをシートへ保存しています。');
    var writeStart = new Date();
    sbmWriteQueryData_(rows, true);
    writeSec = sbmSecondsSince_(writeStart);

    var setStart = new Date();
    var sec = sbmSecondsSince_(started);
    sbmSetSetting_('LastFetchDate', sbmDateText_(new Date()), '最終取得日');
    sbmSetSetting_('LastFetchRows', rows.length, '直近のSearch Console取得行数');
    sbmSetSetting_('LastFetchSeconds', sec, '直近のSearch Console取得秒数');
    sbmSetSetting_('LastFetchApiSeconds', apiSec, '直近のSearch Console API取得秒数');
    sbmSetSetting_('LastFetchWriteSeconds', writeSec, '直近のSearch Consoleシート書込秒数');
    sbmSetSetting_('LastFetchAt', sbmNowText_(), '直近のSearch Console取得日時');
    settingSec = sbmSecondsSince_(setStart);

    var detail = '取得件数 ' + rows.length + '件 / API ' + apiSec + '秒 / 書込 ' + writeSec + '秒 / 設定 ' + settingSec + '秒';
    sbmProcessLog_('STEP A Search Consoleデータ取得', '完了', rows.length, rows.length, sec, detail, startedText, sbmNowText_());
    if (!silent) sbmCompleteProcessStatus_('Search Consoleデータ取得', detail, startedText, sec);
    sbmLog_('FetchOnly','Done', detail + ' / total ' + sec + ' sec');
    if (!silent) {
      sbmRefreshHome_();
      sbmAlert_('データ取得完了', 'Search Consoleデータの取得が完了しました。\n取得件数: ' + rows.length + '件\n所要時間: ' + sec + '秒\n\n内訳: API ' + apiSec + '秒 / 書込 ' + writeSec + '秒\n\n次に「STEP B 改善候補を分析」を実行してください。');
    }
  } catch (e) {
    var secErr = sbmSecondsSince_(started);
    var friendly = sbmFriendlyGscError_(String(e));
    sbmProcessLog_('STEP A Search Consoleデータ取得', 'エラー', '', '', secErr, 'API ' + apiSec + '秒 / 書込 ' + writeSec + '秒 / ' + friendly, startedText, sbmNowText_());
    if (!silent) sbmErrorProcessStatus_('Search Consoleデータ取得', friendly, startedText, secErr);
    sbmLog_('FetchOnly','Error',friendly);
    if (silent) throw e;
    sbmAlert_('データ取得エラー', friendly);
  }
}

function sbmAnalyzeOnlyManual(silent) {
  silent = silent === true;
  sbmInitializeSheets(false);
  var qRows = sbmRowsAsObjects_(SBM_SHEETS.QUERY_DATA);
  if (!qRows.length) return sbmAlert_('分析できません', '先に「STEP A Search Consoleデータ取得だけ実行」を実行してください。');
  var started = new Date();
  var startedText = sbmNowText_();
  try {
    if (!silent) sbmStartProcessStatus_('改善候補分析', '改善中・測定中・良好・改善不要を除外し、最大30件の候補を作成します。');
    if (!silent) sbmProgress_('改善候補分析開始', '改善中・測定中・良好・改善不要を除外し、最大30件の候補を作成します。');
    sbmToast_('改善候補分析を開始しました。対象記事を絞って処理します。', '改善候補抽出', 10);
    sbmDeleteDeprecatedSheets_(false);
    var result = sbmBuildDiagnosis_();
    sbmBuildTodayQueue_();
    sbmBuildInProgressSheet_();
    try {
      sbmProgress_('データ一覧更新開始', '改善候補の分析結果をデータ一覧へ反映し、状態順に並べ替えます。');
      sbmRefreshDataList_();
    } catch(ignoreDataList) {}
    var sec = sbmSecondsSince_(started);
    sbmSetSetting_('LastAnalyzeSeconds', sec, '直近の改善分析秒数');
    sbmProcessLog_('STEP B 改善候補分析', '完了', (result && result.targetCount) || '', (result && result.analyzedCount) || '', sec, '利用者待ち時間を含む分析処理全体。改善候補 ' + sbmGetSetting_('ImprovementCandidateCount','0') + '件 / 表示 ' + sbmGetSetting_('DisplayedImprovementCount','0') + '件。Product 5.0では保留機能は実行しません。', startedText, sbmNowText_());
    if (!silent) sbmCompleteProcessStatus_('改善候補分析', '改善候補: ' + sbmGetSetting_('ImprovementCandidateCount','0') + '件 / 今日の改善: ' + sbmGetSetting_('DisplayedImprovementCount','0') + '件', startedText, sec);
    sbmLog_('AnalyzeOnly','Done', 'analyzed ' + ((result && result.analyzedCount)||'') + ' / ' + sec + ' sec');
    sbmRefreshHome_();
    sbmDeleteDeprecatedSheets_(false);
    if (silent) { sbmOpenToday(); } else { sbmOpenDataList(); }
    var total = sbmGetSetting_('ImprovementCandidateCount','0');
    var shown = sbmGetSetting_('DisplayedImprovementCount','0');
    var managed = sbmGetSetting_('ManagedArticleCount','0');
    if (!silent) sbmAlert_('改善分析完了', '改善候補を作成しました。\n管理対象記事: ' + managed + '件\n分析記事: ' + ((result && result.analyzedCount)||'') + '件\n改善候補: ' + total + '件\n表示中: ' + shown + '件\n所要時間: ' + sec + '秒');
  } catch (e) {
    var secErr = sbmSecondsSince_(started);
    sbmProcessLog_('STEP B 改善候補分析', 'エラー', qRows.length, '途中', secErr, String(e), startedText, sbmNowText_());
    if (!silent) sbmErrorProcessStatus_('改善候補分析', String(e), startedText, secErr);
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
  var range = sbmSearchConsoleDateRange_();
  var property = sbmGetSetting_('SearchConsoleProperty','');
  var data = sbmSearchConsoleApiRequest_(property, {startDate: range.startDate, endDate: range.endDate, dimensions: ['query','page'], rowLimit: Number(sbmGetSetting_('MaxQueryRows', SBM_DEFAULTS.MAX_QUERY_ROWS)) || SBM_DEFAULTS.MAX_QUERY_ROWS});
  var capturedAt = sbmNowText_();
  return (data.rows || []).filter(function(r){
    var page = String((r.keys && r.keys[1]) || '');
    return page && page.indexOf('#') === -1;
  }).map(function(r){
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

function sbmWriteQueryData_(rows, lightweight) {
  var sh = sbmGetOrCreateSheet_(SBM_SHEETS.QUERY_DATA);
  var headerCount = SBM_HEADERS.QUERY_DATA.length;
  var lastRow = Math.max(sh.getLastRow(), 1);
  var lastCol = Math.max(sh.getLastColumn(), headerCount);
  // Faster than sh.clear(): keep existing formatting and only clear used contents.
  sh.getRange(1, 1, lastRow, lastCol).clearContent();
  sh.getRange(1, 1, 1, headerCount).setValues([SBM_HEADERS.QUERY_DATA]);
  if (rows.length) sh.getRange(2,1,rows.length,headerCount).setValues(rows);
  if (lightweight === true) {
    sbmStyleQueryDataLight_(sh);
  } else {
    sbmStyleDataSheet_(sh);
  }
}

function sbmStyleQueryDataLight_(sh) {
  var lc = Math.max(sh.getLastColumn(), 1);
  var lr = Math.max(sh.getLastRow(), 1);
  try { sh.setFrozenRows(1); } catch(e) {}
  try { sh.getRange(1,1,1,lc).setFontWeight('bold').setBackground('#e8f0fe').setWrap(true); } catch(e) {}
  // Avoid autoResizeColumns and whole-sheet wrapping in daily fetch. These are slow on large datasets.
  try { sbmApplyCommonNumberFormats_(sh); } catch(e) {}
}

function sbmBuildDiagnosis_() {
  var queryRows = sbmRowsAsObjects_(SBM_SHEETS.QUERY_DATA);
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
  // Product 5.0: 記事ネタ候補は未実装。分析中にもシートを作成しない。
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
    var title = sbmResolveArticleTitle_(url, '', false);
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
  // Product 5.0: 記事ネタ候補シートは作成しない。
  return {totalCount: articleStats.length, managedCount: managedCount, targetCount: targetStats.length, analyzedCount: analyzed, diagnosisCount: diagnosisRows.length};
}

function sbmBuildTodayQueue_() {
  var diag = sbmRowsAsObjects_(SBM_SHEETS.DIAGNOSIS).sort(function(a,b){return sbmNumber_(b.OpportunityScore)-sbmNumber_(a.OpportunityScore);});
  var active = sbmActiveMeasurementUrlMap_();
  diag = diag.filter(function(d){ return sbmIsImprovementCandidate_(d, active); });
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
    var title = sbmCleanDisplayTitle_(sbmResolveArticleTitle_(url, d.Title || '', false), url);
    var score = sbmNumber_(d.OpportunityScore);
    var priority = sbmStars_(score);
    var titleFormula = '=HYPERLINK("' + String(url).replace(/"/g,'""') + '","' + String(title).replace(/"/g,'""') + '")';
    var briefRow = briefRows.length + 2;
    var briefUrl = SpreadsheetApp.getActiveSpreadsheet().getUrl() + '#gid=' + sbmGetOrCreateSheet_(SBM_SHEETS.BRIEF).getSheetId() + '&range=A' + briefRow;
    var briefFormula = '=HYPERLINK("' + briefUrl + '","ブリーフ")';
    var humanReason = sbmPlainReasonForHuman_(d.Reason, d.Recommendation, d.CTR, d.Position);
    var concrete = sbmConcreteFixText_(d.Recommendation, d.MainQuery, d.SubQueries);
    var example = sbmFixExampleText_(d.Recommendation, d.MainQuery);
    var effect = sbmExpectedEffect_(d.Recommendation, score, d.CTR, d.Position);
    var requestText = sbmImprovementRequestText_(title, url, d.MainQuery, d.SubQueries, d.FAQQueries, d.SeparateArticleQueries, d.NoiseQueries, d.QuerySummary, humanReason, d.Recommendation, concrete, example);
    out.push([priority, m + '分', titleFormula, d.MainQuery, d.Recommendation, briefFormula, false, '', false, false, false, false, false, false, false, false, false, score, url, '未着手', '']);
    briefRows.push([priority, titleFormula, d.MainQuery, d.Recommendation || '', m + '分', effect, false, url, d.SubQueries || '', d.FAQQueries || '', d.SeparateArticleQueries || '', d.NoiseQueries || '', d.QuerySummary || '', humanReason, concrete, example, score, d.CTR || '', d.Position || '', d.Clicks || '', d.Impressions || '', requestText, sbmNowText_()]);
  }
  sbmSetSetting_('DisplayedImprovementCount', out.length, '今日の改善に表示している件数');
  sbmRewriteSheet_(SBM_SHEETS.TODAY, SBM_HEADERS.TODAY, out);
  sbmRewriteSheet_(SBM_SHEETS.BRIEF, SBM_HEADERS.BRIEF, briefRows);
  sbmStyleTodaySheet_(sbmGetOrCreateSheet_(SBM_SHEETS.TODAY));
  sbmStyleBriefSheet_(sbmGetOrCreateSheet_(SBM_SHEETS.BRIEF));
}


function sbmIsImprovementCandidate_(d, activeMap) {
  var url = sbmNormalizeUrl_(d.URL || '');
  if (!url || (activeMap && activeMap[url])) return false;
  var statusText = String(d.DiagnosisCode || '') + ' ' + String(d.Diagnosis || '') + ' ' + String(d.Recommendation || '') + ' ' + String(d['状態'] || '');
  var excludes = ['改善中', '測定中', '良好', '改善不要', '様子見'];
  for (var i = 0; i < excludes.length; i++) {
    if (statusText.indexOf(excludes[i]) !== -1) return false;
  }
  return true;
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
  allowFetch = allowFetch === true && String(sbmGetSetting_('FetchArticleTitles','OFF')).toUpperCase() === 'ON';
  if (!allowFetch) return sbmTitleFromPath_(url);
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
  if (position <= 5 && ctrPct < 3) return {code:'D01', status:'改善候補', diagnosis:'上位表示だがCTRが低い', recommendation:'タイトル修正・ディスクリプション修正・導入文修正', minutes:10, reason:'順位は高い一方でクリック率に改善余地があります。'};
  if (position <= 10 && ctrPct < 2.5) return {code:'D02', status:'改善候補', diagnosis:'1ページ目でCTR改善余地あり', recommendation:'タイトル修正・導入文修正・検索意図調整', minutes:15, reason:'表示回数があるため、クリック率改善で成果が見込めます。'};
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
  var next = 'メニュー「SIMS-Blog-Manager」→「セットアップ」→「初回セットアップを開始」を実行してください。';
  if (setup1 && !setup2) next = 'Google Cloud APIガイドを確認してください。';
  if (setup1 && setup2 && conn !== 'OK') next = 'Search Console接続テストを実行してください。';
  if (setup1 && setup2 && conn === 'OK' && !setup4) next = '初回データ取得を実行してください。';
  if (setup1 && setup2 && conn === 'OK' && setup4) next = '今日の改善を上から順番に実施してください。';
  var cards = sbmRowsAsObjects_(SBM_SHEETS.CARDS);
  var total = sbmNumber_(sbmGetSetting_('TotalArticleCount','0')) || cards.length;
  var good = 0;
  cards.forEach(function(c){ var st = String(c.ArticleStatus || ''); if (st.indexOf('良好') !== -1 || st.indexOf('様子見') !== -1) good++; });
  var goodRate = total ? Math.round(good / total * 100) : 0;
  var inProgress = sbmRowsAsObjects_(SBM_SHEETS.IN_PROGRESS).length;
  var today = sbmRowsAsObjects_(SBM_SHEETS.TODAY);
  var logs = sbmRowsAsObjects_(SBM_SHEETS.PROCESS_LOG);
  var lastLog = logs.length ? (logs[logs.length-1]['処理'] + ' / ' + logs[logs.length-1]['状態'] + ' / ' + logs[logs.length-1]['利用者待ち時間']) : '未実行';
  sh.getRange('B5').setValue(total + '件');
  sh.getRange('B6').setValue(good + '件 / ' + total + '件（' + goodRate + '%）');
  sh.getRange('B7').setValue(sbmGetSetting_('ImprovementCandidateCount','0') + '件');
  sh.getRange('D5').setValue(today.length + '件');
  sh.getRange('D6').setValue(inProgress + '件');
  sh.getRange('D7').setValue(sbmGetSetting_('LastFetchDate','未取得'));
  sh.getRange('D8').setValue(lastLog);
  sh.getRange('B11').setValue(next);
  sh.getRange('B12').setValue(today.length ? today[0]['記事タイトル'] + ' / ' + today[0]['改善内容'] : '未作成');
  sh.getRange('B13').setValue(today.length ? today[0]['時間'] : '-');
  sbmRefreshBlogDashboard_();
}


function sbmIsSetupComplete_() { return sbmGetSetting_('SetupBlogInfo','NO') === 'YES' && sbmGetSetting_('SetupApiGuide','NO') === 'YES'; }
function sbmOpenHome() { sbmRefreshHome_(); sbmOpenSheet_(SBM_SHEETS.HOME); }
function sbmOpenSetup() { sbmOpenSheet_(SBM_SHEETS.SETUP); }
function sbmOpenToday() { sbmOpenSheet_(SBM_SHEETS.TODAY); }
function sbmOpenLog() { sbmOpenSheet_(SBM_SHEETS.LOG); }
function sbmOpenEffect() { sbmOpenSheet_(SBM_SHEETS.EFFECT); }
function sbmOpenInProgress() { sbmBuildInProgressSheet_(); sbmOpenSheet_(SBM_SHEETS.IN_PROGRESS); }
function sbmOpenProcessLog() { sbmOpenSheet_(SBM_SHEETS.PROCESS_LOG); }
function sbmOpenMeasureHistory() { sbmOpenSheet_(SBM_SHEETS.MEASURE_HISTORY); }
function sbmOpenCannibal() { sbmOpenSheet_(SBM_SHEETS.CANNIBAL); }
function sbmOpenTopics() { sbmDeleteDeprecatedSheets_(false); sbmAlert_('未実装です', '記事ネタ候補はProduct 5.0の現段階では未実装です。'); }
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
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SBM_SHEETS.TODAY);
  var map = sbmHeaderMap_(sh);
  var url = map.URL ? String(sh.getRange(row, map.URL).getValue()) : '';
  if (!url) return sbmAlert_('改善ブリーフ', 'この行のURLを確認できませんでした。');
  var briefSh = ss.getSheetByName(SBM_SHEETS.BRIEF);
  if (!briefSh) return sbmAlert_('改善ブリーフ', '改善ブリーフシートが見つかりませんでした。');
  var bMap = sbmHeaderMap_(briefSh);
  var last = briefSh.getLastRow();
  for (var r = 2; r <= last; r++) {
    if (bMap.URL && sbmNormalizeUrl_(briefSh.getRange(r, bMap.URL).getValue()) === sbmNormalizeUrl_(url)) {
      briefSh.showSheet();
      ss.setActiveSheet(briefSh);
      briefSh.setActiveRange(briefSh.getRange(r, 1));
      return;
    }
  }
  sbmAlert_('改善ブリーフ', '該当記事の改善ブリーフが見つかりませんでした。今日のデータを再取得してください。');
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
    '7日測定完了日': sbmDateAfterText_(SBM_DEFAULTS.MEASUREMENT_DAYS),
    '状態': '改善中',
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
    if (sheetName === SBM_SHEETS.BRIEF && map['改善依頼（詳細）'] && col === map['改善依頼（詳細）'] && String(e.value).toUpperCase() === 'TRUE') {
      sh.getRange(row, col).setValue(false);
      sh.setActiveRange(sh.getRange(row, 1));
      sbmShowBriefDetailForRow_(row);
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



function sbmVisibleUserSheets_() {
  return [
    SBM_SHEETS.HOME,
    SBM_SHEETS.DATA_LIST,
    SBM_SHEETS.TODAY,
    SBM_SHEETS.IN_PROGRESS,
    'ブログ診断',
    SBM_SHEETS.PROCESS_LOG,
    SBM_SHEETS.BRIEF
  ];
}

function sbmIsUserVisibleSheet_(name) {
  return sbmVisibleUserSheets_().indexOf(String(name || '')) !== -1;
}

function sbmShowSystemSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.getSheets().forEach(function(s) { s.showSheet(); });
}

function sbmHideSystemSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var home = ss.getSheetByName(SBM_SHEETS.HOME) || ss.insertSheet(SBM_SHEETS.HOME);
  home.showSheet();
  ss.setActiveSheet(home);
  ss.getSheets().forEach(function(s) {
    if (!sbmIsUserVisibleSheet_(s.getName())) {
      try { s.hideSheet(); } catch (e) {}
    }
  });
}


function sbmDeprecatedSheetNames_() {
  return [
    '上位ページ診断',
    'カニバリ診断',
    '記事ネタ候補',
    '効果測定',
    '測定履歴',
    'TopPages',
    'Cannibal',
    'Topics',
    'Effectiveness',
    'Measurement_History'
  ];
}

function sbmDeleteDeprecatedSheets(showAlert) {
  sbmDeleteDeprecatedSheets_(showAlert !== false);
}

function sbmDeleteDeprecatedSheets_(showAlert) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var removed = [];
  sbmDeprecatedSheetNames_().forEach(function(name) {
    var sh = ss.getSheetByName(name);
    if (sh && ss.getSheets().length > 1) {
      try {
        ss.deleteSheet(sh);
        removed.push(name);
      } catch (e) {}
    }
  });
  if (showAlert) {
    sbmAlert_('不要シート削除', removed.length ? ('削除しました: ' + removed.join(', ')) : '削除対象のシートはありませんでした。');
  }
  return removed;
}

function sbmProjectNumberNote_() { return 'Apps Scriptの設定画面で、使用中のGoogle Cloudプロジェクト番号と、Search Console APIを有効化したプロジェクト番号が一致しているか確認してください。'; }

function sbmFriendlyGscError_(message) {
  var m = String(message || '');
  if (/UrlFetchApp|external_request|script\.external_request/i.test(m)) return 'Search Console APIを呼び出す権限が不足しています。\n\n今回のZIPに入っている apps-script/appsscript.json もApps Scriptへ反映し、スクリプトを再読み込みしてから再承認してください。\n\n必要な権限: https://www.googleapis.com/auth/script.external_request\n\n詳細:\n' + m;
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
    var countText = processedCount === undefined ? '' : processedCount;
    sbmAppendObject_(SBM_SHEETS.PROCESS_LOG, SBM_HEADERS.PROCESS_LOG, {
      '開始時刻': startedAt || '',
      '終了時刻': endText,
      '利用者待ち時間': seconds === undefined ? '' : seconds + '秒',
      '処理': name || '',
      '状態': status || '',
      '対象件数': targetCount === undefined ? '' : targetCount,
      '処理件数': countText,
      '件数': countText,
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
    rows.push([l['改善日'] || '', l['記事タイトル'] || sbmResolveArticleTitle_(url,''), elapsed, sbmInProgressStatus_(elapsed, status), sbmInProgressEval_(e['SIMS評価'], elapsed), sbmInProgressNextAction_(e['次のアクション'], elapsed), false, url, l['修正内容'] || '', l['改善内容'] || '']);
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

function sbmExpectedEffect_(recommendation, score, ctr, position) {
  var rec = String(recommendation || '');
  if (/タイトル/.test(rec)) return 'CTR改善';
  if (/導入|冒頭|リード/.test(rec)) return '離脱低下・検索意図一致';
  if (/FAQ|よくある/.test(rec)) return 'ロングテール流入増';
  if (/H2|見出し|構成/.test(rec)) return '順位改善・網羅性向上';
  if (/内部リンク/.test(rec)) return '回遊性向上';
  if (sbmNumber_(position) > 8) return '順位改善';
  if (sbmNumber_(ctr) < 0.02) return 'CTR改善';
  return '検索意図一致・記事品質改善';
}

function sbmConcreteFixText_(recommendation, mainQuery, subQueries) {
  var rec = String(recommendation || '');
  var q = String(mainQuery || '');
  var refs = String(subQueries || '').split('\n').filter(Boolean).slice(0,3).join('、');
  if (/タイトル/.test(rec)) return 'titleタグと記事タイトルの先頭付近に「' + q + '」を自然に入れ、検索者が得られる答えを一目で分かる表現にします。';
  if (/導入|冒頭|リード/.test(rec)) return '冒頭で「この記事で分かること」と結論を先に書き、' + (refs ? '参考クエリ（' + refs + '）にも触れます。' : '検索者の疑問に先回りして答えます。');
  if (/FAQ|よくある/.test(rec)) return '記事末尾にFAQを2〜3問追加し、Search Consoleで実際に出ている疑問系クエリに短く答えます。';
  if (/H2|見出し|構成/.test(rec)) return '不足している検索意図をH2またはH3として追加し、その直下に結論と具体例を入れます。';
  if (/内部リンク/.test(rec)) return '関連する既存記事への内部リンクを、本文中の自然な位置に1〜3本追加します。';
  return 'メインキーワードに対する答えを冒頭・見出し・FAQで分かりやすく補強します。';
}

function sbmFixExampleText_(recommendation, mainQuery) {
  var rec = String(recommendation || '');
  var q = String(mainQuery || '');
  if (/タイトル/.test(rec)) return '例：' + q + 'の原因と直し方｜初心者向けに手順を解説';
  if (/導入|冒頭|リード/.test(rec)) return '例：この記事では、' + q + 'で困っている人向けに、原因・確認手順・解決方法を順番に解説します。';
  if (/FAQ|よくある/.test(rec)) return '例：Q. ' + q + 'は自分で直せますか？ A. 多くの場合は設定確認で直せます。まずは本文の手順を上から試してください。';
  if (/H2|見出し|構成/.test(rec)) return '例：H2「' + q + 'でまず確認すること」を追加し、最初に結論、その後に具体的な手順を書きます。';
  return '例：検索者が最初に知りたい答えを冒頭に1〜2文で追記します。';
}

function sbmPlainReasonForHuman_(reason, recommendation, ctr, position) {
  var base = String(reason || '').trim();
  if (base) return base;
  if (sbmNumber_(ctr) < 0.02) return '検索結果には表示されていますが、クリック率が低いため、タイトルや説明文で記事の内容をもっと分かりやすく伝える必要があります。';
  if (sbmNumber_(position) > 8) return '平均順位がまだ低めなので、検索者が知りたい内容を見出しや本文で補強すると順位改善が期待できます。';
  return 'Search Console上で改善余地があるため、検索意図に合わせて記事の分かりやすさを高めます。';
}

function sbmShowBriefDetailForRow_(row) {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SBM_SHEETS.BRIEF);
  if (!sh) return sbmAlert_('改善ブリーフ', '改善ブリーフシートが見つかりません。');
  var heads = sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0].map(String);
  var vals = sh.getRange(row,1,1,sh.getLastColumn()).getValues()[0];
  var b = {}; heads.forEach(function(h,i){ b[h]=vals[i]; });
  var html = HtmlService.createHtmlOutput(sbmBriefHtml_(b)).setWidth(860).setHeight(760);
  SpreadsheetApp.getUi().showModalDialog(html, '改善依頼（詳細）');
}

function sbmFindBriefByUrl_(url) { var rows = sbmRowsAsObjects_(SBM_SHEETS.BRIEF); var n = sbmNormalizeUrl_(url); for (var i=0;i<rows.length;i++){ if(sbmNormalizeUrl_(rows[i].URL || '') === n) return rows[i]; } return null; }
function sbmImprovementRequestText_(title, url, mainQuery, subQueries, faqQueries, separateQueries, noiseQueries, querySummary, reason, recommendation, concrete, example) {
  return '次の記事を改善してください。\n\n'
    + '記事タイトル: ' + (title || '') + '\n'
    + 'URL: ' + (url || '') + '\n'
    + 'メインキーワード: ' + (mainQuery || '') + '\n\n'
    + '改善内容:\n' + (recommendation || '') + '\n\n'
    + '改善理由:\n' + (reason || '') + '\n\n'
    + '具体的な修正方法:\n' + (concrete || '-') + '\n\n'
    + '修正例:\n' + (example || '-') + '\n\n'
    + '参考クエリ:\n' + (subQueries || '-') + '\n\n'
    + 'FAQ候補:\n' + (faqQueries || '-') + '\n\n'
    + '別記事候補クエリ（この記事には無理に入れない）:\n' + (separateQueries || '-') + '\n\n'
    + '改善に使わない除外クエリ:\n' + (noiseQueries || '-') + '\n\n'
    + '依頼:\nメインキーワードを軸に、検索者が最初に知りたいことへ早く答える形で記事を改善してください。本文・見出し・FAQには参考クエリを自然に反映し、別記事候補や除外クエリはこの記事へ無理に入れないでください。';
}


function sbmBriefHtml_(b) {
  function esc(v){ return String(v || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>'); }
  var request = b['Claude改善依頼文'] || b['改善依頼文'] || sbmImprovementRequestText_(b['記事タイトル'], b.URL, b['メインキーワード'] || b['メインクエリ'], b['サブクエリ'], b['FAQ候補'], b['別記事候補'], b['除外クエリ'], b['クエリ分析'], b['改善理由'] || b['理由'], b['改善内容'] || b['推奨改善'], b['具体的な修正方法'], b['修正例']);
  return '<div style="font-family:Arial,sans-serif;line-height:1.65;padding:20px;color:#202124">'
    + '<h2 style="margin-top:0">改善依頼（詳細）</h2>'
    + '<div style="background:#e8f0fe;padding:14px;border-radius:10px;margin-bottom:14px"><b>' + esc(b['記事タイトル']) + '</b><br><a href="' + esc(b.URL) + '" target="_blank">記事を開く</a></div>'
    + '<table style="border-collapse:collapse;width:100%;margin-bottom:16px"><tr>'
    + '<th style="border:1px solid #ddd;padding:8px;background:#f8fafd">改善内容</th><th style="border:1px solid #ddd;padding:8px;background:#f8fafd">予想時間</th><th style="border:1px solid #ddd;padding:8px;background:#f8fafd">期待効果</th><th style="border:1px solid #ddd;padding:8px;background:#f8fafd">メインキーワード</th></tr>'
    + '<tr><td style="border:1px solid #ddd;padding:8px">' + esc(b['改善内容'] || b['推奨改善']) + '</td><td style="border:1px solid #ddd;padding:8px">' + esc(b['予想時間'] || b['推定時間']) + '</td><td style="border:1px solid #ddd;padding:8px">' + esc(b['期待効果']) + '</td><td style="border:1px solid #ddd;padding:8px">' + esc(b['メインキーワード'] || b['メインクエリ']) + '</td></tr></table>'
    + '<h3>なぜ改善するのか</h3><p>' + esc(b['改善理由'] || b['理由']) + '</p>'
    + '<h3>具体的な修正方法</h3><p>' + esc(b['具体的な修正方法']) + '</p>'
    + '<h3>修正例</h3><p>' + esc(b['修正例']) + '</p>'
    + '<h3>参考クエリ</h3><p>' + esc(b['サブクエリ']) + '</p>'
    + '<h3>FAQ候補</h3><p>' + esc(b['FAQ候補']) + '</p>'
    + '<h3>Claude / ChatGPT に貼り付ける改善依頼</h3>'
    + '<textarea style="width:100%;height:240px;font-family:monospace;font-size:12px;white-space:pre-wrap">' + String(request || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</textarea>'
    + '<h3>データ</h3><p>CTR ' + esc(b.CTR) + ' / 平均順位 ' + esc(b['平均順位'] || b.Position) + ' / クリック ' + esc(b['クリック数'] || b.Clicks) + ' / 表示回数 ' + esc(b['表示回数'] || b.Impressions) + '</p>'
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
  var sh = SpreadsheetApp.getActiveSheet();
  if (!sh || sh.getName() !== SBM_SHEETS.CANNIBAL) { sbmAlert_('カニバリ診断を開いてください','カニバリ診断シートで対象行を選択してから実行してください。'); return; }
  var row = sh.getActiveRange().getRow();
  if (row <= 1) return;
  sbmShowCannibalDetailForRow_(row);
}

function sbmShowCannibalDetailForRow_(row) {
  var sh = sbmGetOrCreateSheet_(SBM_SHEETS.CANNIBAL);
  var heads = sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0].map(String);
  var vals = sh.getRange(row,1,1,sh.getLastColumn()).getValues()[0];
  var o = {}; heads.forEach(function(h,i){ o[h]=vals[i]; });
  var html = HtmlService.createHtmlOutput(sbmCannibalDetailHtml_(o)).setWidth(820).setHeight(680);
  SpreadsheetApp.getUi().showModalDialog(html, 'カニバリ診断の詳細');
}

function sbmCannibalDetailHtml_(o) {
  function esc(v){ return String(v || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>'); }
  return '<div style="font-family:Arial,sans-serif;line-height:1.65;padding:18px;color:#202124">'
    + '<h2 style="margin-top:0">カニバリ診断の詳細</h2>'
    + '<p><b>判定:</b> ' + esc(o['判定']) + '　<b>共通クエリ:</b> ' + esc(o['共通クエリ']) + '</p>'
    + '<h3>対象記事</h3><ul><li><a href="' + esc(o['記事A URL']) + '" target="_blank">' + esc(o['記事Aタイトル']) + '</a>（クリック ' + esc(o['記事Aクリック']) + ' / 順位 ' + esc(o['記事A順位']) + '）</li>'
    + '<li><a href="' + esc(o['記事B URL']) + '" target="_blank">' + esc(o['記事Bタイトル']) + '</a>（クリック ' + esc(o['記事Bクリック']) + ' / 順位 ' + esc(o['記事B順位']) + '）</li></ul>'
    + '<h3>推奨対応</h3><p>' + esc(o['推奨対応']) + '</p>'
    + '<h3>診断理由</h3><p>' + esc(o['理由']) + '</p>'
    + '<p style="color:#5f6368">確認日: ' + esc(o['確認日']) + '</p></div>';
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
    if (elapsed !== '' && elapsed < SBM_DEFAULTS.MEASUREMENT_DAYS) {
      if ((posDelta && posDelta >= 2) || ctrDelta >= 0.005 || clickDelta >= 5) outcome = '改善傾向';
      else if ((posDelta && posDelta <= -3) || ctrDelta < -0.005) outcome = '要確認';
      else outcome = '測定中';
    } else if (elapsed !== '') {
      if ((posDelta && posDelta >= 2) || ctrDelta >= 0.005 || clickDelta >= 5) outcome = '成功';
      else if ((posDelta && posDelta <= -3) || ctrDelta < -0.005) outcome = '要再改善';
      else outcome = '横ばい';
    }
    var next = elapsed === '' ? '' : (elapsed < SBM_DEFAULTS.MEASUREMENT_DAYS ? '次回の週次測定で確認' : '2か月測定完了');
    var simsEval = sbmEvaluateEffectResult_(outcome, posDelta, ctrDelta, clickDelta);
    var nextAction = sbmSuggestNextAction_(outcome, l['改善内容'] || '', l['修正内容'] || '', posDelta, ctrDelta, clickDelta);
    effectRows.push([displayTitle || '', l['改善日']||'', l['改善内容']||'', outcome, simsEval, nextAction, false, url, l['修正内容']||'', elapsed, beforePos, nowPos || '', posDelta, beforeCtr, nowCtr || '', ctrDelta, beforeClicks, nowClicks || '', clickDelta, next, '']);
    if (elapsed !== '' && elapsed <= SBM_DEFAULTS.MEASUREMENT_DAYS && (elapsed % 7 === 0 || elapsed === 0)) {
      historyRowsToAppend.push([displayTitle || '', l['改善日']||'', sbmDateText_(today), elapsed, nowPos || '', nowCtr || '', nowClicks || '', nowImpressions || '', outcome, url]);
    }
  });
  sbmRewriteSheet_(SBM_SHEETS.EFFECT, SBM_HEADERS.EFFECT, effectRows);
  sbmAppendMeasurementHistoryUnique_(historyRowsToAppend);
  sbmStyleEffectSheet_(sbmGetOrCreateSheet_(SBM_SHEETS.EFFECT));
  sbmStyleMeasureHistorySheet_(sbmGetOrCreateSheet_(SBM_SHEETS.MEASURE_HISTORY));
  sbmBuildInProgressSheet_();
  sbmRefreshHome_();
  if (showAlert) sbmAlert_('効果測定を更新しました', '改善ログをもとに効果測定を更新しました。\nProduct 5.0では週1回、最大2か月の効果測定を記録します。');
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
  if (outcome === '成功' || outcome === '改善傾向') return 'このまま測定継続。追加改善は急がず、2か月の週次推移を確認してください。';
  if (outcome === '要再改善' || outcome === '要確認') {
    if (text.indexOf('タイトル') === -1 && text.indexOf('Title') === -1) return 'タイトル・ディスクリプション・導入文を再確認してください。';
    if (text.indexOf('FAQ') === -1) return 'FAQ追加、本文補強、検索意図に合うH2追加を検討してください。';
    return '改善内容を見直し、別記事候補・カニバリ候補も確認してください。';
  }
  if (outcome === '横ばい') return '測定継続。動きが弱い場合はFAQ追加または内部リンク追加を検討してください。';
  return 'まだ判断しません。RCテストでは毎日測定し、2か月の週次推移を確認してください。';
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


function sbmStartProcessStatus_(processName, detail) {
  sbmSetProcessStatus_('● 処理中', processName, sbmNowText_(), '-', '-', detail || '処理を開始しました。');
}

function sbmCompleteProcessStatus_(processName, result, startedText, seconds) {
  sbmSetProcessStatus_('完了', processName, startedText || '-', sbmNowText_(), (seconds || 0) + '秒', result || '処理が完了しました。');
}

function sbmErrorProcessStatus_(processName, errorMessage, startedText, seconds) {
  sbmSetProcessStatus_('エラー', processName, startedText || '-', sbmNowText_(), (seconds || 0) + '秒', errorMessage || 'エラーが発生しました。');
}

function sbmEstimatedFinishText_(startedAt) {
  var sec = Number(sbmGetSetting_('LastFetchSeconds', ''));
  if (!sec || sec <= 0 || sec > 1500) return '';
  try {
    var base = startedAt instanceof Date ? startedAt : new Date();
    var d = new Date(base.getTime() + sec * 1000);
    return Utilities.formatDate(d, Session.getScriptTimeZone(), 'HH:mm頃');
  } catch(e) {
    return '';
  }
}

function sbmSetProcessStatus_(status, processName, startedAt, finishedAt, elapsed, detail) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName(SBM_SHEETS.HOME) || sbmGetOrCreateSheet_(SBM_SHEETS.HOME);
    if (String(sh.getRange('A15').getValue()) !== '処理状況') {
      sh.getRange('A15:D19').clearContent();
      sh.getRange('A15:D15').merge().setValue('処理状況');
      sh.getRange('A16:D19').setValues([
        ['現在の状態', '待機中', '実行中/最後の処理', '-'],
        ['開始時刻', '-', '完了時刻', '-'],
        ['経過時間', '-', '処理結果', '-'],
        ['お願い', '', '', '']
      ]);
      sbmStyleHomeSheet_(sh);
    }
    var isRunning = String(status || '').indexOf('処理中') !== -1;
    sh.getRange('B16').setValue(status || '● 処理中');
    sh.getRange('D16').setValue(processName || '-');
    sh.getRange('B17').setValue(startedAt || sbmNowText_());
    sh.getRange('C17').setValue(isRunning ? '完了予定' : '完了時刻');
    sh.getRange('D17').setValue(isRunning ? (finishedAt || '') : (finishedAt || ''));
    sh.getRange('B18').setValue(elapsed || '');
    sh.getRange('D18').setValue(detail || '');

    var isError = String(status || '') === 'エラー';
    var isComplete = String(status || '') === '完了';
    if (isRunning) {
      sh.getRange('A16:D18').setBackground('#FEF3C7').setFontColor('#111827').setFontWeight('normal');
      sh.getRange('B16').setBackground('#DC2626').setFontColor('#FFFFFF').setFontWeight('bold');
      sh.getRange('A19:D19').setFontColor('#DC2626').setFontWeight('bold').setBackground('#FFF1F2');
      sh.getRange('B19').setValue('処理中は他のメニューを実行しないでください。シートの閲覧は可能ですが、編集しないでください。');
      sh.getRange('B16:D18').setWrap(true);
    } else if (isError) {
      sh.getRange('B16').setBackground('#FEE2E2').setFontColor('#B91C1C').setFontWeight('bold');
      sh.getRange('A19:D19').setFontColor('#B91C1C').setFontWeight('bold').setBackground('#FEE2E2');
      sh.getRange('B19').setValue('エラーが発生しました。処理ログを確認してください。');
    } else if (isComplete) {
      sh.getRange('A16:D18').setBackground('#DCFCE7').setFontColor('#111827').setFontWeight('normal');
      sh.getRange('B16').setBackground('#DCFCE7').setFontColor('#166534').setFontWeight('bold');
      sh.getRange('A19:D19').setFontColor('#000000').setFontWeight('normal').setBackground('#FFFFFF');
      sh.getRange('B19:D19').clearContent();
    } else {
      sh.getRange('A16:D18').setBackground('#DCFCE7').setFontColor('#000000').setFontWeight('normal');
      sh.getRange('B19:D19').clearContent();
    }
    ss.setActiveSheet(sh);
    SpreadsheetApp.flush();
  } catch (e) {}
}

function sbmProgress_(title, message) {
  var now = new Date();
  sbmSetProcessStatus_('● 処理中', title, sbmNowText_(), sbmEstimatedFinishText_(now), '', message || '処理中です。');
  try { sbmToast_(message || title, title, 10); } catch(e) {}
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
  var widths = [70,70,320,190,250,110,70,180,55,55,85,65,65,55,85,75,65,60,1,80,120];
  widths.forEach(function(w,i){ try{ sh.setColumnWidth(i+1,w); }catch(e){} });
  try { sh.hideColumns(19); } catch(e) {}
  var lr = Math.max(sh.getLastRow(),2);
  if (lr > 1) {
    sh.setRowHeights(2, lr-1, 42);
    try { sh.getRange(2,7,lr-1,1).insertCheckboxes(); } catch(e) {}
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
    sh.setColumnWidth(1,150); // 開始時刻
    sh.setColumnWidth(2,150); // 終了時刻
    sh.setColumnWidth(3,120); // 利用者待ち時間
    sh.setColumnWidth(4,240); // 処理
    sh.setColumnWidth(5,90);  // 状態
    sh.setColumnWidth(6,90);  // 対象件数
    sh.setColumnWidth(7,90);  // 処理件数
    sh.setColumnWidth(8,80);  // 件数
    sh.setColumnWidth(9,420); // 詳細
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
  try {
    sh.setFrozenRows(1);
    var widths = [80,340,170,240,90,150,130];
    widths.forEach(function(w,i){ sh.setColumnWidth(i+1,w); });
    if (sh.getLastColumn() >= 8) { sh.setColumnWidths(8, sh.getLastColumn()-7, 1); sh.hideColumns(8, sh.getLastColumn()-7); }
    if (sh.getLastRow() > 1) {
      sh.getRange(2,7,sh.getLastRow()-1,1).insertCheckboxes();
      sh.setRowHeights(2, Math.max(1, sh.getLastRow()-1), 58);
    }
    sh.getRange(1,1,1,Math.max(sh.getLastColumn(),1)).setBackground('#1f4e79').setFontColor('#ffffff').setFontWeight('bold');
    sh.getRange(1,1,Math.max(1, sh.getLastRow()),Math.min(7, sh.getLastColumn())).setWrap(true).setVerticalAlignment('top');
  } catch(e) {}
}

function sbmInProgressStatus_(elapsed, currentStatus) {
  var st = String(currentStatus || '');
  if (st === '再修正') return '再測定中';
  if (elapsed === '' || elapsed === null) return '測定準備';
  if (elapsed >= SBM_DEFAULTS.MEASUREMENT_DAYS) return '測定完了確認';
  return '測定中';
}

function sbmInProgressEval_(effectEval, elapsed) {
  if (effectEval) return effectEval;
  if (elapsed === '' || elapsed === null) return 'データ待ち';
  if (elapsed < 7) return '測定前（7日未満）';
  if (elapsed >= SBM_DEFAULTS.MEASUREMENT_DAYS) return '2か月経過・最終確認';
  return '測定中（週1回確認）';
}

function sbmInProgressNextAction_(effectAction, elapsed) {
  if (effectAction) return effectAction;
  if (elapsed === '' || elapsed === null) return '改善実施日を確認してください';
  if (elapsed >= SBM_DEFAULTS.MEASUREMENT_DAYS) return '改善ログへ保存して測定終了を確認';
  return '次回測定日にSearch Consoleデータを確認';
}
function sbmStyleUserSheet_(sh, color) { var lc=Math.max(sh.getLastColumn(),2); var lr=Math.max(sh.getLastRow(),1); sh.setFrozenRows(1); sh.getRange(1,1,1,lc).setFontWeight('bold').setFontSize(15).setBackground(color).setFontColor('#ffffff'); sh.getRange(1,1,lr,lc).setVerticalAlignment('top').setWrap(true); sh.getRange(1,1,lr,lc).setBorder(true,true,true,true,true,true); }
function sbmApplySheetUx_() { var ss=SpreadsheetApp.getActiveSpreadsheet(); sbmVisibleUserSheets_().forEach(function(n){ var s=ss.getSheetByName(n); if(s) s.showSheet(); }); sbmHideSystemSheets(); }


/**
 * Product 5.0 Official - データ一覧
 * Search Console取得データをURL単位で集約し、ブログ改善管理状況を一覧表示する。
 */
function sbmBuildDataListSheet_() {
  var sh = sbmGetOrCreateSheet_(SBM_SHEETS.DATA_LIST || 'データ一覧');
  sbmRewriteSheet_(SBM_SHEETS.DATA_LIST || 'データ一覧', SBM_HEADERS.DATA_LIST, []);
  sbmStyleDataListSheet_(sh);
}

function sbmOpenDataList() {
  sbmRefreshDataList_();
  sbmOpenSheet_(SBM_SHEETS.DATA_LIST || 'データ一覧');
}

function sbmRefreshDataList_() {
  var rows = sbmBuildDataListRows_();
  sbmRewriteSheet_(SBM_SHEETS.DATA_LIST || 'データ一覧', SBM_HEADERS.DATA_LIST, rows);
  sbmStyleDataListSheet_(sbmGetOrCreateSheet_(SBM_SHEETS.DATA_LIST || 'データ一覧'));
  try { sbmProcessLog_('データ一覧更新', '完了', rows.length, rows.length, '', 'Search Console取得データを記事単位で集約。', sbmNowText_(), sbmNowText_()); } catch(e) {}
  return rows.length;
}

function sbmBuildDataListRows_() {
  var queryRows = sbmRowsAsObjects_(SBM_SHEETS.QUERY_DATA);
  var cards = sbmRowsAsObjects_(SBM_SHEETS.CARDS);
  var queue = sbmRowsAsObjects_('Improvement_Queue');
  var inProgress = sbmRowsAsObjects_(SBM_SHEETS.IN_PROGRESS);
  var logs = sbmRowsAsObjects_(SBM_SHEETS.LOG);
  var cardByUrl = {};
  cards.forEach(function(c){
    var u = sbmNormalizeUrl_(c.URL || c['記事URL'] || '');
    if (u) cardByUrl[u] = c;
  });
  var queueSet = {};
  queue.forEach(function(q){ var u = sbmNormalizeUrl_(q.URL || q['記事URL'] || ''); if (u) queueSet[u] = true; });
  var progressSet = {};
  inProgress.forEach(function(p){ var u = sbmNormalizeUrl_(p.URL || p['記事URL'] || ''); if (u) progressSet[u] = true; });
  logs.forEach(function(l){
    var u = sbmNormalizeUrl_(l.URL || l['記事URL'] || '');
    var st = String(l['状態'] || '');
    if (u && st !== '完了' && st !== '成功') progressSet[u] = true;
  });
  var agg = {};
  queryRows.forEach(function(r){
    var rawUrl = r.URL || r['URL'] || '';
    var u = sbmNormalizeUrl_(rawUrl);
    if (!u) return;
    var q = String(r.Query || r['クエリ'] || r['Query'] || '').trim();
    if (!agg[u]) agg[u] = {url: rawUrl || u, clicks:0, impressions:0, posWeight:0, queries:{}};
    var clicks = sbmNumber_(r.Clicks || r['クリック'] || r['クリック数']);
    var imps = sbmNumber_(r.Impressions || r['表示回数']);
    var pos = sbmNumber_(r.Position || r['掲載順位'] || r['平均順位']);
    agg[u].clicks += clicks;
    agg[u].impressions += imps;
    agg[u].posWeight += pos * (imps || 1);
    if (q) {
      if (!agg[u].queries[q]) agg[u].queries[q] = {query:q, clicks:0, impressions:0};
      agg[u].queries[q].clicks += clicks;
      agg[u].queries[q].impressions += imps;
    }
  });
  Object.keys(cardByUrl).forEach(function(u){ if (!agg[u]) agg[u] = {url: cardByUrl[u].URL || u, clicks:0, impressions:0, posWeight:0, queries:{}}; });
  var out = Object.keys(agg).map(function(u){
    var a = agg[u];
    var c = cardByUrl[u] || {};
    var mainQ = c.MainQuery || c['メインクエリ'] || sbmTopQuery_(a.queries);
    var title = c.Title || c['Title'] || c['記事タイトル'] || '';
    var status = sbmResolveArticleStatus_(u, c, queueSet, progressSet, a);
    var meta = sbmResolveArticleMetaForDataList_(a.url || u, c, title);
    var ctr = a.impressions ? a.clicks / a.impressions : '';
    var pos = a.impressions ? a.posWeight / a.impressions : '';
    return [status, a.url || u, meta.h1, meta.titleTag, mainQ, a.clicks, a.impressions, ctr, pos];
  });
  out.sort(function(a,b){
    var order = {'良好':1,'改善中':2,'改善候補':3,'様子見':4,'管理対象外':5};
    var ao = order[a[0]] || 9, bo = order[b[0]] || 9;
    if (ao !== bo) return ao - bo;
    return sbmNumber_(b[5]) - sbmNumber_(a[5]);
  });
  return out;
}

function sbmTopQuery_(queryMap) {
  var best = '';
  var bestScore = -1;
  Object.keys(queryMap || {}).forEach(function(k){
    var q = queryMap[k];
    var score = (q.clicks || 0) * 1000000 + (q.impressions || 0);
    if (score > bestScore) { bestScore = score; best = q.query; }
  });
  return best;
}

function sbmResolveArticleStatus_(url, card, queueSet, progressSet, agg) {
  var normalized = sbmNormalizeUrl_(url);
  if (!normalized || String(url || '').indexOf('#') !== -1) return '管理対象外';
  if (progressSet[normalized]) return '改善中';
  if (queueSet[normalized]) return '改善候補';
  var st = String(card.ArticleStatus || card['記事ステータス'] || card['状態'] || '').trim();
  st = st.replace('良好/様子見', '').replace('良好・様子見', '').trim();
  if (st === '改善不要') return '良好';
  if (st === '良好' || st === '改善中' || st === '改善候補' || st === '様子見' || st === '管理対象外') return st;
  var impressions = agg ? sbmNumber_(agg.impressions) : 0;
  var clicks = agg ? sbmNumber_(agg.clicks) : 0;
  var pos = agg && agg.impressions ? (sbmNumber_(agg.posWeight) / Math.max(1, sbmNumber_(agg.impressions))) : 0;
  if (impressions < 30 && clicks < 3) return '様子見';
  return '良好';
}

function sbmResolveArticleMetaForDataList_(url, card, fallbackTitle) {
  var h1 = String(card.H1 || card['H1'] || card['記事タイトル'] || fallbackTitle || '').trim();
  var titleTag = String(card.TitleTag || card['titleタグ'] || card['Title'] || fallbackTitle || '').trim();
  if (String(url || '').indexOf('#') !== -1) {
    return {h1: h1 || sbmTitleFromPath_(url), titleTag: titleTag || h1 || sbmTitleFromPath_(url)};
  }
  var fetched = sbmFetchArticleMeta_(url);
  if (fetched.h1) h1 = fetched.h1;
  if (fetched.titleTag) titleTag = fetched.titleTag;
  if (!h1) h1 = sbmTitleFromPath_(url);
  if (!titleTag) titleTag = h1;
  return {h1:h1, titleTag:titleTag};
}

function sbmFetchArticleMeta_(url) {
  url = sbmNormalizeUrl_(url);
  var empty = {h1:'', titleTag:''};
  if (!url || /^sc-domain:/i.test(url)) return empty;
  var cache = CacheService.getScriptCache();
  var key = 'meta:' + Utilities.base64EncodeWebSafe(url).slice(0,180);
  var cached = cache.get(key);
  if (cached) {
    try { return JSON.parse(cached); } catch(e) {}
  }
  var meta = {h1:'', titleTag:''};
  try {
    var res = UrlFetchApp.fetch(url, {muteHttpExceptions:true, followRedirects:true, headers:{'User-Agent':'SIMS-Blog-Manager'}});
    var html = res.getContentText() || '';
    var titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    var h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (h1Match && h1Match[1]) meta.h1 = sbmCleanHtmlText_(h1Match[1]);
    if (titleMatch && titleMatch[1]) meta.titleTag = sbmCleanHtmlText_(titleMatch[1]);
  } catch(e) {}
  try { cache.put(key, JSON.stringify(meta), 21600); } catch(e2) {}
  return meta;
}

function sbmCleanHtmlText_(text) {
  return String(text || '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#124;/g, '|')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function sbmStyleDataListSheet_(sh) {
  if (!sh) return;
  try {
    var headers = SBM_HEADERS.DATA_LIST;
    sh.getRange(1, 1, 1, headers.length).setValues([headers]);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, headers.length).setBackground('#0F766E').setFontColor('#ffffff').setFontWeight('bold').setHorizontalAlignment('center');
    sh.setColumnWidth(1, 110);
    sh.setColumnWidth(2, 360);
    sh.setColumnWidth(3, 260);
    sh.setColumnWidth(4, 260);
    sh.setColumnWidth(5, 220);
    sh.setColumnWidth(6, 90);
    sh.setColumnWidth(7, 100);
    sh.setColumnWidth(8, 80);
    sh.setColumnWidth(9, 90);
    var max = Math.max(2, sh.getLastRow());
    sh.getRange(2, 2, max - 1, 3).setWrap(true);
    sh.getRange(2, 6, max - 1, 2).setNumberFormat('#,##0');
    sh.getRange(2, 8, max - 1, 1).setNumberFormat('0.00%');
    sh.getRange(2, 9, max - 1, 1).setNumberFormat('0.0');
    sh.getRange(1, 1, max, headers.length).setBorder(true, true, true, true, true, true, '#dddddd', SpreadsheetApp.BorderStyle.SOLID);
  } catch(e) {}
}


/**
 * Product 5.0 Slim Guard
 * 現段階で未実装にする保留機能。
 * RC9由来の処理が誤って呼ばれても、シート作成や分析は行わない。
 */
function sbmBuildCannibalDiagnosis_() {
  sbmDeleteDeprecatedSheets_(false);
  return 0;
}
function sbmUpdateEffectivenessSilent_() {
  sbmDeleteDeprecatedSheets_(false);
  return 0;
}
function sbmUpdateEffectivenessFromLog() {
  sbmDeleteDeprecatedSheets_(false);
  sbmAlert_('未実装です', '効果測定はProduct 5.0の現段階では未実装です。改善中シートの確認後に正式仕様として追加します。');
}
function sbmRecordTodayMeasurement() {
  sbmDeleteDeprecatedSheets_(false);
  sbmAlert_('未実装です', '測定履歴はProduct 5.0の現段階では未実装です。');
}
function sbmShowSelectedCannibalDetail() {
  sbmDeleteDeprecatedSheets_(false);
  sbmAlert_('未実装です', 'カニバリ診断はProduct 5.0の現段階では未実装です。');
}


/** Product 5.0 Topic Guard Final */

function sbmUniqueTopicRows_(rows) {
  // Product 5.0: 記事ネタ候補は未実装。シート生成につながる処理を行わない。
  return [];
}
function sbmStyleTopicSheet_(sh) {
  // Product 5.0: 記事ネタ候補は未実装。
  return;
}
function sbmOpenTopics() {
  sbmDeleteDeprecatedSheets_(false);
  sbmAlert_('未実装です', '記事ネタ候補はProduct 5.0の現段階では未実装です。');
}
