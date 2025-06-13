import {
  Controller,
  Get,
  Patch,
  Delete,
  UseGuards,
  HttpStatus,
  Body,
  HttpCode,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';

import { JwtAuthGuard } from '@/common/guard/jwt-auth.guard';
import { CurrentUser } from '@/common/params/current-user.params';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';

import { UpdateMeDto } from './dto/update-me.dto';
import { MeService } from './me.service';
import { CurrentUserEntity } from './entities/current-user.entity';
import { ProfileImageValidatorPipe } from '@/image-store/pipes/profile-image-validatitor.pipe';
import { UpdateMeSwaggerDoc } from './swagger/update-me-swagger';
import { ProtectedRouteSwaggerDoc } from '@/common/utils/protected-route-swagger';

@ApiCookieAuth('access_token')
@UseGuards(JwtAuthGuard)
@ProtectedRouteSwaggerDoc()
@Controller('me')
export class MeController {
  constructor(private readonly meService: MeService) {}

  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User found successfully',
    type: CurrentUserEntity,
  })
  @Get()
  getMe(@CurrentUser() payload: JwtPayload) {
    return this.meService.getMe(payload);
  }

  @UpdateMeSwaggerDoc()
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
  @Patch()
  updateMe(
    @CurrentUser() payload: JwtPayload,
    @Body() updateMeDto: UpdateMeDto,
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
    return this.meService.updateMe({
      payload,
      updateMeDto,
      profileImage: validatedProfile,
      bannerImage: validatedBanner,
    });
  }

  @ApiOperation({ summary: 'Desactivate current user' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'User desactivated successfully',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  desactivateMe(@CurrentUser() payload: JwtPayload) {
    return this.meService.desactivateMe(payload);
  }

  @ApiOperation({ summary: 'Delete profile image' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Profile image deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error deleting profile image',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('profile-image')
  deleteProfileImage(@CurrentUser() payload: JwtPayload) {
    return this.meService.deleteProfileImage({ payload });
  }

  @ApiOperation({ summary: 'Delete banner image' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Banner image deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error deleting profile image',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('banner-image')
  deleteBannerImage(@CurrentUser() payload: JwtPayload) {
    return this.meService.deleteBannerImage({ payload });
  }
}
