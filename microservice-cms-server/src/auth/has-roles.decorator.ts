import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/user/dto/user-role.dot';

export const HasRoles = (roles: Role) => SetMetadata('role', roles);
