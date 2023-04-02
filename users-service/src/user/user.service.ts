import { Injectable, Inject } from '@nestjs/common';
// import { ClientProxy } from '@nestjs/microservices';
import { ClientRedis } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { 
  CreateUserRequestDto,
  GetUserByIdRequestDto } from './user.dto';
import { 
  CreateUserResponse,
  GetAllUsersByDepartmentRequest,
  GetAllUsersByDepartmentResponse,
  GetUserByIdResponse,
  UpdateUserByIdRequest,
  UpdateUserByIdResponse,
  DeleteUserByIdRequest,
  DeleteUserByIdResponse} from './user.pb';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly repository: Repository<User>;

  constructor(@Inject('REDIS_CLIENT') private redisClient: ClientRedis) {}

  public async getUserById({ id }: GetUserByIdRequestDto): Promise<GetUserByIdResponse> {
    const user: User = await this.repository.findOne({ where: { id } });
    if (!user) {
      return { data: null, error: ['User not found'] };
    }
    return { data: user, error: null };
  }

  public async createUser(payload: CreateUserRequestDto): Promise<CreateUserResponse> {
    const user: User = new User();
    user.username = payload.username;
    user.departmentId = payload.departmentId;
    try {
      const savedUser = await this.repository.save(user);
      await this.redisClient.emit('ADD_USER', { userId: savedUser.id, departmentId: savedUser.departmentId });
      return { data: savedUser, error: null };
    } catch (err) {
      if (err.message.includes('UNIQUE')) {
        return { data: null, error: [`Existing User with name ${user.username}`] };
      }
      return { data: null, error: [err.message] }
    }
  }

  public async getAllUsersByDeparment(payload: GetAllUsersByDepartmentRequest): Promise<GetAllUsersByDepartmentResponse> {
    const users: User[] = await this.repository.find({ where: { departmentId: payload.departmentId }});
    return { data: users, error: null };
  }

  public async updateUserById(payload: UpdateUserByIdRequest): Promise<UpdateUserByIdResponse>  {
    const user: User = await this.repository.findOne({ where: { id: payload.id } });
    if (!user) {
      return { data: null, error: ['User not found'] };
    }
    const updatedUser = { ...user, ...payload };
    const response = await this.repository.save(updatedUser);
    if (user.departmentId !== updatedUser.departmentId) {
      await this.redisClient.emit('EDIT_USER', { userId: updatedUser.id, departmentId: updatedUser.departmentId });
    }
    return { data: response, error: null };
  }

  public async deleteUserById(payload: DeleteUserByIdRequest): Promise<DeleteUserByIdResponse> {
    const user: User = await this.repository.findOne({ where: { id: payload.id } });
    if (!user) {
      return { error: ['User not found'] };
    }
    const removeResult = await this.repository.remove(user);
    if (removeResult) {
      await this.redisClient.emit('DELETE_USER', { userId: user.id, departmentId: removeResult.departmentId });
    }
    return { error: null };
  }
}