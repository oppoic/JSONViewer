var insertHtmlPre = '<div class="';
var insertStylePre = 'col-xs-12 col-sm-12 ';
var insertHtml = ' mainBox"><div class="tool-right"><i class="fa fa-plus fa-lg"></i></div><div data-tgt="container"></div></div>';

var jsonMenuRight = '<div class="btn-group-right"><a href="javascript:;" title="Sample JSON">sample</a><button type="button" title="Clear" data-value="clear"><i class="fa fa-eraser"></i></button><button type="button" title="Copy" data-value="copy"><i class="fa fa-copy"></i></button><button type="button" title="Paste" data-value="paste"><i class="fa fa-paste"></i></button><button type="button" title="Download" data-value="download"><i class="fa fa-download"></i></button><button type="button" title="Close" data-value="close"><i class="fa fa-close"></i></button></div>';
var jsonMenuRightNoClose = '<div class="btn-group-right"><a href="javascript:;" title="Sample JSON">sample</a><button type="button" title="Clear" data-value="clear"><i class="fa fa-eraser"></i></button><button type="button" title="Copy" data-value="copy"><i class="fa fa-copy"></i></button><button type="button" title="Paste" data-value="paste"><i class="fa fa-paste"></i></button><button type="button" title="Download" data-value="download"><i class="fa fa-download"></i></button></div>';

var jsonEditorArr = [];
var jsonEditorOptions = {
    mode: 'code',
    onError: function (err) {
        showTip(4, err.toString());
    }
};

$(function () {
    chrome.storage.local.get(["boxCount"]).then((result) => {
        var showBoxCount = getMaxBoxCount();
        if (result.hasOwnProperty('boxCount')) {
            showBoxCount = result.boxCount > showBoxCount ? showBoxCount : result.boxCount;
        }

        for (i = 0; i < showBoxCount; i++) {
            $(".container-fluid .row").append(insertHtmlPre + insertStylePre + getClass(showBoxCount) + insertHtml);
        }

        var cnr = $("[data-tgt='container']");
        var editor;
        $.each(cnr, function (i, v) {
            editor = new JSONEditor(v, jsonEditorOptions);
            editor.setText("");

            jsonEditorArr.push(editor);
        });
        setHeight();
        addIconHideAndShow();

        $("div.jsoneditor-mode-code .jsoneditor-menu a.jsoneditor-poweredBy").remove();
        var jsonMenus = $("div.jsoneditor-mode-code .jsoneditor-menu");
        $.each(jsonMenus, function (i, v) {
            if (i === 0) {
                $(v).append(jsonMenuRightNoClose);
            }
            else {
                $(v).append(jsonMenuRight);
            }
        });
    });
});

var resizeTimer = null;
$(window).bind('resize', function () {
    if (resizeTimer) {
        clearTimeout(resizeTimer);
    }

    resizeTimer = setTimeout(function () {
        setHeight();
        reFormatJson();
        addIconHideAndShow();
    }, 300);
});

function setHeight() {
    $("[data-tgt='container']").height($(window).height());
}

function addIconHideAndShow() {
    if ($(".container-fluid .mainBox").length >= getMaxBoxCount()) {
        $(".tool-right").hide();
        $(".mainBox").css("padding-right", "10px");
    }
    else {
        $(".tool-right").show();
        $(".mainBox").css("padding-right", "30px");
    }
}

function reSizeBoxes() {
    var mainBoxes = $(".container-fluid .mainBox");
    $.each(mainBoxes, function (i, v) {
        $(v).attr("class", insertStylePre + getClass(mainBoxes.length) + " mainBox");
    });
    reFormatJson();
}

function reFormatJson() {
    $.each(jsonEditorArr, function (i, v) {
        if (v.getText() !== '') {
            var currentBox = $('.container-fluid .mainBox')[i];
            $(currentBox).find('.jsoneditor-menu button.jsoneditor-format').click();
        }
    });
}

$("body").on("click", ".tool-right i", function () {
    chrome.storage.local.set({ boxCount: $(".container-fluid .mainBox").length + 1 }).then(() => {
        $(this).parents(".mainBox").after(insertHtmlPre + insertStylePre + insertHtml);

        var boxAdd = $(this).parents(".mainBox").next().children("[data-tgt='container']");
        var editor = new JSONEditor(boxAdd[0], jsonEditorOptions);
        editor.setText("");

        var idx = $(this).parents(".mainBox").next().index();
        jsonEditorArr.splice(idx, 0, editor);

        reSizeBoxes();
        setHeight();
        addIconHideAndShow();

        $("div.jsoneditor-mode-code .jsoneditor-menu a.jsoneditor-poweredBy").remove();
        $(this).parents(".mainBox").next().find(".jsoneditor-menu").append(jsonMenuRight);
    });
});

