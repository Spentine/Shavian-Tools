# EasyType

EasyType is an input method where people who can type in Latin can easily type in Shavian. Fundamentally, Latin and Shavian have very different character mappings, so a somewhat complex system to convert is needed.

## Conversion System

The chart from Latin to Shavian must be memorized. I will provide it later, but right now I'm just making the specification.

Once the chart from Latin to Shavian has been memorized, to handle two-letter distinguishers, it will work as follows:

- Symbols that require two characters can be written out as such.
  - [*thinking*] "**th**i**ng**ki**ng**" --> "𐑔𐑦𐑙𐑒𐑦𐑙"
  - [*sharing*] "**shAr**i**ng**" --> "𐑖𐑺𐑦𐑙"
- Symbols that must be split use **"x"** as the delimiter.
  - [*payroll*] "p**Axr**ol" --> "𐑐𐑱𐑮𐑴𐑤" ("pArol" --> "𐑐𐑺𐑴𐑤")
  - [*being*] "b**Exi**ng" --> "𐑚𐑰𐑦𐑙" ("bEing" --> "𐑚𐑾𐑙")
- There are no instances where there is an ambiguity between two compounds (ex. [ab]c vs a[bc])