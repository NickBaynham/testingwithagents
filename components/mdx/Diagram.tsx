import Image from "next/image";
import type { ReactNode } from "react";

/*
  Placeholder diagram block used inside project case studies. Renders a
  captioned figure with a dashed border so it is obviously a stand-in
  until a real image lands. Pass `src` + `width` + `height` to render an
  actual image; pass `caption` for accessible alt text and figcaption.
*/
type Props = {
  caption: string;
  src?: string;
  width?: number;
  height?: number;
  children?: ReactNode;
};

export function Diagram({ caption, src, width = 1200, height = 630, children }: Props) {
  return (
    <figure className="my-8 rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-surface-muted)] px-5 py-6">
      {src ? (
        <Image
          src={src}
          alt={caption}
          width={width}
          height={height}
          className="mx-auto block h-auto max-w-full rounded"
        />
      ) : (
        <div className="text-center text-sm text-[var(--color-text-subtle)]">
          {children ?? "Diagram coming soon."}
        </div>
      )}
      <figcaption className="mt-3 text-center text-xs uppercase tracking-widest text-[var(--color-text-subtle)]">
        {caption}
      </figcaption>
    </figure>
  );
}
