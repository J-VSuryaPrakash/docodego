CREATE TABLE bills (
    id TEXT PRIMARY KEY,
    home_id TEXT NOT NULL,
    title TEXT NOT NULL,
    amount INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_bill_home
        FOREIGN KEY (home_id)
        REFERENCES homes(id),
    
    CONSTRAINT non_negative_bill_amount
        CHECK (amount >= 0)
);

CREATE TABLE shares (
    id TEXT PRIMARY KEY,
    bill_id TEXT NOT NULL,
    member_id TEXT NOT NULL,
    amount INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_share_bill
        FOREIGN KEY (bill_id)
        REFERENCES bills(id),

    CONSTRAINT fk_share_member
        FOREIGN KEY (member_id)
        REFERENCES members(id),

    CONSTRAINT non_negative_share_amount
        CHECK (amount >= 0),

    CONSTRAINT unique_bill_member
        UNIQUE (bill_id, member_id)
);