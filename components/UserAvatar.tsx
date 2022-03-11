import { Avatar, AvatarProps } from '@mantine/core';
import { GenerateAvatarUrl } from '../apis/users';

export default function UserAvatar<C = 'div'>(props: AvatarProps<C> & { avatarId?: string, userId?: string, size?: number }) {
  let src = props.src;

  const { avatarId, userId, ...avatarProps } = props;

  if (!avatarId && userId) {
    src = GenerateAvatarUrl(userId, props.size ?? 38);
  } else if (avatarId) {
    src = `http://localhost:5001/files/${props.avatarId}?w=${props.size ?? 38}&h=${props.size ?? 38}`;
  }
  
  return <Avatar {...avatarProps} src={src} />;
}