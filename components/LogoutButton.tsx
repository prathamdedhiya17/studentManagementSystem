'use client';

import { useRouter } from 'next/navigation';
import { NavButton } from '@/components/NavButton';
import { LogOut } from 'lucide-react';

const LogoutButton = () => {
    const router = useRouter();

    const handleLogout = async () => {
        const res = await fetch('/api/logout', { method: 'POST' });

        if (res.ok) {
            router.push('/');
        } else {
            console.error('Logout failed');
        }
    };

    return (
        <span onClick={handleLogout}>
            <NavButton label="Logout" icon={LogOut} />Logout
        </span>
    );
};

export default LogoutButton;
