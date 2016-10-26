/**
 * meezanapi
 *
 * Copyright © 2016 Axis, the Information Professionals. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import appRootDir from 'app-root-dir';
import fs from 'fs-extra-promise';
import express from 'express';
import catchErrors from 'async-error-catcher';

const router = new express.Router();
const packageFilePath = `${appRootDir.get()}/package.json`;

/* GET home page. */
router.get('/', catchErrors(async (req, res) => {
  const packageFileContents = await fs.readFileAsync(packageFilePath, 'utf-8');
  const pkgVersion = JSON.parse(packageFileContents).version;
  res.render('index', { title: 'Meezan API', version: pkgVersion });
}));

export default router;
