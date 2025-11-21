# syntax=docker/dockerfile:1

ARG RUBY_VERSION=3.4.7
FROM docker.io/library/ruby:$RUBY_VERSION-slim

# Rails app lives here
WORKDIR /rails

# Dev packages
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    curl \
    build-essential \
    git \
    libyaml-dev \
    pkg-config \
    libvips \
    sqlite3 && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Environment for DEV
ENV RAILS_ENV="development" \
    BUNDLE_PATH="/usr/local/bundle" \
    BUNDLE_WITH="" \
    BUNDLE_WITHOUT="" \
    LD_PRELOAD=""

# Install bundler early (optional)
RUN gem install bundler

# Install gems (only Gemfile to allow caching)
COPY Gemfile Gemfile.lock ./
RUN bundle install

# Copy project
COPY . .

# Expose Rails dev port
EXPOSE 3001

CMD ["bash", "-c", "bundle install && ./bin/rails server -b 0.0.0.0 -p 3001"]
