(function() {

    'use strict';

    angular.module("app.core").service("graphs", Graphs);

    function Graphs() {

        function drawGraph(doc, data, name, x, y) {

            var coordsPerLetter = (594 / 82);

            if(data.length > 0) {
                doc.rect(
                x + 10,
                y + 10,
                594,
                108)

                var maxData = _.max(_.map(data,"data"));
                var minData = _.min(_.map(data,"data"));

                var maxDate = moment(data[data.length - 1].date).utc();
                var minDate = moment(data[0].date).utc();

                var graphSpacingY = (594/(data.length-1));
                var coordsPerDataUnitY = 108/(maxData - minData);
                var coordsPerDateUnitX = 594/(maxDate - minDate);
                var yValue;

                console.log(minDate + " " + maxDate);

                console.log('X coords: ' + coordsPerDateUnitX);
                console.log('Y coords: ' + coordsPerDateUnitX);

                for (i = 0; i < data.length; i++) {
                doc.setFillColor(255,0,0);
                doc.setDrawColor(255,0,0);
                doc.circle(
                    (graphSpacingY * i) + x + 10, // x
                    (118 + y) - ((data[i].data - minData) * coordsPerDataUnitY), // y
                    3,  // radius
                    'F');

                if (i !== (data.length - 1)) {
                    doc.line(
                    (graphSpacingY * i) + 10 + x, // x1
                    y + 118 - ((data[i].data - minData) * coordsPerDataUnitY),  // y1
                    (graphSpacingY * (i + 1)) + 10 + x, // x2
                    y + 118 - ((data[i + 1].data - minData) * coordsPerDataUnitY)); // y2
                }
                // doc.text(118 - ((data.temperature[i].data - minData) * coordsPerDataUnitY) + " ", 10, i * 20)
                }

                var chartTitle;
                chartTitle = name;
                doc.text(chartTitle, x + 602 - (chartTitle.length * coordsPerLetter), y + 30);
                doc.text(maxData.toString(), x + 11, y + 20)
                doc.text((((maxData - minData)/2) + minData).toString(), x + 11, y + 67.5);
                doc.text(minData.toString(), x + 11, y + 115);
            }

            doc.setFillColor(0, 0, 0);
            doc.setDrawColor(0, 0, 0);
        }


        return {
            drawGraph: drawGraph
        };

    }


})();