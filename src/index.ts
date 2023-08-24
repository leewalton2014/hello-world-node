import express, {Express} from "express";
import bodyParser from "body-parser";
import { connectToDatabase } from "./database";
import helloEndpoint from "./endpoints/hello";
import healthEndpoint from "./endpoints/health";
import generateApiKeyEndpoint from "./endpoints/generateApiKey";
import { protectApiEndpoint } from "./middleware/protectApiEndpoint";
require("dotenv").config();

const app: Express = express();
const managementServer = express();

const PORT = process.env.PORT || 8080;
const MANAGEMENT_PORT = process.env.MANAGEMENT_PORT || 8081;

app.use(bodyParser.json());
app.use("/hello", helloEndpoint);
app.use("/health", healthEndpoint);
app.use("/generateApiKey", protectApiEndpoint, generateApiKeyEndpoint);

managementServer.use("/health", healthEndpoint);
managementServer.listen(MANAGEMENT_PORT, () => {
    console.log(`Management server listening on port ${MANAGEMENT_PORT}`);
});

connectToDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`App listening on port ${PORT}`);
    });
});
