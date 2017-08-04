(function ($ , undefined) {
    var userList = $('#shake_userList') ,
        sucFunc = function (retArr) {
            if(!retArr) return;
            var strArr = [];
            for(var i = 0 , obj ; obj = retArr[i++];){
              strArr.push("<li>" +  "<img src='" + obj.logo +"' />"  + "</li>");
            }
            userList.html(strArr.join(""));
        };
    $.get("data/data.json" , sucFunc);
})(jQuery);
