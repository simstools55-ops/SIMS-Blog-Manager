/**
 * SIMS-Blog-Manager Product 3.2
 * SIMS-Core Slim Edition for daily SEO improvement management.
 *
 * Product policy:
 * - No Claude / AI Exchange / Knowledge Engine dependency.
 * - Google Search Console + Spreadsheet only.
 * - First setup is checklist-based, not a continuous wizard.
 * - Daily GSC fetch is blocked until setup and connection test are complete.
 */

var SBM_VERSION = '3.2.0-rc1';

var SBM_SHEETS = {
  HOME: '🏠 ホーム',
  SETUP: '⚙ セットアップ',
  TODAY: '📝 今日の改善',
  LOG_VIEW: '📚 改善ログ',
  EFFECT_VIEW: '📊 効果測定',
  SETTINGS: 'Settings',
  SYSTEM_LOG: 'System_Log',
  QUERY_DATA: 'Query_Data',
  ARTICLE_CARDS: 'Article_Cards',
  DIAGNOSIS: 'Article_Diagnosis',
  IMPROVEMENT_LOG: 'Improvement_Log',
  EFFECTIVENESS: 'Effectiveness',
  ERROR_LOG: 'Error_Log'
};

var SBM_USER_SHEETS = [
  '🏠 ホーム',
  '⚙ セットアップ',
  '📝 今日の改善',
  '📚 改善ログ',
  '📊 効果測定'
];

var SBM_SYSTEM_SHEETS = [
  'Settings',
  'System_Log',
  'Query_Data',
  'Article_Cards',
  'Article_Diagnosis',
  'Improvement_Log',
  'Effectiveness',
  'Error_Log'
];

var SBM_HEADERS = {
  SETTINGS: ['Key', 'Value', 'Description', 'UpdatedAt'],
  SYSTEM_LOG: ['CreatedAt', 'Action', 'Status', 'Detail', 'User'],
  QUERY_DATA: ['CapturedAt', 'StartDate', 'EndDate', 'URL', 'Query', 'Clicks', 'Impressions', 'CTR', 'Position'],
  ARTICLE_CARDS: ['ArticleId', 'URL', 'Title', 'MainQuery', 'Clicks', 'Impressions', 'CTR', 'Position', 'Managed', 'Status', 'OpportunityScore', 'RecommendedAction', 'EstimatedMinutes', 'LastImprovedAt', 'ImprovementCount', 'LastAnalyzedAt'],
  DIAGNOSIS: ['CapturedAt', 'URL', 'Title', 'MainQuery', 'CoreQueries', 'BodyQueries', 'FAQQueries', 'Clicks', 'Impressions', 'CTR', 'Position', 'DiagnosisCode', 'Diagnosis', 'RecommendedAction', 'EstimatedMinutes', 'ExpectedImpact', 'OpportunityScore', 'Reason'],
  IMPROVEMENT_LOG: ['ImprovedAt', 'URL', 'Title', 'MainQuery', 'Action', 'ActualMinutes', 'Memo', 'BeforeCTR', 'BeforePosition', 'BeforeClicks', 'BeforeImpressions', 'Measure14Date', 'Measure30Date'],
  EFFECTIVENESS: ['URL', 'Title', 'ImprovedAt', 'Action', 'BeforeCTR', 'CTR14', 'CTR30', 'BeforePosition', 'Position14', 'Position30', 'DeltaClicks', 'DeltaImpressions', 'Outcome', 'Comment'],
  ERROR_LOG: ['CreatedAt', 'Action', 'ErrorType', 'Message', 'Detail']
};

var SBM_DEFAULTS = {
  TIMEZONE: 'Asia/Tokyo',
  SEARCH_CONSOLE_DAYS: 28,
  SEARCH_CONSOLE_DELAY_DAYS: 3,
  MAX_QUERY_ROWS: 5000,
  MANAGED_RATIO: 30,
  DAILY_BUDGET_MINUTES: 30,
  QUEUE_MAX: 20,
  RELATED_QUERY_COUNT: 20,
  MIN_IMPRESSIONS: 50,
  MIN_CLICKS: 0,
  PROTECTION_DAYS: 14
};

function onOpen() {
  sbmCreateMenu_();
  sbmEnsureBaseSheets_();
  sbmRefreshHome();
  sbmMaybePromptDailyUpdate_();
}

function sbmCreateMenu_() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('SIMS-Blog-Manager')
    .addItem('🏠 ホームを開く', 'sbmOpenHome')
    .addItem('表示を更新', 'sbmRefreshHome')
    .addSeparator()
    .addSubMenu(ui.createMenu('⚙ セットアップ')
      .addItem('STEP1 ブログ情報を入力', 'sbmSetupBlogInfo')
      .addItem('STEP2 Google Cloud API設定ガイド', 'sbmOpenGoogleCloudGuide')
      .addItem('STEP3 Search Console接続テスト', 'sbmTestSearchConsoleConnection')
      .addItem('STEP4 初回データ取得・分析', 'sbmRunDailyUpdate')
      .addItem('セットアップシートを開く', 'sbmOpenSetup'))
    .addSubMenu(ui.createMenu('Search Console')
      .addItem('接続テスト', 'sbmTestSearchConsoleConnection')
      .addItem('今日のデータを取得・分析', 'sbmRunDailyUpdate')
      .addItem('強制再取得', 'sbmForceDailyUpdate'))
    .addSubMenu(ui.createMenu('改善')
      .addItem('今日の改善を開く', 'sbmOpenToday')
      .addItem('選択行を完了として記録', 'sbmCompleteSelectedImprovement')
      .addItem('改善ログを開く', 'sbmOpenLogView')
      .addItem('効果測定を更新', 'sbmUpdateEffectiveness'))
    .addSubMenu(ui.createMenu('表示')
      .addItem('システムタブを表示', 'sbmShowSystemSheets')
      .addItem('システムタブを非表示', 'sbmHideSystemSheets'))
    .addToUi();
}

function sbmEnsureBaseSheets_() {
  Object.keys(SBM_HEADERS).forEach(function(key) {
    var sheetName = SBM_SHEETS[key] || key;
    var sheet = sbmGetOrCreateSheet_(sheetName);
    sbmEnsureHeaders_(sheet, SBM_HEADERS[key]);
    sbmStyleDataSheet_(sheet);
  });
  sbmEnsureDefaultSettings_();
  sbmEnsureUserSheets_();
  sbmApplyUx_();
}

function sbmEnsureDefaultSettings_() {
  sbmSetSetting_('ProductVersion', SBM_VERSION, 'Product version');
  sbmSetSettingIfEmpty_('SetupStep', '0', '0=not started, 1=blog info, 2=API guide opened, 3=connection ok, 4=data fetched');
  sbmSetSettingIfEmpty_('SetupComplete', 'NO', 'YES only after connection test succeeds and first fetch is complete');
  sbmSetSettingIfEmpty_('BlogName', '', 'ブログ名');
  sbmSetSettingIfEmpty_('BlogUrl', '', 'ブログURL');
  sbmSetSettingIfEmpty_('SearchConsoleProperty', '', 'Search Console property. Example: sc-domain:example.com or https://example.com/');
  sbmSetSettingIfEmpty_('GoogleCloudGuideOpened', 'NO', 'YES after Google Cloud API setup guide has been opened');
  sbmSetSettingIfEmpty_('SearchConsoleStatus', '未確認', 'OK / Error / 未確認');
  sbmSetSettingIfEmpty_('LastSearchConsoleTestAt', '', 'Last connection test datetime');
  sbmSetSettingIfEmpty_('LastFetchDate', '', 'yyyy-MM-dd');
  sbmSetSettingIfEmpty_('ManagedRatio', SBM_DEFAULTS.MANAGED_RATIO, '管理対象割合（%）');
  sbmSetSettingIfEmpty_('DailyBudgetMinutes', SBM_DEFAULTS.DAILY_BUDGET_MINUTES, '今日の改善時間（分）');
  sbmSetSettingIfEmpty_('QueueMax', SBM_DEFAULTS.QUEUE_MAX, '今日の改善に表示する最大件数');
  sbmSetSettingIfEmpty_('RelatedQueryCount', SBM_DEFAULTS.RELATED_QUERY_COUNT, '参考クエリ数');
  sbmSetSettingIfEmpty_('MinImpressions', SBM_DEFAULTS.MIN_IMPRESSIONS, '最低表示回数');
  sbmSetSettingIfEmpty_('MinClicks', SBM_DEFAULTS.MIN_CLICKS, '最低クリック数');
  sbmSetSettingIfEmpty_('ProtectionDays', SBM_DEFAULTS.PROTECTION_DAYS, '改善後、再提案しない日数');
}

