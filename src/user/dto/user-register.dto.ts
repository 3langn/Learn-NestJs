import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { RolesType } from '../../common/constants/enum';

export class UserRegisterDto {
  @ApiProperty({ default: 'firstname' })
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @ApiProperty({ default: 'lastname' })
  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @ApiProperty({ default: 'myacount@email.com' })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ minLength: 6, default: 'mypassword' })
  @IsString()
  @MinLength(6)
  readonly password: string;

  @ApiProperty({
    enum: RolesType,
    default: RolesType.USER,
  })
  @IsString()
  readonly roles: RolesType;

  @ApiProperty({ default: '0999999999' })
  @IsPhoneNumber('VN')
  @IsOptional()
  phone: string;
}
