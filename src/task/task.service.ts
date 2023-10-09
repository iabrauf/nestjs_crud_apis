import mongoose, { Model } from 'mongoose';
import { BadRequestException, Injectable, NotFoundException, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from 'src/interface/task.interface';
import { Delete } from 'src/interface/task.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TaskService {
    constructor(@InjectModel('Task') private readonly taskModel: Model<Task>, private jwtService: JwtService) { }
    async findAll(req): Promise<Task[]> {
        console.log(req.user);

        return this.taskModel.find();
    }


    async createTask(task: Task): Promise<Task> {
        if (!task.username || !task.task) {
            throw new BadRequestException('username, task or Completed is missing');
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
        if (!task.task || !task.username) {
            throw new BadRequestException('username, task or Completed is missing')
        }
        const newTask = await this.taskModel.findById(id);
        if (!newTask) {
            throw new NotFoundException('Task Not Found')
        }
        newTask.task = task.task;
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



    async login(username: string) {

        if (!username) {
            throw new BadRequestException('Username is missing');
        }
        const user = await this.taskModel.findOne({
            username
        });

        if (!user) {
            throw new NotFoundException('User Not Found');
        }

        const payload = { _id: user._id, username: user.username };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}