import Papa from "papaparse";

const input1 = <HTMLInputElement>document.getElementById("name1");
const input2 = <HTMLInputElement>document.getElementById("name2");
const button = <HTMLElement>document.querySelector("button");
const label = <HTMLElement>document.getElementById("label");
const fileInput = <HTMLInputElement>document.getElementById("csv");

function sum(num: Number | String): String {
  let numString = num.toString();
  let newString = "";

  // while loop will process the string until there is either 1 or 0 characters left
  while (numString.length > 1) {
    // add the sum of your first and last character to your newString
    newString += (
      parseInt(numString[0]) + parseInt(numString[numString.length - 1])
    ).toString();

    // removes the first and last character from numString now that its been saved in newString
    numString = numString.substring(1, numString.length - 1);
  }
  // Add the remaining characters to newString
  newString += numString;
  if (newString.length > 2) {
    // if the newString in more than 2 characters, run the method again
    // console.log(newString);
    return sum(newString);
  } else {
    return newString;
  }
}

function charCount(str1: String, str2: String) {
  const str = `${str1} matches ${str2}`;

  // removes whitespace and applies lowercase
  let onlyCharacters = str.trim().toLowerCase();

  // calculates frequency of characters from string
  const result = [...onlyCharacters].reduce((a: any, e: any) => {
    a[e] = a[e] ? a[e] + 1 : 1;
    return a;
  }, {});

  // extracts totals from result array
  const values = Object.values(result);

  // joins values from values array
  const output = +values.join("");
  const sumReturned = +sum(output);
  if (sumReturned > 80) {
    return `${str} ${sum(output)}%, good match`;
  } else {
    return `${str} ${sum(output)}%`;
  }
}

// resets form
function resetForm() {
  label.innerText = "";
  input1.value = "";
  input2.value = "";
  fileInput.value = "";
}

// for submit even listener
button.addEventListener("click", function (e) {
  e.preventDefault();
  const input1Val = input1.value;
  const input2Val = input2.value;
  resetForm();
  const letters = /^[A-Za-z]+$/;
  // Validation guards
  if (input1Val === "" || input2Val === "") {
    label.innerText =
      "Please enter a value for name one and name two or upload a CSV";
    return;
  }
  if (!input1Val.match(letters) || !input2Val.match(letters)) {
    label.innerText = "Please enter alphabetic characters only";
    return;
  }
  label.innerText = charCount(input1Val, input2Val);
});

// file upload event listener
fileInput.addEventListener("change", function (e: any) {
  if (!e.target.files || e.target.files.length === 0) {
    // you can display the error to the user
    console.error("Select a file");
    return;
  }
  let file = e.target.files[0];
  Papa.parse(file, {
    complete: function (results: any) {
      const output = results.data.map((res: any) => {
        return res.toString().trim().replace(/\s/g, "");
      });
      const males = output
        .filter((name: string) => name.includes(",m"))
        .map((item: string) => item.replace(",m", ""));
      const females = output
        .filter((name: string) => name.includes(",f"))
        .map((item: string) => item.replace(",f", ""));
      const uniqueMales = [...new Set(males)];
      const uniqueFemales = [...new Set(females)];

      let charCountResults = Array();
      uniqueMales.forEach((male: any) => {
        uniqueFemales.forEach((female: any) => {
          charCountResults.push(charCount(male, female));
        });
      });

      charCountResults.sort(function (a: any, b: any) {
        function getValue(s: string) {
          return s.match(/\d+/) || 0;
        }
        return +getValue(b) - +getValue(a);
      });

      console.log(charCountResults);
      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(
        new Blob([charCountResults.join("\n")], { type: "text/plain" })
      );
      a.download = "output.txt";
      a.click();
      label.innerText = "The results have been saved to output.txt";
    },
  });
});
