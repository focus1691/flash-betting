import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import { createChart } from 'lightweight-charts';
//* JSS
import useStyles from '../../../jss/components/HomeView/chartStyle';
//* Utils
import { formatCurrency } from '../../../utils/NumberFormat';
import { twoDecimalPlaces } from '../../../utils/Bets/BettingCalculations';
import { getProfitAndLoss } from '../../../utils/Charts/tradingActivityChart';

const Chart = ({ bets }) => {
  const classes = useStyles();
  const [chart, setChart] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (bets) {
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
            mode: 4,
            autoScale: true,
            invertScale: false,
          },
          grid: {
            vertLines: {
              color: 'rgba(42, 46, 57, 0)',
            },
            horzLines: {
              color: 'rgba(42, 46, 57, 0)',
            },
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
        lineSeries.setData(getProfitAndLoss(bets));
        // lineSeries.setData([
        //   { time: '2020-12-28T19:32:18.000Z', value: -7.72, },
        //   { time: '2021-01-12T22:15:01.000Z', value: -10 },
        // ]);
        newChart.timeScale().fitContent();
      }
    }
    return () => {
      setChart(null);
    };
  }, [bets]);

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
