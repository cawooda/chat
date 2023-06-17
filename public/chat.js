var count = 0;
const userNameInput = document.getElementById('name');
let userName = '';
let userSet = false;

new window.EventSource('/sse').onmessage = function(event) {
    window.messages.innerHTML += (count%2)?`<span class="message">${event.data.msg}</span><span class="userName">${event.data.userName}</span>`
        :`<span class="message odd">${event.data.msg}</span><span class="userName">${event.data.userName}</span></span>`
    console.log("event source showing event.data getting through " + event.data);
    count+=1;
}

window.form.addEventListener('submit', function (evt) {
    evt.preventDefault();
    console.log('username input field contains' + userNameInput.value);
    !(userSet) ? () => {
            userName = userNameInput.value;
            userSet = true;
            console.log("user name set to : " + userName + "by userSet check");
        }
        : console.log('user already set');
    
    
    window.fetch(`/chat?message=${window.input.value}&userName=${userSet}`)
   
    window.input.value='';
    userName.value='';
})