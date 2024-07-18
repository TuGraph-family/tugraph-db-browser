import { findPlatformUser } from '@/services/antgraphconsole/GeaMakerUserController';
import React from '@alipay/bigfish/react';
import { SearchSelect } from '@alipay/tech-ui';
import type { SearchSelectProps } from '@alipay/tech-ui/lib/SearchSelect';

const UserSelect: React.FC<SearchSelectProps> = (props) => {
  return (
    <SearchSelect<API.PlatformUserVO>
      multiple
      placeholder="请输入花名/工号搜索"
      request={async ({ query }) => {
        const { data } = await findPlatformUser({
          keyword: query,
          current: 1,
          pageSize: 50,
        });
        return (
          data?.map((user) => ({
            ...user,
            label: user.userName || user.loginName || user.userId,
            value: user.userId,
          })) || []
        );
      }}
      {...props}
    />
  );
};

export default UserSelect;
