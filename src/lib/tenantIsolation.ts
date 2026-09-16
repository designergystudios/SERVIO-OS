// Servio Backend & Data-Access Layer Tenant Isolation Engine
// Enforces strict tenant scoping: WHERE tenant_id = authenticatedUser.tenantId

import { User, Tenant, UserRole } from '../types';

export interface AuthenticatedContext {
  userId: string;
  tenantId: string;
  role: UserRole;
  isPlatformAdmin: boolean;
}

/**
 * Validates and extracts the current tenant scope context.
 * Throws an error if an unauthorized attempt is made to access data outside the tenant boundary.
 */
export function getAuthenticatedContext(
  user: User | null,
  activeTenant: Tenant | null
): AuthenticatedContext {
  if (!user || !activeTenant) {
    throw new Error('SECURITY VIOLATION: Unauthenticated request or missing tenant context.');
  }

  const isPlatformAdmin =
    (user.role as string) === 'PLATFORM_SUPER_ADMIN' ||
    (user.role as string) === 'PLATFORM_ADMIN' ||
    (user.role as string) === 'SAAS_SUPER_ADMIN';

  return {
    userId: user.id,
    tenantId: activeTenant.id,
    role: user.role,
    isPlatformAdmin,
  };
}

/**
 * Backend Scoping Proxy Function:
 * Enforces `WHERE tenant_id = context.tenantId` for any tenant-owned record array.
 * If user is Platform Super Admin, they have explicit multi-tenant access when inspecting.
 */
export function scopeToTenant<T extends { tenant_id?: string }>(
  data: T[],
  context: AuthenticatedContext,
  overrideTenantId?: string
): T[] {
  // If Platform Super Admin explicitly selects a tenant to inspect, filter to that tenant
  const targetTenantId = overrideTenantId || context.tenantId;

  if (context.isPlatformAdmin && !overrideTenantId) {
    // Platform Super Admin overview mode sees all records across tenants
    return data;
  }

  // Strict Tenant Scoping Policy
  return data.filter((item) => {
    // If item doesn't explicitly specify tenant_id, default to active tenant for legacy backward compatibility
    if (!item.tenant_id) return true;
    return item.tenant_id === targetTenantId;
  });
}

/**
 * Verifies if an action is allowed for a given role and tenant context.
 */
export function assertTenantPermission(
  context: AuthenticatedContext,
  requiredTenantId: string
): boolean {
  if (context.isPlatformAdmin) return true;
  if (context.tenantId !== requiredTenantId) {
    console.error(`[SECURITY ALERT] Cross-tenant breach attempt by User ${context.userId} against Tenant ${requiredTenantId}`);
    return false;
  }
  return true;
}
