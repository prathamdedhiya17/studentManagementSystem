import { Header } from "@/components/Header"

export default async function SMSLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="mx-auto w-full px-8">
            <Header />
            <div className="px-4 py-2">
                {children}
            </div>
        </div>
    )
}