import { HeartPulse } from 'lucide-react'
import { cn } from '@/lib/utils'

type BrandMarkProps = {
  compact?: boolean
  className?: string
}

export function BrandMark({ compact = false, className }: BrandMarkProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/14 text-white shadow-[0_16px_36px_rgba(12,32,50,0.24)] ring-1 ring-white/25 backdrop-blur">
        <HeartPulse className="h-5 w-5" />
      </div>
      <div className="space-y-0.5">
        <div
          className={cn(
            'font-serif tracking-tight text-white',
            compact ? 'text-xl' : 'text-2xl md:text-3xl',
          )}
        >
          Clinic Appointments
        </div>
        <div className="text-xs uppercase tracking-[0.28em] text-white/72">
          scheduling workspace
        </div>
      </div>
    </div>
  )
}
