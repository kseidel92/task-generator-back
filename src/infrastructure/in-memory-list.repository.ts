import { Injectable } from '@nestjs/common';
import { List, ListRepository } from '@domain';

@Injectable()
export class InMemoryListRepository implements ListRepository {
  private lists: List[] = [];

  async save(list: List): Promise<List> {
    const index = this.lists.findIndex((l) => l.id === list.id);
    if (index !== -1) {
      this.lists[index] = list; // Update
    } else {
      this.lists.push(list); // Create
    }
    return list;
  }

  async findAll(): Promise<List[]> {
    return this.lists;
  }

  async findById(id: string): Promise<List | null> {
    return this.lists.find((l) => l.id === id) || null;
  }

  async delete(id: string): Promise<void> {
    const initialLength = this.lists.length;
    this.lists = this.lists.filter((l) => l.id !== id);
    if (this.lists.length === initialLength) {
      throw new Error(`List with ID ${id} not found.`);
    }
  }
}
