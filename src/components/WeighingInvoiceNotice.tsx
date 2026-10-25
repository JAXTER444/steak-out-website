import { Scale } from "lucide-react";
import { cn } from "./ui/utils";

interface WeighingInvoiceNoticeProps {
  className?: string;
  compact?: boolean;
  onDark?: boolean;
}

export function WeighingInvoiceNotice({
  className,
  compact,
  onDark,
}: WeighingInvoiceNoticeProps) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-[8px] border-2 text-left",
        onDark
          ? "border-white/20 bg-white/5"
          : "border-black bg-[#FFF8F8]",
        compact ? "p-3" : "p-4",
        className,
      )}
      role="note"
    >
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full bg-[#EE101A]/10 text-[#EE101A]",
          compact ? "h-9 w-9" : "h-10 w-10",
        )}
      >
        <Scale className={compact ? "h-4 w-4" : "h-5 w-5"} aria-hidden />
      </div>
      <p
        className={cn(
          "leading-relaxed",
          onDark ? "text-white/75" : "text-gray-700",
          compact ? "text-xs" : "text-sm",
        )}
      >
        <span className={cn("font-medium", onDark ? "text-white" : "text-gray-900")}>
          Weighed fresh.
        </span>{" "}
        Your meat is weighed
        before packing. Amounts shown are estimates — we&apos;ll send you the exact invoice total
        once your order is prepared.
      </p>
    </div>
  );
}
