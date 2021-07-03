let url = null;
function addHover() {
	$("#row1").hover(function () { $(".row1").addClass("hover"); }, function () { $(".row1").removeClass("hover"); });
	$("#row2").hover(function () { $(".row2").addClass("hover"); }, function () { $(".row2").removeClass("hover"); });
	$("#row3").hover(function () { $(".row3").addClass("hover"); }, function () { $(".row3").removeClass("hover"); });
	$("#row4").hover(function () { $(".row4").addClass("hover"); }, function () { $(".row4").removeClass("hover"); });
	$("#row5").hover(function () { $(".row5").addClass("hover"); }, function () { $(".row5").removeClass("hover"); });

	$("#col1").hover(function () { $(".col1").addClass("hover"); }, function () { $(".col1").removeClass("hover"); });
	$("#col2").hover(function () { $(".col2").addClass("hover"); }, function () { $(".col2").removeClass("hover"); });
	$("#col3").hover(function () { $(".col3").addClass("hover"); }, function () { $(".col3").removeClass("hover"); });
	$("#col4").hover(function () { $(".col4").addClass("hover"); }, function () { $(".col4").removeClass("hover"); });
	$("#col5").hover(function () { $(".col5").addClass("hover"); }, function () { $(".col5").removeClass("hover"); });

	$("#tlbr").hover(function () { $(".tlbr").addClass("hover"); }, function () { $(".tlbr").removeClass("hover"); });
	$("#bltr").hover(function () { $(".bltr").addClass("hover"); }, function () { $(".bltr").removeClass("hover"); });
	
	for(let i = 1; i < 26; i++) {
		let slotName = "#slot".concat(i);
		$(slotName).hover(function () { $(slotName).addClass("hover"); }, function () { $(slotName).removeClass("hover"); });
	}
}

function onLeftClick() {
	addClassToHovers("selected");
}

function onRightClick() {
	addClassToHovers("intended");
}

function addClassToHovers(className) {
	let hovers = document.getElementsByClassName("hover");
	for (let item of hovers) {
		let itemId = "#".concat(item.id);
		if($(itemId).hasClass(className)) {
			$(itemId).removeClass(className);
		}
		else {
			$(itemId).addClass(className);
		}
	}
}

function parseUrl() {
	url = new URL(window.location.href);
}

function loadBingo(options, strSeed) {
	seed(parseInt(strSeed));
	
	for (let i = 1; i < 26; i++) {
		let randomInd = Math.floor(random() * options.length);
		let randomElm = options[randomInd];
		$('#slot' + i).append(randomElm.name);
		if(randomElm.description){
			$('#slot'+i).append("<div class='desc'><br/>" + randomElm.description + "</div>");
		}
		if(randomElm.color){
			$('#slot' + i).css("color", randomElm.color);
		}
		options.splice(randomInd, 1);
	}
}

$(document).ready(
	function() {
		parseUrl();
		if(url.searchParams.get('s') == null && url.searchParams.get('t') != null) {
			window.location = window.location + '&s=' + Math.ceil(999999 * Math.random());
		}
		addHover();
		$("#bingoBoard").click(
			function() {
				onLeftClick(); 
			}
		);
		$("#bingoBoard").contextmenu(
			function() {
				onRightClick();
				return false;
			}
		);
		if(url.searchParams.get('t') === "mc") {
			loadBingo(mc, url.searchParams.get('s'))
		}
		else if(url.searchParams.get('t') === "mcm") {
			loadBingo(mcm, url.searchParams.get('s'))
		}
	}
);

let m_w = 123456789;
let m_z = 987654321;
let mask = 0xffffffff;

// Takes any integer
function seed(i) {
    m_w = (123456789 + i) & mask;
    m_z = (987654321 - i) & mask;
}

// Returns number between 0 (inclusive) and 1.0 (exclusive),
// just like Math.random().
function random() {
    m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
    m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;
    let result = ((m_z << 16) + (m_w & 65535)) >>> 0;
    result /= 4294967296;
    return result;
}