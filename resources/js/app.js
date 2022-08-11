import './bootstrap';
import Echo from "laravel-echo"
import Pusher from 'pusher-js';

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: 'myKey',
    wsHost: window.location.hostname,
    wsPort: 6001,
    forceTLS: false,
    disableStats: true,
});

const channel = window.Echo.join(`chat`);
const messages = document.getElementById('messages');
const message_container = document.getElementById('message-container');
const activeUsers = document.getElementById('active-users');
const typer = document.getElementById('typer');

document.getElementById("message").addEventListener("keydown", whisper);

function whisper(e) {
    // window.Echo.private(`chat`)
    channel
        .whisper('typing', {
            name: channel.subscription.members.me.info.name,
            id: channel.subscription.members.me.id,
        });
}

channel.subscribed((e) => {
    console.log('Subscribed to chat channel', e);
})
    .here((users) => {
        users.forEach((user) => {
            // console.log(user);
            activeUsers.insertAdjacentHTML('beforeend', `<li id="user-${user.id}">${user.name}</li>`);
        });
    }).joining((user) => {
        // console.log(user.name + ' joined');
        activeUsers.insertAdjacentHTML('beforeend', `<li id="user-${user.id}">${user.name}</li>`);
    }).leaving((user) => {
        // console.log(user.name + ' left');
        document.getElementById(`user-${user.id}`).remove();
    })
    .listenForWhisper('typing', (e) => {
        // console.log(e);
        typer.innerHTML = `<span  id="typing-${e.id}">${e.name} is typing...</span>`;
        setTimeout(() => {
            if (document.getElementById(`typing-${e.id}`)) {
                document.getElementById(`typing-${e.id}`).remove();
            }
        }, 1000);

    })
    .listen('.message', (e) => {
        if (e.user_id === window.me) {
            messages.insertAdjacentHTML('beforeend', `<div class="msg self mb-1">${e.message}</div>`);
        } else {
            messages.insertAdjacentHTML('beforeend', `<div class="msg other mb-1">${e.user} : ${e.message}</div>`);
        }

        message_container.scrollTop = message_container.scrollHeight;
    }
    );
