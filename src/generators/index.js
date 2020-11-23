import dvMigrations from "./migrations/index.js";
import dvModels from "./models/index.js";
import dvControllers from "./controllers/index.js";
import dvRoutes from "./routes/index.js";

let dvGenerators = {
  dvMigrations,
  dvModels,
  dvControllers,
  dvRoutes,
};
module.exports = dvMigrations;
module.exports = dvModels;
module.exports = dvControllers;
module.exports = dvRoutes;

export default dvGenerators;
