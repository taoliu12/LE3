# Learn Expert Tabs

Hey there you awesome learn expert. Thanks for testing out my soon to be chrome extension. 

## Installation 

Right now you'll have to manually place the code into your console to use this script.

First, add the CSS from stylesheets/expert_tabs.css to your chrome console. I've added instructions on doing this [here](http://imgur.com/a/ucKCu).

Then once the css is in, copy *all* the code in js/expertTabs.js into your chrome console and hit enter. Once that's done you should be good to go!

## How to use

Click track under a user's question text in the sidebar to track to open up a tab. If a Learn Expert has responded to the student last, the tab should be gray. If the student has responded last, the tab should be blue.

Click X to close tab.


## Note:

If you collapse the chats on the side, the tabs won't work properly, so don't do that. :)

Also, none of this is being saved anywhere, reloading the page, closing the window, etc, means you have to repeat the installation steps (until I make this into an extension)

## Known Issues

+ Right now you can have mutliple tabs open for the same student. It should be a simple fix but I haven't gotten around to it yet.

+ Currently, mutation observers attach to all chats, which isn't useful and creates a bunch of errors in the console. It doesn't affect the functionality but this needs to be changed. Mutation Observer for the responded status should only be attached to chats with open tabs and removed when they're closed.

+ The code is an unorganized mess. I'll be cleaning it up soon :) 

## Bug Reporting

Just DM me on slack. Still very much a work in progress.