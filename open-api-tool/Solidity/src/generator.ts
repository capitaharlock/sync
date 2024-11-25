import { FunctionDefinition } from "./parser";
import { OpenAPIV3 } from "openapi-types";

interface CustomOperationObject extends OpenAPIV3.PathItemObject {
    "x-abi"?: any;
    "x-read-only": boolean
}

// Map Solidity types to OpenAPI-compatible types
function mapSolidityTypeToOpenApiType(solidityType: string): OpenAPIV3.SchemaObject {
    const typeMapping: { [key: string]: OpenAPIV3.SchemaObject } = {
        address: { type: 'string' },
        uint256: { type: 'integer' },
        uint: { type: 'integer' },
        int256: { type: 'integer' },
        int: { type: 'integer' },
        bool: { type: 'boolean' },
        string: { type: 'string' },
        bytes: { type: 'string' },
        'bytes32': { type: 'string' },
    };
    return typeMapping[solidityType] || { type: 'string' };
}

// Format parameter descriptions to bold the name followed by the description
function formatParamDescriptions(params: { [key: string]: string }): string {
    return Object.entries(params)
        .map(([param, desc]) => `**${param}**: ${desc}`)
        .join('\n');
}

// Generate OpenAPI spec from function definitions
export function generateOpenApiSpec(smartContractName: string, functions: FunctionDefinition[]): OpenAPIV3.Document {
    const paths: OpenAPIV3.PathsObject = {};

    functions.forEach((func) => {
        const path = `/${func.name}`; // Define the path for the method

        const formattedParamsDescription = func.devdoc?.params ? formatParamDescriptions(func.devdoc.params) : '';
        const formattedReturnsDescription = func.devdoc?.returns ? `**Returns**: ${func.devdoc.returns}` : '';

        const abi = func.abi;

        // Using POST for all functions
        const operation: CustomOperationObject = {
            parameters: [
                ...func.inputs.map(param => ({
                    name: param.name,
                    in: 'query', // Adjust based on how you want to expose these parameters
                    required: true, // Set based on your requirements
                    description: param.description || '',
                    schema: mapSolidityTypeToOpenApiType(param.type),
                })),
                {
                    name: "contractAddress",
                    in: "query",
                    required: true,
                    schema: {
                        type: "string",
                        default: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
                    }
                },
                {
                    name: 'gas',
                    in: 'query',
                    required: false,
                    description: 'The maximum gas to use for the transaction.',
                    schema: { type: 'integer' },
                },
                {
                    name: 'gasPrice',
                    in: 'query',
                    required: false,
                    description: 'The price of gas in wei.',
                    schema: { type: 'integer' },
                },
                {
                    name: 'value',
                    in: 'query',
                    required: false,
                    description: 'Value to send with the transaction in wei.',
                    schema: { type: 'string' },
                },
            ],
            post: {
                summary: `${func.natspec || ''}`,
                requestBody: {
                    description: `Request body for ${func.name}.\n\n${formattedParamsDescription}`,
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    jsonrpc: { type: 'string', enum: ['2.0'] },
                                    method: { type: 'string', enum: [func.name] },
                                    params: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                gas: { type: 'integer', description: 'The maximum gas to use for the transaction.' },
                                                gasPrice: { type: 'integer', description: 'The price of gas in wei.' },
                                                value: { type: 'string', description: 'Value to send with the transaction in wei.' },
                                                data: { type: 'string', description: 'Additional data sent along with the transaction (for contract interaction).' },
                                            },
                                        },
                                    },
                                    id: { type: 'integer' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: `Successful response for ${func.name}.\n\n${formattedReturnsDescription}`,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        jsonrpc: { type: 'string', enum: ['2.0'] },
                                        id: { type: 'integer' },
                                        result: {
                                            type: 'object',
                                            properties: func.outputs.reduce((acc, ret, index) => {
                                                // Check if `ret` has a name, otherwise use `output_<index>`
                                                const outputName = (ret as any).name || `output_${index}`;
                                                acc[outputName] = {
                                                    ...mapSolidityTypeToOpenApiType((ret as any).type),
                                                    description: (ret as any).description || func.devdoc?.returns || '',
                                                };
                                                return acc;
                                            }, {} as Record<string, OpenAPIV3.SchemaObject>),
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            "x-abi": abi,
            "x-read-only": func.isView,
        };

        paths[path] = operation;
    });

    const openApiSpec: OpenAPIV3.Document = {
        openapi: "3.0.0",
        info: {
            title: `${smartContractName} Solidity API`,
            version: "1.0.0",
        },
        paths: paths,
    };

    return openApiSpec;
}
