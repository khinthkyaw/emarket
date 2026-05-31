import * as Sentry from "@sentry/react";

const raw = import.meta.env.VITE_API_URL;
const base = typeof raw === "string" ? raw.replace(/\/+$/, "") : "";

export async function apiFetch(path, options = {}) {
    const { getToken, method = "GET", body } = options;
    const headers = { "Content-Type": "application/json" };

    if (getToken) {
        const token = await getToken();
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
    }

    let res;
    try {
        res = await fetch(`${base}${path}`, {
            method,
            headers,
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });
    } catch (error) {
        Sentry.addBreadcrumb({
            category: "api",
            message: `${method} ${path}`,
            level: "error",
            data: { network: true },
        });

        Sentry.captureException(error, {
            tags: { "api.fetch": "network" },
            extra: { path, method },
        });
        throw error;
    }

    const data = await res.json();

    Sentry.addBreadcrumb({
        category: "api",
        message: `${method} ${path}`,
        level: res.ok ? "info" : "warning",
        data: { status: res.status },
    });

    if (!res.ok) {
        const message = typeof data?.error === "string" ? data.error : res.statusText;
        const error = new Error(typeof message === "string" ? message : "Request failed");

        if (res.status >= 500) {
            Sentry.captureException(error, {
                tags: { "api.fetch": "http", "http.status": String(res.status) },
                extra: { path, method, status: res.status },
            });
        }
        throw error;
    }

    return data;
}
