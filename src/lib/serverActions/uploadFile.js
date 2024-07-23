"use server";
import supabase from "@/lib/supabase";
import csvParser from "csv-parser";
import { Readable } from "stream";
import { addNewContact } from "./addNewContact";

async function getCSVObj(formData) {
  const file = formData.get("file");

  const buffer = Buffer.from(await file.arrayBuffer());
  const stream = Readable.from(buffer);
  const result = [];
  try {
    await new Promise((res, rej) => {
      stream
        .pipe(csvParser())
        .on("data", (data) => {
          if (Object.values(data).some((field) => field.trim() !== "")) {
            result.push(data);
          }
        })
        .on("finish", () => res());
    });
  } catch (e) {
    return { error: "Format not correct" };
  }
  return result;
}

export async function getFileData(formData) {
  let result;
  try {
    result = await getCSVObj(formData);
  } catch (e) {
    return { error: "Format not correct" };
  }
  return { data: result.slice(0, 4) };
}

export async function uploadFile(formData, mapping) {
  let csvObj = await getCSVObj(formData);

  const formattedData = [];
  for (let d of csvObj) {
    const temp = {};
    for (let oldKey of Object.keys(mapping)) {
      const data = d[oldKey];
      temp[mapping[oldKey]] = data;
    }
    formattedData.push(temp);
  }
  console.log(csvObj, 123);
  const response = addNewContact(formattedData, csvObj);
  return response;
}
