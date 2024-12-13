import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.css';
import * as bootstrap from 'bootstrap';

function next(nextPage) {
    console.log("Next function called");
    let required = {};
    let inputs = document.querySelectorAll("input");
    let selects = document.querySelectorAll("select");

    let missingFields = false;

    // Validate input fields
    inputs.forEach((el) => {
        let pat = new RegExp(el.pattern);
        if (el.type === "radio") {
            if (el.checked) {
                required[el.name] = el.value;
                return;
            }
        } else if (el.required) {
            if (el.value.length === 0) {
                el.parentNode.children[1].children[0].innerText = "Field Cannot be empty";
                missingFields = true;
            } else if (pat && !pat.test(el.value)) {
                el.parentNode.children[1].children[0].innerText = "Wrong Format";
                missingFields = true;
            } else {
                el.parentNode.children[1].children[0].innerText = "";
            }
        }
        required[el.name] = el.value;
    });

    // Validate select fields
    selects.forEach((el) => {
        let pat = new RegExp(el.pattern);
        if (el.required) {
            if (el.value.length === 0) {
                el.parentNode.children[1].children[0].innerText = "Field Cannot be empty";
                missingFields = true;
            } else if (pat && !pat.test(el.value)) {
                el.parentNode.children[1].children[0].innerText = "Wrong Format";
                missingFields = true;
            } else {
                el.parentNode.children[1].children[0].innerText = "";
            }
        }
        required[el.name] = el.value;
    });

    // Proceed if no missing fields
    if (!missingFields) {
        let cached = window.localStorage.getItem("store");
        if (cached) {
            cached = JSON.parse(cached);
            cached = { ...cached, ...required };
        } else {
            cached = required;
        }
        
        console.log("Storing data in local storage:", cached);
        window.localStorage.setItem("store", JSON.stringify(cached));
        
        // Navigate to the next page
        window.location.href = `${window.location.origin}/${nextPage}`;
    } else {
        console.warn("Cannot proceed due to missing fields.");
    }
}

function back(page) {
    if (window.confirm("Are you sure you want to go back?")) {
        window.location.href = `${window.location.origin}/${page}`;
    }
}

function loadInfo() {
    let tbody = document.querySelector("tbody");
    let store = JSON.parse(window.localStorage.getItem("store"));
    
    if (store) {
        let info = [
            store.txtLastName,
            store.txtFirstName,
            store.txtMiddleName,
            store.txtCourse,
            store.txtCampusCode,
            store.txtClass,
            store.txtEmail,
            new Date(store.txtExamDate),
        ];

        for (let i=0; i<tbody.childElementCount; i++) {
            let td = tbody.children[i].children[1];
            td.innerText = info[i];
        }
    } else {
        console.warn("No stored information found.");
    }
}

// Attach functions to the global window object
window.next = next;
window.back = back;
window.loadInfo = loadInfo;
