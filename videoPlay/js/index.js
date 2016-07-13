(function(window , document , undefined){
	var videos = $("#videos") , videoFrame1 = $(".videoFrame1") , videoFrame2 = $(".videoFrame2") ,
		video1Dom = document.getElementById("video1") , video2Dom = document.getElementById("video2") ,
		tip = $(".tip") , will = $(".will") , page1 = $(".page1") , end = $(".end") ,
		isiOSV8 = !! navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
	init();
	function init(){		//初始化
		handleImgLoad();
		handleEvent();
	}
	function handleImgLoad(){	//	处理图片加载
		var loading = $("#loading") , loadingTip = $("#loadingTip") , perImg = $("#perImg") ,
			loadOverFunc = function(){
				perImg.css({
					width : "600px" ,
					height : "600px"
				});
				setTimeout(function(){
					loading.fadeOut(200);
					setTimeout(function(){
						loading.remove();
						console.log("imgs load over");
						handleFirstMp4Play();
					} , 200);
				} , 800);
			} ,
			singleOverFunc = function(completeSize , totalSize){
				loadingTip.text(((completeSize/totalSize)*100).toFixed(0) + "%");	
			};
		window.imgLoad({
			imgArr : ["img/m_start.jpg" , "img/m_middle.jpg" , "img/quan.png" , 
				"img/willing.png" , "img/end.jpg" , "img/m_start_android.png"] ,
			loadOverCallback : loadOverFunc ,
			singleOverCallback : singleOverFunc
		});
	}
	function handleFirstMp4Play(){		//处理第一个视频播放
		console.log("part1 mp4 play");
		videos.fadeIn(200);
		videoFrame1.show();
		if(isiOSV8){
			video1Dom.play();
		}else{
			$(video1Dom).css({
				display: "block"
			});
			$(".androidBegin").show();
			$(".androidBegin").bind("touchstart", function(a) {
				video1Dom.play();
				setTimeout(function() {
					video1Dom.currentTime = 1;
					video1Dom.play();
				}, 100)
				$(".androidBegin").hide();
				$(video1Dom).unbind("touchstart");
			})
		}
	}
	function handleEvent(){		//处理事件
		preventBodySroll();
		video1Dom.addEventListener("ended" , function(){
			videoFrame1.remove();
			page1.show();
			tip.show();
			will.show();
			will[0].addEventListener("tap" , function(e){
				console.log("to next");
				page1.remove();
				tip.remove();
				will.remove();
				videoFrame2.show();
				$(video2Dom).attr("poster" , "img/m_middle.jpg")
							.attr("src" , "http://oa8ehb9yo.bkt.clouddn.com/ml2.mp4");
				video2Dom.play();
				video2Dom.addEventListener("ended" , function(){
					videos.remove();
					end.fadeIn(300);
				})
			})
		    videoFrame1.remove();
	    },false);
		function preventBodySroll(){		//阻止页面滚动
			document.body.addEventListener('touchmove', function (event) {
				event.preventDefault();
			},false);
			document.body.addEventListener('touchend', function () {
				event.preventDefault();
			},false);
		}
	}
})(window , document);
