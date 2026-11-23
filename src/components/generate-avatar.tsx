import { createAvatar } from "@dicebear/core";
import { botttsNeutral, initials } from "@dicebear/collection";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function GenerateAvatar({
  seed,
  variant,
  className,
}: {
  seed: string;
  className?: string;
  variant: "botttsNeutral" | "initials";
}) {
  let avatar;

  if (variant === "botttsNeutral") {
    avatar = createAvatar(botttsNeutral, {
      seed,
    });
  } else {
    avatar = createAvatar(initials, {
      seed,
      fontWeight: 500,
      fontSize: 42,
    });
  }

  return (
    <Avatar className={className}>
      <AvatarImage src={avatar.toDataUri()} alt={seed} />
      <AvatarFallback className='rounded-lg'>
        {seed.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
