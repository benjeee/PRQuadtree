var GRAPH_WIDTH;
var GRAPH_HEIGHT;

class Node {
	constructor(parent, level, centerLoc) {
		this.parent 	= parent;
		this.level 		= level;
		this.centerLoc 	= centerLoc;
	}
/*
	0 1
	2 3
*/
	insert(value) {
		if (this.isParent) {
			if (value.y < this.centerLoc.y) {
				if (value.x < this.centerLoc.x) {
					this.children[0].insert(value);
				} else {
					this.children[1].insert(value);
				}
			} else {
				if (value.x < this.centerLoc.x) {
					this.children[2].insert(value);
				} else {
					this.children[3].insert(value);
				}
			}
		} else {
			if (!this.isLeaf) {
				this.isLeaf = true;
				this.value = value;
			} else {
				if(this.value.y == value.y && this.value.x == value.x){
					return;
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
				this.insert(value)
				this.value=null;
			}
		}
	}


	remove(value) {
		if (this.isParent) {
			if (value.y < this.centerLoc.y) {
				if (value.x < this.centerLoc.x) {
					this.children[0].remove(value);
				} else {
					this.children[1].remove(value);
				}
			} else {
				if (value.x < this.centerLoc.x) {
					this.children[2].remove(value);
				} else {
					this.children[3].remove(value);
				}
			}
		} else {
			if (this.isLeaf) {
				this.isLeaf = false;
				this.value = null;
				if(this.parent){
					this.parent.cascadeUp();
				}
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

	render(width, height, context){
		if(this.isParent){
			
			context.beginPath();
			context.moveTo(~~(this.centerLoc.x)+0.5, ~~(this.centerLoc.y-height/2)+0.5);
			context.lineTo(~~(this.centerLoc.x)+0.5, ~~(this.centerLoc.y+height/2)+0.5);
			context.stroke();
			
			context.beginPath();
			context.moveTo(~~(this.centerLoc.x - width/2)+0.5, ~~(this.centerLoc.y)+0.5);
			context.lineTo(~~(this.centerLoc.x + width/2)+0.5, ~~(this.centerLoc.y)+0.5);
			context.stroke();

			this.children[0].render(width/2, height/2, context);
			this.children[1].render(width/2, height/2, context);
			this.children[2].render(width/2, height/2, context);
			this.children[3].render(width/2, height/2, context);
			
		} else {
			if(this.isLeaf){
				context.fillRect(~~(this.value.x)-1, ~~(this.value.y)-1, 2, 2);
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
		this.root 	= new Node(null, 0, 
			{
				x:width/2,
				y:width/2
			}
		);
	}

	insert(value) {
		this.root.insert(value);
	}

	find(value) {
		return this.root.find(value);
	}

	remove(value) {
		this.root.remove(value);
	}

	render(canvas, context) {
		context.strokeStyle = "#FF2200";
		context.fillStyle = "#000000";
		context.clearRect(0, 0, canvas.width, canvas.height);
		this.root.render(canvas.width, canvas.width, context);
	}
}



const canvas = document.getElementById('prqt');
const context = canvas.getContext('2d');

context.fillStyle = '#000';
context.strokeStyle = "#666666";
var container = document.getElementById("canvasContainer");
context.fillRect(0,0,canvas.width,canvas.height);

var pq = new PRQuadtree(canvas.width, canvas.height);

pq.render(canvas, context);

canvas.onclick = function(e){
	pq.insert({
		 x: e.clientX - container.offsetLeft
		,y: e.clientY - container.offsetTop
	});
	pq.render(canvas, context);
	e.preventDefault();
	return false;
};

canvas.oncontextmenu = function(e) {
	pq.remove({
		 x: e.clientX - container.offsetLeft
		,y: e.clientY - container.offsetTop
	});
	pq.render(canvas, context);
	e.preventDefault();
	return false; 
}

