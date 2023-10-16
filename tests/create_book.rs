use galadriel::{
    error::{Error, Result},
    galadriel::CreateBookRequest,
    model::book::{Book, BookForCreate},
    utils_tests,
};
use sqlx::FromRow;
use uuid::Uuid;

/// Test that the create_book grpc method works
/// Steps:
/// 1. Setup test environment (Env variables, run server in the backgroung, get client)
/// 2. Clean all databases
/// 3. Call the create_book grpc method
/// 4. Check that the book has been created
/// 5. Clean all databases
#[allow(clippy::field_reassign_with_default)]
#[tokio::test]
async fn create_book_works() -> Result<()> {
    // setup test environment
    let (model_manager, mut client) = utils_tests::setup_test_environment().await?;

    // clean all databases before running the test
    utils_tests::clean_all_dbs(model_manager.clone()).await?;

    let title = "Novecento".to_string();
    let authors = vec!["Baricco Alessandro".to_string()];
    let mut book_fc = BookForCreate::default();
    book_fc.title = title.clone();
    book_fc.authors = authors.clone();

    // region: call grpc method

    let create_book_request = CreateBookRequest::from(book_fc);
    let request = tonic::Request::new(create_book_request);

    client
        .create_book(request)
        .await
        .map_err(|s| Error::Test(s.to_string()))?;

    // endregion: call grpc method

    // get the book from the database
    // TODO: better get not by title but by id
    let row = sqlx::query("select * from books where title = $1")
        .bind(title.clone())
        .fetch_one(model_manager.db())
        .await?;

    let book = Book::from_row(&row)?;

    // region: tests

    assert!(book.id != Uuid::nil() && book.title == title && book.authors == authors);

    // endregion: tests

    // clean all databases after running the test
    utils_tests::clean_all_dbs(model_manager.clone()).await?;

    Ok(())
}
