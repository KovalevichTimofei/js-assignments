'use strict';

/**
 * Returns the bank account number parsed from specified string.
 *
 * You work for a bank, which has recently purchased an ingenious machine to assist in reading letters and faxes sent in by branch offices.
 * The machine scans the paper documents, and produces a string with a bank account that looks like this:
 *
 *    _  _     _  _  _  _  _
 *  | _| _||_||_ |_   ||_||_|
 *  ||_  _|  | _||_|  ||_| _|
 *
 * Each string contains an account number written using pipes and underscores.
 * Each account number should have 9 digits, all of which should be in the range 0-9.
 *
 * Your task is to write a function that can take bank account string and parse it into actual account numbers.
 *
 * @param {string} bankAccount
 * @return {number}
 *
 * Example of return :
 *
 *   '    _  _     _  _  _  _  _ \n'+
 *   '  | _| _||_||_ |_   ||_||_|\n'+     =>  123456789
 *   '  ||_  _|  | _||_|  ||_| _|\n'
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '| | _| _|| ||_ |_   ||_||_|\n'+     => 23056789
 *   '|_||_  _||_| _||_|  ||_| _|\n',
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '|_| _| _||_||_ |_ |_||_||_|\n'+     => 823856989
 *   '|_||_  _||_| _||_| _||_| _|\n',
 *
 */
function parseBankAccount(bankAccount) {
    let digitCodes = [
    	'-1-3-5678',
    	'-----5--8',
    	'-1--4567-',
    	'-1--45-78',
    	'---345--8',
    	'-1-34--78',
    	'-1-34-678',
    	'-1---5--8',
    	'-1-345678',
    	'-1-345-78'
    ];
    
    let dig = bankAccount.split('\n');
    
    let result = '';
    
    for(let i = 0; i < 9; i++)
    {
    	let tempStr = dig[0].slice(i*3, i*3 + 3) + dig[1].slice(i*3, i*3 + 3) + 
    												dig[2].slice(i*3, i*3 + 3);
    	let digCode = tempStr.split('').map((val, i) => val != ' ' ? i : '-').join('');
    	result += digitCodes.indexOf(digCode);
    }
    
    return +result;   
}


/**
 * Returns the string, but with line breaks inserted at just the right places to make sure that no line is longer than the specified column number.
 * Lines can be broken at word boundaries only.
 *
 * @param {string} text
 * @param {number} columns
 * @return {Iterable.<string>}
 *
 * @example :
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 26 =>  'The String global object',
 *                                                                                                'is a constructor for',
 *                                                                                                'strings, or a sequence of',
 *                                                                                                'characters.'
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 12 =>  'The String',
 *                                                                                                'global',
 *                                                                                                'object is a',
 *                                                                                                'constructor',
 *                                                                                                'for strings,',
 *                                                                                                'or a',
 *                                                                                                'sequence of',
 *                                                                                                'characters.'
 */
function* wrapText(text, columns) {
    let sequence = text.split(' ');
    let next = [];
    let i = 0;
    
    while (i < sequence.length)
    {
    	if(next.join(' ').length + sequence[i].length < columns)
    	{
    		next.push(sequence[i]);
    		i++;
    	}
    	else
    	{
    		yield next.join(' ');
    		next = [];
    	}    	
    }
    
    yield next.join(' ');
}


/**
 * Returns the rank of the specified poker hand.
 * See the ranking rules here: https://en.wikipedia.org/wiki/List_of_poker_hands.
 *
 * @param {array} hand
 * @return {PokerRank} rank
 *
 * @example
 *   [ '4♥','5♥','6♥','7♥','8♥' ] => PokerRank.StraightFlush
 *   [ 'A♠','4♠','3♠','5♠','2♠' ] => PokerRank.StraightFlush
 *   [ '4♣','4♦','4♥','4♠','10♥' ] => PokerRank.FourOfKind
 *   [ '4♣','4♦','5♦','5♠','5♥' ] => PokerRank.FullHouse
 *   [ '4♣','5♣','6♣','7♣','Q♣' ] => PokerRank.Flush
 *   [ '2♠','3♥','4♥','5♥','6♥' ] => PokerRank.Straight
 *   [ '2♥','4♦','5♥','A♦','3♠' ] => PokerRank.Straight
 *   [ '2♥','2♠','2♦','7♥','A♥' ] => PokerRank.ThreeOfKind
 *   [ '2♥','4♦','4♥','A♦','A♠' ] => PokerRank.TwoPairs
 *   [ '3♥','4♥','10♥','3♦','A♠' ] => PokerRank.OnePair
 *   [ 'A♥','K♥','Q♥','2♦','3♠' ] =>  PokerRank.HighCard
 */
const PokerRank = {
    StraightFlush: 8,
    FourOfKind: 7,
    FullHouse: 6,
    Flush: 5,
    Straight: 4,
    ThreeOfKind: 3,
    TwoPairs: 2,
    OnePair: 1,
    HighCard: 0
}

