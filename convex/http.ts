import { httpRouter } from "convex/server";
import { chat } from "./ai";

const http = httpRouter();

http.route({
  path: "/api/chat",
  method: "POST",
  handler: chat,
});

http.route({
  path: "/api/chat",
  method: "OPTIONS",
  handler: chat,
});

export default http;
