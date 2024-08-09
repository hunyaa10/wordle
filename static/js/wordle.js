// handleKeydown 함수에서 초기 시도값, 초기 인덱스값
let attempts = 0;
let index = 0;

// ※camel표기법 : 자바스크립트에서 함수명을 지정하는 규칙
function appStart() {
  // 전체를 함수로 감쌈

  // 구현순서[6] : 백스페이스
  const handleBackspace = () => {
    if (index > 0) {
      /* ★★★★★
      단어를 입력한 후 인덱스번호가 1 증가됨
      따라서 현재 인덱스 번호는 마지막으로 단어가 입력된 박스의 인덱스+1
      백스페이스를 누르면 현재박스가 아닌 이전박스의 내용이 지워지도록 해야함
      */
      // 1. 이전블럭을 변수로 지정
      const preBlock = document.querySelector(
        `.board-column[data-index='${attempts}${index - 1}']`
      );
      // 2. 이전블럭의 내용을 빈칸으로 만듦
      preBlock.innerText = "";
      // 3. 인덱스 번호를 1 줄임
      if (index !== 0) index -= 1;
    }
  };

  // 구현순서[5] : 게임종료 시 화면css
  const displayGameover = () => {
    // 자바로 html 구현해보기
    // 오타확률이 높기때문에 추천하지는 않음
    const div = document.createElement("div");
    const body = document.querySelector("body");
    // 추가작업 : 재시도버튼
    const btn = document.createElement("button");

    div.innerText = "Game Over!";
    div.style =
      "width: 100%; height: 100vh; background-color: #ffffffe1; display:flex; justify-content:center; align-items:center; position:absolute; top:50%; left:50%; transform: translate(-50%,-50%); font-size:50px; font-weight:900; color:red;";
    body.style = "position:relative;";
    btn.innerText = "Retry";
    btn.style =
      "display: block; padding: 4px 8px; cursor: pointer; position:absolute; z-index: 99; top: 60%; left: 50%; transform: translateX(-50%)";

    document.body.appendChild(div);
    document.body.appendChild(btn);

    // 추가작업 : 버튼클릭 시 화면새로고침
    btn.addEventListener("click", () => {
      location.reload();
    });
  };

  // 구현순서[4] : 게임종료
  const gameover = () => {
    // 조건충족 시 키보드 이벤트 종료
    window.removeEventListener("keydown", handleKeydown);
    displayGameover();

    // 추가작업 : 게임종료 시 타이머를 클리어함
    clearInterval(timer);
  };

  // 구현순서[2] : 엔터키 입력
  const handleEnterKey = async () => {
    let 맞은갯수 = 0;
    // ★★★★★파이썬으로 백앤드와 정보교환연습★★★★★
    // 서버에 요청을 보내는 비동기로직
    const 응답 = await fetch("/answer");
    // await: 서버로 요청을 보낸 후 응답이 올때까지 기다림(async와 함께 사용)
    // fetch(): 자바스크립트에서 서버로 정보를 요청할 때 쓰는 함수
    const 정답 = await 응답.json();
    // 정답을 불러옴
    // json(): 받은 응답을 json 포멧으로 바꿔줌
    // await: 포멧이 변경될때까지 기다림

    // 1. for문을 사용하여 박스를 하나씩 호출함
    for (let i = 0; i < 5; i++) {
      const block = document.querySelector(
        `.board-column[data-index='${attempts}${i}']`
        // index를 i로 대체
      );
      // console.log(block.innerText)

      // 2. 입력한 글자와 정답글자를 변수로 지정
      const 입력글자 = block.innerText;
      const 정답글자 = 정답[i];
      // console.log(입력글자, 정답글자)

      // 3. if문을 사용하여 입력글자와 정답글자를 비교
      if (입력글자 === 정답글자) {
        // 입력글자와 정답이 완전히 같은 경우
        block.style.background = "#6aaa64";
        block.style.color = "#fff";
        맞은갯수 += 1;
      } else if (정답.includes(입력글자)) {
        // 입력글자가 정답에 포함되어 있는 경우
        block.style.background = "#c9b458";
        block.style.color = "#fff";
      } else {
        block.style.background = "#c8c8c8";
        block.style.color = "red";
      }
    }

    // 구현순서[3] : 다음줄로 이동
    // 시도값은 증가시키고, 인덱스값은 초기화시킴
    attempts += 1;
    index = 0;

    // 조건에 따라 게임종료
    if (맞은갯수 === 5) {
      correctAnswer();
    } else if (attempts === 6 && 맞은갯수 !== 5) {
      gameover();
    }
  };

  // 추가작업 : 정답 시 화면css
  const correctAnswer = () => {
    const div = document.createElement("div");
    const body = document.querySelector("body");
    const img = document.createElement("img");

    div.innerText = "정답입니다!";
    div.style =
      "width: 100%; height: 100%; background-color: #ffffffe1; display:flex; justify-content:center; align-items:center; position:absolute; top:50%; left:50%; transform: translate(-50%,-50%); font-size:50px; font-weight:900; color:green;";
    body.style = "position:relative;";
    img.src = "./img/흰둥이.webp";
    img.style =
      "width:100px; position:absolute; z-index: 99; top: 30%; left: 45%; animation: spin 2s infinite linear;";

    document.body.appendChild(div);
    document.body.appendChild(img);

    clearInterval(timer);
  };

  // 추가작업 : 키패드 클릭
  let keypad = document.querySelectorAll(".key");
  keypad.forEach((e) => {
    e.addEventListener("click", () => {
      const keyWord = e.getAttribute("data-key");
      const thisBlock = document.querySelector(
        `.board-column[data-index='${attempts}${index}']`
      );

      if (keyWord === "back") handleBackspace();
      else if (index === 5) {
        if (keyWord === "enter") handleEnterKey();
        else return;
      } else {
        thisBlock.innerText = keyWord;
        index++;
      }
    });
  });

  // 구현순서[1] : 알파벳 입력
  const handleKeydown = (e) => {
    // console.log("키 눌림! event=>", e);
    // 콘솔창에 어떤 이벤트가 발생했는지 보여줌

    console.log(e.key, e.keyCode);
    // 해당 키의 값과 키코드(숫자)값 >> a(65) ~ z(90)

    // 1. key와 keyCode를 변수로 지정
    const key = e.key.toUpperCase();
    const keyCode = e.keyCode;

    // 2. 키를 눌렀을 때 들어갈 박스를 변수로 지정
    const thisBlock = document.querySelector(
      `.board-column[data-index='${attempts}${index}']`
      // ".board-column[data-index='00']"
      // 0번째 시도의 0번째 인덱스
    );

    // 3. 알파벳 키값만 입력이 되게 if문 사용
    if (e.key === "Backspace") handleBackspace();
    // 백스페이스를 누를 경우, 알파벳 삭제 >> 나중에 함수작성
    else if (index === 5) {
      // 인덱스가 5일 경우(5칸이 입력된 후), 함수중단 또는 엔터키 작동
      if (e.key === "Enter") handleEnterKey();
      else return;
    } else if (65 <= keyCode && keyCode <= 90) {
      thisBlock.innerText = key;
      // 해당 박스에 키값을 대입
      index++;
      // 키보드 누른 후 박스의 인덱스 번호 증가
    }
  };
  window.addEventListener("keydown", handleKeydown);

  // 추가작업 : 타이머
  let timer; // setInterval의 아이디를 호출하기 위해 지정
  const startTimer = () => {
    const realTime = new Date(); //현재시각

    function setTimer() {
      const eventTime = new Date(); //구현시작시간
      const timerTime = new Date(eventTime - realTime);

      const min = timerTime.getMinutes().toString().padStart(2, "0");
      const sec = timerTime.getSeconds().toString().padStart(2, "0");
      const Timer = document.querySelector(".timer");

      Timer.innerText = `${min}:${sec}`;
    }

    timer = setInterval(setTimer, 1000);
    // console.log(timer) >> setInterval의 아이디 호출 : 1
  };
  startTimer();
}

appStart();
