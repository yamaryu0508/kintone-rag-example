import * as esbuild from 'esbuild';
import s3PutObjectPlugin from 'esbuild-s3-put-object-plugin';

import { defaultParams } from './default-build-params.js';

const { JS_DEV_REGION, JS_DEV_BUCKET } = process.env;
const PLUGIN_NAME = 'customize/kintone-rag-frontend';

const params = {
  ...defaultParams,
  minify: false,
  plugins: [
    s3PutObjectPlugin({
      Region: JS_DEV_REGION,
      Bucket: JS_DEV_BUCKET,
      Key: `${PLUGIN_NAME}/js/desktop.js`,
      FilePath: './dist/js/desktop.js'
    })
  ]
};

const ctx = await esbuild.context(params);
await ctx.watch();
console.log('watching...');
