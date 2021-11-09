use crate::link::Link;
use askama::Template;

static VERSION: &'static str = env!("CARGO_PKG_VERSION");

#[derive(Template)]
#[template(path = "index.html")]
pub struct IndexTemplate {
    links: Vec<String>,
    version: &'static str,
}

impl IndexTemplate {
    pub fn new(links: Vec<String>) -> Self {
        Self {
            links,
            version: VERSION,
        }
    }
}

#[derive(Template)]
#[template(path = "link.html")]
pub struct LinkTemplate {
    exists: bool,
    enabled: bool,
    usages: u64,
    name: String,
    url: String,
    version: &'static str,
}

impl LinkTemplate {
    /// Create a template that has a link populated
    pub fn populate(name: String, l: Link) -> Self {
        LinkTemplate {
            exists: true,
            name,
            url: l.url.to_string(),
            enabled: l.enabled,
            usages: l.usages,
            version: VERSION,
        }
    }

    /// Create a template for a link that doesn't exist
    pub fn empty(name: String) -> Self {
        Self {
            exists: false,
            enabled: false,
            usages: 0,
            name,
            url: String::new(),
            version: VERSION,
        }
    }
}
