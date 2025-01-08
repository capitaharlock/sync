'use client';
import React, { useState, useEffect } from 'react';
import { Input } from '@appkit4/react-components';
import { Button } from '@appkit4/react-components/button';
import { useRouter } from 'next/navigation';
import styles from './auth.module.css';
import { authService } from '@/services/auth';

export default function RegisterForm() {
 const router = useRouter();
 const [isLoading, setIsLoading] = useState(false);
 const [error, setError] = useState('');
 const [formData, setFormData] = useState({
   name: '',
   email: '',
   password: '',
 });

 useEffect(() => {
   console.log('Environment:', process.env.NODE_ENV);
   console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
 }, []);

 const handleChange = (value: string, event?: React.ChangeEvent<HTMLInputElement>) => {
   if (!event) return;
   setError('');
   setFormData(prev => ({
     ...prev,
     [event.target.name]: value
   }));
 };

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
   console.log('Form submission started', formData);
   setIsLoading(true);
   setError('');

   try {
     await authService.register(formData);
     console.log('Registration successful');
     router.push('/auth/login');
   } catch (err) {
     console.error('Registration error:', err);
     setError(err instanceof Error ? err.message : 'Registration failed');
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
           type="text"
           name="name"
           title="Full Name"
           className={styles.textField}
           required={true}
           allowClear={true}
           onChange={handleChange}
           value={formData.name}
         />
       </div>
       <div className={styles.textFieldContainer}>
         <Input
           type="email"
           name="email"
           title="Email"
           className={styles.textField}
           required={true}
           allowClear={true}
           onChange={handleChange}
           value={formData.email}
         />
       </div>
       <div className={styles.textFieldContainer}>
         <Input
           type="password"
           name="password"
           title="Password"
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
         <Button 
           type="submit"
           kind="primary"
           disabled={isLoading}
         >
           {isLoading ? 'Creating account...' : 'Sign up'}
         </Button>
       </div>
     </div>
     <div className={styles.linkText}>
       Already have an account? <span onClick={() => router.push('/auth/login')} className={styles.link}>Sign in</span>
     </div>
   </form>
 );
}
