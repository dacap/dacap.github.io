---
layout: post
title: Reading time in Jekyll
category: tips
tags: [tips, english]
---

Do you want to display the reading time in your Jekyll's blog
--e.g. like in [Medium.com](http://medium.com)--? Here you have a simple way --without
plugins--. First of all we've to calculate the reading time dividing
the number of words of your page's content by 180 --assuming that
[we can read 180 wpm on a monitor](http://en.wikipedia.org/wiki/Words_per_minute#Reading_and_comprehension)--:

{% raw %}
    {% capture read_time %}
      {{ page.content | number_of_words | divided_by: 180 }}
    {% endcapture %}
{% endraw %}

Then if the `read_time` variable is equal to `0`, we can display `1`
just to avoid a `0 min read` message:

{% raw %}
    {% if read_time != '0' %}
      {{ read_time }}
    {% else %}
      1
    {% endif %} min read
{% endraw %}

And that's all. You can put those two snippets of code in your
`_layouts/post.html` file.
