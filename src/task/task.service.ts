import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from 'src/interface/task.interface';
@Injectable()
export class TaskService {
    constructor(@InjectModel('Task') private readonly taskModel: Model<Task>) { }
    async findAll(): Promise<Task[]> {
        return this.taskModel.find();
    }
    async createTask(task: Task): Promise<Task> {
        const newTask = new this.taskModel(task)
        return await newTask.save();
    }
    async getOne(id: string): Promise<Task> {
        const task = await this.taskModel.findById(id);
        if (!task) {
            throw new NotFoundException('Task Not Found')
        }
        return task;
    }
    async updateTask(id: string, task: Task): Promise<Task> {
        const newTask = await this.taskModel.findById(id);
        if (!task) {
            throw new NotFoundException('Task Not Found')
        }
        newTask.name = task.name;
        newTask.completed = task.completed;
        return await newTask.save();
    }


}