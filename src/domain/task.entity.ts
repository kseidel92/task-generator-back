export class Task {
  public readonly id: string;
  public index: number;
  public readonly title: string;
  public isCompleted: boolean;
  public readonly createdAt: string;

  constructor(props: {
    id?: string;
    index: number;
    title: string;
    isCompleted: boolean;
    createdAt: string;
  }) {
    this.id = props.id;
    this.index = props.index;
    this.title = props.title;
    this.isCompleted = props.isCompleted;
    this.createdAt = props.createdAt;
  }

  public complete(): void {
    this.isCompleted = true;
  }

  public uncomplete(): void {
    this.isCompleted = false;
  }
}
