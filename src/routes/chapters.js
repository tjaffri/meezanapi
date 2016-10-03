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

// helper function to convert database objects to API response format
function convertToApiFormat(object) {
  delete object.rukus;

  object.name = {
    ar: object.arname,
    arroman: object.tname,
    en: object.enname,
  };

  delete object.arname;
  delete object.tname;
  delete object.enname;

  return object;
}

router.get('/', catchErrors(async (req, res) => {
  const quran = new Quran();
  const chaptersInDb = await quran.chapters();

  // convert all object to API format before returning
  const chapters = [];
  for (const chapter of chaptersInDb) {
    chapters.push(convertToApiFormat(chapter));
  }

  return res.json(chapters);
}));

router.get('/:chapterId', catchErrors(async (req, res, next) => {
  // parse route parameters
  const { chapterId } = req.params;

  const quran = new Quran();
  const chapters = await quran.chapters(chapterId);

  if (!chapters || !chapters.length) {
    res.status(404);
    next();
  }

  // return the first chapter found that matches chapterId
  return res.json(convertToApiFormat(chapters[0]));
}));

router.get('/:chapterId/details', catchErrors(async (req, res, next) => {
  // parse route parameters
  const { chapterId } = req.params;

  const quran = new Quran();
  const chapters = await quran.chapters(chapterId);

  if (chapters && chapters.length) {
    // return the first chapter found that matches chapterId
    // and include the actual verses in the chapter
    const chapterDetails = convertToApiFormat(chapters[0]);
    const versesInDb = await quran.get(chapterDetails.id);

    // convert all object to API format before returning
    chapterDetails.verses = [];
    for (const verse of versesInDb) {
      chapterDetails.verses.push({ ar: verse });
    }

    return res.json(chapterDetails);
  }

  // if we made it this far, 404
  res.status(404);
  return next();
}));

export default router;
