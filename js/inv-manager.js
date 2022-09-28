let SHEET_URL = "https://docs.google.com/spreadsheets/d/1u-3Ic4pzROeyn7jY-VmkxEl9S2K4jrfTmChLNHAWWgQ/gviz/tq?tqx=out:json&sheet=Sheet1";
let ITEM_ID = document.getElementById("product-id").innerHTML.toString().toLowerCase();
let sReq = new XMLHttpRequest();

// parse response by removing anything that isnt json at the beginning/end of the response
function parse_response(request) {
	var rText = request.responseText;
	// begin json container
	while (rText.at(0) != '{') {
		rText = rText.slice(1, rText.length);
	}

	// end json container
	while (rText.at(rText.length - 1) != '}') {
		rText = rText.slice(0, rText.length - 2, rText);
	}

	return JSON.parse(rText);
}

// TODO: throw errors if the inventory is not found
function get_inventory(data, target) {
	var cols = data.table.cols;
	var rows = data.table.rows;

	// should have at least product id and stock in sheet, otherwise null
	if (cols.length < 2) {
		throw "Invalid Sheet";
	}

	// find product in sheet - this is weird since we know what the sheet looks like we dont have to find anything dynamically
	for (var i = 0; i < rows.length; i++) {
		if (rows[i].c[0] && rows[i].c[0].v.toString().toLowerCase() === target) {
			var j = i + 1;
			var price = rows[i].c[cols.length - 2].v;
			var link = rows[i].c[cols.length - 1].v;
			var colors = [];
			var sizes = [];
			var stock = [];
			while (!rows[j].c[0]) {
				if (rows[j].c[cols.length - 6].v.slice(-3) == '000') {
					colors.push(rows[j].c[cols.length - 5].v);
				}
				sizes.push(rows[j].c[cols.length - 4].v);
				stock.push(rows[j].c[cols.length - 3].v);
				j++;
			}
		}
	}

	return [colors, stock, price, link, sizes];
}

// TODO: refactor this
// TODO: add error checking
// TODO: add stock data for specific sizes and fix the current method to account for different sizes
function update_page(data) {
	let orderBtn = $('.add-to-cart-btn');
	let formLink = data[3];
	var dataValue;
	var isSelected = false;

	// returns the index of the first hit on a target in an array
	function gIndex(d, t) {
		for (var i = 0; i < d.length; i++) {
			if (d[i] === t) {
				return i;
			}
		}

		return -1;
	}

	// make the color into a class string by making lowercase and removing spaces
	function classify(str) {
		var retStr = str.toLowerCase();
		var sIndex = retStr.indexOf(' ');
		while (sIndex != -1) {
			b = retStr.slice(0, sIndex);
			e = retStr.slice(sIndex + 1, retStr.length);
			retStr = b + e;
			sIndex = retStr.indexOf(' ');
		}

		return retStr;
	}

	// update price on page
	var priceEl = document.querySelector('.product-price');
	let priceChild = document.createTextNode(data[2]);
	priceEl.appendChild(priceChild);

	// add color selection buttons to page
	var pContainer = document.querySelector('.product-color-selection');
	for (var i = 0; i < data[0].length; i++) {
		let e = document.createElement('div');
		e.classList.add('color-select');
		e.classList.add(classify(data[0][i]));
		e.setAttribute('id', 'selectedColor');
		e.setAttribute('data-value', data[0][i]);
		pContainer.appendChild(e);
	}

	// use jQuery to monitor when specific colors are selected and make sure
	// items are in stock, otherwise update the button so that users can't order selected item
	$('.product-color-selection .color-select').click(function(){
		$(this).parent().find('.color-select').removeClass('selected');
		$(this).addClass('selected'); // add styling to selection
		isSelected = true;
		$('.err-msg').remove();

		// change order btn text based on available stock
		dataValue = $(this).data('value');
		dValueIndex = gIndex(data[0], dataValue);
		if ((data[1][dValueIndex] <= 0)) {
			orderBtn.html("SOLD OUT");
			orderBtn.attr('href', '#');
		} else {
			orderBtn.html("ORDER");
			orderBtn.attr('href', formLink);
		}

		});

		orderBtn.click(function() {
		if (!isSelected) {
			if (!document.querySelector('.err-msg')) {
				$('.product-info').append("<p class=\"err-msg\">Please select a color</p>");
			}
		}
	});
}

function request_listener() {
	// TODO: add try catch block because json may not parse correctly and throws an error
	resp = parse_response(this);
	var itemData = get_inventory(resp, ITEM_ID);
	update_page(itemData);
}

// send and monitor request
sReq.addEventListener("load", request_listener);
sReq.open("GET", SHEET_URL);
sReq.send();