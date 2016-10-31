import request from 'supertest-as-promised';
import server from '../src/server';
import config from '../src/config';
import { expect } from 'chai';
import util from 'util';

describe('Chapters', () => {
  const serverInstance = server.listen(config.port + 1);

  // Test Get Chapter Metadata by Id endpoint
  describe('GET /v1/chapters/:chapterId', async () => {
    it('should return metadata about a chapter', async () => {

      const response = await request(serverInstance)
        .get('/v1/chapters/1')
        .send();

      try {
        // TEST: a success code is returned
        expect(response.status === 200).to.be.true;

        // TEST: a single object should be returned, not a list
        expect(util.isArray(response.body)).to.be.false;

        // TEST: Surah Fatiha is Meccan
        expect(response.body.type).to.equal('Meccan');
      } catch (err) {
        // dump the full response for better diagnostics
        console.log(`Error: ${JSON.stringify(response, '  ')}`);
        throw new Error(err);
      }
    });

    it('should reject chapter ids that are out of range', async () => {

      const response = await request(serverInstance)
        .get('/v1/chapters/5000')
        .send();

      try {
        // TEST: an error code is returned
        expect(response.status === 500).to.be.true;
      } catch (err) {
        // dump the full response for better diagnostics
        console.log(`Error: ${JSON.stringify(response, '  ')}`);
        throw new Error(err);
      }
    });

    it('should reject chapter ids that are not found', async () => {

      const response = await request(serverInstance)
        .get('/v1/chapters/0')
        .send();

      try {
        // TEST: an error code is returned
        expect(response.status === 404).to.be.true;
      } catch (err) {
        // dump the full response for better diagnostics
        console.log(`Error: ${JSON.stringify(response, '  ')}`);
        throw new Error(err);
      }
    });

    it('should reject chapter ids that are not numbers', async () => {

      const response = await request(serverInstance)
        .get('/v1/chapters/;drop table chapter;')
        .send();

      try {
        // TEST: an error code is returned
        expect(response.status === 500).to.be.true;
      } catch (err) {
        // dump the full response for better diagnostics
        console.log(`Error: ${JSON.stringify(response, '  ')}`);
        throw new Error(err);
      }
    });
  });

  // Test Get Chapter Details by Id endpoint
  describe('GET /v1/chapters/:chapterId/details', async () => {
    it('should return details about a chapter', async () => {

      const response = await request(serverInstance)
        .get('/v1/chapters/1/details')
        .send();

      try {
        // TEST: a success code is returned
        expect(response.status === 200).to.be.true;

        // TEST: a single object should be returned, not a list
        expect(util.isArray(response.body)).to.be.false;

        // TEST: Surah Fatiha is Meccan
        expect(response.body.type).to.equal('Meccan');

        // TEST: verses are returned
        expect(util.isArray(response.body.verses)).to.be.true;

        // TEST: Surah Fatiha has 7 ayahs
        expect(response.body.verses.length).to.be.equal(7);

        // TEST: Arabic text of the 3rd ayah of Surah Fatiha matches
        expect(response.body.verses[2].ar).to.be.equal('ٱلرَّحْمَٰنِ ٱلرَّحِيمِ');
      } catch (err) {
        // dump the full response for better diagnostics
        console.log(`Error: ${JSON.stringify(response, '  ')}`);
        throw new Error(err);
      }
    });

    it('should reject chapter ids that are out of range', async () => {

      const response = await request(serverInstance)
        .get('/v1/chapters/5000/details')
        .send();

      try {
        // TEST: an error code is returned
        expect(response.status === 500).to.be.true;
      } catch (err) {
        // dump the full response for better diagnostics
        console.log(`Error: ${JSON.stringify(response, '  ')}`);
        throw new Error(err);
      }
    });

    it('should reject chapter ids that are not found', async () => {

      const response = await request(serverInstance)
        .get('/v1/chapters/0/details')
        .send();

      try {
        // TEST: an error code is returned
        expect(response.status === 404).to.be.true;
      } catch (err) {
        // dump the full response for better diagnostics
        console.log(`Error: ${JSON.stringify(response, '  ')}`);
        throw new Error(err);
      }
    });

    it('should reject chapter ids that are not numbers', async () => {

      const response = await request(serverInstance)
        .get('/v1/chapters/;drop table chapter;/details')
        .send();

      try {
        // TEST: an error code is returned
        expect(response.status === 500).to.be.true;
      } catch (err) {
        // dump the full response for better diagnostics
        console.log(`Error: ${JSON.stringify(response, '  ')}`);
        throw new Error(err);
      }
    });
  });

  // Test Get Chapters endpoint
  it('should return info about all chapters', async () => {

    const response = await request(serverInstance)
      .get('/v1/chapters')
      .send();

    try {
      // TEST: a success code is returned
      expect(response.status === 200).to.be.true;

      // TEST: a list is returned
      expect(util.isArray(response.body)).to.be.true;

      // TEST: There are 114 surahs
      expect(response.body.length).to.be.equal(114);

      // TEST: Surah Al-Nas is Meccan
      expect(response.body[response.body.length - 1].type).to.be.equal('Meccan');
    } catch (err) {
      // dump the full response for better diagnostics
      console.log(`Error: ${JSON.stringify(response, '  ')}`);
      throw new Error(err);
    }
  });
});
