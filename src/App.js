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
  const [boneObjs, setBoneObjs] = useState([]) // 컨트롤 가능한 bone 객체들을 담은 array
  // const [currentBoneObj, setCurrentBoneObj] = useState(null) // 현재 드래그 중인 bone 객체
  // const [cameraControlsEnabled, setCameraControlsEnabled] = useState(true)

  const scene = new THREE.Scene() // scene 생성
  scene.background = new THREE.Color(0xbbbbbb)  // scene 배경색
  scene.fog = new THREE.Fog(0xbbbbbb, 10, 80) // scene 안개
  
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000) // camera 생성
  camera.position.set(-10, 10, 10) // camera 위치
  camera.lookAt(0, 1, 0)  // camera 방향

  const renderer = new THREE.WebGL1Renderer()
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.shadowMap.enabled = true // 그림자 보이게 설정
  renderer.outputEncoding = THREE.sRGBEncoding  // 결과물 encoding 설정

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
      depthWrite: false
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
  
  // 트랜스폼 컨트롤러 이벤트 리스너 부착
  // 변화 발생 시 렌더링하는 콜백의 경우, 이벤트 리스너가 아닌 useEffect를 통해 할 수 있지 않을까..해서 일단은 주석 처리
  transformControls.addEventListener('change', (event) => {
    // renderer.render(scene, camera)
  })
  transformControls.addEventListener('dragging-changed', event => {
    cameraControls.enabled = !event.value
  })


  // 렌더 시에 바탕 및 기본요소 렌더링
  useEffect(() => {
    // canvas의 parentNode에 해당하는 요소 선택
    const renderingDiv = document.body.querySelector('#renderingDiv')

    // renderer 사이즈 설정
    renderer.setSize(renderingDiv.clientWidth, renderingDiv.clientHeight)
    

    // 예시 mesh (삭제 예정)
    // const geometry = new THREE.BoxGeometry();
		// const material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
		// const cube = new THREE.Mesh( geometry, material );
    // scene.add( cube );
    // setContents([...contents, cube])


    // 기존에 rendering 되어 있는 canvas를 삭제
    while (renderingDiv.firstChild) {
      renderingDiv.removeChild(renderingDiv.firstChild)
    }
    // contents clear
    while (contents.length !== 0) {
      let content = contents.pop()
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
    }
    setContents([])

    // RenderingDiv 아래에 새로운 canvas를 생성하고, scene과 camera를 추가
    renderingDiv.appendChild(renderer.domElement)
    renderer.render(scene, camera)
  }, [])

  useEffect(() => {
    // boneObjs 변화 시에 re-rendering
    
  }, [boneObjs])

  // 파일 URL 읽은 async 함수 생성
  const loadFileURL = (fileURL) => {
    const loader = new GLTFLoader()
    loader.load(fileURL, (gltf) => {
      // load한 결과물을 contents state에 추가
      setContents([...contents, gltf])
      setContents([...contents, gltf.scene])

      // scene에 gltf.scene 추가
      // scene.add(gltf.scene)

      // gltf.scene 내에 mesh가 존재한다면 그림자 추가
      gltf.scene.traverse(obj => {
        if (obj.isMesh) {
          obj.castShadow = true
        }
      })

      scene.add(gltf.scene)

      // skeleton helper 생성 및 가시화
      const skeletonHelper = new THREE.SkeletonHelper(gltf.scene)
      skeletonHelper.visible = true

      // Bone에 부착할 Mesh 정의
      const boneMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, opacity: 0.5, transparent: true })
      boneMaterial.depthWrite = false
      boneMaterial.depthTest = false
      const boneGeometry = new THREE.SphereGeometry()
      const mesh = new THREE.Mesh(boneGeometry, boneMaterial)

      // skeleton helper의 bones 순회하며, 구형 mesh 추가 및 boneObjs 변경
      // skeletonHelper.bones.forEach(bone => {
      //   bone.add(mesh)
      //   setBoneObjs([...boneObjs, bone])
      // })

      skeletonHelper.bones[0].add(mesh)
      setBoneObjs([...boneObjs, skeletonHelper.bones[0]])

      // scene에 skeleton helper 추가
      scene.add(skeletonHelper)
      console.log(skeletonHelper)

      renderer.render(scene, camera)
      console.log(scene, camera, renderer)
    })
  }

  // File 업로드 시 gltfObj set
  const onFileChange = (event) => {
    const file = event.target.files[0]
    const fileURL = URL.createObjectURL(file) // blob URL
    loadFileURL(fileURL)
  } 


  return (
    <>
      <Input type='file' accept='.glb,.gltf' onChange={onFileChange} />
      <RenderingDiv id='renderingDiv' />
    </>
  );
}

export default App;
