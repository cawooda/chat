var count = 0;


new window.EventSource('/sse').onmessage = function(event) {
    window.messages.innerHTML += (count%2)?`<p class="talk-bubble tri-right border round btm-left-in">${event.data}</p>`
        :`<p class="talk-bubble tri-right border round btm-left-in odd">${event.data}</p>`;
    count+=1;
}

window.form.addEventListener('submit', function (evt) {
    evt.preventDefault();
   
    
    
    window.fetch(`/chat?message=${window.input.value}`)
   
    window.input.value='';
})