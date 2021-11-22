import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user';
@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async createUser(userRegisterDto: UserRegisterDto): Promise<User> {
    await this.isValidEmail(userRegisterDto.email);
    const user = this.repo.create(userRegisterDto);
    return this.repo.save(user);
  }

  async isValidEmail(email: string): Promise<void> {
    const user = await this.repo.findOne({ where: { email } });
    if (user) {
      throw new UnauthorizedException('Email already in use');
    }
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.repo.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('Email not found');
    }
    return user;
  }

  findById(id: string): Promise<User> {
    return this.repo.findOne({ where: { id } });
  }
}
