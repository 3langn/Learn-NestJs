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
import { TokenService } from 'src/token/token.service';
import { UserLoginDto } from 'src/user/dto/user-login.dto';
import { UserRegisterDto } from 'src/user/dto/user-register.dto';
import { UserDto } from 'src/user/dto/user.dto';
import { Serialize } from 'src/user/users.interceptor';
import { UserService } from 'src/user/users.service';
import { AuthService } from './auth.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { TokenPayloadDto } from './dto/token-payload.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { RolesType } from 'src/common/constants/enum';
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
