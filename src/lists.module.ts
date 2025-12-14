import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListRepository, TaskGeneratorService } from '@domain';
import {
  CreateListUseCase,
  GetListsUseCase,
  UpdateTaskUseCase,
  DeleteTaskUseCase,
} from '@application';
import { ListsController } from '@presentation';

import { OpenRouterTaskGeneratorService as OpenRouterService } from '@infrastructure';
import {
  ListTypeOrmEntity,
  TaskTypeOrmEntity,
  TypeOrmListRepository,
} from './infrastructure/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ListTypeOrmEntity, TaskTypeOrmEntity])],
  controllers: [ListsController],
  providers: [
    {
      provide: ListRepository,
      useClass: TypeOrmListRepository,
    },
    TypeOrmListRepository, // Adicionado para injeção direta no DeleteTaskUseCase
    {
      provide: TaskGeneratorService,
      useClass: OpenRouterService,
    },

    CreateListUseCase,
    GetListsUseCase,
    UpdateTaskUseCase,
    DeleteTaskUseCase,
  ],
})
export class ListsModule {}