function sbmEnsureUserSheets_() {
  sbmEnsureHomeSheet_();
  sbmEnsureSetupSheet_();
  sbmEnsureTodaySheet_();
  sbmEnsureLogViewSheet_();
  sbmEnsureEffectViewSheet_();
}

function sbmEnsureHomeSheet_() { sbmGetOrCreateSheet_(SBM_SHEETS.HOME); }

function sbmEnsureSetupSheet_() {
  var sh = sbmGetOrCreateSheet_(SBM_SHEETS.SETUP);
  sh.clear();
  var rows = [
    ['SIMS-Blog-Manager セットアップ', 'チェックリスト形式で進めます。外部URLを開いたら、このシートに戻って次のSTEPを実行してください。', '', ''],
    ['初回認証について', '初めてApps Scriptを実行するとGoogleの承認画面が表示されます。内容を確認し、詳細→安全ではないページに移動→許可の順で承認してください。これはスプレッドシートとSearch Consoleを使うために必要です。', '', ''],
    ['STEP', '状態', 'やること', '操作'],
    ['1', sbmCheckMark_(sbmHasBlogInfo_()), 'ブログ名・ブログURL・Search Consoleプロパティを入力', 'メニュー：SIMS-Blog-Manager → セットアップ → STEP1 ブログ情報を入力'],
    ['2', sbmCheckMark_(sbmGetSetting_('GoogleCloudGuideOpened', 'NO') === 'YES'), 'Google CloudでSearch Console APIを有効化', 'メニュー：STEP2 Google Cloud API設定ガイド'],
    ['3', sbmCheckMark_(sbmGetSetting_('SearchConsoleStatus', '') === 'OK'), 'Search Console接続テストを実行', 'メニュー：STEP3 Search Console接続テスト'],
    ['4', sbmCheckMark_(sbmGetSetting_('SetupComplete', 'NO') === 'YES'), '初回データ取得・分析を実行', 'メニュー：STEP4 初回データ取得・分析'],
    ['', '', '', ''],
    ['認証メモ', '初回実行時にGoogleの認証画面が出たら、許可してからもう一度同じSTEPを実行してください。', '', ''],
    ['', '', '', ''],
    ['現在の設定', '', '', ''],
    ['ブログ名', sbmGetSetting_('BlogName', '未入力'), '', ''],
    ['ブログURL', sbmGetSetting_('BlogUrl', '未入力'), '', ''],
    ['Search Consoleプロパティ', sbmGetSetting_('SearchConsoleProperty', '未入力'), '', ''],
    ['接続状態', sbmGetSetting_('SearchConsoleStatus', '未確認'), '', ''],
    ['最終取得日', sbmGetSetting_('LastFetchDate', '未取得'), '', '']
  ];
  sh.getRange(1, 1, rows.length, 4).setValues(rows);
  sh.setFrozenRows(3);
  sh.setColumnWidths(1, 1, 90);
  sh.setColumnWidths(2, 1, 120);
  sh.setColumnWidths(3, 1, 420);
  sh.setColumnWidths(4, 1, 520);
  sbmStyleUserSheet_(sh, '#fbbc04');
}

