'use client';
import React, { useEffect, useState, Suspense } from 'react';
import ModuleList from '@/components/module/list/module-list';
import ProjectHeader from '@/components/project/details/project-header';
import { projectService } from '@/services/projects';

interface ModulesPageProps {
    params: Promise<{
        id: string;
    }>;
}

function ModulesPageContent({ projectId }: { projectId: string }) {
    const [projectName, setProjectName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const project = await projectService.getById(Number(projectId));
                setProjectName(project.name);
            } catch (error) {
                console.error('Failed to fetch project:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [projectId]);

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <ProjectHeader
                projectId={projectId}
                selectedSection='modules'
                projectName={projectName}
            />
            <ModuleList projectId={projectId} />
        </div>
    );
}

export default function ModulesPage({ params }: ModulesPageProps) {
    const unwrappedParams = React.use(params);
    const projectId = unwrappedParams.id;

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ModulesPageContent projectId={projectId} />
        </Suspense>
    );
}