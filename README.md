# Welcome To The Scratch Channel
<!-- Remove this, very redundant. ![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/The-Scratch-Channel/tsc-web-client?utm_source=oss&utm_medium=github&utm_campaign=The-Scratch-Channel%2Ftsc-web-client&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews) -->

<!-- Reworked -->
This is the official repo for The Scratch Channel.

> [!IMPORTANT]
> We are not affiliated with Scratch, the LifeLong Kindergarten Group, or Massachusessets Institute of Technology. News articles here are made by volunteers, not Scratch Team members.

## Deployment

There is no need to deploy this yourself if you do not want to contribute. If you just want to check out our site, you can visit <https://thescratchchannel.vercel.app/> and browse the live <!-- remove demo, it isnt anymore -->version.

## Contributing

There are a variety of ways to contribute to the project, such as:
- Reporting vulnerabilities,
- Developing code,
- Translating UI and,
- Writing articles

### Reporting vulnerabilities

However, if you find a vulnerability that requires immediate attention, go to the repositories [security tab](https://github.com/The-Scratch-Channel/tsc-web-client/security) to report it. A vulnerability report should contain what file has the vulnerability, what priority it is, and extensive details.

### Development Contribution

- Create a fork of the repository

![Click on the fork button towards the top of the repository home page](https://u.cubeupload.com/GvYoutube/Screenshot2025102012.png)

- Clone your fork

```bash
git clone https://github.com/yourusername/yourforkname.git
cd yourforkname
```

- Modify files 

See the [DeveloperGuide](#developer-guide) for info about how our code is laid out and how it works

### Translating UI

Follow the same steps as above, then go into `src/i18n` and create a json file with the correct two letter language code for the language you want to add. Copy the content of `en.json` as a template then translate the definitions, not the keys. Go into `index.js` and find this part. Import the json file you created then add it in just like with the ones already there.
```js
i18n.use(initReactI18next).use(LanguageDetector).init({
    resources: {
        en: { translation: en }, // English
        eo: { translation: eo }, // Esperanto
        bg: { translation: bg } // Булгарски
        // insert your language here!
    },
    fallbackLng: "en",    // fallback if translation is missing
    interpolation: {
        escapeValue: false
    },
    detection: {
        order: ["localStorage", "navigator"],
        caches: ["localStorage"],
    }
});
```

You must be fluent in the language you want to add in order to translate it. Do not use translation tools.

### Writing articles

Create an account then request to become a writer by [making an issue](https://github.com/The-Scratch-Channel/tsc-web-client/issues/new/choose). A database admin will then mark you as a writer and you will be able to write articles at the [write page](http://thescratchchannel.vercel.app/articles/create).

Articles must be written in English and with proper grammar and spelling.

## Developer Guide

The project is static and uses React+Vite, with Firebase as our database and authentication manager.

**Directory Structure**:
<details>
<summary>Directory Structure (very large)</summary>
├── .github</br>
│   ├── ISSUE_TEMPLATE</br>
│   │   ├── bug_report.md</br>
│   │   ├── custom.md</br>
│   │   └── feature_request.md</br>
│   ├── workflows</br>
│   │   ├── auto_label_priority.yml</br>
│   │   ├── commit_logger.yml</br>
│   │   ├── inactivity.yml</br>
│   │   ├── osv-scanner.yml</br>
│   │   ├── preview.yml</br>
│   │   ├── sitemap.yml</br>
│   │   ├── summary.yml</br>
│   │   ├── test.yml</br>
│   │   └── vercel_check.yml</br>
│   ├── dependabotupdates.yml</br>
│   └── labels.yml</br>
├── old-stuff</br>
│   ├── api</br>
│   │   ├── 2faeg.js</br>
│   │   ├── admin.js</br>
│   │   ├── articles.js</br>
│   │   ├── auth.js</br>
│   │   ├── status.js</br>
│   │   └── users.js</br>
│   ├── pages</br>
│   │   ├── 2fa.html</br>
│   │   ├── articles.html</br>
│   │   ├── favicon.ico</br>
│   │   ├── index.html</br>
│   │   ├── login.html</br>
│   │   └── sauth.html</br>
│   ├── static</br>
│   │   ├── css</br>
│   │   │   └── index.css</br>
│   │   └── img</br>
│   │       ├── branding</br>
│   │       └── readme.txt</br>
│   ├── index.html</br>
│   └── server.js</br>
├── public</br>
│   ├── articles</br>
│   │   ├── 1.md - 6.md (6 article files)</br>
│   │   ├── README.md</br>
│   │   ├── index.json</br>
│   │   └── sorter.py</br>
│   ├── LICENSE</br>
│   ├── favicon-new.ico</br>
│   ├── favicon-old.ico</br>
│   ├── favicon.ico</br>
│   └── sitemap.xml</br>
├── src</br>
│   ├── assets</br>
│   │   ├── flags (6 SVG files for different languages)</br>
│   │   └── tsc.png</br>
│   ├── components</br>
│   │   ├── Footer.jsx</br>
│   │   └── Header.jsx</br>
│   ├── i18n</br>
│   │   ├── bg.json</br>
│   │   ├── en.json</br>
│   │   ├── eo.json</br>
│   │   ├── hb.json</br>
│   │   ├── index.js</br>
│   │   ├── lol.json</br>
│   │   └── rbe.json</br>
│   ├── pages</br>
│   │   ├── About.jsx</br>
│   │   ├── Account.jsx</br>
│   │   ├── ArticlePage.jsx</br>
│   │   ├── Lang.jsx</br>
│   │   ├── Login.jsx</br>
│   │   ├── MainContent.jsx</br>
│   │   ├── MakeAdmin.jsx</br>
│   │   ├── SignUp.jsx</br>
│   │   ├── UserList.jsx</br>
│   │   └── createArticles.jsx</br>
│   ├── styles (10 CSS files)</br>
│   ├── App.jsx</br>
│   ├── firebaseConfig.js</br>
│   └── main.jsx</br>
├── Configuration files</br>
│   ├── .codeqlconfig.yml</br>
│   ├── .env.development</br>
│   ├── .env.production</br>
│   ├── .gitignore</br>
│   ├── eslint.config.js</br>
│   ├── gpt.prompt.yml</br>
│   ├── package.json</br>
│   ├── package-lock.json</br>
│   ├── tsc.code-workspace</br>
│   ├── vercel.json</br>
│   └── vite.config.js</br>
├── Documentation</br>
│   ├── CONTRIBUTING.md</br>
│   ├── LICENSE</br>
│   ├── README.md</br>
│   └── SECURITY.md</br>
└── Other files</br>
    ├── generate-sitemap.js</br>
    └── index.html</br>
<!-- my nasty little br hell, my pretty -->
</details>

## Support
For support on genreal bugs, go to the Issues tab. For Security issues, create a vuneribility report.
