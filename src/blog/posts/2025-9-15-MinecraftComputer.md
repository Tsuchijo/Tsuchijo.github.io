---
title: "Designing the Smallest computer in Minecraft"
date: 2025-09-15
tags: ["Minecraft", "Computer Engineering"]
excerpt: "How I built the first microcontroller in minecraft."
permalink: /blog/{{ title | slug }}/index.html
---

## Introduction

Since redstones introduction to Minecraft made computers in game possible their design has mostly gone one direction, growing faster, more capable, and primarily larger. Whille a computer that can run its own 3d render pipeline in game is impressive, the fact that it will take up a million blocks and lag your computer to death makes it a somewhat of a self defeating activity. What is the point of making a computer in Minecraft if a normal player would never be able to build it in their world? So when I decided to make my own computer I set out to create the exact opposite, build the smallest turing complete Minecraft computer possible. My goal was to design a computer simple enough that it could be reasonably built in survival, fit in a reasonable footprint (approximately a chunk), and be able to be easily reprogrammed to handle a variety of logical tasks.


When I first set out on this project the first place I searched for inspiration was the past. Afterall the computer engineers of the 60's and 70's were also dealing with similar problems of having extremely limited space and complexity budgets. Looking back through the history of some of the simplest and cheapest chips of the 70's I came across the the aptly named MC14500B. The MC14500B is absurdly simplistic by todays standard, boasting a 4-bit ISA, and a simple 1-bit register it is only capable of a handful of logical operations and a couple of options for control flow, but yet it was just enough to replace old bulky relay logic systems in the 70's. 


<figure class="image-container">
  <img src="../../pictures/Minecraft/MC14500.jpg" alt="MC14500B Construction" class="center-image image-medium">
  <figcaption class="image-caption">The MC14500B chip that inspired the MC^2 design</figcaption>
</figure>

The idea of a 1-bit logic controller based computer fit Minecraft perfectly. In Minecraft we are operating under very similar constraints Motorola faced in the 70's when producing this chip. Memory is expensive, wide busses are awkward, and for most simple practical tasks you only need a little bit of binary logic. Of course I could not just copy the MC14500 and call it a day, while the MC14500 was the perfect place to draw inspiration, on its own it was not even close to a full computer. Part of its simplicity was eschewing everything but the bare minimum, relying on the designer to provide what they needed in program memory, instruction control flow, I/O was handled. All of these I would need to implement on my own, in a way that was particularly ergonomic with Minecraft mechanics.

After a few weeks of work and many iterations this idea would finally come into being as the MC^2, short for MineCraft MicroController, a 1-bit Haravrd architecture computer with a 4-bit music disc encoded ISA, 8 ports of I/O, just enough control flow and binary logic to handle some small farms and be turing complete while fitting in a foorprint barely larger than a chunk.


## Design Overview

At its core the MC^2 is an incredibly simple design: a single 1-bit register, a 4-bit instruction set, a few configurable I/O lines, and some working memory implemented as a kind of moving tape. If you were doing this on an FPGA it would be a nice little final-project CPU build. In Minecraft, the real challenge is making it small without making it useless.

I ended up breaking it down into five core pieces, each of which came with their own design challenges and tradeoffs:

1. Instruction Memory – dense, fast program storage using jukeboxes and shulker boxes.
2. Decoder - Takes the redstone signal from the jukebox and decodes it into a set of control signals.
3. Logic Unit – the part that actually executes the 1-bit instructions.
4. I/O – handles the interface between MC^2 and the outside redstone world.
5. Tape Memory – a shiftable strip of bits for data storage, essential for turing complete operation but can be eschewed for more I/O

<figure class="image-container">
  <img src="../../pictures/Minecraft/MCMC.png" alt="MC^2 Block Diagram" class="center-image image-large">
  <figcaption class="image-caption">Block diagram of the MC^2 architecture</figcaption>
</figure>


