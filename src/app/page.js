import { ContactorTable } from "@/components/pageComponents/ContactorTable";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcnUI/table";
import supabase from "@/lib/supabase";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import Image from "next/image";
export const data = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
];
export const columns = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
];

export async function getContactorsData() {
  const { data: contactors } = await supabase.from("customers").select();

  return contactors;
}
export default async function Home() {
  const contactorsData = await getContactorsData();

  return (
    <main className="  min-h-screen     p-24">
      <ContactorTable contactorsData={contactorsData} />
    </main>
  );
}
