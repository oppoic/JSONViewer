
$(function () {
    $("[data-toggle='tooltip']").tooltip();
});

setHeight();

var resizeTimer = null;
$(window).bind('resize', function () {
    if (resizeTimer) {
        clearTimeout(resizeTimer);
    }

    resizeTimer = setTimeout(function () {
        setHeight();
    }, 100);
});

function setHeight() {
    var wHeight = $(window).height();
    $("textarea").height(wHeight - 70);
}

$("body").on("click", ".tool-right i", function () {
    console.log(this);
    console.log($(this));


});