function getPokerHandRank(hand) {
    let suits = {}, ranks = {};
    
    hand.forEach( val => {
    	suits[val.slice(-1)] = suits[val.slice(-1)] != undefined ? 
    												suits[val.slice(-1)]+1 : 1;
    	ranks[val.slice(0, -1)] = ranks[val.slice(0, -1)] != undefined ? 
    											ranks[val.slice(0, -1)]+1 : 1;   	
    });
    
    let threeRankFlag = 0, 
    	fourRankFlag = 0, 
    	twoRankFlag = 0, 
    	oneRankFlag = 0;
    
    for (let key in ranks)
    {
    		if(ranks[key] == 2)
    			twoRankFlag++;
    		else if(ranks[key] == 1)
    			oneRankFlag++;
    		else if(ranks[key] == 4)
    		{
    			fourRankFlag++;
    			break;
    		}
    		else if(ranks[key] == 3) 
    		{
    			threeRankFlag++;
    		}
    }
    
    
    if(isFlush())
    {
    	if(isInOrder())
    		return PokerRank.StraightFlush;
    	else
    		return PokerRank.Flush;
    }
    else if(!isFlush() && isInOrder())
    	return PokerRank.Straight;
    else if(fourRankFlag)
    	return PokerRank.FourOfKind;
    else if(threeRankFlag)
    {
    	if(twoRankFlag)
    		return PokerRank.FullHouse;
    	else
    		return PokerRank.ThreeOfKind;
    }    	   
    else if(oneRankFlag == 3 && twoRankFlag)
    	return PokerRank.OnePair;
    else if(twoRankFlag == 2)
    	return PokerRank.TwoPairs;
    else
    	return PokerRank.HighCard;   	
    	
    	
    function isFlush()
    {
		for(let key in suits)
		{
			if(suits[key] == 5)
			{
				return true;
			}
		}
		return false;
    }
    
    
    function isInOrder()
    {
    	let ranksArr = [];
    
		for(let key in ranks)
		{
			switch(key)
			{
				case 'A':
				{
					ranksArr.push(1);
					ranksArr.push(14);
					break;
				}
				case 'J':
				{
					ranksArr.push(11);
					break;
				}
				case 'Q':
				{
					ranksArr.push(12);
					break;
				}
				case 'K':
				{
					ranksArr.push(13);
					break;
				}
				default:
				{
					ranksArr.push(key);
				}
			}
			
		}
		
		ranksArr.sort((a, b) => +a - +b);
		
		let flag = true;
		
		for (let i = 1; i < 4; i++)
		{
			if (ranksArr[i] != ranksArr[i+1] - 1 )
				{
					flag = false;
					break;
				}
		}
		
		let flagTop = false, flagBottom = false;

		if (ranksArr[0] == ranksArr[1] - 1 )	flagTop = true;
		if (ranksArr[4] == ranksArr[5] - 1 )	flagBottom = true;
		
		return (flagTop || flagBottom) && flag;
		
		return true;
    }
}


/**
 * Returns the rectangles sequence of specified figure.
 * The figure is ASCII multiline string comprised of minus signs -, plus signs +, vertical bars | and whitespaces.
 * The task is to break the figure in the rectangles it is made of.
 *
 * NOTE: The order of rectanles does not matter.
 * 
 * @param {string} figure
 * @return {Iterable.<string>} decomposition to basic parts
 * 
 * @example
 *
 *    '+------------+\n'+
 *    '|            |\n'+
 *    '|            |\n'+              '+------------+\n'+
 *    '|            |\n'+              '|            |\n'+         '+------+\n'+          '+-----+\n'+
 *    '+------+-----+\n'+       =>     '|            |\n'+     ,   '|      |\n'+     ,    '|     |\n'+
 *    '|      |     |\n'+              '|            |\n'+         '|      |\n'+          '|     |\n'+
 *    '|      |     |\n'               '+------------+\n'          '+------+\n'           '+-----+\n'
 *    '+------+-----+\n'
 *
 *
 *
 *    '   +-----+     \n'+
 *    '   |     |     \n'+                                    '+-------------+\n'+
 *    '+--+-----+----+\n'+              '+-----+\n'+          '|             |\n'+
 *    '|             |\n'+      =>      '|     |\n'+     ,    '|             |\n'+
 *    '|             |\n'+              '+-----+\n'           '+-------------+\n'
 *    '+-------------+\n'
 */
function* getFigureRectangles(figure) {
	let figArr = figure.split('\n');
	if (figArr[figArr.length - 1] === '') figArr.pop();
	
	let r = /\+/g;
	
	for (let i = 0; i < figArr.length; i++)
	{
		let str = figArr[i],
			cur1 = r.exec(str), cur2,
			result = '';
			
		while(cur1)
		{
			if(figArr[i+1] && figArr[i][cur1.index + 1] !== ' ' && 
												figArr[i+1][cur1.index] !== ' ')
			{
				let height = 1;
				cur2 = r.exec(str);

				if (cur2 && figArr[i+height])
				{					
					while(cur2 && figArr[i+1][cur2.index] === ' ')
					{
						cur2 = r.exec(str);
					}
					
					if(!cur2)
					{
						break;
					}
					result += figArr[i].slice(cur1.index, cur2.index + 1) + '\n';
				
					
					do{
						result += figArr[i+height].slice(cur1.index, cur2.index + 1) + '\n';
						height++;
					}while(!(/\+/.test(figArr[i+height-1][cur1.index]) && 
									/\+/.test(figArr[i+height-1][cur2.index])));
					
					result = result.split('\n');
					result[0] = `+${(new Array(result[0].length-1)).join('-')}+`;
					result[result.length - 2] = `+${(new Array(result[0].length-1)).join('-')}+`;
					result = result.join('\n');
					yield result;
				
					cur1 = cur2;
					result = '';
				}
				else
				{					
					break;
				}
			}
			else
			{
				cur1 = r.exec(str);
			}
		}
	}
}

module.exports = {
    parseBankAccount : parseBankAccount,
    wrapText: wrapText,
    PokerRank: PokerRank,
    getPokerHandRank: getPokerHandRank,
    getFigureRectangles: getFigureRectangles
};
