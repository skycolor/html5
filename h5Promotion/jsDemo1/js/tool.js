(function($) {			
	var defaults = {
		container : '#container', //容器
		sections : '.section', //子容器
		easing : 'ease', //特效方式
		duration : 500 ,//每次动画执行的时间
		tapCallBack : null ,//点击事件的回调函数
		switchEndCallBack : null //滑动结束后的回调函数
	};
	var win = $(window),
		container, sections , up;
	var opts = {},
		canScroll = true,
		iIndex = 0,
		arrElement = [];
	var timeScroll; //滚动间隔定时器
	var SP = $.fn.switchPage = function(options) {
		opts = $.extend({}, defaults, options || {});
		container = $(opts.container);
		sections = container.find(opts.sections);
		sections.each(function() {
			arrElement.push($(this));
		});
		return this.each(function() {
			var start = {x:0 , y:0},
				end = {x:0 , y:0};
			document.body.addEventListener('touchstart', function (event) {
				var touch = event.targetTouches[0];
				start.x = touch.pageX;
				start.y = touch.pageY;
				end.x = touch.pageX;
				end.y = touch.pageY;
			},false);
			document.body.addEventListener('touchmove', function (event) {
				event.preventDefault();
				var touch = event.targetTouches[0];
				end.x = touch.pageX;
				end.y = touch.pageY;
			},false);
			document.body.addEventListener('touchend', function () {
				event.preventDefault();
				if(!canScroll) return;
				if(start.y - end.y > 30){
					SP.moveSectionDown();
				}else if(end.y - start.y > 30){
					SP.moveSectionUp();
				}
				start = {x:0 , y:0};
				end = {x:0 , y:0};
			},false);
			//窗口Resize
			var resizeId;
			win.resize(function() {
				clearTimeout(resizeId);
				resizeId = setTimeout(function() {
					reBuild();
				}, 500);
			});
			//点击事件
			if(opts.tapCallBack && typeof opts.tapCallBack === "function"){
				$("body").on("tap" , function(){
					opts.tapCallBack(iIndex);
				})
			}
			//动画
			container.css({
				"-webkit-transition": "all " + opts.duration + "ms " + opts.easing,
				"transition": "all " + opts.duration + "ms " + opts.easing
			});
		});
	};
	//滚轮向上滑动事件
	SP.moveSectionUp = function() {
		if (iIndex) {
			iIndex--;
			scrollPage(arrElement[iIndex]);
		}
	};
	//滚轮向下滑动事件
	SP.moveSectionDown = function() {
		if (iIndex < (arrElement.length - 1)) {
			iIndex++;
			scrollPage(arrElement[iIndex]);
		}
	};
	//页面滚动事件
	function scrollPage(element) {
		var dest = element.position();
		if (typeof dest === 'undefined') {
			return;
		}
		initEffects(dest, element);
	}
	//渲染效果
	function initEffects(dest, element) {
		var endFun = function(){
			canScroll = true;
			if(opts.switchEndCallBack && typeof opts.switchEndCallBack === "function"){
				opts.switchEndCallBack(iIndex);
			}
		};
		canScroll = false;
		var traslate = "0px, -" + dest.top + "px";
		container.css({
			"-webkit-transform": "translate(" + traslate + ")",
			"transform": "translate(" + traslate + ")"
		});
		// 一定时间间隔后，允许第二次滚动
		clearTimeout(timeScroll);
		timeScroll = setTimeout(function() {
			endFun();
		}, opts.duration);
	}
	//屏幕大小变动后调用
	function reBuild() {
		var currentHeight = win.height(),
			currentWidth = win.width();
		var element = arrElement[iIndex];
		var offsetTop = element.offset().top;
		if (Math.abs(offsetTop) > currentHeight / 2 && iIndex < (arrElement.length - 1)) {
			iIndex++;
		}
		if (iIndex) {
			var cuerrentElement = arrElement[iIndex],
				dest = cuerrentElement.position();
			initEffects(dest, cuerrentElement);
		}
	}
})($);
(function(window,undefind){	//图片加载控件
	function imgLoad(options){
		var defaults = {
			imgArr : [],		//图片数组
			loadOverCallback : null		//加载完成的回调函数
		};
		var opts = $.extend(true , defaults , options || {}),
			imgSize = opts.imgArr.length, //需要加载图片的个数
			completeSize = 0;
		function beginLoad() {
			for (var index in opts.imgArr) {
				var src = opts.imgArr[index];
				src && loadImg(src);
			}
		}
		function loadImg(src) {		//加载图片
			var image = new Image(),
				handleLoadOver = function() {
					completeSize++;
					checkLoadOver();
				};
			image.src = src;
			if (image.complete) { //图片有缓存
				handleLoadOver();
			} else {
				image.onload = function() { //图片获取成功
					handleLoadOver();
				};
			}
		}
		function checkLoadOver() {	//查询是否已经加载完毕
			if (completeSize != imgSize) return;
			if(opts.loadOverCallback && typeof opts.loadOverCallback === "function"){
				opts.loadOverCallback();
			}
		}
		beginLoad()//开始执行
	}
	window.imgLoad = imgLoad;
})(window);
