import { Injectable } from '@nestjs/common';
import { List, ListRepository } from '@domain';

@Injectable()
export class GetListsUseCase {
  constructor(private readonly listRepository: ListRepository) {}

  async execute(): Promise<List[]> {
    return this.listRepository.findAll();
  }
}
