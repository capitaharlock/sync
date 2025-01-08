'use client';
import dynamic from 'next/dynamic';
import styles from '../auth.module.css';

const LoginForm = dynamic(() => import('@/components/auth/LoginForm'), { ssr: false });

export default function Login() {
 return (
   <div className={styles.authBackground}>
     <div className={styles.container}>
       <div className={styles.left}></div>
       <div className={styles.right}>
         <div className={styles.frame835558396}>
           <div className={styles.frame835558401}>
             <div className={styles.rect}></div>
             <p className={styles.title}>Login to <span>SCADOT</span></p>
           </div>
           <LoginForm />
         </div>
       </div>
     </div>
   </div>
 );
}
