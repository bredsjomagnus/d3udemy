/*
*    main.js
*    Mastering Data Visualization with D3.js
*    CoinStats
*/

var margin = { left:80, right:100, top:50, bottom:100 },
    height = 500 - margin.top - margin.bottom,
    width = 800 - margin.left - margin.right;

var svg = d3.select("#chart-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left +
        ", " + margin.top + ")");


var varselected = "price_usd";
var coinselected = "bitcoin";
var gdata;

var t = function(){ return d3.transition().duration(200); }

// Time parser for x-scale
var parseTime = d3.timeParse("%d/%m/%Y");
var formatTime = d3.timeFormat("%d/%m/%Y");
// For tooltip
var bisectDate = d3.bisector(function(d) { return d.date; }).left;

g.append("path")
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "black")
	.attr("stroke-width", "1px");

// Scales
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// Axis generators
var xAxisCall = d3.axisBottom()
var yAxisCall = d3.axisLeft()
    .ticks(6)
    .tickFormat(function(d) { return parseInt(d / 1000) + "k"; });

// Axis groups
var xAxis = g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")");
var yAxis = g.append("g")
    .attr("class", "y axis")

// Y-Axis label
yAxis.append("text")
    .attr("class", "axis-title")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .attr("fill", "#5D6971")
    .text("Population)");



d3.json("data/coins.json").then(function(data) {

	for(var coin in data) {
		data[coin] = data[coin].filter(function(d){
            return !(d["price_usd"] == null)
		})
		data[coin].forEach(function(d) {
			d.date = parseTime(d.date);
	        d.price_usd = +d.price_usd;
			d.market_cap = +d.market_cap;
			d["24h_vol"] = +d["24h_vol"];
		});
	}
	gdata = data;
	update(gdata[coinselected]);
}).catch((error) => {
	console.log(error);
});

$("#var-select").on("change", () => {
	var varval = $("#var-select").val();
	varselected = varval;
	update(gdata[coinselected]);
});

$("#coin-select").on("change", () => {
	var coinval = $("#coin-select").val();
	coinselected = coinval;
	update(gdata[coinselected]);
});

$("#date-slider").slider({
	range: true,
	max: parseTime("31/10/2017").getTime(),
	min: parseTime("12/5/2013").getTime(),
	step: 86400000, // One day
    values: [parseTime("12/5/2013").getTime(), parseTime("31/10/2017").getTime()],
    slide: function(event, ui){
        $("#dateLabel1").text(formatTime(new Date(ui.values[0])));
        $("#dateLabel2").text(formatTime(new Date(ui.values[1])));

        update(gdata[coinselected]);
	}
});

function update(data) {

	// console.log(data);
	console.log(varselected);
	console.log(coinselected);

	var sliderValues = $("#date-slider").slider("values");
	var dateTimeFiltered = gdata[coinselected].filter(function(d){
		return ((d.date >= sliderValues[0]) && (d.date <= sliderValues[1]))
	});

    // Set scale domains
    x.domain(d3.extent(dateTimeFiltered, function(d) { return d.date; }));
    y.domain([d3.min(dateTimeFiltered, function(d) { return d[varselected]; }),
        d3.max(dateTimeFiltered, function(d) { return d[varselected]; })]);

    // Generate axes once scales have been set
    // xAxis.transition(t).call(xAxisCall.scale(x));
    // yAxis.transition(t).call(yAxisCall.scale(y));

	// Fix for format values
    var formatSi = d3.format(".2s");
    function formatAbbreviation(x) {
		var s = formatSi(x);
		switch (s[s.length - 1]) {
			case "G": return s.slice(0, -1) + "B";
			case "k": return s.slice(0, -1) + "K";
		}
		return s;
	}

	// Update axes
	xAxisCall.scale(x);
	xAxis.transition(t()).call(xAxisCall);
	yAxisCall.scale(y);
	yAxis.transition(t()).call(yAxisCall.tickFormat(formatAbbreviation));


    /******************************** Tooltip Code ********************************/

	d3.select(".focus").remove();
	d3.select(".overlay").remove();

    var focus = g.append("g")
        .attr("class", "focus")
        .style("display", "none");

    focus.append("line")
        .attr("class", "x-hover-line hover-line")
        .attr("y1", 0)
        .attr("y2", height);

    focus.append("line")
        .attr("class", "y-hover-line hover-line")
        .attr("x1", 0)
        .attr("x2", width);

    focus.append("circle")
        .attr("r", 7.5);

    focus.append("text")
        .attr("x", 15)
        .attr("dy", ".31em");

    g.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);

    function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(dateTimeFiltered, x0, 1),
            d0 = dateTimeFiltered[i - 1],
            d1 = dateTimeFiltered[i],
            d = (d1 && d0) ? (x0 - d0.date > d1.date - x0 ? d1 : d0) : 0;
        focus.attr("transform", "translate(" + x(d.date) + "," + y(d[varselected]) + ")");
        focus.select("text").text(function() { return d3.format("$,")(d[varselected].toFixed(2)); });
        focus.select(".x-hover-line").attr("y2", height - y(d[varselected]));
        focus.select(".y-hover-line").attr("x2", -x(d.date));
    }


    /******************************** Tooltip Code ********************************/
	// Line path generator
	var line = d3.line()
	    .x(function(d) { return x(d.date); })
	    .y(function(d) { return y(d[varselected]); });
	// Add line to chart
	// Update our line path
    g.select(".line")
        .transition(t())
		.attr("d", line(dateTimeFiltered));


}
