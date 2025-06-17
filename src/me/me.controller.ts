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
import { ApiCookieAuth } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';

import { JwtAuthGuard } from '@/common/guard/jwt-auth.guard';
import { CurrentUser } from '@/common/params/current-user.params';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { ProtectedRouteSwaggerDoc } from '@/common/utils/protected-route-swagger';

import { ProfileImageValidatorPipe } from '@/image-store/pipes/profile-image-validatitor.pipe';

import { UpdateMeDto } from './dto/update-me.dto';
import { MeService } from './me.service';
import {
  UpdateMeSwaggerDoc,
  DeleteImageSwaggerDoc,
  DesactivateMeSwaggerDoc,
  GetMeSwaggerDoc,
} from './swagger';

@ApiCookieAuth('access_token')
@UseGuards(JwtAuthGuard)
@ProtectedRouteSwaggerDoc()
@Controller('me')
export class MeController {
  constructor(private readonly meService: MeService) {}

  @GetMeSwaggerDoc()
  @Get()
  getMe(@CurrentUser() payload: JwtPayload) {
    return this.meService.get(payload);
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
    return this.meService.update({
      payload,
      updateMeDto,
      profileImage: validatedProfile,
      bannerImage: validatedBanner,
    });
  }

  @DesactivateMeSwaggerDoc()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  desactivateMe(@CurrentUser() payload: JwtPayload) {
    return this.meService.desactivate(payload);
  }

  @DeleteImageSwaggerDoc('profile')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('profile-image')
  deleteProfileImage(@CurrentUser() payload: JwtPayload) {
    return this.meService.deleteProfileImage({ payload });
  }

  @DeleteImageSwaggerDoc('banner')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('banner-image')
  deleteBannerImage(@CurrentUser() payload: JwtPayload) {
    return this.meService.deleteBannerImage({ payload });
  }
}
