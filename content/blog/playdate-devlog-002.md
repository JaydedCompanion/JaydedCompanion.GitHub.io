---
title: Playdate Devlog 002 — Lua vs. C
description: "Playdate games can be written in C or Lua (or a combination of both), meaning I must decide which to use before writing any code. A decision such as this one can be paralyzing to someone as indecisive as me, but I did eventually make up my mind. Warning: This is a lengthy one..."
taxonomies:
  tags:
    - gamedev
    - playdate
date: 2025-03-23
author: Jayde Iris Callejas
---

## Gee Playdate!

[How Come Your Mom Lets You Have Two Languages?](https://i.kym-cdn.com/photos/images/original/000/512/644/ddf.jpg) I've ran into similar conundrums before: Unity supports C# and (at least back in the day) JavaScript; Godot supports GDScript and C#; and Unreal Engine supports Blueprints and C++.

The difference between all of these examples and Playdate, as you might've already discerned, is that the previous examples have pretty simple answers: Even back when it was supported, the consensus among Unity users was generally that you should opt to use C# over JavaScript (or, more accurately, UnityScript); Godot users seem to recommend mixing and matching GDScript and C# since they tend to play nice with one another and each has its pros and cons; Unreal offers users the option of using Blueprints if they want a visual scripting language, or C++ if they wish to suffer.

The issue with Playdate having support for both C and Lua, at least for me, is that it's harder to decide which one to use. Considering how I'm planning on making a high-speed game that would look and feel its best at higher frame-rates, C's performance benefits would be a boon for this kind of project. Additionally, I believe that learning to program in C will teach me more about the fundamentals of development through writing low-level code.

On the other hand, C has some pretty significant drawbacks: for one, the Playdate's C API documentation leaves a lot to be desired (even according to the more experienced developers I asked for help): the vast majority of entries in the documentation simply consist of a method header, and, on average, one or two sentences about what the function does. There is very little information on what each parameter should contain (other than the datatype it expects) or how the function should be used, and essentially zero example code. Getting a Makefile to work is, in my experience, also a vague process, despite the length of this section of the docs. Lastly, and perhaps most importantly, while looking for some answers online, it seems like the C API [doesn't even have full parity](https://devforum.play.date/t/implement-parity-for-audio-between-c-and-lua-apis/10164): a few functions available in the Lua API are [outright](https://devforum.play.date/t/c-equivalent-to-playdate-gettime/7884) [missing](https://devforum.play.date/t/c-api-how-to-pass-in-userdata-to-the-sndcallbackproc-callbacks/10160) in the C API. Hopefully I won't need them!

While preparing for this project, I've likened the comparison of C vs Lua to manual vs automatic transmissions, correspondingly. In true stick-shift fashion, even once I've wrapped my head around a lot of the theory, getting this thing to do anything without it immediately stalling out is very difficult. However, C, like a manual transmission, allows me to have more direct control over what's going on in the back end, and ultimately increases the ceiling of what I can achieve (but, conversely, raises the minimum knowledge required to get anything done).

## Putting Pen to Paper

Now that I've finished crying to you about the drawbacks of the C API[^1], I think it's about time I actually wrote some dang code. As usual, I began with ol' reliable to get myself started.

<img src="/img/blogimg/devlog002-ol-reliable_dithered.png" loading="lazy" alt="Spongebob ol' reliable meme, with the spatula case containing the code to print hello world." style="image-rendering: pixelated;"/>

### Hello World, the PlaydateAPI Struct, and Events

Immediately, there are some complications. To output text to the Playdate's console, we have to do it through the Playdate API instead of using the standard library's `printf()` method. To access the Playdate API, we need a `PlaydateAPI` struct. How do we get one of those? Well, fortunately, this is a fundamental enough aspect of Playdate development that the documentation actually does a decent job of explaining the process. First, we have to import the Playdate API via the `pd_api.h` header file, and declare the following event handler function in our `main.c` source file.

```c, linenos
#include "pd_api.h"
int eventHandler(PlaydateAPI* playdate, PDSystemEvent event, uint32_t arg) {
	return 0;
}
```

This function is extremely important: it is called when the game is initialized, at which point you can declare a custom loop update function. If this isn't done, then the API will initialize a Lua context (which, in this case, we don't want). Additionally, this function is called whenever the Playdate receives a keypress, is locked/unlocked, etc. The type of event can be determined by the `event` parameter.

Right now, however, we don't care about any of this. Instead, we care about the first parameter: a pointer to a `PlaydateAPI` struct. Before anything else, we first want to store this pointer in a static variable so we may access the API whenever and wherever, not just when an event occurs. This isn't strictly necessary for us to output text to the Playdate's console, but we will almost certainly want to access the API from outside of the event handler function in the future.

We can also declare a switch statement to handle the various event types, since we don't need to store the Playdate API struct every single time an event occurs, only during the initialization event (since that's the very first event that we will receive).

