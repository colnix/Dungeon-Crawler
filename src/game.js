/* 
Part of (or All) the graphic tiles used in this program is the public 
domain roguelike tileset "RLTiles".

You can find the original tileset at:
http://rltiles.sf.net
*/
Crafty.sprite(32, "asstes/dungeon.png",{
    floor: [0,1],
    wall1: [2,0],
    stairs: [3,1],
    circle: [6,1]
});
Crafty.sprite(32, "asstes/characters.png",{
    player: [5,3],
    dragon: [0,1]
});
Crafty.c('Grid', {
    init: function() {
        this.attr({
            w: Game.map_grid.tile.width,
            h: Game.map_grid.tile.height
        });
    },
    at:function(x, y){
        if(x === undefined && y === undefined){
            return{x: this.x/Game.map_grid.tile.width, y: this.y/Game.map_grid.tile.height};
        }else{
            this.attr({ x: x * Game.map_grid.tile.width, y: y * Game.map_grid.tile.height });
            return this;
        }
    }
});
Crafty.c('Ent',{
    init: function(){
        this.requires('2D, Canvas, Grid');
    }
});
Crafty.c('Wall',{
    	init: function(){
          this.requires('Ent, wall1');
      }
});
Crafty.c('Floor',{
    	init: function(){
          this.requires('Ent, Solid, floor');
      }
});
Crafty.c('Monster',{
    	init: function(){
          this.requires('Ent');
      }
});
Crafty.c('Stairs',{
    	init: function(){
          this.requires('Ent, stairs');
      }
});
Crafty.c('Circle',{
    	init: function(){
          this.requires('Ent, circle');
      }
});
Crafty.c('Dragon',{
    	init: function(){
          this.requires('Monster, dragon');
      }
});
Crafty.scene("game", function(){
    var floorNumber = 1;
    var stairCase = false;
    this.occupied = new Array(Game.map_grid.width);
    for(var i = 0; i < Game.map_grid.width; i++){
        this.occupied[i] = new Array(Game.map_grid.height);
        for(var y = 0; y < Game.map_grid.height; y++){
            this.occupied[i][y] = false;
        }
    }
    for(var x = 0; x < Game.map_grid.width; x++){
        for(var y = 0; y < Game.map_grid.height; y++){
            var at_edge = x == 0 || x == Game.map_grid.width - 1 || y == 0 || y == Game.map_grid.height - 1;
            
            if(at_edge){
                Crafty.e('Wall').at(x, y);
                this.occupied[x][y] = true;
            }else{
                Crafty.e('Floor').at(x,y);
                this.occupied[x][y] = true;
                
                if(Math.random() < 0.003){
                    Crafty.e('Dragon').at(x, y);
                }
                if(Math.random() < 0.004 && stairCase == false){
                    Crafty.e('Stairs').at(x, y);
                    stairCase = true;
                }
            }
        }
    }
    if(stairCase == false){
        Crafty.e('Stairs').at(10, 10);
    }
    var player = Crafty.e(); 
    player.addComponent("2D, Canvas, player,Collision");
    player.addComponent("Fourway").fourway(5);
    player.attr({x: 50, y: 50, w: 50, h: 50});
    player.bind('Moved', function(from) {
       if(this.hit('Wall')){
           this.attr({x: from.x, y:from.y});
        }
    });
    player.bind('Moved', function(from) {
       if(this.hit('Stairs')){
           floorNumber = floorNumber + 1;
           console.log(floorNumber);
           Crafty.scene('loading');
        }
    });
    player.bind('Moved', function(from) {
       if(this.hit('Monster')){
           console.log("Hit Monster!");
           Game.player.loseHealth();
           var testhealth = Game.player.health;
           console.log(testhealth);
        }
    });
    /*var monster = Crafty.e(); 
    monster.addComponent("2D, Canvas, dragon");
    monster.attr({x: 400, y: 300, w: 50, h: 50});*/
    
});
Crafty.scene('loading', function(){
    console.log("Floor loading...");
    Crafty.scene('game');
});
Game = {
    map_grid:{
        width: 36,
        height: 20,
        tile:{
            width: 32,
            height: 32
        }
      },
    width: function(){
        return this.map_grid.width * this.map_grid.tile.width;
    },
    height: function(){
        return this.map_grid.height * this.map_grid.tile.height;
    },
    start: function(){
        Crafty.init(window.innerWidth, window.innerHeight);
        Crafty.canvas.init();
        Crafty.scene("game");
    },
    player:{
        health: 100,
        loseHealth: function(){
            this.health--;
        },
        addHealth: function(){
            this.health++;
        }
    }
}