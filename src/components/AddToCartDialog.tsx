import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import type { MenuItem, ProductOption } from "../lib/cart";
import {
  formatRand,
  optionPrice,
  optionWeight,
  parsePrice,
} from "../lib/cart";
import { useCart } from "../contexts/CartContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { WeighingInvoiceNotice } from "./WeighingInvoiceNotice";

interface AddToCartDialogProps {
  item: MenuItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddToCartDialog({ item, open, onOpenChange }: AddToCartDialogProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState<ProductOption | null>(null);

  useEffect(() => {
    if (open && item) {
      setQuantity(1);
      setSelectedOption(item.options?.[0] ?? null);
    }
  }, [open, item]);

  if (!item) {
    return null;
  }

  const hasOptions = Boolean(item.options?.length);
  const unitPriceLabel = selectedOption
    ? optionPrice(item, selectedOption)
    : item.price;
  const unitWeight = selectedOption
    ? optionWeight(item, selectedOption)
    : item.weight;
  const unitPrice = parsePrice(unitPriceLabel);
  const lineTotal = unitPrice * quantity;
  const optionHeading = item.optionLabel ?? "Option";
  const pricesVary =
    hasOptions &&
    new Set(
      item.options!.map((option) => optionPrice(item, option)),
    ).size > 1;

  const handleAdd = () => {
    const resolved: MenuItem = {
      ...item,
      price: unitPriceLabel,
      weight: unitWeight,
    };
    addItem(resolved, quantity);
    toast.success(
      hasOptions && selectedOption
        ? `${quantity} × ${item.name} (${selectedOption.label}) added to cart`
        : `${quantity} × ${item.name} added to cart`,
    );
    onOpenChange(false);
  };

  const optionCount = item.options?.length ?? 0;
  const optionGridClass =
    optionCount <= 2
      ? "grid-cols-2"
      : optionCount === 3
        ? "grid-cols-3"
        : "grid-cols-2 sm:grid-cols-3";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-[8px] border-2 border-black p-0 overflow-hidden">
        <div className="p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-medium text-gray-900 pr-6">
              Add to cart
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {hasOptions
                ? `Choose a ${optionHeading.toLowerCase()} and how many you\u2019d like to add.`
                : "Choose how many you\u2019d like to add."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-4 mb-6">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-[8px] border-2 border-black">
              <ImageWithFallback
                src={item.image}
                alt={item.name}
                className="size-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-medium text-gray-900 leading-snug">
                {item.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{unitWeight}</p>
              <p className="text-lg font-bold text-[#EE101A] mt-2">{unitPriceLabel}</p>
            </div>
          </div>

          {hasOptions && item.options && (
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">{optionHeading}</p>
              <div className={`grid ${optionGridClass} gap-2`}>
                {item.options.map((option) => {
                  const selected = selectedOption?.label === option.label;
                  const priceLabel = optionPrice(item, option);
                  return (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => setSelectedOption(option)}
                      className={`rounded-[8px] border-2 px-2 py-2.5 text-center transition-colors ${
                        selected
                          ? "border-[#EE101A] bg-[#EE101A]/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="block text-sm font-medium text-gray-900 leading-snug">
                        {option.label}
                      </span>
                      {pricesVary && (
                        <span
                          className={`block text-xs mt-0.5 ${
                            selected ? "text-[#EE101A] font-semibold" : "text-gray-500"
                          }`}
                        >
                          {priceLabel}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between rounded-[8px] border-2 border-gray-200 px-4 py-3 mb-6">
            <span className="text-sm font-medium text-gray-700">Quantity</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gray-300 hover:border-gray-400 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4 text-gray-600" />
              </button>
              <span className="w-8 text-center text-lg font-medium text-gray-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#EE101A] transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4 text-[#EE101A]" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4 text-base">
            <span className="text-gray-600">Estimated subtotal</span>
            <span className="font-semibold text-gray-900">~{formatRand(lineTotal)}</span>
          </div>

          <WeighingInvoiceNotice compact className="mb-6" />

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-12 border-2 border-gray-200"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="flex-1 h-12 rounded-[6px] text-base"
              style={{ backgroundColor: "#0B0B0B", color: "white" }}
              onClick={handleAdd}
            >
              Add to cart
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
