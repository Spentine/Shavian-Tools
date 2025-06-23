# Internal Processing

There should be a `processMap` which actually handles the live conversions to adhere to the README. It will check the previous characters and perform replacements.

To handle compound splitting, there must be additional replacements in action to handle it.

typing example: "axr"
- "a"   --> "𐑨"
- "𐑨x"  --> "ax"
- "axr" --> "𐑨𐑮"

so splitting ("ab" -> "c"), ("a" -> "d"), ("b" -> "e") must contain:
- "ab" --> "c" (given)
- "a" --> "d" (given)
- "dx" --> "ax"
- "axb" --> "de"