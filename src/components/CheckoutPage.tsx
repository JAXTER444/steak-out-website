import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { useConvexAuth } from "convex/react";
import { useQuery } from "convex/react";
import { toast } from "sonner";
import { api } from "../../convex/_generated/api";
import { useCart } from "../contexts/CartContext";
import { computeOrderTotals, formatRand } from "../lib/orderTotals";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { WeighingInvoiceNotice } from "./WeighingInvoiceNotice";
import type { Id } from "../../convex/_generated/dataModel";
import type { CartItem } from "../lib/cart";

export interface PlacedOrderSummary {
  orderId: Id<"orders">;
  paymentMethod: "eft";
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryNotes?: string;
  items: CartItem[];
  subtotal: number;
  vat: number;
  deliveryFee: number;
  total: number;
}

interface CheckoutPageProps {
  onNavigateToCart: () => void;
  onOrderPlaced: (order: PlacedOrderSummary) => void;
}

export function CheckoutPage({ onNavigateToCart, onOrderPlaced }: CheckoutPageProps) {
  const { items, clearCart } = useCart();
  const { isAuthenticated } = useConvexAuth();
  const user = useQuery(api.users.currentUser);
  const createOrder = useMutation(api.orders.create);

  const paymentMethod = "eft" as const;
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totals = computeOrderTotals(items);

  useEffect(() => {
    if (user?.name) setCustomerName(user.name);
    if (user?.email) setCustomerEmail(user.email);
    if (user?.phone) setCustomerPhone(user.phone);
  }, [user?.name, user?.email, user?.phone]);

  useEffect(() => {
    if (items.length === 0) {
      onNavigateToCart();
    }
  }, [items.length, onNavigateToCart]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);
    try {
      const orderItems = items.map((item) => ({
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        priceLabel: item.priceLabel,
        quantity: item.quantity,
        image: item.image,
        weight: item.weight,
      }));

      const orderId = await createOrder({
        paymentMethod,
        customerName,
        customerEmail,
        customerPhone,
        deliveryAddress,
        deliveryNotes: deliveryNotes || undefined,
        items: orderItems,
        subtotal: totals.subtotal,
        vat: totals.vat,
        deliveryFee: totals.delivery,
        total: totals.total,
      });

      const summary: PlacedOrderSummary = {
        orderId,
        paymentMethod,
        customerName,
        customerEmail,
        customerPhone,
        deliveryAddress,
        deliveryNotes: deliveryNotes || undefined,
        items: [...items],
        subtotal: totals.subtotal,
        vat: totals.vat,
        deliveryFee: totals.delivery,
        total: totals.total,
      };

      clearCart();
      toast.success("Order placed successfully!");
      onOrderPlaced(summary);
    } catch {
      toast.error("Could not place your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-[108px] pb-[42px]">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium text-gray-900 mb-2">
            Checkout
          </h1>
          <p className="text-base md:text-lg text-gray-600">
            {isAuthenticated
              ? "Review your details and place your order."
              : "Complete your details to place your order. Sign in to save order history."}
          </p>
        </div>

        <form onSubmit={(e) => void handleSubmit(e)} className="grid lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
              <h2 className="text-xl font-medium text-gray-900 mb-4">Contact & delivery</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="checkout-name">Full name</Label>
                  <Input
                    id="checkout-name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    className="h-12 bg-gray-50 border-gray-200"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="checkout-email">Email</Label>
                    <Input
                      id="checkout-email"
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      required
                      className="h-12 bg-gray-50 border-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="checkout-phone">Phone</Label>
                    <Input
                      id="checkout-phone"
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                      className="h-12 bg-gray-50 border-gray-200"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkout-address">Delivery address</Label>
                  <Textarea
                    id="checkout-address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    required
                    rows={3}
                    className="bg-gray-50 border-gray-200 resize-none"
                    placeholder="Street, suburb, city, postal code"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkout-notes">Delivery notes (optional)</Label>
                  <Textarea
                    id="checkout-notes"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    rows={2}
                    className="bg-gray-50 border-gray-200 resize-none"
                    placeholder="Gate code, preferred delivery time, etc."
                  />
                </div>
              </div>
            </div>

            <WeighingInvoiceNotice />

            <div className="bg-white rounded-[8px] border-2 border-black p-4 md:p-6">
              <h2 className="text-xl font-medium text-gray-900 mb-2">Payment</h2>
              <p className="text-sm text-gray-600 mb-4">
                We currently accept bank transfer (EFT) only.
              </p>
              <div className="rounded-[8px] border-2 border-[#EE101A] bg-[#FFF8F8] p-4">
                <p className="font-medium text-gray-900">Bank transfer (EFT)</p>
                <p className="text-sm text-gray-600 mt-1">
                  After your order is weighed, we&apos;ll email you banking details and the exact
                  invoice amount to {customerEmail || "your email address"}.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6 lg:sticky lg:top-24">
              <h2 className="text-xl font-medium text-gray-900 mb-4">Order summary</h2>
              <ul className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                {items.map((item) => (
                  <li key={item.id} className="flex justify-between gap-2 text-sm">
                    <span className="text-gray-700">
                      {item.quantity}× {item.name}
                    </span>
                    <span className="text-gray-900 font-medium shrink-0">
                      {formatRand(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="space-y-2 text-sm border-t pt-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatRand(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>VAT (15%)</span>
                  <span>{formatRand(totals.vat)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span>{totals.delivery === 0 ? "FREE" : formatRand(totals.delivery)}</span>
                </div>
                <div className="flex justify-between text-lg font-medium pt-2">
                  <span>Estimated total</span>
                  <span style={{ color: "#EE101A" }}>~{formatRand(totals.total)}</span>
                </div>
                <p className="text-xs text-gray-500 pt-2">
                  Final total confirmed after weighing.
                </p>
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full text-white py-6 text-lg mb-3"
                style={{ backgroundColor: "#EE101A" }}
                size="lg"
              >
                {isSubmitting ? "Placing order..." : "Place order"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onNavigateToCart}
                className="w-full py-6 text-lg"
                size="lg"
              >
                Back to cart
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
