+++
title = "Go go go (aka. Advent of Code 2019)"
date = 2019-12-09T15:41:31Z
categories = ["Dev"]
tags = ["lang", "geek", "go"]
banner = "C:t_banner_center/christmas-go_vsmcod.jpg"
+++
[Last year]({{< ref "blog/2018/advent-of-code.md" >}}) I participated in a programming competition in which I attempted to solve a daily problem by writing a little program to process input and get a result. To punish myself further, I decided to try writing the programs in a different language each day.

The problem with that approach was that apart from any languages I was already familiar with, I didn't get a chance to appreciate any of them. In particular Rust and F# were new to me, but I probably would have enjoyed using them more if I started on the early easy questions with them and built up to the harder ones.

So that is what I decided to do this year. I chose one new language: **Go**, and decided to use it for all the puzzles. And I must say, it was a good choice.

First off, I am really enjoying the language. It is a somewhat C-like language with static types, memory management/garbage collection and good support for concurrency. I'm still learning, and I need to dip into the documentation a fair bit, but even that is getting better.

And secondly, it is actually quite adept at creating solutions for these programming challenges, particularly since it compiles natively and so any less than optimal solutions still run quickly. But also, it has the `Scan`, `Scanf` and `Scanln` you may be familiar with from C, allowing for convenient handling of input.

On top of all that, I've also determined that both services I use to host applications: [Netlify](https://netlify.com), and [Zeit](https://zeit.co) support Go based serverless functions which means I can incorporate Go into my life in multiple ways.

To see my solutions to the problems so far, check out my repository on [Github][gh].

[gh]: https://github.com/colinbate/adventofcode-2019
