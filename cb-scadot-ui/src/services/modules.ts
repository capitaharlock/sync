const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface Module {
    id: number;
    name: string;
    description: string;
    status: 'active' | 'inactive';
    visibility: 'public' | 'private';
    technology_id: number;
    language_id: number;
    framework_id: number;
    network_id: number;
    mock_set_id: number;
}

interface ModuleCreateRequest {
    name: string;
    description: string;
    status: string;
    visibility: string;
    technology_id: number;
    language_id: number;
    framework_id: number;
    network_id: number;
    mock_set_id: number;
}

interface ModuleUpdateRequest {
    name?: string;
    status?: string;
    visibility?: string;
}

export const moduleService = {
    async getAll(
        token: string,
        projectId: number,
    ): Promise<Module[]> {
        const response = await fetch(
            `${API_URL}/projects/${projectId}/modules`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        if (!response.ok) {
            throw new Error('Failed to fetch modules');
        }

        return response.json();
    },

    async create(
        token: string,
        projectId: number,
        data: ModuleCreateRequest,
    ): Promise<Module> {
        const response = await fetch(
            `${API_URL}/projects/${projectId}/modules`,
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
            throw new Error('Failed to create module');
        }

        return response.json();
    },

    async getById(
        token: string,
        projectId: number,
        moduleId: number,
    ): Promise<Module> {
        const response = await fetch(
            `${API_URL}/projects/${projectId}/modules/${moduleId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        if (!response.ok) {
            throw new Error('Failed to fetch module');
        }

        return response.json();
    },

    async update(
        token: string,
        projectId: number,
        moduleId: number,
        data: ModuleUpdateRequest,
    ): Promise<Module> {
        const response = await fetch(
            `${API_URL}/projects/${projectId}/modules/${moduleId}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            },
        );

        if (!response.ok) {
            throw new Error('Failed to update module');
        }

        return response.json();
    },

    async delete(
        token: string,
        projectId: number,
        moduleId: number,
    ): Promise<void> {
        const response = await fetch(
            `${API_URL}/projects/${projectId}/modules/${moduleId}`,
            {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        if (!response.ok) {
            throw new Error('Failed to delete module');
        }
    },
};
