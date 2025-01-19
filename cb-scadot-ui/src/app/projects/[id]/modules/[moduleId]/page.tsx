'use client';
import React, { useState } from 'react';
import ModuleLayoutBase from '@/components/module/layout/module-layout';
import ModuleDetails from '@/components/module/details/module-details';
import ModuleRepository from '@/components/module/details/module-repository';

export default function ModuleDetailsPage({ 
    params 
}: { 
    params: { id: string; moduleId: string } 
}) {
    const [selectedSection, setSelectedSection] = useState<'details' | 'repository'>('details');

    const handleSectionChange = (section: 'details' | 'repository') => {
        setSelectedSection(section);
    };

    return (
        <ModuleLayoutBase 
            selectedSection={selectedSection} 
            onSectionChange={handleSectionChange}
        >
            {selectedSection === 'details' ? (
                <ModuleDetails 
                    projectId={params.id} 
                    moduleId={params.moduleId} 
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