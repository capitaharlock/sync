'use client';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import ProjectHeader from '@/components/project/details/project-header';
import ModuleHeader from '@/components/module/header/module-header';
import { projectService } from '@/services/projects';
import { moduleService } from '@/services/modules';

export default function ModuleLayout({ 
    children,
    params 
}: { 
    children: React.ReactNode;
    params: { id: string; moduleId: string }
}) {
    const [projectName, setProjectName] = useState('');
    const [moduleData, setModuleData] = useState(undefined);
    const pathname = usePathname();
    
    console.log('[ModuleLayout] Start - pathname:', pathname);
    console.log('[ModuleLayout] Start - params:', params);
    
    const segments = pathname.split('/');
    const moduleId = segments[segments.length - 2];  // Changed to -2 to get moduleId from /modules/1/editor
    const isNewModule = moduleId === 'new';
    
    console.log('[ModuleLayout] Extracted moduleId:', moduleId);
    console.log('[ModuleLayout] isNewModule:', isNewModule);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.log('[ModuleLayout] No token found');
                    return;
                }

                const project = await projectService.getById(Number(params.id));
                setProjectName(project.name);
                console.log('[ModuleLayout] Project fetched:', project.name);

                if (!isNewModule && moduleId) {
                    console.log('[ModuleLayout] Fetching module:', moduleId);
                    const moduleResponse = await moduleService.getById(
                        token,
                        Number(params.id),
                        Number(moduleId)
                    );
                    console.log('[ModuleLayout] Module response:', moduleResponse);

                    if (moduleResponse) {
                        const data = {
                            id: moduleResponse.id,
                            name: moduleResponse.name,
                            status: moduleResponse.status,
                            visibility: moduleResponse.visibility,
                            networkName: "Ethereum",
                            date_time_created: new Date().toISOString()
                        };
                        console.log('[ModuleLayout] Setting moduleData:', data);
                        setModuleData(data);
                    }
                }
            } catch (error) {
                console.error('[ModuleLayout] Error:', error);
            }
        };

        fetchData();
    }, [params.id, moduleId, isNewModule]);

    return (
        <div style={{ width: '100%', height: '100%' }}>
            {(segments.length > 4) && (
                <>
                    <ProjectHeader
                        projectId={params.id}
                        selectedSection='modules'
                        projectName={projectName}
                    />
                    <ModuleHeader 
                        projectName={projectName}
                        projectId={params.id}
                        moduleData={moduleData}
                    />
                </>
            )}
            <div style={{ padding: '20px' }}>
                {children}
            </div>
        </div>
    );
}