### Instruction Memory


 One of the biggest challenges was the implementation of efficient instruction memory. In most minecraft computers the program ROM is the simplest part, just design a single selectable memory unit and tile it until you run out of space. However that solution would not work under our space constraints, where a traditional ROM design would take up our entire foot print to store just a couple of bytes. Luckily Mojang recently gave us the perfect tool to solve this memory issue, the Jukebox decoder. The jukebox gives us an efficient way of creating an extremely dense ROM unit, as each disc encodes a unique redstone signal strength between 1-15 when played, corresponding to a single 4-bit instruction per disc (we are missing the a 0 strength disc but 15 instructions is more than enough for our design). 

 This allows us to store the entire program as a series of items in a chest, giving us an extremely dense form of program memory. However there are no free lunches, and there is good reason that, as far as I am aware, this is the first computer design I have seen that utilizes "disc memory" for the program memory. The problem with this design is that minecraft the only way to push or pull items from a chest is by using a hopper, which do not operate like any normal data structure in how they handle the order of items. Hoppers will always pull out the first item in chests, and will always push items into the first available slot in a chest, however when a item is pulled out, it does not "move" all the subsequent items up in queue, instead the item that was pulled out is simply replaced with an empty slot. This means that as long as the chest is fully emptied before the any items are inserted then it acts as a simple FIFO stack type structure, however if the chest is not fully emptied before the next item is inserted then the items will be out of order, and the program will not run correctly. 

 The unusual nature of this memory imposes two large design constraints on the computer. First is that our memory is not random-access, we can only read instructions in the order that the program was written in. That means that we have no jumps in our program and it must be fully run to the end before it can loop back to the start or terminate. Second is that we must have a buffer chest to store all the instructions that have already been executed as we cannot simply loop back items into the same chest. This buffer must only empty when we are sure that the program chest is fully empty, otherwise we will end up with a corrupted program.

These two constraints result some of the most important design decisions in the rest of the computer, and in particular the implementation of our instruction memory unit. The heavily limited control flow from the lack of ability to make arbitrary jumps means that instruction predication is the only way we can implement any kind of conditional logic. The need to implement some sort of predication (a conditional skip instruction) is the strictest timing constraint in our entire design, and as such the instruction memory must be design around that timing constraint. 

Conversely, as we are only able to read instructions in a linear order, besides the predication instruction there is no need to assume that any instruction will causally affect the execution of future instructions. This means we can heavily pipeline our entire design as by the very nature of our memory we can never have a branch miss. This means that besides the skip instruction, we can afford to have a very long instruction latency, circumventing one of the biggest issues with Minecraft computers, the slow latency of redstone.

The sum result of these restrictions and design choices is a set of four key components that make up the instruction memory unit:
1. Shulker Loaders and Unloaders – compact, sequential program storage and transfer.
2. Reset Routine – Logic and timing to ensure that the program resets cleanly without corrupting.
3. Skip Logic – provides conditional execution through predicated instruction skips.
4. Master Clock – the global heartbeat that synchronizes and paces execution.

<figure class="image-container">
  <img src="../../pictures/Minecraft/InstructionMemoryDiagram.png" alt="MC^2 Instruction Memory" class="center-image">
  <figcaption class="image-caption">MC^2 Instruction Memory Control flow diagram</figcaption>
</figure>


#### Shulker Loader & Unloaders

The shulker loader and unloader were some of the most essential components of the instruction memory unit, and luckily also the one component where I could draw from past designs. The shulker loader and unloader are responsible for unloading the music discs encoding instructions from a shulker into the jukebox, and then reloading the used discs into a new shulker. This has two main advantages, first it greatly increases our program memory capacity, as each shulker can hold 27 discs, and a double chest of instructions can hold 54 shulkers, giving us a total program memory of 1458 instructions or 182 bytes, which is enough for most simple programs we would want to run. Second it significantly speeds up resetting the program once it has already been run as we can move the shulkers instead of indivisual discs making the throughput of the reset routine 27x faster than the program execution speed. If the program was not using shulkers then the reset routine would take approximately equal time to run as the program itself as both would be rate limited by the same fixed hopper speed.

The shulker loader and unloader also introduce a couple of restrictions on the program design. First is that as we only send a shulker box back up to the buffer chest when it is full our program must be a multiple of 27 instructions long. This is not a big restriction as we can simply write the assembler to automatically pad out the end of the program with Nops to the next multiple of 27. Second is that as we only track the number of shulkers in the program storage chest for when we need to reset the program, we need to add in a delay to the reset routine to ensure that the last shulker has fully unloaded before we start the reset routine. This requires the addition of some extra timing and logic to the reset routine, which I will discuss in the next section.


