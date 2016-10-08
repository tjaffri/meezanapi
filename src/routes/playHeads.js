/**
 * meezanapi
 *
 * Copyright © 2016 Axis, the Information Professionals. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import catchErrors from 'async-error-catcher';
import express from 'express';

const router = new express.Router();
const db = {};

router.get('/:userId', catchErrors(async (req, res) => {
  // parse route parameters.
  const { userId } = req.params;

  // get the playHead state.
  const playHeadForUser = db[userId];
  if (!playHeadForUser) {
    // not found
    res.sendStatus(404);
  }

  return res.json(playHeadForUser);
}));

router.put('/:userId', catchErrors(async (req, res) => {
  // parse route parameters.
  const { userId } = req.params;

  // set the playHead state.
  db[userId] = req.body;
  return res.json(req.body);
}));

export default router;
