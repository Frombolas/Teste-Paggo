import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { PrismaService } from "../prisma/prisma.service";
import { UpdatePutUserDto } from "./dto/update-put-user.dto";
import { UpdatePatchUserDto } from "./dto/update-patch.dto";
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService{
    
    constructor(private prisma: PrismaService) {}

    async create({name,email,password}: CreateUserDto){
        const hashedPassword = await bcrypt.hash(password, 10);
        const userExists = await this.prisma.user.findUnique({
            where: { email },
        });
        if (userExists) {
            throw new Error('Email já está em uso');
        }

        return this.prisma.user.create({
            data: { name, email, password:hashedPassword },
        });
    }

    async findAll() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async findOne(id: string) {
        return this.prisma.user.findUnique({
            where: {
                id: id 
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true
            }
        });
    }

    async updatePut(id: string, data: UpdatePutUserDto){
        return this.prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        })
    }

    async updatePatch(id: string, data: UpdatePatchUserDto){
        return this.prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async delete(id:string){
        return this.prisma.user.delete({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
}