The design of the shulker loader and unloader itself was taken from a great video by [KaleHameron](https://youtu.be/3ceYUDzSX7o?si=r1dulZ1CUgJf0nUH). These designs are somewhat standard in the redstone community and are close to optimal in terms of size and speed.


#### Reset Routine

One of the biggest challenges in the design of the instruction memory was the reset routine. The reset routine is responsible for all the logic and timing ensuring that when the program reaches the end it can be cleanly reset back to the start without corrupting the program. There were a few key challenges that needed to be solved in the implementation of the reset routine.

First is ensuring that the entire program has been fully executed before starting the reset routine. This is particularly important and difficult as the instruction memory is heavily pipelined, meaning that even when the last set of instructions leaves the program chest there will still be a significant delay before it is executed as it makes its way through the shulker unloader, jukebox, loader, and hopper elevator back to the buffer chest. This means that we cannot simply start the reset routine as soon as the program chest is empty, as there will still be instructions in flight that have not yet been executed. To solve this an "Etho clock" style delay was added to the reset routined, which start a fixed delay once the program chest is empty clocked by the limited throughput of a hopper. The advantage of using this sort of timer to delay the reset routine is that is very compact and extremely adjustable compared to a traditional redstone repeater based delay. The disadvantage is that it takes an equal amount of time to reset as the programmed delay. As there are 54 instructions at any one moment inside the pipeline, this means that we have a minimum program length of atleast 5 shulker boxes (135 instructions) to ensure that we have enough time to fully allow the Etho clock to reset itself before the program chest is empty. This is not a big restriction as most programs will be much longer than this minimum length, and if they are shorter they can either be repeated, or padded out with Nops.

Second is properly moving the program discs from the buffer chest back to the program chest without corrupting the order. As mentioned before hoppers do not behave like a normal queue datastructure, and only preserve the order of the instructions as long as we do not pull any items out of the program chest while we are inserting items into it. This means that we need to have a flip-flop to ensure that we are either in "insert mode" or "remove mode", and never both at the same time. This is accomplished by using a S-R latch to control two separate hopper lines, one for inserting items into the program chest, and one for removing items from the buffer chest. The latch is set to insert mode by the etho clock after the program chest if fully empty, and is only reset to remove mode once the program chest is fully full again. This ensures that we never pull items out of the program chest while we are inserting items into it, preserving the order of the instructions.

#### Skip Logic

The skip logic is one of the most important components of the instruction memory unit, as it provides the only form of conditional execution in the entire computer, but also relatively simple in its design. The skip logic implements a single instruction, SKIP, which will skip the next instruction if the current value in the SKIP flag is 1. This allows us to implement simple control flow in our programs while taking advantage of the heavily pipelined nature of our design. The skip logic is implement using a simple AND gate hooked up to a S-R latch. When the SKIP instruction is executed it sets the latch if the SKIP flag is 1, which will then block the next instruction from being loaded into the logic unit. The latch is then reset once the next instruction has been skipped, allowing normal execution to continue. 

The largest challenge with the skip logic is ensuring that the timing is correct, as we need to ensure that the SKIP instruction is fully executed before the next instruction is loaded. This is accomplished by minimizing the latency of the skip logic as much as possible, ensuring that there is the shortest possible delay between the SKIP instruction being executed and the SKIP latch being set. Luckily the skip logic is one of the few components that has a latency constraint, besides it and the delay between the logic unit and updating the internal 1-bit register, there are no other timing constraints in the entire design. This allows us to heavily pipeline the entire design, allowing for a very long instruction latency without any risk of branch misses (as we have no branches).

#### Master Clock

The master clock is the global heartbeat that paces the entire computer, and also is the most simple in design. As aformentioned, there are very few timing requirements imposed by our design due to our limited control flow, and timing requirements that are there are restrictions on maximum clock rate. This means that we can use a relatively fast clock to pace the computer, with only 14 gameticks (0.7 seconds) between each clock cycle. This is fast enough to make the computer feel responsive while still being slow enough to allow for the longest possible instruction latency without any risk of timing issues. This can be implemented with a simple observer clock, which is very compact. 

### Decoder

Once the instruction signal leaves the jukebox it needs to be decoded into a set of 15 control signals, one for each instruction in the ISA. This is a slightly more complex task than a simple binary decoder as the jukebox signal is not binary, but instead is a single redstone signal with a strength between 1 and 15 (analagous to an analog signal). This means that we need a specialized decoder known in the redstone community as a "redcoder" to decode the signal. The redcoder works by using two parallel redstone lines, one with the signal strength 1-lower than the other, each of which decreases in strength by 1 for each block of redstone dust it travels over. By looking at the 1 place where one line is on and the other is off we can determine the signal strength. 

Luckily redcoders are a well known design in the redstone community, and particularly compact designs specific for fast readout from jukebox encoders have been developed. The design used in the MC^2 is based off of a design by [Jazzired](https://youtu.be/V6X2BHpeLww?si=Ux6t-D47MCcfkBGK) used for his Jukebox encoded music machine. This design is close to optimal in terms of size, speed, and latency, and is the best design I have found for this purpose.


### Logic Unit

Compared to the complex instruction memory unit the logic unit is relatively simple, it only needs to implement a handful of well known 1-bit logical operations (AND, OR, NOT, XOR) and a few simple data operations (LOAD, OUT), and the 1-bit internal register. The biggest challengr in the logic unit was timing as the logic unit needs to make sure the executed instruction has fully propagated within 14 gameticks (0.7 seconds) before the next instruction is executed. To ensure this the logic unit was designed to have a fixed latency for all instructions, with each instruction sharing as similar a path through the logic unit as possible. This was accomplished by breaking the logic unit into a series of stages, each of which adds a fixed amount of delay to the signal. Each instruction then takes a path through the logic unit that has the same number of stages, ensuring that all instructions have the same latency. This also has the advantage of simplifying the timing analysis of the logic unit, as we only need to ensure that the longest path through the logic unit is less than 14 gameticks. The disadvantage of this design is that it adds some extra delay to some instructions that could be executed faster, but ultimately this does not matter as we are still limited by the 14 gametick clock cycle.

<figure class="image-container">
  <img src="../../pictures/Minecraft/LogicUnit.drawio.png" alt="MC^2 Instruction Set" class="center-image">
  <figcaption class="image-caption">Logic diagram of the Logic Unit, each coloured section in the logic unit corresponds to an equal amount of delay to synchronize signals across all instructions. </figcaption>
</figure>

#### Slimestone tower

One particularly innovative solution I found for making the logic unit as compact as possible was to use a tower of slimeblocks and redstone blocks to vertically transmit the signal downwards. The slimeblocks allow the redstone blocks to be moved up and down by a piston, allowing us to transmit the signal downwards on a fixed delay for all vertical levels. This also has the advantage of lacking the directionality of solutions like a fence-gate observer or glass tower, both of which can only transmit the signal in one direction. The slimeblock tower allows signals to be transmitted from both the top and the bottom, allowing for a more compact design. The slimeblock tower also greatly simplifies the logic as by moving the default position of the redstone blocks up and down we can add in an inversion to the signal for free, giving me greater versatility in the logic design while keeping the timings synchronized and the design compact.

### I/O

The I/O unit is responsible for interfacing the MC^2 with peripherals and the outside world. Due to the simplicity of the logic unit the I/O unit uses a relatively unusual method of addressing. Whereas in a normal computer the I/O would be addressed by some operand in the instruction, instead in the MC^2 the I/O is addressed by a set of 8 different unique instructions, one for each I/O port. This sort of unary addressing is not common in modern computers as it is inefficient in terms of instruction space, however in the MC^2 it is a good tradeoff as it allows us to have more logical instructions available in the 4-bit instruction set, while still having a reasonable number of I/O ports without the need to implement a more complex instruction memory which can handle operands.

The I/O unit itself is relatively simple, each I/O port is a piston based S-R latch which allows signals to travel to 2 different lines shared between all ports, one for input and the other for output. Each S-R latch is reset whenever an I/O instruction comes in, and the a single one of the latches is set by the output of the decoder. This allows us to have a simple and compact I/O unit that can handle a reasonable number of I/O ports without the need for complex addressing or multiplexing.

On top of this addressing scheme the first 2 I/O ports are taken up by additional execution flags, the SKIP flag and the HALT flag. Bott are implemented as S-R latches which can be set and reset by the I/O instructions. The SKIP flag is used by the skip logic in the instruction memory to determine whether to skip the next instruction, while the HALT flag is used to stop the computer from executing any further instructions once it reaches the end. However, both flags can also be externally accessed by peripherals and read by the program, allowing for them to be used additional "scratch" space for simple programs where they are not immediately needed for their primary purpose.

### Tape Memory

While the MC^2 does not need any working memory for simple logic controller type uses, an infinitely expandable tape and persistant memory is essential for turing complete operation. For this I implemented a simple tape memory unit peripheral which can be addressed though the standard I/O instructions. The tape memory unit is implemented as simple feedtape of copper bulb which can be shifter left or right by one bit at a time, and the active bulb be read and written to from the MC^2 through the I/O instructions. The tape memory unit is not strictly necessary for the operation of the MC^2, and can be eschewed for more I/O ports if desired, however it is essential for turing complete operation and allows for more complex programs to be written.

For turing complete operation the remaining 6 I/O ports are used to interface with 2 separate tape memory units, one for program state, and the other to track where we are in the program. Without the tape memory unit the MC^2 by default only has 3-bits of persistant state, the internal 1-bit register, and the 2 1-bit flags. This is not enough to properly implement branching or loops, as when the program loops back to the start it will lose all state. With the tape memory unit we can store additional state on the tape, allowing for more complex programs to be written with complex branching implemented through predication and state stored on the tape, which is accessed each loop through the main program. While this could be implemented all on one tape memory unit, having two separate tape memory units allows for a more compact design as the tape needs to be shifted left and right 1 bit at a time, so minimizing the number of shifts between different regions in memory on 1 tape by splitting it into 2 separate tapes makes the program more efficient.

## Programming

### Instruction Set

<figure class="image-container">
  <img src="../../pictures/Minecraft/InstructionSet.png" alt="MC^2 Instruction Set" class="center-image">
  <figcaption class="image-caption">MC^2 Instruction Set </figcaption>
</figure>

### Control Flow 

### Assembler

## Demonstration

## Future Work

## Appendix