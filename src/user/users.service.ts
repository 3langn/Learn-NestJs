import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async createUser(userRegisterDto: UserRegisterDto): Promise<User> {
    const user = await this.repo.findOne({
      where: { email: userRegisterDto.email },
    });
    if (user) {
      throw new UnauthorizedException('Email already in use');
    }
    const userDoc = this.repo.create(userRegisterDto);
    return this.repo.save(userDoc);
  }

  async isValidEmail(email: string): Promise<void> {}

  async findByEmail(email: string): Promise<User> {
    const user = await this.repo.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('Email not found');
    }
    return user;
  }

  isMatchPassword(password: string, hashPassword: string) {
    return bcrypt.compareSync(password, hashPassword);
  }

  find(options: object): Promise<User> {
    return this.repo.findOne({ where: options });
  }
}
