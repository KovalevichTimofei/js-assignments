'use strict';

/**************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 **************************************************************************************************/


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    var r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */

function Rectangle(width, height) {
    this.width = width;
    this.height = height;
    Rectangle.prototype.getArea = function()
    {
    	return this.width * this.height;
    };
}

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
    return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    var r = fromJSON(Rectangle.prototype, '{"width":10, "height":20}');
 *
 */
function fromJSON(proto, json) {

    let obj = JSON.parse(json);
    let pro = new proto.constructor();//proto.constructor();
    let resObj = Object.create(proto);
    
    for (let key in pro){
    	resObj[key] = pro[key];
    }
    
    for (let key in obj){
    	pro[key] = obj[key];
    }

    return pro;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy and implement the functionality
 * to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple, clear and readable as possible.
 *
 * @example
 *
 *  var builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()  => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()  => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()        =>    'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder =
{
	selector : '',
	ifElemOccur : false,
	ifIdOccur : false,
	ifPseudoElemOccur : false,
	order : [],
	
    element : function(value) {   
    	if (!this.ifElemOccur && this.order.length === 0)
    	{
    		let newObject = this.generObj(this, `${this.selector}${value}`, 
    																'element');
    		newObject.ifElemOccur = true;
    		return newObject;
    	}
        else if (this.ifElemOccur)
        {
        	throw 'Element, id and pseudo-element should not occur more then one time inside the selector';
        }
        else
        {
        	throw 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element';
        }
    },

    id : function(value) {
    
    	let orderFlag = false;
    	
    	if(this.order.length === 0 || (this.order.length === 1 && 
    											this.order[0] === 'element'))
    	{
    		orderFlag = true;
    	}
    	
    	if (!this.ifIdOccur && orderFlag)
    	{
    		let newObject = this.generObj(this, `${this.selector}#${value}`, 
    																	'id');
    		newObject.ifIdOccur = true;
    		return newObject;
		}
		else if (this.ifIdOccur)
        {
        	throw 'Element, id and pseudo-element should not occur more then one time inside the selector';
        }
        else
        {
        	throw 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element';
        }
    },

    class : function(value) {
    
    	let orderFlag = true;
    
    	this.order.forEach(val => {
    		if(val === 'attribute' || val === 'pseudo-class' || 
    												val === 'pseudo-element')
    			orderFlag = orderFlag && false; 		
    	});
    	
    	if(orderFlag)
    	{
    		return this.generObj(this, `${this.selector}.${value}`, 'class');
    	}
    	else
    	{
    		throw 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element';
    	}        
    },

    attr : function(value) {
    	let orderFlag = true;
    
    	this.order.forEach(val => {
    		if(val === 'pseudo-class' || val === 'pseudo-element')
    			orderFlag = orderFlag && false;		
    	});
    	
    	if(orderFlag)
    	{
    		return this.generObj(this, `${this.selector}[${value}]`, 
    															'attribute');
    	}
    	else
    	{
    		throw 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element';
    	}  
    },

    pseudoClass : function(value) {
    	let orderFlag = true;
    
    	this.order.forEach(val => {
    		if(val === 'pseudo-element')
    			orderFlag = orderFlag && false; 		
    	});
    	
    	if(orderFlag)
    	{
    		return this.generObj(this, `${this.selector}:${value}`, 
    															'pseudo-class');
    	}
    	else
    	{
    		throw 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element';
    	}  
    },

    pseudoElement : function(value) {
    	if (!this.ifPseudoElemOccur)
    	{
    		let newObject = this.generObj(this, `${this.selector}::${value}`, 
    														'pseudo-element');
    		newObject.ifPseudoElemOccur = true;
    		return newObject;
		}
		else if (this.ifPseudoElemOccur)
        {
        	throw 'Element, id and pseudo-element should not occur more then one time inside the selector';
        }
        else
        {
        	throw 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element';
        }
    },

    combine : function comb(selector1, combinator, selector2) {
        let res = `${selector1.selector} ${combinator} ${selector2.selector}`;
          
        return this.generObj(this, res); 
    },
    
    stringify : function () {
		let res = this.selector;
		this.selector = '';
		return res;
	},
	
	generObj : function(obj, selector, nextRule)
	{
		let newObj = {};
	
		Object.assign(newObj, obj);
				
		newObj.selector = selector;
		newObj.order = obj.order.slice();
		newObj.order.push(nextRule);
		
		return newObj;
	}
}


module.exports = {
    Rectangle: Rectangle,
    getJSON: getJSON,
    fromJSON: fromJSON,
    cssSelectorBuilder: cssSelectorBuilder
};
