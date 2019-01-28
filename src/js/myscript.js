var insertStrPre = '<div class="';
var insertStylePre = 'col-xs-12 col-sm-6 ';
var insertStr = ' mainBox"><div class="tool-top"><i class="fa fa-compress fa-lg" data-toggle="tooltip" data-placement="bottom" title="compress"></i><i class="fa fa-expand fa-lg" data-toggle="tooltip" data-placement="bottom" title="expand"></i><i class="fa fa-file-excel-o fa-lg" data-toggle="tooltip" data-placement="bottom" title="json to xml"></i><i class="fa fa-file-code-o fa-lg" data-toggle="tooltip" data-placement="bottom" title="xml to json"></i><i class="fa fa-trash fa-lg" data-toggle="tooltip" data-placement="bottom" title="delete"></i><i class="fa fa-download fa-lg" data-toggle="tooltip" data-placement="bottom" title="download"></i><i class="fa fa-copy fa-lg" data-toggle="tooltip" data-placement="bottom" title="copy"></i><i class="fa fa-close fa-lg pull-right" data-value="close" data-toggle="tooltip" data-placement="bottom"></i></div><div class="tool-right"><i class="fa fa-plus fa-lg"></i></div><textarea class="form-control"></textarea></div>';
var insertStrNoClose = ' mainBox"><div class="tool-top"><i class="fa fa-compress fa-lg" data-toggle="tooltip" data-placement="bottom" title="compress"></i><i class="fa fa-expand fa-lg" data-toggle="tooltip" data-placement="bottom" title="expand"></i><i class="fa fa-file-excel-o fa-lg" data-toggle="tooltip" data-placement="bottom" title="json to xml"></i><i class="fa fa-file-code-o fa-lg" data-toggle="tooltip" data-placement="bottom" title="xml to json"></i><i class="fa fa-trash fa-lg" data-toggle="tooltip" data-placement="bottom" title="delete"></i><i class="fa fa-download fa-lg" data-toggle="tooltip" data-placement="bottom" title="download"></i><i class="fa fa-copy fa-lg" data-toggle="tooltip" data-placement="bottom" title="copy"></i></div><div class="tool-right"><i class="fa fa-plus fa-lg"></i></div><textarea class="form-control"></textarea></div>';

$(function () {
    var maxBoxCount = getMaxBoxCount();
    var currentBoxCount = localStorage.currentBoxCount == undefined ? 0 : parseInt(localStorage.currentBoxCount);
    currentBoxCount = currentBoxCount > maxBoxCount ? maxBoxCount : currentBoxCount;

    var showBoxCount = currentBoxCount == 0 ? maxBoxCount : currentBoxCount;

    var className = getClass(showBoxCount);
    for (i = 0; i < showBoxCount; i++) {
        if (i == 0)
            $(".container-fluid .row").append(insertStrPre + insertStylePre + className + insertStrNoClose);
        else
            $(".container-fluid .row").append(insertStrPre + insertStylePre + className + insertStr);
    }

    setHeight();
    toolTipInit();
    addIconHideAndShow();
});

var resizeTimer = null;
$(window).bind('resize', function () {
    if (resizeTimer) {
        clearTimeout(resizeTimer);
    }

    resizeTimer = setTimeout(function () {
        setHeight();
        addIconHideAndShow();
    }, 300);
});

function setHeight() {
    var wHeight = $(window).height();
    $("textarea").height(wHeight - 70);
}

function toolTipInit() {
    $("[data-toggle='tooltip']").tooltip();
}

function addIconHideAndShow() {
    var maxBoxCount = getMaxBoxCount();
    var currentBoxCount = $(".container-fluid .mainBox").length;

    if (currentBoxCount >= maxBoxCount) {
        $(".container-fluid .tool-right").hide();
        $(".mainBox").css("padding-right", "10px");
    }
    else {
        $(".container-fluid .tool-right").show();
        $(".mainBox").css("padding-right", "30px");
    }
}

function reSizeBoxes() {
    var mainBoxes = $(".container-fluid .mainBox");
    var className = getClass(mainBoxes.length);
    $.each(mainBoxes, function (i, v) {
        $(v).attr("class", insertStylePre + className + " mainBox");
    })
}

$("body").on("click", ".tool-top i", function () {
    console.log(this);
    console.log($(this));

    var dv = $(this)[0].attributes[1].nodeValue;
    //console.log(dv);
    if (dv == "close") {
        $(this).parents(".mainBox").remove();
        reSizeBoxes();
        addIconHideAndShow();
    }

});

//add a box
$("body").on("click", ".tool-right i", function () {
    var mainBoxes = $(".container-fluid .mainBox");
    var className = getClass(mainBoxes.length);
    $.each(mainBoxes, function (i, v) {
        $(v).attr("class", insertStylePre + className + " mainBox");
    })

    $(this).parents(".mainBox").after(insertStrPre + insertStylePre + className + insertStr);

    localStorage.currentBoxCount = mainBoxes.length + 1;

    setHeight();
    toolTipInit();
    addIconHideAndShow();
});

function getClass(boxCount) {
    var classNames = "";
    switch (boxCount) {
        case 1:
            classNames = "col-md-12 col-lg-12";
            break;
        case 2:
            classNames = "col-md-6 col-lg-6";
            break;
        case 3:
            classNames = "col-md-4 col-lg-4";
            break;
        case 4:
        default:
            classNames = "col-md-3 col-lg-3";
            break;
    }
    return classNames;
}

function getMaxBoxCount() {
    var screenWidth = window.screen.width;
    // console.log(screenWidth);

    var maxBoxCount = 0;
    if (screenWidth < 1024) {
        maxBoxCount = 1;
    }
    else if (screenWidth >= 1024 && screenWidth < 1920) {//1080p
        maxBoxCount = 2;
    }
    else if (screenWidth >= 1920 && screenWidth < 2560) {//2k
        maxBoxCount = 3;
    }
    else if (screenWidth >= 2560 && screenWidth < 3840) {//4k
        maxBoxCount = 4;
    }
    else if (screenWidth >= 3840 && screenWidth < 5120) {//5k
        maxBoxCount = 4;
    }
    else if (screenWidth >= 5120) {//5k+
        maxBoxCount = 4;
    }
    return maxBoxCount;
}