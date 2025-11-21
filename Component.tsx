const ActionableComponentComponent: React.FC = () => {
  // ---------------------------------------------------------------------------
  // Form state management using shadcn useForm hook for accessibility & validation
  // ---------------------------------------------------------------------------
  const form = DreamspaceElements.useForm({
    defaultValues: {
      branch: 'main',
      configurations: [] as string[],
      jobType: 'Build',
      startDate: undefined as Date | undefined,
      endDate: undefined as Date | undefined,
    },
  });

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  /**
   * Emit an event with the currently selected filters so that parent applications
   * or other listeners can react to the change.
   */
  const handleApplyFilters = () => {
    const values = form.getValues();
    // Emit custom event that other widgets / the main app can listen to
    window.dispatchEvent(
      new CustomEvent('ActionableComponent:ApplyFilters', { detail: values }),
    );
    // Also keep the dev-console output for easy debugging during integration
    // eslint-disable-next-line no-console
    console.log(`Filters applied for branch ${values.branch}`, values);
  };

  /**
   * Clear all filters back to their default values and emit a complementary
   * event so external listeners can clear any related state.
   */
  const handleClearFilters = () => {
    const defaults = {
      branch: 'main',
      configurations: [] as string[],
      jobType: 'Build',
      startDate: undefined as Date | undefined,
      endDate: undefined as Date | undefined,
    };

    form.reset(defaults);

    // Notify the outside world that filters were cleared from inside this panel
    window.dispatchEvent(
      new CustomEvent('ActionableComponent:ClearFilters', { detail: {} }),
    );
  };

  // ---------------------------------------------------------------------------
  // External event listeners
  // ---------------------------------------------------------------------------
  // Listen for a MainApp-level clear-filters event so that this component stays
  // in sync if the parent application decides to reset all filters programmatically.
  React.useEffect(() => {
    const resetListener = () => {
      form.reset({
        branch: 'main',
        configurations: [] as string[],
        jobType: 'Build',
        startDate: undefined,
        endDate: undefined,
      });
    };

    window.addEventListener('MainApp:ClearFilters', resetListener);
    return () => window.removeEventListener('MainApp:ClearFilters', resetListener);
  }, [form]);

  // ---------------------------------------------------------------------------
  // Utility to toggle configuration selection (multi-select via checkboxes)
  // ---------------------------------------------------------------------------
  const toggleConfiguration = (option: string) => {
    const current = form.getValues('configurations');
    if (current.includes(option)) {
      form.setValue('configurations', current.filter((c) => c !== option));
    } else {
      form.setValue('configurations', [...current, option]);
    }
  };

  // ---------------------------------------------------------------------------
  // JSX
  // ---------------------------------------------------------------------------
  return (
    <div className="w-full h-full @container overflow-x-hidden flex items-start justify-center p-4">
      {/* Filter Panel */}
      <div className="prose font-custom w-full h-full border border-gray-300 rounded-md bg-secondary/20 p-6 flex flex-col gap-6 overflow-y-auto">
        <h1 className="text-xl text-site-foreground flex items-center gap-2">
          {Lucide.Filter && (
            <Lucide.Filter size={24} className="text-site-foreground" />
          )}
          Filter Pipelines
        </h1>

        {/* Branch Selector */}
        <DreamspaceElements.Form {...form}>
          <DreamspaceElements.FormField
            name="branch"
            control={form.control}
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                <DreamspaceElements.Label
                  htmlFor="branch"
                  className="text-sm text-site-foreground"
                >
                  Select Branch
                </DreamspaceElements.Label>
                <DreamspaceElements.Select
                  value={field.value}
                  onValueChange={field.onChange}
                  aria-label="Branch selector"
                >
                  <DreamspaceElements.SelectTrigger
                    id="branch"
                    className="rounded-md bg-primary text-primary-foreground"
                  >
                    <DreamspaceElements.SelectValue />
                  </DreamspaceElements.SelectTrigger>
                  <DreamspaceElements.SelectContent>
                    <DreamspaceElements.SelectItem value="main">
                      main
                    </DreamspaceElements.SelectItem>
                    <DreamspaceElements.SelectItem value="develop">
                      develop
                    </DreamspaceElements.SelectItem>
                    <DreamspaceElements.SelectItem value="feature/*">
                      feature/*
                    </DreamspaceElements.SelectItem>
                  </DreamspaceElements.SelectContent>
                </DreamspaceElements.Select>
              </div>
            )}
          />

          {/* Configuration Multi Select */}
          <div className="flex flex-col gap-2">
            <DreamspaceElements.Label className="text-sm text-site-foreground">
              Configuration
            </DreamspaceElements.Label>
            <div
              className="flex flex-col gap-2 pl-1"
              role="group"
              aria-labelledby="configuration-label"
            >
              {['Debug', 'Release'].map((config) => (
                <label
                  key={config}
                  className="flex items-center gap-2 cursor-pointer text-site-foreground text-sm"
                >
                  <DreamspaceElements.Checkbox
                    checked={form
                      .getValues('configurations')
                      .includes(config)}
                    onCheckedChange={() => toggleConfiguration(config)}
                    aria-label={`${config} configuration checkbox`}
                    className="rounded-md bg-primary text-primary-foreground border-none"
                  />
                  {Lucide.CheckSquare && (
                    <Lucide.CheckSquare size={16} className="text-site-foreground" />
                  )}
                  {config}
                </label>
              ))}
            </div>
          </div>

          {/* Job Type Radio Group */}
          <DreamspaceElements.FormField
            name="jobType"
            control={form.control}
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                <DreamspaceElements.Label className="text-sm text-site-foreground">
                  Job Type
                </DreamspaceElements.Label>
                <DreamspaceElements.RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  aria-label="Job type selector"
                  className="flex gap-4"
                >
                  {['Build', 'Test', 'Package'].map((job) => (
                    <DreamspaceElements.RadioGroupItem
                      key={job}
                      value={job}
                      className="flex items-center gap-1"
                      aria-label={`${job} job type radio`}
                    >
                      {Lucide.CheckSquare && (
                        <Lucide.CheckSquare
                          size={16}
                          className="text-site-foreground"
                        />
                      )}
                      <span className="text-sm text-site-foreground">{job}</span>
                    </DreamspaceElements.RadioGroupItem>
                  ))}
                </DreamspaceElements.RadioGroup>
              </div>
            )}
          />

          {/* Date Range */}
          <div className="flex flex-col gap-4">
            <DreamspaceElements.Label className="text-sm text-site-foreground">
              Run Date Range
            </DreamspaceElements.Label>
            <div className="flex flex-col @md:flex-row gap-4">
              <DreamspaceElements.DatePicker
                selected={form.getValues('startDate')}
                onSelect={(date: Date) => form.setValue('startDate', date)}
                aria-label="Start date picker"
                placeholderText="Start Date"
                className="rounded-md bg-primary text-primary-foreground w-full"
              />
              <DreamspaceElements.DatePicker
                selected={form.getValues('endDate')}
                onSelect={(date: Date) => form.setValue('endDate', date)}
                aria-label="End date picker"
                placeholderText="End Date"
                className="rounded-md bg-primary text-primary-foreground w-full"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <DreamspaceElements.Button
              type="button"
              onClick={handleApplyFilters}
              className="mt-4 rounded-md bg-primary text-primary-foreground self-start"
              aria-label="Apply filters button"
            >
              {Lucide.Filter && <Lucide.Filter size={18} className="mr-2" />}Apply
              Filters
            </DreamspaceElements.Button>
            <DreamspaceElements.Button
              type="button"
              onClick={handleClearFilters}
              className="mt-4 rounded-md bg-destructive text-destructive-foreground self-start"
              aria-label="Clear filters button"
            >
              {Lucide.XCircle && (
                <Lucide.XCircle size={18} className="mr-2" />
              )}Clear Filters
            </DreamspaceElements.Button>
          </div>
        </DreamspaceElements.Form>
      </div>
      {/* Sonner Toast Container */}
      {DreamspaceElements.Sonner && <DreamspaceElements.Sonner />}
    </div>
  );
};

export { ActionableComponentComponent as component };
