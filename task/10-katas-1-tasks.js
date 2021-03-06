'use strict';

/**
 * Returns the array of 32 compass points and heading.
 * See details here:
 * https://en.wikipedia.org/wiki/Points_of_the_compass#32_cardinal_points
 *
 * @return {array}
 *
 * Example of return :
 *  [
 *     { abbreviation : 'N',     azimuth : 0.00 ,
 *     { abbreviation : 'NbE',   azimuth : 11.25 },
 *     { abbreviation : 'NNE',   azimuth : 22.50 },
 *       ...
 *     { abbreviation : 'NbW',   azimuth : 348.75 }
 *  ]
 */
function createCompassPoints() {
	var sides = ['N','E','S','W', 'N'], // last 'N' is to simplify forming
		rosa = [];
		
    for (var i = 0; i < 33; i++) //fill roza by azimuths
    {
    	rosa.push({abbreviation: null, azimuth: i * 11.25});
    }
    
    for (i = 0; i < 33; i++) //fill points of 1/4, 1/8 and 1/16
    {
    	if(!(rosa[i].azimuth % 90))
    	{
    		rosa[i].abbreviation = sides[rosa[i].azimuth / 90];
    	}
    	else if(rosa[i].azimuth % 45 === 0)
    	{
    		rosa[i].abbreviation = sides[Math.floor(rosa[i].azimuth / 90)] + 
    									sides[Math.ceil(rosa[i].azimuth / 90)];
    									
    		if(/[NS]$/.test(rosa[i].abbreviation))
    			rosa[i].abbreviation = 
    						rosa[i].abbreviation.split('').reverse().join('');
    	}
    	else if(!(rosa[i].azimuth % 22.5))
    	{
    		rosa[i].abbreviation = sides[Math.round(rosa[i].azimuth / 90)] +
    								sides[Math.floor(rosa[i].azimuth / 90)] +
    								sides[Math.ceil(rosa[i].azimuth / 90)];
    								
    		if(/[NS]$/.test(rosa[i].abbreviation))
    			rosa[i].abbreviation = rosa[i].abbreviation.charAt(0) +
    				rosa[i].abbreviation.slice(-2).split('').reverse().join('');
    	}
    }
 	
 	for (i = 1; i < 32; i += 2) // fill points on 1/32
 	{
 		rosa[i].abbreviation = rosa[i+1].azimuth % 45 === 0 ?
 										rosa[i+1].abbreviation + 'b' + 
 										sides[Math.floor(rosa[i].azimuth / 90)] : 
 										rosa[i-1].abbreviation + 'b' + 
 										sides[Math.ceil(rosa[i].azimuth / 90)];
 	}
	
	rosa.pop(); // delete last el., that repeats first el. for simplify forming
	
	return rosa;
}


