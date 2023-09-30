let newSquareHTML = '<form class="form-inline user-made" onsubmit="return deleteSquare(this);"><div class="squareDiv"><label for="s">Square:</label><input type="text" id="s" value="SVALUE"></div><div class="descDiv"><label for="d">Description:</label><input type="text" id="d" value="DVALUE"></div><div class="colorDiv"><label for="c">Color:</label><input type="text" id="c" value="CVALUE"></div><button type="submit">Delete</button></form>';

function addSquare() {
	let square = document.getElementById("square");
	let desc = document.getElementById("description");
	let color = document.getElementById("color");
	addOne(square.value, desc.value, color.value);
	
	square.value = "";
	desc.value = "";
	color.value = "";
	
	return false;
}

function addOne(square, desc, color) {
	let subForm = document.getElementById("subForm");
	
	let html = newSquareHTML.replace("SVALUE", square);
	html = html.replace("DVALUE", desc);
	html = html.replace("CVALUE", color);
	
	let tempDiv = document.createElement('div');
	tempDiv.innerHTML = html;
	subForm.insertAdjacentElement('afterend', tempDiv);
}

function deleteSquare(ele) {
	ele.remove();
	return false;
}

function saveBoard() {
	let name = getBoardName();
	let loEles = document.getElementsByClassName("user-made");
	let loSquares = [];
	for (let i = 0; i < loEles.length; i++) {
		let squareJson = convertEleToJson(loEles[i]);
		loSquares.push(squareJson);
	}
	$.post("user-made/save.php",{id:name, state: JSON.stringify(loSquares)});
	document.getElementById("opText").innerHTML = "Board: " + name + " was saved, open it <a href='http://kpow2.com/coop-bingo/index.html?t=" + name + "' target='_blank'>HERE</a>.";
}

function getBoardName() {
	let title = document.getElementById("bingoNameInput");
	let name = title.value;
	name = name.replaceAll(/[^A-Za-z0-9\-]/gi, '');
	return name;
}

function convertEleToJson(ele) {
	return {
		name: ele.children[0].childNodes[1].value,
		description: ele.children[1].childNodes[1].value,
		color: ele.children[2].childNodes[1].value
	};
}

function deleteBoard() {
	let name = getBoardName();
	$.post("user-made/delete.php",{id:name});
	document.getElementById("opText").innerHTML = "Board: " + name + " was deleted.";
}

function importBoard(board) {
	let selDrop = document.getElementById("sel");
	let seled = selDrop.value;
	$.post("user-made/get.php",{id:seled},function(data) {
		try {
			const d = JSON.parse(data);
			if(d) {
				for(let i = d.length - 1; i > -1; i--) {
					addOne(d[i].name, d[i].description, d[i].color);
				}
			}
		}
		catch(e){}
	});
	document.getElementById("bingoNameInput").value = seled;
}

$(document).ready(
	function() {
		$.get("user-made/list.php",function(data) {
			try {
				const d = JSON.parse(data);
				if(d) {
					for (const [key, value] of Object.entries(d)) {
						let selDrop = document.getElementById("sel");
						let selOption = document.createElement("option");
						let name = value.substring(0, value.length-5);
						selOption.text = name;
						selOption.value = name;
						selDrop.add(selOption, 1);
					}
				}
			}
			catch(e){}
		});
	}
);