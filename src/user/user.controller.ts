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
  UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
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
    FileFieldsInterceptor(
      [
        { name: 'profileImg', maxCount: 1 },
        { name: 'bannerImg', maxCount: 1 },
      ],
      {
        storage: multer.memoryStorage(),
      },
    ),
  )
  @Post()
  create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFiles()
    files: {
      profileImg?: Express.Multer.File[];
      bannerImg?: Express.Multer.File[];
    },
  ) {
    const profileImage = files.profileImg?.[0];
    const bannerImage = files.bannerImg?.[0];

    const validatedProfile = new ProfileImageValidatorPipe().transform(
      profileImage,
      {
        type: 'body',
        data: '',
        metatype: undefined,
      },
    );

    const validatedBanner = new ProfileImageValidatorPipe().transform(
      bannerImage,
      {
        type: 'body',
        data: '',
        metatype: undefined,
      },
    );
    return this.userService.create({
      createUserDto,
      profileImage: validatedProfile,
      bannerImage: validatedBanner,
    });
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
