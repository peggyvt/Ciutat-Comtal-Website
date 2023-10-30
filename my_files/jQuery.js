$(document).ready(function() {
    /* ACCOMMODATIONS / EVENTS PAGE */
    /* (hover over image and show text or map) */
    $("img").hover(function() {
        var id = $(this).attr('id');
        var number = id.match(/\d+/);
        $(/img-/.test(id)).each(function() {
            $(".hidden-"+number).css("display","block");
        });
    }, function () {
        var id = $(this).attr('id');
        var number = id.match(/\d+/);
        $(/img-/.test(id)).each(function() {
            $(".hidden-"+number).css("display","none");
        });
    });
    $('.hidden').hover(function() {
        $(this).show();
    }, function() {
        $(this).hide();
    });

    /* SIGN-UP | SIGN-IN PAGE */
    /* (SPA show and hide divs using css display element) */
    $(".sign-up-btn").click(function() {
        $("#div-sign-in").css("display","none");
        $("#div-sign-up-btn").css("display","none");
        $("#div-sign-up").css("display","block");
    });
    $(".sign-in-form").submit(function() {
        $("#div-sign-in").css("display","none");
        $("#div-sign-up-btn").css("display","none");
        $("#div-sign-up").css("display","none");
    });
    $(".sign-up-form").submit(function() {
        $("#div-sign-in").css("display","none");
        $("#div-sign-up-btn").css("display","none");
        $("#div-sign-up").css("display","none");
    });
});