function sbmEnsureTodaySheet_() {
  var sh = sbmGetOrCreateSheet_(SBM_SHEETS.TODAY);
  if (sh.getLastRow() < 1) {
    var headers = ['優先', 'Score', '時間', '記事タイトル', 'URL', 'メインクエリ', '重要クエリ5件', '本文補強クエリ10件', 'FAQ候補5件', '改善ブリーフ', '状態', '作成日'];
    sh.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
  sbmStyleDataSheet_(sh);
  sh.setTabColor('#4285f4');
}

function sbmEnsureLogViewSheet_() {
  var sh = sbmGetOrCreateSheet_(SBM_SHEETS.LOG_VIEW);
  sh.clear();
  var rows = [
    ['改善ログ', '完了した改善は Improvement_Log に保存されます。'],
    ['使い方', '「今日の改善」で対象行を選択し、メニューから「選択行を完了として記録」を実行します。'],
    ['補足', 'システムタブを表示すると詳細データを確認できます。']
  ];
  sh.getRange(1, 1, rows.length, 2).setValues(rows);
  sh.setColumnWidths(1, 1, 180);
  sh.setColumnWidths(2, 1, 720);
  sbmStyleUserSheet_(sh, '#795548');
}

function sbmEnsureEffectViewSheet_() {
  var sh = sbmGetOrCreateSheet_(SBM_SHEETS.EFFECT_VIEW);
  sh.clear();
  var rows = [
    ['効果測定', '改善から14日後・30日後のCTR・順位・クリック増減を確認します。'],
    ['更新方法', 'メニュー：SIMS-Blog-Manager → 改善 → 効果測定を更新'],
    ['注意', 'Search Consoleの反映には数日遅れがあります。']
  ];
  sh.getRange(1, 1, rows.length, 2).setValues(rows);
  sh.setColumnWidths(1, 1, 180);
  sh.setColumnWidths(2, 1, 720);
  sbmStyleUserSheet_(sh, '#a142f4');
}

function sbmApplyUx_() {
  SBM_USER_SHEETS.forEach(function(name) {
    var sh = sbmSs_().getSheetByName(name);
    if (sh) sh.showSheet();
  });
  SBM_SYSTEM_SHEETS.forEach(function(name) {
    var sh = sbmSs_().getSheetByName(name);
    if (sh) {
      sh.setTabColor('#9aa0a6');
      try { sh.hideSheet(); } catch (e) {}
    }
  });
}

function sbmSetupBlogInfo() {
  sbmEnsureBaseSheets_();
  var ui = SpreadsheetApp.getUi();

  var existingName = sbmTrim_(sbmGetSetting_('BlogName', ''));
  var existingUrl = sbmTrim_(sbmGetSetting_('BlogUrl', ''));
  var existingProperty = sbmTrim_(sbmGetSetting_('SearchConsoleProperty', ''));

  if (existingName && existingUrl && existingProperty) {
    var keep = ui.alert(
      'STEP1 ブログ情報は入力済みです',
      '現在の内容を使いますか？\n\nブログ名：' + existingName + '\nブログURL：' + existingUrl + '\nSearch Console：' + existingProperty + '\n\n「はい」＝この内容でSTEP1を完了します。\n「いいえ」＝入力し直します。',
      ui.ButtonSet.YES_NO_CANCEL
    );
    if (keep === ui.Button.YES) {
      sbmSetSetting_('SetupStep', '1', 'Blog info confirmed');
      sbmSafeLog_('SetupBlogInfo', 'Confirmed', existingName + ' / ' + existingUrl + ' / ' + existingProperty);
      sbmEnsureSetupSheet_();
      sbmRefreshHome();
      sbmOpenSetup();
      return sbmAlert_('STEP1完了', '登録済みのブログ情報を確認しました。\n\n次は、メニューから\n「STEP2 Google Cloud API設定ガイド」\nを開いてください。');
    }
    if (keep !== ui.Button.NO) return;
  }

  sbmAlert_(
    'STEP1 ブログ情報を入力します',
    'これから3つの入力画面が順番に表示されます。\n\n1. ブログ名\n2. ブログURL\n3. Search Consoleプロパティ\n\n初回認証が表示された場合は、許可後に同じSTEPをもう一度実行してください。'
  );

  var nameRes = ui.prompt('STEP1-1 ブログ名', 'ブログ名を入力してください。\n例：ガジェット探検記', ui.ButtonSet.OK_CANCEL);
  if (nameRes.getSelectedButton() !== ui.Button.OK) return;
  var blogName = sbmTrim_(nameRes.getResponseText());
  if (!blogName) return sbmAlert_('入力不足', 'ブログ名が入力されていません。');

  var urlRes = ui.prompt('STEP1-2 ブログURL', 'ブログURLを入力してください。\n例：https://example.com/', ui.ButtonSet.OK_CANCEL);
  if (urlRes.getSelectedButton() !== ui.Button.OK) return;
  var blogUrl = sbmNormalizeUrl_(urlRes.getResponseText());
  if (!blogUrl) return sbmAlert_('入力不足', 'ブログURLが入力されていません。');

  var propDefault = sbmGuessScProperty_(blogUrl);
  var propRes = ui.prompt('STEP1-3 Search Consoleプロパティ', 'Search Consoleプロパティを入力してください。\n\nドメインプロパティ例：sc-domain:example.com\nURLプレフィックス例：https://example.com/\n推奨候補：' + propDefault + '\n\n迷ったらSearch Consoleに表示されている表記をそのまま入力してください。', ui.ButtonSet.OK_CANCEL);
  if (propRes.getSelectedButton() !== ui.Button.OK) return;
  var property = sbmTrim_(propRes.getResponseText()) || propDefault;
  if (!property) return sbmAlert_('入力不足', 'Search Consoleプロパティが入力されていません。');

  sbmSetSetting_('BlogName', blogName, 'ブログ名');
  sbmSetSetting_('BlogUrl', blogUrl, 'ブログURL');
  sbmSetSetting_('SearchConsoleProperty', property, 'Search Console property');
  sbmSetSetting_('SetupStep', '1', 'Blog info entered');
  sbmSetSetting_('SearchConsoleStatus', '未確認', 'Connection must be tested again after property changes');
  sbmSafeLog_('SetupBlogInfo', 'Done', blogName + ' / ' + blogUrl + ' / ' + property);
  sbmEnsureSetupSheet_();
  sbmRefreshHome();
  sbmOpenSetup();
  sbmAlert_('STEP1完了', 'ブログ情報を保存しました。\n\n次は、メニューから\n「STEP2 Google Cloud API設定ガイド」\nを開いてください。');
}

function sbmOpenGoogleCloudGuide() {
  sbmEnsureBaseSheets_();
  if (!sbmHasBlogInfo_()) {
    sbmOpenSetup();
    return sbmAlert_('先にSTEP1が必要です', 'ブログ名・ブログURL・Search Consoleプロパティを先に入力してください。');
  }
  sbmSetSetting_('GoogleCloudGuideOpened', 'YES', 'Google Cloud API setup guide opened');
  sbmSetSetting_('SetupStep', '2', 'Google Cloud guide opened');
  sbmEnsureSetupSheet_();
  sbmRefreshHome();
  var html = HtmlService.createHtmlOutput(sbmGoogleCloudGuideHtml_()).setWidth(720).setHeight(560);
  SpreadsheetApp.getUi().showModalDialog(html, 'STEP2 Google Cloud API設定ガイド');
}

function sbmGoogleCloudGuideHtml_() {
  var scriptId = '';
  try { scriptId = ScriptApp.getScriptId(); } catch (e) { scriptId = ''; }
  var apiUrl = 'https://console.cloud.google.com/apis/library/searchconsole.googleapis.com';
  var scriptSettingsUrl = scriptId ? ('https://script.google.com/home/projects/' + scriptId + '/settings') : 'https://script.google.com/home';
  return '' +
    '<div style="font-family:Arial, sans-serif; line-height:1.7; padding:8px 14px;">' +
    '<h2>Search Console APIを有効化します</h2>' +
    '<p>この画面は外部サイトを開くための案内です。Google Cloudを開いた後、このスプレッドシートに戻ってください。</p>' +
    '<ol>' +
    '<li>下の「Google CloudでAPIを開く」をクリックします。</li>' +
    '<li>Apps Scriptに紐づくGoogle Cloudプロジェクトを選びます。</li>' +
    '<li><b>有効にする</b>を押します。</li>' +
    '<li>このスプレッドシートに戻り、メニューから <b>STEP3 Search Console接続テスト</b> を実行します。</li>' +
    '</ol>' +
    '<p><a href="' + apiUrl + '" target="_blank" style="display:inline-block;background:#1a73e8;color:#fff;padding:10px 16px;text-decoration:none;border-radius:6px;">Google CloudでAPIを開く</a></p>' +
    '<p style="font-size:12px;color:#555;">プロジェクトが分からない場合は、Apps Scriptのプロジェクト設定でGoogle Cloudプロジェクト番号を確認してください。</p>' +
    '<p><a href="' + scriptSettingsUrl + '" target="_blank">Apps Scriptのプロジェクト設定を開く</a></p>' +
    '<hr>' +
    '<p><b>重要：</b>この画面は自動で次へ進みません。API設定が終わったら、必ずスプレッドシートに戻ってSTEP3を実行してください。</p>' +
    '</div>';
}

function sbmTestSearchConsoleConnection() {
  sbmEnsureBaseSheets_();
  if (!sbmHasBlogInfo_()) {
    sbmOpenSetup();
    return sbmAlert_('接続テスト前に設定が必要です', 'STEP1でブログ情報を入力してください。');
  }
  var property = sbmGetSearchConsoleProperty_();
  var range = sbmSearchConsoleDateRange_();
  try {
    var data = sbmSearchConsoleApiRequest_(property, {
      startDate: range.startDate,
      endDate: range.endDate,
      dimensions: ['page'],
      rowLimit: 1
    });
    sbmSetSetting_('SearchConsoleStatus', 'OK', 'Last connection test status');
    sbmSetSetting_('LastSearchConsoleTestAt', sbmNowText_(), 'Last connection test at');
    sbmSetSetting_('SetupStep', '3', 'Search Console connection OK');
    sbmLog_('SearchConsoleConnectionTest', 'Done', property);
    sbmEnsureSetupSheet_();
    sbmRefreshHome();
    sbmOpenSetup();
    sbmAlert_('接続OK', 'Search Consoleに接続できました。\n\n次は、メニューから\n「STEP4 初回データ取得・分析」\nを実行してください。');
  } catch (e) {
    var guidance = sbmSearchConsoleErrorGuidance_(e);
    sbmSetSetting_('SearchConsoleStatus', 'Error', guidance.shortMessage);
    sbmLog_('SearchConsoleConnectionTest', 'Error', guidance.shortMessage + '\n' + guidance.detail);
    sbmErrorLog_('SearchConsoleConnectionTest', guidance.type, guidance.shortMessage, guidance.detail);
    sbmEnsureSetupSheet_();
    sbmRefreshHome();
    sbmOpenSetup();
    sbmAlert_('接続エラー', guidance.message);
  }
}

function sbmRunDailyUpdate() {
  sbmEnsureBaseSheets_();
  var guard = sbmCanFetchGsc_();
  if (!guard.ok) {
    sbmOpenSetup();
    return sbmAlert_('データ取得の前に設定が必要です', guard.message);
  }
  sbmFetchAndAnalyze_();
}

function sbmForceDailyUpdate() {
  sbmEnsureBaseSheets_();
  var guard = sbmCanFetchGsc_();
  if (!guard.ok) {
    sbmOpenSetup();
    return sbmAlert_('データ取得の前に設定が必要です', guard.message);
  }
  var ui = SpreadsheetApp.getUi();
  var res = ui.alert('強制再取得', '本日取得済みでもSearch Consoleデータを再取得します。よろしいですか？', ui.ButtonSet.YES_NO);
  if (res !== ui.Button.YES) return;
  sbmFetchAndAnalyze_();
}

function sbmMaybePromptDailyUpdate_() {
  var guard = sbmCanFetchGsc_();
  if (!guard.ok) return;
  var today = sbmDateText_(new Date());
  if (String(sbmGetSetting_('LastFetchDate', '')) === today) return;
  var ui = SpreadsheetApp.getUi();
  var res = ui.alert('本日のデータ取得', '本日はまだSearch Consoleデータを取得していません。\n今すぐ取得して今日の改善を更新しますか？', ui.ButtonSet.YES_NO);
  if (res === ui.Button.YES) sbmFetchAndAnalyze_();
}

function sbmCanFetchGsc_() {
  if (!sbmHasBlogInfo_()) return { ok: false, message: 'STEP1でブログ名・ブログURL・Search Consoleプロパティを入力してください。' };
  if (sbmGetSetting_('GoogleCloudGuideOpened', 'NO') !== 'YES') return { ok: false, message: 'STEP2でGoogle Cloud API設定ガイドを開き、Search Console APIを有効化してください。' };
  if (sbmGetSetting_('SearchConsoleStatus', '') !== 'OK') return { ok: false, message: 'STEP3でSearch Console接続テストを成功させてください。' };
  return { ok: true, message: '' };
}

function sbmFetchAndAnalyze_() {
  var property = sbmGetSearchConsoleProperty_();
  var range = sbmSearchConsoleDateRange_();
  try {
    sbmSs_().toast('Search Consoleデータを取得しています...', 'SIMS-Blog-Manager', 5);
    var data = sbmSearchConsoleApiRequest_(property, {
      startDate: range.startDate,
      endDate: range.endDate,
      dimensions: ['query', 'page'],
      rowLimit: Number(sbmGetSetting_('MaxQueryRows', SBM_DEFAULTS.MAX_QUERY_ROWS)) || SBM_DEFAULTS.MAX_QUERY_ROWS
    });
    var capturedAt = sbmNowText_();
    var rows = [];
    var apiRows = data.rows || [];
    for (var i = 0; i < apiRows.length; i++) {
      var r = apiRows[i];
      rows.push([capturedAt, range.startDate, range.endDate, r.keys[1] || '', r.keys[0] || '', r.clicks || 0, r.impressions || 0, r.ctr || 0, r.position || 0]);
    }
    sbmRewriteSheet_(SBM_SHEETS.QUERY_DATA, SBM_HEADERS.QUERY_DATA, rows);
    var analysis = sbmAnalyzeRows_(rows);
    sbmRewriteSheet_(SBM_SHEETS.ARTICLE_CARDS, SBM_HEADERS.ARTICLE_CARDS, analysis.cards);
    sbmRewriteSheet_(SBM_SHEETS.DIAGNOSIS, SBM_HEADERS.DIAGNOSIS, analysis.diagnosis);
    sbmBuildTodaySheet_(analysis.diagnosis);
    sbmSetSetting_('LastFetchDate', sbmDateText_(new Date()), 'Last successful GSC fetch date');
    sbmSetSetting_('SetupStep', '4', 'Initial fetch complete');
    sbmSetSetting_('SetupComplete', 'YES', 'Setup completed');
    sbmLog_('DailyUpdate', 'Done', rows.length + ' query-page rows');
    sbmEnsureSetupSheet_();
    sbmRefreshHome();
    sbmOpenToday();
    sbmAlert_('取得・分析完了', '取得件数: ' + rows.length + '件\n今日の改善を更新しました。');
  } catch (e) {
    var guidance = sbmSearchConsoleErrorGuidance_(e);
    sbmErrorLog_('DailyUpdate', guidance.type, guidance.shortMessage, guidance.detail);
    sbmLog_('DailyUpdate', 'Error', guidance.shortMessage);
    sbmAlert_('データ取得エラー', guidance.message);
  }
}

function sbmAnalyzeRows_(rows) {
  var byUrl = {};
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var url = String(row[3] || '');
    if (!url) continue;
    if (!byUrl[url]) byUrl[url] = [];
    byUrl[url].push({
      url: url,
      query: String(row[4] || ''),
      clicks: sbmNumber_(row[5]),
      impressions: sbmNumber_(row[6]),
      ctr: sbmNumber_(row[7]),
      position: sbmNumber_(row[8])
    });
  }
  var urls = Object.keys(byUrl);
  var articleSummaries = [];
  for (var u = 0; u < urls.length; u++) {
    var url = urls[u];
    var qs = byUrl[url];
    var clicks = 0, impressions = 0, weightedPos = 0;
    for (var q = 0; q < qs.length; q++) {
      clicks += qs[q].clicks;
      impressions += qs[q].impressions;
      weightedPos += qs[q].position * Math.max(qs[q].impressions, 1);
    }
    var ctr = impressions ? clicks / impressions : 0;
    var pos = impressions ? weightedPos / impressions : 99;
    articleSummaries.push({ url: url, queries: qs, clicks: clicks, impressions: impressions, ctr: ctr, position: pos });
  }
  articleSummaries.sort(function(a, b) { return b.impressions - a.impressions; });
  var ratio = Number(sbmGetSetting_('ManagedRatio', SBM_DEFAULTS.MANAGED_RATIO)) || SBM_DEFAULTS.MANAGED_RATIO;
  var managedCount = Math.max(1, Math.ceil(articleSummaries.length * ratio / 100));
  var cards = [];
  var diagnosisRows = [];
  for (var a = 0; a < articleSummaries.length; a++) {
    var art = articleSummaries[a];
    var managed = a < managedCount ? 'YES' : 'NO';
    var sortedQs = art.queries.slice().sort(function(x, y) { return sbmQueryScore_(y) - sbmQueryScore_(x); });
    var main = sortedQs[0] || { query: '', clicks: 0, impressions: 0, ctr: 0, position: 99 };
    var related = [];
    for (var k = 1; k < sortedQs.length && related.length < 20; k++) related.push(sortedQs[k].query);
    var diag = sbmDiagnoseArticle_(art, main, related, managed);
    var title = sbmTitleFromUrl_(art.url);
    cards.push([
      sbmArticleId_(art.url), art.url, title, main.query, art.clicks, art.impressions, art.ctr, art.position,
      managed, diag.status, diag.score, diag.action, diag.minutes, sbmLastImprovedAt_(art.url), sbmImprovementCount_(art.url), sbmNowText_()
    ]);
    diagnosisRows.push([
      sbmNowText_(), art.url, title, main.query, related.slice(0, 5).join('\n'), related.slice(5, 15).join('\n'), related.slice(15, 20).join('\n'),
      art.clicks, art.impressions, art.ctr, art.position, diag.code, diag.diagnosis, diag.action, diag.minutes, diag.impact, diag.score, diag.reason
    ]);
  }
  return { cards: cards, diagnosis: diagnosisRows };
}

