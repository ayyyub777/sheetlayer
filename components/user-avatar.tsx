import { User } from "@prisma/client"
import { AvatarProps } from "@radix-ui/react-avatar"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "picture" | "name" | "email">
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      {user.picture ? (
        <AvatarImage alt="profile picture" src={user.picture} />
      ) : (
        <AvatarFallback>
          {user.name ? (
            <>
              <span className="sr-only text-xs">{user.name}</span>
              <span className="text-sm uppercase leading-none">
                {user.name?.charAt(0)}
              </span>
            </>
          ) : user.email ? (
            <>
              <span className="sr-only text-xs">{user.email}</span>
              <span className="text-sm uppercase leading-none">
                {user.email?.charAt(0)}
              </span>
            </>
          ) : (
            <span className="sr-only text-xs">User</span>
          )}
        </AvatarFallback>
      )}
    </Avatar>
  )
}
