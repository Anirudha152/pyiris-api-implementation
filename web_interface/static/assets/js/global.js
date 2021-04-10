let timeout = "";
//error close
$(document).on("click", "#a_error_close", function () {
    clearTimeout(timeout);
    $("#div_error").fadeOut(200);
});

//success close
$(document).on("click", "#a_success_close", function () {
    clearTimeout(timeout);
    $("#div_success").fadeOut(200);
});

function removeLoader() {
    $("#div_loading").fadeOut(750, function() {
        $("#div_loading").remove();
    });
    $(".container").removeClass("hide")
}

function triggerAjax (data, async, url, callback, extra_input){
    $.ajax({
        data: {
            command: data
        },
        type: 'POST',
        async: async,
        url: url,
        success: function (recvData) {
            if (callback !== undefined) {
                if (extra_input !== undefined) {
                    callback(recvData, extra_input);
                } else {
                    callback(recvData);
                }
            }
        }
    });
}

function show_message(msg, err){
    if (err) {
        $("#div_error_message").html(msg);
        $("#div_error").fadeIn(300);
        timeout = setTimeout(function () {
            $("#div_error").fadeOut(300);
        }, 5000);
    } else {
        $("#div_success_message").html(msg);
        $("#div_success").fadeIn(300);
        timeout = setTimeout(function () {
            $("#div_success").fadeOut(300);
        }, 5000);
    }
}

function getElementByIndex(className, index) {
    return $(`.${className}[data-index=${parseInt(index, 10)}]`)
}

function getIndexOfElement(element) {
    return element.attr("data-index")
}

$(document).ready(function () {
    $("#div_error").hide();
    $("#div_success").hide();
    $('body').append('<div style="" id="div_loading"><div class="loader">Loading...</div></div>');
});