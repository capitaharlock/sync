const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface Repository {
    id: number;
    module_id: number;
    provider: string;
    url: string;
    access_token: string;
    updated_at: string;
}

interface RepositoryRequest {
    provider: string;
    url: string;
    access_token: string;
}

export const repositoryService = {
    async getByModuleId(
        token: string,
        projectId: number,
        moduleId: number,
    ): Promise<Repository> {
        const response = await fetch(
            `${API_URL}/projects/${projectId}/modules/${moduleId}/repository`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        if (!response.ok) {
            throw new Error('Failed to fetch repository');
        }

        return response.json();
    },

    async createOrUpdate(
        token: string,
        projectId: number,
        moduleId: number,
        data: RepositoryRequest,
    ): Promise<Repository> {
        const response = await fetch(
            `${API_URL}/projects/${projectId}/modules/${moduleId}/repository`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            },
        );

        if (!response.ok) {
            throw new Error('Failed to save repository');
        }

        return response.json();
    },

    async delete(
        token: string,
        projectId: number,
        moduleId: number,
    ): Promise<void> {
        const response = await fetch(
            `${API_URL}/projects/${projectId}/modules/${moduleId}/repository`,
            {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        if (!response.ok) {
            throw new Error('Failed to delete repository');
        }
    },

    async syncRepository(
        token: string,
        projectId: number,
        moduleId: number,
    ): Promise<{ message: string }> {
        const response = await fetch(
            `${API_URL}/projects/${projectId}/modules/${moduleId}/repository/sync`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to sync repository');
        }

        return response.json();
    },
};