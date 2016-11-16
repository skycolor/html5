(function(window , document , undefined){
	var canvas = document.getElementById('canvas') ,
		ctx = canvas.getContext('2d') , starImg = new Image() , animationFrame ,
		initStarNum = 1.5 , 	//初始化星星的个数
		allStarsNum = 500 ,		//星星的总数
		magicStars = [] ,		//魔法棒元素列表
		aliveMagicStars = [] ,	//活着的魔法棒元素列表
		directionType = {left : 1 , right : -1 , middle : 0} , 	direction ,	//滑动方向（PS：星星的移动方向跟滑动方向应该是相反的）
		savePos , newPos;			//记录move过程中，上一个点的坐标位置
	canvas.width = document.body.clientWidth;
	canvas.height = document.body.clientHeight;
	loadImg();
	function loadImg(){			//加载图片
		starImg.src = "img/star.png";
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
		for(var index = 0 ; index < allStarsNum ; index++) 	magicStars.push(new Star());
	}
	function bindEvent(){		//绑定事件
		canvas.addEventListener('mousemove' , function(e){
			e.preventDefault();
			handlePosition(e);
			magicStarsInit(direction , savePos);
		} , false);
		function handlePosition(e){				//记录鼠标的滑动方向，保存历史位置
			newPos = windowToCanvas(e.clientX , e.clientY , canvas);
			if(!savePos || savePos.x == newPos.x){
				direction = directionType.middle;
			}else if(savePos.x > newPos.x){
				direction = directionType.left;
			}else if(savePos.x < newPos.x){
				direction = directionType.right;
			}
			savePos = newPos;
		}
	}
	function Star(){
		this.xScope = 40;		//x轴初始化位置范围
		this.yScope = 40;		//y轴初始化位置范围
		this.w = 30;
		this.h = 30;
		this.isAlive = false;
	}
	Star.prototype = {
		_reset : function(direction , savePos){		//单个魔法棒星星初始化(参数为移动方向、当前移动点的位置)
			this.vx = direction * (1 + Math.random()*3);
			this.vy =2 + Math.random()*3;
			this.x = direction == 1  ? getRandomFromScope(savePos.x , savePos.x + this.xScope) 
					: getRandomFromScope(savePos.x - this.xScope , savePos.x);
			this.y = getRandomFromScope(savePos.y , savePos.y + this.yScope);
			this.liveTime = getRandomFromScope(50 , 80);
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
		var initNum = 0 , overNum = Math.ceil(Math.random()*initStarNum);
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
	        x: Math.round(x - canvas.getBoundingClientRect().left - document.body.scrollLeft),
	        y: Math.round(y - canvas.getBoundingClientRect().top - document.body.scrollTop)
	    }
	}
	function getRandomFromScope(min , max){			//获取某一个范围中的随机数
		return ( min + parseInt(Math.random() * (max - min)));
	}
})(window , document);