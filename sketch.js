let radio;
let submitButton;
let resultText = '';
let questionData = []; // 題目資料
let currentQuestion = 0;
let correctCount = 0;
let incorrectCount = 0;

function preload() {
  // 直接在程式碼中定義題目資料
  questionData = [
    {
      question: '1) 2+2=?',
      options: ['4', '8', '10', '3'],
      answer: '4'
    },
    {
      question: '2) 10-8?',
      options: ['0', '7', '5', '2'],
      answer: '2'
    },
    {
      question: '3) 9-4=?',
      options: ['8', '5', '2', '1'],
      answer: '5'
    }
  ];
}

function setup() {
  // 讓畫布充滿視窗
  createCanvas(windowWidth, windowHeight);
  background('#f2e9e4'); // 淺色背景

  // 設定選項 (radio)
  radio = createRadio();
  radio.style('font-size', '20px');
  radio.position(windowWidth / 2 - 100, windowHeight / 2 + 50);

  // 設定送出按鈕
  submitButton = createButton('下一題');
  submitButton.style('font-size', '20px');
  submitButton.position(windowWidth / 2 - 30, windowHeight / 2 + 150);
  submitButton.mousePressed(nextQuestion);

  // 顯示第一題
  loadQuestion(currentQuestion);
}

function draw() {
  background('#f2e9e4');

  // 計算矩形的寬和高
  let rectWidth = windowWidth / 2;
  let rectHeight = windowHeight / 2;

  // 計算矩形的左上角位置，使其置中
  let rectX = (windowWidth - rectWidth) / 2;
  let rectY = (windowHeight - rectHeight) / 2;

  // 繪製矩形 淺黃色
  fill('#e9edc9');
  stroke(0); // 黑色邊框
  rect(rectX, rectY, rectWidth, rectHeight, 10); // 圓角矩形

  // 設定文字樣式
  fill(0); // 黑色文字
  textSize(25); // 文字大小
  textAlign(CENTER, CENTER); // 文字置中

  // 在矩形內顯示題目
  if (currentQuestion < questionData.length) {
    let question = questionData[currentQuestion].question;
    text(question, rectX + rectWidth / 2, rectY + rectHeight / 4);
  } else {
    // 顯示測驗結果
    text(`測驗結束！`, rectX + rectWidth / 2, rectY + rectHeight / 4);
    text(`答對：${correctCount} 題`, rectX + rectWidth / 2, rectY + rectHeight / 2 - 20);
    text(`答錯：${incorrectCount} 題`, rectX + rectWidth / 2, rectY + rectHeight / 2 + 20);
  }

  // 顯示結果文字
  text(resultText, windowWidth / 2, windowHeight / 2 + 210);
}

// 當視窗大小改變時，重新設定畫布大小，物件也會重新繪製
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  radio.position(windowWidth / 2 - 100, windowHeight / 2 + 50);
  submitButton.position(windowWidth / 2 - 30, windowHeight / 2 + 150);
}

// 載入題目
function loadQuestion(index) {
  if (index < questionData.length) {
    let question = questionData[index].question;
    let options = questionData[index].options;

    radio.html(''); // 清空選項
    options.forEach((option) => {
      radio.option(option, option);
    });

    radio.show(); // 顯示選項
    resultText = ''; // 清空結果文字
  } else {
    // 測驗結束，改變按鈕文字
    radio.hide();
    submitButton.html('再試一次');
    submitButton.mousePressed(restartQuiz);
  }
}

// 下一題或重新開始
function nextQuestion() {
  if (currentQuestion < questionData.length) {
    let correctAnswer = questionData[currentQuestion].answer; // 正確答案
    let answer = radio.value();

    if (answer === correctAnswer) {
      correctCount++;
      resultText = '答對了！';
    } else {
      incorrectCount++;
      resultText = '答錯了！';
    }

    // 前往下一題
    currentQuestion++;
    if (currentQuestion < questionData.length) {
      loadQuestion(currentQuestion);
    } else {
      // 測驗結束
      radio.hide();
      submitButton.html('再試一次');
      submitButton.mousePressed(restartQuiz);
    }
  }
}

function restartQuiz() {
  // 重置測驗狀態
  currentQuestion = 0;
  correctCount = 0;
  incorrectCount = 0;
  resultText = '';
  submitButton.html('下一題');
  submitButton.mousePressed(nextQuestion);
  radio.show();
  loadQuestion(currentQuestion);
}
