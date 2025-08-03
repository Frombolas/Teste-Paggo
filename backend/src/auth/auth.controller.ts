import { Body, Controller, Post } from "@nestjs/common";
import { AuthLoginDto } from "./dto/auth-login.dto";
import { AuthRegisterDto } from "./dto/auth-register.dto";
import { AuthService } from "./auth.service";


@Controller('auth')
export class AuthController{

    constructor(
        private readonly authService:AuthService
    ) {}

    @Post('login')
    async login(@Body(){email,password}:AuthLoginDto){
        return this.authService.login(email,password);
    }

    @Post('register')
    async register(@Body()body: AuthRegisterDto){

        return this.authService.register(body);

    }
}