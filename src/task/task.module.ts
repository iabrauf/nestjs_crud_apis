import { Module } from '@nestjs/common';
import { TaskController } from '../task/task.controller';
import { TaskService } from '../task/task.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskSchema } from 'src/schemas/task.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Task', schema: TaskSchema }])],
    controllers: [TaskController],
    providers: [TaskService],
})
export class TaskModule { }
