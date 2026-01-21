# XCM Visualizer — User Guide

This section explores the capabilities of the **XCM Visualizer** from a user perspective and explains how to interact with its 3D and 2D visualizations, filters, and customization options.

## Observe the 3D Model

The XCM Visualizer provides several ways to navigate and customize the 3D visualization of cross-chain messaging.

### Initial Overview

When the XCM Visualizer loads, the 3D visualization is displayed automatically.

<img width="550" alt="overview" src="https://github.com/user-attachments/assets/7692d35b-9124-4742-a3e1-1396cc344d33" />

---

### Zoom In and Out

You can adjust the zoom level in the following ways:
- Use the mouse scroll wheel.
- Drag two fingers on a trackpad:
  - Drag upward to zoom out.
  - Drag downward to zoom in.

<img width="550" alt="zoom" src="https://github.com/user-attachments/assets/3beffdd3-5021-4c06-9454-b5c16730c179" />

---

### Rotate the Camera

To rotate the camera around the currently pinned center:
- Hold the left mouse button and drag.
- Perform a left-click drag on a trackpad.

<img width="550" alt="Sní́mka obrazovky 2025-02-19 o 13 16 03" src="https://github.com/user-attachments/assets/976e55e4-caf7-4e9c-904c-14cbe9b8929b" />

---

### Move the Pinned Center

The pinned center defines the focal point of the camera rotation.  
By default, it is set to the **Polkadot Relay Chain**.

To move the pinned center:
- Click both the left and right mouse buttons simultaneously (or the equivalent gesture on a trackpad).

<img width="550" alt="pinned" src="https://github.com/user-attachments/assets/1046579b-522f-4947-89d7-8099269caa73" />

---

## Select Specific Chains

Chains can be selected in two ways:
- Directly within the 3D visualization.
- Via the multi-select dropdown located in the bottom-left corner of the visualization screen.

Once chains are selected:
- All 2D graphs update to display data only for the selected chains.
- Channels originating from the selected chains are highlighted in **blue**.
- Channels representing destinations reachable from the selected chains are highlighted in **red**.

---

### Selection via 3D Visualization

<img width="550" alt="select" src="https://github.com/user-attachments/assets/38823255-83d1-42f6-8226-46611e8b8957" />

---

### Selection via Multi-Select Dropdown

<img width="550" alt="selectdrop" src="https://github.com/user-attachments/assets/28c29500-3ab3-4dbb-ac73-7ede30332108" />

---

### Select a Specific Channel

To inspect a specific channel:
- Click directly on a channel in the 3D visualization.

Detailed information will be displayed, including the total number of messages that passed through the selected channel.

<img width="550" alt="Channel" src="https://github.com/user-attachments/assets/904d2919-0542-4761-860d-c1e5ac52e844" />

---

## Select and Use 2D Graphs

The visualizer offers **four distinct 2D graph types**, each serving a different analytical purpose.

<img width="550" alt="options" src="https://github.com/user-attachments/assets/f6a3b40b-87c4-4c81-9e07-a3ade993bf6b" />

You can display **up to two 2D graphs simultaneously**.

<img width="550" alt="2graphs" src="https://github.com/user-attachments/assets/16780da5-175d-41b2-b38e-506e273ff236" />

All 2D graphs are interactive. You can:
- Hover for details.
- Click and drag to refine the view.

---

### 1. Accounts with the Most XCM Activity

This graph filters and displays accounts with the highest volume of XCM interactions for the selected chains.

<img width="550" alt="Accounts" src="https://github.com/user-attachments/assets/e404417f-bead-4c84-bb74-d5e2211c0ba8" />

---

### 2. XCM Messages Over Time

This graph visualizes the number of XCM messages sent over time, enabling trend analysis.

<img width="550" alt="transfers" src="https://github.com/user-attachments/assets/c1d09845-e16c-41f1-8d26-dd7ffc3f044b" />

---

### 3. Successful vs. Failed XCM Calls

This graph separates successful and failed cross-chain calls for the selected chains.

<img width="550" alt="successful" src="https://github.com/user-attachments/assets/b86a3859-a574-47f8-a7ad-0e7c0b9f09d1" />

---

### 4. Assets Transferred via XCM

This graph lists all assets transferred through cross-chain messages, along with the exact number of calls that transferred each asset.

<img width="550" alt="assets" src="https://github.com/user-attachments/assets/06b94a07-91b7-4fb5-adb1-8aa86044ad1e" />


## Select a Time Frame

To analyze XCM activity over a specific period:
- Click the **Select Date Range** button located on the bottom bar of the 3D visualization.

<img width="550" alt="calendar" src="https://github.com/user-attachments/assets/47ba4c5f-dde7-46d5-9038-e1c018447ee8" />

After selecting a date range:
- The 3D visualization updates to reflect XCM activity for the chosen period.
- All 2D graphs are updated accordingly.

<img width="550" alt="selectedtime" src="https://github.com/user-attachments/assets/3612fb30-6f22-4512-9f63-2bce80fb6540" />


## Customize the Color Scheme

To customize channel colors:
1. Locate the **Options** button in the bottom-right corner of the 3D visualization.
2. Open the color picker.

<img width="550" alt="optionsbutton" src="https://github.com/user-attachments/assets/e39feed4-5e93-49b3-99d1-aa080bf3a91e" />

You can customize the following colors:
- **Primary channel color** (unselected chains)
- **Highlighted channel color** (selected chains)
- **Secondary channel color** (destinations reachable from selected chains)
- **Destination channel color** (channels leading to reachable chains)

<img width="550" alt="color picker" src="https://github.com/user-attachments/assets/ec884c68-6392-4b9b-8ac4-6847a5de1afa" />

---

## Customize the Background (Skybox)

You can fully customize the skybox background by uploading images or generating them using external tools such as  
https://tools.wwwtyro.net/space-3d/index.html

The background customization option is available in the **Options** menu.

<img width="550" alt="skybox" src="https://github.com/user-attachments/assets/5839934b-a01b-4886-adc8-98511c093346" />

After uploading all required images:
- Click **Save Skybox**.

<img width="550" alt="newskybox" src="https://github.com/user-attachments/assets/ce2dc405-450b-4fca-8ebe-4cd9bbe22086" />

The new background is applied immediately after closing the options panel.

---

## Rearrange Chains

Chains can be rearranged automatically based on XCM activity:
1. Open the **Options** menu.
2. Select a rearrangement mode from the dropdown.

Available modes include:
- By number of received XCM messages
- By number of sent XCM messages
- By total XCM activity (sent and received)

<img width="550" alt="rearrange" src="https://github.com/user-attachments/assets/c4ac2ebf-2e25-4ab5-a094-4465858f904d" />


## Rearrange Individual Chains

Individual chains can also be repositioned manually:
- Right-click on a chain to select it.
- Move it to any desired position in 3D space (x, y, z).

All associated channels automatically adjust to follow the new position.

<img width="550" alt="individual" src="https://github.com/user-attachments/assets/12a4461a-2e66-4ed7-a093-53ba50ca214d" />
