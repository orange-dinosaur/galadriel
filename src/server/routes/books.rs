use tonic::{Response, Status};
use tracing::debug;
use uuid::Uuid;

use crate::{
    galadriel::{CreateBookRequest, CreateBookResponse, DeleteBookRequest, DeleteBookResponse},
    model::{
        book::{model_controller::BookBmc, BookForCreate},
        ModelManager,
    },
};

pub async fn create_book(
    create_book_request: CreateBookRequest,
    model_maanger: ModelManager,
) -> Result<Response<CreateBookResponse>, Status> {
    debug!("FN: login - Service create a book");

    // check that the fields are not empty
    if create_book_request.title.is_empty() || create_book_request.authors.is_empty() {
        return Err(Status::invalid_argument("one ore more fields are empty"));
    }

    let book_fc = BookForCreate::from(create_book_request);

    // create book in the db
    let db_res = BookBmc::create(&model_maanger, book_fc).await;
    match db_res {
        Ok(id) => {
            debug!("Book created with id: {}", id);
        }
        Err(e) => {
            return Err(Status::internal(e.to_string()));
        }
    }

    let res = CreateBookResponse { success: true };
    Ok(Response::new(res))
}

// TODO: only admins should be able to delete a book
pub async fn delete_book(
    delete_book_request: DeleteBookRequest,
    model_maanger: ModelManager,
) -> Result<Response<DeleteBookResponse>, Status> {
    debug!("FN: logout - Service to delete a book");

    let book_uuid = Uuid::parse_str(delete_book_request.book_id.as_str())
        .map_err(|e| Status::invalid_argument(e.to_string()))?;

    BookBmc::delete(&model_maanger, book_uuid)
        .await
        .map_err(|e| Status::internal(e.to_string()))?;

    let res = DeleteBookResponse { success: true };
    Ok(Response::new(res))
}
