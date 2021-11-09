use worker::{Request, Response, Result, RouteContext};

/// Handle creating and updating link references
pub async fn modify(req: Request, ctx: RouteContext<()>) -> Result<Response> {
    Response::ok("UI API modify")
}

/// Handle deleting link references
pub async fn delete(req: Request, ctx: RouteContext<()>) -> Result<Response> {
    Response::ok("UI API delete")
}
