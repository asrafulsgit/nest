import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

type Post = {
  id: number;
  title: string;
  content: string;
  isPublished: boolean;
  userId: number;
  createdAt: string;
};

@Injectable()
export class PostsService {
  constructor(private readonly userService: UsersService) {}
  posts: Post[] = [
    {
      id: 1,
      title: 'Getting Started with TypeScript',
      content:
        'TypeScript helps developers write safer and scalable JavaScript code.',
      isPublished: true,
      userId: 1, // Md Asraful Islam
      createdAt: '2025-05-01',
    },
    {
      id: 2,
      title: 'NestJS Dependency Injection',
      content:
        'Dependency Injection in NestJS makes code modular and maintainable.',
      isPublished: true,
      userId: 1, // Md Asraful Islam
      createdAt: '2025-05-03',
    },
    {
      id: 3,
      title: 'My Daily Routine',
      content:
        'Today I focused on improving my productivity and learning new things.',
      isPublished: true,
      userId: 2, // Rahim Uddin
      createdAt: '2025-05-05',
    },
    {
      id: 4,
      title: 'Travel Experience in Cox’s Bazar',
      content:
        'Cox’s Bazar is one of the most beautiful places I have visited.',
      isPublished: false,
      userId: 2, // Rahim Uddin
      createdAt: '2025-05-10',
    },
    {
      id: 5,
      title: 'Content Moderation Tips',
      content:
        'Being a moderator requires patience and good decision-making skills.',
      isPublished: true,
      userId: 3, // Nusrat Jahan
      createdAt: '2025-05-15',
    },
    {
      id: 6,
      title: 'Fitness and Healthy Lifestyle',
      content:
        'Regular exercise and healthy food can improve overall well-being.',
      isPublished: false,
      userId: 4, // Tanvir Ahmed
      createdAt: '2025-05-18',
    },
    {
      id: 7,
      title: 'JavaScript Array Methods',
      content:
        'Array methods like map, filter, and reduce are very useful in JS.',
      isPublished: true,
      userId: 4, // Tanvir Ahmed
      createdAt: '2025-05-20',
    },
  ];

  getUserPost(userId: number) {
    const user = this.userService.users.find((u) => u.id === userId);
    const posts = this.posts.filter((p) => p.userId === userId);
    return {
      user,
      posts,
    };
  }
}
