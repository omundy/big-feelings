// client-side js run by the browser

async function main() {
  // 👉 add code inside this function (from Chapter 10) ...

  // get feelings data
  let data = await fetchFeelings();
  // update the map
  await updateMap(data);
  await displayData(data);

  // 👈
}
main();

function submitForm(e) {
  e.preventDefault();

  // 👉 add code inside this function (from Chapter 10) ...

  let data = getFormData();
  console.log("data", data);

  // create options object to send data, options
  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  // console.log("submit", data);
  fetch("/api/feeling", options)
    .then((response) => response.json())
    .then(async (json) => {
      // console.log("/feeling", json);
      await updateMap(json);
      await displayData(json);
      showSuccessMsg("Your feeling was added");
    });

  // 👈
}

/**
 *  Submit event listener
 */
document.querySelector("form").addEventListener("submit", submitForm);

//////////////////////////////////////
///////////// FUNCTIONS //////////////
//////////////////////////////////////

// global placeholder for colors
let colors;
// create interface
(async () => {
  colors = await getColors();
  // update drop down
  updateOptions(colors);
})();

/**
 *  Get colors.json
 */
async function getColors() {
  return fetch("./colors.json")
    .then((response) => response.json())
    .then((json) => {
      // console.log("colors.json", json);
      return json;
    });
}

/**
 *  Fetch feelings from database
 */
async function fetchFeelings() {
  return fetch("/api/feelings")
    .then((response) => response.json())
    .then((json) => {
      // console.log("/feelings", json);
      return json;
    });
}

/**
 *  Gets form data
 */
function getFormData() {
  // references
  let location = document.querySelector("#location");
  // get checked option
  let id = document.querySelector('input[name="feelings"]:checked').id;

  // update
  let feeling = "";
  let color = "";

  // if the checked option is in colors.json
  if (id < colors.length) {
    feeling = colors[id].feeling;
    color = colors[id].color;
  } else {
    // otherwise they chose "other"
    feeling = this.text.value;
    color = this.color.value;
  }
  // split the value of
  let [lat, lng] = location.value.split(",");
  // console.log(feeling, color, lat, lng);

  return {
    feeling: feeling,
    color: color,
    lat: lat,
    lng: lng,
  };
}

// turns of Glitch warnings for these files (defined outside of this file)
var updateMap = window.updateMap;
var displayData = window.displayData;
var updateOptions = window.updateOptions;
var showSuccessMsg = window.showSuccessMsg;
