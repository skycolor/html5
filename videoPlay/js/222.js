function onFormSuccess(a) {
	window.dataLayer = window.dataLayer || [], window.dataLayer.push({
		event: a
	})
}
function TrackAll(a) {
	var b = TrackEvent.Data[a];
	b ? (TrackEvent.SendGA(b.ga), onFormSuccess(b.ga.action)) : TrackEvent.Log("鏈畾涔変簨浠舵暟鎹璞�")
}
function WeixinHandler(a) {
	try {
		UappId = a.appId, Utimestamp = a.timestamp, UnonceStr = a.nonceStr, Usignature = a.signature, wx.config({
			debug: !1,
			appId: UappId,
			timestamp: Utimestamp,
			nonceStr: UnonceStr,
			signature: Usignature,
			jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "hideMenuItems", "showMenuItems", "chooseImage", "uploadImage"]
		})
	} catch (b) {}
	wx.ready(function() {
		_Global.share.setShare()
	})
}
function playImageList(a) {
	var b = this;
	b.len = a.len || 0, b.now = a.now || 0, b.cb = a.cb || !1, b.rt = a.rt || 90, b.box = a.box, b.bh = a.bh || 1080, b.bw = a.bw || $(window).width(), b.queue = a.queue, b.queuelt = a.queuelt, b.canvasId = "__cl" + (a.box.attr("id") || a.box.attr("class")), b.before = a.before || !1, b.tick = function() {
		b.stage.update()
	}, b.playState = !0, b.init = function() {}, b._play = function() {
		b.box.html(b.queue.getResult(b.queuelt + b.now)), b.now++, b.now < b.len ? b.playState && setTimeout(function() {
			b._play()
		}, b.rt) : b.cb && b.cb()
	}, b.play = function() {
		b.before && b.before(), b._play()
	}, b.stop = function() {
		b.playState = !1
	}, b.init()
}!
function(a, b, c, d, e, f, g) {
	a.GoogleAnalyticsObject = e, a[e] = a[e] ||
	function() {
		(a[e].q = a[e].q || []).push(arguments)
	}, a[e].l = 1 * new Date, f = b.createElement(c), g = b.getElementsByTagName(c)[0], f.async = 1, f.src = d, g.parentNode.insertBefore(f, g)
}(window, document, "script", "//www.google-analytics.com/analytics.js", "ga"), ga("create", "UA-73165829-4", "auto"), ga("send", "pageview"), ga("create", "UA-22413153-1", "campaign.shuuemura.com.cn/ink1/mob", {
	name: "shugatmob1"
}), ga("shugatmob1.send", "pageview");
var TrackEvent = {};
TrackEvent.Data = {
	"default": {
		isDebug: !0,
		attrKeyName: "keyname",
		ga: {
			category: "calligraphic",
			action: "button",
			label: "click",
			value: 0
		}
	},
	start: {
		ga: {
			action: "start"
		}
	},
	help: {
		ga: {
			action: "help"
		}
	},
	take: {
		ga: {
			action: "take"
		}
	},
	send: {
		ga: {
			action: "send"
		}
	},
	again: {
		ga: {
			action: "again"
		}
	},
	share: {
		ga: {
			action: "share"
		}
	},
	submit: {
		ga: {
			action: "submit"
		}
	},
	share_friend: {
		ga: {
			action: "share_friend"
		}
	},
	share_moments: {
		ga: {
			action: "share_moments"
		}
	}
}, TrackEvent.SendGA = function(a) {
	if (window.ga && a) {
		var b = $.extend({}, TrackEvent.Data["default"].ga, a);
		TrackEvent.Log(b), ga("send", "event", b.category, b.action, b.label), ga("shugatmob1.send", "event", b.category, b.action, b.label)
	} else TrackEvent.Log("ga object not find")
}, TrackEvent.SendGaPv = function(a, b) {
	window.ga ? (ga("send", "pageview", a), ga("shugatmob1.send", "pageview", a), onFormSuccess(a), TrackEvent.Log("GaPageView(url:" + a + ",value:" + b + ") -> send success")) : TrackEvent.Log("ga object not find")
}, TrackEvent.Log = function(a) {
	window.console && TrackEvent.Data["default"].isDebug && console.log(a)
}, TrackEvent.Alert = function(a) {
	TrackEvent.Data["default"].isDebug && alert(a)
}, $(function() {
	var a = TrackEvent.Data["default"].attrKeyName;
	$("body").on("click", "*[" + a + "]", function() {
		TrackAll($(this).attr(a))
	})
}), _Global.baseData = {
	_pageCanup: !1,
	_pageCanDown: !1,
	_nowPage: "",
	_ph: 0,
	isShare: !1
};
var isiOS = !0,
	isiOSV8 = !! navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
