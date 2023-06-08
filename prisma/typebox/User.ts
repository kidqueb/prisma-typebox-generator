import { t } from "elysia";
import { Role } from "./Role";

export const User = t.Object({
  id: t.Number(),
  createdAt: t.Optional(t.String()),
  email: t.String(),
  weight: t.Optional(t.Number()),
  is18: t.Optional(t.Boolean()),
  name: t.Optional(t.String()),
  successorId: t.Optional(t.Number()),
  role: t.Optional(Role),
  keywords: t.Array(t.String()),
  biography: t.String(),
  decimal: t.Number(),
  biginteger: t.Integer(),
});
