import { Injectable, NotFoundException } from '@nestjs/common';
import { ListRepository } from '@domain';

@Injectable()
export class UpdateTaskUseCase {
  constructor(private readonly listRepository: ListRepository) {}

  async execute(listId: string, taskIndex: number, isCompleted: boolean): Promise<void> {
    const list = await this.listRepository.findById(listId);

    if (!list) {
      throw new NotFoundException(`List with ID ${listId} not found.`);
    }

    try {
      list.updateTaskCompletion(taskIndex, isCompleted);
      await this.listRepository.save(list);
    } catch (error) {
      if (error.message.includes('not found in list')) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
