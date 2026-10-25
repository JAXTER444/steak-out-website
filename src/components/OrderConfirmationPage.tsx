import { CheckCircle2 } from "lucide-react";
import { formatRand } from "../lib/orderTotals";
import type { PlacedOrderSummary } from "./CheckoutPage";
import { Button } from "./ui/button";

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
  const paymentLabel =
    order.paymentMethod === "cod" ? "Cash on delivery" : "Bank transfer (EFT)";

  return (
    <div className="min-h-screen bg-gray-50 pt-[108px] pb-[42px]">
      <div className="max-w-2xl mx-auto px-4 md:px-6">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-10 text-center">
          <CheckCircle2 className="w-16 h-16 mx-auto mb-6 text-green-600" />
          <h1 className="text-3xl md:text-4xl font-medium text-gray-900 mb-2">
            Order confirmed
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you, {order.customerName.split(" ")[0]}. We&apos;ve received your order and
            will be in touch shortly.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Order reference:{" "}
            <span className="font-mono font-medium text-gray-800">{order.orderId}</span>
          </p>

          <div className="text-left rounded-xl border border-gray-200 p-6 mb-8 space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Payment</p>
              <p className="text-gray-900">{paymentLabel}</p>
              {order.paymentMethod === "eft" && (
                <p className="text-sm text-gray-600 mt-1">
                  Payment instructions will be sent to {order.customerEmail}.
                </p>
              )}
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Delivery</p>
              <p className="text-gray-900 whitespace-pre-wrap">{order.deliveryAddress}</p>
              {order.deliveryNotes && (
                <p className="text-sm text-gray-600 mt-1">Notes: {order.deliveryNotes}</p>
              )}
            </div>
            <ul className="border-t pt-4 space-y-2">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.quantity}× {item.name}
                  </span>
                  <span>{formatRand(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between font-medium text-lg border-t pt-4">
              <span>Total</span>
              <span style={{ color: "#EE101A" }}>{formatRand(order.total)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={onNavigateToMenu}
              className="text-white px-8"
              style={{ backgroundColor: "#EE101A" }}
              size="lg"
            >
              Continue shopping
            </Button>
            {showOrdersLink && onNavigateToOrders && (
              <Button variant="outline" onClick={onNavigateToOrders} size="lg" className="px-8">
                View my orders
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
