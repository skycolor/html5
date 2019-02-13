(function(window, document, undefined) {
	"use strict"
	var canvas = document.getElementById("canvas"),
		btnsContainer = document.getElementById("btnsContainer"),
		lineColor = "black",
		ctx = canvas.getContext("2d");
	init();
	function init() { //初始化
		initCanvasSize(canvas, btnsContainer);
		drawBorder(ctx);
		bindEvent(ctx, canvas);
		bindBtnEvent(canvas, ctx);
	}
	function initCanvasSize(canvas, btnsContainer) { //根据屏幕高宽，初始化canvas大小
		var w = Math.min(600, window.innerWidth - 20),
			h = w;
		canvas.width = w;
		canvas.height = h;
		btnsContainer.style.width = w + "px";
	}
	function drawBorder(ctx) { //绘制写字的边框线
		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle = "rgb(230,11,9)"
		ctx.lineWidth = 5;
		ctx.strokeRect(0, 0, canvas.width, canvas.height);
		drawDottedLine(ctx, {
			x: 0,
			y: 0
		}, {
			x: canvas.width,
			y: canvas.height
		});
		drawDottedLine(ctx, {
			x: 0,
			y: canvas.height
		}, {
			x: canvas.width,
			y: 0
		});
		drawDottedLine(ctx, {
			x: canvas.width / 2,
			y: 0
		}, {
			x: canvas.width / 2,
			y: canvas.height
		});
		drawDottedLine(ctx, {
			x: 0,
			y: canvas.height / 2
		}, {
			x: canvas.width,
			y: canvas.height / 2
		});
		ctx.closePath();
		ctx.restore();
		function drawDottedLine(ctx, startPoint, endPoint) { //绘制虚线
			var defaultWidth = 20,
				defaultSpacing = 3, //默认短线的长度为30，线段的间距为10
				angle = Math.atan(Math.abs(endPoint.x - startPoint.x) / Math.abs(endPoint.y - startPoint.y)), //获取角度值
				lineSize = (angle == 0) ?
				Math.ceil(Math.abs(endPoint.y - startPoint.y) / (defaultWidth + defaultSpacing)) :
				Math.ceil((Math.abs(endPoint.x - startPoint.x) / Math.sin(angle)) / (defaultWidth + defaultSpacing));
			var xDir = endPoint.x >= startPoint.x ? 1 : -1,
				yDir = endPoint.y >= startPoint.y ? 1 : -1,
				xAdd = xDir * (defaultWidth + defaultSpacing) * Math.sin(angle),
				yAdd = yDir * (defaultWidth + defaultSpacing) * Math.cos(angle),
				firstStart = startPoint,
				firstEnd = {
					x: startPoint.x + xDir * defaultWidth * Math.sin(angle),
					y: startPoint.y + yDir * defaultWidth * Math.cos(angle)
				};
			for (var i = 0; i < lineSize; i++) {
				ctx.moveTo(firstStart.x + i * xAdd, firstStart.y + i * yAdd);
				ctx.lineWidth = 1;
				ctx.lineTo(firstEnd.x + i * xAdd, firstEnd.y + i * yAdd);
				ctx.stroke();
			}
		}
	}
	function bindEvent(ctx, canvas) { //绑定事件
		var canWrite = false,
			lastTamp = 0,
			lastPos = {
				x: 0,
				y: 0
			},
			lastLineWidth = 0,
			cbox = canvas.getBoundingClientRect();
		init();
		function init() {
			if (isMobile())
				bindMobileEvent();
			else
				bindPcEvent();
		}
		function bindPcEvent() { //绑定PC事件
			canvas.onmousedown = function(e) {
				e.preventDefault();
				strokeStart(e.clientX, e.clientY);
			}
			canvas.onmouseup = function(e) {
				e.preventDefault();
				strokeEnd();
			}
			canvas.onmousemove = function(e) {
				e.preventDefault();
				if (!canWrite) return;
				stroking(e.clientX, e.clientY);
			}
			canvas.onmouseout = function(e) {
				e.preventDefault();
				strokeEnd();
			}
		}
		function bindMobileEvent() { //绑定移动事件
			canvas.addEventListener("touchstart", function(e) {
				e.preventDefault();
				strokeStart(e.touches[0].pageX, e.touches[0].pageY);
			});
			canvas.addEventListener("touchmove", function(e) {
				e.preventDefault();
				stroking(e.touches[0].pageX, e.touches[0].pageY);
			});
			canvas.addEventListener("touchend", function(e) {
				e.preventDefault();
				strokeEnd();
			});
		}
		function strokeStart(x, y) { //绘制开始
			canWrite = true;
			lastPos = windowToCanvas(x, y);
			lastTamp = Date.now();
		}
		function stroking(x, y) { //绘制中
			var curPos = windowToCanvas(x, y),
				curTamp = Date.now(),
				moveDistance = Math.sqrt((curPos.x - lastPos.x) * (curPos.x - lastPos.x) + (curPos.y - lastPos.y) * (curPos.y - lastPos.y)),
				ts = curTamp - lastTamp;
			ctx.beginPath();
			ctx.lineWidth = getLineWidth(moveDistance / ts);
			ctx.strokeStyle = lineColor;
			ctx.lineCap = "round";
			ctx.lineJoin = "round";
			ctx.moveTo(lastPos.x, lastPos.y);
			ctx.lineTo(curPos.x, curPos.y);
			ctx.stroke();
			ctx.closePath();
			lastPos = curPos;
			lastTamp = curTamp;
		}
		function strokeEnd() { //绘制结束
			canWrite = false;
		}
		function isMobile() { //判断是否是移动设备
			var userAgentInfo = navigator.userAgent,
				Agents = ["iPhone", "iPad", "iPod", "Android"];
			for (var i = 0, item; item = Agents[i++];) {
				if (userAgentInfo.indexOf(item) >= 0) return true;
			}
			return false;
		}
		function windowToCanvas(x, y) { //window坐标转canvas坐标
			return {
				x: Math.round(x - cbox.left),
				y: Math.round(y - cbox.top)
			}
		}
		function getLineWidth(v) { //根据速度获取绘制线条的宽度
			var maxLineWidth = 20,
				minLineWidth = 1,
				maxV = 10,
				minV = 0.1;
			return (function() {
				var retLineWidth;
				if (v >= maxV) {
					retLineWidth = minLineWidth;
				} else if (v <= minV) {
					retLineWidth = maxLineWidth
				} else {
					retLineWidth = maxLineWidth - (v - minV) / (maxV - minV) * (maxLineWidth - minLineWidth);
				}
				return lastLineWidth = (retLineWidth * 2 / 5 + lastLineWidth * 3 / 5);
			})();
		}
	}
	function bindBtnEvent(canvas, ctx) { //绑定按钮事件
		var clearBtn = document.getElementsByClassName("clearBtn")[0];
		clearBtn.onclick = function() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			drawBorder(ctx);
		}
		var colorBtns = document.getElementsByClassName("colorBtn");
		for (var index = 0, item; item = colorBtns[index++];) {
			item.onclick = function() {
				removeClassCur();
				this.className += " " + "cur";
				lineColor = this.getAttribute("data-color");
			}
		}
		function removeClassCur() {
			for (var i = 0, obj; obj = colorBtns[i++];) {
				obj.className = obj.className.replace(new RegExp("(\\s|^)" + "cur" + "(\\s|$)"), " ");
			}
		}
	}
})(window, document)