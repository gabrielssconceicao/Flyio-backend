import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiCookieAuth } from '@nestjs/swagger';
import * as multer from 'multer';
import { CurrentUser } from '@/common/params/current-user.params';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { JwtAuthGuard } from '@/common/guard/jwt-auth.guard';
import { QueryParamDto } from '@/common/dto/query-param.dto';
import { ProtectedRouteSwaggerDoc } from '@/common/utils/protected-route-swagger';
import { PostImageValidatorPipe } from '@/image-store/pipes/post-image-validatitor.pipe';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreatePostSwaggerDoc } from './swagger/create-post-swagger';
import { DeletePostSwaggerDoc } from './swagger/delete-post-swagger';

@ProtectedRouteSwaggerDoc()
@ApiCookieAuth('access_token')
@UseGuards(JwtAuthGuard)
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @CreatePostSwaggerDoc()
  @UseInterceptors(
    FilesInterceptor('images', 4, {
      storage: multer.memoryStorage(),
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(
    @UploadedFiles(PostImageValidatorPipe) images: Express.Multer.File[],
    @Body() createPostDto: CreatePostDto,
    @CurrentUser() payload: JwtPayload,
  ) {
    return this.postService.create({ createPostDto, payload, images });
  }

  @DeletePostSwaggerDoc()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':postId')
  delete(@Param('postId') postId: string, @CurrentUser() payload: JwtPayload) {
    return this.postService.delete({ postId, payload });
  }

  @Get(':postId')
  findOne(@Param('postId') postId: string, @CurrentUser() payload: JwtPayload) {
    return this.postService.findOne({ postId, payload });
  }

  @Get()
  findAll(@CurrentUser() payload: JwtPayload, @Query() query: QueryParamDto) {
    return this.postService.findAll({ payload, query });
  }
}
