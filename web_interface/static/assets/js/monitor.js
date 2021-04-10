MonitorGlobals = {
    "error": true,
    "currentLocation": null
};
$(document).ready(function () {
    MonitorGlobals["currentLocation"] = location.href.split("/").slice(-1)[0];
    if (MonitorGlobals["currentLocation"].includes("listeners")) {
        MonitorGlobals["currentLocation"] = "listeners";
    } else if (MonitorGlobals["currentLocation"].includes("scouts")) {
        MonitorGlobals["currentLocation"] = "scouts";
    } else {
        MonitorGlobals["currentLocation"] = "other"
    }

    // start live loading of listener values
    if (MonitorGlobals["currentLocation"] != "other") {
        triggerAjax("start", true, '/monitor_process', afterDataReceived, undefined);
    }

    function monitor() {
        triggerAjax("continue", true, '/monitor_process', afterDataReceived, undefined);
    }
    function afterDataReceived(recvData) {
        if (recvData["data"]) {
            let status = recvData["status"];
            let message = recvData["message"];
            let data = recvData["data"];
            if (data["message"]) {
                show_message(data["message"][1], data["message"][0] != "pos")
            } else {
                if (status == "ok") {
                    if (MonitorGlobals["currentLocation"] == "listeners") {
                        updateListeners(data["listener_database"]);
                    } else if (MonitorGlobals["currentLocation"] == "scouts") {
                        updateScouts(data["scout_database"])
                    }
                } else {
                    show_message(message, true)
                }
            }
        }
        monitor();
    }

    function updateScouts(scouts_db) {
        let is_empty = $.isEmptyObject(scouts_db);
        if (!is_empty) {
            $("#h1_scouts_heading").text("Scouts");
            $("#p_fail").hide();
            $("#div_scouts").show();
            if ($("#table_scouts_content :focus").attr('id') === undefined) {
                updateScoutsTable(scouts_db)
            }
        } else {
            $("#h1_scouts_heading").text("Scouts");
            $("#div_scouts").hide();
            $("#p_fail").show();
        }
        removeLoader();
    }

    function updateListeners(listeners_db) {
        let is_empty = $.isEmptyObject(listeners_db);
        if (!is_empty) {
            if ($("#table_listeners_content :focus").attr('id') === undefined) {
                getElementByIndex("i_listeners_content", -1).hide();
                $("#table_listeners_content").find("tr:gt(0)").remove();
                for (const [key, value] of Object.entries(listeners_db)) {
                    $("#table_listeners_content").append(`<tr class="tr_listeners_content" data-index=${String(key)}><td>${String(key)}</td><td>${String(value["host"])}</td><td>${String(value["port"])}</td><td contenteditable='true' class='td_listeners_content_name' data-index=${String(key)}>${String(value["name"])}</td><td>${String(value["created_at"])}</td><td>${value["connections"].join("<wbr>")}</td><td><button class="red button_listeners_content_remove" data-index=${String(key)}>X</button>   <i class='fa fa-circle-o-notch fa-spin i_listeners_content' data-index=${String(key)}></i></td></tr>`);
                }
                $("#table_listeners_content tr:gt(0)").each(function () {
                    getElementByIndex("i_listeners_content", getIndexOfElement($(this))).hide();
                    if ($(this).find("td").eq(5).text() !== "") {
                        $(this).css("background-color", "#4974a9");
                    } else {
                        $(this).css("background-color", "#36393e");
                    }
                });
                listenersDisplaySettings();
            }
        } else {
            if ($("#table_listeners_content :focus").attr('id') === undefined) {
                $("#table_listeners_content").find("tr:gt(0)").remove();
                listenersDisplaySettings();
            }
        }
    }

    function updateScoutsTable(scouts_db) {
        $("#table_scouts_content").find("tr:gt(0)").remove();
        let i = 0;
        for (const [key, value] of Object.entries(scouts_db)) {
            $("#table_scouts_content").append(`<tr class="tr_scouts_content" data-index=${i}><td>${key}</td><td>${value["host"]}</td><td>${value["port"]}</td><td>${value["connection_through"]}</td><td contenteditable="true" spellcheck="false" class="td_scouts_content_name" data-index=${i}>${value["name"]}</td><td>${value["connected_at"]}</td><td>${value["connection_type"]}</td><td><i class='fa fa-circle-o-notch fa-spin i_scouts_content' data-index=${i}></i></td></tr>`);
            getElementByIndex("i_scouts_content", i).hide();
        }
    }
});