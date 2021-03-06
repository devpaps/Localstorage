(function () {
  "use strict";

  var btn_store = document.getElementById("btn_store");
  btn_store.addEventListener("click", validate);

  var btn_get = document.getElementById("btn_get");
  btn_get.addEventListener("click", get);

  // Sparar data från input till localstorage
  function store(vara, antal) {

    localStorage.setItem(vara, antal);

    // Visar texten, "Sparat", det här inte direkt DRY men jag har inte kollat upp att man kan göra på något annat sätt
    setTimeout(function () {
      var pop_up = document.getElementById("pop_up");
      pop_up.style.visibility = "visible";
    }, 20);

    // Tar bort texten, "Sparat"
    setTimeout(function () {
      var pop_up = document.getElementById("pop_up");
      pop_up.style.visibility = "hidden";
    }, 1500);

    // Kallar på funktionen och rensar input
    clearFields(vara, antal);
  }

  // Validerar input fälten
  function validate(vara, antal) {
    // https://stackoverflow.com/questions/18042133/check-if-input-is-number-or-letter-javascript
    var vara = document.getElementById("vara").value;
    var antal = document.getElementById("antal").value;
    // Kör med regex som jag läste om på stackoverflow. Sedan gick jag in på https://regex101.com/ för att se vad jag kunde använda mig av
    // .match är en funktion som kollar om det matchar regex som jag angett. Det måste matcha exakt det som regex innhåller
    if (vara === "" && antal === "") {
      alert("Du måste fylla i båda fälten");
      return;
    } else if (!antal.match(/^\d+$/)) {
      document.getElementById("antal").style.border = "2px solid red";
      alert("Du får bara ange siffor");
      return;
    } else if (!vara.match(/^[a-ö-A-Ö ]+$/)) {
      document.getElementById("vara").style.border = "2px solid red";
      alert("Du får bara ange bokstäver");
      return;
    }
    return store(vara, antal);
  }

  // Rensar input
  function clearFields() {
    document.getElementById("vara").value = "";
    document.getElementById("antal").value = "";
  }

  // Visar data från localstorage och lägger det snyggt i en tabell
  function get() {

    // Om det inte finns något lagrat i localstorage och användaren trycker på hämta-knappen, så visas en alert
    if (localStorage.length === 0) {
      alert("Du har inte sparat något!");
      return;
    } else {
      // Gör knapparna oklickabara
      document.getElementById("btn_store").setAttribute("disabled", "");
      document.getElementById("btn_get").setAttribute("disabled", "");
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Traversing_an_HTML_table_with_JavaScript_and_DOM_Interfaces#Creating_a_table_dynamically_.28back_to_Sample1.html.29
    var visa = document.getElementById("resultat");
    var table = document.createElement("table");
    var tbody = document.createElement("tbody");

    // Gör tableHeadern
    var thead = table.createTHead();
    var row = document.createElement("tr");
    var cell = document.createElement("td");
    var text = document.createTextNode("Dina varor, " + localStorage.length + " st");
    cell.appendChild(text);
    thead.appendChild(cell);
    row.appendChild(thead);
    tbody.appendChild(row);
    table.appendChild(tbody);
    visa.appendChild(table);

    // Loopar igenom localstorage
    for (var i in localStorage) {
      if (localStorage.hasOwnProperty(i)) {
        var varde = localStorage[i];
        var _row = document.createElement("tr");
        var _cell = document.createElement("td");
        var _text = document.createTextNode(i + ", " + varde + " st");
        _cell.appendChild(_text);
        _row.appendChild(_cell);
        tbody.appendChild(_row);
        table.appendChild(tbody);
        visa.appendChild(table);
      }
    }

    // Skapar en "ta bort" knapp av listan
    var ta_bort = document.createElement("button");
    var s = document.createTextNode("Radera lista");
    ta_bort.classList.add("btn");
    ta_bort.setAttribute("id", "btn_remove");
    ta_bort.style.marginTop = "3rem";
    ta_bort.appendChild(s);
    visa.appendChild(ta_bort);

    // Lägger till en eventlistener på den för att den ska starta remove_list funktionen
    var btn_remove = document.getElementById("btn_remove");
    btn_remove.addEventListener("click", remove_list);
  }

  function remove_list() {
    var svar = confirm("Vill du verkligen ta bort listan?");

    // Här tar jag bort tabellen samt knappen om användaren svara Ok
    if (svar === true) {
      localStorage.clear();
      var table = document.getElementsByTagName("table")[0];
      var btn_remove = document.getElementById("btn_remove");
      var resultat = document.getElementById("resultat");
      resultat.removeChild(table);
      resultat.removeChild(btn_remove);

      // Gör knapparna klickabara igen
      document.getElementById("btn_store").removeAttribute("disabled");
      document.getElementById("btn_get").removeAttribute("disabled");
    } else {
      return;
    }
  }
})();