use crate::utils::KV_LINKS;
use askama::Template;
use serde::{Deserialize, Serialize};
use url::Url;
use worker::{Request, Response, Result, RouteContext};

#[derive(Template)]
#[template(path = "404.html")]
struct NotFoundTemplate;

/// A link in the database
#[derive(Debug, Deserialize, Serialize)]
pub struct Link {
    pub enabled: bool,
    pub usages: u64,
    pub url: Url,
}

impl Link {
    pub fn new(url: Url) -> Self {
        Self {
            enabled: true,
            usages: 0,
            url,
        }
    }
}

/// Handle routing to shortened links
pub async fn route(_: Request, ctx: RouteContext<()>) -> Result<Response> {
    let links = ctx.kv(KV_LINKS)?;

    // Get the link to route to
    let name = ctx.param("name").map(String::as_str).unwrap_or("<root>");

    // Attempt to get the link
    if let Some(value) = links.get(name).await? {
        let mut link: Link = value.as_json()?;

        // Redirect if the link is enabled
        if link.enabled {
            link.usages += 1;

            // Write the updated link
            let serialized = serde_json::to_string(&link)?;
            links.put(name, serialized)?.execute().await?;

            // Redirect to the desired link
            return Response::redirect(link.url);
        }
    }

    Response::from_html(
        NotFoundTemplate
            .render()
            .expect("Template should always render"),
    )
}
