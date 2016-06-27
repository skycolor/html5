!(function() {
	var imgSrcs = ["img/1.jpg" , "img/2.jpg" , "img/3.jpg"];
	window.imgLoad({
		imgArr: imgSrcs,
		loadOverCallback: init
	});
	function init() { //页面初始化
		removeLoading();
		initShow();
		swipeEffect();
	}
	function removeLoading(){
		$("#loading").remove();
		$("#container").css("display" , "");
		$("#up").css("display" , "");
	}
	function initShow(){
		var htmlArr = [];
		for (var index in imgSrcs) {
			var src = imgSrcs[index];
			htmlArr.push("<div class='section' style='background-image: url(" + src + ");' >");
			htmlArr.push("</div>")
		}
		$("#container").html(htmlArr.join(""));
	}
	function swipeEffect(){
		$("#container").switchPage({
			container : '#container',
			sections : '.section',
			easing : 'ease',
			duration : 800 
		});
	}
})()