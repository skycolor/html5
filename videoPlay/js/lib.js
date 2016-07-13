(function(window, undefind) { //图片加载控件
	function imgLoad(options) {
		var defaults = {
			imgArr: [], //图片数组
			loadOverCallback: null , //加载完成的回调函数
			singleOverCallback : null //单个加载完成
		};
		var opts = $.extend(true, defaults, options || {}),
			imgSize = opts.imgArr.length, //需要加载图片的个数
			completeSize = 0;
		function beginLoad() {
			for (var index in opts.imgArr) {
				var src = opts.imgArr[index];
				src && loadImg(src);
			}
		}
		function loadImg(src) { //加载图片
			var image = new Image(),
				handleLoadOver = function() {
					completeSize++;
					if (opts.singleOverCallback && typeof opts.singleOverCallback === "function") {
						opts.singleOverCallback(completeSize , opts.imgArr.length);
					}
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
		function checkLoadOver() { //查询是否已经加载完毕
			if (completeSize != imgSize) return;
			if (opts.loadOverCallback && typeof opts.loadOverCallback === "function") {
				opts.loadOverCallback();
			}
		}
		beginLoad() //开始执行
	}
	window.imgLoad = imgLoad;
})(window);