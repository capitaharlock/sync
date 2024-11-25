type BindingInput = {
    doc: string;
    name: string;
    value: { type: string, element?: { type: string } };
};

type BindingOutput = {
    type: string;
    element: { type: string };
};

export type FunctionBinding = {
    type: "function";
    doc: string;
    name: string;
    inputs: BindingInput[];
    outputs: BindingOutput[];
};

type OpenApiParameter = {
    name: string;
    in: "query" | "path" | "body";
    required: boolean;
    schema: { type: string };
    description?: string;
};

type OpenApiResponse = {
    description: string;
    content: {
        "application/json": {
            schema: {
                type: string;
                items?: { type: string };
            };
        };
    };
};

function convertType(type: string): string {
    // Map Stellar types to OpenAPI-compatible types
    switch (type) {
        case "u64":
            return "integer";
        case "string":
            return "string";
        case "vec":
            return "array";
        default:
            return "string"; // Default type if unknown
    }
}


// `# Arguments` section only. TODO: Use a md parser maybe even
function parseFunctionParametersDocs(docs: string): Record<string, string> | undefined {
    let paramsDocs: Record<string, string> = {};
    const paramsSection = docs.split("# Arguments")[1];
    if (paramsSection != undefined) {
        const lines = paramsSection.split("#")[0].split("\n");
        for (const line of lines)
            if (line.startsWith("*")) {
                const [name, doc] = line.substring(1).split("-");
                paramsDocs[name] = doc;
            }
    }
    else return undefined;
}

export function parseStellarBindingsToOpenApi(
    bindings: FunctionBinding[],
    bindingsDictionary: { [functionName: string]: { description: string; parameters: { name: string; description: string }[]; returnType: string } }
) {
    const openApiDoc: any = {
        openapi: "3.0.0",
        info: {
            title: "Stellar Smart Contract API",
            version: "1.0.0",
        },
        paths: {},
    };

    for (const func of bindings) {
        const path = `/${func.name}`;

        const paramDocs = parseFunctionParametersDocs(func.doc);

        const parameters: OpenApiParameter[] = func.inputs.map(input => {
            const paramDoc = paramDocs ? paramDocs[input.name] : bindingsDictionary[func.name]?.parameters.find(p => p.name === input.name)?.description || '';
            return {
                name: input.name,
                in: "query",
                required: true,
                schema: { type: convertType(input.value.type) },
                description: paramDoc,
                "x-native-type": input.value.type,
                "x-native-type-element": input.value.element?.type,
            };
        });

        const responseType = func.outputs[0]?.type;
        const responseItemType = func.outputs[0]?.element?.type || "string";

        const responses: Record<string, OpenApiResponse> = {
            "200": {
                description: bindingsDictionary[func.name]?.description || "Successful Response",
                content: {
                    "application/json": {
                        schema: {
                            type: convertType(responseType),
                            items: responseType === "vec" ? { type: convertType(responseItemType) } : undefined,
                        },
                    },
                },
            },
        };

        openApiDoc.paths[path] = {
            get: {
                summary: func.doc.split("\n\n")[0] || bindingsDictionary[func.name]?.description || `Function ${func.name}`,
                parameters,
                responses,
            },
        };
    }

    return openApiDoc;
}
