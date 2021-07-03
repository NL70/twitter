const apiURL = "http://localhost:4000";

async function login(username, password) {
  const userData = {
    username: username,
    password: password,
  };
  const response = await fetch(`${apiURL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  }).then((res) => res.json());
  return response.data;
}

const loginForm = document.getElementById("login-form");
loginForm.onsubmit = async (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  await login(username, password);
};
