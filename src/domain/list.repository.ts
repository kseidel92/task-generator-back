import { List } from './list.entity';

export abstract class ListRepository {
  abstract save(list: List): Promise<List>;
  abstract findAll(): Promise<List[]>;
  abstract findById(id: string): Promise<List | null>;
  abstract delete(id: string): Promise<void>;
}
