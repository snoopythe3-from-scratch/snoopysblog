// Handle Signup
document.getElementById('signupForm')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    alert(data.message);
    if (response.ok) window.location.href = 'login.html';
  } catch (err) {
    alert('Signup failed');
  }
});

// Handle Login
document.getElementById('loginForm')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    alert(data.message);
    if (response.ok) window.location.href = 'articles.html';
  } catch (err) {
    alert('Login failed');
  }
});

// Handle Article Submission
document.getElementById('articleForm')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;

  const authCode = localStorage.getItem('authCode');  // Assuming auth code is saved in localStorage

  if (!authCode) {
    alert('You need to be logged in to post articles');
    return;
  }

  try {
    const response = await fetch('/api/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authCode
      },
      body: JSON.stringify({ title, content })
    });

    const data = await response.json();
    alert(data.message);
    if (response.ok) window.location.href = 'articles.html';
  } catch (err) {
    alert('Failed to post article');
  }
});

// Fetch Articles (on articles.html)
if (document.getElementById('articlesList')) {
  fetch('/api/articles')
    .then(response => response.json())
    .then(articles => {
      const articlesList = document.getElementById('articlesList');
      articles.forEach(article => {
        const articleDiv = document.createElement('div');
        articleDiv.innerHTML = `<h3>${article.title}</h3><p>${article.content}</p>`;
        articlesList.appendChild(articleDiv);
      });
    });
}
