pub mod config;
pub mod error;
pub mod galadriel;
pub mod model;
pub mod server;
pub mod tracing;
pub mod utils;
pub mod utils_tests;

use model::ModelManager;

use crate::error::Result;

mod galadriel_proto {
    #![allow(non_snake_case)]
    include!("galadriel.rs");

    pub(crate) const FILE_DESCRIPTOR_SET: &[u8] =
        tonic::include_file_descriptor_set!("galadriel_descriptor");
}

pub async fn run() -> Result<()> {
    println!(
        "
 ██████╗  █████╗ ██╗      █████╗ ██████╗ ██████╗ ██╗███████╗██╗     
██╔════╝ ██╔══██╗██║     ██╔══██╗██╔══██╗██╔══██╗██║██╔════╝██║     
██║  ███╗███████║██║     ███████║██║  ██║██████╔╝██║█████╗  ██║     
██║   ██║██╔══██║██║     ██╔══██║██║  ██║██╔══██╗██║██╔══╝  ██║     
╚██████╔╝██║  ██║███████╗██║  ██║██████╔╝██║  ██║██║███████╗███████╗
 ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝╚══════╝╚══════╝
        "
    );

    // Initialize tracing
    tracing::initialize();

    // Initialize ModelManager
    let model_manager = ModelManager::new().await?;

    // start gRPC server
    server::start(model_manager).await?;

    Ok(())
}
