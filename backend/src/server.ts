import { createApp } from './app.js';
import { env } from './config/env.js';
import { closeContainer, container } from './container.js';

const app = createApp({ authController: container.authController });

const server = app.listen(env.PORT, () => {
  console.log(`API escuchando en http://localhost:${env.PORT}`);
});

// Al cortar el proceso (Ctrl+C o un redeploy), se terminan las requests en curso y se cierra la base.
function shutdown(signal: NodeJS.Signals): void {
  console.log(`${signal} recibido: cerrando el servidor`);
  server.close(() => {
    closeContainer()
      .then(() => process.exit(0))
      .catch((error: unknown) => {
        console.error(error);
        process.exit(1);
      });
  });
}

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
