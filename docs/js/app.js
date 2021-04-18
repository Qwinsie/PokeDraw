window.addEventListener("load", () => {
  let clearButton;
  let classifyButton
  let saveButton;

  let label
  let classifier
  let synth = window.speechSynthesis;
  const width = 256;
  const height = 256;

  let pX = null;
  let pY = null;
  let x = null;
  let y = null;

  let mouseDown = false;
  let currentColor = "black"
  let currentLineWidth = "5"

  const colorBtn = document.getElementById("color")
  const linewidthBtn = document.getElementById("linewidth")

  colorBtn.addEventListener('change', function changeColor(e) {
      currentColor = e.target.value
  })

  linewidthBtn.addEventListener('change', function changeLineWidth(e) {
      currentLineWidth = e.target.value
  })

  // preload()
  function preload() {
      for (let i = 0; i < 3; i++) {
          pokemons[i] = (`dataset/${i}.png`)
      }
      // setup2()
  }

  function setup2() {
      let pokemon = pokemons[Math.floor(Math.random() * pokemons.length)];
      question.src = pokemon
      console.log(pokemon)
  }

  setup();
  async function setup() {
    if(!localStorage.getItem("name")){
      window.location.href = "login.html";
    } else {
      // Show username
      let name = localStorage.getItem("name")
      const greeting = document.getElementById("greeting")
      greeting.innerHTML = `Welcome ${name}`

      // Create Canvas
      canvas = document.querySelector("#canvas");
      ctx = canvas.getContext("2d");
    
      // Load Model
      classifier = await ml5.imageClassifier("model/model.json", onModelReady);
    }
  }

  function onModelReady() {
    canvas.addEventListener("mousemove", onMouseUpdate);
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseup", onMouseUp);
    
    // Create a Message
    message = document.getElementById("message")
    // Create Add to Galary Button
    addToGalaryButton = document.querySelector("#add-to-galary")

    // Create a Save button
    saveButton = document.querySelector("#save");
    saveButton.addEventListener("click", saveDrawing);

    // Create a predict button
    classifyButton = document.querySelector("#classify");
    classifyButton.addEventListener("click", classifyCanvas);

    // Create a clear canvas button
    clearButton = document.querySelector("#clearBtn");
    clearButton.addEventListener("click", clearCanvas);

    // Create 'label' and 'confidence' div to hold results
    labelDiv = document.querySelector("#label");
    confidence = document.querySelector("#confidence");

    requestAnimationFrame(draw);
  }

  function clearCanvas() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);
    console.log("Clear")
    classifyButton.disabled = true
    clearButton.disabled = true
    saveButton.disabled = true
    addToGalaryButton.disabled = true
  }

  function draw() {
    let request = requestAnimationFrame(draw);

    if (pX == null || pY == null) {
      ctx.beginPath();
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, width, height);

      pX = x;
      pY = y;
    }

    // Set stroke weight to 10
    ctx.lineWidth = currentLineWidth;
    // Set stroke color to black
    ctx.strokeStyle = currentColor;
    // If mouse is pressed, draw line between previous and current mouse positions
    if (mouseDown === true) {
      classifyButton.disabled = false
      clearButton.disabled = false
      saveButton.disabled = false
      ctx.beginPath();
      ctx.lineCap = "round";
      ctx.moveTo(x, y);
      ctx.lineTo(pX, pY);
      ctx.stroke();
    }

    pX = x;
    pY = y;
  }

  function onMouseDown(e) {
    mouseDown = true;
  }

  function onMouseUp(e) {
    mouseDown = false;
  }

  function onMouseUpdate(e) {
    const pos = getMousePos(canvas, e);
    x = pos.x;
    y = pos.y;
  }

  function getMousePos(canvas, e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  // Classify Canvas
  function classifyCanvas() {
    classifier.classify(canvas, gotResult);
  }

  function saveDrawing() {
    console.log("saving")
    const image = document.getElementById("canvas").toDataURL(`image/png`);
    const anchor = document.createElement('a');
    anchor.href = image;
    anchor.download = `${getCurrentDate()}.png`;
    anchor.click();
  };

  function getCurrentDate(){
      let currentdate = new Date(); 
      return  currentdate.getDate() + "_"
              + (currentdate.getMonth()+1)  + "_" 
              + currentdate.getFullYear() + "_"  
              + currentdate.getHours() + "_"  
              + currentdate.getMinutes() + "_" 
              + currentdate.getSeconds();
  }

  function addToLocalStorage() {
    const image = document.getElementById("canvas").toDataURL(`image/png`);
    console.log(label)
    try {
      for (let i = 1; i < localStorage.length; i++){
        if(label == localStorage.key(i)) {
          console.log(`You already have ${label} in your Gallery`)
        }
      }
      localStorage.setItem(label, image);
    }
    catch (e) {
      console.log("Storage failed: " + e);
    }
  }

  // A function to run when we get any errors and the results
  function gotResult(error, results) {
    // Display error in the console
    if (error) {
      console.error(error);
    }
    // Ability to add to galary
    addToGalaryButton.disabled = false
    // The results are in an array ordered by confidence.
    console.log(results);
    // Show the first label and confidence
    label = results[0].label
    addToGalaryButton.innerHTML = `📁 Add ${label} to the Gallery`
    let result = Math.round(results[0].confidence * 1000) / 10
    message.innerHTML = `I think this is a drawing of a ${label} with an ${result}%`
    synth.speak(new SpeechSynthesisUtterance(`I think this is a drawing of a ${label} with an ${result}%`));
    addToGalaryButton.addEventListener("click", addToLocalStorage)
  }
})