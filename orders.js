var repl = require('repl');
var _ = require('underscore');
var superagent = require('superagent');

//tests repl
var hello = "hello";

var orderList = [];

// ~~~~~~~~~~~~Start REPL mode~~~~~~~~~~~~~~~~~~~~

var r = repl.start({ prompt: 'coinbase>', eval: evaluate });

// ~~~~~~~~~~REPL functions~~~~~~~~~~~~~~~~~~~~~~

// evaluate each thing put into the repl command prompt
function evaluate(cmd, context, fileName, callback){
        //split commands by spaces
        var cmds = cmd.split(" ");

        //execute current command
        var exe = cmds[0].trim();

        //these will be the commands that are supported
        if(exe == "buy"){return buy(cmds);}
        if(exe == "sell"){return sell(cmds);}
        if(exe == "orders"){return orders();}
        callback(null, result);
        return;

}

// buy function, buy the remaining arguments (amount, currency)
function buy(rem){
        var actionType = rem[0].trim();

        //check for valid command (buy 10, buy 10 usd). aka MUST have a 2nd arg
        //TODO check for valid (not buy asdf)
        if(rem[1]==null || rem[1]<0){console.log("A buy amount was not input or the input was negative.");}

        else{
            var amount = rem[1].trim();

            //case 1 there is no currency
            if(rem[2] == null){
                addToOrders(actionType,amount,null);
                console.log("Order to buy " + amount + " BTC queued.");
            }
           //case 2 there is a currency
            else{
                var currency = rem[2].trim();
                    //this is NOT valid currency
                        if(!isCurrencyValid(currency)){
                            console.log("please enter a valid currrency type"); 
                        }
                        //this IS valid currency
                        else{ 
                           // var exrate = getBuyExchangeRate(amount,currency);
                           getExchangeRateAndAddToOrders(actionType,amount,currency);
                        }
                }
        }
        return;
}

//TEST for usd first, add in others later from the coinbase api
function isCurrencyValid(currency){
        //TEST RESPONSE
        return true;
       
}

function getExchangeRateAndAddToOrders(actionType,amount,currency){
    
    
     //TODO Fix this
                
}

function sell(rem){
    //for exchange rate single function (not buy and sell seperated)
    var actionType = rem[0].trim();

        //check for valid command (sell 10, buy 10 usd). aka MUST have a 2nd arg
        //TODO check for valid (not buy asdf)
        if(rem[1]==null || rem[1]<0){console.log("There was no sell amount or the amount was negative.");}

        else{
                var amount = rem[1].trim();

                //case 1 there is no currency
                if(rem[2] == null){     
                    addToOrders(actionType,amount,null);
                    console.log("Order to sell " + amount + " BTC queued.");
                }

                //case 2 there is a currency
                else{
                        var currency = rem[2].trim();

                                //this is valid currency
                                if(isCurrencyValid(currency)){
                                   getExchangeRateAndAddToOrders(actionType,amount,currency);
                                    
                                }
//                              var exrate = getCurrencyRate(currency);
                                    
                              else{ console.log("please enter a valid currrency type"); }
                }
        }
        return;
    
}

function addToOrders(actionType,amount,currency){
    if (currency==null){
        var newOrder = {
            'timeDate': new Date(),
            'type': actionType,
            'amount': amount,
            'currency': "BTC",
            'status': "UNFILLED"
        }
        orderList.push(newOrder);
    }
    else{
        var newOrder = {
            'timeDate': new Date(),
            'type': actionType,
            'amount': amount,
            'currency': currency,
            'status': "UNFILLED"
        }
        orderList.push(newOrder);
    }
}

function orders(){
    console.log("\n === CURRENT ORDERS ===" );
   orderList.forEach(function(o){
       console.log(o.timeDate + " : " + o.type + " "
                + o.amount + o.currency+" :  " + o.status);
       
   });
}