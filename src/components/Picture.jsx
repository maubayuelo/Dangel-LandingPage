// ─────────────────────────────────────────────────────────────────────────────
// components/Picture.jsx — RESPONSIVE <img> WRAPPER
//
// Renders WordPress media (ACF image field shape: { node: { sourceUrl,
// srcSet, altText, mediaDetails } }) with srcSet/sizes so the browser picks
// the right derivative instead of always downloading the full-size original.
//
// width/height come from mediaDetails (the image's intrinsic pixels) so the
// browser can reserve layout space before the image loads — without them,
// the image's arrival shifts the page (CLS).
// ─────────────────────────────────────────────────────────────────────────────

export default function Picture({
  image,
  alt = '',
  sizes,
  className,
  eager = false,
  decorative = false,
  fallbackSrc,
  fallbackWidth,
  fallbackHeight,
}) {
  const node = image?.node
  const src = node?.sourceUrl || fallbackSrc
  if (!src) return null

  const width = node?.mediaDetails?.width ?? fallbackWidth
  const height = node?.mediaDetails?.height ?? fallbackHeight
  // `alt` is the caller's fully-resolved value (see lib/resolveAlt.js) —
  // Picture doesn't re-merge node.altText, that would invert the priority
  // when the ACF field is set but the Media Library also has a stale value.
  const altText = decorative ? '' : alt

  return (
    <img
      src={src}
      srcSet={node?.srcSet || undefined}
      sizes={sizes}
      alt={altText}
      width={width}
      height={height}
      className={className}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={eager ? 'high' : undefined}
      role={decorative ? 'presentation' : undefined}
    />
  )
}
