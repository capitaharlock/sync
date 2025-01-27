'use client';

import React, { Suspense } from 'react';
import ModuleTest from '@/components/module/test/module-test';
import { useEffect, useState } from 'react';
import { moduleService } from '@/services/modules';
import { projectService } from '@/services/projects';

interface TestPageProps {
    params: Promise<{
        id: string;
        moduleId: string;
    }>;
}

function ModuleTestContent({ projectId, moduleId }: { projectId: string, moduleId: string }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found');
                }

                await Promise.all([
                    projectService.getById(Number(projectId)),
                    moduleService.getById(token, Number(projectId), Number(moduleId))
                ]);

            } catch (error) {
                setError(error instanceof Error ? error.message : 'An error occurred');
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [projectId, moduleId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <div style={{ padding: '20px' }}>
                <ModuleTest projectId={projectId} moduleId={moduleId} />
            </div>
        </div>
    );
}

export default function ModuleTestPage({ params }: TestPageProps) {
    const unwrappedParams = React.use(params);
    const projectId = unwrappedParams.id;
    const moduleId = unwrappedParams.moduleId;

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ModuleTestContent 
                projectId={projectId}
                moduleId={moduleId}
            />
        </Suspense>
    );
}