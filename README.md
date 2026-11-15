# Loop

Stuck on a tricky part of a song? Loop slows it down without changing the pitch and repeats just the bit you choose, so you can practise it until it clicks. It is free, needs no account, and nothing leaves your computer.

## Download (Windows)

1. Go to the [latest release](../../releases/latest).
2. Click **Loop Setup** (the file ending in `.exe`) to download it.
3. Double-click it and follow the installer. Loop then appears in your Start menu.

That is it. No account and no extra software needed.

**Windows says "Windows protected your PC"?** Click **More info**, then **Run anyway**. Small free apps are not code-signed, so Windows warns about them. The full source code is in this repo if you want to check it.

Using a Mac or Linux? Loop is Windows only for now.

## What it does

- **Slow it down without changing the pitch.** Play at anything from 50% to 150% speed and the song still sounds like itself.
- **Loop any section.** Drag across the waveform and that part repeats until you stop it. Drag again to adjust it.
- **Save your loops.** Keep named sections for each song, like "solo" or "bridge", and jump back to them in one click.
- **Plays what you already have.** Works with MP3, WAV, FLAC, OGG, M4A, AAC and Opus. Open a file or just drag it into the window.
- **Guided tour.** A short walkthrough runs the first time you open the app. Click **Tour** at the top to see it again.

## How to use it

1. Click **Open audio**, or drag a song into the window.
2. Drag across the waveform to pick the part you want to practise. It starts looping straight away.
3. Move the **Speed** slider down until you can play along.
4. Click **Save loop** to keep that section. Click it in the list next time to jump straight back in.

Want a longer walkthrough? Read the [tutorial](TUTORIAL.md).

## Practice guide

| You find | What it means | What to do |
|---|---|---|
| The same few bars keep going wrong | The passage is too fast for you right now | Loop just those bars and drop the speed to about 70% |
| Three clean runs in a row | You have got it at this speed | Raise the speed by 5% and repeat |
| The loop feels too long | You are practising more than you need to | Drag a shorter section so the hard part comes round faster |
| You want to come back tomorrow | Your loops are worth keeping | Click Save loop. It is remembered for that song |
| It sounds easy slowly but falls apart at full speed | You are close | Work up in small steps, then play the whole song once |

## Keyboard shortcuts

| Key | Action |
|---|---|
| Space | Play or pause |
| L | Loop on or off |
| S | Save the current loop |
| [ and ] | Slower and faster by 5% |
| Left and Right | Skip 2 seconds |
| Home | Back to the loop start |

## Privacy and safety

- Loop only opens the files you choose. Nothing is uploaded, and it works without an internet connection.
- It never changes your original song files.
- Your saved loops are stored in the app on your computer, under the song's file name.

## Troubleshooting

| Problem | Fix |
|---|---|
| Windows warns about the file | Click More info, then Run anyway. Small free apps are sometimes flagged because they are not code-signed. |
| A song will not open | The file may be damaged or an unusual format. Convert it to MP3 or WAV and try again. |
| No sound | Check your computer volume and that the right speakers or headphones are selected. |
| My saved loops are gone | Loops are stored under the song's file name, so renaming the file starts a new list. |
| A very long song takes a moment to appear | Loop draws the whole waveform when you open it. Give it a few seconds. |
| I want to see the intro tour again | Click **Tour** at the top of the window. |

Found a bug or have an idea? Open an issue on this repo.

## For developers

Run `npm install` then `npm start` to run it from source (Node.js 18 or newer). Publishing a release builds the Windows installer automatically with GitHub Actions.

## Made by

Check out more of my projects at **[averybeuth.xyz](https://averybeuth.xyz)**.

## License

MIT. See the LICENSE file.
