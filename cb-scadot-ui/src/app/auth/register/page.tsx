'use client';
import dynamic from 'next/dynamic';
import styles from '../auth.module.css';

const RegisterForm = dynamic(() => import('@/components/auth/RegisterForm'), {
 ssr: false,
 loading: () => <div>Loading...</div>
});

export default function Register() {
 return (
   <div className={styles.authBackground}>
     <div className={styles.container}>
       <div className={styles.left}></div>
       <div className={styles.right}>
         <div className={styles.frame835558396}>
           <div className={styles.frame835558401}>
             <div className={styles.rect}></div>
             <p className={styles.title}>Create your account</p>
           </div>
           <RegisterForm />
         </div>
       </div>
     </div>
   </div>
 );
}
