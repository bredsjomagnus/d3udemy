/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 1 - Star Break Coffee
*/

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


// x-lable
g.append("text")
	.attr("x", width/2)
	.attr("y", height + 50)
	.attr("text-anchor", "middle")
	.text("MONTH")

// y-lable
g.append("text")
	.attr("x", - height/2)
	.attr("y", - 60)
	.attr("text-anchor", "middle")
	.attr("transform", "rotate(-90)")
	.text("REVENUE")

d3.json("data/revenues.json").then(function(data) {
	data.forEach((d) => { d.revenue = +d.revenue });
	console.log(data);

	// x-scale
	var x = d3.scaleBand()
				.domain(data.map((d) => { return d.month }))
				.range([0, width])
				.paddingInner(0.2)
				.paddingOuter(0.2);

	// y-scale
	var y = d3.scaleLinear()
				.domain([ 0, d3.max(data, (d) => { return d.revenue }) ])
				.range([height, 0]);

	// x-axis
	var xAxisCall = d3.axisBottom(x);
	g.append("g")
		.attr("transform", "translate(0, " + height + ")")
		.call(xAxisCall);

	var yAxisCall = d3.axisLeft(y);
	g.append("g")
		.call(yAxisCall);

	var rects = g.selectAll('rect')
					.data(data)
					.enter()
					.append('rect')
						.attr("y", (d) => {
							return y(d.revenue);
						})
						.attr("x", (d) => {
							return x(d.month);
						})
						.attr("width", x.bandwidth)
						.attr("height", (d) => {
							return height - y(d.revenue);
						})
						.attr("fill", "gray")

}).catch(function(error){
	console.log(error);
})
