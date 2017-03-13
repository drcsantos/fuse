(function() {

  'use strict';

  angular.module("app.core").service("graphs", Graphs);

  Graphs.$inject = ['$filter'];

  function Graphs() {

    function drawGraph(doc, data, name, x, y) {

      var coordsPerLetter = (610 / 84);
      var dateVar = new Date(data[0].date);
      var dateFilter = $filter('date');
      var dateVarFiltered = dateFilter(dateVar, 'MMMM d, yyyy');

      if (data.length > 0) {
        doc.rect(
          x + 10,
          y + 10,
          594,
          108)

        var maxData = _.max(_.map(data, "data"));
        var minData = _.min(_.map(data, "data"));

        var maxDate = moment(data[data.length - 1].date).utc();
        var minDate = moment(data[0].date).utc();
        var minDatePlus1 = moment(data[1].date).utc();

        var graphSpacingY = (594 / (data.length - 1));
        var coordsPerDataUnitY = 108 / (maxData - minData);
        var coordsPerDateUnitX = 594 / (maxDate - minDate);
        var yValue;

        for (i = 0; i < data.length; i++) {
          doc.setFillColor(255, 0, 0);
          doc.setDrawColor(255, 0, 0);
          doc.circle(
            10 + ((moment(data[i].date).utc() - minDate) * coordsPerDateUnitX),
            //(graphSpacingY * i) + x + 10, // x
            (118 + y) - ((data[i].data - minData) * coordsPerDataUnitY), // y
            3, // radius
            'F');

          if (i !== (data.length - 1)) {
            doc.line(
              10 + ((moment(data[i].date).utc() - minDate) * coordsPerDateUnitX), // x1
              y + 118 - ((data[i].data - minData) * coordsPerDataUnitY), // y1
              10 + ((moment(data[i + 1].date).utc() - minDate) * coordsPerDateUnitX), // x2
              y + 118 - ((data[i + 1].data - minData) * coordsPerDataUnitY)); // y2
          }
          // doc.text(118 - ((data.temperature[i].data - minData) * coordsPerDataUnitY) + " ", 10, i * 20)
        }

        var chartTitle;
        chartTitle = name;
        doc.text(chartTitle, x + 602 - (chartTitle.length * coordsPerLetter), y + 20);
        doc.text(maxData.toString(), x + 11, y + 20)
        doc.text((((maxData - minData) / 2) + minData).toString(), x + 11, y + 67.5);
        doc.text(minData.toString(), x + 11, y + 115);

        doc.text("min: " + minDate.toString(), x + 30, y + 115);
        doc.text("dateVar: " + dateVar, x + 30, y + 50);
        doc.text("dateVarFiltered: " + dateVarFiltered, x + 30, y + 60);


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
