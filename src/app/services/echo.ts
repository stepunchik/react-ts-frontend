import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

const token = localStorage.getItem('ACCESS_TOKEN');

declare global {
    interface Window {
        Pusher: any;
    }
}

window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true,
    enabledTransports: ['ws', 'wss'],
    disableStats: true,
    encrypted: true,
    authEndpoint: `${import.meta.env.VITE_API_BASE_URL}/broadcasting/auth`,
    auth: {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    },
});

export default echo;
