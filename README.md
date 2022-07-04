# Shorter

A serverless link-shortener built on [Cloudflare Pages](https://pages.cloudflare.com) and [Cloudflare Workers](https://workers.dev).
Authentication for the admin interface is provided by [Cloudflare Access](https://www.cloudflare.com/teams/access/).

Shorter is composed of 2 components: a director and a management interface.
The director, a TypeScript worker, is responsible for redirecting requesters to their destination.
The management interface is a [Remix.run](https://remix.run) application for creating and editing short-links.
