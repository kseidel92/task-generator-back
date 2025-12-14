import { Task } from '@domain';

export class TaskResponseDto {
  index: number;
  title: string;
  isCompleted: boolean;
  createdAt: string;

  static fromDomain(task: Task): TaskResponseDto {
    const dto = new TaskResponseDto();
    dto.index = task.index;
    dto.title = task.title;
    dto.isCompleted = task.isCompleted;
    dto.createdAt = task.createdAt;
    return dto;
  }
}