_mainLoadingQueue = null, _Global.baseAction = {
	ajaxPia: {
		on: function() {
			$(".loadingAja").show()
		},
		off: function() {
			$(".loadingAja").hide()
		}
	},
	_baseDataHost: "/interface.ashx",
	_isAjaxProcess: !1,
	ajaxAction: function(a, b) {
		return _Global.baseAction._isAjaxProcess ? !1 : (_Global.baseAction._isAjaxProcess = !0, _Global.baseAction.ajaxPia.on(), void $.ajax({
			type: "POST",
			url: _Global.baseAction._baseDataHost,
			cache: !1,
			dataType: "json",
			data: a,
			success: function(a) {
				_Global.baseAction.ajaxPia.off(), b(a), _Global.baseAction._isAjaxProcess = !1
			},
			error: function(a) {
				_Global.baseAction.ajaxPia.off();
				try {} catch (a) {}
				b({
					state: !1
				}), _Global.baseAction._isAjaxProcess = !1
			}
		}))
	},
	loading: function(a, b, c, d) {
		for (var e = 0; 11 > e; e++) a.push({
			id: "number" + e,
			src: "image/number/" + e + ".png"
		});
		for (var e = 0; 11 > e; e++) a.push({
			id: "number2" + e,
			src: "image/number/" + e + ".png"
		});
		queue = new createjs.LoadQueue, queue.on("complete", function() {
			$(".loadingPanel img[data-src]").each(function(a, b) {
				$(this).attr("src", $(this).attr("data-src"))
			}), f()
		}, this), queue.loadManifest(a);
		var f = function() {
				$(".tpre4").html(queue.getResult("number10")), _mainLoadingQueue = new createjs.LoadQueue, _mainLoadingQueue.on("complete", function() {
					isiOSV8 ? $("#videoFrame_1").html('<video   width="640" height="1280" onplay="videoEnd(1)" data-index="1" id="video1" poster="image/v1_1.jpg" x-webkit-airplay="true" webkit-playsinline="true" preload="auto" src="image/video/4.mp4"></video>') : $("#videoFrame_1").prepend('<video style="display:none;"  width="640" height="1280" onplay="videoEnd(1)" data-index="1" id="video1" poster="image/v1_1.jpg" x-webkit-airplay="true" webkit-playsinline="true" preload="auto" src="image/video/4.mp4"></video>'), $("img[data-src]").each(function(a, b) {
						$(this).attr("src", $(this).attr("data-src"))
					}), TweenMax.to(".loadingPanel", .5, {
						autoAlpha: 0,
						onComplete: function() {
							$(".loadingPanel").remove()
						}
					}), d && d()
				}, this), _mainLoadingQueue.on("progress", function(a) {
					var b = parseInt(100 * a.progress);
					10 > b ? $(".tpre2").html(queue.getResult("number" + b)) : 100 > b ? (b = String(b).split(""), $(".tpre1").html(queue.getResult("number" + b[0])), $(".tpre2").html(queue.getResult("number2" + b[1]))) : (b = String(b).split(""), $(".tpre0").html(queue.getResult("number" + b[0])), $(".tpre1").html(queue.getResult("number" + b[1])), $(".tpre2").html(queue.getResult("number2" + b[2]))), c(a)
				}, this), _mainLoadingQueue.loadManifest(b)
			}
	},
	scrollerState: function() {
		_Global.myScrollPage.maxScrollY == _Global.myScrollPage.y ? _Global.baseData._pageCanup = !0 : _Global.baseData._pageCanup = !1, 0 == _Global.myScrollPage.y ? _Global.baseData._pageCanDown = !0 : _Global.baseData._pageCanDown = !1
	},
	showPage: function(a, b) {
		_Global.baseData._pageCanup = !1, _Global.baseData._pageCanDown = !1, a != _Global.baseData._nowPage && ($("." + a).css({
			display: "block",
			opacity: 0,
			"z-index": 3
		}), "" != _Global.baseData._nowPage && TweenMax.to("." + _Global.baseData._nowPage, .2, {
			css: {
				opacity: 0
			},
			onComplete: function() {
				$("." + _Global.baseData._nowPage).css({
					display: "none",
					opacity: 1,
					"z-index": 1
				})
			}
		}), TweenMax.to("." + a, .8, {
			css: {
				opacity: 1
			},
			onComplete: function() {}
		}), "page2" == a ? TrackEvent.SendGaPv("/calligraphic/write_page", "/calligraphic/write_page") : "page3" == a && TrackEvent.SendGaPv("/calligraphic/submit_page", "/calligraphic/submit_page"), setTimeout(function() {
			for (var c in _Global.animation) c == a || _Global.animation[c].pause(0);
			try {
				_Global.animation[a].play()
			} catch (d) {}
			b && b(), _Global.baseData._nowPage = a
		}, 300))
	}
}, _Global.animation = {
	page1: new TimelineMax({
		onStart: function() {},
		paused: !0,
		onComplete: function() {}
	})
}, _Global.share = {
	_end: function() {},
	data: {
		share_tlt: "",
		share_link: "http://campaign.shuuemura.com.cn/ink1/mob/index.html?utm_source=" + _Global.utm_source + "&utm_source_level=" + _Global.utm_source_level + "&utm_medium=" + _Global.utm_medium + "&utm_campaign=" + _Global.utm_campaign,
		imgurl: "http://campaign.shuuemura.com.cn/ink1/mob/image/share.jpg"
	},
	setShare: function() {
		wx.onMenuShareTimeline({
			title: "[鍥芥皯鍒濇亱]榛勮僵宸蹭翰鎵嬪啓涓嬫儏涔︼紝浣犱細鏄粬瑕佸憡鐧界殑浜哄悧锛�",
			link: _Global.share.data.share_link,
			imgUrl: _Global.share.data.imgurl,
			success: function() {
				TrackAll("share_moments")
			},
			cancel: function() {}
		}), wx.onMenuShareAppMessage({
			title: "妞嶆潙绉€绾ゅ彉澧ㄥ寲鐪肩嚎娑茬瑪",
			desc: "[鍥芥皯鍒濇亱]榛勮僵宸蹭翰鎵嬪啓涓嬫儏涔︼紝浣犱細鏄粬瑕佸憡鐧界殑浜哄悧锛�",
			link: _Global.share.data.share_link,
			imgUrl: _Global.share.data.imgurl,
			type: "",
			dataUrl: "",
			success: function() {
				TrackAll("share_friend")
			},
			cancel: function() {}
		})
	},
	init: function() {
		function a() {
			$.ajax({
				type: "GET",
				url: "http://sact-digital.com/web/jsapi.php",
				cache: !1,
				data: {
					url: encodeURI(window.location.href.split("#")[0])
				},
				dataType: "jsonp",
				success: function(a) {
					WeixinHandler(a)
				}
			})
		}
		setTimeout(a, 500 * Math.random() + 1e3)
	}
}, _Global.customerAction = {
	_step: null,
	_userShowUpload: null,
	_userShowUploadSuccess: null,
	_userShowVoteSuccess: null,
	_userShowFormSuccess: null,
	_setPageSwiper: null
}, $(function() {
	_resize = function() {
		_Global.baseData._ph = $(window).height(), $("#scrollerInner").height(_Global.baseData._ph)
	}, window.onresize = function() {
		_resize()
	}, _resize(), FastClick.attach(document.body);
	var a = new TimelineMax({
		onStart: function() {},
		repeat: -1,
		yoyo: !0,
		paused: !0,
		onComplete: function() {}
	});
	a.to(".coic", .8, {
		css: {
			bottom: 30
		},
		ease: "linear"
	}), a.play();
	$("*[data-redir]").bind("click", function(a) {
		var b = $(this).attr("data-redir");
		_Global.baseAction.showPage(b)
	}), $("*[data-show]").bind("click", function(a) {
		var b = $(this).attr("data-show");
		$(b).show()
	}), $("*[data-hide]").bind("click", function(a) {
		var b = $(this).attr("data-hide");
		$(b).hide()
	}), _Global.videoFrame = {}, commt = new TimelineMax({
		onStart: function() {},
		paused: !0,
		repeat: -1,
		yoyo: !1,
		onComplete: function() {}
	}), commt.to(".quan_ani", 1, {
		scale: 1.4,
		alpha: 0
	}), commt.to(".quan", 1, {
		scale: 1.2,
		alpha: 0
	}, "-=0.6"), commt.play(), _Global.nothasDraw = !0, $(".J_submit").bind("click", function(a) {
		return _Global.nothasDraw ? ($("#J_tipem").attr("src", "image/text2.png"), !1) : ($("#J_tipem").attr("src", "image/text1.png"), _Global.userRandom = Math.ceil(3 * Math.random()), $("#J_userPic").attr("src", $("#cp")[0].toDataURL("image/png")), $("#J_userd").attr("src", "image/d_" + _Global.userRandom + ".png"), void _Global.baseAction.showPage("page3"))
	}), $(".J_submitUserInfo").bind("click", function(a) {
		var b = $.trim($("#J_mobile").val());
		if (!/^1[34578]\d{9}$/.test(b)) return alert("璇疯緭鍏ユ纭殑鎵嬫満鍙�"), !1;
		var c = String($("#cp")[0].toDataURL("image/png")).replace("data:image/png;base64,", "");
		_Global.baseAction.ajaxAction({
			action: "add_el_user",
			utm_source: _Global.utm_source,
			utm_medium: _Global.utm_medium,
			utm_campaign: _Global.utm_campaign,
			utm_source_level: _Global.utm_source_level,
			user_pic: c,
			device_type: "wap",
			user_mobile: b
		}, function(a) {
			a.state ? $(".popupShare").show() : alert(a.msg)
		})
	}), _videoOnProgress1 = function() {
		$("#video1")[0].currentTime <= 48 ? setTimeout(function() {
			_videoOnProgress1()
		}, 5) : (_videoOnProgress1Attach(), $("#video1")[0].pause(), TrackEvent.SendGaPv("/calligraphic/start_page", "/calligraphic/start_page"))
	}, _videoOnProgress1Attach = function() {
		$("#videoFrame_2").prepend('<video  width="640" height="1280" data-index="1" id="video2" x-webkit-airplay="true" webkit-playsinline="true" onplay="videoEnd(2)" preload="auto" src="image/video/5.mp4"></video>'), $("#videoFrame_3").prepend('<video  width="640" height="1280" data-index="1" id="video3" x-webkit-airplay="true" webkit-playsinline="true" onplay="videoEnd(3)" preload="auto" src="image/video/6.mp4"></video>'), $("#videoFrame_2,.p1v1,touchbox,.J_fortouch,.videoFrame_2").css({
			display: "block"
		}), $("#videoFrame_1").hide(), TweenMax.fromTo(".p1v1", .5, {
			y: "+=10",
			alpha: 0
		}, {
			y: 0,
			alpha: 1
		}), TweenMax.fromTo(".p1m1", .5, {
			y: "+=10",
			alpha: 0
		}, {
			y: 0,
			alpha: 1
		}), $(".touchbox").bind("touchstart", function(a) {
			isiOSV8 ? TweenMax.to(".p1v1,.p1m1,.J_vf2", .5, {
				alpha: 0,
				onComplete: function() {
					$(".p1v1,.p1m1,.J_vf2").remove()
				}
			}) : $(".p1v1,.p1m1,.J_vf2").remove(), $("#videoFrame_2").css({
				display: "block"
			}), TweenMax.to("#videoFrame_2", .5, {
				alpha: 1
			}), isiOSV8 ? ($("#video2")[0].play(), $("#video2")[0].currentTime = 1) : ($("#video2")[0].play(), setTimeout(function() {
				$("#video2")[0].currentTime = 1, $("#video2")[0].play()
			}, 100)), TrackAll("start"), $(this).remove()
		})
	}, _videoOnProgress2 = function() {
		$("#video2")[0].currentTime <= 3.5 ? setTimeout(function() {
			_videoOnProgress2()
		}, 5) : ($("#videoFrame_3,.p2v1").css({
			display: "block"
		}), $("#videoFrame_2").remove(), TweenMax.to(".J_vf3", .5, {
			alpha: 1
		}), TweenMax.fromTo(".p2v1", .5, {
			y: "+=10",
			alpha: 0
		}, {
			y: 0,
			alpha: 1
		}), $("#videoFrame_1").html(""))
	}, _videoOnProgress3 = function() {
		if ($("#video3")[0].currentTime <= 32) setTimeout(function() {
			_videoOnProgress3()
		}, 10);
		else {
			$("#videoFrame_4,.p3v1").css({
				display: "block"
			}), $("#videoFrame_3,#videoFrame_2,#videoFrame_1").remove(), TweenMax.fromTo(".p3v1", .5, {
				y: "+=10",
				alpha: 0
			}, {
				y: 0,
				alpha: 1
			});
			try {
				$("#video3")[0].pause()
			} catch (a) {}
		}
	}, _afterLoading = [{
		id: "i1",
		src: "image/v1_1.jpg"
	}, {
		id: "i2",
		src: "image/bg.jpg"
	}], _Global.videoFrame = {}, _Global.baseAction.loading([{
		id: "i",
		src: "image/loadingbg.png"
	}], _afterLoading, function(a) {
		var b = parseInt(100 * a.progress);
		$(".loadingPanel .per").text(b + "%");
		var c = a.progress < .2 ? .2 : a.progress;
		TweenMax.to(".loadingPanel .perImg", .5, {
			scale: c
		})
	}, function() {
		isiOSV8 && soundManager.setup({
			onready: function() {
				mySound = soundManager.createSound({
					id: "soundv1",
					url: "image/music.mp3",
					onload: function() {},
					loops: 9999,
					volume: 5
				}), mySound.play()
			},
			ontimeout: function() {}
		}), videoEnd = function(a) {
			1 == a ? _videoOnProgress1() : 2 == a ? _videoOnProgress2() : 3 == a && _videoOnProgress3()
		}, $(".p2v1").bind("click", function(a) {
			isiOSV8 ? TweenMax.to(".J_vf3,.p2v1", .5, {
				alpha: 0,
				onComplete: function() {
					$(".J_vf3,.p2v1").remove()
				}
			}) : $(".J_vf3,.p2v1").remove(), $("#video1").css({
				display: "block"
			}), isiOSV8 ? ($("#video3")[0].play(), $("#video3")[0].currentTime = 1) : ($("#video3")[0].play(), setTimeout(function() {
				$("#video3")[0].currentTime = 1, $("#video3")[0].play()
			}, 100)), TrackAll("help"), TrackEvent.SendGaPv("/calligraphic/page", "/calligraphic/page")
		}), $(".p3v1").bind("click", function(a) {
			_Global.baseAction.showPage("page2"), TrackAll("take")
		}), _Global.baseAction.showPage("page1", function() {
			isiOSV8 ? ($("#video1")[0].play(), $("#video1")[0].currentTime = 1) : ($("#video1").css({
				display: "block"
			}), $(".J_vf1").bind("touchstart", function(a) {
				$("#video1")[0].play(), setTimeout(function() {
					$("#video1")[0].currentTime = 1, $("#video1")[0].play()
				}, 100), $(".J_vf1").hide(), $("#video1").unbind("touchstart")
			}))
		});
		var a = document.getElementById("cp");
		ctx = a.getContext("2d"), $(".J_reset").bind("click", function(a) {
			ctx.clearRect(0, 0, 582, 705), _Global.nothasDraw = !0, $("#J_tipem").attr("src", "image/text1.png")
		}), ctx.lineWidth = 3, ctx.lineJoin = ctx.lineCap = "round";
		var b, c;
		a.addEventListener("touchstart", function(a) {
			b = !0, c = {
				x: a.touches[0].clientX - 29,
				y: a.touches[0].clientY - 150
			}
		}, !1), a.addEventListener("touchmove", function(a) {
			b && (ctx.beginPath(), ctx.globalAlpha = 1, ctx.moveTo(c.x, c.y), ctx.lineTo(a.touches[0].clientX - 29, a.touches[0].clientY - 150), ctx.stroke(), ctx.moveTo(c.x - 4, c.y - 4), ctx.lineTo(a.touches[0].clientX - 29 - 4, a.touches[0].clientY - 150 - 4), ctx.stroke(), ctx.moveTo(c.x - 2, c.y - 2), ctx.lineTo(a.touches[0].clientX - 29 - 2, a.touches[0].clientY - 150 - 2), ctx.stroke(), ctx.moveTo(c.x + 2, c.y + 2), ctx.lineTo(a.touches[0].clientX - 29 + 2, a.touches[0].clientY - 150 + 2), ctx.stroke(), ctx.moveTo(c.x + 4, c.y + 4), ctx.lineTo(a.touches[0].clientX - 29 + 4, a.touches[0].clientY - 150 + 4), ctx.stroke(), _Global.nothasDraw && (setTimeout(function() {
				TweenMax.to(".J_pta", .5, {
					alpha: 0
				})
			}, 1e4), _Global.nothasDraw = !1), c = {
				x: a.touches[0].clientX - 29,
				y: a.touches[0].clientY - 150
			})
		}, !1), a.addEventListener("touchend", function() {
			b = !1
		}, !1), _Global.share.init()
	})
});