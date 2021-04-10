$(document).ready(function () {
	function onStart() {
		triggerAjax(`show("key")`, true, '/home_process', showKeyCB, undefined);
		triggerAjax(`show("all")`, true, '/home_process', showAllCB, undefined);
	}
	onStart();


	//on load key value
	function showKeyCB(data) {
		if (data["status"] == "ok") {
			$("#input_key").val(data["data"]["key"]);
			removeLoader();
		} else {
			show_message(data["message"], true);
		}
	}

	//on load initial blacklist and whitelist values
	function showAllCB(data){
		if (data["status"] == "ok") {
			loadWhitelist(data["data"]["whitelist"]);
			loadBlacklist(data["data"]["blacklist"]);
		} else {
			show_message(data["message"], true);
		}
		removeLoader();
	}

	//whitelist add function
	$(document).on("click", "#button_whitelist", function () {
		if ($("#input_whitelist").val().trim() !== "") {
			triggerAjax(`add_to_list("wh", "${$("#input_whitelist").val().trim()}")`, true, '/home_process', addWhitelistCB, undefined);
		}
	});
	function addWhitelistCB(data){
		if (data["status"] == "ok") {
			loadWhitelist(data["data"]["whitelist"])
		} else {
			show_message(data["message"], true);
		}
	}

	//blacklist add function
	$(document).on("click", "#button_blacklist", function () {
		if ($("#input_blacklist").val().trim() !== "") {
			triggerAjax(`add_to_list("bl", "${$("#input_blacklist").val().trim()}")`, true, '/home_process', addBlacklistCB, undefined);
		}
	});
	function addBlacklistCB(data) {
		if (data["status"] == "ok") {
			loadBlacklist(data["data"]["blacklist"])
		} else {
			show_message(data["message"], true);
		}
	}

	//remove element from whitelist
	$(document).on("click", ".button_whitelist_remove", function () {
		if ($(this).attr('data-index') == -1) {
			triggerAjax(`reset_list("wh")`, true, '/home_process', undefined, undefined);
			$("#table_whitelist").find("tr:gt(1)").remove();
		} else {
			triggerAjax(`remove_from_list("wh", "${$(".td_whitelist_hostname").eq($(this).attr('data-index')).html()}")`, true, '/home_process', removeWhitelistCB, undefined);
		}
	});
	function removeWhitelistCB(data) {
		if (data["status"] == "ok") {
			loadWhitelist(data["data"]["whitelist"])
		} else {
			show_message(data["message"], true);
		}
	}

	//remove element from blacklist
	$(document).on("click", ".button_blacklist_remove", function () {
		console.log($(this).attr('data-index'))
		if ($(this).attr('data-index') == -1) {
			triggerAjax(`reset_list("bl")`, true, '/home_process', undefined, undefined);
			$("#table_blacklist").find("tr:gt(1)").remove();
		} else {
			triggerAjax(`remove_from_list("bl", "${$(".td_blacklist_hostname").eq($(this).attr('data-index')).html()}")`, true, '/home_process', removeBlacklistCB, undefined);
		}
	});
	function removeBlacklistCB(data) {
		if (data["status"] == "ok") {
			loadBlacklist(data["data"]["blacklist"])
		} else {
			show_message(data["message"], true);
		}
	}

	//show / hide key
	$("#input_key").hover(function () {
		$(this).attr('type', 'text');
	}, function () {
		$(this).attr('type', 'password');
	});

	//random key generation
	$(document).on("click", "#button_key_random", function () {
		triggerAjax(`regen_key()`, true, '/home_process', showKeyCB, undefined);
	});

	//set key
	$(document).on("click", "#button_key_set", function () {
		console.log($("#input_key").val())
		triggerAjax(`regen_key(key="${$("#input_key").val()}")`, true, '/home_process', showKeyCB, undefined);
	});
});

function loadWhitelist(whitelist) {
	$("#table_whitelist").find("tr:gt(1)").remove();
	for (let i = 0; i < whitelist.length; i++) {
		$('#table_whitelist').append(`<tr><td class="td_whitelist_hostname" data-index=${i}>${whitelist[i]}</td><td class="td_whitelist_remove" data-index=${i}><button class='red button_whitelist_remove' data-index=${i}>X</button></td></tr>`);
	}
	$("#input_whitelist").val("");
}

function loadBlacklist(blacklist) {
	$("#table_blacklist").find("tr:gt(1)").remove();
	for (let i = 0; i < blacklist.length; i++) {
		$('#table_blacklist').append(`<tr><td class="td_blacklist_hostname" data-index=${i}>${blacklist[i]}</td><td class="td_blacklist_remove" data-index=${i}><button class='red button_blacklist_remove' data-index=${i}>X</button></td></tr>`);
	}
	$("#input_blacklist").val("");
}