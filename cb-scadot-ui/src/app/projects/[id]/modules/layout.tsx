'use client';
import React, { useEffect, useState } from 'react';
import ProjectHeader from '@/components/project/details/project-header';
import ModuleHeader from '@/components/module/header/module-header';
import { projectService } from '@/services/projects';

export default function ModuleLayout({ 
    children,
    params 
}: { 
    children: React.ReactNode;
    params: { id: string; }
}) {
    const [projectName, setProjectName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const project = await projectService.getById(Number(params.id));
                setProjectName(project.name);
            } catch (error) {
                console.error('Failed to fetch project:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [params.id]);

    // Check current path
    const [isModulePage, setIsModulePage] = useState(false);
    
    useEffect(() => {
        const path = window.location.pathname;
        setIsModulePage(path.includes('/modules/new') || path.includes('/modules/') && !path.endsWith('/modules'));
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ width: '100%', height: '100%' }}>
            {/* Show headers only on module pages (new, edit, etc) but not on the list */}
            {isModulePage ? (
                <>
                    <ProjectHeader
                        projectId={params.id}
                        selectedSection='modules'
                        projectName={projectName}
                    />
                    <ModuleHeader 
                        projectName={projectName}
                        projectId={params.id}
                    />
                </>
            ) : null}
            <div style={{ padding: '20px' }}>
                {children}
            </div>
        </div>
    );
}