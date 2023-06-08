import { t } from "elysia";
import { Role } from "./Role";

export const Post = t.Object({
  id: t.Number(),
  userId: t.Optional(t.Number()),
});
