use crate::{
    link::Link,
    utils::{get_form_boolean, get_form_string, ENV_MANAGEMENT_DOMAIN, KV_LINKS},
};
use lazy_static::lazy_static;
use regex::Regex;
use url::Url;
use worker::{Request, Response, Result, RouteContext};

lazy_static! {
    static ref REGEX: Regex = Regex::new(r"^[a-zA-Z0-9-_]*$").expect("Regex must compile");
}

/// Handle creating and updating link references
pub async fn modify(mut req: Request, ctx: RouteContext<()>) -> Result<Response> {
    let links = ctx.kv(KV_LINKS)?;
    let form = req.form_data().await?;

    // Get all the fields
    let name = match get_form_string(&form, "name") {
        Ok(v) => v,
        Err(r) => return Ok(r),
    };
    let url = match get_form_string(&form, "url") {
        Ok(v) => v,
        Err(r) => return Ok(r),
    };
    let enabled = match get_form_boolean(&form, "enabled") {
        Ok(v) => v,
        Err(r) => return Ok(r),
    };

    // Ensure required fields are present
    if name.is_none() && url.is_none() {
        return Response::error("fields 'name' and 'url' must be present", 400);
    }
    let name = name.unwrap();
    let url = Url::parse(&url.unwrap())?;

    // Check that the name contains valid characters
    if !REGEX.is_match(&name) && name.to_lowercase() != "%3croot%3e" {
        return Response::error(
            "field 'name' must only contain alphanumeric characters, '-', and '_'",
            400,
        );
    }

    // Reformat name if changing <root>
    let name = if name.to_lowercase() == "%3croot%3e" {
        String::from("<root>")
    } else {
        name
    };

    // Update or create the link
    let link = if let Some(raw) = links.get(&name).await? {
        let mut link: Link = raw.as_json()?;
        link.url = url;
        link.enabled = enabled;
        link
    } else {
        Link::new(url)
    };

    // Save the changes
    let encoded = serde_json::to_string(&link).expect("link must be serializable");
    links.put(&name, &encoded)?.execute().await?;

    // Build the redirect URL
    let management_domain = ctx.var(ENV_MANAGEMENT_DOMAIN)?.to_string();
    let redirect = Url::parse(&format!("https://{}/{}", management_domain, name))
        .expect("Redirect URI should always be valid");
    Response::redirect(redirect)
}

/// Handle deleting link references
pub async fn delete(mut req: Request, ctx: RouteContext<()>) -> Result<Response> {
    let links = ctx.kv(KV_LINKS)?;
    let form = req.form_data().await?;

    // Require that the name be present
    let name = match get_form_string(&form, "name") {
        Ok(s) => match s {
            Some(s) => s,
            None => return Response::error("field 'name' is required", 400),
        },
        Err(r) => return Ok(r),
    };

    links.delete(&name).await?;

    // Build the redirect URL
    let management_domain = ctx.var(ENV_MANAGEMENT_DOMAIN)?.to_string();
    let redirect = Url::parse(&format!("https://{}", management_domain))
        .expect("Redirect URI should always be valid");
    Response::redirect(redirect)
}
