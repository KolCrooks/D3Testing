// import * as d3 from 'd3'
function drawScatter(){
    let data = []
    for(let i = 0; i < 50; i++){
        data.push({x:Math.random()*30, y: Math.random()*30})
    }

    let scatterChart = d3.select('.scatter')
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform", `translate(${margin.left},${margin.top})`);
    
    let xMax = d3.max(data,function(d){ return d.x; });
    let x = d3.scaleLinear()
                .domain([0, xMax+5])
                .range([0,width]);
    
    let y = d3.scaleLinear()
                .domain([0, d3.max(data,function(d){ return d.y; })])
                .range([height,0]);

    scatterChart.append("g")
                .attr("class", "x axis")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x))

    scatterChart.append("g")
                .attr("class", "y axis")
                .call(d3.axisLeft(y))

    scatterChart.selectAll('circle')
                .data(data)
             .enter().append('circle')
                .attr('r',3)
                .attr('cx',function(d){
                    return x(d.x)
                })
                .attr('cy',function(d){
                    console.log(d)
                    return y(d.y)
                })
                .attr('fill', "red")
    scatterChart.selectAll('line')
                .data(linearRegression(data))
                .append("line")
                .attr("x1", 0)
                .attr("y1", function(d){
                    return d.intercept
                })
                .attr("x2",function(d){
                    return xMax
                })
                .attr("y2", function(d){
                    return d.slope*xMax+d.intercept;
                })

}


function linearRegression(data){
    var lr = {};
    var n = data.length;
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_xx = 0;
    var sum_yy = 0;

    for (var i = 0; i < data.length; i++) {

        sum_x += data[i].x;
        sum_y += data[i].y;
        sum_xy += (data[i].x*data[i].y);
        sum_xx += (data[i].x*data[i].x);
        sum_yy += (data[i].y*data[i].y);
    } 

    lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
    lr['intercept'] = (sum_y - lr.slope * sum_x)/n;
    lr['r2'] = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);

    return [lr];
}