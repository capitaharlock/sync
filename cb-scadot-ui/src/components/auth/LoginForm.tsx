'use client';
import React, { useState } from 'react';
import { Input } from '@appkit4/react-components';
import { Button } from '@appkit4/react-components/button';
import { useRouter } from 'next/navigation';
import styles from './auth.module.css';
import { authService } from '@/services/auth';
import { useAuth } from '@/context/AuthContext';

export default function LoginForm() {
    const router = useRouter();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (
        value: string,
        event?: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (!event) return;
        setError('');
        setFormData((prev) => ({
            ...prev,
            [event.target.name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await authService.login(formData);
            if (response.token) {
                login(response.token);    // Update auth state
                router.push('/projects'); // Redirect after state is updated
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}
            <div className={styles.accordionContentMultifields}>
                <div className={styles.textFieldContainer}>
                    <Input
                        type='email'
                        name='email'
                        title='Email'
                        className={styles.textField}
                        required={true}
                        allowClear={true}
                        onChange={handleChange}
                        value={formData.email}
                    />
                </div>
                <div className={styles.textFieldContainer}>
                    <Input
                        type='password'
                        name='password'
                        title='Password'
                        className={styles.textField}
                        required={true}
                        allowClear={true}
                        onChange={handleChange}
                        value={formData.password}
                    />
                </div>
            </div>
            <div className={styles.workAreaFoot}>
                <div className={styles.nextStepContainer}>
                    <Button type='submit' kind='primary' disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </Button>
                </div>
            </div>
            <div className={styles.linkText}>
                Don't have an account?{' '}
                <span
                    onClick={() => router.push('/auth/register')}
                    className={styles.link}
                >
                    Sign up
                </span>
            </div>
        </form>
    );
}
