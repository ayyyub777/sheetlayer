import { User } from "@prisma/client"
import { AvatarProps } from "@radix-ui/react-avatar"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "image" | "name" | "email">
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      {user.image ? (
        <AvatarImage alt="profile picture" src={user.image} />
      ) : (
        <AvatarFallback>
          {user.name ? (
            <>
              <span className="sr-only">{user.name}</span>
              <span>{user.name?.charAt(0)}</span>
            </>
          ) : user.email ? (
            <>
              <span className="sr-only">{user.email}</span>
              <span>{user.email?.charAt(0)}</span>
            </>
          ) : (
            <span className="sr-only">User</span>
          )}
        </AvatarFallback>
      )}
    </Avatar>
  )
}
