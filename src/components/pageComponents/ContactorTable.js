"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcnUI/table";
import validator from "validator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcnUI/form";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/shadcnUI/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcnUI/dialog";
import { Input } from "@/components/shadcnUI/input";
import { Label } from "@/components/shadcnUI/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcnUI/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import supabase from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";

const columns = [
  { accessorKey: "First Name", header: "First Name" },
  { accessorKey: "Last Name", header: "Last Name" },
  { accessorKey: "Email", header: "Email" },
  { accessorKey: "Mobile", header: "Mobile" },
  { accessorKey: "Custom Field", header: "Custom Field" },
  { accessorKey: "State", header: "State" },
];
const formSchema = z.object({
  "First Name": z.string().min(1, {
    message: "Please fill your first name",
  }),
  "Last Name": z.string().min(1, {
    message: "Please fill your last name",
  }),
  Email: z.string().email({ message: "Must be a valid email address" }),
  Mobile: z.string().refine(validator.isMobilePhone, {
    message: "Must be a valid phone number",
  }),
  State: z.string().min(1, {
    message: "Please select your state",
  }),
  "Custom Field": z.string().optional(),
});

export const ContactorTable = ({ contactorsData }) => {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const table = useReactTable({
    data: contactorsData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      "First Name": "",
      "Last Name": "",
      Email: "",
      Mobile: "",
      "Custom Field": "",
      State: "",
    },
  });
  const addNewContact = async (v) => {
    const { data, error } = await supabase.from("customers").insert([{ ...v }]);
    router.refresh();
    setDialogOpen(false);
  };
  return (
    <div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mb-8">Add New Contact</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Contact</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              className="grid grid-cols-2 gap-4"
              onSubmit={form.handleSubmit(addNewContact)}
            >
              <FormField
                control={form.control}
                name="First Name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        id="First Name"
                        placeholder="First Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Last Name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        id="Last Name"
                        placeholder="Last Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input id="Email" placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile</FormLabel>
                    <FormControl>
                      <Input id="Mobile" placeholder="Mobile" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="State"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="State" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Queensland">Queensland</SelectItem>
                        <SelectItem value="Tasmania">Tasmania</SelectItem>
                        <SelectItem value="New South Wales">
                          New South Wales
                        </SelectItem>
                        <SelectItem value="Victoria ">Victoria </SelectItem>
                        <SelectItem value="Western Australia">
                          Western Australia
                        </SelectItem>
                        <SelectItem value="South Australia">
                          South Australia
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Custom Field"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Field</FormLabel>
                    <FormControl>
                      <Input
                        id="customField"
                        placeholder="Custom Field"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Save changes</Button>
            </form>
          </Form>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Table className="rounded-md border">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
