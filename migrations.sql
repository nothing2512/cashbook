-- enum
CREATE TYPE transactions_kind_enum AS ENUM ('income', 'expenses');
CREATE TYPE transactions_status_enum AS ENUM ('paid', 'unpaid');

-- Tables
CREATE TABLE savings (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    num VARCHAR(30) NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE categories (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE transactions (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    parent_id BIGINT,
    saving_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL, 
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    kind transactions_kind_enum NOT NULL,
    status transactions_status_enum NOT NULL DEFAULT ('paid'),
    transaction_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    CONSTRAINT fk_transactions_savings
        FOREIGN KEY (saving_id)
        REFERENCES savings(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_transactions_categories
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- policy 
alter table savings enable row level security;
create policy "savings policy" on savings for all to authenticated using ( true );

alter table categories enable row level security;
create policy "categories policy" on categories for all to authenticated using ( true );

alter table transactions enable row level security;
create policy "transactions policy" on transactions for all to authenticated using ( true );

-- default data
INSERT INTO savings (name, num, amount) VALUES ('Cash', '', 0);
INSERT INTO categories (name) VALUES ('default');