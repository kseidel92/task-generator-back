import { Injectable, NotFoundException } from '@nestjs/common';
import { ListRepository } from '@domain';
import { TypeOrmListRepository } from 'src/infrastructure/typeorm';

@Injectable()
export class DeleteTaskUseCase {
  constructor(
    private readonly listRepository: ListRepository,
    private readonly typeOrmListRepository: TypeOrmListRepository,
  ) {}

  async execute(listId: string, taskIndex: number): Promise<void> {
    const list = await this.listRepository.findById(listId);

    if (!list) {
      throw new NotFoundException(`List with ID ${listId} not found.`);
    }

    // Encontra a tarefa no modelo de domínio para obter o ID da tarefa
    const taskToDelete = list.tasks.find((t) => t.index === taskIndex);

    if (!taskToDelete) {
      throw new NotFoundException(`Task with index ${taskIndex} not found in list ${listId}`);
    }

    // Deleta a tarefa diretamente do banco de dados
    await this.typeOrmListRepository.deleteTask(listId, taskIndex);

    // Remove a tarefa do modelo de domínio
    list.deleteTask(taskIndex);

    // Reindexa as tarefas restantes no modelo de domínio
    list.tasks.forEach((task, index) => {
      task.index = index + 1;
    });

    // Salva a lista para persistir a reindexação
    await this.listRepository.save(list);
  }
}
