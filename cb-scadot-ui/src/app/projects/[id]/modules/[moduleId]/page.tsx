'use client';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import ModuleLayoutBase from '@/components/module/layout/module-layout';
import ModuleDetails from '@/components/module/details/module-details';
import ModuleRepository from '@/components/module/details/module-repository';
import { moduleService } from '@/services/modules';

interface ModuleData {
    id?: number;
    name?: string;
    status?: string;
    visibility?: string;
    networkName?: string;
    date_time_created?: string;
}

interface ModuleDetailsPageProps {
    params: Promise<{
        id: string;
        moduleId: string;
    }>;
}

export default function ModuleDetailsPage({ params }: ModuleDetailsPageProps) {
    const pathname = usePathname();
    const isNewModule = pathname.endsWith('/new');
    const [selectedSection, setSelectedSection] = useState<'details' | 'repository'>('details');
    const [moduleData, setModuleData] = useState<ModuleData | undefined>();
    const [error, setError] = useState<string | null>(null);

    const unwrappedParams = React.use(params);
    const projectId = unwrappedParams.id;
    const moduleId = unwrappedParams.moduleId;

    useEffect(() => {
        const fetchModuleData = async () => {
            if (!isNewModule) {
                try {
                    const token = localStorage.getItem('token');
                    if (!token) throw new Error('No token found');

                    const data = await moduleService.getById(
                        token,
                        Number(projectId),
                        Number(moduleId)
                    );
                    
                    setModuleData({
                        id: data.id,
                        name: data.name,
                        status: data.status,
                        visibility: data.visibility,
                        networkName: "Ethereum",
                        date_time_created: new Date().toISOString()
                    });
                } catch (error) {
                    setError(error instanceof Error ? error.message : 'Failed to fetch module');
                    console.error('Error fetching module:', error);
                }
            }
        };

        fetchModuleData();
    }, [projectId, moduleId, isNewModule]);

    const handleSectionChange = (section: 'details' | 'repository') => {
        setSelectedSection(section);
    };

    if (error) return <div>Error: {error}</div>;

    return (
        <ModuleLayoutBase 
            selectedSection={selectedSection} 
            onSectionChange={handleSectionChange}
            isNew={isNewModule}
            projectId={projectId}
            moduleData={moduleData}
        >
            {selectedSection === 'details' ? (
                <ModuleDetails 
                    projectId={projectId} 
                    moduleId={moduleId}
                    isNew={isNewModule}
                />
            ) : (
                <ModuleRepository 
                    projectId={projectId}
                    moduleId={moduleId}
                />
            )}
        </ModuleLayoutBase>
    );
}