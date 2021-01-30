import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import { createChart } from 'lightweight-charts';
//* JSS
import useStyles from '../../../jss/components/HomeView/chartStyle';
//* Utils
import { formatCurrency } from '../../../utils/NumberFormat';
import { twoDecimalPlaces } from '../../../utils/Bets/BettingCalculations';

const Chart = ({ data }) => {
  const classes = useStyles();
  const [chart, setChart] = useState(null);
  const chartRef = useRef(null);
  console.log(_.groupBy(data, 'settledDate'));

  useEffect(() => {
    if (data) {
      if (chartRef.current) {
        if (chart) {
          chart.remove();
        }
        const { offsetWidth, offsetHeight } = chartRef.current;
        const newChart = createChart(chartRef.current, {
          width: offsetWidth,
          height: offsetHeight,
          layout: {
            textColor: '#B6CCF9',
            backgroundColor: '#242526',
            fontSize: 12,
            fontFamily: 'roboto',
          },
          priceScale: {
            mode: 1,
            invertScale: false,
          },
          localization: {
            priceFormatter: (price) => `${formatCurrency('en-GB', 'GBP', twoDecimalPlaces(price))}`,
          },
        });
        setChart(newChart);
        const lineSeries = newChart.addLineSeries({
          color: '#4D329D',
          title: 'Profit / Loss',
        });
        lineSeries.setData(data.map(({ placedDate, profit }) => ({ time: placedDate, value: profit })));
        newChart.timeScale().fitContent();
      }
    }
    return () => {
      setChart(null);
    };
  }, [data]);

  useEffect(() => {
    const handleResize = () => {
      if (chart) {
        const { offsetWidth, offsetHeight } = chartRef.current;
        chart.resize(offsetWidth, offsetHeight);
        chart.timeScale().fitContent();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [chart, chartRef]);

  return <div ref={chartRef} className={classes.chart} />;
};

export default Chart;
