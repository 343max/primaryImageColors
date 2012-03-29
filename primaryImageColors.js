function imageColors(imageUrl, callback) {
	var d2h = function(d) {return d.toString(16);}
	var h2d = function(h) {return parseInt(h, 16);}

	var image = new Image();
	image.onload = function() {
		var width = Math.round(image.width / 2);
		var height = Math.round(image.height / 2)
		var $canvas = $('<canvas>').attr({width: width, height: height});
		var context = $canvas[0].getContext('2d');

		context.drawImage(image, 0, 0, width, height);

		var imageData = context.getImageData(0, 0, width, height);
		var colorIndex = {};
		var colors = [];

		for(var i = 0; i < imageData.width * imageData.height; i++) {
			var red = imageData.data[i * 4];
			var green = imageData.data[i * 4 + 1];
			var blue = imageData.data[i * 4 + 2];
			var alpha = imageData.data[i * 4 + 3];

			if (alpha < 200) continue;

			var diversity = Math.max(Math.abs(red - green), Math.abs(red - blue));
			var rgba = 'rgba(' + red + ',' + green + ',' + blue + ',' + alpha + ')';
			var colorId = d2h(red) + d2h(green) + d2h(blue) + d2h(alpha);

			var colorI = colorIndex[colorId];
			var color = null;
			if (colorI) {
				colors[colorI].pixels++;
			} else {
				color = {pixels: 1, rgba: rgba, red: red, green: green, blue: blue, alpha: alpha, diversity: diversity};
				colors.push(color);
				colorIndex[colorId] = colors.length - 1;
			}
		}

		colors.sort(function(a, b) {
			//return b.diversity - a.diversity;
			return b.pixels * b.pixels * b.diversity - a.pixels * a.pixels * a.diversity;
		});

		callback(colors, imageData.width * imageData.height);
	}
	image.src = imageUrl;
}