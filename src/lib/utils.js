import { clsx } from "clsx";
import { jsx } from "react/jsx-runtime";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function generateCol(sampleData) {
  if (!sampleData) return [];
  const col = Object.keys(sampleData).map((k) => {
    return {
      accessorKey: k,
      header: k,
    };
  });
  const idIndex = col.findIndex((k) => k.accessorKey === "id");
  if (idIndex != -1) {
    col.splice(idIndex, 1);
  }
  return col;
}

export function generateTableDefaultVal(col) {
  const defaultVal = {};
  for (let c of col) {
    defaultVal[c.accessorKey] = "";
  }
  return defaultVal;
}
