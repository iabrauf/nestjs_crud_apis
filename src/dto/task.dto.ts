import { ApiProperty } from '@nestjs/swagger';
export class TaskDto {
    @ApiProperty()
    username: string;

    @ApiProperty()
    task: string;

    @ApiProperty()
    completed: boolean;
}