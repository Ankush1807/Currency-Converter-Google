// https://www.exchangerate-api.com/docs/pair-conversion-requests

const apiKey = "52e9637028018541860ce2aa";
const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair`;

// for selecting both the dropdowns
const dropdowns = $("select");
console.log(dropdowns);

for (let select of dropdowns) {
  for (currCode in countryList) {
    // creating new option element for every currCode and adding it to both selects
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    }
    if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  // calling to update flag whwn select changes
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// from and to currency option chosen can be fetched by fromCurr.val(), toCurr.val()
const fromCurr = $(".from select");
const toCurr = $(".to select");

//update flag based on what user selects from both dropdowns using country code in flag api
const updateFlag = (element) => {
  let currencyCode = element.value;
  console.log(currencyCode);
  let countryCode = countryList[currencyCode];
  console.log(countryCode);
  let newImgSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let image = element.parentElement.querySelector("img");
  image.src = newImgSrc;
};

//function to call excahnge rate api and then update dom for msg class
async function exchangeCurrency() {
  let amount = $(".input_from").val();
  console.log(amount);
  //if amount mpty or negative take and calculate according to 1.
  if (amount === "" || amount < 1) {
    amount = 1;
    $(".input_from").val("1");
  }

  const newURL = `${url}/${fromCurr.val()}/${toCurr.val()}/${amount}`;
  console.log(newURL);

  //api call
  let response = await fetch(newURL);
  let data = await response.json();
  console.log(data);
  console.log(data.conversion_result);
  let updatedTime = data.time_last_update_unix;

  //updating the result
  // $(".msg").text(`${amount} ${fromCurr.val()} = ${data.conversion_result.toFixed(2)} ${toCurr.val()}`);
  $(".time").text(convertUnixToIST(updatedTime));
  $(".from_heading").text(`${amount} ${fromCurr.val()} equals`);
  $(".to_heading").text(`${data.conversion_result.toFixed(2)} ${toCurr.val()}`);

  $(".input_to").val(data.conversion_result.toFixed(2));
}

// to show by default conversion on start of page.
$(document).ready(function () {
  exchangeCurrency();
});

// Function to convert Unix timestamp to IST
function convertUnixToIST(unixTimestamp) {
  // Create a new JavaScript Date object based on the timestamp
  const date = new Date(unixTimestamp * 1000); // Unix timestamps are in seconds, so multiply by 1000 to convert to milliseconds

  // Format the date manually
  const ISTString = date
    .toString()
    .replace(/GMT\+0530 \(India Standard Time\)/, "IST");

  return ISTString;
}

// Get a reference to the input field
const inputFieldFrom = document.querySelector(".input_from");

// Add an event listener for the 'input' event
inputFieldFrom.addEventListener("input", function (event) {
  // This function will be called whenever the input value changes
  const inputValue = event.target.value;
  console.log("Input value changed to:", inputValue);
  exchangeCurrency();
});

async function exchangeCurrency2() {
  let amount = $(".input_to").val();
  console.log(amount);
  //if amount mpty or negative take and calculate according to 1.
  if (amount === "" || amount < 1) {
    amount = 1;
    $(".input_to").val("1");
  }

  const newURL = `${url}/${toCurr.val()}/${fromCurr.val()}/${amount}`;
  console.log(newURL);

  //api call
  let response = await fetch(newURL);
  let data = await response.json();
  console.log(data);
  console.log(data.conversion_result);
  let updatedTime = data.time_last_update_unix;

  //updating the result
  // $(".msg").text(`${amount} ${fromCurr.val()} = ${data.conversion_result.toFixed(2)} ${toCurr.val()}`);
  $(".time").text(convertUnixToIST(updatedTime));
  $(".from_heading").text(`${amount} ${toCurr.val()} equals`);
  $(".to_heading").text(
    `${data.conversion_result.toFixed(2)} ${fromCurr.val()}`
  );

  $(".input_from").val(data.conversion_result.toFixed(2));
}

// Get a reference to the input field
const inputFieldTo = document.querySelector(".input_to");

// Add an event listener for the 'input' event
inputFieldTo.addEventListener("input", function (event) {
  // This function will be called whenever the input value changes
  const inputValue1 = event.target.value;
  console.log("Input value changed to:", inputValue1);
  exchangeCurrency2();
});
