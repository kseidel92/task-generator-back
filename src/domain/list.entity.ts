import { Task } from './task.entity';
import { v4 as uuidv4 } from 'uuid';

export class List {
  public readonly id: string;
  public readonly prompt: string;
  public tasks: Task[];
  public readonly createdAt: string;

  constructor(props: { id?: string; prompt: string; tasks: Task[]; createdAt?: string }) {
    this.id = props.id ?? uuidv4();
    this.prompt = props.prompt;
    this.tasks = props.tasks;
    this.createdAt = props.createdAt ?? new Date().toISOString();
  }

  public updateTaskCompletion(taskIndex: number, isCompleted: boolean): void {
    const task = this.tasks.find((t) => t.index === taskIndex);
    if (task) {
      task.isCompleted = isCompleted;
    } else {
      throw new Error(`Task with index ${taskIndex} not found in list ${this.id}`);
    }
  }

  public deleteTask(taskIndex: number): void {
    const initialLength = this.tasks.length;
    this.tasks = this.tasks.filter((t) => t.index !== taskIndex);
    if (this.tasks.length === initialLength) {
      throw new Error(`Task with index ${taskIndex} not found in list ${this.id}`);
    }
  }
}
