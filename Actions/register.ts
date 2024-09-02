"use server";
import * as z from "zod";
import { db } from "@/lib/db";
import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { redirect } from "next/navigation";
import bcryptjs from "bcryptjs";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  console.log(values);
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "! حقل غير صالح" };
  }

  const {
    FirstName,
    FatherName,
    GrandFatherName,
    FamilyName,
    username,
    email,
    NationalID,
    BDate,
    MobileNumber,
    password,
  } = validatedFields.data;

  const hashedPassword = await bcryptjs.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "المستخدم موجود بالفعل" };
  }

  await db.user.create({
    data: {
      FirstName,
      FatherName,
      GrandFatherName,
      FamilyName,
      username,
      email,
      NationalID,
      BDate,
      MobileNumber,
      password: hashedPassword,
    },
  });

  redirect("/auth/login");

  return {
    success: "! تم انشاء الحساب",
  };
};