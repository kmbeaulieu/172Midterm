repl = require('repl');
var request = require('request');

//var test = request('https://coinbase.com/api/v1/currencies/exchange_rates',function(error,response,body){
//	if(!error && response.statusCode == 200){
//		console.log(body)
//	}
//});

var hello = "hello";


var r = repl.start({prompt: 'coinbase>'});

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



//a.context.test = test;

