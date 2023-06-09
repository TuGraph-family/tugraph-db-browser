import React from 'react';

interface AuthItemProps {
  code: string;
  menuAuths?: any;
  children?: React.ReactDOM;
}

export const linkToApplyAuth = () => window.open('/personal/group');

export const hasModuleAuth = (code: string, menuAuths?: any) =>
  menuAuths && menuAuths.some((item) => item.code === code);

export const AuthItem: React.FunctionComponent<AuthItemProps> = ({
  children,
  code,
  menuAuths,
}) => {
  return hasModuleAuth(code, menuAuths) ? <>{children}</> : null;
};

export default AuthItem;
