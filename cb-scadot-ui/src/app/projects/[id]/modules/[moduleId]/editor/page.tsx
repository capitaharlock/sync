'use client';

import React, { useEffect, useState } from 'react';
import ModuleEditor from '@/components/module/editor/module-editor';
import { moduleService } from '@/services/modules';

interface EditorPageProps {
    params: Promise<{
        id: string;
        moduleId: string;
    }>;
}

export default function ModuleEditorPage({ params }: EditorPageProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const unwrappedParams = React.use(params);
    const projectId = unwrappedParams.id;
    const moduleId = unwrappedParams.moduleId;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setError(null);
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Authentication token not found');
                    return;
                }

                const moduleResponse = await moduleService.getById(
                    token, 
                    Number(projectId), 
                    Number(moduleId)
                );
                
                if (!moduleResponse) {
                    setError('Module not found');
                    return;
                }
                
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch module data');
                console.error('Failed to fetch data:', err);
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
            <ModuleEditor 
                projectId={projectId} 
                moduleId={moduleId} 
            />
        </div>
    );
}