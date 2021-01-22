
class SATDemo
{
    static STATE_IDLE = "idle";
    static STATE_DRAG = "drag";

    static HANDLE_RADIUS = 10;

    _container = null;
    _wrapper = null;
    _canvas = null;
    _ctx = null;
    _shapeSelectors = [];
    _shapes = [];

    _state = SATDemo.STATE_IDLE;
    _draggedShape = null;
    _lastDraggedShape = null;
    _overShape = null;


    constructor(container) {
        this._container = container || document;
        this._container.classList.add("satContainer");

        this._setupCanvas();
        this._setupControls();

        this._redrawCanvas();
    }

    _setupControls() {
        let controls = document.createElement('div');
        controls.classList.add('satControlsContainer');
        this._container.appendChild(controls);

        // create each of the drop downs
        let shapeOrder = [["Triangle", 3], ["Square", 4], ["Pentagon", 5], ["Hexagon", 6], ["Circle", 0]];

        for (let i = 0; i < 2; i++)
        {
            let label = document.createElement('label');
            label.for = `shape${i}`;
            label.innerText = `Shape ${i}:`;
            controls.appendChild(label);

            let select = document.createElement('select');
            select.id = `shape${i}`;
            controls.appendChild(select);
            this._shapeSelectors.push(select);
            select.addEventListener('change', (evt) => this._onShapeSelectChange(evt));
           
            for (let pair of shapeOrder)
            {
                 // insert each of the options
                let option = document.createElement('option');
                option.value = pair[1];
                option.innerText = pair[0];
                select.appendChild(option);                
            }

            let rand = Math.floor(Math.random() * shapeOrder.length);
            select.selectedIndex = rand;
            
            // generate the initial shape
            let sides = shapeOrder[rand][1];
            let shape = null;
            if (sides == 0) shape = new SATCircle();
            else shape = SATPolygon.CreatePolygon(sides);
            this._shapes.push(shape);

            shape.x = (Math.random() * (this._canvas.width - (SATDemo.HANDLE_RADIUS * 2))) + SATDemo.HANDLE_RADIUS;
            shape.y = (Math.random() * (this._canvas.height - (SATDemo.HANDLE_RADIUS * 2))) + SATDemo.HANDLE_RADIUS;
        }

        this._lastDraggedShape = this._shapes[0];
    }


    _onShapeSelectChange(evt) {

        for (let i = 0; i < this._shapes.length; i++)
        {
            let existingShape = this._shapes[i];
            let existingSides = (existingShape instanceof SATCircle) ? 0 : existingShape.vertices.length;
            let reqdSides = parseInt(this._shapeSelectors[i].value);

            if (existingSides != reqdSides)
            {
                // replace the shape
                let newShape = null;
                if (reqdSides == 0) newShape = new SATCircle();
                else newShape = SATPolygon.CreatePolygon(reqdSides);

                newShape.x = existingShape.x;
                newShape.y = existingShape.y;
                newShape.scale = existingShape.scale;
                newShape.rotation = existingShape.rotation;

                this._shapes[i] = newShape;

                if (this._lastDraggedShape == existingShape)
                    this._lastDraggedShape = newShape;
            }

        }

        this._redrawCanvas();
    }



    _setupCanvas() {
        this._canvas = document.createElement('canvas');
        this._container.appendChild(this._canvas);
        this._canvas.classList.add('satCanvas');

        this._canvas.addEventListener('mousemove', (evt) => this._onCanvasMouseMove(evt));
        this._canvas.addEventListener('mousedown', (evt) => this._onCanvasMouseDown(evt));
        this._canvas.addEventListener('mouseup', (evt) => this._onCanvasMouseUp(evt));
        this._canvas.addEventListener('mouseenter', (evt) => this._onCanvasMouseEnter(evt));

        this._canvas.tabIndex = 1;
        this._canvas.addEventListener('keydown', (evt) => this._onCanvasKeyDown(evt));

        this._ctx = this._canvas.getContext('2d');
        this._updateCanvasSize();
        window.addEventListener('resize', (evt) => this._updateCanvasSize() );
   }

   _updateCanvasSize() {
       this._canvas.width = this._canvas.clientWidth;
       this._canvas.height = this._canvas.clientHeight;

        // keep shapes within range?
        for (let shape of this._shapes)
        {
            shape.x = Math.max(Math.min(shape.x, this._canvas.width - SATDemo.HANDLE_RADIUS), SATDemo.HANDLE_RADIUS);
            shape.y = Math.max(Math.min(shape.y, this._canvas.height - SATDemo.HANDLE_RADIUS), SATDemo.HANDLE_RADIUS);

        }


        this._redrawCanvas();
   }

