use worker::{Request, Response, Result, RouteContext};

pub mod api;
mod templates;

/// Display a list of all links by name
pub async fn index(req: Request, ctx: RouteContext<()>) -> Result<Response> {
    Response::ok("UI index")
}

/// Display the details of a given link
pub async fn details(req: Request, ctx: RouteContext<()>) -> Result<Response> {
    Response::ok("UI details")
}
