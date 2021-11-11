# remove the help button
# background color?
# error-checking
# backup turtle spot in the top cell!

import os.path
import math

from ipywidgets import widgets
from notebook import nbextensions
from traitlets import Unicode, List
from IPython.display import display

__version__ = '0.4'

def install_js():
    pkgdir = os.path.dirname(__file__)
    nbextensions.install_nbextension(os.path.join(pkgdir, 'mobilechelonianjs'),
                                     user=True)

class Turtle(widgets.DOMWidget):
    _view_module = Unicode("nbextensions/mobilechelonianjs/turtlewidget").tag(sync=True)
    _view_name = Unicode('TurtleView').tag(sync=True)

    points = List(sync=True)

    SIZE = 400
    OFFSET = 20
    def __init__(self):
        '''Create a Turtle.
        Example::
            t = Turtle()
        '''
        super(Turtle, self).__init__()
        install_js()
        display(self)
        self.pen = 1
        self.speedVar = 1
        self.penSize = 1
        self.color = "black"
        self.bearing = 90
        self.bg_color = "blue"
        self.opaque = 0
        self.points = []
        self.radius = 1
        self.drawcircle = 0
        self.fill = "#eaaa00"
        self.alien = 0
        #self.reset = 0
        self.home()

    def pendown(self):
        '''Put down the pen. Turtles start with their pen down.
        Example::
            t.pendown()
        '''
        self.pen = 1

    def penup(self):
        '''Lift up the pen.
        Example::
            t.penup()
        '''
        self.pen = 0

    def speed(self, speed):
        '''Change the speed of the turtle (range 1-10).
        Example::
            t.speed(10) # Full speed
        '''
        try:
            self.speedVar = int(min(max(1, speed), 10))
        except:
            self.speedVar = 5

    def right(self, num):
        '''Turn the Turtle num degrees to the right.
        Example::
            t.right(90)
        '''
        if num == 42:
            self.alien = 1
        self.bearing += num
        self.bearing = self.bearing%360
        self.b_change = num
        self._add_point()

    def left(self, num):
        '''Turn the Turtle num degrees to the left.
        Example::
            t.left(90)
        '''
        if num == 42:
            self.alien = 1
        self.bearing -= num
        self.bearing = self.bearing%360
        self.b_change = -num
        self._add_point()

    def fillcolor(self, color):
        """
        Sets the fill color
        Example::
            t.fillcolor("red")
        """
        self.fill = color
    
    def begin_fill(self):
        """
        Starts to fill a shape
        Example::
            t.begin_fill()
        """
        self.opaque = 1
    
    def end_fill(self):
        """
        Ends the filling of a shape
        Example::
            t.end_fill()
        """
        self.opaque = 0
    
    def dot(self, num, color=None):
        """ Add a filled in circle with radius num
        Example::
            t.dot(10)
        """
        tempwidth = self.penSize
        tempspeed = self.speedVar
        if color == None:
            newcolor = self.color
            tempcolor = self.color
        else:
            newcolor = color
            tempcolor = self.color
        self.penSize = num
        self.speedVar = 10
        self.color = newcolor
        self.circle(num/2,360,False)
        self.penSize = tempwidth
        self.speedVar = tempspeed
        self.color = tempcolor

    def forward(self, num):
        '''Move the Turtle forward by num units.
        Example:
            t.forward(100)
        '''
        if num == 42:
            self.alien = 1
        self.posX += round(num * math.sin(math.radians(self.bearing)), 1)
        self.posY -= round(num * math.cos(math.radians(self.bearing)), 1)

        # if self.posX < Turtle.OFFSET:
        #     self.posX = Turtle.OFFSET
        # if self.posY < Turtle.OFFSET:
        #     self.posY = Turtle.OFFSET

        # if self.posX > Turtle.SIZE - Turtle.OFFSET:
        #     self.posX = Turtle.SIZE - Turtle.OFFSET
        # if self.posY > Turtle.SIZE - Turtle.OFFSET:
        #     self.posY = Turtle.SIZE - Turtle.OFFSET

        self.b_change = 0
        self._add_point()

    def backward(self, num):
        '''Move the Turtle backward by num units.
        Example::
            t.backward(100)
        '''
        if num == 42:
            self.alien = 1
        self.posX -= round(num * math.sin(math.radians(self.bearing)), 1)
        self.posY += round(num * math.cos(math.radians(self.bearing)), 1)

        # if self.posX < Turtle.OFFSET:
        #     self.posX = Turtle.OFFSET
        # if self.posY < Turtle.OFFSET:
        #     self.posY = Turtle.OFFSET

        # if self.posX > Turtle.SIZE - Turtle.OFFSET:
        #     self.posX = Turtle.SIZE - Turtle.OFFSET
        # if self.posY > Turtle.SIZE - Turtle.OFFSET:
        #     self.posY = Turtle.SIZE - Turtle.OFFSET

        self.b_change = 0
        self._add_point()

    def pencolor(self, color):
        '''Change the color of the pen to color. Default is black.
        Example::
            t.pencolor("red")
        '''
        self.color = color

    def pensize(self, size):
        """Change the size of the pen.
        Example::
            t.pensize(2)
        """
        if size == 42:
            self.alien = 1
        size = min(100, size)
        size = max(1, size)
        self.penSize = size

    def setx(self, x):
        """
        Change the x position of the turtle
        Example::
            t.setx(100)
        """
        self.setposition(x,self.posY)
    
    def sety(self, y):
        """
        Change the y position of the turtle
        Example::
            t.sety(100)
        """
        self.setposition(self.posX,y)

    def setposition(self, x, y, bearing=None):
        """Change the position of the turtle.
        Example::
            t.setposition(100, 100)
        """
        if x == 42 or y == 42:
            self.alien = 1
        self.posX = x
        self.posY = y
        if bearing is None:
            self._add_point()
        elif isinstance(bearing, int):
            self.setbearing(bearing)
        else:
            raise ValueError("Bearing must be an integer")
    
    def position(self):
        """
            Prints out the current position of the 
            turtle.
            Example::
                t.position()
        """
        print(self.posX, self.posY)

    def setbearing(self, bearing):
        """Change the bearing (angle) of the turtle.
        Example::
            t.setbearing(180)
        """
        if bearing == 42:
            self.alien = 1
        diff = self.bearing - bearing
        self.b_change = diff
        self.bearing = bearing
        self._add_point()
        self.b_change = 0

    def setbgColor(self, color):
        """
        changes the background color
        """
        self.bg_color = color

    def _add_point(self):
        p = dict(p=self.pen, lc=self.color, x=self.posX, y=self.posY,
                 b=self.b_change, s=self.speedVar, sz=self.penSize, bg=self.bg_color,
                 fc=self.fill, f=self.opaque, a=self.alien, r=self.radius, cr=self.drawcircle)
        self.points = self.points + [p]


    def circle(self, radius, extent=360, slow=False):
        """Draw a circle, or part of a circle.
        From its current position, the turtle will draw a series of short lines,
        turning slightly between each. If radius is positive, it will turn to
        its left; a negative radius will make it turn to its right.
        Example::
            t.circle(50)
        """
        if radius == 42 or extent == 42:
            self.alien = 1
        if slow == True:
            temp = self.bearing
            self.b_change = 0

            extent = int(extent)
            for i in range(0, (extent//2)):
                n = math.fabs(math.radians(self.b_change) * radius)
                if(radius >= 0):
                    self.forward(n)
                    self.left(2)
                else:
                    self.forward(n)
                    self.right(2)
            if(radius >= 0):
                self.bearing = (temp + extent)
            else:
                self.bearing = (temp - extent)
        if slow == False:
            self.radius = radius
            self.drawcircle += 1
            self._add_point()
    
    def distance(self,x,y):
        """prints the distance between the 
            current position of the turtle
            and the inputs
            Example::
                t.distance(50,100)
        """
        if x == 42 or y == 42:
            self.alien = 1
        print(math.sqrt((self.posX-x)**2 + (self.posY - y)**2 ))


    def home(self):
        '''Move the Turtle to its home position.
        Example::
            t.home()
        '''
        self.posX = 200
        self.posY = 200
        if 90 < self.bearing <=270:
            self.b_change = - (self.bearing - 90)
        else:
            self.b_change = 90 - self.bearing
        self.bearing = 90
        self._add_point()
    
    # def clear(self):
    #     """
    #     clears all current drawings and resets everything
    #     """
    #     self.reset += 1
    #     self.home()

    def spam(self):
        """
        """
        self.speed(10)
        self.pencolor("#eaaa00")
        self.setbgColor("black")
        self.pensize(10)
        self.penup()
        self.backward(42)
        self.backward(38)
        self.left(90)
        self.forward(70)
        self.pendown()
        self.left(60)
        self.circle(50, extent=240, slow=True)

        self.penup()
        self.left(93)
        self.forward(42)
        self.right(10)
        self.pendown()
        self.right(45)
        self.circle(25, extent=240, slow=True)
        self.penup()
        self.forward(51)
        self.pendown()

        self.left(90)
        self.circle(25, extent=185, slow=True)
        self.penup()
        self.left(27)
        self.forward(100)
        self.right(90)
        self.forward(25)
        self.pendown()
        self.circle(25, extent=270, slow=True)

        self.right(180)
        self.forward(25)
        self.right(90)
        self.forward(50)
        self.left(90)
        self.backward(50)
        self.penup()
        self.left(90)
        self.backward(20)
