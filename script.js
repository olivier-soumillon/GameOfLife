



function GameOfLife(w, h)
{
	this.gridWidth = w;
	
	this.gridHeight = h;
	
	this.grid = [];
	
	this.neighbors = [];
};

// Cette méthode est appelée une fois au début, elle génère les cellules qui seront contenues dans la grid.
// Ces cellules reçoivent un état aléatoire entre 0 = morte et = 1 vivante.
// Les index des 8 cellules voisines de chaque cellules sont précalculés ici.
GameOfLife.prototype.init = function() {
	
	this.grid = [];
	
	this.neighbors = [];
	
	var numberOfCells = this.gridWidth * this.gridHeight;
	
	for(var i = 0; i < numberOfCells; i++)
	{
		// Calcule des positions X et Y dans un tableau à 2D à partir l'index
		// (J'utilise un vecteur pour stocker les cellules, un tableau 2D serait peut-être plus optimisé ?)
		
		var x = i % this.gridWidth;
		var y = ~~(i / this.gridWidth); // Le ~~ équivaut à faire Math.floor()
	
		// Petit schéma illustrant les 8 "cellules voisines" de X dont on doit calculer les index
		
		// 1, 2, 3
		// 4, X, 5
		// 6, 7, 8
	
		// Calcule des 8 index des cellules voisines
		
		var leftX= this.wedge(x - 1, 0, this.gridWidth);
		var rightX = this.wedge(x + 1, 0, this.gridWidth);
		var upY = this.wedge(y - 1, 0, this.gridHeight);
		var downY = this.wedge(y + 1, 0, this.gridHeight);
	
		var upYIndex = upY * this.gridWidth;
		var yIndex = y * this.gridWidth;
		var downYIndex = downY * this.gridWidth;
			
		var neighbors = [];
	
		neighbors.push(upYIndex + leftX);
		neighbors.push(upYIndex + x)
		neighbors.push(upYIndex + rightX);
		neighbors.push(yIndex + leftX);
		neighbors.push(yIndex + rightX);
		neighbors.push(downYIndex + leftX);
		neighbors.push(downYIndex + x);
		neighbors.push(downYIndex + rightX);
		
		// Ajout de la cellule dans le tableau
		this.grid.push(~~((Math.random() * 2) + 0));
		this.neighbors.push(neighbors);
	
	}
};
	
	
// On passe un nombre à cette fonction et elle fait reboucler ce nombre entre min et max s'il les dépasse
// Sachant que le nombre en question ne peut varier que de +1 ou -1 par rapport à min ou max, la routine est simplifiée
GameOfLife.prototype.wedge = function(number, min, max) {

	if(number < min)
	{
		return max - 1;
	}
	else if(number == max)
	{
		return min;
	}
	else
	{
		return number;
	}
};
	
// Cette méthode renvoie le prochain état de la cellule en fonction de l'état de ces cellules voisines
GameOfLife.prototype.getNewState = function(i) {
	
	var numberOfAliveNeighbors = 0;
	
	for(var j = 0; j < 8; j++)
	{
		numberOfAliveNeighbors += this.grid[this.neighbors[i][j]];
	}
	
	return +((numberOfAliveNeighbors == 3) || (numberOfAliveNeighbors == 2 && this.grid[i] == 1)); // le + permet de convertir la valeur booléenne en 1 ou en 0
}

// Cette méthode actualise l'état de toutes les cellules
GameOfLife.prototype.updateGrid = function() {

	var newGrid = [];
	
	for(var i = 0; i < this.grid.length; i++)
	{
		newGrid.push(this.getNewState(i));
	}
	
	this.grid = newGrid;
};



GameOfLife.prototype.render = function() {
	
	//console.log(this.grid);
	
	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');
	
	for(var i = 0; i < this.grid.length; i++) {
		
		if(this.grid[i]) {
			context.fillStyle = 'black';
		} else {
			context.fillStyle = 'white';
		}
		
		context.fillRect((i % this.gridWidth) * 5, Math.floor(i / this.gridWidth) * 5, 5, 5);
	}
	
};


window.onload = function() {
	
	var game = new GameOfLife(150,150);
	
	document.addEventListener('keydown', function(e) {
		if(e.keyCode == 13) {
			game.init();
		}
	})
	
	window.requestAnimationFrame(function loop() {
		window.requestAnimationFrame(loop);
		game.updateGrid();
		game.render();
	});
};