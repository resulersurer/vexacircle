"use client";

import { useState } from "react";

type AvatarProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallback?: string;
};

export function Avatar({ fallback, className, alt, ...props }: AvatarProps) {
  const [error, setError] = useState(false);

  const initials =
    fallback
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  return (
    <div
      className={[
        "relative inline-flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {!error && (
        <img
          alt={alt || "Avatar"}
          className="aspect-square h-full w-full object-cover"
          onError={() => setError(true)}
          {...props}
        />
      )}
      {(error || !props.src) && (
        <span className="flex h-full w-full items-center justify-center text-xs font-medium text-muted-foreground">
          {initials}
        </span>
      )}
    </div>
  );
}
