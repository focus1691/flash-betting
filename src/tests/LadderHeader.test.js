import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import LadderHeader from '../components/LadderView/LadderHeader';
import reducers from '../utils/Reducers';
import { combineReducers } from 'redux';

describe('App component', () => {
    it('renders red when the hedge size is < 0', () => {
        
        const ladderHeaderProps = {
            selectionId: 1, 
            sportId: 7, 
            runner: {
                runnerName: 'Test'
            }, 
            onSelectRunner: () => {}, 
            setLadderDown: () => {}, 
        };
        
        const mockStore = configureStore([])
        const store = mockStore({
            market: {
                currentMarket: {
                    eventType: {
                        id: 7
                    }
                },
                runners: {
                    1: {
                        metadata: {
                            COLOURS_FILENAME: "1"
                        }
                    }
                },
                ladder: {
                    1: 3.5
                },
                marketPL: {
                    1: 3.5
                },
                oddsHovered: {selectionId: 0, odds: 0, side: "BACK"}, 
            },
            order: {
                bets: {
                    matched: [{
                        marketId: "1.160741054",
                        selectionId: 1,
                        price: 3.75,
                        side: "LAY",
                        size: 2
                    },
                    {
                        marketId: "1.160741054",
                        selectionId: 1,
                        price: 4.4,
                        side: "BACK",
                        size: 5
                    },
                    {
                        marketId: "1.160741054",
                        selectionId: 1,
                        price: 4.4,
                        side: "LAY",
                        size: 5
                    }],
                    unmatched: [{
                        marketId: "1.160741054",
                        selectionId: 1,
                        price: 3.75,
                        side: "LAY",
                        size: 2
                    }]
                }
                
            }

        })

        const wrapper = shallow(<LadderHeader {...ladderHeaderProps} store = {store} />)

        const text = wrapper.dive().dive().find('#ltphedgesize').get(0).props.style
        expect(text.color).toBe('red');
    });
    
});