import _ from 'lodash';
import React, { useMemo } from 'react';
import { ListItem, ListItemText } from '@material-ui/core';
import MarketSaveButton from './MarketSaveButton';
//* JSS
import useStyles from '../../../jss/components/Sidebar/menu/submenuStyle';

function getNextSubmenu(data, index, tree) {
  if (index >= tree.length || tree.length === 0) return data;
  const subNode = data.find(({ id }) => id == tree[index].id);
  if (subNode) {
    const { children } = subNode;
    return getNextSubmenu(children, ++index, tree);
  }
  return data;
}

export default ({ setSubmenu, submenuList: { data, nodes } }) => {
  const classes = useStyles();
  const dataWithoutRaces = _.isEmpty(data) ? [] : getNextSubmenu(data, 0, nodes);

  const handleItemClick = ({ id, type, name }) => () => {
    if (type === 'MARKET') {
      window.open(`/dashboard?marketId=${id}`);
    } else {
      setSubmenu(id, name);
    }
  };
  return dataWithoutRaces.map((sport) => (
    <ListItem key={`select-submenu-${sport.id}`}>
      <ListItem button onClick={handleItemClick(sport)}>
        <ListItemText className={classes.name}>{sport.name}</ListItemText>
        <MarketSaveButton sport={sport} />
      </ListItem>
    </ListItem>
  ));
};
