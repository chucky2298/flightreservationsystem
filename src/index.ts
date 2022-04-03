import Http from "http";
import config from "./app/config/var/development";
import init from "./app/config/db/index";
import app from "./app/app";

export async function initServer() {
  const server = Http.createServer(app);

  await init();
	server.listen(config.port, () => {
    console.log(`
              \n\n
              --------------------------------
              --------------------------------
    
              Flight App:
    
              Status: OK
              Port: ${config.port}
    
              --------------------------------
              -------------------------------- 
              \n\n`);
  });
}

if (process.env.NODE_ENV !== "test") {
  initServer();
}
