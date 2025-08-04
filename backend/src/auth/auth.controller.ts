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
    async login(@Body() { email, password }: AuthLoginDto) {
        const user = await this.authService.login(email, password);
        return this.authService.generateToken(user);
    }

    @Post('register')
    async register(@Body()body: AuthRegisterDto){

        return this.authService.register(body);

    }

    @Post('me')
    async me(@Body() body: { token: string }) {
        return this.authService.validateToken(body.token);
    }
}