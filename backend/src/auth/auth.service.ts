import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import * as bcrypt from 'bcrypt';
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
        return {
            accessToken: this.jwtService.sign({
            sub: String(user.id),
            name: user.name,
            email: user.email
        },{
            expiresIn: '10h',
            issuer: 'Api Paggo desafio',
            audience: 'users'

        })};
    };

    async validateToken(token: string){
        try{
            const data = this.jwtService.verify(token,{
                audience:'users',
                issuer: 'Api Paggo desafio'
            })
            return data;

        }catch(error){
            throw new BadRequestException(error);
        }
    }

    async login(email: string, password: string){

        const user = await this.prisma.user.findUnique(
            { where: { email } }
        );

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Email ou senha incorretos.');
        }
        return user;
    }


    async register(data: AuthRegisterDto){
        const existing = await this.prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existing) {
            throw new BadRequestException('Este e-mail já está em uso.');
        }

        const user = await this.userService.create(data);

        return this.generateToken(user);
    }
}