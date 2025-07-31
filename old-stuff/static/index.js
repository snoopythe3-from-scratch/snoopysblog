// Handle Signup
document.getElementById('signupForm')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  const username = document.getElementById('signupUsername').value;
  const password = document.getElementById('signupPassword').value;

  try {
    const response = await fetch('https://the-scratch-channel.onrender.com/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    alert(data.message || data.error);

    if (response.ok) {
      window.location.href = 'login.html';
    }
  } catch (err) {
    console.error('Signup failed:', err);
    alert('Signup failed');
  }
});

// Handle Login
document.getElementById('loginForm')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    // First verify credentials
    const loginResponse = await fetch('https://the-scratch-channel.onrender.com/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const loginData = await loginResponse.json();
    if (!loginResponse.ok) {
      alert(loginData.error || 'Login failed');
      return;
    }

    // Then request auth code
    const authResponse = await fetch('https://the-scratch-channel.onrender.com/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const authData = await authResponse.json();
    if (!authResponse.ok) {
      alert(authData.error || 'Authentication failed');
      return;
    }

    localStorage.setItem('authCode', authData.authCode);
    alert('Login successful!');
    window.location.href = 'articles.html';
  } catch (err) {
    console.error('Login failed:', err);
    alert('Login failed');
  }
});

// Handle Article Submission
document.getElementById('articleForm')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  const title = document.getElementById('articleTitle').value;
  const content = document.getElementById('articleContent').value;

  const authCode = localStorage.getItem('authCode');
  if (!authCode) {
    alert('You need to be logged in to post articles');
    return;
  }

  try {
    const response = await fetch('https://the-scratch-channel.onrender.com/api/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authCode
      },
      body: JSON.stringify({ title, content })
    });

    const data = await response.json();
    alert(data.message || data.error);

    if (response.ok) {
      window.location.href = 'articles.html';
    }
  } catch (err) {
    console.error('Failed to post article:', err);
    alert('Failed to post article');
  }
});

// Fetch Articles (on articles.html)
if (document.getElementById('articlesList')) {
  fetch('https://the-scratch-channel.onrender.com/api/articles')
    .then(response => response.json())
    .then(articles => {
      const articlesList = document.getElementById('articlesList');
      articles.forEach(article => {
        const articleDiv = document.createElement('div');
        articleDiv.innerHTML = `<h3>${article.title}</h3><p>${article.content}</p>`;
        articlesList.appendChild(articleDiv);
      });
    })
    .catch(err => {
      console.error('Error fetching articles:', err);
      alert('Failed to load articles');
    });
}
