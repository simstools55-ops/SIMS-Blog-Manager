/**
 * SIMS-Core Production Baseline v1.1
 * 00_Config.gs
 *
 * Spreadsheet UX v2:
 * - 利用者が見るタブは日本語・少数に整理
 * - システムタブは英語名のまま維持し、原則非表示
 */
const SIMS_CORE_VERSION = '1.1.0-spreadsheet-ux-v2';

const SIMS_SHEETS = Object.freeze({
  HOME: '🏠 ホーム',
  SETUP: '⚙ セットアップ',
  TODAY: '📝 今日の改善',
  MEASUREMENT_VIEW: '📊 効果測定',
  HISTORY_VIEW: '📚 改善履歴',

  SETTINGS: 'Settings',
  BLOG_PROFILE: 'Blog_Profile',
  SYSTEM_LOG: 'System_Log',
  SEARCH_CONSOLE_URLS: 'SearchConsole_URLs',
  SEARCH_CONSOLE_QUERIES: 'SearchConsole_Queries',
  ARTICLES: 'Articles',
  QUERIES: 'Queries',
  QUEUE: 'Improvement_Queue',
  REQUESTS: 'AI_Exchange_Requests',
  RESULTS: 'AI_Exchange_Results',
  HISTORY: 'Improvement_History',
  MEASUREMENTS: 'Measurements',
  KNOWLEDGE: 'Knowledge'
});

const SIMS_USER_SHEETS = [
  '🏠 ホーム',
  '⚙ セットアップ',
  '📝 今日の改善',
  '📊 効果測定',
  '📚 改善履歴'
];

const SIMS_SYSTEM_SHEETS = [
  'Settings',
  'Blog_Profile',
  'System_Log',
  'SearchConsole_URLs',
  'SearchConsole_Queries',
  'Articles',
  'Queries',
  'Improvement_Queue',
  'AI_Exchange_Requests',
  'AI_Exchange_Results',
  'Improvement_History',
  'Measurements',
  'Knowledge'
];

const SIMS_SHEET_COLORS = Object.freeze({
  USER: '#34a853',
  SETUP: '#fbbc04',
  WORKFLOW: '#4285f4',
  MEASUREMENT: '#a142f4',
  HISTORY: '#795548',
  SYSTEM: '#9aa0a6'
});

const SIMS_STATUS = Object.freeze({
  NEW: 'New',
  READY_FOR_CLAUDE: 'Ready for Claude',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  WAITING_MEASUREMENT: 'Waiting for Measurement',
  MEASURED: 'Measured',
  VERIFIED: 'Verified',
  ERROR: 'Error'
});

const SIMS_DEFAULTS = Object.freeze({
  SEARCH_CONSOLE_DAYS: 28,
  SEARCH_CONSOLE_DELAY_DAYS: 3,
  MAX_QUERY_ROWS: 1000,
  MAX_REQUEST_QUERIES: 20,
  MAX_SUB_QUERIES: 8,
  MEASUREMENT_DAYS_AFTER: 14,
  TIMEZONE: 'Asia/Tokyo'
});

const SIMS_HEADERS = Object.freeze({
  SETTINGS: ['Key', 'Value', 'Description', 'UpdatedAt'],
  BLOG_PROFILE: ['Key', 'Value', 'Description', 'UpdatedAt'],
  SYSTEM_LOG: ['CreatedAt', 'Action', 'Status', 'Detail', 'User'],
  SEARCH_CONSOLE_URLS: ['StartDate', 'EndDate', 'URL', 'Clicks', 'Impressions', 'CTR', 'Position', 'CapturedAt'],
  SEARCH_CONSOLE_QUERIES: ['StartDate', 'EndDate', 'Query', 'URL', 'Clicks', 'Impressions', 'CTR', 'Position', 'CapturedAt'],
  ARTICLES: ['ArticleId', 'URL', 'CurrentH1', 'CurrentTitle', 'CurrentDescription', 'Slug', 'Category', 'Tags', 'WordCount', 'Status', 'LastUpdated'],
  QUERIES: ['QueryId', 'ArticleId', 'URL', 'Query', 'Clicks', 'Impressions', 'CTR', 'Position', 'Device', 'Country', 'DateRange', 'CapturedAt'],
  QUEUE: ['QueueId', 'ArticleId', 'URL', 'MainQuery', 'SubQueries', 'Priority', 'Reason', 'Status', 'RequestId', 'CreatedAt', 'UpdatedAt'],
  REQUESTS: ['RequestId', 'QueueId', 'ArticleId', 'URL', 'MainQuery', 'SubQueries', 'TopQueries', 'RequestMarkdown', 'Status', 'CreatedAt', 'UserNote'],
  RESULTS: ['ResultId', 'RequestId', 'ArticleId', 'URL', 'MainQuery', 'ResultMarkdown', 'ImprovedH1', 'ImprovedTitle', 'ImprovedDescription', 'SmartphoneDescription', 'Summary', 'SEOScore', 'QualityScore', 'Status', 'ImportedAt'],
  HISTORY: ['HistoryId', 'ArticleId', 'URL', 'RequestId', 'ResultId', 'MainQuery', 'Summary', 'ImprovedH1', 'ImprovedTitle', 'ImprovedDescription', 'SEOScore', 'QualityScore', 'BeforeClicks', 'BeforeImpressions', 'BeforeCTR', 'BeforePosition', 'CompletedAt', 'MeasurementDueDate', 'MeasurementStatus'],
  MEASUREMENTS: ['MeasurementId', 'HistoryId', 'ArticleId', 'URL', 'MainQuery', 'BeforeClicks', 'AfterClicks', 'DeltaClicks', 'BeforeImpressions', 'AfterImpressions', 'DeltaImpressions', 'BeforeCTR', 'AfterCTR', 'DeltaCTR', 'BeforePosition', 'AfterPosition', 'DeltaPosition', 'Outcome', 'Summary', 'MeasuredAt'],
  KNOWLEDGE: ['KnowledgeId', 'Type', 'Title', 'Content', 'Source', 'UpdatedAt']
});
