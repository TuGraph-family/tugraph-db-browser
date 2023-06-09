import { compact, join } from 'lodash';
export const formatTime = (seconds: number) => {
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  const secs = Math.floor(seconds % 60);

  const formattedTime = join(
    compact([
      days && `${days}天`,
      hours && `${hours}小时`,
      minutes && `${minutes}分`,
      secs && `${secs}秒`,
    ]),
    ''
  );

  return formattedTime;
};
