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

router.get('/', catchErrors(async (req, res) => res.json(db)));

router.get('/:userId', catchErrors(async (req, res) => {
  // parse route parameters.
  const { userId } = req.params;

  // get the playHead state.
  const playHeadForUser = db[userId];
  if (!playHeadForUser) {
    // not found
    return res.sendStatus(404);
  }

  return res.json(playHeadForUser);
}));

router.put('/:userId', catchErrors(async (req, res) => {
  // parse route parameters.
  const { userId } = req.params;

  // set the playHead state.
  db[userId] = req.body;
  return res.json(db[userId]);
}));

router.delete('/:userId', catchErrors(async (req, res) => {
  // parse route parameters.
  const { userId } = req.params;

  if (!db[userId]) {
    return res.sendStatus(404);
  }

  // delete the playHead state if found.
  delete db[userId];
  return res.sendStatus(200);
}));

export default router;
