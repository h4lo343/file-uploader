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

const necessary_cols = ["Mobile"];

function checkValid(selectVal) {
  selectVal = selectVal.filter((e) => e);
  if (
    selectVal.reduce((acc, item) => acc.add(item), new Set()).size !==
    selectVal.length
  )
    return false;

  for (let c of necessary_cols) {
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

  selectVal,
  router,
  setSelectVal,
  setMapping,
}) => {
  const selectCols = originalCol.map((v) => v.accessorKey);
  const sampleCol = Object.keys(sampleData[0]);
  useEffect(() => {
    if (checkValid(selectVal)) {
      setNext2Dis(false);
      const temp = [];
      const mapping = {};
      for (let d of sampleData) {
        const row = {};
        for (let i = 0; i < selectVal.length; i++) {
          if (!selectVal[i]) continue;

          mapping[sampleCol[i]] = selectVal[i];

          const oldData = d[sampleCol[i]];
          row[selectVal[i]] = oldData;
        }
        temp.push(row);
      }
      setFormattedData(temp);
      setMapping(mapping);
      console.log(mapping);
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
          setSelectVal(new Array(sampleCol.length).fill(""));
        }}
      >
        clear selectors
      </a>
      <div>
        * Mandatory Columns:
        {necessary_cols.map((c) => (
          <div>{c}</div>
        ))}
      </div>
    </>
  );
};
