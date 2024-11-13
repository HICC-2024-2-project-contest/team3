# 우당탕탕 TRPG 대작전! (가제)

## 1. 개요 (Overview) 
친구들과 TRPG(ORPG)를 즐길 수 있는 플랫폼입니다. 2024-2 HICC 프로젝트 제출물입니다.  
A platform to play TRPG (ORPG) with friends. This is a 2024-2 HICC project submission.  

## 2. 기능들 (Features)
1. **TRPG 게임 (TRPG Games)**  
친구들끼리 모여서 TRPG(ORPG) 게임을 즐길 수 있습니다. GM을 AI로 대체시키는 모드를 지원합니다.  
You can play TRPG (ORPG) games with your friends. Supports a mode that replaces the GM with an AI. 
    
2. **커스텀 룰북 (Custom Rulebook)**  
게임의 룰북을 만들고, 서로 공유할 수 있는 창작마당을 지원합니다. 해당 설정을 차용해서 간편하게 세션에 추가할 수 있습니다. 
Supports a workshop where you can create your own rulebooks and share them with each other. You can borrow their settings and easily add them to your session. <br/>

3. **멀티 플랫폼 (multi-platform)**  
데스크탑, 모바일 등 여러 기기에서 접속하여 플레이할 수 있습니다. <br/>
Access and play across multiple devices, including desktop and mobile. <br/>

4. **랭크전 (beta) (Ranked Play (beta))**  
TRPG를 죽지 않고 성공적으로 끝내면 점수가 오릅니다. 세션 중 캐릭터가 죽으면 점수가 떨어지고, 세션에서 관전모드가 됩니다. <br/>
Successfully completing a TRPG without dying increases your score. If your character dies during the session, your score will drop and you will be placed in spectator mode for the session. <br/>

5. **GM 모드 (싱글플레이) (GM Mode (Single Player))**  
GM이 되어, AI 플레이어들의 게임을 이끌 수 있습니다. <br/>
Become a GM and lead a game of AI players. <br/>

6. **세션 기록 및 리플레이**  
이미 끝난 세션을 기록하여, 로그를 불러올 수 있습니다. <br/>
You can record sessions that have already ended and import the log. <br/>

## 3. 스크린샷 (Screenshots)
...

## 4. 빌드 (Build)
### Requirements
* docker
* docker compose
### Build
`git clone https://github.com/Tafka-4/TRPG-Platform`을 통해 레포지토리를 로컬로 다운받은 후, `docker-compose up --build` 명령으로 플랫폼을 올릴 수 있습니다. `docker-compose down -v`로 서버를 다운시킬 수 있습니다. <br/>
After downloading the repository locally with `git clone https://github.com/Tafka-4/TRPG-Platform`, you can bring the platform up with the command `docker-compose up --build`. You can bring the server down with `docker-compose down -v`.

## 5. 만든 사람들 (Devs)
Backend, PM: 임승민 (Tafka4) 1st Grade  
Frontend: 조승완 (Wany) 3rd Grade

