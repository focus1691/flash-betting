import React, { useMemo } from 'react';
import { Divider, ListItem, ListItemText } from '@material-ui/core';
import MarketSaveButton from './MarketSaveButton';

export default ({ data, setSubmenu, submenuList }) => {
  const dataWithoutRaces = useMemo(() => data.filter((sport) => sport.type !== 'RACE'), [data]);

  const handleMarketClick = ({ id, name, type, children }) => () => {
    if (type === 'MARKET') {
      window.open(`/dashboard?marketId=${id}`);
    } else {
      setSubmenu(children, name, submenuList[type] ? `${type}_1` : type, submenuList, id);
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
