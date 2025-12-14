import { Injectable } from '@nestjs/common';
import { List, ListRepository, TaskGeneratorService } from '@domain';

@Injectable()
export class CreateListUseCase {
  constructor(
    private readonly listRepository: ListRepository,
    private readonly taskGeneratorService: TaskGeneratorService,
  ) {}

  async execute(prompt: string, openRouterApiKey: string): Promise<List> {
    const tasks = await this.taskGeneratorService.generateTasks(prompt, openRouterApiKey);

    const newList = new List({
      prompt,
      tasks,
    });

    const savedList = await this.listRepository.save(newList);

    return savedList;
  }
}
