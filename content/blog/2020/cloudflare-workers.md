+++
title = "Cloudflare Workers"
date = 2020-04-11T15:19:33Z
categories = ["Dev"]
banner = "https://images.unsplash.com/photo-1571073047875-bf9f37e65f5a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEwOTAzNH0&fm=jpg&w=1050&h=250&crop=&fit=crop&q=80"
banner_credit = "oneyearchennai|Yannik Sauerwein"
+++

As a father of two young boys I don’t find myself with a lot of free time to work on personal projects and when I do have the time I rarely have the energy. So while I spend a fair bit of time learning about new tech I’d like to play with, finding time to do so isn’t easy. Even in a lockdown it seems. Or at least that was the case until this weekend.

The tech in question is [Cloudflare Workers](https://workers.dev). I heard about it when they first launched and have wanted to try it for a while. I even started paying $5/month to have access to Workers KV, their key-value store. Because serverless functions are cool, but serverless functions with super easy access to persistence is amazing. Especially given the performance with everything running at the edge of the cloud.

So when I wanted to create a simple proxy function, I thought it would be a good opportunity. I even found an example on their site to start from and had something working quite quickly. Their `wrangler` command line tool lets you generate a simple project and another command will publish it. It was very easy. 

Buoyed by my success with that, I decided to try out using the KV store to persist shopping list data for a custom app I use. The current storage I was using wasn’t cutting it anymore. It turns out the storage being unreliable was also exacerbating a bug I had in my UI code, but I’m still happy to have switched. 

Accessing the KV store within my worker was extremely easy. You add one line in your config file and then you have access to a named instance of a client library for getting, setting and deleting values. And there is even a list operation for getting a list of keys, optionally filtered by prefix, so I’m able to use this API for multiple lists/tenants if necessary. And since I can operate on single items in my list, I’m able to have less data being sent back and forth, which also makes things feel a bit faster.

The function interface is that of a service worker, including standard fetch/Request/Response objects, making the code a bit more portable than other function as a service offerings. There is a custom request property which gives access a bunch of Cloudflare specific data but I don’t imagine you’d need that most of the time.