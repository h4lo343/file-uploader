import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcnUI/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcnUI/select";
import { useEffect, useState } from "react";
import { generateCol } from "@/lib/utils";

const optinal_cols = ["Custom Field"];

function checkValid(selectVal, necessaryCols) {
  selectVal = selectVal.filter((e) => e);
  if (
    selectVal.reduce((acc, item) => acc.add(item), new Set()).size !==
    selectVal.length
  )
    return false;

  for (let c of necessaryCols) {
    const index = selectVal.indexOf(c);
    if (index === -1) return false;
  }
  return true;
}

export const EditTable = ({
  sampleData,
  originalCol,
  setNext2Dis,
  setFormattedData,
}) => {
  const selectCols = originalCol.map((v) => v.accessorKey);
  const necessaryCols = selectCols.filter(
    (c) => optinal_cols.indexOf(c) === -1
  );

  const [selectVal, setSelectVal] = useState(
    new Array(originalCol.length).fill(undefined)
  );
  useEffect(() => {
    if (checkValid(selectVal, necessaryCols)) {
      setNext2Dis(false);
      const temp = [];
      for (let d of sampleData) {
        const row = {};
        for (let i = 0; i < selectCols.length; i++) {
          if (!selectVal[i]) continue;
          const oldData = d[selectCols[i]];
          row[selectVal[i]] = oldData;
        }
        console.log(temp);
        temp.push(row);
      }
      setFormattedData(temp);
    } else setNext2Dis(true);
  }, [selectVal]);
  const handleSelect = (valObj) => {
    setSelectVal((a) => {
      a[valObj.index] = valObj.val;
      return [...a];
    });
  };
  const columns = generateCol(sampleData[0]);
  const table = useReactTable({
    data: sampleData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header, index) => {
                return (
                  <>
                    <TableHead key={header.id} className="w-1/4">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      <Select
                        onValueChange={(v) =>
                          handleSelect({
                            val: v,
                            index,
                          })
                        }
                        value={selectVal[index]}
                        key={index}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Col" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Cols</SelectLabel>
                            {selectCols.map((v, index2) => (
                              <SelectItem value={v} key={index2}>
                                {v}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </TableHead>
                  </>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="w-1/4 pl-10 pr-10">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    {"              "}
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
      <a
        className="underline text-blue-500 cursor-pointer"
        onClick={() => {
          setSelectVal(new Array(originalCol.length).fill(null));
        }}
      >
        clear selectors
      </a>
      <div>
        * Mandatory Columns:
        {necessaryCols.map((c) => (
          <div>{c}</div>
        ))}
      </div>
    </>
  );
};
