// Caneca de café na mesa da cena da Home (o "café: true" do card de código).
// Só decorativa; vapor animado em hero.css (desliga com animações reduzidas).
export function HeroMug() {
  return (
    <div aria-hidden className="hero-card hero-mug">
      <span className="hero-mug-steam">
        <i />
        <i />
        <i />
      </span>
      <svg viewBox="0 0 64 60" className="hero-mug-body">
        <defs>
          <linearGradient id="hero-mug-shade" x1="0" x2="1">
            <stop offset="0" stopColor="#0c1016" />
            <stop offset="0.45" stopColor="#2a323d" />
            <stop offset="1" stopColor="#0c1016" />
          </linearGradient>
        </defs>
        {/* Alça */}
        <path
          d="M46 18c9 0 12 5 12 11s-4 12-13 12"
          fill="none"
          stroke="#1c232d"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Corpo e boca */}
        <path d="M6 10h42v38a10 10 0 0 1-10 10H16A10 10 0 0 1 6 48z" fill="url(#hero-mug-shade)" />
        <ellipse cx="27" cy="10" rx="21" ry="4" fill="#3a2418" />
        <ellipse cx="27" cy="10" rx="21" ry="4" fill="none" stroke="#3b4552" strokeWidth="1.5" />
        {/* Logo { } no acento */}
        <text
          x="27"
          y="38"
          textAnchor="middle"
          fontFamily="JetBrains Mono Variable, monospace"
          fontSize="14"
          fontWeight="700"
          fill="var(--accent)"
        >
          {'{ }'}
        </text>
      </svg>
    </div>
  )
}
