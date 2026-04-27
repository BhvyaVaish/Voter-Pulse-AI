export default function SimulatorLoading() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-muted" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-wattle animate-spin" />
        </div>
        <p className="text-sm text-muted-foreground font-medium animate-pulse">Loading simulator...</p>
      </div>
    </div>
  );
}
