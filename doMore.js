'use strict';


exports.doSomethingWithApparts = function (apparts, from){
	/*
		from is a string. equal 'lbc' for leboncoin.fr and 'pap' for papa.fr
		apparts is a Array of Object. Each object can have many property. But clasically they are like that:
		{
			price: string,
			id: string,
			href: string, 
			title: string,
			upload: false or string,
			labels: Array(string),
			values: Array(string),
			zipcode: string
		}
		from pap there is no zipcode yet.
		labels[i] as the values[i] value. 
	*/
	console.log('from ' + ' : ' + from );
	console.log(apparts);
};