import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from 'src/interface/task.interface';
import { Message } from 'src/interface/task.interface';


@Controller('tasks')
export class TaskController {
    constructor(private readonly taskService: TaskService) { }
    @Get()
    getAllTasks(): Promise<Task[]> {
        try {
            return this.taskService.findAll();
        } catch (error) {
            throw new BadRequestException('Something bad happened');
        }
    }
    @Get(':id')
    getOneTask(@Param('id') id: string): Promise<Task> {
        return this.taskService.getOne(id);
    }

    @Post()
    async createTask(@Body() task: Task): Promise<Task> {
        return await this.taskService.createTask(task);
    }

    @Put(':id')
    updateTask(
        @Param('id') id: string,
        @Body() task: Task
    ) {
        return this.taskService.updateTask(id, task);
    }

    @Delete(':id')
    async deleteTask(@Param('id') id: string): Promise<Message> {
        try {
            await this.taskService.deleteTask(id);
            return { success: true, message: `Record deleted successfully.` };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            }
            else {
                throw new BadRequestException(error.message)
            }
        }
    }
}
