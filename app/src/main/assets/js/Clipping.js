var Model = Model || {};

(function (Model) {

Model.RaycasterControls = function (scene) {
    this.scene = scene;
    this.prevObject = null;
};
Object.assign(Model.RaycasterControls.prototype, {
    constructor: Model.RaycasterControls,
    addEventListener: function () {
        window.addEventListener('click', this.onMouseClick, false);
    },
    removeEventListener: function () {
        window.removeEventListener('click', this.onMouseClick, false);
    },
    onMouseClick: function (event) {
        var mouse = new THREE.Vector2();

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        var intersects = raycaster.intersectObjects(this.scene.children, true);

        if (intersects.length > 0) {
            if (this.prevObject) {
                this.prevObject.material = this.prevObject.userData.material;
                delete this.prevObject.userData.material;
            }

            var mesh = intersects[0].object;
            if (mesh && mesh.isMesh) {
                mesh.userData.material = mesh.userData.material || mesh.material;
                var materials = [];
                for (var i = 0; i < mesh.material.length; i++) {
                    var material = mesh.userData.material[i].clone();
                    material.color.set(0xff0000);
                    materials.push(material);
                }
                mesh.material = materials;
                this.prevObject = mesh;
            }
        } else {
            if (this.prevObject) {
                this.prevObject.material = this.prevObject.userData.material;
                delete this.prevObject.userData.material;
            }

            this.prevObject = null;
        }
    }
});

Model.CAPSUNIFORMS = {

clipping: {
    color:        { type: "c",  value: new THREE.Color( 0x3d9ecb ) },
    clippingLow:  { type: "v3", value: new THREE.Vector3( 0, 0, 0 ) },
    clippingHigh: { type: "v3", value: new THREE.Vector3( 0, 0, 0 ) }
},

caps: {
    color: { type: "c", value: new THREE.Color( 0xf83610 ) }
}

};

Model.CAPSSHADER = {

    vertex: '\
		uniform vec3 color;\
		varying vec3 pixelNormal;\
		\
		void main() {\
			\
			pixelNormal = normal;\
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\
			\
		}',

    vertexClipping: '\
		uniform vec3 color;\
		uniform vec3 clippingLow;\
		uniform vec3 clippingHigh;\
		\
		varying vec3 pixelNormal;\
		varying vec4 worldPosition;\
		varying vec3 camPosition;\
		\
		void main() {\
			\
			pixelNormal = normal;\
			worldPosition = modelMatrix * vec4( position, 1.0 );\
			camPosition = cameraPosition;\
			\
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\
			\
		}',

    fragment: '\
		uniform vec3 color;\
		varying vec3 pixelNormal;\
		\
		void main( void ) {\
			\
			float shade = (\
				  3.0 * pow ( abs ( pixelNormal.y ), 2.0 )\
				+ 2.0 * pow ( abs ( pixelNormal.z ), 2.0 )\
				+ 1.0 * pow ( abs ( pixelNormal.x ), 2.0 )\
			) / 3.0;\
			\
			gl_FragColor = vec4( color * shade, 1.0 );\
			\
		}',

    fragmentClipping: '\
		uniform vec3 color;\
		uniform vec3 clippingLow;\
		uniform vec3 clippingHigh;\
		\
		varying vec3 pixelNormal;\
		varying vec4 worldPosition;\
		\
		void main( void ) {\
			\
			float shade = (\
				  3.0 * pow ( abs ( pixelNormal.y ), 2.0 )\
				+ 2.0 * pow ( abs ( pixelNormal.z ), 2.0 )\
				+ 1.0 * pow ( abs ( pixelNormal.x ), 2.0 )\
			) / 3.0;\
			\
			if (\
				   worldPosition.x < clippingLow.x\
				|| worldPosition.x > clippingHigh.x\
				|| worldPosition.y < clippingLow.y\
				|| worldPosition.y > clippingHigh.y\
				|| worldPosition.z < clippingLow.z\
				|| worldPosition.z > clippingHigh.z\
			) {\
				\
				discard;\
				\
			} else {\
				\
				gl_FragColor = vec4( color * shade, 1.0 );\
				\
			}\
			\
		}',

    fragmentClippingFront: '\
		uniform vec3 color;\
		uniform vec3 clippingLow;\
		uniform vec3 clippingHigh;\
		\
		varying vec3 pixelNormal;\
		varying vec4 worldPosition;\
		varying vec3 camPosition;\
		\
		void main( void ) {\
			\
			float shade = (\
				  3.0 * pow ( abs ( pixelNormal.y ), 2.0 )\
				+ 2.0 * pow ( abs ( pixelNormal.z ), 2.0 )\
				+ 1.0 * pow ( abs ( pixelNormal.x ), 2.0 )\
			) / 3.0;\
			\
			if (\
				   worldPosition.x < clippingLow.x  && camPosition.x < clippingLow.x\
				|| worldPosition.x > clippingHigh.x && camPosition.x > clippingHigh.x\
				|| worldPosition.y < clippingLow.y  && camPosition.y < clippingLow.y\
				|| worldPosition.y > clippingHigh.y && camPosition.y > clippingHigh.y\
				|| worldPosition.z < clippingLow.z  && camPosition.z < clippingLow.z\
				|| worldPosition.z > clippingHigh.z && camPosition.z > clippingHigh.z\
			) {\
				\
				discard;\
				\
			} else {\
				\
				gl_FragColor = vec4( color * shade, 1.0 );\
				\
			}\
			\
		}',

    invisibleVertexShader: '\
		void main() {\
			vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\
			gl_Position = projectionMatrix * mvPosition;\
		}',

    invisibleFragmentShader: '\
		void main( void ) {\
			gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );\
			discard;\
		}'

};

Model.CAPSMATERIAL = {

    sheet: new THREE.ShaderMaterial( {
        uniforms:       Model.CAPSUNIFORMS.clipping,
        vertexShader:   Model.CAPSSHADER.vertexClipping,
        fragmentShader: Model.CAPSSHADER.fragmentClipping
    } ),

    cap: new THREE.ShaderMaterial( {
        uniforms:       Model.CAPSUNIFORMS.caps,
        vertexShader:   Model.CAPSSHADER.vertex,
        fragmentShader: Model.CAPSSHADER.fragment
    } ),

    backStencil: new THREE.ShaderMaterial( {
        uniforms:       Model.CAPSUNIFORMS.clipping,
        vertexShader:   Model.CAPSSHADER.vertexClipping,
        fragmentShader: Model.CAPSSHADER.fragmentClippingFront,
        colorWrite: false,
        depthWrite: false,
        side: THREE.BackSide
    } ),

    frontStencil: new THREE.ShaderMaterial( {
        uniforms:       Model.CAPSUNIFORMS.clipping,
        vertexShader:   Model.CAPSSHADER.vertexClipping,
        fragmentShader: Model.CAPSSHADER.fragmentClippingFront,
        colorWrite: false,
        depthWrite: false,
    } ),

    BoxBackFace:   new THREE.MeshBasicMaterial( { color: 0xC0C0C0, transparent: true,opacity: 0.25 } ),
    BoxWireframe:  new THREE.LineBasicMaterial( { color: 0x0000FF, linewidth: 2 } ),
    BoxWireActive: new THREE.LineBasicMaterial( { color: 0xFF0000, linewidth: 4 } ),

    Invisible: new THREE.ShaderMaterial( {
        vertexShader:   Model.CAPSSHADER.invisibleVertexShader,
        fragmentShader: Model.CAPSSHADER.invisibleFragmentShader
    } )

};

Model.CAPSSCHEDULE = {

    postpone: function ( callback, context, wait ) {

        return function () {
            setTimeout( function () {
                callback.apply( context, arguments );
            }, wait );
        };

    },

    deferringThrottle: function ( callback, context, wait ) { // wait 60 = 16fps // wait 40 = 25fps // wait 20 = 50fps

        var execute = function ( arguments ) {
            callback.apply( context, arguments );
            setTimeout( function () {
                if ( deferredCalls ) {
                    deferredCalls = false;
                    execute( args );
                } else {
                    blocked = false;
                }
            }, wait );
        };

        var blocked = false;
        var deferredCalls = false;
        var args = undefined;

        return function () {
            if ( blocked ) {
                args = arguments;
                deferredCalls = true;
                return;
            } else {
                blocked = true;
                deferredCalls = false;
                execute( arguments );
            }
        };

    }

};

Model.CAPSPGeometry = function ( v0, v1, v2, v3 ) {

    THREE.Geometry.call( this );

    this.vertices.push( v0, v1, v2, v3 );
    this.faces.push( new THREE.Face3( 0, 1, 2 ) );
    this.faces.push( new THREE.Face3( 0, 2, 3 ) );

    this.computeFaceNormals();
    this.computeVertexNormals();

};

Model.CAPSPGeometry.prototype = new THREE.Geometry();
Model.CAPSPGeometry.prototype.constructor = Model.CAPSPGeometry;

Model.CAPSClipBoxFace = function ( axis, v0, v1, v2, v3, selection ) {

    var frontFaceGeometry = new Model.CAPSPGeometry( v0, v1, v2, v3 );
    frontFaceGeometry.dynamic = true;
    selection.meshGeometries.push( frontFaceGeometry );

    var frontFaceMesh = new THREE.Mesh( frontFaceGeometry, Model.CAPSMATERIAL.Invisible );
    frontFaceMesh.axis = axis;
    frontFaceMesh.guardian = this;
    selection.touchMeshes.add( frontFaceMesh );
    selection.selectables.push( frontFaceMesh );

    var backFaceGeometry = new Model.CAPSPGeometry( v3, v2, v1, v0 );
    backFaceGeometry.dynamic = true;
    selection.meshGeometries.push( backFaceGeometry );

    var backFaceMesh = new THREE.Mesh( backFaceGeometry, Model.CAPSMATERIAL.BoxBackFace );
    selection.displayMeshes.add( backFaceMesh );

    this.lines = new Array();

};

Model.CAPSClipBoxFace.prototype = {

    constructor: Model.CAPSClipBoxFace,

    rayOver: function () {
        this.highlightLines( true );
    },

    rayOut: function () {
        this.highlightLines( false );
    },

    highlightLines: function ( b ) {
        for ( var i = 0; i < this.lines.length; i++ ) {
            this.lines[ i ].setHighlight( b );
        }
    }

};

Model.CAPSClipBoxLine = function ( v0, v1, f0, f1, selection ) {

    var lineGeometry = new THREE.Geometry();
    lineGeometry.vertices.push( v0, v1 );
    //lineGeometry.computeLineDistances();
    lineGeometry.dynamic = true;
    selection.lineGeometries.push( lineGeometry );

    this.line = new THREE.LineSegments( lineGeometry, Model.CAPSMATERIAL.BoxWireframe );
    selection.displayMeshes.add( this.line );

    f0.lines.push( this );
    f1.lines.push( this );

};

Model.CAPSClipBoxLine.prototype = {

    constructor: Model.CAPSClipBoxLine,

    setHighlight: function ( b ) {
        this.line.material = b ? Model.CAPSMATERIAL.BoxWireActive : Model.CAPSMATERIAL.BoxWireframe;
    }

};

Model.CAPSClipping = function ( low, high, limitvalue,limitstep ) {

    this.limitLow = low;
    this.limitHigh = high;
    this.limitValue = limitvalue;
    this.limitStep = limitstep;

    this.box = new THREE.BoxGeometry( 1, 1, 1 );
    this.boxMesh = new THREE.Mesh( this.box, Model.CAPSMATERIAL.cap );

    this.vertices = [
        new THREE.Vector3(), new THREE.Vector3(),
        new THREE.Vector3(), new THREE.Vector3(),
        new THREE.Vector3(), new THREE.Vector3(),
        new THREE.Vector3(), new THREE.Vector3()
    ];
    this.updateVertices();

    var v = this.vertices;

    this.touchMeshes = new THREE.Object3D();
    this.displayMeshes = new THREE.Object3D();
    this.meshGeometries = [];
    this.lineGeometries = [];
    this.selectables = [];

    this.faces = [];
    var f = this.faces;
    this.faces.push( new Model.CAPSClipBoxFace( 'y1', v[ 0 ], v[ 1 ], v[ 5 ], v[ 4 ], this ) );
    this.faces.push( new Model.CAPSClipBoxFace( 'z1', v[ 0 ], v[ 2 ], v[ 3 ], v[ 1 ], this ) );
    this.faces.push( new Model.CAPSClipBoxFace( 'x1', v[ 0 ], v[ 4 ], v[ 6 ], v[ 2 ], this ) );
    this.faces.push( new Model.CAPSClipBoxFace( 'x2', v[ 7 ], v[ 5 ], v[ 1 ], v[ 3 ], this ) );
    this.faces.push( new Model.CAPSClipBoxFace( 'y2', v[ 7 ], v[ 3 ], v[ 2 ], v[ 6 ], this ) );
    this.faces.push( new Model.CAPSClipBoxFace( 'z2', v[ 7 ], v[ 6 ], v[ 4 ], v[ 5 ], this ) );

    var l0  = new Model.CAPSClipBoxLine( v[ 0 ], v[ 1 ], f[ 0 ], f[ 1 ], this );
    var l1  = new Model.CAPSClipBoxLine( v[ 0 ], v[ 2 ], f[ 1 ], f[ 2 ], this );
    var l2  = new Model.CAPSClipBoxLine( v[ 0 ], v[ 4 ], f[ 0 ], f[ 2 ], this );
    var l3  = new Model.CAPSClipBoxLine( v[ 1 ], v[ 3 ], f[ 1 ], f[ 3 ], this );
    var l4  = new Model.CAPSClipBoxLine( v[ 1 ], v[ 5 ], f[ 0 ], f[ 3 ], this );
    var l5  = new Model.CAPSClipBoxLine( v[ 2 ], v[ 3 ], f[ 1 ], f[ 4 ], this );
    var l6  = new Model.CAPSClipBoxLine( v[ 2 ], v[ 6 ], f[ 2 ], f[ 4 ], this );
    var l7  = new Model.CAPSClipBoxLine( v[ 3 ], v[ 7 ], f[ 3 ], f[ 4 ], this );
    var l8  = new Model.CAPSClipBoxLine( v[ 4 ], v[ 5 ], f[ 0 ], f[ 5 ], this );
    var l9  = new Model.CAPSClipBoxLine( v[ 4 ], v[ 6 ], f[ 2 ], f[ 5 ], this );
    var l10 = new Model.CAPSClipBoxLine( v[ 5 ], v[ 7 ], f[ 3 ], f[ 5 ], this );
    var l11 = new Model.CAPSClipBoxLine( v[ 6 ], v[ 7 ], f[ 4 ], f[ 5 ], this );

    this.setBox();
    this.setUniforms();

};

Model.CAPSClipping.prototype = {

    constructor: Model.CAPSClipping,

    updateVertices: function () {

        this.vertices[ 0 ].set( this.limitLow.x,  this.limitLow.y,  this.limitLow.z );
        this.vertices[ 1 ].set( this.limitHigh.x, this.limitLow.y,  this.limitLow.z );
        this.vertices[ 2 ].set( this.limitLow.x,  this.limitHigh.y, this.limitLow.z );
        this.vertices[ 3 ].set( this.limitHigh.x, this.limitHigh.y, this.limitLow.z );
        this.vertices[ 4 ].set( this.limitLow.x,  this.limitLow.y,  this.limitHigh.z );
        this.vertices[ 5 ].set( this.limitHigh.x, this.limitLow.y,  this.limitHigh.z );
        this.vertices[ 6 ].set( this.limitLow.x,  this.limitHigh.y, this.limitHigh.z );
        this.vertices[ 7 ].set( this.limitHigh.x, this.limitHigh.y, this.limitHigh.z );

    },

    updateGeometries: function () {

        for ( var i = 0; i < this.meshGeometries.length; i++ ) {
            this.meshGeometries[ i ].verticesNeedUpdate = true;
            this.meshGeometries[ i ].computeBoundingSphere();
            this.meshGeometries[ i ].computeBoundingBox();
        }
        for ( var i = 0; i < this.lineGeometries.length; i++ ) {
            this.lineGeometries[ i ].verticesNeedUpdate = true;
        }

    },

    setBox: function () {

        var width = new THREE.Vector3();
        width.subVectors( this.limitHigh, this.limitLow );

        this.boxMesh.scale.copy( width );
        width.multiplyScalar( 0.5 ).add( this.limitLow );
        this.boxMesh.position.copy( width );

    },

    setUniforms: function () {

        var uniforms = Model.CAPSUNIFORMS.clipping;
        uniforms.clippingLow.value.copy(  this.limitLow );
        uniforms.clippingHigh.value.copy( this.limitHigh );

    },

    setValue: function ( axis, value ) {

        var buffer = this.limitStep;
        var limit = this.limitValue;

        if ( axis === 'x1' ) {
            this.limitLow.x = Math.max( -limit, Math.min( this.limitHigh.x-buffer, value ) );
        } else if ( axis === 'x2' ) {
            this.limitHigh.x = Math.max( this.limitLow.x+buffer, Math.min( limit, value ) );
        } else if ( axis === 'y1' ) {
            this.limitLow.y = Math.max( -limit, Math.min( this.limitHigh.y-buffer, value ) );
        } else if ( axis === 'y2' ) {
            this.limitHigh.y = Math.max( this.limitLow.y+buffer, Math.min( limit, value ) );
        } else if ( axis === 'z1' ) {
            this.limitLow.z = Math.max( -limit, Math.min( this.limitHigh.z-buffer, value ) );
        } else if ( axis === 'z2' ) {
            this.limitHigh.z = Math.max( this.limitLow.z+buffer, Math.min( limit, value ) );
        }

        this.setBox();
        this.setUniforms();

        this.updateVertices();
        this.updateGeometries();

    },

    setVisuable: function (bFlag) {
        this.displayMeshes.visible=bFlag;
        this.touchMeshes.visible=bFlag;
        this.boxMesh.visible=bFlag;
    }

};

Model.ClipPicking = function ( simulation ) {

    var intersected = null;
    var _this = this;
    this.mouse = new THREE.Vector2();
    var ray = new THREE.Raycaster();
    this.pSimulation = simulation;
    var domElement = simulation.render.domElement;
    _this.domElement = (domElement !== undefined) ? domElement : document;

    var normals = {
        x1: new THREE.Vector3( -1,  0,  0 ),
        x2: new THREE.Vector3(  1,  0,  0 ),
        y1: new THREE.Vector3(  0, -1,  0 ),
        y2: new THREE.Vector3(  0,  1,  0 ),
        z1: new THREE.Vector3(  0,  0, -1 ),
        z2: new THREE.Vector3(  0,  0,  1 )
    };

    var plane = null;
    //var plane = new THREE.Mesh( new THREE.PlaneGeometry( limitvalue, limitvalue, 4, 4 ), Model.CAPSMATERIAL.Invisible );
    //plane.name='SlicingPlane';
    //simulation.scene.add( plane );

    this.targeting = function ( event ) {

        if(!simulation.bPick) return ;
        //mouse.setToNormalizedDeviceCoordinates( event, window );
        _this.switchCoordinate(event);

        ray.setFromCamera( _this.mouse, simulation.camera );

        var intersects = ray.intersectObjects( simulation.clipSelection.selectables );

        if ( intersects.length > 0 ) {

            var candidate = intersects[ 0 ].object;

            if ( intersected !== candidate ) {

                if ( intersected !== null ) {
                    intersected.guardian.rayOut();
                }

                candidate.guardian.rayOver();

                intersected = candidate;

                simulation.render.domElement.style.cursor = 'pointer';
                //simulation.throttledRender();

            }

        } else if ( intersected !== null ) {

            intersected.guardian.rayOut();
            intersected = null;

            simulation.render.domElement.style.cursor = 'auto';
            //simulation.throttledRender();

        }

    };

    this.beginDrag = function ( event ) {
        if(!simulation.bPick) return ;
        //mouse.setToNormalizedDeviceCoordinates( event, window );
        _this.switchCoordinate(event);

        ray.setFromCamera( _this.mouse, simulation.camera );

        var intersects = ray.intersectObjects( simulation.clipSelection.selectables );

        if ( intersects.length > 0 ) {

            event.preventDefault();
            //event.stopPropagation();

            simulation.controls.enabled = false;
            if(null==plane || null==plane.geometry) {
                var vlimitValue=simulation.clipSelection.limitValue;
                plane = new THREE.Mesh( new THREE.PlaneGeometry( vlimitValue, vlimitValue, 4, 4 ), Model.CAPSMATERIAL.Invisible );
                simulation.scene.add( plane );
            }

            var intersectionPoint = intersects[ 0 ].point;

            var axis = intersects[ 0 ].object.axis;

            if ( axis === 'x1' || axis === 'x2' ) {
                intersectionPoint.setX( 0 );
            } else if ( axis === 'y1' || axis === 'y2' ) {
                intersectionPoint.setY( 0 );
            } else if ( axis === 'z1' || axis === 'z2' ) {
                intersectionPoint.setZ( 0 );
            }
            plane.position.copy( intersectionPoint );

            var newNormal = simulation.camera.position.clone().sub(
                simulation.camera.position.clone().projectOnVector( normals[ axis ] )
            );
            plane.lookAt( newNormal.add( intersectionPoint ) );

            simulation.render.domElement.style.cursor = 'move';
            //simulation.throttledRender();

            var continueDrag = function ( event ) {

                event.preventDefault();
                //event.stopPropagation();

                //mouse.setToNormalizedDeviceCoordinates( event, window );
                _this.switchCoordinate(event);

                ray.setFromCamera( _this.mouse, simulation.camera );

                var intersects = ray.intersectObject( plane );

                if ( intersects.length > 0 ) {
                    //console.log(" intersects.length ");

                    if ( axis === 'x1' || axis === 'x2' ) {
                        value = intersects[ 0 ].point.x;
                    } else if ( axis === 'y1' || axis === 'y2' ) {
                        value = intersects[ 0 ].point.y;
                    } else if ( axis === 'z1' || axis === 'z2' ) {
                        value = intersects[ 0 ].point.z;
                    }

                    var vgPlane=null;
                    var vValue;
                    if ( axis === 'x2' ) {
                        vgPlane=simulation.clipPlanex1;
                        vValue=value+0.1;
                    } else if ( axis === 'x1' ) {
                        vgPlane=simulation.clipPlanex2;
                        vValue=-(value-0.1);
                    } else if ( axis === 'y1' ) {
                        vgPlane=simulation.clipPlaney1;
                        vValue=-(value-0.1);
                    } else if ( axis === 'y2' ) {
                        vgPlane=simulation.clipPlaney2;
                        vValue=value+0.1;
                    }  else if ( axis === 'z1' ) {
                        vgPlane=simulation.clipPlanez1;
                        vValue=-(value-0.1);
                    } else if ( axis === 'z2' ) {
                        vgPlane=simulation.clipPlanez2;
                        vValue=value+0.1;
                    }
                    if(null!=vgPlane)
                        vgPlane.constant=vValue;

                    simulation.clipSelection.setValue( axis, value );
                    //simulation.throttledRender();

                }

            };

            var endDrag = function ( event ) {

                simulation.controls.enabled = true;

                simulation.render.domElement.style.cursor = 'pointer';

                document.removeEventListener( 'mousemove',   continueDrag, true );
                document.removeEventListener( 'touchmove',   continueDrag, true );

                document.removeEventListener( 'mouseup',     endDrag, false );
                document.removeEventListener( 'touchend',    endDrag, false );
                document.removeEventListener( 'touchcancel', endDrag, false );
                document.removeEventListener( 'touchleave',  endDrag, false );

            };

            document.addEventListener( 'mousemove', continueDrag, true );
            document.addEventListener( 'touchmove', continueDrag, true );

            document.addEventListener( 'mouseup',     endDrag, false );
            document.addEventListener( 'touchend',    endDrag, false );
            document.addEventListener( 'touchcancel', endDrag, false );
            document.addEventListener( 'touchleave',  endDrag, false );

        }

    };

    simulation.render.domElement.addEventListener( 'mousemove',  this.targeting, true );
    simulation.render.domElement.addEventListener( 'mousedown',  this.beginDrag, false );
    simulation.render.domElement.addEventListener( 'touchstart', this.beginDrag, false );

};

Model.ClipPicking.prototype = {

    constructor: Model.ClipPicking,

    setEventListener: function ( bFlag ) {
        this.pSimulation.bPick =bFlag;
        return ;
        if(bFlag) {
            this.pSimulation.render.domElement.addEventListener( 'mousemove',  this.targeting, true );
            this.pSimulation.render.domElement.addEventListener( 'mousedown',  this.beginDrag, false );
            this.pSimulation.render.domElement.addEventListener( 'touchstart', this.beginDrag, false );
        } else {
            this.pSimulation.render.domElement.removeEventListener( 'mousemove',  this.targeting, true );
            this.pSimulation.render.domElement.removeEventListener( 'mousedown',  this.beginDrag, false );
            this.pSimulation.render.domElement.removeEventListener( 'touchstart', this.beginDrag, false );
        }
    },
    switchCoordinate: function (event) {
        var left = this.getOffsetLeft(this.domElement);
        var top = this.getOffsetTop(this.domElement);
        this.mouse.x = ((event.clientX - left) / this.domElement.offsetWidth) * 2 - 1;
        this.mouse.y = -((event.clientY - top) / this.domElement.offsetHeight) * 2 + 1;
    },
    getOffsetLeft: function (obj) {
        var l = obj.offsetLeft;
        while (obj = obj.offsetParent) {
            l += obj.offsetLeft;
        }
        return l;
    },
    getOffsetTop: function (obj) {
        var t = obj.offsetTop;
        while (obj = obj.offsetParent) {
            t += obj.offsetTop;
        }
        return t;
    }

};

})(Model);
