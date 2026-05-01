import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ProjectRole } from '@prisma/client';

export class AddMemberDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsEnum(ProjectRole)
  @IsNotEmpty()
  role: ProjectRole;
}
