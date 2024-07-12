"use server";
import supabase from "@/lib/supabase";
import fs from "fs";
import { writeFile } from "fs/promises";
import csvParser from "csv-parser";
import { Readable } from "stream";

export async function uploadFile(formData) {
  const file = formData.get("file");

  const buffer = Buffer.from(await file.arrayBuffer());
  const stream = Readable.from(buffer);

  const result = [];
  stream
    .pipe(csvParser())
    .on("data", (data) => {
      result.push(data);
    })
    .on("end", () => {
      console.log(result);
    });
  await writeFile("./a.csv", buffer);
  const { data, error } = await supabase.from("customers").insert(result);
  return;
}
