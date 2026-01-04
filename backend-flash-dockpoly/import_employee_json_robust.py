#!/usr/bin/env python3
"""Robust import tool - Import employee data from JSON file with type checking"""

import sys
import os
import json
import re
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.core.database import SessionLocal
from app.models.employee2 import Employee2
from sqlalchemy import text

def safe_str(value):
    """Convert value to string safely"""
    if value is None:
        return ''
    if isinstance(value, (list, tuple)):
        return str(value[0]) if value and len(value) > 0 else ''
    return str(value).strip()


def safe_list(value, *, max_len: int) -> list[str]:
    if value is None:
        return []
    if isinstance(value, list):
        out: list[str] = []
        for x in value[:max_len]:
            s = safe_str(x)
            out.append(s)
        return out
    s = safe_str(value)
    return [s] if s else []


def safe_nested(value, *keys: str) -> str:
    cur = value
    for k in keys:
        if not isinstance(cur, dict):
            return ""
        cur = cur.get(k)
    return safe_str(cur)


def clean_salary(s: str) -> str:
    if not s:
        return ""
    s = safe_str(s)
    s = re.sub(r"[,\s]", "", s)
    if s in ("-", ""):
        return ""
    return s


def is_numeric_serial(v: str) -> bool:
    s = safe_str(v)
    return bool(s) and s.isdigit()

