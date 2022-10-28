var Model = Model || {};

(function (Model) {
  Model.Please3D = function (render, scene, camera) {
    this.camera = camera;
    this.render = render;
    this.scene = scene;
    this.initSection();
  };
  Object.assign(Model.Please3D.prototype, {
    initSection: function () {
      var _this = this;
      var vx = 6;
      var vy = 6;
      var vz = 6;
      _this.clipSelection = null;
      _this.clipPick = new Model.ClipPicking(_this);
      _this.clipPick.setEventListener(false);

      var vspc = -5;
      _this.clipPlanex1 = new THREE.Plane(
        new THREE.Vector3(-1, 0, 0),
        vx + vspc
      );
      _this.clipPlanex2 = new THREE.Plane(
        new THREE.Vector3(1, 0, 0),
        vx + vspc
      );
      _this.clipPlaney1 = new THREE.Plane(
        new THREE.Vector3(0, 1, 0),
        vy + vspc
      );
      _this.clipPlaney2 = new THREE.Plane(
        new THREE.Vector3(0, -1, 0),
        vy + vspc
      );
      _this.clipPlanez1 = new THREE.Plane(
        new THREE.Vector3(0, 0, 1),
        vz + vspc
      );
      _this.clipPlanez2 = new THREE.Plane(
        new THREE.Vector3(0, 0, -1),
        vz + vspc
      );
      _this.clipPlanes = [
        _this.clipPlanex1,
        _this.clipPlanex2,
        _this.clipPlaney1,
        _this.clipPlaney2,
        _this.clipPlanez1,
        _this.clipPlanez2,
      ];
    },
    ctrlSection: function (controls, bFlag) {
      var _this = this;
      this.controls = controls;
      var clipEmpty = Object.freeze([]);

      _this.resetSection(bFlag);
      _this.render.clippingPlanes = bFlag ? _this.clipPlanes : clipEmpty;
      _this.render.localClippingEnabled = bFlag;
      _this.clipPick.setEventListener(bFlag);
    },
    clearSection: function () {
      if (null != this.clipSelection) {
        for (
          var i = 0;
          i < this.clipSelection.displayMeshes.children.length;
          i++
        ) {
          var vmesh = this.clipSelection.displayMeshes.children[i];
          vmesh.geometry.dispose();
          vmesh.material.dispose();
        }
        this.scene.remove(this.clipSelection.displayMeshes);
        this.clipSelection = null;
      }
    },
    resetSection: function (bFlag) {
      var _this = this;

      if (null != _this.clipSelection) {
        _this.clearSection();
        //return ;
      }
      if (bFlag) {
        var limitvalue = 250000;
        var vPosition = { x: -240000, y: -50000, z: -143000 };
        var vMax = { x: 300000, y: 140000, z: 200000 };
        var vMin = { x: -150, y: -100, z: -143 };
        if (null != this.clippingBoundingBox) {
          vPosition = this.clippingBoundingBox.position;
          vMax = this.clippingBoundingBox.max;
          vMin = this.clippingBoundingBox.min;
        }

        if (_this.vecModelCenter) {
          //this.vecModelCenter = dic.getObjectCenter(object);
          //this.vecModelBox = dic.computeBoundingBox(object);
          var vpx2 = 5;
          var tMax = new THREE.Vector3(
            _this.vecModelBox.max.x,
            _this.vecModelBox.max.y,
            _this.vecModelBox.max.z
          );
          var tMin = new THREE.Vector3(
            _this.vecModelBox.min.x,
            _this.vecModelBox.min.y,
            _this.vecModelBox.min.z
          );
          var tX = Math.abs(tMax.x - tMin.x) / 2 + vpx2;
          var tY = Math.abs(tMax.y - tMin.y) / 2 + vpx2;
          var tZ = Math.abs(tMax.z - tMin.z) / 2 + vpx2;

          var center = new THREE.Vector3();
          center.addVectors(tMax, tMin).multiplyScalar(0.5);

          vPosition = { x: center.x, y: center.y, z: center.z };
          vMax = { x: tX, y: tY, z: tZ };
          vMin = { x: -tX, y: -tY, z: -tZ };
        }

        var vMaxx = vMax.x + vPosition.x;
        var vMaxy = vMax.y + vPosition.y;
        var vMaxz = vMax.z + vPosition.z;
        var vMinx = vMin.x + vPosition.x;
        var vMiny = vMin.y + vPosition.y;
        var vMinz = vMin.z + vPosition.z;

        _this.clipSelection = new Model.CAPSClipping(
          // new THREE.Vector3(-vx, -vy, -vz),
          // new THREE.Vector3(vx, vy, vz),
          new THREE.Vector3(vMinx, vMiny, vMinz),
          new THREE.Vector3(vMaxx, vMaxy, vMaxz),
          limitvalue,
          0.4
        );
        _this.clipSelection.setVisuable(bFlag);
        _this.scene.add(_this.clipSelection.displayMeshes);
        var vspc = 1.5; //vx +
        const x1 = vMaxx + vspc;
        const x2 = -vMinx + vspc;
        const y1 = -vMiny + vspc;
        const y2 = vMaxy + vspc;
        const z1 = -vMinz + vspc;
        const z2 = vMaxz + vspc;

        console.log("x1", x1);
        console.log("x2", x2);
        console.log("y1", y1);
        console.log("y2", y2);
        console.log("z1", z1);
        console.log("z2", z2);

        _this.clipPlanex1 = new THREE.Plane(
          new THREE.Vector3(-1, 0, 0),
          10011.5
        );
        _this.clipPlanex2 = new THREE.Plane(new THREE.Vector3(1, 0, 0), 50011.5);
        _this.clipPlaney1 = new THREE.Plane(new THREE.Vector3(0, 1, 0), y1);
        _this.clipPlaney2 = new THREE.Plane(new THREE.Vector3(0, -1, 0), y2);
        _this.clipPlanez1 = new THREE.Plane(new THREE.Vector3(0, 0, 1), z1);
        _this.clipPlanez2 = new THREE.Plane(new THREE.Vector3(0, 0, -1), z2);      

        // _this.clipPlanex1 = new THREE.Plane(new THREE.Vector3(-1, 0, 0), vMaxx + vspc);
        // _this.clipPlanex2 = new THREE.Plane(new THREE.Vector3(1, 0, 0), -vMinx + vspc);
        // _this.clipPlaney1 = new THREE.Plane(new THREE.Vector3(0, 1, 0), -vMiny + vspc);
        // _this.clipPlaney2 = new THREE.Plane(new THREE.Vector3(0, -1, 0), vMaxy + vspc);
        // _this.clipPlanez1 = new THREE.Plane(new THREE.Vector3(0, 0, 1), -vMinz + vspc);
        // _this.clipPlanez2 = new THREE.Plane(new THREE.Vector3(0, 0, -1), vMaxz + vspc);

        _this.clipPlanes = [
          _this.clipPlanex1,
          _this.clipPlanex2,
          _this.clipPlaney1,
          _this.clipPlaney2,
          _this.clipPlanez1,
          _this.clipPlanez2,
        ];
      }
    },
  });
})(Model);
