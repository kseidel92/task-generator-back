import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { List, ListRepository, Task } from '@domain';
import { ListTypeOrmEntity } from './list.typeorm.entity';
import { TaskTypeOrmEntity } from './task.typeorm.entity';

@Injectable()
export class TypeOrmListRepository implements ListRepository {
  constructor(
    @InjectRepository(ListTypeOrmEntity)
    private readonly listRepository: Repository<ListTypeOrmEntity>,
    @InjectRepository(TaskTypeOrmEntity)
    private readonly taskRepository: Repository<TaskTypeOrmEntity>,
  ) {}

  private toDomain(entity: ListTypeOrmEntity): List {
    const tasks = entity.tasks.map(
      (taskEntity) =>
        new Task({
          id: taskEntity.id, // Adicionado o ID da tarefa
          index: taskEntity.index,
          title: taskEntity.title,
          isCompleted: taskEntity.isCompleted,
          createdAt: taskEntity.createdAt,
        }),
    );

    return new List({
      id: entity.id,
      prompt: entity.prompt,
      tasks: tasks,
      createdAt: entity.createdAt,
    });
  }

  private toTypeOrm(domain: List): ListTypeOrmEntity {
    const entity = new ListTypeOrmEntity();
    entity.id = domain.id;
    entity.prompt = domain.prompt;
    entity.createdAt = domain.createdAt;
    entity.tasks = domain.tasks.map((task) => {
      const taskEntity = new TaskTypeOrmEntity();
      taskEntity.id = task.id; // Adicionado o ID da tarefa
      taskEntity.index = task.index;
      taskEntity.title = task.title;
      taskEntity.isCompleted = task.isCompleted;
      taskEntity.createdAt = task.createdAt;
      taskEntity.listId = domain.id;
      return taskEntity;
    });
    return entity;
  }

  async save(list: List): Promise<List> {
    const entity = this.toTypeOrm(list);

    // 1. Salva a entidade List
    const savedListEntity = await this.listRepository.save(entity);

    // 2. Prepara as entidades Task para salvar, garantindo o listId
    const taskEntities = entity.tasks.map((task) => {
      const taskEntity = new TaskTypeOrmEntity();
      taskEntity.id = task.id; // Agora o ID está no modelo de domínio e é mapeado
      taskEntity.index = task.index;
      taskEntity.title = task.title;
      taskEntity.isCompleted = task.isCompleted;
      taskEntity.createdAt = task.createdAt;
      taskEntity.listId = savedListEntity.id; // Garante que o listId está definido
      return taskEntity;
    });

    // 3. Salva as entidades Task
    // Como a relação OneToMany na ListTypeOrmEntity não tem { cascade: true } (está no ListTypeOrmEntity),
    // e a lógica de exclusão é manual, salvar a lista não salva as tarefas corretamente.
    // Precisamos salvar as tarefas usando o taskRepository.
    await this.taskRepository.save(taskEntities);

    // 4. Recarrega a entidade para ter as tarefas com IDs gerados (se for o caso)
    const reloadedEntity = await this.listRepository.findOne({
      where: { id: savedListEntity.id },
      relations: ['tasks'],
    });

    return this.toDomain(reloadedEntity || savedListEntity);
  }

  async findAll(): Promise<List[]> {
    const entities = await this.listRepository.find({ relations: ['tasks'] });
    return entities.map(this.toDomain);
  }

  async findById(id: string): Promise<List | null> {
    const entity = await this.listRepository.findOne({ where: { id }, relations: ['tasks'] });
    return entity ? this.toDomain(entity) : null;
  }

  async delete(id: string): Promise<void> {
    const result = await this.listRepository.delete(id);
    if (result.affected === 0) {
      throw new Error(`List with ID ${id} not found.`);
    }
  }

  async deleteTask(listId: string, taskIndex: number): Promise<void> {
    await this.taskRepository.delete({ listId, index: taskIndex });
  }
}
