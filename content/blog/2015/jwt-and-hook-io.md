+++
title = "Using JSON Web Tokens with Hook.io"
series = ["Building A Song Request App"]
series_weight = 2
tags = ["series", "auth0", "jwt", "hook.io"]
categories = ["Dev"]
date = 2015-12-31T02:37:50Z
banner = "C:t_banner_center/jwt-hookio_c3ne0a.jpg"
+++
Continuing from my article about React and Redux, which are very much front-end concerns, I now turn my focus onto the back-end. Since my karaoke song request app is a static one, hosted at the moment, on GitHub Pages, I don't have a backend. Instead, I take advantage of third-party services for persistence and authentication.

There are many hosted database providers out there, and even a few backend-as-a-service offerings as well. However, a couple of months ago I wrote a [fun links article about microservices][flms]. During that time I discovered [Hook.io][hio] which offered a bit more functionality than most of the other microservices. In particular, it offered a datastore which means it is usable as a backend with persistence.

I'm not sure what technically constitutes *micro* in this context, but I feel like I may have violated the spirit of a microservice with what I created for this app. My code is only a bit over 100 lines, yet I implemented a full CRUD API in a single service function.

The way Hook.io works is that you point your *hook* at a Gist on GitHub, and it uses that as the source code. It is a pretty easy way to manage the source since you can clone a Gist to work on it locally, or just update it in the browser. And for the most part, things just work. That said, I probably burnt most of my time during this project trying to figure out some of the following things.

## Things I Learned About Hook.io

These are things that I would have liked to have known when starting out. Either because they would have potentially changed my design or they would have saved me a fair bit of time.

### 1. All Your Hooks Share a Datastore

The documentation mentions that you are limited in the number of keys you can store with the free version, but it doesn't mention that your datastore is global to all of your hooks. In hindsight, it makes sense as environment variables work that way and it would allow for more *micro* services being created to act on the same data. I might not have bundled all functionality into one service if I knew about this up front.

### 2. Hooks Are Run With Node.js 0.12.7

This seems to be true as of year end 2015. Unfortunately, this isn't easy to determine as the sandbox environment used to run the hooks doesn't allow access to the `process` global object. I determined this by looking at the `Dockerfile` [they have in their repo][df]. The reason I wanted to know was I was wondering which ES2015 features I would have access to natively. Knowing the version wasn't a huge help as it was difficult figuring our what was available for old versions of the V8 engine.

Here are some of the features available:

* Promises
* `Map`, `Set`, `WeakMap`, `WeakSet`
* Symbols
* `for..of`

Unfortunately, that list doesn't include some that I would have liked, like arrow functions or `Array.from()`.

### 3. You Cannot Use `Buffer` Directly

But, and this is important, **you can use them indirectly**. This is also caused by the sandbox evaluation of scripts. So you can't do this directly in your code.

```js
// Standard Node.js base64 decoding
let decoded = new Buffer(base64encoded, 'base64').toString('utf8');
```

But you could reference a package which does this or even one which returns a buffer. I'll give an example of this later.

## Authenticating Users From A Hook

As a part of creating my API within my hook, I needed a way to authenticate some of the requests. The code to my hook is public, and I'm accessing the API *cross-origin* so there are some limitations.

The Hook.io documentation warns against storing sensitive data, so we need a way of determining who the user is without storing usernames and passwords locally. What we need is user management as a service. There are a couple of options, but one I had heard the most about was [Auth0][]. It allows you to tap into some social identity providers like Facebook, Google or GitHub. Or they can maintain a username/password database for you.

So now I'm authenticating with `auth0.com` and calling an API at `hook.io`, so sharing a cookie isn't an option. This is where *Bearer* tokens, in particular [JSON Web Tokens][jwt], come into play.

Auth0 provides a pre-made login/signup form (called Lock) which you can drop into your projects. It is customizable, but it works and looks pretty good out of the box. If you recall in my last article, I showed an action creator which imported a couple of functions from `../api/auth`. Well it is the `signin` function from there which integrates with Auth0's Lock like so:

```js
const lock = new window.Auth0Lock(id, url);
export function signin() {
  return new Promise((resolve, rej) => {
    lock.show({authParams: {scope: 'openid admin'}}, (err, profile, token) => {
      if (err) {
        return rej(err);
      }
      storage.set(tokenKey, token);
      storage.set(profileKey, profile);
      resolve(profile);
    });
  });
}
```

Yes, I am accessing `Auth0Lock` globally and not via the module system. It was a lot easier than trying to integrate it with Webpack. Also in this case `storage` is a small wrapper around `sessionStorage` that I wrote.

As you can see, using the `lock` is pretty easy in this case. The only customization I'm doing to it is specifying that I want the `admin` property of the user (which is maintained at Auth0) to be included in the generated token's payload.

This causes a dialog to pop up asking for username and password, and then that opens a popup window briefly. What is returned in the end, using the callback, is the profile document from Auth0 and the token.

The token is then saved and used whenever I make an API call. I just have a little helper function in my API wrapper which uses it:

```js
const getHeaders = (initial = {}) => {
  let token = storage.get(tokenKey);
  if (token) {
    initial['Authorization'] = 'Bearer ' + token;
  }
  return initial;
}
```

If the token is present, I add an `Authorization` header with the token in it. This is how the token is communicated to my hook when I make a call to it.

Without going into all of the technical details, this token is signed by Auth0 using a secret. To verify that it hasn't been tampered with, you need access to that same secret. I can't just add that secret to my public source code, but fortunately, Hook.io supports environment variables. This is a place you can set private values which are then made available to your executing hooks.

Now we are looking at the code of the hook itself, running as part of the API.

```js
// This is code running in my hook
var jwt = require('jsonwebtoken'),
    clientId = hook.env.my_clientId,
    secret = require('base64url').toBuffer(hook.env.my_secret),
    token = hook.req.headers.authorization &&
            hook.req.headers.authorization.replace(/^Bearer\s+/, '');
```

This is the code that is used to extract the token and other inputs needed to autheticate the user. The `hook` object is passed to the hook, and `hook.env` contains the environment variables I set up. You can see that I have required the `base64url` package and that is to get around the `Buffer` issue I mentioned above. In this case, I'm taking `my_secret`, a base64 encoded string, out of the environment variables. The `base64url` package converts it into a `Buffer` for me, which I will use in a minute.

I also extract the token from the `Authorization` header if it is present.

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

This is the code where the token is verified. The `jsonwebtoken` package we required above is doing the heavy lifting. The `user` being returned from that is the token payload. Because I asked for it, the token includes an `admin` property which indicates whether the user is an administrator.

In the rest of my hook, I can simply do this when necessary:

```js
if (user.admin) {
  // Do something admin-y
}
```

That is it. It is pretty straightforward in the end, but the sandboxed execution environment caused me to spin my wheels for a while. I want to provide this as a reference for anyone looking for ways to integrate Auth0 or JWT in general with Hook.io.

For anyone interested, here is the full code for my hook. It is live from the Gist, so it may change slightly in the future as I make updates.

{{< gist 517144b2bfc2584575e7 >}}

[flms]: /blog/2015/fun-links-2015-11-06/
[hio]: https://hook.io
[df]: https://github.com/bigcompany/hook.io/blob/master/docker/nodebase/Dockerfile
[jwt]: https://jwt.io
[Auth0]: https://auth0.com
