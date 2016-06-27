(function(e) {
	function t() {
		function t() {
			var e = R.createImage("img/mainBg.png"),
			t = e.width,
			n = e.height;
			s.drawImage(e, 0, 0, t, n)
		}
		function n() {
			e("#guidePanel").hide(),
			b.init(),
			b.start()
		}
		t(),
		R.loadImage(h.gameImg,
		function() {
			e("#gamePanel").on("touchstart",
			function() {
				n(),
				n = function() {}
			})
		})
	}
	function n() {
		function n() {
			var t = e(window).width(),
			n = e(window).height();
			c = n < 576 ? n: 576,
			l = t < 320 ? t: 320,
			e(i).attr({
				height: c,
				width: l
			})
		}
		R.loadImage(h.loadImg, t),
		n();
		var r = e(i).parent();
		e(window).on("resize", n)
	}
	var r = {},
	i = document.getElementById("stage"),
	s = i.getContext("2d"),
	o = document.getElementById("score"),
	u = e(window).width(),
	a = e(window).height(),
	f = "ontouchend" in document,
	l,
	c,
	h = {
		loadImg: ["img/mainBg.png", 
				  "img/bg.jpg"],
		gameImg: [
			"img/mainCar.png",
			"img/mainCar2.png", 
			"img/mainIcon.png", 
			"img/boom.png", 
			"img/board1.png", 
			"img/icon1.png"
		]
	},
	p = function() {
		function t() {
			var t = Math.random(),
			n = Math.random(),
			r = Math.random(),
			i = (new Date).getTime();
			return e.md5(i + "" + t * n * r)
		}
		function n() {
			var n;
			try {
				return n = e.cookie.get(s),
				n ? (r(n, !1, !0, !0), n) : (n = localStorage.getItem(i), n ? (r(n, !0, !1, !0), n) : (n = sessionStorage.getItem(i), n ? (r(n, !0, !0, !1), n) : (n = t(), r(n, !0, !0, !0), n)))
			} catch(o) {
				return n = t(),
				r(n, !0, !0, !0),
				n
			}
		}
		function r(t, n, r, o) {
			n && e.cookie.set(s, t, {
				expires: 31536e6
			}),
			r && localStorage.setItem(i, t),
			o && sessionStorage.setItem(i, t)
		}
		var i = "carmeizi/user",
		s = "carmeizi";
		return n()
	} (),
	d = function() {
		function e(e, t) {
			n.lastX = n.x,
			n.lastY = n.y,
			n.x = e - n.width / 2,
			n.y = t - n.height / 2,
			n.x = n.x > l - n.width ? l - n.width: n.x,
			n.x = n.x < 0 ? 0 : n.x,
			n.y = n.y > c - n.height ? c - n.height: n.y,
			n.y = n.y < 0 ? 0 : n.y
		}
		function t(e) {
			if (!n.status) return;
			s.drawImage(b.time % 20 > 15 ? n.model: n.model2, n.x, n.y, n.width, n.height)
		}
		var n = {};
		return n.init = function() {
			n.x,
			n.y,
			n.lastX,
			n.lastY,
			n.status = !0,
			n.model = R.createImage("img/mainCar.png"),
			n.model2 = R.createImage("img/mainCar2.png"),
			n.width = l / 480 * n.model.width,
			n.height = n.width / n.model.width * n.model.height
		},
		n.move = e,
		n.moving = t,
		n
	} (),
	v = function() {
		function e(e) {
			this.type = e,
			this.height = 0,
			this.width = 0,
			this.maxSpeed = 0,
			this.status = !0;
			switch (e) {
			case 1:
				this.score = 1,
				this.maxSpeed = 15;
				break;
			case 2:
				this.score = 0,
				this.maxSpeed = 25
			}
			var t = ["img/mainIcon.png", "img/boom.png"];
			this.modelImg = t[this.type - 1],
			this.model = R.createImage(this.modelImg),
			this.width = l / 480 * this.model.width,
			this.height = this.width / this.model.width * this.model.height,
			this.x = Math.random() * (l - this.width),
			this.y = -this.height;
			var n = b.time / 800 > 100 ? 100 : b.time / 800;
			this.speed = Math.random() * (n - 1) + 5,
			this.speed = this.speed < .5 ? Math.random() * .5 + .5 : this.speed,
			this.speed = this.speed > this.maxSpeed ? this.maxSpeed: this.speed
		}
		function t(t) {
			return new e(t)
		}
		var n = {},
		r = n.planes = [],
		i = n.planesNum = 0;
		n.planes,
		e.prototype.show = function() {
			s.drawImage(this.model, this.x, this.y, this.width, this.height)
		},
		e.prototype.die = function() {
			var e = this.type;
			b.score += this.score,
			this.status = !1
		};
		var o = n.addSome = function() {
			if (b.time % 30 != 0) return;
			i == 36 && (i = 0),
			i++;
			switch (!0) {
			case i % Math.floor(Math.random() * 3) == 0 : n.planes.push(t(2));
				break;
			default:
				n.planes.push(t(1))
			}
		};
		return n.scrolling = function() {
			function e(e) {
				var t = [e.x, e.y],
				n = [e.x + e.width, e.y + e.height],
				r = [d.x + 16, d.y + 10],
				i = [d.x + d.width - 16, d.y + d.height - 26],
				s = [Math.max(t[0], r[0]), Math.max(t[1], r[1])],
				o = [Math.min(n[0], i[0]), Math.min(n[1], i[1])];
				return s[0] < o[0] && s[1] < o[1] ? !0 : !1
			}
			o();
			var t = n.planes.length;
			for (var r = t; r--;) {
				var i = n.planes[r];
				if (i.y > c || i.status == 0) {
					n.planes.splice(r, 1);
					continue
				}
				i.show(),
				e(i) && (i.type == "1" ? m.showheart() : b.stop(), i.die()),
				i.y = i.y + i.speed
			}
		},
		n
	} (),
	m = function() {
		var t = {};
		return t.format = function(e) {
			return function(t, n) {
				return n = n || 5,
				0 >= (n -= t.toString().length) ? t: (e[n] || (e[n] = Array(n + 1).join(0))) + t
			}
		} ([]),
		t.showheart = function() {
			e(".heart").removeClass("hearthot").addClass("hearthot"),
			setTimeout(function() {
				e(".heart").removeClass("hearthot")
			},
			200)
		},
		t.show = function() {
			e(".score-wrap").show()
		},
		t
	} (),
	g = function() {
		var t = e("#resultPanel"),
		n = function() {
			var n = "click";
			f && (n = "touchstart"),
			t.find(".replay").on(n,
			function() {
				b.init(),
				b.start()
			}),
			t.find(".share").on(n,
			function() {
				t.find(".weixin-share").show().one(n,
				function() {
					e(this).hide()
				}),
				gConfig.wxData.desc = e(this).data("desc").replace(/\{x\}/ig, b.score) || ""
			}),
			t.find(".toDownLoad").on(n,
			function() {
				var userAgentInfo = navigator.userAgent;
				var Agents = new Array("iPhone", "iPad", "iPod");
				var flag = false;
				for (var v = 0; v < Agents.length; v++) {
					if (userAgentInfo.indexOf(Agents[v]) > 0) {
						flag = true;
						break;
					}
				}
				if (flag) {
					window.location.href = "http://itunes.apple.com/us/app/wu-shang-wang/id953377467?l=zh&ls=1&mt=8";
				} else {
					window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.wushang";
				}
				
			}),
			t.find(".lottery").on(n,
			function() {
				y.open()
			})
		},
		r = {
			show: function() {
				t.show(),
				r.showScore()
			},
			hide: function() {
				t.hide(),
				gConfig.wxData.desc = ""
			},
			showScore: function() {
				var e = 1,
				n = b.score;
				n === 0 ? e = 1 : n < 10 ? e = 2 : e = 3;
				var r = t.find("#scoreBoard").show().find(".score-" + e);
				y.hide(),
				t.find("#scoreBoard .score-result").hide(),
				r.show(),
				e < 3 ? t.find("#scoreBoard .rank").show() : (t.find("#scoreBoard .rank").hide(), y.preLoad()),
				r.find(".tips span").html(n);
				getTitle(n);
			},
			wxHide: function() {
				t.find(".weixin-share").hide()
			}
		};
		return n(),
		r
	} (),
	y = function() {
		var t = null,
		n = e("#prize"),
		r,
		i = {
			preLoad: function() {
				e.ajax({
					type: "GET",
					url: gConfig.sApi,
					timeout: 2e4,
					dataType: "jsonp",
					jsonp: "jscallback",
					data: {
						mid: p,
						active: gConfig.activeId
					},
					success: function(e) {
						t = e.data || {}
					},
					error: function() {
						t = {}
					}
				})
			},
			open: function() {
				var e = 100,
				n = setInterval(function() {
					if (t || !e) {
						e--,
						clearInterval(n);
						try {
							t.drawtype && t.info1 ? i.showPrize(t.drawtype, t.info1) : i.showDefault(parseInt(Math.random() * 1002, 10) % 2 + 1)
						} catch(r) {
							i.showDefault(parseInt(Math.random() * 1002, 10) % 2 + 1)
						}
					}
				},
				10)
			},
			hide: function() {
				n.hide()
			}
		};
		return i
	} ();
	window.prize = y;
	var b = new Best.Game({
		FPS: 60,
		score: 0,
		time: 0,
		bgImg: R.createImage("img/mainBg.png"),
		bgScrollTime: 0,
		initGraphicContext: function() {
			this.canvas = document.getElementById("stage"),
			this.context = this.canvas.getContext("2d")
		},
		onInit: function() {
			d.init()
		},
		onStart: function() {
			this.scene = this.getScene(0),
			this.scene.init(this),
			this.scene.enter()
		},
		getScene: function(e) {
			var t = w[e];
			return t
		},
		bgScroll: function() {
			var e = this.bgImg.height,
			t = this.bgImg.width;
			this.bgScrollTime += 12 + ((this.time + this.time * .9) / 1e3 > 20 ? 20 : (this.time + this.time * .9) / 1e3),
			this.bgScrollTime > e && (this.bgScrollTime = 0),
			s.drawImage(this.bgImg, 0, this.bgScrollTime - e, t, e),
			s.drawImage(this.bgImg, 0, this.bgScrollTime, t, e)
		},
		onStop: function() {
			e("#gameoverPanel").show(),
			setTimeout(function() {
				g.show(),
				e("#gameoverPanel").hide()
			},
			1e3)
		}
	}),
	w = {}; (function() {
		var t = new Best.Scene({
			id: 0,
			init: function(t) {
				this.game = t,
				e(i).addClass("playing"),
				m.show(),
				this.initEvent()
			},
			initEvent: function() {
				this.clear(),
				d.move(e(i).width() / 2, e(i).height()),
				i = e(i);
				if (f) {
					var t = function(e) {
						e.preventDefault();
						var t = e.targetTouches[0],
						n = t.pageX - i.offset().left,
						r = t.pageY - i.offset().top;
						d.move(n, r)
					};
					i.get(0).removeEventListener("touchmove", t),
					i.get(0).addEventListener("touchmove", t, !1)
				} else i.off("mousemove").on("mousemove",
				function(e) {
					var t = e.clientX - i.offset().left,
					n = e.clientY - i.offset().top;
					d.move(t, n)
				})
			},
			clear: function() {
				this.game.time = 0,
				this.game.score = 0,
				this.game.bgScrollTime = 0,
				d.status = !0,
				v.planes = [],
				v.planesNum = 0,
				o.innerHTML = m.format(this.game.score),
				g.hide()
			},
			enter: function() {},
			update: function() {
				this.game.time++,
				this.game.bgScroll(),
				v.scrolling(),
				d.moving(this.game.time),
				o.innerHTML = m.format(this.game.score)
			},
			handleInput: function() {},
			render: function() {}
		});
		w[t.id] = t
	})(),
	n(),
	WeixinApi.ready(function(e) {
		var t = {
			ready: function() {
				gConfig.wxData.desc || (gConfig.wxData.desc = gConfig.wxDesc)
			},
			cancel: function(e) {
				g.wxHide()
			},
			fail: function(e) {
				g.wxHide()
			},
			confirm: function(e) {
				g.wxHide()
			},
			all: function(e) {
				g.wxHide()
			}
		};
		e.shareToFriend(gConfig.wxData, t),
		e.shareToTimeline(gConfig.wxData, t),
		e.shareToWeibo(gConfig.wxData, t)
	})
})(jQuery);


