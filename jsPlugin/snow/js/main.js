(function(window, document, undefined) {
  function snow(options) {
    var opts = options || {
        ele : document.body ,
        totalSnowNum : 100 ,
        snowImgSrc : "http://img2.wushang.com/img/2015/12/27/9420396_100X100.png" ,
        minPicSize : 17 ,
        maxPicSize : 20 ,
        minR : 5 ,
        maxR : 7 ,
        startColor : "rgba(253,252,251,1)" ,
        endColor : "rgba(251,252,253,0.3)"
    }
    var canvas = document.createElement('canvas'),
      ctx = canvas.getContext('2d'),
      windowW = document.body.clientWidth,
      windowH = document.body.clientHeight,
      imgObj;
    init();

    function init() { //初始化
      initCanvasEle();
      initAnimateFrameAndBodyEvent();
      loadSnowImg();
    }

    function initAnimateFrameAndBodyEvent() { //初始化运动时帧函数
      window.animate = (function() {
        return window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          function(callback) {
            window.setTimeout(callback, 1000 / 60);
          };
      })();
      document.body.addEventListener('touchmove', function(e) {
        e.preventDefault();
      }, false);
    }

    function initCanvasEle() { //初始化canvas样式
      canvas.style.position = 'fixed';
      canvas.style.left = canvas.style.top = 0;
      canvas.width = windowW;
      canvas.height = windowH;
      opts.ele.appendChild(canvas);
    }

    function loadSnowImg() { //加载雪花图片
      var snowImgSrc = opts.snowImgSrc || "http://img2.wushang.com/img/2015/12/27/9420396_100X100.png";
      imgObj = new Image();
      imgObj.onload = function() {
        startSnow()
      }
      imgObj.src = snowImgSrc;
    }

    function startSnow() { //下雪主函数
      var snowType = {
          pic: 1,
          cir: 2
        }, //type 1 为图片 ，type 2 为圆形
        totalSnowNum = opts.totalSnowNum || 100,
        snowsArr = [];

      function start() { //开始
        initAllObj();
        animateMain();
      }

      function initAllObj() { //初始化所有的对象
        for (var index = 0; index < totalSnowNum; index++) {
          var snow = new SnowObj();
          snowsArr.push(snow._reset());
        }
      }

      function animateMain() { //动画主函数
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var index = 0, snow; snow = snowsArr[index++];)
          snow._draw()._move();
        window.animate(animateMain);
      }

      function getRandomFromScope(min, max) { //获取某一个范围中的随机数
        return (min + parseInt(Math.random() * (max - min)));
      }

      function SnowObj() { //雪花对象
        this.resetNum = 0;
      }
      SnowObj.prototype = {
        _reset: function() { //雪花位置重置
          this.resetNum++;
          this.snowType = Math.ceil(Math.random() * 2);
          this.vy = 1 + 1 * Math.random();
          this.y = getRandomFromScope((-canvas.height * 2 / 3), canvas.height / 3);
          return this.snowType == snowType.pic ? this._resetPic() :
            this._resetCir();
        },
        _resetPic: function() { //重置图片雪花
          this.w = this.h = getRandomFromScope(opts.minPicSize || 17 , opts.maxPicSize || 20);
          this.vx = -Math.random() * 2.5;
          this.x = this.resetNum > 1 ? getRandomFromScope(canvas.width, (3 * canvas.width) / 2) :
            getRandomFromScope((canvas.width / 2), (3 * canvas.width) / 2);
          return this;
        },
        _resetCir: function() { //重置圆形雪花
          this.r = getRandomFromScope(opts.minR || 5 , opts.maxR || 7);
          this.vx = Math.random() * 2.5;
          this.x = this.resetNum > 1 ? getRandomFromScope((-canvas.width / 2), 0) :
            getRandomFromScope((-canvas.width / 2), (canvas.width / 2));
          return this;
        },
        _move: function() { //雪花位置移动
          this.x += this.vx;
          this.y += this.vy;
          if (this.x < -this.w || this.x > windowW + this.w || this.y > windowH)
            this._reset();
          return this;
        },
        _draw: function() { //绘制雪花(区分图片和圆形)
          return this.snowType == snowType.pic ? this._drawPic() : this._drwaCir();
        },
        _drawPic: function() { //绘制图片状的雪花
          ctx.beginPath();
          ctx.drawImage(imgObj, 0, 0, imgObj.width, imgObj.height, this.x, this.y, this.w, this.h);
          ctx.closePath();
          return this;
        },
        _drwaCir: function() { //绘制圆形的雪花
          ctx.save();
          ctx.beginPath();
          ctx.fillStyle = this._getGradient();
          ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
          ctx.fill();
          ctx.closePath();
          ctx.restore();
          return this;
        },
        _getGradient: function() { //获取渐变色
          var grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r - 1);
          grad.addColorStop(0, opts.startColor || "rgba(253,252,251,1)");
          grad.addColorStop(1, opts.endColor || "rgba(251,252,253,0.3)");
          return grad;
        }
      }
      start();
    }
  }
  window.snow = snow;

})(window, document);
