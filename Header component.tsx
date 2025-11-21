/* eslint-disable react/jsx-no-target-blank */
// HeaderComponent.tsx
// Responsive CI Status header with collapsing navigation, wallet connect button, and company registration details

const HeaderComponent: React.FC = () => {
  // State to control the mobile sheet (hamburger) visibility
  const [open, setOpen] = React.useState(false);

  // Helper to close sheet after navigation (optional)
  const handleNavClick = React.useCallback(() => {
    setOpen(false);
  }, []);

  // Navigation definition for easy mapping
  const navItems = [
    {
      label: 'Overview',
      icon: Lucide.LayoutDashboard,
      href: '#overview',
    },
    {
      label: 'Builds',
      icon: Lucide.ListChecks,
      href: '#builds',
    },
    {
      label: 'Artifacts',
      icon: Lucide.Package,
      href: '#artifacts',
    },
  ];

  // Re-usable button classes to respect requirements
  const navButtonClass =
    'min-h-[44px] px-4 flex items-center gap-2 border border-primary rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors';

  // Note: If content overlaps the sticky header, adjust MainApp padding-top or lower chart z-index accordingly.
  return (
    <div className="@container w-full h-[150px] bg-background/90 backdrop-blur-md shadow-lg flex items-center px-6 justify-between overflow-x-hidden sticky top-0 z-50">
      {/* Logo, title & company registration (responsive layout) */}
      <a
        href="#home"
        className="flex flex-col @xl:flex-row items-start @xl:items-center gap-1 @xl:gap-2 select-none"
        /* logo link */
      >
        {/* Logo Icon */}
        {Lucide.Github && (
          <Lucide.Github size={28} className="text-foreground" />
        )}

        {/* Text container: CI title + company registration */}
        <div className="flex flex-col @xl:flex-row @xl:items-center">
          <h1 className="font-custom text-xl text-foreground">CI Status</h1>
          {/* Company name & registration – muted, smaller font */}
          <span
            className="font-custom text-xs opacity-70 @xl:ml-2 text-foreground"
            aria-label="Company registration: CEEAN PROJECT PTY(LTD) registration 2023/129836/07"
            title="Company registration: CEEAN PROJECT PTY(LTD) registration 2023/129836/07"
          >
            CEEAN PROJECT PTY(LTD) reg: 2023/129836/07
          </span>
        </div>
      </a>

      {/* Desktop navigation */}
      <nav className="hidden @xl:flex items-center gap-4 flex-1 justify-center">
        {navItems.map(({ label, icon: Icon, href }) => (
          <a
            key={label}
            href={href}
            onClick={handleNavClick}
            className={navButtonClass}
          >
            {Icon && <Icon size={18} className="text-primary-foreground" />}
            <span className="font-custom text-sm">{label}</span>
          </a>
        ))}
      </nav>

      {/* Connect wallet button */}
      <DreamspaceElements.Button
        className={`${navButtonClass} ml-auto`}
        onClick={() => {
          /* TODO: connect wallet logic */
        }}
      >
        {Lucide.Wallet && (
          <Lucide.Wallet size={18} className="text-primary-foreground" />
        )}
        <span className="font-custom text-sm">Connect Wallet</span>
      </DreamspaceElements.Button>

      {/* Mobile hamburger & sheet */}
      <DreamspaceElements.Sheet open={open} onOpenChange={setOpen}>
        <DreamspaceElements.SheetTrigger asChild>
          <button
            aria-label="Open navigation menu"
            className="@xl:hidden ml-4 p-2 border border-primary rounded bg-primary text-primary-foreground min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {Lucide.Menu && (
              <Lucide.Menu size={20} className="text-primary-foreground" />
            )}
          </button>
        </DreamspaceElements.SheetTrigger>
        <DreamspaceElements.SheetContent
          side="left"
          className="p-6 flex flex-col gap-4 bg-background overflow-y-auto"
        >
          <h2 className="font-custom text-lg text-foreground mb-2 flex items-center gap-2">
            {Lucide.Github && (
              <Lucide.Github size={20} className="text-foreground" />
            )}
            CI Status
          </h2>
          {navItems.map(({ label, icon: Icon, href }) => (
            <a
              key={label}
              href={href}
              onClick={handleNavClick}
              className={navButtonClass}
            >
              {Icon && <Icon size={18} className="text-primary-foreground" />}
              <span className="font-custom text-sm">{label}</span>
            </a>
          ))}
        </DreamspaceElements.SheetContent>
      </DreamspaceElements.Sheet>
    </div>
  );
};

export { HeaderComponent as component };
