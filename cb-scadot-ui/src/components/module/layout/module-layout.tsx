'use client';
import React, { useState } from 'react';
import styles from '@/components/project/styles/project.module.css';

interface ModuleLayoutBaseProps {
    children: React.ReactNode;
    selectedSection: 'details' | 'repository';
    onSectionChange: (section: 'details' | 'repository') => void;
    isNew?: boolean;  // Add this prop
}

export default function ModuleLayoutBase({ 
    children, 
    selectedSection,
    onSectionChange,
    isNew 
}: ModuleLayoutBaseProps) {
    return (
        <div className={styles.mainContainer}>
            <div className={styles.twoColumnLayout}>
                <div className={styles.leftColumn}>
                    <h1 className={styles.mainTitle}>Module settings</h1>
                    <nav className={styles.menu}>
                        <div 
                            className={`${styles.menuItem} ${selectedSection === 'details' ? styles.active : ''}`}
                            onClick={() => onSectionChange('details')}
                        >
                            Module details
                        </div>
                        <div 
                            className={`${styles.menuItem} ${selectedSection === 'repository' ? styles.active : ''} ${isNew ? styles.disabled : ''}`}
                            onClick={isNew ? undefined : () => onSectionChange('repository')}
                            style={isNew ? { cursor: 'not-allowed', opacity: 0.5 } : undefined}
                        >
                            Repository
                        </div>
                    </nav>
                </div>
                <div className={styles.rightColumn}>
                    {children}
                </div>
            </div>
        </div>
    );
}