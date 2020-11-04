# Rendering Sample

> .glb 파일을 받아, three.js 로 rendering 하는 샘플 코드입니다.

## 기본 세팅

- [x] Scene 생성
  - [x] 배경색 설정
  - [x] 안개 설정
- [x] Camera 생성
  - [x] 위치 설정
  - [x] 방향 설정
- [x] Renderer 생성
  - [x] Pixel Ratio 설정
  - [x] Shadow 설정
- [x] Lights 생성 및 Scene에 추가
  - [x] Hemisphere Light
  - [x] Spot Light
  - [x] Spot Light Helper
- [x] Ground 생성 및 Scene에 추가
- [ ] Orbit Controls 생성 (카메라 이동)
- [ ] Transform Controls 생성 (요소 변화)
  - [ ] `change` 이벤트 리스너 부착
  - [ ] `dragging-changed` 이벤트 리스너 부착

## 앱 렌더링

- [x] id를 통해 `renderingDiv` 선택
  - [x] 크기에 맞게 renderer 크기 조절
- [x] `renderingDiv` 의 자식 노드에 이미 렌더링 된 Canvas가 있다면 삭제
- [x] Renderer를 `renderingDiv` 의 자식 노드로 추가
- [x] Renderer를 통한 렌더링

## 파일 업로드

- [x] Input 요소 생성
  - .glb | .gltf 형식만 accept
- [ ] 





## 이슈

- [ ] `WARNING: Too many active WebGL contexts. Oldest context will be lost.`
  - `THREE.WebGLRenderer: Context Lost`
  - 삭제한 mesh의 geometry, material dispose 했지만 상관없이 계속 발생
  - ~~브라우저 환경에서만 발생하는 것인지 판단 필요~~ (아님)
  - 