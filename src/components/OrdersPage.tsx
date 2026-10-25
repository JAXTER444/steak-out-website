import { useConvexAuth } from "convex/react";
import { useQuery } from "convex/react";
import { Package } from "lucide-react";
import { api } from "../../convex/_generated/api";
import { formatRand } from "../lib/orderTotals";
import { Button } from "./ui/button";

interface OrdersPageProps {
  onNavigateToMenu: () => void;
  onOpenLogin: () => void;
}

const statusLabels: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function OrdersPage({ onNavigateToMenu, onOpenLogin }: OrdersPageProps) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const orders = useQuery(api.orders.listMine);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-[108px] pb-[42px] flex items-center justify-center">
        <p className="text-gray-600">Loading orders...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 pt-[108px] pb-[42px]">
        <div className="max-w-lg mx-auto px-4 text-center py-16">
          <Package className="w-16 h-16 mx-auto mb-6 text-gray-300" />
          <h1 className="text-2xl font-medium text-gray-900 mb-4">My orders</h1>
          <p className="text-gray-600 mb-8">
            Sign in to view your order history and track deliveries.
          </p>
          <Button
            onClick={onOpenLogin}
            className="text-white px-8"
            style={{ backgroundColor: "#EE101A" }}
            size="lg"
          >
            Log in
          </Button>
        </div>
      </div>
    );
  }

  const list = orders ?? [];

  return (
    <div className="min-h-screen bg-gray-50 pt-[108px] pb-[42px]">
      <div className="max-w-3xl mx-auto px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-medium text-gray-900 mb-2">My orders</h1>
          <p className="text-gray-600">Orders linked to your account.</p>
        </div>

        {list.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
            <Package className="w-14 h-14 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600 mb-6">You haven&apos;t placed any orders yet.</p>
            <Button
              onClick={onNavigateToMenu}
              style={{ backgroundColor: "#EE101A", color: "white" }}
              size="lg"
            >
              Browse menu
            </Button>
          </div>
        ) : (
          <ul className="space-y-4">
            {list.map((order) => (
              <li key={order._id} className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      {new Date(order._creationTime).toLocaleDateString(undefined, {
                        dateStyle: "medium",
                      })}
                    </p>
                    <p className="font-mono text-xs text-gray-400 mt-0.5">{order._id}</p>
                  </div>
                  <span className="text-sm font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-800">
                    {statusLabels[order.status] ?? order.status}
                  </span>
                </div>
                <ul className="space-y-1 mb-4 text-sm text-gray-700">
                  {order.items.map((item, index) => (
                    <li key={`${item.menuItemId}-${index}`}>
                      {item.quantity}× {item.name}
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between items-center border-t pt-4">
                  <span className="text-sm text-gray-600 capitalize">
                    {order.paymentMethod === "cod" ? "Cash on delivery" : "EFT"}
                  </span>
                  <span className="text-lg font-medium" style={{ color: "#EE101A" }}>
                    {formatRand(order.total)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
