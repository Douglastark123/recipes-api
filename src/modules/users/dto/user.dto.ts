import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { User as UserModel } from '@prisma/client';

export class CreateUserDto implements Partial<UserModel> {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