/**
 * Expand the braces of the specified string.
 * See https://en.wikipedia.org/wiki/Bash_(Unix_shell)#Brace_expansion
 *
 * In the input string, balanced pairs of braces containing comma-separated substrings
 * represent alternations that specify multiple alternatives which are to appear at that position in the output.
 *
 * @param {string} str
 * @return {Iterable.<string>}
 *
 * NOTE: The order of output string does not matter.
 *
 * Example:
 *   '~/{Downloads,Pictures}/*.{jpg,gif,png}'  => '~/Downloads/*.jpg',
 *                                                '~/Downloads/*.gif'
 *                                                '~/Downloads/*.png',
 *                                                '~/Pictures/*.jpg',
 *                                                '~/Pictures/*.gif',
 *                                                '~/Pictures/*.png'
 *
 *   'It{{em,alic}iz,erat}e{d,}, please.'  => 'Itemized, please.',
 *                                            'Itemize, please.',
 *                                            'Italicized, please.',
 *                                            'Italicize, please.',
 *                                            'Iterated, please.',
 *                                            'Iterate, please.'
 *
 *   'thumbnail.{png,jp{e,}g}'  => 'thumbnail.png'
 *                                 'thumbnail.jpeg'
 *                                 'thumbnail.jpg'
 *
 *   'nothing to do' => 'nothing to do'
 */
	function* expandBraces(str) {
 	let inBrack = [], outBrack = [], rest = '',
 		count = 0, openBrack, closeBrack, i = 0, j = 0;
	
    if(str.indexOf('{') !== -1)
    {
    	openBrack = str.indexOf('{');
    	count++;
    }
    else
    {
		yield str;
		return;
	}
    
    while (str[i] !== undefined)
    {
    	outBrack.push(str.slice(closeBrack, openBrack));
    		
    	for (i = openBrack + 1; count > 0; ++i)
    	{
    		if(str[i] === '{') count++
    		else if(str[i] === '}') count--;
    	}
    	  
    	closeBrack = i;
    	
    	inBrack.push(splitter(str.slice(openBrack + 1, closeBrack - 1), ','));
    	
    	for (i = closeBrack; str[i] !== undefined; ++i)
    	{
    		if (str[i] === '{')
    		{
    			openBrack = i;   			
    			count++;
    			rest = '';
    			break;
    		}
    		rest += str[i];
    	}
    	if(rest.length > 0)
		{
			outBrack.push(rest);
			rest = '';
		}
    }
    
    outBrack.push(str.slice(closeBrack + 1));

	i = 1;
	
	yield* generateResults(outBrack[0], i, j);
	
    function* generateResults(str, i, j)
	{		
		let argsFromBrack = makeGener(inBrack[j].slice());
		
		for (let el of argsFromBrack)
		{	
			let newS = str + el + outBrack[i];
					
			if(j < inBrack.length -1 )
			{				
				yield *generateResults(newS, i+1, j+1);
			}
			else
			{
				if(newS.indexOf('{') != -1)	
					yield* expandBraces(newS);					
				else
					yield newS;
			}
		}
	}
	
	function* makeGener(arr)
	{		
		for(let el of arr)
		{
			yield el;
		}
	}
	
	
	function splitter(str, separator)
	{	
		if(str.indexOf('{') === -1)
		{
			return str.split(separator);
		}
	
		let i = 0, prev = 0, brackCont = '', rest = '', result = [];
	
		while(str[i] != undefined)
		{
			if(str[i] === '{')
			{
				rest = '';
				result = result.concat(str.slice(prev, i).split(separator));
				
				while(str[i] !== '}')
				{
					brackCont += str[i++];
				}
				
				brackCont += str[i++];
				
				while(str[i] !== separator && str[i] !== undefined)
				{
					brackCont += str[i++];
				}
				result[result.length - 1] += brackCont;
				brackCont = '';
				prev = i++;
			}
			else
			{
				rest += str[i++];			
			}
		}
		
		if(rest.length > 0)
		{
			result.push(rest);
			rest = '';
		}
			
		return result;
	}
}


/**
 * Returns the ZigZag matrix
 *
 * The fundamental idea in the JPEG compression algorithm is to sort coefficient of given image by zigzag path and encode it.
 * In this task you are asked to implement a simple method to create a zigzag square matrix.
 * See details at https://en.wikipedia.org/wiki/JPEG#Entropy_coding
 * and zigzag path here: https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/JPEG_ZigZag.svg/220px-JPEG_ZigZag.svg.png
 *
 * @param {number} n - matrix dimension
 * @return {array}  n x n array of zigzag path
 *
 * @example
 *   1  => [[0]]
 *
 *   2  => [[ 0, 1 ],
 *          [ 2, 3 ]]
 *
 *         [[ 0, 1, 5 ],
 *   3  =>  [ 2, 4, 6 ],
 *          [ 3, 7, 8 ]]
 *
 *         [[ 0, 1, 5, 6 ],
 *   4 =>   [ 2, 4, 7,12 ],
 *          [ 3, 8,11,13 ],
 *          [ 9,10,14,15 ]]
 *
 */
function getZigZagMatrix(n) {
	let zzMatr = new Array(n);
	
	for (let i = 0; i < n; i++)
	{
		zzMatr[i] = new Array(n);
	}
	
	let count = 1, 
		num = n * n, 
		temp = [1, 0],
		reversed = true;
	
	zzMatr[0][0] = 0;
	
	while(count / num < 0.5)
	{
		temp.reverse();
		for (; temp[1] > -1; temp[0]++, temp[1]--)
		{
			if(reversed)
			{
				zzMatr[temp[0]][temp[1]] = count++;
			}
			else
			{
				zzMatr[temp[1]][temp[0]] = count++;
			}
		}
		
		temp[0]--, temp[1]++;
		temp[0]++;
		
		reversed = !reversed;
	}
	
	temp[0]--;
	temp[1]++;
	
	while(count < num)
	{
		temp.reverse();
		for (; temp[0] < n; temp[0]++, temp[1]--)
		{
			if(reversed)
			{
				zzMatr[temp[0]][temp[1]] = count++;
			}
			else
			{
				zzMatr[temp[1]][temp[0]] = count++;
			}
		}
		
		temp[0]--, temp[1]++;
		temp[1]++;
		
		reversed = !reversed;
	}
	
	return zzMatr;
}


