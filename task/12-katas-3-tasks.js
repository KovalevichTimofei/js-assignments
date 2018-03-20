'use strict';

/**
 * Returns true if word occurrs in the specified word snaking puzzle.
 * Each words can be constructed using "snake" path inside a grid with top, left, right and bottom directions.
 * Each char can be used only once ("snake" should not cross itself).
 *
 * @param {array} puzzle
 * @param {array} searchStr
 * @return {bool}
 *
 * @example
 *   var puzzle = [ 
 *      'ANGULAR',
 *      'REDNCAE',
 *      'RFIDTCL',
 *      'AGNEGSA',
 *      'YTIRTSP',
 *   ]; 
 *   'ANGULAR'   => true   (first row)
 *   'REACT'     => true   (starting from the top-right R adn follow the ↓ ← ← ↓ )
 *   'UNDEFINED' => true
 *   'RED'       => true
 *   'STRING'    => true
 *   'CLASS'     => true
 *   'ARRAY'     => true   (first column)
 *   'FUNCTION'  => false
 *   'NULL'      => false 
 */
function findStringInSnakingPuzzle(puzzle, searchStr) {
    let puzzleArr = puzzle.map(val => {
    	return val.split('').map(val => {
    		return {
    			val : val,
    			use : false
    		}
    	});
    });
    
    let c = searchStr.charAt(0), result = false,
    	width = puzzleArr.length,
    	height = puzzleArr[0].length;
    
    puzzleArr.forEach( (item, i, arr) =>
    {
    	item.forEach( (item, j, arr) =>
    	{
    		if (item.val === c)
    		{
    			let newPuzzleArrVersion = puzzleArr.slice();
    			newPuzzleArrVersion[i][j].use = true;
    			findWay(i, j, 0, puzzleArr);
    		}    		
    	});
    });
    
    return result;
    
    function findWay(i, j, numChar, puzzleArr)
    {
    	let curArr = puzzleArr.slice();
    	
    	if (numChar < searchStr.length - 1)
    		{
    		
    		let nextChar = searchStr.charAt(numChar + 1);    		
    	    	
			if(j > 0 && !curArr[i][j-1].use && curArr[i][j-1].val === nextChar)
			{
				curArr[i][j-1].use = true;
				findWay(i, j-1, numChar + 1, curArr);
			}
			if(i + 1 < width && !curArr[i+1][j].use && curArr[i+1][j].val === nextChar)
			{
				curArr[i+1][j].use = true;
				findWay(i+1, j, numChar + 1, curArr);
			}
			if(j + 1 < height && !curArr[i][j+1].use && curArr[i][j+1].val === nextChar)
			{
				curArr[i][j+1].use = true;
				findWay(i, j+1, numChar + 1, curArr);
			}
			if(i > 0 && !curArr[i-1][j].use && curArr[i-1][j].val === nextChar)
			{
				curArr[i-1][j].use = true;
				findWay(i-1, j, numChar + 1, curArr);
			}
    	}
    	else result = true;
    }
}


/**
 * Returns all permutations of the specified string.
 * Assume all chars in the specified string are different.
 * The order of permutations does not matter.
 * 
 * @param {string} chars
 * @return {Iterable.<string>} all posible strings constructed with the chars from the specfied string
 *
 * @example
 *    'ab'  => 'ab','ba'
 *    'abc' => 'abc','acb','bac','bca','cab','cba'
 */
function* getPermutations(chars) { // I used Hip's algorithm
    yield chars;	
	
	let length = chars.length,
	  	nextPerm = chars.split(''),
	  	swapIndic = new Array(length).fill(0),
	  	maxReach = 1, swapNumIndex, temp;

	while (maxReach < length) {
		if (swapIndic[maxReach] < maxReach) {
			swapNumIndex = maxReach % 2 && swapIndic[maxReach];
			
			temp = nextPerm[maxReach];
			nextPerm[maxReach] = nextPerm[swapNumIndex];
			nextPerm[swapNumIndex] = temp;
			
			swapIndic[maxReach]++;
			maxReach = 1;
			
					  
			yield nextPerm.join('');
		  
		} else {
			swapIndic[maxReach] = 0;
			maxReach++;
		}
	}
}


