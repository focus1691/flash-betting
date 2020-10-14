import { Divider, ListItem, ListItemText } from '@material-ui/core';
import React from 'react';
import MarketSaveButton from './MarketSaveButton';

export default ({
  data, setSubmenu, submenuList, winMarketsOnly,
}) => {
  const dataWithoutRaces = data.filter((sport) => sport.type !== 'RACE');

  const handleMarketClick = (sport) => (e) => {
    if (sport.type === 'MARKET') {
      window.open(`/dashboard?marketId=${sport.id}`);
    } else {
      setSubmenu(
        sport.children,
        sport.name,
        submenuList[sport.type] ? `${sport.type}_1` : sport.type,
        submenuList,
        sport.id,
      );
    }
  };
  return dataWithoutRaces.map((sport) => (
    <React.Fragment key={`select-submenu-${sport.id}`}>
      <ListItem
        style={{
          display: 'flex',
          flexDirection: 'row-reverse',
          color: 'blue',
          height: '3em',
          paddingBottom: '2px',
          marginTop: '0.5em',
          marginLeft: '2rem',
        }}
      >
        <MarketSaveButton sport={sport} />
        <ListItem button onClick={handleMarketClick(sport)}>
          <ListItemText>{sport.name}</ListItemText>
        </ListItem>
      </ListItem>
      <Divider />
    </React.Fragment>
  ));
};
