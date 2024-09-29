# This program serves to provide helper functions.

# converts dict to array and sorts it
def sortedArrayize(d): # d = dict
  arr = []
  for item in d:
    arr.append([item, d[item]]) # make the array
  arr.sort(key=lambda a: a[1], reverse=True) # reverse sort it by frequency
  return arr

# prints out array in human readable format
def humanPrint(arr, limit=-1):
  i = 0
  for item in arr:
    print(f"{item[0]}\t{item[1]}")
    i += 1
    if i == limit:
      break