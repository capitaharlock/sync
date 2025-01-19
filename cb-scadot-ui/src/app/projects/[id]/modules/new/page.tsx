'use client';
import React, { useState } from 'react';
import ModuleLayoutBase from '@/components/module/layout/module-layout';
import ModuleDetails from '@/components/module/details/module-details';

export default function NewModulePage({ 
    params 
}: { 
    params: { id: string } 
}) {
    const [selectedSection, setSelectedSection] = useState<'details' | 'repository'>('details');

    const handleSectionChange = (section: 'details' | 'repository') => {
        setSelectedSection(section);
    };

    return (
        <ModuleLayoutBase 
            selectedSection={selectedSection} 
            onSectionChange={handleSectionChange}
            isNew={true}
        >
            <ModuleDetails 
                projectId={params.id} 
                isNew 
            />
        </ModuleLayoutBase>
    );
}