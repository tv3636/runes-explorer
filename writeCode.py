import os

directory = 'public/static/game'
shortNames = []

for filename in os.listdir(directory):
	f = os.path.join(directory, filename)
	# checking if it is a file
	if os.path.isfile(f):
		name = f[f.rfind('/') + 1:]
		shortName = name.replace(' ', '').replace('.png', '')
		shortNames.append(shortName)

		#print('this.load.image("%s", "%s")' % (shortName, name))

print(sorted(shortNames))
