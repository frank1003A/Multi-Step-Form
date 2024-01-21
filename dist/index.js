"use strict";
const steps_indicator = document.getElementsByClassName("steps")[0].children;
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const s = document.getElementsByClassName("steps_automation")[0].children;
const b = document.getElementsByClassName("bill_options")[0].children;
const plans = document.querySelector(".bill_options");
const planDurationCheckbox = document.getElementById("checkbox");
const addonsSelections = document.querySelector(".selections");
const a = document.getElementsByClassName("addons_list")[0].children;
let addonsList = document.querySelector(".addons_list");
let addons = addonsList.querySelectorAll(".addon");
const s_b = document.getElementById("step_btn");
const changeBtn = document.getElementById("change_btn");
const btnCont = document.getElementById("btn-cont");
let form = document.querySelector(".iform");
let current_step = 0;
let plan = {};
let addon = [];
let selection = {};

const setActiveStep = (n) => {
  localStorage.setItem("active_step", n);
};

const getActiveStep = () => {
  return localStorage.getItem("active_step");
};

let active_step = getActiveStep("active_step");

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
  if (index == 0) v = "9";
  if (index == 1) v = "12";
  if (index == 2) v = "15";
  return v;
};

/**defined amount for each addon */
const addnAmt = (index) => {
  let v = "0";
  if (index == 0) v = "1";
  if (index == 1) v = "2";
  if (index == 2) v = "2";
  return v;
};

/**Toggle Active Plan */
const toggleActivePlan = (active) => {
  let el = plans.querySelectorAll("button");
  el[active].classList.add("b_active");

  for (let i = 0; i < el.length; i++) {
    if (i !== active) {
      el[i].classList.remove("b_active");
    }
  }
};

// get active plan from ls
const getActivePlan = () => {
  const pl = JSON.parse(localStorage.getItem("plan"));
  if (pl !== null) {
    for (let i = 0; i < 3; i++) {
      let name = plans.querySelectorAll(".plan_name").item(i);
      if (pl && pl.name === name.innerHTML) {
        toggleActivePlan(i);
      }
      if (pl && pl.duration == "Yearly") {
        planDurationCheckbox.checked = true;
        updatePlanAmt(planDurationCheckbox);
      }
    }
  }
};

const setPlan = (idx) => {
  let amount = planAmt(idx);
  let name = plans.querySelectorAll(".plan_name");
  plan = {
    name: name.item(idx).innerHTML,
    amount: planDurationCheckbox.checked ? `${Number(amount) * 10}` : amount,
    duration: planDurationCheckbox.checked ? "Yearly" : "Monthly",
  };
  toggleActivePlan(idx);
  localStorage.setItem("plan", JSON.stringify(plan));
};

/**Get User Plan */
const handlePlanSelect = () => {
  let planBtn = plans.querySelectorAll("button");

  planBtn.forEach((btn, idx) => {
    btn.addEventListener("click", function () {
      setPlan(idx);
      removeAddon();
    });
  });
};

// updates the yr to mo in plan view
const updatePlanAmt = (checkbox) => {
  let planAmt = plans.querySelectorAll(".plan_amount");
  let planMonthFree = plans.querySelectorAll(".plan_free_month");
  const amtArr = [9, 12, 15];
  //
  planAmt.forEach((a, idx) => {
    let value = "";
    if (checkbox.checked) {
      value = "$" + `${amtArr[idx] * 10}/yr`;
      planMonthFree[idx].style.display = "block";
    } else {
      value = "$" + `${amtArr[idx]}/mo`;
      planMonthFree[idx].style.display = "none";
    }
    a.innerHTML = value;
  });
};
/**Plan Duration Toggle */
planDurationCheckbox.addEventListener("click", function () {
  updatePlanAmt(this);
  const plans = JSON.parse(localStorage.getItem("plan"));
  let old_amt = Number(plans.amount) / 10;
  let new_amt = Number(plans.amount) * 10;
  if (this.checked) {
    plans.duration = "Yearly";
    plans.amount = new_amt.toString();
    localStorage.setItem("plan", JSON.stringify(plans));
  } else {
    plans.duration = "Monthly";
    plans.amount = old_amt.toString();
    localStorage.setItem("plan", JSON.stringify(plans));
  }
  removeAddon();
});

