import { cookies } from 'next/headers';
import { Header } from '@/components/Header';

export default async function SMSLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const name = JSON.parse(cookieStore.get('auth')?.value || '').name;
    return (
        <div>
            <Header>
                <p className="font-semibold ml-6">Welcome {name}</p>
            </Header>
            <main className="py-4 px-8">{children}</main>
        </div>
    );
}
