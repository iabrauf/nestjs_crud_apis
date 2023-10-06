import { ApiProperty } from '@nestjs/swagger';
export class TaskDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    completed: boolean;
}