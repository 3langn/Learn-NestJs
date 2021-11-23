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
  ApiTags,
} from '@nestjs/swagger';
import { RolesType } from '../common/constants/enum';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { TokenService } from '../token/token.service';
import { UserLoginDto } from '../user/dto/user-login.dto';
import { UserRegisterDto } from '../user/dto/user-register.dto';
import { UserDto } from '../user/dto/user.dto';
import { Serialize } from '../user/users.interceptor';
import { UserService } from '../user/users.service';
import { AuthService } from './auth.service';
import { TokenPayloadDto } from './dto/token-payload.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
@ApiTags('Authentication')
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('test')
  @Roles(RolesType.ADMIN)
  @ApiBearerAuth()
  hello(@Request() req) {
    return req.user;
  }
}
