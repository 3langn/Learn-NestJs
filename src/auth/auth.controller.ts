import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { TokenService } from 'src/token/token.service';
import { UserLoginDto } from 'src/user/dto/user-login.dto';
import { UserRegisterDto } from 'src/user/dto/user-register.dto';
import { UserDto } from 'src/user/dto/user.dto';
import { Serialize } from 'src/user/users.interceptor';
import { UsersService } from 'src/user/users.service';
import { AuthService } from './auth.service';
import { TokenPayloadDto } from './dto/token-payload.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly tokenService: TokenService,
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

  @ApiOkResponse({ description: 'Success', type: TokenPayloadDto })
  @HttpCode(200)
  @Post('login')
  async login(@Body() userLoginDto: UserLoginDto): Promise<TokenPayloadDto> {
    const user = await this.authService.validateUser(userLoginDto);
    const tokens = await this.tokenService.generateAuthToken(user.id);
    return tokens;
  }

  @UseGuards(JwtAuthGuard)
  @Get('test')
  @ApiBearerAuth()
  hello(@Request() req) {
    return req.user;
  }
}