```c, linenos
#include "pd_api.h"
const PlaydateAPI *pd;
int eventHandler(PlaydateAPI* playdate, PDSystemEvent event, uint32_t arg) {
	switch (event):
		case kEventInit:
		pd = playdate;
		break;
		default:
		break;
	return 0;
}
```

With the Playdate API now accessible through our `pd` variable, we can now call any of the Playdate's functions whenever and wherever we want. One such function is the `logToConsole()` function, which is Playdate's version of `printf()`. Since we only really want a string to print once, let's call the function from within the initialization event.

```c, linenos
#include "pd_api.h"
const PlaydateAPI *pd;
int eventHandler(PlaydateAPI* playdate, PDSystemEvent event, uint32_t arg) {
	switch (event):
		case kEventInit:
		pd = playdate;
		pd->printf("Hello World!");
		break;
		default:
		break;
	return 0;
}
```

### Building

And, just like that, you've got a Playdate game that spits out a string to the console! What's that? How do you actually turn your `main.c` file into a `game.pdx` file for the Playdate simulator? Well, that's one part where I must admit I have no clue what I'm doing. There are a few ways to turn a game's source into a `.pdx` file that will run in the Playdate emulator, depending on the platform.

I (eventually) got a build to work using Make, but there were many issues where I either just stumbled upon the solution, or had someone smarter than me figure out the problem (shoutouts to my good friend Jay!) I will mention, however, that one of the issues I ran into came from Make creating a **file** called "Source", instead of a **folder**. If you're trying to use Make to build your Playdate game and are getting an error, check your project and ensure you have a Source folder, and not a file:

```tree
MyPlaydateProject/
├─ build/
├─ MyPlaydateProject.pdx/
├─ Source/ <- Make sure this is a folder!
├─ src/
│  └─ main.c
└─ Makefile
```

This was one of the moments where my frustration towards Playdate's C API was at its peak. The C API docs' build instructions boil down to "just use one of the example project's build files, trust me bro" which to me is a completely inadequate solution, as whatever Makefile (or CMakeLists.txt file) I'm using acts almost as a black box. None of its functionality is explained and I just have to hope it does what I want it to, which, as demonstrated by this little "Source file vs. folder" problem, I most certainly cannot trust it to do what it should, let alone what I want it to.

### Custom Update Function

Now that we've got a working _program_, let's set up the structure for building a _game._ One of the fundamental aspects of most games is having an update function. This will give us a place to update the game logic at a (hopefully) consistent rate[^2], instead of only being able to respond to user input when it occurs via events.

The Playdate API has a fairly simple way of doing this. All we have to do is use the `setUpdateCallback()` function to specify which method we'd like the Playdate API to call when we want the game logic to be updated. At this point in development, I'm not exactly sure what the `userdata` parameter is meant to contain, but I _think_ it can be any arbitrary data we might need during update calls.

```c, linenos
#include "pd_api.h"
const PlaydateAPI *pd;
int update(void *userdata) {
    return 1;
}
int eventHandler(PlaydateAPI* playdate, PDSystemEvent event, uint32_t arg) {
	switch (event):
		case kEventInit:
		pd = playdate;
		pd->system->setUpdateCallback(update, playdate);
		break;
		default:
		break;
	return 0;
}
```

### A True Sense of Progress

