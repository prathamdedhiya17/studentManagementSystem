'use client';

import { useRef, useState } from 'react';

// UI Imports
import { CalendarIcon, Ellipsis, Pencil, Trash2Icon } from 'lucide-react';
import TableSkeleton from '@/app/utils/loadingUtils/TableSkeleton';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

import { format } from 'date-fns';

import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/datatableComponent/DataTable';

export const metadata = {
    title: 'Admin',
};

type Admin = {
    adminID: number;
    name: string;
    email: string;
    password: string;
    role: string;
};

export default function Admin({ initialData }: { initialData: Admin[] }) {
    const [data, setData] = useState<Admin[]>(initialData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const isLoading = useRef(false);

    const refetch = async () => {
        setLoading(true);
        const res = await fetch('http://localhost:3000/api/admin/adminUsers');

        if (!res.ok) {
            setError(true);
        }

        const updated = await res.json();
        setData(updated);
        setLoading(false);
    };

    if (error) {
        return (
            <div className="text-red-600 text-xl font-bold text-center h-fit">
                There was some problem in loading the data! Please reload.
            </div>
        );
    }

    if (loading) {
        return <TableSkeleton />;
    }

    const formSchema = z
        .object({
            adminID: z.number(),
            name: z
                .string({
                    required_error: 'Name is required.',
                })
                .min(1, 'Name is required.'),
            email: z
                .string({
                    required_error: 'Email is required.',
                })
                .email(),
            role: z
                .string({
                    required_error: 'Role is required.',
                })
                .min(1, 'Role is required.'),
            password: z
                .string()
                .min(8, {
                    message: 'Password must be atleast 8 characters',
                })
                .regex(
                    new RegExp(
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
                    ),
                    'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character'
                )
                .refine(
                    (value) => !/\s/.test(value),
                    'Password must not contain whitespace'
                ),
            confirmPassword: z.string(),
        })
        .refine((schema) => schema.confirmPassword === schema.password, {
            message: 'Both Passwords must match!',
            path: ['confirmPassword'],
        });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        isLoading.current = true;

        const { confirmPassword, ...toSend } = values;

        try {
            await fetch(
                `http://localhost:3000/api/admin/adminUsers/${toSend.adminID}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(toSend),
                }
            ).then((data) => data.json());
            toast.success('Admin Details Updated Successfully!');
            isLoading.current = false;
            refetch();
        } catch (error) {
            console.error('Error:', error);
            toast.error("Couldn't update data, try again later... :(");
            isLoading.current = false;
        }
    }

    async function deleteData(adminID: number) {
        try {
            await fetch(
                `http://localhost:3000/api/admin/adminUsers/${adminID}`,
                {
                    method: 'DELETE',
                }
            ).then((data) => data.json());
            toast.success('Admin deleted successfully!');
            refetch();
        } catch (error) {
            console.error('Error:', error);
            toast.error("Couldn't delete admin, try again later... :(");
        }
    }

    const AddressColumns: ColumnDef<Admin>[] = [
        {
            accessorKey: 'adminID',
            header: () => {
                return <div className="text-center">ID</div>;
            },
            cell: ({ row }) => (
                <div className="text-center">{row.getValue('adminID')}</div>
            ),
        },
        {
            accessorKey: 'name',
            header: () => <div className="text-center">Name</div>,
            cell: ({ row }) => (
                <div className="text-center">{row.getValue('name')}</div>
            ),
        },
        {
            accessorKey: 'email',
            header: () => {
                return <div className="text-center">Email</div>;
            },
            cell: ({ row }) => (
                <div className="text-center">{row.getValue('email')}</div>
            ),
        },
        {
            accessorKey: 'role',
            header: () => {
                return <div className="text-center">Role</div>;
            },
            cell: ({ row }) => (
                <div className="text-center">{row.getValue('role')}</div>
            ),
        },
        {
            accessorKey: 'actions',
            header: () => {
                return <div className="text-center">Actions</div>;
            },
            cell: ({ row }) => {
                const form = useForm<z.infer<typeof formSchema>>({
                    resolver: zodResolver(formSchema),
                    defaultValues: {
                        adminID: row.original.adminID,
                        name: row.original.name,
                        email: row.original.email,
                        role: row.original.role,
                        password: row.original.password,
                        confirmPassword: '',
                    },
                });

                return (
                    <Dialog>
                        <AlertDialog>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="h-8 w-8 p-0 block mx-auto cursor-pointer"
                                    >
                                        <span className="sr-only">
                                            Open menu
                                        </span>
                                        <Ellipsis className="h-4 w-4 place-self-center" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>
                                        Actions
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DialogTrigger className="w-full">
                                        <DropdownMenuItem className="text-yellow-500 focus:text-yellow-400 cursor-pointer hover:bg-gray-100 rounded-sm">
                                            <Pencil
                                                size={18}
                                                color={'#efb100'}
                                            />
                                            Edit
                                        </DropdownMenuItem>
                                    </DialogTrigger>
                                    <AlertDialogTrigger className="flex items-center text-red-500 focus:text-red-600 cursor-pointer py-1 w-full hover:bg-gray-100 rounded-sm">
                                        <Trash2Icon
                                            size={18}
                                            className="ml-2 mr-2"
                                        />
                                        Delete
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Are you absolutely sure?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone.
                                                This will permanently delete the
                                                admin.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel
                                                onClick={() => {
                                                    return;
                                                }}
                                            >
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() =>
                                                    deleteData(
                                                        row.original.adminID
                                                    )
                                                }
                                            >
                                                Continue
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Edit Admin Details
                                    </DialogTitle>
                                    <DialogDescription>
                                        Make changes to Admin details here.
                                        Click save when you're done.
                                    </DialogDescription>
                                </DialogHeader>
                                <Form {...form}>
                                    <form
                                        onSubmit={form.handleSubmit(onSubmit)}
                                        className="w-96 space-y-6 mx-auto"
                                    >
                                        <FormField
                                            control={form.control}
                                            name="adminID"
                                            render={({ field }) => (
                                                <FormItem className="max-w-96 hidden">
                                                    <FormLabel className="ml-2">
                                                        Admin ID
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem className="max-w-96">
                                                    <FormLabel className="ml-2">
                                                        Name
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem className="max-w-96">
                                                    <FormLabel className="ml-2">
                                                        Email
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="role"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Role</FormLabel>
                                                    <Select
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        defaultValue={
                                                            field.value
                                                        }
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="cursor-pointer">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem
                                                                value="admin"
                                                                className="cursor-pointer"
                                                            >
                                                                Admin
                                                            </SelectItem>
                                                            <SelectItem
                                                                value="super-admin"
                                                                className="cursor-pointer"
                                                            >
                                                                Super Admin
                                                            </SelectItem>
                                                            <SelectItem
                                                                value="teacher"
                                                                className="cursor-pointer"
                                                            >
                                                                Teacher
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem className="max-w-96">
                                                    <FormLabel className="ml-2">
                                                        Password
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="confirmPassword"
                                            render={({ field }) => (
                                                <FormItem className="max-w-96">
                                                    <FormLabel className="ml-2">
                                                        Confirm Password
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            autoComplete="off"
                                                            type="password"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <DialogFooter>
                                            <Button
                                                type="submit"
                                                disabled={isLoading.current}
                                                className="disabled:cursor-not-allowed cursor-pointer"
                                            >
                                                {isLoading.current
                                                    ? 'Loading...'
                                                    : 'Save changes'}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </Form>
                            </DialogContent>
                        </AlertDialog>
                    </Dialog>
                );
            },
        },
    ];
    return (
        <div>
            <Input
                placeholder="Filter by name..."
                // value={search ?? ""}
                // onChange={(e: any) => setSearch(e.target.value)}
                className="w-80 md:w-96 my-4"
                // <ServerSidePagination totalCount={data.total_count ? data.total_count > 0 ? data.total_count : 1 : 1} dirty={dirty} setDirty={setDirty} />
            />
            <DataTable columns={AddressColumns} data={data} />
        </div>
    );
}
