(function() {

  'use strict';

  angular.module("app.core").service("graphs", Graphs);

  function Graphs() {

    function drawGraph(doc, data, name, x, y, unit) {

      var coordsPerLetter = (610 / 84);

      console.log('Unit in graph: ' + unit);

      if (data && data.length > 0) {

        var dateFormat1 = moment(data[0].date).format('MMM d');
        var dateFormat2 = moment(data[0].date).format('YYYY');

        var graphHeight = 196;
        var graphWidth = 301;

        var maxData = _.max(_.map(data, "data"));
        var minData = _.min(_.map(data, "data"));

        var maxDate = moment(data[data.length - 1].date).utc();
        var minDate = moment(data[0].date).utc();

        var coordsPerDataUnitY = (graphHeight - 10) / (maxData - minData);
        var coordsPerDateUnitX = graphWidth / (maxDate - minDate);

        for (i = 0; i < data.length; i++) {
          doc.setFillColor(255, 0, 0);
          doc.setDrawColor(255, 0, 0);
          doc.circle(
            x + ((moment(data[i].date).utc() - minDate) * coordsPerDateUnitX), // x
            (graphHeight + y) - ((data[i].data - minData) * coordsPerDataUnitY), // y
            3, // radius
            'F');

          if (i !== (data.length - 1)) {
            doc.line(
              x + ((moment(data[i].date).utc() - minDate) * coordsPerDateUnitX), // x1
              y + graphHeight - ((data[i].data - minData) * coordsPerDataUnitY), // y1
              x + ((moment(data[i + 1].date).utc() - minDate) * coordsPerDateUnitX), // x2
              y + graphHeight - ((data[i + 1].data - minData) * coordsPerDataUnitY)); // y2
          }
          // doc.text(118 - ((data.temperature[i].data - minData) * coordsPerDataUnitY) + " ", 10, i * 20)
        }

        var chartTitle;
        chartTitle = name;
        doc.text(chartTitle, x + 300 - (chartTitle.length * coordsPerLetter), y + 16);

        // data unit labels
        doc.text(
          maxData.toString(),
          x + 4,
          y + 16);
        doc.text(
          (((maxData - minData) / 2) + minData).toString(),
          x + 4,
          y + 103);
        doc.text(
          minData.toString(),
          x + 4,
          y + 190);

        // date labels
        var midDate = Math.floor(((maxDate - minDate) / 2) + minDate);
        var dateFormat2 = moment(data[0].date).format('YYYY');

        // minDate that works
        doc.text(
          minDate.format('MMM d'),
          x + 100,
          y + 50);
        doc.text(
          minDate.format('YYYY'),
          x + 100,
          y + 60);

        // midDate that doesnt work
        doc.text(
          moment(midDate).format('MMM d'),
          x + 150,
          y + 50);
        doc.text(
          moment(midDate).format('YYYY'),
          x + 150,
          y + 60);

        doc.text("min string: " + minDate.toString(), 200, 400);
        doc.text("max string: " + maxDate.toString(), 200, 410);
        doc.text("min number: " + minDate, 200, 420);
        doc.text("max number: " + maxDate, 200, 430);

        doc.text("mid number: " + midDate, 200, 450);
        doc.text("mid string: " + midDate.toString(), 200, 460);


        //doc.text("min: " + minDate.toString() + "(" + minDate + ")", 100, 20 + y);
        //doc.text("max: " + maxDate.toString() + "(" + maxDate + ")", 100, 30 + y);
        //doc.text("coordinates per time unit: " + coordsPerDateUnitX, 100, 60 + y);
        //doc.text("x value calculation: " + ((moment(data[3].date).utc() - minDate) * coordsPerDateUnitX), 100, 70 + y);
        //doc.text("time as number: " + moment(data[0].date).utc(), 100, 80 + y);


      }

      doc.setFillColor(0, 0, 0);
      doc.setDrawColor(0, 0, 0);
    }


    return {
      drawGraph: drawGraph
    };

  }


})();
