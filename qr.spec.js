'use strict';

var should = require('should');
var _ = require('lodash');
var qr = require('./qr');

describe('QR reader', function () {

  it('should find all 4 player', function (done) {
    this.timeout(30000);
    var player = {};

    qr.cb = function (playerName, x, y, playerColor, playerPosition) {
      player[playerName] = {
        color: playerColor,
        position: playerPosition
      };

      if (_.size(player) === 4) {
        _.size(player).should.be.exactly(4);
        done();
      }
    };

    qr.loadImage(__dirname + '/test-assets/qr-code-test.png');
  });
});