   _onCanvasMouseMove(evt) {
        switch (this._state)
        {
            case SATDemo.STATE_IDLE:
                if (this._updateOverShape(evt))
                {
                    // there was a change
                    this._redrawCanvas();
                }
                break;
            case SATDemo.STATE_DRAG:
                if (this._draggedShape)
                {
                    // make the shape follow the mouse - but keep within the demo area
                    let canvasPos = this._canvasMouseEvtPos(evt);
                    this._draggedShape.x = Math.min(Math.max(canvasPos.x, SATDemo.HANDLE_RADIUS), this._canvas.width - SATDemo.HANDLE_RADIUS);
                    this._draggedShape.y = Math.min(Math.max(canvasPos.y, SATDemo.HANDLE_RADIUS), this._canvas.height - SATDemo.HANDLE_RADIUS);

                    this._redrawCanvas();
                }
                break;                                    
        }
   }

    _onCanvasMouseDown(evt) {
        if (this._state == SATDemo.STATE_IDLE)
        {
            if (this._overShape != null)
            {
                this._draggedShape =
                this._lastDraggedShape = this._overShape;
                this._state = SATDemo.STATE_DRAG;
            }
        }
    }

    _onCanvasMouseUp(evt) {
        if (this._state == SATDemo.STATE_DRAG)
        {
            this._draggedShape = null;
            this._state = SATDemo.STATE_IDLE;
        }
    }
     
    _onCanvasMouseEnter(evt) {
        if (evt.buttons != 1)
        {
            this._onCanvasMouseUp(evt);
        }

    }

    _onCanvasKeyDown(evt){
        
        if (this._lastDraggedShape)
        {
            switch (evt.keyCode)
            {
                case 37:
                    this._lastDraggedShape.rotation -= 10;
                    break;
                case 39:
                    this._lastDraggedShape.rotation += 10;
                    break;

                case 38:
                    this._lastDraggedShape.scale = Math.min(this._lastDraggedShape.scale + 0.1, 2);
                    break;        
                case 40:
                    this._lastDraggedShape.scale = Math.max(this._lastDraggedShape.scale - 0.1, 0.2);
                    break;                                    
            }
            evt.preventDefault();
            this._redrawCanvas();
        }
        

    }

    _updateOverShape(evt) {
        let canvasPos = this._canvasMouseEvtPos(evt);
        let newShape = null;
        for (let shape of this._shapes)
        {
            let distSq = Math.pow(canvasPos.x - shape.x, 2) + Math.pow(canvasPos.y - shape.y, 2);
            
            if (distSq < SATDemo.HANDLE_RADIUS * SATDemo.HANDLE_RADIUS)
            {
                newShape = shape;
                break;
            }            
        }

        let changed = newShape != this._overShape;
        this._overShape = newShape;
        return changed;
    }

    _canvasMouseEvtPos(evt)
    {
        let rect = this._canvas.getBoundingClientRect();
        return { x: evt.x - rect.left, y: evt.y - rect.top };
    }


    _redrawCanvas() {

        this._ctx.clearRect(0,0, this._canvas.width, this._canvas.height);
        
        let shapeLineColor = 'black';

        // test for collisions
        let collisionInfo = SAT.test(this._shapes[0], this._shapes[1]);
        if (collisionInfo)
        {

            // draw the ghost shape based on the collision
            let inverter = collisionInfo.shapeA == this._lastDraggedShape ? -1 : 1;
            let clone = this._lastDraggedShape.clone();
            clone.x += collisionInfo.separation.x * inverter;
            clone.y += collisionInfo.separation.y * inverter;
            this._drawShape(clone, 'rgba(0,0,0,0.5)', 0);

            // set the shape line color
            shapeLineColor = 'red';
        }

        // draw the actual shapes
        for (let i = 0; i < this._shapes.length; i++)
        {
            let shape = this._shapes[i];
            let handleStyle = 1;
            if (shape == this._overShape) handleStyle = 2;
            if (shape == this._draggedShape) handleStyle = 3;

            this._drawShape(shape, shapeLineColor, handleStyle);
                      
        }
    }

    _drawShape(shape, color, handleState = 0)
    {
        this._ctx.strokeStyle = color;

        if (shape instanceof SATCircle)
        {
            this._ctx.beginPath();
            this._ctx.arc(shape.x, shape.y, shape.getTransformedRadius(), 0, Math.PI * 2);
            this._ctx.stroke();
        }
        else if (shape instanceof SATPolygon)
        {
            this._ctx.beginPath();
            let vertices = shape.getTransformedVerts();
            let vert = vertices[vertices.length-1];
            this._ctx.moveTo(shape.x + vert.x, shape.y + vert.y); // moving to the last pos so we can loop withouth a wrap around
            for (let i =0; i < vertices.length; i++)
            {
                vert = vertices[i];
                this._ctx.lineTo(shape.x + vert.x, shape.y + vert.y);
            }
            this._ctx.stroke();
        }
    
        // draw the handle
        if (handleState > 0)
        {
            this._ctx.beginPath();
            this._ctx.arc(shape.x, shape.y, SATDemo.HANDLE_RADIUS, 0, Math.PI * 2);
            if (handleState == 1) {
                // idle
                this._ctx.strokeStyle = 'rgba(0,0,255,0.5)'
                this._ctx.stroke();
            }
            else {
                // over or held
                this._ctx.fillStyle = handleState == 3 ? 'rgba(0,0,255,0.6)' : 'rgba(0,0,255,0.3)';
                this._ctx.fill();
            }

        }
    }

}


