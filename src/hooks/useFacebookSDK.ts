"use client";

import { useEffect, useState } from "react";

declare global {
    interface Window {
        fbAsyncInit?: () => void;
        FB?: any;
    }
}

export function useFacebookSDK() {
    const [fbReady, setFbReady] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;

        // If already loaded, mark ready
        if (window.FB) {
            setFbReady(true);
            return;
        }

        // Ensure fb-root exists
        if (!document.getElementById("fb-root")) {
            const root = document.createElement("div");
            root.id = "fb-root";
            document.body.appendChild(root);
        }

        // Avoid injecting multiple times
        if (document.getElementById("facebook-jssdk")) {
            return;
        }

        // Load Facebook SDK using the standard method
        (function (d, s, id) {
            var js: HTMLScriptElement, fjs = d.getElementsByTagName(s)[0] as HTMLScriptElement;
            if (d.getElementById(id)) return;
            js = d.createElement(s) as HTMLScriptElement;
            js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v19.0";
            if (fjs && fjs.parentNode) {
                fjs.parentNode.insertBefore(js, fjs);
            }

            js.onload = () => {
                console.log("[FacebookSDK] Script loaded successfully");
                setFbReady(true);
            };
        }(document, 'script', 'facebook-jssdk'));
    }, []);

    return { fbReady, FB: typeof window !== "undefined" ? window.FB : undefined };
}

export default useFacebookSDK;
