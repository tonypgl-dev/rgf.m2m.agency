import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-all outline-none select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent-violet)] focus-visible:outline-offset-2 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "text-primary-foreground bg-[linear-gradient(135deg,#F97316_0%,#EA580C_100%)] shadow-[0_4px_16px_rgba(249,115,22,0.30),inset_0_1px_0_rgba(255,255,255,0.25)] hover:shadow-[0_0_20px_var(--accent-orange-glow)]",
        outline:
          "border border-[rgba(120,100,180,0.18)] bg-[linear-gradient(135deg,#FFFFFF_0%,#F0ECF9_100%)] shadow-[0_2px_8px_rgba(120,100,180,0.10),inset_0_1px_0_rgba(255,255,255,0.95)] text-[var(--text-primary)] hover:bg-muted aria-expanded:bg-muted dark:border-input dark:bg-transparent dark:shadow-none dark:text-foreground dark:hover:bg-input/50",
        secondary:
          "border border-[rgba(120,100,180,0.18)] bg-[linear-gradient(135deg,#FFFFFF_0%,#F0ECF9_100%)] shadow-[0_2px_8px_rgba(120,100,180,0.10),inset_0_1px_0_rgba(255,255,255,0.95)] text-[var(--text-primary)] hover:bg-muted aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-transparent dark:shadow-none dark:text-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type { VariantProps };
