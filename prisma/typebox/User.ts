import { t } from "elysia";

export const User = t.Object({
  id: t.Number(),
  createdAt: t.Optional(t.String()),
  email: t.String(),
  weight: t.Optional(t.Number()),
  is18: t.Optional(t.Boolean()),
  name: t.Optional(t.String()),
  successorId: t.Optional(t.Number()),
  role: t.Optional(),
  biography: t.String(),
  decimal: t.Number(),
  biginteger: t.Integer(),
});
