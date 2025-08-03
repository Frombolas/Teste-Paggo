import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { UserService } from "../user/user.service";
import { AuthRegisterDto } from "./dto/auth-register.dto";


@Injectable()
export class AuthService{

    constructor(
        private readonly jwtService: JwtService, 
        private readonly prisma: PrismaService,
        private readonly userService: UserService
    ) {}

    async generateToken(user:User){
        return this.jwtService.sign({
            sub: user.id,
            name: user.name,
            email: user.email
        },{
            expiresIn: '10h',
            subject: String(user.id),
            issuer: 'Api Paggo desafio'
        });
    };

    async validateToken(token: string){
        
    }

    async login(email: string, password: string){

        const user = await this.prisma.user.findFirst({
            where:{
                email,
                password
            }
        });

        if(!user) {
            throw new UnauthorizedException('Email ou senha incorretos.');
        }
        return user;
    }


    async register(data: AuthRegisterDto){

        const user = await this.userService.create(data);

        return this.generateToken(user);
    }
}