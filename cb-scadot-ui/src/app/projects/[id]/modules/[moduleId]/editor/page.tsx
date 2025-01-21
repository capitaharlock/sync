'use client';
import React, { useEffect, useState } from 'react';
import ModuleEditor from '@/components/module/editor/module-editor';
import ModuleHeader from '@/components/module/header/module-header';
import { moduleService } from '@/services/modules';

interface EditorPageProps {
    params: {
        id: string;
        moduleId: string;
    };
}

export default function ModuleEditorPage({ params }: EditorPageProps) {
    const [moduleData, setModuleData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('No token found');

                const module = await moduleService.getById(
                    token, 
                    Number(params.id), 
                    Number(params.moduleId)
                );
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
            <ModuleEditor 
                projectId={params.id} 
                moduleId={params.moduleId} 
            />
        </div>
    );
}