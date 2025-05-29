import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserSwaggerDoc } from './swagger/create-user-swagger';
import { GetUserSwaggerDoc } from './swagger/find-one-user-swagger';
import { QueryParamDto } from '@/common/dto/query-param.dto';
import { SearchUsersSwaggerDoc } from './swagger/search-users-swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @CreateUserSwaggerDoc()
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @SearchUsersSwaggerDoc()
  @Get()
  findAll(@Query() query: QueryParamDto) {
    return this.userService.findAll(query);
  }

  @GetUserSwaggerDoc()
  @HttpCode(HttpStatus.OK)
  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.userService.findOne(username);
  }
}
