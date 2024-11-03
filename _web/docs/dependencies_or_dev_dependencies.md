# `dependencies` or `devDependencies`

This document is for when you are not sure if you should add new package to dependencies or devDependencies.

This rule is based on the following article.

<https://qiita.com/karur4n/items/3d9d28f6f21c3533020d>

## `dependencies`

Include the following packages

* Packages required to run in production
* Packages required when building

In other words, you can create a production container image by installing only those packages included in `dependencies`.

## `devDependencies`

Include packages that do not fall into the above categories. For example

* Packages for test
* Packages for lint
