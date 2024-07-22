"use server";
import supabase from "@/lib/supabase";

const validPhoneNumregex = /^(04\d{8}|4\d{8})$/;
const phoneNumberNeedTruncation = /^04\d{8}$/;
export async function addNewContact(newContact) {
  let failed = [];
  let sucessful = [];
  for (let c of newContact) {
    let mobileNum = c.Mobile;
    const testResult = validPhoneNumregex.test(mobileNum);
    if (!testResult) {
      failed.push(c);
    } else {
      if (phoneNumberNeedTruncation.test(mobileNum)) {
        c.Mobile = c.Mobile.slice(1, c.Mobile.length);
      }
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
