import { IsNotEmpty, IsString } from 'class-validator';

export class CreateListDto {
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @IsString()
  @IsNotEmpty()
  openRouterApiKey: string;
}
