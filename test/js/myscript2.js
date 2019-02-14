var insertHtmlPre = '<div class="';
var insertStylePre = 'col-xs-12 col-sm-6 ';
var insertHtml = ' mainBox"><div class="tool-right"><i class="fa fa-plus fa-lg" data-value="add"></i><i class="fa fa-close fa-lg" data-value="close"></i></div><div data-tgt="container"></div></div>';
var insertHtmlNoClose = ' mainBox"><div class="tool-right"><i class="fa fa-plus fa-lg" data-value="add"></i></div><div data-tgt="container"></div></div>';

var options = {
    mode: 'code',
    onError: function (err) {
        console.log(err.toString());
        alert(err.toString());
    }
};

$(function () {
    // var options = {
    //     mode: 'code',
    //     onError: function (err) {
    //         console.log(err.toString());
    //         alert(err.toString());
    //     }
    // };

    // var cnr = $("[data-tgt='container']");
    // var editor;
    // $.each(cnr, function (i, v) {
    //     editor = new JSONEditor(v, options);
    //     editor.setText("");
    // });
    // setHeight();
    // addIconHideAndShow();

    var maxBoxCount = getMaxBoxCount();
    var jsonViewerBoxCount = localStorage.jsonViewerBoxCount == undefined ? 0 : parseInt(localStorage.jsonViewerBoxCount);
    jsonViewerBoxCount = jsonViewerBoxCount > maxBoxCount ? maxBoxCount : jsonViewerBoxCount;

    var showBoxCount = jsonViewerBoxCount == 0 ? maxBoxCount : jsonViewerBoxCount;
    var className = getClass(showBoxCount);

    for (i = 0; i < showBoxCount; i++) {
        if (i == 0) {
            $(".container-fluid .row").append(insertHtmlPre + insertStylePre + className + insertHtmlNoClose);
        }
        else {
            $(".container-fluid .row").append(insertHtmlPre + insertStylePre + className + insertHtml);
        }
    }

    var cnr = $("[data-tgt='container']");
    var editor;
    $.each(cnr, function (i, v) {
        editor = new JSONEditor(v, options);
        editor.setText("");
    });
    setHeight();
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
    $("[data-tgt='container']").height(wHeight);
}

function addIconHideAndShow() {
    var maxBoxCount = getMaxBoxCount();
    var jsonViewerBoxCount = $(".container-fluid .mainBox").length;

    if (jsonViewerBoxCount >= maxBoxCount) {
        $(".tool-right [data-value='add']").hide();
        $(".mainBox").eq(0).css("padding-right", "10px");
    }
    else {
        $(".tool-right [data-value='add']").show();
        $(".mainBox").eq(0).css("padding-right", "30px");
    }
}

function reSizeBoxes() {
    var mainBoxes = $(".container-fluid .mainBox");
    var className = getClass(mainBoxes.length);
    $.each(mainBoxes, function (i, v) {
        $(v).attr("class", insertStylePre + className + " mainBox");
    })
}

$("body").on("click", ".tool-right i", function () {
    //console.log(this);

    var nv = this.attributes[1].nodeValue;
    if (nv != undefined) {
        if (nv == "add") {
            var mainBoxes = $(".container-fluid .mainBox");
            localStorage.jsonViewerBoxCount = mainBoxes.length + 1;

            $(this).parents(".mainBox").after(insertHtmlPre + insertStylePre + insertHtml);

            var boxAdd = $(this).parents(".mainBox").next().children("[data-tgt='container']");
            //console.log(boxAdd);

            var editor = new JSONEditor(boxAdd[0], options);
            editor.setText("");

            reSizeBoxes();

            setHeight();
            addIconHideAndShow();
        }
        else if (nv == "close") {
            //editor.destroy();
            $(this).parents(".mainBox").remove();

            var mainBoxes = $(".container-fluid .mainBox");
            localStorage.jsonViewerBoxCount = mainBoxes.length;

            reSizeBoxes();
            addIconHideAndShow();
        }
        else {
            console.log("illegal operate");
            console.log(this.attributes);
        }
    }
    else {
        console.log("nodeValue is undefined");
    }
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
            classNames = "col-md-3 col-lg-3";
            break;
        case 5:
            classNames = "col-md-1-5 col-lg-1-5";
            break;
        case 6:
        default:
            classNames = "col-md-2 col-lg-2";
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
        maxBoxCount = 6;
    }
    else if (screenWidth >= 2560 && screenWidth < 3840) {//4k
        maxBoxCount = 4;
    }
    else if (screenWidth >= 3840 && screenWidth < 5120) {//5k
        maxBoxCount = 5;
    }
    else if (screenWidth >= 5120) {//5k+
        maxBoxCount = 6;
    }
    return maxBoxCount;
}