+++
title = "Branching in a Complex World"
date = 2013-10-18T23:23:33Z
tags = ["hg", "sdlc"]
categories = ["Dev"]
+++
Sometimes you aren't in a completely clean state when you want to take a branch of your repository. I've said before to people not to attempt it if you aren't sure how because the risk of error is non-negligible. That said anything is possible, and I'd like to document some of the advanced cases somewhere in case it is useful to someone.

There are number of possible branching strategies, and I'm not here to promote one or another, but if you create named branches in mercurial, this should be applicable. This example is assuming you are branching from `default`, but you can branch from another branch if that floats your boat.

## Tidy local changes

If you have uncommitted local files, your options are to either shelve the changes or commit them because you won't be able to switch around branches with loose changes.

Generally I'm a big fan of the command line for my mercurial stuff, but there are a couple places where I use the TortoiseHg or SourceTree UIs: committing selectively, and shelving.

You can commit an individual file with something like this:

```
hg ci -m "Message" path/to/file.txt
```

Don't worry if you don't want to push this commit yet, you don't need to. In fact given that is a more tricky situation, that is my assumption for this article.

As for shelving there are various methods and perhaps I'll talk about it in another article, but for now I'd recommend the graphical tools.

## Navigating to your branch point

If working with other people, it is always a good idea to pull to see what the current state of the repo is. Then you can determine where you need to be to make the branch.

```
hg pull <alias/url/path>
hg up default # or tip or a bookmark
```

Basically you want to be updated to the most recent changeset that is meant to be in the new branch. If you have a local changeset which isn't meant to be included in this branch, you will need to update to either a different head, or whichever ancestor is supposed to be included.

You can run the `log` command to check the history, or use a graphical tool to help visualize it.

```
hg log -l 10 -G
```

This will show you the last ten changesets with the graph beside them. The ASCII graph is pretty cool, but not always the clearest if you have a lot going on. You can also use `hg parents` to determine the immediate ancestors of a revision or file.

Another command to help visualize the topology of your repository is `heads`.

```
hg heads .
```

This will show you the heads (which are changesets with no children) in your current branch. If you have local changesets to exclude from the branch, you will end up with an extra head in `default` after this. Just update to the last changeset you do want to branch.

## Creating a new branch

After you have updated to the correct changeset, all you need to do is name your branch and commit that branch into history. The `branch` command will warn you about the permanence of branches. They are kind of a big deal.

```
hg branch BRANCH_NAME
hg commit -m "Create BRANCH_NAME branch"
```

Now you have created the branch, you could say you are done, but it is good practice to merge this back into `default` particularly if others will be pulling. If you leave the tip in your new branch, it is possible that someone else's tool might decide to update to tip even though it isn't in the same branch.

If you aren't interested in pushing you local changeset yet, even into default, then you'll need to merge back to the same changeset that you branched from. After updating to `default`, update to the correct parent changeset.

```
hg up default
# possibly updating to some other changeset in default
hg merge BRANCH_NAME
hg commit -m "Merged BRANCH_NAME into default"
```

So now you have your new branch, how do you share it with the world?

## Publishing branches

There really isn't a lot of magic around pushing branches, you just need to add `--new-branch` to your push command.

However, going back to the beginning, we have local changesets that we don't want to push, how do we deal with that? Using the commands mentioned before, you should be able to see that you have multiple heads in `default` now.

When in doubt, use `outgoing`.

```
hg out
```

This should show your branch creation and merge back into default, but it will also show that local changeset that you don't want to publish yet. However, `out` like `push` accepts a `-r` parameter for passing changesets (aka. revisions). When you push a particular changeset, you are pushing only it and its ancestors, but not any other heads.

As a shortcut you can use a period `.` to reference the current working copy/changeset. So you can use it to push only changesets that are ancestors of your current state.

```
hg push -r . <alias/url/path>
```

Of course, if you aren't updated to the changesets you want to push, you can specify the id or number directly instead of a period. Again, try `out` first if you are unsure.

At some point you may want to have divergent branches, or a branch that cannot merge back into default. If you want, you can push multiple heads at the same time.

```
hg push -r . -r BRANCH_NAME <alias/url/path>
```

As you can see, `-r` can be specified multiple times.

## Conclusions

We've learned how to create a new branch regardless of how much stuff we are in the middle of. No longer should anyone hear: "I'm not ready to push yet" as an excuse why they can't make a branch or fix a bug. The concepts, particularly around navigating to and pushing particular changesets, are applicable in both scenarios.

Using a distributed version control system can be a great way to manage code and/or other written material for your project. They are quite flexible and powerful, but with that comes great responsibility as they say.

I will try and share other tidbits of mercurial fun as I think if them.