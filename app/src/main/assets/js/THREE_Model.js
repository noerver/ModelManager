export default class THREE_Model {
  constructor(elementID) {
    (this.elementID = elementID),
      (this.scene = new THREE.Scene()),
      (this.camera = new THREE.PerspectiveCamera(75, 0, 1, 1000000)),
      (this.ambientLight = new THREE.AmbientLight(0xffffff)),
      (this.directionalLight = new THREE.DirectionalLight(0xffffff)),
      (this.controls = null),
      (this.renderer = null),
      (this.mainObject = null),
      (this.width = 0),
      (this.height = 0);
  }

  getDomElement() {
    if (this.elementID) {
      return document.getElementById(this.elementID);
    }
  }

  loadObject(filePath) {
    const loader = new THREE.ObjectLoader();
    if (!filePath) {
      filePath = "./FileModel/test2.json";
    }
    loader.load(
      filePath,
      function (obj) {
        this.mainObject = obj;
        const group1 = new THREE.Group();
        group1.name = "BIM模型";
        this.scene.add(group1);
        obj.children.forEach((geometry) => {
          if (geometry.hasOwnProperty("geometry")) {
            geometry.geometry.mergeVertices(); //检查重复顶点并移除
            geometry.castShadow = false; //对象是否被渲染到阴影贴图中
            geometry.geometry.computeFaceNormals(); //计算面的法向量值
          }

          geometry.children.forEach((item) => {
            if (item.hasOwnProperty("geometry")) {
              item.geometry.mergeVertices(); //检查重复顶点并移除
              item.castShadow = false; //对象是否被渲染到阴影贴图中
              item.geometry.computeFaceNormals(); //计算面的法向量值

              let ssMaterial = null;
              ssMaterial = item.material; //赋予材质
              ssMaterial.clipShadows = true; //显示被剪切
              ssMaterial.clipIntersection = false;
              ssMaterial.side = THREE.DoubleSide; //材质双面显示
              const mesh = new THREE.Mesh(item.geometry, ssMaterial);
              mesh.position.set(0, 0, 0);
              mesh.name = item.name;
              //console.log(mesh.name);
              mesh.userData = geometry.userData; //存储自定义数据的对象
              mesh.type = item.type;
              group1.add(mesh);
            }
          });
        });

        this.rederAnimation();
      }.bind(this)
    );
  }

  beforInit() {
    const domElement = this.getDomElement(); //获取画布
    this.renderer = new THREE.WebGLRenderer({
      canvas: domElement,
    });
    this.width = domElement.width;
    this.height = domElement.height;
    this.renderer.domElement = domElement;
    this.controls = new THREE.OrbitControls(this.camera, domElement);
  }

  init() {
    this.initCamera();
    this.beforInit();
    this.initRenderer();
    this.initLight();
    this.onWindowResize();
    window.addEventListener("resize", this.onWindowResize);
  }

  initRenderer() {
    this.renderer.antialias = true;
    this.renderer.precision = "highp";
    this.renderer.preserveDrawingBuffer = true;
    this.renderer.logarithmicDepthBuffer = true;
    this.renderer.shadowMap.enabled = false; //是否允许渲染阴影
    this.renderer.setPixelRatio(window.devicePixelRatio);
    const backcolor = new THREE.Color("whitesmoke");
    this.renderer.setClearColor(backcolor, 1);
  }

  initLight() {
    this.ambientLight.position.set(0, 10000, 100000); //设置环境光源位置
    this.scene.add(this.ambientLight); //将环境光添加进场景

    this.directionalLight.intensity = 0.2; //设置光的强度
    this.directionalLight.position.set(10000, 10000, 100000); //设置平行光位置.
    this.scene.add(this.directionalLight); //平行光源添加到场景中
  }

  initCamera() {
    this.camera.position.set(0, 0, 20000); //相机位置
    this.camera.lookAt(0, 0, 0); //设置相机方向
  }

  reset() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  rederAnimation() {
    let _this = this;
    function animation() {
      requestAnimationFrame(animation); //请求再次执行渲染函数render，渲染下一帧
      _this.controls.update();
      _this.render(); //执行
    }

    animation();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  createSpheres(INTERSECTED) {
    const geometry = new THREE.SphereGeometry(300, 366, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0x1ff000 });
    const sphere = new THREE.Mesh(geometry, material);
    this.scene.add(sphere);
    sphere.position.copy(INTERSECTED.point).add(INTERSECTED.face.normal);
    sphere.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
    this.scene.add(sphere);
    return sphere;
  }

  // setupGui() {
  //   // gui
  //   gui = new THREE.GUI({ title: "Intensity" });

  //   gui
  //     .add(API, "lightProbeIntensity", 0, 1, 0.02)
  //     .name("light probe")
  //     .onChange(function () {
  //       this.AmbientLight.intensity = API.lightProbeIntensity;
  //       render();
  //     });

  //   gui
  //     .add(API, "directionalLightIntensity", 0, 1, 0.02)
  //     .name("directional light")
  //     .onChange(function () {
  //       this.directionalLight.intensity = API.directionalLightIntensity;
  //       render();
  //     });

  //   // gui
  //   //   .add(API, "envMapIntensity", 0, 1, 0.02)
  //   //   .name("envMap")
  //   //   .onChange(function () {
  //   //     mesh.material.envMapIntensity = API.envMapIntensity;
  //   //     render();
  //   //   });
  // }
}

//export default THREE_Model;
