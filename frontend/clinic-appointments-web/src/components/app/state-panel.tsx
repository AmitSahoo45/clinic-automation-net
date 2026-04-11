import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type StatePanelTone = 'default' | 'error' | 'warning'
type StatePanelAlign = 'center' | 'left'

type StatePanelProps = {
  title: string
  description: string
  children?: ReactNode
  className?: string
  icon?: LucideIcon
  loading?: boolean
  align?: StatePanelAlign
  tone?: StatePanelTone
}

const toneStyles: Record<StatePanelTone, string> = {
  default: 'bg-muted text-muted-foreground',
  error: 'bg-red-100 text-red-700',
  warning: 'bg-amber-100 text-amber-700',
}

export function StatePanel({
  title,
  description,
  children,
  className,
  icon: Icon,
  loading = false,
  align = 'center',
  tone = 'default',
}: StatePanelProps) {
  return (
    <Card className={cn('border-border/80', className)}>
      <CardContent
        className={cn(
          'flex flex-col gap-4 p-8',
          align === 'center' ? 'items-center text-center' : 'items-start text-left',
        )}
      >
        <div
          className={cn(
            'flex h-14 w-14 items-center justify-center rounded-3xl',
            toneStyles[tone],
          )}
        >
          {loading ? (
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-current/30 border-t-current" />
          ) : Icon ? (
            <Icon className="h-5 w-5" />
          ) : null}
        </div>

        <div className="space-y-2">
          <p className="font-serif text-3xl text-foreground">{title}</p>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">{description}</p>
        </div>

        {children ? <div className="flex flex-wrap gap-3">{children}</div> : null}
      </CardContent>
    </Card>
  )
}
