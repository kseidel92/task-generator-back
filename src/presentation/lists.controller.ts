import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  CreateListUseCase,
  GetListsUseCase,
  UpdateTaskUseCase,
  DeleteTaskUseCase,
} from '../application';
import { CreateListDto } from './dtos/create-list.dto';
import { ListResponseDto } from './dtos/list-response.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';

@Controller('lists')
export class ListsController {
  constructor(
    private readonly createListUseCase: CreateListUseCase,
    private readonly getListsUseCase: GetListsUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createList(@Body() createListDto: CreateListDto): Promise<ListResponseDto> {
    const list = await this.createListUseCase.execute(
      createListDto.prompt,
      createListDto.openRouterApiKey,
    );
    return ListResponseDto.fromDomain(list);
  }

  @Get()
  async getLists(): Promise<ListResponseDto[]> {
    const lists = await this.getListsUseCase.execute();
    return lists.map(ListResponseDto.fromDomain);
  }

  @Patch(':listId/tasks/:taskIndex')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateTask(
    @Param('listId') listId: string,
    @Param('taskIndex') taskIndex: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<void> {
    await this.updateTaskUseCase.execute(
      listId,
      parseInt(taskIndex, 10),
      updateTaskDto.isCompleted,
    );
  }

  @Delete(':listId/tasks/:taskIndex')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTask(
    @Param('listId') listId: string,
    @Param('taskIndex') taskIndex: string,
  ): Promise<void> {
    await this.deleteTaskUseCase.execute(listId, parseInt(taskIndex, 10));
  }
}
