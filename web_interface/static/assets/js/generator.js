let GeneratorGlobals = {
    "encoderToIndex": {},
    "arrow": {
        "options": false,
        "bases": true,
        "components": true,
        "encoders": true,
        "lodEncoders": true,
        "custom": false
    },
    "executePythonModules": []
};
$(document).ready(function () {
    function onStart() {
		triggerAjax(`component_info("all")`, true, '/generator_process', componentInfoCB, undefined)
    }
    onStart();

	$(document).on("click", "#button_options_content_host", function() {
        let $input_host = $("#input_options_content_host");
        if ($input_host.val().trim() != "" && !getColumn(false).includes($input_host.val().trim())) {
            triggerAjax(`set_option("Host", "${getColumn(true) + ", " + $input_host.val().trim()}")`, true, '/generator_process', addHostCB, undefined);
        }
        $input_host.val("");
    });
	$(document).on("click", ".button_options_content_host", function() {
	    getElementByIndex("tr_options_content_host", getIndexOfElement($(this))).remove();
	    setHost(getColumn(true));
        triggerAjax(`set_option("Host", "${getColumn(true)}")`, true, '/generator_process', undefined, undefined);
    });
    $(document).on("click", "#button_options_content_port", function() {
        let $input_port = $("#input_options_content_port");
        if($input_port.val().trim() != "") {
            triggerAjax(`set_option("Port", ${$input_port.val().trim()})`, true, '/generator_process', setPortCB, undefined);
        }
    });
    $(document).on("click", "#button_options_content_timeout", function() {
        let $input_timeout = $("#input_options_content_timeout");
        if($input_timeout.val().trim() != "") {
            triggerAjax(`set_option("Timeout", ${$input_timeout.val().trim()})`, true, '/generator_process', setTimeoutCB, undefined);
        }
        $input_timeout.val("")
    });
    $(document).on('change', "#input_options_content_compiler_compile", function() {
        if ($(this).is(':checked')) {
            compilerOptionsDisplaySettings(true);
            triggerAjax(`set_option("Compile", "True")`, true, '/generator_process', undefined, undefined);
        } else {
            compilerOptionsDisplaySettings(false);
            triggerAjax(`set_option("Compile", "False")`, true, '/generator_process', undefined, undefined);

        }
    });
    $(document).on('click', "#button_os", function() {
        if ($(this).html() == "Windows") {
            triggerAjax(`set_option("Windows", "False")`, true, '/generator_process', undefined, undefined);
        } else {
            triggerAjax(`set_option("Windows", "True")`, true, '/generator_process', undefined, undefined);
        }
        onStart();
    });
    $(document).on("click", "#input_options_content_compiler_icon", function() {
        $("#input_options_content_compiler_iconPath").val("");
        compilerOptionsDisplaySettings(true);
    });

    $(document).on("click", ".input_components_content", function() {
        let id = getIndexOfElement($(this));
        if ($(this).is(':checked')) {
            selectComponent(id, true, true);
        } else {
            selectComponent(id, false, true);
        }
        customDisplaySettings();
    });
    $(document).on("click", ".input_bases_content", function() {
        let id = getIndexOfElement($(this));
        let count = $(".input_bases_content").length
        if ($(this).is(':checked')) {
            selectBase(id, true, true);
            for (let i = 0; i < count; i++) {
                if (i != id) {
                    selectBase(i, false, false);
                }
            }
        } else {
            selectBase(id, true, false);
        }
    });
    $(document).on("click", ".button_encoders_content", function() {
        let id = getIndexOfElement($(this));
        triggerAjax(`load_encoder("${id}")`, true, '/generator_process', addEncoderCB, undefined);
    });
    $(document).on("click", ".button_lodEncoders_content", function() {
        let id = getIndexOfElement($(this));
        if (id == -1) {
            id = "all"
        }
        triggerAjax(`unload_encoder("${id}")`, true, '/generator_process', addEncoderCB, undefined);
    });

    $(document).on("click", ".arrow", function () {
        if ($(this).attr("id") == "i_options_heading") {
            GeneratorGlobals["arrow"]["options"] = !GeneratorGlobals["arrow"]["options"];
        } else if ($(this).attr("id") == "i_bases_heading") {
            GeneratorGlobals["arrow"]["bases"] = !GeneratorGlobals["arrow"]["bases"];
        } else if ($(this).attr("id") == "i_components_heading") {
            GeneratorGlobals["arrow"]["components"] = !GeneratorGlobals["arrow"]["components"];
        } else if ($(this).attr("id") == "i_encoders_heading") {
            GeneratorGlobals["arrow"]["encoders"] = !GeneratorGlobals["arrow"]["encoders"];
        } else if ($(this).attr("id") == "i_lodEncoders_heading") {
            GeneratorGlobals["arrow"]["lodEncoders"] = !GeneratorGlobals["arrow"]["lodEncoders"];
        } else if ($(this).attr("id") == "i_custom_heading") {
            GeneratorGlobals["arrow"]["custom"] = !GeneratorGlobals["arrow"]["custom"];
        }
        subheadingsDisplaySettings();
    });

    $(document).on("click", "#button_custom_content_executePython", function () {
        if ($("#input_custom_content_executePython").val().trim() != "") {
            GeneratorGlobals["executePythonModules"].push($("#input_custom_content_executePython").val().trim());
            reloadExecutePythonModules();
            $("#input_custom_content_executePython").val("");
        }
    });
    $(document).on("click", ".button_custom_content_executePython", function () {
        let id = getIndexOfElement($(this));
        GeneratorGlobals["executePythonModules"].splice(id, 1);
        reloadExecutePythonModules();
    });

    $(document).on("click", "#button_generate", function () {
        $("#i_generate").show();
        let command;
        let scout_sleep_time = parseInt($("#input_custom_content_sleep").val(), 10)
        if (!isNaN(scout_sleep_time)) {
            command = `generate({"execute_python_modules": ${JSON.stringify(GeneratorGlobals["executePythonModules"])}, "scout_sleep_time": ${scout_sleep_time}, "request_root_message": "${$("#input_custom_content_reqRoot").val().trim()}", "compiler_settings": {"onefile": ${trueFalseGen($("#input_options_content_compiler_onefile").is(":checked"))}, "windowed": ${trueFalseGen($("#input_options_content_compiler_windowed").is(":checked"))}, "custom_icon_filepath": "${$("#input_options_content_compiler_iconPath").val().trim()}"}})`;
        } else {
            command = `generate({"execute_python_modules": ${JSON.stringify(GeneratorGlobals["executePythonModules"])}, "request_root_message": "${$("#input_custom_content_reqRoot").val().trim()}", "compiler_settings": {"onefile": ${trueFalseGen($("#input_options_content_compiler_onefile").is(":checked"))}, "windowed": ${trueFalseGen($("#input_options_content_compiler_windowed").is(":checked"))}, "custom_icon_filepath": "${$("#input_options_content_compiler_iconPath").val().trim()}"}})`;
        }
        triggerAjax(command, true, "/generator_process", generateCB, undefined);
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
    function componentInfoCB(recvData) {
        let status = recvData["status"];
        let message = recvData["message"];
        let data = recvData["data"];
        if (status == "ok") {
            $("#table_components_content").find("tr:gt(0)").remove();
            for (const [id, dict] of Object.entries(data["component_info"])) {
                addToComponents(id, dict["Name"], dict["Description"])
            }
            triggerAjax(`base_info("all")`, true, '/generator_process', baseInfoCB, undefined)
        } else {
            show_message(message, true)
        }
    }
    function baseInfoCB(recvData) {
        let status = recvData["status"];
        let message = recvData["message"];
        let data = recvData["data"];
        if (status == "ok") {
            $("#table_bases_content").find("tr:gt(0)").remove();
            for (const [id, dict] of Object.entries(data["base_info"])) {
                addToBases(id, dict["Name"], dict["Description"])
            }
            triggerAjax(`show("encoders")`, true, '/generator_process', showEncodersCB, undefined)
        } else {
            show_message(message, true)
        }
    }
    function showEncodersCB(recvData) {
        let status = recvData["status"];
        let message = recvData["message"];
        let data = recvData["data"];
        if (status == "ok") {
            GeneratorGlobals["encoderToIndex"] = {};
            for (let i = 0; i < Object.values(data["encoders"]).length; i++) {
                GeneratorGlobals["encoderToIndex"][Object.values(data["encoders"])[i]] = i
            }
            triggerAjax(`encoder_info("all")`, true, '/generator_process', encoderInfoCB, undefined)
        } else {
            show_message(message, true)
        }
    }
    function encoderInfoCB(recvData) {
        let status = recvData["status"];
        let message = recvData["message"];
        let data = recvData["data"];
        if (status == "ok") {
            $("#table_encoders_content").find("tr:gt(0)").remove();
            for (const [id, dict] of Object.entries(data["encoder_info"])) {
                addToEncoders(id, dict["Name"], dict["Description"])
            }
            triggerAjax(`show("loaded")`, true, '/generator_process', showLoadedCB, undefined);
        } else {
            show_message(message, true)
        }
    }
    function showLoadedCB(recvData) {
        let status = recvData["status"];
        let message = recvData["message"];
        let data = recvData["data"];
        if (status == "ok") {
            let loadedBase = data["loaded_base"]
            let loadedComponents = data["loaded_components"];
            let loadedEncoders = data["loaded_encoders"];
            $("#table_lodEncoders_content").find("tr:gt(0)").remove();
            if (loadedBase == "windows/bases/reverse_tcp_base" || loadedBase == "linux/bases/reverse_tcp_base") {
                selectBase(1, true, false)
            } else if (loadedBase == "windows/bases/bind_tcp_base" || loadedBase == "linux/bases/bind_tcp_base") {
                selectBase(0, true, false)
            }
            let modules = Object.keys(loadedComponents);
            for (let i = 0; i < modules.length; i++) {
                if (modules[i] != "base") {
                    selectComponent(modules[i], true, false)
                }
            }
            for (let i = 0; i < loadedEncoders.length; i++) {
                addToLoadedEncoders(i, loadedEncoders[i])
            }
            triggerAjax(`show("options")`, true, '/generator_process', showOptionsCB, undefined);
        } else {
            show_message(message, true)
        }
    }
    function showOptionsCB(recvData) {
        let status = recvData["status"];
        let message = recvData["message"];
        let data = recvData["data"];
        if (status == "ok") {
            $("#i_generate").hide();
            setHost(data["scout_values"]["Host"][0]);
            $("#td_options_content_port_value").val(data["scout_values"]["Port"][0]);
            $("#td_options_content_timeout_value").val(data["scout_values"]["Timeout"][0]);
            if (data["scout_values"]["Windows"][0] == "True") {
                $("#button_os").html("Windows");
            } else {
                $("#button_os").html("Linux");
            }
            if (data["scout_values"]["Compile"][0] == "True") {
                $("#input_options_content_compiler_compile").prop('checked', true);
                compilerOptionsDisplaySettings(true);
            } else {
                $("#input_options_content_compiler_compile").prop('checked', false);
                compilerOptionsDisplaySettings(false);
            }
            subheadingsDisplaySettings();
            removeLoader();
        } else {
            show_message(message, true)
        }
    }
    function addHostCB(recvData) {
        let status = recvData["status"];
        let message = recvData["message"];
        let data = recvData["data"];
        if (status == "ok") {
            setHost(data["scout_values"]["Host"][0]);
        } else {
            show_message(message, true)
        }
    }
    function setPortCB(recvData) {
        let status = recvData["status"];
        let message = recvData["message"];
        let data = recvData["data"];
        if (status == "ok") {
            $("#td_options_content_port_value").html(data["scout_values"]["Port"][0]);
        } else {
            show_message(message, true)
        }
    }
    function setTimeoutCB(recvData) {
        let status = recvData["status"];
        let message = recvData["message"];
        let data = recvData["data"];
        if (status == "ok") {
            $("#td_options_content_timeout_value").html(data["scout_values"]["Timeout"][0]);
        } else {
            show_message(message, true)
        }
    }
    function addEncoderCB(recvData) {
        let status = recvData["status"];
        let message = recvData["message"];
        let data = recvData["data"];
        if (status == "ok") {
            $("#table_lodEncoders_content").find("tr:gt(0)").remove();
            let loadedEncoders = data["loaded_encoders"];
            for (let i = 0; i < loadedEncoders.length; i++) {
                addToLoadedEncoders(i, loadedEncoders[i])
            }
            loadedEncodersDisplaySettings();
        } else {
            show_message(message, true)
        }
    }
    function generateCB(recvData) {
        let status = recvData["status"];
        let message = recvData["message"];
        $("#i_generate").hide();
        if (status == "ok") {
            show_message(message, false)
        } else {
            show_message(message, true)
        }
    }
});

//get all columns in host list as string or list
function getColumn(str) {
    let arr = [];
    $('.tr_options_content_host td:first-child').each(function (){
        arr.push($(this).html().trim())
    });
    if (str) {
        return arr.join(", ");
    } else {
        return arr;
    }
}

//set host table
function setHost(host_str) {
    $("#table_options_content_host").find("tr:gt(1)").remove();
    let host_array = host_str.split(",");
    for (let i = 0; i < host_array.length; i++) {
        host_array[i] = host_array[i].trim()
    }
    for (let i = 0; i < host_array.length; i++) {
        if (host_array.length == 1) {
            $('#table_options_content_host').append(`<tr class="tr_options_content_host" data-index=0><td>${host_array[i]}</td><td></td></tr>`);
        } else {
            $('#table_options_content_host').append(`<tr class="tr_options_content_host" data-index=${i}><td>${host_array[i]}</td><td><button class='red button_options_content_host' data-index=${i} >X</button></td></tr>`);
        }
    }
}

//tick a component in the table
function selectComponent(index, select, trigger) {
    if (index == -1) {
        if (select) {
            $(".input_components_content").prop('checked', true);
            $(".tr_components_content").css("background-color", "#4974a9");
        } else {
            $(".input_components_content").prop('checked', false);
            $(".tr_components_content").css("background-color", "#36393e");
        }
    } else {
        if (select) {
            getElementByIndex("input_components_content", index).prop('checked', true);
            getElementByIndex("tr_components_content", index).css("background-color", "#4974a9");
        } else {
            getElementByIndex("input_components_content", index).prop('checked', false);
            getElementByIndex("tr_components_content", index).css("background-color", "#36393e");
        }
    }
    if (trigger) {
        triggerSelectComponent(index, select)
    }
}

//tick a base in the table
function selectBase(index, select, trigger) {
    if (index == -1) {
        if (select) {
            $(".input_bases_content").prop('checked', true);
            $(".tr_bases_content").css("background-color", "#4974a9");
        } else {
            $(".input_bases_content").prop('checked', false);
            $(".tr_bases_content").css("background-color", "#36393e");
        }
    } else {
        if (select) {
            getElementByIndex("input_bases_content", index).prop('checked', true);
            getElementByIndex("tr_bases_content", index).css("background-color", "#4974a9");
        } else {
            getElementByIndex("input_bases_content", index).prop('checked', false);
            getElementByIndex("tr_bases_content", index).css("background-color", "#36393e");
        }
    }
    if (trigger) {
        triggerSelectBase(index, select)
    }
}

//trigger a component select server side
function triggerSelectComponent(index, select) {
    if (index == -1) {
        if (select) {
            triggerAjax(`load_component("all")`, true, '/generator_process', undefined, undefined);
        } else {
            triggerAjax(`unload_component("all")`, true, '/generator_process', undefined, undefined);
        }
    } else {
        if (select) {
            triggerAjax(`load_component("${index}")`, true, '/generator_process', undefined, undefined);

        } else {
            triggerAjax(`unload_component("${index}")`, true, '/generator_process', undefined, undefined);
        }
    }
}

//trigger a base select server side
function triggerSelectBase(index, select) {
    if (index == -1) {
        if (select) {
            triggerAjax(`load_base("all")`, true, '/generator_process', undefined, undefined);
        } else {
            triggerAjax(`unload_base("all")`, true, '/generator_process', undefined, undefined);
        }
    } else {
        if (select) {
            triggerAjax(`load_base("${index}")`, true, '/generator_process', undefined, undefined);

        } else {
            triggerAjax(`unload_base("${index}")`, true, '/generator_process', undefined, undefined);
        }
    }
}

//add a component to the table
function addToComponents(index, name, description) {
    $('#table_components_content').append(`<tr class="tr_components_content" data-index=${index}><th>${index}</th><td>${name}</td><td>${description}</td><td><label class="label_checkbox_container"><input class="input_components_content" data-index=${index} type='checkbox'><span class='checkmark'></span></label></td></tr>`);
}

//add a base to the table
function addToBases(index, name, description) {
    $('#table_bases_content').append(`<tr class="tr_bases_content" data-index=${index}><th>${index}</th><td>${name}</td><td>${description}</td><td><label class="label_checkbox_container"><input class="input_bases_content" data-index=${index} type='checkbox'><span class='checkmark'></span></label></td></tr>`);
}

//add an encoder to the list of available encoders
function addToEncoders(index, name, description) {
    $('#table_encoders_content').append(`<tr class="tr_encoders_content" data-index=${index}><th>${index}</th><td>${name}</td><td>${description}</td><td><button  class="button_encoders_content" style='font-size: x-large;' data-index=${index}>+</button></td></tr>`);
}

//add an encoder to the list of loaded encoders
function addToLoadedEncoders(index, encoder) {
    $("#table_lodEncoders_content").append(`<tr class="tr_lodEncoders_content" data-index=${index}><td>${index}</td><td>${GeneratorGlobals["encoderToIndex"][encoder]}</td><td>${encoder}</td><td><button class='red button_lodEncoders_content' data-index=${index}>X</button></td></tr>`);
}

//compiler options display settings
function compilerOptionsDisplaySettings(show) {
    if (show) {
        $("#tr_options_content_compiler_onefile").show();
        $("#tr_options_content_compiler_windowed").show();
        $("#tr_options_content_compiler_icon").show();
        let checked = $('#input_options_content_compiler_icon').prop("checked") ? 1 : 0;
        if (checked) {
            $("#tr_options_content_compiler_iconPath").show();
        } else {
            $("#tr_options_content_compiler_iconPath").hide()
        }
    } else {
        $("#tr_options_content_compiler_onefile").hide();
        $("#tr_options_content_compiler_windowed").hide();
        $("#tr_options_content_compiler_icon").hide();
        $("#tr_options_content_compiler_iconPath").hide()
    }
}

//subheadings display settings
function subheadingsDisplaySettings() {
    let shownSettings = GeneratorGlobals["arrow"];
    if (shownSettings["options"]) {
        $("#i_options_heading").removeClass("fa-angle-right");
        $("#i_options_heading").addClass("fa-angle-down");
        $("#div_options_content").show()
    } else {
        $("#i_options_heading").removeClass("fa-angle-down");
        $("#i_options_heading").addClass("fa-angle-right");
        $("#div_options_content").hide()
    }
    if (shownSettings["bases"]) {
        $("#i_bases_heading").removeClass("fa-angle-right");
        $("#i_bases_heading").addClass("fa-angle-down");
        $("#div_bases_content").show()
    } else {
        $("#i_bases_heading").removeClass("fa-angle-down");
        $("#i_bases_heading").addClass("fa-angle-right");
        $("#div_bases_content").hide()
    }
    if (shownSettings["components"]) {
        $("#i_components_heading").removeClass("fa-angle-right");
        $("#i_components_heading").addClass("fa-angle-down");
        $("#div_components_content").show()
    } else {
        $("#i_components_heading").removeClass("fa-angle-down");
        $("#i_components_heading").addClass("fa-angle-right");
        $("#div_components_content").hide()
    }
    if (shownSettings["encoders"]) {
        $("#i_encoders_heading").removeClass("fa-angle-right");
        $("#i_encoders_heading").addClass("fa-angle-down");
        $("#div_encoders_content").show()
    } else {
        $("#i_encoders_heading").removeClass("fa-angle-down");
        $("#i_encoders_heading").addClass("fa-angle-right");
        $("#div_encoders_content").hide()
    }
    loadedEncodersDisplaySettings();
    customDisplaySettings();
}

//loaded encoders display settings
function loadedEncodersDisplaySettings() {
    if ($("#table_lodEncoders_content tr").length == 1) {
        $("#div_lodEncoders").hide();
    } else {
        $("#div_lodEncoders").show();
        if (GeneratorGlobals["arrow"]["lodEncoders"]) {
            $("#i_lodEncoders_heading").removeClass("fa-angle-right");
            $("#i_lodEncoders_heading").addClass("fa-angle-down");
            $("#div_lodEncoders_content").show()
        } else {
            $("#i_lodEncoders_heading").removeClass("fa-angle-down");
            $("#i_lodEncoders_heading").addClass("fa-angle-right");
            $("#div_lodEncoders_content").hide()
        }
    }
}

//custom display settings
function customDisplaySettings() {
    let to_show = {"main": false, "executePython": false, "sleepStartup": false, "reqRoot": false};
    let index_of_executePython = getIndexOfElement($("#table_components_content td").filter(function() {return $(this).text() == "Execute python component";}).closest("tr"));
    let index_of_sleepStartup = getIndexOfElement($("#table_components_content td").filter(function() {return $(this).text() == "Sleep startup component";}).closest("tr"));
    let index_of_reqRoot = getIndexOfElement($("#table_components_content td").filter(function() {return $(this).text() == "Request root startup component";}).closest("tr"));
    if (getElementByIndex("input_components_content", index_of_executePython).is(":checked")) {
        to_show["main"] = true;
        to_show["executePython"] = true;
    }
    if (getElementByIndex("input_components_content", index_of_sleepStartup).is(":checked")) {
        to_show["main"] = true;
        to_show["sleepStartup"] = true;
    }
    if (index_of_reqRoot) {
        if (getElementByIndex("input_components_content", index_of_reqRoot).is(":checked")) {
            to_show["main"] = true;
            to_show["reqRoot"] = true;
        }
    }
    if (!to_show["main"]) {
        $("#div_custom").hide();
    } else {
        $("#div_custom").show();
        if (GeneratorGlobals["arrow"]["custom"]) {
            $("#i_custom_heading").removeClass("fa-angle-right");
            $("#i_custom_heading").addClass("fa-angle-down");
            $("#div_custom_content").show()
        } else {
            $("#i_custom_heading").removeClass("fa-angle-down");
            $("#i_custom_heading").addClass("fa-angle-right");
            $("#div_custom_content").hide()
        }
        if (to_show["executePython"]) {
            $("#table_custom_content_executePython").show()
        } else {
            $("#table_custom_content_executePython").hide()
        }
        if (to_show["sleepStartup"]) {
            $("#table_custom_content_sleep").show()
        } else {
            $("#table_custom_content_sleep").hide()
        }
        if (to_show["reqRoot"]) {
            $("#table_custom_content_reqRoot").show()
        } else {
            $("#table_custom_content_reqRoot").hide()
        }
    }
}

//refresh execute python modules
function reloadExecutePythonModules() {
    $("#table_custom_content_executePython").find("tr:gt(1)").remove();
    GeneratorGlobals["executePythonModules"] = [...new Set(GeneratorGlobals["executePythonModules"])];
    for (let i = 0; i < GeneratorGlobals["executePythonModules"].length; i++) {
        $('#table_custom_content_executePython').append(`<tr><td>${GeneratorGlobals["executePythonModules"][i]}</td><td><button class='red button_custom_content_executePython' data-index=${i}>X</button></td></tr>`);
    }
}

//true false generator for generate function
function trueFalseGen(x) {
    if(x) {
        return "True"
    }
    return "False"
}

