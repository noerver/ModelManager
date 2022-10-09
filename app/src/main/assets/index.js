        //定义全局变量
        var renderer;
        var camera;
        var scene;
        var mesh;
        var objects = [];
        var controls;
        var viewcontrols;
        var camControls;
        var mouseVector = new THREE.Vector3();
        var ambientLight;
        var directionalLight;
        var clock;
        var obj;
        var objMaterial;
        var tableData;
        var vPlease3D;
        // var jsonObj;
        var fileModelPath;

        function readPath() {
          fileModelPath = document.getElementById("modelPath").value;
          console.log("文件名:" + fileModelPath);
        }

        //此方法提供给android端调用
        function setFilePath(path) {
          fileModelPath = path;
          console.log("文件名:" + fileModelPath);
        }

        //方法执行入口
        function threeStart() {
          initSence();
          initCamera();
          initLight();
          initObject();          
          initThree();
          animation();
          initSelectOneElement();
          initViewcontrol();
        }

        function initThree() {
          const canvas3d =document.querySelector("#canvas3d"); //获取画布
          console.log(canvas3d)
          renderer = new THREE.WebGLRenderer({
            canvas:canvas3d,
            antialias: true,
            precision:"highp",
            preserveDrawingBuffer: true,
            logarithmicDepthBuffer: true,
          }); //生成渲染器对象
          renderer.shadowMap.enabled = false; //是否允许渲染阴影
          renderer.setPixelRatio(window.devicePixelRatio);
          const backcolor =new THREE.Color('whitesmoke')
          renderer.setClearColor(backcolor,1);
          clock = new THREE.Clock();
        }

        function initSence() {
          scene = new THREE.Scene(); //创建场景对象
          console.log("initSence finished");
        }

        // 初始化相机
        function initCamera() {
          camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight, 1, 1000000); //设置相机类型
          //camera.position.set(0, 0, 100000);  //相机位置
          camera.position.set(-9452, 1078, 10999);
          //camera.up = new THREE.Vector3(0, 1, 0);
          camera.lookAt(0, 0, 0); //设置相机方向
          // console.log('initCamera finished');
        }

        // 初始化灯光,设环境光和平行光，去掉阴影
        function initLight() {
          ambientLight = new THREE.AmbientLight(0xffffff); //设置环境光
          ambientLight.position.set(0, 10000, 100000); //设置环境光源位置
          scene.add(ambientLight); //将环境光添加进场景
          directionalLight = new THREE.DirectionalLight(0xffffff); //设置平行光
          directionalLight.intensity = 0.2; //设置光的强度
          directionalLight.position.set(10000, 10000, 100000); //设置平行光位置
          scene.add(directionalLight); //平行光源添加到场景中
          // console.log('initLight finished');
        }

        var group1 = new THREE.Group();
        group1.name = "BIM模型";

        // 加载物体
        // import { LegacyJSONLoader } from 'http://localhost:8000/three.js-r102/examples/js/loaders/deprecated/LegacyJSONLoader.js';
        function initObject() {
          //用于加载json格式的模型
          var loader2 = new THREE.ObjectLoader();
          if(!fileModelPath){
            fileModelPath ="./FileModel/test2.json";
          }         
          loader2.load(fileModelPath, function (obj) {
            for (var i = 0; i < obj.children.length; i++) {
              //遍历json子对象数组
              if (obj.children[i].hasOwnProperty("geometry")) {
                obj.children[i].geometry.mergeVertices(); //检查重复顶点并移除
                obj.children[i].castShadow = false; //对象是否被渲染到阴影贴图中
                obj.children[i].geometry.computeFaceNormals(); //计算面的法向量值
                objects.push(obj.children[i]);
              }
              if (obj.children[i].children.length > 0) {
                for (var k = 0; k < obj.children[i].children.length; k++) {
                  if (obj.children[i].children[k].hasOwnProperty("geometry")) {
                    obj.children[i].children[k].geometry.mergeVertices(); //检查重复顶点并移除
                    obj.children[i].children[k].geometry.computeFaceNormals(); //计算面的法向量值
                    var ssMaterial = null;
                    ssMaterial = obj.children[i].children[k].material; //赋予材质
                    ssMaterial.clipShadows = true; //显示被剪切
                    ssMaterial.clipIntersection = false;
                    ssMaterial.side = THREE.DoubleSide; //材质双面显示
                    var mesh = new THREE.Mesh(
                      obj.children[i].children[k].geometry,
                      ssMaterial
                    );
                    mesh.position.set(0, 0, 0);
                    mesh.name = obj.children[i].children[k].name;
                    //console.log(mesh.name);
                    mesh.userData = obj.children[i].userData; //存储自定义数据的对象
                    mesh.type = obj.children[i].children[k].type;
                    group1.add(mesh);
                    scene.add(group1);
                    //scene.add(mesh);
                    objects.push(mesh);
                  }
                }
              }
            }
          });

          // console.log('initObject finished');
        }

        //模型渲染
        function animation() {
          if (camControls) {
            let delta = clock.getDelta();
            camControls.update(delta);
          }
          renderer.render(scene, camera); //执行渲染操作
          requestAnimationFrame(animation); //请求再次执行渲染函数render，渲染下一帧
          // console.log('initObject finished');
        }

        // 点选
        function initSelectOneElement() {
          renderer.domElement.addEventListener("click", onDocumentClick, false);
          // console.log('initSelectOneElement finished');
        }

        //点选构件
        function onDocumentClick(event) {
          event.preventDefault();
          mouseVector.x = (event.layerX / window.screen.width) * 2 - 1;
          mouseVector.y = -(event.layerY / window.screen.height) * 2 + 1;
          var raycaster = new THREE.Raycaster();
          raycaster.setFromCamera(mouseVector, camera);
          var selMaterial = new THREE.MeshBasicMaterial({
            color: "green",
            side: "2",
            opacity: 0.5,
            transparent: true,
          });
          var intersects = raycaster.intersectObjects(objects);
          if (intersects.length > 0) {
            if (obj != null) {
              obj.object.material = objMaterial;
            }
            obj = intersects[0];
            objMaterial = intersects[0].object.material;
            intersects[0].object.material = selMaterial;

            //构建信息表的打开和数据获取
            $("#layer_content").window("open");
            $("#layer_content").html("");
            $("#layer_content").append(obj.object.name);
            tableData = document.createElement("table"); //动态创建table表格
            tableData.border = "1";
            for (var item in obj.object.userData) {
              var currentRow = tableData.insertRow(-1);
              var tableTd = currentRow.insertCell(-1);
              tableTd.innerHTML = item;
              currentRow.insertCell(-1).innerHTML = obj.object.userData[item];
            }
            $("#layer_content").append(tableData);
          }
        }

        // 视点放大缩小,移动视角
        function initViewcontrol() {
          vPlease3D = new Model.Please3D(renderer, scene, camera);
          viewcontrols = new THREE.OrbitControls(camera, renderer.domElement); //创建控件对象
          viewcontrols.enableRotate = true;
          //vPlease3D.ctrlSection(viewcontrols, true);
          $("#btnSection").click(function () {
            console.log($("#btnSection").val());
            if ($("#btnSection").val() == "开启剖面框") {
              vPlease3D.ctrlSection(viewcontrols, true);
              $("#btnSection").val("关闭剖面框");
            } else {
              vPlease3D.ctrlSection(viewcontrols, false);
              $("#btnSection").val("开启剖面框");
            }
          });
        }