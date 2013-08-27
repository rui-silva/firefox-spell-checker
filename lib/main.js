var pageMod = require("sdk/page-mod");
var data = require("sdk/self").data;

pageMod.PageMod({
	include: "*",
	contentScriptFile: [data.url("jquery-2.0.3.min.js"), data.url("contentScript.js")],
	contentScriptOptions: {
	    showOptions: true,
	    dict: data.load("words.dic")
	}
	
});