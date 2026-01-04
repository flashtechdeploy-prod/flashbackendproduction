"""Employees Inactive API routes."""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.employee_inactive import EmployeeInactive
from app.api.dependencies import require_permission

router = APIRouter(dependencies=[Depends(require_permission("employees:view"))])

class EmployeeInactiveResponse(BaseModel):
    id: int
    fss_no: Optional[str] = None
    serial_no: Optional[str] = None
    name: str
    father_name: Optional[str] = None
    status: Optional[str] = None
    cnic: Optional[str] = None
    eobi_no: Optional[str] = None
    mobile_no: Optional[str] = None
    district: Optional[str] = None
    doe: Optional[str] = None
    dod: Optional[str] = None
    cause_of_discharge: Optional[str] = None
    police_verification: Optional[str] = None
    notice_fine: Optional[str] = None
    uniform_fine: Optional[str] = None
    police_trg: Optional[str] = None
    clo_fine: Optional[str] = None
    vol_no: Optional[str] = None
    category: Optional[str] = None
    designation: Optional[str] = None
    allocation_status: Optional[str] = None
    created_at: Optional[str] = None

    class Config:
        from_attributes = True

class EmployeeInactiveList(BaseModel):
    employees: List[EmployeeInactiveResponse]
    total: int

@router.get("/", response_model=EmployeeInactiveList)
async def list_inactive_employees(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Get list of inactive employees."""
    query = db.query(EmployeeInactive)
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (EmployeeInactive.name.ilike(search_term))
            | (EmployeeInactive.fss_no.ilike(search_term))
            | (EmployeeInactive.cnic.ilike(search_term))
            | (EmployeeInactive.mobile_no.ilike(search_term))
            | (EmployeeInactive.serial_no.ilike(search_term))
        )
    
    total = query.order_by(None).count()
    employees = query.offset(skip).limit(limit).all()
    
    return EmployeeInactiveList(employees=employees, total=total)

@router.get("/{employee_id}", response_model=EmployeeInactiveResponse)
async def get_inactive_employee(employee_id: int, db: Session = Depends(get_db)):
    """Get a specific inactive employee by ID."""
    employee = db.query(EmployeeInactive).filter(EmployeeInactive.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee

@router.post("/{employee_id}/activate")
async def activate_employee(employee_id: int, db: Session = Depends(get_db)):
    """Activate an inactive employee by moving them back to employees2."""
    inactive_emp = db.query(EmployeeInactive).filter(EmployeeInactive.id == employee_id).first()
    if not inactive_emp:
        raise HTTPException(status_code=404, detail="Inactive employee not found")
    
    # Import here to avoid circular imports
    from app.models.employee2 import Employee2
    
    # Check if already exists in active table
    existing = db.query(Employee2).filter(
        (Employee2.fss_no == inactive_emp.fss_no) | (Employee2.cnic == inactive_emp.cnic)
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Employee already exists in active records")
    
    # Create active employee record
    active_data = {
        "fss_no": inactive_emp.fss_no,
        "serial_no": inactive_emp.serial_no,
        "name": inactive_emp.name,
        "father_name": inactive_emp.father_name,
        "status": inactive_emp.status,
        "cnic": inactive_emp.cnic,
        "eobi_no": inactive_emp.eobi_no,
        "mobile_no": inactive_emp.mobile_no,
        "domicile": inactive_emp.district,
        "category": "Employee",
        "designation": "Employee",
        "allocation_status": "Active",
        "salary": "0",
        "unit": "General",
        "blood_group": "Unknown",
        "documents_held": "Standard",
        "insurance": "No",
        "social_security": "No",
    }
    
    active_emp = Employee2(**active_data)
    db.add(active_emp)
    
    # Delete from inactive table
    db.delete(inactive_emp)
    db.commit()
    
    return {"message": "Employee activated successfully"}
