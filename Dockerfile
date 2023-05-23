FROM jekyll/jekyll:4.0.0

RUN gem install jekyll-feed jekyll-sitemap

RUN mkdir -p _site .jekyll-cache /project

WORKDIR /project

CMD ["jekyll", "serve", "--watch"]