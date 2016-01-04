+++
title = "Using JSON Web Tokens with Hook.io"
series = ["Building A Song Request App"]
series_weight = 2
tags = ["series", "auth0", "jwt", "hook.io"]
categories = ["Dev"]
date = 2015-12-31T02:37:50Z
banner = "C:t_banner_center/jwt-hookio_c3ne0a.jpg"
draft = true
+++
Continuing on from my article about React and Redux which are very much front-end concerns, I now turn my focus onto the back-end. Since my karaoke song request app is a static one, hosted at the moment, on GitHub Pages, I don't have my own backend. Instead I take advantage of third-party services for persistence and authentication.

There are many hosted database providers out there, and even a few backend-as-a-service offerings as well. However, a couple of months ago I wrote a [fun links article about microservices][flms]. During that time I discovered [Hook.io][hio] which offered a bit more functionality than most of the other microservices. In particular it offered a datastore which meant it could be used for a simple backend with persistence.

I'm not really sure what technically constitutes *micro* in this context, but I feel like I may have violated the spirit of a microservice with what I created for this app. My code is only a bit over 100 lines, yet I implemented a full CRUD API in a single service function.

The way Hook.io works is that you point your *hook* at a Gist on GitHub and that is used as the source of your code. It is a pretty easy way to manage the code since you can clone a Gist to work on it locally, or just update it in the browser. And for the most part things just work. That said, I probably burnt most of my time on this project trying to figure things out about it.

## Things I Learned About Hook.io

These are things that I would have liked to have known when starting out. Either because they would have potentially changed my design or they would have saved me a fair bit of time.

### 1. All Your Hooks Share a Datastore

The documentation mentions that you are limited in the number of keys you can store with the free version, but it doesn't mention that your datastore is global to all of your hooks. In hind-sight, it makes sense as environment variables work that way and it would allow for more *micro* services being created to act on the same data. I may not have bundled all functionality into one service if I knew about this up front.

### 2. Hooks Are Run With Node.js 0.12.7

This seems to be true as of year end 2015. Unfortunately this isn't easy to determine as the sandbox environment used to run the hooks doesn't allow access to the `process` global object. I determined this by looking at the `Dockerfile` [they have in their repo][df]. The reason I wanted to know was I was wondering which ES2015 features I would have access to natively. Knowing the version wasn't a huge help as it was difficult figuring our what was available for old versions of the V8 engine.

Here are some of features available:

* Promises
* `Map`, `Set`, `WeakMap`, `WeakSet`
* Symbols
* `for..of`

Unfortunately that list doesn't include some that I would have liked, like arrow functions or `Array.from()`.

### 3. You Cannot Use `Buffer` Directly

But, and this is important, **you can use them indirectly**. This is also caused by the sandbox evaluation of scripts. So you can't do this directly in your code.

```js
// Standard Node.js base64 decoding
let decoded = new Buffer(base64encoded, 'base64').toString('utf8');
```

But you could reference a package which does this, or even one which returns a buffer. I'll give an example of this later.

## Authenticating Users From Your Hook

If you are creating an API within your hook(s) then it is likely that you'll need to authenticate the requests which come into your hook. Given that you are likely accessing your hook *cross-origin* and the code for your hook is public, how do you secure things?

This is where Bearer tokens, in particular [JSON Web Tokens][jwt], come into play.

I'm not going into all the details about how they work, but I will explain the basics as we walk through integrating them with Hook.io.

```js
var jwt = require('jsonwebtoken'),
    clientId = hook.env.my_clientId,
    secret = require('base64url').toBuffer(hook.env.my_secret),
    token = hook.req.headers.authorization &&
            hook.req.headers.authorization.replace(/^Bearer\s+/, '');
```

This is the code that is used to extract the token and other inputs needed to autheticate the user. You can see that I have required the `base64url` package and that is get around the `Buffer` issue I mentioned above. In this case I'm taking `my_secret`, a base64 encoded string, out of the environment variables. This `base64url` package converts it into a `Buffer` for me, which I will use in a minute.

```js
var user = {};
if (token) {
  try {
    user = jwt.verify(token, secret, {audience: clientId});
    user.authenticated = true;
  } catch (e) {
    hook.res.statusCode = 401;
    hook.res.end('Invalid user token');
    return;
  }
}
```

This is the code where the token is verified. The `jsonwebtoken` package we required above is doing the heavy lifting. The `user` being returned from that is the token payload object.

[flms]: /blog/2015/fun-links-2015-11-06/
[hio]: https://hook.io
[df]: https://github.com/bigcompany/hook.io/blob/master/docker/nodebase/Dockerfile
[jwt]: https://jwt.io
