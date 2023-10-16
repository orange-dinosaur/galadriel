use std::vec;

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

use crate::{
    error::{Error, Result},
    galadriel::CreateBookRequest,
};

use super::iterable::{Iterable, IterableType};

pub mod model_controller;

// region: Book

#[derive(Clone, Debug, FromRow, Serialize)]
pub struct Book {
    pub id: Uuid,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub edition_id: Option<Uuid>,
    pub external_id: Option<String>,
    pub external_source: Option<String>,
    pub title: String,
    pub authors: Vec<String>,
    pub publisher: Option<String>,
    pub published_date: Option<DateTime<Utc>>,
    pub published_year: Option<i32>,
    pub description: Option<String>,
    pub isbn10: Option<String>,
    pub isbn13: Option<String>,
    pub page_count: Option<i32>,
    pub print_type: Option<String>,
    pub categories: Option<Vec<String>>,
    pub maturity_rating: Option<String>,
    pub language: Option<String>,
    pub image_url: Option<String>,
    pub image_url_small: Option<String>,
    pub preview_link: Option<String>,
}

impl Default for Book {
    fn default() -> Self {
        Self {
            id: Uuid::new_v4(),
            created_at: chrono::Utc::now(),
            updated_at: chrono::Utc::now(),
            edition_id: None,
            external_id: None,
            external_source: None,
            title: "".to_string(),
            authors: Vec::new(),
            publisher: None,
            published_date: None,
            published_year: None,
            description: None,
            isbn10: None,
            isbn13: None,
            page_count: None,
            print_type: None,
            categories: None,
            maturity_rating: None,
            language: None,
            image_url: None,
            image_url_small: None,
            preview_link: None,
        }
    }
}

impl Book {
    pub fn new(b_fc: BookForCreate) -> Result<Book> {
        let mut book = Book::default();

        // check that title and authors are set
        if b_fc.title.is_empty() {
            return Err(Error::BookTitleNotSet);
        } else {
            book.title = b_fc.title;
        };
        if b_fc.authors.is_empty() {
            return Err(Error::BookAuthorsNotSet);
        } else {
            book.authors = b_fc.authors;
        };

        // check if the other fields are set
        if b_fc.edition_id.is_some() {
            book.edition_id = b_fc.edition_id;
        }
        if b_fc.external_id.is_some() {
            book.external_id = b_fc.external_id;
        }
        if b_fc.external_source.is_some() {
            book.external_source = b_fc.external_source;
        }
        if b_fc.publisher.is_some() {
            book.publisher = b_fc.publisher;
        }
        if b_fc.published_date.is_some() {
            book.published_date = b_fc.published_date;
        }
        if b_fc.published_year.is_some() {
            book.published_year = b_fc.published_year;
        }
        if b_fc.description.is_some() {
            book.description = b_fc.description;
        }
        if b_fc.isbn10.is_some() {
            book.isbn10 = b_fc.isbn10;
        }
        if b_fc.isbn13.is_some() {
            book.isbn13 = b_fc.isbn13;
        }
        if b_fc.page_count.is_some() {
            book.page_count = b_fc.page_count;
        }
        if b_fc.print_type.is_some() {
            book.print_type = b_fc.print_type;
        }
        if b_fc.categories.is_some() {
            book.categories = b_fc.categories;
        }
        if b_fc.maturity_rating.is_some() {
            book.maturity_rating = b_fc.maturity_rating;
        }
        if b_fc.language.is_some() {
            book.language = b_fc.language;
        }
        if b_fc.image_url.is_some() {
            book.image_url = b_fc.image_url;
        }
        if b_fc.image_url_small.is_some() {
            book.image_url_small = b_fc.image_url_small;
        }
        if b_fc.preview_link.is_some() {
            book.preview_link = b_fc.preview_link;
        }

        Ok(book)
    }
}

