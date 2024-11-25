import express from 'express';
import * as fs from 'fs';
import * as path from 'path';

const app = express();
const port = 3011;

// Paths to OpenAPI JSON files
const openApiSpecPath = path.join(__dirname, '../openapi.json');
const openApiSpecPathStellar = path.join(__dirname, '../openapiStellar.json');

// Serve the OpenAPI spec JSON at /openapi.json and /openapiStellar.json
app.get('/openapi.json', (req, res) => {
  res.sendFile(openApiSpecPath);
});

app.get('/openapiStellar.json', (req, res) => {
  res.sendFile(openApiSpecPathStellar);
});

// Serve custom JavaScript or any other static files
app.use('/public', express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(port, () => {
  console.log(`OpenAPI JSON available at http://localhost:${port}/openapi.json`);
  console.log(`Visit http://localhost:${port}/public/solidity.html in your browser to access Swagger UI`);
});
