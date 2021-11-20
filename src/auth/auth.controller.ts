import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserLoginDto } from 'src/users/dto/user-login.dto';
import { UserRegisterDto } from 'src/users/dto/user-register.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { Serialize } from 'src/users/users.interceptor';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Serialize(UserDto)
  @ApiCreatedResponse({
    description: 'User created successfully',
    type: UserDto,
  })
  @Post('signup')
  async registerUser(@Body() userRegisterDto: UserRegisterDto) {
    return await this.userService.createUser(userRegisterDto);
  }

  @ApiOkResponse({ description: 'Success' })
  @Post('login')
  async login(@Body() userLoginDto: UserLoginDto) {
    const user = await this.authService.validateUser(userLoginDto);
    return user;
  }
}
