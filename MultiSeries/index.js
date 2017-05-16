(function () {
    var _this = this;

    function constructor() {
        _this.chart = d3.select("#chart");
        _this.data = data;

        bindEvents();
        render();
    }

    /**
     * Bind events here
     */
    function bindEvents() {
        d3.select(window).on('resize', render);
    }

    /**
     * Populate Chart props
     * @returns {*} Chart props
     */
    function getAttributes() {
        var margin = {top: 20, right: 80, bottom: 50, left: 40};                        // Margins
        var w = parseInt(_this.chart.style("width")) - margin.left - margin.right;      // Width
        var h = parseInt(_this.chart.style("height")) - margin.top - margin.bottom;     // Height
        var x = d3.time.scale().range([0, w]);                                          // xScale
        var y = d3.scale.linear().range([h, 0]);                                        // yScale
        var xAxis = d3.svg.axis().scale(x).orient("bottom");                            // xAxis
        var yAxis = d3.svg.axis().scale(y).orient("left");                              // yAxis
        var color = d3.scale.category10();
        var line = d3.svg.line().interpolate("basis")
            .x(function (d) {return x(d.Date)})
            .y(function (d) {return y(d.Value)});

        return {margin: margin, w: w, h: h, x: x, y: y, xAxis: xAxis, yAxis: yAxis, color: color, line: line};
    }

    /**
     * Renders Chart
     */
    function render() {
        // Reset on window resize
        _this.svg && _this.svg.selectAll("*").remove();
        // Fetch attributes
        _this.attributes = getAttributes();
        // Populate add and store SVG
        _this.svg = _this.chart
            .attr("width", _this.attributes.w + _this.attributes.margin.left + _this.attributes.margin.right)
            .attr("height", _this.attributes.h + _this.attributes.margin.top + _this.attributes.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + _this.attributes.margin.left + "," + _this.attributes.margin.top + ")");
        // Set color
        _this.attributes.color.domain(data.map(function (d) { return d.City; }));
        // Parse date in data object
        data.forEach(function (kv) {
            kv.Data.forEach(function (d) {
                d.Date = d3.time.format("%Y%m%d").parse(d.Date);
            });
        });
        var minX = d3.min(data, function (kv) { return d3.min(kv.Data, function (d) { return d.Date; }) });
        var maxX = d3.max(data, function (kv) { return d3.max(kv.Data, function (d) { return d.Date; }) });
        var minY = d3.min(data, function (kv) { return d3.min(kv.Data, function (d) { return d.Value; }) });
        var maxY = d3.max(data, function (kv) { return d3.max(kv.Data, function (d) { return d.Value; }) });

        _this.attributes.x.domain([minX, maxX]);
        _this.attributes.y.domain([minY, maxY]);

        // Add x & y axis
        _this.svg
            .append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + _this.attributes.h + ")")
                .call(_this.attributes.xAxis);
        _this.svg
            .append("g")
                .attr("class", "y axis")
                .call(_this.attributes.yAxis);

        // Add bar chart
        var city = _this.svg
            .selectAll(".city")
            .data(data)
            .enter().append("g")
            .attr("class", "city");

        city.append("path")
            .attr("class", "line")
            .attr("d", function (d) {
                return _this.attributes.line(d.Data);
            })
            .style("stroke", function (d) {
                return _this.attributes.color(d.City);
            });

        city.append("text")
            .datum(function (d) {
                return {
                    name: d.City,
                    date: d.Data[d.Data.length - 1].Date,
                    value: d.Data[d.Data.length - 1].Value
                };
            })
            .attr("transform", function (d) {
                return "translate(" + x(d.date) + "," + y(d.value) + ")";
            })
            .attr("x", 3)
            .attr("dy", ".35em")
            .text(function (d) {
                return d.name;
            });
    }

    // Invoke constructor
    constructor();
})();
