"use server";
import supabase from "@/lib/supabase";
import csvParser from "csv-parser";
import { Readable } from "stream";

export async function getFileData(formData) {
  const file = formData.get("file");

  const buffer = Buffer.from(await file.arrayBuffer());
  const stream = Readable.from(buffer);

  const result = [];
  try {
    await new Promise((res, rej) => {
      stream
        .pipe(csvParser())
        .on("data", (data) => {
          result.push(data);
        })
        .on("finish", () => res());
    });
  } catch (e) {
    return { error: "Format not correct" };
  }

  return { data: result.slice(0, 4) };
}
