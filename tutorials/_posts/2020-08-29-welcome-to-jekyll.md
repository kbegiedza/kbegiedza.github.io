---
date:   2020-08-29 09:29:20 +0700
layout: article
title:  "Welcome to Jekyll!"
sub-title: "Welcome my little jekyll!"
description: "Jekyll requires blog post files to be named according to the following format"
categories: jekyll update
thumbnail: /assets/img/placeholder0-sm.png
title-image: /assets/img/placeholder0.png
---
You’ll find this post in your `_posts` directory. Go ahead and edit it and re-build the site to see your changes. You can rebuild the site in many different ways, but the most common way is to run `jekyll serve`, which launches a web server and auto-regenerates your site when a file is updated.

Jekyll requires blog post files to be named according to the following format:

`YEAR-MONTH-DAY-title.MARKUP`

Where `YEAR` is a four-digit number, `MONTH` and `DAY` are both two-digit numbers, and `MARKUP` is the file extension representing the format used in the file. After that, include the necessary front matter. Take a look at the source for this post to get an idea about how it works.

Jekyll also offers powerful support for code snippets:

```ruby
def print_hi(name)
  puts "Hi, #{name}"
end
print_hi('Tom')
#=> prints 'Hi, Tom' to STDOUT.
```

$$ \sqrt{a^2 + b^2} + \int_{1}^{2} x^2 dx $$

```c#
public void ChangeScene(int sceneIndex)
{
    SceneManager.LoadScene(sceneIndex);
}
```

```c++
#include <iostream>

using std;

int main()
{
  auto x = 1;
  x++;
  ++x;

  int* ptr = new int[10];
  delete ptr;
  ptr = nullptr;
}
```

```ruby
class A < B; def self.create(object = User)
class Zebra; def inspect; "X#{2 + self.object_id}"

module ABC::DEF
  include Comparable

  # @param test
  # @return [String] nothing
  def foo(test)
    Thread.new do |blockvar|
      ABC::DEF.reverse(:a_symbol, :'a symbol', :<=>, 'test' + test)
    end.join
  end

  def [](index) self[index] end
  def ==(other) other == self end
end

anIdentifier = an_identifier
Constant = 1
render action: :new
```

Check out the [Jekyll docs][jekyll-docs] for more info on how to get the most out of Jekyll. File all bugs/feature requests at [Jekyll’s GitHub repo][jekyll-gh]. If you have questions, you can ask them on [Jekyll Talk][jekyll-talk].

[jekyll-docs]: https://jekyllrb.com/docs/home
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-talk]: https://talk.jekyllrb.com/
