#!/bin/bash

# Update project header component
cat > "src/components/project/details/project-header.tsx" << 'EOL'
'use client';
import React from 'react';
import styles from '@/components/project/styles/project.module.css';
import { Button } from '@appkit4/react-components/button';
import {
    Breadcrumb,
    BreadcrumbItem,
} from '@appkit4/react-components/breadcrumb';
import { useRouter } from 'next/navigation';

interface ProjectHeaderProps {
    projectId?: string;
    isNew?: boolean;
}

export default function ProjectHeader({
    projectId,
    isNew,
}: ProjectHeaderProps) {
    const router = useRouter();

    const handleSettingsClick = () => {
        router.push(`/projects/${projectId}`);
    };

    const handleModulesClick = () => {
        router.push(`/projects/${projectId}/modules`);
    };

    return (
        <div className={styles.headerWrapper}>
            <div className={styles.headerContainer}>
                <div className={styles.breadcrumbSection}>
                    <Breadcrumb>
                        <BreadcrumbItem>
                            <a href='/projects' tabIndex={0}>
                                Projects
                            </a>
                        </BreadcrumbItem>
                        <BreadcrumbItem>
                            <span tabIndex={1}>
                                {isNew ? 'New Project' : `Project ${projectId}`}
                            </span>
                        </BreadcrumbItem>
                    </Breadcrumb>
                </div>
                {!isNew && (
                    <div className={styles.buttonsSection}>
                        <Button
                            kind='secondary'
                            onClick={handleModulesClick}
                        >
                            Modules
                        </Button>
                        <Button
                            kind='secondary'
                            onClick={handleSettingsClick}
                        >
                            Settings
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
EOL

echo "Setup completed successfully!"