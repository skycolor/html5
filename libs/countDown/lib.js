/*
 * 基于Jquery/zepto的翻牌图片倒计时
 * */
$.fn.countDown = function(options){
	/* nowTime 为当前时间，实际中可以使用服务器时间 ；
	 * endTime 为目标截止时间 ； 
	 * 中间的为string 为各个ele的ID ； 
	 * type为翻盘方式，X为沿X轴翻动 ，Y为沿Y轴翻动
	* */
	var defaults = {
		nowTime : new Date().getTime() ,	
		endTime : 0 ,
		dayF : "dayF" , dayB : "dayB" , day : "day" ,
		hour1F : "hour1F" , hour1B : "hour1B" , hour1 : "hour1" ,
		hour2F : "hour2F" , hour2B : "hour2B" , hour2 : "hour2" ,
		min1F : "min1F" , min1B : "min1B" , min1 : "min1" ,
		min2F : "min2F" , min2B :"min2B" , min2 : "min2" ,
		sec1F : "sec1F" , sec1B : "sec1B" , sec1 : "sec1" ,
		sec2F : "sec2F" , sec2B : "sec2B" , sec2 : "sec2" ,
		type : "X"		
	};
	var opts = $.extend(defaults,options);
	return this.each(function(){
		var _this = $(this) , dayF = _this.find("#" + opts.dayF) , dayB = _this.find("#" + opts.dayB) , day = _this.find("#" + opts.day) ,
			hour1F = _this.find("#" + opts.hour1F) , hour1B = _this.find("#" + opts.hour1B) , hour1 = _this.find("#" + opts.hour1) ,
			hour2F = _this.find("#" + opts.hour2F) , hour2B = _this.find("#" + opts.hour2B) , hour2 = _this.find("#" + opts.hour2) ,
			min1F = _this.find("#" + opts.min1F) , min1B = _this.find("#" + opts.min1B) , min1 = _this.find("#" + opts.min1) ,
			min2F = _this.find("#" + opts.min2F) , min2B = _this.find("#" + opts.min2B) , min2 = _this.find("#" + opts.min2) ,
			sec1F = _this.find("#" + opts.sec1F) , sec1B = _this.find("#" + opts.sec1B) , sec1 = _this.find("#" + opts.sec1) ,
			sec2F = _this.find("#" + opts.sec2F) , sec2B = _this.find("#" + opts.sec2B) , sec2 = _this.find("#" + opts.sec2) ,
			allSeconds;
		initTime();
		function initTime(){
			initTimeShow();
			countDown();
		}
		function initTimeShow(){			//初始化显示
			$(".front").addClass(opts.type == "X" ? "rotateX" : "rotateY");
			$(".back").addClass(opts.type == "X" ? "rotateX" : "rotateY");
			allSeconds = Math.round((opts.endTime - opts.nowTime)/1000);
			handleShow(allSeconds);
		}
		function handleShow(allSeconds){
			var d = parseInt(allSeconds / (3600 * 24)) ,
				h = parseInt((allSeconds - d * 3600 * 24) / 3600) ,
				m = parseInt((allSeconds - h * 3600 - d * 3600 * 24)/60 ) ,
				s = (allSeconds%60).toFixed(0);
			setParam(day , dayF , dayB , d);
			setParam(hour1 , hour1F , hour1B , getNumObj(h).ten);
			setParam(hour2 , hour2F , hour2B , getNumObj(h).bit);
			setParam(min1 , min1F , min1B , getNumObj(m).ten);
			setParam(min2 , min2F , min2B , getNumObj(m).bit);
			setParam(sec1 , sec1F , sec1B , getNumObj(s).ten);
			setParam(sec2 , sec2F , sec2B , getNumObj(s).bit);
		}
		function setParam(ele , eleF , eleB  , num){		//向元素里设置参数
			if(!ele.hasClass('switchBack')){			//处理正面朝上
				if(eleF.hasClass("ico-" + num)) return;
				eleB.removeClass((function(){
					var val = eleB.attr("val");
					if(!val || typeof val == "undefined") return "";
					return ("ico-" + val);
				})()).attr("val" , num).addClass("ico-" + num);
				ele.addClass('switchBack');
			}else{			//处理反面朝上
				if(eleB.hasClass("ico-" + num)) return;
				eleF.removeClass((function(){
					var val = eleF.attr("val");
					if(!val || typeof val == "undefined") return "";
					return ("ico-" + val);
				})()).attr("val" , num).addClass("ico-" + num);
				ele.removeClass('switchBack');
			}
		}
		function getNumObj(num){		//获取十位和个位
			return {
				ten : parseInt(num/10) ,
				bit : (num%10).toFixed(0)
			};
		}
		function countDown(){		//倒计时
			var timer = setInterval(function(){
				if (allSeconds > 1) {
		            allSeconds -= 1;
		            handleShow(allSeconds);
		        } else {
		            clearInterval(timer);
		        }
			} , 1000);
		}
	});
}