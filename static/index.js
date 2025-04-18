// Handle Signup
document.getElementById('signupForm')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  const username = document.getElementById('signupUsername').value;  // Changed to unique id
  const password = document.getElementById('signupPassword').value;  // Changed to unique id

  try {
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    const dataun = JSON.parse(data);
    alert(dataun);
    if (response.ok) {
      window.location.href = 'login.html';  // Redirect to login page
    }
  } catch (err) {
    console.error('Signup failed:', err);
    alert('Signup failed');
  }
});

// Handle Login
document.getElementById('loginForm')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value;  // Changed to unique id
  const password = document.getElementById('loginPassword').value;  // Changed to unique id

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    alert(data.message);
    if (response.ok) {
      // Save the auth token to localStorage or sessionStorage for future requests
      localStorage.setItem('authCode', data.authCode); // Assuming the response contains an authCode
      window.location.href = 'articles.html';  // Redirect to articles page
    }
  } catch (err) {
    console.error('Login failed:', err);
    alert('Login failed');
  }
});

// Handle Article Submission
document.getElementById('articleForm')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  const title = document.getElementById('articleTitle').value;  // Changed to unique id
  const content = document.getElementById('articleContent').value;  // Changed to unique id

  const authCode = localStorage.getItem('authCode');  // Retrieve authCode from localStorage

  if (!authCode) {
    alert('You need to be logged in to post articles');
    return;
  }

  try {
    const response = await fetch('/api/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authCode}`  // Authorization header format
      },
      body: JSON.stringify({ title, content })
    });

    const data = await response.json();
    alert(data.message);
    if (response.ok) {
      window.location.href = 'articles.html';  // Redirect to articles page after submission
    }
  } catch (err) {
    console.error('Failed to post article:', err);
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
    })
    .catch(err => {
      console.error('Error fetching articles:', err);
      alert('Failed to load articles');
    });
}
