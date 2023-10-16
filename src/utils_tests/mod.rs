use std::time::Duration;

use crate::{
    config::config,
    error::Result,
    galadriel::{galadriel_client::GaladrielClient, galadriel_server::GaladrielServer},
    model::ModelManager,
    server::{middleware::check_auth, ServiceGaladriel},
};
use tonic::{
    metadata::MetadataValue,
    service::interceptor::InterceptedService,
    transport::{Channel, Server},
    Request, Status,
};

const TABLE_NAME_BOOKS: &str = "books";

pub async fn clean_all_dbs(model_manager: ModelManager) -> Result<()> {
    // clean books table
    let query = format!("delete from {}", TABLE_NAME_BOOKS);
    sqlx::query(&query).execute(model_manager.db()).await?;

    Ok(())
}

pub async fn setup_test_environment() -> Result<(
    ModelManager,
    GaladrielClient<
        InterceptedService<
            tonic::transport::Channel,
            impl Fn(Request<()>) -> core::result::Result<Request<()>, Status>,
        >,
    >,
)> {
    // Initialize env variables
    dotenvy::from_filename_override(".env.test").expect("Failed to load .env.test file");

    let addr = "0.0.0.0:50051".to_string();
    let client_addr = "http://0.0.0.0:50051";

    // Run the server in the background
    let model_manager = start_background_grpc_server(addr).await?;

    // get the grpc client
    let client = get_grpc_client(client_addr).await?;

    Ok((model_manager, client))
}

async fn start_background_grpc_server(addr: String) -> Result<ModelManager> {
    // Initialize ModelManager
    let model_manager = ModelManager::new().await?;

    let addr = addr.parse()?;
    let galadriel = ServiceGaladriel::new(model_manager.clone());

    tokio::spawn(async move {
        let server = Server::builder()
            .add_service(GaladrielServer::with_interceptor(galadriel, check_auth))
            .serve(addr)
            .await;
        if let Err(e) = server {
            e.to_string();
        }
    });

    // Wait for the server to be ready (optional)
    tokio::time::sleep(Duration::from_secs(2)).await;

    Ok(model_manager)
}

async fn get_grpc_client(
    client_addr: &'static str,
) -> Result<
    GaladrielClient<
        InterceptedService<
            tonic::transport::Channel,
            impl Fn(Request<()>) -> core::result::Result<Request<()>, Status>,
        >,
    >,
> {
    // connect to the server and run the test
    let channel = Channel::from_static(client_addr).connect().await?;

    let grpc_auth_key = config().GRPC_AUTH_KEY.as_str();
    let grpc_auth_value: MetadataValue<_> = config().GRPC_AUTH_VALUE.as_str().parse().unwrap();

    let client = GaladrielClient::with_interceptor(channel, move |mut req: Request<()>| {
        req.metadata_mut()
            .insert(grpc_auth_key, grpc_auth_value.clone());
        Ok(req)
    });

    Ok(client)
}
