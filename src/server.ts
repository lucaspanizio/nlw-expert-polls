import fastify from "fastify";
import cookie from '@fastify/cookie'
import websocket from "@fastify/websocket";
import { routes } from '@http/routes'
import { pollResults } from "@ws/poll-results";

const app = fastify();

app.register(websocket);
app.register(cookie, {
  secret: "app-nlw-polls",
  hook: 'onRequest', 
});

// HTTP Routes
Object.values(routes).forEach((routeFunction) => {
  app.register(routeFunction);
});

// WebSocket Route
app.register(pollResults);

app.listen({port: 3333}, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running!`);
})