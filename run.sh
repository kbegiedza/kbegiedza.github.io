#!/bin/bash

set -e

docker build -t ursanon/jekyll -f Dockerfile . &&
docker run --rm -v $(pwd):/project -p 4000:4000 --name jekyll ursanon/jekyll