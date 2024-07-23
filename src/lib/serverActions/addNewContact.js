"use server";
import supabase from "@/lib/supabase";

const validMobileNumregex = /^(04\d{8}|4\d{8}|61\d{9})$/;

const zeroFour = /^04\d{8}$/;
const sixOne = /^61\d{9}$/;

function checkMobileNumber(mobileNum) {
  if (!validMobileNumregex.test(mobileNum)) return false;
  else if (zeroFour.test(mobileNum)) {
    return "04";
  } else if (sixOne.test(mobileNum)) {
    return "61";
  } else return true;
}

export async function addNewContact(newContact, csvObj = []) {
  let failed = [];
  let sucessful = [];
  let failedData = [];

  for (let i = 0; i < newContact.length; i++) {
    const c = newContact[i];
    let mobileNum = c.Mobile;
    const checkResult = checkMobileNumber(mobileNum);

    if (!checkResult || !mobileNum) {
      failed.push(csvObj[i]);
    } else {
      if (checkResult === "04") {
        c.Mobile = c.Mobile.slice(1, c.Mobile.length);
      } else if (checkResult === "61") {
        c.Mobile = c.Mobile.slice(2, c.Mobile.length);
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
