+++
title = "Glutton for Punishment"
date = 2021-03-31T16:03:20Z
categories = ["Personal"]
banner = "https://images.unsplash.com/photo-1518633642659-880338726a0d?ixid=MnwxMDkwMzR8MHwxfGFsbHx8fHx8fHx8fDE2MTcyMDY0NTM&ixlib=rb-1.2.1&fm=jpg&w=1050&h=250&crop=&fit=crop&q=80"
banner_credit = "zayyerrn|Ahmed Zayan"
+++
I'd like to think that I've come to appreciate things that make that life more straightforward at this point in my life. But then I make decisions that seem to prove the opposite.

In particular, I'm referring to the new computer I bought back in December. My previous computer was on its last legs, so the need for a new one was clear. When Apple announced their new M1 Apple Silicon machines, I figured it was a chance to get something for the future. I lived through the last architecture transition from PowerPC to Intel, so I knew it would be awkward but manageable. Indeed a source of some incompatibilities, but probably not a big problem.

Unless I make it a problem. For reasons I'm not even sure of myself, I've further restricted my options, limiting my productivity and the utility of my new computer. In particular, I decided that I would not install Rosetta 2 and instead **only run apps that are native ARM/M1**.

So that was the first hurdle I created for myself. As time goes on, the number of compatible apps increases, so it is fun to see which ones will be next. In fact, it has caused me to seek out alternatives in some cases. But in many cases, it just means that I do without, or I use a web-based version of the app in question.

Are you interested in seeing lists of apps that are M1 native? You can check out [Does It ARM?][1] or [Is Apple Silicon Ready?][2]. Neither is an exhaustive list, obviously, but they do contain many popular apps. The best source for information about specific apps is the app websites themselves.

[1]: https://doesitarm.com/
[2]: https://isapplesiliconready.com/

So one of the apps that are in a grey area of readiness is Node.js. The latest versions on the v15 line will build and run on the M1, but they are not providing pre-built binaries. OK, so that is unfortunate, but fortunately, the popular NVM (Node Version Manager) will build Node from source if a pre-built version doesn't exist. However, in another decision that works against me, I replaced the default Zsh shell with Fish.

This matters because `nvm` is a bash function, not an executable. So it doesn't work with `fish`. And of course, there are a few different ways to solve this issue, none of which are clearly *the right way* to do it. But I found a `fish` module that wraps around  `nvm`, running a bash instance each time you run it. Thankfully, at least for me, running `nvm` isn't something that needs to happen too often.

So at the end of the day, I have the latest version running on my laptop, and it has fixed an issue that was affecting specific build tools I was using. So now I can look forward to the next time that I somehow shoot myself in the foot.