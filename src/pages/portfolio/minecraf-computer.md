---
title: World's Smallest Minecraft Computer
layout: portfolio-item.njk
permalink: /portfolio/minecraft-computer.html
date: 2025-08-01
description: Building a tiny 1-bit minecraft computer based on a 1970's ISA.
tags: ["Computer engineering", "Minecraft", "Historical Computing", "Assembly"]
---

<div class="portfolio-content">
<div class="media-gallery">

![The Full Computer](/pictures/Minecraft/FullComputerGlamourShot.png)
*The MC² computer in its full glory*

![MC14500B Chip](/pictures/Minecraft/MC14500.jpg)
*The MC14500B chip that inspired the MC² design*

![Block Diagram](/pictures/Minecraft/MCMC.png)
*Block diagram of the MC² overall architecture*

<div class="video-wrapper">
  <iframe src="https://www.youtube.com/embed/QZvOWySDMe8"
          frameborder="0" allowfullscreen>
  </iframe>
</div>

*Simple demonstration program summing two 4-bit numbers*

</div>
<div class="project-details">

### Overview
Built the smallest turing complete computer in Minecraft, designed to be simple enough for survival mode construction. The MC² (MineCraft MicroController) is a 1-bit Harvard architecture computer inspired by the 1970's Motorola MC14500B logic controller chip, featuring a 4-bit music disc encoded ISA and fitting in a footprint barely larger than a chunk.

### Key Features
- 4-bit music disc encoded instruction set with 15 instructions
- 1-bit internal register with 2 additional flags for control flow
- 8 I/O ports for interfacing with peripherals
- Optional infinitely expandable tape memory unit for turing complete operation
- 14 game tick (0.7 second) clock cycle
- 1458 instruction program memory (182 bytes)
- Compact footprint of 14x12x17 blocks (excluding tape memory)

### Technical Details
- Designed novel jukebox-based instruction memory system using music discs as dense ROM
- Implemented shulker box loader/unloader system for 27x faster program reset
- Created predication-based control flow system inspired by MOVfuscator
- Developed custom assembler with recursive macro system in C++
- Used innovative slimestone tower design for compact vertical signal transmission
- Implemented dual tape memory system for working memory and program counter

### Technologies & Techniques
- Redstone circuit design and optimization
- Computer architecture principles (Harvard architecture, pipelining, predication)
- Custom instruction set architecture (ISA) design
- Assembly language and compiler/assembler development
- C++ for tooling (assembler/emulator)
- Python for worldedit automation scripts

### Resources
- [GitHub Repository](https://github.com/Tsuchijo/MC_Computer_Assembler/tree/main) - Assembler, emulator, and world download
- [Full Blog Post](/blog/designing-the-smallest-computer-in-minecraft/) - Detailed technical writeup

</div>
</div>
