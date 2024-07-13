"use server";
import supabase from "@/lib/supabase";
import fs from "fs";
import { writeFile } from "fs/promises";
import csvParser from "csv-parser";
import { Readable } from "stream";
import { resolve } from "path";

export async function uploadFile(formData) {
  const file = formData.get("file");

  const buffer = Buffer.from(await file.arrayBuffer());
  const stream = Readable.from(buffer);

  const result = [];
  await new Promise((res, rej) => {
    stream
      .pipe(csvParser())
      .on("data", (data) => {
        result.push(data);
      })
      .on("finish", () => res());
  });
  console.log("-------------------------------");
  console.log(result);
  console.log("-------------------------------");
  const { data, error } = await supabase.from("customers").insert(result);
  if (error) {
    return { error: "Format not correct" };
  }
  return { success: true };
}
