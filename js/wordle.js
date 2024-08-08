const 정답 = "APPLE";

// handleKeydown 함수에서 초기 시도값, 초기 인덱스값
let attempts = 0;
let index = 0;

// ※camel표기법 : 자바스크립트에서 함수명을 지정하는 규칙
function appStart() {
  // 전체를 함수로 감쌈

  // 구현순서[6]
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

  // 구현순서[5]
  const displayGameover = () => {
    // 자바로 html 구현해보기
    // 오타확률이 높기때문에 추천하지는 않음
    const div = document.createElement("div");
    const body = document.querySelector("body");

    div.innerText = "Game Over!";
    div.style =
      "width: 100%; height: 100%; background-color: #ffffffa0; display:flex; justify-content:center; align-items:center; position:absolute; top:50%; left:50%; transform: translate(-50%,-50%); font-size:50px; font-weight:900; color:red;";
    body.style = "position:relative;";

    document.body.appendChild(div);
  };

  // 구현순서[4]
  const gameover = () => {
    // 조건충족 시 키보드 이벤트 종료
    window.removeEventListener("keydown", handleKeydown);
    displayGameover();

    // 추가작업 : 게임종료 시 타이머를 클리어함
    clearInterval(timer);
  };

  // 구현순서[3]
  const nextLine = () => {
    attempts += 1; // 시도값 증가
    index = 0; // 인덱스값 초기화

    // 6줄이 될 경우 게임종료
    if (attempts === 6) return gameover();
  };

  // 구현순서[2]
  const handleEnterKey = () => {
    let 맞은갯수 = 0;

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

    // 엔터키 누르면 다음 줄로가는 함수호출
    nextLine();

    // 알파벳 5글자가 모두 정답과 일치할 경우 게임종료
    if (맞은갯수 === 5) gameover();
  };

  // 구현순서[1]
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
