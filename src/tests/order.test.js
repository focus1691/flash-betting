import { placeOrder, cancelOrder } from "../actions/order"
import fetchMock from 'fetch-mock'

describe("Place Order works", () => {
    it("place order placed over 2.0", async () => {
        const bigOrder = {
            size: 5,
            price: 3,
            unmatchedBets: {},
            matchedBets: {},
            customerStrategyRef: 1,
            marketId: "1",
            selectionId: 1,
            side: "LAY",
        }

        fetchMock.mock('/api/place-order', 200, {response: {
            customerRef: 1,
            status: "SUCCESS",
            marketId: "1",
            instructionReports: [{
                status: "SUCCESS",
                betId: 10,
                instruction: {
                    orderType: "LIMIT",
                    selectionId: 1,
                    side: "LAY"
                }    
            }]
        }});    
        
        const order = await placeOrder(bigOrder)(x=>x)
        
        expect(order.payload.unmatched[10].price).toBe(3)
        expect(parseFloat(order.payload.unmatched[10].size)).toBe(5)
        
    }) 

    it ("place order placed under 2.0", async () => {
        const smallOrder = {
            size: 1.4,
            price: 3,
            unmatchedBets: {},
            matchedBets: {},
            customerStrategyRef: 1,
            marketId: "1",
            selectionId: 1,
            side: "LAY",
        }

        fetchMock.mock('/api/place-order', 200, {
            response: {
                customerRef: 1,
                status: "SUCCESS",
                marketId: "1",
                instructionReports: [{
                    status: "SUCCESS",
                    betId: 10,
                    instruction: {
                        orderType: "LIMIT",
                        selectionId: 1,
                        side: "LAY"
                    }    
                }]
            },
            overwriteRoutes: true
        });    

        fetchMock.mock('/api/cancel-order', 200, {
            response: {
                customerRef: 1,
                status: "SUCCESS",
                marketId: "1",
                instructionReports: [{
                    betId: 10,
                    status: "SUCCESS",
                    sizeCancelled: 0.6
                }]
            },
            overwriteRoutes: true
        });    

        fetchMock.mock('/api/replace-orders', 200, {response: {
            customerRef: 1,
            status: "SUCCESS",
            marketId: "1",
        }});    

        const order = await placeOrder(smallOrder)(x=>x)
        expect(order.payload.unmatched[10].price).toBe(3)
        expect(parseFloat(order.payload.unmatched[10].size)).toBe(1.4)
    })

})

describe("Cancel Order works", () => {

    fetchMock.mock('/api/cancel-order', 200, {
        response: {
            customerRef: 1,
            status: "SUCCESS",
            marketId: "1",
            instructionReports: [{
                status: "SUCCESS",
                betId: 10,
                instruction: {
                    sizeCancelled: 5,
                    status: "SUCCESS"
                }    
            }]
        },
        overwriteRoutes: true
    });    
    
    it('cancel order removes a bet', async () => {
        const bigOrder = {
            size: 5,
            price: 3,
            unmatchedBets: {
                10: {
                    size: 5,
                    price: 3,
                    unmatchedBets: {},
                    matchedBets: {},
                    customerStrategyRef: 1,
                    marketId: "1",
                    selectionId: 1,
                    side: "LAY",
                }
            },
            matchedBets: {},
            customerStrategyRef: 1,
            marketId: "1",
            selectionId: 1,
            side: "LAY",
            betId: 10
        }
        
        const order = await cancelOrder(bigOrder)(x=>x)
        expect(Object.keys(order.payload.unmatched).length).toBe(0)
    })

    it('cancel order does not remove a bet', async () => {
        const bigOrder = {
            size: 5,
            price: 3,
            unmatchedBets: {
                11: {
                    size: 5,
                    price: 3,
                    unmatchedBets: {},
                    matchedBets: {},
                    customerStrategyRef: 1,
                    marketId: "1",
                    selectionId: 1,
                    side: "LAY",
                }
            },
            matchedBets: {},
            customerStrategyRef: 1,
            marketId: "1",
            selectionId: 1,
            side: "LAY",
            betId: 10
        }
        
        const order = await cancelOrder(bigOrder)(x=>x)
        expect(Object.keys(order.payload.unmatched).length).toBe(1)
    })
    
    

})