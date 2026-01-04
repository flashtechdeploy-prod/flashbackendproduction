# Flash ERP
**Version**: 1.0.0

## POST `/api/auth/register`
**Summary**: Register

Register a new user.

### Request Body
**Content-Type**: `application/json`
**Schema**: [UserCreate](#usercreate)


### Responses
- **201**: Successful Response
- **422**: Validation Error

---

## POST `/api/auth/login`
**Summary**: Login

Login and get access token.

### Request Body
**Content-Type**: `application/x-www-form-urlencoded`
**Schema**: [Body_login_api_auth_login_post](#body_login_api_auth_login_post)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/auth/me`
**Summary**: Get Current User Info

Get current user information.

### Responses
- **200**: Successful Response

---

## GET `/api/auth/me/permissions`
**Summary**: Get My Permissions

### Responses
- **200**: Successful Response

---

## GET `/api/auth/me/roles`
**Summary**: Get My Roles

### Responses
- **200**: Successful Response

---

## GET `/api/admin/permissions`
**Summary**: List Permissions

### Responses
- **200**: Successful Response

---

## POST `/api/admin/permissions`
**Summary**: Create Permission

### Request Body
**Content-Type**: `application/json`
**Schema**: [PermissionCreate](#permissioncreate)


### Responses
- **201**: Successful Response
- **422**: Validation Error

---

## GET `/api/admin/roles`
**Summary**: List Roles

### Responses
- **200**: Successful Response

---

## POST `/api/admin/roles`
**Summary**: Create Role

### Request Body
**Content-Type**: `application/json`
**Schema**: [RoleCreate](#rolecreate)


### Responses
- **201**: Successful Response
- **422**: Validation Error

---

## PUT `/api/admin/roles/{role_id}`
**Summary**: Update Role

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| role_id | path | Yes | integer |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [RoleUpdate](#roleupdate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## DELETE `/api/admin/roles/{role_id}`
**Summary**: Delete Role

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| role_id | path | Yes | integer |  |

### Responses
- **204**: Successful Response
- **422**: Validation Error

---

## GET `/api/admin/users`
**Summary**: List Users

### Responses
- **200**: Successful Response

---

## POST `/api/admin/users`
**Summary**: Create User

### Request Body
**Content-Type**: `application/json`
**Schema**: [AdminUserCreate](#adminusercreate)


### Responses
- **201**: Successful Response
- **422**: Validation Error

---

## PUT `/api/admin/users/{user_id}`
**Summary**: Update User

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| user_id | path | Yes | integer |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [AdminUserUpdate](#adminuserupdate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## DELETE `/api/admin/users/{user_id}`
**Summary**: Delete User

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| user_id | path | Yes | integer |  |

### Responses
- **204**: Successful Response
- **422**: Validation Error

---

## GET `/api/users/`
**Summary**: Get Users

Get all users (superuser only).

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| skip | query | No | integer |  |
| limit | query | No | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/users/{user_id}`
**Summary**: Get User

Get user by ID (superuser only).

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| user_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## PUT `/api/users/{user_id}`
**Summary**: Update User

Update user (superuser only).

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| user_id | path | Yes | integer |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [UserUpdate](#userupdate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## DELETE `/api/users/{user_id}`
**Summary**: Delete User

Delete user (superuser only).

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| user_id | path | Yes | integer |  |

### Responses
- **204**: Successful Response
- **422**: Validation Error

---

## POST `/api/vehicles/`
**Summary**: Create Vehicle

Create a new vehicle.

### Request Body
**Content-Type**: `application/json`
**Schema**: [VehicleCreate](#vehiclecreate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/vehicles/`
**Summary**: Get Vehicles

Get all vehicles.

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| skip | query | No | integer |  |
| limit | query | No | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/vehicles/{vehicle_id}`
**Summary**: Get Vehicle

Get a specific vehicle by ID.

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| vehicle_id | path | Yes | string |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## PUT `/api/vehicles/{vehicle_id}`
**Summary**: Update Vehicle

Update a vehicle.

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| vehicle_id | path | Yes | string |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [VehicleUpdate](#vehicleupdate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## DELETE `/api/vehicles/{vehicle_id}`
**Summary**: Delete Vehicle

Delete a vehicle.

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| vehicle_id | path | Yes | string |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/vehicles/import`
**Summary**: Import Vehicles

Import vehicles from JSON data.

### Request Body
**Content-Type**: `application/json`

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/vehicles/import-bulk`
**Summary**: Import Vehicles Bulk

Import vehicles from JSON data (no auth required for testing).

### Request Body
**Content-Type**: `application/json`

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/vehicles/{vehicle_id}/documents`
**Summary**: List Vehicle Documents

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| vehicle_id | path | Yes | string |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/vehicles/{vehicle_id}/documents`
**Summary**: Upload Vehicle Document

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| vehicle_id | path | Yes | string |  |

### Request Body
**Content-Type**: `multipart/form-data`
**Schema**: [Body_upload_vehicle_document_api_vehicles__vehicle_id__documents_post](#body_upload_vehicle_document_api_vehicles__vehicle_id__documents_post)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## DELETE `/api/vehicles/{vehicle_id}/documents/{doc_id}`
**Summary**: Delete Vehicle Document

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| vehicle_id | path | Yes | string |  |
| doc_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/vehicles/{vehicle_id}/images`
**Summary**: List Vehicle Images

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| vehicle_id | path | Yes | string |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/vehicles/{vehicle_id}/images`
**Summary**: Upload Vehicle Image

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| vehicle_id | path | Yes | string |  |

### Request Body
**Content-Type**: `multipart/form-data`
**Schema**: [Body_upload_vehicle_image_api_vehicles__vehicle_id__images_post](#body_upload_vehicle_image_api_vehicles__vehicle_id__images_post)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## DELETE `/api/vehicles/{vehicle_id}/images/{image_id}`
**Summary**: Delete Vehicle Image

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| vehicle_id | path | Yes | string |  |
| image_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/fuel-entries/`
**Summary**: Create Fuel Entry

### Request Body
**Content-Type**: `application/json`
**Schema**: [FuelEntryCreate](#fuelentrycreate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/fuel-entries/`
**Summary**: List Fuel Entries

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| vehicle_id | query | No | any |  |
| from_date | query | No | any |  |
| to_date | query | No | any |  |
| limit | query | No | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/fuel-entries/{entry_id}`
**Summary**: Get Fuel Entry

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| entry_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## PUT `/api/fuel-entries/{entry_id}`
**Summary**: Update Fuel Entry

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| entry_id | path | Yes | integer |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [FuelEntryUpdate](#fuelentryupdate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## DELETE `/api/fuel-entries/{entry_id}`
**Summary**: Delete Fuel Entry

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| entry_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/fuel-entries/summary`
**Summary**: Fuel Mileage Summary

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| vehicle_id | query | No | any |  |
| from_date | query | No | any |  |
| to_date | query | No | any |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/employees/import/google-sheet`
**Summary**: Import Employees From Google Sheet

Import employees from a public Google Sheet CSV URL.

mode:
  - preview: parse + map + dedupe summary (no DB writes)
  - import: create missing employees

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| url | query | Yes | string |  |
| mode | query | No | string |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/employees/`
**Summary**: Create Employee

Create a new employee record.

### Request Body
**Content-Type**: `application/json`
**Schema**: [EmployeeCreate](#employeecreate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/employees/`
**Summary**: List Employees

Return a paginated list of employees with optional search and filters.

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| skip | query | No | integer |  |
| limit | query | No | integer |  |
| search | query | No | string |  |
| department | query | No | string |  |
| designation | query | No | string |  |
| employment_status | query | No | string |  |
| created_from | query | No | any |  |
| created_to | query | No | any |  |
| with_total | query | No | boolean |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/employees/kpis`
**Summary**: Employees Kpis

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| search | query | No | string |  |
| department | query | No | string |  |
| designation | query | No | string |  |
| employment_status | query | No | string |  |
| created_from | query | No | any |  |
| created_to | query | No | any |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/employees/allocated/active`
**Summary**: List Active Allocated Employee Db Ids

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| day | query | No | any |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/employees/{employee_id}`
**Summary**: Get Employee

Get a single employee by their employee_id (e.g. SEC-0001).

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| employee_id | path | Yes | string |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## PUT `/api/employees/{employee_id}`
**Summary**: Update Employee

Update an existing employee by employee_id.

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| employee_id | path | Yes | string |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [EmployeeUpdate](#employeeupdate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## DELETE `/api/employees/{employee_id}`
**Summary**: Delete Employee

Delete an employee by employee_id.

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| employee_id | path | Yes | string |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/employees/by-db-id/{employee_db_id}`
**Summary**: Get Employee By Db Id

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| employee_db_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/employees/{employee_id}/mark-left`
**Summary**: Mark Employee Left

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| employee_id | path | Yes | string |  |
| reason | query | No | any |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/employees/{employee_id}/clearance/pdf`
**Summary**: Export Employee Clearance Pdf

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| employee_id | path | Yes | string |  |
| month | query | No | any |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/employees/bulk-delete-test`
**Summary**: Bulk Delete Test

Test endpoint for bulk delete.

### Responses
- **200**: Successful Response

---

## PUT `/api/employees/bulk-delete`
**Summary**: Bulk Delete Employees

Delete multiple employees by employee_ids.

### Request Body
**Content-Type**: `application/json`

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/employees/departments/list`
**Summary**: Get Departments

Get all unique departments from employees.

### Responses
- **200**: Successful Response

---

## GET `/api/employees/designations/list`
**Summary**: Get Designations

Get all unique designations from employees.

### Responses
- **200**: Successful Response

---

## GET `/api/employees2/`
**Summary**: List Employees2

Return a paginated list of Employee2 records.

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| skip | query | No | integer |  |
| limit | query | No | integer |  |
| search | query | No | any |  |
| category | query | No | any |  |
| status | query | No | any |  |
| with_total | query | No | boolean |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/employees2/`
**Summary**: Create Employee2

Create a new Employee2 record.

### Request Body
**Content-Type**: `application/json`
**Schema**: [Employee2Create](#employee2create)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## DELETE `/api/employees2/`
**Summary**: Delete All Employees2

Delete all Employee2 records (for re-import).

### Responses
- **200**: Successful Response

---

## GET `/api/employees2/categories`
**Summary**: List Categories

Get distinct categories.

### Responses
- **200**: Successful Response

---

## GET `/api/employees2/statuses`
**Summary**: List Statuses

Get distinct statuses.

### Responses
- **200**: Successful Response

---

## POST `/api/employees2/import-json`
**Summary**: Import From Json

Import Employee2 records from JSON file.

### Request Body
**Content-Type**: `multipart/form-data`
**Schema**: [Body_import_from_json_api_employees2_import_json_post](#body_import_from_json_api_employees2_import_json_post)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/employees2/{employee_id}`
**Summary**: Get Employee2

Get a single Employee2 by ID.

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| employee_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## PUT `/api/employees2/{employee_id}`
**Summary**: Update Employee2

Update an Employee2 record.

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| employee_id | path | Yes | integer |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [Employee2Update](#employee2update)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## DELETE `/api/employees2/{employee_id}`
**Summary**: Delete Employee2

Delete an Employee2 record.

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| employee_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/employees2/{employee_id}/deactivate`
**Summary**: Deactivate Employee2

Move an active employee to the inactive table.

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| employee_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/employees2/{employee_id}/pending-deactivate`
**Summary**: Create Pending Deactivation

Submit an employee to pending deactivation queue

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| employee_id | path | Yes | integer |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [PendingDeactivationRequest](#pendingdeactivationrequest)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/employees2/{employee_id}/upload/{field_type}`
**Summary**: Upload Employee File

Upload a file for an employee (avatar, cnic, domicile, etc.).

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| employee_id | path | Yes | integer |  |
| field_type | path | Yes | string |  |

### Request Body
**Content-Type**: `multipart/form-data`
**Schema**: [Body_upload_employee_file_api_employees2__employee_id__upload__field_type__post](#body_upload_employee_file_api_employees2__employee_id__upload__field_type__post)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/employees2/{employee_id}/export-pdf`
**Summary**: Export Employee Pdf

Export employee details as PDF with updated layout including all new fields.

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| employee_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/employees-inactive/`
**Summary**: List Inactive Employees

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| skip | query | No | integer |  |
| limit | query | No | integer |  |
| search | query | No | any |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/employees-inactive/{employee_id}/activate`
**Summary**: Activate Inactive Employee

Move an inactive employee back to the active Master Profiles table.

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| employee_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/employees-inactive/import-local`
**Summary**: Import From Local File

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| file_path | query | No | string |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/employees/by-db-id/{employee_db_id}/documents`
**Summary**: List Employee Documents

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| employee_db_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/employees/by-db-id/{employee_db_id}/documents`
**Summary**: Upload Employee Document

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| employee_db_id | path | Yes | integer |  |

### Request Body
**Content-Type**: `multipart/form-data`
**Schema**: [Body_upload_employee_document_api_employees_by_db_id__employee_db_id__documents_post](#body_upload_employee_document_api_employees_by_db_id__employee_db_id__documents_post)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## DELETE `/api/employees/by-db-id/{employee_db_id}/documents/{doc_id}`
**Summary**: Delete Employee Document

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| employee_db_id | path | Yes | integer |  |
| doc_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/employees/by-db-id/{employee_db_id}/warnings`
**Summary**: List Employee Warnings

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| employee_db_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/employees/by-db-id/{employee_db_id}/warnings`
**Summary**: Create Employee Warning

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| employee_db_id | path | Yes | integer |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [EmployeeWarningCreate](#employeewarningcreate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## DELETE `/api/employees/by-db-id/{employee_db_id}/warnings/{warning_id}`
**Summary**: Delete Employee Warning

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| employee_db_id | path | Yes | integer |  |
| warning_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/employees/warnings/{warning_id}/documents`
**Summary**: List Warning Documents

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| warning_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/employees/warnings/{warning_id}/documents`
**Summary**: Upload Warning Document

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| warning_id | path | Yes | integer |  |

### Request Body
**Content-Type**: `multipart/form-data`
**Schema**: [Body_upload_warning_document_api_employees_warnings__warning_id__documents_post](#body_upload_warning_document_api_employees_warnings__warning_id__documents_post)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## DELETE `/api/employees/warnings/{warning_id}/documents/{doc_id}`
**Summary**: Delete Warning Document

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| warning_id | path | Yes | integer |  |
| doc_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/attendance/range`
**Summary**: List Attendance Range

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| from_date | query | Yes | string |  |
| to_date | query | Yes | string |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/attendance/employee/{employee_id}`
**Summary**: Employee Attendance Range

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| employee_id | path | Yes | string |  |
| from_date | query | Yes | string |  |
| to_date | query | Yes | string |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/attendance/employee/{employee_id}/export/pdf`
**Summary**: Export Employee Attendance Pdf

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| employee_id | path | Yes | string |  |
| from_date | query | Yes | string |  |
| to_date | query | Yes | string |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/attendance/summary`
**Summary**: Attendance Summary

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| from_date | query | Yes | string |  |
| to_date | query | Yes | string |  |
| department | query | No | any |  |
| designation | query | No | any |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/attendance/`
**Summary**: List Attendance

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| date | query | Yes | string |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## PUT `/api/attendance/`
**Summary**: Bulk Upsert Attendance

### Request Body
**Content-Type**: `application/json`
**Schema**: [AttendanceBulkUpsert](#attendancebulkupsert)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/attendance/export/pdf`
**Summary**: Export Attendance Pdf

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| report_date | query | No | any |  |
| date | query | No | any |  |
| from_date | query | No | any |  |
| to_date | query | No | any |  |
| department | query | No | any |  |
| designation | query | No | any |  |
| search | query | No | any |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/leave-periods/`
**Summary**: Create Leave Period

### Request Body
**Content-Type**: `application/json`
**Schema**: [LeavePeriodCreate](#leaveperiodcreate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/leave-periods/`
**Summary**: List Leave Periods

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| employee_id | query | No | any |  |
| active_on | query | No | any |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## PUT `/api/leave-periods/{leave_period_id}`
**Summary**: Update Leave Period

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| leave_period_id | path | Yes | integer |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [LeavePeriodUpdate](#leaveperiodupdate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## DELETE `/api/leave-periods/{leave_period_id}`
**Summary**: Delete Leave Period

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| leave_period_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/leave-periods/alerts`
**Summary**: Leave Period Alerts

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| as_of | query | No | any |  |
| employee_id | query | No | any |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/payroll/payment-status`
**Summary**: Get Payment Status

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| month | query | Yes | string |  |
| employee_id | query | Yes | string |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## PUT `/api/payroll/payment-status`
**Summary**: Upsert Payment Status

### Request Body
**Content-Type**: `application/json`
**Schema**: [PayrollPaymentStatusUpsert](#payrollpaymentstatusupsert)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/payroll/report`
**Summary**: Payroll Report

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| month | query | Yes | string |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/payroll/range-report`
**Summary**: Payroll Range Report

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| from_date | query | Yes | string |  |
| to_date | query | Yes | string |  |
| month | query | No | string |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/payroll/sheet-entries`
**Summary**: List Payroll Sheet Entries

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| from_date | query | Yes | string |  |
| to_date | query | Yes | string |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## PUT `/api/payroll/sheet-entries`
**Summary**: Bulk Upsert Payroll Sheet Entries

### Request Body
**Content-Type**: `application/json`
**Schema**: [PayrollSheetEntryBulkUpsert](#payrollsheetentrybulkupsert)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/payroll/export/pdf`
**Summary**: Export Payroll Pdf

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| month | query | Yes | string |  |
| from_date | query | No | string |  |
| to_date | query | No | string |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/payroll/export/csv`
**Summary**: Export Payroll Csv

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| month | query | Yes | string |  |
| from_date | query | No | string |  |
| to_date | query | No | string |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/payroll2/range-report`
**Summary**: Payroll2 Range Report

Payroll2 range report with correct attendance counting.

Key fields:
- presents_total: Total present days from attendance (present + late status)
- pre_days: Editable field for previous month portion
- cur_days: Editable field for current month portion
- total_days: pre_days + cur_days + leave_encashment (used for salary calculation)

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| from_date | query | Yes | string |  |
| to_date | query | Yes | string |  |
| month | query | No | any |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/payroll2/export-pdf`
**Summary**: Export Payroll2 Pdf

Export payroll2 data as PDF

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| from_date | query | Yes | string |  |
| to_date | query | Yes | string |  |
| month | query | Yes | string |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [Payroll2ExportRequest](#payroll2exportrequest)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/vehicle-assignments/`
**Summary**: Create Assignment

Create a new vehicle assignment entry.

### Request Body
**Content-Type**: `application/json`
**Schema**: [VehicleAssignmentCreate](#vehicleassignmentcreate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/vehicle-assignments/`
**Summary**: List Assignments

Return vehicle assignments.

Optional filters are provided for analytics/drill-down pages.

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| vehicle_id | query | No | any |  |
| from_date | query | No | any |  |
| to_date | query | No | any |  |
| status | query | No | any |  |
| limit | query | No | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/vehicle-assignments/analytics`
**Summary**: Assignment Analytics

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| period | query | No | string |  |
| day | query | No | any |  |
| month | query | No | any |  |
| year | query | No | any |  |
| vehicle_id | query | No | any |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/vehicle-assignments/efficiency`
**Summary**: Assignment Efficiency

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| period | query | No | string |  |
| day | query | No | any |  |
| month | query | No | any |  |
| year | query | No | any |  |
| vehicle_id | query | No | any |  |
| outlier_limit | query | No | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/vehicle-assignments/{assignment_id}`
**Summary**: Get Assignment

Get a single assignment by ID.

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| assignment_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## PUT `/api/vehicle-assignments/{assignment_id}`
**Summary**: Update Assignment

Update an existing assignment.

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| assignment_id | path | Yes | integer |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [VehicleAssignmentUpdate](#vehicleassignmentupdate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## DELETE `/api/vehicle-assignments/{assignment_id}`
**Summary**: Delete Assignment

Delete an assignment by ID.

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| assignment_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/vehicle-maintenance/`
**Summary**: Create Maintenance

Create a new vehicle maintenance record.

### Request Body
**Content-Type**: `application/json`
**Schema**: [VehicleMaintenanceCreate](#vehiclemaintenancecreate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/vehicle-maintenance/`
**Summary**: List Maintenance

Return all maintenance records, optionally filtered by vehicle or employee.

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| vehicle_id | query | No | any |  |
| employee_id | query | No | any |  |
| vendor | query | No | any |  |
| date | query | No | any |  |
| month | query | No | any |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/vehicle-maintenance/export/pdf`
**Summary**: Export Maintenance Pdf

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| vehicle_id | query | No | any |  |
| employee_id | query | No | any |  |
| vendor | query | No | any |  |
| date | query | No | any |  |
| month | query | No | any |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/vehicle-maintenance/{record_id}`
**Summary**: Get Maintenance

Get a single maintenance record by ID.

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| record_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## PUT `/api/vehicle-maintenance/{record_id}`
**Summary**: Update Maintenance

Update an existing maintenance record.

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| record_id | path | Yes | integer |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [VehicleMaintenanceUpdate](#vehiclemaintenanceupdate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## DELETE `/api/vehicle-maintenance/{record_id}`
**Summary**: Delete Maintenance

Delete a maintenance record by ID.

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| record_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/vehicle-maintenance/{record_id}/receipt`
**Summary**: Maintenance Receipt Pdf

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| record_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/inventory-assignments/`
**Summary**: Get Inventory Assignments

Return the current inventory assignments map.

If no row exists yet, an empty map is returned.

### Responses
- **200**: Successful Response

---

## PUT `/api/inventory-assignments/`
**Summary**: Upsert Inventory Assignments

Replace the stored assignments map with the provided payload.

### Request Body
**Content-Type**: `application/json`
**Schema**: [InventoryAssignmentsState](#inventoryassignmentsstate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/general-inventory/items`
**Summary**: List Items

### Responses
- **200**: Successful Response

---

## POST `/api/general-inventory/items`
**Summary**: Create Item

### Request Body
**Content-Type**: `application/json`
**Schema**: [GeneralItemCreate](#generalitemcreate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/general-inventory/categories`
**Summary**: List Categories

### Responses
- **200**: Successful Response

---

## POST `/api/general-inventory/items/{item_code}/image`
**Summary**: Upload Item Image

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| item_code | path | Yes | string |  |

### Request Body
**Content-Type**: `multipart/form-data`
**Schema**: [Body_upload_item_image_api_general_inventory_items__item_code__image_post](#body_upload_item_image_api_general_inventory_items__item_code__image_post)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/general-inventory/items/{item_code}`
**Summary**: Get Item

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| item_code | path | Yes | string |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## PUT `/api/general-inventory/items/{item_code}`
**Summary**: Update Item

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| item_code | path | Yes | string |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [GeneralItemUpdate](#generalitemupdate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## DELETE `/api/general-inventory/items/{item_code}`
**Summary**: Delete Item

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| item_code | path | Yes | string |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/general-inventory/issued`
**Summary**: List All Issued

Return current issued general inventory for all employees.

### Responses
- **200**: Successful Response

---

## GET `/api/general-inventory/transactions`
**Summary**: List Transactions

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| item_code | query | No | any |  |
| employee_id | query | No | any |  |
| limit | query | No | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/general-inventory/items/{item_code}/issue`
**Summary**: Issue Item

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| item_code | path | Yes | string |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [app__schemas__general_inventory__IssueRequest](#app__schemas__general_inventory__issuerequest)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/general-inventory/items/{item_code}/return`
**Summary**: Return Item

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| item_code | path | Yes | string |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [app__schemas__general_inventory__ReturnRequest](#app__schemas__general_inventory__returnrequest)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/general-inventory/items/{item_code}/lost`
**Summary**: Lost Item

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| item_code | path | Yes | string |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [app__schemas__general_inventory__ReturnRequest](#app__schemas__general_inventory__returnrequest)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/general-inventory/items/{item_code}/damaged`
**Summary**: Damaged Item

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| item_code | path | Yes | string |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [app__schemas__general_inventory__ReturnRequest](#app__schemas__general_inventory__returnrequest)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/general-inventory/items/{item_code}/adjust`
**Summary**: Adjust Item

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| item_code | path | Yes | string |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [AdjustRequest](#adjustrequest)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/client-management/clients`
**Summary**: List Clients

### Responses
- **200**: Successful Response

---

## POST `/api/client-management/clients`
**Summary**: Create Client

### Request Body
**Content-Type**: `application/json`
**Schema**: [ClientCreate](#clientcreate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/client-management/clients/{client_id}`
**Summary**: Get Client

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| client_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## PUT `/api/client-management/clients/{client_id}`
**Summary**: Update Client

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| client_id | path | Yes | integer |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [ClientUpdate](#clientupdate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## DELETE `/api/client-management/clients/{client_id}`
**Summary**: Delete Client

Delete a client and all its details.

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| client_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/client-management/clients/{client_id}/compare-months`
**Summary**: Compare Client Months

Compare client metrics (guards, salary based on attendance) between two months.

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| client_id | path | Yes | integer |  |
| month1 | query | Yes | string |  |
| month2 | query | Yes | string |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/client-management/clients/compare-months/all`
**Summary**: Compare All Clients Months

Compare client salary totals (based on attendance for allocated guards) between two months for all clients.

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| month1 | query | Yes | string |  |
| month2 | query | Yes | string |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/client-management/clients/{client_id}/contacts`
**Summary**: List Contacts

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| client_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/client-management/clients/{client_id}/contacts`
**Summary**: Create Contact

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| client_id | path | Yes | integer |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [ClientContactCreate](#clientcontactcreate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## PUT `/api/client-management/clients/{client_id}/contacts/{contact_id}`
**Summary**: Update Contact

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| client_id | path | Yes | integer |  |
| contact_id | path | Yes | integer |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [ClientContactUpdate](#clientcontactupdate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## DELETE `/api/client-management/clients/{client_id}/contacts/{contact_id}`
**Summary**: Delete Contact

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| client_id | path | Yes | integer |  |
| contact_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/client-management/clients/{client_id}/addresses`
**Summary**: List Addresses

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| client_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/client-management/clients/{client_id}/addresses`
**Summary**: Create Address

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| client_id | path | Yes | integer |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [ClientAddressCreate](#clientaddresscreate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## PUT `/api/client-management/clients/{client_id}/addresses/{address_id}`
**Summary**: Update Address

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| client_id | path | Yes | integer |  |
| address_id | path | Yes | integer |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [ClientAddressUpdate](#clientaddressupdate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## DELETE `/api/client-management/clients/{client_id}/addresses/{address_id}`
**Summary**: Delete Address

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| client_id | path | Yes | integer |  |
| address_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/client-management/clients/{client_id}/sites`
**Summary**: List Sites

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| client_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/client-management/clients/{client_id}/sites`
**Summary**: Create Site

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| client_id | path | Yes | integer |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [ClientSiteCreate](#clientsitecreate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## PUT `/api/client-management/clients/{client_id}/sites/{site_id}`
**Summary**: Update Site

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| client_id | path | Yes | integer |  |
| site_id | path | Yes | integer |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [ClientSiteUpdate](#clientsiteupdate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## DELETE `/api/client-management/clients/{client_id}/sites/{site_id}`
**Summary**: Delete Site

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| client_id | path | Yes | integer |  |
| site_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/client-management/clients/{client_id}/contract-requirements`
**Summary**: List Contract Requirements

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| client_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/client-management/clients/{client_id}/contracts`
**Summary**: List Contracts

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| client_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/client-management/clients/{client_id}/contracts`
**Summary**: Create Contract

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| client_id | path | Yes | integer |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [ClientContractCreate](#clientcontractcreate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/client-management/contracts/{contract_id}`
**Summary**: Get Contract Direct

Get a contract by ID directly.

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| contract_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/client-management/clients/{client_id}/contracts/{contract_id}`
**Summary**: Get Contract

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| client_id | path | Yes | integer |  |
| contract_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## PUT `/api/client-management/clients/{client_id}/contracts/{contract_id}`
**Summary**: Update Contract

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| client_id | path | Yes | integer |  |
| contract_id | path | Yes | integer |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [ClientContractUpdate](#clientcontractupdate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## DELETE `/api/client-management/clients/{client_id}/contracts/{contract_id}`
**Summary**: Delete Contract

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| client_id | path | Yes | integer |  |
| contract_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/client-management/clients/{client_id}/rate-cards`
**Summary**: List Rate Cards

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| client_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/client-management/clients/{client_id}/rate-cards`
**Summary**: Create Rate Card

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| client_id | path | Yes | integer |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [ClientRateCardCreate](#clientratecardcreate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## PUT `/api/client-management/clients/{client_id}/rate-cards/{rate_id}`
**Summary**: Update Rate Card

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| client_id | path | Yes | integer |  |
| rate_id | path | Yes | integer |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [ClientRateCardUpdate](#clientratecardupdate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## DELETE `/api/client-management/clients/{client_id}/rate-cards/{rate_id}`
**Summary**: Delete Rate Card

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| client_id | path | Yes | integer |  |
| rate_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/client-management/clients/{client_id}/invoices`
**Summary**: List Invoices

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| client_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/client-management/clients/{client_id}/invoices`
**Summary**: Create Invoice

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| client_id | path | Yes | integer |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [ClientInvoiceCreate](#clientinvoicecreate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/client-management/invoices/cleared-summary`
**Summary**: Cleared Payments Summary

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| month | query | Yes | string |  |
| months | query | No | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/client-management/invoices/pending-summary`
**Summary**: Pending Invoices Summary

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| month | query | Yes | string |  |
| months | query | No | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## PUT `/api/client-management/clients/{client_id}/invoices/{invoice_id}`
**Summary**: Update Invoice

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| client_id | path | Yes | integer |  |
| invoice_id | path | Yes | integer |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [ClientInvoiceUpdate](#clientinvoiceupdate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## DELETE `/api/client-management/clients/{client_id}/invoices/{invoice_id}`
**Summary**: Delete Invoice

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| client_id | path | Yes | integer |  |
| invoice_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/client-management/clients/{client_id}/documents`
**Summary**: List Documents

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| client_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/client-management/clients/{client_id}/documents`
**Summary**: Create Document

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| client_id | path | Yes | integer |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [ClientDocumentCreate](#clientdocumentcreate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/client-management/clients/{client_id}/documents/upload`
**Summary**: Upload Client Document

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| client_id | path | Yes | integer |  |

### Request Body
**Content-Type**: `multipart/form-data`
**Schema**: [Body_upload_client_document_api_client_management_clients__client_id__documents_upload_post](#body_upload_client_document_api_client_management_clients__client_id__documents_upload_post)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## PUT `/api/client-management/clients/{client_id}/documents/{document_id}`
**Summary**: Update Document

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| client_id | path | Yes | integer |  |
| document_id | path | Yes | integer |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [ClientDocumentUpdate](#clientdocumentupdate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## DELETE `/api/client-management/clients/{client_id}/documents/{document_id}`
**Summary**: Delete Document

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| client_id | path | Yes | integer |  |
| document_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/client-management/clients/{client_id}/invoices/{invoice_id}/pdf`
**Summary**: Download Invoice Pdf

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| client_id | path | Yes | integer |  |
| invoice_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/client-management/sites/{site_id}/requirements`
**Summary**: List Requirements

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| site_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/client-management/sites/{site_id}/requirements`
**Summary**: Create Requirement

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| site_id | path | Yes | integer |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [ClientGuardRequirementCreate](#clientguardrequirementcreate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## PUT `/api/client-management/sites/{site_id}/requirements/{requirement_id}`
**Summary**: Update Requirement

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| site_id | path | Yes | integer |  |
| requirement_id | path | Yes | integer |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [ClientGuardRequirementUpdate](#clientguardrequirementupdate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## DELETE `/api/client-management/sites/{site_id}/requirements/{requirement_id}`
**Summary**: Delete Requirement

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| site_id | path | Yes | integer |  |
| requirement_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/client-management/sites/{site_id}/allocations`
**Summary**: List Site Allocations

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| site_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/client-management/sites/{site_id}/allocations`
**Summary**: Allocate Guard

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| site_id | path | Yes | integer |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [ClientSiteGuardAllocationCreate](#clientsiteguardallocationcreate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/client-management/sites/{site_id}/allocations/{allocation_id}/release`
**Summary**: Release Guard

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| site_id | path | Yes | integer |  |
| allocation_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/client-management/sites/{site_id}/requirements/{requirement_id}/suggested-employees`
**Summary**: Suggested Employees

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| site_id | path | Yes | integer |  |
| requirement_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/client-management/sites/{site_id}/requirements/{requirement_id}/complete`
**Summary**: Complete Requirement

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| site_id | path | Yes | integer |  |
| requirement_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/client-management/contracts/{contract_id}/allocations`
**Summary**: List Contract Allocations

List all guard allocations for a contract

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| contract_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/client-management/contracts/{contract_id}/allocations`
**Summary**: Create Contract Allocation

Allocate a guard to a contract

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| contract_id | path | Yes | integer |  |

### Request Body
**Content-Type**: `application/json`

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## DELETE `/api/client-management/contracts/{contract_id}/allocations/{allocation_id}`
**Summary**: Delete Contract Allocation

Remove a guard allocation

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| contract_id | path | Yes | integer |  |
| allocation_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/client-management/contracts/{contract_id}/invoice-pdf`
**Summary**: Download Contract Invoice Pdf

Generate invoice PDF for a contract

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| contract_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/client-management/contracts/{contract_id}/receipt-pdf`
**Summary**: Download Contract Receipt Pdf

Generate receipt PDF for a contract

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| contract_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/client-management/import-bulk`
**Summary**: Import Clients Bulk

Import clients from JSON data (no auth required for testing).

### Request Body
**Content-Type**: `application/json`

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/client-management/statistics`
**Summary**: Get Client Statistics

Get client statistics for KPI dashboard (no auth required for testing).

### Responses
- **200**: Successful Response

---

## GET `/api/restricted-inventory/items`
**Summary**: List Items

### Responses
- **200**: Successful Response

---

## POST `/api/restricted-inventory/items`
**Summary**: Create Item

### Request Body
**Content-Type**: `application/json`
**Schema**: [RestrictedItemCreate](#restricteditemcreate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/restricted-inventory/employees/{employee_id}/issued`
**Summary**: Get Employee Issued

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| employee_id | path | Yes | string |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/restricted-inventory/issued`
**Summary**: List All Issued

Return current issued restricted inventory for all employees.

This endpoint is intentionally best-effort and does not require that the employee
record still exists, so allocations can still be managed/returned.

### Responses
- **200**: Successful Response

---

## POST `/api/restricted-inventory/employees/{employee_id}/serials/{serial_unit_id}/{action}`
**Summary**: Employee Serial Action

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| employee_id | path | Yes | string |  |
| serial_unit_id | path | Yes | integer |  |
| action | path | Yes | string |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [SerialActionRequest](#serialactionrequest)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/restricted-inventory/employees/{employee_id}/items/{item_code}/{action}`
**Summary**: Employee Quantity Action

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| employee_id | path | Yes | string |  |
| item_code | path | Yes | string |  |
| action | path | Yes | string |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [QuantityActionRequest](#quantityactionrequest)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/restricted-inventory/items/{item_code}`
**Summary**: Get Item

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| item_code | path | Yes | string |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## PUT `/api/restricted-inventory/items/{item_code}`
**Summary**: Update Item

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| item_code | path | Yes | string |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [RestrictedItemUpdate](#restricteditemupdate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## DELETE `/api/restricted-inventory/items/{item_code}`
**Summary**: Delete Item

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| item_code | path | Yes | string |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/restricted-inventory/items/{item_code}/serials`
**Summary**: List Serials

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| item_code | path | Yes | string |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/restricted-inventory/items/{item_code}/serials`
**Summary**: Add Serial

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| item_code | path | Yes | string |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [RestrictedSerialUnitCreate](#restrictedserialunitcreate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/restricted-inventory/items/{item_code}/images`
**Summary**: List Images

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| item_code | path | Yes | string |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/restricted-inventory/items/{item_code}/images`
**Summary**: Upload Image

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| item_code | path | Yes | string |  |

### Request Body
**Content-Type**: `multipart/form-data`
**Schema**: [Body_upload_image_api_restricted_inventory_items__item_code__images_post](#body_upload_image_api_restricted_inventory_items__item_code__images_post)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## DELETE `/api/restricted-inventory/items/{item_code}/images/{image_id}`
**Summary**: Delete Image

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| item_code | path | Yes | string |  |
| image_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/restricted-inventory/transactions`
**Summary**: List Transactions

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| item_code | query | No | any |  |
| employee_id | query | No | any |  |
| limit | query | No | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/restricted-inventory/items/{item_code}/issue`
**Summary**: Issue Item

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| item_code | path | Yes | string |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [app__schemas__restricted_inventory__IssueRequest](#app__schemas__restricted_inventory__issuerequest)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/restricted-inventory/items/{item_code}/return`
**Summary**: Return Item

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| item_code | path | Yes | string |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [app__schemas__restricted_inventory__ReturnRequest](#app__schemas__restricted_inventory__returnrequest)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/restricted-inventory/items/{item_code}/maintenance`
**Summary**: Mark Maintenance

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| item_code | path | Yes | string |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [LostRequest](#lostrequest)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/restricted-inventory/items/{item_code}/cleaning`
**Summary**: Mark Cleaning

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| item_code | path | Yes | string |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [LostRequest](#lostrequest)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/restricted-inventory/items/{item_code}/adjust`
**Summary**: Adjust Stock

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| item_code | path | Yes | string |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [RestrictedItemUpdate](#restricteditemupdate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/advances/summary`
**Summary**: Advances Month Summary

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| month | query | Yes | string |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/advances/monthly`
**Summary**: List Advances For Month

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| month | query | Yes | string |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/advances/employees/{employee_db_id}/summary`
**Summary**: Employee Advance Summary

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| employee_db_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/advances/employees/{employee_db_id}/advances`
**Summary**: List Advances

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| employee_db_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/advances/employees/{employee_db_id}/advances`
**Summary**: Create Advance

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| employee_db_id | path | Yes | integer |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [EmployeeAdvanceCreate](#employeeadvancecreate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## DELETE `/api/advances/employees/{employee_db_id}/advances/{advance_id}`
**Summary**: Delete Advance

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| employee_db_id | path | Yes | integer |  |
| advance_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/advances/employees/{employee_db_id}/deductions`
**Summary**: List Deductions

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| employee_db_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## PUT `/api/advances/employees/{employee_db_id}/deductions`
**Summary**: Upsert Monthly Deduction

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| employee_db_id | path | Yes | integer |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [EmployeeAdvanceDeductionUpsert](#employeeadvancedeductionupsert)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## DELETE `/api/advances/employees/{employee_db_id}/deductions/{deduction_id}`
**Summary**: Delete Deduction

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| employee_db_id | path | Yes | integer |  |
| deduction_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/exports/accounts/monthly/pdf`
**Summary**: Export Accounts Monthly Pdf

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| month | query | Yes | string |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/exports/inventory/employees/pdf`
**Summary**: Export Employee Inventory Pdf

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| include_zero | query | No | boolean |  |
| search | query | No | any |  |
| start_date | query | No | any |  |
| end_date | query | No | any |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/exports/inventory/employee/{employee_id}/pdf`
**Summary**: Export Single Employee Inventory Pdf

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| employee_id | path | Yes | string |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/finance/accounts`
**Summary**: List Accounts

### Responses
- **200**: Successful Response

---

## POST `/api/finance/accounts`
**Summary**: Create Account

### Request Body
**Content-Type**: `application/json`
**Schema**: [FinanceAccountCreate](#financeaccountcreate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/finance/accounts/{account_id}`
**Summary**: Get Account

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| account_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## PUT `/api/finance/accounts/{account_id}`
**Summary**: Update Account

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| account_id | path | Yes | integer |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [FinanceAccountUpdate](#financeaccountupdate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## DELETE `/api/finance/accounts/{account_id}`
**Summary**: Delete Account

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| account_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/finance/journals`
**Summary**: List Journals

### Responses
- **200**: Successful Response

---

## POST `/api/finance/journals`
**Summary**: Create Journal

### Request Body
**Content-Type**: `application/json`
**Schema**: [FinanceJournalEntryCreate](#financejournalentrycreate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/finance/journals/{entry_id}`
**Summary**: Get Journal

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| entry_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## PUT `/api/finance/journals/{entry_id}`
**Summary**: Update Journal

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| entry_id | path | Yes | integer |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [FinanceJournalEntryUpdate](#financejournalentryupdate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## DELETE `/api/finance/journals/{entry_id}`
**Summary**: Delete Journal

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| entry_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/finance/journals/{entry_id}/post`
**Summary**: Post Journal

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| entry_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/finance/journals/{entry_id}/reverse`
**Summary**: Reverse Journal

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| entry_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/expenses/`
**Summary**: List Expenses

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| skip | query | No | integer |  |
| limit | query | No | integer |  |
| category | query | No | any |  |
| status | query | No | any |  |
| from_date | query | No | any |  |
| to_date | query | No | any |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/expenses/`
**Summary**: Create Expense

### Request Body
**Content-Type**: `application/json`
**Schema**: [ExpenseCreate](#expensecreate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/expenses/{expense_id}`
**Summary**: Get Expense

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| expense_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## PUT `/api/expenses/{expense_id}`
**Summary**: Update Expense

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| expense_id | path | Yes | integer |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [ExpenseUpdate](#expenseupdate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## DELETE `/api/expenses/{expense_id}`
**Summary**: Delete Expense

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| expense_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/expenses/{expense_id}/approve`
**Summary**: Approve Expense

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| expense_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/expenses/{expense_id}/pay`
**Summary**: Pay Expense

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| expense_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/expenses/{expense_id}/undo-payment`
**Summary**: Undo Payment

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| expense_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/expenses/summary/monthly`
**Summary**: Get Expense Summary

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| month | query | No | any | YYYY-MM format |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/expenses/{expense_id}/export/pdf`
**Summary**: Export Expense Pdf

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| expense_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/expenses/export/pdf`
**Summary**: Export Expenses Pdf

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| from_date | query | No | any |  |
| to_date | query | No | any |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/upload`
**Summary**: Upload File

Upload a file and return its URL

### Request Body
**Content-Type**: `multipart/form-data`
**Schema**: [Body_upload_file_api_upload_post](#body_upload_file_api_upload_post)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/bulk/employees/delete`
**Summary**: Bulk Delete Employees

Delete multiple employees by employee_ids.

### Request Body
**Content-Type**: `application/json`

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/bulk/test`
**Summary**: Test Bulk Operations

Test endpoint to verify bulk operations API is working.

### Responses
- **200**: Successful Response

---

## GET `/api/analytics/dashboard`
**Summary**: Get Analytics Dashboard

Get comprehensive analytics dashboard data

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| from_date | query | Yes | string |  |
| to_date | query | Yes | string |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/api/hr/pending-deactivate`
**Summary**: Create Pending Deactivation

Create a pending deactivation request for an employee

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| employee_id | query | Yes | integer |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [PendingDeactivationCreate](#pendingdeactivationcreate)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/api/hr/pending-deactivate`
**Summary**: List Pending Deactivations

List all pending deactivation requests

### Responses
- **200**: Successful Response

---

## POST `/api/hr/pending-deactivate/{pending_id}/move-to-inactive`
**Summary**: Move To Inactive

Move a pending deactivation to inactive employees

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| pending_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## DELETE `/api/hr/pending-deactivate/{pending_id}`
**Summary**: Reject Pending Deactivation

Reject a pending deactivation request.

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| pending_id | path | Yes | integer |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/admin/api/sign-in`
**Summary**: Sign In

This method is used to sign in.

:params request: a request object.
:params response: a response object.
:params payload: a payload object.
:return: None.

### Request Body
**Content-Type**: `application/json`
**Schema**: [SignInInputSchema](#signininputschema)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/admin/api/sign-out`
**Summary**: Sign Out

This method is used to sign out.

:params request: a request object.
:params response: a response object.
:return: None.

### Responses
- **200**: Successful Response

---

## GET `/admin/api/me`
**Summary**: Me

This method is used to get current user.

:params user_id: a user id.
:return: A user object.

### Responses
- **200**: Successful Response

---

## GET `/admin/api/dashboard-widget/{model}`
**Summary**: Dashboard Widget

This method is used to get a dashboard widget data.

:params model: a dashboard widget model.
:params min_x_field: a min x field value.
:params max_x_field: a max x field value.
:params period_x_field: a period x field value.
:return: A list of objects.

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| model | path | Yes | string |  |
| min_x_field | query | No | any |  |
| max_x_field | query | No | any |  |
| period_x_field | query | No | any |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/admin/api/list/{model}`
**Summary**: List Objs

This method is used to get a list of objects.

:params request: a request object.
:params model: a name of model.
:params search: a search string.
:params sort_by: a sort by string.
:params offset: an offset.
:params limit: a limit.
:return: A list of objects.

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| model | path | Yes | string |  |
| search | query | No | any |  |
| sort_by | query | No | any |  |
| offset | query | No | any |  |
| limit | query | No | any |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/admin/api/retrieve/{model}/{id}`
**Summary**: Get

This method is used to get an object.

:params model: a name of model.
:params id: an id of object.
:return: An object.

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| model | path | Yes | string |  |
| id | path | Yes | any |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/admin/api/add/{model}`
**Summary**: Add

This method is used to add an object.

:params model: a name of model.
:params payload: a payload object.
:return: An object.

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| model | path | Yes | string |  |

### Request Body
**Content-Type**: `application/json`

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## PATCH `/admin/api/change-password/{id}`
**Summary**: Change Password

This method is used to change password.

:params id: an id of object.
:params payload: a payload object.
:return: An object.

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| id | path | Yes | any |  |

### Request Body
**Content-Type**: `application/json`

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## PATCH `/admin/api/change/{model}/{id}`
**Summary**: Change

This method is used to change an object.

:params model: a name of model.
:params id: an id of object.
:params payload: a payload object.
:return: An object.

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| model | path | Yes | string |  |
| id | path | Yes | any |  |

### Request Body
**Content-Type**: `application/json`

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/admin/api/export/{model}`
**Summary**: Export

This method is used to export a list of objects.

:params request: a request object.
:params model: a name of model.
:params payload: a payload object.
:params search: a search string.
:params sort_by: a sort by string.
:return: A stream of export data.

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| model | path | Yes | string |  |
| search | query | No | any |  |
| sort_by | query | No | any |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [ExportInputSchema](#exportinputschema)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## DELETE `/admin/api/delete/{model}/{id}`
**Summary**: Delete

This method is used to delete an object.

:params model: a name of model.
:params id: an id of object.
:return: An id of object.

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| model | path | Yes | string |  |
| id | path | Yes | any |  |

### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## POST `/admin/api/action/{model}/{action}`
**Summary**: Action

This method is used to perform an action.

:params model: a name of model.
:params action: a name of action.
:params payload: a payload object.
:return: A list of objects.

### Parameters
| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| model | path | Yes | string |  |
| action | path | Yes | string |  |

### Request Body
**Content-Type**: `application/json`
**Schema**: [ActionInputSchema](#actioninputschema)


### Responses
- **200**: Successful Response
- **422**: Validation Error

---

## GET `/admin/api/configuration`
**Summary**: Configuration

This method is used to get a configuration.

:params user_id: an id of user.
:return: A configuration.

### Responses
- **200**: Successful Response

---

## GET `/`
**Summary**: Root

Root endpoint.

### Responses
- **200**: Successful Response

---

## GET `/health`
**Summary**: Health Check

Health check endpoint.

### Responses
- **200**: Successful Response

---

# Models / Schemas
## ActionInputSchema
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| ids | Array<any> | Yes |  |

## AddConfigurationFieldSchema
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| index |  | Yes |  |
| form_widget_type | [WidgetType] | Yes |  |
| form_widget_props |  | Yes |  |
| required |  | Yes |  |

## AdjustRequest
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| quantity | number | Yes |  |
| notes |  | No |  |

## AdminUserCreate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| email | string | Yes |  |
| username | string | Yes |  |
| full_name |  | No |  |
| password | string | Yes |  |
| is_active | boolean | No |  |
| is_superuser | boolean | No |  |
| role_ids | Array<integer> | No |  |

## AdminUserOut
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| id | integer | Yes |  |
| email | string | Yes |  |
| username | string | Yes |  |
| full_name |  | No |  |
| is_active | boolean | Yes |  |
| is_superuser | boolean | Yes |  |
| roles | Array<[RoleOut]> | No |  |

## AdminUserUpdate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| email |  | No |  |
| username |  | No |  |
| full_name |  | No |  |
| password |  | No |  |
| is_active |  | No |  |
| is_superuser |  | No |  |
| role_ids |  | No |  |

## AssignmentEfficiencyRow
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| assignment_id | integer | Yes |  |
| assignment_date |  | No |  |
| vehicle_id | string | Yes |  |
| employee_ids | Array<string> | Yes |  |
| route_from |  | No |  |
| route_to |  | No |  |
| distance_km | number | Yes |  |
| amount | number | Yes |  |
| rate_per_km | number | Yes |  |
| cost_per_km | number | Yes |  |
| vehicle_avg_cost_per_km |  | No |  |
| delta_vs_vehicle_avg |  | No |  |

## AttendanceBulkUpsert
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| date | string | Yes |  |
| records | Array<[AttendanceUpsert]> | Yes |  |

## AttendanceList
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| date | string | Yes |  |
| records | Array<[AttendanceRecordOut]> | Yes |  |

## AttendanceRangeList
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| from_date | string | Yes |  |
| to_date | string | Yes |  |
| records | Array<[AttendanceRangeRecordOut]> | Yes |  |

## AttendanceRangeRecordOut
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| employee_id | string | Yes |  |
| date | string | Yes |  |
| status | string | Yes |  |
| overtime_minutes |  | No |  |
| overtime_rate |  | No |  |
| late_minutes |  | No |  |
| late_deduction |  | No |  |
| leave_type |  | No |  |
| fine_amount |  | No |  |

## AttendanceRecordOut
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| employee_id | string | Yes |  |
| date | string | Yes |  |
| status | string | Yes |  |
| note |  | No |  |
| overtime_minutes |  | No |  |
| overtime_rate |  | No |  |
| late_minutes |  | No |  |
| late_deduction |  | No |  |
| leave_type |  | No |  |
| fine_amount |  | No |  |
| id | integer | Yes |  |
| created_at | string | Yes |  |
| updated_at |  | No |  |

## AttendanceSummary
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| total_days | integer | Yes |  |
| present_days | integer | Yes |  |
| absent_days | integer | Yes |  |
| leave_days | integer | Yes |  |
| late_days | integer | Yes |  |
| from_date | string | Yes |  |
| to_date | string | Yes |  |

## AttendanceUpsert
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| employee_id | string | Yes |  |
| status | string | Yes |  |
| note |  | No |  |
| overtime_minutes |  | No |  |
| overtime_rate |  | No |  |
| late_minutes |  | No |  |
| late_deduction |  | No |  |
| leave_type |  | No |  |
| fine_amount |  | No |  |

## Body_import_from_json_api_employees2_import_json_post
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| file | string | Yes |  |

## Body_login_api_auth_login_post
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| grant_type |  | No |  |
| username | string | Yes |  |
| password | string | Yes |  |
| scope | string | No |  |
| client_id |  | No |  |
| client_secret |  | No |  |

## Body_upload_client_document_api_client_management_clients__client_id__documents_upload_post
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| document_type | string | Yes |  |
| expiry_date |  | No |  |
| remarks |  | No |  |
| file | string | Yes |  |

## Body_upload_employee_document_api_employees_by_db_id__employee_db_id__documents_post
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| name | string | Yes |  |
| file | string | Yes |  |

## Body_upload_employee_file_api_employees2__employee_id__upload__field_type__post
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| file | string | Yes |  |

## Body_upload_file_api_upload_post
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| file | string | Yes |  |

## Body_upload_image_api_restricted_inventory_items__item_code__images_post
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| file | string | Yes |  |

## Body_upload_item_image_api_general_inventory_items__item_code__image_post
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| file | string | Yes |  |

## Body_upload_vehicle_document_api_vehicles__vehicle_id__documents_post
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| name | string | Yes |  |
| file | string | Yes |  |

## Body_upload_vehicle_image_api_vehicles__vehicle_id__images_post
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| file | string | Yes |  |

## Body_upload_warning_document_api_employees_warnings__warning_id__documents_post
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| file | string | Yes |  |

## ChangeConfigurationFieldSchema
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| index |  | Yes |  |
| form_widget_type | [WidgetType] | Yes |  |
| form_widget_props |  | Yes |  |
| required |  | Yes |  |

## ClientAddressCreate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| address_type | string | Yes |  |
| address_line1 | string | Yes |  |
| address_line2 |  | No |  |
| city |  | No |  |
| state |  | No |  |
| country |  | No |  |
| postal_code |  | No |  |

## ClientAddressOut
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| address_type | string | Yes |  |
| address_line1 | string | Yes |  |
| address_line2 |  | No |  |
| city |  | No |  |
| state |  | No |  |
| country |  | No |  |
| postal_code |  | No |  |
| id | integer | Yes |  |
| client_id | integer | Yes |  |
| created_at | string | Yes |  |
| updated_at |  | No |  |

## ClientAddressUpdate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| address_type |  | No |  |
| address_line1 |  | No |  |
| address_line2 |  | No |  |
| city |  | No |  |
| state |  | No |  |
| country |  | No |  |
| postal_code |  | No |  |

## ClientComparisonResponse
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| month1 | [MonthlyComparisonStat] | Yes |  |
| month2 | [MonthlyComparisonStat] | Yes |  |

## ClientContactCreate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| name | string | Yes |  |
| designation |  | No |  |
| phone_number |  | No |  |
| alternate_phone |  | No |  |
| email |  | No |  |
| preferred_contact_method |  | No |  |
| is_primary | boolean | No |  |

## ClientContactOut
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| name | string | Yes |  |
| designation |  | No |  |
| phone_number |  | No |  |
| alternate_phone |  | No |  |
| email |  | No |  |
| preferred_contact_method |  | No |  |
| is_primary | boolean | No |  |
| id | integer | Yes |  |
| client_id | integer | Yes |  |
| created_at | string | Yes |  |
| updated_at |  | No |  |

## ClientContactUpdate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| name |  | No |  |
| designation |  | No |  |
| phone_number |  | No |  |
| alternate_phone |  | No |  |
| email |  | No |  |
| preferred_contact_method |  | No |  |
| is_primary |  | No |  |

## ClientContractCreate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| contract_number | string | Yes |  |
| start_date |  | No |  |
| end_date |  | No |  |
| contract_type |  | No |  |
| billing_cycle |  | No |  |
| payment_terms |  | No |  |
| monthly_cost |  | No |  |
| penalty_overtime_rules |  | No |  |
| notes |  | No |  |
| status | string | No |  |

## ClientContractOut
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| contract_number | string | Yes |  |
| start_date |  | No |  |
| end_date |  | No |  |
| contract_type |  | No |  |
| billing_cycle |  | No |  |
| payment_terms |  | No |  |
| monthly_cost |  | No |  |
| penalty_overtime_rules |  | No |  |
| notes |  | No |  |
| status | string | No |  |
| id | integer | Yes |  |
| client_id | integer | Yes |  |
| created_at | string | Yes |  |
| updated_at |  | No |  |

## ClientContractRequirementOut
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| guard_type | string | Yes |  |
| number_of_guards | integer | No |  |
| shift_type |  | No |  |
| shift_start |  | No |  |
| shift_end |  | No |  |
| start_date |  | No |  |
| end_date |  | No |  |
| preferred_language |  | No |  |
| monthly_amount |  | No |  |
| weekly_off_rules |  | No |  |
| special_instructions |  | No |  |
| id | integer | Yes |  |
| site_id | integer | Yes |  |
| created_at | string | Yes |  |
| updated_at |  | No |  |
| site_name | string | Yes |  |
| site_status |  | No |  |

## ClientContractUpdate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| start_date |  | No |  |
| end_date |  | No |  |
| contract_type |  | No |  |
| billing_cycle |  | No |  |
| payment_terms |  | No |  |
| monthly_cost |  | No |  |
| penalty_overtime_rules |  | No |  |
| notes |  | No |  |
| status |  | No |  |

## ClientCreate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| client_code | string | Yes |  |
| client_name | string | Yes |  |
| client_type | string | Yes |  |
| industry_type |  | No |  |
| status | string | No |  |
| location |  | No |  |
| address |  | No |  |
| phone |  | No |  |
| email |  | No |  |
| registration_number |  | No |  |
| vat_gst_number |  | No |  |
| website |  | No |  |
| notes |  | No |  |

## ClientDetailOut
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| client_code | string | Yes |  |
| client_name | string | Yes |  |
| client_type | string | Yes |  |
| industry_type |  | No |  |
| status | string | No |  |
| location |  | No |  |
| address |  | No |  |
| phone |  | No |  |
| email |  | No |  |
| registration_number |  | No |  |
| vat_gst_number |  | No |  |
| website |  | No |  |
| notes |  | No |  |
| id | integer | Yes |  |
| created_at | string | Yes |  |
| updated_at |  | No |  |
| contacts | Array<[ClientContactOut]> | Yes |  |
| addresses | Array<[ClientAddressOut]> | Yes |  |
| sites | Array<[ClientSiteOut]> | Yes |  |
| contracts | Array<[ClientContractOut]> | Yes |  |
| rate_cards | Array<[ClientRateCardOut]> | Yes |  |
| invoices | Array<[ClientInvoiceOut]> | Yes |  |
| documents | Array<[ClientDocumentOut]> | Yes |  |

## ClientDocumentCreate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| document_type | string | Yes |  |
| file_url | string | Yes |  |
| expiry_date |  | No |  |
| remarks |  | No |  |

## ClientDocumentOut
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| document_type | string | Yes |  |
| file_url | string | Yes |  |
| expiry_date |  | No |  |
| remarks |  | No |  |
| id | integer | Yes |  |
| client_id | integer | Yes |  |
| created_at | string | Yes |  |
| updated_at |  | No |  |

## ClientDocumentUpdate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| document_type |  | No |  |
| file_url |  | No |  |
| expiry_date |  | No |  |
| remarks |  | No |  |

## ClientGuardRequirementCreate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| guard_type | string | Yes |  |
| number_of_guards | integer | No |  |
| shift_type |  | No |  |
| shift_start |  | No |  |
| shift_end |  | No |  |
| start_date |  | No |  |
| end_date |  | No |  |
| preferred_language |  | No |  |
| monthly_amount |  | No |  |
| weekly_off_rules |  | No |  |
| special_instructions |  | No |  |

## ClientGuardRequirementOut
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| guard_type | string | Yes |  |
| number_of_guards | integer | No |  |
| shift_type |  | No |  |
| shift_start |  | No |  |
| shift_end |  | No |  |
| start_date |  | No |  |
| end_date |  | No |  |
| preferred_language |  | No |  |
| monthly_amount |  | No |  |
| weekly_off_rules |  | No |  |
| special_instructions |  | No |  |
| id | integer | Yes |  |
| site_id | integer | Yes |  |
| created_at | string | Yes |  |
| updated_at |  | No |  |

## ClientGuardRequirementUpdate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| guard_type |  | No |  |
| number_of_guards |  | No |  |
| shift_type |  | No |  |
| shift_start |  | No |  |
| shift_end |  | No |  |
| start_date |  | No |  |
| end_date |  | No |  |
| preferred_language |  | No |  |
| monthly_amount |  | No |  |
| weekly_off_rules |  | No |  |
| special_instructions |  | No |  |

## ClientInvoiceCreate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| invoice_number | string | Yes |  |
| invoice_date |  | No |  |
| billing_period |  | No |  |
| total_amount | number | No |  |
| tax_amount |  | No |  |
| net_payable | number | No |  |
| payment_status | string | No |  |

## ClientInvoiceOut
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| invoice_number | string | Yes |  |
| invoice_date |  | No |  |
| billing_period |  | No |  |
| total_amount | number | No |  |
| tax_amount |  | No |  |
| net_payable | number | No |  |
| payment_status | string | No |  |
| id | integer | Yes |  |
| client_id | integer | Yes |  |
| created_at | string | Yes |  |
| updated_at |  | No |  |

## ClientInvoiceUpdate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| invoice_date |  | No |  |
| billing_period |  | No |  |
| total_amount |  | No |  |
| tax_amount |  | No |  |
| net_payable |  | No |  |
| payment_status |  | No |  |

## ClientOut
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| client_code | string | Yes |  |
| client_name | string | Yes |  |
| client_type | string | Yes |  |
| industry_type |  | No |  |
| status | string | No |  |
| location |  | No |  |
| address |  | No |  |
| phone |  | No |  |
| email |  | No |  |
| registration_number |  | No |  |
| vat_gst_number |  | No |  |
| website |  | No |  |
| notes |  | No |  |
| id | integer | Yes |  |
| created_at | string | Yes |  |
| updated_at |  | No |  |

## ClientRateCardCreate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| guard_type | string | Yes |  |
| rate_per_shift_day_month | number | Yes |  |
| overtime_rate |  | No |  |
| holiday_rate |  | No |  |
| effective_from |  | No |  |
| effective_to |  | No |  |

## ClientRateCardOut
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| guard_type | string | Yes |  |
| rate_per_shift_day_month | number | Yes |  |
| overtime_rate |  | No |  |
| holiday_rate |  | No |  |
| effective_from |  | No |  |
| effective_to |  | No |  |
| id | integer | Yes |  |
| client_id | integer | Yes |  |
| created_at | string | Yes |  |
| updated_at |  | No |  |

## ClientRateCardUpdate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| guard_type |  | No |  |
| rate_per_shift_day_month |  | No |  |
| overtime_rate |  | No |  |
| holiday_rate |  | No |  |
| effective_from |  | No |  |
| effective_to |  | No |  |

## ClientSiteCreate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| site_name | string | Yes |  |
| site_type |  | No |  |
| site_address |  | No |  |
| city |  | No |  |
| latitude |  | No |  |
| longitude |  | No |  |
| risk_level | string | No |  |
| status | string | No |  |
| site_instructions |  | No |  |

## ClientSiteGuardAllocationCreate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| employee_db_id | integer | Yes |  |
| requirement_id |  | No |  |
| start_date |  | No |  |
| end_date |  | No |  |

## ClientSiteGuardAllocationOut
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| employee_db_id | integer | Yes |  |
| start_date |  | No |  |
| end_date |  | No |  |
| status | string | No |  |
| id | integer | Yes |  |
| site_id | integer | Yes |  |
| requirement_id |  | No |  |
| created_at | string | Yes |  |
| updated_at |  | No |  |

## ClientSiteOut
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| site_name | string | Yes |  |
| site_type |  | No |  |
| site_address |  | No |  |
| city |  | No |  |
| latitude |  | No |  |
| longitude |  | No |  |
| risk_level | string | No |  |
| status | string | No |  |
| site_instructions |  | No |  |
| id | integer | Yes |  |
| client_id | integer | Yes |  |
| created_at | string | Yes |  |
| updated_at |  | No |  |

## ClientSiteUpdate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| site_name |  | No |  |
| site_type |  | No |  |
| site_address |  | No |  |
| city |  | No |  |
| latitude |  | No |  |
| longitude |  | No |  |
| risk_level |  | No |  |
| status |  | No |  |
| site_instructions |  | No |  |

## ClientTotalsComparisonRow
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| client_id | integer | Yes |  |
| client_code | string | Yes |  |
| client_name | string | Yes |  |
| month1 | [MonthlyTotalsStat] | Yes |  |
| month2 | [MonthlyTotalsStat] | Yes |  |
| total_salary_diff | number | Yes |  |

## ClientUpdate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| client_name |  | No |  |
| client_type |  | No |  |
| industry_type |  | No |  |
| status |  | No |  |
| location |  | No |  |
| address |  | No |  |
| phone |  | No |  |
| email |  | No |  |
| registration_number |  | No |  |
| vat_gst_number |  | No |  |
| website |  | No |  |
| notes |  | No |  |

## ConfigurationSchema
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| site_name | string | Yes |  |
| site_sign_in_logo | string | Yes |  |
| site_header_logo | string | Yes |  |
| site_favicon | string | Yes |  |
| primary_color | string | Yes |  |
| username_field | string | Yes |  |
| date_format | string | Yes |  |
| datetime_format | string | Yes |  |
| disable_crop_image | boolean | Yes |  |
| models | Array<[ModelSchema]> | Yes |  |
| dashboard_widgets | Array<[DashboardWidgetSchema]> | Yes |  |

## DashboardWidgetSchema
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| key | string | Yes |  |
| title | string | Yes |  |
| dashboard_widget_type | [DashboardWidgetType] | Yes |  |
| x_field | string | Yes |  |
| y_field |  | No |  |
| series_field |  | No |  |
| x_field_filter_widget_type |  | No |  |
| x_field_filter_widget_props |  | No |  |
| x_field_periods |  | No |  |

## DashboardWidgetType

## Deductions
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| eobi |  | No |  |
| tax |  | No |  |
| advance |  | No |  |
| fine |  | No |  |

## EfficiencyAlertRow
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| level | string | Yes |  |
| title | string | Yes |  |
| detail | string | Yes |  |
| assignment_id | integer | Yes |  |
| assignment_date |  | No |  |
| vehicle_id | string | Yes |  |
| employee_id |  | No |  |
| distance_km | number | Yes |  |
| amount | number | Yes |  |
| cost_per_km | number | Yes |  |
| vehicle_avg_cost_per_km |  | No |  |
| employee_avg_cost_per_km |  | No |  |
| delta_vs_vehicle_avg |  | No |  |

## Employee
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| first_name | string | Yes |  |
| last_name | string | Yes |  |
| gender |  | No |  |
| date_of_birth |  | No |  |
| profile_photo |  | No |  |
| government_id |  | No |  |
| cnic |  | No |  |
| cnic_expiry_date |  | No |  |
| domicile |  | No |  |
| languages_spoken |  | No |  |
| languages_proficiency |  | No |  |
| height_cm |  | No |  |
| email |  | No |  |
| mobile_number |  | No |  |
| personal_phone_number |  | No |  |
| emergency_contact_name |  | No |  |
| emergency_contact_number |  | No |  |
| father_name |  | No |  |
| previous_employment |  | No |  |
| next_of_kin_name |  | No |  |
| next_of_kin_cnic |  | No |  |
| next_of_kin_mobile_number |  | No |  |
| permanent_address |  | No |  |
| temporary_address |  | No |  |
| permanent_village |  | No |  |
| permanent_post_office |  | No |  |
| permanent_thana |  | No |  |
| permanent_tehsil |  | No |  |
| permanent_district |  | No |  |
| present_village |  | No |  |
| present_post_office |  | No |  |
| present_thana |  | No |  |
| present_tehsil |  | No |  |
| present_district |  | No |  |
| city |  | No |  |
| state |  | No |  |
| postal_code |  | No |  |
| department |  | No |  |
| designation |  | No |  |
| enrolled_as |  | No |  |
| employment_type |  | No |  |
| shift_type |  | No |  |
| reporting_manager |  | No |  |
| base_location |  | No |  |
| interviewed_by |  | No |  |
| introduced_by |  | No |  |
| security_clearance |  | No |  |
| basic_security_training |  | No |  |
| fire_safety_training |  | No |  |
| first_aid_certification |  | No |  |
| agreement |  | No |  |
| police_clearance |  | No |  |
| fingerprint_check |  | No |  |
| background_screening |  | No |  |
| reference_verification |  | No |  |
| guard_card |  | No |  |
| guard_card_doc |  | No |  |
| police_clearance_doc |  | No |  |
| fingerprint_check_doc |  | No |  |
| background_screening_doc |  | No |  |
| reference_verification_doc |  | No |  |
| other_certificates |  | No |  |
| basic_salary |  | No |  |
| allowances |  | No |  |
| total_salary |  | No |  |
| bank_name |  | No |  |
| account_number |  | No |  |
| ifsc_code |  | No |  |
| account_type |  | No |  |
| tax_id |  | No |  |
| bank_accounts |  | No |  |
| system_access_rights |  | No |  |
| employment_status |  | No |  |
| last_site_assigned |  | No |  |
| remarks |  | No |  |
| retired_from |  | No |  |
| service_unit |  | No |  |
| service_rank |  | No |  |
| service_enrollment_date |  | No |  |
| service_reenrollment_date |  | No |  |
| medical_category |  | No |  |
| discharge_cause |  | No |  |
| blood_group |  | No |  |
| civil_education_type |  | No |  |
| civil_education_detail |  | No |  |
| sons_names |  | No |  |
| daughters_names |  | No |  |
| brothers_names |  | No |  |
| sisters_names |  | No |  |
| particulars_verified_by_sho_on |  | No |  |
| particulars_verified_by_ssp_on |  | No |  |
| police_khidmat_verification_on |  | No |  |
| verified_by_khidmat_markaz |  | No |  |
| signature_recording_officer |  | No |  |
| signature_individual |  | No |  |
| fss_number |  | No |  |
| fss_name |  | No |  |
| fss_so |  | No |  |
| original_doc_held |  | No |  |
| documents_handed_over_to |  | No |  |
| photo_on_document |  | No |  |
| eobi_no |  | No |  |
| insurance |  | No |  |
| social_security |  | No |  |
| home_contact_no |  | No |  |
| police_training_letter_date |  | No |  |
| vaccination_certificate |  | No |  |
| volume_no |  | No |  |
| payments |  | No |  |
| fingerprint_attested_by |  | No |  |
| date_of_entry |  | No |  |
| card_number |  | No |  |
| id | integer | Yes |  |
| employee_id | string | Yes |  |
| warning_count |  | No |  |
| created_at | string | Yes |  |
| updated_at |  | No |  |

## Employee2
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| serial_no |  | No |  |
| fss_no |  | No |  |
| rank |  | No |  |
| name | string | Yes |  |
| father_name |  | No |  |
| salary |  | No |  |
| status |  | No |  |
| unit |  | No |  |
| service_rank |  | No |  |
| blood_group |  | No |  |
| status2 |  | No |  |
| unit2 |  | No |  |
| rank2 |  | No |  |
| cnic |  | No |  |
| dob |  | No |  |
| cnic_expiry |  | No |  |
| documents_held |  | No |  |
| documents_handed_over_to |  | No |  |
| photo_on_doc |  | No |  |
| eobi_no |  | No |  |
| insurance |  | No |  |
| social_security |  | No |  |
| mobile_no |  | No |  |
| home_contact |  | No |  |
| verified_by_sho |  | No |  |
| verified_by_khidmat_markaz |  | No |  |
| domicile |  | No |  |
| verified_by_ssp |  | No |  |
| enrolled |  | No |  |
| re_enrolled |  | No |  |
| village |  | No |  |
| post_office |  | No |  |
| thana |  | No |  |
| tehsil |  | No |  |
| district |  | No |  |
| duty_location |  | No |  |
| address_details |  | No |  |
| temp_village |  | No |  |
| temp_post_office |  | No |  |
| temp_thana |  | No |  |
| temp_tehsil |  | No |  |
| temp_district |  | No |  |
| temp_city |  | No |  |
| temp_phone |  | No |  |
| temp_address_details |  | No |  |
| police_trg_ltr_date |  | No |  |
| vaccination_cert |  | No |  |
| vol_no |  | No |  |
| payments |  | No |  |
| category |  | No |  |
| designation |  | No |  |
| allocation_status |  | No |  |
| avatar_url |  | No |  |
| cnic_attachment |  | No |  |
| domicile_attachment |  | No |  |
| sho_verified_attachment |  | No |  |
| ssp_verified_attachment |  | No |  |
| khidmat_verified_attachment |  | No |  |
| police_trg_attachment |  | No |  |
| photo_on_doc_attachment |  | No |  |
| personal_signature_attachment |  | No |  |
| fingerprint_thumb_attachment |  | No |  |
| fingerprint_index_attachment |  | No |  |
| fingerprint_middle_attachment |  | No |  |
| fingerprint_ring_attachment |  | No |  |
| fingerprint_pinky_attachment |  | No |  |
| employment_agreement_attachment |  | No |  |
| served_in_attachment |  | No |  |
| vaccination_attachment |  | No |  |
| recording_officer_signature_attachment |  | No |  |
| experience_security_attachment |  | No |  |
| education_attachment |  | No |  |
| nok_cnic_attachment |  | No |  |
| other_documents_attachment |  | No |  |
| bank_accounts |  | No |  |
| height |  | No |  |
| education |  | No |  |
| medical_category |  | No |  |
| medical_details |  | No |  |
| medical_discharge_cause |  | No |  |
| nok_name |  | No |  |
| nok_relationship |  | No |  |
| sons_count |  | No |  |
| daughters_count |  | No |  |
| brothers_count |  | No |  |
| sisters_count |  | No |  |
| interviewed_by |  | No |  |
| introduced_by |  | No |  |
| enrolled_as |  | No |  |
| served_in |  | No |  |
| experience_security |  | No |  |
| deployment_details |  | No |  |
| head_office |  | No |  |
| dod |  | No |  |
| discharge_cause |  | No |  |
| orig_docs_received |  | No |  |
| id | integer | Yes |  |
| created_at |  | No |  |
| updated_at |  | No |  |

## Employee2Create
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| serial_no |  | No |  |
| fss_no |  | No |  |
| rank |  | No |  |
| name | string | Yes |  |
| father_name |  | No |  |
| salary |  | No |  |
| status |  | No |  |
| unit |  | No |  |
| service_rank |  | No |  |
| blood_group |  | No |  |
| status2 |  | No |  |
| unit2 |  | No |  |
| rank2 |  | No |  |
| cnic |  | No |  |
| dob |  | No |  |
| cnic_expiry |  | No |  |
| documents_held |  | No |  |
| documents_handed_over_to |  | No |  |
| photo_on_doc |  | No |  |
| eobi_no |  | No |  |
| insurance |  | No |  |
| social_security |  | No |  |
| mobile_no |  | No |  |
| home_contact |  | No |  |
| verified_by_sho |  | No |  |
| verified_by_khidmat_markaz |  | No |  |
| domicile |  | No |  |
| verified_by_ssp |  | No |  |
| enrolled |  | No |  |
| re_enrolled |  | No |  |
| village |  | No |  |
| post_office |  | No |  |
| thana |  | No |  |
| tehsil |  | No |  |
| district |  | No |  |
| duty_location |  | No |  |
| address_details |  | No |  |
| temp_village |  | No |  |
| temp_post_office |  | No |  |
| temp_thana |  | No |  |
| temp_tehsil |  | No |  |
| temp_district |  | No |  |
| temp_city |  | No |  |
| temp_phone |  | No |  |
| temp_address_details |  | No |  |
| police_trg_ltr_date |  | No |  |
| vaccination_cert |  | No |  |
| vol_no |  | No |  |
| payments |  | No |  |
| category |  | No |  |
| designation |  | No |  |
| allocation_status |  | No |  |
| avatar_url |  | No |  |
| cnic_attachment |  | No |  |
| domicile_attachment |  | No |  |
| sho_verified_attachment |  | No |  |
| ssp_verified_attachment |  | No |  |
| khidmat_verified_attachment |  | No |  |
| police_trg_attachment |  | No |  |
| photo_on_doc_attachment |  | No |  |
| personal_signature_attachment |  | No |  |
| fingerprint_thumb_attachment |  | No |  |
| fingerprint_index_attachment |  | No |  |
| fingerprint_middle_attachment |  | No |  |
| fingerprint_ring_attachment |  | No |  |
| fingerprint_pinky_attachment |  | No |  |
| employment_agreement_attachment |  | No |  |
| served_in_attachment |  | No |  |
| vaccination_attachment |  | No |  |
| recording_officer_signature_attachment |  | No |  |
| experience_security_attachment |  | No |  |
| education_attachment |  | No |  |
| nok_cnic_attachment |  | No |  |
| other_documents_attachment |  | No |  |
| bank_accounts |  | No |  |
| height |  | No |  |
| education |  | No |  |
| medical_category |  | No |  |
| medical_details |  | No |  |
| medical_discharge_cause |  | No |  |
| nok_name |  | No |  |
| nok_relationship |  | No |  |
| sons_count |  | No |  |
| daughters_count |  | No |  |
| brothers_count |  | No |  |
| sisters_count |  | No |  |
| interviewed_by |  | No |  |
| introduced_by |  | No |  |
| enrolled_as |  | No |  |
| served_in |  | No |  |
| experience_security |  | No |  |
| deployment_details |  | No |  |
| head_office |  | No |  |
| dod |  | No |  |
| discharge_cause |  | No |  |
| orig_docs_received |  | No |  |

## Employee2List
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| employees | Array<[Employee2ListItem]> | Yes |  |
| total | integer | Yes |  |

## Employee2ListItem
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| id | integer | Yes |  |
| serial_no |  | No |  |
| fss_no |  | No |  |
| rank |  | No |  |
| name | string | Yes |  |
| mobile_no |  | No |  |
| unit |  | No |  |
| category |  | No |  |
| designation |  | No |  |
| status |  | No |  |
| allocation_status |  | No |  |
| avatar_url |  | No |  |

## Employee2Update
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| serial_no |  | No |  |
| fss_no |  | No |  |
| rank |  | No |  |
| name |  | No |  |
| father_name |  | No |  |
| salary |  | No |  |
| status |  | No |  |
| unit |  | No |  |
| service_rank |  | No |  |
| blood_group |  | No |  |
| status2 |  | No |  |
| unit2 |  | No |  |
| rank2 |  | No |  |
| cnic |  | No |  |
| dob |  | No |  |
| cnic_expiry |  | No |  |
| documents_held |  | No |  |
| documents_handed_over_to |  | No |  |
| photo_on_doc |  | No |  |
| eobi_no |  | No |  |
| insurance |  | No |  |
| social_security |  | No |  |
| mobile_no |  | No |  |
| home_contact |  | No |  |
| verified_by_sho |  | No |  |
| verified_by_khidmat_markaz |  | No |  |
| domicile |  | No |  |
| verified_by_ssp |  | No |  |
| enrolled |  | No |  |
| re_enrolled |  | No |  |
| village |  | No |  |
| post_office |  | No |  |
| thana |  | No |  |
| tehsil |  | No |  |
| district |  | No |  |
| duty_location |  | No |  |
| address_details |  | No |  |
| temp_village |  | No |  |
| temp_post_office |  | No |  |
| temp_thana |  | No |  |
| temp_tehsil |  | No |  |
| temp_district |  | No |  |
| temp_city |  | No |  |
| temp_phone |  | No |  |
| temp_address_details |  | No |  |
| police_trg_ltr_date |  | No |  |
| vaccination_cert |  | No |  |
| vol_no |  | No |  |
| payments |  | No |  |
| category |  | No |  |
| designation |  | No |  |
| allocation_status |  | No |  |
| avatar_url |  | No |  |
| cnic_attachment |  | No |  |
| domicile_attachment |  | No |  |
| sho_verified_attachment |  | No |  |
| ssp_verified_attachment |  | No |  |
| khidmat_verified_attachment |  | No |  |
| police_trg_attachment |  | No |  |
| photo_on_doc_attachment |  | No |  |
| personal_signature_attachment |  | No |  |
| fingerprint_thumb_attachment |  | No |  |
| fingerprint_index_attachment |  | No |  |
| fingerprint_middle_attachment |  | No |  |
| fingerprint_ring_attachment |  | No |  |
| fingerprint_pinky_attachment |  | No |  |
| employment_agreement_attachment |  | No |  |
| served_in_attachment |  | No |  |
| vaccination_attachment |  | No |  |
| recording_officer_signature_attachment |  | No |  |
| experience_security_attachment |  | No |  |
| education_attachment |  | No |  |
| nok_cnic_attachment |  | No |  |
| other_documents_attachment |  | No |  |
| bank_accounts |  | No |  |
| height |  | No |  |
| education |  | No |  |
| medical_category |  | No |  |
| medical_details |  | No |  |
| medical_discharge_cause |  | No |  |
| nok_name |  | No |  |
| nok_relationship |  | No |  |
| sons_count |  | No |  |
| daughters_count |  | No |  |
| brothers_count |  | No |  |
| sisters_count |  | No |  |
| interviewed_by |  | No |  |
| introduced_by |  | No |  |
| enrolled_as |  | No |  |
| served_in |  | No |  |
| experience_security |  | No |  |
| deployment_details |  | No |  |
| head_office |  | No |  |
| dod |  | No |  |
| discharge_cause |  | No |  |
| orig_docs_received |  | No |  |

## EmployeeAdvanceCreate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| employee_db_id | integer | Yes |  |
| amount | number | Yes |  |
| note |  | No |  |
| advance_date | string | Yes |  |

## EmployeeAdvanceDeductionOut
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| id | integer | Yes |  |
| employee_db_id | integer | Yes |  |
| month | string | Yes |  |
| amount | number | Yes |  |
| note |  | No |  |
| created_at | string | Yes |  |

## EmployeeAdvanceDeductionUpsert
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| employee_db_id | integer | Yes |  |
| month | string | Yes |  |
| amount | number | Yes |  |
| note |  | No |  |

## EmployeeAdvanceMonthRow
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| id | integer | Yes |  |
| employee_db_id | integer | Yes |  |
| employee_id | string | Yes |  |
| employee_name | string | Yes |  |
| amount | number | Yes |  |
| note |  | No |  |
| advance_date | string | Yes |  |
| created_at | string | Yes |  |

## EmployeeAdvanceOut
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| id | integer | Yes |  |
| employee_db_id | integer | Yes |  |
| amount | number | Yes |  |
| note |  | No |  |
| advance_date | string | Yes |  |
| created_at | string | Yes |  |

## EmployeeAdvanceSummary
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| employee_db_id | integer | Yes |  |
| total_advanced | number | Yes |  |
| total_deducted | number | Yes |  |
| balance | number | Yes |  |
| total_paid_so_far | number | Yes |  |

## EmployeeAdvancesMonthSummary
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| month | string | Yes |  |
| total_advanced | number | Yes |  |
| by_employee_db_id | object | Yes |  |

## EmployeeBankAccount
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| bank_name |  | No |  |
| account_number |  | No |  |
| ifsc_code |  | No |  |
| account_type |  | No |  |
| tax_id |  | No |  |

## EmployeeCreate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| first_name | string | Yes |  |
| last_name | string | Yes |  |
| gender |  | No |  |
| date_of_birth |  | No |  |
| profile_photo |  | No |  |
| government_id |  | No |  |
| cnic |  | No |  |
| cnic_expiry_date |  | No |  |
| domicile |  | No |  |
| languages_spoken |  | No |  |
| languages_proficiency |  | No |  |
| height_cm |  | No |  |
| email |  | No |  |
| mobile_number |  | No |  |
| personal_phone_number |  | No |  |
| emergency_contact_name |  | No |  |
| emergency_contact_number |  | No |  |
| father_name |  | No |  |
| previous_employment |  | No |  |
| next_of_kin_name |  | No |  |
| next_of_kin_cnic |  | No |  |
| next_of_kin_mobile_number |  | No |  |
| permanent_address |  | No |  |
| temporary_address |  | No |  |
| permanent_village |  | No |  |
| permanent_post_office |  | No |  |
| permanent_thana |  | No |  |
| permanent_tehsil |  | No |  |
| permanent_district |  | No |  |
| present_village |  | No |  |
| present_post_office |  | No |  |
| present_thana |  | No |  |
| present_tehsil |  | No |  |
| present_district |  | No |  |
| city |  | No |  |
| state |  | No |  |
| postal_code |  | No |  |
| department |  | No |  |
| designation |  | No |  |
| enrolled_as |  | No |  |
| employment_type |  | No |  |
| shift_type |  | No |  |
| reporting_manager |  | No |  |
| base_location |  | No |  |
| interviewed_by |  | No |  |
| introduced_by |  | No |  |
| security_clearance |  | No |  |
| basic_security_training |  | No |  |
| fire_safety_training |  | No |  |
| first_aid_certification |  | No |  |
| agreement |  | No |  |
| police_clearance |  | No |  |
| fingerprint_check |  | No |  |
| background_screening |  | No |  |
| reference_verification |  | No |  |
| guard_card |  | No |  |
| guard_card_doc |  | No |  |
| police_clearance_doc |  | No |  |
| fingerprint_check_doc |  | No |  |
| background_screening_doc |  | No |  |
| reference_verification_doc |  | No |  |
| other_certificates |  | No |  |
| basic_salary |  | No |  |
| allowances |  | No |  |
| total_salary |  | No |  |
| bank_name |  | No |  |
| account_number |  | No |  |
| ifsc_code |  | No |  |
| account_type |  | No |  |
| tax_id |  | No |  |
| bank_accounts |  | No |  |
| system_access_rights |  | No |  |
| employment_status |  | No |  |
| last_site_assigned |  | No |  |
| remarks |  | No |  |
| retired_from |  | No |  |
| service_unit |  | No |  |
| service_rank |  | No |  |
| service_enrollment_date |  | No |  |
| service_reenrollment_date |  | No |  |
| medical_category |  | No |  |
| discharge_cause |  | No |  |
| blood_group |  | No |  |
| civil_education_type |  | No |  |
| civil_education_detail |  | No |  |
| sons_names |  | No |  |
| daughters_names |  | No |  |
| brothers_names |  | No |  |
| sisters_names |  | No |  |
| particulars_verified_by_sho_on |  | No |  |
| particulars_verified_by_ssp_on |  | No |  |
| police_khidmat_verification_on |  | No |  |
| verified_by_khidmat_markaz |  | No |  |
| signature_recording_officer |  | No |  |
| signature_individual |  | No |  |
| fss_number |  | No |  |
| fss_name |  | No |  |
| fss_so |  | No |  |
| original_doc_held |  | No |  |
| documents_handed_over_to |  | No |  |
| photo_on_document |  | No |  |
| eobi_no |  | No |  |
| insurance |  | No |  |
| social_security |  | No |  |
| home_contact_no |  | No |  |
| police_training_letter_date |  | No |  |
| vaccination_certificate |  | No |  |
| volume_no |  | No |  |
| payments |  | No |  |
| fingerprint_attested_by |  | No |  |
| date_of_entry |  | No |  |
| card_number |  | No |  |

## EmployeeDocumentOut
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| id | integer | Yes |  |
| employee_db_id | integer | Yes |  |
| name | string | Yes |  |
| filename | string | Yes |  |
| url | string | Yes |  |
| mime_type | string | Yes |  |
| created_at | string | Yes |  |
| updated_at |  | No |  |

## EmployeeEfficiencySummaryRow
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| employee_id | string | Yes |  |
| assignments | integer | Yes |  |
| total_km | number | Yes |  |
| total_amount | number | Yes |  |
| avg_cost_per_km |  | No |  |
| expensive_assignments | integer | Yes |  |

## EmployeeGeneralIssuedInventory
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| employee_id | string | Yes |  |
| items | Array<[EmployeeGeneralIssuedQuantity]> | Yes |  |

## EmployeeGeneralIssuedQuantity
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| item_code | string | Yes |  |
| item_name | string | Yes |  |
| category | string | Yes |  |
| unit_name | string | Yes |  |
| quantity_issued | number | Yes |  |

## EmployeeInactive
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| fss_no |  | No |  |
| name | string | Yes |  |
| father_name |  | No |  |
| status |  | No |  |
| cnic |  | No |  |
| eobi_no |  | No |  |
| mobile_no |  | No |  |
| district |  | No |  |
| doe |  | No |  |
| dod |  | No |  |
| cause_of_discharge |  | No |  |
| police_verification |  | No |  |
| notice_fine |  | No |  |
| uniform_fine |  | No |  |
| police_trg |  | No |  |
| clo_fine |  | No |  |
| vol_no |  | No |  |
| serial_no |  | No |  |
| rank |  | No |  |
| salary |  | No |  |
| unit |  | No |  |
| service_rank |  | No |  |
| blood_group |  | No |  |
| status2 |  | No |  |
| unit2 |  | No |  |
| rank2 |  | No |  |
| dob |  | No |  |
| cnic_expiry |  | No |  |
| documents_held |  | No |  |
| documents_handed_over_to |  | No |  |
| photo_on_doc |  | No |  |
| home_contact |  | No |  |
| verified_by_sho |  | No |  |
| verified_by_khidmat_markaz |  | No |  |
| domicile |  | No |  |
| verified_by_ssp |  | No |  |
| enrolled |  | No |  |
| re_enrolled |  | No |  |
| village |  | No |  |
| post_office |  | No |  |
| thana |  | No |  |
| tehsil |  | No |  |
| duty_location |  | No |  |
| police_trg_ltr_date |  | No |  |
| vaccination_cert |  | No |  |
| payments |  | No |  |
| category |  | No |  |
| designation |  | No |  |
| allocation_status |  | No |  |
| bank_accounts |  | No |  |
| height |  | No |  |
| education |  | No |  |
| medical_category |  | No |  |
| medical_discharge_cause |  | No |  |
| nok_name |  | No |  |
| nok_relationship |  | No |  |
| sons_count |  | No |  |
| daughters_count |  | No |  |
| brothers_count |  | No |  |
| sisters_count |  | No |  |
| interviewed_by |  | No |  |
| introduced_by |  | No |  |
| enrolled_as |  | No |  |
| served_in |  | No |  |
| experience_security |  | No |  |
| deployment_details |  | No |  |
| discharge_cause |  | No |  |
| orig_docs_received |  | No |  |
| avatar_url |  | No |  |
| cnic_attachment |  | No |  |
| domicile_attachment |  | No |  |
| sho_verified_attachment |  | No |  |
| ssp_verified_attachment |  | No |  |
| khidmat_verified_attachment |  | No |  |
| police_trg_attachment |  | No |  |
| photo_on_doc_attachment |  | No |  |
| served_in_attachment |  | No |  |
| vaccination_attachment |  | No |  |
| id | integer | Yes |  |
| created_at | string | Yes |  |
| updated_at |  | No |  |

## EmployeeInactiveList
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| employees | Array<[EmployeeInactive]> | Yes |  |
| total | integer | Yes |  |

## EmployeeIssuedInventory
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| employee_id | string | Yes |  |
| serial_items | Array<[EmployeeIssuedSerial]> | Yes |  |
| quantity_items | Array<[EmployeeIssuedQuantity]> | Yes |  |

## EmployeeIssuedQuantity
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| item_code | string | Yes |  |
| item_name | string | Yes |  |
| category | string | Yes |  |
| unit_name | string | Yes |  |
| quantity_issued | number | Yes |  |

## EmployeeIssuedSerial
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| serial_unit_id | integer | Yes |  |
| item_code | string | Yes |  |
| item_name | string | Yes |  |
| category | string | Yes |  |
| serial_number | string | Yes |  |
| status | string | Yes |  |
| created_at | string | Yes |  |

## EmployeeLanguageProficiency
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| language | string | Yes |  |
| level | string | Yes |  |

## EmployeeList
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| employees | Array<[Employee]> | Yes |  |
| total | integer | Yes |  |

## EmployeeUpdate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| first_name |  | No |  |
| last_name |  | No |  |
| gender |  | No |  |
| date_of_birth |  | No |  |
| profile_photo |  | No |  |
| government_id |  | No |  |
| cnic |  | No |  |
| cnic_expiry_date |  | No |  |
| domicile |  | No |  |
| languages_spoken |  | No |  |
| height_cm |  | No |  |
| email |  | No |  |
| mobile_number |  | No |  |
| personal_phone_number |  | No |  |
| emergency_contact_name |  | No |  |
| emergency_contact_number |  | No |  |
| father_name |  | No |  |
| previous_employment |  | No |  |
| next_of_kin_name |  | No |  |
| next_of_kin_cnic |  | No |  |
| next_of_kin_mobile_number |  | No |  |
| address_line1 |  | No |  |
| address_line2 |  | No |  |
| permanent_address |  | No |  |
| temporary_address |  | No |  |
| permanent_village |  | No |  |
| permanent_post_office |  | No |  |
| permanent_thana |  | No |  |
| permanent_tehsil |  | No |  |
| permanent_district |  | No |  |
| present_village |  | No |  |
| present_post_office |  | No |  |
| present_thana |  | No |  |
| present_tehsil |  | No |  |
| present_district |  | No |  |
| city |  | No |  |
| state |  | No |  |
| postal_code |  | No |  |
| department |  | No |  |
| designation |  | No |  |
| enrolled_as |  | No |  |
| employment_type |  | No |  |
| shift_type |  | No |  |
| reporting_manager |  | No |  |
| base_location |  | No |  |
| interviewed_by |  | No |  |
| introduced_by |  | No |  |
| security_clearance |  | No |  |
| basic_security_training |  | No |  |
| fire_safety_training |  | No |  |
| first_aid_certification |  | No |  |
| agreement |  | No |  |
| police_clearance |  | No |  |
| fingerprint_check |  | No |  |
| background_screening |  | No |  |
| reference_verification |  | No |  |
| guard_card |  | No |  |
| guard_card_doc |  | No |  |
| police_clearance_doc |  | No |  |
| fingerprint_check_doc |  | No |  |
| background_screening_doc |  | No |  |
| reference_verification_doc |  | No |  |
| other_certificates |  | No |  |
| basic_salary |  | No |  |
| allowances |  | No |  |
| total_salary |  | No |  |
| bank_name |  | No |  |
| account_number |  | No |  |
| ifsc_code |  | No |  |
| account_type |  | No |  |
| tax_id |  | No |  |
| bank_accounts |  | No |  |
| system_access_rights |  | No |  |
| employment_status |  | No |  |
| last_site_assigned |  | No |  |
| remarks |  | No |  |
| retired_from |  | No |  |
| service_unit |  | No |  |
| service_rank |  | No |  |
| service_enrollment_date |  | No |  |
| service_reenrollment_date |  | No |  |
| medical_category |  | No |  |
| discharge_cause |  | No |  |
| blood_group |  | No |  |
| civil_education_type |  | No |  |
| civil_education_detail |  | No |  |
| sons_names |  | No |  |
| daughters_names |  | No |  |
| brothers_names |  | No |  |
| sisters_names |  | No |  |
| particulars_verified_by_sho_on |  | No |  |
| particulars_verified_by_ssp_on |  | No |  |
| police_khidmat_verification_on |  | No |  |
| verified_by_khidmat_markaz |  | No |  |
| signature_recording_officer |  | No |  |
| signature_individual |  | No |  |
| fss_number |  | No |  |
| fss_name |  | No |  |
| fss_so |  | No |  |
| original_doc_held |  | No |  |
| documents_handed_over_to |  | No |  |
| photo_on_document |  | No |  |
| eobi_no |  | No |  |
| insurance |  | No |  |
| social_security |  | No |  |
| home_contact_no |  | No |  |
| police_training_letter_date |  | No |  |
| vaccination_certificate |  | No |  |
| volume_no |  | No |  |
| payments |  | No |  |
| fingerprint_attested_by |  | No |  |
| date_of_entry |  | No |  |
| card_number |  | No |  |

## EmployeeWarningCreate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| warning_number | string | Yes |  |
| found_with |  | No |  |
| notice_text |  | No |  |
| supervisor_signature |  | No |  |
| supervisor_signature_date |  | No |  |

## EmployeeWarningDocumentOut
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| id | integer | Yes |  |
| warning_id | integer | Yes |  |
| filename | string | Yes |  |
| url | string | Yes |  |
| mime_type | string | Yes |  |
| created_at | string | Yes |  |
| updated_at |  | No |  |

## EmployeeWarningOut
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| id | integer | Yes |  |
| employee_db_id | integer | Yes |  |
| warning_number | string | Yes |  |
| found_with |  | No |  |
| notice_text |  | No |  |
| supervisor_signature |  | No |  |
| supervisor_signature_date |  | No |  |
| created_at | string | Yes |  |
| updated_at |  | No |  |

## Expense
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| expense_date | string | Yes |  |
| category | string | Yes |  |
| description | string | Yes |  |
| amount | string | Yes |  |
| vendor_name |  | No |  |
| receipt_number |  | No |  |
| notes |  | No |  |
| attachment_url |  | No |  |
| employee_id |  | No |  |
| id | integer | Yes |  |
| status | string | Yes |  |
| account_id |  | No |  |
| journal_entry_id |  | No |  |
| is_active | boolean | Yes |  |
| created_at | string | Yes |  |
| updated_at |  | No |  |
| approved_at |  | No |  |
| paid_at |  | No |  |

## ExpenseCreate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| expense_date | string | Yes |  |
| category | string | Yes |  |
| description | string | Yes |  |
| amount |  | Yes |  |
| vendor_name |  | No |  |
| receipt_number |  | No |  |
| notes |  | No |  |
| attachment_url |  | No |  |
| employee_id |  | No |  |

## ExpenseSummary
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| total_expenses | string | Yes |  |
| pending_expenses | string | Yes |  |
| approved_expenses | string | Yes |  |
| paid_expenses | string | Yes |  |
| expense_count | integer | Yes |  |
| categories | object | Yes |  |

## ExpenseUpdate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| expense_date |  | No |  |
| category |  | No |  |
| description |  | No |  |
| amount |  | No |  |
| vendor_name |  | No |  |
| receipt_number |  | No |  |
| notes |  | No |  |
| attachment_url |  | No |  |
| employee_id |  | No |  |
| status |  | No |  |

## ExportFormat

## ExportInputSchema
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| format |  | No |  |
| limit |  | No |  |
| offset |  | No |  |

## FinanceAccount
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| code | string | Yes |  |
| name | string | Yes |  |
| account_type | string | Yes |  |
| parent_id |  | No |  |
| is_system | boolean | No |  |
| is_active | boolean | No |  |
| id | integer | Yes |  |
| created_at | string | Yes |  |
| updated_at |  | No |  |

## FinanceAccountCreate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| code | string | Yes |  |
| name | string | Yes |  |
| account_type | string | Yes |  |
| parent_id |  | No |  |
| is_system | boolean | No |  |
| is_active | boolean | No |  |

## FinanceAccountUpdate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| name |  | No |  |
| account_type |  | No |  |
| parent_id |  | No |  |
| is_active |  | No |  |

## FinanceJournalEntry
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| entry_date | string | Yes |  |
| memo |  | No |  |
| source_type |  | No |  |
| source_id |  | No |  |
| id | integer | Yes |  |
| entry_no | string | Yes |  |
| status | string | Yes |  |
| created_at | string | Yes |  |
| posted_at |  | No |  |
| lines | Array<[FinanceJournalLine]> | No |  |

## FinanceJournalEntryCreate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| entry_date | string | Yes |  |
| memo |  | No |  |
| source_type |  | No |  |
| source_id |  | No |  |
| lines | Array<[FinanceJournalLineCreate]> | No |  |

## FinanceJournalEntryUpdate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| entry_date |  | No |  |
| memo |  | No |  |

## FinanceJournalLine
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| account_id | integer | Yes |  |
| description |  | No |  |
| debit | string | No |  |
| credit | string | No |  |
| employee_id |  | No |  |
| id | integer | Yes |  |
| created_at | string | Yes |  |

## FinanceJournalLineCreate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| account_id | integer | Yes |  |
| description |  | No |  |
| debit |  | No |  |
| credit |  | No |  |
| employee_id |  | No |  |

## FuelEntryCreate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| vehicle_id | string | Yes |  |
| entry_date | string | Yes |  |
| fuel_type |  | No |  |
| liters | number | Yes |  |
| price_per_liter |  | No |  |
| total_cost |  | No |  |
| odometer_km |  | No |  |
| vendor |  | No |  |
| location |  | No |  |
| notes |  | No |  |

## FuelEntryResponse
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| vehicle_id | string | Yes |  |
| entry_date | string | Yes |  |
| fuel_type |  | No |  |
| liters | number | Yes |  |
| price_per_liter |  | No |  |
| total_cost |  | No |  |
| odometer_km |  | No |  |
| vendor |  | No |  |
| location |  | No |  |
| notes |  | No |  |
| id | integer | Yes |  |
| created_at | string | Yes |  |
| updated_at |  | No |  |

## FuelEntryUpdate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| vehicle_id |  | No |  |
| entry_date |  | No |  |
| fuel_type |  | No |  |
| liters |  | No |  |
| price_per_liter |  | No |  |
| total_cost |  | No |  |
| odometer_km |  | No |  |
| vendor |  | No |  |
| location |  | No |  |
| notes |  | No |  |

## FuelMileageSummary
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| vehicle_id |  | No |  |
| from_date |  | No |  |
| to_date |  | No |  |
| entries | integer | Yes |  |
| total_liters | number | Yes |  |
| total_cost | number | Yes |  |
| start_odometer_km |  | No |  |
| end_odometer_km |  | No |  |
| distance_km |  | No |  |
| avg_km_per_liter |  | No |  |
| avg_cost_per_km |  | No |  |
| tips | Array<[FuelMileageTip]> | Yes |  |

## FuelMileageTip
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| level | string | Yes |  |
| title | string | Yes |  |
| detail | string | Yes |  |

## GeneralItemCreate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| item_code | string | Yes |  |
| category | string | Yes |  |
| name | string | Yes |  |
| description |  | No |  |
| image_url |  | No |  |
| unit_name | string | No |  |
| quantity_on_hand | number | No |  |
| min_quantity |  | No |  |
| storage_location |  | No |  |
| status | string | No |  |

## GeneralItemOut
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| item_code | string | Yes |  |
| category | string | Yes |  |
| name | string | Yes |  |
| description |  | No |  |
| image_url |  | No |  |
| unit_name | string | No |  |
| quantity_on_hand | number | No |  |
| min_quantity |  | No |  |
| storage_location |  | No |  |
| status | string | No |  |
| id | integer | Yes |  |
| created_at | string | Yes |  |
| updated_at |  | No |  |

## GeneralItemUpdate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| category |  | No |  |
| name |  | No |  |
| description |  | No |  |
| unit_name |  | No |  |
| quantity_on_hand |  | No |  |
| min_quantity |  | No |  |
| storage_location |  | No |  |
| status |  | No |  |

## GeneralTransactionOut
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| id | integer | Yes |  |
| item_code | string | Yes |  |
| employee_id |  | No |  |
| action | string | Yes |  |
| quantity |  | No |  |
| condition_note |  | No |  |
| notes |  | No |  |
| created_at | string | Yes |  |

## HTTPValidationError
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| detail | Array<[ValidationError]> | No |  |

## InlineModelSchema
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| name | string | Yes |  |
| permissions | Array<[ModelPermission]> | Yes |  |
| actions | Array<[ModelAction]> | Yes |  |
| actions_on_top |  | Yes |  |
| actions_on_bottom |  | Yes |  |
| actions_selection_counter |  | Yes |  |
| fields | Array<[ModelFieldSchema]> | Yes |  |
| list_per_page |  | Yes |  |
| search_help_text |  | Yes |  |
| search_fields |  | Yes |  |
| preserve_filters |  | Yes |  |
| list_max_show_all |  | Yes |  |
| show_full_result_count |  | Yes |  |
| verbose_name |  | Yes |  |
| verbose_name_plural |  | Yes |  |
| fk_name | string | Yes |  |
| max_num |  | Yes |  |
| min_num |  | Yes |  |

## InventoryAssignmentEntry
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| itemId | string | Yes |  |
| quantity | integer | Yes |  |

## InventoryAssignmentsState
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| data | object | Yes |  |

## InventoryItem
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| item_name | string | Yes |  |
| assigned_date | string | Yes |  |
| condition | string | Yes |  |
| value |  | No |  |

## LeavePeriodAlert
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| leave_period_id | integer | Yes |  |
| employee_id | string | Yes |  |
| from_date | string | Yes |  |
| to_date | string | Yes |  |
| leave_type | string | Yes |  |
| reason |  | No |  |
| last_day | string | Yes |  |
| message | string | Yes |  |

## LeavePeriodCreate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| employee_id | string | Yes |  |
| from_date | string | Yes |  |
| to_date | string | Yes |  |
| leave_type | string | No |  |
| reason |  | No |  |

## LeavePeriodOut
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| employee_id | string | Yes |  |
| from_date | string | Yes |  |
| to_date | string | Yes |  |
| leave_type | string | No |  |
| reason |  | No |  |
| id | integer | Yes |  |
| created_at | string | Yes |  |
| updated_at |  | No |  |

## LeavePeriodUpdate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| from_date |  | No |  |
| to_date |  | No |  |
| leave_type |  | No |  |
| reason |  | No |  |

## ListConfigurationFieldSchema
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| index |  | Yes |  |
| sorter |  | Yes |  |
| width |  | Yes |  |
| is_link |  | Yes |  |
| empty_value_display | string | Yes |  |
| filter_widget_type |  | Yes |  |
| filter_widget_props |  | Yes |  |

## LostRequest
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| employee_id |  | No |  |
| quantity |  | No |  |
| serial_numbers |  | No |  |
| notes |  | No |  |

## ModelAction
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| name | string | Yes |  |
| description |  | Yes |  |

## ModelFieldSchema
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| name | string | Yes |  |
| list_configuration |  | Yes |  |
| add_configuration |  | Yes |  |
| change_configuration |  | Yes |  |

## ModelPermission

## ModelSchema
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| name | string | Yes |  |
| permissions | Array<[ModelPermission]> | Yes |  |
| actions | Array<[ModelAction]> | Yes |  |
| actions_on_top |  | Yes |  |
| actions_on_bottom |  | Yes |  |
| actions_selection_counter |  | Yes |  |
| fields | Array<[ModelFieldSchema]> | Yes |  |
| list_per_page |  | Yes |  |
| search_help_text |  | Yes |  |
| search_fields |  | Yes |  |
| preserve_filters |  | Yes |  |
| list_max_show_all |  | Yes |  |
| show_full_result_count |  | Yes |  |
| verbose_name |  | Yes |  |
| verbose_name_plural |  | Yes |  |
| fieldsets |  | Yes |  |
| save_on_top |  | Yes |  |
| save_as |  | Yes |  |
| save_as_continue |  | Yes |  |
| view_on_site |  | Yes |  |
| inlines |  | Yes |  |

## MonthlyComparisonStat
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| month | string | Yes |  |
| guard_count | integer | Yes |  |
| total_salary | number | Yes |  |
| guards | Array<object> | Yes |  |

## MonthlyTotalsStat
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| month | string | Yes |  |
| guard_count | integer | Yes |  |
| total_salary | number | Yes |  |

## Payroll2ExportRequest
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| rows | Array<[Payroll2RowExport]> | Yes |  |

## Payroll2RowExport
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| row_type |  | No |  |
| client_name |  | No |  |
| subtotal_employees |  | No |  |
| serial_no |  | No |  |
| fss_no |  | No |  |
| name | string | Yes |  |
| base_salary | number | Yes |  |
| mobile_no |  | No |  |
| presents_total | integer | Yes |  |
| paid_leave_days |  | No |  |
| pre_days | integer | Yes |  |
| cur_days | integer | Yes |  |
| leave_encashment_days | integer | Yes |  |
| total_days | integer | Yes |  |
| total_salary | number | Yes |  |
| overtime_rate | number | Yes |  |
| ot_days |  | No |  |
| overtime_minutes | integer | No |  |
| overtime_pay | number | Yes |  |
| allow_other | number | Yes |  |
| gross_pay | number | Yes |  |
| eobi_no |  | No |  |
| eobi | number | Yes |  |
| tax | number | Yes |  |
| fine_deduction | number | Yes |  |
| fine_adv | number | Yes |  |
| net_pay | number | Yes |  |
| remarks |  | No |  |
| bank_cash |  | No |  |
| cnic |  | No |  |
| bank_details |  | No |  |
| bank_name |  | No |  |
| bank_account_number |  | No |  |

## PayrollEmployeeRow
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| employee_db_id | integer | Yes |  |
| employee_id | string | Yes |  |
| name | string | Yes |  |
| department | string | Yes |  |
| shift_type | string | Yes |  |
| serial_no |  | No |  |
| fss_no |  | No |  |
| eobi_no |  | No |  |
| base_salary | number | Yes |  |
| allowances | number | Yes |  |
| working_days | integer | No |  |
| day_rate | number | No |  |
| payable_days | integer | No |  |
| basic_earned | number | No |  |
| pre_days | integer | No |  |
| cur_days | integer | No |  |
| leave_encashment_days | integer | No |  |
| total_days | integer | No |  |
| total_salary | number | No |  |
| present_days | integer | Yes |  |
| late_days | integer | Yes |  |
| absent_days | integer | Yes |  |
| paid_leave_days | integer | Yes |  |
| unpaid_leave_days | integer | Yes |  |
| unmarked_days | integer | No |  |
| overtime_minutes | integer | Yes |  |
| overtime_pay | number | Yes |  |
| overtime_rate | number | No |  |
| late_minutes | integer | Yes |  |
| late_deduction | number | Yes |  |
| late_rate | number | No |  |
| fine_deduction | number | No |  |
| allow_other | number | No |  |
| eobi | number | No |  |
| tax | number | No |  |
| fine_adv_extra | number | No |  |
| fine_adv | number | No |  |
| remarks |  | No |  |
| bank_cash |  | No |  |
| bank_name |  | No |  |
| account_number |  | No |  |
| unpaid_leave_deduction | number | Yes |  |
| advance_deduction | number | No |  |
| gross_pay | number | Yes |  |
| net_pay | number | Yes |  |
| paid_status | string | No |  |

## PayrollPaymentStatusOut
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| month | string | Yes |  |
| employee_id | string | Yes |  |
| status | string | Yes |  |
| id | integer | Yes |  |
| employee_db_id |  | No |  |
| net_pay_snapshot |  | No |  |

## PayrollPaymentStatusUpsert
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| month | string | Yes |  |
| employee_id | string | Yes |  |
| status | string | Yes |  |

## PayrollReportResponse
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| month | string | Yes |  |
| summary | [PayrollSummary] | Yes |  |
| rows | Array<[PayrollEmployeeRow]> | Yes |  |

## PayrollSheetEntryBulkUpsert
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| from_date | string | Yes |  |
| to_date | string | Yes |  |
| entries | Array<[PayrollSheetEntryUpsert]> | Yes |  |

## PayrollSheetEntryOut
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| employee_db_id | integer | Yes |  |
| from_date | string | Yes |  |
| to_date | string | Yes |  |
| pre_days_override |  | No |  |
| cur_days_override |  | No |  |
| leave_encashment_days | integer | No |  |
| allow_other | number | No |  |
| eobi | number | No |  |
| tax | number | No |  |
| fine_adv_extra | number | No |  |
| ot_rate_override | number | No |  |
| ot_bonus_amount | number | No |  |
| remarks |  | No |  |
| bank_cash |  | No |  |
| mobile_no |  | No |  |
| bank_name |  | No |  |
| bank_account_number |  | No |  |
| id | integer | Yes |  |
| created_at | string | Yes |  |
| updated_at |  | No |  |

## PayrollSheetEntryUpsert
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| employee_db_id | integer | Yes |  |
| from_date | string | Yes |  |
| to_date | string | Yes |  |
| pre_days_override |  | No |  |
| cur_days_override |  | No |  |
| leave_encashment_days | integer | No |  |
| allow_other | number | No |  |
| eobi | number | No |  |
| tax | number | No |  |
| fine_adv_extra | number | No |  |
| ot_rate_override | number | No |  |
| ot_bonus_amount | number | No |  |
| remarks |  | No |  |
| bank_cash |  | No |  |
| mobile_no |  | No |  |
| bank_name |  | No |  |
| bank_account_number |  | No |  |

## PayrollSummary
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| month | string | Yes |  |
| employees | integer | Yes |  |
| total_gross | number | Yes |  |
| total_net | number | Yes |  |

## PendingDeactivationCreate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| deactivation_date | string | Yes |  |

## PendingDeactivationRequest
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| deactivation_date | string | Yes |  |

## PendingDeactivationResponse
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| id | integer | Yes |  |
| employee_db_id | integer | Yes |  |
| employee_id | string | Yes |  |
| name | string | Yes |  |
| serial_no |  | Yes |  |
| fss_no |  | Yes |  |
| rank |  | Yes |  |
| category |  | Yes |  |
| unit |  | Yes |  |
| cnic |  | Yes |  |
| mobile_no |  | Yes |  |
| avatar_url |  | No |  |
| bank_name |  | Yes |  |
| bank_account_number |  | Yes |  |
| base_salary |  | Yes |  |
| deactivation_date | string | Yes |  |
| created_at | string | Yes |  |
| inventory_items | Array<[InventoryItem]> | Yes |  |
| attendance_summary | [AttendanceSummary] | Yes |  |
| salary_calculation | [SalaryCalculation] | Yes |  |
| settlement | [Settlement] | Yes |  |

## PermissionCreate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| key | string | Yes |  |
| description |  | No |  |

## PermissionOut
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| key | string | Yes |  |
| description |  | No |  |
| id | integer | Yes |  |

## QuantityActionRequest
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| quantity | number | Yes |  |
| notes |  | No |  |

## RestrictedItemCreate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| item_code | string | Yes |  |
| category | string | Yes |  |
| name | string | Yes |  |
| description |  | No |  |
| is_serial_tracked | boolean | No |  |
| unit_name | string | No |  |
| quantity_on_hand | number | No |  |
| min_quantity |  | No |  |
| make_model |  | No |  |
| caliber |  | No |  |
| storage_location |  | No |  |
| requires_maintenance | boolean | No |  |
| requires_cleaning | boolean | No |  |
| status | string | No |  |

## RestrictedItemImageOut
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| id | integer | Yes |  |
| item_code | string | Yes |  |
| filename | string | Yes |  |
| url | string | Yes |  |
| mime_type | string | Yes |  |
| created_at | string | Yes |  |
| updated_at |  | No |  |

## RestrictedItemOut
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| item_code | string | Yes |  |
| category | string | Yes |  |
| name | string | Yes |  |
| description |  | No |  |
| is_serial_tracked | boolean | No |  |
| unit_name | string | No |  |
| quantity_on_hand | number | No |  |
| min_quantity |  | No |  |
| make_model |  | No |  |
| caliber |  | No |  |
| storage_location |  | No |  |
| requires_maintenance | boolean | No |  |
| requires_cleaning | boolean | No |  |
| status | string | No |  |
| id | integer | Yes |  |
| serial_total |  | No |  |
| serial_in_stock |  | No |  |
| created_at | string | Yes |  |
| updated_at |  | No |  |

## RestrictedItemUpdate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| category |  | No |  |
| name |  | No |  |
| description |  | No |  |
| is_serial_tracked |  | No |  |
| unit_name |  | No |  |
| quantity_on_hand |  | No |  |
| min_quantity |  | No |  |
| make_model |  | No |  |
| caliber |  | No |  |
| storage_location |  | No |  |
| requires_maintenance |  | No |  |
| requires_cleaning |  | No |  |
| status |  | No |  |

## RestrictedSerialUnitCreate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| serial_number | string | Yes |  |

## RestrictedSerialUnitOut
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| id | integer | Yes |  |
| item_code | string | Yes |  |
| serial_number | string | Yes |  |
| status | string | Yes |  |
| issued_to_employee_id |  | No |  |
| created_at | string | Yes |  |
| updated_at |  | No |  |

## RestrictedTransactionOut
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| id | integer | Yes |  |
| item_code | string | Yes |  |
| employee_id |  | No |  |
| serial_unit_id |  | No |  |
| action | string | Yes |  |
| quantity |  | No |  |
| condition_note |  | No |  |
| notes |  | No |  |
| created_at | string | Yes |  |

## RoleCreate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| name | string | Yes |  |
| description |  | No |  |
| permission_keys | Array<string> | No |  |

## RoleOut
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| name | string | Yes |  |
| description |  | No |  |
| id | integer | Yes |  |
| is_system | boolean | Yes |  |
| permissions | Array<[PermissionOut]> | No |  |

## RoleUpdate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| name |  | No |  |
| description |  | No |  |
| permission_keys |  | No |  |

## SalaryCalculation
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| gross_salary | integer | Yes |  |
| deductions | [Deductions] | Yes |  |
| net_payable | integer | Yes |  |

## SerialActionRequest
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| notes |  | No |  |

## Settlement
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| total_to_collect | integer | Yes |  |
| total_to_pay | integer | Yes |  |
| net_amount | integer | Yes |  |

## SignInInputSchema
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| username | string | Yes |  |
| password | string | Yes |  |

## SuggestedEmployeeOut
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| id | integer | Yes |  |
| employee_id | string | Yes |  |
| first_name | string | Yes |  |
| last_name | string | Yes |  |
| languages | Array<string> | No |  |

## Token
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| access_token | string | Yes |  |
| token_type | string | No |  |

## User
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| email | string | Yes |  |
| username | string | Yes |  |
| full_name |  | No |  |
| is_active | boolean | No |  |
| id | integer | Yes |  |
| is_superuser | boolean | Yes |  |
| created_at | string | Yes |  |
| updated_at |  | No |  |

## UserCreate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| email | string | Yes |  |
| username | string | Yes |  |
| full_name |  | No |  |
| is_active | boolean | No |  |
| password | string | Yes |  |

## UserUpdate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| email |  | No |  |
| username |  | No |  |
| full_name |  | No |  |
| password |  | No |  |
| is_active |  | No |  |

## ValidationError
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| loc | Array<any> | Yes |  |
| msg | string | Yes |  |
| type | string | Yes |  |

## VehicleAssignmentAggRow
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| vehicle_id | string | Yes |  |
| assignments | integer | Yes |  |
| total_km | number | Yes |  |
| total_amount | number | Yes |  |
| avg_rate_per_km |  | No |  |
| cost_per_km |  | No |  |

## VehicleAssignmentAnalyticsResponse
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| period | string | Yes |  |
| date |  | No |  |
| month |  | No |  |
| year |  | No |  |
| vehicle_id |  | No |  |
| rows | Array<[VehicleAssignmentAggRow]> | Yes |  |
| best_cost_per_km | Array<[VehicleAssignmentAggRow]> | Yes |  |
| worst_cost_per_km | Array<[VehicleAssignmentAggRow]> | Yes |  |

## VehicleAssignmentCreate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| vehicle_id | string | Yes |  |
| employee_ids | Array<string> | Yes |  |
| route_stops |  | No |  |
| route_from |  | No |  |
| route_to |  | No |  |
| assignment_date |  | No |  |
| notes |  | No |  |

## VehicleAssignmentEfficiencyResponse
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| period | string | Yes |  |
| date |  | No |  |
| month |  | No |  |
| year |  | No |  |
| vehicle_id |  | No |  |
| assignments | integer | Yes |  |
| total_km | number | Yes |  |
| total_amount | number | Yes |  |
| avg_cost_per_km |  | No |  |
| vehicles | Array<[VehicleEfficiencySummaryRow]> | Yes |  |
| expensive_assignments | Array<[AssignmentEfficiencyRow]> | Yes |  |
| efficient_assignments | Array<[AssignmentEfficiencyRow]> | Yes |  |
| employees | Array<[EmployeeEfficiencySummaryRow]> | Yes |  |
| alerts | Array<[EfficiencyAlertRow]> | Yes |  |

## VehicleAssignmentResponse
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| vehicle_id | string | Yes |  |
| employee_ids | Array<string> | Yes |  |
| route_stops |  | No |  |
| route_from |  | No |  |
| route_to |  | No |  |
| assignment_date |  | No |  |
| notes |  | No |  |
| id | integer | Yes |  |
| status | string | Yes |  |
| distance_km |  | No |  |
| rate_per_km |  | No |  |
| amount |  | No |  |
| start_time |  | No |  |
| end_time |  | No |  |
| created_at | string | Yes |  |
| updated_at |  | No |  |

## VehicleAssignmentUpdate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| vehicle_id |  | No |  |
| employee_ids |  | No |  |
| route_stops |  | No |  |
| route_from |  | No |  |
| route_to |  | No |  |
| assignment_date |  | No |  |
| notes |  | No |  |
| status |  | No |  |
| distance_km |  | No |  |
| rate_per_km |  | No |  |
| amount |  | No |  |
| start_time |  | No |  |
| end_time |  | No |  |

## VehicleCreate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| vehicle_id | string | Yes |  |
| vehicle_type | string | Yes |  |
| category | string | Yes |  |
| make_model | string | Yes |  |
| license_plate | string | Yes |  |
| chassis_number |  | No |  |
| asset_tag |  | No |  |
| year | integer | Yes |  |
| status | string | No |  |
| compliance | string | No |  |
| government_permit | string | Yes |  |

## VehicleDocumentOut
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| id | integer | Yes |  |
| vehicle_id | string | Yes |  |
| name | string | Yes |  |
| filename | string | Yes |  |
| url | string | Yes |  |
| mime_type | string | Yes |  |
| created_at | string | Yes |  |
| updated_at |  | No |  |

## VehicleEfficiencySummaryRow
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| vehicle_id | string | Yes |  |
| assignments | integer | Yes |  |
| total_km | number | Yes |  |
| total_amount | number | Yes |  |
| avg_km_per_trip |  | No |  |
| avg_cost_per_km |  | No |  |
| min_cost_per_km |  | No |  |
| max_cost_per_km |  | No |  |

## VehicleImageOut
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| id | integer | Yes |  |
| vehicle_id | string | Yes |  |
| filename | string | Yes |  |
| url | string | Yes |  |
| mime_type | string | Yes |  |
| created_at | string | Yes |  |
| updated_at |  | No |  |

## VehicleMaintenanceCreate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| vehicle_id | string | Yes |  |
| employee_id |  | No |  |
| description |  | No |  |
| maintenance_date | string | Yes |  |
| cost |  | No |  |
| odometer_km |  | No |  |
| service_vendor |  | No |  |

## VehicleMaintenanceResponse
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| vehicle_id | string | Yes |  |
| employee_id |  | No |  |
| description |  | No |  |
| maintenance_date | string | Yes |  |
| cost |  | No |  |
| odometer_km |  | No |  |
| service_vendor |  | No |  |
| id | integer | Yes |  |
| created_at | string | Yes |  |
| updated_at |  | No |  |

## VehicleMaintenanceUpdate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| vehicle_id |  | No |  |
| employee_id |  | No |  |
| description |  | No |  |
| maintenance_date |  | No |  |
| cost |  | No |  |
| odometer_km |  | No |  |
| service_vendor |  | No |  |

## VehicleResponse
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| vehicle_id | string | Yes |  |
| vehicle_type | string | Yes |  |
| category | string | Yes |  |
| make_model | string | Yes |  |
| license_plate | string | Yes |  |
| chassis_number |  | No |  |
| asset_tag |  | No |  |
| year | integer | Yes |  |
| status | string | No |  |
| compliance | string | No |  |
| government_permit | string | Yes |  |
| id | integer | Yes |  |
| created_at | string | Yes |  |
| updated_at |  | No |  |

## VehicleUpdate
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| vehicle_type |  | No |  |
| category |  | No |  |
| make_model |  | No |  |
| license_plate |  | No |  |
| chassis_number |  | No |  |
| asset_tag |  | No |  |
| year |  | No |  |
| status |  | No |  |
| compliance |  | No |  |
| government_permit |  | No |  |

## WidgetType

## app__schemas__general_inventory__IssueRequest
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| employee_id | string | Yes |  |
| quantity | number | Yes |  |
| notes |  | No |  |

## app__schemas__general_inventory__ReturnRequest
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| employee_id | string | Yes |  |
| quantity | number | Yes |  |
| condition_note |  | No |  |
| notes |  | No |  |

## app__schemas__restricted_inventory__IssueRequest
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| employee_id | string | Yes |  |
| quantity |  | No |  |
| serial_numbers |  | No |  |
| notes |  | No |  |

## app__schemas__restricted_inventory__ReturnRequest
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| employee_id |  | No |  |
| quantity |  | No |  |
| serial_numbers |  | No |  |
| condition_note |  | No |  |
| notes |  | No |  |
