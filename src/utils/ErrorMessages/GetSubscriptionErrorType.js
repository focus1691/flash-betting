const ErrorMessages = {
    INVALID_INPUT: "Protocol",
    TIMEOUT: "Protocol",
    NO_APP_KEY: "Authentication",
    INVALID_APP_KEY: "Authentication",
    NO_SESSION: "Authentication",
    INVALID_SESSION_INFORMATION: "Authentication",
    NOT_AUTHORIZED: "Authentication",
    MAX_CONNECTION_LIMIT_EXCEEDED: "Authentication",
    SUBSCRIPTION_LIMIT_EXCEEDED: "Subscription",
    INVALID_CLOCK: "Subscription",
    UNEXPECTED_ERROR: "General",
    CONNECTION_FAILED: "General"
}


export default (error) => ErrorMessages[error] || 'Invalid'