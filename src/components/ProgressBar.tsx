import { useEffect } from "react";
import { useLocation, useNavigation } from "react-router";
import NProgress from "nprogress";

export const ProgressBar = () => {
    const navigation = useNavigation();
    const location = useLocation();

    useEffect(() => {
        NProgress.configure({
            showSpinner: false,
            trickleSpeed: 100,
            minimum: 0.08,
            easing: "ease",
            speed: 300,
        });

        const handleClick = (event: MouseEvent) => {
            const anchor = (event.target as HTMLElement)?.closest("a");
            if (!anchor) return;

            const href = anchor.getAttribute("href");
            if (!href) return;

            // Ignore external, target blank, download, or modifier keys
            if (
                (anchor.target && anchor.target !== "_self") ||
                anchor.hasAttribute("download") ||
                event.ctrlKey ||
                event.metaKey ||
                event.shiftKey ||
                event.altKey ||
                event.button !== 0
            ) {
                return;
            }

            // Ignore non-route navigation protocols
            if (
                href.startsWith("#") ||
                href.startsWith("mailto:") ||
                href.startsWith("tel:") ||
                href.startsWith("javascript:")
            ) {
                return;
            }

            try {
                const targetUrl = new URL(anchor.href, window.location.href);
                const currentUrl = new URL(window.location.href);

                // Start progress bar if navigating to a different internal route
                if (
                    targetUrl.origin === currentUrl.origin &&
                    (targetUrl.pathname !== currentUrl.pathname ||
                        targetUrl.search !== currentUrl.search)
                ) {
                    NProgress.start();
                }
            } catch {
                // Invalid URL, ignore
            }
        };

        const handlePopState = () => {
            NProgress.start();
        };

        const origPushState = window.history.pushState;
        window.history.pushState = function (data, unused, url) {
            if (url) {
                try {
                    const targetUrl = new URL(url.toString(), window.location.href);
                    if (
                        targetUrl.pathname !== window.location.pathname ||
                        targetUrl.search !== window.location.search
                    ) {
                        NProgress.start();
                    }
                } catch {
                    // ignore
                }
            }
            return origPushState.apply(this, [data, unused, url]);
        };

        window.addEventListener("click", handleClick, { capture: true });
        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("click", handleClick, { capture: true });
            window.removeEventListener("popstate", handlePopState);
            window.history.pushState = origPushState;
            NProgress.done();
        };
    }, []);

    // Handle React Router navigation states (loaders, code splitting)
    useEffect(() => {
        if (navigation.state === "loading" || navigation.state === "submitting") {
            NProgress.start();
        } else if (navigation.state === "idle") {
            NProgress.done();
        }
    }, [navigation.state]);

    // Complete progress when route transition resolves
    useEffect(() => {
        NProgress.done();
    }, [location.pathname, location.search]);

    return null;
};

export default ProgressBar;
