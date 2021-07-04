let url = null;
let start = null;
let myColor = "DarkGreen";
let loColors = [];
let loIntends = [];
let loPings = [];
let bid = null;

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
		loColors.push([]);
		loIntends.push([]);
	}
	loColors.push([]);
	loIntends.push([]);
}

function onLeftClick() {
	addColorToHovers(myColor);
}

function onRightClick() {
	addClassToHovers("intended");
}

function addColorToHovers(color) {
	let hovers = document.getElementsByClassName("hover");
	for (let item of hovers) {
		let itemId = '#'.concat(item.id);
		addColorToItemId(itemId, color);
		socket.send('{"itemId":"'.concat(itemId).concat('","className":"selected",').concat('"color":"').concat(color).concat('"}'));
	}
	redraw();
	start = Date.now();
	socket.send('ping');
}

function addClassToHovers(className) {
	let hovers = document.getElementsByClassName("hover");
	for (let item of hovers) {
		let itemId = '#'.concat(item.id);
		addClassToItemId(itemId, className);
		socket.send('{"itemId":"'.concat(itemId).concat('","className":"').concat(className).concat('","color":"').concat(myColor).concat('"}'));
	}
	start = Date.now();
	socket.send('ping');
}

function addColorToItemId(itemId, color) {
	let ind = parseInt(itemId.substring(5))
	const hasElem = loColors[ind].indexOf(color);
	if (hasElem > -1) {
		loColors[ind].splice(hasElem, 1);
	}
	else {
		loColors[ind].push(color);
	}
}

function addClassToItemId(itemId, className) {
	if($(itemId).hasClass(className)) {
		$(itemId).removeClass(className);
	}
	else {
		$(itemId).addClass(className);
	}
}

function parseUrl() {
	url = new URL(window.location.href);
}

function loadBingo(options, strSeed) {
	seed(parseInt(strSeed));
	bid = bid + strSeed;
	$.post("boards/get.php",{id:bid},function(data){
		try{
			const d = JSON.parse(data);
			if(d){
				loColors = d;
				redraw();
			}
		}
		catch(e){}
	});
	
	if(options) {
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
	
	if(localStorage.getItem('kpow2Pings') != null){
		loPings = JSON.parse(localStorage.getItem('kpow2Pings'));
	}
}

function updateColor(newColor) {
	myColor = newColor;
	document.documentElement.style.setProperty('--selColor', myColor);
}

function redraw() {
	for (let i = 1; i < 26; i++) {
		if(loColors[i].length) {
			if(loColors[i].length === 1) {
				$('#slot' + i).css('background-color', loColors[i][0]);
				$('#slot' + i).css('background-image', 'none');
			}
			else {
				let gradientStr = 'linear-gradient(to right';
				for (let color of loColors[i]) {
					gradientStr = gradientStr + ', ' + color;
				}
				gradientStr = gradientStr + ')';
				$('#slot' + i).css('background-image', gradientStr);
			}
		}
		else {
			$('#slot' + i).css('background-color', 'Black');
		}
	}
	$.post("boards/save.php",{id:bid, state: JSON.stringify(loColors)});
}

// Create WebSocket connection.
const socket = new WebSocket('ws://kpow2.com:8080/coop-bingo');

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
			bid = "mc";
			loadBingo(mc, url.searchParams.get('s'))
		}
		else if(url.searchParams.get('t') === "mcm") {
			bid = "mcm";
			loadBingo(mcm, url.searchParams.get('s'))
		}
		else {
			bid = "default";
			loadBingo(null, "");
		}

		// Connection opened
		socket.addEventListener('open', function (event) {});

		// Listen for messages
		socket.addEventListener('message', function (event) {
			console.log(event.data);
			if(event.data === "pong") {
				let end = Date.now();
				let delta = end - start;
				pingDiv.innerHTML = "Ping: ".concat(delta);
				loPings.push(delta);
				localStorage.setItem("kpow2Pings", JSON.stringify(loPings));
			}
			else {
				msgObj = JSON.parse(event.data);
				if(msgObj.className === 'selected') {
					addColorToItemId(msgObj.itemId, msgObj.color);
					redraw();
				}
				else if(msgObj.color === myColor) {
					addClassToItemId(msgObj.itemId, msgObj.className);
				}
			}
		});
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