function sbmDiagnoseArticle_(art, main, related, managed) {
  if (managed !== 'YES') {
    return { code: 'D00', status: '管理対象外', diagnosis: '現在の管理対象割合の範囲外です。', action: '対象外', minutes: 0, impact: '★☆☆☆☆', score: 0, reason: '管理対象割合を広げると対象になります。' };
  }
  var minImp = Number(sbmGetSetting_('MinImpressions', SBM_DEFAULTS.MIN_IMPRESSIONS)) || SBM_DEFAULTS.MIN_IMPRESSIONS;
  if (art.impressions < minImp) {
    return { code: 'D00', status: 'データ不足', diagnosis: '表示回数が少なく、改善効果を判断しにくい状態です。', action: '保留', minutes: 0, impact: '★☆☆☆☆', score: 0, reason: '最低表示回数に達していません。' };
  }
  if (sbmIsProtected_(art.url)) {
    return { code: 'D07', status: '効果測定中', diagnosis: '改善直後のため、再提案を停止しています。', action: '効果測定待ち', minutes: 0, impact: '★☆☆☆☆', score: 0, reason: '前回改善から保護期間内です。' };
  }
  var position = art.position || 99;
  var ctr = art.ctr || 0;
  var expectedCtr = sbmExpectedCtr_(position);
  var ctrGap = Math.max(0, expectedCtr - ctr);
  var action = '本文補強';
  var minutes = 40;
  var code = 'D02';
  var diagnosis = '順位改善余地があります。本文・見出し・検索意図の補強を優先してください。';
  if (position <= 5 && ctrGap > 0.02) {
    code = 'D01'; action = 'タイトル・ディスクリプション確認'; minutes = 10; diagnosis = '上位表示されていますがCTRに改善余地があります。クリック率に影響する要素を優先確認してください。';
  } else if (position <= 10 && ctrGap > 0.015) {
    code = 'D01'; action = 'タイトル・導入文確認'; minutes = 20; diagnosis = '1ページ目に表示されていますがCTRに改善余地があります。検索意図との一致度を確認してください。';
  } else if (position > 10 && position <= 20) {
    code = 'D02'; action = 'H2追加・本文補強'; minutes = 30; diagnosis = '2ページ目前後です。見出しや本文補強で1ページ目入りを狙えます。';
  } else if (related.length >= 15) {
    code = 'D03'; action = 'FAQ追加'; minutes = 15; diagnosis = '関連クエリが多いため、FAQや補足見出しで拾える検索意図があります。';
  } else if (position > 20 && position <= 40) {
    code = 'D04'; action = '本文補強'; minutes = 40; diagnosis = '順位が中位です。検索意図に合うセクション追加を検討してください。';
  } else if (position > 40) {
    code = 'D05'; action = '構成見直し'; minutes = 60; diagnosis = '順位が低いため、全面的な検索意図の見直しが必要な可能性があります。';
  }
  var score = sbmOpportunityScore_(art, ctrGap, minutes);
  var impact = sbmStars_(score);
  var reason = '表示回数 ' + art.impressions + '、平均順位 ' + position.toFixed(1) + '、CTR ' + (ctr * 100).toFixed(2) + '%。' + diagnosis;
  return { code: code, status: '改善候補', diagnosis: diagnosis, action: action, minutes: minutes, impact: impact, score: score, reason: reason };
}

