var insertHtmlPre = '<div class="';
var insertStylePre = 'col-xs-12 col-sm-6 ';
var insertHtml = ' mainBox"><div class="tool-top"><i class="fa fa-file-excel-o fa-lg" data-toggle="tooltip" title="json to xml" data-value="xml"></i><i class="fa fa-file-code-o fa-lg" data-toggle="tooltip" title="xml to json" data-value="json"></i><i class="fa fa-download fa-lg" data-toggle="tooltip" title="download" data-value="download"></i><i class="fa fa-copy fa-lg" data-toggle="tooltip" title="copy" data-value="copy"></i><i class="fa fa-trash fa-lg" data-toggle="tooltip" title="delete" data-value="delete"></i><i class="fa fa-compress fa-lg" data-toggle="tooltip" title="compress" data-value="compress"></i><i class="fa fa-expand fa-lg" data-toggle="tooltip" title="expand" data-value="expand"></i><i class="fa fa-close fa-lg pull-right" data-toggle="tooltip" title="close" data-value="close"></i></div><div class="tool-right"><i class="fa fa-plus fa-lg"></i></div><div contenteditable="plaintext-only" class="form-control editablediv"></div></div>';
var insertHtmlNoClose = ' mainBox"><div class="tool-top"><i class="fa fa-file-excel-o fa-lg" data-toggle="tooltip" title="json to xml" data-value="xml"></i><i class="fa fa-file-code-o fa-lg" data-toggle="tooltip" title="xml to json" data-value="json"></i><i class="fa fa-download fa-lg" data-toggle="tooltip" title="download" data-value="download"></i><i class="fa fa-copy fa-lg" data-toggle="tooltip" title="copy" data-value="copy"></i><i class="fa fa-trash fa-lg" data-toggle="tooltip" title="delete" data-value="delete"></i><i class="fa fa-compress fa-lg" data-toggle="tooltip" title="compress" data-value="compress"></i><i class="fa fa-expand fa-lg" data-toggle="tooltip" title="expand" data-value="expand"></i></div><div class="tool-right"><i class="fa fa-plus fa-lg"></i></div><div contenteditable="plaintext-only" class="form-control editablediv"></div></div>';

$(function () {
    // var maxBoxCount = getMaxBoxCount();
    // var jsonViewerBoxCount = localStorage.jsonViewerBoxCount == undefined ? 0 : parseInt(localStorage.jsonViewerBoxCount);
    // jsonViewerBoxCount = jsonViewerBoxCount > maxBoxCount ? maxBoxCount : jsonViewerBoxCount;

    // var showBoxCount = jsonViewerBoxCount == 0 ? maxBoxCount : jsonViewerBoxCount;
    // var className = getClass(showBoxCount);
    // for (i = 0; i < showBoxCount; i++) {
    //     if (i == 0)
    //         $(".container-fluid .row").append(insertHtmlPre + insertStylePre + className + insertHtmlNoClose);
    //     else
    //         $(".container-fluid .row").append(insertHtmlPre + insertStylePre + className + insertHtml);
    // }

    // setHeight();
    // addIconHideAndShow();

    var container1 = document.getElementById('container1');
    var container2 = document.getElementById('container2');
    var options = {
        mode: 'code',
        onError: function (err) {
            alert(err.toString());
        }
    };

    var editor1 = new JSONEditor(container1, options);
    var editor2 = new JSONEditor(container2, options);

    editor1.setText("");
    editor2.setText("");

    setHeight();
    //addIconHideAndShow();
});

var resizeTimer = null;
$(window).bind('resize', function () {
    if (resizeTimer) {
        clearTimeout(resizeTimer);
    }

    resizeTimer = setTimeout(function () {
        setHeight();
        //addIconHideAndShow();
    }, 300);
});

function setHeight() {
    var wHeight = $(window).height();
    $("#container1,#container2").height(wHeight);
}

function addIconHideAndShow() {
    var maxBoxCount = getMaxBoxCount();
    var jsonViewerBoxCount = $(".container-fluid .mainBox").length;

    if (jsonViewerBoxCount >= maxBoxCount) {
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
    //console.log(this);

    var nv = this.attributes[3].nodeValue;
    if (nv != undefined) {

        if (nv == "xml") {

        }
        else if (nv == "json") {

        }
        else if (nv == "download") {

        }
        else if (nv == "copy") {

        }
        else if (nv == "delete") {

        }
        else if (nv == "compress") {

        }
        else if (nv == "expand") {
            var editablediv = $(this).parents(".mainBox").children("div.editablediv");
            var content = $.trim(editablediv.text());
            //console.log(content);

            try {
                var jsonHtml = new JSONFormat(content, 4).toString();
                //console.log(jsonHtml);

                editablediv.html(jsonHtml);

            } catch (e) {
                console.log(e);
                alert(e);
            }
        }
        else if (nv == "close") {
            $(this).parents(".mainBox").remove();

            var mainBoxes = $(".container-fluid .mainBox");
            localStorage.jsonViewerBoxCount = mainBoxes.length;

            reSizeBoxes();
            //addIconHideAndShow();
        }
        else {
            console.log("illegal operate");
            console.log(this.attributes[3]);
        }
    }
    else {
        console.log("nodeValue is undefined");
    }
});

//add a box
$("body").on("click", ".tool-right i", function () {
    var mainBoxes = $(".container-fluid .mainBox");
    localStorage.jsonViewerBoxCount = mainBoxes.length + 1;

    $(this).parents(".mainBox").after(insertHtmlPre + insertStylePre + insertHtml);
    reSizeBoxes();

    setHeight();
    //addIconHideAndShow();
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