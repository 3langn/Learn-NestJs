import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from '../token/token.entity';
import { TokenService } from '../token/token.service';
import { UsersModule } from '../user/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './stategies/jwt.stratetry';

@Module({
  imports: [
    TypeOrmModule.forFeature([Token]),
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
  ],
  providers: [AuthService, TokenService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
