'use strict';

//---------------variable declarations----------------------------
let colorBtn = document.querySelectorAll(".filter_color");
let mainContainer = document.querySelector(".main_container");
let bothElementsArr = document.querySelectorAll(".icon-container");
let crossBtn = bothElementsArr[1]
let plusButton = bothElementsArr[0];
let filterBtn = document.querySelectorAll('.filter_color');
let themeBtn = document.querySelector('.theme-container');

let body = document.body;

//----------------Switches to toggle states of the application-------------
let deleteState = false;
let visibilitySwitch = false; //false = bright & true = night



let taskArr = [];
if (localStorage.getItem("allTask")) {
    taskArr = JSON.parse(localStorage.getItem("allTask"));
    // UI
    for (let i = 0; i < taskArr.length; i++) {
        let { id, color, task } = taskArr[i];
        createTask(color, task, false, id);
    }
}

//------------------------Modal Creation----------------------------
plusButton.addEventListener("click", createModal);
//----------------------Task Deletion-------------------------------
crossBtn.addEventListener("click", setDeleteState);


//----------Modal Functions------------------------------------------
function createModal() {
    // create modal
    let modalContainer = document.querySelector(".modal_container");
    if (modalContainer == null) {
        modalContainer = document.createElement("div");
        modalContainer.setAttribute("class", "modal_container");
        modalContainer.innerHTML = `<div class="input_container">
        <textarea class="modal_input" 
        placeholder="Enter Your text"></textarea>
    </div>
    <div class="modal_filter_container">
        <div class="filter pink"></div>
        <div class="filter blue"></div>
        <div class="filter green"></div>
        <div class="filter black"></div>
    </div>`;
        body.appendChild(modalContainer);
        handleModal(modalContainer);
    }
    let textarea = modalContainer.querySelector(".modal_input");
    textarea.value = "";

    //  event listner 
}
function handleModal(modal_container) {

    let cColor = "black";
    let modalFilters = document.querySelectorAll(".modal_filter_container .filter");
    // /remove previous attr new attrs
    // modalFilters[3].setAttribute("class", "border");
    // border -> black
    modalFilters[3].classList.add("border");
    for (let i = 0; i < modalFilters.length; i++) {
        modalFilters[i].addEventListener("click", function () {
            //    remove broder from elements
            modalFilters.forEach((filter) => {
                filter.classList.remove("border");
            })
            //  add
            modalFilters[i].classList.add("border")
            // modalFilters[i].classList
            //  color 
            cColor = modalFilters[i].classList[1];
        })
    }
    let textArea = document.querySelector(".modal_input");
    textArea.addEventListener("keydown", function (e) {
        if (e.key == "Enter" && textArea.value != "") {
            //  remove modal
            modal_container.remove();
            // create taskBox
            createTask(cColor, textArea.value, true);

        }
    })
    let input_container = document.querySelector(".modal_input");
    let modal_filter_container = document.querySelector("modal_filter_container")
    if(visibilitySwitch == true){
        input_container.classList.add("dark_modal_input");
        modal_filter_container.classList.add("dark_modal_filter_container");
    }
    else if(visibilitySwitch == false){
        input_container.classList.remove("dark_modal_input");
        modal_filter_container.classList.remove("dark_modal_filter_container");
    }


}


//--------------------Task functions---------------------------------
function createTask(color, task, flag, id) {
    // color area click-> among colors
    let taskContainer = document.createElement("div");
    let uifn = new ShortUniqueId();
    let uid = id || uifn();
    taskContainer.setAttribute("class", "task_container");
    if(visibilitySwitch == true){
        taskContainer.classList.add("dark_task_container");
    }
    else{
        taskContainer.classList.remove("dark_task_container");
    }
    
    taskContainer.innerHTML = `<div class="task_filter ${color}"></div>
    <div class="task_desc_container">
        <h3 class="uid">#${uid}</h3>
        <div class="task_desc" contenteditable="true" >${task}</div>
    </div>
</div >`;
    mainContainer.appendChild(taskContainer);
    let taskFilter = taskContainer.querySelector(".task_filter");
    if (flag == true) {
        let obj = { "task": task, "id": `${uid}`, "color": color };
        taskArr.push(obj);
        let finalArr = JSON.stringify(taskArr);
        localStorage.setItem("allTask", finalArr);
    }
    taskFilter.addEventListener("click", changeColor);
    taskContainer.addEventListener("click", deleteTask);
    let taskDesc = taskContainer.querySelector(".task_desc");
    taskDesc.addEventListener("keypress", editTask);

}
function changeColor(e) {
    //  add event listener 
    // console.log(e.currentTarget);
    // /event occur 
    // console.log(e.target);
    let taskFilter = e.currentTarget;
    let colors = ["pink", "blue", "green", "black"];
    let cColor = taskFilter.classList[1];
    let idx = colors.indexOf(cColor);
    let newColorIdx = (idx + 1) % 4;
    taskFilter.classList.remove(cColor);
    taskFilter.classList.add(colors[newColorIdx]);
}
function setDeleteState(e) {

    let crossBtn = e.currentTarget;
    // console.log(crossBtn.parent)
    if (deleteState == false) {
        crossBtn.classList.add("active");
    } else {
        crossBtn.classList.remove("active");
    }
    deleteState = !deleteState;
}
function deleteTask(e) {
    let taskContainer = e.currentTarget;
    if (deleteState) {
        // local storage search -> remove
        let uidElem = taskContainer.querySelector(".uid");
        let uid = uidElem.innerText.split("#")[1];
        for (let i = 0; i < taskArr.length; i++) {
            let { id } = taskArr[i];
            console.log(id, uid);
            if (id == uid) {
                taskArr.splice(i, 1);
                let finalTaskArr = JSON.stringify(taskArr);
                localStorage.setItem("allTask", finalTaskArr);
                taskContainer.remove();
                break;
            }
        }
    }
}

