(function () {
    var _this = this;

    function constructor() {
        _this.chart = d3.select("#chart");
        _this.attributes = getAttributes();

        bindEvents();
        render();
    }

    function bindEvents() {
        d3.select(window).on('resize', resize);
    }

    function getAttributes() {
        var w = parseInt(_this.chart.style("width")) - 80;
        var h = parseInt(_this.chart.style("height")) - 70;
        var x = d3.scale.ordinal().rangeRoundBands([0, w], .05);
        var y = d3.scale.linear().range([h, 0]);
        var xAxis = d3.svg.axis().scale(x).orient("bottom");
        var yAxis = d3.svg.axis().scale(y).orient("left").ticks(10);

        return {m_top: 20, m_right: 40, m_bottom: 50, m_left: 40, w: w, h: h, x: x, y: y, xAxis: xAxis, yAxis: yAxis};
    }

    function resize() {
        _this.attributes = getAttributes();

        // Update the axis and text with the new scale
        _this.svg.select(".x.axis")
            .call(_this.attributes.xAxis)
            .attr("transform", "translate(0," + _this.attributes.h + ")")
            .select(".label")
            .attr("transform", "translate(" + _this.attributes.w / 2 + "," + _this.attributes.m_bottom / 1.5 + ")");

        _this.svg.select(".y.axis")
            .call(_this.attributes.yAxis);

        // Update the tick marks
        //xAxis.ticks(Math.max(width/75, 2), " $");

        // Force D3 to recalculate and update the line
        _this.svg.selectAll(".bar")
            .attr("width", function(d) { return _this.attributes.xScale(d["Letter"]); })
            .attr("y", function(d) { return _this.attributes.yScale(d["Freq"]); })
            .attr("height", _this.attributes.yScale.rangeBand());
    }

    function render() {
        _this.svg = _this.chart
            .attr("width", _this.attributes.w + _this.attributes.m_left + _this.attributes.m_right)
            .attr("height", _this.attributes.h + _this.attributes.m_top + _this.attributes.m_bottom)
            .append("g")
            .attr("transform", "translate(" + _this.attributes.m_left + "," + _this.attributes.m_top + ")");

        // load the data
        d3.json("data.json", function (error, data) {
            data.forEach(function (d) {
                d.Letter = d.Letter;
                d.Freq = +d.Freq;
            });

            // scale the range of the data
            _this.attributes.x.domain(data.map(function (d) {
                return d.Letter;
            }));
            _this.attributes.y.domain([0, d3.max(data, function (d) {
                return d.Freq;
            })]);

            // add axis
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
        });
    }

    // Invoke constructor
    constructor();
})();
