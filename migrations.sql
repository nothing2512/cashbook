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
    transaction_date TIMESTAMP NOT NULL DEFAULT NOW(),
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

-- views
CREATE OR REPLACE VIEW transaction_views AS
SELECT t.*, COALESCE(SUM(t2.amount), 0) AS child_amount, t.amount <= COALESCE(SUM(t2.amount), 0) AS paid_off
FROM transactions t
LEFT JOIN transactions t2 ON t2.parent_id = t.id
GROUP BY t.id;

ALTER VIEW transaction_views SET (security_invoker = true);
GRANT SELECT ON transaction_views TO authenticated;

CREATE OR REPLACE VIEW monthly_report AS
SELECT 
    EXTRACT(MONTH FROM transaction_date) AS month,
    EXTRACT(YEAR FROM transaction_date) AS year,
    (EXTRACT(YEAR FROM transaction_date) * 100) + EXTRACT(MONTH FROM transaction_date) as key,
    kind,
    SUM(amount) AS total_amount
FROM transactions
GROUP BY 
    EXTRACT(YEAR FROM transaction_date),
    EXTRACT(MONTH FROM transaction_date),
    kind;

ALTER VIEW monthly_report SET (security_invoker = true);
GRANT SELECT ON monthly_report TO authenticated;

CREATE OR REPLACE VIEW daily_report AS
SELECT 
    EXTRACT(DAY FROM transaction_date) AS day,
    EXTRACT(MONTH FROM transaction_date) AS month,
    EXTRACT(YEAR FROM transaction_date) AS year,
    (EXTRACT(YEAR FROM transaction_date) * 10000) + (EXTRACT(MONTH FROM transaction_date) * 100) + EXTRACT(DAY FROM transaction_date) as key,
    kind,
    SUM(amount) AS total_amount
FROM transactions
GROUP BY 
    EXTRACT(DAY FROM transaction_date),
    EXTRACT(YEAR FROM transaction_date),
    EXTRACT(MONTH FROM transaction_date),
    kind;

ALTER VIEW daily_report SET (security_invoker = true);
GRANT SELECT ON daily_report TO authenticated;

-- ======================================
-- HELPER FUNCTION: CHECK & UPDATE PARENT
-- ======================================
CREATE OR REPLACE FUNCTION check_and_update_parent(p_parent_id BIGINT)
RETURNS VOID AS $$
DECLARE
    v_parent_amount NUMERIC;
    v_sum_child NUMERIC;
BEGIN
    IF p_parent_id IS NULL THEN
        RETURN;
    END IF;

    SELECT amount INTO v_parent_amount
    FROM transactions
    WHERE id = p_parent_id;

    SELECT COALESCE(SUM(amount), 0) INTO v_sum_child
    FROM transactions
    WHERE parent_id = p_parent_id;

    IF v_sum_child = v_parent_amount THEN
        UPDATE transactions
        SET status = 'paid'
        WHERE id = p_parent_id;
    END IF;
END;
$$ LANGUAGE plpgsql;


-- =========================
-- FUNCTION: AFTER INSERT
-- =========================
CREATE OR REPLACE FUNCTION trg_transactions_after_insert_fn()
RETURNS TRIGGER AS $$
DECLARE
    v_amount NUMERIC;
BEGIN
    IF NEW.kind = 'income' THEN
        v_amount := NEW.amount;
    ELSE
        v_amount := -NEW.amount;
    END IF;

    UPDATE savings
    SET amount = amount + v_amount
    WHERE id = NEW.saving_id;

    PERFORM check_and_update_parent(NEW.parent_id);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_transactions_after_insert
AFTER INSERT ON transactions
FOR EACH ROW
EXECUTE FUNCTION trg_transactions_after_insert_fn();


-- =========================
-- FUNCTION: AFTER UPDATE
-- =========================
CREATE OR REPLACE FUNCTION trg_transactions_after_update_fn()
RETURNS TRIGGER AS $$
DECLARE
    v_old_amount NUMERIC;
    v_new_amount NUMERIC;
BEGIN
    -- convert OLD
    IF OLD.kind = 'income' THEN
        v_old_amount := OLD.amount;
    ELSE
        v_old_amount := -OLD.amount;
    END IF;

    -- convert NEW
    IF NEW.kind = 'income' THEN
        v_new_amount := NEW.amount;
    ELSE
        v_new_amount := -NEW.amount;
    END IF;

    -- savings update
    IF NEW.saving_id = OLD.saving_id THEN
        UPDATE savings
        SET amount = amount + (v_new_amount - v_old_amount)
        WHERE id = NEW.saving_id;
    ELSE
        UPDATE savings
        SET amount = amount - v_old_amount
        WHERE id = OLD.saving_id;

        UPDATE savings
        SET amount = amount + v_new_amount
        WHERE id = NEW.saving_id;
    END IF;

    PERFORM check_and_update_parent(NEW.parent_id);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE  TRIGGER trg_transactions_after_update
AFTER UPDATE ON transactions
FOR EACH ROW
EXECUTE FUNCTION trg_transactions_after_update_fn();


