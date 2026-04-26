# Ditch Explorer

An interactive, Windows 98 themed game to teach terminal commands! It follows a storyline where players need to fix a crashed computer system.

## Features
* A terminal where you can type commands to explore the computer
* An interactive desktop with ability to open, close, drag windows across the screen
* 5 unique challenges of increasing difficulty + a final boss battle!
* A built in text editor
* The game automatically saves your progress in the background
* Packed with secret commands and a themed boot sequence
* A certificate of completion at the end

## Tech Stack
A list of the toools used to build New Leaf:
1. ReactJS
    * This is the framework I used to build the entire UI
    * Handles all interactive elements (ex: breathing exercises, calendar)
2. Vite
    * The build tool
3. TypeScript
    * A strict version of JavaScript that catches errors
4. Tailwind CSS
    * A styling library used to design and style the UI 
    * Made it easy to ensure the app remains fully responsive on both mobile phones and desktop screens
5. 98.css
    * A styling library for adding the retro Windows 98 aesthetic to the game
6. React Draggable
    * A library to wrap any item on in a movable container

## Developer Log (for Hack Club's Sleepover event!)
This is an hour by hour log of everything I worked on and when each feature was implemented.

1. Mostly project set up.
    * Set up project repo + boilerplate for my Vite React app
    * Set up README file with the project log
    * Created the Tailwind CSS custom styling palette
    * Installed and configured 98.css library
2.  Designed and coded up the home page main window
        - This part took really long (dependency issues) so I decided to commit the first 2 hours together
    * Set up components for `ErrorModal.tsx`, `Terminal.tsx`, `TypewriterText.tsx`, `Taskbar.tsx`
3. Added custom commands including ls, cd, pwd
    * ls - Lists the contents of the current directory
    * cd - Changes the current directory (including cd .. to go back)
    * Updated the Taskbar with Microsoft logo
    * Planted secret folders and corrupted files needed for challenge #1
4. Finished challenge #1
    * Created dragabble `Window.tsx` component
    * Added a clickable desktop icon that opens up the instructions for the first challenge
    * Created a hint system inside the instructions file
    * Taught the terminal the man command! Players can now look up how different tools work inside the game
5. Finished creating challenge #2
    * Implemented the mkdir and mv commands
    * Built a central state tracker in the main app to monito rterminal activity
        - Game can detect when specific files are deleted or moved and updates the terminal accordingly
    * Created a `SuccessModal.tsx` component that sends a level complete message to indicate when the user has solved the current puzzle
6. Working on challenge #3, almost done but not quite yet
    * Added an About me folder (will fill this in later with project details)
    * Added ping command challenge
        - It was challenging to figure out how to explain this in an intuitive way
    * Updated man pages for the commands to have clearer explanations
7. Finished challenge #3 and #4
    * Fixed level 3 instructions
    * Added cat and login commands to man page
    * Added Logs directory for challenge 4
    * Added bobbing effect for level 1 challenge as an indicator of where to find the instructions
8. Started on challenge #5 (the boss battle!)
    * This is the grand finale of the game so I want it to be big!
    * Mainly created a `MalwareModal.tsx` popup with instructions for the final level
    * Accumulation of all of the commands required
    * Updated props for the terminal
9. Finished implementing boss battle
    * Fixed a loophole in the final boss fight
    * Made it more challenging because incorrect commands cause virus to duplicate
        * Virus will now laugh at them and instantly clone itself
    * Added a way to control exactly where new windows pop up
10. Upgraded boss level virus mechanics
    * If a player makes a mistake and the virus duplicates, no longer lets them win by deleting one file
    * Whenever a window is opened it now pushes itself to the top so that it isn't hidden
    * Fixed level 5 challenge instructions
11. Added music and sound effects
    * Built a `soundEngine` utility to manage mp3 audio
    * Added sound effects:
        1. Retro startup chime upon initializing
        2. Key-clacks during text input
        3. Error sound for incorrect commands
        4. Success chime when a level is solved
12. Created a BIOS bootup animation
    * Created `BootSequence.tsx` component
    * Added the read in animation and switch screen
    * Fixed mv command so that it works backwards as well
        * Ex: Running `mv C:\Downloads` from Downloads\Graphics
13. Created save states and cookies
    * I learned how to use the localstorage API
    * If a player refreshes they will load right back in exactly where they left off
    * Added a reset button to replay the game
14. Added hidden commands (just for fun!) and a mobile browser warning
    * Added 5 secret commands (sudo, whoami, hack, pizza, and format c:)
    * Created blue screen of death warning for mobile windows
15. Text editor feature
    * Added a nano inspired text editor to edit files
    * Users can now write, edit, and save files directly to localStorage
    * via the `edit [filename]` command
16. Created Certificate of Completion
    * Players are prompted via a modal to input their name
    * Added the player's custom name into the localStorage memory
    * Finished designing the favicon
    * Filled in the About window with info
17. Final steps
    * Ran `npm run build` to ensure deployment succeeds
    * Deployed Ditch Explorer on Vercel
    * Finalized the README

---
<div align="center">

### Made with ♡ by Revati Tambe.
</div>