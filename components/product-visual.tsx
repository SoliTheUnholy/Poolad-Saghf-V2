import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ProductType } from "@/lib/domain";

export function ProductVisual({
  type,
  className,
}: {
  type: ProductType;
  className?: string;
}) {
  if (type === 1) {
    return (
      <div
        className={cn(
          "relative flex aspect-square items-center justify-center overflow-hidden",
          className,
        )}
      >
        <Image
          className="absolute object-cover"
          width={500}
          height={500}
          src="/r1.png"
          alt=""
        />
        <Image
          width={500}
          height={500}
          className="absolute object-cover"
          src="/t2.png"
          alt=""
        />
        <Image
          width={500}
          height={500}
          className="absolute object-cover"
          src="/o3.png"
          alt=""
        />
        <Image
          width={500}
          height={500}
          className="object-cover"
          src="/l4.png"
          alt=""
        />
      </div>
    );
  }
  return (
    <div className={cn("relative aspect-square", className)}>
      <Image
        src={type === 2 ? "/hcoil.png" : "/coil.png"}
        alt={type === 2 ? "کلاف" : "کلاف کشیده"}
        fill
        sizes="(max-width: 768px) 80vw, 36vw"
        className={cn(
          "object-contain drop-shadow-[0_28px_24px_rgba(15,23,42,.28)]",
          type === 2 ? "rotate-45" : "rotate-6",
        )}
      />
    </div>
  );
}
