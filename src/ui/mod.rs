use crate::{link::Link, utils::KV_LINKS};
use askama::Template;
use worker::{Request, Response, Result, RouteContext};

pub mod api;
mod templates;

use templates::{IndexTemplate, LinkTemplate};

/// Display a list of all links by name
pub async fn index(_: Request, ctx: RouteContext<()>) -> Result<Response> {
    // Get a list of all the links
    let links = ctx.kv(KV_LINKS)?;
    let cursor = links.list().execute().await?;

    // Render the output
    let list: Vec<_> = cursor.keys.into_iter().map(|k| k.name).collect();
    let rendered = IndexTemplate::new(list)
        .render()
        .expect("Rendering should be infallible");

    Response::from_html(rendered)
}

/// Display the details of a given link
pub async fn details(_: Request, ctx: RouteContext<()>) -> Result<Response> {
    let links = ctx.kv(KV_LINKS)?;
    let name = ctx
        .param("name")
        .expect("The route must have a /:name parameter");

    // Special handling for URL encoded angle brackets with
    // the <root> link name
    let name = if name.to_lowercase() == "%3croot%3e" {
        String::from("<root>")
    } else {
        name.to_owned()
    };

    // Attempt to get the link and create the template
    let template = if let Some(raw) = links.get(&name).await? {
        let l: Link = raw.as_json()?;
        LinkTemplate::populate(name, l)
    } else {
        LinkTemplate::empty(name)
    };

    // Render the template
    let rendered = template.render().expect("Rendering should be infallible");
    Response::from_html(rendered)
}
