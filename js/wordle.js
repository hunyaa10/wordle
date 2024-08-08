const 정답 = "APPLE";

let attempts = 0;
let index = 0;
let timer; // setInterval의 아이디를 호출하기 위해 지정

function appStart(){
  const displayGameover = ()=>{
    // 자바로 html 구현해보기
    // 오타확률이 높기때문에 추천하지는 않음
    const div = document.createElement('div');
    const body = document.querySelector('body');

    div.innerText = '게임이 종료됬습니다.';
    div.style = 
    'width: 100%; height: 100%; background-color: #ffffffa0; display:flex; justify-content:center; align-items:center; position:absolute; top:50%; left:50%; transform: translate(-50%,-50%); font-size:50px; font-weight:900; color:red;';
    body.style = 
    'position:relative;'

    document.body.appendChild(div);
  };

  const gameover = ()=>{
    // 조건충족 시 키보드 이벤트 종료
    window.removeEventListener("keydown", handleKeydown);
    displayGameover();
    clearInterval(timer);
    // 게임종료 시 타이머도 정지됨
  };

  const nextLine = ()=>{
    // 다음줄로
    attempts += 1;
    index = 0;
    if(attempts === 6) return gameover();
  };

  const handleEnterKey = ()=>{
    let 맞은갯수 = 0;

    // 정답확인
    console.log("Enter!!")
    for(let i=0;i<5;i++){
      const block = document.querySelector(
        `.board-column[data-index='${attempts}${i}']`
      )
      // console.log(block.innerText)
      const 입력글자 = block.innerText;
      const 정답글자 = 정답[i];
      // 입력글자와 정답글자가 같은지 비교
      // console.log(입력글자, 정답글자)

      if(입력글자 === 정답글자){
        block.style.background = "#6aaa64";
        맞은갯수 += 1;
      } else if(정답.includes(입력글자)){
        block.style.background = "#c9b458";
      } else{
        block.style.background = "#c8c8c8";
        block.style.color = "red";
      }
    }

    if(맞은갯수 === 5) gameover();

    nextLine();
  };

  const handleBackspace = ()=>{
    if(index > 0){
      const preBlock = document.querySelector(
        `.board-column[data-index='${attempts}${index-1}']`
      );
      // 해당블럭의 이전블럭을 지정
      preBlock.innerText = "";
      // 이전블럭의 내용을 없앰
    }
    if(index !== 0) index -= 1;
  };

  const handleKeydown = (e) => {
    // console.log("키 눌림! event=>", e);
    // 콘솔창에 어떤 이벤트가 발생했는지 보여줌

    console.log(e.key, e.keyCode);
    // 해당 키의 값과 키코드(숫자)값
    // a(65) ~ z(90)

    const key = e.key.toUpperCase();
    const keyCode = e.keyCode;
    const thisBlock = document.querySelector(
      `.board-column[data-index='${attempts}${index}']`
      // 0번째 시도의 0번째 인덱스
    );

    if(e.key === 'Backspace') handleBackspace();
    else if(index === 5){
      if(e.key === "Enter") handleEnterKey();
      else return;
    } else if(65 <= keyCode && keyCode <=90){
      thisBlock.innerText = key;
      index++;
    }
  }

  const startTimer = ()=>{
    const realTime = new Date();//현재시각

    function setTimer(){
      const eventTime = new Date();//구현시작시간
      const timerTime = new Date(eventTime - realTime);

      const min = timerTime.getMinutes().toString().padStart(2,'0');
      const sec = timerTime.getSeconds().toString().padStart(2,'0');
      const Timer = document.querySelector('.timer');

      Timer.innerText = `${min}:${sec}`;
    }

    timer = setInterval(setTimer,1000);
    // console.log(timer)
    // setInterval의 아이디 호출 >> 1
  };

  startTimer();
  window.addEventListener("keydown",handleKeydown);
}

appStart();