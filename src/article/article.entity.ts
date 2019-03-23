import { Entity, Column } from 'typeorm';
import { Common } from 'src/common/entity/common';

@Entity()
export class Article extends Common {
  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  cover: string;

  @Column({ type: 'varchar', nullable: true })
  link: string;

  @Column({ type: 'varchar', nullable: true })
  platform: string;

  @Column({ type: 'int', default: 0 })
  views: number;
}
