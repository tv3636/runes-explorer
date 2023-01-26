import os
import json


for filename in os.listdir('.'):
	if '.json' in filename:
		data = json.load(open(filename))
		newData = {}
		newData['frames'] = {}
		newData['meta'] = data['meta']
		newData['meta']['frameTags'].append(
			{ 'name': 'play-' + filename[:filename.find('.')], 'from': 0, 'to': len(data['frames']), 'direction': 'forward' }
		)

		for frame in data['frames']:
			frameNumber = frame.split()[-1].split('.')[0]

			newData['frames'][frameNumber] = data['frames'][frame]

		newData['frames'][str(len(newData['frames']))] = newData['frames']['0']

		#print(json.dumps(newData, indent=4))

		with open(filename, 'w') as f:
			json.dump(newData, f, indent=4)
