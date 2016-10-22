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

var buy = function(amount, currency){

	//no currency (it is an optional parameter)

	if (currency == null){
		//no currency, continue on for buying amount of bitcoin.
        	console.log("order to buy " + amount + " BTC queued.");
		//todo save into a variable or something to do order function.
	}

	else{
		//buy amount at the currency rate
		var rate = 1000000;
		console.log("Order to buy " + amount + currency + " of BTC queued @ " + rate );
	}	
}

// ~~~~~~~~~~~~Start REPL mode~~~~~~~~~~~~~~~~~~~~

var r = repl.start({ prompt: 'coinbase>', eval: evaluate });

// evaluate each thing put into the repl command prompt

function evaluate(cmd, context, fileName, callback){
	//split commands by spaces
	var cmds = cmd.split(" ");

	//execute current command
	var exe = cmds[0].trim();

	//these will be the commands that are supported
	if(exe == "buy"){console.log("You executed the buy command.");}
	if(exe == "sell"){console.log("You executed the sell command");}
	if(exe == "orders"){console.log("You executed the orders command");}

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
