import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ default: 'myacount@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Account password', default: 'password' })
  @IsString()
  password: string;
}
