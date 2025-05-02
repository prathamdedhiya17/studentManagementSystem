import { HomeIcon, UserRound } from 'lucide-react';
import Link from 'next/link';

import { NavButton } from '@/components/NavButton';
import { ModeToggle } from '@/components/ModeToggle';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import LogoutButton from './LogoutButton';

export function Header({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <header className="sticky top-0 bg-background h-12 p-2 border-b z-20">
            <div className="flex h-8 items-center justify-between">
                <div className="flex items-center gap-2">
                    {children}
                </div>
                <div className="flex items-center">
                    <ModeToggle />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild className="cursor-pointer">
                            <NavButton label="Profile" icon={UserRound} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {/* <DropdownMenuItem>Profile</DropdownMenuItem> */}
                            <DropdownMenuItem className="cursor-pointer p-0">
                                <LogoutButton />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
