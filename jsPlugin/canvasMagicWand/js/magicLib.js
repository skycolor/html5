(function(window , document , undefined){
	function magicWand(options){
		var defaults = {
			ele : document.body ,		//canvas的父级元素
			initStarsNum : 1.5 ,			//移动中初始化星星的数目
			allStarsNum : 300 ,			//魔法元素池里星星的总数
			imgSrc : "img/star.png" ,		//魔法元素图片URL
			imgObjParam : {					//魔法元素对象参数
				xScope : 40 ,
				yScope : 40 ,
				w : 30 ,
				h : 30 ,
				aliveTimeMin : 50 ,
				aliveTimeMax : 80
			}
		};
		var opts = $.extend(true , defaults , options || {});
		var canvas = document.createElement('canvas') , 
			ctx = canvas.getContext('2d') , starImg = new Image() , animationFrame ,
			magicStars = [] ,		//魔法棒元素列表
			aliveMagicStars = [] ,	//活着的魔法棒元素列表
			directionType = {left : 1 , right : -1 , middle : 0} , 	direction ,	//滑动方向（PS：星星的移动方向跟滑动方向应该是相反的）
			savePos , newPos;			//记录move过程中，上一个点的坐标位置
		initCanvasStyle(canvas);
		loadImg();
		function initCanvasStyle(canvas){		//初始化canvas的样式
			canvas.style.position = 'absolute';
			canvas.style.left = canvas.style.top = '0';
			canvas.width = opts.ele.clientWidth;
			canvas.height = opts.ele.clientHeight;
			opts.ele.appendChild(canvas);
		}
		function loadImg(){			//加载图片
			starImg.src = opts.imgSrc;
			if(starImg.complete){ 	
				init();
			}else{
				starImg.onload = function() { 
					init();
				};
			}
		}
		function init(){			//初始化
			animationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame ||		//frame动画兼容调整
				function(callback) {
					window.setTimeout(callback, 1000 / 60);
				};
			initAllStar();
			bindEvent();
			animate();
		}
		function initAllStar(){			//初始化所有的星星
			for(var index = 0 ; index < opts.allStarsNum ; index++) 	magicStars.push(new Star());
		}
		function bindEvent(){		//绑定事件
			bindEventMain();
			function bindEventMain(){		//绑定事件主函数
				if(isMobile()){			//移动
					canvas.addEventListener('touchmove' , function(e){
						if(e.touches.length > 1 || e.scale && e.scale !== 1) return;
						handlePosition(e.touches[0].pageX, e.touches[0].pageY);
						magicStarsInit(direction , savePos);
						e.preventDefault();
					} , false);
				}else{			//PC
					canvas.addEventListener('mousemove' , function(e){
						handlePosition(e.clientX , e.clientY);
						magicStarsInit(direction , savePos);
						e.preventDefault();
					} , false);
				}
			}
			function handlePosition(winX , winY){				//记录鼠标的滑动方向，保存历史位置
				newPos = windowToCanvas(winX , winY , canvas);
				if(!savePos || savePos.x == newPos.x){
					direction = directionType.middle;
				}else if(savePos.x > newPos.x){
					direction = directionType.left;
				}else if(savePos.x < newPos.x){
					direction = directionType.right;
				}
				savePos = newPos;  
			}
			function isMobile() { 		//判断是否是移动设备
				var userAgentInfo = navigator.userAgent,
					Agents = ["iPhone", "iPad", "iPod", "Android"];
				for (var i = 0, item; item = Agents[i++];) {
					if (userAgentInfo.indexOf(item) >= 0) return true;
				}
				return false;
			}
		}
		function Star(){				//魔法元素对象
			this.xScope = opts.imgObjParam.xScope;		//x轴初始化位置范围
			this.yScope = opts.imgObjParam.yScope;		//y轴初始化位置范围
			this.w = opts.imgObjParam.w;
			this.h = opts.imgObjParam.h;
			this.isAlive = false;
		}
		Star.prototype = {				//原型方法对象
			_reset : function(direction , savePos){		//单个魔法棒星星初始化(参数为移动方向、当前移动点的位置)
				this.vx = direction * (1 + Math.random()*3);
				this.vy = 2 + Math.random()*3;
				this.x = direction == 1  ? getRandomFromScope(savePos.x , savePos.x + this.xScope) 
						: getRandomFromScope(savePos.x - this.xScope , savePos.x);
				this.y = getRandomFromScope(savePos.y , savePos.y + this.yScope);
				this.liveTime = getRandomFromScope(opts.imgObjParam.aliveTimeMin , opts.imgObjParam.aliveTimeMax);
				this.opacityParam =  this.liveTime;
				this.rotate = parseInt(Math.random()*50);
				this.rotateV = 1 + 10*Math.random();
				this.isAlive = true;
				return this;
			} ,
			_draw : function(ctx){				//绘制
				ctx.save();
				ctx.globalAlpha = this.liveTime/this.opacityParam;
				ctx.beginPath();
				ctx.drawImage(starImg , 0 , 0 , starImg.width , starImg.height , 
						this.x , this.y , this.w , this.h);
				ctx.rotate(this.rotate*Math.PI/180);
				this._animate();
				ctx.closePath();
				ctx.restore();
			} ,
			_animate : function(){				//位置更新
				this.x += this.vx;
				this.y += this.vy;
				this.rotate += this.rotateV;
				this.liveTime--;
				if(this.liveTime <= 0)	this._destory();			//销毁
			} ,
			_destory : function(){				//毁坏
				this.isAlive = false;
				this._removeThisFromArr(aliveMagicStars);
			} ,
			_removeThisFromArr : function(arr){		//从属于中删除自己
				for(var i = 0 ; i < arr.length ; i++){
					if(this === arr[i]) arr.splice(i , 1);
				}
			}
		}
		function magicStarsInit(direction , savePos){			//移动过程中，当前点众多魔法棒星星初始化(参数为移动方向、当前移动点的位置)
			var initNum = 0 , overNum = Math.ceil(Math.random() * opts.initStarsNum);
			for(var i = 0 , item ;item = magicStars[i++];){
				if(item.isAlive) continue;
				aliveMagicStars.push(item._reset(direction , savePos));
				if(++initNum >= overNum) break;
			}
		}
		function animate(){				//动画执行函数
			main();
			function main(){			//主函数
				ctx.clearRect(0 , 0 , canvas.width , canvas.height);
				loop();
				animationFrame(animate);
			}
			function loop(){			//元素循环
				for(var index = 0 , star;star = aliveMagicStars[index++];){
					star._draw(ctx);
				}
			}
		}
		function windowToCanvas(x , y , canvas) { 		//window坐标转canvas坐标
		    return {
		        x : Math.round(x - canvas.getBoundingClientRect().left - document.body.scrollLeft),
		        y : Math.round(y - canvas.getBoundingClientRect().top - document.body.scrollTop)
		    }
		}
		function getRandomFromScope(min , max){			//获取某一个范围中的随机数
			return ( min + parseInt(Math.random() * (max - min)));
		}
	}
	window.magicWand = magicWand;
})(window , document);