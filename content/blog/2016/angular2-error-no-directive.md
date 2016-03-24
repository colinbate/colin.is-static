+++
title = "Angular 2 Error: No Directive annotation found"
series = ["Angular 2"]
series_weight = 1
tags = ["series", "ng2", "troubleshoot"]
categories = ["Dev"]
date = 2016-03-24T17:01:15Z
banner = "C:t_banner_center/red-dots_axrigp.jpg"
+++
I thought I'd start keeping track of all of the errors that I work through as I work on several Angular 2 based projects. Many of these are not issues with Angular 2 per se, but perhaps your build tooling or even something silly you've done in your code. In any case, if it results in a semi-cryptic error in the console from Angular, then I'll try to add it to my site here.

And I'll also try to write about my more positive experiences as well. :)

In this case, the error I was seeing was `No Directive annotation found on <Type>`, where Type was a directive from another third party library.

This error happened just after I had decided to try the latest beta from Angular 2 and also update the third party library as well. The third party library claimed to have a dependency on a particular previous beta version, but I knew it would be okay, so I ignored the errors about unmet peer dependencies.

After running into this issue at runtime, I tried to debug the `directive_resolver` file and found that the type in question had the correct metadata and claimed to be of the right type (Angular 2 does an `instanceof` comparison). So I had an object claiming to be of type `DirectiveMetadata` and I had the `DirectiveMetadata` type itself, but `instanceof` was failing.

It turns out that NPM had installed a separate older version of Angular 2 specifically for the third party library, and that was why the types didn't match up. I deleted the library's `node_modules` folder, and all was well.

This issue leads me to a broader rant about peer dependencies. This particular library listed `angular2` in both `peerDependencies` and `dependencies` lists. I agree with the former; the latter is what causes this problem. With NPM 3, it will complain about unmet peer dependencies, but it won't do anything about it. That is what I was seeing. However, if it is also a normal dependency it will install a private copy of it. That doesn't work so well for an application framework dependency like this.

Hopefully, this will help sort out any similar issues you see like this. What you can do from this point is up to you. Likely things will get sorted out with your third party before long.
