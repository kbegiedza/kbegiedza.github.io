FROM jekyll/jekyll:4.0.0

RUN mkdir /project
WORKDIR /project

RUN mkdir -p _site .jekyll-cache

RUN gem install jekyll-feed jekyll-sitemap

CMD ["jekyll", "serve", "--watch"]