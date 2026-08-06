const API_BASE_URL = "http://localhost/api";

export async function login(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  return await response.json();
}

export { API_BASE_URL };