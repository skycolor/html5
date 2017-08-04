(function ($ , undefined) {

    main();
var t = 1;
    function main(){      //页面主函数
        setHeight();
        initShow();
        roundReq();
    }

    function setHeight(){     //设置头部和底部的高度
      var bodyH = $('#wrap').height(), afterH = bodyH - 482;
      $('.shake-ing-top').css({height: (afterH * 0.51 )});
      $('.shake-ing-bottom').css({height: afterH * 0.49});
    }

    function initShow(){      //初始化显示
      var lis = $("#mainUl").find("li"),
        sucFunc = function (retArr) {
          if(!retArr) return;
          for(var i = 0 ; i < retArr.length ; i++){
            var obj = retArr[i];
            lis.eq(i).show().find("img").attr("src" , obj.logo).end().attr("data-id" , obj.id);
          }
        };
      $.get("data/data1.json" , sucFunc);
    }

    function roundReq(){      //轮循
      var timer , ul = $("#mainUl"), leftOverTime = $("#leftOverTime") , liH = ul.find("li").eq(0).height(),
          roundFunc = function () {
            var max = 200 ,
                sucFunc = function (retArr) {
                  t++;
                  if(!retArr) return;
                  for(var i = 0 ; i < retArr.length ; i++){
                      var obj = retArr[i] ,
                          leftPer = Math.round(((Math.random()*200)/max)*100);
                        leftPer = leftPer > 100 ? 100 : leftPer;
                      var li = ul.find("li[data-id='" + obj.id +"']").find(".run").css("left" ,  leftPer + "%")
                          .end().find(".js_shakeNum").text(leftPer*2).end();
                      var newRank = i + 1;
                      var oldRand = parseInt(li.attr("data-rank_id"));
                      if(oldRand != newRank){      //名次有变化
                        moveY(oldRand , newRank , li);
                        li.attr("data-rank_id" , newRank)
                      }
                  }
                };
            $.get("data/data" +  t + ".json" , sucFunc);
            countDown(leftOverTime);
          };
      timer = setInterval(roundFunc , 2000);


      function countDown(leftOverTime){     //倒计时
        leftOverTime.text(parseInt(leftOverTime.text()) - 1);
        if(parseInt(leftOverTime.text()) <= 0){      //比赛结束
          clearInterval(timer);
        }
      }

      function getMoveY(unit, tr){        //获取移动的距离
          var oldY = parseFloat(tr.css("y")) || 0;
          return liH * unit + oldY
      }

      function moveY(now, to , tr){     //上下移动赛车
        var y = getMoveY(to - now, tr);
        tr.css({
          transformOrigin: "0 0"
        }).transition({
          y: y,
          easing: "snap",
          x: -50,
          duration: 500,
          scale: 1.4,
          complete: function () {
            $(this).transition({
              scale: 1,
              x: 0,
              duration: 100
            })
          }
        })
      }

    }

})(jQuery);
