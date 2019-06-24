/**
 * @typedef DataPoint
 * @property {number} val value of datapoint
 * @property {*} group group of the datapoint (for displaying multiple groups)
 */

/**
 * draws a histogram in a given svg element
 * @param {String} selector selector for the svg element
 * @param {DataPoint[]} data data to display
 */
function drawHistogram(selector, data, binCnt = 60, colors = ['#1995e8','#e81818'], margin = {top: 10, right: 30, bottom: 30, left: 40}){
    let height = d3.select(selector).style('height')
    height = height.substring(0,height.length-2)-margin.top-margin.bottom;
    let width = d3.select(selector).style('width')
    width = width.substring(0,width.length-2)-margin.right-margin.left;
    
    //get the data groups in the histogram
    let groups = {}
    let colorCnt = 0;
    for(let d of data){
        if(!groups[d.group]){
            let color;
            if(!colors[colorCnt])
                color = `rgb(${Math.random() * 256}, ${Math.random() * 256}, ${Math.random() * 256})`; 
            else
                color = colors[colorCnt];
            colorCnt++;
            groups[d.group] = color;
        }
    }

    //Get the svg object
    let histoChart = d3.select(selector)
            // .attr("width", width + margin.left + margin.right) //For testing purposes
            // .attr("height", height + margin.top + margin.bottom)
        // .append("g")
        //     .attr("transform", `translate(${margin.left},${margin.top})`);
        
    //Create X Scale
    let x = d3.scaleLinear()
            .range([0,width])
            .domain([0,d3.max(data,function(d){
                return d.val
            })])
    
    //Create Histogram Generator
    let hist = d3.histogram()
                .value(function(d){ return d.val; })
                .domain(x.domain())
                .thresholds(x.ticks(binCnt));
                
    //Create the bins
    let bins = []
    for(let g in groups){
        let tempbin = hist(data.filter((t)=>{
            return t.group == g;
        }))
        tempbin['group'] = g;
        bins.push(tempbin);
    }
    //Create Y Scale
    var y = d3.scaleLinear()
            .range([height, 0])
            .domain([0,d3.max(bins, function(d1){
                return d3.max(d1,function(d){
                    return d.length;
                })
            })]);
    
    //Create Axes
    let xAxis = d3.axisBottom(x);
    let yAxis = d3.axisLeft(y);

    histoChart.append("g")
            .attr("class", "x axis")
            .attr("transform", `translate(0,${height})`)
            .call(xAxis);

    histoChart.append("g")
            .attr("class", "y axis")
            .call(yAxis);
    
    //Generate graph
    for(let bin of bins){
        histoChart.selectAll(".bar")
        .data(bin.filter((v,i)=> i != 'group'))
        .enter().append("rect")
            .attr("x", 1)
            .attr("transform",function(d,i){
                return `translate(${x(d.x0)},${y(d.length)})`;
            })
            .attr("width",function(d,i){
                return x(d.x1-d.x0);
            })
            .attr("height",function(d,i){
                return height-y(d.length);
            })
            .attr("fill", groups[bin['group']])
            .attr("opacity", .7)
    }
}