/**
 * Returns true if specified subset of dominoes can be placed in a row accroding to the game rules.
 * Dominoes details see at: https://en.wikipedia.org/wiki/Dominoes
 *
 * Each domino tile presented as an array [x,y] of tile value.
 * For example, the subset [1, 1], [2, 2], [1, 2] can be arranged in a row (as [1, 1] followed by [1, 2] followed by [2, 2]),
 * while the subset [1, 1], [0, 3], [1, 4] can not be arranged in one row.
 * NOTE that as in usual dominoes playing any pair [i, j] can also be treated as [j, i].
 *
 * @params {array} dominoes
 * @return {bool}
 *
 * @example
 *
 * [[0,1],  [1,1]] => true
 * [[1,1], [2,2], [1,5], [5,6], [6,3]] => false
 * [[1,3], [2,3], [1,4], [2,4], [1,5], [2,5]]  => true
 * [[0,0], [0,1], [1,1], [0,2], [1,2], [2,2], [0,3], [1,3], [2,3], [3,3]] => false
 *
 */

function canDominoesMakeRow(dominoes) {
    let steak = [
		{
			current : dominoes[0], 
			rest : dominoes.slice(1)
		}
	];
    
    while (steak[0].rest.length !== 0)
    {
    	let tempSteak = [];
    	
    	steak.forEach(val =>
    	{
    		val.rest.forEach((item, i) =>
    		{
    			let rest = val.rest.slice();

    			rest.splice(i, 1)    			
    			
    			if(val.current[0] === item[1])
				{
					tempSteak.push({
						current : [val.current[1], item[0]],
						rest : rest
					});
				}
				if(val.current[1] === item[1])
				{
					tempSteak.push({
						current : [val.current[0], item[0]],
						rest : rest
					});
				}
				if(val.current[0] === item[0])
				{
					tempSteak.push({
						current : [val.current[1], item[1]],
						rest : rest
					});
				}
				if(val.current[1] === item[0])
				{
					tempSteak.push({
						current : [val.current[0], item[1]],
						rest : rest
					});
				}
    		});
    	});
    	
    	if(tempSteak.length === 0)
    	{
    		return false;
    	}
    	
    	steak = tempSteak;
    }
    
    return true;
}
/**
 * Returns the string expression of the specified ordered list of integers.
 *
 * A format for expressing an ordered list of integers is to use a comma separated list of either:
 *   - individual integers
 *   - or a range of integers denoted by the starting integer separated from the end integer in the range by a dash, '-'.
 *     (The range includes all integers in the interval including both endpoints)
 *     The range syntax is to be used only for, and for every range that expands to more than two values.
 *
 * @params {array} nums
 * @return {bool}
 *
 * @example
 *
 * [ 0, 1, 2, 3, 4, 5 ]   => '0-5'
 * [ 1, 4, 5 ]            => '1,4,5'
 * [ 0, 1, 2, 5, 7, 8, 9] => '0-2,5,7-9'
 * [ 1, 2, 4, 5]          => '1,2,4,5'
 */
function extractRanges(nums) {
	let result = [];
	
	for(let i = 0; i < nums.length; i++)
	{
		var start, cur;
		start = cur = nums[i];
		
		if(nums[i+1] == cur + 1 && nums[i+2] == cur + 2)
		{
			while(nums[i+1] == cur + 1)
			{
				cur = nums[++i];
			}
			result.push(start + '-' + cur);
		}
		else
		{
			result.push(cur);
		}
	}

    return result.join(',');
}

module.exports = {
    createCompassPoints : createCompassPoints,
    expandBraces : expandBraces,
    getZigZagMatrix : getZigZagMatrix,
    canDominoesMakeRow : canDominoesMakeRow,
    extractRanges : extractRanges
};
