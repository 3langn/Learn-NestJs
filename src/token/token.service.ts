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
    @InjectRepository(Token) private tokenRepo: Repository<Token>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateAuthToken(userId: string): Promise<TokenPayloadDto> {
    const accessToken = this.generateToken(
      userId,
      this.configService.get(constants.JWT_ACCESS_EXPIRATION),
    );
    const refreshToken = this.generateToken(
      userId,
      this.configService.get(constants.JWT_REFRESH_EXPIRATION),
    );
    await this.saveToken(refreshToken, userId, TokenType.RefreshToken);
    return {
      accessToken,
      refreshToken,
    };
  }

  saveToken(token: string, userId: string, tokenType: TokenType) {
    const tokenDoc = this.tokenRepo.create({ token, userId, type: tokenType });
    return this.tokenRepo.save(tokenDoc);
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

    const tokenDoc = await this.tokenRepo.findOne({
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
      this.configService.get(constants.JWT_VERIFY_EMAIL_EXPIRATION),
    );
    return await this.saveToken(
      verifyEmailToken,
      userId,
      TokenType.VerifyEmailToken,
    );
  }

  async generateResetPasswordToken(userEmail: string) {
    const user = await this.userRepo.findOne({ where: { email: userEmail } });
    if (!user) {
      throw new NotFoundException('Email does not exist');
    }
    const refreshPasswordToken = this.generateToken(
      user.id,
      this.configService.get(constants.JWT_RESET_PASSWORD_EXPIRATION),
    );
    return await this.saveToken(
      refreshPasswordToken,
      user.id,
      TokenType.RefreshPasswordToken,
    );
  }
}
