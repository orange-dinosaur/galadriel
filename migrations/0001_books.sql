create table books (
    id uuid PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    edition_id uuid NOT NULL,
    external_id varchar(255),
    external_source varchar(255),
    title varchar(255) NOT NULL,
    authors varchar(255)[] NOT NULL,
    publisher varchar(255),
    published_date TIMESTAMPTZ,
    published_year int,
    description varchar(255),
    isbn10 varchar(255),
    isbn13 varchar(255),
    page_count int,
    print_type varchar(255),
    categories varchar(255)[],
    maturity_rating varchar(255),
    language varchar(255),
    image_url varchar(255),
    image_url_small varchar(255),
    preview_link varchar(255)
);

create index book_edition_id_idx on books(edition_id);
create index book_title_idx on books(title);
create index book_publisher_idx on books(publisher);
create index book_authors_idx_gin on books using GIN (authors);
create index book_categories_idx_gin on books using GIN (categories);