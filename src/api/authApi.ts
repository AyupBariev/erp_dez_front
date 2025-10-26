export async function loginApi(username: string, password: string) {
    const form = new FormData();
    form.append("username", username);
    form.append("password", password);

    const res = await fetch("/api/login", { method: "POST", body: form });
    if (!res.ok) throw new Error("Ошибка входа");

    const data = await res.json();
    localStorage.setItem("access_token", data.access_token);

    return { success: true, token: data.access_token };
}
