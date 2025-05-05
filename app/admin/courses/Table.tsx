'use client';

import { useEffect, useRef, useState } from 'react';

// UI Imports
import { Ellipsis, Pencil, Trash2Icon } from 'lucide-react';
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

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/datatableComponent/DataTable';
import { useDebounce } from '@/utils/customHooks/useDebounce';

type Course = {
    id: number;
    courseid: string;
    name: string;
    program: string;
    sem: string;
    desc: string;
};

export default function Admin({ initialData }: { initialData: Course[] }) {
    const [data, setData] = useState<Course[]>(initialData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const isLoading = useRef(false);

    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search);

    const refetch = async () => {
        setLoading(true);
        const res =
            debouncedSearch.length > 0
                ? await fetch('http://localhost:3000/api/admin/courses', {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ search: debouncedSearch }),
                  })
                : await fetch('http://localhost:3000/api/admin/courses');

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

    const addFormSchema = z.object({
        courseid: z
            .string({
                required_error: 'Course ID is required.',
            })
            .min(1, 'Course ID is required.'),
        name: z
            .string({
                required_error: 'Name is required.',
            })
            .min(1, 'Name is required.'),
        program: z
            .string({
                required_error: 'Program is required.',
            })
            .min(1, 'Program is required.'),
        sem: z
            .string({
                required_error: 'Sem is required.',
            })
            .min(1, 'Sem is required.'),
        desc: z
            .string({
                required_error: 'Course description is required.',
            })
            .min(1, 'Course description is required.'),
    });

    const addForm = useForm<z.infer<typeof addFormSchema>>({
        resolver: zodResolver(addFormSchema),
        defaultValues: {
            courseid: '',
            name: '',
            program: '',
            sem: '',
            desc: '',
        },
    });

    
    async function onAddSubmit(values: z.infer<typeof addFormSchema>) {
        isLoading.current = true;

        try {
            const res = await fetch(`http://localhost:3000/api/admin/courses/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            }).then((data) => data.json());

            isLoading.current = false;
            if (res.success) {
                toast.success('Course Added Successfully!');
                addForm.reset();
                refetch();
            } else {
                toast.error('There was some error adding course, please try again!');
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

    const formSchema = z.object({
        id: z.number(),
        courseid: z
            .string({
                required_error: 'Course ID is required.',
            })
            .min(1, 'Course ID is required.'),
        name: z
            .string({
                required_error: 'Name is required.',
            })
            .min(1, 'Name is required.'),
        program: z
            .string({
                required_error: 'Program is required.',
            })
            .min(1, 'Program is required.'),
        sem: z
            .string({
                required_error: 'Sem is required.',
            })
            .min(1, 'Sem is required.'),
        desc: z
            .string({
                required_error: 'Course description is required.',
            })
            .min(1, 'Course description is required.'),
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        isLoading.current = true;

        try {
            const res = await fetch(
                `http://localhost:3000/api/admin/courses/${values.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                }
            ).then((data) => data.json());
            isLoading.current = false;
            if (res.success) {
                toast.success('Course Updated Successfully!');
                refetch();
            } else {
                toast.error('There was some error updating course, please try again!');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error("Couldn't update data, try again later... :(");
            isLoading.current = false;
        }
    }

    async function deleteData(id: number) {
        try {
            const res = await fetch(`http://localhost:3000/api/admin/courses/${id}`, {
                method: 'DELETE',
            }).then((data) => data.json());
            if (res.success) {
                toast.success('Course deleted Successfully!');
                refetch();
            } else {
                toast.error('There was some error updating course, please try again!');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error("Couldn't delete course, try again later... :(");
        }
    }

    const columns: ColumnDef<Course>[] = [
        {
            accessorKey: 'courseid',
            header: () => {
                return <div className="text-center">Course ID</div>;
            },
            cell: ({ row }) => (
                <div className="text-center capitalize">
                    {row.getValue('courseid')}
                </div>
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
            accessorKey: 'program',
            header: () => {
                return <div className="text-center">Program</div>;
            },
            cell: ({ row }) => (
                <div className="text-center">{row.getValue('program')}</div>
            ),
        },
        {
            accessorKey: 'sem',
            header: () => {
                return <div className="text-center">Sem</div>;
            },
            cell: ({ row }) => (
                <div className="text-center">{row.getValue('sem')}</div>
            ),
        },
        {
            accessorKey: 'desc',
            header: () => {
                return <div className="text-center">Description</div>;
            },
            cell: ({ row }) => (
                <div className="text-center">{row.getValue('desc')}</div>
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
                        courseid: row.original.courseid,
                        name: row.original.name,
                        program: row.original.program,
                        sem: row.original.sem,
                        desc: row.original.desc,
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
                                                course.
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
                                        Edit Course Details
                                    </DialogTitle>
                                    <DialogDescription>
                                        Make changes to Course details here.
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
                                            name="courseid"
                                            render={({ field }) => (
                                                <FormItem className="max-w-96">
                                                    <FormLabel className="ml-2">
                                                        Course ID
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
                                            name="program"
                                            render={({ field }) => (
                                                <FormItem className="max-w-96">
                                                    <FormLabel className="ml-2">
                                                        Program
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
                                            name="sem"
                                            render={({ field }) => (
                                                <FormItem className="max-w-96">
                                                    <FormLabel className="ml-2">
                                                        Sem
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
                                            name="desc"
                                            render={({ field }) => (
                                                <FormItem className="max-w-96">
                                                    <FormLabel className="ml-2">
                                                        Description
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            className="h-24"
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
                {/* Add Course Dialog */}
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>Add Course</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Course Details</DialogTitle>
                            <DialogDescription>
                                Add Course details here. Click save when you're
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
                                    name="courseid"
                                    render={({ field }) => (
                                        <FormItem className="max-w-96">
                                            <FormLabel className="ml-2">
                                                Course ID
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
                                    name="program"
                                    render={({ field }) => (
                                        <FormItem className="max-w-96">
                                            <FormLabel className="ml-2">
                                                Program
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
                                    name="sem"
                                    render={({ field }) => (
                                        <FormItem className="max-w-96">
                                            <FormLabel className="ml-2">
                                                Sem
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
                                    name="desc"
                                    render={({ field }) => (
                                        <FormItem className="max-w-96">
                                            <FormLabel className="ml-2">
                                                Description
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    className="h-24"
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
