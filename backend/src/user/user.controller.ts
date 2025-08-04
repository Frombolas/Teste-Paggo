import { Controller, Post, Body, Get, Param, Put, Patch, Delete } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdatePutUserDto } from "./dto/update-put-user.dto";
import { UpdatePatchUserDto } from "./dto/update-patch.dto";
import { UserService } from "./user.service";

@Controller('users')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Post()
    async create(@Body() body: CreateUserDto){
        this.userService.create(body);
        return {
            method: 'post',
            body
        }
    };

    @Get()
    async read() {
        return this.userService.findAll();
    }

    @Get(':id')
    async readOne(@Param('id') id: string) {
        return this.userService.findOne(id);
    }

    @Put(':id')
    async update(@Body() body: UpdatePutUserDto, @Param('id') id: string){
        return this.userService.updatePut(id, body);
    };

    @Patch(':id')
    async updatePart(@Body() body: UpdatePatchUserDto,@Param('id') id: string){
        return this.userService.updatePatch(id,body);
    };
    
    @Delete(':id')
    async delete(@Param('id') id: string){
        return this.userService.delete(id);
    };
}