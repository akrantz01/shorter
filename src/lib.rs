use worker::*;

mod link;
mod ui;
mod utils;

use utils::{ENV_MANAGEMENT_DOMAIN, ENV_SHORT_DOMAIN};

fn log_request(req: &Request) {
    console_log!(
        "{} - [{}], located at: {:?}, within: {}",
        Date::now().to_string(),
        req.path(),
        req.cf().coordinates().unwrap_or_default(),
        req.cf().region().unwrap_or("unknown region".into())
    );
}

#[event(fetch)]
pub async fn main(req: Request, env: Env) -> Result<Response> {
    log_request(&req);

    // Get the domains
    let management_domain = env.var(ENV_MANAGEMENT_DOMAIN)?.to_string();
    let short_domain = env.var(ENV_SHORT_DOMAIN)?.to_string();
    let current_domain = req
        .url()?
        .domain()
        .map(|d| d.to_owned())
        .expect("The request should always be via domain");

    // Optionally, get more helpful error messages written to the console in the case of a panic.
    utils::set_panic_hook();

    // Optionally, use the Router to handle matching endpoints, use ":name" placeholders, or "*name"
    // catch-alls to match on specific patterns. Alternatively, use `Router::with_data(D)` to
    // provide arbitrary data that will be accessible in each route via the `ctx.data()` method.
    let router = Router::new();

    // Dynamically route based on the hostname
    if current_domain == management_domain {
        router
            .get_async("/", ui::index)
            .post_async("/api/modify", ui::api::modify)
            .post_async("/api/delete", ui::api::delete)
            .get_async("/:name", ui::details)
            .run(req, env)
            .await
    } else if current_domain == short_domain {
        router
            .get_async("/", link::route)
            .get_async("/:name", link::route)
            .run(req, env)
            .await
    } else {
        return Response::error(
            format!(
                "Domain '{}' was not configured as the short or management domain",
                current_domain
            ),
            500,
        );
    }
}
