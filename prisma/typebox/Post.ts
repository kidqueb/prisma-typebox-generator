import { t } from "elysia";
import { Role } from "./Role.js";

export const Post = t.Object({
  id: t.Number(),
  userId: t.Optional(t.Number()),
});
