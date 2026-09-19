---
    title: DLSS 5, let's talk about it
    description: Is Neural Rendering overrated or overhated?
    date: 2026-09-19
    categories: [Tech]
    cover: /grace_dlss.jpeg
---

# DLSS 5 - Neural Rendering

Shown at CES 2026 back in March, DLSS 5 was met with serious backlash.

_"Why are we adding AI slop to video games?"_ \
_"Grace looks like a generic NPC now"_ \
_"The model needs two RTX 5090s to run, $8000 btw"_

While some of the criticism is fair, DLSS 5 isn’t “bad”. I want to talk about the model a bit more.

## DLSS 5 Neural Rendering is a misleading name

DLSS stands for “Deep Learning Supersampling”. The acronym doesn’t really make sense for any of the DLSS tools, mainly DLSS Super Resolution (a feature that upscales an image using AI),
but also the extra suite of features added since 2018.

- Frame Generation (2022) - Add an AI-generated frame for each real frame. That’s not “supersampling”.
- Ray Reconstruction (2023) - Reconstructs a game’s rays used for Ray Tracing and applies AI denoising.
- Multi-Frame Generation (2025) - Ditto for frame generation.
- Neural Rendering (2026) - Adding detail to scenes that complement the original art.

None of these features are “supersampling”, and as such, I think they should be decoupled.

DLAA gets its own name but not FG/MFG, RR, and NR.

In my opinion, they should be called DLFG, DLRR, and DLNR.

## Looking uncanny in other video games

Officially, DLSS5 is only supported in **NBA 2K27**.

Modders found the DLL of DLSS and imported it into other games.

Since the .dll was meant for a **basketball** game, the model looks weird in other video games.

Unlike DLSS Super Resolution, it cannot be overridden in the NVIDIA app because it has to be fine-tuned by the developers to preserve artistic intent.

## Performance

In a test by [Hardware Unboxed](https://youtu.be/tXZ-OP6kpLs?t=327) with an RTX 5090 without upscaling, DLSS 5’s NR reduced frames by up to 60%.

That’s a MASSIVE performance dip! Sure, the character models look a bit better, but is it really worth it for that performance loss?

It is worth mentioning that NVIDIA is still optimizing the model. At CES 2026, it required two RTX 5090s, and now, it can run on “one” RTX 5090. It is currently supported on RTX 50 series GPUs, albeit with a high performance loss, and **requires** DLSS SR and FG.

NVIDIA is working to have it work efficiently on RTX 40 series and lower.

## AI Slop

Sure, DLSS5-NR might be generative AI, but it complements the original art, not replaces it. Artists have to tweak DLSS 5 to make it look right, and in doing so, it preserves artistic intent.

It makes the art “AI-assisted”, rather than “AI-generated”.

As such, I don’t think it counts as AI slop.

## My overall opinion

I have mixed opinions on DLSS 5 Neural Rendering. On paper, it makes some character models look nice, but its performance cost even on RTX 50 series currently is way too high to be used for real-world gaming. It’s more of an experimental feature than a stable one.

Of course, one could use Upscaling + Frame Generation to alleviate those issues, but then that causes a potentially perceptible loss of quality in graphics.
