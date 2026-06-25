/** Soft radial-dot texture, reused across image-less sections (see footer). */
export function DotTexture() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 text-brand opacity-[0.05] [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:18px_18px]"
    />
  )
}
