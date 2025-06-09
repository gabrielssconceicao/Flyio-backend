import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';

type CreatePost = {
  createPostDto: CreatePostDto;
  payload: JwtPayload;
};

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async create({ createPostDto, payload }: CreatePost) {
    const post = await this.prisma.post.create({
      data: {
        text: createPostDto.content,
        authorId: payload.id,
      },
      select: {
        id: true,
        text: true,
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            profileImg: true,
          },
        },
      },
    });

    return { post };
  }
}
