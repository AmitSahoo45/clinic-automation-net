type LoadingScreenProps = {
  message: string
}

export function LoadingScreen({ message }: LoadingScreenProps) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md rounded-[2rem] border border-border/70 bg-card/95 p-10 text-center shadow-[0_18px_60px_rgba(22,56,54,0.12)] backdrop-blur">
        <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-muted border-t-primary" />
        <p className="mt-6 font-serif text-2xl text-foreground">Restoring your workspace</p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}
