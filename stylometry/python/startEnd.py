# This program will calculate the frequencies for
# each starting and ending letter.

# This program was made in preparation for a new
# game implemented with Shavian rules; Shiritori.

import util

# get data
data = open("stylometry/data.txt").read()
words = data.split(" ")

starts = {}
ends = {}
for word in words: # for each word
  startChar = word[0]
  endChar = word[-1]
  
  if (startChar in starts):
    starts[startChar] += 1
  else:
    starts[startChar] = 1
  
  if (endChar in ends):
    ends[endChar] += 1
  else:
    ends[endChar] = 1
  
  if (not endChar in starts):
    starts[endChar] = 0
  
  if (not startChar in ends):
    ends[startChar] = 0

startsArray = util.sortedArrayize(starts)
endsArray = util.sortedArrayize(ends)

print("letter\tend\tstart")
for item in endsArray:
  print(f"{item[0]}\t{item[1]}\t{starts[item[0]]}")