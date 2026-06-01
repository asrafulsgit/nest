import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get(':id')
  getUserPosts(@Param('id', ParseIntPipe) userId: number) {
    return this.postsService.getUserPost(userId);
  }
}
