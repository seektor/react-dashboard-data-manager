CREATE TYPE sales_channel_type AS ENUM ('Online', 'Offline');

CREATE TYPE order_priority_type AS ENUM('L', 'C', 'H', 'M');

DROP TABLE IF EXISTS sales;

CREATE TABLE sales
(
    id SERIAL PRIMARY KEY NOT NULL,
    region_id INTEGER REFERENCES regions (id) NOT NULL,
    country_id INTEGER REFERENCES countries (id) NOT NULL,
    item_type VARCHAR(100) NOT NULL,
    sales_channel sales_channel_type NOT NULL,
    order_priority order_priority_type NOT NULL,
    order_date DATE NOT NULL DEFAULT CURRENT_DATE,
    ship_date DATE NOT NULL DEFAULT CURRENT_DATE,
    units_sold INTEGER,
    unit_price NUMERIC(12,2),
    unit_cost NUMERIC(12,2),
    total_revenue NUMERIC(12,2),
    total_cost NUMERIC(12,2),
    total_profit NUMERIC(12,2)
)