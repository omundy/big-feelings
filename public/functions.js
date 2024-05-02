//////////////////////////////////////
//////////// UI FUNCTIONS ////////////
//////////////////////////////////////

/**
 *  Get HTML for a single "feeling circle"
 */
function getCircle(color) {
  let radius = 11;
  return `<span class="circle" style="width:${radius * 2}px; 
              height:${radius * 2}px; 
              background-color: ${color}; "></span>`;
}

/**
 *  Get HTML for an option in the select drop down
 */
function getOption(id, feeling, color) {
  return `<div class="option">
            ${getCircle(color)}
            <input type="radio" class="radio" id="${id}" name="feelings" />
            <label for="${id}">${feeling}</label>
          </div>`;
}

function displayData(data) {
  let list = "";
  // console.log(data);
  for (let row in data) {
    // console.log(data[row]);
    list += `
      <tr>
        <td>${getCircle(data[row].color)}</td> 
        <td>${data[row].id}</td> 
        <td>${data[row].feeling}</td> 
        <td>${data[row].color}</td>
        <td>${data[row].lat}</td>
        <td>${data[row].lng}</td>
        <td>${data[row].datetime}</td>
        </tr>`;
  }
  document.querySelector("#rows").innerHTML = list;
}

// header blur effect
let logo = document.querySelector("svg.logo");
let blur = 10;
let blurInt = setInterval(function () {
  blur = blur * 0.8;
  logo.style.filter = `blur(${blur}px)`;
  if (blur <= 0.001) {
    clearInterval(blurInt);
    logo.style.filter = `blur(0px)`;
  }
}, 170);

/**
 *  Create the list of options in the drop down (with color circles)
 */

function updateOptions(colors) {
  let optionsContainer = document.querySelector(".options-container");
  let selected = document.querySelector(".selected");
  let options = "";
  // for each option
  for (let row in colors) {
    options += getOption(row, colors[row].feeling, colors[row].color);
  }
  // append custom
  options += getOption(colors.length, "add your own!", "grey");
  // insert into html
  optionsContainer.innerHTML = options;

  // show dropdown
  selected.addEventListener("click", () => {
    optionsContainer.classList.toggle("active");
  });

  // add listener to each
  let optionsList = document.querySelectorAll(".option");

  optionsList.forEach((option) => {
    option.addEventListener("click", () => {
      selected.innerHTML = option.innerHTML;
      // console.log(selected.innerHTML);
      checkOne(selected.querySelector("input").id, colors);
      // hide dropdown
      optionsContainer.classList.remove("active");
    });
  });
}

function checkOne(id, colors) {
  let inputList = document.querySelectorAll('input[name="feelings"]');
  inputList.forEach((input) => {
    input.checked = false;
    if (input.id == id) input.checked = true;
  });
  // console.log(id, colors.length);

  // show / hide "other" input
  if (id == colors.length) {
    document.querySelector(".other").style.display = "block";
  } else {
    document.querySelector(".other").style.display = "none";
  }
}

let msg = document.querySelector(".msg");
function showSuccessMsg(str,color="white") {
  console.log("showSuccessMsg()", str);
  msg.innerHTML = str;
  msg.style.color = color;
  msg.classList.add("visible");
  setTimeout(function () {
    msg.classList.remove("visible");
  }, 2600);
}