impl Iterable for Book {
    fn get_fields(&self) -> (Vec<String>, Vec<IterableType>) {
        let fields_names = vec![
            "id".to_string(),
            "created_at".to_string(),
            "updated_at".to_string(),
            "edition_id".to_string(),
            "external_id".to_string(),
            "external_source".to_string(),
            "title".to_string(),
            "authors".to_string(),
            "publisher".to_string(),
            "published_date".to_string(),
            "published_year".to_string(),
            "description".to_string(),
            "isbn10".to_string(),
            "isbn13".to_string(),
            "page_count".to_string(),
            "print_type".to_string(),
            "categories".to_string(),
            "maturity_rating".to_string(),
            "language".to_string(),
            "image_url".to_string(),
            "image_url_small".to_string(),
            "preview_link".to_string(),
        ];
        let fields_values = vec![
            IterableType::Uuid(self.id),
            IterableType::DateTime(self.created_at),
            IterableType::DateTime(self.updated_at),
            IterableType::Uuid(self.edition_id.unwrap_or_default()),
            IterableType::String(self.external_id.clone().unwrap_or_default()),
            IterableType::String(self.external_source.clone().unwrap_or_default()),
            IterableType::String(self.title.clone()),
            IterableType::StringArray(self.authors.clone()),
            IterableType::String(self.publisher.clone().unwrap_or_default()),
            IterableType::DateTime(self.published_date.unwrap_or_default()),
            IterableType::I32(self.published_year.unwrap_or_default()),
            IterableType::String(self.description.clone().unwrap_or_default()),
            IterableType::String(self.isbn10.clone().unwrap_or_default()),
            IterableType::String(self.isbn13.clone().unwrap_or_default()),
            IterableType::I32(self.page_count.unwrap_or_default()),
            IterableType::String(self.print_type.clone().unwrap_or_default()),
            IterableType::StringArray(self.categories.clone().unwrap_or_default()),
            IterableType::String(self.maturity_rating.clone().unwrap_or_default()),
            IterableType::String(self.language.clone().unwrap_or_default()),
            IterableType::String(self.image_url.clone().unwrap_or_default()),
            IterableType::String(self.image_url_small.clone().unwrap_or_default()),
            IterableType::String(self.preview_link.clone().unwrap_or_default()),
        ];

        (fields_names, fields_values)
    }
}

// endregion: Book

// region: BookForCreate

#[derive(Deserialize)]
pub struct BookForCreate {
    pub edition_id: Option<Uuid>,
    pub external_id: Option<String>,
    pub external_source: Option<String>,
    pub title: String,
    pub authors: Vec<String>,
    pub publisher: Option<String>,
    pub published_date: Option<DateTime<Utc>>,
    pub published_year: Option<i32>,
    pub description: Option<String>,
    pub isbn10: Option<String>,
    pub isbn13: Option<String>,
    pub page_count: Option<i32>,
    pub print_type: Option<String>,
    pub categories: Option<Vec<String>>,
    pub maturity_rating: Option<String>,
    pub language: Option<String>,
    pub image_url: Option<String>,
    pub image_url_small: Option<String>,
    pub preview_link: Option<String>,
}

impl Default for BookForCreate {
    fn default() -> Self {
        Self {
            edition_id: None,
            external_id: None,
            external_source: None,
            title: "".to_string(),
            authors: Vec::new(),
            publisher: None,
            published_date: None,
            published_year: None,
            description: None,
            isbn10: None,
            isbn13: None,
            page_count: None,
            print_type: None,
            categories: None,
            maturity_rating: None,
            language: None,
            image_url: None,
            image_url_small: None,
            preview_link: None,
        }
    }
}

impl BookForCreate {
    pub fn new() -> Self {
        Self {
            ..Default::default()
        }
    }
}

