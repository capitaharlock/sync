'use client';
import React, { useEffect, useState } from 'react';
import ModuleList from '@/components/module/list/module-list';
import ProjectHeader from '@/components/project/details/project-header';
import { projectService } from '@/services/projects';

export default function ModulesPage({ params }: { params: { id: string } }) {
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

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <ProjectHeader
                projectId={params.id}
                selectedSection='modules'
                projectName={projectName}
            />
            <ModuleList projectId={params.id} />
        </div>
    );
}