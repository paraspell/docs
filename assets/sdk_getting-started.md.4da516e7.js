import{_ as s,c as a,o as n,d as l}from"./app.5dd1b422.js";const A=JSON.parse('{"title":"Getting started with your journey accross Paraverse 👨‍🚀","description":"","frontmatter":{},"headers":[{"level":2,"title":"Starter template","slug":"starter-template","link":"#starter-template","children":[]},{"level":2,"title":"Install dependencies","slug":"install-dependencies","link":"#install-dependencies","children":[]},{"level":2,"title":"Install XCM SDK package","slug":"install-xcm-sdk-package","link":"#install-xcm-sdk-package","children":[]},{"level":2,"title":"Import package","slug":"import-package","link":"#import-package","children":[{"level":3,"title":"Builder import","slug":"builder-import","link":"#builder-import","children":[]},{"level":3,"title":"Classic import","slug":"classic-import","link":"#classic-import","children":[]}]}],"relativePath":"sdk/getting-started.md"}'),e={name:"sdk/getting-started.md"},p=l(`<h1 id="getting-started-with-your-journey-accross-paraverse-👨‍🚀" tabindex="-1">Getting started with your journey accross Paraverse 👨‍🚀 <a class="header-anchor" href="#getting-started-with-your-journey-accross-paraverse-👨‍🚀" aria-hidden="true">#</a></h1><p>This guide guides you through implementation of XCM SDK that allows you to do various exciting actions on Polkadot and Kusama chains. To start proceed with steps mentioned below. Good luck adventurer!</p><h2 id="starter-template" tabindex="-1">Starter template <a class="header-anchor" href="#starter-template" aria-hidden="true">#</a></h2><p>Don&#39;t want to go through setup and build from ground up?</p><ul><li>Our team has created a <a href="https://github.com/paraspell/xcm-sdk-template" target="_blank" rel="noreferrer">XCM SDK Starter template</a> for you!</li></ul><p>This template is programmed with React &amp; Vite framework. It contains basic components ready to set you off on your cross-chain dApp journey.</p><h2 id="install-dependencies" tabindex="-1">Install dependencies <a class="header-anchor" href="#install-dependencies" aria-hidden="true">#</a></h2><p>Install peer dependencies according to the choice of API package.</p><p>ParaSpell XCM SDK is the 🥇 in the ecosystem to support both <strong>PolkadotJS</strong> and <strong>PolkadotAPI</strong>.</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">NOTE: Make sure to set PeerDependencyInstall flag to false on your package manager (Because it will install both API packages instead of just one)</span></span>
<span class="line"><span style="color:#A6ACCD;">For example on PNPM: \`pnpm config set auto-install-peers false\`</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#676E95;font-style:italic;">#Choose a package and install its dependencies below (SDK is built in a way, that only one library has to be installed)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#Polkadot API peer dependencies</span></span>
<span class="line"><span style="color:#FFCB6B;">pnpm</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">|</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">npm</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">install</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">||</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">yarn</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">add</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">polkadot-api</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#PolkadotJS peer dependencies</span></span>
<span class="line"><span style="color:#FFCB6B;">pnpm</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">|</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">npm</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">install</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">||</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">yarn</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">add</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">@polkadot/api</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">@polkadot/types</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">@polkadot/api-base</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">@polkadot/util</span></span>
<span class="line"></span></code></pre></div><h2 id="install-xcm-sdk-package" tabindex="-1">Install XCM SDK package <a class="header-anchor" href="#install-xcm-sdk-package" aria-hidden="true">#</a></h2><p>Choose your package provider and proceed to install XCM SDK to your project.</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#FFCB6B;">yarn</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">add</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">||</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">pnpm</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">|</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">npm</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">install</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">@paraspell/sdk</span></span>
<span class="line"></span></code></pre></div><h2 id="import-package" tabindex="-1">Import package <a class="header-anchor" href="#import-package" aria-hidden="true">#</a></h2><p>There are two ways to import package to your project. Importing builder or classic import.</p><h3 id="builder-import" tabindex="-1">Builder import <a class="header-anchor" href="#builder-import" aria-hidden="true">#</a></h3><p>Builder import is restricted for sending XCM messages and using transfer info.</p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#676E95;font-style:italic;">// Polkadot API version</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">Builder</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">@paraspell/sdk/papi</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// Polkadot JS version</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">Builder</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">@paraspell/sdk</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"></span></code></pre></div><h3 id="classic-import" tabindex="-1">Classic import <a class="header-anchor" href="#classic-import" aria-hidden="true">#</a></h3><p>Classic import allows you to use every functionality XCM SDK offers.</p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#676E95;font-style:italic;">// ESM PAPI</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">*</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">as</span><span style="color:#A6ACCD;"> paraspell </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">@paraspell/sdk/papi</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// ESM PJS</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">*</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">as</span><span style="color:#A6ACCD;"> paraspell </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">@paraspell/sdk</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// CommonJS PAPI</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> paraspell </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">require</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">@paraspell/sdk/papi</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// CommonJS PJS</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> paraspell </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">require</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">@paraspell/sdk</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"></span></code></pre></div><p>Interaction with further asset symbol abstraction:</p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">Native</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">Foreign</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">ForeignAbstract</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">@paraspell/sdk</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">;</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">//Only needed when advanced asset symbol selection is used. PJS version.</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">Native</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">Foreign</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">ForeignAbstract</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">@paraspell/sdk/papi</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">;</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">//Only needed when advanced asset symbol selection is used. PAPI version.</span></span>
<span class="line"></span></code></pre></div>`,24),o=[p];function t(r,c,i,y,D,d){return n(),a("div",null,o)}const F=s(e,[["render",t]]);export{A as __pageData,F as default};