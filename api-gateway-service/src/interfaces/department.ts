interface DepartmentBase {
  name: string
}

export interface UpdateDepartmentHttpRequest extends DepartmentBase {}

export interface CreateDepartmentHttpRequest extends DepartmentBase {}