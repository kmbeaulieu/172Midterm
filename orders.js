var repl = require('repl');
var _ = require('underscore');
var superagent = require('superagent');
const csv = require('fast-csv');

var CSVFILE_DEFAULT = "coinbaseOrders.csv";


//tests repl
var hello = "hello";

var orderList = [];

// ~~~~~~~~~~~~Start REPL mode~~~~~~~~~~~~~~~~~~~~

var r = repl.start({
    prompt: 'coinbase>',
    eval: evaluate
});

// ~~~~~~~~~~REPL functions~~~~~~~~~~~~~~~~~~~~~~

// evaluate each thing put into the repl command prompt
function evaluate(cmd, context, fileName, callback) {
    //split commands by spaces
    var cmds = cmd.split(" ");

    //execute current command
    var exe = cmds[0].trim().toLowerCase();

    //these will be the commands that are supported
    if (exe == "buy") {
        return buy(cmds);
    }
    if (exe == "sell") {
        return sell(cmds);
    }
    if (exe == "orders") {
        return orders();
    }
    callback(null, result);
    return;

}

// buy function, buy the remaining arguments (amount, currency)
function buy(rem) {
    var actionType = rem[0].trim();

    //check for valid command (buy 10, buy 10 usd). aka MUST have a 2nd arg
    //TODO check for valid (not buy asdf)
    if (rem[1] == null || rem[1] < 0) {
        console.log("A buy amount was not input or the input was negative.");
    }

    else {
        var amount = rem[1].trim();

        //case 1 there is no currency
        if (rem[2] == null) {
            addToOrders(actionType, amount, null);
            console.log("Order to buy " + amount + " BTC queued.");
        }
        //case 2 there is a currency
        else {
            var currency = rem[2].trim();
            //this is NOT valid currency
            isCurrencyValid(currency, function(error, response) {
                if (error) {
                    console.log(error);
                }
                else {
                    addToOrders(actionType, amount, currency);
                    getExchangeRate(actionType, amount, currency);

                }

            });
        }
    }
    return;
}

function isCurrencyValid(currency, callback) {
    // return true;

    superagent.get('https://api.coinbase.com/v1/currencies')
        .set('Accept', 'application/json')
        .end(function(error, res) {
            if (error) {
                return;
            }
            var holder = res.body;
            var valid = false;
            holder.forEach(function(curr) {
                // curr = [ 'Gibraltar Pound (GIP)', 'GIP' ]
                if (curr[1] === currency.toUpperCase()) {
                    valid = true;
                }
            });
            if (valid === true) {
                callback(null, true);
            }
            else {
                callback("invalid currency");
            }
            //console.log(validity);
        });
}

function getExchangeRate(actionType, amount, currency) {
    var keyword_btccur = "btc_to_" + currency.toLowerCase();
    var keyword_curbtc = currency.toLowerCase() + "_to_btc";
    superagent.get("https://api.coinbase.com/v1/currencies/exchange_rates")
        .set('Accept', 'application/json')
        .end(function(error, res) {
            var holder = res.body;
            if (currency != null) {

                var div_btc_curr = holder[keyword_btccur];
                var div_curr_btc = holder[keyword_curbtc];
                console.log("Order to " + actionType + " " + amount + " " + currency + " " + "worth of BTC queued @ " +
                    div_btc_curr + " " + "BTC/" + currency.toUpperCase() + " (" + div_curr_btc + " BTC)");
            }
        });

}

function sell(rem) {
    //for exchange rate single function (not buy and sell seperated)
    var actionType = rem[0].trim();

    //check for valid command (sell 10, buy 10 usd). aka MUST have a 2nd arg
    //TODO check for valid (not buy asdf)
    if (rem[1] == null || rem[1] < 0) {
        console.log("There was no sell amount or the amount was negative.");
    }

    else {
        var amount = rem[1].trim();

        //case 1 there is no currency
        if (rem[2] == null) {
            addToOrders(actionType, amount, null);
            console.log("Order to sell " + amount + " BTC queued.");
        }

        //case 2 there is a currency
        else {
            var currency = rem[2].trim();
            //this is NOT valid currency
            isCurrencyValid(currency, function(error, response) {
                if (error) {
                    console.log(error);
                }
                else {
                    addToOrders(actionType, amount, currency);
                    getExchangeRate(actionType, amount, currency);

                }

            });
        }
    }
    return;

}

function addToOrders(actionType, amount, currency) {
    if (currency == null) {
        var newOrder = {
            'timeDate': new Date(),
            'type': actionType,
            'amount': amount,
            'currency': "BTC",
            'status': "UNFILLED"
        };
        orderList.push(newOrder);
    }
    else {
        var newOrder = {
            'timeDate': new Date(),
            'type': actionType,
            'amount': amount,
            'currency': currency,
            'status': "UNFILLED"
        };
        orderList.push(newOrder);
    }
}

function orders() {
    console.log("\n === CURRENT ORDERS ===");

    orderList.forEach(function(o) {
        console.log(o.timeDate + " : " + o.type + " " +
            o.amount + o.currency + " :  " + o.status);
    });
}