import React, { useState, useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';
//* @material-ui core
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
//* JSS
import useStyles from '../../../jss/components/HomeView/chartStyle';
//* Utils
import { formatCurrency } from '../../../utils/NumberFormat';
import { twoDecimalPlaces } from '../../../utils/Bets/BettingCalculations';
import { getProfitAndLoss } from '../../../utils/Charts/tradingActivityChart';

const Chart = ({ bets }) => {
  const classes = useStyles();
  const [timeFrame, setTimeframe] = useState(1);
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
              color: '#3D3E3F',
            },
            horzLines: {
              color: '#3D3E3F',
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

  return (
    <div className={classes.container}>
      <RadioGroup name="timescale" className={classes.timescaleButtons} value={timeFrame} onChange={(e) => setTimeframe(e.target.value)}>
        <FormControlLabel value="1W" control={<Radio />} label="1W" labelPlacement="end" />
        <FormControlLabel value="2W" control={<Radio />} label="2W" labelPlacement="end" />
        <FormControlLabel value="1M" control={<Radio />} label="1M" labelPlacement="end" />
      </RadioGroup>
      <div ref={chartRef} className={classes.chart} />
    </div>
  )
};

export default Chart;
