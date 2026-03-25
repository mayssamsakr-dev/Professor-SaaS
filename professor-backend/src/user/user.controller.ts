import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

import { UserRole } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard) // ✔ تفعيل الحماية
@Controller('users')
export class UserController {

  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(UserRole.OWNER)
  create(
    @Body() createUserDto: CreateUserDto,
    @Req() req: any,
  ) {

    return this.userService.create(
      createUserDto,
      req.user.tenantId,
    );

  }

  @Get()
  @Roles(UserRole.OWNER, UserRole.USER)
  findAll(@Req() req: any) {

    return this.userService.findAll(
      req.user.tenantId
    );

  }

}