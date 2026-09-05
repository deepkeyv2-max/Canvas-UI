export function Key(name){
	this.idx = null;
	this.name = name;

	this.getX = function(){
		return parseInt(this.name.split(";")[0]);
	}

	this.getY = function(){
		return parseInt(this.name.split(";")[1]);
	}

	this.getName = function(){
		return this.name;
	}

	this.setIndex = function(idx){
		this.idx = idx;
	}

	this.setName = function(name){
		this.name = name
	}
}


export function toKeyName(x, y){
	return `${x};${y}`;
}


export let KeyList = class{
	constructor(){
		this.content = {};
		this.keys = [];
	}

	setAtKey(keyName, item){
		this.content[keyName] = item;
	}

	addKey(keyName){

		for (let key of this.keys){
			if (keyName == key.getName()){
				return;
			}
		}

		let key = new Key(keyName);

		this.content[keyName] = undefined;
		key.setIndex(Object.keys(this.content).indexOf(key.getName()))
		this.keys.push(key);
	}

	deleteKey(keyName){
		delete this.content[keyName];

		for (let key of this.keys){
			if (key.getName() == keyName){
				this.keys.splice(this.keys.indexOf(key), 1);
			}
		}
	}

	getFromKey(keyName){
		return this.content[keyName];
	}

	getKeysAtX(x){
		let keys = [];

		for (let key of this.keys){
			if (x == key.getX()){
				keys.push(key)
			}
		}

		return keys;
	}

	getKeysAtY(y){
		let keys = [];

		for (let key of this.keys){
			if (y == key.getY()){
				keys.push(key)
			}
		}

		return keys;
	}

	size(){
		return Object.keys(this.content).length;
	}
}


export let SortedKeyList = class extends KeyList{
	constructor(){
		super();
		this.customHiearchy = [];
		this.values = [];

		for (let i = 0;i < this.customHiearchy.length;i++){
			this.values.push(i);
		}
	}

	getValue(val){
		if (this.values.indexOf(val) != -1 && this.customHiearchy != []){
			return this.values.indexOf(val);
		}else if(this.values.indexOf(val) != -1){
			console.error("Expected Value Within range of " + this.values.join(",") + " instead got " + val);
		}
	}

	addKey(keyName){
		for (let k of this.keys){
			if (k.getName() == keyName){
				return;
			}
		}

		let key = new Key(keyName);
		let idx = 0;

		let nearYKeys = this.keys.filter((k)=>{
			k.getY() < key.getY()
		});

		idx += nearYKeys.length;

		let nearXKeys = this.keys.filter((k)=>{
			k.getY() == key.getY() && k.getX() < key.getX()
		})

		idx += nearXKeys.length;

		this.keys.splice(idx, 0, key);
	}

	setAtKey(keyName, item){
		this.content[keyName] = item;
		let key = this.keys[this.keys.findIndex(k => k.getName() == keyName)];
		key.setIndex(Object.keys(this.content).indexOf(key.getName()))
	}
}