function sbmOpportunityScore_(art, ctrGap, minutes) {
  var impScore = Math.min(40, Math.log(Math.max(art.impressions, 1)) / Math.log(10000) * 40);
  var pos = art.position || 99;
  var posScore = 0;
  if (pos <= 3) posScore = 12;
  else if (pos <= 10) posScore = 24;
  else if (pos <= 20) posScore = 30;
  else if (pos <= 40) posScore = 18;
  else posScore = 8;
  var ctrScore = Math.min(20, ctrGap * 500);
  var elapsedScore = 10;
  var value = impScore + posScore + ctrScore + elapsedScore;
  var timeCoef = 1;
  if (minutes <= 5) timeCoef = 0.8;
  else if (minutes <= 10) timeCoef = 1.0;
  else if (minutes <= 15) timeCoef = 1.1;
  else if (minutes <= 20) timeCoef = 1.2;
  else if (minutes <= 30) timeCoef = 1.4;
  else if (minutes <= 40) timeCoef = 1.6;
  else timeCoef = 2.0;
  return Math.max(0, Math.min(100, Math.round(value / timeCoef)));
}

function sbmBuildTodaySheet_(diagnosisRows) {
  var sh = sbmGetOrCreateSheet_(SBM_SHEETS.TODAY);
  sh.clear();
  var headers = ['優先', 'Score', '時間', '記事タイトル', 'URL', 'メインクエリ', '重要クエリ5件', '本文補強クエリ10件', 'FAQ候補5件', '改善ブリーフ', '状態', '作成日'];
  sh.getRange(1, 1, 1, headers.length).setValues([headers]);
  var items = [];
  for (var i = 0; i < diagnosisRows.length; i++) {
    var r = diagnosisRows[i];
    var score = sbmNumber_(r[16]);
    var minutes = sbmNumber_(r[14]);
    if (score <= 0 || minutes <= 0) continue;
    var brief = '診断: ' + r[12] + '\n推奨: ' + r[13] + '\n理由: ' + r[17] + '\n\nURLを開き、メインクエリと参考クエリを確認して改善してください。';
    items.push({
      score: score, minutes: minutes,
      row: [sbmStars_(score), score, minutes + '分', r[2], r[1], r[3], r[4], r[5], r[6], brief, '未着手', sbmNowText_()]
    });
  }
  items.sort(function(a, b) { return b.score - a.score; });
  var budget = Number(sbmGetSetting_('DailyBudgetMinutes', SBM_DEFAULTS.DAILY_BUDGET_MINUTES)) || SBM_DEFAULTS.DAILY_BUDGET_MINUTES;
  var max = Number(sbmGetSetting_('QueueMax', SBM_DEFAULTS.QUEUE_MAX)) || SBM_DEFAULTS.QUEUE_MAX;
  var selected = [];
  var total = 0;
  for (var j = 0; j < items.length && selected.length < max; j++) {
    if (total + items[j].minutes <= budget || selected.length === 0) {
      selected.push(items[j].row);
      total += items[j].minutes;
    }
  }
  if (selected.length) sh.getRange(2, 1, selected.length, headers.length).setValues(selected);
  sbmStyleDataSheet_(sh);
  sh.setColumnWidths(1, 1, 90);
  sh.setColumnWidths(2, 1, 70);
  sh.setColumnWidths(3, 1, 70);
  sh.setColumnWidths(4, 1, 260);
  sh.setColumnWidths(5, 1, 320);
  sh.setColumnWidths(6, 1, 180);
  sh.setColumnWidths(7, 3, 220);
  sh.setColumnWidths(10, 1, 460);
  sh.setColumnWidths(11, 1, 100);
  sh.getRange(2, 7, Math.max(1, sh.getLastRow() - 1), 4).setWrap(true);
}

function sbmCompleteSelectedImprovement() {
  var sh = sbmSs_().getActiveSheet();
  if (sh.getName() !== SBM_SHEETS.TODAY) {
    sbmOpenToday();
    return sbmAlert_('今日の改善を開いてください', '完了したい行を「今日の改善」シートで選択してから実行してください。');
  }
  var row = sh.getActiveCell().getRow();
  if (row <= 1) return sbmAlert_('行を選択してください', '完了したい改善タスクの行を選択してください。');
  var values = sh.getRange(row, 1, 1, 12).getValues()[0];
  var status = String(values[10] || '');
  if (status === '完了') return sbmAlert_('記録済み', 'この行はすでに完了になっています。');
  var ui = SpreadsheetApp.getUi();
  var minRes = ui.prompt('実際の作業時間', '実際にかかった時間を分で入力してください。\n空欄の場合は推定時間を使います。', ui.ButtonSet.OK_CANCEL);
  if (minRes.getSelectedButton() !== ui.Button.OK) return;
  var actualMinutes = sbmNumber_(minRes.getResponseText()) || sbmNumber_(String(values[2]).replace('分', ''));
  var memoRes = ui.prompt('改善メモ', '何を改善したか簡単に入力してください。\n例：タイトルを検索意図に合わせて修正', ui.ButtonSet.OK_CANCEL);
  if (memoRes.getSelectedButton() !== ui.Button.OK) return;
  var url = values[4];
  var before = sbmFindArticleCardByUrl_(url);
  var now = new Date();
  var d14 = new Date(now); d14.setDate(d14.getDate() + 14);
  var d30 = new Date(now); d30.setDate(d30.getDate() + 30);
  var logRow = [
    sbmNowText_(), url, values[3], values[5], values[9].split('\n')[1] || '改善', actualMinutes, memoRes.getResponseText(),
    before ? before.CTR : '', before ? before.Position : '', before ? before.Clicks : '', before ? before.Impressions : '',
    sbmDateText_(d14), sbmDateText_(d30)
  ];
  sbmAppendValues_(SBM_SHEETS.IMPROVEMENT_LOG, SBM_HEADERS.IMPROVEMENT_LOG, [logRow]);
  sh.getRange(row, 11).setValue('完了');
  sh.getRange(row, 1, 1, sh.getLastColumn()).setBackground('#d9ead3');
  sbmLog_('CompleteImprovement', 'Done', url);
  sbmAlert_('記録しました', '改善ログに記録しました。14日後・30日後に効果測定します。');
}

