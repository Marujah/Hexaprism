;(function (){
    "use strict";
    
    function HexaPrism (hexaprism) {
        this.prism = hexaprism;
        this.grid = hexaprism.getAttribute('data-grid');
        this.childNumber = hexaprism.children.length;
        this.size = { 
            width: parseInt(window.getComputedStyle(hexaprism).width),
            height: parseInt(window.getComputedStyle(hexaprism).height)
        };
    }
    
    HexaPrism.prototype.addStyles = function (element, styles) {
        for (var prop in styles) {
            if (element.style.hasOwnProperty(prop)) {
                element.style[prop] = styles[prop];
            }
        }
    }

    HexaPrism.prototype.getGrid = function (grid) {
        if (grid.match(/x/g)) {
            if( grid.match(/x/g).length !== 1) return;
            var colNumber = grid.split('x')[0];
            var rowNumber = grid.split('x')[1];
            return ( !isNaN(colNumber) && !isNaN(rowNumber) )
                    ? { columns: colNumber, rows: rowNumber }
                    : { error: 'Grid format ' + grid + ' is not valid!! Please use this format: (Number)x(Number)' }
        } else throw('Grid format ' + grid + ' is not valid!! Please use this format: (Number)x(Number)');
    }
    
    
    HexaPrism.prototype.gridify = function (grid, childnmr) {
        var pieceWidth =  this.size.width / grid.columns;
        var pieceHeight =  this.size.height / grid.rows;
        var result = { 
            grid: { columns: grid.columns , rows: grid.rows },
            pieceSize: {
                width: pieceWidth,
                height: pieceHeight
            },
            children : [] 
        };
        var rotationAngle = 360 / childnmr;
        for (var count = 0; count < childnmr ; count++) {
            result.children.push({
                                    child: count,
                                    backgroundImage: this.prism.children[count].getAttribute('data-src'),
                                    yRotation: (count * rotationAngle)+'deg',
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
        
        var pieceSize = data.pieceSize;
        
        var incircleRadius = pieceSize.width / (2 * Math.tan((180/this.prism.children.length) * Math.PI/180));

        this.prism.innerHTML = '';
        
        for ( var i = 0; i < (data.grid.columns * data.grid.rows); i++ ) {
            var newSection = document.createElement('SECTION');
            this.addStyles(newSection, {
                perspective: '1000px',
                position: "relative",
                width: data.pieceSize.width+'px',
                height: data.pieceSize.height+'px'
            });
            
            var newPart = document.createElement('DIV');
            newPart.className = 'piece';
            this.addStyles(newPart, {
                position: "absolute",
                transform: "translateZ(" + -(incircleRadius) + "px)",
                transformStyle: "preserve-3d",
                width: '100%',
                height: '100%',
                transition: "transform .5s"
            });
            for (var child of data.children) {
                var newPiece = document.createElement('FIGURE');
                this.addStyles(newPiece, {
                    display: 'inline-block',
                    margin: '0',
                    position: 'absolute',
                    width: data.pieceSize.width+'px',
                    height: data.pieceSize.height+'px',
                    transformStyle: "preserve-3d",
                    transform: "rotateY("+child.yRotation+") translateZ(" + (incircleRadius) + "px)",
                    background: 'url('+child.backgroundImage+') no-repeat ' + child.positions[i].backgroundPositionX + ' ' + child.positions[i].backgroundPositionY + ' transparent',
                    backfaceVisibility: 'hidden'
                })
                newPart.appendChild(newPiece);
                newSection.appendChild(newPart);
            }
            this.prism.appendChild(newSection);
        }
    }
    
    
    HexaPrism.prototype.init = function () {
        var gridData = this.getGrid(this.grid);  
        var data = this.gridify(gridData, this.childNumber);
        this.addStyles(this.prism, {
            display: 'grid',
            gridGap: '10px',
            gridTemplate: 'repeat('+data.grid.columns+', 1fr) / repeat('+data.grid.rows+', 1fr)'
        })
        this.generateGridPrism(data);
    }
    
    document.addEventListener('DOMContentLoaded', function() {
        var hexaDom = document.querySelector('.hexaprism');
            
        var myPrism = new HexaPrism(hexaDom);
        
        myPrism.init();
        
    }, true);
})();
