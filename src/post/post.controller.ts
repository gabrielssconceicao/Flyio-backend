import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
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
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';

@ApiCookieAuth('access_token')
@UseGuards(JwtAuthGuard)
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseInterceptors(
    FilesInterceptor('images', 4, {
      storage: multer.memoryStorage(),
    }),
  )
  @Post()
  create(
    @Body() createPostDto: CreatePostDto,
    @CurrentUser() payload: JwtPayload,
  ) {
    return this.postService.create({ createPostDto, payload });
  }

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
