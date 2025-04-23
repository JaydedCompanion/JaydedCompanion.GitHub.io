---
title: Playdate Devlog 003 - It Still Hasn't Gotten Easier...
description: Going from programming with OOP languages for years to making a game using C is... not trivial. Learning how to structure a program when I no longer have access to commodities such as classes or accessibility levels (in the way I'm used to) has proved to be a much bigger challenge than I initially expected. In the end, I
taxonomies:
  tags:
    - gamedev
    - playdate
date: 2025-04-23
author: Jayde Iris Callejas
---

## Previously on Jayde's Playdate Devlog...

"Given the kinks I worked out since the last devlog, I'm hoping the next update will contain some real concrete progress!" they said, foolishly. Well, as per usual, my hubris knows no bounds. It has been well over a month(!?) since the last devlog, and the repo for this project has received... one (1) new commit. If you're sitting there thinking "damn well I bet that commit's gotta have at LEAST a thousand lines changed" you should consider halving that number, and then again... and then one more time, until you're well within the low hundreds.

## So what went wrong?

While I admit that I haven't been very productive this past month, there are also a couple good reasons for why the code I've committed has been so minimal.

### Learning to Structure a Program in a Procedural/Non-OOP Language

The first thing that negatively affected the amount of changes to the codebase is the fact that I've spent the vast majority of my time figuring out how to structure my game's code now that I'm working in C, which lacks classes and other such luxuries. Typically, I would just write a class to handle level data (by containing data for the level, and functions for mutating/loading/saving level data), and then other classes to dictate the behaviours and data for the various objects in a level, etc. But as I started trying to expand my codebase, I quickly realized that C does not lend itself well to this style of development. After all, I was trying to use objects in a language that is not object-oriented.

I knew from the Playdate API that there's _some_ way of storing function pointers in structs, meaning I could essentially _emulate_ OOP by having structs which contain the variables for a given object, and pointers to functions that would be relevant for this type of object. And so, with this flawed ideal for how to structure my game, I began to write a couple so-called "classes" for levels, and for the corners that will essentially make up the entirety of the level geometry.

After writing a bunch of code, I was ready to give the project a build, and... errors as far as the eye could see. In fact, I'm almost certain there were more errors than there were new lines of code. This completely tanked productivity (alongside my self-confidence as a developer) since I ended up spending the next few weeks trying to figure out what all these errors meant, and how to fix them.

I eventually figured out that the majority of these errors were caused by me trying to assign values to some of these variables inside the struct declaration itself, namely when declaring a pointer to a function. I was instead supposed to only declare the struct, and I'd have to assign the function pointer inside a constructor after the fact. After a long while of asking around and hitting my head against a wall, I eventually got my project to build with no errors or warnings, and with the structure that I had been trying to achieve. However, right as I was about to make this massive commit, I couldn't help but feel a sense of unease...

### Deleting Your Art and Forgoing Cleverness

At some point during the manic episode that was me trying to fix my horrendous codebase, my friend Jay (the same guardian angel from the last ~~episode~~ blog post) recommended I watch Eskil Steenberg's [How I program C](https://www.youtube.com/watch?v=443UNeGrFoM) talk. Since there were multiple occasions when I was completely stumped and didn't have much to do besides wait for someone to heed my cries for help on StackOverflow, I figured I might as well give it a watch and hopefully get something out of it. Hell, maybe it would somehow trigger an epiphany that might help me figure out the problem(s) with my code.

While Eskil's programming wisdom isn't so mystical that it would suddenly turn me into a world-class programmer, it certainly opened my eyes to a lot of what I should (and shouldn't) do when programming in C. One of the things that stuck with me was [slide 6](https://youtu.be/443UNeGrFoM?t=661) of his presentation: "don't be 'clever'," and, in a similar vein, [slide 14](https://youtu.be/443UNeGrFoM?t=1903): "function naming". These two slides stuck in my head and caused that aforementioned sense of unease as I was about to commit these changes to my repo. I realized that I was trying to be "clever" by making my functions only be accessible via function pointers inside other structs as a form of organization, when what I should have been doing all along was giving my functions more explicit and well-thought-out names. Instead of storing my level data functions inside a level struct, I should've just named my functions `level_create_empty()`, `level_load()` or `level_save()`, for example. This would make it so I could find any level-related function by just seeing what functions start with `level_`, instead of dealing with all the other nonsense I was planning, which amounted to nothing more than causing trouble for myself under the guise of making my code organized and structured.

And so, I changed my mind about committing the majority of the code I'd written. Instead, I took a page out of Drawfee's book and [deleted my art](https://www.youtube.com/watch?v=gZP4PXlOCwU&t=1381s) (if you can _really_ call my code "art". Which I wouldn't.) I went back and stripped away the majority of the code I had written since the last blog post, which consisted mostly of convoluted structs and constructors whose entire purpose was just to take a few simple, ambiguously-named (by C standards, at least) functions and make them accessible through structs. In the end, my codebase became a lot lighter and coherent, and while very little actual code was _added_, I did learn a lot about how to properly structure my game going forward.

In the end, I still managed to achieve the actual result I was trying to achieve, even if not in the way I initially intended to. First, I wrote a couple functions that allow me to create the building blocks of a level (or cornerstones, rather. Damn, that would've been a clever pun.) I also managed to get a... I shouldn't say "clever" system, we now know how that ends, but a _good_ system that consists of an enum—which contains the directions a corner may point, and an array of strings—which contain the corresponding image paths for each type of corner. This means that I can simply use the enum as an index for which image to use when setting up that corner's `LCDBitmap`. I know this is some elementary school-level problem solving, but I gotta get at least _one_ concrete win at some point in this blog post...

```c, linenos
// Enum to define what kind of corner this is
typedef enum {
    INNER_TOP_LEFT,
    INNER_TOP_RIGHT,
    INNER_BOTTOM_LEFT,
    INNER_BOTTOM_RIGHT,
} corner_type;

// Array which stores the corresponding bitmap path for each type of corner
const static char *corner_paths [4] = {
    "bitmaps/corner_top_left.png",
    "bitmaps/corner_top_right.png",
    "bitmaps/corner_bottom_left.png",
    "bitmaps/corner_bottom_right.png"
};
// Creates a new corner LCDSprite and assigns the LCDBitmap to the corresponding direction
corner *f_level_corner_create(int x, int y, corner_location dir) {
    corner* c = pdsys->realloc(NULL, sizeof(corner));
    [...]
    LCDBitmap *c_bitmap = loadImageAtPath(pd, corner_paths[dir]);
    LCDSprite *c_sprite = pd->sprite->newSprite();
    pd->sprite->setImage(c_sprite, c_bitmap, kBitmapUnflipped);
    c->sprite = c_sprite;
    [...]
    return c;
}
```

With this much simpler system, all I have to do is run `f_level_corner_create(x, y, corner_type);` to create a new corner of the given type at the given coordinates. Going forward, I'll work on the inner corners, as well as rendering the lines connecting them all together. I'm planning on using `playdate->graphics->drawLine` or `playdate->graphics->drawRect` to draw these connectors—instead of `LCDBitmap`s—since then I don't need to use a whole bunch of them to connect distant corners. I haven't looked into it much yet, but I have to assume this is a more efficient and performant solution.

At some point down the line, I'll start thinking about the draw rect changing as the player moves about the level, since some performance may be gained by culling the drawing of these connectors when outside the viewable area. Another task I'm planning on working on is setting up a system to store level data like these corners inside a single "collection", so that they may be easily stored/loaded and added/removed from the "scene" whenever the player changes levels.

<img src="/img/blogimg/2025-04-20-devlog003_corners.png" loading="lazy" alt="A screenshot from the Playdate emulator showing the ball sprite from the last blog post, plus 2 boxes made up of 8 corners (though with no lines connecting the corner pieces)." style="image-rendering: pixelated;"/>

## Using `global.h` to Handle "Global" Variables

The last takeaway from this blog post comes in the form of `global.h`, a header file which I can use to store the variables that I want all other source files to have access to. One of the issues I had when figuring out how to structure my project was the question of having variables which I want all other source files to have access to. The biggest example of this is the `PlaydateAPI` struct pointer, since any source file that needs to access the Playdate's API (i.e. pretty much all of them so far) needs to be able to access this pointer. At the very beginning, I figured I'd just define these variables in my `main.c` file, and then include that file in the other source files. Almost immediately, I realized this would cause a circular dependency and would not be a viable solution. My workaround for a while was to just include a parameter in the header of every function that needed access to the API, which I could use to pass the `PlaydateAPI` pointer to the function. This was... fine, if rather clunky, but I recently started using a `global.h` file. With my luck I'm sure I'll find some massive drawback with this method at some point down the line, but as of now, I can declare any "global" variables inside it and include it in all the source files that need access to these variables. I can then read/write these variables from anywhere so long as I include my `global.h` file.

The one hiccup I had when implementing this was learning about the difference between _declaring_ and _defining_ a variable. While I'm still having a bit of a hard time wrapping my head around the concept, I eventually figured out that if I _declared_ a variable as `extern const PlaydateAPI* pd` in my header file, I'd need to _define_ it in a source file (such as `main.c`, in this case) by writing `const PlaydateAPI* pd`. Once I finally sorted that out, it's been smooth sailing with this new global system, and the function headers throughout the project are much simpler.

## Conclusion

So it's been a while, and I didn't make a lot of tangible progress, but I think I made the right decision by throwing away a lot of code despite how long I spent writing it. I also don't entirely regret going with this system from the beginning, as I did learn a lot from the mistakes I made when implementing the original inferior project structure. All in all, it's better to make small, meaningful progress than large contributions that will only end up causing more trouble down the line. I'm not foolish enough to once again claim that sailing will be smooth now that I've solved these problems, but I'll definitely have an easier time going forward now that I know how to avoid these pitfalls disguised as cleverness.
