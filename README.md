# 이벤트/보상 관리 플랫폼

이 프로젝트는 이벤트 생성, 보상 정의, 유저 보상 요청, 관리자 및 감사자 확인 기능을 제공하는 이벤트/보상 관리 시스템입니다.

## 시스템 구조

이 시스템은 마이크로서비스 아키텍처를 기반으로 3개의 서버로 구성되어 있습니다:

1. **Gateway Server (3000)**: 모든 API 요청의 진입점, 인증, 권한 검사 및 라우팅 담당
2. **Auth Server (3001)**: 유저 정보 관리, 로그인, 역할 관리, JWT 발급 담당
3. **Event Server (3002)**: 이벤트 생성, 보상 정의, 보상 요청 처리, 지급 상태 저장 담당

## 주요 기능

### 1. 이벤트 등록 / 조회
- 운영자 또는 관리자가 이벤트를 생성
- 이벤트에는 조건(예: 로그인 3일, 친구 초대 등)과 기간, 상태(활성/비활성) 정보 포함
- 등록된 이벤트는 목록 또는 상세 조회 가능

### 2. 보상 등록 / 조회
- 이벤트에 연결된 보상 정보 추가 가능
- 보상은 포인트, 아이템, 쿠폰 등 자유롭게 구성 가능하며 수량 포함
- 각 보상은 어떤 이벤트와 연결되는지 명확하게 구분

### 3. 유저 보상 요청
- 유저는 특정 이벤트에 대해 보상 요청 가능
- 시스템은 조건 충족 여부 검증
- 중복 보상 요청은 불가, 요청 상태(성공/실패 등) 기록

### 4. 보상 요청 내역 확인
- 유저는 본인의 요청 이력 조회 가능
- 운영자/감사자/관리자는 전체 유저의 요청 기록 조회 가능
- 필터링 기능(이벤트별, 상태별 등) 구현

## 역할 기반 접근 제어

시스템은 다음과 같은 역할(Roles)을 지원합니다:

- **USER**: 보상 요청 가능
- **OPERATOR**: 이벤트/보상 등록
- **AUDITOR**: 보상 이력 조회만 가능
- **ADMIN**: 모든 기능 접근 가능

## 기술 스택

- Node.js 18
- NestJS
- MongoDB
- JWT 인증
- Docker + docker-compose
- TypeScript

## 실행 방법

### 요구사항

- Docker 및 Docker Compose가 설치되어 있어야 합니다.

### 설치 및 실행

1. 프로젝트 클론

```bash
git clone <repository-url>
cd event-reward-system
```

2. Docker Compose로 실행

```bash
docker-compose up -d
```

3. 서비스 접근

- Gateway API: http://localhost:3000
- Auth API: http://localhost:3001
- Event API: http://localhost:3002

## API 문서

### Gateway Server (3000) 엔드포인트

#### 인증 관련
- `POST /auth/register` - 유저 등록
- `POST /auth/login` - 로그인 및 JWT 토큰 발급

#### 이벤트 관련
- `GET /events` - 모든 이벤트 조회
- `GET /events/:id` - 특정 이벤트 상세 조회
- `POST /events` - 새 이벤트 생성 (OPERATOR, ADMIN 권한 필요)
- `PUT /events/:id` - 이벤트 수정 (OPERATOR, ADMIN 권한 필요)
- `DELETE /events/:id` - 이벤트 삭제 (OPERATOR, ADMIN 권한 필요)

#### 보상 관련
- `POST /events/:id/rewards` - 이벤트에 보상 추가 (OPERATOR, ADMIN 권한 필요)
- `POST /events/:id/request` - 이벤트 보상 요청 (USER, ADMIN 권한 필요)
- `GET /rewards/history` - 사용자 보상 이력 조회 (USER, ADMIN 권한 필요)
- `GET /rewards/audit` - 모든 보상 요청 기록 감사 (AUDITOR, ADMIN 권한 필요)

## 설계 고려사항

### 마이크로서비스 아키텍처
- 각 서비스가 특정 책임을 담당하여 확장성과 유지보수성 향상
- Gateway를 통한 중앙 집중식 인증 및 권한 관리

### 보안
- JWT 기반 인증으로 보안 강화
- 역할 기반 접근 제어(RBAC)로 권한 관리

### 이벤트 조건 검증
- 유연한 조건 검증 로직으로 다양한 이벤트 시나리오 지원
- 자동 승인과 수동 승인을 조합하여 효율적인 워크플로우 구현

### 확장성
- MongoDB를 사용하여 스키마 유연성 확보
- 도커 컨테이너화로 배포 및 확장 용이성 확보
