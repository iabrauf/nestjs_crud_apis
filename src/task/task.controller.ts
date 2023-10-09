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
    UseGuards,
    Request
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
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TaskService } from './task.service';
import { Task } from 'src/interface/task.interface';
import { Message } from 'src/interface/task.interface';
import { TaskDto } from 'src/dto/task.dto';
import { UserDto } from 'src/dto/user.dto';
import { TaskGuard } from './task.guard';


@ApiTags('tasks')
@Controller('tasks')
export class TaskController {
    constructor(private readonly taskService: TaskService) { }

    @UseGuards(TaskGuard)
    @ApiOperation({ summary: 'Get Records' })
    @ApiOkResponse({ description: 'Get All Record' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
    @Get()
    @ApiBearerAuth('JWT-auth')
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    getAllTasks(@Request() req): Promise<Task[]> {
        try {
            return this.taskService.findAll(req);
        } catch (error) {
            throw new BadRequestException('Something bad happened');
        }
    }


    @UseGuards(TaskGuard)
    @Get(':id')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Get Single Record' })
    @ApiOkResponse({ description: 'Get Single Record' })
    @ApiBadRequestResponse({ description: 'Id is not valid' })
    @ApiNotFoundResponse({ description: 'Task Not Found' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
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




    @Post("login")
    @ApiOperation({ summary: 'Login User' })
    @ApiOkResponse({ description: "Get an access token" })
    @ApiBadRequestResponse({ description: 'Username is missing' })
    @ApiNotFoundResponse({ description: 'User Not Found' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
    async loginUser(@Body() user: UserDto) {
        return await this.taskService.login(user.username);
    }

    @UseGuards(TaskGuard)
    @Post()
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Create task' })
    @ApiOkResponse({ description: 'Record Created' })
    @ApiBadRequestResponse({ description: 'Name or Completed is missing' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    async createTask(@Body() taskDto: TaskDto): Promise<Task> {
        return await this.taskService.createTask(taskDto);
    }

    @UseGuards(TaskGuard)
    @Put(':id')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Update Single Record' })
    @ApiOkResponse({ description: 'Record Updated' })
    @ApiBadRequestResponse({ description: 'Id is not valid' })
    @ApiNotFoundResponse({ description: 'Task Not Found' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
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

    @UseGuards(TaskGuard)
    @Delete(':id')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Delete Single Record' })
    @ApiOkResponse({ description: 'Record Deleted' })
    @ApiBadRequestResponse({ description: 'Id is not valid' })
    @ApiNotFoundResponse({ description: 'Task Not Found' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
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
