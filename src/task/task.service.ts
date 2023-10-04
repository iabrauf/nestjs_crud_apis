import mongoose, { Model } from 'mongoose';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from 'src/interface/task.interface';
import { Delete } from 'src/interface/task.interface';
@Injectable()
export class TaskService {
    constructor(@InjectModel('Task') private readonly taskModel: Model<Task>) { }
    async findAll(): Promise<Task[]> {
        return this.taskModel.find();
    }
    async createTask(task: Task): Promise<Task> {
        if (!task.name || !task.completed) {
            throw new BadRequestException('Name or Completed is missing');
        }
        const newTask = new this.taskModel(task)
        return await newTask.save();
    }
    async getOne(id: string): Promise<Task> {
        if (!mongoose.isValidObjectId(id)) {
            throw new BadRequestException('id is not valid');
        }
        const task = await this.taskModel.findById(id);
        if (!task) {
            throw new NotFoundException('Task Not Found')
        }
        return task;
    }
    async updateTask(id: string, task: Task): Promise<Task> {
        if (!mongoose.isValidObjectId(id)) {
            throw new BadRequestException('id is not valid')
        }
        if (!task.name) {
            throw new BadRequestException('Name or Completed is missing')
        }
        const newTask = await this.taskModel.findById(id);
        if (!newTask) {
            throw new NotFoundException('Task Not Found')
        }
        newTask.name = task.name;
        newTask.completed = task.completed;
        return await newTask.save();
    }
    async deleteTask(id: string): Promise<Delete> {
        if (!mongoose.isValidObjectId(id)) {
            throw new BadRequestException('id is not valid')
        }
        const newTask = await this.taskModel.findById(id);
        if (!newTask) {
            throw new NotFoundException('Task Not Found')
        }
        return await this.taskModel.deleteOne({ _id: id });
    }

}