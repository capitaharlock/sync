const API_URL =
    process.env.NEXT_PUBLIC_API_URL || 'https://scadot.api.proars.com';

export const authService = {
    async login(data: { email: string; password: string }): Promise<{ token: string }> {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({
                    message: 'Login failed',
                }));
                throw new Error(errorData.message);
            }

            const result = await response.json();
            if (!result.token) {
                throw new Error('No token received');
            }

            localStorage.setItem('token', result.token);
            return result;
        } catch (error) {
            throw new Error(
                error instanceof Error ? error.message : 'Login error'
            );
        }
    },

    async register(data: { name: string; email: string; password: string }): Promise<void> {
        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({
                    message: 'Registration failed',
                }));
                throw new Error(errorData.message);
            }

            if (response.status !== 201) {
                throw new Error('Unexpected response');
            }

            return;
        } catch (error) {
            throw new Error(
                error instanceof Error ? error.message : 'Registration error'
            );
        }
    },

    logout() {
        localStorage.removeItem('token');
    },
};