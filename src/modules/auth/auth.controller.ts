import { Body, Controller, Post } from '@nestjs/common';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { AuthService } from './services/auth.service';
import { ApiResponse } from '@nestjs/swagger';
import { SkipAuth } from './decorators/skip-auth.decorator';

@Controller({
    path: 'auth',
    version: '1',
})
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    @ApiResponse({ status: 201, type: LoginResponseDto, description: 'User logged in successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @SkipAuth()
    login(@Body() dto: LoginRequestDto): Promise<LoginResponseDto> {
        return this.authService.login(dto);
    }   
}
