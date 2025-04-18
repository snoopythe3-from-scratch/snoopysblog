// Handle Signup
document.getElementById('signupForm')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  const username = document.getElementById('signupUsername').value;
  const password = document.getElementById('signupPassword').value;

  try {
    const response = await fetch('/api/signup', {
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
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  try {
    // First verify credentials
    const loginResponse = await fetch('/api/login', {
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
    const authResponse = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const authData = await authResponse.json();
    alert(authData.message || 'Login successful');
    if (authResponse.ok) {
      localStorage.setItem('authCode', authData.authCode);
      window.location.href = 'articles.html';
    }
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
    const response = await fetch('/api/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authCode}`
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

// Fetch Articles
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
    })
    .catch(err => {
      console.error('Error fetching articles:', err);
      alert('Failed to load articles');
    });
}
