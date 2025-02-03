'use client';
import styles from './index.module.css'
import JsonCodeEditor from '../../inputs/json-code-editor';
import { useAppDispatch, useAppSelector } from '@/lib/reduxHooks';
import OpenApiViewer from './specs-viewer';
import { useEffect } from 'react';
import { fetchApiSpecs } from '@/lib/slices/ApiTestingSlice';

interface ModuleEditorProps {
    projectId: string;
    moduleId: string;
}

const ModuleEditor:React.FC<ModuleEditorProps> = ({ projectId, moduleId } ) => {

    const { specs } = useAppSelector(state => state.apiTesting);
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(fetchApiSpecs({ projectId: projectId, moduleId: moduleId }));
    }, [specs, projectId, moduleId, dispatch]);
    const handleCodeChange = (code: string) => {
        setTimeout(() => async () => {
            console.log("update code ", code);
        }, 1000);


    }
    if (!specs) {
        return <div>Loading...</div>;
    }
    return (
        <div className={styles.right}>
            <div className={styles.frame83558458}>
                <div className={styles.jsonPanel}>
                    <div className={styles.jsonHeader58417}>
                        <div>
                            <h1>TODO: Repo Button here?</h1>
                        </div>
                    </div>
                    <div className={styles.jsonPane584376}>
                        <div className={styles.code}>
                            <JsonCodeEditor onCodeChange={handleCodeChange} specs={JSON.stringify(specs, null, 2)} />
                        </div>
                        <div className={styles.statusBar}>
                            {/* status bar */}
                        </div>
                    </div>
                </div>
                <div className={styles.htmlPanel}>
                    <div className={styles.jsonHeader58417}>
                        <div>
                            <br/>
                        </div>
                    </div>
                    <div className={styles.jsonPane584376}>
                        <div className={styles.code}>
                            <OpenApiViewer spec={specs} />
                        </div>
                        <div className={styles.statusBar}>
                            {/* status bar */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ModuleEditor;