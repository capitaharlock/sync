'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import ProjectHeader from '@/components/project/details/project-header';
import ModuleHeader from '@/components/module/header/module-header';
import { projectService } from '@/services/projects';
import { moduleService } from '@/services/modules';

interface ModuleData {
    id: number;
    name: string;
    status: "active" | "inactive";
    visibility: "public" | "private";
    networkName: string;
    date_time_created: string;
}

interface LayoutProps {
    children: React.ReactNode;
    params: Promise<{
        id: string;
        moduleId: string;
    }>;
}

function ModuleLayoutContent({ 
    children,
    projectId,
    pathname 
}: { 
    children: React.ReactNode;
    projectId: string;
    pathname: string;
}) {
    const [projectName, setProjectName] = useState('');
    const [moduleData, setModuleData] = useState<ModuleData | undefined>(undefined);
    
    const segments = pathname.split('/');
    const moduleId = segments[segments.length - 2];
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

                const project = await projectService.getById(Number(projectId));
                setProjectName(project.name);
                console.log('[ModuleLayout] Project fetched:', project.name);

                if (!isNewModule && moduleId) {
                    console.log('[ModuleLayout] Fetching module:', moduleId);
                    try {
                        const moduleResponse = await moduleService.getById(
                            token,
                            Number(projectId),
                            Number(moduleId)
                        );
                        console.log('[ModuleLayout] Module response:', moduleResponse);

                        if (moduleResponse) {
                            const data: ModuleData = {
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
                    } catch (moduleError) {
                        console.log('[ModuleLayout] Module fetch error:', moduleError);
                    }
                }
            } catch (error) {
                console.log('[ModuleLayout] Error:', error);
            }
        };

        fetchData();
    }, [projectId, moduleId, isNewModule]);

    return (
        <div style={{ width: '100%', height: '100%' }}>
            {(segments.length > 4) && (
                <>
                    <ProjectHeader
                        projectId={projectId}
                        selectedSection='modules'
                        projectName={projectName}
                    />
                    <ModuleHeader 
                        projectName={projectName}
                        projectId={projectId}
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

export default function ModuleLayout({ children, params }: LayoutProps) {
    const pathname = usePathname();
    const unwrappedParams = React.use(params);
    const projectId = unwrappedParams.id;
    
    console.log('[ModuleLayout] Start - pathname:', pathname);
    console.log('[ModuleLayout] Start - unwrappedParams:', unwrappedParams);

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ModuleLayoutContent
                projectId={projectId}
                pathname={pathname}
            >
                {children}
            </ModuleLayoutContent>
        </Suspense>
    );
}