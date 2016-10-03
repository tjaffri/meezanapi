/**
 * meezan-api
 *
 * Copyright © 2016 Axis, the Information Professionals. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import catchErrors from 'async-error-catcher';
import express from 'express';
import Quran from 'quran-promise';

const router = new express.Router();

router.get('/', catchErrors(async (req, res) => {
  const quran = new Quran();
  const juz = await quran.juz();

  return res.json(juz);
}));

router.get('/:juzId', catchErrors(async (req, res, next) => {
  // parse route parameters
  const { juzId } = req.params;

  const quran = new Quran();
  const juz = await quran.juz(juzId);

  if (juz && juz.length) {
    // return the first juz found that matches juzId
    return res.json(juz[0]);
  }

  // if we made it this far, 404
  res.status(404);
  return next();
}));

export default router;
