import * as React from 'react'
import { type VariantProps } from 'class-variance-authority'
import { buttonVariants } from '@/components/ui/button-variants'
import { cn } from '@/lib/utils'

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = 'button', ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        type={type}
        {...props}
      />
    )
  },
)

Button.displayName = 'Button'

export { Button }
