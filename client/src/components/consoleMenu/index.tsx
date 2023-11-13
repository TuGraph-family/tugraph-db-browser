import { CONSOLE_LINKS } from '@/constants';
import styles from './index.less';

const ConsoleMenu = ({
  onMenuChange,
  menuKey,
}: {
  onMenuChange: (value: any) => void;
  menuKey: string;
}) => {
  return (
    <div className={styles?.consoleMenu}>
      {CONSOLE_LINKS.map(({ title, key }) => (
        <div
          className={
            key === menuKey
              ? styles?.consoleMenuItemSelected
              : styles?.consoleMenuItem
          }
          key={key}
          onClick={() => {
            history.pushState(
              {
                menu: key,
              },
              '',
              window.location.origin + window.location.pathname + '?menu=' + key
            );
            onMenuChange && onMenuChange(key);
          }}
        >
          {title}
        </div>
      ))}
    </div>
  );
};

export default ConsoleMenu;
