'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ModeToggle } from '@/components/ModeToggle';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const [errorMsg, setErrorMsg] = useState('');
    const router = useRouter()

    const onSubmit = async (data: LoginFormData) => {
        setErrorMsg('');
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const err = await res.json();
                setErrorMsg(err.message || 'Login failed');
                return;
            }

            const result = await res.json();
            console.log('Login success', result);
            router.push('/admin')
        } catch (err) {
            setErrorMsg('Something went wrong');
        }
    };
    return (
        <div className='h-dvh flex flex-col'>
            <div className='flex flex-row-reverse pr-4'>
                <ModeToggle />
            </div>
            <main className="flex flex-1 flex-col items-center justify-center">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-1/5 mx-auto space-y-4"
                >
                    <Input
                        type="email"
                        placeholder="Email"
                        {...register('email')}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm">
                            {errors.email.message}
                        </p>
                    )}

                    <Input
                        type="password"
                        placeholder="Password"
                        {...register('password')}
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm">
                            {errors.password.message}
                        </p>
                    )}

                    {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

                    <Button type="submit" disabled={isSubmitting} className='w-full cursor-pointer'>
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </Button>
                </form>
            </main>
        </div>
    );
}
