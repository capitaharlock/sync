import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ApiPayload, ApiTestingStatus, ApiTestResults, ScOpenApiSpec } from '../type-helper';


export interface AppState {
    executionStatus: ApiTestingStatus;
    testFormData: { [key: string]: string };
    specs: ScOpenApiSpec;
    testResults: ApiTestResults;
    wallet: {
        provider: unknown;
        signer: unknown;
    }
}
const initialState: AppState = {
    executionStatus: ApiTestingStatus.NOT_STARTED,
    testFormData: {},
    specs: {
        openapi: "3.0.0",
        info: {
            title: "",
            version: ""
        },
        paths: {}
    },
    testResults: {},
    wallet: {
        provider: null,
        signer: null
    }
};

export const fetchApiSpecs = createAsyncThunk(
    'app/fetchApiSpecs',
    async ({ projectId, moduleId }: { projectId: string, moduleId: string }) => {
        console.log("fetchApiSpecs called ...  projectid: ", projectId, " moduleId: ", moduleId);
        return dummySpecs;
        // const res = await request({
        //   url: `/apis/specs`,
        // });
        // return res;
    }

);
export const excuteApi = createAsyncThunk(
    'app/executeApi',
    async (args: { payload: ApiPayload }) => {
        const dummyResults = {
            ...args.payload,
            success: true
        }
        return dummyResults;
        // const res = await request({
        //   url: `/apis/specs`,
        // });
        // return res;
    }

);

export const apiTestingSlice = createSlice({
    name: 'modules',
    initialState,
    reducers: {
        setExecutionStatus: (state, action) => {
            state.executionStatus = action.payload;
        },
        setTestFormData: (state, action) => {
            state.testFormData = action.payload;
        },
        setTestResults: (state, action) => {
            state.testResults = action.payload;
        }
    },
    extraReducers(builder) {
        builder.addCase(
            fetchApiSpecs.fulfilled,
            (state, { payload }) => {
                state.specs = payload;
            },
        );
        builder.addCase(
            excuteApi.fulfilled,
            (state, { payload }) => {
                state.testResults = payload;
            },
        );
    },
});


export const {
    setExecutionStatus,
    setTestFormData,
    setTestResults
} = apiTestingSlice.actions;

export default apiTestingSlice.reducer;





