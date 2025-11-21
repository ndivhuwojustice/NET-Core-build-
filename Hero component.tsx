/* eslint-disable react-hooks/exhaustive-deps */
// HeroComponent.tsx

const HeroComponent: React.FC = () => {
  // Mocked build status & next run logic – in a real scenario these would come from an API
  const [buildStatus, setBuildStatus] = React.useState<'success' | 'warning' | 'error'>('success');
  const [nextRun, setNextRun] = React.useState<Date>(() => {
    const now = new Date();
    // assume CI runs every hour on the hour
    const next = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0, 0, 0);
    return next;
  });
  const [countdown, setCountdown] = React.useState<string>('');

  const computeCountdown = React.useCallback(() => {
    const diff = nextRun.getTime() - Date.now();
    if (diff <= 0) {
      setCountdown('Running now…');
    } else {
      const totalSeconds = Math.floor(diff / 1000);
      const hrs = Math.floor(totalSeconds / 3600);
      const mins = Math.floor((totalSeconds % 3600) / 60);
      const secs = totalSeconds % 60;
      setCountdown(`${hrs.toString().padStart(2, '0')}:${mins
        .toString()
        .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
    }
  }, [nextRun]);

  React.useEffect(() => {
    computeCountdown();
    const interval = setInterval(computeCountdown, 1000);
    return () => clearInterval(interval);
  }, [computeCountdown]);

  // Helper to cycle status for demo purpose
  const handleRefresh = () => {
    setBuildStatus((prev) => {
      if (prev === 'success') return 'warning';
      if (prev === 'warning') return 'error';
      return 'success';
    });
    // Also recalc next run
    const now = new Date();
    const next = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0, 0, 0);
    setNextRun(next);
  };

  const statusColorClass = React.useMemo(() => {
    switch (buildStatus) {
      case 'success':
        return 'bg-green-500 text-green-50';
      case 'warning':
        return 'bg-amber-500 text-amber-50';
      case 'error':
        return 'bg-red-500 text-red-50';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  }, [buildStatus]);

  return (
    <div className="w-full h-full @container overflow-x-hidden flex items-center justify-center py-12 px-6">
      <div className="max-w-3xl w-full flex flex-col gap-6">
        {/* Headline */}
        <h1 className="font-custom text-site-foreground text-xl font-semibold prose">Monitor Your .NET CI Workflow</h1>
        {/* Subheading */}
        <p className="font-custom text-site-foreground text-base prose">
          Stay informed on every push to <code className="font-custom">main</code> and all open pull requests. Track build
          results in real-time and never miss a failing pipeline again.
        </p>

        {/* Status & Countdown */}
        <div className="flex flex-wrap items-center gap-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColorClass}`}>
            {buildStatus === 'success' && 'Build Success'}
            {buildStatus === 'warning' && 'Build Unstable'}
            {buildStatus === 'error' && 'Build Failed'}
          </span>
          <span className="font-custom text-site-foreground text-sm">
            Next run in <strong>{countdown}</strong>
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <DreamspaceElements.TooltipProvider>
            {/* Refresh Status Button */}
            <DreamspaceElements.Tooltip>
              <DreamspaceElements.TooltipTrigger asChild>
                <DreamspaceElements.Button onClick={handleRefresh} variant="outline" className="gap-2">
                  {Lucide.RefreshCw && <Lucide.RefreshCw size={18} className="text-foreground" />}
                  <span className="font-custom">Refresh Status</span>
                </DreamspaceElements.Button>
              </DreamspaceElements.TooltipTrigger>
              <DreamspaceElements.TooltipContent>
                <p className="font-custom text-foreground text-xs">Manually refresh the build status</p>
              </DreamspaceElements.TooltipContent>
            </DreamspaceElements.Tooltip>

            {/* View Full Logs Button */}
            <DreamspaceElements.Tooltip>
              <DreamspaceElements.TooltipTrigger asChild>
                <DreamspaceElements.Button variant="secondary" className="gap-2">
                  {Lucide.FileText && <Lucide.FileText size={18} className="text-foreground" />}
                  <span className="font-custom">View Full Logs</span>
                </DreamspaceElements.Button>
              </DreamspaceElements.TooltipTrigger>
              <DreamspaceElements.TooltipContent>
                <p className="font-custom text-foreground text-xs">Open the detailed CI log output</p>
              </DreamspaceElements.TooltipContent>
            </DreamspaceElements.Tooltip>
          </DreamspaceElements.TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export { HeroComponent as component };
