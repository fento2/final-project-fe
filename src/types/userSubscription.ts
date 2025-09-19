import z from "zod";
import { SubscriptionSchema } from "./subscription";

enum PaymentStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}

export const UserSchema = z.object({
    user_id: z.number(),
    username: z.string(),
    email: z.email(),
    googleId: z.string().nullable(),
    password: z.string(),
    name: z.string(),
    role: z.string(),
    isVerfied: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const UserSubscriptionSchema = z.object({
    user_subscription_id: z.number(),
    user_id: z.number(),
    subscription_id: z.number(),
    start_date: z.date().optional(),
    end_date: z.date().optional(),
    createAt: z.date().optional(),
    updatedAt: z.date().optional(),
    payment_status: z.nativeEnum(PaymentStatus),
});

export type UserSubscription = z.infer<typeof UserSubscriptionSchema>;

export const UserSubscriptionsSchema = z.object({
    userSubscriptionSchema: UserSubscriptionSchema,
    subscription: SubscriptionSchema,
});

export type UserSubscriptionsGetDTO = z.infer<typeof UserSubscriptionsSchema>;

export const UserSubscriptionUpdateShcema = z.object({
    user_subscription_id: z.number(),
    user_id: z.number().optional(),
    subscription_id: z.number().optional(),
    start_date: z.date().optional(),
    end_date: z.date().optional(),
    payment_status: z.enum(PaymentStatus),
});

export type UserSubscriptionUpdateDTO = z.infer<typeof UserSubscriptionUpdateShcema>;

export const UserSubscriptionActiveSchema = z.object({
    user_subscription_id: z.number(),
    user_id: z.number(),
    subscription_id: z.number(),
    start_date: z.date().optional(),
    end_date: z.date().optional(),
    createAt: z.date().optional(),
    updatedAt: z.date().optional(),
    payment_status: z.enum(PaymentStatus),
    subscription: SubscriptionSchema,
    user: UserSchema,
});

export type UserSubscriptionActiveDTO = z.infer<typeof UserSubscriptionActiveSchema>;