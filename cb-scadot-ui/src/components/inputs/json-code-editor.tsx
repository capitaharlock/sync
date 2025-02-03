// RJJ-TODO need to delete this 

import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism.css';

interface JsonEditorProps {
    onCodeChange: (newCode: string) => void;
    specs: string;
    // onCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const JsonCodeEditor: React.FC<JsonEditorProps> = ( { onCodeChange, specs }) => {
    
    // const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setCode(e.target.value);
    //     onCodeChange(e);
    // };
    const handleCodeChange = (newCodeValue: string) => {
        onCodeChange(newCodeValue);
    };

    return (
        <Editor
            value={specs}
            onValueChange={handleCodeChange}
            highlight={code => highlight(code, languages.json, 'json')}
            style={{
                fontFamily: '"Roboto Mono"',
                fontSize: 16,
                fontWeight: 500,
                lineHeight: 'normal',
                borderRadius: '4px',
                height: '100%',
                width: '100%',
                overflow: 'scroll',
                border: '1px solid #d9d9d9',
            }}
        />
        
    );
};
export default JsonCodeEditor;