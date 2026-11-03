CREATE TABLE homes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    home_id TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_member_home
        FOREIGN KEY (home_id)
        REFERENCES homes(id)
);

