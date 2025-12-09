import { UserEntity } from "@/modules/admin/system/user/entities/user.entity";
import { UserMapper } from "@/modules/admin/system/user/user.mapper";
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext):  Promise<boolean> {
        const permissions = this.reflector.get<string[]>('permissions', context.getHandler());
        if (!permissions || permissions.length === 0) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) throw new ForbiddenException();

        if (user.isAdmin) {
            return true;
        }

        const permission = user.permissions;
        if (!permission) {
            throw new ForbiddenException('Invalid permissions');
        }

        const hasPermission = await this.matchPermissions(permission, permissions);
        if (!hasPermission) {
            throw new ForbiddenException();
        }

        return true;
    }

    async matchPermissions(userPermissions: string[], requiredPermissioins: string[]): Promise<boolean> {
        return requiredPermissioins.every(permission => userPermissions.includes(permission));
    }
}