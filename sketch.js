let radio;
let submitButton;
let resultText = '';
let questionData = [];
let currentQuestion = 0;
let correctCount = 0;
let incorrectCount = 0;
let inputBox; // 用於填空題的文字框

function preload() {
  // 載入 CSV 檔案
  questionData = loadTable('questions.csv', 'csv', 'header');
}

function setup() {
  // 讓畫布充滿視窗
  createCanvas(windowWidth, windowHeight);
  background('#f2e9e4');

  // 設定選項 (radio)
  radio = createRadio();
  radio.style('font-size', '35px');
  radio.position(windowWidth / 2 - 50, windowHeight / 2 + 50);

  // 設定文字框 (inputBox) 用於填空題
  inputBox = createInput('');
  inputBox.style('font-size', '20px');
  inputBox.position(windowWidth / 2 - 100, windowHeight / 2 + 50);
  inputBox.hide(); // 預設隱藏，僅在填空題時顯示

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

  // 繪製矩形
  fill('#f9c22e'); // 黃色
  rect(rectX, rectY, rectWidth, rectHeight);

  // 設定文字樣式
  fill(0); // 黑色文字
  textSize(35); // 文字大小
  textAlign(CENTER, CENTER); // 文字置中

  // 在矩形內顯示題目或結果
  if (currentQuestion < questionData.getRowCount()) {
    let question = questionData.getString(currentQuestion, 'question');
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
  radio.position(windowWidth / 2 - 50, windowHeight / 2 + 50);
  inputBox.position(windowWidth / 2 - 100, windowHeight / 2 + 50);
  submitButton.position(windowWidth / 2 - 30, windowHeight / 2 + 150);
}

// 載入題目
function loadQuestion(index) {
  if (index < questionData.getRowCount()) {
    let questionType = questionData.getString(index, 'type'); // 題目類型 (radio 或 input)
    let question = questionData.getString(index, 'question');

    if (questionType === 'radio') {
      // 顯示選項題
      let options = [
        questionData.getString(index, 'option1'),
        questionData.getString(index, 'option2'),
        questionData.getString(index, 'option3'),
        questionData.getString(index, 'option4')
      ];

      radio.html(''); // 清空選項
      options.forEach((option) => {
        radio.option(option, option);
      });

      radio.show(); // 顯示選項
      inputBox.hide(); // 隱藏文字框
    } else if (questionType === 'input') {
      // 顯示填空題
      radio.hide(); // 隱藏選項
      inputBox.show(); // 顯示文字框
      inputBox.value(''); // 清空文字框
    }

    resultText = ''; // 清空結果文字
  } else {
    // 測驗結束，改變按鈕文字
    radio.hide();
    inputBox.hide();
    submitButton.html('再試一次');
  }
}

// 下一題或重新開始
function nextQuestion() {
  if (currentQuestion < questionData.getRowCount()) {
    let questionType = questionData.getString(currentQuestion, 'type'); // 題目類型
    let correctAnswer = questionData.getString(currentQuestion, 'answer'); // 正確答案

    if (questionType === 'radio') {
      // 檢查選項題答案
      let answer = radio.value();
      if (answer === correctAnswer) {
        correctCount++;
        resultText = '答對了！';
      } else {
        incorrectCount++;
        resultText = '答錯了！';
      }
    } else if (questionType === 'input') {
      // 檢查填空題答案
      let answer = inputBox.value().trim();
      if (answer === correctAnswer) {
        correctCount++;
        resultText = '答對了！';
      } else {
        incorrectCount++;
        resultText = '答錯了！';
      }
    }

    // 前往下一題
    currentQuestion++;
    if (currentQuestion < questionData.getRowCount()) {
      loadQuestion(currentQuestion);
    } else {
      // 測驗結束
      radio.hide();
      inputBox.hide();
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
