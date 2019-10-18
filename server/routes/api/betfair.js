const router = require('express').Router();

// Load the session key from localStorage into the database and session object
router.get("/api/load-session", (request, response) => {

	session.setActiveSession(request.query.sessionKey);
	session.setEmailAddress(request.query.email);

	response.send("sent");
});

router.get("/api/get-subscription-status", (request, response) => {
	session.isAccountSubscribedToWebApp(
		{
			vendorId: process.env.APP_ID
		},
		(err, res) => {
			response.json({
				isSubscribed: res.result
			});
		}
	);
});

router.get("/api/request-access-token", (request, response) => {

	const params = {
		client_id: process.env.APP_ID,
		grant_type: request.query.tokenType,
		client_secret: process.env.APP_SECRET
	}

	const setupTokenInfo = async () => {
		if (request.query.tokenType === "REFRESH_TOKEN") {
			storedTokenData = await database.getTokenData(session.email);

			if (storedTokenData.expiresIn < new Date()) {
				params.refresh_token = storedTokenData.refreshToken;
				token();
			} else {
				response.json(storedTokenData);
			}
		} else if (request.query.tokenType === "AUTHORIZATION_CODE") {
			params.code = request.query.code;
			token();
		}
	};

	const token = async () => {
		session.token(params, (err, res) => {
			var tokenInfo = {
				accessToken: res.result.access_token,
				expiresIn: new Date(new Date().setSeconds(new Date().getSeconds() + res.result.expires_in)),
				refreshToken: res.result.refresh_token
			};
			// Update the user details with the token information
			database.setToken(session.email, tokenInfo).then(() => { response.json(tokenInfo) });
		}
		);
	}

	setupTokenInfo();
});

router.get("/api/login", (request, response) => {
	session
		.login(request.query.user, request.query.pass)
		.then(res => {
			response.json({
				sessionKey: res.sessionKey
			});
			// Check if user exists, if doesn't exist, then create a new user
			database.setUser(request.query.user, res.sessionKey);
		})
		.bind(this)
		.catch(err =>
			response.json({
				error: err
			})
		);
});

router.get("/api/logout", (request, response) => {
	session
		.logout()
		.then(res => {
			response.json(res);
		})
		.bind(this)
		.catch(err =>
			response.json({
				error: err
			})
		);
});

router.get("/api/get-account-balance", (request, response) => {
	session.getAccountFunds(
		{
			filter: {}
		},
		(err, res) => {
			response.json({
				balance: res.result.availableToBetBalance
			});
		}
	);
});

router.get("/api/get-account-details", (request, response) => {
	session.getAccountDetails(
		{
			filter: {}
		},
		(err, res) => {
			response.json({
				name: res.result.firstName,
				countryCode: res.result.countryCode,
				currencyCode: res.result.currencyCode,
				localeCode: res.result.localeCode
			});
		}
	);
});

router.get("/api/premium-status", (request, response) => {
	database.getPremiumStatus(session.email).then(expiryDate => {
		response.json(expiryDate);
	});
});


router.get("/api/get-user-settings", (request, response) => {
	database.getSettings(session.email).then(settings => {
		response.json(settings);
	});
});

router.post("/api/save-user-settings", (request, response) => {
	database.updateSettings(session.email, request.body).then(res => {
		response.sendStatus(res);
	});
});

router.get("/api/get-all-orders", (request, response) => {
	database.getAllOrders(session.email).then(res => {
		response.json(res);
	});
});

router.post("/api/save-order", (request, response) => {
	database.saveOrder(session.email, request.body).then(res => {
		response.sendStatus(res);
	});
});

router.post("/api/update-order", (request, response) => {
	database.updateOrderKey(session.email, request.body).then(res => {
		response.sendStatus(res);
	});
});

router.post("/api/remove-orders", (request, response) => {
	database.removeOrders(session.email, request.body).then(res => {
		response.sendStatus(res);
	});
});

