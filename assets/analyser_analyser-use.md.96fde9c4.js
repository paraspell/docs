import{_ as s,c as n,o as a,d as l}from"./app.a12b413a.js";const D=JSON.parse('{"title":"Ready to make XCM Multilocations more human friendly? 👨‍🏫","description":"","frontmatter":{},"headers":[{"level":2,"title":"Implementation","slug":"implementation","link":"#implementation","children":[]}],"relativePath":"analyser/analyser-use.md"}'),t={name:"analyser/analyser-use.md"},e=l(`<h1 id="ready-to-make-xcm-multilocations-more-human-friendly-👨‍🏫" tabindex="-1">Ready to make XCM Multilocations more human friendly? 👨‍🏫 <a class="header-anchor" href="#ready-to-make-xcm-multilocations-more-human-friendly-👨‍🏫" aria-hidden="true">#</a></h1><p>This documentation provides you all steps necessary to implement core XCM Analyser functions. It also provides you with handy examples that can help you understand how to use this tool to its fullest potential.</p><h2 id="implementation" tabindex="-1">Implementation <a class="header-anchor" href="#implementation" aria-hidden="true">#</a></h2><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">NOTE:</span></span>
<span class="line"><span style="color:#A6ACCD;">The following junction types are supported:</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">Parachain</span></span>
<span class="line"><span style="color:#A6ACCD;">AccountId32</span></span>
<span class="line"><span style="color:#A6ACCD;">AccountIndex64</span></span>
<span class="line"><span style="color:#A6ACCD;">AccountKey20</span></span>
<span class="line"><span style="color:#A6ACCD;">PalletInstance</span></span>
<span class="line"><span style="color:#A6ACCD;">GeneralIndex</span></span>
<span class="line"><span style="color:#A6ACCD;">GeneralKey</span></span>
<span class="line"><span style="color:#A6ACCD;">OnlyChild</span></span>
<span class="line"><span style="color:#A6ACCD;">Plurality</span></span>
<span class="line"><span style="color:#A6ACCD;">GlobalConsensus</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><h4 id="compile-a-single-multilocation-object-to-the-url" tabindex="-1">Compile a single multilocation object to the URL <a class="header-anchor" href="#compile-a-single-multilocation-object-to-the-url" aria-hidden="true">#</a></h4><p>To compile a single multilocation object to url use the following structure:</p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#676E95;font-style:italic;">//Importing the call</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">convertMultilocationToUrl</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">@paraspell/xcm-analyser</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//Define the multilocation you wish to convert to URL</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">/*const multilocation: MultiLocation = {</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">      parents: &#39;0&#39;,</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">      interior: {</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">        X2: [</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">          {</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">            PalletInstance: &#39;50&#39;,</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">          },</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">          {</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">            GeneralIndex: &#39;41&#39;,</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">          },</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">        ],</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">      },</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">    };*/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> result </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">convertMultilocationToUrl</span><span style="color:#A6ACCD;">(multilocation)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">/*</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">This should result into:</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">&#39;./PalletInstance(50)/GeneralIndex(41)&#39;</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">*/</span></span>
<span class="line"></span></code></pre></div><h4 id="compile-a-single-multilocation-json-to-the-url" tabindex="-1">Compile a single multilocation JSON to the URL <a class="header-anchor" href="#compile-a-single-multilocation-json-to-the-url" aria-hidden="true">#</a></h4><p>To compile a single multilocation JSON to url use the following structure:</p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#676E95;font-style:italic;">//Importing the call</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">convertMultilocationToUrlJson</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">@paraspell/xcm-analyser</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//Define multilocation JSON</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">/*const multilocationJson = \`{</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">      &quot;parents&quot;: &quot;3&quot;,</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">      &quot;interior&quot;: {</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">        &quot;X2&quot;: [</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">          {</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">            &quot;PalletInstance&quot;: &quot;50&quot;</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">          },</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">          {</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">            &quot;GeneralIndex&quot;: &quot;41&quot;</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">          }</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">        ]</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">      }</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">    }\`*/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> result </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">convertMultilocationToUrl</span><span style="color:#A6ACCD;">(multilocationJson)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">/*</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">This should result into:</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">&#39;&#39;../../../PalletInstance(50)/GeneralIndex(41)&#39;&#39;</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">*/</span></span>
<span class="line"></span></code></pre></div><h4 id="compile-the-entire-xcm-call-to-the-url" tabindex="-1">Compile the entire XCM call to the URL <a class="header-anchor" href="#compile-the-entire-xcm-call-to-the-url" aria-hidden="true">#</a></h4><p>To compile the entire XCM call to the URL use the following structure:</p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#676E95;font-style:italic;">//Importing the call</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">convertXCMToUrls</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">@paraspell/xcm-analyser</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//Define XCM call arguments you wish to convert</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">/*const xcmCallArguments = [</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">  {</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">    V3: {</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">      parents: &#39;1&#39;,</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">      interior: {</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">        X1: {</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">          Parachain: &#39;2006&#39;,</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">        },</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">      },</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">    },</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">  },</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">  {</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">    V3: {</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">      parents: &#39;0&#39;,</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">      interior: {</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">        X1: {</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">          AccountId32: {</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">            network: null,</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">            id: &#39;accountID&#39;,</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">          },</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">        },</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">      },</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">    },</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">  },</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">  {</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">    V3: [</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">      {</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">        id: {</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">          Concrete: {</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">            parents: &#39;0&#39;,</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">            interior: {</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">              X2: [{ PalletInstance: &#39;50&#39; }, { GeneralIndex: &#39;1984&#39; }],</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">            },</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">          },</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">        },</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">        fun: {</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">          Fungible: &#39;amount&#39;,</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">        },</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">      },</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">    ],</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">  },</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">];*/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> urls </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">convertXCMToUrls</span><span style="color:#A6ACCD;">(xcmCallArguments)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">/*</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">This should result into:</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">[</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">  &#39;../Parachain(2006)&#39;,</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">  &#39;./AccountId32(null, accountID)&#39;,</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">  &#39;./PalletInstance(50)/GeneralIndex(1984)&#39;,</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">]</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">*/</span></span>
<span class="line"></span></code></pre></div>`,13),o=[e];function p(c,i,r,y,f,u){return a(),n("div",null,o)}const E=s(t,[["render",p]]);export{D as __pageData,E as default};
