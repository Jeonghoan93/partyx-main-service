import { SetMetadata } from '@nestjs/common';
import { userTypes } from 'src/common/types';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: userTypes[]) => SetMetadata(ROLES_KEY, roles);
