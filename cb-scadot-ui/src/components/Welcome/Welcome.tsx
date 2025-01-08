'use client';
import React, {useState, useEffect } from 'react';
import styles from './Welcome.module.css';
import CreateNewProjectBtn from '../buttons/create-new-project-btn';

const Welcome = () => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    })
    return isMounted ? (
        <div className={styles.tblbackground}>
            <div className={styles.container}>
                <div className={styles.left}>
                </div>
                <div className={styles.right}>
                    <div className={styles.frame835558396}>
                        <div className={styles.frame835558401}>
                                <div className={styles.rect}></div>
                                <p className={styles.title}>
                                    Welcome to <span>SCADOT</span>
                                </p>
                        </div>
                        <p className={styles.subtitle}>To get started, please create a new project.</p>
                    </div>
                    <CreateNewProjectBtn/>
                </div>
            </div>
        </div>
    ) : null;
}

export default Welcome;