impl From<CreateBookRequest> for BookForCreate {
    fn from(cbr: CreateBookRequest) -> BookForCreate {
        let mut book_fc = BookForCreate::default();

        if cbr.edition_id.is_some() {
            book_fc.edition_id = Some(Uuid::parse_str(cbr.edition_id.unwrap().as_str()).unwrap());
        }
        if cbr.external_id.is_some() {
            book_fc.external_id = cbr.external_id;
        }
        if cbr.external_source.is_some() {
            book_fc.external_source = cbr.external_source;
        }
        if !cbr.title.is_empty() {
            book_fc.title = cbr.title;
        }
        if !cbr.authors.is_empty() {
            book_fc.authors = cbr.authors;
        }
        if cbr.publisher.is_some() {
            book_fc.publisher = cbr.publisher;
        }
        if cbr.published_date.is_some() {
            let pub_date = cbr.published_date.clone().unwrap();
            book_fc.published_date = Some(
                DateTime::parse_from_str(&pub_date, "%Y-%m-%d %H:%M:%S")
                    .unwrap()
                    .with_timezone(&Utc),
            );
        }
        if cbr.published_year.is_some() {
            book_fc.published_year = cbr.published_year;
        }
        if cbr.description.is_some() {
            book_fc.description = cbr.description;
        }
        if cbr.isbn10.is_some() {
            book_fc.isbn10 = cbr.isbn10;
        }
        if cbr.isbn13.is_some() {
            book_fc.isbn13 = cbr.isbn13;
        }
        if cbr.page_count.is_some() {
            book_fc.page_count = cbr.page_count;
        }
        if cbr.print_type.is_some() {
            book_fc.print_type = cbr.print_type;
        }
        if !cbr.categories.is_empty() {
            book_fc.categories = Some(cbr.categories);
        }
        if cbr.maturity_rating.is_some() {
            book_fc.maturity_rating = cbr.maturity_rating;
        }
        if cbr.language.is_some() {
            book_fc.language = cbr.language;
        }
        if cbr.image_url.is_some() {
            book_fc.image_url = cbr.image_url;
        }
        if cbr.image_url_small.is_some() {
            book_fc.image_url_small = cbr.image_url_small;
        }
        if cbr.preview_link.is_some() {
            book_fc.preview_link = cbr.preview_link;
        }

        book_fc
    }
}

impl From<BookForCreate> for CreateBookRequest {
    fn from(b_fc: BookForCreate) -> CreateBookRequest {
        let mut cbr = CreateBookRequest::default();

        if b_fc.edition_id.is_some() {
            cbr.edition_id = Some(b_fc.edition_id.unwrap().to_string());
        }
        if b_fc.external_id.is_some() {
            cbr.external_id = b_fc.external_id;
        }
        if b_fc.external_source.is_some() {
            cbr.external_source = b_fc.external_source;
        }
        if !b_fc.title.is_empty() {
            cbr.title = b_fc.title;
        }
        if !b_fc.authors.is_empty() {
            cbr.authors = b_fc.authors;
        }
        if b_fc.publisher.is_some() {
            cbr.publisher = b_fc.publisher;
        }
        if b_fc.published_date.is_some() {
            let pub_date = b_fc.published_date.unwrap();
            cbr.published_date = Some(pub_date.to_string());
        }
        if b_fc.published_year.is_some() {
            cbr.published_year = b_fc.published_year;
        }
        if b_fc.description.is_some() {
            cbr.description = b_fc.description;
        }
        if b_fc.isbn10.is_some() {
            cbr.isbn10 = b_fc.isbn10;
        }
        if b_fc.isbn13.is_some() {
            cbr.isbn13 = b_fc.isbn13;
        }
        if b_fc.page_count.is_some() {
            cbr.page_count = b_fc.page_count;
        }
        if b_fc.print_type.is_some() {
            cbr.print_type = b_fc.print_type;
        }
        if b_fc.categories.is_some() {
            cbr.categories = b_fc.categories.unwrap();
        }
        if b_fc.maturity_rating.is_some() {
            cbr.maturity_rating = b_fc.maturity_rating;
        }
        if b_fc.language.is_some() {
            cbr.language = b_fc.language;
        }
        if b_fc.image_url.is_some() {
            cbr.image_url = b_fc.image_url;
        }
        if b_fc.image_url_small.is_some() {
            cbr.image_url_small = b_fc.image_url_small;
        }
        if b_fc.preview_link.is_some() {
            cbr.preview_link = b_fc.preview_link;
        }

        cbr
    }
}

// endregion: BookForCreate

// region: BookForUpdate

#[derive(Deserialize)]
pub struct BookForUpdate {
    pub updated_at: DateTime<Utc>,
    pub edition_id: Option<Uuid>,
    pub external_id: Option<String>,
    pub external_source: Option<String>,
    pub title: Option<String>,
    pub authors: Option<Vec<String>>,
    pub publisher: Option<String>,
    pub published_date: Option<DateTime<Utc>>,
    pub published_year: Option<i32>,
    pub description: Option<String>,
    pub isbn10: Option<String>,
    pub isbn13: Option<String>,
    pub page_count: Option<i32>,
    pub print_type: Option<String>,
    pub categories: Option<Vec<String>>,
    pub maturity_rating: Option<String>,
    pub language: Option<String>,
    pub image_url: Option<String>,
    pub image_url_small: Option<String>,
    pub preview_link: Option<String>,
}

