'use client';
import React, { useState } from 'react';
import { repositoryService } from '@/services/repositories';

interface ModuleTestProps {
    projectId: string;
    moduleId: string;
}

export default function ModuleTest({ projectId, moduleId }: ModuleTestProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSyncRepository = async () => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('User is not authenticated. Please log in.');
            }

            const response = await repositoryService.syncRepository(
                token,
                Number(projectId),
                Number(moduleId),
            );

            setSuccessMessage(response.message);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to sync repository');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div>Documentation here + Testing features</div>
            <div>This depends on user permission&#39;s. In this MVP, we allow everyone to test.</div>

            <div style={{ marginTop: '20px' }}>
                <button
                    onClick={handleSyncRepository}
                    disabled={loading}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                    }}
                >
                    {loading ? 'Syncing...' : 'Sync Repository'}
                </button>

                {successMessage && (
                    <div style={{ color: 'green', marginTop: '10px' }}>
                        {successMessage}
                    </div>
                )}

                {error && (
                    <div style={{ color: 'red', marginTop: '10px' }}>
                        Error: {error}
                    </div>
                )}
            </div>
        </>
    );
}