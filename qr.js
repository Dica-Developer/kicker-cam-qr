var Canvas = require('canvas');
var Image = Canvas.Image;
var qrcode = require('jsqrcode')(Canvas);
var exec = require('child_process').exec;

var canvas = new Canvas();

function QrReader() {
}

QrReader.prototype = {
  findPlayer: function (item, cb) {
    console.time('find player');
    var image = item[0];
    var sx = item[1];
    var sy = item[2];
    var dx = item[3];
    var dy = item[4];
    var playerColor = item[5];
    var playerPosition = item[6];
    var qrCodeSizeX = 249;
    var qrCodeSizeY = 249;
    canvas.width = qrCodeSizeX;
    canvas.height = qrCodeSizeY;

    var result = null;

    for (var y = sy; y < (sy + dy); y = y + 5) {
      for (var x = sx; x < (sx + dx); x = x + 5) {
        try {
          canvas.getContext('2d').drawImage(image, x, y, qrCodeSizeX, qrCodeSizeY, 0, 0, canvas.width, canvas.height);
          result = qrcode.decode(canvas);
          console.timeEnd('find player');
          if(result){
            break;
          }
        } catch (e) {
          //console.log('unable to read qr code:', e);
        }
      }
      if(result){
        break;
      }
    }
    if(result){
      cb(result, x, y, playerColor, playerPosition);
    }
    console.timeEnd('find player');
  },

  loadImage: function (filename, cb) {
    var _this = this;
    var image = new Image();
    image.onload = function () {
      _this.findPlayer([image, 0, 0, 200, 200, 'blue', 'offense'], cb);
      _this.findPlayer([image, image.width - 400, 0, 200, 200, 'blue', 'defense'], cb);
      _this.findPlayer([image, 0, image.height - 400, 200, 200, 'red', 'defense'], cb);
      _this.findPlayer([image, image.width - 400, image.height - 400, 200, 200, 'red', 'offense'], cb);
      image.onload = null;
      console.log('image loaded and analyzing started');
    };
    image.src = filename;
  },

  start: function () {
    var _this = this;
    console.time('grab qrcodes from video');
    //_this.loadImage('./kickerQrCodeTest10.png');
    exec('mplayer http://192.168.178.50:8080/ -endpos 00:00:01 -vo png', function (error, stdout, stderr) {
      console.timeEnd('grab qrcodes from video');
      _this.loadImage('./00000001.png');
      if (error !== null) {
        console.log(stdout);
        console.error(stderr);
        console.log('exec error:', error);
      }
    });
  }
};


module.exports = QrReader;
