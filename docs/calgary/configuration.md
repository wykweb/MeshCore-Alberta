# Calgary MeshCore Configuration

This page documents the current recommended MeshCore configuration for nodes participating in the Calgary (YYC) regional network.

Configuration recommendations are maintained by the Alberta MeshCore community. Before changing network-wide settings, verify the current standards with the Calgary administrators.

---

## Region

| Item | Value |
|------|------|
| Community | Calgary |
| Province | Alberta |
| Country | Canada |
| Regional Identifier | YYC |

## Calgary MeshCore Map

[View Calgary MeshCore Map](https://yyc.meshmapper.net/index.php?lat=51.09012&lon=-114.06190&zoom=10.66){ .md-button .md-button--primary }

---

## Calgary Repeater ID Usage

Check repeater ID usage for the Calgary regional network before configuring or deploying a repeater.

[View Calgary Repeater ID Usage](https://yyc.meshmapper.net/?repeater_ids){ .md-button .md-button--primary }

## Calgary Repeater List

Check the repeater list for the Calgary regional network.

[View Calgary Repeater List](https://yyc.meshmapper.net/?repeater_list){ .md-button .md-button--primary }

## Calgary Observers List

Check the observers list for the Calgary regional network.

[View Calgary Observers List](https://yyc.meshmapper.net/?observers){ .md-button .md-button--primary }

## Calgary Leaderboard List - YYC Stats

Check the leaderboard list for the Calgary regional network.

[View Calgary Leaderboard List](https://yyc.meshmapper.net/leaderboard.php){ .md-button .md-button--primary }

## MeshCore Radio Defaults

Match these settings to participate in the Calgary MeshCore network.

| Setting | Value |
|---------|------|
| Frequency | **910.525 MHz** |
| Bandwidth | **62.5 kHz** |
| Spreading Factor | **SF7** |
| Coding Rate | **4/5** |
| TX Power | **22 dBm** |

> **Note:** These settings represent the current Calgary recommendations and may change as the Alberta MeshCore network evolves.

---

## Region & Regulatory

| Setting | Value |
|---------|------|
| Region | North America (902–928 MHz ISM) |
| Maximum EIRP | 30 dBm (1 Watt) |

EIRP equals transmitter power plus antenna gain minus feedline loss.

Example:

- Radio: 22 dBm
- Antenna: 5 dBi
- Feedline Loss: 0 dB

Result:

27 dBm EIRP

This remains below the Canadian regulatory limit.

---

## Recommended Node Roles

| Mode | Recommended Use |
|------|-----------------|
| Companion | Everyday handheld node paired with the mobile application |
| Repeater | Fixed infrastructure node extending network coverage |
| Room Server | Dedicated server hosting persistent MeshCore rooms |
| Sensor | Telemetry-only deployments |
| Terminal Chat | Stand-alone messaging devices |

For most users, **Companion** mode is recommended.

---

## Public Channel

All new nodes should initially join the public MeshCore channel for discovery.

Once connected to the Calgary community, additional private rooms and regional channels may be configured.

---

## Calgary Infrastructure

The Calgary MeshCore network is expanding with:

- Observer Stations
- MQTT Infrastructure
- CoreScope Monitoring
- MeshMonitoring Integration
- Regional Dashboards
- Community Beacons

---

## Supported Hardware

Recommended hardware includes:

- Heltec V3
- LILYGO T-Beam
- RAK WisBlock
- Seeed SenseCAP
- M5Stack Cardputer
- ThinkNode M7 Gateway
- Additional MeshCore-supported LoRa devices

---

## MeshCore vs Meshtastic

| MeshCore | Meshtastic |
|----------|------------|
| Source Routing | Flood Routing |
| Rooms | Channels |
| Lower Airtime Usage | Higher Airtime Usage |
| Optimized for Large Networks | Mature Ecosystem |
| Alberta Primary Network | Compatible but Separate |

MeshCore and Meshtastic operate on the same ISM band but use different protocols. Nodes running one platform cannot communicate directly with nodes running the other.