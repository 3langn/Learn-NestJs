import { Body, Controller, Post } from '@nestjs/common';

import { UserService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UserService) {}
}
