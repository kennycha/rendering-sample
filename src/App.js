import React, { useState, useEffect } from 'react'
import styled from 'styled-components';
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'

const MAP_TYPES = ['map', 'aoMap', 'emissiveMap', 'glossinessMap', 'metalnessMap', 'normalMap', 'roughnessMap', 'specularMap']

const Input = styled.input`
  display: block;
`

const RenderingDiv = styled.div`
  width: 800px;
  height: 800px;
`

function App() {
  const [contents, setContents] = useState([])  // clear하기 위해 content 담아놓은 array
  const [blobURL, setBlobURL] = useState(null)  //  파일 읽었을 떄 생성하는 파일 URL
  
  // 렌더 시에 바탕 및 기본요소 렌더링
  useEffect(() => {
    // canvas의 parentNode에 해당하는 요소 선택
    const renderingDiv = document.body.querySelector('#renderingDiv')

    const scene = new THREE.Scene() // scene 생성
    scene.background = new THREE.Color(0xbbbbbb)  // scene 배경색
    scene.fog = new THREE.Fog(0xbbbbbb, 10, 80) // scene 안개
    
    const fov = 45
    const aspect = window.innerWidth / window.innerHeight
    const near = 0.1
    const far = 100
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far) // camera 생성
    camera.position.set(-10, 10, 10) // camera 위치
    camera.lookAt(0, 1, 0)  // camera 방향

    const renderer = new THREE.WebGL1Renderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true // 그림자 보이게 설정
    renderer.outputEncoding = THREE.sRGBEncoding  // 결과물 encoding 설정
    renderer.setSize(renderingDiv.clientWidth, renderingDiv.clientHeight) // renderer 사이즈 설정

    // 반구형 조명 및 스포트라이트 생성 및 설정 후 scene에 추가
    const hemiLight = new THREE.HemisphereLight(0x0e0e0e) // 반구형 조명
    hemiLight.position.set(0, 20, 0)
    const spotLight = new THREE.SpotLight(0xffffff, 2)  // 스포트라이트
    spotLight.castShadow = true
    spotLight.angle = 0.25
    spotLight.penumbra = 0.2
    spotLight.decay = 2
    spotLight.distance = 50
    spotLight.position.set(5, 10, 5)
    const spotLightHelper = new THREE.SpotLightHelper(spotLight)  // spot light helper 생성 및 추가 (광원에서 쏘는 직선 5개)
    scene.add(hemiLight, spotLightHelper, spotLight)

    // ground 생성 및 scene에 추가
    const texture = new THREE.TextureLoader().load('textures/texture_01.png', () => {renderer.render(scene, camera)})
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(30, 30)
    const groundMesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(100, 100),
      new THREE.MeshPhongMaterial({
        color: 0xbbbbbb,
        map: texture,
        depthWrite: false,
        side: THREE.DoubleSide  // 양면 모두 불투명하도록 설정
      })
    )
    groundMesh.position.set(0, 0, 0)
    groundMesh.rotation.x = -Math.PI / 2
    groundMesh.receiveShadow = true
    scene.add(groundMesh)

    // 카메라 컨트롤러 생성 및 설정
    const cameraControls = new OrbitControls(camera, renderer.domElement)
    cameraControls.target.set(0, 1, 0)
    cameraControls.update()
    cameraControls.enablePan = true
    cameraControls.enabled = true

    // 트랜스폼 컨트롤러 생성 (bone에 부착된 mesh 움직이는 컨트롤러)
    const transformControls = new TransformControls(camera, renderer.domElement)    
    // 트랜스폼 컨트롤러 이벤트 리스너 부착 (현재는 효과 없음)
    // 변화 발생 시 렌더링하는 콜백의 경우, 이벤트 리스너가 아닌 useEffect를 통해 할 수 있지 않을까..해서 일단은 주석 처리
    transformControls.addEventListener('change', (event) => {
      // renderer.render(scene, camera)
    })
    transformControls.addEventListener('dragging-changed', event => {
      cameraControls.enabled = !event.value // 요소 드래그 중에는 카메라 이동 불가하도록 설정
    })
    // 트랜스폼 컨트롤러 scene에 추가
    scene.add(transformControls)

    if (blobURL) {
      // 파일 업로드를 통해 blobURL이 생성되었다면
      const loader = new GLTFLoader()
      loader.load(blobURL, (gltf) => {
        const model = gltf.scene || gltf.scenes[0]

        scene.add(model)

        // gltf.scene 내에 mesh가 존재한다면 그림자 추가
        model.traverse(obj => {
          if (obj.isMesh) {
            obj.castShadow = true
          }
        })

        // skeleton helper 생성 및 가시화
        const skeletonHelper = new THREE.SkeletonHelper(model)
        skeletonHelper.visible = true

        // skeleton helper의 bones 순회하며, 구형 mesh 추가 및 boneObjs 변경
        skeletonHelper.bones.forEach(bone => {
        // Bone에 부착할 Mesh 정의
          const boneMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, opacity: 0.5, transparent: true })
          boneMaterial.depthWrite = false
          boneMaterial.depthTest = false
          const boneGeometry = new THREE.SphereGeometry()
          const boneMesh = new THREE.Mesh(boneGeometry, boneMaterial)

          // bone에 부착
          bone.add(boneMesh)
        })

        // scene에 skelton helper 추가
        scene.add(skeletonHelper)
      })
    }

    // 기존에 rendering 되어 있는 canvas를 삭제
    while (renderingDiv.firstChild) {
      renderingDiv.removeChild(renderingDiv.firstChild)
    }

    // contents clear
    contents.forEach(content => {
      // scene에서 삭제
      scene.remove(content)
      // content 및 하위 노드들이 mesh라면 geometry 및 material dispose
      content.traverse(node => {
        if (!node.isMesh) return
        node.geometry.dispose()
        const materials = Array.isArray(node.material) ? node.material : [node.material]
        materials.forEach(material => {
          MAP_TYPES.forEach(mapType => {
            material[mapType]?.dispose()
          })
        })
      })
    })
    setContents([])

    // RenderingDiv 아래에 새로운 canvas를 생성하고, scene과 camera를 추가
    renderingDiv.appendChild(renderer.domElement)
    
    const animate = () => {
      // animate loop를 통해 렌더링
      requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }
    requestAnimationFrame(animate)
  }, [blobURL])

  // File 업로드 시 URL로 변경해서 컴포넌트 state로 관리
  const onFileChange = (event) => {
    const file = event.target.files[0]
    const fileURL = URL.createObjectURL(file) // blob URL
    setBlobURL(fileURL) // 읽은 URL을 컴포넌트 state에서 관리
  } 

  return (
    <>
      <Input type='file' accept='.glb,.gltf' onChange={onFileChange} />
      <RenderingDiv id='renderingDiv' />
    </>
  );
}

export default App;
