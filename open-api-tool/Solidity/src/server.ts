import express from 'express';
import swaggerUi from 'swagger-ui-express';
import * as fs from 'fs';
import * as path from 'path';

const app = express();
const port = 3011;

const openApiSpecPath = path.join(__dirname, '../openapi.json');
const swaggerDocument = JSON.parse(fs.readFileSync(openApiSpecPath, 'utf-8'));


const options = {
  explorer: true,
  swaggerOptions: {
    requestInterceptor: (req: any) => {
      // Extract URL parts
      const url = new URL(req.url);
      const methodName = 'eth_call';  // Always use eth_call for smart contract interaction
      const queryParams = url.searchParams;  // Extract query parameters

      // Extract parameters for the balanceOf call (ERC20)
      const to = queryParams.get('contractAddress');  // Contract address is required
      const address = queryParams.get('from');  // Address for balanceOf

      if (!to || !address) {
        throw new Error('Missing required parameters: contractAddress or address');
      }

      const paramValues = [];

      for (const [key, value] of queryParams.entries()) {
        if (key == 'contractAddress' || key == 'from' || key == 'gas' || key == 'gasPrice' || key == 'value') {
          continue
        }
        paramValues.push(value);
    }

      // @ts-ignore
      const iface = new ethers.Interface([JSON.parse(swaggerDocument.paths[url.pathname]["x-abi"])])
      const data = iface.encodeFunctionData(url.pathname.replace("/", ""), paramValues)

      // Construct the eth_call parameters
      const ethRpcCall = {
        jsonrpc: '2.0',
        method: methodName,
        params: [
          {
            to,
            data,
          },
          'latest',  // Block number or "latest"
        ],
        id: 1,
      };

      // Update the request body to be the Ethereum RPC call
      req.body = JSON.stringify(ethRpcCall);

      // Remove query parameters from the URL
      req.url = url.origin
      console.log('Encoded Ethereum RPC Call:', req);

      return req;
    },
  },
  customJs: "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.13.4/ethers.umd.min.js",
  customJsStr: "const swaggerDocument = " + JSON.stringify(swaggerDocument)
};


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

// Serve the OpenAPI spec JSON at /openapi.json
app.get('/openapi.json', (req, res) => {
  res.sendFile(openApiSpecPath);
});

// Start the server
app.listen(port, () => {
  console.log(`Swagger UI running at http://localhost:${port}/api-docs`);
});
