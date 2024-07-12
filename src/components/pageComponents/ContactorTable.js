"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcnUI/table";
import { cn } from "@/lib/utils";
import { Paperclip, Send } from "lucide-react";
import { buttonVariants } from "@/components/shadcnUI/button";
import validator from "validator";
import { addNewContact } from "@/lib/serverActions/addNewContact";
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
import { object, z } from "zod";
import supabase from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput,
} from "@/components/shadcnUI/fileUpload";
import { uploadFile } from "@/lib/serverActions/uploadFile";

const columns = [
  { accessorKey: "First Name", header: "First Name" },
  { accessorKey: "Last Name", header: "Last Name" },
  { accessorKey: "Email", header: "Email" },
  { accessorKey: "Mobile", header: "Mobile" },
  { accessorKey: "Custom Field", header: "Custom Field" },
  { accessorKey: "State", header: "State" },
];
const DataFormSchema = z.object({
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

const FileFormSchema = z.object({
  File: z
    .array(z.instanceof(File))
    .refine((arr) => arr.length === 1, { message: "Please upload a file" })
    .refine((arr) => arr[0]?.size < 50 * 1024 * 1024, {
      message: "The first file size must be less than 50MB",
    }),
});

const dropZoneConfig = {
  accept: {
    "text/*": [".csv"],
  },
  multiple: true,
  maxSize: 1024 * 1024 * 49,
  maxFiles: 1,
};
export const ContactorTable = ({ contactorsData }) => {
  const router = useRouter();
  const [isForm, setIsForm] = useState(true);
  const handleAddNewContact = async (v) => {
    console.log(FileForm.getValues("File"));
    await addNewContact(v);
    router.refresh();
    setDialogOpen(false);
  };

  const [dialogOpen, setDialogOpen] = useState(false);
  const table = useReactTable({
    data: contactorsData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const DataForm = useForm({
    resolver: zodResolver(DataFormSchema),
    defaultValues: {
      "First Name": "",
      "Last Name": "",
      Email: "",
      Mobile: "",
      "Custom Field": "",
      State: "",
    },
  });
  const FileForm = useForm({
    resolver: zodResolver(FileFormSchema),
    defaultValues: {
      File: [],
    },
  });
  const handleUploadFile = async (v) => {
    console.log(v.File[0] instanceof File);
    const formData = new FormData();

    formData.append("file", v.File[0]);
    const res = await uploadFile(formData);
    if (res.success) {
      router.refresh();
      setDialogOpen(false);
    }
  };
  const FileSvgDraw = () => {
    return (
      <>
        <svg
          className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 16"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
          />
        </svg>
        <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
          <span className="font-semibold">Click to upload</span>
          &nbsp; or drag and drop
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">CSV</p>
      </>
    );
  };

  return (
    <div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mb-8">Add New Contact</Button>
        </DialogTrigger>
        <DialogContent>
          <div className="flex pt-1.5">
            <Button
              className={`flex-1 rounded-none ${
                isForm ? "bg-black text-white " : "bg-white text-black"
              }`}
              onClick={() => setIsForm(true)}
            >
              Add New Contact
            </Button>
            <Button
              className={`flex-1 rounded-none ${
                !isForm ? "bg-black text-white " : "bg-white text-black"
              }`}
              onClick={() => setIsForm(false)}
            >
              Upload contacts
            </Button>
          </div>

          {isForm ? (
            <Form {...DataForm}>
              <form
                onSubmit={DataForm.handleSubmit(handleAddNewContact)}
                className="grid grid-cols-2 gap-4"
              >
                <FormField
                  control={DataForm.control}
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
                  control={DataForm.control}
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
                  control={DataForm.control}
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
                  control={DataForm.control}
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
                  control={DataForm.control}
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
                  control={DataForm.control}
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
          ) : (
            <>
              <Form {...FileForm}>
                <form onSubmit={FileForm.handleSubmit(handleUploadFile)}>
                  <FormField
                    control={FileForm.control}
                    name="File"
                    render={({ field }) => (
                      <FormItem>
                        <FileUploader
                          value={field.value}
                          onValueChange={field.onChange}
                          dropzoneOptions={dropZoneConfig}
                          reSelect={true}
                          className="relative bg-background rounded-lg p-2 w-full"
                        >
                          <FileInput className=" outline-dashed outline-1 outline-white">
                            <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
                              <FileSvgDraw />
                            </div>
                          </FileInput>

                          <FileUploaderContent>
                            {field.value?.map((file, i) => {
                              return (
                                <FileUploaderItem key={i} index={i}>
                                  <Paperclip className="h-4 w-4 stroke-current" />
                                  <span>{file.name}</span>
                                </FileUploaderItem>
                              );
                            })}
                          </FileUploaderContent>
                        </FileUploader>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Upload</Button>
                </form>
              </Form>
            </>
          )}

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
