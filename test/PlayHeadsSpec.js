import request from 'supertest-as-promised';
import server from '../src/server';
import config from '../src/config';
import { expect } from 'chai';
import util from 'util';

describe('PlayHeads', () => {
  const serverInstance = server.listen(config.port + 3);

  // Test Get Set/Get PlayHeads endpoint
  describe('GET /playHeads/:userId', async () => {
    it('should return a playHead that is set', async () => {

      // Set a test value.
      const putResponse = await request(serverInstance)
        .put('/playHeads/123')
        .send({ test: 456 });

      try {
        // TEST: a success code is returned
        expect(putResponse.status === 200).to.be.true;

        // TEST: a single object should be returned, not a list
        expect(util.isArray(putResponse.body)).to.be.false;

        // TEST: the payload that was set is returned back
        expect(putResponse.body.test).to.equal(456);

        // Get the test value back
        const getResponse = await request(serverInstance)
          .get('/playHeads/123')
          .send();

        try {
          // TEST: a success code is returned
          expect(getResponse.status === 200).to.be.true;

          // TEST: a single object should be returned, not a list
          expect(util.isArray(getResponse.body)).to.be.false;

          // TEST: the payload that was set is returned back
          expect(getResponse.body.test).to.equal(456);
        } catch (err) {
          // dump the full response for better diagnostics
          console.log(`Error (GET): ${JSON.stringify(getResponse, '  ')}`);
          throw new Error(err);
        }
      } catch (err) {
        // dump the full response for better diagnostics
        console.log(`Error (PUT): ${JSON.stringify(putResponse, '  ')}`);
        throw new Error(err);
      }
    });
  });
});
