use crate::link::Link;
use askama::Template;

#[derive(Template)]
#[template(path = "index.html")]
pub struct IndexTemplate {
    links: Vec<String>,
}

#[derive(Template)]
#[template(path = "link.html")]
pub struct LinkTemplate {
    enabled: bool,
    usages: u64,
    url: String,
}

impl From<Link> for LinkTemplate {
    fn from(l: Link) -> LinkTemplate {
        LinkTemplate {
            enabled: l.enabled,
            usages: l.usages,
            url: l.url.to_string(),
        }
    }
}
