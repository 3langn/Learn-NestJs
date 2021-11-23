import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/users.service';
import * as bcrypt from 'bcryptjs';
import { TokenService } from '../token/token.service';
import { UserLoginDto } from '../user/dto/user-login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(userLoginDto: UserLoginDto) {
    const user = await this.userService.findByEmail(userLoginDto.email);

    const isMatchPassword = this.userService.isMatchPassword(
      userLoginDto.password,
      user.password,
    );

    if (!isMatchPassword) {
      throw new UnauthorizedException('Password is incorrect');
    }
    return user;
  }
}
