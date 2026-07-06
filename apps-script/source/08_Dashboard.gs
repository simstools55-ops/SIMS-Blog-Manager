/** SIMS-Core Spreadsheet UX v2 - 08_Dashboard.gs */
function simsRefreshDashboard() {
  const home = simsGetOrCreateSheet_(SIMS_SHEETS.HOME);
  home.clear();

  const stats = simsDashboardStats_();
  const setupStatus = simsDashboardSetupStatus_();

  const rows = [
    ['SIMS-Core', 'SEO改善をClaudeへつなぐホーム画面'],
    ['更新日時', simsNowText_()],
    ['', ''],
    ['今日やること', stats.nextAction],
    ['', ''],
    ['かんたん手順', '操作'],
    ['1', '⚙ セットアップでブログURLとSearch Consoleを登録'],
    ['2', 'Search ConsoleからURLデータ・クエリデータを取得'],
    ['3', '📝 今日の改善でClaude改善指示書を作成'],
    ['4', 'RequestMarkdownをClaudeへ貼り付ける'],
    ['5', 'Claude結果をSIMSへ取り込む'],
    ['6', '📊 効果測定で改善結果を確認'],
    ['', ''],
    ['セットアップ状況', '状態'],
    ['ブログURL', setupStatus.blogUrl],
    ['Search Consoleプロパティ', setupStatus.property],
    ['Search Console接続', simsGetSetting_('SearchConsoleStatus', '未確認')],
    ['', ''],
    ['データ状況', '件数'],
    ['記事', stats.articles],
    ['クエリ', stats.queries],
    ['改善候補', stats.queue],
    ['Claude依頼', stats.requests],
    ['Claude結果', stats.results],
    ['改善履歴', stats.history],
    ['効果測定', stats.measurements],
    ['', ''],
    ['上級者向け', 'SIMS → 表示 → システムタブを表示 で内部データを確認できます']
  ];

  home.getRange(1, 1, rows.length, 2).setValues(rows);
  home.setFrozenRows(1);
  home.setColumnWidths(1, 1, 220);
  home.setColumnWidths(2, 1, 680);

  home.getRange('A1:B1').setFontWeight('bold').setFontSize(18).setBackground('#0b8043').setFontColor('#ffffff');
  home.getRange('A4:B4').setFontWeight('bold').setFontSize(14).setBackground('#e6f4ea');
  [6, 14, 19, 28].forEach(r => home.getRange(r, 1, 1, 2).setFontWeight('bold').setBackground('#e8f0fe'));
  home.getRange(1, 1, rows.length, 2).setWrap(true).setVerticalAlignment('top').setBorder(true, true, true, true, true, true);
  simsOpenSheet_(SIMS_SHEETS.HOME);
}

function simsDashboardSetupStatus_() {
  return {
    blogUrl: simsGetBlogProfile_('BlogUrl', '未登録'),
    property: simsGetBlogProfile_('SearchConsoleProperty', '未登録')
  };
}

function simsDashboardStats_() {
  const stats = {
    articles: simsCountRows_(SIMS_SHEETS.ARTICLES),
    queries: simsCountRows_(SIMS_SHEETS.QUERIES),
    queue: simsCountRows_(SIMS_SHEETS.QUEUE),
    requests: simsCountRows_(SIMS_SHEETS.REQUESTS),
    results: simsCountRows_(SIMS_SHEETS.RESULTS),
    history: simsCountRows_(SIMS_SHEETS.HISTORY),
    measurements: simsCountRows_(SIMS_SHEETS.MEASUREMENTS)
  };
  let nextAction = '⚙ セットアップでブログURLとSearch Consoleプロパティを登録してください。';
  if (simsGetBlogProfile_('BlogUrl', '') && simsGetBlogProfile_('SearchConsoleProperty', '') && stats.queries === 0) {
    nextAction = 'Search Consoleのクエリデータを取得してください。';
  } else if (stats.queries > 0 && stats.requests === 0) {
    nextAction = '📝 今日の改善からClaude改善指示書を作成してください。';
  } else if (stats.requests > 0 && stats.results === 0) {
    nextAction = 'RequestMarkdownをClaudeへ貼り付け、改善結果をSIMSへ取り込んでください。';
  } else if (stats.results > 0 && stats.history === 0) {
    nextAction = 'Claude改善結果を改善履歴へ記録してください。';
  } else if (stats.history > 0 && stats.measurements === 0) {
    nextAction = '一定期間後に📊 効果測定を作成してください。';
  } else if (stats.measurements > 0) {
    nextAction = '効果測定を確認し、次の改善対象を選んでください。';
  }
  stats.nextAction = nextAction;
  return stats;
}

function simsCountRows_(sheetName) {
  const sheet = simsSs_().getSheetByName(sheetName);
  return sheet ? Math.max(0, sheet.getLastRow() - 1) : 0;
}
