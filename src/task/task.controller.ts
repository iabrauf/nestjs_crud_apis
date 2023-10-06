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
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import { TaskService } from './task.service';
import { Task } from 'src/interface/task.interface';
import { Message } from 'src/interface/task.interface';
import { TaskDto } from 'src/dto/task.dto';

@ApiBearerAuth()
@ApiTags('tasks')
@Controller('tasks')
export class TaskController {
    constructor(private readonly taskService: TaskService) { }
    @ApiOperation({ summary: 'Get Records' })
    @ApiOkResponse({ description: 'Get All Record' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
    @Get()
    getAllTasks(): Promise<Task[]> {
        try {
            return this.taskService.findAll();
        } catch (error) {
            throw new BadRequestException('Something bad happened');
        }
    }
    @Get(':id')
    @ApiOperation({ summary: 'Get Single Record' })
    @ApiOkResponse({ description: 'Get Single Record' })
    @ApiBadRequestResponse({ description: 'Id is not valid' })
    @ApiNotFoundResponse({ description: 'Task Not Found' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
    @ApiParam({
        name: "id",
        required: true,
        description: 'A string of task id',
        schema: { type: 'string' },
        type: 'string'
    })
    getOneTask(@Param('id') id: string): Promise<Task> {
        return this.taskService.getOne(id);
    }



    @Post()
    @ApiOperation({ summary: 'Create task' })
    @ApiOkResponse({ description: 'Record Created' })
    @ApiBadRequestResponse({ description: 'Name or Completed is missing' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
    async createTask(@Body() taskDto: TaskDto): Promise<Task> {
        return await this.taskService.createTask(taskDto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update Single Record' })
    @ApiOkResponse({ description: 'Record Updated' })
    @ApiBadRequestResponse({ description: 'Id is not valid' })
    @ApiNotFoundResponse({ description: 'Task Not Found' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
    @ApiParam({
        name: "id",
        required: true,
        description: 'A string of task id',
        schema: { type: 'string' },
        type: 'string'
    })
    updateTask(
        @Param('id') id: string,
        @Body() taskDto: TaskDto
    ) {
        return this.taskService.updateTask(id, taskDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete Single Record' })
    @ApiOkResponse({ description: 'Record Deleted' })
    @ApiBadRequestResponse({ description: 'Id is not valid' })
    @ApiNotFoundResponse({ description: 'Task Not Found' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
    @ApiParam({
        name: "id",
        required: true,
        description: 'A string of task id',
        schema: { type: 'string' },
        type: 'string'
    })
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
