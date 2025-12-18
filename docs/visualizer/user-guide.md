# XCM Visualizer user guide 🕹️

Following section explores possibilities of XCM Visualizer tool.

## Observe 3D Model
There are multiple ways you can customize view of your custom 3D XCM Visualization.

### Basic overview
You can view 3D Visualization right after XCM Visualizer loads.

<img width="550" alt="overview" src="https://github.com/user-attachments/assets/7692d35b-9124-4742-a3e1-1396cc344d33" />

### Zoom in or out
You can zoom in with rotating wheel on mouse or by dragging two fingers on trackpad. Dragging up zooms out while dragging down zooms in.

<img width="550" alt="zoom" src="https://github.com/user-attachments/assets/3beffdd3-5021-4c06-9454-b5c16730c179" />

### Rotate camera
Clicking left mouse button or making left click on trackpad lets you to rotate camera around pinned center.

<img width="550" alt="Snímka obrazovky 2025-02-19 o 13 16 03" src="https://github.com/user-attachments/assets/976e55e4-caf7-4e9c-904c-14cbe9b8929b" />

### Move pinned center
This feature will be more useful once multiple ecosystems will be implemented. For now, you can move your centered pin by clicking both left an right button on either mouse or trackpad. It is set to Polkadot Relay chain by default when tool loads.

<img width="550" alt="pinned" src="https://github.com/user-attachments/assets/1046579b-522f-4947-89d7-8099269caa73" />

## Select specific chain/s
You can select chains either in 3D Visualization by simply clicking on desired chain/s or by selecting them from multiselect located on bottom left corner of the Visualization screen. The 2D graphs then update to only show data from selected chains. After selecting chain you can see a change in color of channels associated with selected chain/s (BLUE) and in color of channels that destination chain/s from selected chain/s can communicate with (RED).

### 3D Visualization selection
<img width="550" alt="select" src="https://github.com/user-attachments/assets/38823255-83d1-42f6-8226-46611e8b8957" />

### Multiselect dropdown selection
<img width="550" alt="selectdrop" src="https://github.com/user-attachments/assets/28c29500-3ab3-4dbb-ac73-7ede30332108" />

### Specific channel selection
To choose specific channel and display its information, click directly on channel in 3D Visualization, you will then be able to display total of how many messages went through that channel.

<img width="550" alt="Channel" src="https://github.com/user-attachments/assets/904d2919-0542-4761-860d-c1e5ac52e844" />

## Select 2D Graph
There are total of 4 2D graph designs each serving other useful purpose.

<img width="550" alt="options" src="https://github.com/user-attachments/assets/f6a3b40b-87c4-4c81-9e07-a3ade993bf6b" />

You can view up to 2 2D graphs at the same time.

<img width="550" alt="2graphs" src="https://github.com/user-attachments/assets/16780da5-175d-41b2-b38e-506e273ff236" />

Each 2D Graph is interactable. You can either hower or drag to customize. First 2D Graph design is designed to filter accounts with most XCM interaction for selected chains.

<img width="550" alt="Accounts" src="https://github.com/user-attachments/assets/e404417f-bead-4c84-bb74-d5e2211c0ba8" />

Second 2D Graph is designed for observations of XCM message amounts per time.

<img width="550" alt="transfers" src="https://github.com/user-attachments/assets/c1d09845-e16c-41f1-8d26-dd7ffc3f044b" />

Third 2D Graph allows for separating successful and failed cross-chain calls for selected chains. 

<img width="550" alt="successful" src="https://github.com/user-attachments/assets/b86a3859-a574-47f8-a7ad-0e7c0b9f09d1" />

Fourth 2D Graph lists all assets that were transfered in cross-chain messages for selected chain along with exact count of calls that transfered them.

<img width="550" alt="assets" src="https://github.com/user-attachments/assets/06b94a07-91b7-4fb5-adb1-8aa86044ad1e" />

## Select time frame

To select custom time frame to observe how XCM scaled over time click on select date range button at bottom bar of 3D Visualization.

<img width="550" alt="calendar" src="https://github.com/user-attachments/assets/47ba4c5f-dde7-46d5-9038-e1c018447ee8" />

Once selected you can see XCM interpreted for selected time period. All 2D Visualizations are updated for selected period also.

<img width="550" alt="selectedtime" src="https://github.com/user-attachments/assets/3612fb30-6f22-4512-9f63-2bce80fb6540" />

## Customize color scheme 
To customize color scheme firstly locate option button at the bottom right corner of 3D Visualization screen.

<img width="550" alt="optionsbutton" src="https://github.com/user-attachments/assets/e39feed4-5e93-49b3-99d1-aa080bf3a91e" />

Then select color by color picker. There are 4 options to customize:
- Primary channel color (Unselected chains)
- Highlighted channel color (Selected specific chain)
- Secondary channel color (Where selected chains can communicate to (from destination perspective))
- Primary channel color (Where selected chains can communicate to)

<img width="550" alt="color picker" src="https://github.com/user-attachments/assets/ec884c68-6392-4b9b-8ac4-6847a5de1afa" />

## Customize background
You can now fully customize your skybox background. This can be done by either [generating](https://tools.wwwtyro.net/space-3d/index.html) or providing images. The option to customize the background can be found in the "options" button.

<img width="550" alt="skybox" src="https://github.com/user-attachments/assets/5839934b-a01b-4886-adc8-98511c093346" />

Once all the necessary images are provided, click the "save skybox" button.

<img width="550" alt="newskybox" src="https://github.com/user-attachments/assets/ce2dc405-450b-4fca-8ebe-4cd9bbe22086" />

Your background should appear immediately after you close options button.

## Rearange chains
To rearange chains simply select same option button highlighted in section above. Then select from options in dropdown. The chains can rearange either by amount of received, sent or by both kinds of XCM messages.

<img width="550" alt="rearrange" src="https://github.com/user-attachments/assets/c4ac2ebf-2e25-4ab5-a094-4465858f904d" />

## Rearange individual chains
You can now rearange individual chains by simply selecting them with right click. The rearangement can be done to any coordinate in 3D space (x,y,z). The channels will follow.

<img width="550" alt="individual" src="https://github.com/user-attachments/assets/12a4461a-2e66-4ed7-a093-53ba50ca214d" />