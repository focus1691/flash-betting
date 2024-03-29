import React, { useState, useEffect, useCallback, useRef } from 'react';
import { connect } from 'react-redux';
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
import createChartData from '../../../utils/Bets/CreateChartData';

const Chart = ({ bets, drawerOpen }) => {
  const classes = useStyles();
  const [timeFrame, setTimeframe] = useState(localStorage.getItem('chartTimeRestriction') || 'ALL');
  const [chart, setChart] = useState(null);
  const chartRef = useRef(null);

  const handleTimeChange = (e) => {
    const { value } = e.target;
    setTimeframe(value);
    localStorage.setItem('chartTimeRestriction', value);
  };

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
        lineSeries.setData(createChartData(bets, timeFrame));
        newChart.timeScale().fitContent();
      }
    }
    return () => {
      setChart(null);
    };
  }, [bets, timeFrame]);

  const handleResize = useCallback(() => {
    if (chart) {
      const { offsetWidth, offsetHeight } = chartRef.current;
      chart.resize(offsetWidth, offsetHeight);
      chart.timeScale().fitContent();
    }
  }, [chart]);

  useEffect(() => {
    handleResize();
  }, [drawerOpen, handleResize])

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [chart, chartRef, drawerOpen, handleResize]);

  return (
    <div className={classes.container}>
      <RadioGroup name="timescale" className={classes.timescaleButtons} value={timeFrame} onChange={handleTimeChange}>
        <FormControlLabel value="1D" control={<Radio />} label="1D" labelPlacement="end" />
        <FormControlLabel value="1W" control={<Radio />} label="1W" labelPlacement="end" />
        <FormControlLabel value="1M" control={<Radio />} label="1M" labelPlacement="end" />
        <FormControlLabel value="3M" control={<Radio />} label="3M" labelPlacement="end" />
        <FormControlLabel value="ALL" control={<Radio />} label="ALL" labelPlacement="end" />
      </RadioGroup>
      <div ref={chartRef} className={classes.chart} />
    </div>
  );
};

const mapStateToProps = (state) => ({
  drawerOpen: state.settings.drawerOpen,
});

export default connect(mapStateToProps)(Chart);
