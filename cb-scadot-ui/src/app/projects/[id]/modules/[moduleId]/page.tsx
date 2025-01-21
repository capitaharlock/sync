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

export default function ModuleDetailsPage({ 
    params 
}: { 
    params: { id: string; moduleId: string } 
}) {
    const pathname = usePathname();
    const isNewModule = pathname.endsWith('/new');
    const [selectedSection, setSelectedSection] = useState<'details' | 'repository'>('details');
    const [moduleData, setModuleData] = useState<ModuleData | undefined>();

    useEffect(() => {
        const fetchModuleData = async () => {
            if (!isNewModule) {
                try {
                    const token = localStorage.getItem('token');
                    if (!token) throw new Error('No token found');

                    const data = await moduleService.getById(
                        token,
                        Number(params.id),
                        Number(params.moduleId)
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
                    console.error('Error fetching module:', error);
                }
            }
        };

        fetchModuleData();
    }, [params.id, params.moduleId, isNewModule]);

    const handleSectionChange = (section: 'details' | 'repository') => {
        setSelectedSection(section);
    };

    return (
        <ModuleLayoutBase 
            selectedSection={selectedSection} 
            onSectionChange={handleSectionChange}
            isNew={isNewModule}
            projectId={params.id}
            moduleData={moduleData}
        >
            {selectedSection === 'details' ? (
                <ModuleDetails 
                    projectId={params.id} 
                    moduleId={params.moduleId}
                    isNew={isNewModule}
                />
            ) : (
                <ModuleRepository 
                    projectId={params.id}
                    moduleId={params.moduleId}
                />
            )}
        </ModuleLayoutBase>
    );
}