function editTask(e) {
    let taskDesc = e.currentTarget;
    let uidElem = taskDesc.parentNode.children[0];
    let uid = uidElem.innerText.split("#")[1];
    for (let i = 0; i < taskArr.length; i++) {
        let { id } = taskArr[i];
        console.log(id, uid);
        if (id == uid) {
            taskArr[i].task = taskDesc.innerText
            let finalTaskArr = JSON.stringify(taskArr);
            localStorage.setItem("allTask", finalTaskArr);

            break;
        }
    }
}

//-----------------------Filter button to see tasks of clicked filter color------------------------
for(let i = 0; i < filterBtn.length; i++){
    filterBtn[i].addEventListener("click", function(e){
        let color = filterBtn[i].classList[1];
        let currentColorTask = document.querySelectorAll(".task_filter."+color);
        let toHideTask = document.querySelectorAll(".task_container");
        for(let i = 0; i < toHideTask.length; i++){
            toHideTask[i].style.visibility = 'hidden';
        }
        for(let i = 0; i < currentColorTask.length; i++){
            
            currentColorTask[i].parentNode.style.visibility = 'visible';
        }
    })
}
for(let i = 0; i < filterBtn.length; i++){
    filterBtn[i].addEventListener("dblclick", function(e){
        let toHideTask = document.querySelectorAll(".task_container");
        for(let i = 0; i < toHideTask.length; i++){
            toHideTask[i].style.visibility = 'initial';
        }
    })
}

//----------------Event listner to change theme of the application-----------------
themeBtn.addEventListener("click", changeTheme);

function changeTheme(){
    let theme_1 = document.querySelector('.fa-sun');
    let theme_2 = document.querySelector('.fa-moon');

    if(!visibilitySwitch){
        theme_1.style.visibility = 'hidden';
        theme_2.style.visibility = 'visible';
    }
    else{
        theme_1.style.visibility = 'visible';
        theme_2.style.visibility = 'hidden';
    }
    visibilitySwitch = !visibilitySwitch;
    themeToggler();
}


//----------------------Theme Toggling Functions--------------------------------------

function themeToggler(){
    let filter = document.querySelectorAll(".filter");
    let toolbar = document.querySelector(".toolbar");
    let filter_container = document.querySelector(".filter-container")
    let filter_color = document.querySelectorAll(".filter_color");
    let action_container = document.querySelector('.action-container');
    let fas = document.querySelectorAll(".fas");
    let modal_input = document.querySelector(".modal_input");
    let modal_filter_container = document.querySelector(".modal_filter_container");
    let main_container = document.querySelector('.main_container');
    let task_container = document.querySelectorAll('.task_container');
    let task_desc_container = document.querySelectorAll('.task_desc_container');
    let uid = document.querySelectorAll('.uid');

    //-----------------------Toggling the hardcode css stuff-----------------------
    filter.forEach((ele) => {
        ele.classList.toggle('dark_filter');
    })
    toolbar.classList.toggle('dark_toolbar');
    filter_container.classList.toggle('dark_filter-container');
    filter_color.forEach((element) =>{
        element.classList.toggle("dark_filter_color");
    });
    action_container.classList.toggle("dark_action-container");
    fas.forEach((element) =>{
        element.classList.toggle("dark_fas");
    })
    
    main_container.classList.toggle("dark_main_container");
    
    //---------------------toggling the dynamic part of the program-----------------
    if(task_container != null && visibilitySwitch == true){
        task_container.forEach((element) =>{
            element.classList.add("dark_task_container");
        })
    }
    else{
        task_container.forEach((element) =>{
            element.classList.remove("dark_task_container");
        })
    }
    if(modal_input != null && visibilitySwitch == true){
        modal_input.classList.add("dark_modal_input");
    }
    else if(modal_input != null && visibilitySwitch == false){
        modal_input.classList.remove("dark_modal_input");
    }
    if(modal_filter_container != null && visibilitySwitch == true){
        modal_filter_container.classList.add("dark_modal_filter_container");
    }
    else if(modal_filter_container != null && visibilitySwitch == false){
        modal_filter_container.classList.remove("dark_modal_filter_container");
    }
    if(task_desc_container != null && visibilitySwitch == true){
        task_desc_container.forEach((element) => {
            element.classList.add("dark_task_desc_container");
        })
    }
    else if(task_desc_container != null && visibilitySwitch == false){
        task_desc_container.forEach((element) => {
            element.classList.remove("dark_task_desc_container");
        })
    }
    if(uid != null && visibilitySwitch == true){
        uid.forEach((element) => {
            element.classList.add("dark_uid");
        })
    }
    else if(uid != null && visibilitySwitch == false){
        uid.forEach((element) => {
            element.classList.remove("dark_uid");
        })
    }
       
}


