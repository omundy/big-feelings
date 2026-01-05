// main.js (client side, run by the browser) 

//////////////////////////////////////
/////////////// INIT /////////////////
//////////////////////////////////////

// base url for 10.3
let baseurl = "https://big-feelings.vercel.app";

// ⚠️ base url for localhost testing
// baseurl = "http://localhost:3000";
// ⚠️ 

// 👉 add new base url to pull from your own database (Chapter 10 wiki) ...
baseurl = "";
// 👈



// declare data in global scope so to access from other functions
let data = [];

async function main() {
    // 👉 add code inside this function (Chapter 10) ...

    data = await fetchFeelings();
    console.log("data", data);

    // update the map
    await updateMap(data);

    // 👈
}
main();

// create interface
(async () => {
    // update drop down
    updateOptions(colors);
})();


//////////////////////////////////////
///////////// FUNCTIONS //////////////
//////////////////////////////////////

// Fetch feelings data from the API server 
async function fetchFeelings() {
    return await fetchData(baseurl + "/api/feelings");
}
// a test file
async function fetchTestFeelings() {
    return await fetchData("/assets/data/test-feelings.json");
}

/**
 *  Fetch data from a URL
 */
async function fetchData(url) {
    return await fetch(url)
        .then((response) => response.json())
        .then((json) => {
            // console.log("fetch() response", json);
            return json;
        })
        .catch((err) => {
            throw new Error("Issue retrieving data from API");
        });
}



/**
 * Submit form handler
 */
function submitForm(e) {
    try {
        // 👉 add code inside this function (Chapter 10 wiki) ...

        // step 1 - get form data
        e.preventDefault();
        let data = getFormData();
        console.log("data", data);

        // extra
        if (data.feeling == "" || data.lat == "" || data.lng == "") {
            throw new Error("The feeling or location is missing");
        }

        // step 2 - create options object to send data
        let options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };
        // console.log("submit", data);

        // step 3 - use fetch to send data
        fetch(baseurl + "/api/feeling", options)
            .then((response) => response.json())
            .then(async (json) => {
                console.log("/feeling", json);
                await updateMap(json);
                showSuccessMsg("Your feeling was added", data.color);
            }).catch((err) => console.error("submitForm() error", err));

        // 👈
    } catch (e) {
        showSuccessMsg("Please add a feeling and select a location", "white");
    }
}



/**
 *  Get form data
 */
function getFormData() {
    // references
    let location = document.querySelector("#location");
    // get checked option
    let id = document.querySelector('input[name="feelings"]:checked').id;

    // update
    let feeling = "";
    let color = "";

    // if the checked option is in colors
    if (id < colors.length) {
        feeling = colors[id].feeling;
        color = colors[id].color;
    } else {
        // they chose "addYourOwn"
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

