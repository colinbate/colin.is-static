+++
title = "Error: main.ts is missing from the TypeScript compilation."
date = 2020-06-25T15:49:39Z
categories = ["Dev"]
banner = "https://images.unsplash.com/photo-1501360575895-3f3f2639fd74?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEwOTAzNH0&fm=jpg&w=1050&h=250&crop=&fit=crop&q=80"
banner_credit = "sneakyelbow|Sneaky Elbow"
+++

This is one of those blog posts where I want to provide a reference to my future self and anyone else who encounters this problem.

The problem presents itself when trying to build (via `ng build` or `ng serve`) your Angular application and you see the following error.

```txt
ERROR in ./src/main.ts
Module build failed: Error: <path\to\>src\main.ts is missing from the TypeScript compilation. Please make sure it is in your tsconfig via the ‘files’ or ‘include’ property.
```

Likely, you will also see a similar error for `polyfills.ts`. If this is the case, **check to see if your app is located on a path which is a symlink.**

Angular compiler doesn’t like symlinks, at least on Windows. I believe it has something to do with Node.js module resolution. Luckily, there is a solution which doesn’t involve changing paths.

You can add `--preserve-symlinks` to your `ng build` command, but since that option isn’t available for the serve command, your best bet is to add it to your `angular.json` file.

```json
"architect": {
  "build": {
    "builder": "@angular-devkit/build-angular:browser",
    "options": {
      "preserveSymlinks": true,
...
```

I ran into this lately when a number of our CI builds started using a symlink somewhere higher in the build path and that caused a number of mysterious failures.

Hopefully this helps you avoid digging through GitHub issues and Stackoverflow answers.