def import_employee_json_robust():
    """Import employee data from JSON file with robust type handling"""
    try:
        # Read the JSON file
        json_file_path = "C:\\Users\\ahmed\\Desktop\\backend clone\\Active Employee Data - Sheet1.json"
        
        with open(json_file_path, 'r', encoding='utf-8') as f:
            employee_data = json.load(f)
        
        print(f"📂 Loaded {len(employee_data)} employee records from JSON")
        
        imported_count = 0
        updated_count = 0
        skipped_count = 0

        db = SessionLocal()
        try:
            max_id = int(db.execute(text("SELECT COALESCE(MAX(id), 0) FROM employees2")).scalar() or 0)
            next_id = max_id + 1

            existing_rows = db.query(Employee2.id, Employee2.fss_no, Employee2.cnic, Employee2.serial_no).all()
            by_fss: dict[str, int] = {}
            by_cnic: dict[str, int] = {}
            by_serial: dict[str, int] = {}
            for _id, _fss, _cnic, _serial in existing_rows:
                if _fss:
                    by_fss[str(_fss).strip()] = int(_id)
                if _cnic:
                    by_cnic[str(_cnic).strip()] = int(_id)
                if _serial:
                    by_serial[str(_serial).strip()] = int(_id)

            def _get_existing(serial_no: str, fss_no: str, cnic: str):
                if fss_no and fss_no in by_fss:
                    return db.get(Employee2, by_fss[fss_no])
                if cnic and cnic in by_cnic:
                    return db.get(Employee2, by_cnic[cnic])
                if serial_no and serial_no in by_serial:
                    return db.get(Employee2, by_serial[serial_no])
                return None

            batch_size = 250
            pending = 0

            current_category = ""
            for employee in employee_data:
                serial_no = safe_str(employee.get('#', ''))
                name = safe_str(employee.get('Name', ''))

                # Category/header rows: # contains a label (e.g., "Office Staff") and Name is empty.
                if serial_no and not is_numeric_serial(serial_no) and not name:
                    current_category = serial_no
                    continue

                if not name:
                    skipped_count += 1
                    continue

                try:
                    fss_no = safe_str(employee.get('FSS #', ''))
                    father_name = safe_str(employee.get("Father's Name", ''))
                    salary = clean_salary(employee.get('Salary', ''))

                    rank_list = safe_list(employee.get('Rank'), max_len=3)
                    status_list = safe_list(employee.get('Status'), max_len=2)
                    unit_list = safe_list(employee.get('Unit'), max_len=2)

                    blood_group = safe_str(employee.get('Blood Gp', ''))
                    cnic = safe_str(employee.get('CNIC #', ''))
                    dob = safe_str(employee.get('DOB', ''))
                    cnic_expiry = safe_str(employee.get('CNIC Expr', ''))
                    documents_held = safe_str(employee.get('Documents held', ''))
                    documents_handed_over_to = safe_nested(employee.get('Documents Reciving  '), 'Handed Over To')
                    photo_on_doc = safe_str(employee.get('Photo on Docu', ''))
                    eobi_no = safe_str(employee.get('EOBI #', ''))
                    insurance = safe_str(employee.get('Insurance', ''))
                    social_security = safe_str(employee.get('Social Security', ''))
                    mobile_no = safe_str(employee.get('Mob #', ''))
                    home_contact = safe_str(employee.get('Home Contact Number', ''))
                    verified_by_sho = safe_str(employee.get('Verified by SHO', ''))
                    verified_by_khidmat_markaz = safe_str(employee.get('Verified by Khidmat Markaz', ''))
                    domicile = safe_str(employee.get('Domicile', ''))
                    verified_by_ssp = safe_str(employee.get('Verified by SSP', ''))
                    enrolled = safe_str(employee.get('Enrolled', ''))
                    re_enrolled = safe_str(employee.get('Re Enrolled', ''))
                    village = safe_str(employee.get('Village', ''))
                    post_office = safe_str(employee.get('Post Office', ''))
                    thana = safe_str(employee.get('Thana', ''))
                    tehsil = safe_str(employee.get('Tehsil', ''))
                    district = safe_str(employee.get('District', ''))
                    duty_location = safe_str(employee.get('Duty Location', ''))
                    police_trg_ltr_date = safe_str(employee.get('Police Trg Ltr & Date', ''))
                    vaccination_cert = safe_str(employee.get('Vacanation Cert', ''))
                    vol_no = safe_str(employee.get('Vol #', ''))
                    payments = safe_str(employee.get("Payment's", ''))

                    fss_no = fss_no.strip()
                    cnic = cnic.strip()
                    serial_no = serial_no.strip()

                    existing = _get_existing(serial_no, fss_no, cnic)

                    if existing is None:
                        row = Employee2(id=next_id)
                        next_id += 1
                        imported_count += 1
                        db.add(row)
                        if fss_no:
                            by_fss[fss_no] = int(row.id)
                        if cnic:
                            by_cnic[cnic] = int(row.id)
                        if serial_no:
                            by_serial[serial_no] = int(row.id)
                    else:
                        row = existing
                        updated_count += 1

                    row.serial_no = serial_no or row.serial_no
                    row.fss_no = fss_no or row.fss_no
                    row.rank = rank_list[0] if len(rank_list) > 0 else row.rank
                    row.service_rank = rank_list[1] if len(rank_list) > 1 else row.service_rank
                    row.rank2 = rank_list[2] if len(rank_list) > 2 else row.rank2
                    row.name = name
                    row.father_name = father_name or row.father_name
                    row.salary = salary or row.salary
                    row.status = status_list[0] if len(status_list) > 0 else row.status
                    row.status2 = status_list[1] if len(status_list) > 1 else row.status2
                    row.unit = unit_list[0] if len(unit_list) > 0 else row.unit
                    row.unit2 = unit_list[1] if len(unit_list) > 1 else row.unit2
                    row.blood_group = blood_group or row.blood_group
                    row.cnic = cnic or row.cnic
                    row.dob = dob or row.dob
                    row.cnic_expiry = cnic_expiry or row.cnic_expiry
                    row.documents_held = documents_held or row.documents_held
                    row.documents_handed_over_to = documents_handed_over_to or row.documents_handed_over_to
                    row.photo_on_doc = photo_on_doc or row.photo_on_doc
                    row.eobi_no = eobi_no or row.eobi_no
                    row.insurance = insurance or row.insurance
                    row.social_security = social_security or row.social_security
                    row.mobile_no = mobile_no or row.mobile_no
                    row.home_contact = home_contact or row.home_contact
                    row.verified_by_sho = verified_by_sho or row.verified_by_sho
                    row.verified_by_khidmat_markaz = verified_by_khidmat_markaz or row.verified_by_khidmat_markaz
                    row.domicile = domicile or row.domicile
                    row.verified_by_ssp = verified_by_ssp or row.verified_by_ssp
                    row.enrolled = enrolled or row.enrolled
                    row.re_enrolled = re_enrolled or row.re_enrolled
                    row.village = village or row.village
                    row.post_office = post_office or row.post_office
                    row.thana = thana or row.thana
                    row.tehsil = tehsil or row.tehsil
                    row.district = district or row.district
                    row.duty_location = duty_location or row.duty_location
                    row.police_trg_ltr_date = police_trg_ltr_date or row.police_trg_ltr_date
                    row.vaccination_cert = vaccination_cert or row.vaccination_cert
                    row.vol_no = vol_no or row.vol_no
                    row.payments = payments or row.payments

                    if current_category:
                        row.category = current_category

                    if imported_count and imported_count <= 10 and existing is None:
                        print(f"  ✅ Imported: {name} (ID: {row.id})")

                    pending += 1
                    if pending >= batch_size:
                        db.flush()
                        db.commit()
                        pending = 0

                except Exception as e:
                    print(f"  ❌ Error importing {name}: {e}")
                    skipped_count += 1
                    continue

            if pending:
                db.flush()
                db.commit()

            total_count = int(db.execute(text("SELECT COUNT(*) FROM employees2")).scalar() or 0)
            
            print(f"\n🎉 IMPORT COMPLETE:")
            print(f"  Total records in JSON: {len(employee_data)}")
            print(f"  Successfully imported: {imported_count}")
            print(f"  Updated existing: {updated_count}")
            print(f"  Skipped/Errors: {skipped_count}")
            print(f"  Total employees in database: {total_count}")
            print(f"  ✅ Employee data imported to employees2 table")
            
            # Show some sample data
            recent_employees = db.execute(text("SELECT id, name, father_name, salary FROM employees2 ORDER BY id DESC LIMIT 5")).fetchall()
            
            print(f"\n📋 Recent imports:")
            for emp_id, name, father_name, salary in recent_employees:
                print(f"  ID {emp_id}: {name} - Father: {father_name} - Salary: {salary}")
            
        finally:
            db.close()

        return True
            
    except FileNotFoundError:
        print(f"❌ File not found: {json_file_path}")
        return False
    except json.JSONDecodeError as e:
        print(f"❌ JSON parsing error: {e}")
        return False
    except Exception as e:
        print(f"❌ Import error: {e}")
        return False

if __name__ == "__main__":
    import_employee_json_robust()
