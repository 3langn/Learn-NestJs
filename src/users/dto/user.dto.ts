import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserDto {
  @ApiProperty({ default: 1 })
  @Expose()
  id: string;

  @ApiProperty({ default: 'myacount@email.com' })
  @Expose()
  email: string;
}
