import { formatRand } from "../lib/orderTotals";
import type { PlacedOrderSummary } from "./CheckoutPage";
import { Button } from "./ui/button";
import { WeighingInvoiceNotice } from "./WeighingInvoiceNotice";
import SteakOutFlame from "../imports/SteakOutFlame-8-153";

interface OrderConfirmationPageProps {
  order: PlacedOrderSummary;
  onNavigateToMenu: () => void;
  onNavigateToOrders?: () => void;
  showOrdersLink: boolean;
}

export function OrderConfirmationPage({
  order,
  onNavigateToMenu,
  onNavigateToOrders,
  showOrdersLink,
}: OrderConfirmationPageProps) {
  const firstName = order.customerName.split(" ")[0] || order.customerName;
  const shortRef = order.orderId.slice(-8).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 pt-[108px] pb-16">
      <div className="max-w-2xl mx-auto px-4 md:px-6">
        <div className="overflow-hidden rounded-[8px] border-2 border-black bg-[#0B0B0B] shadow-sm">
          <div className="bg-[#0B0B0B] px-6 py-10 md:py-12 text-center text-white relative">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-5 h-7 opacity-90">
              <SteakOutFlame />
            </div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/60 mt-8 mb-2">
              Order received
            </p>
            <h1 className="text-3xl md:text-4xl font-medium mb-3">Thank you, {firstName}</h1>
            <p className="text-white/80 text-base md:text-lg max-w-md mx-auto">
              We&apos;ve received your order and will prepare your cuts with care.
            </p>
            <p className="mt-6 inline-block rounded-[6px] border border-white/20 bg-white/5 px-4 py-2 font-mono text-sm tracking-wide">
              Ref #{shortRef}
            </p>
          </div>

          <div className="p-6 md:p-8 space-y-6 bg-[#0B0B0B] text-white">
            <WeighingInvoiceNotice onDark />

            <div className="rounded-[8px] border-2 border-black bg-white/95 p-5 md:p-6 space-y-5 text-gray-900">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#EE101A] mb-1">
                  Payment
                </p>
                <p className="text-lg font-medium text-gray-900">Bank transfer (EFT)</p>
                <p className="text-sm text-gray-600 mt-2">
                  We&apos;ll email banking details and your final invoice amount to{" "}
                  <span className="font-medium text-gray-900">{order.customerEmail}</span> once
                  your order has been weighed.
                </p>
              </div>

              <div className="border-t-2 border-gray-100 pt-5">
                <p className="text-xs font-medium uppercase tracking-wide text-[#EE101A] mb-1">
                  Delivery
                </p>
                <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                  {order.deliveryAddress}
                </p>
                {order.deliveryNotes && (
                  <p className="text-sm text-gray-600 mt-2">
                    <span className="font-medium text-gray-800">Notes:</span> {order.deliveryNotes}
                  </p>
                )}
              </div>

              <div className="border-t-2 border-gray-100 pt-5">
                <p className="text-xs font-medium uppercase tracking-wide text-[#EE101A] mb-3">
                  Your order
                </p>
                <ul className="space-y-2">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex justify-between gap-4 text-sm">
                      <span className="text-gray-800">
                        {item.quantity}× {item.name}
                        <span className="text-gray-500"> · {item.weight}</span>
                      </span>
                      <span className="text-gray-600 shrink-0 tabular-nums">
                        ~{formatRand(item.price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Estimated subtotal</span>
                    <span className="tabular-nums">~{formatRand(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT (15%)</span>
                    <span className="tabular-nums">~{formatRand(order.vat)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span className="tabular-nums">
                      {order.deliveryFee === 0 ? "FREE" : `~${formatRand(order.deliveryFee)}`}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-baseline mt-3 pt-3 border-t-2 border-black">
                  <span className="text-base font-medium text-gray-900">Estimated total</span>
                  <span className="text-2xl font-medium text-[#EE101A] tabular-nums">
                    ~{formatRand(order.total)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={onNavigateToMenu}
                className="flex-1 h-12 rounded-[6px] text-base font-medium text-white hover:opacity-90"
                style={{ backgroundColor: "#EE101A" }}
                size="lg"
              >
                Continue shopping
              </Button>
              {showOrdersLink && onNavigateToOrders && (
                <Button
                  variant="outline"
                  onClick={onNavigateToOrders}
                  size="lg"
                  className="flex-1 h-12 rounded-[6px] border-2 border-white/30 bg-transparent text-white text-base font-medium hover:bg-white/10"
                >
                  View my orders
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