-- =========================
-- FUNCTION: AFTER DELETE
-- =========================
CREATE OR REPLACE FUNCTION trg_transactions_after_delete_fn()
RETURNS TRIGGER AS $$
DECLARE
    v_amount NUMERIC;
BEGIN
    IF OLD.kind = 'income' THEN
        v_amount := OLD.amount;
    ELSE
        v_amount := -OLD.amount;
    END IF;

    UPDATE savings
    SET amount = amount - v_amount
    WHERE id = OLD.saving_id;

    PERFORM check_and_update_parent(OLD.parent_id);

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_transactions_after_delete
AFTER DELETE ON transactions
FOR EACH ROW
EXECUTE FUNCTION trg_transactions_after_delete_fn();

CREATE OR REPLACE VIEW monthly_debt AS
SELECT 
    EXTRACT(MONTH FROM transaction_date) AS month,
    EXTRACT(YEAR FROM transaction_date) AS year,
    (EXTRACT(YEAR FROM transaction_date) * 100) + EXTRACT(MONTH FROM transaction_date) as key,
    kind,
    SUM(amount) AS total_amount
FROM transactions
WHERE is_debt=true
GROUP BY 
    EXTRACT(YEAR FROM transaction_date),
    EXTRACT(MONTH FROM transaction_date),
    kind;

ALTER VIEW monthly_debt SET (security_invoker = true);
GRANT SELECT ON monthly_debt TO authenticated;

CREATE OR REPLACE VIEW debt_views AS
SELECT 
    t.kind,
    SUM(t.amount) - COALESCE(SUM(t2.amount), 0) AS unpaid
FROM transactions t
LEFT JOIN transactions t2 ON t2.parent_id = t.id
WHERE t.is_debt = true
GROUP BY 
    t.kind;

ALTER VIEW debt_views SET (security_invoker = true);
GRANT SELECT ON debt_views TO authenticated;

CREATE TABLE instalments (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    startmonth INT NOT NULL,
    startyear INT NOT NULL,
    totalmonth INT NOT NULL,
    monthlypaid NUMERIC(15, 2) NOT NULL,
    paid BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE instalment_items (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    instalment_id BIGINT NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    "month" INT NOT NULL,
    "year" INT NOT NULL,
    paid BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_instalment_items
        FOREIGN KEY (instalment_id)
        REFERENCES instalments(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

alter table instalments enable row level security;
create policy "instalments policy" on instalments for all to authenticated using ( true );

alter table instalment_items enable row level security;
create policy "instalment_items policy" on instalment_items for all to authenticated using ( true );

CREATE OR REPLACE VIEW instalment_views AS
SELECT 
    i.month,
    i.year,
    i.paid,
    SUM(i.amount)
FROM instalment_items i
GROUP BY i.month, i.year, i.paid;

ALTER VIEW instalment_views SET (security_invoker = true);
GRANT SELECT ON instalment_views TO authenticated;

CREATE OR REPLACE FUNCTION trg_instalments_after_insert()
RETURNS TRIGGER AS $$
DECLARE
    i INT;
    calc_month INT;
    calc_year INT;
BEGIN
    FOR i IN 0..(NEW.totalMonth - 1) LOOP
        calc_month := ((NEW.startMonth - 1 + i) % 12) + 1;
        calc_year := NEW.startYear + ((NEW.startMonth - 1 + i) / 12);

        INSERT INTO instalment_items (
            instalment_id,
            amount,
            "month",
            "year"
        ) VALUES (
            NEW.id,
            NEW.monthlypaid, -- default amount, adjust if needed
            calc_month,
            calc_year
        );
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION trg_instalments_after_delete()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM instalment_items
    WHERE instalment_id = OLD.id;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- AFTER INSERT
CREATE TRIGGER trg_instalments_ai
AFTER INSERT ON instalments
FOR EACH ROW
EXECUTE FUNCTION trg_instalments_after_insert();

-- AFTER DELETE
CREATE TRIGGER trg_instalments_ad
AFTER DELETE ON instalments
FOR EACH ROW
EXECUTE FUNCTION trg_instalments_after_delete();

CREATE OR REPLACE FUNCTION trg_instalments_items_after_updated()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE instalments
    SET paid = true
    WHERE id NOT IN (SELECT instalment_id FROM instalment_items WHERE paid = false);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_instalments_items_update
AFTER UPDATE ON instalment_items
FOR EACH ROW
EXECUTE FUNCTION trg_instalments_items_after_updated();

CREATE TABLE settings (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    salary NUMERIC(15, 2) NOT NULL DEFAULT 0,
    payday INT NOT NULL DEFAULT 0,
    show_digit BOOLEAN NOT NULL DEFAULT false,
    theme VARCHAR(10) NOT NULL DEFAULT 'dark',
    auto_add_salary BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

alter table settings enable row level security;
create policy "settings policy" on settings for all to authenticated using ( true );

INSERT INTO settings (salary, payday, show_digit, theme, auto_add_salary) VALUES (0, 0, false, 'dark', false);