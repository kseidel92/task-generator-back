import { List } from '@domain';
import { TaskResponseDto } from './task-response.dto';

export class ListResponseDto {
  id: string;
  prompt: string;
  tasks: TaskResponseDto[];
  createdAt: string;

  static fromDomain(list: List): ListResponseDto {
    const dto = new ListResponseDto();
    dto.id = list.id;
    dto.prompt = list.prompt;
    dto.createdAt = list.createdAt;
    dto.tasks = list.tasks.map(TaskResponseDto.fromDomain);
    return dto;
  }
}
