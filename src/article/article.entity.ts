import { Entity, Column } from 'typeorm';
import { Common } from 'src/common/entity/common';

@Entity()
export class Article extends Common {
  @Column({ type: 'varchar', default: '' })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  cover: string;

  @Column({ type: 'varchar', nullable: true })
  author: string;

  @Column({ type: 'varchar', nullable: true })
  authorLink: string;

  @Column({ type: 'date', nullable: true })
  createTime: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'varchar', nullable: true })
  originUrl: string;

  @Column({ type: 'int', default: 0 })
  views: number;
}
