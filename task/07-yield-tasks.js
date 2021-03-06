'use strict';

/********************************************************************************************
 *                                                                                          *
 * Plese read the following tutorial before implementing tasks:                             *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/yield        *
 *                                                                                          *
 ********************************************************************************************/


/**
 * Returns the lines sequence of "99 Bottles of Beer" song:
 *
 *  '99 bottles of beer on the wall, 99 bottles of beer.'
 *  'Take one down and pass it around, 98 bottles of beer on the wall.'
 *  '98 bottles of beer on the wall, 98 bottles of beer.'
 *  'Take one down and pass it around, 97 bottles of beer on the wall.'
 *  ...
 *  '1 bottle of beer on the wall, 1 bottle of beer.'
 *  'Take one down and pass it around, no more bottles of beer on the wall.'
 *  'No more bottles of beer on the wall, no more bottles of beer.'
 *  'Go to the store and buy some more, 99 bottles of beer on the wall.'
 *
 * See the full text at
 * http://99-bottles-of-beer.net/lyrics.html
 *
 * NOTE: Please try to complete this task faster then original song finished:
 * https://www.youtube.com/watch?v=Z7bmyjxJuVY   :)
 *
 *
 * @return {Iterable.<string>}
 *
 */
function* get99BottlesOfBeer() {
	let i = 99;
	
	do
	{
		yield `${i} bottles of beer on the wall, ${i} bottles of beer.`;
		
		i--;
		if (i > 1)
 			yield `Take one down and pass it around, ${i} bottles of beer on the wall.`;
 		else 
 			yield `Take one down and pass it around, ${i} bottle of beer on the wall.`;
	}while(i > 1);
	
	yield '1 bottle of beer on the wall, 1 bottle of beer.';
	yield 'Take one down and pass it around, no more bottles of beer on the wall.';
	yield 'No more bottles of beer on the wall, no more bottles of beer.';
	yield 'Go to the store and buy some more, 99 bottles of beer on the wall.';
}


/**
 * Returns the Fibonacci sequence:
 *   0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, ...
 *
 * See more at: https://en.wikipedia.org/wiki/Fibonacci_number
 *
 * @return {Iterable.<number>}
 *
 */
function* getFibonacciSequence() {
	let fib1 = 1, fib2 = 0; 
	while(true)
	{
		let curFib = fib2;
		fib2 = fib1;
		fib1 += curFib;
		yield curFib;
	}
}


/**
 * Traverses a tree using the depth-first strategy
 * See details: https://en.wikipedia.org/wiki/Depth-first_search
 *
 * Each node have child nodes in node.children array.
 * The leaf nodes do not have 'children' property.
 *
 * @params {object} root the tree root
 * @return {Iterable.<object>} the sequence of all tree nodes in depth-first order
 * @example
 *
 *   var node1 = { n:1 }, node2 = { n:2 }, node3 = { n:3 }, node4 = { n:4 },
 *       node5 = { n:5 }, node6 = { n:6 }, node7 = { n:7 }, node8 = { n:8 };
 *   node1.children = [ node2, node6, node7 ];
 *   node2.children = [ node3, node4 ];
 *   node4.children = [ node5 ];
 *   node7.children = [ node8 ];
 *
 *     source tree (root = 1):
 *            1
 *          / | \
 *         2  6  7
 *        / \     \            =>    { 1, 2, 3, 4, 5, 6, 7, 8 }
 *       3   4     8
 *           |
 *           5
 *
 *  depthTraversalTree(node1) => node1, node2, node3, node4, node5, node6, node7, node8
 *
 */
 
 /*
 	I tried more simple solution using recursion,
 	but it cause "Maximum call stack size exceeded" on deep 4400+.
 	This is this solution:
 	
 	function* depthTraversalTree(root) {
    yield root;
    
    if(root.children && root.children.length > 0)
    {
    	for (let i = 0; i < root.children.length; i++)
    	{
    		yield* depthTraversalTree(root.children[i]);
    	}
    }
}
 */

function* depthTraversalTree(root) {
    yield root; 
    let arr = [{object:root, curChild:0}];
    
  	while(arr.length > 0){
   		while(arr[arr.length - 1].object.children && 
   			arr[arr.length - 1].object.children.length > arr[arr.length - 1].curChild)
    	{
    		let temp = {
    			object : arr[arr.length - 1].object.children[arr[arr.length - 1].curChild],
    			curChild: 0
    		}
    		
    		arr.push(temp);	
    		
			yield arr[arr.length - 1].object;   		
    	}
    		
    	arr.pop();
    	
    	if (arr.length > 0)
    		arr[arr.length - 1].curChild++;
    	else
    		return;
    }
}

/**
 * Traverses a tree using the breadth-first strategy
 * See details: https://en.wikipedia.org/wiki/Breadth-first_search
 *
 * Each node have child nodes in node.children array.
 * The leaf nodes do not have 'children' property.
 *
 * @params {object} root the tree root
 * @return {Iterable.<object>} the sequence of all tree nodes in breadth-first order
 * @example
 *     source tree (root = 1):
 *
 *            1
 *          / | \
 *         2  3  4
 *        / \     \            =>    { 1, 2, 3, 4, 5, 6, 7, 8 }
 *       5   6     7
 *           |
 *           8
 *
 */
function* breadthTraversalTree(root) {
    let arr = new Map([[root, null]]);
    
  	while(arr.size > 0){
  	
  		let tempMap = new Map();
  		
  		for (let key of arr.keys())
  		{
  			yield key;
  			
  			if(key.children){
  				key.children.forEach(val => 
  				{
  					tempMap.set(val, null);
  				});			
  			}
  		}
  		
  		arr = tempMap;
    }
}


/**
 * Merges two yield-style sorted sequences into the one sorted sequence.
 * The result sequence consists of sorted items from source iterators.
 *
 * @params {Iterable.<number>} source1
 * @params {Iterable.<number>} source2
 * @return {Iterable.<number>} the merged sorted sequence
 *
 * @example
 *   [ 1, 3, 5, ... ], [2, 4, 6, ... ]  => [ 1, 2, 3, 4, 5, 6, ... ]
 *   [ 0 ], [ 2, 4, 6, ... ]  => [ 0, 2, 4, 6, ... ]
 *   [ 1, 3, 5, ... ], [ -1 ] => [ -1, 1, 3, 5, ...]
 */
function* mergeSortedSequences(source1, source2) {

	let gener1 = source1(),
		gener2 = source2(),
		n1 = gener1.next(),
		n2 = gener2.next();
	while(true){
		if(n1.value < n2.value)
		{
			yield n1.value;
			n1 = gener1.next();
		}
		else if (n1.value > n2.value)
		{
			yield n2.value;
			n2 = gener2.next();
		}
		else
		{
			if(n1.value)
			{
				yield n1.value;
				n1 = gener1.next();
			}
			else
			{
				yield n2.value;
				n2 = gener2.next();
			}
		}
	}
}


module.exports = {
    get99BottlesOfBeer: get99BottlesOfBeer,
    getFibonacciSequence: getFibonacciSequence,
    depthTraversalTree: depthTraversalTree,
    breadthTraversalTree: breadthTraversalTree,
    mergeSortedSequences: mergeSortedSequences
};
