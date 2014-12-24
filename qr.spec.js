'use strict';

var should = require('should');
var _ = require('lodash');
var Reader = require('./qr');

describe('QR reader', function () {

  it('should find all 4 player', function (done) {
    this.timeout(10000);
    var player = {},
      qr = new Reader();

    var callback = function (playerName, x, y, playerColor, playerPosition) {
      player[playerName] = {
        color: playerColor,
        position: playerPosition
      };

      if (_.size(player) === 4) {
        _.size(player).should.be.exactly(4);
        done();
      }
    };

    qr.loadImage(__dirname + '/test-assets/qr-code-test.png', callback);
  });

  it('should find player with correct position and color', function (done) {
    this.timeout(10000);
    var player = {},
      qr = new Reader();

    var callback = function (playerName, x, y, playerColor, playerPosition) {
      player[playerName] = {
        color: playerColor,
        position: playerPosition
      };

      if (_.size(player) === 4) {
        var player1 = player['TwerkJörg'],
          player2 = player['mascha'],
          player3 = player['3Dfx'],
          player4 = player['Slava'];

        player1.color.should.eql('red');
        player2.color.should.eql('blue');
        player3.color.should.eql('blue');
        player4.color.should.eql('red');


        player1.position.should.eql('offense');
        player2.position.should.eql('offense');
        player3.position.should.eql('defense');
        player4.position.should.eql('defense');
        done();
      }
    };

    qr.loadImage(__dirname + '/test-assets/qr-code-test.png', callback);
  });
});
