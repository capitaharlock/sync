'use client';
import React from 'react';
import ModuleTest from '@/components/module/test/module-test';
import { useEffect, useState } from 'react';
import { moduleService } from '@/services/modules';
import { projectService } from '@/services/projects';

interface TestPageProps {
    params: {
        id: string;
        moduleId: string;
    };
}

export default function ModuleTestPage({ params }: TestPageProps) {
    const [moduleData, setModuleData] = useState<any>(null);
    const [projectName, setProjectName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('No token found');

                const [project, module] = await Promise.all([
                    projectService.getById(Number(params.id)),
                    moduleService.getById(token, Number(params.id), Number(params.moduleId))
                ]);

                setProjectName(project.name);
                setModuleData(module);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id, params.moduleId]);

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <div style={{ padding: '20px' }}>
                <ModuleTest projectId={params.id} moduleId={params.moduleId} />
            </div>
        </div>
    );
}