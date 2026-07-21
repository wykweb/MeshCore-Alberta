# Lethbridge MeshCore Configuration

## Regional Identifier

The Lethbridge MeshCore community uses the following regional identifier:

| Setting         | Value                           |
| --------------- | ------------------------------- |
| IATA zone       | **YQL**                         |
| Regional area   | Lethbridge and Southern Alberta |
| Local community | YQLMesh                         |
| Province        | Alberta                         |

Use **YQL** wherever a MeshCore application, MQTT service, observer, packet analyzer, coverage mapper, or regional configuration asks for the local IATA or regional zone.

Do not use the Calgary **YYC** identifier for Lethbridge infrastructure. The correct identifier for the Lethbridge regional network is **YQL**.

## Alberta Radio Settings

Use the following radio parameters when joining the Alberta MeshCore network:

| Setting          | Value           |
| ---------------- | --------------- |
| Frequency        | **910.525 MHz** |
| Bandwidth        | **62.5 kHz**    |
| Spreading Factor | **SF7**         |
| Coding Rate      | **4/5**         |
| TX Power         | **22 dBm**      |

The radio parameters must match on participating devices. A node using different radio settings may not communicate with the Alberta MeshCore network.

## Regional Configuration Summary

| Configuration item | Lethbridge value |
| ------------------ | ---------------- |
| Community name     | **YQLMesh**      |
| IATA identifier    | **YQL**          |
| Frequency          | **910.525 MHz**  |
| Bandwidth          | **62.5 kHz**     |
| Spreading factor   | **SF7**          |
| Coding rate        | **4/5**          |
| TX power           | **22 dBm**       |

## Lethbridge LIVE Coverage Map

[Open Lethbridge MeshCore Map](https://yql.meshmapper.net/?lat=49.69674&lon=-112.83309&zoom=12.25){ .md-button .md-button--primary }

## MeshMapper Lethbridge

Open the main Lethbridge MeshMapper dashboard.

[Open MeshMapper Lethbridge](https://yql.meshmapper.net/){ .md-button .md-button--primary }

## Lethbridge Repeater ID Usage

Check repeater ID usage for the Lethbridge regional network before configuring or deploying a repeater.

[View Lethbridge Repeater ID Usage](https://yql.meshmapper.net/?repeater_ids){ .md-button .md-button--primary }

## Lethbridge Repeaters List

View the Repeaters list for Lethbridge area.

[Open Lethbridge Repeaters List](https://yql.meshmapper.net/?repeater_list){ .md-button .md-button--primary }

## Lethbridge Observers List

View the Observers list for Lethbridge area.

[Open Lethbridge Observers List](https://yql.meshmapper.net/?observers){ .md-button .md-button--primary }

## Lethbridge Leaderboard List

View the Leaderboard list for the Lethbridge area.

[Open Lethbridge Leaderboard List](https://yql.meshmapper.net/leaderboard.php){ .md-button .md-button--primary }


## Node Roles

### Companion

A companion is normally paired with a phone, tablet, or computer and is used for messaging and everyday MeshCore communication.

### Repeater

A repeater helps extend the range of the network by relaying compatible MeshCore traffic.

Repeater locations should have:

* Reliable power
* A suitable LoRa antenna
* Good elevation where possible
* Minimal surrounding obstruction
* Weather protection for outdoor installations

### Observer

An observer receives nearby MeshCore traffic and may publish packet information to MQTT servers, packet analyzers, or monitoring dashboards.

### Mobile Coverage-Mapping Node

A mobile node may be used to collect coverage information while travelling through Lethbridge and the surrounding region.

Coverage data can be viewed on the Lethbridge MeshMapper service.

[Open Lethbridge MeshMapper](https://yql.meshmapper.net/?lat=49.69766&lon=-112.85630&zoom=12.32){ .md-button .md-button--primary }

## Lethbridge Deployment Notes

When deploying MeshCore devices in Lethbridge:

* Use the **YQL** regional identifier.
* Use the published Alberta radio parameters.
* Coordinate permanent repeater infrastructure with the local community where practical.
* Avoid placing unnecessary duplicate repeaters in the same immediate area.
* Prefer locations with good elevation and minimal obstruction.
* Use an antenna designed for the relevant LoRa frequency range.
* Secure and weatherproof outdoor equipment.
* Test coverage before selecting a permanent installation location.

## Community Resources

[YQLMesh Website](https://www.yqlmesh.com/){ .md-button .md-button--primary }

[Lethbridge LIVE Coverage Map](https://yql.meshmapper.net/?lat=49.69766&lon=-112.85630&zoom=12.32){ .md-button .md-button--primary }

## Related Pages

* [Lethbridge Overview](index.md)
* [Getting Started](../getting-started/index.md)
* [Alberta MeshCore Monitoring Tools](../monitoring-tools.md)
* [MeshCore Canada](../meshcore-canada.md)

## YQLMesh Social

* [YQLMesh Discord](https://discord.gg/cFY9GSR37W)
* [YQLMesh on Facebook](https://facebook.com/groups/YQLMesh)
* [YQLMesh on Instagram](https://instagram.com/YQLMesh)
* [YQLMesh on X](https://x.com/YQLMesh)
* [YQLMesh on Reddit](https://www.reddit.com/r/YQLMesh)