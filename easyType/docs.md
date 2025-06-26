# Algorithm 1

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
- "db" --> "c"

# Algorithm 2

While the previously mentioned method would work for digrams, it would not be sufficient for anything more. Essentially, there should be a better generalization that doesn't involve brute forcing every combination.

I will use a different delimiter-handling method that aims to preserve the x for as long as possible before it would not be needed. Because *n*-grams are under consideration now, more advanced replacement methods must be used.

## Replacing *N*-Grams

Generally, the method to replace *n*-grams will be to consider the replacement of all the inputs before, then append the character. Brackets denote full general replacements.

To derive `processMap`, use a greedy algorithm. Ignore the last character as it is normal.

### Case 1

```
(a -> 1), (bc -> 2), (c -> 3)

input: abc|c
  abc: no
  ab: no
  a: 1
value: 1
  bc: 2
value: 12
final: 12c
```

### Case 2

```
(a -> 1), (c -> 3)

input: abc|a
  abc: no
  ab: no
  a: 1
value: 1
  bc: no
  b: no
value: 1b
  c: 3
value: 1b3
final: 1b3a
```

For most situations, this would be sufficient. However, to add delimiters, it requires more complicated logic. A delimiter case will always be in the form `aXy` where `X` is the delimiter. 

### Case 1

```
(a -> 1), (b -> 2) (bc -> 3), (abc -> 4)

input: a
  replace: a -> 1
  text: 1
input: X
  text: 1X
input: b
  possible 1b.+ combinations:
    1bc -> 4
  discard: no
  replace: b -> 2
  text: 1X2
input: c
  possible 12c.+ combinations:
    no
  discard: yes
  text: 13
```