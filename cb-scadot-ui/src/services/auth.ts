const API_URL =
    process.env.NEXT_PUBLIC_API_URL || 'https://scadot.api.proars.com';

export const authService = {
    async login(data: {
        email: string;
        password: string;
    }): Promise<{ token: string }> {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response
                .json()
                .catch(() => ({ message: 'Login failed' }));
            throw new Error(error.message);
        }

        const result = await response.json();
        return result;
    },

    logout() {
        // Remove the token from localStorage
        localStorage.removeItem('token');
    },
};
