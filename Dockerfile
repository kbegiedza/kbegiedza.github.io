FROM jekyll/jekyll:4.0

RUN mkdir /project
WORKDIR /project

RUN mkdir _site && mkdir .jekyll-cache

CMD ["jekyll", "serve", "--watch"]
