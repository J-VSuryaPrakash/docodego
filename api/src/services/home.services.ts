import type { createHomeInput } from "@bill-splitter/shared";

export async function createHome(
    db: D1Database,
    data: createHomeInput
) {
    const id = crypto.randomUUID();

    await db
        .prepare(
            "INSERT INTO homes (id, name) VALUES (?, ?)"
        )
        .bind(id, data.name)
        .run();

    return {
        id,
        name: data.name,
    };
}