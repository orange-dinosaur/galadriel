use std::time::Duration;

use tonic::{transport::Server, Request, Response, Status};
use tracing::{debug, info};

use crate::{
    error,
    galadriel::{
        galadriel_server::{Galadriel, GaladrielServer},
        CreateBookRequest, CreateBookResponse, DeleteBookRequest, DeleteBookResponse,
        HealthCheckRequest, HealthCheckResponse,
    },
    galadriel_proto,
    model::{self, ModelManager},
    server::middleware::check_auth,
};

pub mod middleware;
mod routes;

pub struct ServiceGaladriel {
    model_manager: model::ModelManager,
}

impl ServiceGaladriel {
    pub fn new(model_manager: model::ModelManager) -> Self {
        Self { model_manager }
    }
}

#[tonic::async_trait]
impl Galadriel for ServiceGaladriel {
    async fn health_check(
        &self,
        _: Request<HealthCheckRequest>,
    ) -> Result<Response<HealthCheckResponse>, Status> {
        debug!("FN: health_check - Service to check if server is up");

        let res = HealthCheckResponse { success: true };
        Ok(Response::new(res))
    }

    async fn create_book(
        &self,
        request: Request<CreateBookRequest>,
    ) -> Result<Response<CreateBookResponse>, Status> {
        routes::books::create_book(request.into_inner(), self.model_manager.clone()).await
    }

    async fn delete_book(
        &self,
        request: Request<DeleteBookRequest>,
    ) -> Result<Response<DeleteBookResponse>, Status> {
        routes::books::delete_book(request.into_inner(), self.model_manager.clone()).await
    }
}

pub async fn start(model_manager: ModelManager) -> error::Result<()> {
    let addr = "0.0.0.0:50051".parse()?;
    let galadriel = ServiceGaladriel::new(model_manager.clone());

    info!("Starting gRPC server");

    let reflection_service = tonic_reflection::server::Builder::configure()
        .register_encoded_file_descriptor_set(galadriel_proto::FILE_DESCRIPTOR_SET)
        .build()
        .unwrap();

    Server::builder()
        .add_service(GaladrielServer::with_interceptor(galadriel, check_auth))
        .add_service(reflection_service)
        .serve(addr)
        .await?;

    Ok(())
}

pub async fn start_background(model_manager: ModelManager) -> error::Result<()> {
    let addr = "0.0.0.0:50051".parse()?;
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

    Ok(())
}
