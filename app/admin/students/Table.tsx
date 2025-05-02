import { Button } from '@/components/ui/button';
// import { useQuery, UseQueryResult } from '@tanstack/react-query';
import TableSkeleton from '@/app/utils/loadingUtils/TableSkeleton';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { CustomDataTable } from '@/components/datatableComponent/CustomDataTable';

export const metadata = {
    title: 'Admin',
};

export default function Admin() {
        // const fetchData = async () => {
    //     const dataObject = {
    //         "action": "view",
    //         "user_id": state.userId
    //     }
    //     const encryptedData = await encryptLaravel(JSON.stringify(dataObject));

    //     const response = await fetch(
    //         `https://b303.in/homdashboard/api/address_buyer?key=${encryptedData}`,
    //         {
    //             method: 'POST',
    //         }
    //     );
    //     const data = await response.json();
    //     const decryptedData = await decryptLaravel(data[0]);
    //     // @ts-ignore
    //     return decryptedData.addresses;
    // };

    // const {
    //     isFetching,
    //     data,
    //     isError,
    //     error,
    //     isSuccess,
    // }: UseQueryResult<AddressData[], Error> = useQuery({
    //     queryKey: ['AddressList'],
    //     queryFn: fetchData,
    //     refetchOnWindowFocus: false,
    // });

    // if (isError) {
    // return (
    //     <div className="text-red-600 text-xl font-bold text-center h-fit">
    //         There was some problem in loading the data! Please reload.
    //     </div>
    // );
    // }

    // if (isFetching) {
    //     return <TableSkeleton />;
    // }

    // if (isSuccess) {
    //     const AddressColumns: ColumnDef<AddressData>[] = [
    //         {
    //             id: 'select',
    //             header: ({ column }) => {
    //                 return (
    //                     <div className="text-center">
    //                         <Button
    //                             variant="ghost"
    //                             onClick={() =>
    //                                 column.toggleSorting(
    //                                     column.getIsSorted() === 'asc'
    //                                 )
    //                             }
    //                             className="text-center"
    //                         >
    //                             <ArrowUpDown className="ml-2 h-4 w-4" />
    //                         </Button>
    //                     </div>
    //                 );
    //             },
    //             cell: (props) => (
    //                 <div className="text-center">{props.row.index + 1}</div>
    //             ),
    //         },
    //         {
    //             accessorKey: 'apartment_no',
    //             // header: () => <div className="text-center">Name</div>,
    //             header: () => {
    //                 return <div className="text-center">Apartment Number</div>;
    //             },
    //             cell: ({ row }) => (
    //                 <div className="text-center capitalize">
    //                     {row.getValue('apartment_no')}
    //                 </div>
    //             ),
    //         },
    //         {
    //             accessorKey: 'wing_no',
    //             header: () => <div className="text-center">Wing</div>,
    //             cell: ({ row }) => (
    //                 <div className="text-center">{row.getValue('wing_no')}</div>
    //             ),
    //         },
    //         {
    //             accessorKey: 'building_no',
    //             header: () => {
    //                 return <div className="text-center">Building Name</div>;
    //             },
    //             cell: ({ row }) => (
    //                 <div className="text-center">
    //                     {row.getValue('building_no')}
    //                 </div>
    //             ),
    //         },
    //         {
    //             accessorKey: 'address',
    //             header: () => <div className="text-center">Address</div>,
    //             cell: ({ row }) => (
    //                 <div className="max-w-80 mx-auto text-center">
    //                     {row.getValue('address')}
    //                 </div>
    //             ),
    //             size: 200,
    //         },
    //     ];
    return <h2>Admin Page</h2>;
}
