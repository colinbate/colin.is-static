+++
title = "Creating an iA Writer template on the iPad"
date = 2020-01-17T03:20:18Z
categories = ["Dev"]
tags = ["iPad", "iawriter"]
banner = "https://images.unsplash.com/photo-1534670007418-fbb7f6cf32c3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEwOTAzNH0&fm=jpg&w=1050&h=250&crop=&fit=crop&q=80"
banner_credit = "ktabori|Krisztian Tabori"
+++

Earlier I mentioned that I was going to try and create a custom preview for my blog articles. Well I did. It wasn’t particularly hard but it was a bit tedious since I wrote the template on the iPad itself.

To start with I needed to grab a copy one of my rendered article pages. That proved to be tricky since Mobile Safari and other mainstream iOS browsers don’t let you view source. So I had to go off the beaten path. In particular I found and bought [Inspect Browser][ib] which is essentially as much of the Chrome Dev tools as can run on the iPad. Basically everything except the debugger. With this app, getting the source of one of my pages was easy. 

After that I needed somewhere to put it so I created a new repo on GitHub and cloned it with Working Copy. Then I created a file and added the HTML from my site. If you want to read about the format of an iA Writer template there is [a reference repository with examples and instructions][ia]. I edited the file in [GoCoEdit][gc] which has been my coding editor of choice. I cleared out all of the content from the sample page and added the `data` attributes required by the template.

The problem I had was that iA wants to dump all of my content into one spot. But my template has a title in the header separate from the main content, and a banner image again outside the flow of the main document. Not only that, but I wanted to support both my final TOML based front matter files and my early draft format. Thankfully the templates can contain references to JavaScript files. And they fire an event when the content has been injected into the document. 

So what? What could I do with this?

Well to start with, I wasn’t even sure what the generated HTML would look like structurally. So I created an empty `pre` tag and listened to the injection event and then grabbed the contents and stuck them into the `pre` as `textContent`. This would let me see what the DOM looked like for each type of document.

A decent start but how do I get this folder of web files loaded as a template in iA? There may be other ways to do this, but this is how I accomplished it. First I downloaded [Documents][doc] which is a pimped out version of the Files app. Using this, I created a folder inside the Documents file space. I called mine `Colin` but it doesn’t matter, the name of the template is defined in the included `plist` file. Then using the Files browser within Documents, I browsed into the Working Copy space and found the `Content` folder with my template files. If you read the reference, you’ll know there is a certain folder structure required. Once found, I copied the ` Contents` folder and hit cancel to return to my `Colin` folder. I pasted the `Contents` folder inside. Then I navigated up a level and renamed the `Colin` folder to `Colin.iatemplate`. Then from the context menu for that folder I chose to compress. This provided me with a `Colin.zip` file.

From the menu for the zip file, I chose to share. This brought up the standard share widget. From the list of apps I chose `Copy to iA Writer` which I found under the initial `More` option. From there iA Writer picked it up and installed it after prompting. 

As you can see, a bit tedious. I had to do this every time I wanted to test a change. Long story short, I wrote some JS which manipulates the content embedded from iA, extracting the title and banner image and putting them where they belong. I do this for both the regular markdown file and the ones with TOML front matter.

All told, a bit more work than I was hoping for but manageable, and now I can preview my writing with the appropriate context. 

[ib]: https://apps.apple.com/us/app/inspect-browser/id1203594958
[ia]: https://github.com/iainc/iA-Writer-Templates
[gc]: https://apps.apple.com/us/app/gocoedit-code-text-editor/id869346854
[doc]: https://apps.apple.com/us/app/documents-by-readdle/id364901807
