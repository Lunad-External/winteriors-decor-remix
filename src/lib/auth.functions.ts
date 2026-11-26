import { createServerFn } from "@tanstack/react-start";
import { currentAdmin, login, logout } from "./auth.server";

export const loginFn = createServerFn({ method: "POST" })
  .validator((input: { email: string; password: string }) => {
    if (typeof input?.email !== "string" || typeof input?.password !== "string") throw new Error("Invalid input");
    return { email: input.email.slice(0, 320), password: input.password.slice(0, 1024) };
  })
  .handler(({ data }) => login(data.email, data.password));

export const logoutFn = createServerFn({ method: "POST" }).handler(() => logout());

export const currentAdminFn = createServerFn({ method: "GET" }).handler(() => currentAdmin());
