/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 2 - Gapminder Clone
*/

/******************************
*	DIMENSIONS AND MARGINS	  *
******************************/
const widthinput = 600;
const heightinput = 400;

var margin = {
		top: 10,
		right: 30,
		bottom: 50,
		left: 50
	};

var width = widthinput - margin.left - margin.right,
	height = heightinput - margin.top - margin.bottom;

var g = d3.select("#chart-area")
		.append("svg")
			.attr("width", width + margin.left +  margin.right)
			.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");


var cont = [
	"europe",
	"asia",
	"americas",
	"africa"
];
var color = [
	'#7b3294',
	'#c2a5cf',
	'#a6dba0',
	'#008837'
];

var i = 1;
var interval;
var gdata;

var tip = d3.tip().attr('class', 'd3-tip')
	.html(function(d) {
		var text = "<strong>Country:</strong> <span style='color:red'>"+d.country+"</span><br>";
		text += "<strong>Continent:</strong> <span style='color:red;text-transform: capitalize'>"+d.continent+"</span><br>";
		text += "<strong>Life Expectancy:</strong> <span style='color:red'>"+d3.format(".2f")(d.life_exp)+"</span><br>";
		text += "<strong>GDP Per Capita:</strong> <span style='color:red'>"+d3.format("$,.0f")(d.income)+"</span><br>";
		text += "<strong>Population:</strong> <span style='color:red'>"+d3.format(",.0f")(d.population)+"</span><br>";
		return text;
	});
g.call(tip);

/******************************
*			LEGEND			  *
******************************/
var legend = g.append("g")
	.attr("transform", "translate("+(width-10)+", "+(height-125)+")");
	cont.forEach((continent, i) => {
	var legendRow = legend.append("g")
		.attr("transform", "translate(0, "+(i * 20)+" )");

	legendRow.append("rect")
		.attr("width", 10)
		.attr("height", 10)
		.attr("fill",color[i]);

	legendRow.append("text")
		.attr("x", -10)
		.attr("y", 10)
		.attr("text-anchor", "end")
		.style("text-transform", "capitalize")
		.text(continent);
});

/******************************
*			X-AXIS			  *
******************************/
// x-scale
var x = d3.scaleLog()
			.domain([300, 150000])
			.range([0, width]);

// x-axis
var xAxisCall = d3.axisBottom(x)
		.ticks(3)
		.tickValues([400, 4000, 40000])
		.tickFormat(d3.format(".0f"));

g.append("g")
	.attr("transform", "translate(0, " + height + ")")
	.call(xAxisCall);

// x-label
g.append("text")
	.attr("x", width/2)
	.attr("y", height + 50)
	.attr("text-anchor", "middle")
	.text("GDP per capita");



/******************************
*			Y-AXIS			  *
******************************/
// y-scale
var y = d3.scaleLinear()
			.domain([0, 90])
			.range([height, 0]);

// y-axis
var yAxisCall = d3.axisLeft(y);
g.append("g")
	.call(yAxisCall);

// y-label
var yLabel = g.append("text")
	.attr("x", - height/2)
	.attr("y", - 30)
	.attr("text-anchor", "middle")
	.attr("transform", "rotate(-90)")
	.text("Life expectency");

/******************************
*			Z-AXIS			  *
******************************/
var z = d3.scaleOrdinal()
			.domain(cont)
			.range(color);

// console.log(z("europe"));

/******************************
*		  YEAR LABEL		  *
******************************/
var yearLabel = g.append("text")
	.attr("x", 50)
	.attr("y", 50)
	.attr("text-anchor", "middle");


/******************************
*			JSON			  *
******************************/
d3.json("data/data.json").then(function(data) {
	// console.log(data[0]);
	gdata = data;
	// Clean data
	// const formattedData = data.map(function(year){
	// 	return year["countries"].filter(function(country){
	// 		var dataExists = (country.income && country.life_exp);
	// 		return dataExists;
	// 	}).map(function(country) {
	// 		country.income = +country.income;
	// 		country.life_exp = +country.life_exp;
	// 		return country;
	// 	})
	// });

	update(gdata[0]);
	// console.log("formattedData[0]: " + formattedData[0]);

	// d3.interval(function(){
	// 	i = i < 214 ? i : 0;
	// 	update(data[i]);
	// 	i++;
	// },200);


}).catch(function(error){
	console.log(error);
});

$("#play-button").on("click", function() {
	var button = $(this);
	if(button.text() == 'Play') {
		button.text("Paus");
		interval = setInterval(step, 100);
	} else {
		button.text('Play');
		clearInterval(interval);
	}
});

$("#reset-button").on("click", function() {
	i = 1;
	update(gdata[0]);
});

$("#continent-select").on("change", function() {
	update(gdata[i]);
});

$("#date-slider").slider({
	max: 2014,
	min: 1800,
	step: 1,
	slide: function(event, ui){
		i = ui.value - 1800;
		update(gdata[i]);
	}
});

function step() {
	i = i < 214 ? i : 0;
	// console.log(gdata);
	update(gdata[i]);
	i++;
}


/******************************
*			UPDATE			  *
******************************/
function update(data) {
	year = data.year;
	data = data.countries;

	var t = d3.transition(t).duration(90);


	var continent = $("#continent-select").val();


	console.log("continent: " + continent);
	var data = data.filter(function(d) {
		if (continent == "all") {
			return true;
		} else {
			return d.continent == continent;
		}
	})

	// console.log(year);

	/******************************
	*			W-AXIS			  *
	******************************/
	var w = d3.scaleLinear()
				.domain([
					d3.min(data, (d) => {
						return d.population;
					}),
					d3.max(data, (d) => {
					return d.population;
				})])
				.range([5, 25]);
	// console.log(x(data.countries[0].income == null ? 300 : data.countries[0].income));
	// console.log(data);
	/************************************
	*		UPDATE PATTERN				*
	*	1. JOIN new data				*
	*	2. EXIT oboslete elements		*
	*	3. UPDATE existing elements		*
	*	4. ENTER new elements	  		*
	************************************/

	// JOIN new data with old elements
	var circles = g.selectAll('circle')
					.data(data, function(d) {
						return d.country;
					});

	// EXIT old elements not present in new data
	circles.exit().remove();

	// UPDATE old elements present in new data
	// circles
	// 	.attr("cy", (d) => { return y(d.life_exp); })
	// 	.attr("cx", (d) => { return x(d.income == null ? 340 : d.income); })
	// 	.attr("r", (d) => { return w(d.population); })
	// 	.attr("fill", (d) => { return z(d.continent); });

	// ENTER new elements present in new data
	// Allt efter Merge är det som kan komma att förändras.
	circles.enter()
			.append('circle')
				.attr("fill", (d) => { return z(d.continent); })
				.on("mouseover", tip.show)
				.on('mouseout', tip.hide)
				.merge(circles)
				.transition(t)
					.attr("class", (d) => { return (d.income == null || d.life_exp == null) ? "hide-dot" : "show-dot" })
					.attr("cx", (d, i) => { return x(d.income == null ? 340 : d.income); })
					.attr("r", (d) => { return w(d.population); })
					.attr("cy", (d) => { return y(d.life_exp); });

	yearLabel.text(year);
	$("#year")[0].innerHTML = year;

	$("#date-slider").slider("value", +year)
}
