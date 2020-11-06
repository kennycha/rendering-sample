# Rendering Sample

> .glb 파일을 받아, three.js 로 rendering 하는 샘플 코드입니다.

## 앱 렌더링

- [x] Scene 생성
  - [x] 배경색 설정
  - [x] 안개 설정
- [x] Camera 생성
  - [x] 위치 설정
  - [x] 방향 설정
- [x] Renderer 생성
  - [x] Pixel Ratio 설정
  - [x] Shadow 설정
  - [x] Encoding 설정
  - [x] Size 설정
- [x] Lights 생성 및 Scene에 추가
  - [x] Hemisphere Light
  - [x] Spot Light
  - [x] Spot Light Helper
- [x] Ground 생성 및 Scene에 추가
  - [x] Texture 로드 및 Ground에 적용
- [x] Orbit Controls 생성 (카메라 이동)
  - [x] Zoom Out Max Distance 설정
- [x] Transform Controls 생성 (요소 변화)
  - [x] `change` 이벤트 리스너 부착
  - [x] `dragging-changed` 이벤트 리스너 부착
- [x] id를 통해 `renderingDiv` 선택
  - [x] 크기에 맞게 renderer 크기 조절
- [x] `renderingDiv` 의 자식 노드에 이미 렌더링 된 Canvas가 있다면 삭제
- [x] Renderer를 `renderingDiv` 의 자식 노드로 추가
- [x] Animation Looping을 통한 Rendering

## 파일 업로드

- [x] Input 요소 생성
  - [x] .glb | .gltf 형식만 accept
- [x] File URL 생성
  - [x] 컴포넌트 state(`blobURL`) 변경
- [x] 3D Model Rendering
  - [x] GLTF Loader 생성
  - [x] URL을 읽어 파일 내 Model을 Scene에 추가
  - [x] Model 및 하위 요소 그림자 추가
  - [x] Skeleton Helper 추가, 가시화 및 Scene에 추가
  - [x] Skeleton Helper Bones에 조작을 위한 Sphere Mesh 추가

## 3D Model 컨트롤

- [x] 마우스 컨트롤
  - [x] hoveron
  - [x] hoveroff
  - [x] dragstart

- [x] 키보드 단축키 등록
  - [x] 27 (`ESC`) keydown
  - [x] 81 (`Q`) keydown
  - [x] 91 (`Cmd or Win`) keydown
  - [x] 91 (`Cmd or Win`) keyup
  - [x] 87 (`W`) keydown
  - [x] 69 (`E`) keydown
  - [x] 82 (`R`) keydown
  - [x] 187 (`+/=`), 107 (`num+`) keydown
  - [x] 189 (`-/_`), 109 (`num-`) keydown
  - [x] 컴포넌트 Unmount 시 단축키 삭제하여 중복 방지

## 이슈

- [x] `WARNING: Too many active WebGL contexts. Oldest context will be lost.`
  - `THREE.WebGLRenderer: Context Lost`
  - 삭제한 mesh의 geometry, material dispose 했지만 상관없이 계속 발생
  - ~~브라우저 환경에서만 발생하는 것인지 판단 필요~~ (아님)
  - `useEffect` 를 사용해, 기본 요소의 배치 또한 렌더링 이후로 바꿔서 해결
    - ~~이후 .glb 파일 업로드를 통해 3d 요소가 추가될 때도 유지되는지 확인 필요~~ (유지)

- [ ] Bone에 부착되는 Sphere Mesh의 크기 관련
  - 같은 radius 주는데도 3D Model에 맞지 않게 크게 렌더링 되는 문제

- [x] Joint Mesh dragstart event 미발생

  - 현재 hover 를 통해 translateController 붙이는 중

  - UX 상 좋지 않기 때문에 dragstart 로 구현 필수
  - OrbitControl이 DragControl에 우선적으로 실행되어서 발생한 이슈
    - hoveron/off event 로 OrbitControl 의 enabled 값을 변경하여 해결