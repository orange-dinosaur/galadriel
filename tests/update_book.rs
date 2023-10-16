use galadriel::{
    error::{Error, Result},
    galadriel::UpdateBookRequest,
    model::{
        book::{Book, BookForCreate, BookForUpdate},
        db,
    },
    utils_tests,
};
use sqlx::FromRow;

/// Test that the update_book grpc method works
/// Steps:
/// 1. Setup test environment (Env variables, run server in the backgroung, get client)
/// 2. Clean all databases
/// 3. Create a book in the database
/// 4. Call the update_book grpc method
/// 5. Check that the book has been updated
/// 6. Clean all databases
#[allow(clippy::field_reassign_with_default)]
#[tokio::test]
async fn update_book_works() -> Result<()> {
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

    // define fields to update
    let updated_title = "Novecento - Un monologo".to_string();
    let updated_publisher = "Feltrinelli".to_string();
    let updated_page_count = 100;
    let updated_language = "it".to_string();
    let mut book_fu = BookForUpdate::default();
    book_fu.title = Some(updated_title.clone());
    book_fu.publisher = Some(updated_publisher.clone());
    book_fu.page_count = Some(updated_page_count);
    book_fu.language = Some(updated_language.clone());

    let mut update_book_request = UpdateBookRequest::from(book_fu);
    update_book_request.book_id = book_db.id.to_string();
    let request = tonic::Request::new(update_book_request);

    client
        .update_book(request)
        .await
        .map_err(|s| Error::Test(s.to_string()))?
        .into_inner();

    // endregion: call grpc method

    // get the updated book from the database
    let res_upd = db::crud::get_one_by_id(model_manager.db().clone(), "books", book_db.id).await?;
    let user_auth_db_updated = Book::from_row(&res_upd)?;

    // region: tests

    // check that the book has been updated
    assert!(
        user_auth_db_updated.title == updated_title
            && user_auth_db_updated.publisher == Some(updated_publisher)
            && user_auth_db_updated.page_count == Some(updated_page_count)
            && user_auth_db_updated.language == Some(updated_language)
    );

    // endregion: tests

    // clean al databases after running the test
    utils_tests::clean_all_dbs(model_manager.clone()).await?;

    Ok(())
}
