import { Test, TestingModule } from '@nestjs/testing';
import { payloadMock } from '@/auth/mock/token-payload.mock';
import { findManyPostMock, findOnePostMock, postMock } from '../mock';
import { PostService } from '../post.service';
import {
  CreatePostUseCase,
  DeletePostUseCase,
  FindManyPostUseCase,
  FindOnePostUseCase,
  ReplyPostUseCase,
} from '../use-cases';

const mock = {
  execute: jest.fn(),
};

describe('PostService', () => {
  let service: PostService;
  let createPost: CreatePostUseCase;
  let deletePost: DeletePostUseCase;
  let findOnePost: FindOnePostUseCase;
  let findManyPost: FindManyPostUseCase;
  let replyPost: ReplyPostUseCase;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: CreatePostUseCase,
          useValue: mock,
        },
        {
          provide: DeletePostUseCase,
          useValue: mock,
        },
        {
          provide: FindOnePostUseCase,
          useValue: mock,
        },
        {
          provide: FindManyPostUseCase,
          useValue: mock,
        },
        {
          provide: ReplyPostUseCase,
          useValue: mock,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);

    createPost = module.get<CreatePostUseCase>(CreatePostUseCase);
    deletePost = module.get<DeletePostUseCase>(DeletePostUseCase);
    findOnePost = module.get<FindOnePostUseCase>(FindOnePostUseCase);
    findManyPost = module.get<FindManyPostUseCase>(FindManyPostUseCase);
    replyPost = module.get<ReplyPostUseCase>(ReplyPostUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();

    expect(createPost).toBeDefined();
    expect(deletePost).toBeDefined();
    expect(findOnePost).toBeDefined();
    expect(findManyPost).toBeDefined();
    expect(replyPost).toBeDefined();
  });

  it('should create a post', async () => {
    jest.spyOn(createPost, 'execute').mockResolvedValue(postMock());
    const body = {
      createPostDto: {
        content: 'Text',
      },
      payload: payloadMock,
      images: [],
    };
    const result = await service.create(body);
    expect(createPost.execute).toHaveBeenCalledWith(body);
    expect(result).toBeDefined();
    expect(result).toMatchSnapshot();
  });

  it('should delete a post', async () => {
    await service.delete({ payload: payloadMock, postId: 'id-1' });
    expect(deletePost.execute).toHaveBeenCalled();
  });

  it('should find a post', async () => {
    jest.spyOn(findOnePost, 'execute').mockResolvedValue(findOnePostMock());

    const result = await service.findOne({
      payload: payloadMock,
      postId: 'id-1',
    });

    expect(findOnePost.execute).toHaveBeenCalledWith({
      payload: payloadMock,
      postId: 'id-1',
    });
    expect(result).toBeDefined();
    expect(result).toMatchSnapshot();
  });

  it('should search posts', async () => {
    jest.spyOn(findManyPost, 'execute').mockResolvedValue(findManyPostMock());
    const body = {
      payload: payloadMock,
      query: {},
    };
    const result = await service.findMany(body);

    expect(findManyPost.execute).toHaveBeenCalledWith(body);
    expect(result).toBeDefined();
    expect(result).toEqual(findManyPostMock());
    expect(result).toMatchSnapshot();
  });

  it('should reply a post', async () => {
    jest.spyOn(replyPost, 'execute').mockResolvedValue({
      ...postMock(),
      parent: {
        author: { username: 'janedoe' },
      },
    });
    const body = {
      createPostDto: { content: 'Reply' },
      images: [],
      payload: payloadMock,
      postId: 'id-2',
    };
    const result = await service.reply(body);
    expect(replyPost.execute).toHaveBeenCalledWith(body);
    expect(result).toBeDefined();
    expect(result).toMatchSnapshot();
  });
});
