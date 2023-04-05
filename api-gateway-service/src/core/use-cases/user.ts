import { UserServiceClient } from 'src/core/interfaces/user/service.interface';
import { UserData } from 'src/core/interfaces/user/user-data.interface';
import { UsersByDeparment } from 'src/core/interfaces/user/users-by-department';
import { DepartmentServiceClient } from 'src/core/interfaces/department/service.interface';
import {
  CreateUserRequestDto,
  UpdateUserRequestDto,
} from 'src/core/dtos/user.dto';
import { lastValueFrom } from 'rxjs';

export class UserUseCases {
  private userService: UserServiceClient;
  private departmentService: DepartmentServiceClient;

  constructor(
    userService: UserServiceClient,
    departmentService: DepartmentServiceClient,
  ) {
    this.userService = userService;
    this.departmentService = departmentService;
  }

  async createUser(
    request: CreateUserRequestDto,
    departmentId: number,
  ): Promise<UserData> {
    const departmentResponse = await lastValueFrom(
      this.departmentService.getDepartmentById({ id: departmentId }),
    );
    if (
      departmentResponse.error?.some((e) =>
        e.includes('Department not found'),
      ) ||
      !departmentResponse.data
    ) {
      throw new Error('Department not found');
    }

    const userResponse = await lastValueFrom(
      this.userService.createUser({ departmentId, ...request }),
    );
    if (userResponse.error?.length) {
      if (userResponse.error.some((e) => e.includes('Existing User'))) {
        throw new Error('User already exists');
      }
      throw new Error(userResponse.error.join(','));
    }

    return userResponse.data;
  }

  async getUserById(userId: number, departmentId: number): Promise<UserData> {
    const departmentResponse = await lastValueFrom(
      this.departmentService.getDepartmentById({ id: departmentId }),
    );
    if (
      departmentResponse?.error?.some((e) =>
        e.includes('Department not found'),
      ) ||
      !departmentResponse.data
    ) {
      throw new Error('Department not found');
    }

    const userResponse = await lastValueFrom(
      this.userService.getUserById({ id: userId }),
    );
    if (userResponse.error?.length) {
      if (userResponse.error.some((e) => e.includes('User not found'))) {
        throw new Error('User not found');
      }
      throw new Error(userResponse.error.join(','));
    }
    return userResponse.data;
  }

  async getAllUsersByDepartment(
    departmentId: number,
  ): Promise<UsersByDeparment> {
    const departmentResponse = await lastValueFrom(
      this.departmentService.getDepartmentById({ id: departmentId }),
    );
    if (
      departmentResponse?.error?.some((e) =>
        e.includes('Department not found'),
      ) ||
      !departmentResponse.data
    ) {
      throw new Error('Department not found');
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
      department: departmentResponse.data.name,
      users: users,
    };
  }

  async updateUserById(
    userId: number,
    departmentId: number,
    request: UpdateUserRequestDto,
  ): Promise<UserData> {
    const departmentResponse = await lastValueFrom(
      this.departmentService.getDepartmentById({ id: departmentId }),
    );
    if (
      departmentResponse?.error?.some((e) =>
        e.includes('Department not found'),
      ) ||
      !departmentResponse.data
    ) {
      throw new Error('Department not found');
    }

    if (
      !departmentResponse.data?.departmentAssign?.some(
        ({ userId: uId }) => uId === userId,
      )
    ) {
      throw new Error(
        `User ${userId} does not belong to Department ${departmentResponse.data.name}`,
      );
    }

    if (request.departmentId) {
      const destinationDepartmentResponse = await lastValueFrom(
        this.departmentService.getDepartmentById({ id: request.departmentId }),
      );
      if (
        destinationDepartmentResponse?.error?.some((e) =>
          e.includes('Department not found'),
        ) ||
        !destinationDepartmentResponse.data
      ) {
        throw new Error('Destination department not found');
      }
    }

    const userUpdateResponse = await lastValueFrom(
      this.userService.updateUserById({ id: userId, ...request }),
    );
    if (userUpdateResponse.error?.length) {
      throw new Error(userUpdateResponse.error.join(','));
    }
    return userUpdateResponse.data;
  }

  async deleteUserById(userId: number, departmentId: number): Promise<void> {
    const departmentResponse = await lastValueFrom(
      this.departmentService.getDepartmentById({ id: departmentId }),
    );
    if (
      departmentResponse?.error?.some((e) =>
        e.includes('Department not found'),
      ) ||
      !departmentResponse.data
    ) {
      throw new Error('Department not found');
    }

    if (
      !departmentResponse.data?.departmentAssign?.some(
        ({ userId: uId }) => uId === userId,
      )
    ) {
      throw new Error(
        `User ${userId} does not belong to Department ${departmentResponse.data.name}`,
      );
    }

    const deleteUserResponse = await lastValueFrom(
      this.userService.deleteUserById({ id: userId }),
    );
    if (deleteUserResponse.error?.length) {
      throw new Error(deleteUserResponse.error.join(','));
    }
  }
}
