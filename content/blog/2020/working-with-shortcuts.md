+++
title = "Working with Shortcuts"
date = 2020-01-04T04:59:05Z
categories = ["Dev"]
tags = ["iPad"]
banner = "https://images.unsplash.com/photo-1511075675422-c8e008f749d7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEwOTAzNH0&fm=jpg&w=1050&h=250&crop=&fit=crop&q=80"
banner_credit = "usinglight|Stefan Steinbauer"
+++

More success in the blogging automation front. I spent some time playing around with the [Shortcuts app][sc] which is now standard as part of iOS 13. If you haven’t played with it, I recommend checking it out. It is reminiscent of Automator on the Mac in that it allows you visually combine functional blocks linking inputs and outputs to create a script which you can trigger manually or based on some event.

It is like a visual programming version of Scriptable which I mentioned in my last post. And for certain interactions it is more pleasant to use, but there were some parts of the Shortcut I created today which would have been much easier with JavaScript.

What I ended up creating was a Shortcut to create a new blog post. Basically it starts by prompting for a title, then it creates a file name based on that and even prompts for a category and if it finds a Markdown image in the clipboard it will prepend that to the new document as well, opening the whole thing in iA Writer for me.

I was even able to add an icon to my home screen which kicks off the Shortcut. So at this point, I have very little excuse to not write something. Obviously generating the content itself hasn’t been automated, although, I could probably dictate the post and have Siri write it for me. That might be a fun experiment at some point.

[sc]: https://support.apple.com/en-us/HT208309