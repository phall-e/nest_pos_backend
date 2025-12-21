import { UserService } from "@/modules/admin/system/user/user.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayloadDto } from "../dto/jwt-payload.dto";
import { UserResponseDto } from "@/modules/admin/system/user/dto/user-response.dto";
import { UserMapper } from "@/modules/admin/system/user/user.mapper";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        private userService: UserService,
        private configService: ConfigService,
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
        });
    }

    async validate(payload: UserResponseDto): Promise<UserResponseDto> {
        
        const user = await this.userService.findOneByUsername(payload.username);

        if (!user) throw new UnauthorizedException('Invalid credentials');
        if (!user.isActive) throw new UnauthorizedException('User is inactive');
        return {
            id: payload.id,
            username: payload.username,
            isAdmin: payload.isAdmin,
            isActive: payload.isActive,
            permissions: payload.permissions,
            createdAt: payload.createdAt,
            updatedAt: payload.updatedAt,
            deletedAt: payload.deletedAt,
            roles: payload.roles,
            branches: payload.branches,
        };
    }
}