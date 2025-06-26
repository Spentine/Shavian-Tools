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

To derive `processMap`, use a greedy algorithm. Ignore the last character as it is normal. Save all of the intermediate values.

### Case 1

```yaml
(a -> 1), (bc -> 2), (c -> 3)

input: abc|c
  abc: no
  ab: no
  a: 1
value: 1|bc|c
  bc: 2
value: 12|c

values:
  - abcc
  - 1bcc
  - 12c
```

### Case 2

```yaml
(a -> 1), (c -> 3)

input: abc|a
  abc: no
  ab: no
  a: 1
value: 1|bc|a
  bc: no
  b: no
value: 1b|c|a
  c: 3
value: 1b3|a
final: 1b3a

values:
  - abca
  - 1bca
  - 1b3a
```

For most situations, this would be sufficient. However, to add delimiters, it requires more complicated logic. A delimiter case will always be in the form `aXy` where `X` is the delimiter. The delimiter should be discarded when it is known that there are no more possible combinations.

### Case 1

```yaml
(a -> 1), (b -> 2), (bc -> 3), (abc -> 4)

input: a
  replace: a -> 1
  text: 1
input: X
  text: 1X
input: b
  replace: b -> 2
  possible 12.+ combinations:
    12c -> 4
  discard: no
  text: 1X2
input: c
  replace: 2c -> 3
  possible 13.+ combinations:
    no
  discard: yes
  text: 13
```

### Case 2

In the second case, there should be a *delimiter discard* character. I'll use the character `Q`. To type `a1`, there must not be ambiguity. When `aXbc` is typed, the delimiter cannot be known to be removed or not because the user may also type `d` afterwards. For most cases, `Q` does not need to be typed until the very end.

```yaml
(bc -> 1), (abcd -> 2)

input: a
  replace: no
  text: a
input: X
  text: aX
input: b
  replace: no
  possible ab.+ combinations:
    abcd -> 2
  discard: no
  text: aXb
input: c
  replace: bc -> 1
  possible a1.+ combinations:
    a1d -> 2
  discard: no
  text: aX2
input: Q
  text: a2 # discard previous X
```