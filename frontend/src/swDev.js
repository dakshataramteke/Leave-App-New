export default function swDev() {
    let swUrl = `/sw.js`; // Ensure sw.js is in the public directory
    navigator.serviceWorker.register(swUrl).then((response) => {
        console.warn("Service Worker registered successfully:", response);
    }).catch((error) => {
        console.error("Service Worker registration failed:", error);
    });
}