import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common/decorators';
import { HttpStatus } from '@nestjs/common/enums';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger/dist';

import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { User } from '../entities/users.entity';
import { UserService } from '../services/user.services';
import { UpdateUserDto } from '../dto/updateUser.dto';

@ApiTags('User')
@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/all')
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/:user')
  @HttpCode(HttpStatus.OK)
  findByUser(@Param('user') user: string): Promise<User> {
    return this.userService.findByUser(user);
  }

  @Post('/sign_up')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() user: User): Promise<User> {
    return this.userService.create(user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('/update')
  @HttpCode(HttpStatus.OK)
  async update(@Body() user: UpdateUserDto): Promise<UpdateUserDto> {
    return this.userService.update(user);
  }
}