impl Default for BookForUpdate {
    fn default() -> Self {
        Self {
            updated_at: chrono::Utc::now(),
            edition_id: None,
            external_id: None,
            external_source: None,
            title: None,
            authors: None,
            publisher: None,
            published_date: None,
            published_year: None,
            description: None,
            isbn10: None,
            isbn13: None,
            page_count: None,
            print_type: None,
            categories: None,
            maturity_rating: None,
            language: None,
            image_url: None,
            image_url_small: None,
            preview_link: None,
        }
    }
}

impl BookForUpdate {
    pub fn new() -> Self {
        Self {
            ..Default::default()
        }
    }
}

impl Iterable for BookForUpdate {
    fn get_fields(&self) -> (Vec<String>, Vec<IterableType>) {
        let mut fields_names = Vec::new();
        let mut fields_values = Vec::new();

        fields_names.push("updated_at".to_string());
        fields_values.push(IterableType::DateTime(self.updated_at));

        if self.edition_id.is_some() {
            fields_names.push("edition_id".to_string());
            fields_values.push(IterableType::Uuid(self.edition_id.unwrap()));
        }
        if self.external_id.is_some() {
            fields_names.push("external_id".to_string());
            fields_values.push(IterableType::String(self.external_id.clone().unwrap()));
        }
        if self.external_source.is_some() {
            fields_names.push("external_source".to_string());
            fields_values.push(IterableType::String(self.external_source.clone().unwrap()));
        }
        if self.title.is_some() {
            fields_names.push("title".to_string());
            fields_values.push(IterableType::String(self.title.clone().unwrap()));
        }
        if self.authors.is_some() {
            fields_names.push("authors".to_string());
            fields_values.push(IterableType::StringArray(self.authors.clone().unwrap()));
        }
        if self.publisher.is_some() {
            fields_names.push("publisher".to_string());
            fields_values.push(IterableType::String(self.publisher.clone().unwrap()));
        }
        if self.published_date.is_some() {
            fields_names.push("published_date".to_string());
            fields_values.push(IterableType::DateTime(self.published_date.unwrap()));
        }
        if self.published_year.is_some() {
            fields_names.push("published_year".to_string());
            fields_values.push(IterableType::I32(self.published_year.unwrap()));
        }
        if self.description.is_some() {
            fields_names.push("description".to_string());
            fields_values.push(IterableType::String(self.description.clone().unwrap()));
        }
        if self.isbn10.is_some() {
            fields_names.push("isbn10".to_string());
            fields_values.push(IterableType::String(self.isbn10.clone().unwrap()));
        }
        if self.isbn13.is_some() {
            fields_names.push("isbn13".to_string());
            fields_values.push(IterableType::String(self.isbn13.clone().unwrap()));
        }
        if self.page_count.is_some() {
            fields_names.push("page_count".to_string());
            fields_values.push(IterableType::I32(self.page_count.unwrap()));
        }
        if self.print_type.is_some() {
            fields_names.push("print_type".to_string());
            fields_values.push(IterableType::String(self.print_type.clone().unwrap()));
        }
        if self.categories.is_some() {
            fields_names.push("categories".to_string());
            fields_values.push(IterableType::StringArray(self.categories.clone().unwrap()));
        }
        if self.maturity_rating.is_some() {
            fields_names.push("maturity_rating".to_string());
            fields_values.push(IterableType::String(self.maturity_rating.clone().unwrap()));
        }
        if self.language.is_some() {
            fields_names.push("language".to_string());
            fields_values.push(IterableType::String(self.language.clone().unwrap()));
        }
        if self.image_url.is_some() {
            fields_names.push("image_url".to_string());
            fields_values.push(IterableType::String(self.image_url.clone().unwrap()));
        }
        if self.image_url_small.is_some() {
            fields_names.push("image_url_small".to_string());
            fields_values.push(IterableType::String(self.image_url_small.clone().unwrap()));
        }
        if self.preview_link.is_some() {
            fields_names.push("preview_link".to_string());
            fields_values.push(IterableType::String(self.preview_link.clone().unwrap()));
        }

        (fields_names, fields_values)
    }
}

// endregion: BookForUpdate
