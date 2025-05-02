import { Header } from '@/components/Header';
import { AdminSidebar } from '@/components/adminComponents/AdminSidebar';
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar';

export default async function SMSLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <AdminSidebar />
            <SidebarInset>
                <Header>
                    <SidebarTrigger className="-ml-1" />
                </Header>
                <main className='py-4 px-8'>
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
