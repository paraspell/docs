import{_ as e,c as a,o as l,d as n}from"./app.033c03ff.js";const D=JSON.parse('{"title":"Basilisk XYK Pallet","description":"","frontmatter":{},"headers":[{"level":2,"title":"Builder pattern addLiquidity","slug":"builder-pattern-addliquidity","link":"#builder-pattern-addliquidity","children":[]},{"level":2,"title":"Builder pattern removeLiquidity","slug":"builder-pattern-removeliquidity","link":"#builder-pattern-removeliquidity","children":[]},{"level":2,"title":"Builder pattern createPool","slug":"builder-pattern-createpool","link":"#builder-pattern-createpool","children":[]},{"level":2,"title":"Builder pattern buy","slug":"builder-pattern-buy","link":"#builder-pattern-buy","children":[]},{"level":2,"title":"Builder pattern sell","slug":"builder-pattern-sell","link":"#builder-pattern-sell","children":[]},{"level":2,"title":"Functional pattern addLiquidity","slug":"functional-pattern-addliquidity","link":"#functional-pattern-addliquidity","children":[]},{"level":2,"title":"Functional pattern removeLiquidity","slug":"functional-pattern-removeliquidity","link":"#functional-pattern-removeliquidity","children":[]},{"level":2,"title":"Functional pattern createPool","slug":"functional-pattern-createpool","link":"#functional-pattern-createpool","children":[]},{"level":2,"title":"Functional pattern buy","slug":"functional-pattern-buy","link":"#functional-pattern-buy","children":[]},{"level":2,"title":"Functional pattern sell","slug":"functional-pattern-sell","link":"#functional-pattern-sell","children":[]},{"level":2,"title":"Developer experience","slug":"developer-experience","link":"#developer-experience","children":[{"level":3,"title":"Builder pattern experience","slug":"builder-pattern-experience","link":"#builder-pattern-experience","children":[]}]}],"relativePath":"sdk/XYK.md"}'),t={name:"sdk/XYK.md"},s=n(`<h1 id="basilisk-xyk-pallet" tabindex="-1">Basilisk XYK Pallet <a class="header-anchor" href="#basilisk-xyk-pallet" aria-hidden="true">#</a></h1><p>This pallet is used for a decentralized exachange of different assets supported by <code>Basilisk</code>.</p><p>Our SDK supports this pallet in both <code>Builder pattern</code> and <code>Function pattern</code>.</p><p><strong>Both</strong> will be explained below.</p><p>Quick intro to XYK functionality:</p><ul><li><strong>addLiquidity</strong>: This call serves to add liquidity to specific pool</li><li><strong>removeLiquidity</strong>: This call serves to remove liquidity of specific pool</li><li><strong>createPool</strong>: Call that creates pool with new assets</li><li><strong>buy</strong>: Call that allows to buy asset from pool that exists</li><li><strong>sell</strong>: Call that allows to sell specific asset from pool that exists</li></ul><h2 id="builder-pattern-addliquidity" tabindex="-1">Builder pattern addLiquidity <a class="header-anchor" href="#builder-pattern-addliquidity" aria-hidden="true">#</a></h2><p>TBA</p><h2 id="builder-pattern-removeliquidity" tabindex="-1">Builder pattern removeLiquidity <a class="header-anchor" href="#builder-pattern-removeliquidity" aria-hidden="true">#</a></h2><p>TBA</p><h2 id="builder-pattern-createpool" tabindex="-1">Builder pattern createPool <a class="header-anchor" href="#builder-pattern-createpool" aria-hidden="true">#</a></h2><p>TBA</p><h2 id="builder-pattern-buy" tabindex="-1">Builder pattern buy <a class="header-anchor" href="#builder-pattern-buy" aria-hidden="true">#</a></h2><p>TBA</p><h2 id="builder-pattern-sell" tabindex="-1">Builder pattern sell <a class="header-anchor" href="#builder-pattern-sell" aria-hidden="true">#</a></h2><p>TBA</p><h2 id="functional-pattern-addliquidity" tabindex="-1">Functional pattern addLiquidity <a class="header-anchor" href="#functional-pattern-addliquidity" aria-hidden="true">#</a></h2><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">paraspell</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">xyk</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">addLiquidity</span><span style="color:#A6ACCD;">(api: ApiPromise</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> assetA: number</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> assetB: number</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> amountA: any</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> amountBMaxLimit: any)</span></span>
<span class="line"></span></code></pre></div><h2 id="functional-pattern-removeliquidity" tabindex="-1">Functional pattern removeLiquidity <a class="header-anchor" href="#functional-pattern-removeliquidity" aria-hidden="true">#</a></h2><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">paraspell</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">xyk</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">removeLiquidity</span><span style="color:#A6ACCD;">(api: ApiPromise</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> assetA: number</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> assetB: number</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> liquidityAmount: any)</span></span>
<span class="line"></span></code></pre></div><h2 id="functional-pattern-createpool" tabindex="-1">Functional pattern createPool <a class="header-anchor" href="#functional-pattern-createpool" aria-hidden="true">#</a></h2><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">paraspell</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">xyk</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">createPool</span><span style="color:#A6ACCD;">(api: ApiPromise</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> assetA: number</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> amountA: any</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> assetB: number</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> amountB: any)</span></span>
<span class="line"></span></code></pre></div><h2 id="functional-pattern-buy" tabindex="-1">Functional pattern buy <a class="header-anchor" href="#functional-pattern-buy" aria-hidden="true">#</a></h2><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">paraspell</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">xyk</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">buy</span><span style="color:#A6ACCD;">(api: ApiPromise</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> assetOut: number</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> assetIn: number</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> amount: any</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> maxLimit: any</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> discount: Bool)</span></span>
<span class="line"></span></code></pre></div><h2 id="functional-pattern-sell" tabindex="-1">Functional pattern sell <a class="header-anchor" href="#functional-pattern-sell" aria-hidden="true">#</a></h2><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">paraspell</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">xyk</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">sell</span><span style="color:#A6ACCD;">(api: ApiPromise</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> assetIn: number</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> assetOut: number</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> amount: any</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> maxLimit: any</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> discount: Bool)</span></span>
<span class="line"></span></code></pre></div><h2 id="developer-experience" tabindex="-1">Developer experience <a class="header-anchor" href="#developer-experience" aria-hidden="true">#</a></h2><h3 id="builder-pattern-experience" tabindex="-1">Builder pattern experience <a class="header-anchor" href="#builder-pattern-experience" aria-hidden="true">#</a></h3><p>When developing with Builder pattern, the developer is guided by the typescript and thus knows which parameter can be added as next. This increases the developer experience and makes SDK easier to use. <img width="498" alt="Screenshot 2023-01-08 at 14 27 53" src="https://user-images.githubusercontent.com/79721475/211198665-ffb3eeb0-402d-4fad-9705-9a863fb894c6.png"></p>`,29),i=[s];function r(p,o,c,d,u,y){return l(),a("div",null,i)}const A=e(t,[["render",r]]);export{D as __pageData,A as default};