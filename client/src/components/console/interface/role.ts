export interface RoleProps {
  description?: string;
  disabled?: boolean;
  field_permissions?: string;
  permissions?: Record<string, string>;
  role?: string;
}
