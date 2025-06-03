import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { QueryParamDto } from '@/common/dto/query-param.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { ProfileImageValidatorPipe } from '@/image-store/pipes/profile-image-validartion.pipe';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserSwaggerDoc } from './swagger/create-user-swagger';
import { GetUserSwaggerDoc } from './swagger/find-one-user-swagger';
import { SearchUsersSwaggerDoc } from './swagger/search-users-swagger';
import { FollowUsersSwaggerDoc } from './swagger/get-follow-swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @CreateUserSwaggerDoc()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('profileImage', {
      storage: multer.memoryStorage(),
    }),
  )
  @Post()
  create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile(ProfileImageValidatorPipe) file: Express.Multer.File,
  ) {
    return this.userService.create({ createUserDto, file });
  }

  @SearchUsersSwaggerDoc()
  @Get()
  search(@Query() query: QueryParamDto) {
    return this.userService.search(query);
  }

  @GetUserSwaggerDoc()
  @HttpCode(HttpStatus.OK)
  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.userService.findOne(username);
  }

  @FollowUsersSwaggerDoc('followings')
  @HttpCode(HttpStatus.OK)
  @Get(':username/followings')
  getFollowings(
    @Param('username') username: string,
    @Query() query: PaginationDto,
  ) {
    return this.userService.getFollowings({ username, query });
  }

  @FollowUsersSwaggerDoc('followed')
  @HttpCode(HttpStatus.OK)
  @Get(':username/followers')
  getFollowers(
    @Param('username') username: string,
    @Query() query: PaginationDto,
  ) {
    return this.userService.getFollowers({ username, query });
  }
}
