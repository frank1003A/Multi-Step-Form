//
interface Plan {
  name?: string;
  amount?: string;
  duration?: string;
}

interface Addon {
  name?: string;
  amount?: string;
}

interface Selections {
  plan?: Plan;
  addon?: Addon[];
}

const steps_indicator = document.getElementsByClassName("steps")[0].children;
const prevBtn = document.getElementById("prevBtn") as HTMLButtonElement;
const nextBtn = document.getElementById("nextBtn") as HTMLButtonElement;
const s = document.getElementsByClassName("steps_automation")[0].children;
const b = document.getElementsByClassName("bill_options")[0].children;
const sw = document.getElementById("checkbox") as HTMLInputElement;
const a = document.getElementsByClassName("addons_list")[0].children;
const list = document.getElementById("g_s") as HTMLDivElement;
const t_d = document.getElementById("tot") as HTMLDivElement;
const l_a = document.getElementById("g_a") as HTMLDivElement;
const s_b = document.getElementById("step_btn") as HTMLDivElement;
const r_p = document.getElementById("change") as HTMLButtonElement;
const btnCont = document.getElementById("btn-cont") as HTMLDivElement;
let current_step: number = 0;

let plan: Plan = {};
let addon: Addon[] = [];
let selection: Selections = {};

/**Hide Steps */
for (let i = 0; i < s.length; i++) {
  let x = s[i] as HTMLDivElement;
  if (s[i] !== s[current_step]) {
    x.style.display = "none";
  }
}

/**defined amount for each plan */
const planAmt = (index: number): string => {
  let v = "0";
  if (index == 0) v = "9";
  if (index == 1) v = "12";
  if (index == 2) v = "15";
  return v;
};

/**defined amount for each addon */
const addnAmt = (index: number): string => {
  let v = "0";
  if (index == 0) v = "1";
  if (index == 1) v = "2";
  if (index == 2) v = "2";
  return v;
};

/**Toggle Active Plan */
const toggleActivePlan = (active: number) => {
  b[active].classList.add("b_active");
  for (let i = 0; i < 3; i++) {
    if (i !== active) {
      b[i].classList.remove("b_active");
    }
  }
};

const getActivePlan = () => {
  const pl: Plan = JSON.parse(localStorage.getItem("plan") as string);
  for (let i = 0; i < 3; i++) {
    let name = b[i].children[1].children[0] as HTMLParagraphElement;
    if (pl && pl.name === name.innerHTML) {
      b[i].classList.add("b_active");
    }
    if (pl && pl.duration == "Yearly") {
      sw.checked = true;
      updatePlanAmt(sw);
    }
  }
};

/**Get User Plan */
for (let i = 0; i < 3; i++) {
  let name = b[i].children[1].children[0] as HTMLParagraphElement;
  let amt = b[i].children[1].children[1] as HTMLParagraphElement;
  let btn = b[i] as HTMLButtonElement;
  btn.addEventListener("click", function () {
    let amount = planAmt(i);
    plan = {
      name: name.innerHTML,
      amount: sw.checked ? `${Number(amount) * 10}` : amount,
      duration: sw.checked ? "Yearly" : "Monthly",
    };
    toggleActivePlan(i);
    localStorage.setItem("plan", JSON.stringify(plan));
    removeAddon();
  });
}

const updatePlanAmt = (sw: HTMLInputElement) => {
  let amt1 = b[0].children[1].children[1] as HTMLParagraphElement;
  let amt2 = b[1].children[1].children[1] as HTMLParagraphElement;
  let amt3 = b[2].children[1].children[1] as HTMLParagraphElement;
  let p31 = b[0].children[1].children[2] as HTMLParagraphElement;
  let p32 = b[1].children[1].children[2] as HTMLParagraphElement;
  let p33 = b[2].children[1].children[2] as HTMLParagraphElement;

  //
  sw.checked ? (amt1.innerHTML = `$${9 * 10}/yr`) : (amt1.innerHTML = `$9/mo`);
  sw.checked
    ? (amt2.innerHTML = `$${12 * 10}/yr`)
    : (amt2.innerHTML = `$12/mo`);
  sw.checked
    ? (amt3.innerHTML = `$${15 * 10}/yr`)
    : (amt3.innerHTML = `$15/mo`);

  //
  if (sw.checked) {
    p31.style.display = "block";
    p32.style.display = "block";
    p33.style.display = "block";
  } else {
    p31.style.display = "none";
    p32.style.display = "none";
    p33.style.display = "none";
  }
};

