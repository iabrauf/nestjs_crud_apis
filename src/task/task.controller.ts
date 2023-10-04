import { BadRequestException, Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from 'src/interface/task.interface';
import mongoose from 'mongoose';

@Controller('task')
export class TaskController {
    constructor(private readonly taskService: TaskService) { }
    @Get()
    getAllTasks(): Promise<Task[]> {
        try {
            return this.taskService.findAll();
        } catch (error) {
            throw new BadRequestException('Something bad happened')
        }
    }
    @Get(':id')
    getOneTask(@Param('id') id: string): Promise<Task> {
        if (!mongoose.isValidObjectId(id)) {
            throw new BadRequestException('id is not valid')
        }
        return this.taskService.getOne(id)
    }
    @Post()
    createTask(@Body() task: Task): Promise<Task> {
        if (!task.name || !task.completed) {
            throw new BadRequestException('Name or Completed is missing')
        }
        return this.taskService.createTask(task);
    }
    @Put(":id")
    updateTask(@Param('id') id: string, @Body() task: Task) {
        if (!mongoose.isValidObjectId(id)) {
            throw new BadRequestException('id is not valid')
        }
        if (!task.name) {
            throw new BadRequestException('Name or Completed is missing')
        }
        return this.taskService.updateTask(id, task)
    }
}
