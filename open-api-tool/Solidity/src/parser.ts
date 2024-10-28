import * as fs from 'fs';

export interface FunctionDefinition {
  name: string;
  inputs: Array<{ name: string; type: string; description?: string }>;
  outputs: Array<{ type: string; description?: string }>;
  natspec: string;
  devdoc?: { params?: Record<string, string>; returns?: string };
  abi: string;
}

// Read the Forge-generated artifact and parse the ABI along with devdoc
export function parseForgeArtifact(artifactPath: string): FunctionDefinition[] {
  const artifactContent = fs.readFileSync(artifactPath, 'utf-8');
  const artifact = JSON.parse(artifactContent);

  // ABI and NatSpec are available in the Forge artifact
  const abi = artifact.abi;
  const userdoc = artifact.metadata.output.userdoc;
  const devdoc = artifact.metadata.output.devdoc;

  const functions: FunctionDefinition[] = abi
    .filter((item: any) => item.type === 'function')
    .map((func: any) => {
      // Extract devdoc descriptions for the parameters and returns
      const devdocMethod = devdoc?.methods[`${func.name}(${func.inputs.map((input: any) => input.type).join(',')})`] || {};
      const devdocParams = devdocMethod?.params || {};
      const devdocReturns = devdocMethod?.returns?._0 || '';

      // Extract NatSpec description
      const natspecDescription = userdoc?.methods[`${func.name}(${func.inputs.map((input: any) => input.type).join(',')})`]?.notice || '';

      return {
        name: func.name,
        inputs: func.inputs.map((input: any) => ({
          name: input.name,
          type: input.type,
          description: devdocParams[input.name] || '', // Attach the parameter description from devdoc
        })),
        outputs: func.outputs.map((output: any) => ({
          type: output.type,
          description: devdocReturns || '', // Attach return description from devdoc
        })),
        natspec: natspecDescription,
        devdoc: { params: devdocParams, returns: devdocReturns },
        abi: JSON.stringify(func),
      };
    });

  return functions;
}
