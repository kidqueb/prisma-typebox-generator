import { t } from "elysia";

export const Post = t.Object({
  id: t.Number(),
  userId: t.Optional(t.Number()),
});
