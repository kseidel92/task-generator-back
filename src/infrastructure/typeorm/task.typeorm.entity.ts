import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ListTypeOrmEntity } from './list.typeorm.entity';

@Entity('task')
export class TaskTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  index: number;

  @Column()
  title: string;

  @Column({ default: false })
  isCompleted: boolean;

  @Column()
  createdAt: string;

  @Column()
  listId: string;

  @ManyToOne(() => ListTypeOrmEntity, (list) => list.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'listId' })
  list: ListTypeOrmEntity;
}
