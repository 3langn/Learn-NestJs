import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entity/user';
import constants from 'src/utils/constants';
import { TokenType } from 'src/utils/enum';
import { Repository } from 'typeorm';
import { Token } from './token.entity';
@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token) private repo: Repository<Token>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateAuthToken(user: User) {
    const accessToken = this.generateToken(
      user.id,
      this.configService.get(constants.JWT_ACCESS_EXPIRATION_MINUTES),
    );
    const refreshToken = this.generateToken(
      user.id,
      this.configService.get(constants.JWT_REFRESH_EXPIRATION_DAYS),
    );
    await this.saveToken(refreshToken, user, TokenType.RefreshToken);
    return {
      accessToken,
      refreshToken,
    };
  }

  saveToken(token: string, user: User, tokenType: TokenType) {
    const tokenDoc = this.repo.create({ token, user, type: tokenType });
    return this.repo.save(tokenDoc);
  }

  generateToken(userId: string, expires: number) {
    const payload = { sub: userId };

    return this.jwtService.sign(payload, {
      expiresIn: expires,
      secret: this.configService.get(constants.JWT_SECRET_KEY),
    });
  }

  verifyToken(token: string, type: string) {}
}
