# gets data
data = open("stylometry/python/data.txt").read()
words = data.split(" ")

try:
  n = int(input("enter n:\n>> "))
except:
  n = 2

# gets ngrams
ngrams = {} # stores ngrams
for word in words: # for each word
  for index in range(len(word) + 1 - n): # number of pairs
    ngram = word[index : index+n] # ngram
    if (ngram in ngrams): # if ngram exists in dict
      ngrams[ngram] += 1 # increment it
    else: # otherwise
      ngrams[ngram] = 1 # make it exist and set it to 1

# turns bigram dict into array and sorts it
ngramArray = []
for ngram in ngrams:
  ngramArray.append([ngram, ngrams[ngram]]) # make the array
ngramArray.sort(key=lambda a: a[1], reverse=True) # reverse sort it by frequency
print(ngramArray)

# human readable top 50
i = 0
for bigram in ngramArray:
  print(bigram[0] + "\t" + str(bigram[1]))
  i += 1
  if (i == 50): break