'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ModeToggle } from '@/components/ModeToggle';
import { toast } from 'sonner';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, 'Password must be atleast 6 characters'),
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
    const router = useRouter();

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
                setErrorMsg(err.error || 'Login failed');
                return;
            }

            const result = await res.json();
            console.log('Login success', result);
            
            if (result.isAdmin) {
                router.push('/admin');
            } else {
                router.push('/student');
            }
        } catch (err) {
            setErrorMsg('Something went wrong');
        }
    };
    return (
        <div className="h-dvh flex flex-col">
            <div className="flex flex-row-reverse pr-4">
                <ModeToggle />
            </div>
            <main className="flex flex-1 flex-col items-center justify-center">
                <h1 className='mb-6 text-3xl font-semibold border-b-4 border-primary rounded-b-md px-2 pb-2'>Student Management System</h1>
                <div className="w-full max-w-sm">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Login</CardTitle>
                            <CardDescription>
                                Enter your email below to login to your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="flex flex-col gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="m@example.com"
                                            required
                                            {...register('email')}
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-red-500 text-sm">
                                            {errors.email.message}
                                        </p>
                                    )}
                                    <div className="grid gap-2">
                                        <div className="flex items-center">
                                            <Label htmlFor="password">
                                                Password
                                            </Label>
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            required
                                            {...register('password')}
                                        />
                                    </div>
                                    {errors.password && (
                                        <p className="text-red-500 text-sm">
                                            {errors.password.message}
                                        </p>
                                    )}
                                    {errorMsg && (
                                        <p className="text-red-500 text-sm">
                                            {errorMsg}
                                        </p>
                                    )}
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full cursor-pointer"
                                    >
                                        {isSubmitting
                                            ? 'Logging in...'
                                            : 'Login'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
