/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 1 - Star Break Coffee
*/


/******************************
*	DIMENSIONS AND MARGINS	  *
******************************/
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

var flag = true;
var t = d3.transition().duration(750);
/******************************
*			X-AXIS			  *
******************************/
// x-scale
var x = d3.scaleBand()
			.range([0, width])
			.paddingInner(0.2)
			.paddingOuter(0.2);

// x-axis
var xAxisGroup = g.append("g")
		.attr("transform", "translate(0, " + height + ")");

// x-label
g.append("text")
	.attr("x", width/2)
	.attr("y", height + 50)
	.attr("text-anchor", "middle")
	.text("MONTH");

/******************************
*			Y-AXIS			  *
******************************/
// y-scale
var y = d3.scaleLinear()
			.range([height, 0]);

// y-axis
var yAxisGroup = g.append("g");

// y-label
var yLabel = g.append("text")
	.attr("x", - height/2)
	.attr("y", - 60)
	.attr("text-anchor", "middle")
	.attr("transform", "rotate(-90)")
	.text("REVENUE");


/******************************
*			JSON			  *
******************************/
d3.json("data/revenues.json").then(function(data) {
	data.forEach((d) => { d.revenue = +d.revenue });
	data.forEach((d) => { d.profit = +d.profit });
	console.log(data);

	d3.interval(function(){
		var newData = flag ? data : data.slice(1);
		update(newData);
		flag = !flag;
	},1000);

	update(data);

}).catch(function(error){
	console.log(error);
});

// Lägg allt som behöver uppdateras här.
function update(data) {
	var value = flag ? "revenue" : "profit";

	// Uppdatera domain
	x.domain(data.map((d) => { return d.month }));
	y.domain([ 0, d3.max(data, (d) => { return d[value] }) ]);

	// Uppdatera x-axis beroende på nya skalan
	var xAxisCall = d3.axisBottom(x);
	xAxisGroup.transition(t).call(xAxisCall);

	// Uppdatera y-axis beroende på nya skalan
	var yAxisCall = d3.axisLeft(y);
	yAxisGroup.transition(t).call(yAxisCall);


	/************************************
	*		UPDATE PATTERN				*
	*	1. JOIN new data				*
	*	2. EXIT oboslete elements		*
	*	3. UPDATE existing elements		*
	*	4. ENTER new elements	  		*
	************************************/

	// JOIN new data with old elements
	var rects = g.selectAll('circle')
					.data(data, function(d) {
						return d.month;
					});

	// EXIT old elements not present in new data
	rects.exit()
		.attr("fill", "red")
		.transition(t)
			.attr("cy", y(0))
		.remove();

	// UPDATE old elements present in new data
	rects.transition(t)
		.attr("cy", (d) => { return y(d[value]); })
		.attr("cx", (d) => { return x(d.month) + x.bandwidth()/2;; })
		.attr("r", 5);

	// ENTER new elements present in new data
	rects.enter()
			.append('circle')
				.attr("cx", (d) => { return x(d.month) + x.bandwidth()/2; })
				.attr("r", 5)
				.attr("fill", "gray")
				.attr("cy", y(0))

				.transition(t)
					.attr("cy", (d) => { return y(d[value]); })

	var label = flag ? "REVENUE" : "PROFIT";

	yLabel.text(label);
}
