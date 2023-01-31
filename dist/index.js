"use strict";
const steps_indicator = document.getElementsByClassName("steps")[0].children;
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const s = document.getElementsByClassName("steps_automation")[0].children;
const b = document.getElementsByClassName("bill_options")[0].children;
const sw = document.getElementById("checkbox");
const a = document.getElementsByClassName("addons_list")[0].children;
const list = document.getElementById("g_s");
const t_d = document.getElementById("tot");
const l_a = document.getElementById("g_a");
const s_b = document.getElementById("step_btn");
const r_p = document.getElementById("change");
const fm = document.getElementsByClassName("iform")[0].children;
const e_1 = document.getElementById("err_1");
const e_2 = document.getElementById("err_2");
const e_3 = document.getElementById("err_3");
let current_step = 0;
let active_plan = 0;
let plan = {};
let addon = [];
let selection = {};
/**Toggle Active Step Button */
for (let i = 0; i < steps_indicator.length; i++) {
    let input_btn = steps_indicator[i].children[0];
    input_btn.addEventListener("click", () => {
        input_btn.classList.toggle("active");
    });
}
/**Hide Steps */
for (let i = 0; i < s.length; i++) {
    let x = s[i];
    if (s[i] !== s[current_step]) {
        x.style.display = "none";
    }
}
/**defined amount for each plan */
const planAmt = (index) => {
    let v = "0";
    if (index == 0)
        v = "9";
    if (index == 1)
        v = "12";
    if (index == 2)
        v = "15";
    return v;
};
/**defined amount for each addon */
const addnAmt = (index) => {
    let v = "0";
    if (index == 0)
        v = "1";
    if (index == 1)
        v = "2";
    if (index == 2)
        v = "2";
    return v;
};
/**Toggle Active Plan */
const toggleActivePlan = (active) => {
    b[active].classList.add("b_active");
    for (let i = 0; i < 3; i++) {
        if (i !== active) {
            b[i].classList.remove("b_active");
        }
    }
};
const getActivePlan = () => {
    const pl = JSON.parse(localStorage.getItem("plan"));
    for (let i = 0; i < 3; i++) {
        let name = b[i].children[1].children[0];
        if (pl && pl.name === name.innerHTML) {
            b[i].classList.add("b_active");
        }
    }
};
/**Get User Plan */
for (let i = 0; i < 3; i++) {
    let name = b[i].children[1].children[0];
    let amt = b[i].children[1].children[1];
    let btn = b[i];
    btn.addEventListener("click", function () {
        plan = {
            name: name.innerHTML,
            amount: planAmt(i),
            duration: "Yearly",
        };
        toggleActivePlan(i);
        localStorage.setItem("plan", JSON.stringify(plan));
    });
}
/**Plan Duration Toggle */
sw.addEventListener("click", function () {
    const plans = JSON.parse(localStorage.getItem("plan"));
    plans.duration = this.checked ? "Yearly" : "Monthly";
    localStorage.setItem("plan", JSON.stringify(plans));
});
/**Handle User Addons */
for (let i = 0; i < a.length; i++) {
    let a_sw = a[i].children[0].children[0].children[0];
    let a_nm = a[i].children[0].children[1].children[0];
    let panel = a[i];
    a_sw.addEventListener("click", () => {
        if (a_sw.checked) {
            addon.push({
                name: a_nm.innerHTML,
                amount: addnAmt(i),
            });
            panel.classList.add("p_active");
            localStorage.setItem("addons", JSON.stringify(addon));
        }
        else {
            panel.classList.remove("p_active");
            updateAddon(a_nm.innerHTML);
        }
    });
}
const getSelAddons = () => {
    // Retrieve array from the storage
    const addns = JSON.parse(localStorage.getItem("addons"));
    for (let i = 0; i < addns.length; i++) {
        for (let k = 0; k < a.length; k++) {
            let panel = a[k];
            let a_nm = a[k].children[0].children[1].children[0];
            let a_sw = a[k].children[0].children[0].children[0];
            if (addns[i].name == a_nm.innerHTML) {
                a_sw.checked = true;
                panel.classList.add("p_active");
            }
        }
    }
};
const removeAddon = () => {
    // Retrieve array from the storage
    const addns = JSON.parse(localStorage.getItem("addons"));
    if (addns && addns.length === 0) {
        localStorage.removeItem("addons");
    }
    addon = [];
};
const updateAddon = (name) => {
    // Retrieve array from the storage
    const addns = JSON.parse(localStorage.getItem("addons"));
    let s_a = addns.filter((a) => {
        if (a.name !== name) {
            return a;
        }
    });
    localStorage.setItem("addons", JSON.stringify(s_a));
};
const calcTotal = (p, a) => {
    let p_amt = Number(p.amount);
    let a_amt = a.reduce((acc, a) => acc + Number(a.amount), 0);
    return p_amt + a_amt;
};
const checkIn = () => {
    r_p.addEventListener("click", () => alert("sffs"));
};
function viewSelections() {
    // Retrieve the object from the storage
    const plans = JSON.parse(localStorage.getItem("plan"));
    const addns = JSON.parse(localStorage.getItem("addons"));
    const pl_temp = `<div class="plan">
    <span>
    <p class="desc">${plans.name}(${plans.duration})</p>
    <button id="r_p" onclick="checkIn">change</button>
    </span>
    <p class="amt">$${plans.amount}/mo</p>
  </div>`;
    const addn_template = addns.map((a) => {
        return `<div class="addon">
        <p class="name">${a.name}</p>
        <p class="amt">+$${a.amount}/mo</p>
      </div>`;
    });
    const tot_template = `
  <p class="t_l">Total(per month)</p>
  <p class="number">+$${calcTotal(plans, addns)}/mo</p>
  `;
    list.innerHTML = pl_temp;
    l_a.innerHTML = addn_template.join("");
    t_d.innerHTML = tot_template;
}
function showStep(n) {
    // This function will display the specified step of the form ...
    let x = s[n];
    x.style.display = "";
    // ... and fix the Previous/Next buttons:
    if (n == 0) {
        prevBtn.style.display = "none";
    }
    else {
        prevBtn.style.display = "inline";
    }
    if (n == s.length - 2) {
        viewSelections();
    }
    // ... and run a function that displays the correct step indicator:
    updateStepIndicator(n);
}
const removeItems = () => {
    localStorage.updateItem("plan");
    localStorage.updateItem("addons");
};
/**This Function handles the step 1 form required fields */
const reqField = () => {
    const dummyArr = [
        { el: fm[1] },
        { el: fm[0].children[1] },
        { el: fm[3] },
        { el: fm[2].children[1] },
        { el: fm[5] },
        { el: fm[4].children[1] },
    ];
    for (let i = 0; i < dummyArr.length; i++) {
        if (i / i !== 0) {
            let iE = dummyArr[i].el;
            iE.addEventListener("change", function () {
                if (this.value == "") {
                    dummyArr[i + 1].el.style.display = "block";
                    dummyArr[i + 1].el.style.color = "red";
                    this.style.borderColor = "red";
                }
                else {
                    dummyArr[i + 1].el.style.display = "";
                    dummyArr[i + 1].el.style.color = "";
                    this.style.borderColor = "";
                }
            });
        }
    }
};
function nextPrev(n) {
    // This function will figure out which step to display
    let x = s[current_step];
    // Exit the function if any field in the current step is invalid:
    //if (n == 1 && !validateForm()) return false;
    // Hide the current step:
    x.style.display = "none";
    // Increase or decrease the current step by 1:
    current_step = current_step + n;
    //
    if (current_step == 1)
        getActivePlan();
    //
    if (current_step == 2)
        getSelAddons();
    // if you have reached the end of the form... :
    if (current_step >= s.length) {
        //...the form gets submitted:
        alert("finished");
        // update plan and addons from local storage
        removeItems();
        return false;
    }
    // Otherwise, display the correct tab:
    showStep(current_step);
}
function updateStepIndicator(n) {
    for (let i = 0; i < steps_indicator.length; i++) {
        let x = steps_indicator[i].children[0];
        let y = steps_indicator[n].children[0];
        x.className = x.className.replace(" active", "");
        y.className += " active";
    }
}
showStep(current_step);
reqField();
/**<footer class="attribution">
      Challenge by
      <a href="https://www.frontendmentor.io?ref=challenge" target="_blank"
        >Frontend Mentor</a
      >. Coded by <a href="#">Your Name Here</a>.
    </footer> */
