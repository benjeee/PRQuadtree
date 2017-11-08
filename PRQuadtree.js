var GRAPH_WIDTH;
var GRAPH_HEIGHT;

class Node {
	constructor(parent, level, centerLoc) {
		this.parent 	= parent;
		this.level 		= level;
		this.centerLoc 	= centerLoc;
	}

	insert(value) {
		if (this.isParent) {
			if (value.y < this.centerLoc.y) {
				if (value.x < this.centerLoc.x) {
					return this.children[0].insert(value);
				} else {
					return this.children[1].insert(value);
				}
			} else {
				if (value.x < this.centerLoc.x) {
					return this.children[2].insert(value);
				} else {
					return this.children[3].insert(value);
				}
			}
		} else {
			if (!this.isLeaf) {
				this.isLeaf = true;
				this.value = value;
				return true;
			} else {
				if(this.value.y == value.y && this.value.x == value.x){
					return false;
				}
				this.isLeaf = false;
				this.isParent = true;
				this.children = 
				[
					new Node(this, this.level+1, 
							{
								x:(this.centerLoc.x - GRAPH_WIDTH/(Math.pow(2, this.level + 2))), 
								y:(this.centerLoc.y - GRAPH_HEIGHT/(Math.pow(2, this.level + 2)))
							}
					),
					new Node(this, this.level+1, 
							{
								x:(this.centerLoc.x + GRAPH_WIDTH/(Math.pow(2, this.level + 2))), 
								y:(this.centerLoc.y - GRAPH_HEIGHT/(Math.pow(2, this.level + 2)))
							}
					),
					new Node(this, this.level+1, 
							{
								x:(this.centerLoc.x - GRAPH_WIDTH/(Math.pow(2, this.level + 2))), 
								y:(this.centerLoc.y + GRAPH_HEIGHT/(Math.pow(2, this.level + 2)))
							}
					),
					new Node(this, this.level+1, 
							{
								x:(this.centerLoc.x + GRAPH_WIDTH/(Math.pow(2, this.level + 2))), 
								y:(this.centerLoc.y + GRAPH_HEIGHT/(Math.pow(2, this.level + 2)))
							}
					)
				];
				this.insert(this.value)
				this.value=null;
				return this.insert(value)
			}
		}
	}


	remove(value) {
		if (this.isParent) {
			if (value.y < this.centerLoc.y) {
				if (value.x < this.centerLoc.x) {
					return this.children[0].remove(value);
				} else {
					return this.children[1].remove(value);
				}
			} else {
				if (value.x < this.centerLoc.x) {
					return this.children[2].remove(value);
				} else {
					return this.children[3].remove(value);
				}
			}
		} else {
			if (this.isLeaf) {
				this.isLeaf = false;
				this.value = null;
				if(this.parent){
					this.parent.cascadeUp();
				}
				return true;
			} else {
				return false;
			}
			
		}
	}

	cascadeUp() {
		let numChildren = 0;
		let newVal = null;
		this.children.forEach(function (child) {
			if (child.isParent) {
				numChildren=999;
			}
			if (child.isLeaf) {
				newVal = child.value;
				numChildren++;
			}
		});

		if (numChildren > 1) {
			return;
		} else if (numChildren == 1){
			this.isParent = false;
			this.isLeaf = true;
			this.value = newVal;
			this.children = null;
			if(this.parent){
				this.parent.cascadeUp();
			}
		} else {
			this.isParent = false;
			this.isLeaf = false;
			this.value = null;
			this.children = null;
			if(this.parent){
				this.parent.cascadeUp();
			}
		}
	}

	draw(width, height, context){
		if(this.isParent){
			context.beginPath();
			context.moveTo(Math.floor(this.centerLoc.x)+0.5, Math.floor(this.centerLoc.y-height/2)+0.5);
			context.lineTo(Math.floor(this.centerLoc.x)+0.5, Math.floor(this.centerLoc.y+height/2)+0.5);
			context.stroke();
			
			context.beginPath();
			context.moveTo(Math.floor(this.centerLoc.x - width/2)+0.5, Math.floor(this.centerLoc.y)+0.5);
			context.lineTo(Math.floor(this.centerLoc.x + width/2)+0.5, Math.floor(this.centerLoc.y)+0.5);
			context.stroke();

			this.children.forEach(function (child) {
				child.draw(width/2, height/2, context)
			});
		} else {
			if(this.isLeaf){
				context.fillRect(Math.floor(this.value.x)-1, Math.floor(this.value.y)-1, 2, 2);
			}
		}
	}


	find(value) {
		if (this.isParent) {
			if (value.y < this.centerLoc.y) {
				if (value.x < this.centerLoc.x) {
					return this.children[0].find(value);
				} else {
					return this.children[1].find(value);
				}
			} else {
				if (value.x < this.centerLoc.x) {
					return this.children[2].find(value);
				} else {
					return this.children[3].find(value);
				}
			}
		} else {
			if (!this.isLeaf) {
				return null;
			} else {
				
				if(value.x == this.value.x && value.y == this.value.y) {
					return this;
				}

				else {
					return null;
				} 
			}
		}
	}
}

class PRQuadtree {
	constructor(width, height) {
		GRAPH_HEIGHT = height;
		GRAPH_WIDTH = width;
		this.count = 0;
		this.root 	= new Node(null, 0, 
			{
				x:width/2,
				y:width/2
			}
		);
	}

	insert(value) {
		if(this.root.insert(value)){
			this.count++;
		}
	}

	find(value) {
		return this.root.find(value);
	}

	remove(value) {
		if(this.root.remove(value)){
			this.count--;
		}
	}

	draw(canvas, context) {
		context.strokeStyle = "#FF2200";
		context.fillStyle = "#000000";
		context.clearRect(0, 0, canvas.width, canvas.height);
		this.root.draw(canvas.width, canvas.width, context);
	}
}



/*****************************************************
**********************DRIVER CODE*********************
******************************************************/
function updateCount(){
	count.innerHTML = "Count: " + pq.count;
}

const canvas = document.getElementById('prqt');
const context = canvas.getContext('2d');

context.fillStyle = '#000';
context.strokeStyle = "#666666";
var canvasDiv = document.getElementById("canvas");
context.fillRect(0,0,canvas.width,canvas.height);

var pq = new PRQuadtree(canvas.width, canvas.height);

pq.draw(canvas, context);

var count = document.getElementById("count");
var clear = document.getElementById("clear");

canvas.onclick = function(e){
	pq.insert({
		 x: e.clientX - canvasDiv.offsetLeft
		,y: e.clientY - canvasDiv.offsetTop
	});
	updateCount();
	pq.draw(canvas, context);
	e.preventDefault();
	return false;
};

canvas.oncontextmenu = function(e) {
	pq.remove({
		 x: e.clientX - canvasDiv.offsetLeft
		,y: e.clientY - canvasDiv.offsetTop
	});
	updateCount();
	pq.draw(canvas, context);
	e.preventDefault();
	return false; 
}

clear.onclick = function(){
	pq = new PRQuadtree(canvas.width, canvas.height);
	pq.draw(canvas, context);
	updateCount();
}

