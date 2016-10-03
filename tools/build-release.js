/**
 * Babel Starter Kit (https://www.kriasoft.com/babel-starter-kit)
 *
 * Copyright © 2015-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

import fs from 'fs-extra-promise';
import rollup from 'rollup';
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import pkg from '../package.json';

const outDir = 'dist/release';

// Transpile source code into a distributable format with Babel.
async function transpile() {
  for (const format of ['es6', 'cjs', 'umd']) {
    // bundle the source.
    const bundle = await rollup.rollup({
      entry: 'src/app.js',
      external: Object.keys(pkg.dependencies),
      plugins: [
        json(),
        babel(Object.assign(pkg.babel, {
          babelrc: false,
          exclude: 'node_modules/**',
          runtimeHelpers: true,
          presets: pkg.babel.presets.map(x => (x === 'es2015' ? 'es2015-rollup' : x)),
        })),
      ],
    });

    // write the bundle, generating source maps.
    await bundle.write({
      dest: `${outDir}/${format === 'cjs' ? 'app' : `app.${format}`}.js`,
      format,
      sourceMap: true,
      moduleName: format === 'umd' ? pkg.name : undefined,
    });
  }
}

// Copy package files: package.json, config.json, web.config, static files, etc.
async function copyPackageFiles() {
  delete pkg.devDependencies;
  delete pkg.scripts;
  delete pkg.eslintConfig;
  delete pkg.babel;

  // copy files that live in root of the repository
  await fs.writeFileAsync(`${outDir}/package.json`, JSON.stringify(pkg, null, '  '), 'utf-8');
  await fs.writeFileAsync(`${outDir}/config.json`,
    await fs.readFileAsync('src/config.json', 'utf-8'), 'utf-8');
  await fs.copyAsync('web.config', `${outDir}/web.config`);

  // copy static files
  await fs.mkdirsAsync(`${outDir}/public`);
  await fs.copyAsync('src/public', `${outDir}/public`);
  await fs.mkdirsAsync(`${outDir}/public/docs`);
  await fs.copyAsync('swagger', `${outDir}/public/docs`);
  await fs.mkdirsAsync(`${outDir}/views`);
  await fs.copyAsync('src/views', `${outDir}/views`);
}

// Execute as an IIFE: Immediately-Invoked Function Expression (IIFE)
(async function main() {
  try {
    // Clean up the output directory
    await fs.removeAsync(outDir);

    // transpile with babel
    await transpile();

    // copy package files
    await copyPackageFiles();
  } catch (error) {
    console.error(`Error: ${error}`); // eslint-disable-line no-console
  }
} ()); // eslint-disable-line no-spaced-func
