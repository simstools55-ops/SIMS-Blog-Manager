from pathlib import Path

CODE = Path('apps-script/Code.gs').read_text(encoding='utf-8')
DIST = Path('distribution/Code.gs').read_text(encoding='utf-8')


def test_distribution_matches_source():
    assert CODE == DIST


def test_article_list_completeness_repairs_visible_h1_and_title():
    assert "function sbmEnsureArticleListDisplayCompleteness_(maxFetch, maxSeconds)" in CODE
    assert "hm['H1タイトル']" in CODE
    assert "hm['記事タイトル']" in CODE
    assert "best=pathTitle||'タイトル取得待ち'" in CODE
    assert "sbmEnsureArticleListDisplayCompleteness_(30,60)" in CODE
    assert "sbmEnsureArticleListDisplayCompleteness_(20,40)" in CODE


def test_query_placeholders_are_filtered_from_external_contracts():
    assert "const SBM_QUERY_NO_DATA_LABEL = '検索実績なし'" in CODE
    assert "const SBM_QUERY_PENDING_LABEL = '取得待ち'" in CODE
    assert "function sbmRealMainQuery_" in CODE
    assert "main_query:sbmRealMainQuery_(article['メインクエリ'])" in CODE


def test_doctor_worklist_is_retired_from_user_menu():
    menu = CODE[CODE.index("ui.createMenu('SIMS Doctor')"):CODE.index("// 配布版では開発者用メニューを生成しません。")]
    assert 'Doctor対応一覧' not in menu
    assert 'Doctor診断状況' not in menu
    assert "sbmRetireDoctorWorklistSheets_" in CODE


def test_improvement_history_and_effect_share_route_field():
    assert "'改善経路'" in CODE[CODE.index('const SBM_HISTORY_HEADERS_V2'):CODE.index('const SBM_EFFECT_HEADERS_V2')]
    effect = CODE[CODE.index('const SBM_EFFECT_HEADERS_V2'):CODE.index('function sbmApplyProductVisibleTabs_')]
    assert "'改善経路'" in effect
    assert "['改善経路','改善方法']" in CODE
    assert "improvement_method:'Doctor→Writer'" in CODE


def test_doctor_writer_does_not_change_article_rank_and_uses_treatment_work_state():
    save = CODE[CODE.index('function sbmDoctorSaveGeneratedWriterRequest_'):CODE.index('function sbmDoctorRegisterResultAndBuildNext')]
    assert "'🛠️ 処置中'" in save
    assert '記事ランク' not in save
    assert "'👀 モニター中'" in CODE
    assert "'✔️ 完了'" in CODE
