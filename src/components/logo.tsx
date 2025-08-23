"use client";


import { cn } from "@/lib/utils";

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 160 40"
      className={cn("h-10 w-auto", className)}
      {...props}
    >
      <g>
        <path
          d="M20 0C8.95 0 0 8.95 0 20v14c0 3.31 2.69 6 6 6h28c3.31 0 6-2.69 6-6V20C40 8.95 31.05 0 20 0z"
          fill="#16A34A"
        />
        <g fill="#27272A">
          <rect x="14" y="5" width="12" height="26" rx="4" />
        </g>
        <circle cx="20" cy="11" r="3" fill="#EF4444" />
        <circle cx="20" cy="18" r="3" fill="#FBBF24" />
        <circle cx="20" cy="25" r="3" fill="#22C55E" />
      </g>
      <text
        x="48"
        y="16"
        fontFamily="Inter, sans-serif"
        fontSize="18"
        fontWeight="bold"
        fill="currentColor"
      >
        Event
      </text>
      <text
        x="48"
        y="35"
        fontFamily="Inter, sans-serif"
        fontSize="18"
        fontWeight="bold"
        fill="currentColor"
      >
        Safe
      </text>
    </svg>
  );
}
