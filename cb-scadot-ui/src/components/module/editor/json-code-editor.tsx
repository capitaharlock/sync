'use client';
import { useState } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-yaml';
import 'prismjs/themes/prism-tomorrow.css';

interface JsonEditorProps {
    onCodeChange: (newCode: string) => void;
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

const JsonCodeEditor: React.FC<JsonEditorProps> = ({ onCodeChange }) => {
    const [code, setCode] = useState<string>(initialSpec);

    const handleCodeChange = (newCode: string) => {
        setCode(newCode);
        onCodeChange(newCode);
    };

    return (
        <Editor
            value={code}
            onValueChange={handleCodeChange}
            highlight={code => highlight(code, languages.yaml, 'yaml')}
            padding={16}
            style={{
                fontFamily: '"Roboto Mono", monospace',
                fontSize: 14,
                lineHeight: '1.5',
                backgroundColor: '#1e1e1e', // Dark background for better contrast
                color: '#d4d4d4', // Light text color
                minHeight: '100%',
                overflow: 'auto',
            }}
            textareaClassName="editor-textarea"
            preClassName="editor-pre"
        />
    );
};

export default JsonCodeEditor;