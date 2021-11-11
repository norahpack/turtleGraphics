define(['nbextensions/mobilechelonianjs/paper', "@jupyter-widgets/base"], function(paperlib, widget){
    
    function TurtleDrawing(canvas_element, grid_button, help_button) {
        this.points = [];
        this.canvas = canvas_element;
        this.canvas.style.background = '#99CCFF';
        paper.setup(this.canvas);
        
        /* adds grid for user to turn off / on, helps see what the turtle is doing */
        this.grid = new paper.Path();
        this.grid_on = false;
        this.grid_button = grid_button;
        var that = this;
        this.grid_button.click(function (){
            var grid = that.grid;
            if (!that.grid_on) {
                that.grid_on = true;
                grid.strokeColor = 'grey';
                var start = new paper.Point(1,1);
                grid.moveTo(start);
                var canvasSize = that.canvas.width;
                grid.lineTo(start.add([0,canvasSize]));
                
                var i;
                for(i = 20; i <= canvasSize; i += 20){
                    grid.lineTo(start.add([i,canvasSize]));
                    grid.lineTo(start.add([i,0]));
                    grid.lineTo(start.add([i+20,0]));
                }
                for(i = 20; i <= canvasSize; i += 20){
                    grid.lineTo(start.add([canvasSize,i]));
                    grid.lineTo(start.add([0,i]));
                    grid.lineTo(start.add([0,i+20]));
                }
                paper.view.draw();
            } else {
                that.grid_on = false;
                grid.clear();
                paper.view.draw();
            }
        });
        
        this.help_button = help_button;
        this.help_button.click(function (event){
            alert("example:\nfrom NewTurtle import Turtle\nt = Turtle()\nt.forward(50)\nfor help:\nhelp(Turtle)");
        });
        
        // some variable to play with still
        this.lineSize = 4;
        this.rotateSpeed = 1;
        this.turtleColour ='#006900' ;
        this.turtleShow = 1;
        
        // onFrame variables
        this.oldPen=1;
        this.oldSize=1;
        this.oldX = 200;
        this.oldY = 200;
        this.oldRotation=0;
        this.oldColour="black";
        this.oldbgColor = "blue";
        this.oldFill = "#ec00c9";
        this.oldAlien = 0;
        //this.oldreset = 0;
        //this.newreset = 0;
        this.oldCircle = 0;
        this.oldRadius = 1;
        this.newCircle = 0;
        this.newRadius = 1;
        this.newAlien = 0;
        this.newPen=1;
        this.newSize=1;
        this.newX=200; 
        this.newY=200;
        this.newFill = "#ec00c9";
        this.newRotation=0;
        this.newColour="black";
        this.newbgColor= "blue"
        this.veryOldX = 200;
        this.veryOldY = 200;
        this.turtleSpeed = 1;
        //this.clearList = []

        // counts each turtle command
        this.count = 0;
        this.changRot = 0;
        
        this.path = new paper.Path();
        this.path.strokeColor = this.newColour;
        this.path.fillColor = this.newFill;
        this.path.strokeWidth = this.newSize;
        this.path.add(new paper.Point(this.veryOldX, this.veryOldY));
        
        
        /* 
           nextCount is the first function to run for each turtle command. It sets the 
           global variables to each of the values pulled from the intial string.
        */
        TurtleDrawing.prototype.nextCount = function (){
            var count = this.count;
            if (count+1 >= this.points.length) {
                return;
            }
            this.oldPen = this.points[count].p;
            this.oldColour = this.points[count].lc;
            this.oldX = this.points[count].x;
            this.oldY = this.points[count].y;
            this.oldRotation = this.points[count].b;
            this.turtleSpeed = this.points[count].s;
            this.oldSize = this.points[count].sz;
            this.oldFill = this.points[count].fc;
            this.oldOpaque = this.points[count].f;
            this.oldAlien = this.points[count].a;
            this.oldbgColor = this.points[count].bg;
            //this.oldreset = this.points[count].rs;
            //this.newreset = this.points[count+1].rs;
            this.oldCircle = this.points[count].cr;
            this.newCircle = this.points[count+1].cr;
            this.oldRadius = this.points[count].r;
            this.newRadius = this.points[count+1].r;
            this.newbgColor = this.points[count+1].bg;
            this.newAlien = this.points[count+1].a;
            this.newOpaque = this.points[count+1].f;
            this.newFill = this.points[count+1].fc;
            this.newPen = this.points[count+1].p;
            this.newColour = this.points[count+1].lc;
            this.newX = this.points[count+1].x;
            this.newY = this.points[count+1].y;
            this.changRot = this.points[count+1].b;
            this.turtleSpeed = this.points[count+1].s;
            this.newSize = this.points[count+1].sz;
            this.count++;
            this.veryOldX = this.oldX;
            this.veryOldY = this.oldY;
            //path.add(new paper.Point(veryOldX, veryOldY));

            if (this.newPen != this.oldPen || this.newColour != this.oldColour || 
                this.newSize != this.oldSize|| this.newFill != this.oldFill || this.newOpaque != this.oldOpaque){
                //Changing pen - start a new path
                this.path = new paper.Path();
                //this.clearList += this.path;
                this.path.strokeWidth = this.newSize;
                if (this.newOpaque == 1) {
                    this.path.fillColor = this.newFill;
                }
                else {
                    this.path.fillColor = null;
                }
                this.path.add(new paper.Point(this.oldX, this.oldY));
            }
            // Good test command to see what the input is from the string
           //alert("old:"+oldX +" "+ oldY + " " + oldRotation + " New:" + newX + " " +newY + " " + changRot+ " " +turtleSpeed );
           //alert(this.path.strokeWidth);
            if (this.newbgColor != this.oldbgColor) {
                this.canvas.style.background = this.newbgColor;
            }

            if (this.newCircle != this.oldCircle && this.newPen == 1) {
                var circle1 = new paper.Path.Circle(new paper.Point(this.newX,this.newY), this.newRadius);
                circle1.strokeColor = this.newColour;
                if (this.newOpaque == 1) {
                    circle1.fillColor = this.newFill;
                }
                else {
                    circle1.fillColor = null;
                }
                circle1.strokeWidth = this.newSize;
            }

            // if (this.newreset != this.oldreset) {
            //     this.canvas.style.background = 'red';
            //     alert(this.clearList);
            //     var x = this.clearList[0];
            //     x.remove();
            //     //this.clearList[0].remove();
            //     // for (i=0; i < 3; i++) {
            //     //     this.clearList[i].remove();
            //     // }
            //     //this.clearList = []
            // }
        };

        TurtleDrawing.prototype.draw_turtle = function() {
            //builds the initial turtle icon
            if(this.turtleShow===1 && this.newAlien == 0){
                var oldX = this.oldX;
                var oldY = this.oldY;
                var turtleColour = this.turtleColour;

                var tail = new paper.Path.RegularPolygon(new paper.Point(oldX-11,oldY), 3, 3);
                tail.rotate(30);
                tail.fillColor = turtleColour;

                var circlePoint = new paper.Point(oldX, oldY);

                var circle1 = new paper.Path.Circle(circlePoint, 10);
                circle1.fillColor = turtleColour;

                var circlePoint = new paper.Point(oldX+7, oldY-10);

                var circle2 = new paper.Path.Circle(circlePoint, 3);
                circle2.fillColor = turtleColour;

                var circlePoint = new paper.Point(oldX-7, oldY+10);

                var circle3 = new paper.Path.Circle(circlePoint, 3);
                circle3.fillColor = turtleColour;

                var circlePoint = new paper.Point(oldX+7, oldY+10);

                var circle4 = new paper.Path.Circle(circlePoint, 3);
                circle4.fillColor = turtleColour;

                var circlePoint = new paper.Point(oldX-7, oldY-10);

                var circle5 = new paper.Path.Circle(circlePoint, 3);
                circle5.fillColor = turtleColour;

                var circlePoint = new paper.Point(oldX+10, oldY);

                var circle6 = new paper.Path.Circle(circlePoint, 5);
                circle6.fillColor = turtleColour;

                this.turtle = new paper.Group([circle1,circle2,circle3,circle4,circle5,circle6,tail]);
            }
            else if(this.turtleShow==1 && this.newAlien ==1) {
                var oldX = this.oldX;
                var oldY = this.oldY;

                var circlePoint = new paper.Point(oldX, oldY);
                var head = new paper.Path.Circle(circlePoint, 12);
                head.fillColor = "#97cc39";

                var rectangle = new paper.Rectangle(new paper.Point(oldX-10, oldY-15), new paper.Point(oldX+10, oldY-7));
                var radius = new paper.Size(5, 5);
                var hat1 = new paper.Path.Rectangle(rectangle, radius);
                hat1.fillColor = "#e632b9";

                var hat2 = new paper.Path();
                hat2.add(new paper.Point(oldX,oldY-11));
                hat2.add(new paper.Point(oldX-7,oldY-20));
                hat2.add(new paper.Point(oldX+6, oldY-18));
                hat2.fillColor = "#e632b9";

                var eye1 = new paper.Path.Circle(oldX-7, oldY, 2.1);
                eye1.fillColor = "#ffffff";

                var pupil1 = new paper.Path.Circle(oldX-6.5, oldY-.3, 0.7);
                pupil1.fillColor = "#000000";

                var eye2 = new paper.Path.Circle(oldX, oldY-3.5, 2);
                eye2.fillColor = "#ffffff";

                var pupil2 = new paper.Path.Circle(oldX, oldY-3, 0.7);
                pupil2.fillColor = "#000000";

                var eye3 = new paper.Path.Circle(oldX+7, oldY+1, 2.2);
                eye3.fillColor = "#ffffff";

                var pupil3 = new paper.Path.Circle(oldX+6.5, oldY+.7, 0.7);
                pupil3.fillColor = "#000000";

                var smile = new paper.Path();
                smile.add(new paper.Point(oldX-7,oldY+5));
                smile.add(new paper.Point(oldX,oldY+8));
                smile.add(new paper.Point(oldX+8,oldY+6));
                smile.smooth();
                smile.fillColor = "#828282";

                var rectangle = new paper.Rectangle(new paper.Point(oldX-15, oldY+15), new paper.Point(oldX+15, oldY+7));
                var radius = new paper.Size(5, 5);
                var shirt1 = new paper.Path.Rectangle(rectangle, radius);
                shirt1.fillColor = "#ffad1f";

                var rectangle = new paper.Rectangle(new paper.Point(oldX-12,oldY+13), new paper.Point(oldX-6,oldY+6.5))
                var radius = new paper.Size(5, 5);
                var shirt2 = new paper.Path.Rectangle(rectangle, radius);
                shirt2.fillColor = "#ffad1f";

                var rectangle = new paper.Rectangle(new paper.Point(oldX+12,oldY+13), new paper.Point(oldX+6,oldY+6.5))
                var radius = new paper.Size(5, 5);
                var shirt3 = new paper.Path.Rectangle(rectangle, radius);
                shirt3.fillColor = "#ffad1f";

                this.turtle = new paper.Group([shirt1,head,hat1,hat2,eye1,pupil1,eye2,pupil2,eye3,pupil3,smile,shirt2,shirt3])
            }
        };
        
        /*
          The onFrame function does all the drawing, its called every frame at roughly
          30-60fps
        */
        var that = this;
            
        paper.view.on('frame', function(event) {
            var turtleSpeed = that.turtleSpeed;
            var changRot = that.changRot;
            var turtleShow = that.turtleShow;

            var changX =Math.abs(that.oldX-that.newX);
            var changY =Math.abs(that.oldY-that.newY);
            

            // the frame variables outline how much in which direction, this allows
            // the turtle to take the shortest route
            var frameX;
            var frameY;

            if ((changY === 0 || changX === 0)){
                // can't devide by 0, no need for frame calculation anyway if there's 
                // no change in one direction
                frameY = 1;
                frameX = 1;
            } else if (changX < changY) {
                // make ratio for Y
                frameX = (changX/changY);
                frameY = 1;
            } else {
                // make ratio for X
                frameY = (changY/changX);
                frameX = 1;	
            }
            //alert("changX: " + changX + " chanY: " + changY )
            if((changX<turtleSpeed) && that.changRot===0 && changX!==0){
                
                if ((changX<=2) && changRot===0 && changX!==0){
                    that.oldX=that.newX;
                    that.oldY=that.newY;
                }
                //if (((Math.abs(oldX-newX))<=(turtleSpeed/2)) && changRot==0 && changX!=0){
                //	turtleSpeed=(Math.abs(oldX-newX));
                //}
                turtleSpeed = changX;
            }

            if ((changY<turtleSpeed) && that.changRot===0 && changY!==0){
                
                if ((changY<=2) && that.changRot===0 && changY!==0){
                    that.oldX = that.newX;
                    that.oldY = that.newY;
                }
                //if (((Math.abs(oldY-newY))<=(turtleSpeed/2)) && changRot==0 && changY!=0){
                //	turtleSpeed=(Math.abs(oldX-newX));
                //}
                turtleSpeed = changY;
            
            }
            
            //if( changX<changY && (Math.abs(oldY-newY)-10)<turtleSpeed ){
            //	turtleSpeed=1;
                
            //}
            
            else if  (that.changRot!==0 && (Math.abs(changRot))<turtleSpeed){
                turtleSpeed=1;
                
            }
            //frameX *= turtleSpeed;
            //frameY *= turtleSpeed;

            //rotate turtle, current is the exact centre of the turtle
            if (changRot !== 0 && that.turtleShow===1){
                var current = new paper.Point(that.oldX, that.oldY);
                
                if(changRot < 0) {
                    // Turning left
                    that.changRot += that.rotateSpeed*turtleSpeed;
                    that.turtle.rotate(-that.rotateSpeed*turtleSpeed,current);
                } else {
                    // Turning right
                    that.changRot -= that.rotateSpeed*turtleSpeed;
                    that.turtle.rotate(that.rotateSpeed*turtleSpeed,current);                
                }
            } else {
                //if turtle is off we have to manually set old rotation	
                that.oldRotation = that.newRotation;
            }

            if (that.newX > that.oldX) {
                that.oldX += (frameX*turtleSpeed);
                if(turtleShow===1){
                    that.turtle.translate((frameX*turtleSpeed),0);
                }
            }
            if (that.newY > that.oldY){
                that.oldY += (frameY*turtleSpeed);
                if(turtleShow===1){
                    that.turtle.translate(0,(frameY*turtleSpeed));
                }
            }

            if (that.newX < that.oldX){
                that.oldX -= (frameX*turtleSpeed);
                if(turtleShow===1){
                    that.turtle.translate((-frameX*turtleSpeed),0);
                }
            }

            if (that.newY < that.oldY){
                that.oldY -= (frameY*turtleSpeed);
                if(turtleShow===1){
                    that.turtle.translate(0,(-frameY*turtleSpeed));
                }
            }
            
            // prints the little circles every frame until we reach the correct point
            // to create the line
            //alert(" ("+ newY+ ")  "+ oldY+ "  where brooklyn at " +" ("+ newX+ ")  "+ oldX + " speed:"+ turtleSpeed + " changRot:" + changRot);
            if (that.newY !== that.oldY || that.newX !== that.oldX || that.changRot !== 0){
                
                if(that.newPen == 1){
                    that.path.add(new paper.Point(that.oldX, that.oldY));
                    that.turtle.position = new paper.Point(that.oldX, that.oldY);
                    that.path.strokeColor = that.newColour;
                    if (that.newOpaque == 1) {
                        that.path.fillColor = that.newFill;
                    }
                    else {
                        that.path.fillColor = null;
                    }
                    that.path.strokeWidth = that.newSize;
                }
            } else {
                // done animating this command
                that.path.add(new paper.Point(that.newX, that.newY));
                that.nextCount();
                if (that.newAlien != that.oldAlien) {
                    that.turtle.remove();
                    that.draw_turtle();
                }
            }
        });
        this.draw_turtle();
    }
    
    // Define the DatePickerView
    var TurtleView = widget.DOMWidgetView.extend({
        render: function(){
            var toinsert = $('<div/>');
            var turtleArea = $('<div/>');
            turtleArea.attr('id','turtle-canvas-area');
            toinsert.append(turtleArea);

            var buttonDiv = $('<div/>');
            buttonDiv.attr('target','button-area');

            // create help button 
            var helpButton = $('<button/>');
            helpButton.append("Help!");
            buttonDiv.append(helpButton);
            
            // create grid button  
            var gridButton = $('<button/>');
            gridButton.attr('id','grid-element');
            gridButton.attr('value', 0);
            gridButton.append("Grid On/Off");
            buttonDiv.append(gridButton);
            toinsert.append(buttonDiv);

            var canvasDiv = $('<div/>');
            toinsert.append(canvasDiv);
            
            var canvas = document.createElement('canvas');
            canvas.id     = "canvas1";
            canvas.width  = 401;
            canvas.height = 401;
            canvas.resize;

            canvasDiv.append(canvas);
            
            this.turtledrawing = new TurtleDrawing(canvas, gridButton, helpButton);
            this.turtledrawing.points = this.model.get('points');
            
            this.$el.append(toinsert);
            window.debugturtle = this;
        },
        update: function(options) {
            //console.log("doing update");
            this.turtledrawing.points = this.model.get('points');
        }
    });

    return {TurtleView: TurtleView};
});
