import React, { useEffect, useState } from 'react';
import '../css/shared.css';
import styles from "./sliding-panel.module.css";
type CodePanelProps = {
    resultsJson: string | null;
    resetTrigger: boolean;
};
const CodePanel: React.FC<CodePanelProps> = ({ resultsJson, resetTrigger }) => {
    useEffect(() => {}, [resetTrigger]);
    return (
        <div className={styles.frame835558439}>
            <div className={styles.frame835558428}>
                <div className={styles.frame835558472}>
                    <div className={styles.frame835558433}>
                        <div className={styles.frame835558433b}></div>
                        <div className={styles.frame835558435}>
                            <div className={styles.frameWorkAreaCode}>
                                <div className={styles.frame835558429b}>
                                    <div className={styles.frame835558437}></div>
                                    <div className={styles.frame835558376}>
                                        <div className={styles.codeContainer}>
                                            {
                                                resultsJson !== null && resultsJson !== 'null'
                                                && (<pre>{resultsJson}</pre>) 
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.frame835558429}></div>
        </div>
    );
}
export default CodePanel;