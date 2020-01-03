+++
title = "Blogging on an iPad"
date = 2020-01-03T05:01:42Z
categories = ["Dev"]
tags = ["iPad", "apps"]
banner = "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEwOTAzNH0&fm=jpg&w=1050&h=250&crop=&fit=crop&q=80"
banner_credit = "aoirostudio|Francois Hoang"
+++
I bought my first iPad in 2010, back at iPad 1 when it was first released. And I still have it and it still works... sort of.

I say sort of because it is stuck on iOS 5.5 and it very difficult finding any apps or games which work, other than the ones which are already on there.

It is amazing how far things have come since then, particularly in the web development space, where I spend most of my time. Web applications are very capable (as is the iPad browser), and iOS has come a long way allowing native applications to work together. And it is this working together which has enabled me to create a relatively smooth blog editing experience.

My site is hosted on Netlify and managed on GitHub, so the key ingredient was [Working Copy][wc], which is a fantastic Git client for iOS. Given a local copy of the repository, I can *mount* my content folder into [iA Writer][ia] which is a very pleasant Markdown focused text editor. There are other options for this part of the tool chain, but I’m hoping to take advantage of the custom templates feature to get a realistic preview of the articles.

On my MacBook, the hardest part at this point was if I wanted to use a photo for a banner on the article. A hero image if you will. Lately I’ve been grabbing an image from Unsplash and uploading it my image host, but then I realized I can just reference it directly. So I have the [Unsplash][us] app which I can use to search for a photo, then I can *Share* the photo to a script that I wrote in [Scriptable][sc]. This script hits the Unsplash API to grab some details for adding attribution and sets a Markdown image snippet on the clipboard. Then I just need to paste this at the top of my file in iA Writer. It may even be possible to run a script on drag and drop if I had the apps running side by side. I’ll have to look into that.

The other *pain* I had was creating the front matter, that is to say, the metadata for the article. Yes it was possible to use Hugo’s archetypes or various other templating mechanisms, but I always found myself falling back to copy and pasting an older article. I didn’t want that here. Since the front matter for my posts is fairly consistent, I was able to create another Scriptable script to convert a basic Markdown document with a standard title and a custom format for categories and tags like this:

```md
# My title

@category tag1 tag2

Content here.
```

Into a format that [Hugo][hu], my site generator, likes:

```md
+++
title = “My title”
date = 2020-01-02T12:34:56Z
categories = [“category”]
tags = [“tag1”, “tag2”]
+++
Content here.
```

It also handles the front matter for the hero image that I may or may not have pasted into the article. The only remaining issue is that once I’ve generated the front matter, I can’t get the nice preview from iA Writer out of the box. I’m hoping that I can fix that with a custom template.

And when I’m done, just commit and push everything and the usual continuous deployment takes over. I might even be able to script that task, but it isn’t particularly challenging as is.

I hope that this provides some inspiration. When I have the time, I’m going to put my scripts on GitHub as well for everyone, but one step at a time.

[wc]: https://apps.apple.com/us/app/working-copy-git-client/id896694807
[ia]: https://apps.apple.com/us/app/ia-writer/id775737172
[us]: https://apps.apple.com/us/app/unsplash/id1290631746
[sc]: https://apps.apple.com/us/app/scriptable/id1405459188
[hu]: https://gohugo.io/