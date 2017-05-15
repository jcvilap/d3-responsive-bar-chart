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
        var margin = {top: 20, right: 40, bottom: 50, left: 40};                        // Margins
        var w = parseInt(_this.chart.style("width")) - margin.left - margin.right;      // Width
        var h = parseInt(_this.chart.style("height")) - margin.top - margin.bottom;     // Height
        var x = d3.scale.ordinal().rangeRoundBands([0, w], .05);                        // xScale
        var y = d3.scale.linear().range([h, 0]);                                        // yScale
        var xAxis = d3.svg.axis().scale(x).orient("bottom");                            // xAxis
        var yAxis = d3.svg.axis().scale(y).orient("left").ticks(10);                    // yAxis

        return {margin: margin, w: w, h: h, x: x, y: y, xAxis: xAxis, yAxis: yAxis};
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
        // Scale the range of the data
        _this.attributes.x.domain(data.map(function (d) {
            return d.Letter;
        }));
        _this.attributes.y.domain([0, d3.max(data, function (d) {
            return d.Freq;
        })]);
        // Add axis
        _this.svg
            .append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + _this.attributes.h + ")")
            .call(_this.attributes.xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "0.35em");
        _this.svg
            .append("g")
            .attr("class", "y axis")
            .call(_this.attributes.yAxis);

        // Add bar chart
        _this.svg
            .selectAll("bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d) {
                return _this.attributes.x(d.Letter);
            })
            .attr("width", _this.attributes.x.rangeBand())
            .attr("y", function (d) {
                return _this.attributes.y(d.Freq);
            })
            .attr("height", function (d) {
                return _this.attributes.h - _this.attributes.y(d.Freq);
            });
    }

    // Invoke constructor
    constructor();
})();
