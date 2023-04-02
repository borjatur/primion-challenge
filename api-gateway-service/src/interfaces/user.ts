interface UserBase {
  username: string
}

export interface UpdateUserHttpRequest extends UserBase {}

export interface CreateUserHttpRequest extends UserBase {}