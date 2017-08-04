(function (g) {
  if (g.shake) {
    return
  }
  var shake = {};
  shake._cnf = {
    pollTime: 1000,
    defCurtainW: 218,
    defMainW: 1004,
    defW: 1440,
    userLiW: 103,
    userPlayTime: 1200,
    ingDisplayNum: 6,
    resultDisplayNum: 10,
  };
  shake._pollTimer = null;
  shake._pollAjaxObj = null;
  shake._storage = null;
  shake._countdown = null;
  shake._shakeInfo = null;
  shake._lastShakeInfo = null;
  shake._isStartedCountDown = false;
  shake._isInMoving = false;
  shake._countDownTimer = null;
  shake._countDownTime = 5;
  shake._userList = null;
  shake._rank_zh_cn = {
    "1": "一",
    "2": "二",
    "3": "三",
    "4": "四",
    "5": "五",
    "6": "六",
    "7": "七",
    "8": "八",
    "9": "九",
    "10": "十"
  };
  shake._rankProgressColor = {
    0: "bar-sixth",
    1: "bar-first",
    2: "bar-second",
    3: "bar-third",
    4: "bar-fourth",
    5: "bar-fifth",
    6: "bar-sixth"
  };
  shake._rankColor = {
    0: "rank-default",
    1: "rank1",
    2: "rank2",
    3: "rank3",
    4: "rank4",
    5: "rank5",
    6: "rank6"
  };
  shake._leftOverTime = 0;
  shake.init = function (conf) {
    conf = conf || {};
    this._cnf.skinList = conf.skinList || [];
    this._cnf.resultDisplayNum = conf.resultDisplayNum || 10;
    var storeType = "memoryStorage";
    this._storage = new g.Storage("storage", "shake-" + g.getConf("companyId"));
    this._userList = new g.LinkList({
      name: "shake-u-" + g.getConf("companyId"),
      storeType: storeType,
      "unique": "id"
    });
    this._userPlayedList = new g.LinkList({
      name: "shake-u-p-" + g.getConf("companyId"),
      storeType: storeType,
      "unique": "id"
    });
    this.bindEvent();
    g.addMusic({
      id: "shake",
      url: g.getConf("siteUrl") + "/js/soundmanagerv2/mp3/shake.mp3",
      autoLoad: true
    });
    g.addMusic({
      id: "countdown",
      url: g.getConf("siteUrl") + "/js/soundmanagerv2/mp3/car_countdown.mp3",
      autoLoad: true
    })
  };
  shake.resize = function () {
    if (this._isResized) {
      return
    }
    this.resizeWaitBox();
    this.resizeIngBox();
    this.resizeCountdownBox();
    this._isResized = true
  };
  shake.resizeIngBox = function () {
    var leftW = $(window).width() - $("#shake_curtainLeft").width() * 2;
    var box = $("#shake_ingBox");
    var boxH = g._height(box);
    var wh = $(window).height();
    box.css({
      width: "100%"
    });
    if (wh < 800) {
      $(".runway-list li").css("margin-bottom", "70px");
      this._trH = null
    }
  };
  shake.resizeCountdownBox = function () {
    var box = $("#shake_countdownBox");
    box.css({
      top: ($(window).height() - box.height()) / 2 * 0.5,
    })
  };
  shake.resizeWaitBox = function () {
    var leftW = $(window).width() - $("#shake_curtainLeft").width() * 2;
    var box = $("#shake_waitBox");
    var minW = parseInt(box.css("min-width"));
    if (!isNaN(minW) && leftW < minW) {
      leftW = minW
    }
    if ($(window).width() <= 1024) {
      box.find(".user-right").css("margin-left", "470px")
    }
    box.show().css("visibility", "hidden");
    box.css({
      visibility: "visible",
      display: "none"
    })
  };
  shake.bindEvent = function () {
    var me = this;
    g.sub("key.89.down", function (name, e) {
      if (g.getState() != "shake") {
        g.setState("shake")
      } else {
        g.setState("message")
      }
    });
    g.sub("key.enter.down", function () {
      if (me.inWait()) {
        $("#shake_startCountDown").trigger("click");
        return
      }
    });
    $("#shake_startCountDown").click(function () {
      if (me._isStartedCountDown) {
        g.log("me._isStartedCountDown true");
        return
      }
      if (me._userList.length() == 0 && me._userPlayedList.length() == 0) {
        g.showMsg("参与人数不足，不能进入倒计时");
        return
      }
      me._updateLock = true;
      me.startCountdown(function (info) {
        if (info != "ok") {
          g.showMsg(info);
          me._updateLock = false;
          return
        }
        $("#shake_waitBox").css("z-index", 0);
        me.stopUserRenderTimer();
        (function () {
          $("#shake_waitBox").hide();
          $("#shake_countdownBox").show();
          me._countdownBox_showed = true;
          me._waitBox_hided = true;
          me.bindCountdownEvent();
          (function () {
            $("#shake_countdownBox").css("z-index", 3);
            me._updateLock = false;
            shake._countDownTime = shake._shakeInfo.countdown_sec;
            $("#remainTime").text(shake._countDownTime);
            shake._countDownTime -= 1;
            me.customCountdown()
          })()
        })()
      })
    });
    $("#shake_reGameBtn").click(function () {
      var thisBtn = $(this);
      if (thisBtn.attr("data-disabled") == "yes") {
        return
      }
      if (!me._shakeInfo.id) {
        return
      }
      thisBtn.attr("data-disabled", "yes");
      me.pollStop();
      $.post(g.url("user/shake/regame"), {
        shake_id: me._shakeInfo.id
      }, function (json) {
        thisBtn.attr("data-disabled", "no");
        if (json.info == "ok") {
          if (me._countdown) {
            me._countdown.stop();
            me._countdown.clear()
          }
          me.resetWaitBox();
          me.resetCountdownBox();
          me.resetIng();
          $("#shake_otherRankBox").hide();
          me._userPlayedList.clear();
          $(".js_musicSucc")[0].pause();
          $(".js_musicSucc")[0].load();
          $(".js_musicBack")[0].load();
          me.setCurrent(json.shake_info);
          me.poll()
        }
      }, "json").error(function () {
        thisBtn.attr("data-disabled", "no");
        me.poll()
      })
    })
  };
  shake.addBgImg = function (idx) {
    var str = "shakebg1 shakebg2 shakebg3 shakebg4";
    var nowClass = "shakebg" + idx;
    str = str.replace(nowClass, "");
    $("#wrap").removeClass(str).addClass(nowClass);
    return true
  };
  shake.bindCountdownEvent = function () {
    var me = this;
    g.subOnce("countdown.complete", function () {
      $(".js_shakeProgress").hide();
      $(".js_shakeFlag").show();
      try {
        g.music("shake").play()
      } catch (e) {
      }
      me.iconShake();
      me._updateLock = true;
      var startTime = (new Date).getTime();
      me.completeCountdown(function (info) {
        if (info != "ok") {
          g.showMsg(info);
          return
        }
        var leftTime = 1500;
        if (leftTime < 0) {
          leftTime = 0
        }
        setTimeout(function () {
          me.countdownFadeOut(function () {
            me.enterIngBox();
            $(".js_musicBack")[0].play();
            me._updateLock = false
          })
        }, leftTime)
      })
    })
  };
  shake.playBackMusic = function () {
  };
  shake.customCountdown = function () {
    shake._countDownTimer = setInterval(function () {
      if (shake._countDownTime < 1) {
        g.pub("countdown.complete");
        clearInterval(shake._countDownTimer);
        shake._countDownTimer = null;
        return
      }
      try {
        g.music("countdown").play()
      } catch (e) {
      }
      $("#remainTime").text(shake._countDownTime);
      shake._countDownTime--
    }, 1000)
  };
  shake.enterIngBox = function () {
    this.resetIngBox();
    $("#shake_ingBox").fadeIn("fast");
    this.startShakeTimeCounter()
  };
  shake.resetIngBox = function () {
    $("#shake_ingBox").css({
      x: 0,
      y: 0,
      rotate: "0deg",
      opacity: 1
    })
  };
  shake.countdownFadeOut = function (cb) {
    var wh = $(window).height();
    $("#shake_countdownBox .ptips3").transition({
      y: -wh,
      duration: 700,
      complete: function () {
        if (cb) {
          cb()
        }
      }
    });
    $("#shake_countdownBox .stage-bg, #shake_countdownBox .shake-progress").transition({
      y: $(window).height() * 2,
      duration: 1000,
      complete: function () {
        $("#shake_countdownBox").hide()
      }
    })
  };
  shake.toggleCurtain = function (cb) {
    if (cb) {
      cb()
    }
    return;
    var oldW = $("#shake_curtainLeft").width();
    var isCalledCb = false;
    if (oldW * 2 >= $(window).width()) {
      $("#shake_curtainLeft, #shake_curtainRight").animate({
        width: "12%"
      }, {
        duration: 1500,
        complete: function () {
          if (isCalledCb) {
            return
          }
          isCalledCb = true;
          g.log("toggleCurtain cb called");
          if (cb) {
            cb()
          }
        }
      });
      setTimeout(function () {
        $("#shake_curtainLeft").addClass("shadow-left");
        $("#shake_curtainRight").addClass("shadow-right")
      }, 0)
    } else {
      $("#shake_curtainLeft, #shake_curtainRight").animate({
        width: "50%"
      }, {
        width: "50%",
        duration: 1500,
        complete: function () {
          if (isCalledCb) {
            return
          }
          $("#shake_curtainLeft").removeClass("shadow-left");
          $("#shake_curtainRight").removeClass("shadow-right");
          isCalledCb = true;
          g.log("toggleCurtain cb called");
          if (cb) {
            cb()
          }
        }
      })
    }
  };
  shake.setCurrent = function (info, isOnlyUpdate) {
    this._lastShakeInfo = this._shakeInfo;
    this._shakeInfo = info;
    this._cnf.resultDisplayNum = info.result_display_num;
    g.log("setCurrent: current_shake_info", info);
    if (this._lastShakeInfo && this._lastShakeInfo.id != this._shakeInfo.id) {
      this.hideAll();
      this._user_last_id = 0
    }
    if (isOnlyUpdate) {
      return this
    }
    if (this._shakeInfo && this._shakeInfo.id > 0) {
      $("#shakeClosedBox").hide()
    } else {
      this.hideAll();
      $("#shakeClosedBox").show()
    }
    this._rankStyleBox = $(".js_rankStyleBox");
    this.resizeIngBox();
    this.render()
  };
  shake.hideAll = function () {
    $("#shake_ingBox .shake-list tr").find(".row3 .shake-show-progress span").transition({
      width: "0%",
      duration: 100
    });
    $("#shake_ingBox .shake-list tr").find(".row4 span").text("0%");
    $("#shake_resultBox").hide();
    $("#shake_ingBox").hide();
    $("#shake_countdownBox").hide();
    $("#shake_waitBox").hide()
  };
  shake.getRankP = function (shakeNum) {
    var p = Math.ceil(shakeNum / this._shakeInfo.max_shake_num * 100);
    if (p > 100) {
      p = 100
    }
    return p
  };
  shake.renderRankOne = function (info) {
    var classData = this.getRankColorClass(info.rank);
    var percent = this.getRankP(info.shake_num);
    var oldTr = this.getTrByUserId(info.user_id);
    var me = this;
    if (oldTr) {
      var oldRank = parseInt(oldTr.attr("data-rank_id"));
      if (oldRank != info.rank) {
        this.moveTo(oldTr, info.rank, function () {
          me.updateTr(oldTr, info)
        })
      } else {
        this.updateTr(oldTr, info)
      }
    } else {
      oldTr = this.getAvailableTr();
      if (oldTr) {
        this.updateTr(oldTr, info);
        this.moveTo(oldTr, info.rank, function () {
        })
      } else {
        g.throwErr("shake.getAvailableTr failed: return null")
      }
    }
    return oldTr
  };
  shake.getAvailableTr = function () {
    var tr = this._rankStyleBox.find('.js_rankOne[data-id="0"]:eq(0)');
    if (tr.length) {
      return tr
    }
    tr = null;
    var userIds = this.getRankUserIds();
    $.each(this._rankStyleBox.find(".js_rankOne"), function () {
      var tmpId = $(this).attr("data-id");
      if (g.inArray(tmpId, userIds) == -1) {
        tr = $(this);
        return false
      }
    });
    return tr
  };
  shake.getRankUserIds = function () {
    var ids = [];
    var len = this._shakeInfo.rank_list.length <= this._cnf.ingDisplayNum ? this._shakeInfo.rank_list.length : this._cnf.ingDisplayNum;
    for (var i = 0; i < len; i++) {
      ids.push(parseInt(this._shakeInfo.rank_list[i].user_id))
    }
    return ids
  };
  shake.updateTr = function (tr, info, isHidden) {
    return shake.updateTr2(tr, info, isHidden)
  };
  /** 关键  **/
  shake.updateTr2 = function (tr, info, isHidden) {
    var percent = this.getRankP(info.shake_num);
    var oldRank = tr.attr("data-rank_id");
    var rankHtml = '<img src="' + info.avatar + '" alt="">';
    if (oldRank > 0 && oldRank != info.rank) {
      var Avatar = tr.find(".ava");
      if (Avatar.children("img").attr("src") != info.avatar) {
        setTimeout(function () {
          tr.find(".horse-rank").text(info.rank)
        }, 125)
      } else {
        setTimeout(function () {
          tr.find(".horse-rank").text(info.rank)
        }, 125)
      }
    } else {
      tr.find(".ava").html(rankHtml)
    }
    tr.find(".run").css({
      "left": percent + "%"
    });
    tr.attr("data-id", info.user_id).attr("data-rank_id", info.rank);
    tr.find(".js_shakeNum").text(info.shake_num);
    if (isHidden) {
      tr.css("visibility", "hidden")
    } else {
      tr.css("visibility", "visible")
    }
    return tr
  };
  shake.renderRank = function (list) {
    if (!list || !list.length) {
      return false
    }
    list = list.slice(0, this._cnf.ingDisplayNum);
    if (this._isInMoving) {
      g.log("shake.renderRank failed: this._isInMoving = true")
    }
    this._isInMoving = true;
    this._movingStartTime = (new Date).getTime();
    var total = list.length;
    var me = this;
    for (var i = 0; i < list.length; i++) {
      (function (info) {
        setTimeout(function () {
          me.renderRankOne(info);
          if (info.rank >= total) {
            setTimeout(function () {
              me._isInMoving = false;
              g.log("me._isInMoving unlocked");
              g.log("movtime: ", (new Date).getTime() - me._movingStartTime)
            }, 200)
          }
        }, 0 * info.rank)
      })(list[i])
    }
    return true
  };
  shake.getRankColorClass = function (rank) {
    if (isNaN(rank)) {
      g.log("shake.getRankColorClass: rank isNaN");
      return ""
    }
    var rankClass = this._rankColor[rank],
      progressClass = this._rankProgressColor[rank];
    if (!rankClass) {
      rankClass = this._rankColor[0]
    }
    if (!progressClass) {
      progressClass = this._rankProgressColor[0]
    }
    return [rankClass, progressClass]
  };
  shake.renderIng = function () {
    if (this._shakeInfo.rank_list && this._shakeInfo.rank_list.length) {
      this.resetIngBox();
      $("#shake_ingBox").show()
    }
    this.renderRank(this._shakeInfo.rank_list);
    if (!this._shakeOverTimer) {
      this.resumeShakeTimeCounter()
    }
    return this
  };
  shake.resetWaitBox = function () {
    this._isStartedCountDown = false;
    this._waitBox_hided = false;
    this.stopUserRenderTimer();
    $("#shake_waitBox .shake-user-list").html("");
    $("#shake_waitUserJoinTip").show();
    $("#shake_waitBox").css({
      "z-index": 3
    })
  };
  shake.resetCountdownBox = function () {
    $("#shake_countdownBox .ptips3").css("y", 0);
    $("#shake_countdownBox .stage-bg, #shake_countdownBox .shake-progress").css("y", 0);
    $("#shake_countdownBox").css("z-index", 0);
    $(".js_shakeFlag").hide();
    $(".js_shakeProgress").show()
  };
  shake.resetIng = function () {
    $("#shake_ingBox").find(".js_rankOne").attr("data-id", "0").attr("data-rank_id", "0").css({
      "visibility": "hidden",
      "y": 0,
      "opacity": 1
    });
    this.pauseShakeTimeCounter();
    return this
  };
  shake.renderResult = function () {
    clearInterval(this._shakeOverTimer);
    if (this.inResult()) {
      return
    }
    var rankList = this._shakeInfo.rank_list;
    if (!rankList) {
      g.log("renderResult failed: rankList empty");
      return
    }
    var rankObj = $('#shake_resultBox .user-winner[data-rank="1"]');
    if (rankList[0] && this._cnf.resultDisplayNum >= 1) {
      rankObj.find(".shake_winnerName").html(rankList[0]["nickname"]);
      rankObj.find(".shake_winnerAvatar").attr("src", rankList[0]["avatar"]);
      rankObj.show()
    } else {
      rankObj.hide()
    }
    rankObj = $('#shake_resultBox .user-winner[data-rank="2"]');
    if (rankList[1] && this._cnf.resultDisplayNum >= 2) {
      rankObj.find(".shake_winnerName").html(rankList[1]["nickname"]);
      rankObj.find(".shake_winnerAvatar").attr("src", rankList[1]["avatar"]);
      rankObj.show()
    } else {
      rankObj.hide()
    }
    rankObj = $('#shake_resultBox .user-winner[data-rank="3"]');
    if (rankList[2] && this._cnf.resultDisplayNum >= 3) {
      rankObj.find(".shake_winnerName").html(rankList[2]["nickname"]);
      rankObj.find(".shake_winnerAvatar").attr("src", rankList[2]["avatar"]);
      rankObj.show()
    } else {
      rankObj.hide()
    }
    var otherHtml = "";
    var totalResultNum = Math.min(this._cnf.resultDisplayNum, rankList.length);
    for (var i = 3; i < totalResultNum; i++) {
      var rank = i + 1;
      otherHtml += '          <li>             <img src="' + rankList[i]["avatar"] + '" alt="">             <span>' + rankList[i]["nickname"] + "</span>             <em>第" + this._rank_zh_cn[rank] + "名</em>           </li>"
    }
    $("#shake_otherRankBox").html(otherHtml);
    if (rankList.length > 3) {
      $("#shake_otherRankBox").show()
    }
    var wh = $(window).height();
    $("#shake_ingBox").transition({
      y: -wh,
      opacity: 0,
      x: 100,
      duration: 1500,
      perspective: "100px",
      rotate: "-90deg",
      complete: function () {
        $("#shake_ingBox").hide()
      }
    });
    $("#shake_resultBox").css({
      y: wh,
      display: "block",
      opacity: 0
    }).transition({
      y: 0,
      opacity: 1,
      easing: "snap",
      duration: 1500,
      complete: function () {
      }
    })
  };
  shake.render = function () {
    if (!this._shakeInfo) {
      g.log("shake.render failed: _shakeInfo is empty");
      return
    }
    if (this._updateLock) {
      g.log("shake.render failed: _updateLock is true");
      return
    }
    var progress = parseInt(this._shakeInfo.progress);
    if (progress == 0 || progress == 1) {
      this.renderUser()
    } else {
      if (progress < 5) {
        this.renderCountdown()
      } else {
        if (progress < 10) {
          this.renderIng()
        } else {
          if (this._willRenderResult) {
            g.log("shake._willRenderResult = true");
            return
          }
          if (this.inResult()) {
            g.log("shake.inResult true");
            return
          }
          this._willRenderResult = true;
          this.renderIng();
          var me = this;
          if (me._shakeInfo) {
            me.renderResult();
            me._willRenderResult = false;
            $(".js_musicBack")[0].pause();
            $(".js_musicSucc")[0].play()
          } else {
            setTimeout(function () {
              me._willRenderResult = false
            }, 2000)
          }
        }
      }
    }
    return this
  };
  shake.getTrByRank = function (rank) {
    var tr = this._rankStyleBox.find('.js_rankOne[data-rank_id="' + rank + '"]');
    if (!tr.length) {
      return null
    }
    return tr
  };
  shake.getTrByUserId = function (userId) {
    var tr = this._rankStyleBox.find('.js_rankOne[data-id="' + userId + '"]');
    if (!tr.length) {
      return null
    }
    return tr
  };
  shake.moveDown = function (now, to, cb) {
    var tr;
    if (now instanceof jQuery) {
      tr = now;
      var oldY = parseFloat(tr.css("y")) || 0;
      now = tr.index() + 1 + oldY / this.trH()
    } else {
      tr = this.getTrByRank(now)
    }
    var y = this.getMoveY(to - now, tr);
    tr.css({
      transformOrigin: "0 0"
    }).transition({
      y: y,
      x: 50,
      duration: 500,
      opacity: 0.4,
      scale: 0.7,
      complete: function () {
        $(this).transition({
          scale: 1,
          x: 0,
          opacity: 1,
          duration: 100,
          complete: function () {
            if (cb) {
              cb($(this))
            }
          }
        })
      }
    })
  };
  shake.moveUp = function (now, to, cb) {
    var tr;
    if (now instanceof jQuery) {
      tr = now;
      var oldY = parseFloat(tr.css("y")) || 0;
      now = tr.index() + 1 + oldY / this.trH()
    } else {
      tr = this.getTrByRank(now)
    }
    var y = this.getMoveY(to - now, tr);
    tr.css({
      transformOrigin: "0 0"
    }).transition({
      y: y,
      easing: "snap",
      x: -50,
      duration: 500,
      scale: 1.4,
      complete: function () {
        $(this).transition({
          scale: 1,
          x: 0,
          duration: 100,
          complete: function () {
            if (cb) {
              cb($(this))
            }
          }
        })
      }
    })
  };
  shake.moveHide = function (now) {
  };
  shake.moveShow = function (to, cb) {
  };
  shake.moveTo = function (now, to, cb) {
    to = parseInt(to);
    var trNow = now instanceof jQuery ? this.getTrNow(now) : now;
    if (trNow == 0) {
      this.moveShow(now, to, cb)
    } else {
      if (trNow > 0 && to == 0) {
        this.moveHide(now, to, cb)
      } else {
        if (trNow > to) {
          this.moveUp(now, to, cb)
        } else {
          this.moveDown(now, to, cb)
        }
      }
    }
  };
  shake.getMoveY = function (unit, tr) {
    var trH = this.trH();
    var oldY = parseFloat(tr.css("y")) || 0;
    return trH * unit + oldY
  };
  shake.getTrNow = function (tr) {
    var oldY = parseFloat(tr.css("y")) || 0;
    now = tr.index() + 1 + oldY / this.trH();
    return now
  };
  shake.trH = function () {
    if (this._trH) {
      return this._trH
    }
    var tr0 = this.getTrByRank(1);
    if (!tr0) {
      g.log("shake.trH failed: tr0 not exists");
      return 0
    }
    this._trH = g._height(tr0);
    return this._trH
  };
  shake.renderCountdown = function () {
  };
  shake.startCountdown = function (cb) {
    if (this._shakeInfo.progress != 0 && this._shakeInfo.progress != 1) {
      g.throwErr("shake.startCountdown failed: _shakeInfo.progress != [0, 1]")
    }
    var me = this;
    this._isStartedCountDown = true;
    $.post(g.url("shake/update_progress"), {
      shake_id: this._shakeInfo.id,
      progress: 1
    }, function (json) {
      var errMsg = "ok";
      if (json.info != "ok") {
        g.log(json.info);
        errMsg = json.info
      }
      if (json.code == "update") {
        me.setCurrent(json.shake_info, "update")
      } else {
        if (json.code == "reset") {
          me.setCurrent(json.shake_info)
        } else {
          if (json.code == "closed") {
            me.setCurrent(null)
          }
        }
      }
      me._startCountdownNow = json.shake_info.now_time;
      if (errMsg == "ok") {
        if (cb) {
          cb("ok")
        }
      } else {
        if (cb) {
          cb(errMsg)
        }
      }
    }, "json").error(function () {
      if (cb) {
        cb("网络错误：摇一摇开始倒计时更新失败")
      }
    })
  };
  shake.completeCountdown = function (cb) {
    var me = this;
    $.post(g.url("shake/update_progress"), {
      shake_id: this._shakeInfo.id,
      progress: 5
    }, function (json) {
      var errMsg = "ok";
      if (json.info != "ok") {
        errMsg = json.info
      }
      if (json.code == "update") {
        me.setCurrent(json.shake_info)
      } else {
        if (json.code == "reset") {
          me.setCurrent(json.shake_info)
        } else {
          if (json.code == "closed") {
            me.setCurrent(null)
          }
        }
      }
      if (cb) {
        cb(errMsg)
      }
    }, "json").error(function () {
      if (cb) {
        cb("网络错误：摇一摇结束倒计时更新失败")
      }
    })
  };
  shake.startShakeTimeCounter = function (totalTime) {
    var me = this,
      timer;
    this._leftOverTime = totalTime || this._shakeInfo.max_shake_second;
    if (!this._leftOverTime || this._leftOverTime <= 0) {
      g.log("shake.startShakeTimeCounter failed: _leftOverTime <= 0");
      return
    }
    var fn = function () {
      $.post(g.url("shake/update_progress"), {
        shake_id: me._shakeInfo.id,
        progress: 10,
        type: "overtime"
      }, function (json) {
        var errMsg = "ok";
        if (json.info != "ok") {
          g.log(json.info);
          errMsg = json.info
        }
        if (json.code == "update") {
          me.setCurrent(json.shake_info, "update")
        } else {
          if (json.code == "reset") {
            me.setCurrent(json.shake_info)
          } else {
            if (json.code == "closed") {
              me.setCurrent(null)
            }
          }
        }
        $(".js_musicBack")[0].pause();
        $(".js_musicSucc")[0].play()
      }, "json").error(function () {
        g.showMsg("网络错误：摇一摇开始倒计时更新失败")
      })
    };
    (function () {
      me._shakeOverTimer = setInterval(function () {
        me._leftOverTime--;
        $("#leftOverTime").text(me._leftOverTime);
        if (me._leftOverTime <= 0) {
          clearInterval(me._shakeOverTimer);
          fn()
        }
      }, 1000);
      $("#leftOverTime").text(me._leftOverTime)
    })()
  };
  shake.pauseShakeTimeCounter = function () {
    clearInterval(this._shakeOverTimer);
    this._shakeOverTimer = null
  };
  shake.resumeShakeTimeCounter = function () {
    this.pauseShakeTimeCounter();
    this.startShakeTimeCounter(this._leftOverTime)
  };
  shake.poll = function () {
    var nowTime = (new Date).getTime();
    g.log("shake_poll_time:", nowTime - this._pollStartTime);
    this._pollStartTime = nowTime;
    this.pollStop();
    var url = g.url("shake/current");
    var me = this;
    var demoShakeId = this._cnf.demoShakeId || 0;
    this._pollAjaxObj = $.getJSON(url, {
      demo_shake_id: demoShakeId,
      user_last_id: this._user_last_id
    }, function (json) {
      g.pub("network.ok");
      if (json.demo_shake_id > 0) {
        me._cnf.demoShakeId = parseInt(json.demo_shake_id)
      }
      if (json.info != "ok") {
        g.log("checkin_sync failed: ", json)
      }
      if (json.result) {
        me.setCurrent(json.result)
      }
      if (json.result && json.shake_user) {
        me._user_last_id = json.shake_user.last_id;
        me.addUser(json.shake_user.list)
      }
      if (json.qr_url) {
        me.setQr(json.qr_url)
      }
      me._pollTimer = setTimeout(function () {
        me.poll()
      }, me._cnf.pollTime)
    }).error(function (jqXHR, errTxt) {
      me._pollTimer = setTimeout(function () {
        me.poll()
      }, me._cnf.pollTime);
      if (jqXHR.readyState < 2 && errTxt == "error") {
        g.pub("network.disconnected", jqXHR)
      }
    })
  };
  shake.pollStop = function () {
    clearTimeout(this._pollTimer);
    if (this._pollAjaxObj) {
      this._pollAjaxObj.abort()
    }
    this._pollTimer = null;
    this._pollAjaxObj = null
  };
  shake.inWait = function () {
    if ($("#shake_waitBox:visible").length) {
      return true
    }
    return false
  };
  shake.inCountdown = function () {
    if ($("#shake_countdownBox:visible").length) {
      return true
    }
    return false
  };
  shake.inIng = function () {
    if ($("#shake_ingBox:visible").length) {
      return true
    }
    return false
  };
  shake.inResult = function () {
    if ($("#shake_resultBox:visible").length) {
      return true
    }
    return false
  };
  shake.syncToLocal = function () {
  };
  shake.on = function () {
    $("#whole").css("opacity", 0);
    $("#shake_wholeLayer").addClass("shakeInitBg").fadeIn();
    this.resize();
    this.poll()
  };
  shake.off = function () {
    $("#whole").css("opacity", 1);
    $("#shake_wholeLayer").hide().removeClass("shakeInitBg");
    this.pollStop()
  };
  shake.setQr = function (url) {
    var qrImgNow = $("#shake_qrCode").attr("src");
    if (!qrImgNow || qrImgNow.split("?")[0] != url.split("?")[0]) {
      $("#shake_qrCode").attr("src", url).show()
    }
  };
  shake.addUser = function (list) {
    if (!list || !list.length) {
      return false
    }
    for (var i = 0; i < list.length; i++) {
      var oldElem = this.getUser(list[i].id);
      if (!oldElem) {
        this._userList.push(list[i])
      }
    }
    return true
  };
  shake.getUser = function (id) {
    var elem = this._userList.getElemByPointer(id);
    if (!elem || elem.data == "head") {
      return false
    }
    return elem
  };
  shake.renderUser = function () {
    if (this._waitBox_hided) {
      g.log("shake.renderUser failed: this._waitBox_hided = true");
      return
    }
    $("#shake_resultBox").hide();
    $("#shake_countdownBox").hide();
    $("#shake_ingBox").hide();
    $("#shakeClosedBox").hide();
    $("#shake_waitBox").show();
    if ($(window).width() <= 1024 && !this._isresized_shake_waitUserJoinTip) {
      this._isresized_shake_waitUserJoinTip = true;
      $("#shake_waitUserJoinTip").width($("#shake_waitUserJoinTip").width() - 25)
    }
    if (!this._userPlayTimer) {
      this.startUserRenderTimer()
    }
  };
  shake.startUserRenderTimer = function () {
    this.stopUserRenderTimer();
    var me = this;
    this._userPlayTimer = setInterval(function () {
      var elem = me._userList.shift();
      if (elem) {
        $("#shake_waitUserJoinTip").hide();
        $("#shake_userList").show();
        me.renderUserOne(elem.data);
        me._userPlayedList.push(elem.data)
      } else {
        g.log("shake.startUserRenderTimer failed: no user")
      }
    }, this._cnf.userPlayTime)
  };
  shake.stopUserRenderTimer = function () {
    clearInterval(this._userPlayTimer);
    this._userPlayTimer = null
  };
  shake.renderUserOne = function (info) {
    var html = '<li style="display:none;" data-id="' + info.id + '" data-user_id="' + info.user_id + '"><img src="' + info.avatar + '" alt=""></li>';
    if ($('li[data-user_id="' + info.user_id + '"]:visible').length) {
      return
    }
    $("#shake_waitBox .shake-user-list").append(html);
    if ($("#shake_waitBox .shake-user-list li").length <= this.totalDisplayUserNum()) {
      $("#shake_waitBox .shake-user-list li:last").fadeIn()
    } else {
      $("#shake_waitBox .shake-user-list li:eq(0)").transition({
        scale: 0,
        duration: 300,
        opacity: 0,
        complete: function () {
          $(this).remove();
          $("#shake_waitBox .shake-user-list li:last").fadeIn()
        }
      });
      setTimeout(function () {
      }, 100)
    }
  };
  shake.totalDisplayUserNum = function () {
    return this.getLineUserNum() * 5
  };
  shake.iconShake = function (cb) {
    $("#shake_icon").css({
      transformOrigin: "100% 100%"
    }).transition({
      rotate: "-12deg",
      duration: 300,
      complete: function () {
        $(this).transition({
          rotate: "12deg",
          duration: 300,
          complete: function () {
            $(this).transition({
              rotate: "0deg",
              duration: 300,
              complete: function () {
                if (cb) {
                  cb()
                }
              }
            })
          }
        })
      }
    })
  };
  shake.getLineUserNum = function () {
    if (this._lineUserNum) {
      return this._lineUserNum
    }
    var width = $("#shake_waitBox .shake-user-list").width();
    this._lineUserNum = Math.floor(width / this._cnf.userLiW);
    return this._lineUserNum
  };
  g.registerState("shake", shake)
})(wxscreen);