function sbmUpdateEffectiveness() {
  sbmEnsureBaseSheets_();
  var logs = sbmRowsAsObjects_(SBM_SHEETS.IMPROVEMENT_LOG);
  var cards = sbmRowsAsObjects_(SBM_SHEETS.ARTICLE_CARDS);
  var cardByUrl = {};
  cards.forEach(function(c) { cardByUrl[String(c.URL)] = c; });
  var rows = [];
  for (var i = 0; i < logs.length; i++) {
    var l = logs[i];
    var c = cardByUrl[String(l.URL)] || {};
    var beforeCtr = sbmNumber_(l.BeforeCTR);
    var currentCtr = sbmNumber_(c.CTR);
    var beforePos = sbmNumber_(l.BeforePosition);
    var currentPos = sbmNumber_(c.Position);
    var deltaClicks = sbmNumber_(c.Clicks) - sbmNumber_(l.BeforeClicks);
    var deltaImp = sbmNumber_(c.Impressions) - sbmNumber_(l.BeforeImpressions);
    var outcome = '測定待ち';
    if (c.URL) {
      if (currentPos > 0 && beforePos > 0 && currentPos < beforePos || currentCtr > beforeCtr) outcome = '○ 成功傾向';
      else outcome = '△ 横ばい';
    }
    rows.push([l.URL, l.Title, l.ImprovedAt, l.Action, beforeCtr, currentCtr, '', beforePos, currentPos, '', deltaClicks, deltaImp, outcome, '最新Article_Cardsと比較']);
  }
  sbmRewriteSheet_(SBM_SHEETS.EFFECTIVENESS, SBM_HEADERS.EFFECTIVENESS, rows);
  sbmRefreshHome();
  sbmOpenEffectView();
  sbmAlert_('効果測定を更新しました', 'Effectivenessシートを更新しました。');
}

function sbmRefreshHome() {
  sbmEnsureBaseSheetsNoRefresh_();
  var home = sbmGetOrCreateSheet_(SBM_SHEETS.HOME);
  home.clear();
  var stats = sbmHomeStats_();
  var rows = [
    ['SIMS-Blog-Manager', 'ブログ改善で迷わない。今日やることが30秒で決まる。'],
    ['バージョン', SBM_VERSION],
    ['最終更新', sbmNowText_()],
    ['', ''],
    ['現在の状態', stats.status],
    ['次にやること', stats.nextAction],
    ['', ''],
    ['今日のおすすめ改善', stats.topTask],
    ['推定時間', stats.topMinutes],
    ['改善候補数', stats.queueCount],
    ['本日の改善時間', sbmGetSetting_('DailyBudgetMinutes', SBM_DEFAULTS.DAILY_BUDGET_MINUTES) + '分'],
    ['管理対象割合', sbmGetSetting_('ManagedRatio', SBM_DEFAULTS.MANAGED_RATIO) + '%'],
    ['', ''],
    ['セットアップ状況', '状態'],
    ['STEP1 ブログ情報', sbmCheckMark_(sbmHasBlogInfo_())],
    ['STEP2 Google Cloud APIガイド', sbmCheckMark_(sbmGetSetting_('GoogleCloudGuideOpened', 'NO') === 'YES')],
    ['STEP3 Search Console接続', sbmCheckMark_(sbmGetSetting_('SearchConsoleStatus', '') === 'OK')],
    ['STEP4 初回データ取得', sbmCheckMark_(sbmGetSetting_('SetupComplete', 'NO') === 'YES')],
    ['', ''],
    ['登録ブログ名', sbmGetSetting_('BlogName', '未入力')],
    ['ブログURL', sbmGetSetting_('BlogUrl', '未入力')],
    ['Search Consoleプロパティ', sbmGetSetting_('SearchConsoleProperty', '未入力')],
    ['接続状態', sbmGetSetting_('SearchConsoleStatus', '未確認')],
    ['最終取得日', sbmGetSetting_('LastFetchDate', '未取得')],
    ['', ''],
    ['操作', 'メニュー「SIMS-Blog-Manager」からSTEPを順番に実行してください。']
  ];
  home.getRange(1, 1, rows.length, 2).setValues(rows);
  home.setFrozenRows(1);
  home.setColumnWidths(1, 1, 230);
  home.setColumnWidths(2, 1, 760);
  sbmStyleUserSheet_(home, '#0b8043');
  home.getRange('A5:B6').setBackground('#e6f4ea').setFontWeight('bold');
  home.getRange('A8:B12').setBackground('#e8f0fe');
  home.getRange('A14:B18').setBackground('#fff2cc');
}

function sbmEnsureBaseSheetsNoRefresh_() {
  Object.keys(SBM_HEADERS).forEach(function(key) {
    var sheetName = SBM_SHEETS[key] || key;
    var sheet = sbmGetOrCreateSheet_(sheetName);
    sbmEnsureHeaders_(sheet, SBM_HEADERS[key]);
  });
  sbmEnsureDefaultSettings_();
}

function sbmHomeStats_() {
  var setupComplete = sbmGetSetting_('SetupComplete', 'NO') === 'YES';
  var status = setupComplete ? '利用可能' : 'セットアップ未完了';
  var nextAction = 'STEP1 ブログ情報を入力してください。';
  if (sbmHasBlogInfo_() && sbmGetSetting_('GoogleCloudGuideOpened', 'NO') !== 'YES') nextAction = 'STEP2 Google Cloud API設定ガイドを開いてください。';
  else if (sbmGetSetting_('GoogleCloudGuideOpened', 'NO') === 'YES' && sbmGetSetting_('SearchConsoleStatus', '') !== 'OK') nextAction = 'STEP3 Search Console接続テストを実行してください。';
  else if (sbmGetSetting_('SearchConsoleStatus', '') === 'OK' && sbmGetSetting_('SetupComplete', 'NO') !== 'YES') nextAction = 'STEP4 初回データ取得・分析を実行してください。';
  else if (setupComplete) nextAction = '今日の改善を確認してください。';
  var qCount = Math.max(0, sbmCountRows_(SBM_SHEETS.TODAY));
  var topTask = '未作成';
  var topMinutes = '-';
  var sh = sbmSs_().getSheetByName(SBM_SHEETS.TODAY);
  if (sh && sh.getLastRow() >= 2) {
    var v = sh.getRange(2, 1, 1, 12).getValues()[0];
    topTask = v[3] + '：' + v[5] + ' / ' + (String(v[9]).split('\n')[1] || '改善');
    topMinutes = v[2];
  }
  return { status: status, nextAction: nextAction, queueCount: qCount, topTask: topTask, topMinutes: topMinutes };
}

