import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { UserRegisterDto } from 'src/users/dto/user-register.dto';
import { UserLoginDto } from 'src/users/dto/user-login.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async validateUser(userLoginDto: UserLoginDto) {
    const user = await this.userService.findByEmail(userLoginDto.email);

    const isMatchPassword = bcrypt.compareSync(
      userLoginDto.password,
      user.password,
    );

    if (!isMatchPassword) {
      throw new UnauthorizedException('Password is incorrect');
    }
    return user;
  }
}
