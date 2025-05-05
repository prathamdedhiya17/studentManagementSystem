'use client';

import { useEffect, useRef, useState } from 'react';

// UI Imports
import { CalendarIcon, Ellipsis, Pencil, Trash2Icon } from 'lucide-react';
import TableSkeleton from '@/utils/loadingUtils/TableSkeleton';
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
import { Calendar } from '@/components/ui/calendar';

import { ColumnDef } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { APIdateFormatter } from '@/utils/dateFormatter';
import { DataTable } from '@/components/datatableComponent/DataTable';
import { useDebounce } from '@/utils/customHooks/useDebounce';

type Student = {
    id: number;
    studentid: string;
    name: string;
    email: string;
    dob: string;
    enrollments: string[];
    gpa: number;
    password: string;
};

export default function Admin({ initialData }: { initialData: Student[] }) {
    const [data, setData] = useState<Student[]>(initialData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const isLoading = useRef(false);

    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search);

    const refetch = async () => {
        setLoading(true);
        const res =
            debouncedSearch.length > 0
                ? await fetch('http://localhost:3000/api/admin/students', {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ search: debouncedSearch }),
                  })
                : await fetch('http://localhost:3000/api/admin/students');

        if (!res.ok) {
            setError(true);
        }

        const updated = await res.json();
        setData(updated);
        setLoading(false);
    };

    useEffect(() => {
        refetch();
    }, [debouncedSearch]);

    const addFormSchema = z
        .object({
            studentid: z
                .string({
                    required_error: 'Student ID is required.',
                })
                .min(1, 'Student ID is required.'),
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
            dob: z.date({
                required_error: 'A date of birth is required.',
            }),
            gpa: z.string(),
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

    const addForm = useForm<z.infer<typeof addFormSchema>>({
        resolver: zodResolver(addFormSchema),
        defaultValues: {
            studentid: '',
            name: '',
            email: '',
            dob: new Date(),
            gpa: '',
            password: '',
            confirmPassword: '',
        },
    });

    async function onAddSubmit(values: z.infer<typeof addFormSchema>) {
        isLoading.current = true;

        try {
            const res = await fetch(
                `http://localhost:3000/api/admin/students/create`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                }
            ).then((data) => data.json());

            isLoading.current = false;
            if (res.success) {
                toast.success('Student Added Successfully!');
                addForm.reset();
                refetch();
            } else {
                toast.error(
                    'There was some error adding student, please try again!'
                );
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error("Couldn't add data, try again later... :(");
            isLoading.current = false;
        }
    }

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
            id: z.number(),
            studentid: z
                .string({
                    required_error: 'Student ID is required.',
                })
                .min(1, 'Student ID is required.'),
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
            dob: z.date({
                required_error: 'A date of birth is required.',
            }),
            gpa: z.string(),
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

        const formatted = {
            ...values,
            dob: values.dob.toISOString().split('T')[0],
        };

        const { confirmPassword, ...toSend } = formatted;

        try {
            const res = await fetch(
                `http://localhost:3000/api/admin/students/${toSend.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(toSend),
                }
            ).then((data) => data.json());
            isLoading.current = false;
            if (res.success) {
                toast.success('Student Updated Successfully!');
                refetch();
            } else {
                toast.error("Couldn't update data, try again later... :(");
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error("Couldn't update data, try again later... :(");
            isLoading.current = false;
        }
    }

    async function deleteData(id: number) {
        try {
            await fetch(`http://localhost:3000/api/admin/students/${id}`, {
                method: 'DELETE',
            }).then((data) => data.json());
            toast.success('Student deleted successfully!');
            refetch();
        } catch (error) {
            console.error('Error:', error);
            toast.error("Couldn't delete student, try again later... :(");
        }
    }

    const columns: ColumnDef<Student>[] = [
        {
            accessorKey: 'studentid',
            header: () => {
                return <div className="text-center">ID</div>;
            },
            cell: ({ row }) => (
                <div className="text-center">{row.getValue('studentid')}</div>
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
            accessorKey: 'dob',
            header: () => {
                return <div className="text-center">DOB</div>;
            },
            cell: ({ row }) => (
                <div className="text-center">
                    {APIdateFormatter(new Date(row.getValue('dob')))}
                </div>
            ),
        },
        {
            accessorKey: 'enrollments',
            header: () => <div className="text-center">Enrollments</div>,
            cell: ({ row }) => (
                <div className="max-w-80 mx-auto text-center">
                    {(row.getValue('enrollments') as Student['enrollments'])
                        .length > 0
                        ? (
                              row.getValue(
                                  'enrollments'
                              ) as Student['enrollments']
                          ).join(', ')
                        : '-'}
                </div>
            ),
        },
        {
            accessorKey: 'gpa',
            header: () => {
                return <div className="text-center">GPA</div>;
            },
            cell: ({ row }) => (
                <div className="text-center">{row.getValue('gpa')}</div>
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
                        id: row.original.id,
                        studentid: row.original.studentid,
                        name: row.original.name,
                        email: row.original.email,
                        dob: new Date(row.original.dob),
                        gpa: row.original.gpa.toString(),
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
                                                student.
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
                                                    deleteData(row.original.id)
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
                                        Edit Student Details
                                    </DialogTitle>
                                    <DialogDescription>
                                        Make changes to Student details here.
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
                                            name="id"
                                            render={({ field }) => (
                                                <FormItem className="max-w-96 hidden">
                                                    <FormLabel className="ml-2">
                                                        ID
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="studentid"
                                            render={({ field }) => (
                                                <FormItem className="max-w-96">
                                                    <FormLabel className="ml-2">
                                                        Student ID
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
                                            name="dob"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col">
                                                    <FormLabel>
                                                        Date of birth
                                                    </FormLabel>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    variant={
                                                                        'outline'
                                                                    }
                                                                    className={cn(
                                                                        'w-[240px] pl-3 text-left font-normal',
                                                                        !field.value &&
                                                                            'text-muted-foreground'
                                                                    )}
                                                                >
                                                                    {field.value ? (
                                                                        format(
                                                                            field.value,
                                                                            'PPP'
                                                                        )
                                                                    ) : (
                                                                        <span>
                                                                            Pick
                                                                            a
                                                                            date
                                                                        </span>
                                                                    )}
                                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent
                                                            className="w-auto p-0"
                                                            align="start"
                                                        >
                                                            <Calendar
                                                                mode="single"
                                                                selected={
                                                                    field.value
                                                                }
                                                                onSelect={
                                                                    field.onChange
                                                                }
                                                                disabled={(
                                                                    date
                                                                ) =>
                                                                    date >
                                                                        new Date() ||
                                                                    date <
                                                                        new Date(
                                                                            '1900-01-01'
                                                                        )
                                                                }
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
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
                                            name="gpa"
                                            render={({ field }) => (
                                                <FormItem className="max-w-96">
                                                    <FormLabel className="ml-2">
                                                        GPA
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
            <div className="flex gap-4 my-4">
                <Input
                    placeholder="Filter by name..."
                    value={search ?? ''}
                    onChange={(e: any) => setSearch(e.target.value)}
                    className="w-80 md:w-96"
                />
                {/* Add Students Dialog */}
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>Add Student</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Student Details</DialogTitle>
                            <DialogDescription>
                                Add Student details here. Click save when you're
                                done.
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...addForm}>
                            <form
                                onSubmit={addForm.handleSubmit(onAddSubmit)}
                                className="w-96 space-y-6 mx-auto"
                            >
                                <FormField
                                    control={addForm.control}
                                    name="studentid"
                                    render={({ field }) => (
                                        <FormItem className="max-w-96">
                                            <FormLabel className="ml-2">
                                                Student ID
                                            </FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={addForm.control}
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
                                    control={addForm.control}
                                    name="dob"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Date of birth</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={'outline'}
                                                            className={cn(
                                                                'w-[240px] pl-3 text-left font-normal',
                                                                !field.value &&
                                                                    'text-muted-foreground'
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(
                                                                    field.value,
                                                                    'PPP'
                                                                )
                                                            ) : (
                                                                <span>
                                                                    Pick a date
                                                                </span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    className="w-auto p-0"
                                                    align="start"
                                                >
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={
                                                            field.onChange
                                                        }
                                                        disabled={(date) =>
                                                            date > new Date() ||
                                                            date <
                                                                new Date(
                                                                    '1900-01-01'
                                                                )
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={addForm.control}
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
                                    control={addForm.control}
                                    name="gpa"
                                    render={({ field }) => (
                                        <FormItem className="max-w-96">
                                            <FormLabel className="ml-2">
                                                GPA
                                            </FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={addForm.control}
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
                                    control={addForm.control}
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
                </Dialog>
            </div>
            <DataTable columns={columns} data={data} />
        </div>
    );
}
