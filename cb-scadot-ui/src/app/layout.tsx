import type { Metadata } from 'next';
import './globals.css';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar/Sidebar';
import ReduxProvider from '@/lib/ReduxProvider';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
    title: 'PwC | Smart Contract Documentation Tool',
    description: 'PwC Smart Contract Documentation Tool',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <body
                className='root-container'
                data-mode='dark'
                data-theme='orange'
            >
                <AuthProvider>
                    <header className='header'>
                        <Header />
                    </header>
                    <div className='frame32'>
                        <Sidebar />
                        <div className='content'>
                            <ReduxProvider>{children}</ReduxProvider>
                        </div>
                    </div>
                    <div className='footer-container'>
                        <Footer />
                    </div>
                </AuthProvider>
            </body>
        </html>
    );
}