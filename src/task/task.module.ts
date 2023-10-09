import { Module } from '@nestjs/common';
import { TaskController } from '../task/task.controller';
import { TaskService } from '../task/task.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskSchema } from 'src/schemas/task.schema';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/constant/constants';


@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Task', schema: TaskSchema }]),
        JwtModule.register({
            global: true,
            secret: jwtConstants.secret,
        }),
    ],
    controllers: [TaskController],
    providers: [TaskService],
})
export class TaskModule { }
