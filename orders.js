repl = require('repl');
var request = require('request');

var test = request('https://coinbase.com/api/v1/currencies/exchange_rates',function(error,response,body){
	if(!error && response.statusCode == 200){
		console.log(body)
	}
});

var a = repl.start('coinbase>');
//a.context.test = test;
//a.context.buy = buy;

//request.get({});
