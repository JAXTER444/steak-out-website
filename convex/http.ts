import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { managementApi } from "./managementHttp";

const http = httpRouter();

auth.addHttpRoutes(http);

http.route({
  path: "/management/orders/summary",
  method: "GET",
  handler: managementApi.summary,
});

http.route({
  path: "/management/orders",
  method: "GET",
  handler: managementApi.list,
});

http.route({
  path: "/management/order",
  method: "GET",
  handler: managementApi.get,
});

http.route({
  path: "/management/order/status",
  method: "PATCH",
  handler: managementApi.updateStatus,
});

http.route({
  path: "/management/menu-prices",
  method: "GET",
  handler: managementApi.menuPrices,
});

export default http;
