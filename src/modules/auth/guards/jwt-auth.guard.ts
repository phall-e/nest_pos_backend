import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { TokenService } from "../services/token.service";
import { Reflector } from "@nestjs/core";
import { ExtractJwt } from "passport-jwt";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
        private tokenService: TokenService,
        private reflector: Reflector,
    ){
        super();
    }

    canActivate(context: ExecutionContext) {
        const isSkipAuth = this.reflector.get<boolean>('skipAuth', context.getHandler());
        if (isSkipAuth) {
            return true;
        }
        return super.canActivate(context);
    }

    handRequest(error, user, info) {
        if (error || !user) {
            throw error || new UnauthorizedException();
        }
        return user;
    }
}