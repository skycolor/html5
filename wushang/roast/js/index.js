(function(window , $ , undefined){
	  var start = $('#start') , startImg = $('#startImg') , fire = $('#fire') ,
	  	  littleFires = $('#littleFires') , unCookedChicken = $('#unCookedChicken')
	  	  cookedChicken = $('#cookedChicken');
	  handleStart(removeStartBtnAnimate);
	  
	  function handleStart(nextFunc){		//处理开始事件
	  	 var endPos , startPos ,
	  	 	 eventFunc = {
	  	 	 	touchStartFunc : function(e){
	  	 	 		e.preventDefault();
	  	 	 		startPos = windowToELement(e.touches[0].pageX, e.touches[0].pageY , start[0]);
	  	 	 	} ,
	  	 	 	touchmoveFunc : function(e){
	  	 	 		e.preventDefault();
	  	 	 		if(e.touches.length > 1 || e.scale && e.scale !== 1) return;
	  	 	 		endPos = windowToELement(e.touches[0].pageX, e.touches[0].pageY , start[0]);
	  	 	 	} ,
	  	 	 	touchendFunc : function(e){
	  	 	 		e.preventDefault();
	  	 	 		if( endPos.x > (startPos.x + 20) ){
	  	 	 			start.off('touchstart' , eventFunc.touchStartFunc);
					  	start.off('touchend' , eventFunc.touchendFunc);
					  	start.off('touchmove' , eventFunc.touchmoveFunc);
					  	if(nextFunc && typeof nextFunc == "function") nextFunc();
	  	 	 		}
	  	 	 		
	  	 	 	}
	  	 	 };
	  	  start.on('touchstart' , eventFunc.touchStartFunc);
	  	  start.on('touchend' , eventFunc.touchendFunc);
	  	  start.on('touchmove' , eventFunc.touchmoveFunc);
	  }
	  function removeStartBtnAnimate(){			//移除开始的动画
	  	  startImg.addClass('remove');
	  	  setTimeout(function(){
	  	  	  startImg.remove();
	  	  	  start.remove();
	  	  	  handleFireBurning();
	  	  } , 800);
	  }
	  function handleFireBurning(){			//火鸡开始燃烧
	  	  var littles = littleFires.find('.little') , lazyTime = 300;
	  	  fire.show(400 , function(){
	  	  	  fire.find('img').addClass('animate');
	  	  	  setTimeout(function(){
	  	  	  	  littles.eq(0).show(lazyTime , function(){
	  	  	  	  	 littles.eq(1).show(lazyTime , function(){
	  	  	  	  		littles.eq(2).show(lazyTime , function(){
	  	  	  	  			littles.eq(3).show(lazyTime , function(){
	  	  	  	  				littles.eq(4).show(lazyTime , function(){
	  	  	  	  					chickenBurning();
	  	  	  	  	 			})
	  	  	  	  	 		})
	  	  	  	  	 	})
	  	  	  	  	 })
	  	  	  	  })
	  	  	  } , 600);
	  	  })
	  }
	  function chickenBurning(){			//烧鸡出炉
	  	  setTimeout(function(){
	  	  	 unCookedChicken.addClass('remove');
	  	  	 setTimeout(function(){
	  	  	 	showCookedChicken();
	  	  	 } , 1400);
	  	  } , 800);
	  	  
	  	  function showCookedChicken(){			//显示烤熟的烤鸡
	  	  	  setTimeout(function(){
	  	  	  	  cookedChicken.addClass('show');
	  	  	  	  requestNet();
	  	  	  } , 400)
	  	  	  unCookedChicken.fadeOut(200 , function(){unCookedChicken.remove();});
	  	  	  fire.fadeOut(200 , function(){fire.remove();});
	  	  	  littleFires.fadeOut(200 , function(){littleFires.remove();});
	  	  }
	  }
	  function requestNet(){			//请求网络
	  	
	  }
	  
	  function windowToELement(x , y , ele) { 		//window坐标转canvas坐标
		    return {
		        x: Math.round(x - ele.getBoundingClientRect().left - document.body.scrollLeft),
		        y: Math.round(y - ele.getBoundingClientRect().top - document.body.scrollTop)
		    }
	  }
})(window , Zepto);
