import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useCart } from "../contexts/CartContext";
import { formatRand } from "../lib/cart";
import { computeOrderTotals } from "../lib/orderTotals";

interface CartPageProps {
  onNavigateToMenu: () => void;
  onNavigateToCheckout: () => void;
}

export function CartPage({ onNavigateToMenu, onNavigateToCheckout }: CartPageProps) {
  const { items: cartItems, updateQuantity, removeItem, totalQuantity } = useCart();

  const adjustQuantity = (lineKey: string, change: number) => {
    const item = cartItems.find((cartItem) => cartItem.lineKey === lineKey);
    if (!item) return;
    updateQuantity(lineKey, item.quantity + change);
  };

  const { subtotal, vat, delivery, total } = computeOrderTotals(cartItems);

  return (
    <div className="min-h-screen bg-gray-50 pt-[108px] pb-[42px]">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium text-gray-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-base md:text-lg text-gray-600">
            {totalQuantity} {totalQuantity === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 text-center">
            <ShoppingBag className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 text-gray-300" />
            <h2 className="text-xl md:text-2xl font-medium text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">Start adding premium cuts to your cart</p>
            <Button
              onClick={onNavigateToMenu}
              className="text-white px-8 py-4 text-lg"
              style={{ backgroundColor: "#EE101A" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#d60e17")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#EE101A")}
              size="lg"
            >
              Browse Menu
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.lineKey} className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
                  <div className="flex gap-4 md:gap-6">
                    <div className="w-20 h-20 md:w-32 md:h-32 flex-shrink-0 rounded-xl overflow-hidden">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <h3 className="text-lg md:text-xl font-medium text-gray-900 mb-1">
                          {item.name}
                        </h3>
                        <p className="text-sm md:text-base text-gray-600">{item.weight}</p>
                      </div>

                      <div className="flex items-center justify-between gap-4 mt-3">
                        <div className="flex items-center gap-2 md:gap-3">
                          <button
                            type="button"
                            onClick={() => adjustQuantity(item.lineKey, -1)}
                            className="w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                          >
                            <Minus className="w-3 h-3 md:w-4 md:h-4 text-gray-600" />
                          </button>
                          <span className="text-base md:text-lg font-medium text-gray-900 w-6 md:w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => adjustQuantity(item.lineKey, 1)}
                            className="w-7 h-7 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center transition-colors"
                            style={{ borderColor: "#EE101A" }}
                          >
                            <Plus className="w-3 h-3 md:w-4 md:h-4" style={{ color: "#EE101A" }} />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-lg md:text-2xl font-medium" style={{ color: "#EE101A" }}>
                            {formatRand(item.price * item.quantity)}
                          </p>
                          <p className="text-xs md:text-sm text-gray-500">
                            {formatRand(item.price)} each
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.lineKey)}
                      className="self-start p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4 md:w-5 md:h-5 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6 lg:sticky lg:top-24">
                <h2 className="text-xl md:text-2xl font-medium text-gray-900 mb-4 md:mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                  <div className="flex justify-between text-sm md:text-base text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900">{formatRand(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm md:text-base text-gray-600">
                    <span>VAT (15%)</span>
                    <span className="font-medium text-gray-900">{formatRand(vat)}</span>
                  </div>
                  <div className="flex justify-between text-sm md:text-base text-gray-600">
                    <span>Delivery</span>
                    <span className="font-medium text-gray-900">
                      {delivery === 0 ? "FREE" : formatRand(delivery)}
                    </span>
                  </div>

                  {delivery > 0 && (
                    <div className="text-xs md:text-sm text-gray-500 italic">
                      Free delivery on orders over R1,000
                    </div>
                  )}

                  <div className="border-t pt-3 md:pt-4">
                    <div className="flex justify-between text-lg md:text-xl font-medium">
                      <span className="text-gray-900">Total</span>
                      <span style={{ color: "#EE101A" }}>{formatRand(total)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={onNavigateToCheckout}
                  className="w-full text-white py-4 md:py-6 text-base md:text-lg font-medium mb-3 md:mb-4"
                  style={{ backgroundColor: "#EE101A" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#d60e17")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#EE101A")}
                  size="lg"
                >
                  Proceed to Checkout
                </Button>

                <Button
                  variant="outline"
                  onClick={onNavigateToMenu}
                  className="w-full border-gray-300 text-gray-900 hover:bg-gray-50 py-4 md:py-6 text-base md:text-lg"
                  size="lg"
                >
                  Continue Shopping
                </Button>

                <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t space-y-2 md:space-y-3">
                  <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-600">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>100% Quality Guarantee</span>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-600">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Fresh Delivery in 24 Hours</span>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-600">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Secure Checkout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
