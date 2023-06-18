let url = null;
let start = null;
let myColor = "DarkGreen";
let loColors = [];
let loIntends = [];
let loPings = [];
let bid = null;
const SELECTED = "selected";
const INTENDED = "intended";

let minecraft = "#149a3a";
let nether = "#ab0809";
let end = "#bfb00c";
let adventure = "#6f66a9";
let husbandry = "#b05e02";

let socket = null;

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

function onClick(type) {
	addColorToHovers(myColor, type);
}

function addColorToHovers(color, type) {
	let hovers = document.getElementsByClassName("hover");
	for (let item of hovers) {
		let itemId = '#'.concat(item.id);
		addColorToItemId(itemId, color, type);
		socket.send('{"bId":"'+bid+'","itemId":"'+itemId+'","className":"'+type+'","color":"'+color+'"}');
	}
	redraw(true);
	start = Date.now();
	socket.send('ping');
}

function addColorToItemId(itemId, color, type) {
	let ind = parseInt(itemId.substring(5))
	if(type === SELECTED) {
		const hasElem = loColors[ind].indexOf(color);
		if (hasElem > -1) {
			loColors[ind].splice(hasElem, 1);
		}
		else {
			loColors[ind].push(color);
		}
	}
	else if(type === INTENDED) {
		const hasElem = loIntends[ind].indexOf(color);
		if(hasElem > -1) {
			loIntends[ind].splice(hasElem, 1);
		}
		else {
			loIntends[ind].push(color);
		}
	}
}

function addClassToItem(itemId, className) {
	if(!$(itemId).hasClass(className)) {
		$(itemId).addClass(className);
	}
}
function removeClassFromItem(itemId, className) {
	if($(itemId).hasClass(className)) {
		$(itemId).removeClass(className);
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
				redraw(false);
			}
		}
		catch(e){}
	});
	$.post("boards/get.php",{id:bid+'ints'},function(data){
		try{
			const d = JSON.parse(data);
			if(d){
				loIntends = d;
				redraw(false);
			}
		}
		catch(e){}
	});
	
	if(options) {
		for (let i = 1; i < 26; i++) {
			if(options.length > 0) {
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
	}
	
	if(localStorage.getItem('kpow2Pings') != null){
		loPings = JSON.parse(localStorage.getItem('kpow2Pings'));
	}
}

function updateColor(newColor) {
	myColor = newColor;
	document.documentElement.style.setProperty('--selColor', myColor);
	redraw(false);
}

function redraw(save) {
	for (let i = 1; i < 26; i++) {
		let itemId = '#slot' + i;
		if(loColors[i].length) {
			if(loColors[i].length === 1) {
				$(itemId).css('background-color', loColors[i][0]);
				$(itemId).css('background-image', 'none');
			}
			else {
				let gradientStr = 'linear-gradient(to right';
				for (let color of loColors[i]) {
					gradientStr = gradientStr + ', ' + color;
				}
				gradientStr = gradientStr + ')';
				$(itemId).css('background-image', gradientStr);
			}
		}
		else {
			$(itemId).css('background-color', '');
		}
		if(loIntends[i].includes(myColor)) {
			addClassToItem(itemId, INTENDED);
		}
		else {
			removeClassFromItem(itemId, INTENDED);
		}
	}
	if(save) {
		$.post("boards/save.php",{id:bid, state: JSON.stringify(loColors)});
		$.post("boards/save.php",{id:bid+"ints", state: JSON.stringify(loIntends)});
	}
}

$(document).ready(
	function() {
		parseUrl();
		if(url.searchParams.get('s') == null && url.searchParams.get('t') != null) {
			window.location = window.location + '&s=' + Math.ceil(999999 * Math.random());
		}
		addHover();
		let strSeed = url.searchParams.get('s');
		if(strSeed && strSeed.includes('r')) {
			strSeed = strSeed.replace('r', '');
			$('#pingDiv').remove();
			$('#selColorLabel').remove();
			$('#selColor').remove();
		}
		else {
			$("#bingoBoard").click(
				function() {
					onClick(SELECTED); 
				}
			);
			$("#bingoBoard").contextmenu(
				function() {
					onClick(INTENDED);
					return false;
				}
			);
		}
		if(url.searchParams.get('t') === "mc") {
			bid = "mc";
			loadBingo(mc, strSeed);
		}
		else if(url.searchParams.get('t') === "mcm") {
			bid = "mcm";
			loadBingo(mcm, strSeed);
		}
		else if(url.searchParams.get('t') === "vht") {
			bid = "vht";
			loadBingo(vht, strSeed);
		}
		else if(url.searchParams.get('t') === "vhmats") {
			bid = "vhmats";
			loadBingo(vhmats, strSeed);
		}
		else if(url.searchParams.get('t') === "vhmatsm") {
			bid = "vhmatsm";
			loadBingo(vhmatsm, strSeed);
		}
		else {
			bid = url.searchParams.get('t');
			$.post("maker/user-made/get.php",{id:bid},function(data){
				try{
					const d = JSON.parse(data);
					if(d){
						loadBingo(d, strSeed);
					}
					else {
						bid = "default";
						loadBingo(null, "");
					}
				}
				catch(e){
					bid = "default";
					loadBingo(null, "");
				}
			});
		}

		socket = new WebSocket(websocketURL);

		socket.addEventListener('open', function (event) {
			socket.send('{"subscribe":"coopbingo'+bid+'"}');
		});

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
				if(msgObj.bId === bid) {
					if(msgObj.className === SELECTED) {
						addColorToItemId(msgObj.itemId, msgObj.color, SELECTED);
						redraw(false);
					}
					else if(msgObj.color === myColor) {
						addColorToItemId(msgObj.itemId, msgObj.color, msgObj.className);
						redraw(false);
					}
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