function sbmOpenHome() { sbmOpenSheet_(SBM_SHEETS.HOME); }
function sbmOpenSetup() { sbmOpenSheet_(SBM_SHEETS.SETUP); }
function sbmOpenToday() { sbmOpenSheet_(SBM_SHEETS.TODAY); }
function sbmOpenLogView() { sbmOpenSheet_(SBM_SHEETS.LOG_VIEW); }
function sbmOpenEffectView() { sbmOpenSheet_(SBM_SHEETS.EFFECT_VIEW); }

function sbmShowSystemSheets() {
  SBM_SYSTEM_SHEETS.forEach(function(name) { var s = sbmSs_().getSheetByName(name); if (s) s.showSheet(); });
  sbmToast_('システムタブを表示しました。編集には注意してください。', 'SIMS-Blog-Manager', 5);
}
function sbmHideSystemSheets() {
  SBM_SYSTEM_SHEETS.forEach(function(name) { var s = sbmSs_().getSheetByName(name); if (s) { try { s.hideSheet(); } catch(e) {} } });
  sbmOpenHome();
  sbmToast_('システムタブを非表示にしました。', 'SIMS-Blog-Manager', 5);
}

function sbmSearchConsoleApiRequest_(property, body) {
  var endpoint = 'https://www.googleapis.com/webmasters/v3/sites/' + encodeURIComponent(property) + '/searchAnalytics/query';
  var response = UrlFetchApp.fetch(endpoint, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(body),
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() },
    muteHttpExceptions: true
  });
  var code = response.getResponseCode();
  var text = response.getContentText();
  if (code < 200 || code >= 300) throw new Error('HTTP ' + code + '\n' + text);
  return JSON.parse(text || '{}');
}

function sbmSearchConsoleErrorGuidance_(e) {
  var detail = String(e && e.message ? e.message : e);
  var lower = detail.toLowerCase();
  var type = 'UNKNOWN';
  var short = 'Search Console APIエラー';
  var message = 'Search Consoleに接続できませんでした。\n\n';
  if (lower.indexOf('insufficient authentication scopes') !== -1 || lower.indexOf('insufficient_scope') !== -1) {
    type = 'OAUTH_SCOPE';
    short = 'OAuthスコープ不足';
    message += '原因：Apps ScriptのOAuthスコープにSearch Consoleが含まれていません。\n\n対応：appsscript.jsonに webmasters.readonly があるか確認し、再承認してください。';
  } else if (lower.indexOf('accessnotconfigured') !== -1 || lower.indexOf('has not been used') !== -1 || lower.indexOf('disabled') !== -1 || lower.indexOf('service_disabled') !== -1) {
    type = 'API_DISABLED';
    short = 'Search Console API未有効';
    message += '原因：Google Cloud側でSearch Console APIが有効化されていません。\n\n対応：STEP2 Google Cloud API設定ガイドを開き、Search Console APIを有効化してください。';
  } else if (lower.indexOf('403') !== -1 || lower.indexOf('permission') !== -1 || lower.indexOf('forbidden') !== -1) {
    type = 'PERMISSION';
    short = 'Search Console権限不足またはプロパティ不一致';
    message += '原因：Search Consoleプロパティ表記が違うか、このGoogleアカウントに権限がありません。\n\n対応：Search Consoleに表示されているプロパティ表記をそのまま入力し、権限も確認してください。';
  } else if (lower.indexOf('404') !== -1 || lower.indexOf('not found') !== -1) {
    type = 'PROPERTY_NOT_FOUND';
    short = 'プロパティが見つかりません';
    message += '原因：Search Consoleプロパティの表記が違う可能性があります。\n\n例：sc-domain:example.com または https://example.com/';
  } else {
    message += '確認事項：\n・STEP2でSearch Console APIを有効化したか\n・Search Consoleプロパティ表記が正しいか\n・このGoogleアカウントに権限があるか';
  }
  message += '\n\n詳細：\n' + detail.substring(0, 1200);
  return { type: type, shortMessage: short, detail: detail, message: message };
}

function sbmSearchConsoleDateRange_() {
  var days = Number(sbmGetSetting_('SearchConsoleDays', SBM_DEFAULTS.SEARCH_CONSOLE_DAYS)) || SBM_DEFAULTS.SEARCH_CONSOLE_DAYS;
  var end = new Date();
  end.setDate(end.getDate() - SBM_DEFAULTS.SEARCH_CONSOLE_DELAY_DAYS);
  var start = new Date(end);
  start.setDate(start.getDate() - days + 1);
  return { startDate: sbmDateText_(start), endDate: sbmDateText_(end) };
}

function sbmGetSearchConsoleProperty_() { return sbmGetSetting_('SearchConsoleProperty', ''); }
function sbmHasBlogInfo_() { return !!(sbmGetSetting_('BlogName', '') && sbmGetSetting_('BlogUrl', '') && sbmGetSetting_('SearchConsoleProperty', '')); }

