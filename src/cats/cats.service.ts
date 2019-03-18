import { Injectable } from '@nestjs/common';
import { Cat } from './cats.interface';

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [
    {
      name: 'rocco',
      age: 1,
      breed: 'LaPerm',
    },
    {
      name: 'mormont',
      age: 0.8,
      breed: 'Birman',
    },
  ];

  findAll(): Cat[] {
    return this.cats;
  }

  create(cat: Cat) {
    this.cats.push(cat);
  }
}
