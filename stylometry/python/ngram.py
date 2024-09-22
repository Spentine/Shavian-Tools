# This program will calculate the ngram frequencies in
# the Shavian Read Lexicon.

import util

# get data
data = open("stylometry/python/data.txt").read()
words = data.split(" ")

try:
  n = int(input("enter n:\n>> "))
except:
  n = 2

# get ngrams
ngrams = {} # store ngrams
for word in words: # for each word
  for index in range(len(word) + 1 - n): # number of pairs
    ngram = word[index : index+n] # ngram
    if (ngram in ngrams): # if ngram exists in dict
      ngrams[ngram] += 1 # increment it
    else: # otherwise
      ngrams[ngram] = 1 # make it exist and set it to 1

# turns bigram dict into array and sort it
ngramArray = util.sortedArrayize(ngrams)
print(ngramArray)

# human readable top 50
util.humanPrint(ngramArray, 50)