router.get("/api/get-all-sports", (request, response) => {
	session.listEventTypes(
		{
			filter: {}
		},
		(err, res) => {
			response.json(res.result);
		}
	);
});

router.get("/api/list-countries", (request, response) => {
	session.listCountries(
		{
			filter: {
				eventTypeIds: [request.query.sportId]
			}
		},
		(err, res) => {
			response.json(res.result);
		}
	);
});

router.get("/api/list-competitions", (request, response) => {
	session.listCompetitions(
		{
			filter: {
				eventTypeIds: [request.query.sportId],
				marketCountries: [request.query.country]
			}
		},
		(err, res) => {
			response.json(res.result);
		}
	);
});

router.get("/api/list-events", (request, response) => {
	session.listEvents(
		{
			filter: {
				eventTypeIds: [request.query.sportId],
				marketCountries: [request.query.country]
			}
		},
		(err, res) => {
			response.json(res.result);
		}
	);
});

router.get("/api/list-competition-events", (request, response) => {
	session.listEvents(
		{
			filter: {
				competitionIds: [request.query.competitionId],
				marketCountries: [request.query.country]
			}
		},
		(err, res) => {
			response.json(res.result);
		}
	);
});

router.get("/api/list-markets", (request, response) => {
	const filter = {
		eventIds: [request.query.eventId]
	};
	switch (request.query.eventId) {
		case 1:
			filter.marketTypeCodes = ["MATCH_ODDS"];
		case 7:
			filter.marketTypeCodes = ["WIN"];
	}

	session.listMarketCatalogue(
		{
			filter,
			sort: "MAXIMUM_TRADED",
			maxResults: 1000
		},
		(err, res) => {
			response.json(res);
		}
	);
});

router.get("/api/get-market-info", (request, response) => {
	session.listMarketCatalogue(
		{
			filter: {
				marketIds: [request.query.marketId]
			},
			marketProjection: [
				"COMPETITION",
				"EVENT",
				"EVENT_TYPE",
				"MARKET_START_TIME",
				"MARKET_DESCRIPTION",
				"RUNNER_DESCRIPTION",
				"RUNNER_METADATA"
			],
			maxResults: 1
		},
		(err, res) => {
			response.json(res);
		}
	);
});

router.post("/api/place-order", (request, response) => {

	session.placeOrders(
		{
			marketId: request.body.marketId,
			instructions: [
				{
					selectionId: request.body.selectionId,
					handicap: "0",
					side: request.body.side,
					orderType: "LIMIT",
					limitOrder: {
						size: request.body.size,
						price: request.body.price,
						persistenceType: "PERSIST",
						minFillSize: request.body.minFillSize || 1
					}
				}
			],
			customerStrategyRef: request.body.customerStrategyRef
		},
		(err, res) => {
			response.json(res.result);
		}
	);
});

router.get("/api/listCurrentOrders", (request, response) => {
	session.listCurrentOrders({
		marketIds: [request.query.marketId]
	},
		(err, res) => {
			response.json(res.result)
		})
});


router.post("/api/cancel-order", (request, response) => {
	session.cancelOrders(
		{
			marketId: request.body.marketId,
			instructions: [
				{
					betId: request.body.betId,
					sizeReduction: request.body.sizeReduction
				}
			],
			customerRef: request.body.customerRef
		},
		(err, res) => {
			response.json(res.result);
		}
	);
});

router.post("/paypal-transaction-complete", (request, response) => {
	database.saveTransaction(session.email, request.body).then(res => {
		response.sendStatus(res);
	});
});

// A call to get required params for O-auth (vendorId, vendorSecret)
router.get("/api/get-developer-application-keys", (request, response) => {
	session.getDeveloperAppKeys(
		{
			filter: {}
		},
		(err, res) => {
			var vendorId = res.result[1].appVersions[0].vendorId;
			var vendorSecret = res.result[1].appVersions[0].vendorSecret;
			response.json({
				vendorId,
				vendorSecret
			});
		}
	);
});
