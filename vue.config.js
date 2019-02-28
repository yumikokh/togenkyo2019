const path = require("path");
const readConfig = require("read-config");

const defaultMeta = readConfig("src/const/meta.yaml");
const settings = readConfig("src/const/settings.yaml");

module.exports = {
  lintOnSave: false,
  publicPath: settings.base_path,
  outputDir: `${settings.output_dir}/${settings.base_path}`,
  pages: {
    index: {
      entry: "src/main.js",
      template: "src/pug/index.pug",
      filename: "index.html"
    }
  },
  css: {
    loaderOptions: {
      sass: {
        data: `@import "~@scss-modules";`
      }
    }
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.pug$/,
          oneOf: [
            // this applies to `<template lang="pug">` in Vue components
            {
              resourceQuery: /^\?vue/,
              use: ["pug-plain-loader"]
            },
            // this applies to pug imports inside JavaScript
            {
              use: [
                "raw-loader",
                {
                  loader: "pug-plain-loader",
                  options: {
                    root: path.resolve("src/pug/"),
                    data: defaultMeta
                  }
                }
              ]
            }
          ]
        },
        {
          test: /\.(yml|yaml)$/,
          include: path.resolve("src/const/"),
          use: ["json-loader", "yaml-loader"]
        }
      ]
    },
    resolve: {
      alias: {
        // - NOTE: @なしだとcompile errorになる
        "@img": path.join(__dirname, "src/assets/images"),
        "@audio": path.join(__dirname, "src/assets/audio"),
        "@scss-modules": path.join(__dirname, "src/scss/_common.scss")
      }
    }
  },
  chainWebpack: config => {
    // もともとのpugのloader設定を削除
    config.module.rule("pug").uses.clear();

    // ダブルクオーテーションつける
    config.plugin("html-index").tap(args => {
      args[0].minify = {
        removeComments: false,
        collapseWhitespace: false,
        removeAttributeQuotes: false,
        collapseBooleanAttributes: false,
        removeScriptTypeAttributes: false
      };
      return args;
    });
  }
};
