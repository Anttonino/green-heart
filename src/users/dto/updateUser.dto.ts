import { IsNotEmpty } from 'class-validator';

interface Posting {
  id: number;
}

export class UpdateUserDto {
  @IsNotEmpty()
  id: string;

  username: string;

  email: string;

  name: string;

  photo: string;

  posting: Posting[];
}
