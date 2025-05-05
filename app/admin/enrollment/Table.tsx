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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { ColumnDef } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { APIdateFormatter } from '@/utils/dateFormatter';
import { DataTable } from '@/components/datatableComponent/DataTable';
import { useDebounce } from '@/utils/customHooks/useDebounce';

type EnrollmentData = {
    id: number;
    student_id: number;
    course_id: number;
    enrollmentdate: Date;
    status: string;
    grade: string;
};

export default function Admin({
    initialData,
}: {
    initialData: EnrollmentData[];
}) {
    const [data, setData] = useState<EnrollmentData[]>(initialData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const isLoading = useRef(false);

    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search);

    const refetch = async () => {
        setLoading(true);

        const res =
            debouncedSearch.length > 0
                ? await fetch(
                      'http://localhost:3000/api/admin/enrollmentData',
                      {
                          method: 'POST',
                          headers: {
                              'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ search: debouncedSearch }),
                      }
                  )
                : await fetch('http://localhost:3000/api/admin/enrollmentData');

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
        student_id: z
            .string({
                required_error: 'Student ID is required.',
            })
            .min(1, 'Student ID is required.'),
        course_id: z
            .string({
                required_error: 'Course ID is required.',
            })
            .min(1, 'Course ID is required.'),
        enrollmentdate: z.date({
            required_error: 'An enrollment date is required.',
        }),
        status: z
            .string({
                required_error: 'Status is required.',
            })
            .min(1, 'Status is required.'),
        grade: z.string(),
    });

    const addForm = useForm<z.infer<typeof addFormSchema>>({
        resolver: zodResolver(addFormSchema),
        defaultValues: {
            student_id: '',
            course_id: '',
            enrollmentdate: new Date(),
            grade: '',
            status: '',
        },
    });

    async function onAddSubmit(values: z.infer<typeof addFormSchema>) {
        isLoading.current = true;

        try {
            const res = await fetch(
                `http://localhost:3000/api/admin/enrollmentData/create`,
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
                toast.success('Enrollment Added Successfully!');
                addForm.reset();
                refetch();
            } else {
                toast.error(
                    'There was some error adding enrollment, please try again!' + ` ${res.error}`
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

    const formSchema = z.object({
        id: z.number(),
        student_id: z
            .string({
                required_error: 'Student ID is required.',
            })
            .min(1, 'Student ID is required.'),
        course_id: z
            .string({
                required_error: 'Course ID is required.',
            })
            .min(1, 'Course ID is required.'),
        enrollmentdate: z.date({
            required_error: 'An enrollment date is required.',
        }),
        status: z
            .string({
                required_error: 'Status is required.',
            })
            .min(1, 'Status is required.'),
        grade: z.string(),
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        isLoading.current = true;

        const formatted = {
            ...values,
            dob: values.enrollmentdate.toISOString().split('T')[0],
        };

        try {
            await fetch(
                `http://localhost:3000/api/admin/enrollmentData/${formatted.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formatted),
                }
            ).then((data) => data.json());
            toast.success('Enrollment Data Updated Successfully!');
            isLoading.current = false;
            refetch();
        } catch (error) {
            console.error('Error:', error);
            toast.error("Couldn't update data, try again later... :(");
            isLoading.current = false;
        }
    }

    async function deleteData(id: number) {
        try {
            await fetch(
                `http://localhost:3000/api/admin/enrollmentData/${id}`,
                {
                    method: 'DELETE',
                }
            ).then((data) => data.json());
            toast.success('Enrollment deleted successfully!');
            refetch();
        } catch (error) {
            console.error('Error:', error);
            toast.error("Couldn't delete enrollment, try again later... :(");
        }
    }

    const columns: ColumnDef<EnrollmentData>[] = [
        {
            accessorKey: 'id',
            header: () => {
                return <div className="text-center">ID</div>;
            },
            cell: ({ row }) => (
                <div className="text-center">{row.getValue('id')}</div>
            ),
        },
        {
            accessorKey: 'student_id',
            header: () => {
                return <div className="text-center">Student ID</div>;
            },
            cell: ({ row }) => (
                <div className="text-center">{row.getValue('student_id')}</div>
            ),
        },
        {
            accessorKey: 'course_id',
            header: () => {
                return <div className="text-center">Course ID</div>;
            },
            cell: ({ row }) => (
                <div className="text-center">{row.getValue('course_id')}</div>
            ),
        },
        {
            accessorKey: 'enrollmentdate',
            header: () => {
                return <div className="text-center">Enrollment Date</div>;
            },
            cell: ({ row }) => (
                <div className="text-center">
                    {APIdateFormatter(new Date(row.getValue('enrollmentdate')))}
                </div>
            ),
        },
        {
            accessorKey: 'status',
            header: () => <div className="text-center">Status</div>,
            cell: ({ row }) => (
                <div className="text-center capitalize">
                    {row.getValue('status')}
                </div>
            ),
        },
        {
            accessorKey: 'grade',
            header: () => <div className="text-center">Grade</div>,
            cell: ({ row }) => (
                <div className="text-center">
                    {row.getValue('grade') ? row.getValue('grade') : '-'}
                </div>
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
                        student_id: row.original.student_id.toString(),
                        course_id: row.original.course_id.toString(),
                        grade: row.original.grade,
                        status: row.original.status,
                        enrollmentdate: new Date(row.original.enrollmentdate),
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
                                                enrollment.
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
                                                        Enrollment ID
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="student_id"
                                            render={({ field }) => (
                                                <FormItem className="max-w-96">
                                                    <FormLabel className="ml-2">
                                                        Student ID
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
                                            name="course_id"
                                            render={({ field }) => (
                                                <FormItem className="max-w-96">
                                                    <FormLabel className="ml-2">
                                                        Course ID
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
                                            name="enrollmentdate"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col">
                                                    <FormLabel>
                                                        Enrollment Date
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
                                            name="status"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Status
                                                    </FormLabel>
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
                                                                value="active"
                                                                className="cursor-pointer"
                                                            >
                                                                Active
                                                            </SelectItem>
                                                            <SelectItem
                                                                value="completed"
                                                                className="cursor-pointer"
                                                            >
                                                                Completed
                                                            </SelectItem>
                                                            <SelectItem
                                                                value="failed"
                                                                className="cursor-pointer"
                                                            >
                                                                Failed
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="grade"
                                            render={({ field }) => (
                                                <FormItem className="max-w-96">
                                                    <FormLabel className="ml-2">
                                                        Grade
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
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
                    placeholder="Filter by enrollment ID..."
                    value={search ?? ''}
                    onChange={(e: any) => setSearch(e.target.value)}
                    className="w-80 md:w-96"
                />
                {/* Add Enrollments Dialog */}
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>Add Enrollment</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Enrollment Details</DialogTitle>
                            <DialogDescription>
                                Add Enrollment details here. Click save when
                                you're done.
                                <span className='italic underline block'>
                                    Note: Student ID and Course ID must exist!
                                </span>
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...addForm}>
                            <form
                                onSubmit={addForm.handleSubmit(onAddSubmit)}
                                className="w-96 space-y-6 mx-auto"
                            >
                                <FormField
                                    control={addForm.control}
                                    name="student_id"
                                    render={({ field }) => (
                                        <FormItem className="max-w-96">
                                            <FormLabel className="ml-2">
                                                Student ID
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
                                    name="course_id"
                                    render={({ field }) => (
                                        <FormItem className="max-w-96">
                                            <FormLabel className="ml-2">
                                                Course ID
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
                                    name="enrollmentdate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>
                                                Enrollment Date
                                            </FormLabel>
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
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="cursor-pointer">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem
                                                        value="active"
                                                        className="cursor-pointer"
                                                    >
                                                        Active
                                                    </SelectItem>
                                                    <SelectItem
                                                        value="completed"
                                                        className="cursor-pointer"
                                                    >
                                                        Completed
                                                    </SelectItem>
                                                    <SelectItem
                                                        value="failed"
                                                        className="cursor-pointer"
                                                    >
                                                        Failed
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={addForm.control}
                                    name="grade"
                                    render={({ field }) => (
                                        <FormItem className="max-w-96">
                                            <FormLabel className="ml-2">
                                                Grade
                                            </FormLabel>
                                            <FormControl>
                                                <Input {...field} />
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
