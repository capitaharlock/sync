'use client';

import React, { useState, useEffect } from 'react';
import JsonCodeEditor from '@/components/module/editor/json-code-editor';
import styles from '@/components/module/styles/module.module.css';
// @ts-expect-error: SwaggerUI types are not available
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import YAML from 'yaml';
import { moduleService } from '@/services/modules';

interface ModuleEditorProps {
    projectId: string;
    moduleId: string;
}

interface OpenAPISpec {
    openapi: string;
    paths: Record<string, unknown>;
    [key: string]: unknown;
}

export default function ModuleEditor({ projectId, moduleId }: ModuleEditorProps) {
    const [spec, setSpec] = useState<OpenAPISpec | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchModuleSpec = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const moduleData = await moduleService.getById(token, Number(projectId), Number(moduleId));
                if (moduleData?.content_source) {
                    handleCodeChange(moduleData.content_source);
                } else {
                    handleCodeChange(initialSpec);
                }
            } catch (error) {
                console.error('Failed to fetch module specification:', error);
                setError(error instanceof Error ? error.message : 'Failed to fetch module data');
                handleCodeChange(initialSpec);
            }
        };

        fetchModuleSpec();
    }, [projectId, moduleId]);

    const handleCodeChange = (newCode: string) => {
        try {
            const parsedSpec = YAML.parse(newCode) as OpenAPISpec;
            if (!parsedSpec.openapi) {
                throw new Error('Invalid OpenAPI specification: missing openapi version');
            }
            setSpec(parsedSpec);
            setError(null);
        } catch (error) {
            console.error('Invalid YAML:', error);
            setError(error instanceof Error ? error.message : 'Invalid YAML format');
            setSpec(null);
        }
    };

    return (
        <div className={styles.editorContainer}>
            <div className={styles.editorPanel}>
                <div className={styles.editorContent}>
                    <JsonCodeEditor 
                        onCodeChange={handleCodeChange}
                        initialValue={initialSpec}
                    />
                </div>
            </div>

            <div className={styles.swaggerPanel}>
                <div className={styles.swaggerViewer}>
                    {error && (
                        <div className={styles.error}>{error}</div>
                    )}
                    {spec ? (
                        // @ts-expect-error: SwaggerUI component lacks proper TypeScript definitions
                        <SwaggerUI spec={spec} />
                    ) : (
                        <div>Enter valid OpenAPI specification</div>
                    )}
                </div>
            </div>
        </div>
    );
}

const initialSpec = `openapi: 3.0.3
paths:
  /pet:
    put:
      tags:
        - pet
      summary: Update an existing pet
      description: Update an existing pet by Id
      operationId: updatePet
      requestBody:
        description: Update an existent pet in the store
        required: true
      responses:
        '200':
          description: Successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Pet'          
            application/xml:
              schema:
                $ref: '#/components/schemas/Pet'`;