$("body").on("click", ".btn-group-right button", function () {
    var nv = this.attributes[2].nodeValue;
    if (nv !== undefined) {
        var idx = $(this).parents(".mainBox").index();

        if (nv === "clear") {
            jsonEditorArr[idx].setText('');
        }
        else if (nv === "copy") {
            var jsonCopy = jsonEditorArr[idx].getText();
            if (jsonCopy === "") {
                showTip(4, "Nothing to copy");
            }
            else {
                try {
                    navigator.clipboard.writeText(jsonCopy).then(() => {
                        showTip(1, "Copied to clipboard");
                    }, () => {
                        showTip(4, "Copied failed");
                    });
                } catch (err) {
                    showTip(4, err);
                }
            }
        }
        else if (nv === "paste") {
            try {
                navigator.clipboard.readText().then((clipText) => (jsonEditorArr[idx].setText(clipText)));
            } catch (err) {
                showTip(4, err);
            }
        }
        else if (nv === "download") {
            var jsonDl = jsonEditorArr[idx].getText();
            if (jsonDl === "") {
                showTip(4, "Nothing to download");
            }
            else {
                var blob = new Blob([jsonDl], { type: "text/plain;charset=utf-8" });
                saveAs(blob, "JSONViewer-" + Math.floor(new Date().getTime() / 1000) + ".json");
            }
        }
        else if (nv === "close") {
            var parentMainBox = $(this).parents(".mainBox");
            var idx = $(this).parents(".mainBox").index();
            jsonEditorArr[idx].destroy();
            parentMainBox.remove();

            jsonEditorArr.splice(idx, 1);
            chrome.storage.local.set({ boxCount: $(".container-fluid .mainBox").length }).then(() => {
                reSizeBoxes();
                addIconHideAndShow();
            });
        }
        else {
            console.log("illegal operate");
            console.log(this.attributes);
        }
    }
    else {
        showTip(4, "nodeValue is undefined");
    }
});

$("body").on("click", ".btn-group-right a", function () {
    chrome.storage.local.get(["sjIndex"]).then((result) => {
        var sjIndex = 0;
        if (result.hasOwnProperty('sjIndex')) {
            sjIndex = result.sjIndex >= samplejson.length - 1 ? 0 : result.sjIndex + 1;
        }
        chrome.storage.local.set({ sjIndex: sjIndex }).then(() => {
            jsonEditorArr[$(this).parents(".mainBox").index()].set(samplejson[sjIndex]);
        });
    });
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
    var screenWidth = $(window).width();

    var maxBoxCount = 0;
    if (screenWidth < 1024) {
        maxBoxCount = 1;
    }
    else if (screenWidth >= 1024 && screenWidth < 1920) {
        maxBoxCount = 2;
    }
    else if (screenWidth >= 1920 && screenWidth < 2560) {//1080p
        maxBoxCount = 3;
    }
    else if (screenWidth >= 2560 && screenWidth < 3840) {//2k
        maxBoxCount = 4;
    }
    else if (screenWidth >= 3840 && screenWidth < 5120) {//4k
        maxBoxCount = 5;
    }
    else if (screenWidth >= 5120) {//5k
        maxBoxCount = 6;
    }
    return maxBoxCount;
}

function showTip(type, msg) {
    toastr.clear();
    var level = '';
    var timeout = 0;
    var msgDefault = '';
    switch (type) {
        case 1:
        default:
            level = 'success';
            timeout = 2000;
            msgDefault = 'success';
            break;
        case 2:
            level = 'info';
            timeout = 3000;
            msgDefault = 'info';
            break;
        case 3:
            level = 'warning';
            timeout = 3000;
            msgDefault = 'warning';
            break;
        case 4:
            level = 'error';
            timeout = 5000;
            msgDefault = 'error';
            break;
    }

    toastr.options = {
        "positionClass": "toast-bottom-left",
        "timeOut": timeout
    }

    if (typeof (msg) == "undefined" || msg === '') {
        toastr[level](msgDefault);
    }
    else {
        toastr[level](msg);
    }
}