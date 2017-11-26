;(function (){
    "use strict";
    
    function HexaPrism (hexaprism) {
        this.prism = hexaprism;
        this.grid = hexaprism.getAttribute('data-grid');
        this.childNumber = hexaprism.children.length;
        this.size = { 
            width: parseInt(window.getComputedStyle(hexaprism.children[0]).width),
            height: parseInt(window.getComputedStyle(hexaprism.children[0]).height)
        };
    };

    HexaPrism.prototype.getGrid = function (grid) {
            if (grid.match(/x/g).length !== 1) return;
            var colNumber = grid.split('x')[0];
            var rowNumber = grid.split('x')[1];
            return ( !isNaN(colNumber) && !isNaN(rowNumber) )
                    ? { columns: colNumber, rows: rowNumber }
                    : { error: 'Grid format ' + grid + ' is not valid!! Please use this format: (Number)x(Number)' }
    }
    
    
    HexaPrism.prototype.gridify = function (grid, childnmr) {
        var result = { children : [] };
        var pieceWidth =  this.size.width / grid.columns;
        var pieceHeight =  this.size.height / grid.rows;
        var rotationAngle = 180 - (360 / childnmr);
        for (var count = 0; count < childnmr ; count++) {
            result.children.push({
                                    child: count,
                                    pieceSize: { 
                                        width: pieceWidth,
                                        height: pieceHeight
                                    },
                                    backgroundImage: this.prism.children[count].getAttribute('data-src'),
                                    yRotation: -(count * rotationAngle)+'deg',
                                    positions: []
                                });
            for (var i = 0; i < grid.columns ; i++) {
                for (var j = 0; j < grid.rows ; j++) {
                    
                    result.children[count].positions.push({ 
                                                            piece : i+''+j,
                                                            backgroundPositionX: - (j * pieceWidth) + 'px',
                                                            backgroundPositionY: - (i * pieceHeight) + 'px'
                                                        });
                }
            }
        }
        return result;
    }

    HexaPrism.prototype.generateGridPrism = function (data) {
        
        console.log(data);

        for (var child of data.children) {
            var pieceSize = child.pieceSize.height;
            for (var prop in child) {
                if (prop === 'positions') {
                    for (var piece of child[prop]) {
                        var newPiece = document.createElement('SPAN');
                        newPiece.style.display = 'inline-block';
                        newPiece.style.width = child.pieceSize.width+'px';
                        newPiece.style.height = child.pieceSize.height+'px';
                        newPiece.style.background = 'url('+child.backgroundImage+') no-repeat ' + piece.backgroundPositionX + ' ' + piece.backgroundPositionY + ' transparent';
                        this.prism.children[child.child].appendChild(newPiece); 
                    }
                }
            }
        }
    }
    
    
    HexaPrism.prototype.init = function () {
        var gridData = this.getGrid(this.grid);
        // set grid styles for prism items
        var allItems = this.prism.children;
        for ( var i = 0; i < allItems.length; i++) {
            allItems[i].style.display='grid';
            allItems[i].style.gridTemplate = 'repeat('+gridData.columns+', 1fr) / repeat('+gridData.rows+', 1fr)'
        }        
        var data = this.gridify(gridData, this.childNumber);
        this.generateGridPrism(data);
    }
    
    document.addEventListener('DOMContentLoaded', function() {
        var hexaDom = document.querySelector('.hexaprism');
            
        var myPrism = new HexaPrism(hexaDom);
        
        myPrism.init();
        
    }, true);
})();
