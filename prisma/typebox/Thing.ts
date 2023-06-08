import { t } from "elysia";
import { Role } from "./Role";

export const Thing = t.Object({
  id: t.Number(),
  userId: t.Number(),
});
