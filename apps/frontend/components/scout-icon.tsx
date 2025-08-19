interface ScoutIconProps {
  className?: string
}

export function ScoutIcon({ className = "h-8 w-8" }: ScoutIconProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Left lens */}
      <circle cx="30" cy="50" r="18" fill="currentColor" opacity="0.9" />
      <circle cx="30" cy="50" r="12" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.6" />

      {/* Right lens */}
      <circle cx="70" cy="50" r="18" fill="currentColor" opacity="0.9" />
      <circle cx="70" cy="50" r="12" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.6" />

      {/* Bridge connecting the lenses */}
      <rect x="45" y="47" width="10" height="6" rx="3" fill="currentColor" opacity="0.8" />

      {/* Eyepieces */}
      <circle cx="30" cy="50" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <circle cx="70" cy="50" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />

      {/* Lens reflections */}
      <circle cx="26" cy="46" r="3" fill="currentColor" opacity="0.3" />
      <circle cx="66" cy="46" r="3" fill="currentColor" opacity="0.3" />

      {/* Neck strap attachment points */}
      <circle cx="15" cy="35" r="2" fill="currentColor" opacity="0.6" />
      <circle cx="85" cy="35" r="2" fill="currentColor" opacity="0.6" />
    </svg>
  )
}
