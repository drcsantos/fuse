(function() {

  'use strict';

  angular.module("app.core").service("graphs", Graphs);

  function Graphs() {

    function drawGraph(doc, data, name, x, y, unit) {

      var coordsPerLetter = (610 / 84);

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
          maxData.toString() + " " + unit,
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
        var midDate = (((maxDate - minDate) / 2) + minDate);

        doc.text(
          minDate.format('MMM d'),
          x + 100,
          y + 50);
        doc.text(
          minDate.format('YYYY'),
          x + 100,
          y + 60);

        doc.text(
          moment(midDate).format('MMM d'),
          x + 150,
          y + 50);
        doc.text(
          moment(midDate).format('YYYY'),
          x + 150,
          y + 60);
      }

      doc.setFillColor(0, 0, 0);
      doc.setDrawColor(0, 0, 0);
    }


    return {
      drawGraph: drawGraph
    };

  }


})();
