"use server";
import supabase from "@/lib/supabase";

const validPhoneNumregex = /^(0\d{9}|61\d{9})$/;

export async function addNewContact(newContact) {
  let failed = [];
  let sucessful = [];
  for (let c of newContact) {
    let mobileNum = c.Mobile;
    const testResult = validPhoneNumregex.test(mobileNum);
    if (!testResult) {
      failed.push(c);
    } else {
      sucessful.push(c);
    }
  }
  const { data, error } = await supabase.from("customers").insert(sucessful);
  return {
    total: newContact.length,
    failed: failed,
    sucessful: sucessful,
  };
}
