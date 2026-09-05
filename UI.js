import { KeyList, toKeyName, Key } from './KeyList.js'

export const Colors = {
	Transparent : 'rgba(0, 0, 0, 0)',
	Black : '#000',
	Grey : '#555',
	White : '#fff',
	Red : '#f00',
	Green : '#0f0',
	Blue : '#00f',
	Purple : '#f0f',
	Yellow : '#ff0',
	Cyan : '#0ff'
}

export function createTheme(fg, bg, border='#000', font={size : 10, family: 'sans-serif'}){
	return {
		bg : bg,
		fg : fg,
		border: border,
		font : font
	}
}

export function createFont(size, family){
	return {
		size : size,
		family: family
	}
}

export function rgb(r, g, b){
	return `rgb(${r}, ${g}, ${b})`;
}

export function rgba(r, g, b, a){
	return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export function createOption(name, value){
	return {
		name : name,
		value : value
	}
}

export const UIElement = class{
	constructor(ctx){
		this.x = 0;
		this.y = 0;
		this.text = "";
		this.width = NaN;
		this.height = NaN;
		this.theme = null;
		this.visibility = true;
		this.padding = {
			left : 0,
			right : 0,
			top : 0,
			bottom : 0
		};
		this.ctx = ctx;

		//EVENT PROPS
		this.mouseEvents = {
			mouseDown : function(ev){},
			mouseUp : function(ev){},
			mouseMove : function(ev){},
			mouseEnter : function(ev){},
			mouseLeave : function(ev){},
			mouseOver : function(ev){},
			mouseOut : function(ev){}
		}

		this.keyEvents = {
			keyUp : function(){},
			keyDown : function(){}
		}


		//MORE STYLE PROPERTIES
		this.background = 'rgba(0, 0, 0, 0)'
		this.foreground = '#000';
		this.fontColor = '#000';
		this.border = '#000';
		this.fontSize = '10px';
		this.fontFamily = 'sans-serif';

		//DEFAULT ACTIONS
		this.set();
	}

	draw(){

		if (!this.visibility) return;

		this.ctx.strokeStyle = this.border;
		this.ctx.fillStyle = this.background;
		this.ctx.font = `${this.fontSize} ${this.fontFamily}`;

		this.ctx.strokeRect(this.x, this.y, this.width + this.padding.left + this.padding.right, this.height + this.padding.bottom + this.padding.top);
		this.ctx.fillRect(this.x, this.y, this.width + this.padding.left + this.padding.right, this.height + this.padding.bottom + this.padding.top);

		this.ctx.fillStyle = this.foreground
		this.ctx.textAlign = 'center';
		this.ctx.fillText(this.text, this.x + this.width / 4, this.y + this.height / 2);
	}

	resizeTo(width, height){
		this.width = width;
		this.height = height;
	}

	moveTo(x, y){
		this.x = x;
		this.y = y;
	}

	moveX(x){
		this.x = x;
	}

	moveY(y){
		this.y = y;
	}

	setColorStyle(background, foreground = '#000', border = '#000', fontClr = '#000'){
		this.background = background;
		this.foreground = foreground;
		this.border = border;
		this.fontColor = fontClr;
	}

	setFont(size, family = 'sans-serif'){
		this.fontSize = size;
		this.fontFamily = family;
	}

	setPaddingStyle(a1, a2, a3, a4){
		let left;
		let right;
		let top;
		let bottom;

		if (a2 == undefined && a3 == undefined && a4 == undefined){
			left = a1;
			top = a1;
			right = a1;
			bottom = a1;
		}else if (a3 == undefined && a4 == undefined){
			left = a1;
			top = a2;
			right = a1;
			bottom = a2;
		}else{
			left = a1;
			top = a2;
			right = a3;
			bottom = a4;
		}


		this.padding.left = left;
		this.padding.top = top;
		this.padding.right = right;
		this.padding.bottom = bottom;
	}

	withinBounds(mx, my){
		return mx > this.x && my > this.y && mx < this.x + this.width && my < this.y + this.height;
	}

	onMouseEvent(event, func){
		this.mouseEvents[event] = func;
		this.set();
	}

	onKeyEvent(event, func){
		this.keyEvents[event] = func;
		this.set();
	}

	set(){
		window.addEventListener('mousedown', this.mouseEvents.mouseDown);
		window.addEventListener('mousemove', this.mouseEvents.mouseMove);
		window.addEventListener('mouseenter', this.mouseEvents.mouseEnter);
		window.addEventListener('mouseout', this.mouseEvents.mouseOut);
		window.addEventListener('mouseup', this.mouseEvents.mouseUp);
		window.addEventListener('mouseleave', this.mouseEvents.mouseLeave);
		window.addEventListener('mouseover', this.mouseEvents.mouseOver);

		window.addEventListener('keyup', this.keyEvents.keyUp);
		window.addEventListener('keydown', this.keyEvents.keyDown);
	}

	setTheme(theme){
		this.setColorStyle(theme.bg, theme.fg, theme.border);
		this.setFont(theme.font.size, theme.font.family);
		this.theme = theme;
	}
}


export class Button extends UIElement{
	constructor(ctx){
		super(ctx);
		this.resizeTo(150, 50);
		this.moveTo(5, 5);
		this.init();
	}

	init(){
		this.onMouseEvent('mouseMove', (ev)=>{
			if (this.withinBounds(ev.clientX, ev.clientY)){
				this.setColorStyle(Colors.Grey);
			}else{
				this.setTheme(this.theme);
			}
		})
	}
}

export const Label = class extends UIElement{
	constructor(ctx){
		super(ctx);
		this.resizeTo(150, 50);
		this.moveTo(5, 5);
	}
}

export const NavigationBar = class extends UIElement{
	constructor(ctx){
		super();
		this.options = [];
		this.optionsList = {};
		this.optionID = null;
		this.optionTable = {}
	}

	addOption(option){
		this.optionsList[option.name] = option;

		let optBtn = new Button(this.ctx);

		optBtn.onMouseEvent('mouseDown', (ev)=>{
			if (optBtn.withinBounds(ev.clientX, ev.clientY)){
				this.optionID = optBtn.value;
			}
		})

		this.options.push(optBtn);
	}

	onOptionChosen(optionVal, func){
		this.optionTable[optionVal] = func;
	}

	refresh(){
		let allOptions = Object.keys(this.optionTable)
	}

	draw(){
		if (!this.visibility) return;

		let i = 0;
		for (let option of this.options){
			option.resizeTo(this.height, this.width / this.options.length);
			option.moveTo(this.x + (i * (this.width / this.options.length)), this.y);
			option.draw();
			i++;
		}
	}
}

export const UIPanel = class {
	constructor(){
		this.elements = {};
		this.visibility = true;
		this.x = 0;
		this.y = 0;
	}

	addElement(id, elem){
		this.elements[id] = elem;
	}

	removeElement(id){
		delete this.elements[id];
	}

	getElementFromID(id){
		return this.elements[id];
	}

	draw(){
		if (!this.visibility) return;
		ctx.save();
		ctx.translate(this.x, this.y);
		for (let elem in this.elements){
			this.elements[elem].draw();
		}
		ctx.restore();
	}

	moveTo(x, y){
		this.x = x;
		this.y = y;
	}
}

export const TopDownLayout =  class extends UIPanel{
	constructor(){
		super();
	}

	draw(){
		let y = 0;

		for (let elem in this.elements){
			this.elements[elem].moveY(y);
			this.elements[elem].draw();
			y += this.elements[elem].height;
		}
	}
}

export const GridLayout = class extends UIPanel{
	constructor(rows, columns, width, height){
		super();
		this.rows = rows;
		this.columns = columns;
		this.indiv_width = width / columns;
		this.indiv_height = height / rows;
		this.width = width;
		this.height = height;
	}

	draw(){
		let i = 0;
		for (let elem in this.elements){
			let x = i % this.rows;
			let y = (i - x) / this.columns;

			this.elements[elem].resizeTo(this.indiv_width, this.indiv_height);
			this.elements[elem].moveTo(x * this.indiv_width, y * this.indiv_height);
			this.elements[elem].draw();
			i++;
		}
	}
}

class NavigationPanel extends UIPanel{
	constructor(){
		super();
	}
}
