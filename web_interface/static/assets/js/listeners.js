ListenerGlobals = {
    "arrow": {
        "bind": false,
        "options": false,
        "listeners": false
    }
};

$(document).ready(function () {
    function onStart() {
		$("#i_bind_content").hide();
		triggerAjax(`show("options")`, true, '/listeners_process', showOptionsCB, undefined)
        subheadingsDisplaySettings();
    }
    onStart();

	$(document).on("click", ".arrow", function () {
        if ($(this).attr("id") == "i_bind_heading") {
            ListenerGlobals["arrow"]["bind"] = !ListenerGlobals["arrow"]["bind"];
        } else if ($(this).attr("id") == "i_options_heading") {
            ListenerGlobals["arrow"]["options"] = !ListenerGlobals["arrow"]["options"];
        } else if ($(this).attr("id") == "i_listeners_heading") {
            ListenerGlobals["arrow"]["listeners"] = !ListenerGlobals["arrow"]["listeners"];
        }
        subheadingsDisplaySettings();
    });

	$(document).on("click", "#button_options_content_interface_update", function () {
        if ($("#input_options_content_interface").val().trim() != "") {
            triggerAjax(`set_option("Interface", "${$("#input_options_content_interface").val().trim()}")`, true, '/listeners_process', showOptionsCB, undefined);
            $("#input_options_content_interface").val("");
        }
    });
	$(document).on("click", "#button_options_content_interface_reset", function () {
        triggerAjax(`reset_option("Interface")`, true, '/listeners_process', showOptionsCB, undefined);
    });
	$(document).on("click", "#button_options_content_port_update", function () {
        if ($("#input_options_content_port").val().trim() != "") {
            triggerAjax(`set_option("Port", "${$("#input_options_content_port").val().trim()}")`, true, '/listeners_process', showOptionsCB, undefined);
            $("#input_options_content_port").val("");
        }
    });
	$(document).on("click", "#button_options_content_port_reset", function () {
        triggerAjax(`reset_option("Port")`, true, '/listeners_process', showOptionsCB, undefined);
    });
	$(document).on("click", "#button_options_content_name_update", function () {
        if ($("#input_options_content_name").val().trim() != "") {
            triggerAjax(`set_option("Name", "${$("#input_options_content_name").val().trim()}")`, true, '/listeners_process', showOptionsCB, undefined);
            $("#input_options_content_name").val("");
        }
    });
	$(document).on("click", "#button_options_content_name_reset", function () {
        triggerAjax(`reset_option("Name")`, true, '/listeners_process', showOptionsCB, undefined);
    });
	$(document).on("click", "#button_options_content_reply_update", function () {
        triggerAjax(`set_option("Reply", "${$("#input_options_content_reply").val()}")`, true, '/listeners_process', showOptionsCB, undefined);
        $("#input_options_content_reply").val("");
    });
	$(document).on("click", "#button_options_content_reply_reset", function () {
        triggerAjax(`reset_option("Reply")`, true, '/listeners_process', showOptionsCB, undefined);
    });
	$(document).on("click", "#button_options_content_reset", function () {
        triggerAjax(`reset_option("all")`, true, '/listeners_process', showOptionsCB, undefined);
    });

	$(document).on("click", "#button_bind_content", function () {
        $("#i_bind_content").show();
        if ($("#input_bind_content_interface").val().trim() != "" && $("#input_bind_content_port").val().trim() != "") {
            triggerAjax(`bind("${$("#input_bind_content_interface").val().trim()}", ${$("#input_bind_content_port").val().trim()})`, true, '/listeners_process', bindCB, undefined);
            $("#input_bind_content_interface").val("");
            $("#input_bind_content_port").val("");
        } else {
            show_message("Please enter a valid host and port", true);
            $("#i_bind_content").hide();
        }
    });

	$(document).on("click", "#button_run", function () {
        triggerAjax(`run_listener()`, true, '/listeners_process', undefined, undefined)
    });

	$(document).on("click", ".button_listeners_content_remove", function () {
	    if (getIndexOfElement($(this)) == -1) {
	        triggerAjax(`kill_listener("all")`, true, '/listeners_process', undefined, undefined);
        } else {
	        getElementByIndex("i_listeners_content", getIndexOfElement($(this))).show();
            triggerAjax(`kill_listener("${$(this).parent().parent().find(":first-child").html()}")`, true, '/listeners_process', undefined, undefined);
        }
    });
	$(document).on('focusout', '.td_listeners_content_name', function () {
        triggerAjax(`rename_listener("${$(this).parent().find(":first-child").html()}", "${$(this).html().replace("<br>", "\\n")}")`, true, '/listeners_process', renameCB, undefined);
    });


    /*
    function CB(recvData) {
        let status = recvData["status"];
        let message = recvData["message"];
        let data = recvData["data"];
        if (status == "ok") {
        } else {
            show_message(message, true)
        }
    }
    */
    function showOptionsCB(recvData) {
        let status = recvData["status"];
        let message = recvData["message"];
        let data = recvData["data"];
        if (status == "ok") {
            $("#td_options_content_interface_value").html(data["listener_values"]["Interface"][0]);
            $("#td_options_content_port_value").html(data["listener_values"]["Port"][0]);
            $("#td_options_content_name_value").html(data["listener_values"]["Name"][0]);
            if (data["listener_values"]["Reply"][0] == "") {
                $("#td_options_content_reply_value").hide();
            } else {
                $("#td_options_content_reply_value").show();
                $("#td_options_content_reply_value").html(data["listener_values"]["Reply"][0]);
            }
            removeLoader();
        } else {
            show_message(message, true)
        }
    }
    function bindCB(recvData) {
        let status = recvData["status"];
        let message = recvData["message"];
        if (status == "ok") {
            show_message(message, false);
        } else {
            show_message(message, true);
        }
        $("#i_bind_content").hide();
    }
    function renameCB(recvData) {
        let status = recvData["status"];
        let message = recvData["message"];
        if (status == "ok") {
            show_message(message, false);
        } else {
            show_message(message, true);
        }
    }
});

function subheadingsDisplaySettings() {
        let shownSettings = ListenerGlobals["arrow"];
        if (shownSettings["bind"]) {
            $("#i_bind_heading").removeClass("fa-angle-right");
            $("#i_bind_heading").addClass("fa-angle-down");
            $("#div_bind_content").show()
        } else {
            $("#i_bind_heading").removeClass("fa-angle-down");
            $("#i_bind_heading").addClass("fa-angle-right");
            $("#div_bind_content").hide()
        }
        if (shownSettings["options"]) {
            $("#i_options_heading").removeClass("fa-angle-right");
            $("#i_options_heading").addClass("fa-angle-down");
            $("#div_options_content").show()
        } else {
            $("#i_options_heading").removeClass("fa-angle-down");
            $("#i_options_heading").addClass("fa-angle-right");
            $("#div_options_content").hide()
        }
        listenersDisplaySettings();
    }

function listenersDisplaySettings() {
    if ($("#table_listeners_content tr").length == 1) {
        $("#div_listeners").hide();
    } else {
        $("#div_listeners").show();
        if (ListenerGlobals["arrow"]["listeners"]) {
            $("#i_listeners_heading").removeClass("fa-angle-right");
            $("#i_listeners_heading").addClass("fa-angle-down");
            $("#div_listeners_content").show()
        } else {
            $("#i_listeners_heading").removeClass("fa-angle-down");
            $("#i_listeners_heading").addClass("fa-angle-right");
            $("#div_listeners_content").hide()
        }
    }
}

