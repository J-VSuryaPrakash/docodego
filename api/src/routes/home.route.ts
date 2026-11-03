import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createHomeSchema } from "@bill-splitter/shared";
import { createHome } from "../services/home.services";
import type { AppEnv } from "../types/env"

const homeRoutes = new Hono<AppEnv>();

homeRoutes.post(
    "/",
    zValidator("json", createHomeSchema, (result, c) => {
        if (!result.success) {
            return c.json(
                { error: "Invalid home data" },
                400
            );
        }
    }),
    async (c) => {
        const data = c.req.valid("json");

        const home = await createHome(c.env.DB, data);

        return c.json(home, 201);
    }
);

export default homeRoutes;