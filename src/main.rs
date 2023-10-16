use galadriel::error::Result;
use galadriel::run;

#[tokio::main]
async fn main() -> Result<()> {
    run().await
}
