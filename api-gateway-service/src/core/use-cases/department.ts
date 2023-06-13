import { DepartmentData } from 'src/core/interfaces/department/department-data.interface';
import { DepartmentServiceClient } from 'src/core/interfaces/department/service.interface';
import { UserServiceClient } from 'src/core/interfaces/user/service.interface';
import {
  CreateDepartmentRequestDto,
  UpdateDepartmentRequestDto,
} from 'src/core/dtos/department.dto';
import { lastValueFrom } from 'rxjs';

export class DepartmentUseCases {
  private departmentService: DepartmentServiceClient;
  private userService: UserServiceClient;

  constructor(
    departmentService: DepartmentServiceClient,
    userService: UserServiceClient,
  ) {
    this.departmentService = departmentService;
    this.userService = userService;
  }

  async createDepartment(
    request: CreateDepartmentRequestDto,
  ): Promise<DepartmentData> {
    const department = await lastValueFrom(
      this.departmentService.createDepartment(request),
    );
    if (department.error?.some((e) => e.includes('Existing Department'))) {
      throw new Error('Department already exists');
    }
    if (department.error?.length) {
      throw new Error(department.error.join(','));
    }
    return department.data;
  }

  async getDepartmentById(departmentId: number): Promise<DepartmentData> {
    const departmentResponse = await lastValueFrom(
      this.departmentService.getDepartmentById({ id: departmentId }),
    );
    if (
      departmentResponse.error?.some((e) => e.includes('Department not found'))
    ) {
      throw new Error('Department not found');
    }
    if (departmentResponse.error?.length) {
      throw new Error(departmentResponse.error.join(','));
    }
    let users = [];
    if (departmentResponse.data?.departmentAssign?.length) {
      users = await Promise.all(
        departmentResponse.data?.departmentAssign?.map((assign) =>
          lastValueFrom(
            this.userService.getUserById({ id: assign.userId }),
          ).then((ur) => ur.data),
        ),
      );
    }
    return {
      id: departmentResponse.data.id,
      name: departmentResponse.data.name,
      users: users,
    };
  }

  async getAllDepartments(): Promise<DepartmentData[]> {
    const departmentsResponse = await lastValueFrom(
      this.departmentService.getAllDepartments({}),
    );
    if (departmentsResponse.data) {
      const userAssigns = await Promise.all(
        departmentsResponse.data
          .filter((d) => d.departmentAssign?.length)
          .map(async ({ id, departmentAssign }) => {
            return Promise.all(
              departmentAssign.map((assign) =>
                lastValueFrom(
                  this.userService.getUserById({ id: assign.userId }),
                ),
              ),
            ).then((response) => ({
              id,
              users: response.map((ru) => ru.data),
            }));
          }),
      );
      //mapper for data aggregation
      const userAssignsMapper = userAssigns.reduce((prev, curr) => {
        prev[curr.id] = curr.users;
        return prev;
      }, {});

      return departmentsResponse.data.map((department) => {
        if (department.departmentAssign?.length) {
          delete department.departmentAssign;
          return { ...department, users: userAssignsMapper[department.id] };
        }
        return { ...department, users: [] };
      });
    }
    if (departmentsResponse.error?.length) {
      throw new Error(departmentsResponse.error.join(','));
    }
    return [];
  }

  async updateDepartmentById(
    departmentId: number,
    request: UpdateDepartmentRequestDto,
  ): Promise<DepartmentData> {
    const departmentUpdateResponse = await lastValueFrom(
      this.departmentService.updateDepartmentById({
        id: departmentId,
        ...request,
      }),
    );
    if (
      departmentUpdateResponse.error?.some((e) =>
        e.includes('Department not found'),
      )
    ) {
      throw new Error('Department not found');
    }
    if (departmentUpdateResponse.error?.length) {
      throw new Error(departmentUpdateResponse.error.join(','));
    }
    let users = [];
    if (departmentUpdateResponse.data?.departmentAssign?.length) {
      users = await Promise.all(
        departmentUpdateResponse.data?.departmentAssign?.map((assign) =>
          lastValueFrom(
            this.userService.getUserById({ id: assign.userId }),
          ).then((ur) => ur.data),
        ),
      );
    }
    return {
      id: departmentUpdateResponse.data.id,
      name: departmentUpdateResponse.data.name,
      users: users,
    };
  }

  async deleteDepartmentById(departmentId: number): Promise<void> {
    const departmentDeleteResponse = await lastValueFrom(
      this.departmentService.deleteDepartmentById({ id: departmentId }),
    );
    if (
      departmentDeleteResponse.error?.some((e) =>
        e.includes('Department not found'),
      )
    ) {
      throw new Error('Department not found');
    }
    if (departmentDeleteResponse.error?.length) {
      throw new Error(departmentDeleteResponse.error.join(','));
    }
  }
}
