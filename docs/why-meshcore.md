# Why MeshCore Network?

## Building resilient, community-operated communication across Alberta

Alberta MeshCore is a community-supported effort to build a practical, long-range text communication network using affordable LoRa radio hardware and the open-source MeshCore platform.

The network is intended to complement—not replace—cellular service, internet access, amateur radio, public-safety systems or emergency services. Its value is that compatible radios can exchange short messages directly and through community-operated repeaters without depending on a commercial cellular network.

[Get Started](getting-started/index.md){ .md-button .md-button--primary }
[Calgary Network](calgary/index.md){ .md-button }
[Alberta Network](provinces/alberta.md){ .md-button }

---

## On this page

* [Our mission](#our-mission)
* [What is Alberta MeshCore?](#what-is-alberta-meshcore)
* [Why build a mesh network?](#why-build-a-mesh-network)
* [How does it work?](#how-does-it-work)
* [Explain it like I am five](#explain-it-like-i-am-five)
* [What can the network do?](#what-can-the-network-do)
* [What are its possible uses?](#what-are-its-possible-uses)
* [What is the current Alberta coverage?](#what-is-the-current-alberta-coverage)
* [Why use MeshCore?](#why-use-meshcore)
* [Frequently asked questions](#frequently-asked-questions)
* [How do I get started?](#how-do-i-get-started)

---

## Our mission

Our mission is to encourage creative and technical cooperation among people building a resilient, sustainable and community-operated MeshCore network across Alberta.

The project begins with Calgary and surrounding communities while supporting the growth of compatible local networks throughout the province.

Participants may include radio enthusiasts, software developers, emergency-preparedness volunteers, makers, community organizations, property owners, sensor operators and people who simply want to experiment with useful off-grid communication technology.

---

## What is Alberta MeshCore?

Alberta MeshCore is a growing network of individually owned companion radios, repeaters, room servers, observers and monitoring systems.

There is no single commercial operator responsible for building the entire network. Individuals and community groups install and maintain nodes that collectively improve regional coverage.

The network can support public messages, private channels and encrypted direct messages, depending on the device, application and configuration being used.

---

## Why build a mesh network?

People participate for many different reasons, including:

* emergency and outage preparedness;
* off-grid communication;
* community coordination;
* experimenting with LoRa radios;
* learning about antennas and radio propagation;
* building solar-powered repeaters;
* developing software and monitoring tools;
* collecting weather or environmental telemetry;
* communicating at camps, festivals and remote events;
* mapping radio coverage;
* maintaining contact in areas with limited cellular service;
* and simply building something useful with other people.

Most residents do not have access to dedicated public-safety or commercial emergency communication systems.

A community mesh provides another communication option. One person can install a node, neighbors can add more nodes and a well-positioned repeater can help connect areas that could not previously communicate.

Every useful installation can become the starting point for additional coverage.

!!! warning "Not a replacement for emergency services"

```
MeshCore is not a guaranteed emergency communication service. Never depend on it as your only way to contact police, fire, ambulance, Search and Rescue or other emergency responders.
```

---

## How does it work?

MeshCore radios use LoRa, which stands for **Long Range**, to exchange small amounts of data over radio.

In Alberta, compatible devices generally operate within the permitted Canadian licence-exempt radio spectrum and must comply with applicable Canadian regulations, power limits and equipment requirements.

People normally join the network using a small **companion radio** connected to a phone through Bluetooth, or by using a compatible standalone device.

A simplified message path looks like this:

```text
Phone or standalone device
          ↓
    Companion radio
          ↓
       Repeater
          ↓
   Additional repeaters
          ↓
 Recipient companion
          ↓
 Recipient phone or device
```

When a message is sent, nearby repeaters can relay it toward other devices. The relay process extends coverage beyond the direct radio range of one companion device.

Repeaters placed at good elevations may cover considerably larger areas than devices located indoors or close to the ground. Actual range always depends on terrain, antenna quality, elevation, obstructions, radio settings, interference and weather-related installation conditions.

Alberta presents both challenges and opportunities:

* dense urban construction can block radio signals;
* river valleys and coulees can create coverage shadows;
* open prairie may provide excellent line-of-sight paths;
* foothills and mountain terrain require careful placement;
* towers, rooftops, hills and other elevated locations may provide valuable repeater sites;
* and winter temperatures require appropriate batteries, enclosures and charging protection.

---

## Explain it like I am five

Imagine that you want to pass a note to someone on the other side of a large classroom.

You cannot reach that person directly, so you give the note to someone nearby. That person passes it to another person, who passes it again until it reaches the destination.

The people in the middle are like **repeaters**.

For a public message, people on the network may be able to read the note.

For a private or encrypted message, the people helping pass the note along cannot understand it unless they have the correct key.

MeshCore performs this process digitally using radio waves instead of paper notes.

---

## What can the network do?

### Public channels

A public channel can carry messages intended for everyone using that channel.

Public messages should be treated as public information. Do not transmit passwords, confidential client information, private medical information or anything that should not be widely visible.

### Hashtag or community channels

Community channels can be organized around a location, activity or shared interest.

Possible Alberta examples could include:

```text
#calgary
#edmonton
#reddeer
#lethbridge
#airdrie
#cochrane
#okotoks
#foothills
#weather
#radio
#events
```

Channel availability and naming depend on local community adoption and configuration.

### Private channels

Private channels can be used by a specific family, team, event group or organization.

Members must receive the correct channel information and encryption key through a trusted method.

### Direct messages

Compatible MeshCore applications can support encrypted direct messages between individual contacts.

Contact exchange may involve advertisements, contact imports or in-person QR-code scanning, depending on the application and device.

### Optional location sharing

Some compatible devices and applications may allow users to share location information.

Location sharing should always be intentional. Users should understand who can receive that information before enabling it.

### Telemetry and sensors

Nodes may report operational information such as:

* battery voltage;
* signal strength;
* signal-to-noise ratio;
* device status;
* and other supported telemetry.

More advanced installations may incorporate sensors for:

* temperature;
* humidity;
* atmospheric pressure;
* air quality;
* precipitation;
* equipment monitoring;
* or other environmental measurements.

---

## What are its possible uses?

### Everyday community communication

The network can be used to:

* welcome new operators;
* exchange technical help;
* announce community events;
* coordinate local activities;
* test new coverage;
* report repeater status;
* and keep the network active through normal daily use.

A network used regularly is more familiar and useful than one that is turned on only during an emergency.

### Power and internet outages

During a power, cellular or internet outage, compatible battery-powered radios may continue communicating directly or through repeaters that remain operational.

Possible uses include:

* sharing local outage observations;
* checking on neighbors;
* identifying open warming or cooling locations;
* coordinating supplies;
* and reporting general conditions.

Information received over the mesh should be verified whenever possible. Rumors and unconfirmed emergency information can cause harm.

### Rural and remote communication

MeshCore may provide an additional communication option for:

* farms and acreages;
* campgrounds;
* backcountry staging areas;
* outdoor events;
* remote worksites;
* and regions with unreliable cellular service.

Coverage must be tested before relying on it for any activity.

### Events and temporary deployments

Temporary companion nodes and repeaters may help participants communicate at:

* festivals;
* community events;
* outdoor gatherings;
* volunteer activities;
* radio demonstrations;
* and technical workshops.

Event operators must still comply with venue requirements and applicable Canadian radio regulations.

### Technical experimentation and education

MeshCore provides a practical environment for learning about:

* radio propagation;
* antennas;
* LoRa;
* embedded devices;
* solar power;
* batteries;
* networking;
* open-source software;
* MQTT;
* mapping;
* telemetry;
* and distributed systems.

---

## What is the current Alberta coverage?

Alberta MeshCore is an evolving community network. Coverage is not universal, permanent or guaranteed.

The initial Alberta documentation and coordination effort is focused on Calgary and surrounding communities. Other Alberta communities may develop local coverage independently or connect with nearby regions as additional nodes are deployed.

Coverage can change because:

* repeaters are added, moved or removed;
* batteries become depleted;
* antennas or equipment fail;
* seasonal foliage changes;
* buildings or terrain block signals;
* radio settings change;
* and temporary nodes go offline.

A location appearing within a broad mapped area does not guarantee reliable indoor or outdoor communication.

The best way to evaluate coverage is to test with a properly configured device at the exact location where it will be used.

---

## Why use MeshCore?

MeshCore is designed primarily for efficient text messaging across LoRa radio networks.

Its messaging-focused approach can offer several advantages:

* relatively low power consumption;
* suitability for battery and solar installations;
* automatic message relaying;
* support for companion nodes and repeaters;
* public and private communication options;
* open-source development;
* affordable compatible hardware;
* and the ability to grow through community participation.

No single protocol is ideal for every situation. MeshCore should be viewed as one useful part of a broader communication and preparedness plan.

---

## Frequently asked questions

### Does MeshCore require internet access?

Normal radio communication between nearby MeshCore nodes and repeaters does not require internet access.

Some optional services—such as web maps, remote monitoring, MQTT integrations, firmware downloads or internet-linked gateways—may require an internet connection.

### Does MeshCore require cellular service?

No. Companion radios communicate with the phone or standalone device locally, and the radio network carries the messages.

The phone may still be used as the user interface, but cellular service is not required for local Bluetooth communication with the companion radio.

### Is it the same as amateur radio?

No.

MeshCore commonly uses licence-exempt spectrum and compliant low-power radio hardware. Amateur radio operates under separate licensing, technical and content rules.

Operators remain responsible for using legal equipment and complying with Innovation, Science and Economic Development Canada requirements.

### Is it the same as Meshtastic?

No. MeshCore and Meshtastic both use LoRa hardware and can support off-grid messaging, but they use different software, protocols and network designs.

A device flashed with MeshCore firmware does not automatically communicate with a Meshtastic network.

### Are all messages private?

No.

Public-channel messages should be assumed to be publicly visible.

Private channels and direct messages may use encryption, but security depends on proper configuration, safe key exchange, current software and responsible device management.

Never post private information on a public channel.

### Can it replace a satellite messenger?

No.

A satellite messenger communicates through satellite infrastructure and may provide purpose-built emergency features. MeshCore depends on compatible terrestrial nodes and available radio paths.

### Can it replace 911?

No.

MeshCore is not a replacement for 911 or any official emergency communication service.

### How far can it communicate?

There is no single guaranteed distance.

Range depends on:

* antenna type and installation;
* radio power and configuration;
* repeater availability;
* terrain;
* elevation;
* buildings and vegetation;
* interference;
* and whether a clear radio path exists.

A rooftop or hilltop repeater can communicate much farther than a companion radio located inside a basement.

### Who owns the network?

Individual participants generally own and maintain their own devices.

Alberta MeshCore documentation helps communities coordinate compatible practices, but it does not imply ownership or operational control over every node using MeshCore in Alberta.

### Is there a monthly fee?

The radio network itself does not inherently require a monthly subscription.

Participants are responsible for their own hardware, batteries, antennas, internet services, hosting or other optional infrastructure they choose to operate.

### Can anyone join?

Compatible participation is generally community-oriented and open, subject to lawful operation, available coverage, appropriate configuration and respectful use.

Private channels and privately operated infrastructure may have their own access policies.

### What happens when a repeater goes offline?

Messages may take another available route, reach fewer areas or fail to arrive.

A resilient network benefits from multiple well-positioned repeaters rather than depending on a single critical installation.

### Can I install a repeater anywhere?

No.

You need permission from the property owner or site operator. Installations must be safe, weather-resistant and compliant with applicable building, electrical, radio and site requirements.

Never climb a tower, utility structure, rooftop or other elevated location without proper authorization, training and safety equipment.

### Can the network carry voice, photos or video?

MeshCore is primarily intended for small text messages and lightweight data.

LoRa offers long range and low power consumption by using a comparatively low data rate. It is not intended to replace broadband internet, cellular voice service or video communication.

---

## How do I get started?

Begin with the Alberta MeshCore getting-started guide:

[Get Started](getting-started/index.md){ .md-button .md-button--primary }

You will learn how to:

1. choose compatible hardware;
2. flash the appropriate MeshCore firmware;
3. configure your companion device;
4. apply the correct regional settings;
5. add contacts and channels;
6. test local coverage;
7. and participate responsibly.

For Calgary-specific information, continue to:

[Calgary Network](calgary/index.md){ .md-button }

---

## Acknowledgement

This page was developed for Alberta MeshCore with inspiration from the community-education approach used by [CascadiaMesh](https://cascadiamesh.org/about/). The text has been rewritten and expanded for Alberta conditions, Canadian requirements and the structure of the Alberta MeshCore project.