export const dummySpecs: ScOpenApiSpec = {
    "openapi": "3.0.0",
    "info": {
        "title": "MyContract Solidity API",
        "version": "1.0.0"
    },
    "paths": {
        "/balanceOf": {
            "parameters": [
                {
                    "name": "_account",
                    "in": "query",
                    "required": true,
                    "description": "The address to query balance for",
                    "schema": {
                        "type": "string"
                    }
                },
                {
                    "name": "contractAddress",
                    "in": "query",
                    "required": true,
                    "schema": {
                        "type": "string",
                        "default": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
                    }
                },
                {
                    "name": "gas",
                    "in": "query",
                    "required": false,
                    "description": "The maximum gas to use for the transaction.",
                    "schema": {
                        "type": "integer"
                    }
                },
                {
                    "name": "gasPrice",
                    "in": "query",
                    "required": false,
                    "description": "The price of gas in wei.",
                    "schema": {
                        "type": "integer"
                    }
                },
                {
                    "name": "value",
                    "in": "query",
                    "required": false,
                    "description": "Value to send with the transaction in wei.",
                    "schema": {
                        "type": "string"
                    }
                }
            ],
            "post": {
                "summary": "Get the balance of an account22",
                "requestBody": {
                    "description": "Request body for balanceOf.\n\n**_account**: The address to query balance for",
                    "required": true,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "jsonrpc": {
                                        "type": "string",
                                        "enum": [
                                            "2.0"
                                        ]
                                    },
                                    "method": {
                                        "type": "string",
                                        "enum": [
                                            "balanceOf"
                                        ]
                                    },
                                    "params": {
                                        "type": "array",
                                        "items": {
                                            "type": "object",
                                            "properties": {
                                                "gas": {
                                                    "type": "integer",
                                                    "description": "The maximum gas to use for the transaction."
                                                },
                                                "gasPrice": {
                                                    "type": "integer",
                                                    "description": "The price of gas in wei."
                                                },
                                                "value": {
                                                    "type": "string",
                                                    "description": "Value to send with the transaction in wei."
                                                },
                                                "data": {
                                                    "type": "string",
                                                    "description": "Additional data sent along with the transaction (for contract interaction)."
                                                }
                                            }
                                        }
                                    },
                                    "id": {
                                        "type": "integer"
                                    }
                                }
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Successful response for balanceOf.\n\n**Returns**: The balance of the account",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "jsonrpc": {
                                            "type": "string",
                                            "enum": [
                                                "2.0"
                                            ]
                                        },
                                        "id": {
                                            "type": "integer"
                                        },
                                        "result": {
                                            "type": "object",
                                            "properties": {
                                                "output_0": {
                                                    "type": "integer",
                                                    "description": "The balance of the account"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "x-abi": "{\"type\":\"function\",\"name\":\"balanceOf\",\"inputs\":[{\"name\":\"_account\",\"type\":\"address\",\"internalType\":\"address\"}],\"outputs\":[{\"name\":\"\",\"type\":\"uint256\",\"internalType\":\"uint256\"}],\"stateMutability\":\"view\"}",
            "x-read-only": true
        },
        "/balances": {
            "parameters": [
                {
                    "name": "",
                    "in": "query",
                    "required": true,
                    "description": "",
                    "schema": {
                        "type": "string"
                    }
                },
                {
                    "name": "contractAddress",
                    "in": "query",
                    "required": true,
                    "schema": {
                        "type": "string",
                        "default": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
                    }
                },
                {
                    "name": "gas",
                    "in": "query",
                    "required": false,
                    "description": "The maximum gas to use for the transaction.",
                    "schema": {
                        "type": "integer"
                    }
                },
                {
                    "name": "gasPrice",
                    "in": "query",
                    "required": false,
                    "description": "The price of gas in wei.",
                    "schema": {
                        "type": "integer"
                    }
                },
                {
                    "name": "value",
                    "in": "query",
                    "required": false,
                    "description": "Value to send with the transaction in wei.",
                    "schema": {
                        "type": "string"
                    }
                }
            ],
            "post": {
                "summary": "Mapping to store balances of each address",
                "requestBody": {
                    "description": "Request body for balances.\n\n",
                    "required": true,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "jsonrpc": {
                                        "type": "string",
                                        "enum": [
                                            "2.0"
                                        ]
                                    },
                                    "method": {
                                        "type": "string",
                                        "enum": [
                                            "balances"
                                        ]
                                    },
                                    "params": {
                                        "type": "array",
                                        "items": {
                                            "type": "object",
                                            "properties": {
                                                "gas": {
                                                    "type": "integer",
                                                    "description": "The maximum gas to use for the transaction."
                                                },
                                                "gasPrice": {
                                                    "type": "integer",
                                                    "description": "The price of gas in wei."
                                                },
                                                "value": {
                                                    "type": "string",
                                                    "description": "Value to send with the transaction in wei."
                                                },
                                                "data": {
                                                    "type": "string",
                                                    "description": "Additional data sent along with the transaction (for contract interaction)."
                                                }
                                            }
                                        }
                                    },
                                    "id": {
                                        "type": "integer"
                                    }
                                }
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Successful response for balances.\n\n",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "jsonrpc": {
                                            "type": "string",
                                            "enum": [
                                                "2.0"
                                            ]
                                        },
                                        "id": {
                                            "type": "integer"
                                        },
                                        "result": {
                                            "type": "object",
                                            "properties": {
                                                "output_0": {
                                                    "type": "integer",
                                                    "description": ""
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "x-abi": "{\"type\":\"function\",\"name\":\"balances\",\"inputs\":[{\"name\":\"\",\"type\":\"address\",\"internalType\":\"address\"}],\"outputs\":[{\"name\":\"\",\"type\":\"uint256\",\"internalType\":\"uint256\"}],\"stateMutability\":\"view\"}",
            "x-read-only": true
        },
        "/burn": {
            "parameters": [
                {
                    "name": "_amount",
                    "in": "query",
                    "required": true,
                    "description": "The amount of tokens to burn",
                    "schema": {
                        "type": "integer"
                    }
                },
                {
                    "name": "contractAddress",
                    "in": "query",
                    "required": true,
                    "schema": {
                        "type": "string",
                        "default": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
                    }
                },
                {
                    "name": "gas",
                    "in": "query",
                    "required": false,
                    "description": "The maximum gas to use for the transaction.",
                    "schema": {
                        "type": "integer"
                    }
                },
                {
                    "name": "gasPrice",
                    "in": "query",
                    "required": false,
                    "description": "The price of gas in wei.",
                    "schema": {
                        "type": "integer"
                    }
                },
                {
                    "name": "value",
                    "in": "query",
                    "required": false,
                    "description": "Value to send with the transaction in wei.",
                    "schema": {
                        "type": "string"
                    }
                }
            ],
            "post": {
                "summary": "Burn tokens from the owner's balance",
                "requestBody": {
                    "description": "Request body for burn.\n\n**_amount**: The amount of tokens to burn",
                    "required": true,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "jsonrpc": {
                                        "type": "string",
                                        "enum": [
                                            "2.0"
                                        ]
                                    },
                                    "method": {
                                        "type": "string",
                                        "enum": [
                                            "burn"
                                        ]
                                    },
                                    "params": {
                                        "type": "array",
                                        "items": {
                                            "type": "object",
                                            "properties": {
                                                "gas": {
                                                    "type": "integer",
                                                    "description": "The maximum gas to use for the transaction."
                                                },
                                                "gasPrice": {
                                                    "type": "integer",
                                                    "description": "The price of gas in wei."
                                                },
                                                "value": {
                                                    "type": "string",
                                                    "description": "Value to send with the transaction in wei."
                                                },
                                                "data": {
                                                    "type": "string",
                                                    "description": "Additional data sent along with the transaction (for contract interaction)."
                                                }
                                            }
                                        }
                                    },
                                    "id": {
                                        "type": "integer"
                                    }
                                }
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Successful response for burn.\n\n",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "jsonrpc": {
                                            "type": "string",
                                            "enum": [
                                                "2.0"
                                            ]
                                        },
                                        "id": {
                                            "type": "integer"
                                        },
                                        "result": {
                                            "type": "object",
                                            "properties": {}
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "x-abi": "{\"type\":\"function\",\"name\":\"burn\",\"inputs\":[{\"name\":\"_amount\",\"type\":\"uint256\",\"internalType\":\"uint256\"}],\"outputs\":[],\"stateMutability\":\"nonpayable\"}",
            "x-read-only": false
        },
        "/mint": {
            "parameters": [
                {
                    "name": "_amount",
                    "in": "query",
                    "required": true,
                    "description": "The amount of new tokens to mint",
                    "schema": {
                        "type": "integer"
                    }
                },
                {
                    "name": "contractAddress",
                    "in": "query",
                    "required": true,
                    "schema": {
                        "type": "string",
                        "default": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
                    }
                },
                {
                    "name": "gas",
                    "in": "query",
                    "required": false,
                    "description": "The maximum gas to use for the transaction.",
                    "schema": {
                        "type": "integer"
                    }
                },
                {
                    "name": "gasPrice",
                    "in": "query",
                    "required": false,
                    "description": "The price of gas in wei.",
                    "schema": {
                        "type": "integer"
                    }
                },
                {
                    "name": "value",
                    "in": "query",
                    "required": false,
                    "description": "Value to send with the transaction in wei.",
                    "schema": {
                        "type": "string"
                    }
                }
            ],
            "post": {
                "summary": "Mint new tokens and add them to the owner's balance",
                "requestBody": {
                    "description": "Request body for mint.\n\n**_amount**: The amount of new tokens to mint",
                    "required": true,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "jsonrpc": {
                                        "type": "string",
                                        "enum": [
                                            "2.0"
                                        ]
                                    },
                                    "method": {
                                        "type": "string",
                                        "enum": [
                                            "mint"
                                        ]
                                    },
                                    "params": {
                                        "type": "array",
                                        "items": {
                                            "type": "object",
                                            "properties": {
                                                "gas": {
                                                    "type": "integer",
                                                    "description": "The maximum gas to use for the transaction."
                                                },
                                                "gasPrice": {
                                                    "type": "integer",
                                                    "description": "The price of gas in wei."
                                                },
                                                "value": {
                                                    "type": "string",
                                                    "description": "Value to send with the transaction in wei."
                                                },
                                                "data": {
                                                    "type": "string",
                                                    "description": "Additional data sent along with the transaction (for contract interaction)."
                                                }
                                            }
                                        }
                                    },
                                    "id": {
                                        "type": "integer"
                                    }
                                }
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Successful response for mint.\n\n",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "jsonrpc": {
                                            "type": "string",
                                            "enum": [
                                                "2.0"
                                            ]
                                        },
                                        "id": {
                                            "type": "integer"
                                        },
                                        "result": {
                                            "type": "object",
                                            "properties": {}
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "x-abi": "{\"type\":\"function\",\"name\":\"mint\",\"inputs\":[{\"name\":\"_amount\",\"type\":\"uint256\",\"internalType\":\"uint256\"}],\"outputs\":[],\"stateMutability\":\"nonpayable\"}",
            "x-read-only": false
        },
        "/owner": {
            "parameters": [
                {
                    "name": "contractAddress",
                    "in": "query",
                    "required": true,
                    "schema": {
                        "type": "string",
                        "default": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
                    }
                },
                {
                    "name": "gas",
                    "in": "query",
                    "required": false,
                    "description": "The maximum gas to use for the transaction.",
                    "schema": {
                        "type": "integer"
                    }
                },
                {
                    "name": "gasPrice",
                    "in": "query",
                    "required": false,
                    "description": "The price of gas in wei.",
                    "schema": {
                        "type": "integer"
                    }
                },
                {
                    "name": "value",
                    "in": "query",
                    "required": false,
                    "description": "Value to send with the transaction in wei.",
                    "schema": {
                        "type": "string"
                    }
                }
            ],
            "post": {
                "summary": "The owner of the contract",
                "requestBody": {
                    "description": "Request body for owner.\n\n",
                    "required": true,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "jsonrpc": {
                                        "type": "string",
                                        "enum": [
                                            "2.0"
                                        ]
                                    },
                                    "method": {
                                        "type": "string",
                                        "enum": [
                                            "owner"
                                        ]
                                    },
                                    "params": {
                                        "type": "array",
                                        "items": {
                                            "type": "object",
                                            "properties": {
                                                "gas": {
                                                    "type": "integer",
                                                    "description": "The maximum gas to use for the transaction."
                                                },
                                                "gasPrice": {
                                                    "type": "integer",
                                                    "description": "The price of gas in wei."
                                                },
                                                "value": {
                                                    "type": "string",
                                                    "description": "Value to send with the transaction in wei."
                                                },
                                                "data": {
                                                    "type": "string",
                                                    "description": "Additional data sent along with the transaction (for contract interaction)."
                                                }
                                            }
                                        }
                                    },
                                    "id": {
                                        "type": "integer"
                                    }
                                }
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Successful response for owner.\n\n",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "jsonrpc": {
                                            "type": "string",
                                            "enum": [
                                                "2.0"
                                            ]
                                        },
                                        "id": {
                                            "type": "integer"
                                        },
                                        "result": {
                                            "type": "object",
                                            "properties": {
                                                "output_0": {
                                                    "type": "string",
                                                    "description": ""
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "x-abi": "{\"type\":\"function\",\"name\":\"owner\",\"inputs\":[],\"outputs\":[{\"name\":\"\",\"type\":\"address\",\"internalType\":\"address\"}],\"stateMutability\":\"view\"}",
            "x-read-only": true
        },
        "/totalSupply": {
            "parameters": [
                {
                    "name": "contractAddress",
                    "in": "query",
                    "required": true,
                    "schema": {
                        "type": "string",
                        "default": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
                    }
                },
                {
                    "name": "gas",
                    "in": "query",
                    "required": false,
                    "description": "The maximum gas to use for the transaction.",
                    "schema": {
                        "type": "integer"
                    }
                },
                {
                    "name": "gasPrice",
                    "in": "query",
                    "required": false,
                    "description": "The price of gas in wei.",
                    "schema": {
                        "type": "integer"
                    }
                },
                {
                    "name": "value",
                    "in": "query",
                    "required": false,
                    "description": "Value to send with the transaction in wei.",
                    "schema": {
                        "type": "string"
                    }
                }
            ],
            "post": {
                "summary": "The total supply of tokens",
                "requestBody": {
                    "description": "Request body for totalSupply.\n\n",
                    "required": true,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "jsonrpc": {
                                        "type": "string",
                                        "enum": [
                                            "2.0"
                                        ]
                                    },
                                    "method": {
                                        "type": "string",
                                        "enum": [
                                            "totalSupply"
                                        ]
                                    },
                                    "params": {
                                        "type": "array",
                                        "items": {
                                            "type": "object",
                                            "properties": {
                                                "gas": {
                                                    "type": "integer",
                                                    "description": "The maximum gas to use for the transaction."
                                                },
                                                "gasPrice": {
                                                    "type": "integer",
                                                    "description": "The price of gas in wei."
                                                },
                                                "value": {
                                                    "type": "string",
                                                    "description": "Value to send with the transaction in wei."
                                                },
                                                "data": {
                                                    "type": "string",
                                                    "description": "Additional data sent along with the transaction (for contract interaction)."
                                                }
                                            }
                                        }
                                    },
                                    "id": {
                                        "type": "integer"
                                    }
                                }
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Successful response for totalSupply.\n\n",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "jsonrpc": {
                                            "type": "string",
                                            "enum": [
                                                "2.0"
                                            ]
                                        },
                                        "id": {
                                            "type": "integer"
                                        },
                                        "result": {
                                            "type": "object",
                                            "properties": {
                                                "output_0": {
                                                    "type": "integer",
                                                    "description": ""
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "x-abi": "{\"type\":\"function\",\"name\":\"totalSupply\",\"inputs\":[],\"outputs\":[{\"name\":\"\",\"type\":\"uint256\",\"internalType\":\"uint256\"}],\"stateMutability\":\"view\"}",
            "x-read-only": true
        },
        "/transfer": {
            "parameters": [
                {
                    "name": "_to",
                    "in": "query",
                    "required": true,
                    "description": "The address to transfer tokens to",
                    "schema": {
                        "type": "string"
                    }
                },
                {
                    "name": "_amount",
                    "in": "query",
                    "required": true,
                    "description": "The amount of tokens to transfer",
                    "schema": {
                        "type": "integer"
                    }
                },
                {
                    "name": "contractAddress",
                    "in": "query",
                    "required": true,
                    "schema": {
                        "type": "string",
                        "default": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
                    }
                },
                {
                    "name": "gas",
                    "in": "query",
                    "required": false,
                    "description": "The maximum gas to use for the transaction.",
                    "schema": {
                        "type": "integer"
                    }
                },
                {
                    "name": "gasPrice",
                    "in": "query",
                    "required": false,
                    "description": "The price of gas in wei.",
                    "schema": {
                        "type": "integer"
                    }
                },
                {
                    "name": "value",
                    "in": "query",
                    "required": false,
                    "description": "Value to send with the transaction in wei.",
                    "schema": {
                        "type": "string"
                    }
                }
            ],
            "post": {
                "summary": "Transfer tokens from the caller to another account",
                "requestBody": {
                    "description": "Request body for transfer.\n\n**_amount**: The amount of tokens to transfer\n**_to**: The address to transfer tokens to",
                    "required": true,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "jsonrpc": {
                                        "type": "string",
                                        "enum": [
                                            "2.0"
                                        ]
                                    },
                                    "method": {
                                        "type": "string",
                                        "enum": [
                                            "transfer"
                                        ]
                                    },
                                    "params": {
                                        "type": "array",
                                        "items": {
                                            "type": "object",
                                            "properties": {
                                                "gas": {
                                                    "type": "integer",
                                                    "description": "The maximum gas to use for the transaction."
                                                },
                                                "gasPrice": {
                                                    "type": "integer",
                                                    "description": "The price of gas in wei."
                                                },
                                                "value": {
                                                    "type": "string",
                                                    "description": "Value to send with the transaction in wei."
                                                },
                                                "data": {
                                                    "type": "string",
                                                    "description": "Additional data sent along with the transaction (for contract interaction)."
                                                }
                                            }
                                        }
                                    },
                                    "id": {
                                        "type": "integer"
                                    }
                                }
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Successful response for transfer.\n\n**Returns**: A boolean indicating success",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "jsonrpc": {
                                            "type": "string",
                                            "enum": [
                                                "2.0"
                                            ]
                                        },
                                        "id": {
                                            "type": "integer"
                                        },
                                        "result": {
                                            "type": "object",
                                            "properties": {
                                                "output_0": {
                                                    "type": "boolean",
                                                    "description": "A boolean indicating success"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "x-abi": "{\"type\":\"function\",\"name\":\"transfer\",\"inputs\":[{\"name\":\"_to\",\"type\":\"address\",\"internalType\":\"address\"},{\"name\":\"_amount\",\"type\":\"uint256\",\"internalType\":\"uint256\"}],\"outputs\":[{\"name\":\"\",\"type\":\"bool\",\"internalType\":\"bool\"}],\"stateMutability\":\"nonpayable\"}",
            "x-read-only": false
        }
    }
}