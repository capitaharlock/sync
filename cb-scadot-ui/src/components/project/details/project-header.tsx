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
    selectedSection?: 'settings' | 'modules';
    projectName?: string;
}

export default function ProjectHeader({
    projectId,
    isNew,
    selectedSection = 'settings',
    projectName = '',
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
                                {isNew ? 'New Project' : projectName || 'Loading...'}
                            </span>
                        </BreadcrumbItem>
                        {selectedSection === 'modules' && (
                            <BreadcrumbItem>
                                <span tabIndex={2}>Modules</span>
                            </BreadcrumbItem>
                        )}
                    </Breadcrumb>
                </div>
                {!isNew && (
                    <div className={styles.buttonsSection}>
                        <Button
                            kind={selectedSection === 'modules' ? 'primary' : 'secondary'}
                            onClick={handleModulesClick}
                        >
                            Modules
                        </Button>
                        <Button
                            kind={selectedSection === 'settings' ? 'primary' : 'secondary'}
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
