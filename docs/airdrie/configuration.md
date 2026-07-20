# Airdrie MeshCore Configuration

## Airdrie Quick Links

[Airdrie MeshCore Map](https://live.meshcore.ca/#/live){ .md-button .md-button--primary }

[Airdrie LIVE Map WAEV.app](https://waev.app/#/live-map/@51.28107,-113.99966,14.47z){ .md-button .md-button--primary }

[Airdrie MeshCore Coverage - MeshMapper](https://yyc.meshmapper.net/?lat=51.28120&lon=-113.99718&zoom=13.43){ .md-button .md-button--primary }

[BRuTuS BR35 Repeater - Observer](https://live.meshcore.ca#/nodes/a56efdd9){ .md-button .md-button--primary }

[BRuTuS MC-HASS - Observer](https://live.meshcore.ca/#/observers/1A1C359D53F22161E2E2B285979FA37712FC6106334D06872A3AAD000B07879C){ .md-button .md-button--primary }

## Regional Identifier

Airdrie uses the following regional identifier:

| Setting         | Value                               |
| --------------- | ----------------------------------- |
| IATA zone       | **YYC**                             |
| Regional area   | Calgary and surrounding communities |
| Local community | Airdrie, Alberta                    |

Use **YYC** wherever a MeshCore application, MQTT service, observer, packet analyzer, or regional configuration asks for the local IATA or regional zone.

## Alberta Radio Settings

Use the following settings for the Alberta MeshCore network:

| Setting          | Value           |
| ---------------- | --------------- |
| Frequency        | **910.525 MHz** |
| Bandwidth        | **62.5 kHz**    |
| Spreading Factor | **SF7**         |
| Coding Rate      | **4/5**         |
| TX Power         | **22 dBm**      |

The radio parameters must match on all participating devices. A node using different settings will not communicate correctly with the Alberta MeshCore network.

## Node Roles

### Companion

A companion is normally used with a phone, tablet, or computer for messaging and everyday MeshCore use.

### Repeater

A repeater helps extend coverage by relaying compatible MeshCore traffic. Repeater locations should have reliable power, a suitable antenna, and good elevation where possible.

### Observer

An observer receives nearby MeshCore traffic and may publish packet information to MQTT or packet-analysis services.

## Airdrie Deployment Notes

When deploying nodes in Airdrie:

* Use the **YYC** regional identifier.
* Use the published Alberta radio settings.
* Avoid unnecessary duplication of repeaters in the same immediate area.
* Prefer locations with good elevation and minimal obstruction.
* Use an antenna designed for the relevant LoRa frequency range.
* Coordinate permanent infrastructure with the regional community where practical.

## Related Pages

[Airdrie MeshCore Map](https://live.meshcore.ca/#/live){ .md-button .md-button--primary }

[Airdrie LIVE Map WAEV.app](https://waev.app/#/live-map/@51.28107,-113.99966,14.47z){ .md-button .md-button--primary }

[Airdrie MeshCore Coverage - MeshMapper](https://yyc.meshmapper.net/?lat=51.28120&lon=-113.99718&zoom=13.43){ .md-button .md-button--primary }

[BRuTuS BR35 Repeater - Observer](https://live.meshcore.ca#/nodes/a56efdd9){ .md-button .md-button--primary }

[BRuTuS MC-HASS - Observer](https://live.meshcore.ca/#/observers/1A1C359D53F22161E2E2B285979FA37712FC6106334D06872A3AAD000B07879C){ .md-button .md-button--primary }