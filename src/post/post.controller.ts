import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { CurrentUser } from '@/common/params/current-user.params';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { JwtAuthGuard } from '@/common/guard/jwt-auth.guard';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { ApiCookieAuth } from '@nestjs/swagger';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiCookieAuth('access_token')
  @UseGuards(JwtAuthGuard)
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

  @ApiCookieAuth('access_token')
  @UseGuards(JwtAuthGuard)
  @Delete(':postId')
  delete(@Param('postId') postId: string, @CurrentUser() payload: JwtPayload) {
    return this.postService.delete({ postId, payload });
  }

  @Get(':postId')
  findOne(@Param('postId') postId: string) {
    return this.postService.findOne({ postId });
  }
}
