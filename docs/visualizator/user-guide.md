# XCM Visualizator user guide 📚

Following section explores possibilities of XCM Visualizator tool.

## Observe 3D Model
There are multiple ways you can customize view of your custom 3D XCM Visualization.

### Basic overview
You can view 3D Visualization right after XCM Visualizator loads.
<img width="550" alt="img" src="https://gist.github.com/assets/55763425/7fb3681e-89ea-49d7-a5b0-18711009b0f0">




### Zoom in or out
You can zoom in with rotating wheel on mouse or by dragging two fingers on trackpad. Dragging up zooms out while dragging down zooms in.
<img width="550" alt="imgimgimg" src="https://gist.github.com/assets/55763425/95798611-a51f-4520-94f9-c2a1c409b088">



### Rotate camera
Clicking left mouse button or making left click on trackpad lets you to rotate camera around pinned center.

<img width="550" alt="image" src="https://gist.github.com/assets/55763425/48e33afd-b4df-44c1-9ca3-66d91035e6b7">

### Move pinned center
This feature will be more useful once multiple ecosystems will be implemented. For now, you can move your centered pin by clicking both left an right button on either mouse or trackpad. It is set to Polkadot Relay chain by default when tool loads.

<img width="550" alt="imaz" src="https://gist.github.com/assets/55763425/2e94f2a6-10b2-4193-a088-1f23bb30b909">

## Select specific chain/s
You can select chains either in 3D Visualization by simply clicking on desired chain/s or by selecting them from multiselect located on bottom left corner of the Visualization screen. The 2D graphs then update to only show data from selected chains. After selecting chain you can see a change in color of channels associated with selected chain/s (BLUE) and in color of channels that destination chain/s from selected chain/s can communicate with (RED).

### 3D Visualization selection
<img width="550" alt="selection" src="https://gist.github.com/assets/55763425/86f3a1d1-cedb-4e9e-9824-10a338552772">

### Multiselect dropdown selection
<img width="372" alt="dropdown" src="https://gist.github.com/assets/55763425/59cb27ef-67cd-4e0c-911c-64f29f924177">

### Specific channel selection
To choose specific channel and display its information, click directly on channel in 3D Visualization, you will then be able to display total of how many messages went through that channel.

<img width="550" alt="channel" src="https://gist.github.com/assets/55763425/341b15ef-b6a0-4a16-95a8-11a728a6d74a">

## Select 2D Graph
There are total of 4 2D graph designs each serving other useful purpose.
<img width="550" alt="options" src="https://gist.github.com/assets/55763425/12826251-efcb-44dc-b5d9-a190faba7ba8">

You can view up to 2 2D graphs at the same time.
<img width="550" alt="2graphs" src="https://gist.github.com/assets/55763425/3249db78-3a02-464c-9c74-a2b40fd6bb59">

Each 2D Graph is interactable. You can either hower od drag to customize. First 2D Graph design is designed to filter accounts with most XCM interaction for selected chains.
<img width="550" alt="accounts" src="https://gist.github.com/assets/55763425/9170ed63-93f7-4a31-a153-b7a9e8d99712">

Second 2D Graph is designed for observations of XCM message amounts per time.
<img width="550" alt="transfered" src="https://gist.github.com/assets/55763425/d361ff85-2e84-4aec-8b4e-aa4fc6dce01a">

Third 2D Graph allows for separating successful and failed cross-chain calls for selected chains. 
<img width="550" alt="successful" src="https://gist.github.com/assets/55763425/4a697346-cf87-4861-ac50-d9ee59787467">

Fourth 2D Graph lists all assets that were transfered in cross-chain messages for selected chain along with exact count of calls that transfered them.
<img width="550" alt="assets" src="https://gist.github.com/assets/55763425/4fa5fdbc-5c18-47a0-b1b6-01089ef8e415">

## Select time frame

To select custom time frame to observe how XCM scaled over time click on select date range button at bottom bar of 3D Visualization.
<img width="550" alt="calendar" src="https://gist.github.com/assets/55763425/9dccc6b4-efb5-4be7-a6c0-8a9dd8a1590a">

Once selected you can see XCM interpreted for selected time period. All 2D Visualizations are updated for selected period also.
<img width="550" alt="selected range" src="https://gist.github.com/assets/55763425/adcd0c48-9078-4ace-8dac-22475a14208e">

## Customize color scheme 
To customize color scheme firstly locate option button at the bottom right corner of 3D Visualization screen.

<img width="550" alt="optionsbutton" src="https://gist.github.com/assets/55763425/c2f674df-973e-4e96-8c2c-a3501c5f2706">


Then select color by color picker. There are 4 options to customize:
- Primary channel color (Unselected chains)
- Highlighted channel color (Selected specific chain)
- Secondary channel color (Where selected chains can communicate to (from destination perspective))
- Primary channel color (Where selected chains can communicate to)

<img width="550" alt="color picker" src="https://gist.github.com/assets/55763425/3d00b85c-ed65-4f57-897b-fa30765c3ee6">

## Rearange chains
To rearange chains simply select same option button highlighted in section above. Then select from options in dropdown. The chains can rearange either by amount of received, sent or by both kinds of XCM messages.

<img width="443" alt="Snímka obrazovky 2024-06-19 o 21 22 16" src="https://gist.github.com/assets/55763425/8279c393-7b2b-41b8-bedd-ed7863ac48d2">

## Send XCM
Sending XCM messages in XCM Visualization tool is only logical. You can try technology in action.

### Process of sending XCM

First step is to locate Send XCM button:
<img width="550" alt="button" src="https://gist.github.com/assets/55763425/393952d4-c941-4db6-8172-817610849a3a">

Once button is located and clicked user can fill in desired details (far less than normal thanks to [ParaSpell XCM SDK](https://github.com/paraspell/xcm-tools/tree/main/packages/sdk)) and then simply send the message.
<img width="550" alt="send" src="https://gist.github.com/assets/55763425/502aaa1c-cba3-46a6-95c9-5a276b5446cc">