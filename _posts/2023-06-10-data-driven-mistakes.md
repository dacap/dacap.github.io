---
layout: post
title: Data-Driven Mistakes
category: dev
tags: [appdev, programming, ux, english]
---

Several years ago, I remember reading about data-driven design. How big
companies (Google mainly?) were using data-driven approaches to
design and evolve their UI. In those years [I thought about that like
a great idea]({% post_url 2010-03-03-improving-your-applications-by-statistics %})
to know how the UI was being used. But later, in the last few years,
I completely dismissed that approach.

It's a little crazy to drive your design-decision from just some stats:

--- How many clicks did this menu item receive? \
--- Only a couple from hundreds of users. \
--- Hmm, we might remove the item, or send it to a deeper menu level.

Or

--- This is the most used action from the whole program. \
--- Hmm, I think we should make its button bigger. \
--- It's already half the screen... \
--- It should be as big as the screen, probably the only button in the
whole program.

These are totally exaggerated characterizations, but they are a good
example about what you can achieve doing data-driven design: *You are
going to make the problems of your UI just worse.*

The data/stats you can receive from the UI are already defined by the
initial design of the UI itself. You are going to receive just data
about the current design, it'll tell you absolutely nothing about how
to evolve the UI, or what is failing, or not being used because it's
not accessible enough.

The only data you should be listening to are *your users.* The direct
feedback you are getting from them: emails, messages, issues, error
reports, etc. That is the most important *data* that matters in your
design decisions.

Ask your users.
