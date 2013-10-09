//EDIT THESE LINES
//Title of the blog
var TITLE = "AVISOS";
//RSS url
var RSS = "http://biblioteca.mty.itesm.mx/mty/db/reports.php?base=mty_fil_avisos&report_id=3&accion=rss";
//Stores entries
var entries = [];
var selectedEntry = "";

//listen for detail links
$(".contentLink").live("click", function() {
	selectedEntry = $(this).data("entryid");
});

function renderEntries(entries) {
    var s = '';
    $.each(entries, function(i, v) {
        //s += '<li><a href="#contentPage" class="contentLink" data-entryid="'+i+'">' + v.title + '</a></li>';
        s += '<li><a href="#contentPage" class="contentLink" data-entryid="'+i+'">' + v.content + '</a></li>';
    });
    $("#linksList").html(s);
    $("#linksList").listview("refresh");
}

function checkCacheFalBack() {
	if(localStorage["entries"]) {
		$("#status").html("Usando versión local...");
		entries = JSON.parse(localStorage["entries"]);
		renderEntries(entries);
	} else {
		$("#status").html("Lo sentimos, no pudimos obtener los avisos y no existe versión local guardada.");
	}
}

//Listen for Google's library to load
function initialize() {
	console.log('ready to use google');
	var feed = new google.feeds.Feed(RSS);
	feed.setNumEntries(10);
	$.mobile.showPageLoadingMsg();
	feed.load(function(result) {
		$.mobile.hidePageLoadingMsg();
		if(!result.error) {
			entries = result.feed.entries;
			localStorage["entries"] = JSON.stringify(entries);
			renderEntries(entries);
		} else {
			console.log("Error - "+result.error.message);
			checkCacheFalBack();
		}
	});
}

function openPDF() {
     var ref = window.open('https://docs.google.com/file/d/0B7hoXnCR0P9kY05CVzdLLVN0OU0/edit?usp=sharing', '_system', 'EnableViewPortScale=yes', 'location=yes');
     //ref.addEventListener('loadstart', function(event) { alert('start: ' + event.url); });
     //ref.addEventListener('loadstop', function(event) { alert('stop: ' + event.url); });
     //ref.addEventListener('loaderror', function(event) { alert('error: ' + event.message); });
     //ref.addEventListener('exit', function(event) { alert(event.type); });
}



//Listen for main page
$("#mainPage").live("pageinit", function() {
	//Set the title
	$("h1", this).text(TITLE);
	
	try {
		google.load("feeds", "1",{callback:initialize});
	} catch(e) {
		console.log('Error - try to hit local cache');
		checkCacheFalBack();
	}
});

$("#mainPage").live("pagebeforeshow", function(event,data) {
	if(data.prevPage.length) {
		$("h1", data.prevPage).text("");
		$("#entryText", data.prevPage).html("");
	};
});

//Listen for the content page to load
$("#contentPage").live("pageshow", function(prepage) {
	//Set the title
	//$("h1", this).text(entries[selectedEntry].title);
	$("h1", this).text("FIL MTY");
	var contentHTML = "";
	contentHTML += entries[selectedEntry].content;
	contentHTML += '<br /><br /><a href="#mainPage" data-rel="back">Inicio</a>';
	//contentHTML += '<p/><a href="'+entries[selectedEntry].link + '">Read Entry on Site</a>';
	$("#entryText",this).html(contentHTML);
});
	
