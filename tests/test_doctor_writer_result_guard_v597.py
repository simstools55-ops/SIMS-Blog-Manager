from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
CODE=(ROOT/'apps-script/Code.gs').read_text(encoding='utf-8')
def test_doctor_json_guard():
    assert "format.indexOf('SIMS_DOCTOR_')===0" in CODE
    assert 'これはDoctorの診断JSONです' in CODE
def test_menu_is_explicit():
    assert 'Writer処置結果をSBMへ返す' in CODE
    assert "ui.createMenu('結果登録')" not in CODE
