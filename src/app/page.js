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

export const revalidate = 0;
export async function getContactorsData() {
  const { data: contactors } = await supabase.from("customers").select();

  return contactors || [];
}
export default async function Home() {
  const contactorsData = await getContactorsData();
  return (
    <main className="  min-h-screen  p-24">
      <ContactorTable contactorsData={contactorsData} />
    </main>
  );
}
