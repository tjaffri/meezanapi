/**
 * meezanapi
 *
 * Copyright © 2016 Axis, the Information Professionals. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

import fs from 'fs-extra-promise';

const outDir = 'dist/debug';

// Execute as an IIFE: Immediately-Invoked Function Expression (IIFE)
(async function main() {
  try {
    // Clean up the output directory
    await fs.removeAsync(outDir);

    // copy package files
    await fs.copyAsync('src', outDir);
    await fs.copyAsync('package.json', `${outDir}/package.json`);
    await fs.copyAsync('web.config', `${outDir}/web.config`);

    // copy static files
    await fs.mkdirsAsync(`${outDir}/public`);
    await fs.copyAsync('src/public', `${outDir}/public`);
    await fs.mkdirsAsync(`${outDir}/public/docs`);
    await fs.copyAsync('swagger', `${outDir}/public/docs`);
    await fs.mkdirsAsync(`${outDir}/views`);
    await fs.copyAsync('src/views', `${outDir}/views`);
  } catch (error) {
    console.error(`Error: ${error}`); // eslint-disable-line no-console
  }
} ()); // eslint-disable-line no-spaced-func
