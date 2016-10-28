var repl = require('repl');
var superagent = require('superagent');
var jsontocsv = require('json2csv');
var fs = require('fs');

var CSVFILE_DEFAULT = "coinbaseOrders.csv";

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
    var exe = cmds[0].trim().toUpperCase();

    //these will be the commands that are supported
    if (exe == "BUY") {
       //callback(null,buy(cmds));
       
       buy(cmds, callback);
    }
    if (exe == "SELL") {
        sell(cmds, callback);
    }
    if (exe == "ORDERS") {
        orders(callback);
    }
}

// buy function, buy the remaining arguments (amount, currency)
function buy(rem, callback) {

    var actionType = rem[0].trim();
    //check for valid command (buy 10, buy 10 usd). aka MUST have a 2nd arg
    //TODO check for valid (not buy asdf)
    if (rem[1] == null || rem[1] < 0) {
        console.log("A BUY amount was not input or the input was negative.");
        callback();
    }

    else {
        var amount = rem[1].trim();

        //case 1 there is no currency
        if (rem[2] == null) {
            addToOrders(actionType, amount, null);
            console.log( "Order to BUY " + amount + " BTC queued.");
            callback();
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
                    getExchangeRate(actionType, amount, currency, callback);
                }
            });
        }
    }
    return;
}

function isCurrencyValid(currency, callback) {
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

function getExchangeRate(actionType, amount, currency, callback) {
    var keyword_btccur = "btc_to_" + currency.toLowerCase();
    var keyword_curbtc = currency.toLowerCase()+ "_to_btc";
    superagent.get("https://api.coinbase.com/v1/currencies/exchange_rates")
        .set('Accept', 'application/json')
        .end(function(error, res) {
            var holder = res.body;
            if (currency != null) {

                var div_btc_curr = holder[keyword_btccur];
                var div_curr_btc = holder[keyword_curbtc];
                console.log("Order to " + actionType + " " + amount + " " + currency.toUpperCase() + " " + "worth of BTC queued @ " +
                    div_btc_curr + " " + "BTC/" + currency.toUpperCase() + " (" + div_curr_btc + " BTC)");
                callback();
            }
        });
}

function sell(rem, callback) {
    //for exchange rate single function (not buy and sell seperated)
    var actionType = rem[0].trim();

    //check for valid command (sell 10, buy 10 usd). aka MUST have a 2nd arg
    //TODO check for valid (not buy asdf)
    if (rem[1] == null || rem[1] < 0) {
        console.log("There was no SELL amount or the amount was negative.");
        callback();
    }

    else {
        var amount = rem[1].trim();
        //case 1 there is no currency
        if (rem[2] == null) {
            addToOrders(actionType, amount, null);
            console.log("Order to SELL " + amount + " BTC queued.");
            callback();
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
                    getExchangeRate(actionType, amount, currency, callback);
                }
            });
        }
    }
    return;
}

function addToOrders(actionType, amount, currency) {
        //default to btc:  "sell x btc, buy x btc"
        if(currency==null){
            c='BTC';
        }
        else{
        
            var c = currency.toUpperCase();
        }
        
        var newOrder = {
            'timeAndDate': new Date(),
            'type': actionType.toUpperCase(),
            'amount': amount,
            'currency': c,
            'status': "UNFILLED"
        };
        orderList.push(newOrder);
}

function orders(callback) {
    console.log("\n === CURRENT ORDERS ===");
    orderList.forEach(function(o) {
        console.log(o.timeAndDate + " : " + o.type + " " +
            o.amount + o.currency + " :  " + o.status);
    });
    //fields for the json
    var keys = ['timeAndDate','type','amount','currency','status'];
    //make the csv
    var csv = jsontocsv({data: orderList, fields: keys});
    //write csv
    fs.writeFile(CSVFILE_DEFAULT, csv, function(err){
       if (err) throw err;
       console.log("Orders saved to: " + CSVFILE_DEFAULT );
       callback();
    });
}

