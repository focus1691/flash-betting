import React, { useMemo } from 'react';
import { ListItem, ListItemText } from '@material-ui/core';
import MarketSaveButton from './MarketSaveButton';
//* JSS
import useStyles from '../../../jss/components/Sidebar/menu/submenuStyle';

export default ({ data, setSubmenu, submenuList }) => {
  const classes = useStyles();
  const dataWithoutRaces = useMemo(() => data.filter((sport) => sport.type !== 'RACE'), [data]);

  const handleItemClick = ({ id, name, type, children }) => () => {
    if (type === 'MARKET') {
      window.open(`/dashboard?marketId=${id}`);
    } else {
      setSubmenu(children, name, submenuList[type] ? `${type}_1` : type, submenuList, id);
    }
  };
  return dataWithoutRaces.map((sport) => (
    <React.Fragment key={`select-submenu-${sport.id}`}>
      <ListItem>
        <ListItem button onClick={handleItemClick(sport)}>
          <ListItemText className={classes.name}>{sport.name}</ListItemText>
        </ListItem>
        <MarketSaveButton sport={sport} />
      </ListItem>
    </React.Fragment>
  ));
};
