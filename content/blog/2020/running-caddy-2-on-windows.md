+++
title = "Running Caddy 2 on Windows"
date = 2020-05-06T18:09:59Z
categories = ["Dev"]
banner = "https://images.unsplash.com/photo-1578699514703-e41b50396aa4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEwOTAzNH0&fm=jpg&w=1050&h=250&crop=&fit=crop&q=80"
banner_credit = "rdehamer|Ryan De Hamer"
draft = true
+++

I wanted to setup a static site on a new VM the other day and since I’ve had such good experience with [Caddy](https://caddyserver.com) on my own workstation, I thought I’d use that.

For the version I was using before, I had created my own build of the software to avoid the commercial licensing on the available binaries. It worked well, but I figured I should check to see what changes had gone in over the past year or so.

In a case of weird timing, the release of Caddy 2 was the same day. So I looked into it and despite some config changes, it appears to be even more solid than before. And most importantly, it is all being released under the Apache 2.0 license, even the binaries. Yay!

Caddy is written in Go, and as such is distributed as a single binary executable. They leave it as an exercise for the consumer to get it set up as a service on your system of choice. However, it isn't difficult, and if you are interested, I've outlined the steps below. But you don't need to run it as a service to get use out of it. If you are a developer, you may just want to run it on the [command line](https://caddyserver.com/docs/command-line). You can run a very capable static server or reverse proxy without needing to create any configuration file, just passing command line options.

And before people message me about the fact that Windows has IIS, I know. I'm not a fan; you may be and that's great. But I don't think it is apples to apples to compare them. Either way, if you want to run Caddy as a Windows service, this is a way to do that.

## 
