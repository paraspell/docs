import{_ as a,c as e,o as s,d as t}from"./app.3eed6c45.js";const f=JSON.parse('{"title":"Effortlessly visualize cross-chain data ⛓️","description":"","frontmatter":{},"headers":[{"level":2,"title":"User startup guide","slug":"user-startup-guide","link":"#user-startup-guide","children":[]},{"level":2,"title":"Developer startup guide","slug":"developer-startup-guide","link":"#developer-startup-guide","children":[]}],"relativePath":"visualizator/getting-start.md"}'),n={name:"visualizator/getting-start.md"},r=t(`<h1 id="effortlessly-visualize-cross-chain-data-⛓️" tabindex="-1">Effortlessly visualize cross-chain data ⛓️ <a class="header-anchor" href="#effortlessly-visualize-cross-chain-data-⛓️" aria-hidden="true">#</a></h1><p>Following guide contains information about XCM Visualizator. It is designed to inform both interface users and developers about the possibilities and use cases they can enhance with this tool.</p><img width="200" alt="logo" src="https://github.com/paraspell/xcm-tools/assets/55763425/2a2a071d-32c5-4fea-a6cb-fc5177c73548"><h2 id="user-startup-guide" tabindex="-1">User startup guide <a class="header-anchor" href="#user-startup-guide" aria-hidden="true">#</a></h2><p>Project is deployed on following link: <a href="https://xcm-visualizator.tech" target="_blank" rel="noreferrer">https://xcm-visualizator.tech</a>.</p><p>For user guide reffer to following section: <a href="https://paraspell.github.io/docs/visualizator/user-guide.html" target="_blank" rel="noreferrer">User guide</a></p><h2 id="developer-startup-guide" tabindex="-1">Developer startup guide <a class="header-anchor" href="#developer-startup-guide" aria-hidden="true">#</a></h2><p>To run the project locally, you need to have Node.js v.20^ installed, as well as PostgreSQL database.</p><p>In backend folder create .env file following .env.example file. After your database is set up, you can import the database dump from the <a href="https://drive.google.com/file/d/1mBYi9zh8iuEWtQtcZdg-sgGtRwJFRLje/view?usp=sharing" target="_blank" rel="noreferrer">xcm_database_dump.tar</a> file to try the XCM Visualizator with the example data.</p><p>Then, run the following commands:</p><p>Before you begin with any commands make sure to run following from monorepository root:</p><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#FFCB6B;">pnpm</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">install</span></span>
<span class="line"><span style="color:#FFCB6B;">pnpm</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">build</span></span>
<span class="line"></span></code></pre></div><p>Then run backend from <a href="https://github.com/paraspell/xcm-tools/tree/main/apps/visualizator-be" target="_blank" rel="noreferrer">backend folder</a>:</p><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#82AAFF;">cd</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">./apps/visualizator-be</span></span>
<span class="line"><span style="color:#FFCB6B;">pnpm</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">start</span></span>
<span class="line"></span></code></pre></div><p>And run frontend from <a href="https://github.com/paraspell/xcm-tools/tree/main/apps/visualizator-fe" target="_blank" rel="noreferrer">frontend folder</a>:</p><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#82AAFF;">cd</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">./apps/visualizator-fe</span></span>
<span class="line"><span style="color:#FFCB6B;">pnpm</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">dev</span></span>
<span class="line"></span></code></pre></div><p>Both front-end and back-end must run in their own terminal at the same time.</p>`,17),l=[r];function o(p,i,c,d,u,h){return s(),e("div",null,l)}const m=a(n,[["render",o]]);export{f as __pageData,m as default};