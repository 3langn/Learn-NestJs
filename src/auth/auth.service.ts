import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../user/users.service';
import * as bcrypt from 'bcryptjs';
import { UserLoginDto } from 'src/user/dto/user-login.dto';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

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
