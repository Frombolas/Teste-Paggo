import { Controller, Post, Body, Get, Param, Put, Patch, Delete } from "@nestjs/common";

@Controller('users')
export class UserController {

    @Post()
    async create(@Body() body: any){
        return { received: body  };
    };

    @Get()
    async read(){
        return {users:[]};
    };

    @Get(':id')
    async readOne(@Param() param:any){
        return {user:{}, param};
    };

    @Put(':id')
    async update(@Body() body: any, @Param() param:any){
        return {
            method: 'put',
            body,
            param
        }

    };

    @Patch(':id')
    async updatePart(@Body() body: any,@Param() param:any){
        return {
            method: 'patch',
            body,
            param
        }
    };
    
    @Delete(':id')
    async delete(@Param() param:any){
        return {
            param
        }
    };
}