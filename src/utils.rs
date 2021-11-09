use cfg_if::cfg_if;

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