planDurationCheckbox.addEventListener("keyup", function (e) {
  let state = this.checked;
  if (e.key === "Enter") {
    this.checked = !state;
    updatePlanAmt(this);
    const plans = JSON.parse(localStorage.getItem("plan"));
    let old_amt = Number(plans.amount) / 10;
    let new_amt = Number(plans.amount) * 10;
    if (this.checked) {
      plans.duration = "Yearly";
      plans.amount = new_amt.toString();
      localStorage.setItem("plan", JSON.stringify(plans));
    } else {
      plans.duration = "Monthly";
      plans.amount = old_amt.toString();
      localStorage.setItem("plan", JSON.stringify(plans));
    }
    removeAddon();
  }
});

/**Handle User Addons */
for (let i = 0; i < addons.length; i++) {
  // input & p tag in first child of panel
  let panels = addons;
  let addonNames = addonsList.querySelectorAll("p");
  let checkboxes = addonsList.querySelectorAll(`input`);
  checkboxes.item(i).addEventListener("click", () => {
    const pl = JSON.parse(localStorage.getItem("plan"));
    let amt = addnAmt(i);
    if (checkboxes.item(i).checked) {
      addon.push({
        name: addonNames.item(i).innerHTML,
        amount: pl.duration == "Yearly" ? `${Number(amt) * 10}` : amt,
      });
      panels.item(i).classList.add("p_active");
      localStorage.setItem("addons", JSON.stringify(addon));
    } else {
      panels.item(i).classList.remove("p_active");
      updateAddon(addonNames.item(i).innerHTML);
    }
  });
}

addonsList.querySelectorAll(`input`).forEach((checkbox, i) => {
  let panels = addons;
  let addonNames = addonsList.querySelectorAll("p");
  let checkboxes = addonsList.querySelectorAll(`input`);
  const pl = JSON.parse(localStorage.getItem("plan"));
  let amt = addnAmt(i);
  checkbox.addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
      checkbox.checked = !checkbox.checked;
      if (checkbox.checked) {
        addon.push({
          name: addonNames.item(i).innerHTML,
          amount: pl.duration == "Yearly" ? `${Number(amt) * 10}` : amt,
        });
        panels.item(i).classList.add("p_active");
        localStorage.setItem("addons", JSON.stringify(addon));
      } else {
        panels.item(i).classList.remove("p_active");
        updateAddon(addonNames.item(i).innerHTML);
      }
    }
  });
});
// re-renders the yr to mo suffix in the amount view
const updateAddonView = () => {
  const pl = JSON.parse(localStorage.getItem("plan"));
  // looping through html collection for addons_list only if plan is in ls
  if (pl) {
    for (let i = 0; i < addons.length; i++) {
      let amt = addnAmt(i);
      // span element for addons amount
      let amtEl = addons[i].children[1];
      if (pl.duration == "Yearly") {
        amtEl.innerHTML = `$${Number(amt) * 10}/yr`;
      } else {
        amtEl.innerHTML = `$${Number(amt)}/mo`;
      }
    }
  }
};
// render all the addons in ls
const getSelAddons = () => {
  // Retrieve array from the storage
  const addns = JSON.parse(localStorage.getItem("addons"));
  let addonNames = addonsList.querySelectorAll("p");
  let checkboxes = addonsList.querySelectorAll(`input`);
  if (addns !== null && addns.length > 0) {
    for (let i = 0; i < addns.length; i++) {
      for (let k = 0; k < addons.length; k++) {
        let panel = addons.item(k);
        if (addns[i].name === addonNames[k].innerHTML) {
          checkboxes.item(k).checked = true;
          panel.classList.add("p_active");
        }
      }
    }
  }
};
// removes addon from ls if they are unchecked and re-renders the UI
const removeAddon = () => {
  // Retrieve array from the storage
  const addns = JSON.parse(localStorage.getItem("addons"));
  if (addns && addns.length !== 0) {
    localStorage.removeItem("addons");
  }
};
// updates selected addons in ls if user didn't finish steps
// and is attempting to start from where they last stopped
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
// calcuates the total amount of plan and addons selected
const calcTotal = (p, a) => {
  let p_amt = Number(p.amount);
  let a_amt = a.reduce((acc, a) => acc + Number(a.amount), 0);
  return p_amt + a_amt;
};