/**
 * Returns the most profit from stock quotes.
 * Stock quotes are stores in an array in order of date.
 * The stock profit is the difference in prices in buying and selling stock.
 * Each day, you can either buy one unit of stock, sell any number of stock units you have already bought, or do nothing. 
 * Therefore, the most profit is the maximum difference of all pairs in a sequence of stock prices.
 * 
 * @param {array} quotes
 * @return {number} max profit
 *
 * @example
 *    [ 1, 2, 3, 4, 5, 6]   => 15  (buy at 1,2,3,4,5 and then sell all at 6)
 *    [ 6, 5, 4, 3, 2, 1]   => 0   (nothing to buy)
 *    [ 1, 6, 5, 10, 8, 7 ] => 18  (buy at 1,6,5 and sell all at 10)
 */
function getMostProfitFromStockQuotes(quotes) {
	let profit = 0, i, maxPrice;
	
	while(quotes.length > 0)
	{
		i = 0;
		
		maxPrice = quotes.reduce((val1, val2) => val1 > val2 ? val1 : val2);
		
		while(quotes[i] < maxPrice)
		{
			profit -= quotes[i];
			i++;
		}
	
		profit += maxPrice * (i);
	
		quotes = quotes.slice(i+1);
	}
	
	return profit;
}


/**
 * Class representing the url shorting helper.
 * Feel free to implement any algorithm, but do not store link in the key\value stores.
 * The short link can be at least 1.5 times shorter than the original url.
 * 
 * @class
 *
 * @example
 *    
 *     var urlShortener = new UrlShortener();
 *     var shortLink = urlShortener.encode('https://en.wikipedia.org/wiki/URL_shortening');
 *     var original  = urlShortener.decode(shortLink); // => 'https://en.wikipedia.org/wiki/URL_shortening'
 * 
 */
function UrlShortener() {
    this.urlAllowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"+
                           "abcdefghijklmnopqrstuvwxyz"+
                           "0123456789-_.~!*'();:@&=+$,/?#[]";
}

UrlShortener.prototype = {

    encode: function(url) {    
        let code = url.slice(8);
        code = code.split('').map(val => {
		    let cur = '' + (val.charCodeAt(0) - 27);
		    
		    if(cur.length === 1)
		    	return '0' + cur;
		    return cur;
        })
        .join('');
        
        let codeSequence = [];
        
        for (let i = 3; i <= code.length; i += 3)
        {
        	codeSequence.push(code.slice(i - 3 , i));
        	      	        	
        	if(code.length - i < 3)
        	{
        		let repeat = code.length - i > 1 ? 1 : 2 ;
        		codeSequence.push(code.slice(i) + '0'.repeat(repeat));
        		break;
        	}
        }
        
        code = codeSequence.map(val => String.fromCharCode(val)).join('');
        
        return code;
    },
    
    decode: function(code) {
    	let url = code.split('').map(val =>
        {
        	let cur = '' + val.charCodeAt(0);
        	if(cur.length === 2)
        		return '0' + cur;
        	else if(cur.length === 1)
        		return '00' + cur;
        	return cur;
       	})
        .join('');

    	let urlSequence = [];
    	
        for (let i = 2; i <= url.length; i += 2)
        {
        	urlSequence.push(url.slice(i - 2 , i));
        }

    	url = urlSequence.map(val => 
    	{
    		if (+val !== 0)
    			return String.fromCharCode(+val + 27);
    		else if(val[0] !== '0' && val[1] === '0')
    			return String.fromCharCode(+val.charAt(0) + 27);
    	})
    	.join('');
    	
        return 'https://' + url;
    } 
}

module.exports = {
    findStringInSnakingPuzzle: findStringInSnakingPuzzle,
    getPermutations: getPermutations,
    getMostProfitFromStockQuotes: getMostProfitFromStockQuotes,
    UrlShortener: UrlShortener
};
