use sqlx::FromRow;
use uuid::Uuid;

use crate::model::ModelManager;
use crate::{error::Result, model::db};

use super::{Book, BookForCreate, BookForUpdate};

const TABLE_NAME: &str = "books";

pub struct BookBmc;

impl BookBmc {
    // region: Db CRUD operations

    pub async fn create(model_manager: &ModelManager, b_fc: BookForCreate) -> Result<Uuid> {
        let book = Book::new(b_fc)?;

        let res = db::crud::create(model_manager.db().clone(), TABLE_NAME, book).await?;

        let book_created = Book::from_row(&res)?;

        Ok(book_created.id)
    }

    pub async fn get(model_manager: &ModelManager, id: Uuid) -> Result<Book> {
        let res = db::crud::get_one_by_id(model_manager.db().clone(), TABLE_NAME, id).await?;

        let book = Book::from_row(&res)?;

        Ok(book)
    }

    pub async fn get_all(model_manager: &ModelManager) -> Result<Vec<Book>> {
        let res = db::crud::get_all(model_manager.db().clone(), TABLE_NAME).await?;

        let mut books = Vec::new();
        for book in res {
            let ua = Book::from_row(&book)?;
            books.push(ua);
        }

        Ok(books)
    }

    pub async fn update(model_manager: &ModelManager, b_fu: BookForUpdate, id: Uuid) -> Result<()> {
        db::crud::update_by_id(model_manager.db.clone(), TABLE_NAME, b_fu, id).await?;

        Ok(())
    }

    pub async fn delete(model_manager: &ModelManager, id: Uuid) -> Result<()> {
        db::crud::delete_by_id(model_manager.db.clone(), TABLE_NAME, id).await?;

        Ok(())
    }

    // endregion: Db CRUD operations
}
