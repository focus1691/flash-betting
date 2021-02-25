import _ from 'lodash';
import React from 'react';
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

export default ({ setSubmenu, submenuList: { sportId, data, nodes } }) => {
  const classes = useStyles();
  const dataWithoutRaces = _.isEmpty(data) ? [] : getNextSubmenu(data, 0, nodes);

  const handleItemClick = (id, name, type) => () => {
    if (type === 'MARKET') {
      window.open(`/dashboard?marketId=${id}`);
    } else {
      setSubmenu(id, name, sportId, nodes);
    }
  };
  return dataWithoutRaces.map(({ id, name, type }) => (
    <ListItem key={`select-submenu-${id}`}>
      <ListItem button onClick={handleItemClick(id, name, type)}>
        <ListItemText className={classes.name}>{name}</ListItemText>
        <MarketSaveButton id={id} sportId={sportId} name={name} nodes={nodes.concat({ id, name })} />
      </ListItem>
    </ListItem>
  ));
};
