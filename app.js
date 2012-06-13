$(document).ready(function() {
    var $zeroDate = $('input.zero');
    var $startDate = $('input.start');
    var $endDate = $('input.end');
    var $detail = $('input.detail');
    var chart;


    var detail      = parseInt($detail.val(), 10);
    var zeroDate    = new Date($zeroDate.val());
    var startDate   = new Date($startDate.val());
    var endDate     = new Date($endDate.val());

    var generateData = function(startDate, endDate, detail) {
        var dayData = [];
        var date1_ms = startDate.getTime();
        var date2_ms = endDate.getTime();

        var range = Math.abs(date1_ms - date2_ms)/detail;

        for(var i = 0; i < detail; i++) {
            var day             = new Date(date1_ms + range * i), // STEP VALUE
                daysToZeroDate  = days_between(day, zeroDate), // DAYS TO ZERO FROM STEP VALUE
                noveltyValue    = valueOnDay(daysToZeroDate); //NOVELTY ON STEP VALUE

            //ADD TO NOVELTY ARRAY
            dayData.push([
                day.getTime(),
                noveltyValue || 0
            ]);
        }


        // set the first series' data
        chart.series[0].setData(dayData);
        chart.hideLoading();

        return dayData;
    };

    var setData = function() {
        detail      = parseInt($detail.val(), 10);
        zeroDate    = new Date($zeroDate.val());
        startDate   = new Date($startDate.val());
        endDate     = new Date($endDate.val());

        generateData(startDate, endDate, detail);
    };

    //PARSE
    chart = new Highcharts.Chart({
        chart: {
            renderTo: 'graph',
            zoomType: 'x',
            type: 'area',
            spacingRight: 20,
            events: {
                selection: function(event) {
                    var chart = this;
                                
                    if (event.xAxis) {
                        var xAxis = event.xAxis[0],
                            min = xAxis.min,
                            max = xAxis.max;
                        
                        // indicate to the user that something's going on
                        chart.showLoading();
                        
                        generateData(new Date(min), new Date(max), 384);
                        
                        return false;
                    }
                },

                click: function(event) {
                    var where = new Date(this.x);
                    console.log(this.x);
                    console.log(event);
                    console.log(this);
                    var wiki = "http://en.wikipedia.org/wiki/Portal:Current_events/" + where.toString("yyyy_MMMM_d");

                    $("#wiki").load(wiki, function() {

                    });

                }
            }
        },
        title: {
            text: 'Novelty over time'
        },
        subtitle: {
                text: document.ontouchstart === undefined ?
                    'Lower value means higher novelty. Click and drag in the plot area to zoom in' :
                    'Lower value means higher novelty. Drag your finger over the plot to zoom in'
            },
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            title: {
                text: 'Novelty'
            },
            min: 0
        },
        tooltip: {
            shared: true
        },
        legend: {
            enabled: false
        },

        plotOptions: {
            series: {
                fillColor: {
                    linearGradient: [0, 0, 0, 300],
                    stops: [
                        [0, '#4572A7'],
                        [1, 'rgba(0,0,0,0)']
                    ]
                },
                lineWidth: 1,
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: true,
                            radius: 3
                        }
                    }
                },
                shadow: false,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                }
            }
        },
        
        series: [{
            name: 'Novelty',
            // Define the data points. All series have a dummy year
            // of 1970/71 in order to be compared on the same x axis. Note
            // that in JavaScript, months start at 0 for January, 1 for February etc.
            data: []
        }]
    });

    $('.generate-novelty').on('click', function(e){
        e.preventDefault();

        setData();
    });



    //INIT
    setData();

});


function days_between(date1, date2) {
    // The number of milliseconds in one day
    var ONE_DAY = 1000 * 60 * 60 * 24;

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();

    // Calculate the difference in milliseconds
    var difference_ms = date2_ms - date1_ms;
    
    // Convert back to days and return
    return Math.round(difference_ms/ONE_DAY);

}