import React, { useState, useEffect, useRef } from 'react';
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

  useEffect(() => {
    if (data) {
      if (chartRef.current) {
        const { offsetWidth, offsetHeight } = chartRef.current;
        const chart = createChart(chartRef.current, {
          width: offsetWidth,
          height: offsetHeight,
          layout: {
            fontSize: 12,
            fontFamily: 'roboto',
          },
          priceScale: {
            mode: 1,
            invertScale: false,
          },
          localization: {
            priceFormatter: price =>
            `${formatCurrency('en-GB', 'GBP', twoDecimalPlaces(price))}`,
        },
        });
        setChart(chart);
        const lineSeries = chart.addLineSeries({ color: "#4D329D", title: 'Profit / Loss' });
        lineSeries.setData(data.map(({ placedDate, profit }) => ({ time: placedDate, value: profit }) ));
        chart.timeScale().fitContent();
      }
    }
    return () => {
      setChart(null);
    }
  }, [data])

  useEffect(() => {
    const handleResize = () => {

      if (chart) {
        const { offsetWidth, offsetHeight } = chartRef.current;
        chart.resize(offsetWidth, offsetHeight);
        chart.timeScale().fitContent();
      }
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, [chart, chartRef])

  return (
    <div ref={chartRef} className={classes.chart} />
  );
};

export default Chart;
