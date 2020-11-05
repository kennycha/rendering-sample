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
- [x] 3d Model Rendering
  - [x] GLTF Loader 생성
  - [x] URL을 읽어 파일 내 Model을 Scene에 추가
  - [x] Model 및 하위 요소 그림자 추가
  - [x] Skeleton Helper 추가, 가시화 및 Scene에 추가
  - [x] Skeleton Helper Bones에 조작을 위한 Sphere Mesh 추가

## 이슈

- [x] `WARNING: Too many active WebGL contexts. Oldest context will be lost.`
  - `THREE.WebGLRenderer: Context Lost`
  - 삭제한 mesh의 geometry, material dispose 했지만 상관없이 계속 발생
  - ~~브라우저 환경에서만 발생하는 것인지 판단 필요~~ (아님)
  - `useEffect` 를 사용해, 기본 요소의 배치 또한 렌더링 이후로 바꿔서 해결
    - ~~이후 .glb 파일 업로드를 통해 3d 요소가 추가될 때도 유지되는지 확인 필요~~ (유지)