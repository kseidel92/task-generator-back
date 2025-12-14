import { Task } from './task.entity';

export abstract class TaskGeneratorService {
  abstract generateTasks(objective: string, apiKey: string): Promise<Task[]>;
}
