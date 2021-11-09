use cfg_if::cfg_if;
use worker::{FormData, FormEntry, Response};

pub static ENV_MANAGEMENT_DOMAIN: &'static str = "MANAGEMENT_DOMAIN";
pub static ENV_SHORT_DOMAIN: &'static str = "SHORT_DOMAIN";
pub static KV_LINKS: &'static str = "LINKS";

cfg_if! {
    // https://github.com/rustwasm/console_error_panic_hook#readme
    if #[cfg(feature = "console_error_panic_hook")] {
        extern crate console_error_panic_hook;
        pub use self::console_error_panic_hook::set_once as set_panic_hook;
    } else {
        #[inline]
        pub fn set_panic_hook() {}
    }
}

fn error_response(msg: &str, status: u16) -> Response {
    Response::error(msg, status).unwrap()
}

/// Parse a boolean from the from at the key
pub fn get_form_boolean(form: &FormData, name: &str) -> Result<bool, Response> {
    if let Some(entry) = form.get(name) {
        match entry {
            FormEntry::Field(value) => {
                let lower = value.to_lowercase();
                if lower == "on" || lower == "true" {
                    Ok(true)
                } else if lower == "off" || lower == "false" {
                    Ok(false)
                } else {
                    Err(error_response("invalid format", 400))
                }
            }
            _ => Err(error_response("files are not accepted", 400)),
        }
    } else {
        Ok(false)
    }
}

/// Get a value from the form at the key
pub fn get_form_string(form: &FormData, name: &str) -> Result<Option<String>, Response> {
    if let Some(entry) = form.get(name) {
        match entry {
            FormEntry::Field(value) => Ok(Some(value)),
            _ => Err(error_response("files are not accepted", 400)),
        }
    } else {
        Ok(None)
    }
}
