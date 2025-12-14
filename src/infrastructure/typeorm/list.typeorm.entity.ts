import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TaskTypeOrmEntity } from './task.typeorm.entity';

@Entity('list')
export class ListTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  prompt: string;

  @Column()
  createdAt: string;

  @OneToMany(() => TaskTypeOrmEntity, (task) => task.list, { cascade: true })
  tasks: TaskTypeOrmEntity[];
}