/**Plan Duration Toggle */
sw.addEventListener("click", function () {
  updatePlanAmt(sw);
  const plans: Plan = JSON.parse(localStorage.getItem("plan") as string);
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

/**Handle User Addons */
for (let i = 0; i < a.length; i++) {
  // parent element with className: addon
  let panel = a[i] as HTMLDivElement;
  // input & p tag in first child of panel
  let a_sw = a[i].children[0].children[0].children[0] as HTMLInputElement;
  let a_nm = a[i].children[0].children[1].children[0] as HTMLParagraphElement;

  a_sw.addEventListener("click", () => {
    const pl: Plan = JSON.parse(localStorage.getItem("plan") as string);
    let amt = addnAmt(i);
    if (a_sw.checked) {
      addon.push({
        name: a_nm.innerHTML,
        amount: pl.duration == "Yearly" ? `${Number(amt) * 10}` : amt,
      });
      panel.classList.add("p_active");
      localStorage.setItem("addons", JSON.stringify(addon));
    } else {
      panel.classList.remove("p_active");
      updateAddon(a_nm.innerHTML);
    }
  });
}

const updateAddonView = () => {
  const pl: Plan = JSON.parse(localStorage.getItem("plan") as string);
  // looping through html collection for addons_list only if plan is in ls
  if (pl) {
    for (let i = 0; i < a.length; i++) {
      let amt = addnAmt(i);
      // span element for addons amount
      let a_mt = a[i].children[1] as HTMLSpanElement;
      if (pl.duration == "Yearly") {
        a_mt.innerHTML = `$${Number(amt) * 10}/yr`;
      } else {
        // do nothing
      }
    }
  }
};

const getSelAddons = () => {
  // Retrieve array from the storage
  const addns: Addon[] = JSON.parse(localStorage.getItem("addons") as string);
  if (addns !== null && addns.length > 0) {
    for (let i = 0; i < addns.length; i++) {
      for (let k = 0; k < a.length; k++) {
        let panel = a[k] as HTMLDivElement;
        let a_nm = a[k].children[0].children[1]
          .children[0] as HTMLParagraphElement;
        let a_sw = a[k].children[0].children[0].children[0] as HTMLInputElement;
        if (addns[i].name == a_nm.innerHTML) {
          a_sw.checked = true;
          panel.classList.add("p_active");
        }
      }
    }
  } else {
    // do nothing
  }
};

const removeAddon = () => {
  // Retrieve array from the storage
  const addns: Addon[] = JSON.parse(localStorage.getItem("addons") as string);
  if (addns && addns.length !== 0) {
    localStorage.removeItem("addons");
  }
};

const updateAddon = (name: string) => {
  // Retrieve array from the storage
  const addns: Addon[] = JSON.parse(localStorage.getItem("addons") as string);
  let s_a = addns.filter((a) => {
    if (a.name !== name) {
      return a;
    }
  });
  localStorage.setItem("addons", JSON.stringify(s_a));
};

const calcTotal = (p: Plan, a: Addon[]) => {
  let p_amt = Number(p.amount);
  let a_amt = a.reduce((acc, a) => acc + Number(a.amount), 0);
  return p_amt + a_amt;
};

const addChangeBtn = () => {
  /**navigate back to plan page to make change */
   r_p.addEventListener("click", () => nextPrev(-2));
};

function viewSelections() {
  // Retrieve the object from the storage
  const plans: Plan = JSON.parse(localStorage.getItem("plan") as string);
  const addns: Addon[] = JSON.parse(localStorage.getItem("addons") as string);
  let suffix = plans.duration === "Yearly" ? "yr" : "mo";

  if (plans !== null && addns !== null) {
    const pl_temp = `<div class="plan">
    <span>
    <p class="desc">${plans.name}(${plans.duration})</p>
    <button id="r_p">change</button>
    </span>
    <p class="amt">$${plans.amount}/${suffix}</p>
  </div>`;

    const addn_template = addns.map((a) => {
      return `<div class="addon">
        <p class="name">${a.name}</p>
        <p class="amt">+$${a.amount}/${suffix}</p>
      </div>`;
    });

    const tot_template = `
  <p class="t_l">Total(per month)</p>
  <p class="number">+$${calcTotal(plans, addns)}/${suffix}</p>
  `;

    list.innerHTML = pl_temp;
    l_a.innerHTML = addn_template.join("");
    t_d.innerHTML = tot_template;
  }
}

function showStep(n: number) {
  // This function will display the specified step of the form ...
  let x = s[n] as HTMLDivElement;
  x.style.display = "";
  // ... and fix the Previous/Next buttons:
  if (n == 0) {
    prevBtn.style.display = "none";
    btnCont.classList.add("flex_end");
  } else {
    prevBtn.style.display = "inline";
    btnCont.classList.replace("flex_end", "sp_between");
  }

  if (n == 3) {
    viewSelections();
    nextBtn.innerHTML = "Submit";
  }

  if (n == 4) {
    nextBtn.style.display = "none";
    prevBtn.style.display = "none";
    btnCont.style.display = "none"
  }
  // ... and run a function that displays the correct step indicator:
  updateStepIndicator(n);
}

const removeItems = () => {
  localStorage.updateItem("plan");
  localStorage.updateItem("addons");
};

nextBtn.addEventListener("click", () => validateInputs())
prevBtn.addEventListener("click", () => nextPrev(-1));

const toggleReqField = (
  value: string,
  label: HTMLSpanElement,
  input: HTMLInputElement
) => {
  if (value == "") {
    label.style.display = "block";
    label.style.color = "red";
    input.style.borderColor = "red";
  } else {
    label.style.display = "";
    label.style.color = "";
    input.style.borderColor = "";
  }
};

const validateInputs = () => {
  let form = document.forms[0] as HTMLFormElement;
  let name = form.children[1] as HTMLInputElement;
  let email = form.children[3] as HTMLInputElement;
  let phone = form.children[5] as HTMLInputElement;
  if (name.value !== "" && email.value !== "" && phone.value !== "") {
    nextPrev(1)
  } else {
    reqField()
  }
};

/**This Function handles the step 1 form required fields */
const reqField = () => {
  let form = document.forms[0] as HTMLFormElement;

  /**
   * I didn't want to list out every element 
   * and add event handlers for everyone of them
   * so I created a dummy array to hold all the element 
   * and then programmatically toggle them based on their
   * index in the array
  */
  const dummyArr: { el: HTMLInputElement | HTMLLabelElement }[] = [
    { el: form.children[1] as HTMLInputElement },
    { el: form.children[0].children[1] as HTMLLabelElement },
    { el: form.children[3] as HTMLInputElement },
    { el: form.children[2].children[1] as HTMLLabelElement },
    { el: form.children[5] as HTMLInputElement },
    { el: form.children[4].children[1] as HTMLLabelElement },
  ];

  // loop through the dummy array to control specific elements
  for (let i = 0; i < dummyArr.length; i++) {
    // the array is setup that for every input element there is its
    // corresponding label 1 index after it, 
    // so the input index is even, the label index is odd
    if (i % 2 === 0) {
      // iE is short for input element 
      let iE = dummyArr[i].el as HTMLInputElement;
      // nE is short for next element
      let nE = dummyArr[i + 1].el;
      // initiate first toggle on function call
      if (iE !== null && nE !== null) toggleReqField(iE.value, nE, iE);
      // listen for chnages to input then intiate another toggle
      iE.addEventListener("change", function () {
        toggleReqField(iE.value, nE, iE);
      });
    }
  }
};

function nextPrev(n: number) {
  // This function will figure out which step to display
  let x = s[current_step] as HTMLDivElement;
  // Hide the current step:
  x.style.display = "none";
  // Increase or decrease the current step by 1:
  current_step = current_step + n;
  //
  if (current_step == 1) getActivePlan();
  //
  if (current_step == 2) {
    getSelAddons();
    updateAddonView();
  }
  //
  if (current_step == 3) addChangeBtn();
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

function updateStepIndicator(active: number) {
  for (let i = 0; i < steps_indicator.length; i++) {
    let n = steps_indicator[i].children[0] as HTMLButtonElement;
    let c = steps_indicator[active].children[0] as HTMLButtonElement;
    n.classList.remove("active");
    c.classList.add("active");
    //if (active == 3) n.className += " active";
  }
}

showStep(current_step);