Despite all the ups and (mostly) downs so far, I feel like I now have some momentum and can start actually making something! With these inane issues now sorted, I managed to get through some of the other basics relatively quickly. I first stole (and modified[^3]) the following code from an example project to import an image into an `LCDBitmap` (which I eventually learnt is quite different from an `LCDSprite`, not that you'd know from reading the API.) There was a small hiccup here as, again, nowhere are you told where the `path` parameter is relative to. I eventually figured out it's _relative to the outputted `pdex.*` files_, which can be found in the fun little Source folder I ranted about earlier—though this might be different if you use something other than Make to build your project.

```c, linenos
// Loads the image stored at {path} and returns it as a new LCDBitmap
LCDBitmap *loadImageAtPath (const PlaydateAPI *pd, const char *path) {
    // Declare a string to store any potential error output
    const char *outErr = NULL;
    // Create a new LCDBitmap pointer that points to the bitmap loaded from loadBitmap()
    LCDBitmap *img = pd->graphics->loadBitmap(path, &outErr);
    // If there is an error, print it to the console
    if ( outErr != NULL ) {
        pd->system->logToConsole("Error loading image at path '%s': %s", path, outErr);
    }
    // Return the image
    return img;
}
```

I defined this method in a new `.c` file which I'll use to store any "utility" function like this one. I don't want to have an overcrowded `main.c` file, and I'm sure I'll want to access these utility functions from various different source files too, so I believe it would be unwise to put this in my `main.c` file.

Next, I once again "borrowed" some code from the `SpriteGame` example project, which does all the legwork to turn my `LCDBitmap` into an `LCDSprite`. If you're like me, you might be wondering what the difference is between the two. If you've read the docs, you'll see that the difference between the two is... not explained! But after reading some of the `SpriteGame` example code and going through some of the API's code, I believe `LCDBitmaps` are basically arrays of monochrome[^4] pixels (I.e. a monochrome image), while `LCDSprite`s can have not just a corresponding image, but also a position, z-index, collision shape, and even an update function! Due to this, we first import our image into a bitmap, and then assign that bitmap to a new sprite, which will act as our "player object" of sorts.

```c, linenos
static LCDSprite *ballSprite;
LCDSprite *sprite (const PlaydateAPI *pd, const float x, const float y) {
	// Create a new LCDSprite
	sprite = pd->sprite->newSprite();
	// Load the image into an LCDBitmap
	LCDBitmap *bitmap = loadImageAtPath(pd, "path/to/bitmap");
	// Declare two ints and store the width and height of the bitmap into them
    int w, h;
    pd->graphics->getBitmapData(bitmap, &w, &h, NULL, NULL, NULL);
    // Set sprite's image to the LCDBitmap
    pd->sprite->setImage(sprite, bitmap, kBitmapUnflipped);
    // Return the sprite
    return sprite;
}
```

I went into development thinking I'd have to do very low-level programming, even to the degree of having to program my own game object system. Fortunately, with the advanced functionality offered by the API's sprite system we can create a sprite, manipulate its properties when needed, and then have the sprite system take care of the rest (updating, rendering, etc.)

Going back to `main.c`, we can write a couple lines of code to initialize a sprite and "register" it to the sprite system. Then, whenever we want to modify the state of our sprite we can simply do so from our update function and take care of the rest by simply calling `updateAndDrawSprites()` at the end of our update.

```c, linenos
#include "pd_api.h"
const PlaydateAPI *pd;
LCDSprite *sprite;
int update(void *userdata) {
	int t = pd->system->getCurrentTimeMilliseconds()
	int center_x = 400/2, center_y = 240/2;
	// Make the sprite move in a circle
	pd->sprite->moveTo(sprite, sin(t) * 16 + center_x, cos(t) * 16 + center_y);
	// Updates and renders all sprites
	pd->sprite->updateAndDrawSprites();
    return 1;
}
int eventHandler(PlaydateAPI* playdate, PDSystemEvent event, uint32_t arg) {
	switch (event):
		case kEventInit:
		pd = playdate;
		pd->system->setUpdateCallback(update, pd);
		// Initialize a new sprite
		sprite = sprite(pd, 0, 0);
		// Register our sprite with the sprite system
		pd->sprite->addSprite(sprite);
		break;
		default:
		break;
	return 0;
}
```

## Conclusion

So, despite how long it's been since the last devlog, and how long this post is, you might think that the progress I've made is arguably rather dismal. While this isn't entirely untrue, I'd argue that a lot of progress has been made in my understanding of the Playdate's C API and its intricacies. I now have some basic understanding of how the `LCDSprite` struct works, and how it'll help me turn this game concept into a game reality, and I now have a working source-to-simulator pipeline that will allow me to quickly test and iterate over any code I write in the future.

I also made some progress that I didn't really go over here since I'd argue it's not entirely part of the development process: I switched from VSCodium to CLion, which has been a huge help since CLion has proper autofill and plenty of other tools that make programming in C a breeze (or, well, less of a headache.) Given the vast assortment of extensions available for VSCode (and, by extension, available for VSCodium,) I'm sure I could've achieved this without having to switch over to CLion, but given how much better the functionality with C is out-of-the-box, and how many other hurdles I have to jump through, I'd rather just stick with CLion and eliminate my IDE as another potential source of trouble.

Given the kinks I worked out since the last devlog, I'm hoping the next update will contain some real concrete progress!

## Footnotes

[^1]: This, I'm sorry to say, is not the last time you'll see me slander the API.
[^2]: Ideally, the Playdate API will call our update function with the frequency indicated by the refresh rate (which can be set with the `playdate->display->setRefreshRate()` function). However, if the update method call takes too long, the next update will happen later than expected—hence the "(hopefully) consistent rate." In theory, going through the trouble of making this game in C will decrease the likelihood of this occurring.
[^3]: This code was obtained from the `SpriteGame` example provided by Panic, and is mostly unchanged. The main difference is that I added some comments while deciphering the purpose and usage of each function, with the aim to better understand the code and ensure I can figure out what it does if I ever need to read or modify it in the future.
[^4]: While the images are monochrome, it seems like each pixel can have four different values: white (`pixel = 1`); black (`pixel = 0`); clear, which is a transparent pixel (`pixel = pixel`); and an "XOR" value, which seems to act as the opposite colour of whatever was rendered beneath that pixel (`pixel = !pixel`).
