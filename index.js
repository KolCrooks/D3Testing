var margin = {top: 10, right: 30, bottom: 30, left: 40},
width = 460 - margin.left - margin.right, 
height = 500 - margin.top - margin.bottom;

window.onload = function(){
    let histoData = []
    let groups = 2;
    for(let i = 0; i < groups; i++)
        for(let f = 0; f < 100; f++)
            histoData.push({
                group: i+"g",
                val: Math.ceil(Math.random() * 30)
            })
    drawHistogram('.histo',histoData);
    drawScatter();
}