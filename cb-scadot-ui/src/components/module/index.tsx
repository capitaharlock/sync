import { useState } from 'react';
import styles from './index.module.css'
import ModuleHeader from './module-header'
import ModuleLeftNav from './module-left-nav'
import ModuleEditor from './editor';
import ModuleExecutePanel from './execute'

export default function ModulePanel() {
    const [currentPanelId, setCurrentPanelId] = useState('editor');
    const handlePanelChange = (panelId: string) => {
        setCurrentPanelId(panelId);
    };
    return (
        <div className={styles.contentContainer}>
            <ModuleHeader  />
            <div className={styles.mainPanel}>
                <ModuleLeftNav onPanelChange={handlePanelChange} />
                {/* { currentPanelId === 'editor' && (<ModuleEditor />) } */}
                { currentPanelId === 'execute' && (<ModuleExecutePanel />) }
            </div>
        </div>
    )
}
