"use server";
import supabase from "@/lib/supabase";

export async function addNewContact(newContact) {
  const { data, error } = await supabase
    .from("customers")
    .insert([{ ...newContact }]);
}
