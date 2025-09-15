import z from "zod";
import { SubscriptionSchema } from "./subscription";

export const UserSubscriptionSchema = z.object({
    user_subscription_id: z.number(),
    user_id: z.number(),
    subscription_id: z.number(),
    start_date: z.date().optional(),
    end_date: z.date().optional(),
    createAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export type UserSubscription = z.infer<typeof UserSubscriptionSchema>;

export const UserSubscriptionsSchema = z.object({
    userSubscriptionSchema: UserSubscriptionSchema,
    subscription: SubscriptionSchema,
});

export type UserSubscriptionsGetDTO = z.infer<typeof UserSubscriptionsSchema>;