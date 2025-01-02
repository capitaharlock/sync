'use client';
import {
    Header as AppkitHeader,
    HeaderOptionItem,
} from '@appkit4/react-components/header';
import { Avatar } from '@appkit4/react-components/avatar';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const HEADER_TITLE = 'SCADOT';

const Header = () => {
    const router = useRouter();
    const { isLoggedIn, logout } = useAuth();

    return (
        <AppkitHeader
            type='transparent'
            titleTemplate={() => (
                <div>
                    <span className='pr-3'>{HEADER_TITLE}</span>
                </div>
            )}
            optionsTemplate={() =>
                isLoggedIn ? (
                    <HeaderOptionItem
                        iconName='log-out-outline'
                        label='Logout'
                        onClick={() => {
                            logout();
                            router.push('/auth/login');
                        }}
                    />
                ) : null
            }
            userTemplate={() => (
                <Avatar label='ME' role='button' disabled={false} />
            )}
        />
    );
};

export default Header;