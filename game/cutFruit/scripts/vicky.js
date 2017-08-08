//整个游戏加载
window.onload = function(){
		$(".start_page").show();
		$(".canvas_page").hide()
}

//入场动画初始化
$(function(){
	new WOW().init();
})

/**********流程start**********/
$(function(){
var publicConfig = {
	url: "http://www.wushang.com/",
	//url:"http://219.140.62.244/",
	//url: "http://vote.wushang.com/",
	package:"mobileApp"
};
var publicFun = {
	requestData : function (reqUrl , reqParam , dataType , sucFun , errFun) {
		$.ajax({
			url : reqUrl ,
			type : "post" ,
			data : reqParam,
			dataType : dataType ,
			timeout : 30000 ,
			success : function(ret) {
				if(sucFun && typeof sucFun == "function") sucFun(ret);
			},
			error: function(){
				messageBox.init({msg:"网站抽筋，请稍后再试",isNetLoading:false,confirmBtn:false});
				if(errFun && typeof errFun == "function") errFun();
			}
		});
	} ,
	isNull:function(param){     /*判断是否为NULL*/
		return !(!!param);
	}
};
	  
 	//开始按钮
	$(".startBtn").bind("click touchend",function(){
		  	       $(".start_page").hide();
		$(".loading_page").show();
		$(".loading_page").hide();
			$(".canvas_page").show();
//		     $.ajax({
//          url:publicConfig.url+"androidMobileTemplate/serverHandlers/getUser.jsx",
//          type:"post",
//          dataType:"json",
//          success:function(res){
//              if (res.state == "noUser"){
//                  msgbox("亲，请先登录");
//                  setTimeout(function () {
//                      window.location.href = publicConfig.url + publicConfig.package
//                          + "/jump.jsx?htmlName=login/login"
//                  } , 1200);
//              }
//              else{
// 
//              }
//          },
//          error:function(){
//             msgbox("服务器异常");
//          }
//      });
	});
	 
clearInterval(countInt);
	//查看排行榜按钮 
	    var isRequsting=false;
	$(".viewBtn").bind("click touchend",function(){
//		   if(isRequsting) return
//		      var requestUrl = publicConfig.url +"MobilePromotion/serverHandlers/lottery/gameLottery.jsx",
//              param={lotteryId:"Lottery_Awards_830000"},
//              sucFunc = function (res) {
//                  isRequsting=false;
//                  if(res.code == "ok"){
//                      msgbox(res.msg);
//                  }else{
//                       msgbox(res.msg);
//                  }
//              };
//          isRequsting=true;
//          publicFun.requestData(requestUrl , param , 'json' , sucFunc,function(){
//              isRequsting=false;
//          });
	})
    //再切一次按钮
   $(".againBtn").bind("click touchend",function(){
   		window.location.reload(); //刷新页面

   })

})


