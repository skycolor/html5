// JavaScript Document
function msgbox(texts, time,top) {
    $(document.body).append('<div class="msgbox"><span>' + texts + '</span></div>')
    $('.msgbox').css({
        position: "fixed",
        left: 0,
        top: "40%",
        /*文本高度*/
        height: "10%",
        width: "100%",
        textAlign: "center",
        /*字体颜色*/
        color: "white",
        zIndex: "99999999"
    }).find('span').css({
        /*背景颜色*/
        backgroundColor: "rgba(0,0,0,0.8)",
        padding: '2.5% 8%',
        borderRadius: "6px",
        fontFamily: '微软雅黑',
        fontSize: '24px',
    });
    if(top){
       $('.msgbox').css({
           top: top 
       }); 
    }
    var height = $('.msgbox').css('height');
    $('.msgbox').css('line-height', height).hide().fadeIn('200');
    if (time) {
        setTimeout(function() {
            $('.msgbox').fadeOut('400', function() {
                $(this).remove();
            });
        }, time);
    } else {
        setTimeout(function() {
            $('.msgbox').fadeOut('400', function() {
                $(this).remove();
            });
        }, 2000); //文字显示时间
    }

}
