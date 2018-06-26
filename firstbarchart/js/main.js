

	// data.forEach(function(d){
	// 	d.speed = +d.speed;
	// });
	// console.log(data);
	const widthinput = 600;
	const heightinput = 400;

	var margin = {
			top: 10,
			right: 10,
			bottom: 150,
			left: 100
		};

	var width = widthinput - margin.left - margin.right,
		height = heightinput - margin.top - margin.bottom;

	var g = d3.select("#chart-area")
			.append("svg")
				.attr("width", width + margin.left +  margin.right)
				.attr("height", height + margin.top + margin.bottom)
			.append("g")
				.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

	g.append("text")
		.attr("x", width/2)
		.attr("y", height + 140)
		.attr("text-anchor", "middle")
		.attr("font-size", "20px")
		.text("Worlds Talest Buildings");

	g.append("text")
		.attr("x", - height/2)
		.attr("y", -60)
		.attr("text-anchor", "middle")
		.attr("transform", "rotate(-90)")
		.text("Height in meters");

	// var svg = d3.select('#chart-area').append('svg')
	// 	.attr("width", 1000)
	// 	.attr("height", 400);

	d3.json("data/buildnings.json").then(function(data) {
		data.forEach(function(d) {
			d.height = +d.height;
		});

		// Bredden
		var x = d3.scaleBand()
				.domain(data.map((d) => {
					return d.name;
				}))
				.range([0, width])
				.paddingInner(0.3)
				.paddingOuter(0.3);


		// Höjden
		var y = d3.scaleLinear()
				.domain([0, d3.max(data, (d) => {
					return d.height;
				})])
				.range([height, 0]);

		var xAxisCall = d3.axisBottom(x);
		g.append("g")
			.attr("class", "x-axis")
			.attr("transform", "translate(0, " + height + ")")
			.call(xAxisCall)
			.selectAll('text')
				.attr("y", "10")
				.attr("x", "-5")
				.attr("text-anchor", "end")
				.attr("transform", "rotate(-40)");

		var yAxisCall = d3.axisLeft(y)
			.ticks(3)
			.tickFormat((d) => {
				return d + "m";
			});
		g.append("g")
			.attr("class", "y-axis")
			.call(yAxisCall);

		var rects = g.selectAll("rect")
			.data(data)
			.enter()
				.append("rect")
				.attr("y", (d) => {
					return y(d.height);
				})
				.attr("x", (d, i) => {
					return x(d.name);
				})
				.attr("width", x.bandwidth)
				.attr("height", (d) => {
					return height - y(d.height);
				})
				.attr("fill", (d) => {
					return "grey";
				});

	}).catch(function(error) {
		console.log(error);
	});
