#! /usr/bin/python3
import select, sys, os

f = open('/dev/input/event1', 'rb')

r, w, e = select.select([f], [],[], 5)

if f in r:
	os.read(f.fileno(), 1024)
	sys.exit(1)

