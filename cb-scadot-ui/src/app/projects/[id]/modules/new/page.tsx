
'use client';
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import ModuleLayoutBase from '@/components/module/layout/module-layout';
import ModuleDetails from '@/components/module/details/module-details';

export default function NewModulePage() {
    const params = useParams();
    const projectId = params.id as string;
    const [selectedSection, setSelectedSection] = useState<'details' | 'repository'>('details');

    const handleSectionChange = (section: 'details' | 'repository') => {
        setSelectedSection(section);
    };

    return (
        <ModuleLayoutBase 
            selectedSection={selectedSection} 
            onSectionChange={handleSectionChange}
            isNew={true}
            projectId={projectId}
        >
            <ModuleDetails 
                projectId={projectId}
                moduleId="new"
                isNew 
            />
        </ModuleLayoutBase>
    );
}