changeBtn.addEventListener("click", () => {
  nextPrev(-2);
});

const addonEl = (name) => {
  return addonsSelections.querySelector(name);
};

const el = (name) => {
  return document.querySelector(name);
};
// function programmatically display user selected plan and addons
function viewSelections() {
  // Retrieve the object from the storage
  const plans = JSON.parse(localStorage.getItem("plan"));
  const addns = JSON.parse(localStorage.getItem("addons"));

  if (plans == null || addns == null) {
    return;
  }
  let suffix = plans.duration === "Yearly" ? "yr" : "mo";

  addonEl(".desc").innerHTML = `${plans.name}(${plans.duration})`;
  addonEl(".amt").innerHTML = `$${plans.amount}/${suffix}`;

  if (plans !== null && addns !== null) {
    const addn_template = addns.map((a) => {
      return `<div class="addon">
        <p class="name">${a.name}</p>
        <p class="amt">+$${a.amount}/${suffix}</p>
      </div>`;
    });
    addonEl(".addons").innerHTML = addn_template.join("");
  } else {
    return;
  }

  el(".total_desc").innerHTML = `Total(per ${
    plans.duration === "Yearly" ? "year" : "month"
  })`;
  el(".number").innerHTML = `+$${calcTotal(plans, addns)}/${suffix}`;
}
function showStep(n) {
  let planBtn = plans.querySelectorAll("button");
  // This function will display the specified step of the form ...

  if (current_step > 0) {
    prevBtn.style.display = "block";
  } else {
    prevBtn.style.display = "none";
  }
  if (n == 3) {
    viewSelections();
    nextBtn.style.backgroundColor = "hsl(243, 100%, 62%)";
    nextBtn.innerHTML = "Submit";
  } else {
    nextBtn.style.backgroundColor = "hsl(213, 96%, 18%)";
    nextBtn.innerHTML = "Next";
  }

  if (n == 4) {
    btnCont.style.display = "none";
  }
  // ... and run a function that displays the correct step indicator:
  updateStepIndicator(n);
}
// remove all items from ls if user finished all step
const removeItems = () => {
  localStorage.updateItem("plan");
  localStorage.updateItem("addons");
};
// media query function remove the button
// containers when inputs are in focus
let sm = window.matchMedia("(max-width: 500px)");
const removeBtnOnFocus = (sm) => {
  let form = document.forms[0];
  let name = form.children[1];
  let email = form.children[3];
  let phone = form.children[5];
  let pe = getComputedStyle(btnCont);
  if (sm.matches) {
    name.addEventListener("focusin", () => (btnCont.style.display = "none"));
    name.addEventListener("focusout", () => (btnCont.style.display = ""));
    email.addEventListener("focusin", () => (btnCont.style.display = "none"));
    email.addEventListener("focusout", () => (btnCont.style.display = ""));
    phone.addEventListener("focusin", () => (btnCont.style.display = "none"));
    phone.addEventListener("focusout", () => (btnCont.style.display = ""));
  }
};
removeBtnOnFocus(sm);
sm.addEventListener("changer", () => removeBtnOnFocus);
// buttons
nextBtn.addEventListener("click", function () {
  let animate = localStorage.getItem("animation_state");
  validateInputs();
  if (animate === "animating") {
    this.enabled = "false";
  }
});
prevBtn.addEventListener("click", () => nextPrev(-1));

