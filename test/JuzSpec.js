import request from 'supertest-as-promised';
import server from '../src/server';
import config from '../src/config';
import { expect } from 'chai';
import util from 'util';

describe('Juz', () => {
  const serverInstance = server.listen(config.port + 2);

  // Test Get Juz by Id endpoint
  describe('GET /juz/:juzId', async () => {
    it('should return info about a juz', async () => {

      const response = await request(serverInstance)
        .get('/juz/28')
        .send();

      try {
        // TEST: a success code is returned
        expect(response.status === 200).to.be.true;

        // TEST: a single object should be returned, not a list
        expect(util.isArray(response.body)).to.be.false;

        // TEST: 28rd juz starts from surah 58, ayat 1
        expect(response.body.surah).to.equal(58);
        expect(response.body.ayah).to.equal(1);
      } catch (err) {
        // dump the full response for better diagnostics
        console.log(`Error: ${JSON.stringify(response, '  ')}`);
        throw new Error(err);
      }
    });

    it('should reject juz ids that are out of range', async () => {

      const response = await request(serverInstance)
        .get('/juz/5000')
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

    it('should reject juz ids that are not found', async () => {

      const response = await request(serverInstance)
        .get('/juz/0')
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

    it('should reject juz ids that are not numbers', async () => {

      const response = await request(serverInstance)
        .get('/juz/;drop table juz;')
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

  // Test Get Juz endpoint
  it('should return info about all juz', async () => {

    const response = await request(serverInstance)
      .get('/juz')
      .send();

    try {
      // TEST: a success code is returned
      expect(response.status === 200).to.be.true;

      // TEST: a list is returned
      expect(util.isArray(response.body)).to.be.true;

      // TEST: There are 30 juz, but this query returns 31 entires
      // since it demarcates when the start and end
      expect(response.body.length === 31);

      // TEST: Last juz starts from surah 78, ayat 1
      expect(response.body[29].surah).to.be.equal(78);
      expect(response.body[29].ayah).to.be.equal(1);

      // TEST: Last juz ends at the end of the quran (surah 114)
      expect(response.body[30].surah).to.be.equal(115);
      expect(response.body[30].ayah).to.be.equal(1);
    } catch (err) {
      // dump the full response for better diagnostics
      console.log(`Error: ${JSON.stringify(response, '  ')}`);
      throw new Error(err);
    }
  });
});
