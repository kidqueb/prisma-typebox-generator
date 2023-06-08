import { t } from "elysia";

export const Role = t.KeyOf(
  t.Object({
    USER: t.Literal("USER"),
    ADMIN: t.Literal("ADMIN"),
  })
);
