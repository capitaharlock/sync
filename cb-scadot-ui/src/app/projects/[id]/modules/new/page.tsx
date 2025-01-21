'use client';
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import ModuleLayoutBase from '@/components/module/layout/module-layout';
import ModuleDetails from '@/components/module/details/module-details';

export default function NewModulePage() {
    const params = useParams();
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
                projectId={params.id as string}
                isNew 
            />
        </ModuleLayoutBase>
    );
}