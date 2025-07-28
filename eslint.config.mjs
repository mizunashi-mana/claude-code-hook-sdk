import { defineConfig } from 'eslint/config';
import eslintCommentsConfig from './eslint/eslint-comments.config.mjs';
import globalsConfig from './eslint/globals.config.mjs';
import importsConfig from './eslint/imports.config.mjs';
import jsConfig from './eslint/js.config.mjs';
import nodeConfig from './eslint/node.config.mjs';
import pluginsConfig from './eslint/plugins.config.mjs';
import promiseConfig from './eslint/promise.config.mjs';
import tsConfig from './eslint/ts.config.mjs';

export default defineConfig([
  globalsConfig,
  pluginsConfig,
  eslintCommentsConfig,
  promiseConfig,
  nodeConfig,
  importsConfig,
  jsConfig,
  tsConfig,
]);
