





-- Table: public.sales

-- DROP TABLE public.sales;

CREATE TABLE public.sales
(
    id integer NOT NULL DEFAULT nextval('sales_id_seq'::regclass),
    region character varying(50) COLLATE pg_catalog."default" NOT NULL,
    country character varying(50) COLLATE pg_catalog."default" NOT NULL,
    item_type character varying(100) COLLATE pg_catalog."default" NOT NULL,
    sales_channel sales_channel NOT NULL,
    order_priority order_priority NOT NULL,
    order_date date NOT NULL DEFAULT CURRENT_DATE,
    order_id integer,
    ship_date date NOT NULL DEFAULT CURRENT_DATE,
    units_sold integer,
    unit_price numeric(12,2),
    unit_cose numeric(12,2),
    total_revenue numeric(12,2),
    total_cost numeric(12,2),
    total_profit numeric(12,2),
    CONSTRAINT sales_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.sales
    OWNER to postgres;