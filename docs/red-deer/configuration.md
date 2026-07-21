# Red Deer MeshCore Configuration

## Regional Identifier

The Red Deer MeshCore community uses:

| Setting             | Value             |
| ------------------- | ----------------- |
| Regional identifier | **YQF**           |
| City                | Red Deer          |
| Region              | Central Alberta   |
| Province            | Alberta           |
| Community           | Red Deer MeshCore |

Use **YQF** wherever a MeshCore service, observer, mapper, dashboard, or regional configuration asks for the Red Deer regional identifier.

## Alberta Radio Settings

Use the established Alberta MeshCore radio parameters:

| Setting          | Value           |
| ---------------- | --------------- |
| Frequency        | **910.525 MHz** |
| Bandwidth        | **62.5 kHz**    |
| Spreading Factor | **SF7**         |
| Coding Rate      | **4/5**         |
| TX Power         | **22 dBm**      |

Nodes must use matching radio parameters to communicate reliably.

## Regional Configuration Summary

| Configuration item  | Red Deer value        |
| ------------------- | --------------------- |
| Community           | **Red Deer MeshCore** |
| Regional identifier | **YQF**               |
| Frequency           | **910.525 MHz**       |
| Bandwidth           | **62.5 kHz**          |
| Spreading factor    | **SF7**               |
| Coding rate         | **4/5**               |
| TX power            | **22 dBm**            |

## Repeater ID Planning

Before configuring or deploying a permanent repeater, review the current Red Deer repeater ID usage page.

[View Red Deer Repeater ID Usage](https://yqf.meshmapper.net/?repeater_ids){ .md-button .md-button--primary }

Avoid assigning a repeater ID that is already in active use within the regional network.

## Mapping Resources

### Red Deer MeshCore Map

[Open Red Deer MeshCore Map](https://yqf.meshmapper.net/?lat=52.24774&lon=-113.83849&zoom=10.52){ .md-button .md-button--primary }

### MeshMapper Red Deer

[Open MeshMapper Red Deer](https://yqf.meshmapper.net/){ .md-button .md-button--primary }

## Community Resource

Connect with local operators and community members through the Meshtastic Red Deer & Area Facebook group.

[Visit Meshtastic Red Deer & Area](https://www.facebook.com/groups/2133023680567311/){ .md-button .md-button--primary }

## Node Roles

### Companion

A companion node is normally paired with a phone, tablet, or computer for everyday messaging and network access.

### Repeater

A repeater extends network coverage by relaying compatible MeshCore traffic.

Good repeater locations usually provide:

* Reliable power
* Suitable elevation
* Minimal obstruction
* A properly tuned LoRa antenna
* Weather protection for outdoor equipment

### Observer

An observer receives local MeshCore traffic and may forward packet information to monitoring or analysis services.

### Mobile Mapping Node

A mobile node can help measure and document coverage while travelling through Red Deer and Central Alberta.

## Deployment Notes

When deploying MeshCore equipment in Red Deer:

* Use the **YQF** regional identifier.
* Use the published Alberta radio settings.
* Check repeater ID usage before assigning an ID.
* Coordinate permanent infrastructure with the local community where practical.
* Avoid unnecessary duplicate repeaters in the same immediate area.
* Use appropriate antennas and weatherproof enclosures.
* Test coverage before choosing a permanent installation location.

## Related Pages

* [Red Deer Overview](index.md)
* [Getting Started](../getting-started/index.md)
* [Alberta MeshCore Monitoring Tools](../monitoring-tools.md)
* [MeshCore Canada](../meshcore-canada.md)