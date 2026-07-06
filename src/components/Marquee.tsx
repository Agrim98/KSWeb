interface MarqueeProps {
  items: string[]
}

/** Infinite running banner. Track is duplicated so the CSS loop is seamless. */
function Marquee({ items }: MarqueeProps) {
  const sequence = (
    <>
      {items.map((item) => (
        <span className="marquee-item" key={item}>
          {item}
          <i className="marquee-dot" aria-hidden="true" />
        </span>
      ))}
    </>
  )

  return (
    <div className="marquee" aria-label={items.join(', ')}>
      <div className="marquee-track">
        {sequence}
        {sequence}
      </div>
    </div>
  )
}

export default Marquee
