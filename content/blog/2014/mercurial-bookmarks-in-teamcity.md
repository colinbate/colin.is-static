+++
title = "Mercurial Bookmarks in TeamCity"
date = 2014-02-05T21:21:52Z
tags = ["teamcity", "hg", "ci"]
categories = ["Dev"]
+++
This is just a note to help those people looking for help on this and hopefully prevent some banging of heads into walls.

To use bookmarks fully with [TeamCity][tc], you need TeamCity 8 **and** Mercurial 2.4 installed on the server.

New installations shouldn't have a problem, but if you've upgraded to TC8, then do yourself a favour and [upgrade your Mercurial as well][hg].

If you have an old version of Mercurial, you may see an exception like this if you try to set your default branch to be a bookmark.

```
jetbrains.buildServer.vcs.VcsRootVcsException: Cannot find revision of the default branch '<bookmark name>'
```

You also won't be able to select any branches in the custom run dialog.

It will be very frustrating. :)

[tc]: http://www.jetbrains.com/teamcity/
[hg]: http://mercurial.selenic.com/downloads/