function sbmSs_() { return SpreadsheetApp.getActiveSpreadsheet(); }
function sbmUi_() { return SpreadsheetApp.getUi(); }
function sbmTz_() { return Session.getScriptTimeZone() || SBM_DEFAULTS.TIMEZONE; }
function sbmNowText_() { return Utilities.formatDate(new Date(), sbmTz_(), 'yyyy-MM-dd HH:mm:ss'); }
function sbmDateText_(date) { return Utilities.formatDate(date, sbmTz_(), 'yyyy-MM-dd'); }
function sbmTrim_(v) { return v === null || v === undefined ? '' : String(v).trim(); }
function sbmNumber_(v) { if (typeof v === 'number') return v; var n = Number(String(v || '').replace('%','').replace(/,/g,'').trim()); return isNaN(n) ? 0 : n; }
function sbmId_(prefix) { return prefix + '-' + Utilities.formatDate(new Date(), sbmTz_(), 'yyyyMMdd-HHmmss') + '-' + Math.floor(Math.random() * 10000); }
function sbmArticleId_(url) { return 'ART-' + Utilities.base64EncodeWebSafe(String(url)).substring(0, 16); }
function sbmNormalizeUrl_(url) { var u = sbmTrim_(url); if (!u) return ''; if (!/^https?:\/\//i.test(u)) u = 'https://' + u; return u; }
function sbmGuessScProperty_(url) { var m = String(url).match(/^https?:\/\/([^\/]+)/i); return m ? 'sc-domain:' + m[1].replace(/^www\./,'') : ''; }
function sbmTitleFromUrl_(url) { var path = String(url).replace(/^https?:\/\/[^\/]+/i,'').replace(/\/$/,''); return path ? path.substring(1) : url; }
function sbmCheckMark_(bool) { return bool ? '✅ 完了' : '□ 未完了'; }
function sbmStars_(score) { if (score >= 90) return '★★★★★'; if (score >= 75) return '★★★★☆'; if (score >= 60) return '★★★☆☆'; if (score >= 40) return '★★☆☆☆'; return '★☆☆☆☆'; }
function sbmExpectedCtr_(position) { if (position <= 1) return 0.28; if (position <= 3) return 0.16; if (position <= 5) return 0.10; if (position <= 10) return 0.05; if (position <= 20) return 0.025; return 0.01; }
function sbmQueryScore_(q) { return q.impressions * 0.7 + q.clicks * 12 + Math.max(0, 30 - q.position) * 4 + q.ctr * 100; }

function sbmGetOrCreateSheet_(name) { var ss = sbmSs_(); return ss.getSheetByName(name) || ss.insertSheet(name); }
function sbmOpenSheet_(name) { var sh = sbmGetOrCreateSheet_(name); sh.showSheet(); sbmSs_().setActiveSheet(sh); return sh; }
function sbmEnsureHeaders_(sheet, headers) { var lastCol = Math.max(sheet.getLastColumn(), 1); var current = sheet.getRange(1, 1, 1, lastCol).getValues()[0]; var has = false; for (var i = 0; i < current.length; i++) if (current[i]) has = true; if (!has) sheet.getRange(1, 1, 1, headers.length).setValues([headers]); sheet.setFrozenRows(1); sheet.getRange(1,1,1,Math.max(sheet.getLastColumn(),headers.length)).setFontWeight('bold').setBackground('#e8f0fe').setWrap(true); }
function sbmHeaderMap_(sheet) { var lastCol = Math.max(sheet.getLastColumn(), 1); var headers = sheet.getRange(1,1,1,lastCol).getValues()[0]; var map = {}; for (var i=0;i<headers.length;i++){ var h=sbmTrim_(headers[i]); if(h) map[h]=i+1; } return map; }
function sbmRowsAsObjects_(sheetName) { var sh = sbmSs_().getSheetByName(sheetName); if (!sh || sh.getLastRow()<2) return []; var values = sh.getDataRange().getValues(); var headers = values.shift(); var rows=[]; for (var i=0;i<values.length;i++){ var obj={_rowNumber:i+2}; for(var j=0;j<headers.length;j++) obj[String(headers[j])]=values[i][j]; rows.push(obj); } return rows; }
function sbmFindRowByValue_(sheetName, headerName, value) { var sh=sbmSs_().getSheetByName(sheetName); if(!sh||sh.getLastRow()<2)return null; var map=sbmHeaderMap_(sh); var col=map[headerName]; if(!col)return null; var values=sh.getRange(2,col,sh.getLastRow()-1,1).getValues(); for(var i=0;i<values.length;i++) if(String(values[i][0])===String(value)) return i+2; return null; }
function sbmSetObjectValues_(sheet,rowNumber,updates){ var map=sbmHeaderMap_(sheet); Object.keys(updates).forEach(function(k){ if(map[k]) sheet.getRange(rowNumber,map[k]).setValue(updates[k]); }); }
function sbmAppendObject_(sheetName, headers, obj) { var sh=sbmGetOrCreateSheet_(sheetName); sbmEnsureHeaders_(sh,headers); var map=sbmHeaderMap_(sh); var row=new Array(Math.max(sh.getLastColumn(),headers.length)); for(var i=0;i<row.length;i++)row[i]=''; headers.forEach(function(h){ if(map[h]) row[map[h]-1] = obj[h] !== undefined ? obj[h] : ''; }); sh.appendRow(row); }
function sbmAppendValues_(sheetName, headers, rows) { var sh=sbmGetOrCreateSheet_(sheetName); sbmEnsureHeaders_(sh, headers); if(rows.length) sh.getRange(sh.getLastRow()+1, 1, rows.length, headers.length).setValues(rows); sbmStyleDataSheet_(sh); }
function sbmRewriteSheet_(sheetName, headers, rows) { var sh=sbmGetOrCreateSheet_(sheetName); sh.clear(); sh.getRange(1,1,1,headers.length).setValues([headers]); if(rows && rows.length) sh.getRange(2,1,rows.length,headers.length).setValues(rows); sbmStyleDataSheet_(sh); }
function sbmGetSetting_(key, defaultValue) { var rows=sbmRowsAsObjects_(SBM_SHEETS.SETTINGS); for(var i=0;i<rows.length;i++) if(String(rows[i].Key)===String(key)) return rows[i].Value; return defaultValue; }
function sbmSetSetting_(key, value, description) { var sh=sbmGetOrCreateSheet_(SBM_SHEETS.SETTINGS); sbmEnsureHeaders_(sh,SBM_HEADERS.SETTINGS); var row=sbmFindRowByValue_(SBM_SHEETS.SETTINGS,'Key',key); if(row) sbmSetObjectValues_(sh,row,{Value:value,Description:description||'',UpdatedAt:sbmNowText_()}); else sbmAppendObject_(SBM_SHEETS.SETTINGS,SBM_HEADERS.SETTINGS,{Key:key,Value:value,Description:description||'',UpdatedAt:sbmNowText_()}); }
function sbmSetSettingIfEmpty_(key, value, description) { var existing = sbmGetSetting_(key, null); if (existing === null || existing === '') sbmSetSetting_(key, value, description); }
function sbmLog_(action, status, detail) { sbmSafeLog_(action, status, detail); }
function sbmSafeLog_(action, status, detail) {
  var user = '';
  try { user = Session.getEffectiveUser().getEmail() || ''; } catch (e1) { user = ''; }
  try {
    sbmAppendObject_(SBM_SHEETS.SYSTEM_LOG, SBM_HEADERS.SYSTEM_LOG, {CreatedAt:sbmNowText_(),Action:action,Status:status,Detail:detail||'',User:user});
  } catch (e2) {
    console.log('System log skipped: ' + e2);
  }
}
function sbmErrorLog_(action, type, message, detail) { sbmAppendObject_(SBM_SHEETS.ERROR_LOG, SBM_HEADERS.ERROR_LOG, {CreatedAt:sbmNowText_(),Action:action,ErrorType:type,Message:message,Detail:detail}); }
function sbmAlert_(title, message) { SpreadsheetApp.getUi().alert(title, message, SpreadsheetApp.getUi().ButtonSet.OK); }
function sbmToast_(message, title, seconds) { sbmSs_().toast(message, title || 'SIMS-Blog-Manager', seconds || 4); }
function sbmCountRows_(sheetName) { var sh=sbmSs_().getSheetByName(sheetName); return sh ? Math.max(0, sh.getLastRow()-1) : 0; }
function sbmLastImprovedAt_(url) { var logs=sbmRowsAsObjects_(SBM_SHEETS.IMPROVEMENT_LOG); var last=''; for(var i=0;i<logs.length;i++) if(String(logs[i].URL)===String(url)) last=logs[i].ImprovedAt; return last; }
function sbmImprovementCount_(url) { var logs=sbmRowsAsObjects_(SBM_SHEETS.IMPROVEMENT_LOG); var c=0; for(var i=0;i<logs.length;i++) if(String(logs[i].URL)===String(url)) c++; return c; }
function sbmIsProtected_(url) { var last=sbmLastImprovedAt_(url); if(!last) return false; var d=new Date(last); if(isNaN(d.getTime())) return false; var diff=(new Date().getTime()-d.getTime())/(1000*60*60*24); return diff < (Number(sbmGetSetting_('ProtectionDays', SBM_DEFAULTS.PROTECTION_DAYS)) || SBM_DEFAULTS.PROTECTION_DAYS); }
function sbmFindArticleCardByUrl_(url) { var rows=sbmRowsAsObjects_(SBM_SHEETS.ARTICLE_CARDS); for(var i=0;i<rows.length;i++) if(String(rows[i].URL)===String(url)) return rows[i]; return null; }
function sbmStyleDataSheet_(sheet) { var lastCol=Math.max(sheet.getLastColumn(),1); var lastRow=Math.max(sheet.getLastRow(),1); sheet.setFrozenRows(1); sheet.getRange(1,1,1,lastCol).setFontWeight('bold').setBackground('#e8f0fe').setWrap(true); sheet.getRange(1,1,lastRow,lastCol).setVerticalAlignment('top').setWrap(true).setBorder(true,true,true,true,true,true); try { sheet.autoResizeColumns(1, Math.min(lastCol, 12)); } catch(e){} }
function sbmStyleUserSheet_(sheet, color) { var lastCol=Math.max(sheet.getLastColumn(),2); var lastRow=Math.max(sheet.getLastRow(),1); sheet.getRange(1,1,1,lastCol).setFontWeight('bold').setFontSize(16).setBackground(color).setFontColor('#ffffff'); sheet.getRange(1,1,lastRow,lastCol).setWrap(true).setVerticalAlignment('top').setBorder(true,true,true,true,true,true); sheet.setTabColor(color); }
