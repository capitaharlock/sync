import { generateOpenApiSpec } from "./generator";
import * as fs from "fs";
import { parseForgeArtifact } from "./parser";

const artifactPath = './out/MyContract.sol/MyContract.json';

(async () => {
    try {
        const functions = parseForgeArtifact(artifactPath);

        // Generate the OpenAPI spec from parsed Solidity code
        const openApiSpec = generateOpenApiSpec(functions);

        // Output the OpenAPI spec to a file
        fs.writeFileSync("openapi.json", JSON.stringify(openApiSpec, null, 2));

        console.log("OpenAPI spec generated and saved to openapi.json");
    } catch (e) {
        console.error(e)
        // Deal with the fact the chain failed
    }
    // `text` is not available here
})();
