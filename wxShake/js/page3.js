(function ($ , undefined) {
    var userWinner = $(".user-winner") , otherRankBox = $("#shake_otherRankBox") ,
        map = {3 : "四" , 4 : "五" , 5 : "六" , 6 : "七" , 7 : "八" , 8 : "九" , 9 : "十"} ,
        sucFunc = function (retArr) {
            if(!retArr) return;
            var htmlArr = [];
            for(var i = 0 ; i < retArr.length ; i++){
              var obj = retArr[i];
              if(i <= 2){   //头三名
                userWinner.eq(i).show().find('.shake_winnerName').text(obj.name).siblings("img").attr("src" , obj.logo);
              }else{
                htmlArr.push("<li>" +  "<img src='" + obj.logo  +"' />" + "<span>" + obj.name +"</span><em>第" + map[i] +"名</em></li>")
              }
            }
            otherRankBox.html(htmlArr.join(""))
        };
    $.get("data/data.json" , sucFunc);
})(jQuery);
