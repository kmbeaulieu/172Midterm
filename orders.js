repl = require('repl');

var request = require('request');



//var test = request('https://coinbase.com/api/v1/currencies/exchange_rates',function(error,response,body){
//	if(!error && response.statusCode == 200){
//		if(
//		console.log(body);
//	}
//});


//test repl context

var hello = "hello";

//not the right way to do this. you need to type buy(10,usd) to do it right 
//which is not on the output example

//var buy = function(amount, currency){
//
//	//no currency (it is an optional parameter)
//
//	if (currency == null){
//		//no currency, continue on for buying amount of bitcoin.
//      	console.log("order to buy " + amount + " BTC queued.");
//		//todo save into a variable or something to do order function.
//	}
//
//	else{
//		//buy amount at the currency rate
//		var rate = 1000000;
//		console.log("Order to buy " + amount + currency + " of BTC queued @ " + rate );
//	}	
//}

// ~~~~~~~~~~~~Start REPL mode~~~~~~~~~~~~~~~~~~~~

var r = repl.start({ prompt: 'coinbase>', eval: evaluate });

// evaluate each thing put into the repl command prompt

function evaluate(cmd, context, fileName, callback){
	//split commands by spaces
	var cmds = cmd.split(" ");

	//execute current command
	var exe = cmds[0].trim();

	//these will be the commands that are supported
	if(exe == "buy"){
	return buy(cmds);}
//	console.log("You executed the buy command.");}
	if(exe == "sell"){console.log("You executed the sell command");}
	if(exe == "orders"){console.log("You executed the orders command");}
	callback(null, result);
	return;	
}

// buy function, buy the remaining arguments (amount, currency)
function buy(rem){
	var x = rem[0].trim();

	//check for valid command (buy 10, buy 10 usd). aka MUST have a 2nd arg
	//TODO check for valid (not buy asdf)
	if(rem[1]==null || rem[1]<0){console.log("A buy amount was not input or the input was negative.");}
	
	else{
		var amount = rem[1].trim();
	
		//case 1 there is no currency
		if(rem[2] == null){
			console.log("Order to buy " + amount + " BTC queued.");
		} 

		//case 2 there is a currency
		if(rem[2]!=null){
			var currency = rem[2].trim();
	
			if(isCurrencyValid(currency)){ 
				//add to order TODO
				console.log("Order to buy " + amount + " " + currency + " worth of BTC queued.");
			}
			else{ console.log("please enter a valid currrency type"); }
		}
	}
	return;
}

//TEST for usd first, add in others later from the coinbase api
function isCurrencyValid(currency){
	if(currency == "usd"){return true;}
	else return false;
}


r.context.request = request;

r.defineCommand('buy',{
	help: 'buy bitcoins',
	action: function(amount){
		this.lineParser.reset();
		this.bufferedCommand = '';
		//do buy stuff
		console.log('buy bitcoins');
		this.displayPrompt();
	}
});

r.context.hello = hello;

r.context.buy = buy;
