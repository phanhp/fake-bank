import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { RolesGuard } from '../guard/role.guard';
import { AuthGuard, OptionalJwtAuthGuard } from '../guard/auth.guarth';

export function Auth(roles?: string[]) {
  if (roles && roles.length > 0) {
    return applyDecorators(
      SetMetadata('roles', roles),
      UseGuards(AuthGuard, RolesGuard),
      ApiBearerAuth(),
      ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    );
  }
  return applyDecorators(
    UseGuards(AuthGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}

export function AuthOptional() {
  return applyDecorators(UseGuards(OptionalJwtAuthGuard));
}
