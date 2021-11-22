import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user';
import constants from 'src/constants/constants';
import { TokenType } from 'src/constants/enum';
import { Repository } from 'typeorm';
import { Token } from './token.entity';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token) private repo: Repository<Token>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateAuthToken(userId: string): Promise<TokenPayloadDto> {
    const accessToken = this.generateToken(
      userId,
      this.configService.get(constants.JWT_ACCESS_EXPIRATION_MINUTES),
    );
    const refreshToken = this.generateToken(
      userId,
      this.configService.get(constants.JWT_REFRESH_EXPIRATION_DAYS),
    );
    await this.saveToken(refreshToken, userId, TokenType.RefreshToken);
    return {
      accessToken,
      refreshToken,
    };
  }

  saveToken(token: string, userId: string, tokenType: TokenType) {
    const tokenDoc = this.repo.create({ token, userId, type: tokenType });
    return this.repo.save(tokenDoc);
  }

  generateToken(userId: string, expires: number) {
    const payload = { sub: userId };

    return this.jwtService.sign(payload, {
      expiresIn: expires,
      secret: this.configService.get(constants.JWT_SECRET_KEY),
    });
  }

  async verifyToken(token: string, type: TokenType) {
    const payload = this.jwtService.verify(
      token,
      this.configService.get(constants.JWT_SECRET_KEY),
    );
    console.log(payload);

    const tokenDoc = await this.repo.findOne({
      token,
      type,
      userId: payload.id,
    });
    if (!tokenDoc) {
      throw new NotFoundException('Token does not exist');
    }
    return tokenDoc.id;
  }

  async generateVerifyEmailToken(userId: string) {
    const verifyEmailToken = this.generateToken(
      userId,
      this.configService.get(constants.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES),
    );
    await this.saveToken(verifyEmailToken, userId, TokenType.VerifyEmailToken);
  }
}
