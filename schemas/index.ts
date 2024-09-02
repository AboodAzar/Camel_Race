import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "البريد الالكتروني مطلوب",
  }),
  password: z.string().min(1, {
    message: "كلمة المرور مطلوبة",
  }),
});

export const RegisterSchema = z
  .object({
    FirstName: z
      .string({
        message: "الاسم مطلوب",
      })
      .min(1, {
        message: "الاسم مطلوب",
      }),
    FatherName: z
      .string({
        message: "اسم الاب مطلوب",
      })
      .min(1, {
        message: "اسم الاب مطلوب",
      }),
    GrandFatherName: z
      .string({
        message: "اسم الجد مطلوب",
      })
      .min(1, {
        message: "اسم الجد مطلوب",
      }),
    FamilyName: z
      .string({
        message: "اسم العائلة مطلوب",
      })
      .min(1, {
        message: "اسم العائلة مطلوب",
      }),
    username: z
      .string({
        message: "اسم المستخدم مطلوب",
      })
      .min(1, {
        message: "اسم المستخدم مطلوب",
      }),
    email: z.string().email({
      message: "البريد الالكتروني مطلوب",
    }),
    NationalID: z
      .string()
      .min(10, {
        message: "الرقم الوطني يجب أن يتكون من 10 ارقام",
      })
      .max(11, {
        message: "الرقم الوطني يجب ألا يتجاوز 11 رقمًا",
      })
      .regex(/^\d+$/, {
        message: "الرقم الوطني يجب أن يتكون من أرقام فقط",
      }),
    BDate: z
      .date({
        message: "تاريخ الميلاد مطلوب",
      })
      .refine((date) => date < new Date(), {
        message: "تاريخ الميلاد يجب أن يكون في الماضي",
      }),
    MobileNumber: z
      .string()
      .min(9, {
        message: "رقم الهاتف يجب أن يتكون من 10 ارقام",
      })
      .max(15, {
        message: "رقم الهاتف يجب ألا يتجاوز 15 رقمًا",
      })
      .regex(/^\+?[0-9]\d{1,14}$/, {
        message: "صيغة رقم الهاتف غير صحيحة",
      }),
    password: z.string().min(6, {
      message: "الطول 6 حروف على الاقل",
    }),
    confirmPassword: z.string().min(6, {
      message: "الطول 6 حروف على الاقل",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "كلمة المرور وتأكيد كلمة المرور غير متطابقين",
  });