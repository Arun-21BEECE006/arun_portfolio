export default function LoadingScreen() {
  return (
    <div className="min-h-screen grid place-items-center bg-ink-900">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-teal-400/30 border-t-teal-400 animate-spin" />
        <p className="font-mono text-xs uppercase tracking-wider text-muted">
          Loading
        </p>
      </div>
    </div>
  );
}
