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
        this.scene.add(obj);
        //this.createEdges();
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
    this.loadObject();
    //this.setupGui();
    this.rederAnimation();
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

  creatPoint() {
    const date = Date.now();
    var markerContainerConfig =
      new Glodon.Bimface.Plugins.Marker3D.Marker3DContainerConfig();
    // 设置markerContainerConfig匹配的viewer对象
    markerContainerConfig.viewer = viewer3D;
    // 构造三维标签容器markerContainer
    var markerContainer = new Glodon.Bimface.Plugins.Marker3D.Marker3DContainer(
      markerContainerConfig
    );
    // 构造三维标签配置项
    var markerConfig = new Glodon.Bimface.Plugins.Marker3D.Marker3DConfig();
    // 为标签指定图片路径
    markerConfig.tooltip = date.MonitorSpot + date.MonitorType;
    markerConfig.src = "/images/红色警示.png";

    // 构造点位，并指定为标签的插入点
    const markerPos = JSON.parse(escape2Html(date.WorldPosition)); //date.WorldPosition;
    markerConfig.worldPosition = markerPos;
    // 指定标签大小
    markerConfig.size = 60;
    // 构造三维标签
    var marker = new Glodon.Bimface.Plugins.Marker3D.Marker3D(markerConfig);
    // 将三维标签添加至容器内
    markerContainer.addItem(marker);
    is3DMarkerPlaced = true;
  }

  creatPoint1() {
    const geometry = new THREE.BufferGeometry();
    // create a simple square shape. We duplicate the top left and bottom right
    // vertices because each vertex needs to appear once per triangle.
    const vertices = new Float32Array([
      -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0,

      1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0,
    ]);

    // itemSize = 3 because there are 3 values (components) per vertex
    geometry.addAttribute("position", new THREE.BufferAttribute(vertices, 3));
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
    });
    const mesh = new THREE.Mesh(geometry, material);

    this.scene.add(mesh);
  }

  createSpheres(x = 0, y = 0, z = 0) {
    const geometry = new THREE.SphereGeometry(300, 366, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0x1ff000 });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.x = x;
    sphere.position.y = y;
    sphere.position.z = z;
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
