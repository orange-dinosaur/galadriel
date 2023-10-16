use galadriel::{
    error::{Error, Result},
    galadriel::DeleteBookRequest,
    model::{
        book::{Book, BookForCreate},
        db,
    },
    utils_tests,
};
use sqlx::FromRow;

/// Test that the delete_book grpc method works
/// Steps:
/// 1. Setup test environment (Env variables, run server in the backgroung, get client)
/// 2. Clean all databases
/// 3. Create a book in the database
/// 4. Call the delete_book grpc method
/// 5. Check that the book has been deleted
/// 6. Clean all databases
#[allow(clippy::field_reassign_with_default)]
#[tokio::test]
async fn delete_book_works() -> Result<()> {
    // setup test environment
    let (model_manager, mut client) = utils_tests::setup_test_environment().await?;

    // clean all databases before running the test
    utils_tests::clean_all_dbs(model_manager.clone()).await?;

    // create the book in the database
    let title = "Novecento".to_string();
    let authors = vec!["Baricco Alessandro".to_string()];
    let mut book_fc = BookForCreate::default();
    book_fc.title = title.clone();
    book_fc.authors = authors.clone();

    let book = Book::new(book_fc)?;
    let res = db::crud::create(model_manager.db().clone(), "books", book.clone()).await?;
    // newly created book
    let book_db = Book::from_row(&res)?;

    // region: call grpc method

    let request = tonic::Request::new(DeleteBookRequest {
        book_id: book_db.id.to_string().clone(),
    });

    client
        .delete_book(request)
        .await
        .map_err(|s| Error::Test(s.to_string()))?
        .into_inner();

    // endregion: call grpc method

    // region: tests

    // check that the book has been deleted
    let book_still_exists =
        db::crud::get_one_by_id(model_manager.db().clone(), "books", book_db.id)
            .await
            .is_ok();
    assert!(!book_still_exists);

    // endregion: tests

    // clean al databases after running the test
    utils_tests::clean_all_dbs(model_manager.clone()).await?;

    Ok(())
}
