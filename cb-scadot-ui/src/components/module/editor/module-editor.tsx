'use client';
import React, { useState, useEffect } from 'react';
import JsonCodeEditor from '@/components/module/editor/json-code-editor';
import styles from '@/components/module/styles/module.module.css';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import YAML from 'yaml';

interface ModuleEditorProps {
    projectId: string;
    moduleId: string;
}

export default function ModuleEditor({ projectId, moduleId }: ModuleEditorProps) {
    const [spec, setSpec] = useState<any>(null);

    const handleCodeChange = (newCode: string) => {
        try {
            const parsedSpec = YAML.parse(newCode);
            setSpec(parsedSpec);
        } catch (e) {
            console.log('Invalid YAML:', e);
            setSpec(null);
        }
    };

    useEffect(() => {
        handleCodeChange(initialSpec);
    }, []);

    return (
        <div className={styles.editorContainer}>
            <div className={styles.editorPanel}>
                <div className={styles.editorContent}>
                    <JsonCodeEditor 
                        onCodeChange={handleCodeChange}
                    />
                </div>
            </div>

            <div className={styles.swaggerPanel}>
                <div className={styles.swaggerViewer}>
                    {spec ? (
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