// toggler for form required fields styling
const toggleReqField = (input, label, name) => {
  if (input.value == "") {
    label.innerHTML = name + " is required";
    label.style.display = "block";
    label.classList.add("color_change");
    input.classList.add("outline_change");
  } else {
    label.style.display = "";
    label.classList.remove("color_change");
    input.classList.remove("outline_change");
  }
};
// triggered by next button press to trigger
// moving to next step or requring input to fields
const validateInputs = () => {
  let count = 0;
  let inputs = form.querySelectorAll("input");

  inputs.forEach((input) => {
    if (input.value == "") {
      reqField();
      input.focus();
    } else {
      count = count + 1;
    }
  });

  if (count === inputs.length) {
    nextPrev(1);
  } else {
    return;
  }
};
/**This Function handles the step 1 form required fields */
const reqField = () => {
  let inputs = form.querySelectorAll("input");
  let labels = form.querySelectorAll("#err");
  const names = ["name", "email", "phone"];

  inputs.forEach((input, idx) => {
    toggleReqField(input, labels.item(idx), names[idx]);
    // listen for changes to input then intiate another toggle
    input.addEventListener("change", function () {
      toggleReqField(input, labels.item(idx), names[idx]);
    });
  });
};

const startAnimation = (n, x, nextStep) => {
  let startTime;

  const animate = (timestamp) => {
    if (!startTime) startTime = timestamp;

    const progress = timestamp - startTime;

    if (progress < animationDuration) {
      const progressPercentage = progress / animationDuration;
      updateAnimation(progressPercentage);
      requestAnimationFrame(animate);
      localStorage.setItem("animation_state", "animating");
      nextBtn.disabled = "true";
      prevBtn.disabled = "true";
    } else {
      // Animation complete
      localStorage.setItem("animation_state", "not animating");
      x.style.display = "none";
      x.classList.remove("slide_in_left");
      x.classList.remove("slide_out_left");
      x.classList.remove("slide_in_right");
      x.classList.remove("slide_out_right");
      s[nextStep].style.display = "block";
      nextBtn.removeAttribute("disabled");
      prevBtn.removeAttribute("disabled");
    }
  };

  const updateAnimation = (progressPercentage) => {
    const isNegativeIndex = Math.sign(n) === -1;
    const animationState = isNegativeIndex
      ? "slide_out_right"
      : "slide_out_left";
    const nextAnimationState = isNegativeIndex
      ? "slide_in_left"
      : "slide_in_right";

    if (isNegativeIndex && x.classList.contains("slide_in_right")) {
      x.classList.replace("slide_in_right", "slide_out_right");
    } else {
      x.classList.add(animationState);
    }
    s[nextStep].classList.add(nextAnimationState);
  };

  const animationDuration = 500;

  // Trigger the animation loop
  requestAnimationFrame(animate);
};

const checkActivePlan = () => {
  let hasPlan = localStorage.getItem("plan");
  if (hasPlan == null) {
    nextBtn.disabled = "true";
    return;
  } else {
    nextBtn.removeAttribute("disabled");
  }
};

function checkActiveAddon() {
  let hasAddon = localStorage.getItem("addon") == null;
  if (active_step !== 2) {
    return;
  }
  if (hasAddon) {
    nextBtn.disabled = "true";
    return;
  }
  nextBtn.removeAttribute("disabled");
}

function nextPrev(n) {
  let x = s[current_step];
  current_step = current_step + n;
  let nextStep = current_step;

  setActiveStep(current_step);

  if (current_step === 1) {
    getActivePlan();
  }

  if (current_step == 3) {
    getSelAddons();
    updateAddonView();
  }
  // if you have reached the end of the form... :
  if (current_step >= s.length) {
    // update plan and addons from local storage
    removeItems();
    return;
  }
  startAnimation(n, x, nextStep);
  // Otherwise, display the correct tab:
  showStep(current_step);
}

// updates the sidebar steps indicator
function updateStepIndicator(active) {
  for (let i = 0; i < steps_indicator.length; i++) {
    let n = steps_indicator[i].children[0];
    let c = steps_indicator[active].children[0];
    n.classList.remove("active");
    c.classList.add("active");
  }
}

prevBtn.style.display = "none";
s[current_step].classList.add("slide_in_left");
handlePlanSelect();
showStep(current_step);
setActiveStep(0);
