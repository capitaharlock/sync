'use client';
import ModuleEditor from '@/components/module/editor/module-editor';

export default function ModuleEditorPage({ 
    params 
}: { 
    params: { id: string; moduleId: string } 
}) {
    return <ModuleEditor projectId={params.id} moduleId={params.moduleId} />;
}