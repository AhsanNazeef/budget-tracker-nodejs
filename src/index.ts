import app from "./config/app";

const PORT = process.env.PORT || 5002;
const SERVER = process.env.SERVER || "localhost";

const serveProject = () =>
  app.listen(PORT, () => {
    console.log(`Project listening on port http://${SERVER}:${PORT}`);
  });

serveProject();
