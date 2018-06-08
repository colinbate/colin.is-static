+++
title = "Running Local Dev Servers"
categories = ["Fun links"]
tags = ["tools", "zeit", "go", "node"]
date = 2018-06-08T18:27:37Z
+++
You may have noticed that I didn't use the "Fun Links [Date]" title for this post. While I'm a fan of routine, I realized that both the fun links category and the date were part of the metadata of the entry. Not creating a relevant title was me being lazy.

Creating a title in the past either would have been a matter of repeating the names of the links in a list, or extracting a common theme. The latter is something I've been striving for, but sometimes it is easier to spit out three random links.

Today there is a theme. If you've ever developed anything for the web, then you are probably familiar with the need to run local servers within your development environment to expose your work in progress. Perhaps you use `webpack-dev-server` or a similar package provided as part of your build tool. Sometimes though, you don't need or want a full build system, or you are using one which doesn't provide a development server. Maybe you need something with a bit more functionality. You could use something like Apache or IIS to host files or applications, but those aren't portable or straightforward solutions.

Before I start, I want to mention that there are dozens if not hundreds of packages and tools out there if you only want to serve up a folder of static files. Many languages even have built-in means to do this. There is even a start of a collection of these in the form of [`awesome-webservers`](https://github.com/imgarylai/awesome-webservers). Even this is far from complete as two of the options below are missing. The options below all provide a bit more value on top of the static hosting.

### devd
https://github.com/cortesi/devd

As the name implies, `devd` targets this use case specifically. Written in Go, `devd` is available cross-platform as a single binary file. It doesn't require any configuration file; instead, it accepts a plethora of command line options and provides log output designed for the terminal. It can even set up a self-signed certificate for you to test with secure settings. Unlike some simple development servers, `devd` does more than provide static assets. You can set up reverse proxies, routing, latency and bandwidth limitations, as well as live reloading content.

If you need a tool to help emulate a production setup without access to the same production tools (load balancers, application routers) locally, then `devd` may be able to provide a way to catch some of the "it works on my machine"-type errors.

### serve
https://github.com/zeit/serve

If I had written this post a couple of weeks ago, I probably wouldn't have included `serve` in the list. As [per the release of version 7.0.0](https://zeit.co/blog/serve-7), this is a very different tool than it was before. Also cross-platform, this Node.js utility is useful for both development and production use. It uses a file (`serve.json`) to provide the setup of rewrites, redirects, headers, and other configuration.

As part of the recent v7 release, `serve` became more modular, with middleware providing various parts of the functionality. So in theory, if you need to add something else to the feature set, you can do it. In fact, the package is just a command line wrapper for `serve-handler` which you can embed directly into your Node application to add static handling.

### Caddy
https://caddyserver.com

Caddy is undoubtedly the most full-featured of this list. You can think of it on par feature-wise with Apache or Nginx, but available as a single cross-platform executable (written in Go). It has a focus on security and supports HTTP/2, auto obtaining certificates from Let's Encrypt, and self-signed certificates for development. FastCGI, Websockets, Markdown, templates, proxying, and service discovery are all buzzwords listed among the features of Caddy. It uses a configuration file (`Caddyfile`) which is meant to be minimal and easy to read.

The tricky thing about Caddy is the license/pricing model. The code is open source (Apache 2.0), but the binaries available on their site are not free. Well, they are free for personal use. If you want to use it for commercial or internal business purposes, like as a local development server, then you need to pay per instance, per month. **But**, if you build it from the source code yourself, then you can use it however you like.

So if you would like an Apache 2.0 version of the Windows 64-bit binary with the JWT and CORS plugins added, [you can download my build](https://github.com/colinbate/caddy/releases). Let me know if you'd like other platforms and I'll try to add them to my CI.
