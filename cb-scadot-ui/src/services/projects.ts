const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface Project {
    id: number;
    name: string;
    description: string;
    status: 'active' | 'inactive';
    visibility: 'public' | 'private';
    ado_id: string;
    date_time_created: string;
    date_time_modified: string;
    user_id: number;
    user: {
        id: number;
        email: string;
        name: string;
        date_time_created: string;
        date_time_modified: string;
    };
}

interface ProjectCreateRequest {
    name: string;
    description: string;
    status: 'active' | 'inactive';
    visibility: 'public' | 'private';
    ado_id: string;
}

interface ProjectUpdateRequest {
    name?: string;
    description?: string;
    status?: 'active' | 'inactive';
    visibility?: 'public' | 'private';
    ado_id?: string;
}

interface ProjectsResponse {
    data: Project[];
    total: number;
    page: number;
    limit: number;
}

export const projectService = {
    async create(data: ProjectCreateRequest): Promise<Project> {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('User is not authenticated. Please log in.');
        }

        const response = await fetch(`${API_URL}/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                ...data,
                ado_id: data.ado_id || '',
            }),
        });

        if (response.status === 401) {
            throw new Error('User is not authenticated. Please log in.');
        }

        if (response.status === 400) {
            const error = await response.json();
            throw new Error(error.message || 'Invalid project data');
        }

        if (!response.ok) {
            const error = await response
                .json()
                .catch(() => ({ message: 'Failed to create project' }));
            throw new Error(error.message);
        }

        return response.json();
    },

    async getAll(page: number = 1, limit: number = 10): Promise<ProjectsResponse> {
        const token = this.getToken();

        const response = await fetch(
            `${API_URL}/projects?page=${page}&limit=${limit}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        if (response.status === 401) {
            throw new Error('User is not authenticated. Please log in.');
        }

        if (!response.ok) {
            const error = await response
                .json()
                .catch(() => ({ message: 'Failed to fetch projects' }));
            throw new Error(error.message);
        }

        return response.json();
    },

    async getById(id: number): Promise<Project> {
        const token = this.getToken();

        const response = await fetch(`${API_URL}/projects/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 401) {
            throw new Error('User is not authenticated. Please log in.');
        }

        if (response.status === 404) {
            throw new Error('Project not found');
        }

        if (!response.ok) {
            const error = await response
                .json()
                .catch(() => ({ message: 'Failed to fetch project' }));
            throw new Error(error.message);
        }

        return response.json();
    },

    getToken(): string {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('User is not authenticated. Please log in.');
        }
        return token;
    },

    async update(id: number, data: ProjectUpdateRequest): Promise<Project> {
        const token = this.getToken();

        const response = await fetch(`${API_URL}/projects/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                ...data,
                ado_id: data.ado_id || '',
            }),
        });

        if (response.status === 401) {
            throw new Error('User is not authenticated. Please log in.');
        }

        if (response.status === 404) {
            throw new Error('Project not found');
        }

        if (response.status === 400) {
            const error = await response.json();
            throw new Error(error.message || 'Invalid project data');
        }

        if (!response.ok) {
            const error = await response
                .json()
                .catch(() => ({ message: 'Failed to update project' }));
            throw new Error(error.message);
        }

        return response.json();
    },

    async delete(id: number): Promise<void> {
        const token = this.getToken();

        const response = await fetch(`${API_URL}/projects/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 401) {
            throw new Error('User is not authenticated. Please log in.');
        }

        if (response.status === 404) {
            throw new Error('Project not found');
        }

        if (!response.ok) {
            const error = await response
                .json()
                .catch(() => ({ message: 'Failed to delete project' }));
            throw new Error(error.message);
        }
    },
};
