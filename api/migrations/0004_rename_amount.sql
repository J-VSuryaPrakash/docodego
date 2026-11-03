ALTER TABLE bills
RENAME COLUMN amount TO total_cents;

ALTER TABLE shares
RENAME COLUMN amount TO amount_cents;