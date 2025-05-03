import {
    ChevronLeftIcon,
    ChevronRightIcon,
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon,
} from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useLocation, useSearchParams } from 'react-router-dom';
import { SetStateAction } from 'react';

type Props = {
    totalCount: number;
    setDirty: React.Dispatch<SetStateAction<boolean>>;
    dirty: boolean;
};

export function ServerSidePagination({ totalCount, dirty, setDirty }: Props) {
    const location = useLocation()
    const state = location.state
    const [searchParams, setSearchParams] = useSearchParams();

    const offset = searchParams.get('offset') || 0;
    const limit = searchParams.get('limit') || 10;

    return (
        <div className="flex flex-wrap items-center justify-between px-2 mt-10">
            <div className="flex-1 text-sm text-muted-foreground"></div>
            <div className="flex flex-wrap items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <Select
                        value={limit === undefined ? '10' : limit?.toString()}
                        onValueChange={(value) => {
                            setSearchParams({...Object.fromEntries(searchParams.entries()), 'limit': value}, {state: {...state}, replace: true});
                            setDirty(!dirty);
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={limit} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[5, 10, 20, 30, 40, 50, 100].map((pageSize) => (
                                <SelectItem
                                    key={pageSize}
                                    value={`${pageSize}`}
                                >
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    Page {+offset / +limit + 1} of{' '}
                    {Math.ceil(totalCount / +limit)}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => {
                            setSearchParams({...Object.fromEntries(searchParams.entries()), 'offset': '0'}, {state: {...state}, replace: true});
                            setDirty(!dirty);
                        }}
                        disabled={+offset === 0}
                    >
                        <span className="sr-only">Go to first page</span>
                        <DoubleArrowLeftIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                            setSearchParams({...Object.fromEntries(searchParams.entries()), 'offset': (+offset - +limit).toString()}, {state: {...state}, replace: true});
                            setDirty(!dirty);
                        }}
                        disabled={+offset === 0}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeftIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                            setSearchParams({...Object.fromEntries(searchParams.entries()), 'offset': (+offset + +limit).toString()}, {state: {...state}, replace: true})
                            setDirty(!dirty);
                        }}
                        disabled={Math.ceil(totalCount / +limit) === +offset / +limit + 1}
                    >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRightIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => {
                            setSearchParams({...Object.fromEntries(searchParams.entries()), 'offset': ((Math.ceil(totalCount / +limit)-1)*+limit).toString()}, {state: {...state}, replace: true})
                            setDirty(!dirty);
                        }}
                        disabled={Math.ceil(totalCount / +limit) === +offset / +limit + 1}
                    >
                        <span className="sr-only">Go to last page</span>
                        <DoubleArrowRightIcon className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
