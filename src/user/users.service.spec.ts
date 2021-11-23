import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { RolesType } from '../common/constants/enum';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user';
import { UserService } from './users.service';
const registerUser: UserRegisterDto = {
  email: 'myemail1',
  firstName: 'John',
  lastName: 'Smith',
  password: 'password',
  phone: '11111111',
  roles: RolesType.ADMIN,
};
const fakeUserTable = [];

describe('UsersService', () => {
  let service: UserService;

  const mockUserRepository: Partial<Repository<User>> = {
    save: jest.fn().mockImplementation((user) => {
      const userDoc = {
        id: Date.now().toString(),
        password: `${registerUser.password}1`,
        ...registerUser,
      };
      fakeUserTable.push(userDoc);
      return Promise.resolve(userDoc);
    }),
    create: jest.fn().mockImplementation((dto) => dto),
    findOne: jest.fn().mockImplementation((args) => {
      const user = fakeUserTable.find(
        (user) => user.email === args.where.email,
      ) as User;
      return Promise.resolve(user);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create user', async () => {
    expect(await service.createUser(registerUser)).toEqual({
      id: expect.any(String),
      password: expect.not.stringMatching(registerUser.password),
      ...registerUser,
    });
  });

  it('should error if email already in use', async () => {
    console.log(
      await mockUserRepository.findOne({ where: registerUser.email }),
    );
    try {
      await service.createUser(registerUser);
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
    }
  });
});
