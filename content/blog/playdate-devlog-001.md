---
title: Playdate Devlog 001 — Coming Up With a Concept
description: The first entry in a series of devlogs where I document the process of developing a game for the playdate.
taxonomies:
  tags:
    - gamedev
    - playdate
date: 2025-02-23
author: Jayde Iris Callejas
---

## Preface

A few days ago, one of my best friends bullied me (affectionate) into making a game for the Playdate. I've previously expressed interest in that funky little handheld by Panic, and from what I understand, he figured this little challenge would be an effective way of getting me out of my years-long creative slump. So far, it seems like his logic was sound.

That very same night, I woke up at 4AM for some reason and had a game concept already forming in my head, [like a prophet receiving visions from an angry god](https://youtu.be/VPY9R_yyiEM?si=0KaqzFQyPWwqi3cP&t=61). Since then, I've been bouncing the idea around in my head and I've managed to turn it into a fairly solid concept—at least as solid as it'll get without some playtesting. As such, I figured this is a good time to write down my thoughts and try to explain the mechanics in their current form. This way, I may come back to them during development if needed, and I can document any changes I make to the mechanics throughout development.

## The Concept

The current concept of the game is a speed-platformer of sorts. In a way, it's a knockoff Sonic/Pizza Tower for the Playdate, but perhaps more abstract (I should mention for posterity: I've never played a Sonic game and I've only player through the first couple floors of Pizza Tower, so my credentials in this genre are definitely questionable.) In its current form, the player controls a simple ball, as I figured this would be the easiest thing to visualize on the Playdate, but also because I seem to lack the creativity to come up with an iconic character like Sonic or Pepino Spaghetti.

The player must rapidly navigate the ball around zero-gravity levels by sticking to platforms, destroying hazards, and preserving the ball's momentum. The basic mechanics are fairly simple, though hard for me to put into words. To help me better explain them, I've gone ahead and designed some graphics to visualize these game mechanics.

### Verbs

#### Accelerate

<figure>
<img src="/img/blogimg/Accelerate.png" loading="lazy" alt="Acceleration mechanic visualization" style="image-rendering: pixelated; width: 256px"/>
<figcaption>Ball acceleration</figcaption>
</figure>

Players may use the crank to get the ball rolling, and increase its speed to peak velocity. Initially, I was planning for players to have to turn the crank constantly to maintain momentum (which would tie in really nicely with another mechanic, which would cause players to have to reverse the direction at), but I figured this would be rather tedious, especially given the Playdate's unwieldy miniature size.

#### Corner Bend

<figure>
<img src="/img/blogimg/CornerBend.png" loading="lazy" alt="Corner bend visualization" style="image-rendering: pixelated; width: 384px"/>
<figcaption>Performing a corner bend</figcaption>
</figure>

Players may perform a corner bend by pressing <kbd>B</kbd> as the ball approaches the end of a platform. If done successfully, the ball will stick to the platform around the bend while maintaining its momentum along the surface of the platform.

#### Corner Bend Failure

<figure>
<img src="/img/blogimg/CornerBendFail.png" loading="lazy" alt="Corner bend failure visualization" style="image-rendering: pixelated; width: 384px"/>
<figcaption>Failing to perform a corner bend</figcaption>
</figure>

If the player fails to perform a corner bend, the ball will either crash into the platform, causing a game over (see top row), or it will fly off the platform and go out of bounds (see bottom row). In either scenario, that is a game over.

...At least, that's what I was initially planning. Upon thinking about it further, I realize I can make the acceleration mechanic more prominent—and reduce the consequences of a failed corner bend—by making a failed corner bend simply reduce the ball's velocity to zero. The player would then turn the crank to bring the ball up to speed once more. Additionally, a failed outer corner bend (see bottom row) could be integrated into the level design by allowing the player to fly off a platform and land on another (though landing on a perpendicular platform would also set the ball's velocity to zero.)

#### Jump

<figure>
<img src="/img/blogimg/Jump.png" loading="lazy" alt="Jump visualization" style="image-rendering: pixelated; width: 384px"/>
<figcaption>Performing a jump to an opposing wall</figcaption>
</figure>

The player may press <kbd>A</kbd> to jump off a platform and land on a parallel, opposing platform. Landing on a perpendicular platform would halve the ball's velocity. Initially, I was planning on having the player reverse the direction of the crank turns as they land on the opposing platform (as the ball would be spinning in the opposite direction) but as I mentioned previously, I doubt having to constantly turn the crank would be enjoyable.

#### Attack

<figure>
<img src="/img/blogimg/Attack.png" loading="lazy" alt="Attack visualization" style="image-rendering: pixelated; width: 768px"/>
<figcaption>A sequence of attacks and corner bends</figcaption>
</figure>

Finally, players may destroy any obstacles by pressing the <kbd>D-Pad</kbd> in the direction of the obstacle. In the above figure, the ball descends on a vertical platform (Panel 1) and the player presses <kbd>D-Pad Down</kbd> as the ball comes into contact with an enemy below to destroy it. As the ball reaches the inside corner, the player presses <kbd>B</kbd> to perform a corner bend. As the ball continues rightwards on the horizontal platform, the player presses <kbd>D-Pad Right</kbd> to destroy the enemy to the right and once again performs a corner bend by pressing <kbd>B</kbd>.

I once again came up with an amendment to this as I typed it out: Instead of presenting the player with a "Game Over" screen upon colliding with an enemy without destroying it, the player could instead bounce off, resulting in a negative velocity being applied.

### Timing

Other than the jump mechanic, all other button inputs are time-sensitive, and must be pressed right as the ball reaches the corner or enemy. This also makes me want to add some rhythm elements into the game, as levels could be choreographed such that enemy collisions and corner bends occur on-beat with the game's music.

### Scoring and Win Condition

Since this game is a speed-platformer, the idea is to design levels that, if no mistakes are made, can be completed very quickly and smoothly/fluidly. Once the player reaches the end of the level, their score will be shown as the time it took them to complete the level, with penalties for any enemies that were skipped over. Players can then improve their time, adding replayability, and a medal system could be implemented (such as the ones seen in Neon White or Devil Daggers).
