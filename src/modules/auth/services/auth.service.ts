import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../admin/system/user/user.service';
import { LoginRequestDto } from '../dto/login-request.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { PasswordHash } from '@/utils/password-hash.util';
import { UserMapper } from '../../admin/system/user/user.mapper';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private tokenService: TokenService,
    ){}

    public async login(dto: LoginRequestDto): Promise<LoginResponseDto>{
        try {
            const user = await this.userService.findOneByUsername(dto.username);
            if (!user) {
                throw new UnauthorizedException('Invalid credentials');
            }

            if (!user.isActive) {
                throw new UnauthorizedException('User is inactive');
            }

            const isPasswordValid = await PasswordHash.verify(dto.password, user.password);
            if (!isPasswordValid) {
                throw new UnauthorizedException('Invalid credentials');
            }
            const roles = await user.roles;
            const allPermissions = await Promise.all(
                roles.map(role => role.permissions).map(async (permPromise) => (await permPromise).flatMap(p => p.name)),
            );
            const uniquePermissions = Array.from(new Set(allPermissions.flat()));
            const users = await UserMapper.toDto(user);
            const token = await this.tokenService.generateAuthToken({...users, permissions: uniquePermissions });
            return {
                token,
                users: users,
                permissions: uniquePermissions,
            }
        } catch (error) {
            if (error instanceof UnauthorizedException) throw new UnauthorizedException('Invalid credentials');
            throw error;
        }
    }
}
