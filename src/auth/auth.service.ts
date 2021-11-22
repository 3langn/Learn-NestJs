import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { UserLoginDto } from 'src/users/dto/user-login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly JwtService: JwtService,
  ) {}

  async validateUser(userLoginDto: UserLoginDto) {
    const { password, ...rest } = await this.userService.findByEmail(
      userLoginDto.email,
    );

    const isMatchPassword = bcrypt.compareSync(userLoginDto.password, password);

    if (!isMatchPassword) {
      throw new UnauthorizedException('Password is incorrect');
    }
    return this.JwtService.sign(rest);
  }
}
