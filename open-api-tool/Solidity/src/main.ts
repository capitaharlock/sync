import { generateOpenApiSpec } from "./generator";
import * as fs from "fs";
import { parseForgeArtifact } from "./parser";
import { FunctionBinding, parseStellarBindingsToOpenApi } from "./Stellar/stellarParser";
import { parseDocumentationDirectory } from "./Stellar/parseRustDocs";

const artifactPath = './out/MyContract.sol/MyContract.json';

(async () => {
    try {
        // Solidity
        const functions = parseForgeArtifact(artifactPath);
        // Generate the OpenAPI spec from parsed Solidity code
        const openApiSpec = generateOpenApiSpec("MyContract", functions);
        // Output the OpenAPI spec to a file
        fs.writeFileSync("openapi.json", JSON.stringify(openApiSpec, null, 2));
        console.log("Solidity spec generated and saved to openapi.json");

        // Stellar
        const fileString = fs.readFileSync('./stellar/bindings.json', 'utf-8');
        const bindings: FunctionBinding[] = JSON.parse(fileString);
        const rustFuncs = parseDocumentationDirectory("./stellar/rust_docs/hello_world")
        const openApiStellarSpec = parseStellarBindingsToOpenApi(bindings, rustFuncs);
        fs.writeFileSync("openapiStellar.json", JSON.stringify(openApiStellarSpec, null, 2));
    } catch (e) {
        console.error(e)
        // Deal with the fact the chain failed
    }
})();
